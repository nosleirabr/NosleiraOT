local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, '... Greeeeeetiiiingssss...')
npcHandler:setMessage(MESSAGE_FAREWELL, '... Good... Bye')
npcHandler:setMessage(MESSAGE_WALKAWAY, '... Good... Bye')
keywordHandler:addKeyword({'vladruc'}, StdModule.say, {npcHandler = npcHandler, text = '... Maaaaassssterrrrr'})
keywordHandler:addKeyword({'news'}, StdModule.say, {npcHandler = npcHandler, text = '... more spells...'})
keywordHandler:addKeyword({'market'}, StdModule.say, {npcHandler = npcHandler, text = '... You buy?'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = '... Smiley'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = '... Time?... Not important... anymore.'})
keywordHandler:addKeyword({'ferumbras'}, StdModule.say, {npcHandler = npcHandler, text = '... un...important'})
keywordHandler:addKeyword({'spellbook'}, StdModule.say, {npcHandler = npcHandler, text = '... You buy book... store spells... other counter...'})
keywordHandler:addKeyword({'sorcerer'}, StdModule.say, {npcHandler = npcHandler, text = '... Ask Chatterbone?'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = '...'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = '... Only druids...'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = '... Selling Spells'})
keywordHandler:addKeyword({'druid'}, StdModule.say, {npcHandler = npcHandler, text = '... You... buy spells?'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = '... only sell spells...'})
keywordHandler:addKeyword({'rune'}, StdModule.say, {npcHandler = npcHandler, text = '... Runes... mighty stones... other counter...'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

