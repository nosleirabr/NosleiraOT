(() => {
  const canvas = document.getElementById("view");
  const ctx = canvas.getContext("2d");
  const inspect = document.getElementById("inspect");
  const status = document.getElementById("status");
  const floorInput = document.getElementById("floor");
  const zoomLabel = document.getElementById("zoomLabel");

  /** Below this px/tile, draw ground item only (full zoom-out still allowed). */
  const LOW_ZOOM_THRESHOLD = 4;
  const PREFETCH_MAX_CONCURRENT = 5;
  const PREFETCH_DEBOUNCE_MS = 120;
  /** Throttle full redraws during drag when pan buffer is unavailable (~30fps). */
  const DRAG_THROTTLE_MS = 33;

  const state = {
    x: 40,
    y: 40,
    scale: 8,
    dragging: false,
    moved: false,
    lastX: 0,
    lastY: 0,
    atlas: null,
    meta: null,
    sectorSize: 256,
    /** @type {Set<string>|null} */
    sectorSet: null,
    /** @type {Map<string, any[]>} */
    sectorTiles: new Map(),
    /** @type {string[]} LRU order (oldest first) */
    sectorLru: [],
    sectorLruMax: 72,
    /** @type {Set<string>} */
    loading: new Set(),
    /** @type {Set<string>} */
    missing: new Set(),
    /** @type {Map<string, any>} */
    tileIndex: new Map(),
    hover: null,
    drawScheduled: false,
    drawFullPending: false,
    lastDragDrawAt: 0,
    overlays: null,
    showNpc: true,
    showMonster: true,
    showSpawn: true,
    showHouse: true,
    /** Catálogo items.xml + atlas compacto da paleta (editor). */
    catalog: null,
    palette: null,
    editorMode: true,
    /** { x, y, z, path: number[], creature?: { spawnIndex, creatureIndex } } */
    selected: null,
    /** Preview no cursor: item ou criatura a arrastar. */
    dragGhost: null
  };
  document.body.classList.add("editor-on");

  /** @type {{ high: Set<string>, low: Set<string>, inFlight: number }} */
  const fetchQueue = { high: new Set(), low: new Set(), inFlight: 0 };

  let prefetchTimer = null;

  const panBuffer = (() => {
    const off = document.createElement("canvas");
    return {
      canvas: off,
      ctx: off.getContext("2d"),
      originX: 0,
      originY: 0,
      scale: 0,
      floor: -1,
      overlaysKey: "",
      valid: false
    };
  })();

  const ZOOM_STEPS = [2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

  function configureCtx(context) {
    const dpr = window.devicePixelRatio || 1;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = false;
    if ("imageSmoothingQuality" in context) context.imageSmoothingQuality = "low";
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    configureCtx(ctx);
    invalidatePanBuffer();
    scheduleDraw(true);
  }

  function overlaysKey() {
    return `${state.showNpc}|${state.showMonster}|${state.showSpawn}|${state.showHouse}`;
  }

  function invalidatePanBuffer() {
    panBuffer.valid = false;
  }

  function capturePanBuffer() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    panBuffer.canvas.width = Math.floor(w * dpr);
    panBuffer.canvas.height = Math.floor(h * dpr);
    configureCtx(panBuffer.ctx);
    panBuffer.ctx.drawImage(canvas, 0, 0, w, h);
    panBuffer.originX = state.x;
    panBuffer.originY = state.y;
    panBuffer.scale = state.scale;
    panBuffer.floor = Number(floorInput.value) || 7;
    panBuffer.overlaysKey = overlaysKey();
    panBuffer.valid = true;
  }

  function panBufferUsable() {
    if (!panBuffer.valid) return false;
    const z = Number(floorInput.value) || 7;
    return (
      panBuffer.scale === state.scale &&
      panBuffer.floor === z &&
      panBuffer.overlaysKey === overlaysKey()
    );
  }

  function snapZoom(next, direction) {
    if (direction > 0) {
      return ZOOM_STEPS.find((step) => step > next + 0.01) ?? ZOOM_STEPS[ZOOM_STEPS.length - 1];
    }
    if (direction < 0) {
      for (let i = ZOOM_STEPS.length - 1; i >= 0; i--) {
        if (ZOOM_STEPS[i] < next - 0.01) return ZOOM_STEPS[i];
      }
      return ZOOM_STEPS[0];
    }
    let best = ZOOM_STEPS[0];
    for (const step of ZOOM_STEPS) {
      if (Math.abs(step - next) < Math.abs(best - next)) best = step;
    }
    return best;
  }

  function eventToLocal(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const w = canvas.clientWidth || rect.width;
    const h = canvas.clientHeight || rect.height;
    const sx = rect.width ? w / rect.width : 1;
    const sy = rect.height ? h / rect.height : 1;
    return {
      x: (clientX - rect.left) * sx,
      y: (clientY - rect.top) * sy,
      w,
      h,
      rect,
      inside:
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
    };
  }

  function setZoom(next, pivotX, pivotY) {
    const dir = next > state.scale + 0.001 ? 1 : next < state.scale - 0.001 ? -1 : 0;
    const clamped = dir === 0 ? snapZoom(next, 0) : snapZoom(state.scale, dir);
    if (clamped === state.scale) return;
    if (pivotX != null && pivotY != null) {
      const worldX = (pivotX - state.x) / state.scale;
      const worldY = (pivotY - state.y) / state.scale;
      state.scale = clamped;
      state.x = pivotX - worldX * state.scale;
      state.y = pivotY - worldY * state.scale;
    } else {
      state.scale = clamped;
    }
    snapCamera();
    zoomLabel.textContent = `${state.scale}px`;
    invalidatePanBuffer();
    scheduleDraw(true);
  }

  function worldFromEvent(clientX, clientY) {
    const local = eventToLocal(clientX, clientY);
    return {
      x: Math.floor((local.x - state.x) / state.scale),
      y: Math.floor((local.y - state.y) / state.scale),
      z: Number(floorInput.value) || 7
    };
  }

  function snapCamera() {
    state.x = Math.round(state.x);
    state.y = Math.round(state.y);
  }

  function itemScreenBounds(item, tileX, tileY, scale) {
    const { px, py } = worldToScreen(tileX, tileY);
    const thing = state.atlas?.things?.[String(item.clientId)];
    if (!thing) {
      return { x: px, y: py, w: scale, h: scale };
    }
    const elev = (thing.elev || 0) * (scale / 32);
    const offX = ((thing.dx || 0) / 32) * scale;
    const offY = ((thing.dy || 0) / 32) * scale;
    const tw = thing.w || 1;
    const th = thing.h || 1;
    return {
      x: px - offX - elev - (tw - 1) * scale,
      y: py - offY - elev - (th - 1) * scale,
      w: tw * scale,
      h: th * scale
    };
  }

  function pickWorldAt(clientX, clientY) {
    const local = eventToLocal(clientX, clientY);
    const scale = state.scale;
    const z = Number(floorInput.value) || 7;
    const gridX = Math.floor((local.x - state.x) / scale);
    const gridY = Math.floor((local.y - state.y) / scale);
    const gridTile = getTile(gridX, gridY, z);
    const fallback = {
      x: gridX,
      y: gridY,
      z,
      path: gridTile?.items?.length ? [gridTile.items.length - 1] : null
    };
    let best = null;
    let bestScore = -Infinity;
    const reach = 8;
    for (let ty = gridY; ty <= gridY + reach; ty++) {
      for (let tx = gridX; tx <= gridX + reach; tx++) {
        const tile = getTile(tx, ty, z);
        if (!tile?.items?.length) continue;
        for (let i = tile.items.length - 1; i >= 0; i--) {
          const box = itemScreenBounds(tile.items[i], tx, ty, scale);
          if (local.x < box.x || local.y < box.y || local.x >= box.x + box.w || local.y >= box.y + box.h) {
            continue;
          }
          const score = ty * 1e6 + tx * 1e3 + i;
          if (score > bestScore) {
            bestScore = score;
            best = { x: tx, y: ty, z, path: [i] };
          }
          break;
        }
      }
    }
    return best || fallback;
  }

  function worldToScreen(tx, ty) {
    return {
      px: tx * state.scale + state.x,
      py: ty * state.scale + state.y
    };
  }

  function spriteIndex(thing, cx, cy, layer, patternX, patternY, frame) {
    const px = thing.px <= 1 ? 0 : patternX % thing.px;
    const py = thing.py <= 1 ? 0 : patternY % thing.py;
    const fr = thing.frames <= 1 ? 0 : frame % thing.frames;
    return ((((fr * thing.py + py) * thing.px + px) * thing.layers + layer) * thing.h + cy) * thing.w + cx;
  }

  function drawSprite(atlas, spriteId, dx, dy, scale) {
    const entry = atlas.bySpriteId?.[String(spriteId)];
    if (!entry || spriteId <= 0) return;
    ctx.drawImage(
      atlas.image,
      entry.x, entry.y, atlas.tile, atlas.tile,
      dx, dy, scale, scale
    );
  }

  function drawPaletteSprite(clientId, dx, dy, scale) {
    const pal = state.palette;
    const entry = pal?.byClientId?.[String(clientId)];
    if (!entry || !pal?.image) return false;
    ctx.drawImage(
      pal.image,
      entry.x, entry.y, pal.tile, pal.tile,
      dx, dy, scale, scale
    );
    return true;
  }

  function drawPlacedItem(atlas, item, tileX, tileY, px, py, scale) {
    const thing = atlas?.things?.[String(item.clientId)];
    if (thing) {
      drawThing(atlas, thing, tileX, tileY, px, py, scale);
      return;
    }
    if (item.clientId) drawPaletteSprite(item.clientId, px, py, scale);
  }

  // Floor-change holes / open pits that should show the tile below (Tibia client behaviour).
  const HOLE_DOWN_IDS = new Set([
    383, 384, 385, 386, 387, 388, 389, 390, 391, 392,
    469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485
  ]);

  function tileHasHoleDown(tile) {
    return tile?.items?.some((item) => HOLE_DOWN_IDS.has(item.id));
  }

  function getTile(x, y, z) {
    return state.tileIndex.get(`${x},${y},${z}`);
  }

  function firstAtlasItem(atlas, items) {
    if (!items?.length) return null;
    return items.find((item) => item.clientId && atlas.things?.[String(item.clientId)])
      || items.find((item) => item.clientId)
      || items[0];
  }

  function drawItemStack(atlas, items, tileX, tileY, px, py, scale, groundOnly) {
    if (!items?.length) return;
    if (groundOnly) {
      const item = firstAtlasItem(atlas, items);
      if (!item) {
        ctx.fillStyle = "#2a3238";
        ctx.fillRect(px, py, scale, scale);
        return;
      }
      drawPlacedItem(atlas, item, tileX, tileY, px, py, scale);
      return;
    }
    for (const item of items) {
      drawPlacedItem(atlas, item, tileX, tileY, px, py, scale);
    }
  }

  function drawThing(atlas, thing, tileX, tileY, px, py, scale, patternOverride) {
    if (!thing?.sprites?.length) return;
    const patternX = patternOverride?.x ?? tileX % (thing.px || 1);
    const patternY = patternOverride?.y ?? tileY % (thing.py || 1);
    const elev = (thing.elev || 0) * (scale / 32);
    const offX = ((thing.dx || 0) / 32) * scale;
    const offY = ((thing.dy || 0) / 32) * scale;
    const baseX = px - offX - elev;
    const baseY = py - offY - elev;

    for (let cx = 0; cx < (thing.w || 1); cx++) {
      for (let cy = 0; cy < (thing.h || 1); cy++) {
        for (let layer = 0; layer < (thing.layers || 1); layer++) {
          const idx = spriteIndex(thing, cx, cy, layer, patternX, patternY, 0);
          const spriteId = thing.sprites[idx];
          if (spriteId == null) continue;
          drawSprite(atlas, spriteId, baseX - cx * scale, baseY - cy * scale, scale);
        }
      }
    }
  }

  function sectorKey(sx, sy, z) {
    return `${z}_${sx}_${sy}`;
  }

  function sectorBoundsFromViewport(padSectors) {
    const z = Number(floorInput.value) || 7;
    const size = state.sectorSize;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const pad = size * (padSectors || 0);
    const minTX = Math.floor((-state.x) / state.scale) - pad;
    const maxTX = Math.ceil((w - state.x) / state.scale) + pad;
    const minTY = Math.floor((-state.y) / state.scale) - pad;
    const maxTY = Math.ceil((h - state.y) / state.scale) + pad;
    return {
      z,
      size,
      minSX: Math.floor(minTX / size) * size,
      maxSX: Math.floor(maxTX / size) * size,
      minSY: Math.floor(minTY / size) * size,
      maxSY: Math.floor(maxTY / size) * size
    };
  }

  function sectorKeysInBounds(bounds, floors) {
    const keys = [];
    for (const floor of floors) {
      for (let sx = bounds.minSX; sx <= bounds.maxSX; sx += bounds.size) {
        for (let sy = bounds.minSY; sy <= bounds.maxSY; sy += bounds.size) {
          keys.push(sectorKey(sx, sy, floor));
        }
      }
    }
    return keys;
  }

  function visibleSectorKeys() {
    const bounds = sectorBoundsFromViewport(1);
    const z = bounds.z;
    return sectorKeysInBounds(bounds, [z, Math.min(15, z + 1)]);
  }

  function prefetchSectorKeys() {
    const inner = sectorBoundsFromViewport(0);
    const outer = sectorBoundsFromViewport(1);
    const z = inner.z;
    const floors = [z, Math.min(15, z + 1)];
    const visible = new Set(sectorKeysInBounds(inner, floors));
    const keys = [];
    for (const floor of floors) {
      for (let sx = outer.minSX; sx <= outer.maxSX; sx += outer.size) {
        for (let sy = outer.minSY; sy <= outer.maxSY; sy += outer.size) {
          const key = sectorKey(sx, sy, floor);
          if (!visible.has(key)) keys.push(key);
        }
      }
    }
    return keys;
  }

  function indexTiles(tiles) {
    for (const tile of tiles) {
      state.tileIndex.set(`${tile.at[0]},${tile.at[1]},${tile.at[2]}`, tile);
    }
  }

  function touchLru(key) {
    const i = state.sectorLru.indexOf(key);
    if (i >= 0) state.sectorLru.splice(i, 1);
    state.sectorLru.push(key);
    while (state.sectorLru.length > state.sectorLruMax) {
      const evict = state.sectorLru.shift();
      if (!evict || !state.sectorTiles.has(evict)) continue;
      const tiles = state.sectorTiles.get(evict) || [];
      for (const tile of tiles) {
        state.tileIndex.delete(`${tile.at[0]},${tile.at[1]},${tile.at[2]}`);
      }
      state.sectorTiles.delete(evict);
    }
  }

  function pumpFetchQueue() {
    while (fetchQueue.inFlight < PREFETCH_MAX_CONCURRENT) {
      const key = fetchQueue.high.values().next().value ?? fetchQueue.low.values().next().value;
      if (!key) break;
      if (fetchQueue.high.has(key)) fetchQueue.high.delete(key);
      else fetchQueue.low.delete(key);
      startSectorFetch(key);
    }
  }

  function startSectorFetch(key) {
    if (state.sectorTiles.has(key)) {
      touchLru(key);
      return;
    }
    if (state.loading.has(key) || state.missing.has(key)) return;
    // Wait until load() builds sectorSet — resize() otherwise fetches garbage near 0,0.
    if (!state.sectorSet) return;
    if (!state.sectorSet.has(key)) {
      state.missing.add(key);
      return;
    }

    state.loading.add(key);
    fetchQueue.inFlight += 1;
    fetch(`sectors/${key}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("missing");
        return r.json();
      })
      .then((data) => {
        state.loading.delete(key);
        const tiles = data.tiles || [];
        state.sectorTiles.set(key, tiles);
        touchLru(key);
        indexTiles(tiles);
        invalidatePanBuffer();
        scheduleDraw(true);
      })
      .catch(() => {
        state.loading.delete(key);
        state.missing.add(key);
      })
      .finally(() => {
        fetchQueue.inFlight = Math.max(0, fetchQueue.inFlight - 1);
        pumpFetchQueue();
      });
  }

  function requestSector(key, prefetch) {
    if (state.sectorTiles.has(key)) {
      touchLru(key);
      return;
    }
    if (state.loading.has(key) || state.missing.has(key)) return;

    const bucket = prefetch ? fetchQueue.low : fetchQueue.high;
    const other = prefetch ? fetchQueue.high : fetchQueue.low;
    other.delete(key);
    bucket.add(key);
    pumpFetchQueue();
  }

  function ensureVisibleSectors() {
    for (const key of visibleSectorKeys()) {
      requestSector(key, false);
    }
  }

  function schedulePrefetch() {
    if (prefetchTimer != null) clearTimeout(prefetchTimer);
    prefetchTimer = setTimeout(() => {
      prefetchTimer = null;
      for (const key of prefetchSectorKeys()) {
        requestSector(key, true);
      }
    }, PREFETCH_DEBOUNCE_MS);
  }

  function scheduleDraw(forceFull = false) {
    if (forceFull) state.drawFullPending = true;
    if (state.drawScheduled) return;
    state.drawScheduled = true;
    requestAnimationFrame(() => {
      state.drawScheduled = false;
      draw();
    });
  }

  function drawCreatureGhost(atlas, creature, tileX, tileY, px, py, scale) {
    const southPattern = { x: 2, y: 0 };
    const thing = creature.outfitId && atlas?.things?.[String(creature.outfitId)];
    if (thing) {
      drawThing(atlas, thing, tileX, tileY, px, py, scale, southPattern);
      return;
    }
    ctx.fillStyle = creature.kind === "npc" ? "#3ddc84" : "#ff6b6b";
    ctx.beginPath();
    ctx.arc(px + scale / 2, py + scale / 2, Math.max(2.5, scale * 0.22), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawOverlays(z, scale, atlas) {
    if (!state.overlays) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const pad = 40;
    /** Tibia 7.4 outfit facing: 0=N, 1=E, 2=S, 3=W in pattern_x. */
    const southPattern = { x: 2, y: 0 };

    if (state.showSpawn || state.showNpc || state.showMonster) {
      for (const spawn of state.overlays.spawns || []) {
        const [cx, cy, cz] = spawn.center;
        if (cz !== z && !(spawn.creatures || []).some((c) => c.at[2] === z)) continue;
        if (state.showSpawn && spawn.center[2] === z) {
          const { px, py } = worldToScreen(cx, cy);
          const r = (spawn.radius || 1) * scale;
          if (px + r < -pad || py + r < -pad || px - r > w + pad || py - r > h + pad) {
            /* still draw creatures below */
          } else {
            ctx.beginPath();
            ctx.arc(px + scale / 2, py + scale / 2, Math.max(4, r), 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 200, 80, 0.45)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
        for (const c of spawn.creatures || []) {
          if (c.at[2] !== z) continue;
          if (c.kind === "npc" && !state.showNpc) continue;
          if (c.kind === "monster" && !state.showMonster) continue;
          const { px, py } = worldToScreen(c.at[0], c.at[1]);
          if (px < -pad || py < -pad || px > w + pad || py > h + pad) continue;
          const thing = c.outfitId && atlas?.things?.[String(c.outfitId)];
          if (thing) {
            drawThing(atlas, thing, c.at[0], c.at[1], px, py, scale, southPattern);
            continue;
          }
          const color = c.kind === "npc" ? "#3ddc84" : "#ff6b6b";
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px + scale / 2, py + scale / 2, Math.max(2.5, scale * 0.22), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    if (state.showHouse) {
      for (const house of state.overlays.houses || []) {
        const [ex, ey, ez] = house.entry;
        if (ez !== z) continue;
        const { px, py } = worldToScreen(ex, ey);
        if (px < -pad || py < -pad || px > w + pad || py > h + pad) continue;
        ctx.fillStyle = "#6cb2ff";
        ctx.fillRect(px + scale * 0.2, py + scale * 0.2, scale * 0.6, scale * 0.6);
      }
    }
  }

  function collectTilesForFloor(z) {
    const tiles = [];
    for (const key of visibleSectorKeys()) {
      const sector = state.sectorTiles.get(key);
      if (!sector) continue;
      for (const tile of sector) {
        if (tile.at[2] === z) tiles.push(tile);
      }
    }
    tiles.sort((a, b) => (a.at[1] - b.at[1]) || (a.at[0] - b.at[0]));
    return tiles;
  }

  function tileIntersectsScreenRect(tile, scale, w, h, margin, clip) {
    const { px, py } = worldToScreen(tile.at[0], tile.at[1]);
    const tileRight = px + scale + margin;
    const tileBottom = py + scale + margin;
    if (tileRight < 0 || tileBottom < 0 || px - margin > w || py - margin > h) {
      return false;
    }
    if (!clip) return true;
    return !(tileRight < clip.x || px - margin > clip.x + clip.w || tileBottom < clip.y || py - margin > clip.y + clip.h);
  }

  function drawTiles(atlas, z, scale, w, h, groundOnly, clip) {
    const margin = 4 * scale;
    const tiles = collectTilesForFloor(z);

    for (const tile of tiles) {
      if (!tileIntersectsScreenRect(tile, scale, w, h, margin, clip)) continue;

      const { px, py } = worldToScreen(tile.at[0], tile.at[1]);
      ctx.fillStyle = "#1c242c";
      ctx.fillRect(px, py, scale, scale);

      if (!tile.items?.length) continue;

      if (tileHasHoleDown(tile)) {
        const below = getTile(tile.at[0], tile.at[1], tile.at[2] + 1);
        if (below?.items?.length) {
          drawItemStack(atlas, below.items, below.at[0], below.at[1], px, py, scale, groundOnly);
        }
      }

      drawItemStack(atlas, tile.items, tile.at[0], tile.at[1], px, py, scale, groundOnly);
    }
  }

  function fillBackground(w, h) {
    ctx.fillStyle = "#101214";
    ctx.fillRect(0, 0, w, h);
  }

  function drawHoverAndStatus(z, scale, w, h) {
    if (state.hover) {
      const { px, py } = worldToScreen(state.hover.x, state.hover.y);
      ctx.strokeStyle = "#6cb2ff";
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 0.5, py + 0.5, scale - 1, scale - 1);
    }

    if (state.selected) {
      const { px, py } = worldToScreen(state.selected.x, state.selected.y);
      ctx.strokeStyle = "#f0c36a";
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1.5, py + 1.5, scale - 3, scale - 3);
    }

    if (state.dragGhost && state.hover) {
      const { px, py } = worldToScreen(state.hover.x, state.hover.y);
      ctx.globalAlpha = 0.7;
      if (state.dragGhost.item) {
        drawPlacedItem(state.atlas, state.dragGhost.item, state.hover.x, state.hover.y, px, py, scale);
      } else if (state.dragGhost.creature) {
        drawCreatureGhost(state.atlas, state.dragGhost.creature, state.hover.x, state.hover.y, px, py, scale);
      }
      ctx.globalAlpha = 1;
    }

    if (state.loading.size > 0) {
      ctx.fillStyle = "#6cb2ff";
      ctx.font = "12px Segoe UI";
      ctx.fillText(`Loading ${state.loading.size} sector(s)…`, 12, h - 12);
    }
  }

  function drawFull() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    fillBackground(w, h);

    ensureVisibleSectors();
    if (!state.dragging) schedulePrefetch();

    const z = Number(floorInput.value) || 7;
    const scale = state.scale;
    const atlas = state.atlas;

    if (!atlas?.image) {
      ctx.fillStyle = "#9aa3ad";
      ctx.font = "14px Segoe UI";
      ctx.fillText("Loading atlas…", 24, 32);
      return;
    }

    const groundOnly = scale < LOW_ZOOM_THRESHOLD;
    drawTiles(atlas, z, scale, w, h, groundOnly, null);
    drawOverlays(z, scale, atlas);
    capturePanBuffer();
    drawHoverAndStatus(z, scale, w, h);
  }

  function drawPanBlit() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dx = state.x - panBuffer.originX;
    const dy = state.y - panBuffer.originY;
    const z = Number(floorInput.value) || 7;
    const scale = state.scale;
    const atlas = state.atlas;

    ctx.clearRect(0, 0, w, h);
    fillBackground(w, h);
    ctx.drawImage(panBuffer.canvas, dx, dy, w, h);

    if (!atlas?.image) return;

    const groundOnly = scale < LOW_ZOOM_THRESHOLD;
    const strips = [];
    if (dx > 0) strips.push({ x: 0, y: 0, w: dx, h });
    else if (dx < 0) strips.push({ x: w + dx, y: 0, w: -dx, h });
    if (dy > 0) strips.push({ x: 0, y: 0, w, h: dy });
    else if (dy < 0) strips.push({ x: 0, y: h + dy, w, h: -dy });

    for (const clip of strips) {
      drawTiles(atlas, z, scale, w, h, groundOnly, clip);
    }

    drawHoverAndStatus(z, scale, w, h);
    ensureVisibleSectors();
  }

  function draw() {
    const now = performance.now();
    const wantsFull = state.drawFullPending;
    state.drawFullPending = false;

    if (state.dragging && !wantsFull && panBufferUsable()) {
      drawPanBlit();
      return;
    }

    if (state.dragging && !wantsFull) {
      if (now - state.lastDragDrawAt < DRAG_THROTTLE_MS) return;
      state.lastDragDrawAt = now;
    }

    drawFull();
  }

  function updateStatus(tile) {
    if (!tile) {
      status.textContent = "—";
      return;
    }
    const found = state.tileIndex.get(`${tile.x},${tile.y},${tile.z}`);
    const stack = found?.items?.length ?? 0;
    status.textContent = `${tile.x}, ${tile.y}, ${tile.z}  ·  ${stack} item(s)  ·  zoom ${Math.round(state.scale)}px`;
  }

  function parseGotoPosition(text) {
    if (!text) return null;
    const parts = String(text).trim().split(/[\s,;]+/).filter(Boolean);
    if (parts.length < 2) return null;
    const x = Number(parts[0]);
    const y = Number(parts[1]);
    const z = parts.length >= 3 ? Number(parts[2]) : NaN;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    const pos = { x: Math.trunc(x), y: Math.trunc(y), z: null };
    if (Number.isFinite(z)) pos.z = Math.trunc(z);
    return pos;
  }

  function goToPosition(text) {
    const pos = parseGotoPosition(text);
    if (!pos) return false;
    if (pos.z != null) {
      floorInput.value = String(Math.max(0, Math.min(15, pos.z)));
    }
    centerOn(pos.x, pos.y, Math.max(state.scale, 24));
    state.hover = { x: pos.x, y: pos.y, z: Number(floorInput.value) || 7 };
    updateStatus(state.hover);
    return true;
  }

  function catalogOf(id) {
    return state.catalog?.byId?.get(Number(id)) || null;
  }

  function resolveClientId(serverId) {
    const info = catalogOf(serverId);
    return info?.clientId || serverId;
  }

  function clonePlaced(item) {
    return JSON.parse(JSON.stringify(item));
  }

  function makePlacedItem(serverId) {
    const info = catalogOf(serverId);
    const item = {
      id: Number(serverId),
      clientId: info?.clientId || resolveClientId(serverId)
    };
    if (info?.container) item.contents = [];
    return item;
  }

  function getItemAtPath(tile, path) {
    if (!tile || !path?.length) return null;
    let list = tile.items;
    let item = null;
    for (const index of path) {
      item = list?.[index] || null;
      if (!item) return null;
      list = item.contents;
    }
    return item;
  }

  function parentListAtPath(tile, path) {
    if (!tile || !path?.length) return null;
    if (path.length === 1) return tile.items;
    const parent = getItemAtPath(tile, path.slice(0, -1));
    if (!parent) return null;
    if (!parent.contents) parent.contents = [];
    return parent.contents;
  }

  function sectorKeyFromPos(x, y, z) {
    const size = state.sectorSize;
    const sx = Math.floor(x / size) * size;
    const sy = Math.floor(y / size) * size;
    return sectorKey(sx, sy, z);
  }

  function ensureMutableTile(x, y, z) {
    let tile = getTile(x, y, z);
    if (tile) {
      if (!tile.items) tile.items = [];
      return tile;
    }
    tile = { at: [x, y, z], items: [] };
    const key = sectorKeyFromPos(x, y, z);
    if (!state.sectorTiles.has(key)) state.sectorTiles.set(key, []);
    state.sectorTiles.get(key).push(tile);
    state.sectorSet?.add(key);
    state.tileIndex.set(`${x},${y},${z}`, tile);
    return tile;
  }

  function touchMap() {
    invalidatePanBuffer();
    scheduleDraw(true);
    window.__otMapEditor?.onMapChanged?.();
  }

  function addItemToTile(x, y, z, item, index) {
    const tile = ensureMutableTile(x, y, z);
    const placed = clonePlaced(item);
    const group = catalogOf(placed.id)?.group;
    // Ground vai para o fundo da pilha (como no RME); o resto empilha por cima.
    if (index == null && group === "ground") {
      const first = tile.items[0];
      if (first && catalogOf(first.id)?.group === "ground") {
        tile.items[0] = placed;
        touchMap();
        return { tile, index: 0 };
      }
      tile.items.unshift(placed);
      touchMap();
      return { tile, index: 0 };
    }
    if (index == null || index < 0 || index > tile.items.length) {
      tile.items.push(placed);
      touchMap();
      return { tile, index: tile.items.length - 1 };
    }
    tile.items.splice(index, 0, placed);
    touchMap();
    return { tile, index };
  }

  function removeItemAtPath(tile, path) {
    const list = parentListAtPath(tile, path);
    const index = path[path.length - 1];
    if (!list || index < 0 || index >= list.length) return null;
    const [removed] = list.splice(index, 1);
    if (list !== tile.items && list.length === 0) {
      const parent = getItemAtPath(tile, path.slice(0, -1));
      if (parent) parent.contents = [];
    }
    touchMap();
    return removed;
  }

  function moveItem(fromTile, fromPath, toX, toY, toZ) {
    if (!fromTile || !fromPath?.length) return false;
    if (fromTile.at[0] === toX && fromTile.at[1] === toY && fromTile.at[2] === toZ) return false;
    const item = getItemAtPath(fromTile, fromPath);
    if (!item) return false;
    const clone = clonePlaced(item);
    removeItemAtPath(fromTile, fromPath);
    const dest = addItemToTile(toX, toY, toZ, clone);
    state.selected = { x: toX, y: toY, z: toZ, path: [dest.index] };
    return true;
  }

  function snapshotTile(x, y, z) {
    const tile = getTile(x, y, z);
    if (!tile) return { x, y, z, missing: true };
    return {
      x,
      y,
      z,
      missing: false,
      items: JSON.parse(JSON.stringify(tile.items || [])),
      flags: tile.flags,
      house: tile.house
    };
  }

  function removeTileFromIndex(x, y, z) {
    const key = `${x},${y},${z}`;
    const tile = state.tileIndex.get(key);
    if (!tile) return;
    state.tileIndex.delete(key);
    const sk = sectorKeyFromPos(x, y, z);
    const list = state.sectorTiles.get(sk);
    if (!list) return;
    const i = list.indexOf(tile);
    if (i >= 0) list.splice(i, 1);
  }

  function restoreTileSilent(snap) {
    if (snap.missing) {
      removeTileFromIndex(snap.x, snap.y, snap.z);
      return;
    }
    const tile = ensureMutableTile(snap.x, snap.y, snap.z);
    tile.items = JSON.parse(JSON.stringify(snap.items || []));
    tile.flags = snap.flags;
    tile.house = snap.house;
  }

  function restoreTiles(snaps) {
    for (const snap of snaps || []) restoreTileSilent(snap);
    touchMap();
  }

  function cloneSpawns() {
    return JSON.parse(JSON.stringify(state.overlays?.spawns || []));
  }

  function restoreSpawns(spawns) {
    ensureOverlays().spawns = JSON.parse(JSON.stringify(spawns || []));
    touchOverlays();
  }

  function ensureOverlays() {
    if (!state.overlays) state.overlays = { version: 1, spawns: [], houses: [] };
    if (!state.overlays.spawns) state.overlays.spawns = [];
    return state.overlays;
  }

  function touchOverlays() {
    invalidatePanBuffer();
    scheduleDraw(true);
    window.__otMapEditor?.onMapChanged?.();
  }

  function pickCreatureAt(x, y, z) {
    const spawns = state.overlays?.spawns || [];
    for (let si = spawns.length - 1; si >= 0; si--) {
      const spawn = spawns[si];
      const list = spawn.creatures || [];
      for (let ci = list.length - 1; ci >= 0; ci--) {
        const creature = list[ci];
        if (creature.at[0] !== x || creature.at[1] !== y || creature.at[2] !== z) continue;
        if (creature.kind === "npc" && !state.showNpc) continue;
        if (creature.kind === "monster" && !state.showMonster) continue;
        return { spawn, spawnIndex: si, creature, creatureIndex: ci };
      }
    }
    return null;
  }

  function chebyshev(ax, ay, bx, by) {
    return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
  }

  function findSpawnCovering(x, y, z) {
    const spawns = state.overlays?.spawns || [];
    let best = null;
    let bestDist = Infinity;
    for (let i = 0; i < spawns.length; i++) {
      const spawn = spawns[i];
      const [cx, cy, cz] = spawn.center;
      if (cz !== z) continue;
      const dist = chebyshev(cx, cy, x, y);
      const radius = spawn.radius || 1;
      if (dist > radius) continue;
      if (dist < bestDist) {
        bestDist = dist;
        best = { spawn, spawnIndex: i };
      }
    }
    return best;
  }

  function lookForCreatureName(name, kind) {
    for (const spawn of state.overlays?.spawns || []) {
      for (const c of spawn.creatures || []) {
        if (c.name === name && (!kind || c.kind === kind)) {
          return {
            looktype: c.looktype,
            outfitId: c.outfitId,
            head: c.head,
            body: c.body,
            legs: c.legs,
            feet: c.feet
          };
        }
      }
    }
    return {};
  }

  function uniqueSpawnNames() {
    const seen = new Set();
    const list = [];
    for (const spawn of state.overlays?.spawns || []) {
      for (const c of spawn.creatures || []) {
        const key = `${c.kind}|${c.name}`;
        if (seen.has(key) || !c.name) continue;
        seen.add(key);
        list.push({ name: c.name, kind: c.kind || "monster" });
      }
    }
    list.sort((a, b) => a.name.localeCompare(b.name) || a.kind.localeCompare(b.kind));
    return list;
  }

  function addSpawnAt(x, y, z, radius = 3) {
    const spawn = { center: [x, y, z], radius, creatures: [] };
    ensureOverlays().spawns.push(spawn);
    touchOverlays();
    return { spawn, spawnIndex: state.overlays.spawns.length - 1 };
  }

  function addCreatureAt(x, y, z, spec) {
    const kind = spec.kind || "monster";
    const name = spec.name || "Monster";
    let found = findSpawnCovering(x, y, z);
    if (!found) found = addSpawnAt(x, y, z, 3);
    const look = lookForCreatureName(name, kind);
    const creature = {
      kind,
      name,
      at: [x, y, z],
      spawntime: spec.spawntime ?? 60,
      ...look
    };
    if (!found.spawn.creatures) found.spawn.creatures = [];
    found.spawn.creatures.push(creature);
    touchOverlays();
    return {
      spawn: found.spawn,
      spawnIndex: found.spawnIndex,
      creature,
      creatureIndex: found.spawn.creatures.length - 1
    };
  }

  function moveCreature(ref, x, y, z) {
    if (!ref?.creature) return false;
    if (ref.creature.at[0] === x && ref.creature.at[1] === y && ref.creature.at[2] === z) return false;
    ref.creature.at = [x, y, z];
    touchOverlays();
    return true;
  }

  function removeCreature(ref) {
    if (!ref?.spawn?.creatures) return false;
    ref.spawn.creatures.splice(ref.creatureIndex, 1);
    touchOverlays();
    return true;
  }

  function centerOn(tx, ty, scale) {
    state.scale = snapZoom(scale ?? state.scale, 0);
    zoomLabel.textContent = `${state.scale}px`;
    state.x = canvas.clientWidth / 2 - tx * state.scale;
    state.y = canvas.clientHeight / 2 - ty * state.scale;
    snapCamera();
    invalidatePanBuffer();
    scheduleDraw(true);
  }

  /** API mínima para QA Playwright e o modo editor. */
  window.__otMapViewer = {
    centerOn,
    parseGotoPosition,
    goToPosition,
    setFloor(z) {
      floorInput.value = String(z);
      invalidatePanBuffer();
      scheduleDraw(true);
    },
    getInspect() {
      return inspect.textContent || "";
    },
    getTile(x, y, z) {
      return getTile(x, y, z ?? (Number(floorInput.value) || 7));
    },
    getState() { return state; },
    worldFromEvent,
    pickWorldAt,
    eventToLocal,
    eventToLocal,
    worldToScreen,
    setZoom,
    scheduleDraw,
    invalidatePanBuffer,
    catalogOf,
    makePlacedItem,
    clonePlaced,
    getItemAtPath,
    addItemToTile,
    removeItemAtPath,
    moveItem,
    ensureMutableTile,
    snapshotTile,
    restoreTiles,
    cloneSpawns,
    restoreSpawns,
    pickCreatureAt,
    findSpawnCovering,
    uniqueSpawnNames,
    addSpawnAt,
    addCreatureAt,
    moveCreature,
    removeCreature,
    lookForCreatureName,
    setSelected(sel) {
      state.selected = sel;
      invalidatePanBuffer();
      scheduleDraw(true);
    },
    setDragGhost(ghost) {
      state.dragGhost = ghost;
      scheduleDraw(false);
    },
    setEditorMode(on) {
      state.editorMode = on !== false;
      document.body.classList.toggle("editor-on", state.editorMode);
    },
    relayoutTo(tx, ty) {
      void canvas.offsetWidth;
      resize();
      if (Number.isFinite(tx) && Number.isFinite(ty)) {
        centerOn(tx, ty, state.scale);
      }
    },
    async ready(timeoutMs = 60000) {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (state.meta && (state.sectorSet || state.tileIndex.size > 0)) return true;
        await new Promise((r) => setTimeout(r, 200));
      }
      return false;
    },
    async ensureTile(x, y, z, timeoutMs = 20000) {
      this.setFloor(z);
      this.centerOn(x, y, 24);
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const t = getTile(x, y, z);
        if (t) return t;
        await new Promise((r) => setTimeout(r, 250));
      }
      return null;
    }
  };

  function stopCameraDrag() {
    const was = state.dragging;
    state.dragging = false;
    canvas.classList.remove("dragging");
    if (was) snapCamera();
    return was;
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (window.__otMapEditor?.handlePointerDown(e)) return;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* pointerId inválido (Playwright) */ }
    state.dragging = true;
    state.moved = false;
    const loc = eventToLocal(e.clientX, e.clientY);
    state.lastX = loc.x;
    state.lastY = loc.y;
    canvas.classList.add("dragging");
  });

  canvas.addEventListener("pointercancel", (e) => {
    window.__otMapEditor?.handlePointerCancel?.(e);
    stopCameraDrag();
  });

  canvas.addEventListener("pointerup", (e) => {
    const wasDragging = state.dragging;
    const wasMoved = state.moved;
    // Sempre largar o pan — senão Ctrl+clique deixa o mapa preso ao rato.
    stopCameraDrag();
    const editorHandled = window.__otMapEditor?.handlePointerUp(e);
    schedulePrefetch();
    if (editorHandled) {
      if (wasDragging && wasMoved) scheduleDraw(true);
      return;
    }
    if (wasDragging && wasMoved) {
      scheduleDraw(true);
      return;
    }
    if (wasMoved) return;
    const world = worldFromEvent(e.clientX, e.clientY);
    const overlayHits = pickOverlay(world);
    if (overlayHits) {
      inspect.textContent = JSON.stringify(overlayHits, null, 2);
      return;
    }
    const found = getTile(world.x, world.y, world.z);
    if (!found) {
      inspect.textContent = `Empty ${world.x},${world.y},${world.z}`;
      return;
    }

    const hole = tileHasHoleDown(found);
    const below = hole ? getTile(world.x, world.y, world.z + 1) : null;
    inspect.textContent = JSON.stringify({
      at: found.at,
      items: found.items,
      note: "aid/uid/contents vêm do OTBM (prefira maps/build/world.otbm no viewer-data).",
      holeDown: hole ? { goesTo: [world.x, world.y, world.z + 1], belowLoaded: !!below } : undefined
    }, null, 2);

    if (hole && (e.detail >= 2 || e.altKey)) {
      floorInput.value = String(Math.min(15, world.z + 1));
      invalidatePanBuffer();
      scheduleDraw(true);
    }
  });

  function pickOverlay(world) {
    if (!state.overlays) return null;
    const hits = [];
    if (state.showNpc || state.showMonster) {
      for (const spawn of state.overlays.spawns || []) {
        for (const c of spawn.creatures || []) {
          if (c.at[2] !== world.z) continue;
          if (c.kind === "npc" && !state.showNpc) continue;
          if (c.kind === "monster" && !state.showMonster) continue;
          if (c.at[0] === world.x && c.at[1] === world.y) hits.push({ type: "creature", ...c, spawnCenter: spawn.center, radius: spawn.radius });
        }
      }
    }
    if (state.showHouse) {
      for (const house of state.overlays.houses || []) {
        const [ex, ey, ez] = house.entry;
        if (ez === world.z && ex === world.x && ey === world.y) hits.push({ type: "house", ...house });
      }
    }
    return hits.length ? hits : null;
  }

  canvas.addEventListener("pointermove", (e) => {
    const gridHover = !!window.__otMapEditor?.preferGridHover?.();
    state.hover = !gridHover
      ? pickWorldAt(e.clientX, e.clientY)
      : worldFromEvent(e.clientX, e.clientY);
    window.__otMapEditor?.onHover?.(state.hover);
    updateStatus(state.hover);
    if (window.__otMapEditor?.handlePointerMove(e)) return;
    if (state.dragging && e.buttons === 0) {
      stopCameraDrag();
      scheduleDraw(true);
      return;
    }
    if (!state.dragging) {
      scheduleDraw(false);
      return;
    }
    const loc = eventToLocal(e.clientX, e.clientY);
    const dx = loc.x - state.lastX;
    const dy = loc.y - state.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 2) state.moved = true;
    state.x += dx;
    state.y += dy;
    state.lastX = loc.x;
    state.lastY = loc.y;
    scheduleDraw(false);
  });

  function onMapWheel(e) {
    if (e.target?.closest?.("#paletteScroller, #inspectPane, header, .container-win, aside")) return;
    const local = eventToLocal(e.clientX, e.clientY);
    if (!local.inside) return;
    e.preventDefault();
    const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
    if (!delta) return;
    setZoom(state.scale * (delta < 0 ? 1.15 : 1 / 1.15), local.x, local.y);
    state.hover = worldFromEvent(e.clientX, e.clientY);
    updateStatus(state.hover);
  }
  window.addEventListener("wheel", onMapWheel, { passive: false, capture: true });

  document.getElementById("zoomIn").addEventListener("click", () => {
    setZoom(state.scale * 1.25, canvas.clientWidth / 2, canvas.clientHeight / 2);
  });
  document.getElementById("zoomOut").addEventListener("click", () => {
    setZoom(state.scale / 1.25, canvas.clientWidth / 2, canvas.clientHeight / 2);
  });
  document.getElementById("zoomReset").addEventListener("click", () => {
    const start = state.meta?.start || [32369, 32215, 7];
    floorInput.value = String(start[2]);
    centerOn(start[0], start[1], 8);
  });
  document.getElementById("floorPrev").addEventListener("click", () => {
    floorInput.value = String(Math.max(0, (Number(floorInput.value) || 0) - 1));
    invalidatePanBuffer();
    scheduleDraw(true);
  });
  document.getElementById("floorNext").addEventListener("click", () => {
    floorInput.value = String(Math.min(15, (Number(floorInput.value) || 0) + 1));
    invalidatePanBuffer();
    scheduleDraw(true);
  });
  floorInput.addEventListener("change", () => {
    invalidatePanBuffer();
    scheduleDraw(true);
  });

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
      e.preventDefault();
      gotoInput?.focus();
      gotoInput?.select();
      return;
    }
    const tag = e.target?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (window.__otMapEditor?.handleKeyDown(e)) return;
    const step = state.scale * 8;
    if (e.key === "+" || e.key === "=") setZoom(state.scale * 1.15, canvas.clientWidth / 2, canvas.clientHeight / 2);
    if (e.key === "-" || e.key === "_") setZoom(state.scale / 1.15, canvas.clientWidth / 2, canvas.clientHeight / 2);
    if (e.key === "ArrowLeft" || e.key === "a") { state.x += step; invalidatePanBuffer(); scheduleDraw(state.dragging ? false : true); }
    if (e.key === "ArrowRight" || e.key === "d") { state.x -= step; invalidatePanBuffer(); scheduleDraw(state.dragging ? false : true); }
    if (e.key === "ArrowUp" || e.key === "w") { state.y += step; invalidatePanBuffer(); scheduleDraw(state.dragging ? false : true); }
    if (e.key === "ArrowDown" || e.key === "s") { state.y -= step; invalidatePanBuffer(); scheduleDraw(state.dragging ? false : true); }
    if (e.key === "PageUp") {
      floorInput.value = String(Math.max(0, (Number(floorInput.value) || 0) - 1));
      invalidatePanBuffer();
      scheduleDraw(true);
    }
    if (e.key === "PageDown") {
      floorInput.value = String(Math.min(15, (Number(floorInput.value) || 0) + 1));
      invalidatePanBuffer();
      scheduleDraw(true);
    }
  });

  function ingestLegacyTiles(tiles) {
    for (const tile of tiles) {
      const sx = Math.floor(tile.at[0] / state.sectorSize) * state.sectorSize;
      const sy = Math.floor(tile.at[1] / state.sectorSize) * state.sectorSize;
      const key = sectorKey(sx, sy, tile.at[2]);
      if (!state.sectorTiles.has(key)) state.sectorTiles.set(key, []);
      state.sectorTiles.get(key).push(tile);
    }
    indexTiles(tiles);
    state.sectorSet = new Set(state.sectorTiles.keys());
  }

  async function load() {
    try {
      const [atlasJson, metaJson, sectorsJson, tilesJson, overlaysJson, itemsJson, paletteJson] = await Promise.all([
        fetch("atlas.json").then((r) => (r.ok ? r.json() : null)),
        fetch("meta.json").then((r) => (r.ok ? r.json() : null)),
        fetch("sectors.json").then((r) => (r.ok ? r.json() : null)),
        fetch("tiles.json").then((r) => (r.ok ? r.json() : null)),
        fetch("overlays.json").then((r) => (r.ok ? r.json() : null)),
        fetch("items.json").then((r) => (r.ok ? r.json() : null)),
        fetch("palette.json").then((r) => (r.ok ? r.json() : null))
      ]);

      if (atlasJson) {
        const image = new Image();
        image.src = atlasJson.png || "atlas.png";
        await image.decode().catch(() => {});
        state.atlas = { ...atlasJson, image };
      }

      if (paletteJson) {
        const image = new Image();
        image.src = paletteJson.png || "palette.png";
        await image.decode().catch(() => {});
        state.palette = { ...paletteJson, image };
      }

      if (itemsJson?.items) {
        const byId = new Map();
        for (const item of itemsJson.items) byId.set(item.id, item);
        state.catalog = { ...itemsJson, byId };
      }

      state.meta = metaJson;
      state.overlays = overlaysJson;
      if (sectorsJson) {
        state.sectorSize = sectorsJson.sectorSize || 256;
        state.sectorSet = new Set(sectorsJson.sectors || []);
      } else if (tilesJson?.tiles) {
        ingestLegacyTiles(tilesJson.tiles);
      }

      const start = metaJson?.start || [32369, 32215, 7];
      floorInput.value = String(start[2]);
      const overlayNote = overlaysJson
        ? ` · ${(overlaysJson.spawns || []).length} spawns · ${(overlaysJson.houses || []).length} houses`
        : "";
      document.title = `OT 7.4 map · ${metaJson?.tileCount?.toLocaleString?.() ?? metaJson?.tileCount ?? "?"} tiles${overlayNote}`;
      centerOn(start[0], start[1], 8);
      window.__otMapEditor?.onDataReady?.();
    } catch (err) {
      inspect.textContent = String(err);
    }
    zoomLabel.textContent = `${Math.round(state.scale)}px`;
    scheduleDraw(true);
  }

  function bindToggle(id, key) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", () => {
      state[key] = el.checked;
      invalidatePanBuffer();
      scheduleDraw(true);
    });
  }
  bindToggle("togNpc", "showNpc");
  bindToggle("togMonster", "showMonster");
  bindToggle("togSpawn", "showSpawn");
  bindToggle("togHouse", "showHouse");

  const gotoInput = document.getElementById("gotoPos");
  const gotoBtn = document.getElementById("gotoBtn");
  function submitGoto() {
    if (!goToPosition(gotoInput?.value)) {
      status.textContent = "Posição inválida — use x y z";
    }
  }
  gotoBtn?.addEventListener("click", submitGoto);
  gotoInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitGoto();
    }
  });

  window.addEventListener("resize", resize);
  resize();
  load();
})();
