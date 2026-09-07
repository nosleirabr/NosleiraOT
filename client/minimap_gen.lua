print('--- STARTING EXPLORATION ---')
g_minimap.clean()
g_things.loadOtb('/data/items.otb')
g_map.loadOtbm('/data/world.otbm')
for z = 0, 15 do
  for x = 32000, 33300, 14 do
    for y = 31500, 32900, 14 do
      g_map.setCentralPosition({x=x, y=y, z=z})
    end
  end
end
g_minimap.saveOtmm('/minimap.otmm')
print('--- FINISHED EXPLORATION ---')
