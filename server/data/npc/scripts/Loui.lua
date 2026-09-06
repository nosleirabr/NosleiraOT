local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'BEWARE! Beware of that hole!')
npcHandler:setMessage(MESSAGE_FAREWELL, 'May the gods protect you! And stay away from that hole!')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'May the gods protect you! And stay away from that hole!')
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'They created Tibia and all lifeforms. Talk to other monks and priests to learn more about them.'})
keywordHandler:addKeyword({'rookgaard'}, StdModule.say, {npcHandler = npcHandler, text = 'This is the place where everything starts.'})
keywordHandler:addKeyword({'rat'}, StdModule.say, {npcHandler = npcHandler, text = 'The good thing is, those horrible rats stay in the town mostly. The bad thing is, they do so because outside the bigger Monsters devour them.'})
keywordHandler:addKeyword({'them'}, StdModule.say, {npcHandler = npcHandler, text = 'They were so many, EVERYWHERE! I could barely escape alive. I have no clue what THEY were but one more second down there and I\'d be dead!'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Loui.'})
keywordHandler:addKeyword({'heal'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry I am out of mana and ingredients, please visit Cipfried in the town.'})
keywordHandler:addKeyword({'hole'}, StdModule.say, {npcHandler = npcHandler, text = 'While looking for herbs I found that hole. I went down though I had no torch. And then I heard THEM! There must be dozens!'})
keywordHandler:addKeyword({'gold'}, StdModule.say, {npcHandler = npcHandler, text = 'I am pennyless and poor as it is fit for a humble monk like me.'})
keywordHandler:addKeyword({'obi'}, StdModule.say, {npcHandler = npcHandler, text = 'He owns a shop in the town.'})
keywordHandler:addKeyword({'quest'}, StdModule.say, {npcHandler = npcHandler, text = 'I have no quests but to stay away from that hole and I\'d recomend you to do the same.'})
keywordHandler:addKeyword({'life'}, StdModule.say, {npcHandler = npcHandler, text = 'The gods blessed Tibia with abundant forms of life.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Now, it is the current time, my child.'})
keywordHandler:addKeyword({'rabbit'}, StdModule.say, {npcHandler = npcHandler, text = 'So it must have been some magic wielding beasts using creature illusion. Good thing you escaped.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'Everything around us, that is Tibia.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'There must be an army of them, just down this hole.'})
keywordHandler:addKeyword({'academy'}, StdModule.say, {npcHandler = npcHandler, text = 'Most adventurers take their first steps there.'})
keywordHandler:addKeyword({'herb'}, StdModule.say, {npcHandler = npcHandler, text = 'I was looking for some herbs as I foolishly entered this unholy hole.'})
keywordHandler:addKeyword({'willie'}, StdModule.say, {npcHandler = npcHandler, text = 'The gods may protect me from his foul language.'})
keywordHandler:addKeyword({'monk'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a humble servant of the gods.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am a monk, collecting healing herbs.'})
keywordHandler:addKeyword({'seymour'}, StdModule.say, {npcHandler = npcHandler, text = 'Seymour is the headmaster of the local academy.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

