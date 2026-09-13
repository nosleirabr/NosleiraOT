-- OT74 developer feature gates (defaults = end-user / 7.4-faithful).
-- End users must never ship a custom override. Developers may place
-- `/dev_features.lua` next to this client (gitignored) to re-enable items
-- while stripping them one-by-one. See `dev_features.lua.example`.

OT74Dev = {
  -- Automation / cheats
  bot = false,              -- vBot / modules/game_bot + GameBot
  lightHack = false,        -- ambient fullbright / disable darkness

  -- Modern HUD (not in CipSoft 7.4)
  actionBars = true,        -- modules/game_actionbar
  topBar = true,            -- modules/game_topbar (Tibia 12)
  healthOverlays = true,    -- top HP/mana bars + circles in game_healthinfo
  fpsPingOverlay = true,    -- game_stats / showFps / showPing

  -- Post-7.4 / OT-only systems still present in the tree
  questLog = true,          -- game_questlog (quest log = 7.9+)
  cooldownWidgets = true,   -- game_cooldown
  profiles = true,          -- client_profiles
  shaders = true,           -- game_shaders
  clientFeedback = false,   -- client_feedback telemetry UI
  mobileUi = false,         -- client_mobile
  luaTerminal = false,      -- client_terminal (Ctrl+T)
  imbuingSystem = false,    -- game_imbuing (imbuements = 12.x+)
  preySystem = false,       -- game_prey (prey = 10.x+)
  marketSystem = false,     -- game_market (market = 9.x+)
  spellList = true,         -- game_spelllist (spell list UI pós-7.4)
  unjustifiedPoints = false,-- game_unjustifiedpoints (sistema pós-7.4)

  -- Tela inicial / login (CipSoft 7.4)
  loginTopMenu = false,     -- barra superior OTC fora do jogo
  loginBranding = false,    -- créditos OTClientV8 no background
}

function OT74DevEnabled(key)
  return OT74Dev and OT74Dev[key] == true
end

-- Optional local override (never commit). Returns a table of keys to set true/false.
if g_resources.fileExists('/dev_features.lua') then
  local ok, patch = pcall(function()
    return dofile('/dev_features.lua')
  end)
  if ok and type(patch) == 'table' then
    for k, v in pairs(patch) do
      if OT74Dev[k] ~= nil then
        OT74Dev[k] = not not v
      end
    end
    g_logger.info('OT74Dev: loaded /dev_features.lua override')
  elseif not ok then
    g_logger.error('OT74Dev: failed to load /dev_features.lua: ' .. tostring(patch))
  end
end
