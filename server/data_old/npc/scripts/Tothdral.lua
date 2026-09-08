local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Be mourned, pilgrim in flesh.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Strive for enlightenment, mourned mortal.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Strive for enlightenment, mourned mortal.')
keywordHandler:addKeyword({'ascension'}, StdModule.say, {npcHandler = npcHandler, text = 'The essence of the true gods is omnipresent in the universe. We all share this divine heritage, for every single one of us carries the divine spark inside him. This is the reason we all have a chance to ascend to godhood, too.'})
keywordHandler:addKeyword({'godswar'}, StdModule.say, {npcHandler = npcHandler, text = 'This war brought about the end of the true universe. That which is left now is but a shadow of former glories, a bleak remainder of what once was. The true gods perished and their essence was dispersed throughout the remaining universe.'})
keywordHandler:addKeyword({'mourn'}, StdModule.say, {npcHandler = npcHandler, text = 'The dead mourn the living because they are weak and excluded from ascension.'})
keywordHandler:addKeyword({'oldpharaoh'}, StdModule.say, {npcHandler = npcHandler, text = 'He has been given a chance to ascend. I am sure he will feel nothing but thankfulness for this divine son, our revered pharaoh.'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'Their foolishness is great, but perhaps they still can be saved. If only they listened and accepted the next step to ascension.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'He was so close. ... and still he failed to draw the right conclusions.'})
keywordHandler:addKeyword({'ankrahmun'}, StdModule.say, {npcHandler = npcHandler, text = 'This city is as old as the sands that surround it, and it is built on previous settlements that date back even further in time. Perhaps only the wise scarabs know the full story of this place.'})
keywordHandler:addKeyword({'temple'}, StdModule.say, {npcHandler = npcHandler, text = 'Our temple is a centre of spirituality and learning. The temple and the serpentine tower work hand in hand for the good of all people, whether they are alive or undead.'})
keywordHandler:addKeyword({'palace'}, StdModule.say, {npcHandler = npcHandler, text = 'The residence of the pharaoh should be worshipped just as the pharaoh is worshipped. Don\'t enter until you have business there.'})
keywordHandler:addKeyword({'kazordoon'}, StdModule.say, {npcHandler = npcHandler, text = 'The dwarves should have learned their lessons, but these boneheaded fools still don\'t see there is only one way to escape the false gods\' grasp.'})
keywordHandler:addKeyword({'darama'}, StdModule.say, {npcHandler = npcHandler, text = 'This continent is mostly free from the servants of the false gods. Those who live here may hope to become worthy one day of the first steps towards ascension.'})
keywordHandler:addKeyword({'Rah'}, StdModule.say, {npcHandler = npcHandler, text = 'The Rah is what the ignorant might call the soul. But it\'s more than that. It is the divine spark in all of us, the source of energy that keeps us alive.'})
keywordHandler:addKeyword({'pharaoh'}, StdModule.say, {npcHandler = npcHandler, text = 'The pharaoh was the first to take the ultimate step. He braved death and claimed the godhood that was rightfully his.'})
keywordHandler:addKeyword({'Akh'}, StdModule.say, {npcHandler = npcHandler, text = 'The Akh is a tool. As long as it is alive it is a burden and source of weakness, but if you ascend to undeath it becomes a useful tool that can be used to work towards greater ends.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'This world is only a shadow of the worlds that have been. That was long ago, before the true gods fought each other in the godwars and the false gods rose to claim their heritage.'})
keywordHandler:addKeyword({'spell'}, StdModule.say, {npcHandler = npcHandler, text = 'Sorry, I only sell spells to Sorcerers.'})
keywordHandler:addKeyword({'scarab'}, StdModule.say, {npcHandler = npcHandler, text = 'If you know how to listen to them they will reveal ancient secrets to you.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is your problem. It is no longer mine.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'Those cities that bow to the false gods will fall prey to their treacherous greed sooner or later.'})
keywordHandler:addKeyword({'undead'}, StdModule.say, {npcHandler = npcHandler, text = 'Undeath is an improvement. It is the gateway to goals that are nobler than eating, drinking or other fulfilments of trivial physical needs..'})
keywordHandler:addKeyword({'uthun'}, StdModule.say, {npcHandler = npcHandler, text = 'The Uthun is the part of the trinity that is easiest to form. It consists of our recollections of the past and of our thoughts. It is that which determines who we are in this world and it gives us guidance throughout our existence.'})
keywordHandler:addKeyword({'arena'}, StdModule.say, {npcHandler = npcHandler, text = 'The arena is a suitable distraction for the Uthun of the mortals. It might even serve as a place for them to prove their worth. If they pass the test they may be freed of their mortal shells.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I am the foremost astrologer and supreme magus of this city.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'My name is Tothdral. They call me \'The Seeker Beyond the Grave\'.'})
keywordHandler:addKeyword({'mortality'}, StdModule.say, {npcHandler = npcHandler, text = 'Mortality is your curse. When you are worthy the burden of mortality will be taken from your shoulders.'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

npcHandler:addModule(FocusModule:new())

