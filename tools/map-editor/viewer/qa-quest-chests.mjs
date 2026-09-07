# QA Playwright — todas as quests principais (patches com uid) no map viewer
#
# Pré-requisitos:
#   1. maps/build/viewer com viewer-data --all (OTBM baked)
#   2. Servidor HTTP: .\tools\map-editor\launch-map-viewer.ps1 -SkipBuild
#   3. Node + npx playwright (ou Cursor Playwright MCP)
#
# Uso:
#   node tools/map-editor/viewer/qa-quest-chests.mjs
#   $env:OT74_VIEWER_URL = 'http://127.0.0.1:8766/'

import { chromium } from "playwright";

const base = process.env.OT74_VIEWER_URL || "http://127.0.0.1:8765/";

/**
 * Todos os patches com uid das quests principais (YAML bake).
 * Nome = quest / comentário; expectUid deve aparecer no inspect do tile.
 */
const samples = [
  // --- chests_main / Black Knight / Mintwallin / Orc / mainland ---
  { quest: "chests_main", name: "Elvenbane", x: 32593, y: 31647, z: 4, expectUid: 10014 },
  { quest: "chests_main", name: "Crown Armor", x: 32880, y: 31955, z: 11, expectUid: 10019 },
  { quest: "chests_main", name: "Crown Shield", x: 32868, y: 31955, z: 11, expectUid: 10017 },
  { quest: "chests_main", name: "BK Key 5010", x: 32781, y: 32327, z: 7, expectUid: 10016 },
  { quest: "chests_main", name: "Fire Sword", x: 32980, y: 31727, z: 9, expectUid: 10011 },
  { quest: "chests_main", name: "Knight Armor", x: 32981, y: 31727, z: 9, expectUid: 10012 },
  { quest: "chests_main", name: "Knight Axe", x: 32985, y: 31727, z: 9, expectUid: 10013 },
  { quest: "chests_main", name: "Mintwallin Cyclops", x: 32331, y: 32262, z: 8, expectUid: 10029 },
  { quest: "chests_main", name: "Small Ruby", x: 32421, y: 32215, z: 15, expectUid: 10058 },
  { quest: "chests_main", name: "Blood Herb", x: 32818, y: 32279, z: 8, expectUid: 10021 },
  { quest: "chests_main", name: "Noble Armor", x: 32440, y: 32050, z: 11, expectUid: 10022 },
  { quest: "chests_main", name: "Crown Helmet", x: 32441, y: 32050, z: 11, expectUid: 10059 },
  { quest: "chests_main", name: "Griffin Shield", x: 32813, y: 32361, z: 12, expectUid: 10023 },
  { quest: "chests_main", name: "Obsidian Lance", x: 32814, y: 32361, z: 12, expectUid: 10060 },

  // --- banshee ---
  { quest: "banshee", name: "Boots of Haste", x: 32215, y: 31850, z: 15, expectUid: 10061 },
  { quest: "banshee", name: "Giant Sword", x: 32216, y: 31850, z: 15, expectUid: 10062 },
  { quest: "banshee", name: "Tower Shield", x: 32217, y: 31850, z: 15, expectUid: 10063 },
  { quest: "banshee", name: "Stealth Ring", x: 32218, y: 31850, z: 15, expectUid: 10064 },

  // --- hota ---
  { quest: "hota", name: "Ashmunrah horn", x: 33179, y: 32878, z: 11, expectUid: 10040 },
  { quest: "hota", name: "HOTA 10041", x: 33090, y: 32589, z: 15, expectUid: 10041 },
  { quest: "hota", name: "HOTA 10042", x: 33191, y: 32950, z: 15, expectUid: 10042 },
  { quest: "hota", name: "HOTA 10043", x: 33186, y: 32670, z: 13, expectUid: 10043 },
  { quest: "hota", name: "HOTA 10044", x: 33212, y: 32999, z: 14, expectUid: 10044 },
  { quest: "hota", name: "HOTA 10045", x: 33076, y: 32776, z: 14, expectUid: 10045 },
  { quest: "hota", name: "HOTA 10046", x: 33396, y: 32835, z: 14, expectUid: 10046 },

  // --- deeper fibula ---
  { quest: "deeper_fibula", name: "DF 10050", x: 32320, y: 32460, z: 9, expectUid: 10050 },
  { quest: "deeper_fibula", name: "DF 10051", x: 32321, y: 32460, z: 9, expectUid: 10051 },
  { quest: "deeper_fibula", name: "DF 10052", x: 32322, y: 32460, z: 9, expectUid: 10052 },
  { quest: "deeper_fibula", name: "DF 10053", x: 32323, y: 32460, z: 9, expectUid: 10053 },
  { quest: "deeper_fibula", name: "DF 10054", x: 32324, y: 32460, z: 9, expectUid: 10054 },

  // --- postman / djinn / mad mage / bright sword ---
  { quest: "postman", name: "Post Horn", x: 32431, y: 32241, z: 10, expectUid: 10030 },
  { quest: "djinn_war", name: "Djinn 10031", x: 33042, y: 32320, z: 2, expectUid: 10031 },
  { quest: "djinn_war", name: "Djinn 10032", x: 33060, y: 32280, z: 2, expectUid: 10032 },
  { quest: "mad_mage", name: "Mad Mage 10055", x: 32420, y: 32200, z: 14, expectUid: 10055 },
  { quest: "mad_mage", name: "Mad Mage 10056", x: 32421, y: 32200, z: 14, expectUid: 10056 },
  { quest: "mad_mage", name: "Mad Mage 10057", x: 32422, y: 32200, z: 14, expectUid: 10057 },
  { quest: "bright_sword", name: "Bright Sword", x: 32632, y: 32228, z: 8, expectUid: 10047 },
  { quest: "bright_sword", name: "Red Gem", x: 32633, y: 32228, z: 8, expectUid: 10048 },

  // --- rookgaard ---
  { quest: "rookgaard", name: "Sewer Torch", x: 32092, y: 32162, z: 8, expectUid: 2050 },
  { quest: "rookgaard", name: "Rapier", x: 32099, y: 32198, z: 9, expectUid: 2384 },
  { quest: "rookgaard", name: "Katana corpse", x: 32174, y: 32149, z: 11, expectUid: 2412 },
  { quest: "rookgaard", name: "Viking Helmet", x: 32175, y: 32145, z: 11, expectUid: 2473 },
  { quest: "rookgaard", name: "Key 4603", x: 32176, y: 32132, z: 9, expectUid: 20002 },
  { quest: "rookgaard", name: "Bear Room", x: 32150, y: 32111, z: 12, expectUid: 20003 },
  { quest: "rookgaard", name: "Leather Armor", x: 32171, y: 32197, z: 7, expectUid: 20001 },
  { quest: "rookgaard", name: "Tutorial Coat", x: 31973, y: 32209, z: 12, expectUid: 52169 },
  { quest: "rookgaard", name: "Tutorial Club", x: 31977, y: 32209, z: 12, expectUid: 52170 },
  { quest: "rookgaard", name: "Tutorial Rope", x: 32039, y: 32121, z: 13, expectUid: 52171 },
];

function tileHasUid(tile, uid) {
  const items = tile?.items || [];
  if (items.some((it) => it.uid === uid || it.uniqueId === uid)) return true;
  return JSON.stringify(items).includes(`"uid":${uid}`) || JSON.stringify(items).includes(`"uid": ${uid}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const failures = [];
  const oks = [];

  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60000 });
  const ready = await page.evaluate(async () => {
    const v = window.__otMapViewer;
    if (!v) return false;
    return await v.ready(90000);
  });
  if (!ready) {
    failures.push("viewer __otMapViewer.ready() timed out — regen viewer-data --all?");
  }

  for (const s of samples) {
    const label = `${s.quest}/${s.name} uid=${s.expectUid}`;
    const tile = await page.evaluate(async ({ x, y, z }) => {
      const v = window.__otMapViewer;
      if (!v) return null;
      return await v.ensureTile(x, y, z, 25000);
    }, s);

    if (!tile) {
      failures.push(`${label}: tile ${s.x},${s.y},${s.z} not loaded / empty`);
      continue;
    }

    if (!tileHasUid(tile, s.expectUid)) {
      failures.push(
        `${label} @ ${s.x},${s.y},${s.z}: uid ausente; items=${JSON.stringify(tile.items || []).slice(0, 220)}`
      );
    } else {
      oks.push(label);
      console.log(`OK ${label} @ ${s.x},${s.y},${s.z}`);
    }
  }

  await browser.close();
  console.log(`\nSummary: OK=${oks.length} FAIL=${failures.length} total=${samples.length}`);
  if (failures.length) {
    console.error("FAIL:\n" + failures.join("\n"));
    process.exit(1);
  }
  console.log("All principal quest viewer samples OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
