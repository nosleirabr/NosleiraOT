MainMenu = {}

-- private variables
local background
local mainMenuPanel
local mainMenuButtons
local clientVersionLabel
local infoWindow

local function showMainMenu()
  if mainMenuPanel then
    mainMenuPanel:show()
  end
  if mainMenuButtons then
    mainMenuButtons:show()
  end
end

local function hideMainMenu()
  if mainMenuPanel then
    mainMenuPanel:hide()
  end
  if mainMenuButtons then
    mainMenuButtons:hide()
  end
end

function MainMenu.onEnterGame()
  if g_game.isOnline() then
    if CharacterList then
      CharacterList.show()
    end
    return
  end
  if EnterGame then
    EnterGame.show()
  end
end

function MainMenu.onAccessAccount()
  displayInfoBox(tr('Access Account'), tr('Em construção'))
end

function MainMenu.onOptions()
  if modules.client_options then
    modules.client_options.toggle()
  end
end

function MainMenu.onInfo()
  if infoWindow then return end
  infoWindow = g_ui.displayUI('info.otui')
  
  -- Para que o botÃƒÂ£o OK de fato destrua a janela:
  local okButton = infoWindow:getChildById('okButton')
  okButton.onClick = function() infoWindow:destroy(); infoWindow = nil end
  infoWindow.onDestroy = function() infoWindow = nil end
end

function MainMenu.onExit()
  g_app.exit()
end

function MainMenu.show()
  showMainMenu()
end

function MainMenu.hide()
  hideMainMenu()
end

-- public functions
function init()
  background = g_ui.displayUI('background')
  background:lower()

  mainMenuPanel = background:getChildById('mainMenuPanel')
  mainMenuButtons = background:getChildById('mainMenuButtons')
  clientVersionLabel = background:getChildById('clientVersionLabel')

  if OT74DevEnabled('loginBranding') then
    clientVersionLabel:setText('OTClientV8 ' .. g_app.getVersion() .. '\nrev ' .. g_app.getBuildRevision() .. '\nMade by:\n' .. g_app.getAuthor() .. "")
    if not g_game.isOnline() then
      addEvent(function() g_effects.fadeIn(clientVersionLabel, 1500) end)
    end
  else
    clientVersionLabel:hide()
  end

  connect(g_game, { onGameStart = hide })
  connect(g_game, { onGameEnd = show })
end

function terminate()
  disconnect(g_game, { onGameStart = hide })
  disconnect(g_game, { onGameEnd = show })

  g_effects.cancelFade(background:getChildById('clientVersionLabel'))
  background:destroy()

  Background = nil
  MainMenu = nil
end

function hide()
  background:hide()
end

function show()
  background:show()
  if not g_game.isOnline() then
    showMainMenu()
  end
end

function hideVersionLabel()
  background:getChildById('clientVersionLabel'):hide()
end

function setVersionText(text)
  clientVersionLabel:setText(text)
end

function getBackground()
  return background
end

