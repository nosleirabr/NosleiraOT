function init()
  ProtocolGame.registerExtendedOpcode(101, onExtendedOpcode)
end

function terminate()
  ProtocolGame.unregisterExtendedOpcode(101)
end

function onExtendedOpcode(protocol, opcode, buffer)
  if opcode ~= 101 then return end
  
  local parts = string.split(buffer, ":")
  if #parts < 3 then return end
  
  local windowId = tonumber(parts[1])
  local slot = tonumber(parts[2])
  
  -- Reconstruct text in case it contained colons (e.g. 15:30)
  local text = parts[3]
  for i = 4, #parts do
    text = text .. ":" .. parts[i]
  end
  
  local itemWidget = nil
  
  if windowId == 255 then
    -- Inventory slot
    if modules.game_inventory and modules.game_inventory.inventoryPanel then
      itemWidget = modules.game_inventory.inventoryPanel:getChildById('slot' .. slot)
    end
  else
    -- Container slot
    if modules.game_containers then
      local container = g_game.getContainer(windowId)
      if container and container.itemsPanel then
        itemWidget = container.itemsPanel:getChildById('item' .. slot)
      end
    end
  end
  
  if itemWidget then
    itemWidget:setText(text)
    itemWidget:setTextAlign(AlignBottomRight)
    itemWidget:setFont('cipsoftFont')
    itemWidget:setTextOffset({x=-2, y=-1})
  end
end
