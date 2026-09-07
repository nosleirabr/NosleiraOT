// QA Playwright — modo editor do map viewer
//
// Pré-requisitos: viewer-data (com items.json + palette) + HTTP.
//   .\tools\map-editor\launch-map-viewer.ps1 -Quick -NoBrowser
//
//   node tools\map-editor\viewer\qa-editor.mjs

import { createServer } from "http";
import { createReadStream, existsSync, statSync, writeFileSync, readFileSync, copyFileSync } from "fs";
import { extname, join, normalize, resolve } from "path";
import { spawnSync } from "child_process";
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import { dirname } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..", "..", "..");
const viewerDir = process.env.OT74_VIEWER_DIR
  || resolve(repo, "maps", "build", "viewer");
const port = Number(process.env.OT74_VIEWER_PORT || 8767);
const base = process.env.OT74_VIEWER_URL || `http://127.0.0.1:${port}/`;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

const samples = {
  grass: 106,
  wall: 1026,
  door: 1209,
  chest: 1740,
  bag: 1987,
  gold: 2148,
  teleport: 1387
};

function fail(msg) {
  throw new Error(msg);
}

function syncViewerShell() {
  for (const name of ["index.html", "editor.js", "viewer.js", "viewer.css"]) {
    const src = join(here, name);
    if (existsSync(src) && existsSync(viewerDir)) {
      copyFileSync(src, join(viewerDir, name));
    }
  }
}

function otmapDll() {
  return resolve(repo, "tools", "map-editor", "Ot74.Map.Cli", "bin", "Debug", "net10.0", "otmap.dll");
}

function persistViewerSave(payloadPath) {
  const dll = otmapDll();
  if (!existsSync(dll)) {
    return { ok: false, error: `otmap.dll missing: ${dll}` };
  }
  const result = spawnSync("dotnet", [
    "exec", dll, "viewer-save",
    "--in", payloadPath,
    "--viewer", viewerDir,
    "--sectors", "none",
    "--spawn", "none"
  ], { encoding: "utf8", cwd: repo, windowsHide: true });
  if (result.status !== 0) {
    return { ok: false, error: (result.stderr || result.stdout || "viewer-save failed").trim() };
  }
  return { ok: true, log: (result.stdout || "").trim() };
}

function findSavedTile(x, y, z) {
  const tilesPath = join(viewerDir, "tiles.json");
  if (existsSync(tilesPath)) {
    const doc = JSON.parse(readFileSync(tilesPath, "utf8"));
    const hit = (doc.tiles || []).find((t) => t.at?.[0] === x && t.at?.[1] === y && (t.at?.[2] ?? 7) === z);
    if (hit) return { file: "tiles.json", tile: hit };
  }
  const size = 256;
  const sx = Math.floor(x / size) * size;
  const sy = Math.floor(y / size) * size;
  const key = `${z}_${sx}_${sy}`;
  const sectorPath = join(viewerDir, "sectors", `${key}.json`);
  if (existsSync(sectorPath)) {
    const doc = JSON.parse(readFileSync(sectorPath, "utf8"));
    const hit = (doc.tiles || []).find((t) => t.at?.[0] === x && t.at?.[1] === y && (t.at?.[2] ?? 7) === z);
    if (hit) return { file: `sectors/${key}.json`, tile: hit };
  }
  return null;
}

function startStaticServer() {
  if (process.env.OT74_VIEWER_URL) return null;
  syncViewerShell();
  if (!existsSync(join(viewerDir, "index.html"))) {
    fail(`Viewer shell missing in ${viewerDir}. Run viewer-data or launch-map-viewer.ps1.`);
  }
  if (!existsSync(join(viewerDir, "items.json"))) {
    fail(`items.json missing in ${viewerDir}. Regen: otmap viewer-data --region ...`);
  }

  const root = resolve(viewerDir);
  const server = createServer((req, res) => {
    let rel = decodeURIComponent((req.url || "/").split("?")[0]);
    if (req.method === "POST" && rel === "/api/save") {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        const payloadPath = join(root, "last-save.json");
        writeFileSync(payloadPath, body);
        const persisted = persistViewerSave(payloadPath);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        if (!persisted.ok) {
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, error: persisted.error }));
          return;
        }
        res.end(JSON.stringify({ ok: true, ...persisted }));
      });
      return;
    }
    if (rel === "/") rel = "/index.html";
    const path = normalize(join(root, rel));
    if (!path.startsWith(root) || !existsSync(path) || statSync(path).isDirectory()) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", mime[extname(path)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    createReadStream(path).pipe(res);
  });
  return new Promise((resolvePromise) => {
    server.listen(port, "127.0.0.1", () => resolvePromise(server));
  });
}

async function main() {
  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const failures = [];

  try {
    await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60000 });
    const ready = await page.evaluate(async () => {
      const v = window.__otMapViewer;
      if (!v) return false;
      return await v.ready(90000);
    });
    if (!ready) fail("viewer ready() timed out");

    const catalogReady = await page.evaluate(() => {
      const st = window.__otMapViewer.getState();
      return (st.catalog?.items?.length || 0) > 100;
    });
    if (!catalogReady) fail("items.json catalog not loaded — regen viewer-data");

    if (!(await page.locator("#palettePane").isVisible())) {
      failures.push("palette pane should be visible without an Edit button");
    }
    if (await page.locator("#modeNav").count()) failures.push("mode bar Navegar should be gone");
    if (await page.locator("#modeEdit").count()) failures.push("mode bar Editar should be gone");
    if (await page.locator("#btnRemove").count()) failures.push("Remover button should be gone (use Delete)");
    if (!(await page.locator("#btnAddSpawn").isVisible())) {
      failures.push("Novo spawn button missing");
    }
    await page.keyboard.press("Control+f");
    const gotoFocused = await page.evaluate(() => document.activeElement?.id === "gotoPos");
    if (!gotoFocused) failures.push("Ctrl+F should focus the Pos field");
    await page.locator("#view").click();
    console.log("OK always-on editor", { gotoFocused });

    await page.fill("#paletteSearch", "");
    const groupCounts = await page.evaluate(() => {
      const ed = window.__otMapEditor;
      ed.setGroup("walls");
      const walls = ed.filteredCount();
      ed.setGroup("doors");
      const doors = ed.filteredCount();
      ed.setGroup("containers");
      const containers = ed.filteredCount();
      ed.setGroup("ground");
      const ground = ed.filteredCount();
      ed.setGroup("all");
      return { walls, doors, containers, ground, all: ed.filteredCount() };
    });
    if (groupCounts.walls < 10) failures.push(`palette walls too small: ${groupCounts.walls}`);
    if (groupCounts.doors < 5) failures.push(`palette doors too small: ${groupCounts.doors}`);
    if (groupCounts.containers < 5) failures.push(`palette containers too small: ${groupCounts.containers}`);
    if (groupCounts.ground < 5) failures.push(`palette ground too small: ${groupCounts.ground}`);
    if (groupCounts.all <= groupCounts.walls) failures.push("palette all should be larger than walls");
    console.log("OK palette groups", groupCounts);

    const crisp = await page.evaluate(() => {
      const canvas = document.getElementById("view");
      const ctx = canvas.getContext("2d");
      return {
        smoothing: ctx.imageSmoothingEnabled,
        css: getComputedStyle(canvas).imageRendering
      };
    });
    if (crisp.smoothing) failures.push("canvas imageSmoothingEnabled should be false for pixel art");
    else console.log("OK pixelated draw", crisp);

    // Scroll/zoom no mapa (roda do rato sobre o canvas).
    await page.evaluate(() => window.__otMapViewer.centerOn(32369, 32215, 32));
    await page.locator("#view").hover();
    const zoomBefore = await page.evaluate(() => window.__otMapViewer.getState().scale);
    await page.mouse.wheel(0, -120);
    const zoomAfterIn = await page.evaluate(() => window.__otMapViewer.getState().scale);
    await page.mouse.wheel(0, 240);
    const zoomAfterOut = await page.evaluate(() => window.__otMapViewer.getState().scale);
    if (!(zoomAfterIn > zoomBefore)) {
      failures.push(`wheel zoom in failed: ${zoomBefore} -> ${zoomAfterIn}`);
    } else if (!(zoomAfterOut < zoomAfterIn)) {
      failures.push(`wheel zoom out failed: ${zoomAfterIn} -> ${zoomAfterOut}`);
    } else {
      console.log("OK wheel zoom", { zoomBefore, zoomAfterIn, zoomAfterOut });
    }

    // Scroll da paleta (lista virtual).
    await page.fill("#paletteSearch", "");
    await page.evaluate(() => window.__otMapEditor.setGroup("all"));
    const palScroll = await page.evaluate(() => {
      const el = document.getElementById("paletteScroller");
      const before = el.scrollTop;
      el.scrollTop = 800;
      return { before, after: el.scrollTop, height: el.scrollHeight, client: el.clientHeight };
    });
    if (palScroll.after <= palScroll.before) {
      failures.push(`palette scroller did not move: ${JSON.stringify(palScroll)}`);
    } else {
      console.log("OK palette scroll", palScroll);
    }

    // Clique preciso: centro visual de um tile conhecido.
    const precise = await page.evaluate(() => {
      const v = window.__otMapViewer;
      const ed = window.__otMapEditor;
      const tx = 32369;
      const ty = 32216;
      const tz = 7;
      v.setFloor(tz);
      v.centerOn(tx, ty, 32);
      ed.setMode(true);
      ed.setBrush(null);
      const screen = v.worldToScreen(tx, ty);
      const scale = v.getState().scale;
      const canvas = document.getElementById("view");
      const rect = canvas.getBoundingClientRect();
      const clientX = rect.left + (screen.px + scale / 2) * (rect.width / canvas.clientWidth);
      const clientY = rect.top + (screen.py + scale / 2) * (rect.height / canvas.clientHeight);
      const mapped = v.worldFromEvent(clientX, clientY);
      return { tx, ty, mapped, clientX, clientY, scale };
    });
    if (precise.mapped.x !== precise.tx || precise.mapped.y !== precise.ty) {
      failures.push(`worldFromEvent miss: expected ${precise.tx},${precise.ty} got ${precise.mapped.x},${precise.mapped.y}`);
    }
    const picked = await page.evaluate(({ clientX, clientY }) => (
      window.__otMapViewer.pickWorldAt(clientX, clientY)
    ), precise);
    if (picked.x !== precise.tx || picked.y !== precise.ty) {
      failures.push(`pickWorldAt miss: ${JSON.stringify(picked)}`);
    }
    await page.mouse.click(precise.clientX, precise.clientY);
    const afterPrecise = await page.evaluate(() => {
      const sel = window.__otMapEditor.selected();
      return { x: sel?.x, y: sel?.y, id: sel?.item?.id };
    });
    if (afterPrecise.x !== precise.tx || afterPrecise.y !== precise.ty) {
      failures.push(`precise click selected ${afterPrecise.x},${afterPrecise.y} expected ${precise.tx},${precise.ty}`);
    } else {
      console.log("OK precise click", { precise, afterPrecise });
    }
    const cam = await page.evaluate(() => {
      const canvas = document.getElementById("view");
      const st = window.__otMapViewer.getState();
      const before = {
        x: Math.floor((canvas.clientWidth / 2 - st.x) / st.scale),
        y: Math.floor((canvas.clientHeight / 2 - st.y) / st.scale)
      };
      window.__otMapEditor.setMode();
      const st2 = window.__otMapViewer.getState();
      const after = {
        x: Math.floor((canvas.clientWidth / 2 - st2.x) / st2.scale),
        y: Math.floor((canvas.clientHeight / 2 - st2.y) / st2.scale)
      };
      return { before, after, palette: !document.getElementById("palettePane").hidden };
    });
    if (!cam.palette) failures.push("palette should stay visible");
    if (Math.abs(cam.before.x - cam.after.x) > 1 || Math.abs(cam.before.y - cam.after.y) > 1) {
      failures.push(`editor relayout jumped camera: ${JSON.stringify(cam)}`);
    } else {
      console.log("OK editor camera stable", cam);
    }

    // Clique na paleta + canvas: coloca grass no tile sob o centro do canvas.
    await page.locator("#paletteGroup").selectOption("ground");
    await page.fill("#paletteSearch", String(samples.grass));
    await page.locator(`.palette-row[data-id="${samples.grass}"]`).click({ timeout: 5000 });
    await page.evaluate(() => {
      window.__otMapViewer.setFloor(7);
      window.__otMapViewer.centerOn(32369, 32215, 32);
    });
    await page.locator("#view").click();
    await page.evaluate(() => window.__otMapEditor.clickCanvasCenter());
    const uiDebug = await page.evaluate(() => {
      const st = window.__otMapViewer.getState();
      const canvas = document.getElementById("view");
      const wx = Math.floor((canvas.clientWidth / 2 - st.x) / st.scale);
      const wy = Math.floor((canvas.clientHeight / 2 - st.y) / st.scale);
      const wz = Number(document.getElementById("floor").value) || 7;
      return {
        brush: window.__otMapEditor.getBrush(),
        editor: st.editorMode,
        wx,
        wy,
        wz,
        ids: (window.__otMapViewer.getTile(wx, wy, wz)?.items || []).map((it) => it.id)
      };
    });
    if (!uiDebug.ids.includes(samples.grass)) {
      failures.push(`UI click did not place grass at ${uiDebug.wx},${uiDebug.wy},${uiDebug.wz}: ${JSON.stringify(uiDebug)}`);
    } else {
      console.log("OK UI palette+canvas place", uiDebug);

    // Ctrl+clique não pinta; clique normal pinta.
    const panTile = await page.evaluate(({ grass }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      const x = 31811;
      const y = 31811;
      const z = 7;
      v.setFloor(z);
      v.centerOn(x, y, 32);
      ed.setBrush(grass);
      const canvas = document.getElementById("view");
      const rect = canvas.getBoundingClientRect();
      const fake = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        button: 0,
        pointerId: 1,
        ctrlKey: true
      };
      ed.handlePointerDown(fake);
      ed.handlePointerUp(fake);
      const afterCtrl = (v.getTile(x, y, z)?.items || []).map((it) => it.id);
      ed.clickCanvasCenter();
      const afterClick = (v.getTile(x, y, z)?.items || []).map((it) => it.id);
      return { x, y, z, afterCtrl, afterClick, before: afterCtrl };
    }, { grass: samples.grass });
    if (panTile.afterCtrl.includes(samples.grass)) {
      failures.push(`Ctrl+click must not place grass: ${JSON.stringify(panTile)}`);
    } else if (!panTile.afterClick.includes(samples.grass)) {
      failures.push(`click without Ctrl should place grass: ${JSON.stringify(panTile)}`);
    } else {
      console.log("OK Ctrl+click pans, click places", panTile);
    }

    // Ctrl+clique não pode deixar o pan preso ao rato.
    const stuckPan = await page.evaluate(() => {
      const v = window.__otMapViewer;
      const ed = window.__otMapEditor;
      ed.setBrush(null);
      v.centerOn(32369, 32215, 32);
      const canvas = document.getElementById("view");
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const fire = (type, x, y, ctrl, buttons) => {
        canvas.dispatchEvent(new PointerEvent(type, {
          bubbles: true,
          clientX: x,
          clientY: y,
          button: 0,
          buttons,
          pointerId: 1,
          ctrlKey: ctrl
        }));
      };
      fire("pointerdown", cx, cy, true, 1);
      fire("pointerup", cx, cy, true, 0);
      const afterUp = { dragging: v.getState().dragging, x: v.getState().x, y: v.getState().y };
      fire("pointermove", cx + 90, cy + 50, false, 0);
      const afterMove = { dragging: v.getState().dragging, x: v.getState().x, y: v.getState().y };
      ed.selectAt(32369, 32216, 7);
      const hadSel = !!ed.selected()?.item;
      ed.handleKeyDown({ key: "Escape", preventDefault() {} });
      const afterEsc = ed.selected();
      return { afterUp, afterMove, hadSel, afterEsc };
    });
    if (stuckPan.afterUp.dragging) {
      failures.push(`Ctrl+click left camera dragging: ${JSON.stringify(stuckPan.afterUp)}`);
    }
    if (Math.abs(stuckPan.afterMove.x - stuckPan.afterUp.x) > 1
      || Math.abs(stuckPan.afterMove.y - stuckPan.afterUp.y) > 1) {
      failures.push(`camera followed mouse after Ctrl+click: ${JSON.stringify(stuckPan)}`);
    }
    if (!stuckPan.hadSel) failures.push("selectAt before Esc should have an item");
    if (stuckPan.afterEsc) {
      failures.push(`Esc should clear selection, got ${JSON.stringify(stuckPan.afterEsc)}`);
    } else {
      console.log("OK Ctrl+click does not stick pan; Esc deselects", stuckPan);
    }
    }
    await page.fill("#paletteSearch", "");
    await page.evaluate(() => window.__otMapEditor.setGroup("all"));

    const TX = 32000;
    const TY = 32000;
    const TZ = 7;

    // Ground + item em cima (parede).
    const stack = await page.evaluate(async ({ x, y, z, grass, wall }) => {
      const v = window.__otMapViewer;
      const ed = window.__otMapEditor;
      v.setFloor(z);
      v.centerOn(x, y, 24);
      ed.setBrush(grass);
      ed.placeAt(x, y, z);
      ed.setBrush(wall);
      ed.placeAt(x, y, z);
      const tile = v.getTile(x, y, z);
      return (tile?.items || []).map((it) => it.id);
    }, { x: TX, y: TY, z: TZ, grass: samples.grass, wall: samples.wall });
    if (stack[0] !== samples.grass) failures.push(`ground should be bottom, got ${JSON.stringify(stack)}`);
    if (stack[1] !== samples.wall) failures.push(`wall should be on top of ground, got ${JSON.stringify(stack)}`);
    console.log("OK ground+wall stack", stack);

    // Clique na pilha seleciona SÓ o item do topo (não o ground nem o meio).
    const topSel = await page.evaluate(({ x, y, z, door }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      ed.setBrush(door);
      ed.placeAt(x, y, z);
      ed.setBrush(null);
      const ref = ed.selectAt(x, y, z);
      ed.editField("aid", "99");
      const tile = v.getTile(x, y, z);
      const selectedCount = document.querySelectorAll(".stack-item.selected").length;
      return {
        path: ref?.path,
        selectedId: ref?.item?.id,
        ids: (tile?.items || []).map((it) => it.id),
        aids: (tile?.items || []).map((it) => it.aid ?? null),
        selectedCount,
        heading: document.querySelector("#props .prop-section:nth-of-type(3) h3")?.textContent || ""
      };
    }, { x: TX, y: TY, z: TZ, door: samples.door });
    if (topSel.ids.length !== 3) failures.push(`stack should have 3 items, got ${JSON.stringify(topSel.ids)}`);
    if (topSel.selectedId !== samples.door) failures.push(`selected should be top door, got ${topSel.selectedId}`);
    if (JSON.stringify(topSel.path) !== "[2]") failures.push(`selected path should be [2] (top), got ${JSON.stringify(topSel.path)}`);
    if (topSel.selectedCount !== 1) failures.push(`exactly one stack row selected, got ${topSel.selectedCount}`);
    if (topSel.aids[0] != null || topSel.aids[1] != null) {
      failures.push(`editing top must not change lower items, aids=${JSON.stringify(topSel.aids)}`);
    }
    if (topSel.aids[2] !== 99) failures.push(`top door aid should be 99, got ${topSel.aids[2]}`);
    console.log("OK stack selects top only", topSel);

    await page.evaluate(() => window.__otMapEditor.setBrush(null));
    await page.evaluate(({ x, y, z }) => {
      window.__otMapViewer.setFloor(z);
      window.__otMapViewer.centerOn(x, y, 32);
    }, { x: TX, y: TY, z: TZ });
    await page.locator("#view").click();
    await page.evaluate(() => window.__otMapEditor.clickCanvasCenter());
    const clickSel = await page.evaluate(() => {
      const ref = window.__otMapEditor.selected();
      return { id: ref?.item?.id, path: ref?.path, stackLen: ref?.tile?.items?.length };
    });
    if (clickSel.id !== samples.door) {
      failures.push(`canvas click on stack should select top door, got ${JSON.stringify(clickSel)}`);
    } else {
      console.log("OK canvas click selects top of stack", clickSel);

    // Delete apaga só o topo; o ground fica.
    await page.keyboard.press("Delete");
    const afterRemove = await page.evaluate(({ x, y, z }) => {
      const tile = window.__otMapViewer.getTile(x, y, z);
      const ref = window.__otMapEditor.selected();
      return {
        ids: (tile?.items || []).map((it) => it.id),
        selectedId: ref?.item?.id
      };
    }, { x: TX, y: TY, z: TZ });
    if (afterRemove.ids.includes(samples.door)) {
      failures.push(`Remover should drop top door, got ${JSON.stringify(afterRemove)}`);
    }
    if (!afterRemove.ids.includes(samples.grass) || !afterRemove.ids.includes(samples.wall)) {
      failures.push(`Remover must keep lower stack items: ${JSON.stringify(afterRemove)}`);
    }
    if (afterRemove.selectedId !== samples.wall) {
      failures.push(`after Remover, selection should be new top (wall), got ${afterRemove.selectedId}`);
    }
    console.log("OK Remover top of stack", afterRemove);
    }

    // Variedade: door, teleport, bag.
    const variety = await page.evaluate(({ x, y, z, door, teleport, bag }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      ed.setBrush(door);
      ed.placeAt(x, y + 1, z);
      ed.setBrush(teleport);
      ed.placeAt(x + 1, y, z);
      ed.setBrush(bag);
      ed.placeAt(x + 1, y + 1, z);
      return {
        door: v.getTile(x, y + 1, z)?.items?.map((it) => it.id),
        teleport: v.getTile(x + 1, y, z)?.items?.map((it) => it.id),
        bag: v.getTile(x + 1, y + 1, z)?.items?.map((it) => it.id)
      };
    }, { x: TX, y: TY, z: TZ, ...samples });
    if (!variety.door?.includes(samples.door)) failures.push(`door not placed: ${JSON.stringify(variety.door)}`);
    if (!variety.teleport?.includes(samples.teleport)) failures.push(`teleport not placed: ${JSON.stringify(variety.teleport)}`);
    if (!variety.bag?.includes(samples.bag)) failures.push(`bag not placed: ${JSON.stringify(variety.bag)}`);
    console.log("OK variety", variety);

    // Edição de campos do item (aid/uid/dest).
    const edited = await page.evaluate(({ x, y, z, door }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      ed.selectAt(x, y + 1, z, [0]);
      ed.editField("aid", "5010");
      ed.editField("uid", "10016");
      ed.editField("dest", "32369 32215 7");
      const item = v.getTile(x, y + 1, z)?.items?.[0];
      return { id: item?.id, aid: item?.aid, uid: item?.uid, dest: item?.dest, expectedId: door };
    }, { x: TX, y: TY, z: TZ, door: samples.door });
    if (edited.id !== samples.door) failures.push(`edit target id ${edited.id}`);
    if (edited.aid !== 5010) failures.push(`aid edit failed: ${edited.aid}`);
    if (edited.uid !== 10016) failures.push(`uid edit failed: ${edited.uid}`);
    if (!Array.isArray(edited.dest) || edited.dest[0] !== 32369) {
      failures.push(`dest edit failed: ${JSON.stringify(edited.dest)}`);
    }
    console.log("OK item edit", edited);

    // Edição pelo formulário da UI (change no input aid).
    await page.evaluate(({ x, y, z }) => window.__otMapEditor.selectAt(x, y + 1, z, [0]), {
      x: TX, y: TY, z: TZ
    });
    const aidInput = page.locator('#props [data-field="aid"]');
    await aidInput.fill("7777");
    await aidInput.blur();
    const aidFromUi = await page.evaluate(({ x, y, z }) => (
      window.__otMapViewer.getTile(x, y + 1, z)?.items?.[0]?.aid
    ), { x: TX, y: TY, z: TZ });
    if (aidFromUi !== 7777) failures.push(`UI aid field edit failed: ${aidFromUi}`);
    else console.log("OK UI property field aid=7777");

    // Editor de container: baú + gold coin dentro.
    const container = await page.evaluate(({ x, y, z, chest, gold }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      const cx = x + 2;
      const cy = y + 2;
      ed.setBrush(chest);
      ed.placeAt(cx, cy, z);
      ed.selectAt(cx, cy, z, [0]);
      const opened = ed.openSelectedContainer();
      ed.setBrush(gold);
      ed.placeInSelectedContainer();
      const tile = v.getTile(cx, cy, z);
      const box = tile?.items?.[0];
      return {
        opened,
        windows: ed.windowCount(),
        chestId: box?.id,
        contents: (box?.contents || []).map((it) => it.id)
      };
    }, { x: TX, y: TY, z: TZ, chest: samples.chest, gold: samples.gold });
    if (!container.opened) failures.push("container window did not open");
    if (container.windows < 1) failures.push("container window count is 0");
    if (container.chestId !== samples.chest) failures.push(`chest id ${container.chestId}`);
    if (!container.contents.includes(samples.gold)) {
      failures.push(`gold missing in chest: ${JSON.stringify(container.contents)}`);
    }
    console.log("OK container editor", container);

    // Clique num slot vazio da última janela (evita overlap com backpack).
    await page.evaluate(({ x, y, z, chest, gold }) => {
      const ed = window.__otMapEditor;
      ed.setBrush(chest);
      ed.placeAt(x + 5, y + 5, z);
      ed.selectAt(x + 5, y + 5, z, [0]);
      ed.openSelectedContainer();
      ed.setBrush(gold);
    }, { x: TX, y: TY, z: TZ, chest: samples.chest, gold: samples.gold });
    await page.locator(".container-win").last().locator(".container-slot.empty").first().click({ force: true });
    const afterClick = await page.evaluate(({ x, y, z }) => {
      const box = window.__otMapViewer.getTile(x + 5, y + 5, z)?.items?.[0];
      return (box?.contents || []).map((it) => it.id);
    }, { x: TX, y: TY, z: TZ });
    if (!afterClick.includes(samples.gold)) {
      failures.push(`UI container slot click missing gold: ${JSON.stringify(afterClick)}`);
    } else {
      console.log("OK UI container slot click", afterClick);
    }

    // Copy / paste / undo de SQM.
    const clip = await page.evaluate(({ grass }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      const x = 32120;
      const y = 32120;
      const z = 7;
      v.setFloor(z);
      v.centerOn(x, y, 32);
      ed.setBrush(grass);
      ed.placeAt(x, y, z);
      ed.setBrush(null);
      ed.selectAt(x, y, z);
      ed.copySelection();
      ed.pasteAt(x + 1, y, z);
      const afterPaste = {
        src: (v.getTile(x, y, z)?.items || []).map((it) => it.id),
        dst: (v.getTile(x + 1, y, z)?.items || []).map((it) => it.id)
      };
      ed.undo();
      const afterUndo = {
        src: (v.getTile(x, y, z)?.items || []).map((it) => it.id),
        dst: (v.getTile(x + 1, y, z)?.items || []).map((it) => it.id)
      };
      return { afterPaste, afterUndo };
    }, { grass: samples.grass });
    if (!clip.afterPaste.src.includes(samples.grass) || !clip.afterPaste.dst.includes(samples.grass)) {
      failures.push(`copy/paste should duplicate grass: ${JSON.stringify(clip.afterPaste)}`);
    }
    if (clip.afterUndo.dst.includes(samples.grass)) {
      failures.push(`undo should restore dest tile: ${JSON.stringify(clip.afterUndo)}`);
    } else {
      console.log("OK copy/paste/undo", clip);
    }

    // Arrasto de item: origem não some ao voltar; ghost não fica preso.
    const dragMeta = await page.evaluate(({ grass, wall }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      const x = 32140;
      const y = 32140;
      const z = 7;
      v.setFloor(z);
      v.centerOn(x, y, 32);
      ed.setBrush(grass);
      ed.placeAt(x, y, z);
      ed.setBrush(wall);
      ed.placeAt(x, y, z);
      ed.setBrush(null);
      const scale = v.getState().scale;
      const canvas = document.getElementById("view");
      const rect = canvas.getBoundingClientRect();
      const toClient = (tx, ty) => {
        const p = v.worldToScreen(tx, ty);
        return {
          x: rect.left + (p.px + scale / 2) * (rect.width / canvas.clientWidth),
          y: rect.top + (p.py + scale / 2) * (rect.height / canvas.clientHeight)
        };
      };
      return { x, y, z, from: toClient(x, y), to: toClient(x + 1, y) };
    }, { grass: samples.grass, wall: samples.wall });
    await page.mouse.move(dragMeta.from.x, dragMeta.from.y);
    await page.mouse.down();
    await page.mouse.move(dragMeta.to.x, dragMeta.to.y, { steps: 12 });
    await page.mouse.up();
    const afterDrag = await page.evaluate(({ x, y, z }) => {
      const v = window.__otMapViewer;
      return {
        src: (v.getTile(x, y, z)?.items || []).map((it) => it.id),
        dst: (v.getTile(x + 1, y, z)?.items || []).map((it) => it.id),
        ghost: v.getState().dragGhost
      };
    }, dragMeta);
    if (!afterDrag.src.includes(samples.grass) || afterDrag.src.includes(samples.wall)) {
      failures.push(`drag should leave grass and move wall: ${JSON.stringify(afterDrag)}`);
    }
    if (!afterDrag.dst.includes(samples.wall)) {
      failures.push(`drag dest missing wall: ${JSON.stringify(afterDrag)}`);
    }
    if (afterDrag.ghost) failures.push(`drag ghost should clear after drop: ${JSON.stringify(afterDrag.ghost)}`);
    await page.mouse.move(dragMeta.from.x, dragMeta.from.y, { steps: 8 });
    const afterHover = await page.evaluate(({ x, y, z }) => {
      const v = window.__otMapViewer;
      return {
        src: (v.getTile(x, y, z)?.items || []).map((it) => it.id),
        dst: (v.getTile(x + 1, y, z)?.items || []).map((it) => it.id),
        ghost: v.getState().dragGhost
      };
    }, dragMeta);
    if (JSON.stringify(afterHover.src) !== JSON.stringify(afterDrag.src)
      || JSON.stringify(afterHover.dst) !== JSON.stringify(afterDrag.dst)) {
      failures.push(`hover after drop must not move tiles: ${JSON.stringify({ afterDrag, afterHover })}`);
    }
    await page.mouse.move(dragMeta.to.x, dragMeta.to.y);
    await page.mouse.down();
    await page.mouse.move(dragMeta.from.x, dragMeta.from.y, { steps: 12 });
    await page.mouse.up();
    const back = await page.evaluate(({ x, y, z }) => {
      const v = window.__otMapViewer;
      return {
        src: (v.getTile(x, y, z)?.items || []).map((it) => it.id),
        dst: (v.getTile(x + 1, y, z)?.items || []).map((it) => it.id)
      };
    }, dragMeta);
    if (!back.src.includes(samples.wall) || !back.src.includes(samples.grass)) {
      failures.push(`drag back should restore source stack: ${JSON.stringify(back)}`);
    } else {
      console.log("OK item drag roundtrip", { afterDrag, back });
    }

    // Spawn: adicionar monster e arrastar a posição.
    const spawn = await page.evaluate(() => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      const x = 32160;
      const y = 32160;
      const z = 7;
      v.setFloor(z);
      v.centerOn(x, y, 32);
      ed.addCreatureAt(x, y, z, { name: "Rat", kind: "monster" });
      const hit = v.pickCreatureAt(x, y, z);
      v.moveCreature(hit, x + 1, y, z);
      const moved = v.pickCreatureAt(x + 1, y, z);
      const left = v.pickCreatureAt(x, y, z);
      return {
        placed: !!hit,
        movedName: moved?.creature?.name,
        movedAt: moved?.creature?.at,
        leftBehind: !!left
      };
    });
    if (!spawn.placed) failures.push("addCreatureAt did not place Rat");
    if (spawn.movedName !== "Rat" || spawn.movedAt?.[0] !== 32161) {
      failures.push(`moveCreature failed: ${JSON.stringify(spawn)}`);
    }
    if (spawn.leftBehind) failures.push("monster should leave the old SQM after move");
    else console.log("OK spawn add+move", spawn);

    // Goto posição com espaços.
    const went = await page.evaluate(() => window.__otMapViewer.goToPosition("32369 32215 7"));
    if (!went) failures.push("goToPosition rejected '32369 32215 7'");
    await page.fill("#gotoPos", "32369 32241 7");
    await page.click("#gotoBtn");
    const gotoZ = await page.locator("#floor").inputValue();
    if (gotoZ !== "7") failures.push(`UI goto floor expected 7 got ${gotoZ}`);
    console.log("OK goto position (API + UI)");

    const saveX = 32370;
    const saveY = 32217;
    const saveZ = 7;
    const saveFlow = await page.evaluate(({ wall, x, y, z }) => {
      const ed = window.__otMapEditor;
      const v = window.__otMapViewer;
      v.setFloor(z);
      v.centerOn(x, y, 32);
      const before = (v.getTile(x, y, z)?.items || []).map((it) => it.id);
      ed.setBrush(wall);
      ed.placeAt(x, y, z);
      ed.setBrush(null);
      const after = (v.getTile(x, y, z)?.items || []).map((it) => it.id);
      return { afterPlace: ed.isDirty(), before, after, payload: ed.collectTileEdits() };
    }, { wall: samples.wall, x: saveX, y: saveY, z: saveZ });
    if (!saveFlow.afterPlace) failures.push("placing an item should mark dirty");
    if (!saveFlow.after.includes(samples.wall)) {
      failures.push(`placeAt did not stack wall 1026: ${JSON.stringify(saveFlow)}`);
    }
    if (await page.locator("#btnSave").isDisabled()) {
      failures.push("Salvar should enable after an edit");
    }
    await page.click("#btnSave");
    await page.waitForFunction(() => document.getElementById("btnSave")?.disabled === true, null, { timeout: 20000 });
    const lastSavePath = join(viewerDir, "last-save.json");
    if (!existsSync(lastSavePath)) {
      failures.push("POST /api/save did not write last-save.json");
    } else {
      const dumped = JSON.parse(readFileSync(lastSavePath, "utf8"));
      const hit = (dumped.tiles || []).find((t) => t.at?.[0] === saveX && t.at?.[1] === saveY);
      if (!hit?.items?.some((it) => it.id === samples.wall)) {
        failures.push(`saved payload missing wall at ${saveX},${saveY}: ${JSON.stringify(dumped)}`);
      } else {
        console.log("OK save payload", { hit });
      }
    }
    const onDisk = findSavedTile(saveX, saveY, saveZ);
    if (!onDisk?.tile?.items?.some((it) => it.id === samples.wall)) {
      failures.push(`viewer JSON on disk missing wall at ${saveX},${saveY},${saveZ}: ${JSON.stringify(onDisk)}`);
    } else {
      console.log("OK save persisted to", onDisk.file);
    }
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    const reloadedReady = await page.evaluate(async () => {
      const v = window.__otMapViewer;
      if (!v) return false;
      return await v.ready(90000);
    });
    if (!reloadedReady) failures.push("viewer ready() timed out after reload");
    const afterReload = await page.evaluate(async ({ x, y, z, wall }) => {
      const v = window.__otMapViewer;
      v.setFloor(z);
      v.centerOn(x, y, 32);
      for (let i = 0; i < 40; i++) {
        const tile = v.getTile(x, y, z);
        if (tile?.items?.some((it) => it.id === wall)) {
          return { ids: tile.items.map((it) => it.id), waits: i };
        }
        await new Promise((r) => setTimeout(r, 100));
      }
      const tile = v.getTile(x, y, z);
      return { ids: (tile?.items || []).map((it) => it.id), waits: 40, missing: !tile };
    }, { x: saveX, y: saveY, z: saveZ, wall: samples.wall });
    if (!afterReload.ids?.includes(samples.wall)) {
      failures.push(`reload lost saved wall at ${saveX},${saveY}: ${JSON.stringify(afterReload)}`);
    } else {
      console.log("OK save survives reload", afterReload);
    }
    if (!(await page.locator("#btnSave").isDisabled())) {
      failures.push("Salvar should stay disabled after reload of a clean session");
    }
  } catch (err) {
    failures.push(String(err?.stack || err));
  } finally {
    await browser.close();
    if (server) await new Promise((r) => server.close(r));
  }

  if (failures.length) {
    console.error("FAIL:\n" + failures.join("\n"));
    process.exit(1);
  }
  console.log("All editor samples OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
