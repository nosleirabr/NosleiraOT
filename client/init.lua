-- NosleiraOT 7.4 product client (OTClientV8)
-- Server: TFS 1.2 protocol 7.72, numeric account login.

APP_NAME = "nosleiraot-client"
APP_VERSION = 772
DEFAULT_LAYOUT = "retro"

-- No updater, crash reporter, or remote services.
Services = {
  website = "",
  updater = "",
  stats = "",
  crash = "",
  feedback = "",
  status = ""
}

-- ip:port:version only. Do not append feature flags (:25:30:80:90).
Servers = {
  ["NosleiraOT Local"] = "127.0.0.1:7171:772"
}

ALLOW_CUSTOM_SERVERS = false

g_app.setName("NosleiraOT 7.4")
if g_game then
  g_game.setClientVersion(APP_VERSION)
end

-- Developer feature gates (defaults faithful; optional /dev_features.lua override).
dofile('/ot74_dev.lua')

-- CONFIG END

g_logger.info(os.date("== application started at %b %d %Y %X"))
g_logger.info(g_app.getName() .. ' ' .. g_app.getVersion() .. ' rev ' .. g_app.getBuildRevision() .. ' (' .. g_app.getBuildCommit() .. ') made by ' .. g_app.getAuthor() .. ' built on ' .. g_app.getBuildDate() .. ' for arch ' .. g_app.getBuildArch())

if not g_resources.directoryExists("/data") then
  g_logger.fatal("Data dir doesn't exist.")
end

if not g_resources.directoryExists("/modules") then
  g_logger.fatal("Modules dir doesn't exist.")
end

g_configs.loadSettings("/config.otml")

local settings = g_configs.getSettings()
local layout = DEFAULT_LAYOUT
if g_app.isMobile() then
  layout = "mobile"
elseif settings:exists('layout') then
  layout = settings:getValue('layout')
end
g_resources.setLayout(layout)

g_modules.discoverModules()
g_modules.ensureModuleLoaded("corelib")

local function loadModules()
  g_modules.autoLoadModules(99)
  g_modules.ensureModuleLoaded("gamelib")

  g_modules.autoLoadModules(499)
  g_modules.ensureModuleLoaded("client")
  if OT74DevEnabled('luaTerminal') then
    g_modules.ensureModuleLoaded('client_terminal')
  end

  g_modules.autoLoadModules(999)
  g_modules.ensureModuleLoaded("game_interface")

  g_modules.autoLoadModules(9999)
end

loadModules()
pcall(dofile, '/minimap_test.lua')

if g_resources.fileExists('/minimap_gen.lua') then dofile('/minimap_gen.lua') end





