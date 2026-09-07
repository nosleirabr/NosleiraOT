(() => {
  const v = () => window.__otMapViewer;
  const canvas = document.getElementById("view");
  const palettePane = document.getElementById("palettePane");
  const paletteSearch = document.getElementById("paletteSearch");
  const paletteGroup = document.getElementById("paletteGroup");
  const paletteScroller = document.getElementById("paletteScroller");
  const paletteList = document.getElementById("paletteList");
  const spawnSearch = document.getElementById("spawnSearch");
  const spawnKind = document.getElementById("spawnKind");
  const spawnScroller = document.getElementById("spawnScroller");
  const spawnList = document.getElementById("spawnList");
  const btnAddSpawn = document.getElementById("btnAddSpawn");
  const btnSave = document.getElementById("btnSave");
  const propsEl = document.getElementById("props");
  const inspect = document.getElementById("inspect");
  const inspectHint = document.getElementById("inspectHint");
  const inspectTitle = document.getElementById("inspectTitle");
  const containerLayer = document.getElementById("containerLayer");

  const ROW_H = 28;
  const HISTORY_MAX = 80;
  const TILE_FLAGS = [
    { id: "protection-zone", label: "PZ" },
    { id: "no-pvp", label: "No-PvP" },
    { id: "no-logout", label: "No logout" },
    { id: "pvp", label: "PvP" }
  ];

  const editor = {
    brushId: null,
    creatureBrush: null,
    filtered: [],
    spawnFiltered: [],
    gesture: null,
    windows: [],
    winSeq: 0,
    clipboard: null,
    originalTiles: new Map(),
    originalSpawns: null,
    savedAt: 0,
    saving: false,
    history: { past: [], future: [], batch: null, applying: false }
  };

  function state() {
    return v()?.getState?.();
  }

  function isContainer(item) {
    if (!item) return false;
    if (Array.isArray(item.contents) && item.contents.length > 0) return true;
    const info = v()?.catalogOf(item.id);
    return !!info?.container;
  }

  function containerSizeOf(item) {
    const info = v()?.catalogOf(item.id);
    const size = Number(info?.containerSize || item.contents?.length || 8);
    return Math.max(size, item.contents?.length || 0, 4);
  }

  function spriteStyle(clientId, size) {
    const pal = state()?.palette;
    const entry = pal?.byClientId?.[String(clientId)];
    const png = pal?.png || "palette.png";
    const tile = pal?.tile || 32;
    if (!entry) {
      return `width:${size}px;height:${size}px;background:#1c242c`;
    }
    const scale = size / tile;
    const imgW = pal.image?.naturalWidth || tile;
    const imgH = pal.image?.naturalHeight || tile;
    return [
      `width:${size}px`,
      `height:${size}px`,
      `background-image:url(${png})`,
      `background-repeat:no-repeat`,
      `background-position:-${entry.x * scale}px -${entry.y * scale}px`,
      `background-size:${imgW * scale}px ${imgH * scale}px`
    ].join(";");
  }

  function itemLabel(itemOrId) {
    const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    const info = v()?.catalogOf(id);
    const name = info?.name || (typeof itemOrId === "object" ? "" : "");
    return name ? `${id} ${name}` : String(id);
  }

  function syncCursors() {
    canvas.classList.toggle("brush", !!editor.brushId || !!editor.creatureBrush);
  }

  function beginBatch() {
    if (editor.history.applying || editor.history.batch) return;
    editor.history.batch = { tiles: new Map(), spawnsBefore: null };
  }

  function rememberTile(x, y, z) {
    if (editor.history.applying) return;
    beginBatch();
    const key = `${x},${y},${z}`;
    if (!editor.originalTiles.has(key)) {
      editor.originalTiles.set(key, v().snapshotTile(x, y, z));
    }
    if (editor.history.batch.tiles.has(key)) return;
    editor.history.batch.tiles.set(key, v().snapshotTile(x, y, z));
  }

  function rememberSpawns() {
    if (editor.history.applying) return;
    beginBatch();
    if (editor.history.batch.spawnsBefore) return;
    editor.history.batch.spawnsBefore = v().cloneSpawns();
  }

  function commitBatch() {
    const batch = editor.history.batch;
    editor.history.batch = null;
    if (editor.history.applying || !batch) return;
    const before = [...batch.tiles.values()];
    const after = before.map((snap) => v().snapshotTile(snap.x, snap.y, snap.z));
    const spawnsAfter = batch.spawnsBefore ? v().cloneSpawns() : null;
    const tilesChanged = before.some((snap, i) => JSON.stringify(snap) !== JSON.stringify(after[i]));
    const spawnsChanged = batch.spawnsBefore && JSON.stringify(batch.spawnsBefore) !== JSON.stringify(spawnsAfter);
    if (!tilesChanged && !spawnsChanged) return;
    editor.history.past.push({
      before,
      after,
      spawnsBefore: batch.spawnsBefore,
      spawnsAfter
    });
    if (editor.history.past.length > HISTORY_MAX) {
      editor.history.past.shift();
      if (editor.savedAt > 0) editor.savedAt--;
    }
    editor.history.future = [];
    syncSaveButton();
  }

  function isDirty() {
    return editor.history.past.length !== editor.savedAt;
  }

  function syncSaveButton() {
    if (!btnSave) return;
    const dirty = isDirty();
    btnSave.disabled = !dirty || editor.saving;
    btnSave.textContent = dirty ? "Salvar *" : "Salvar";
    btnSave.title = dirty
      ? "Há edições por gravar nos JSON do viewer e nos YAML de setor (build)"
      : "Nada para gravar";
  }

  function itemToSave(item) {
    const out = { id: Number(item.id) };
    const clientId = item.clientId || v()?.catalogOf(item.id)?.clientId;
    if (clientId) out.clientId = clientId;
    if (item.count != null) out.count = item.count;
    if (item.charges != null) out.charges = item.charges;
    if (item.aid != null) out.aid = item.aid;
    if (item.uid != null) out.uid = item.uid;
    if (item.depot != null) out.depot = item.depot;
    if (item.door != null) out.door = item.door;
    if (item.text) out.text = item.text;
    if (Array.isArray(item.dest) && item.dest.length >= 3) out.dest = item.dest;
    if (item.contents?.length) out.contents = item.contents.map(itemToSave);
    return out;
  }

  function collectTileEdits() {
    const tiles = [];
    for (const [key, original] of editor.originalTiles) {
      const [x, y, z] = key.split(",").map(Number);
      const current = v().snapshotTile(x, y, z);
      if (JSON.stringify(original) === JSON.stringify(current)) continue;
      if (original.missing && current.missing) continue;
      if (current.missing) {
        tiles.push({ at: [x, y, z], items: [] });
        continue;
      }
      tiles.push({
        at: [current.x, current.y, current.z],
        flags: current.flags || undefined,
        house: current.house || undefined,
        items: (current.items || []).map(itemToSave)
      });
    }
    return tiles;
  }

  function spawnCenterKey(spawn) {
    return (spawn.center || []).join(",");
  }

  function spawnFingerprint(spawn) {
    if (!spawn) return "";
    const creatures = (spawn.creatures || []).map((c) => ({
      kind: c.kind,
      name: c.name,
      at: c.at,
      spawntime: c.spawntime
    }));
    return JSON.stringify({ center: spawn.center, radius: spawn.radius, creatures });
  }

  function collectSpawnEdits() {
    const origList = editor.originalSpawns || [];
    const curList = v().cloneSpawns() || [];
    const orig = new Map(origList.map((s) => [spawnCenterKey(s), s]));
    const cur = new Map(curList.map((s) => [spawnCenterKey(s), s]));
    const edits = [];
    for (const [key, spawn] of cur) {
      if (spawnFingerprint(orig.get(key)) === spawnFingerprint(spawn)) continue;
      edits.push({
        center: spawn.center,
        radius: spawn.radius || 1,
        creatures: (spawn.creatures || []).map((c) => ({
          kind: c.kind,
          name: c.name,
          at: c.at,
          spawntime: c.spawntime
        }))
      });
    }
    for (const [key, spawn] of orig) {
      if (cur.has(key)) continue;
      edits.push({ center: spawn.center, radius: spawn.radius || 1, creatures: [], remove: true });
    }
    return edits;
  }

  function reportSaveResult(result) {
    if (!inspect) return;
    if (!result?.ok) {
      inspect.textContent = result?.error
        ? `Falha ao salvar: ${result.error}\nO launcher (Open-MapViewer.bat) precisa estar a servir /api/save.`
        : "Nada para gravar.";
      return;
    }
    inspect.textContent = `Gravado: ${result.tiles || 0} SQM(s)` +
      (result.spawns ? `, ${result.spawns} spawn(s)` : "") +
      " → chunks JSON + maps/src/sectors. Depois: otmap build --from-source.";
  }

  async function saveEdits() {
    if (!isDirty() || editor.saving) return { ok: false, reason: "clean" };
    const tiles = collectTileEdits();
    const spawns = collectSpawnEdits();
    if (tiles.length === 0 && spawns.length === 0) {
      editor.savedAt = editor.history.past.length;
      syncSaveButton();
      return { ok: true, tiles: 0, spawns: 0 };
    }
    editor.saving = true;
    syncSaveButton();
    const payload = { tiles };
    if (spawns.length) payload.spawns = spawns;
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      for (const [key] of editor.originalTiles) {
        const [x, y, z] = key.split(",").map(Number);
        editor.originalTiles.set(key, v().snapshotTile(x, y, z));
      }
      editor.originalSpawns = v().cloneSpawns();
      editor.savedAt = editor.history.past.length;
      return { ok: true, tiles: tiles.length, spawns: spawns.length, ...body };
    } catch (err) {
      return { ok: false, error: String(err?.message || err) };
    } finally {
      editor.saving = false;
      syncSaveButton();
    }
  }

  function dropBatch() {
    editor.history.batch = null;
  }

  function applyHistory(entry, useBefore) {
    editor.history.applying = true;
    if (entry.before?.length) {
      v().restoreTiles(useBefore ? entry.before : entry.after);
    }
    if (entry.spawnsBefore) {
      v().restoreSpawns(useBefore ? entry.spawnsBefore : entry.spawnsAfter);
    }
    editor.history.applying = false;
    renderProps(selectedRef());
    refreshWindows();
    renderSpawnList();
    syncSaveButton();
  }

  function undo() {
    const entry = editor.history.past.pop();
    if (!entry) return false;
    applyHistory(entry, true);
    editor.history.future.push(entry);
    return true;
  }

  function redo() {
    const entry = editor.history.future.pop();
    if (!entry) return false;
    applyHistory(entry, false);
    editor.history.past.push(entry);
    return true;
  }

  function copySelection() {
    const ref = selectedRef();
    if (ref?.creature) {
      editor.clipboard = { type: "creature", creature: JSON.parse(JSON.stringify(ref.creature)) };
      return true;
    }
    if (!ref || ref.x == null) return false;
    const snap = v().snapshotTile(ref.x, ref.y, ref.z);
    editor.clipboard = { type: "tile", tile: snap };
    return !snap.missing;
  }

  function pasteAt(x, y, z) {
    const clip = editor.clipboard;
    if (!clip) return false;
    if (clip.type === "creature") {
      rememberSpawns();
      const spec = clip.creature;
      const placed = v().addCreatureAt(x, y, z, spec);
      commitBatch();
      selectCreature(placed);
      return true;
    }
    if (clip.type !== "tile" || clip.tile?.missing) return false;
    rememberTile(x, y, z);
    v().restoreTiles([{
      x,
      y,
      z,
      missing: false,
      items: JSON.parse(JSON.stringify(clip.tile.items || [])),
      flags: clip.tile.flags,
      house: clip.tile.house
    }]);
    commitBatch();
    const tile = v().getTile(x, y, z);
    selectOnMap(x, y, z, tile?.items?.length ? [tile.items.length - 1] : [], false);
    return true;
  }

  function cutSelection() {
    if (!copySelection()) return false;
    deleteSelected();
    return true;
  }

  function setBrush(id) {
    editor.brushId = id;
    if (id) editor.creatureBrush = null;
    syncCursors();
    renderPalette();
    renderSpawnList();
  }

  function setCreatureBrush(spec) {
    editor.creatureBrush = spec ? { name: spec.name, kind: spec.kind || "monster" } : null;
    if (spec) editor.brushId = null;
    syncCursors();
    renderPalette();
    renderSpawnList();
  }

  function catalogItems() {
    return state()?.catalog?.items || [];
  }

  function filterPalette(query) {
    const q = (query || "").trim().toLowerCase();
    const group = paletteGroup?.value || "all";
    return catalogItems().filter((item) => {
      if (group !== "all" && item.group !== group) return false;
      if (!q) return true;
      if (String(item.id).includes(q)) return true;
      if (String(item.clientId || "").includes(q)) return true;
      return (item.name || "").toLowerCase().includes(q);
    });
  }

  function renderPalette() {
    if (!paletteList || !paletteScroller) return;
    editor.filtered = filterPalette(paletteSearch?.value);
    const total = editor.filtered.length;
    paletteList.style.height = `${Math.max(total * ROW_H, ROW_H)}px`;
    const start = Math.max(0, Math.floor(paletteScroller.scrollTop / ROW_H) - 4);
    const visible = Math.ceil(paletteScroller.clientHeight / ROW_H) + 8;
    const end = Math.min(total, start + visible);
    const html = [];
    for (let i = start; i < end; i++) {
      const item = editor.filtered[i];
      const active = item.id === editor.brushId ? " active" : "";
      html.push(
        `<div class="palette-row${active}" data-id="${item.id}" style="top:${i * ROW_H}px">` +
        `<span class="palette-icon" style="${spriteStyle(item.clientId, 24)}"></span>` +
        `<span class="palette-label">${itemLabel(item)}</span></div>`
      );
    }
    paletteList.innerHTML = html.join("");
  }

  function filterSpawnNames(query) {
    const q = (query || "").trim().toLowerCase();
    const kind = spawnKind?.value || "all";
    return (v()?.uniqueSpawnNames?.() || []).filter((row) => {
      if (kind !== "all" && row.kind !== kind) return false;
      if (!q) return true;
      return row.name.toLowerCase().includes(q);
    });
  }

  function renderSpawnList() {
    if (!spawnList || !spawnScroller) return;
    editor.spawnFiltered = filterSpawnNames(spawnSearch?.value);
    const total = editor.spawnFiltered.length;
    spawnList.style.height = `${Math.max(total * ROW_H, ROW_H)}px`;
    const start = Math.max(0, Math.floor(spawnScroller.scrollTop / ROW_H) - 4);
    const visible = Math.ceil(spawnScroller.clientHeight / ROW_H) + 8;
    const end = Math.min(total, start + visible);
    const html = [];
    for (let i = start; i < end; i++) {
      const row = editor.spawnFiltered[i];
      const active = editor.creatureBrush
        && editor.creatureBrush.name === row.name
        && editor.creatureBrush.kind === row.kind
        ? " active"
        : "";
      html.push(
        `<div class="palette-row${active}" data-spawn-name="${escapeHtml(row.name)}" data-spawn-kind="${row.kind}" style="top:${i * ROW_H}px">` +
        `<span class="spawn-dot ${row.kind}"></span>` +
        `<span class="palette-label">${escapeHtml(row.name)}</span></div>`
      );
    }
    spawnList.innerHTML = html.join("");
  }

  function selectedRef() {
    const sel = state()?.selected;
    if (!sel) return null;
    if (sel.creature) {
      const hit = v().pickCreatureAt(sel.x, sel.y, sel.z);
      return {
        ...sel,
        tile: v().getTile(sel.x, sel.y, sel.z),
        item: null,
        creature: hit?.creature || null,
        spawn: hit?.spawn || null,
        spawnIndex: hit?.spawnIndex,
        creatureIndex: hit?.creatureIndex
      };
    }
    const tile = v().getTile(sel.x, sel.y, sel.z);
    const item = sel.path?.length ? v().getItemAtPath(tile, sel.path) : null;
    return { tile, item, creature: null, ...sel };
  }

  function selectOnMap(x, y, z, path, openContainer) {
    v().setSelected({ x, y, z, path: path || [] });
    const ref = selectedRef();
    renderProps(ref);
    if (openContainer && ref?.item && isContainer(ref.item)) {
      openContainerWindow(ref);
    }
  }

  function selectCreature(hit) {
    if (!hit?.creature) return;
    v().setSelected({
      x: hit.creature.at[0],
      y: hit.creature.at[1],
      z: hit.creature.at[2],
      path: [],
      creature: { spawnIndex: hit.spawnIndex, creatureIndex: hit.creatureIndex }
    });
    renderProps(selectedRef());
  }

  function dumpInspect(ref) {
    if (!inspect) return;
    if (ref?.creature) {
      inspect.textContent = JSON.stringify({
        creature: ref.creature,
        spawn: { center: ref.spawn?.center, radius: ref.spawn?.radius },
        note: "Spawn só em memória — não grava XML/OTBM."
      }, null, 2);
      return;
    }
    if (!ref?.tile) {
      inspect.textContent = ref ? `Empty ${ref.x},${ref.y},${ref.z}` : "Clique em um tile.";
      return;
    }
    inspect.textContent = JSON.stringify({
      at: ref.tile.at,
      flags: ref.tile.flags || null,
      house: ref.tile.house || null,
      selectedPath: ref.path,
      selectedItem: ref.item || null,
      stack: ref.tile.items,
      note: "Clique seleciona o topo. Ctrl+arrastar navega. Del apaga. Edição em memória."
    }, null, 2);
  }

  function enumOptions(key, current) {
    const values = state()?.catalog?.enums?.[key] || [];
    const seen = new Set();
    const opts = ['<option value="">(nenhum)</option>'];
    const add = (value) => {
      if (!value || seen.has(value)) return;
      seen.add(value);
      const sel = value === current ? " selected" : "";
      opts.push(`<option value="${escapeHtml(value)}"${sel}>${escapeHtml(value)}</option>`);
    };
    for (const value of values) add(value);
    add(current);
    return opts.join("");
  }

  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function fieldRow(label, inner) {
    return `<div class="prop-row"><label>${escapeHtml(label)}</label>${inner}</div>`;
  }

  function numberInput(name, value) {
    const val = value == null ? "" : value;
    return `<input data-field="${name}" type="number" value="${escapeHtml(val)}">`;
  }

  function textInput(name, value) {
    return `<input data-field="${name}" type="text" value="${escapeHtml(value ?? "")}">`;
  }

  function renderProps(ref) {
    if (!propsEl) return;
    propsEl.hidden = false;
    if (!ref) {
      propsEl.innerHTML = `<p class="dirty-note">Edição local (não grava OTBM/XML).</p>` +
        `<p class="hint">Clique seleciona. Ctrl+arrastar navega. Del apaga. Ctrl+C/V/Z copia, cola e desfaz.</p>`;
      dumpInspect(ref);
      return;
    }

    const tile = ref.tile;
    const item = ref.item;
    const info = item ? v().catalogOf(item.id) : null;
    const flags = new Set(String(tile?.flags || "").split(",").map((s) => s.trim()).filter(Boolean));

    let html = `<p class="dirty-note">Edição local (não grava o OTBM).</p>`;
    html += `<div class="prop-section"><h3>Tile ${ref.x}, ${ref.y}, ${ref.z}</h3>`;
    html += `<div class="prop-row"><label>Flags</label><div>`;
    for (const flag of TILE_FLAGS) {
      const checked = flags.has(flag.id) ? " checked" : "";
      html += `<label class="tog"><input data-tile-flag="${flag.id}" type="checkbox"${checked}> ${flag.label}</label> `;
    }
    html += `</div></div>`;
    html += `<div class="btn-row"><button type="button" data-act="add-spawn">Novo spawn neste SQM</button></div></div>`;

    if (ref.creature) {
      html += `<div class="prop-section"><h3>Criatura ${escapeHtml(ref.creature.name)} (${escapeHtml(ref.creature.kind)})</h3>`;
      html += fieldRow("nome", `<input data-creature="name" type="text" value="${escapeHtml(ref.creature.name)}">`);
      html += fieldRow("tipo", `<select data-creature="kind">` +
        `<option value="monster"${ref.creature.kind === "monster" ? " selected" : ""}>monster</option>` +
        `<option value="npc"${ref.creature.kind === "npc" ? " selected" : ""}>npc</option></select>`);
      html += fieldRow("spawntime", `<input data-creature="spawntime" type="number" value="${escapeHtml(ref.creature.spawntime ?? 60)}">`);
      html += fieldRow("pos", `<input data-creature="at" type="text" value="${escapeHtml((ref.creature.at || [ref.x, ref.y, ref.z]).join(" "))}">`);
      if (ref.spawn) {
        html += fieldRow("radius", `<input data-spawn="radius" type="number" value="${escapeHtml(ref.spawn.radius ?? 3)}">`);
        html += `<p class="hint">Centro do spawn: ${ref.spawn.center.join(", ")}</p>`;
      }
      html += `</div>`;
    }

    if (tile?.items?.length) {
      html += `<div class="prop-section"><h3>Pilha (topo = último)</h3><div class="stack-list">`;
      tile.items.forEach((it, index) => {
        const sel = !ref.creature && ref.path?.[0] === index && ref.path.length === 1 ? " selected" : "";
        html += `<div class="stack-item${sel}" data-stack="${index}">` +
          `<span class="palette-icon" style="${spriteStyle(it.clientId, 24)}"></span>` +
          `<span>${escapeHtml(itemLabel(it))}</span></div>`;
      });
      html += `</div></div>`;
    }

    if (item && !ref.creature) {
      const dest = Array.isArray(item.dest) ? item.dest.join(" ") : (item.dest || "");
      const top = tile?.items?.length ? tile.items.length - 1 : -1;
      const isTop = ref.path?.length === 1 && ref.path[0] === top;
      html += `<div class="prop-section"><h3>Item ${escapeHtml(itemLabel(item))}${isTop ? " (topo)" : ""}</h3>`;
      html += fieldRow("id", numberInput("id", item.id));
      html += fieldRow("count", numberInput("count", item.count));
      html += fieldRow("charges", numberInput("charges", item.charges));
      html += fieldRow("aid", numberInput("aid", item.aid));
      html += fieldRow("uid", numberInput("uid", item.uid));
      html += fieldRow("depot", numberInput("depot", item.depot));
      html += fieldRow("door", numberInput("door", item.door));
      html += fieldRow("dest", textInput("dest", dest));
      html += fieldRow("text", textInput("text", item.text));
      html += `<div class="btn-row">` +
        (isContainer(item) ? `<button type="button" data-act="open-container">Abrir container</button>` : "") +
        `</div></div>`;

      const attrs = { ...(info?.attrs || {}), ...(item.attrs || {}) };
      const enums = state()?.catalog?.enums || {};
      const boolKeys = new Set((state()?.catalog?.boolKeys || []).map((k) => k.toLowerCase()));
      html += `<div class="prop-section"><h3>Características</h3>`;
      const keys = new Set([...Object.keys(enums), ...Object.keys(attrs)]);
      for (const key of keys) {
        const current = attrs[key] ?? (key === "type" ? info?.type : "") ?? "";
        if (enums[key]) {
          html += fieldRow(key, `<select data-attr="${escapeHtml(key)}">${enumOptions(key, current)}</select>`);
          continue;
        }
        if (boolKeys.has(key.toLowerCase())) {
          const checked = current === "1" || current === "true" ? " checked" : "";
          html += fieldRow(key, `<input data-attr="${escapeHtml(key)}" type="checkbox"${checked}>`);
          continue;
        }
        if (current === "" && !attrs[key]) continue;
        html += fieldRow(key, `<input data-attr="${escapeHtml(key)}" type="text" value="${escapeHtml(current)}">`);
      }
      html += `</div>`;
    }

    propsEl.innerHTML = html;
    dumpInspect(ref);
  }

  function applyItemField(item, field, raw) {
    const empty = raw === "" || raw == null;
    if (field === "dest") {
      const pos = v().parseGotoPosition(raw);
      item.dest = pos ? [pos.x, pos.y, pos.z ?? 7] : (empty ? undefined : item.dest);
      return;
    }
    if (field === "text") {
      item.text = empty ? undefined : raw;
      return;
    }
    if (field === "id") {
      const id = Number(raw);
      if (!Number.isFinite(id) || id <= 0) return;
      item.id = id;
      const info = v().catalogOf(id);
      if (info?.clientId) item.clientId = info.clientId;
      if (info?.container && !item.contents) item.contents = [];
      return;
    }
    const num = Number(raw);
    item[field] = empty || !Number.isFinite(num) ? undefined : num;
  }

  function bindPropsEvents() {
    propsEl?.addEventListener("change", (e) => {
      const ref = selectedRef();
      if (!ref) return;
      const flag = e.target.dataset.tileFlag;
      if (flag) {
        if (!ref.tile) return;
        rememberTile(ref.x, ref.y, ref.z);
        const flags = new Set(String(ref.tile.flags || "").split(",").map((s) => s.trim()).filter(Boolean));
        if (e.target.checked) flags.add(flag);
        else flags.delete(flag);
        ref.tile.flags = [...flags].join(",") || undefined;
        commitBatch();
        v().invalidatePanBuffer();
        v().scheduleDraw(true);
        dumpInspect(ref);
        return;
      }
      if (e.target.dataset.creature && ref.creature) {
        rememberSpawns();
        const key = e.target.dataset.creature;
        if (key === "at") {
          const pos = v().parseGotoPosition(e.target.value);
          if (pos) {
            ref.creature.at = [pos.x, pos.y, pos.z ?? ref.creature.at[2]];
            v().setSelected({
              x: pos.x,
              y: pos.y,
              z: pos.z ?? ref.z,
              path: [],
              creature: { spawnIndex: ref.spawnIndex, creatureIndex: ref.creatureIndex }
            });
          }
        } else if (key === "spawntime") {
          ref.creature.spawntime = Number(e.target.value) || 0;
        } else {
          ref.creature[key] = e.target.value;
        }
        commitBatch();
        v().invalidatePanBuffer();
        v().scheduleDraw(true);
        renderProps(selectedRef());
        renderSpawnList();
        return;
      }
      if (e.target.dataset.spawn && ref.spawn) {
        rememberSpawns();
        if (e.target.dataset.spawn === "radius") {
          ref.spawn.radius = Math.max(1, Number(e.target.value) || 1);
        }
        commitBatch();
        v().invalidatePanBuffer();
        v().scheduleDraw(true);
        renderProps(selectedRef());
        return;
      }
      if (!ref.item) return;
      rememberTile(ref.x, ref.y, ref.z);
      if (e.target.dataset.field) {
        applyItemField(ref.item, e.target.dataset.field, e.target.value);
        commitBatch();
        v().invalidatePanBuffer();
        v().scheduleDraw(true);
        renderProps(selectedRef());
        return;
      }
      if (e.target.dataset.attr) {
        const key = e.target.dataset.attr;
        ref.item.attrs = ref.item.attrs || {};
        if (e.target.type === "checkbox") {
          ref.item.attrs[key] = e.target.checked ? "1" : "0";
        } else if (e.target.value === "") {
          delete ref.item.attrs[key];
        } else {
          ref.item.attrs[key] = e.target.value;
        }
        commitBatch();
        dumpInspect(ref);
      }
    });

    propsEl?.addEventListener("click", (e) => {
      const stack = e.target.closest("[data-stack]");
      if (stack) {
        const ref = selectedRef();
        if (!ref) return;
        selectOnMap(ref.x, ref.y, ref.z, [Number(stack.dataset.stack)], false);
        return;
      }
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "open-container") {
        const ref = selectedRef();
        if (ref?.item) openContainerWindow(ref);
      }
      if (act === "add-spawn") {
        const ref = selectedRef();
        if (!ref) return;
        addSpawnHere(ref.x, ref.y, ref.z);
      }
    });
  }

  function addSpawnHere(x, y, z) {
    rememberSpawns();
    v().addSpawnAt(x, y, z, 3);
    commitBatch();
    renderProps(selectedRef());
    renderSpawnList();
  }

  function placeCreatureAt(x, y, z) {
    if (!editor.creatureBrush) return null;
    rememberSpawns();
    const placed = v().addCreatureAt(x, y, z, editor.creatureBrush);
    commitBatch();
    selectCreature(placed);
    renderSpawnList();
    return placed;
  }

  function deleteSelected() {
    const ref = selectedRef();
    if (ref?.creature) {
      rememberSpawns();
      v().removeCreature(ref);
      commitBatch();
      v().setSelected({ x: ref.x, y: ref.y, z: ref.z, path: [] });
      renderProps(selectedRef());
      renderSpawnList();
      return true;
    }
    if (!ref?.tile) return false;
    const path = ref.path?.length
      ? ref.path
      : (ref.tile.items?.length ? [ref.tile.items.length - 1] : null);
    if (!path?.length) return false;
    const { x, y, z } = ref;
    rememberTile(x, y, z);
    v().removeItemAtPath(ref.tile, path);
    commitBatch();
    closeWindowsFor(ref);
    const tile = v().getTile(x, y, z);
    if (tile?.items?.length) {
      selectOnMap(x, y, z, [tile.items.length - 1], false);
    } else {
      v().setSelected({ x, y, z, path: [] });
      renderProps({ tile, item: null, x, y, z, path: [] });
    }
    return true;
  }

  function placeBrushAt(x, y, z, intoPath) {
    if (!editor.brushId) return;
    editor.lastPlaceAt = performance.now();
    rememberTile(x, y, z);
    const item = v().makePlacedItem(editor.brushId);
    if (intoPath) {
      const tile = v().ensureMutableTile(x, y, z);
      const parent = v().getItemAtPath(tile, intoPath);
      if (!parent) {
        dropBatch();
        return;
      }
      if (!parent.contents) parent.contents = [];
      parent.contents.push(item);
      commitBatch();
      v().invalidatePanBuffer();
      v().scheduleDraw(true);
      selectOnMap(x, y, z, [...intoPath, parent.contents.length - 1], false);
      refreshWindows();
      return;
    }
    const dest = v().addItemToTile(x, y, z, item);
    commitBatch();
    selectOnMap(x, y, z, [dest.index], isContainer(item));
  }

  function openContainerWindow(ref) {
    if (!ref?.item || !containerLayer) return;
    const existing = editor.windows.find((w) => sameSel(w.ref, ref));
    if (existing) {
      renderContainerWindow(existing);
      return;
    }
    const win = {
      id: ++editor.winSeq,
      ref: { x: ref.x, y: ref.y, z: ref.z, path: [...ref.path] },
      left: 80 + editor.windows.length * 24,
      top: 80 + editor.windows.length * 24
    };
    editor.windows.push(win);
    containerLayer.hidden = false;
    renderContainerWindow(win);
  }

  function sameSel(a, b) {
    return a && b && a.x === b.x && a.y === b.y && a.z === b.z
      && JSON.stringify(a.path) === JSON.stringify(b.path);
  }

  function closeWindowsFor(ref) {
    editor.windows = editor.windows.filter((w) => {
      if (w.ref.x !== ref.x || w.ref.y !== ref.y || w.ref.z !== ref.z) return true;
      return !prefixPath(ref.path, w.ref.path);
    });
    if (editor.windows.length === 0) containerLayer.hidden = true;
    else refreshWindows();
  }

  function prefixPath(prefix, path) {
    if (!prefix?.length) return true;
    if (path.length < prefix.length) return false;
    return prefix.every((n, i) => path[i] === n);
  }

  function refreshWindows() {
    if (!containerLayer) return;
    containerLayer.innerHTML = "";
    if (editor.windows.length === 0) {
      containerLayer.hidden = true;
      return;
    }
    containerLayer.hidden = false;
    for (const win of editor.windows) renderContainerWindow(win);
  }

  function renderContainerWindow(win) {
    const tile = v().getTile(win.ref.x, win.ref.y, win.ref.z);
    const item = v().getItemAtPath(tile, win.ref.path);
    if (!item) return;
    let el = containerLayer.querySelector(`[data-win="${win.id}"]`);
    if (!el) {
      el = document.createElement("div");
      el.className = "container-win";
      el.dataset.win = String(win.id);
      containerLayer.appendChild(el);
      bindWindowDrag(el, win);
    }
    el.style.left = `${win.left}px`;
    el.style.top = `${win.top}px`;
    const contents = item.contents || [];
    const slots = containerSizeOf(item);
    const sel = state()?.selected;
    let grid = "";
    for (let i = 0; i < slots; i++) {
      const child = contents[i];
      const selected = sel && sameSel(sel, { ...win.ref, path: [...win.ref.path, i] }) ? " selected" : "";
      if (!child) {
        grid += `<div class="container-slot empty${selected}" data-slot="${i}"></div>`;
        continue;
      }
      grid += `<div class="container-slot${selected}" data-slot="${i}" title="${escapeHtml(itemLabel(child))}" style="${spriteStyle(child.clientId, 48)}"></div>`;
    }
    el.innerHTML = `<header>${escapeHtml(itemLabel(item))} · ${contents.length}/${slots}` +
      `<span class="spacer"></span><button type="button" data-close="${win.id}">×</button></header>` +
      `<div class="container-grid">${grid}</div>`;
  }

  function bindWindowDrag(el, win) {
    el.addEventListener("pointerdown", (e) => {
      const close = e.target.dataset.close;
      if (close) {
        editor.windows = editor.windows.filter((w) => w.id !== win.id);
        refreshWindows();
        return;
      }
      const slot = e.target.closest("[data-slot]");
      if (slot) {
        const index = Number(slot.dataset.slot);
        const path = [...win.ref.path, index];
        const tile = v().getTile(win.ref.x, win.ref.y, win.ref.z);
        const parent = v().getItemAtPath(tile, win.ref.path);
        if (editor.brushId && !parent?.contents?.[index]) {
          placeBrushAt(win.ref.x, win.ref.y, win.ref.z, win.ref.path);
          return;
        }
        const child = parent?.contents?.[index];
        if (!child) return;
        selectOnMap(win.ref.x, win.ref.y, win.ref.z, path, isContainer(child));
        refreshWindows();
        return;
      }
      if (!e.target.closest("header")) return;
      const startX = e.clientX - win.left;
      const startY = e.clientY - win.top;
      const move = (ev) => {
        win.left = ev.clientX - startX;
        win.top = ev.clientY - startY;
        el.style.left = `${win.left}px`;
        el.style.top = `${win.top}px`;
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  }

  function topItemPath(tile) {
    if (!tile?.items?.length) return null;
    return [tile.items.length - 1];
  }

  function capturePointer(e) {
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {
      /* Playwright / pointerId 0 pode recusar setPointerCapture */
    }
  }

  function endGesture() {
    editor.gesture = null;
    canvas.classList.remove("item-drag");
    v()?.setDragGhost(null);
  }

  function handlePointerDown(e) {
    if (e.button === 1 || e.button === 2) return false;
    if (e.button !== 0) return false;
    // Ctrl/Meta+arrastar = pan do mapa (o viewer trata o gesto).
    if (e.ctrlKey || e.metaKey) {
      editor.gesture = { kind: "pan", lastX: e.clientX, lastY: e.clientY, moved: false };
      return false;
    }
    const grid = v().worldFromEvent(e.clientX, e.clientY);
    if (editor.brushId) {
      capturePointer(e);
      editor.gesture = { kind: "brush", start: grid, lastX: e.clientX, lastY: e.clientY, moved: false };
      return true;
    }
    if (editor.creatureBrush) {
      capturePointer(e);
      editor.gesture = { kind: "spawn-brush", start: grid, lastX: e.clientX, lastY: e.clientY, moved: false };
      return true;
    }
    const creatureHit = v().pickCreatureAt(grid.x, grid.y, grid.z);
    if (creatureHit) {
      capturePointer(e);
      editor.gesture = {
        kind: "creature",
        start: grid,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        from: { x: grid.x, y: grid.y, z: grid.z },
        hit: creatureHit
      };
      return true;
    }
    const picked = v().pickWorldAt(e.clientX, e.clientY);
    const tile = v().getTile(picked.x, picked.y, picked.z);
    const path = picked.path || topItemPath(tile);
    if (path) {
      capturePointer(e);
      editor.gesture = {
        kind: "item",
        start: picked,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        path,
        from: { x: picked.x, y: picked.y, z: picked.z }
      };
      return true;
    }
    capturePointer(e);
    editor.gesture = { kind: "select", start: grid, lastX: e.clientX, lastY: e.clientY, moved: false };
    return true;
  }

  function handlePointerMove(e) {
    const g = editor.gesture;
    if (!g) return false;
    if (g.kind !== "pan" && e.buttons === 0) {
      handlePointerUp(e);
      return false;
    }
    const dx = e.clientX - g.lastX;
    const dy = e.clientY - g.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 8) g.moved = true;
    if (g.kind === "pan") return false;
    if (g.kind === "item" && g.moved) {
      const tile = v().getTile(g.from.x, g.from.y, g.from.z);
      const item = v().getItemAtPath(tile, g.path);
      canvas.classList.add("item-drag");
      v().setDragGhost({ item: item ? v().clonePlaced(item) : null });
      return true;
    }
    if (g.kind === "creature" && g.moved) {
      canvas.classList.add("item-drag");
      v().setDragGhost({ creature: g.hit.creature });
      return true;
    }
    if (g.kind === "brush" || g.kind === "spawn-brush") return true;
    return false;
  }

  function handlePointerUp(e) {
    const g = editor.gesture;
    endGesture();
    if (!g) return false;
    if (g.kind === "pan") return true;

    const grid = !g.moved ? g.start : v().worldFromEvent(e.clientX, e.clientY);
    if (g.kind === "brush") {
      placeBrushAt(grid.x, grid.y, grid.z);
      return true;
    }
    if (g.kind === "spawn-brush") {
      placeCreatureAt(grid.x, grid.y, grid.z);
      return true;
    }
    if (g.kind === "item" && g.moved) {
      const fromTile = v().getTile(g.from.x, g.from.y, g.from.z);
      rememberTile(g.from.x, g.from.y, g.from.z);
      rememberTile(grid.x, grid.y, grid.z);
      const ok = v().moveItem(fromTile, g.path, grid.x, grid.y, grid.z);
      if (ok) commitBatch();
      else dropBatch();
      renderProps(selectedRef());
      refreshWindows();
      return true;
    }
    if (g.kind === "creature" && g.moved) {
      rememberSpawns();
      const fresh = v().pickCreatureAt(g.from.x, g.from.y, g.from.z) || g.hit;
      const ok = v().moveCreature(fresh, grid.x, grid.y, grid.z);
      if (ok) {
        commitBatch();
        selectCreature({
          ...fresh,
          creature: { ...fresh.creature, at: [grid.x, grid.y, grid.z] }
        });
      } else {
        dropBatch();
        selectCreature(fresh);
      }
      return true;
    }
    if (g.kind === "creature" && !g.moved) {
      selectCreature(g.hit);
      return true;
    }
    if (g.kind === "item" && !g.moved) {
      const tile = v().getTile(g.from.x, g.from.y, g.from.z);
      const item = v().getItemAtPath(tile, g.path);
      selectOnMap(g.from.x, g.from.y, g.from.z, g.path, isContainer(item));
      return true;
    }
    if (g.kind === "select" && !g.moved) {
      const tile = v().getTile(grid.x, grid.y, grid.z);
      const path = topItemPath(tile);
      if (!path) {
        clearSelection();
        return true;
      }
      selectOnMap(grid.x, grid.y, grid.z, path, false);
      return true;
    }
    return false;
  }

  function handlePointerCancel() {
    endGesture();
  }

  window.addEventListener("pointerup", (e) => {
    if (editor.gesture && editor.gesture.kind !== "pan") handlePointerUp(e);
  });

  function clickCanvasCenter() {
    const rect = canvas.getBoundingClientRect();
    const fake = {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      button: 0,
      pointerId: 1
    };
    handlePointerDown(fake);
    handlePointerUp(fake);
  }

  function pasteAtHoverOrSelection() {
    const hover = state()?.hover;
    const sel = state()?.selected;
    const x = hover?.x ?? sel?.x;
    const y = hover?.y ?? sel?.y;
    const z = hover?.z ?? sel?.z;
    if (x == null) return false;
    return pasteAt(x, y, z);
  }

  function clearSelection() {
    endGesture();
    setBrush(null);
    v()?.setSelected(null);
    v()?.setDragGhost(null);
    renderProps(null);
  }

  function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === "c") {
        e.preventDefault();
        copySelection();
        return true;
      }
      if (key === "x") {
        e.preventDefault();
        cutSelection();
        return true;
      }
      if (key === "v") {
        e.preventDefault();
        pasteAtHoverOrSelection();
        return true;
      }
      if (key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
        return true;
      }
      if (key === "z") {
        e.preventDefault();
        undo();
        return true;
      }
      if (key === "s") {
        e.preventDefault();
        saveEdits().then(reportSaveResult);
        return true;
      }
      if (key === "y") {
        e.preventDefault();
        redo();
        return true;
      }
      return false;
    }
    if (e.key === "Escape") {
      setCreatureBrush(null);
      clearSelection();
      return true;
    }
    if (e.key === "Delete") {
      e.preventDefault();
      deleteSelected();
      return true;
    }
    return false;
  }

  function onDataReady() {
    v()?.setEditorMode(true);
    if (palettePane) palettePane.hidden = false;
    if (inspectTitle) inspectTitle.textContent = "Propriedades";
    if (inspectHint) inspectHint.hidden = true;
    renderPalette();
    renderSpawnList();
    syncCursors();
    editor.originalSpawns = v()?.cloneSpawns?.() || [];
    syncSaveButton();
    renderProps(selectedRef());
  }

  function onMapChanged() {
    if (editor.history.applying) return;
    renderProps(selectedRef());
    refreshWindows();
    renderSpawnList();
  }

  paletteScroller?.addEventListener("scroll", () => renderPalette());
  paletteSearch?.addEventListener("input", () => {
    paletteScroller.scrollTop = 0;
    renderPalette();
  });
  paletteGroup?.addEventListener("change", () => {
    paletteScroller.scrollTop = 0;
    renderPalette();
  });
  paletteList?.addEventListener("click", (e) => {
    const row = e.target.closest("[data-id]");
    if (!row) return;
    const id = Number(row.dataset.id);
    setBrush(editor.brushId === id ? null : id);
  });
  spawnScroller?.addEventListener("scroll", () => renderSpawnList());
  spawnSearch?.addEventListener("input", () => {
    spawnScroller.scrollTop = 0;
    renderSpawnList();
  });
  spawnSearch?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const name = (spawnSearch.value || "").trim();
    if (!name) return;
    const kind = spawnKind?.value === "npc" ? "npc" : "monster";
    setCreatureBrush({ name, kind });
  });
  spawnKind?.addEventListener("change", () => {
    spawnScroller.scrollTop = 0;
    renderSpawnList();
  });
  spawnList?.addEventListener("click", (e) => {
    const row = e.target.closest("[data-spawn-name]");
    if (!row) return;
    const spec = { name: row.dataset.spawnName, kind: row.dataset.spawnKind };
    const same = editor.creatureBrush
      && editor.creatureBrush.name === spec.name
      && editor.creatureBrush.kind === spec.kind;
    setCreatureBrush(same ? null : spec);
  });
  btnAddSpawn?.addEventListener("click", () => {
    const hover = state()?.hover;
    const sel = state()?.selected;
    const x = sel?.x ?? hover?.x;
    const y = sel?.y ?? hover?.y;
    const z = sel?.z ?? hover?.z ?? 7;
    if (x == null) return;
    addSpawnHere(x, y, z);
  });
  btnSave?.addEventListener("click", async () => {
    reportSaveResult(await saveEdits());
  });
  window.addEventListener("beforeunload", (e) => {
    if (!isDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
  window.addEventListener("resize", () => {
    renderPalette();
    renderSpawnList();
  });

  bindPropsEvents();

  function preferGridHover() {
    if (editor.brushId || editor.creatureBrush) return true;
    const g = editor.gesture;
    if (!g) return false;
    if (g.kind === "brush" || g.kind === "spawn-brush") return true;
    if ((g.kind === "item" || g.kind === "creature") && g.moved) return true;
    return false;
  }

  function onHover(hover) {
    if (editor.gesture) return;
    if (editor.brushId && hover) {
      v().setDragGhost({ item: v().makePlacedItem(editor.brushId) });
      return;
    }
    if (editor.creatureBrush && hover) {
      v().setDragGhost({
        creature: {
          ...editor.creatureBrush,
          ...v().lookForCreatureName(editor.creatureBrush.name, editor.creatureBrush.kind)
        }
      });
      return;
    }
    v()?.setDragGhost(null);
  }

  function editSelectedField(field, value) {
    const ref = selectedRef();
    if (!ref?.item) return false;
    rememberTile(ref.x, ref.y, ref.z);
    applyItemField(ref.item, field, value);
    commitBatch();
    v().invalidatePanBuffer();
    v().scheduleDraw(true);
    renderProps(selectedRef());
    return true;
  }

  window.__otMapEditor = {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown,
    onDataReady,
    onMapChanged,
    onHover,
    preferGridHover,
    setMode() {
      onDataReady();
    },
    setBrush,
    setCreatureBrush,
    setTool(tool) {
      if (tool === "pan") {
        setBrush(null);
        setCreatureBrush(null);
      }
    },
    getTool: () => (editor.brushId || editor.creatureBrush ? "select" : "select"),
    deleteSelected,
    clearSelection,
    undo,
    redo,
    copySelection,
    cutSelection,
    pasteAt,
    saveEdits,
    isDirty,
    collectTileEdits,
    setGroup(group) {
      if (paletteGroup) paletteGroup.value = group || "all";
      paletteScroller.scrollTop = 0;
      renderPalette();
    },
    placeAt(x, y, z) {
      placeBrushAt(x, y, z);
      return v().getTile(x, y, z);
    },
    addCreatureAt(x, y, z, spec) {
      editor.creatureBrush = spec;
      return placeCreatureAt(x, y, z);
    },
    addSpawnAt(x, y, z, radius) {
      rememberSpawns();
      const spawn = v().addSpawnAt(x, y, z, radius ?? 3);
      commitBatch();
      renderSpawnList();
      return spawn;
    },
    selectAt(x, y, z, path) {
      const tile = v().getTile(x, y, z);
      const resolved = path || (tile?.items?.length ? [tile.items.length - 1] : []);
      selectOnMap(x, y, z, resolved, false);
      return selectedRef();
    },
    editField: editSelectedField,
    openSelectedContainer() {
      const ref = selectedRef();
      if (!ref?.item || !isContainer(ref.item)) return false;
      openContainerWindow(ref);
      return true;
    },
    placeInSelectedContainer() {
      const ref = selectedRef();
      if (!ref?.item || !editor.brushId) return false;
      const path = isContainer(ref.item) ? ref.path : ref.path.slice(0, -1);
      placeBrushAt(ref.x, ref.y, ref.z, path);
      return true;
    },
    getBrush: () => editor.brushId,
    getCreatureBrush: () => editor.creatureBrush,
    filteredCount: () => editor.filtered.length,
    spawnFilteredCount: () => editor.spawnFiltered.length,
    windowCount: () => editor.windows.length,
    historySize: () => editor.history.past.length,
    selected: () => selectedRef(),
    clickCanvasCenter
  };

  if (state()?.catalog) onDataReady();
})();
