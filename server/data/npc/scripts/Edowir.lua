local keywordHandler = KeywordHandler:new()
local npcHandler = NpcHandler:new(keywordHandler)
NpcSystem.parseParameters(npcHandler)

function onCreatureAppear(cid)			npcHandler:onCreatureAppear(cid)			end
function onCreatureDisappear(cid)		npcHandler:onCreatureDisappear(cid)			end
function onCreatureSay(cid, type, msg)	npcHandler:onCreatureSay(cid, type, msg)	end
function onThink()						npcHandler:onThink()						end
npcHandler:setMessage(MESSAGE_GREET, 'Oh, hello |PLAYERNAME|! How nice of you to visit an old man like me.')
npcHandler:setMessage(MESSAGE_FAREWELL, 'Come back whenever you\'re in need of wisdom.')
npcHandler:setMessage(MESSAGE_WALKAWAY, 'Come back whenever you\'re in need of wisdom.')
keywordHandler:addKeyword({'elane'}, StdModule.say, {npcHandler = npcHandler, text = 'A paladin is more than just a knight armed with a bow and some spells, though most seem to be unaware of that fact.'})
keywordHandler:addKeyword({'powerring'}, StdModule.say, {npcHandler = npcHandler, text = 'This kind of ring will increase your skill when fighting with bare hands.'})
keywordHandler:addKeyword({'Zatragil'}, StdModule.say, {npcHandler = npcHandler, text = 'The so called dreamsilver is a legendary metal. Almost everything we know about it are rumours only.'})
keywordHandler:addKeyword({'sewer'}, StdModule.say, {npcHandler = npcHandler, text = 'Sewers are sometimes the safer ways to get where you want to.'})
keywordHandler:addKeyword({'time'}, StdModule.say, {npcHandler = npcHandler, text = 'Time is a pillar and our lives wind around it like vine.'})
keywordHandler:addKeyword({'thais'}, StdModule.say, {npcHandler = npcHandler, text = 'Thais is the capital of an ancient human kingdom. Once its rule was more or less undisputed. In the years the strength of the thaian kingdom eroded by different events.'})
keywordHandler:addKeyword({'demon'}, StdModule.say, {npcHandler = npcHandler, text = 'Demons are the servants of evil. More or less devoted servers of Zathroth they cause strife and havoc wherever they appear. Their masters are known as Demonlords, Demon Overlords and Archdemons.'})
keywordHandler:addKeyword({'blog'}, StdModule.say, {npcHandler = npcHandler, text = 'Blog is the god of rage and fierce battle. Hes also the patron of power, although a power to opress and bully others around. He is the son of Zathroth and one of the tibian suns.'})
keywordHandler:addKeyword({'excalibug'}, StdModule.say, {npcHandler = npcHandler, text = 'The ancient dwarfen kings forged it using magic metal , which they took from cyclopses who found it in the heart of a fallen star.'})
keywordHandler:addKeyword({'tibia'}, StdModule.say, {npcHandler = npcHandler, text = 'If Tibia is a fallen god, does that makes us the maggots crawling on it?'})
keywordHandler:addKeyword({'darama'}, StdModule.say, {npcHandler = npcHandler, text = 'The desert lands of Darama are harsh and unforgiving. Therefore Daraman led his people there to found a new community based upon his teachings.'})
keywordHandler:addKeyword({'abdaisim'}, StdModule.say, {npcHandler = npcHandler, text = 'The Abdaisim are what humans would call \'independent elves\'. They take shelter wherever they might find it, are wanderers and explorers. They only keep loose contact with the elven society.'})
keywordHandler:addKeyword({'ridler'}, StdModule.say, {npcHandler = npcHandler, text = 'As far as I can tell this creature is not fond of cheaters and wont allow them to pass his tests.'})
keywordHandler:addKeyword({'god'}, StdModule.say, {npcHandler = npcHandler, text = 'Learn about the gods to learn from the gods.'})
keywordHandler:addKeyword({'rookgaard'}, StdModule.say, {npcHandler = npcHandler, text = 'It was on rookgaard where the soul vortex appeared. The Thaian kingdom holds an outpost there to protect the vortex and to guide the newly arrived souls.'})
keywordHandler:addKeyword({'rumour'}, StdModule.say, {npcHandler = npcHandler, text = 'Rumours are an unsafe path to follow.'})
keywordHandler:addKeyword({'endulos'}, StdModule.say, {npcHandler = npcHandler, text = 'Endulos was not a great warrior, but a man of wit and genius. After many of his brethren of the Nightmare Knights had fallen prey to the beast, he came up with a cunning plan to end that threat.'})
keywordHandler:addKeyword({'kuridai'}, StdModule.say, {npcHandler = npcHandler, text = 'The Kuridai are the craftsmen and warriors of elvenkind. They are allways moving, allways sheming. They are the most agressive elves and distrust outsiders. An utsider might be each non-Kuridai to them.'})
keywordHandler:addKeyword({'zathroth'}, StdModule.say, {npcHandler = npcHandler, text = 'Uman is the light twin of Zathroth. Their unity and seperatuion at once is a concept we cannot hope to grasp. He is the patron of light magic, the knowledge that beniefits all and brings progress to the society.'})
keywordHandler:addKeyword({'old'}, StdModule.say, {npcHandler = npcHandler, text = 'Growing old is mandatory, growing up is optional.'})
keywordHandler:addKeyword({'daraman'}, StdModule.say, {npcHandler = npcHandler, text = 'Daraman was a sage with ambition, that is for sure. His philosophy centered around the idea that by controlling yourself you could improve yourself. The closer you are coming to perfection, the closer you are to ascension to divinity.'})
keywordHandler:addKeyword({'sell'}, StdModule.say, {npcHandler = npcHandler, text = 'I sell nothing, but I share my wisdom now and then.'})
keywordHandler:addKeyword({'gabel'}, StdModule.say, {npcHandler = npcHandler, text = 'Gabel was the most powerful among the Djinn lords. He was cruel and merciless, until one day his minions brought a certain human to him whom they had captured and tortured.'})
keywordHandler:addKeyword({'castes'}, StdModule.say, {npcHandler = npcHandler, text = 'The elven society is divdided into certain cates, the cenath, the kuridai, the deaisim, the abdaisim and the legendary theshial.'})
keywordHandler:addKeyword({'job'}, StdModule.say, {npcHandler = npcHandler, text = 'I gather wisdom and knowledge. I am also an astrologer.'})
keywordHandler:addKeyword({'teshial'}, StdModule.say, {npcHandler = npcHandler, text = 'Its said that those elves were the masters of the dreams. Which many consider as a special brand of magic. However they seem to have vanished from the face of tibia ages ago and their fate is unknown.'})
keywordHandler:addKeyword({'plan'}, StdModule.say, {npcHandler = npcHandler, text = 'He lured Hugo into a trap. Bound by roots and stones charged with powerful magic he could not move anymore. Now, the beast lies trapped in a hidden cave for eternity.'})
keywordHandler:addKeyword({'deraisim'}, StdModule.say, {npcHandler = npcHandler, text = 'One could call the Deraisim the scouts and rangers of elvenkind. Although all elves are formidable in that area, the Deraisim excell them all.'})
keywordHandler:addKeyword({'archdemons'}, StdModule.say, {npcHandler = npcHandler, text = 'The archdemons are few, and they are extremely rare. And a good thing, too, for they are the rulers of the demonrace. They are vain and powerhungry creatures who tend to form only small cabals and fight each other instead of allying up against creation.'})
keywordHandler:addKeyword({'goshnar'}, StdModule.say, {npcHandler = npcHandler, text = 'The Necromant King. He is dead forever, and that is the nicest thing I can say about him. May he rot in his tomb.'})
keywordHandler:addKeyword({'masterpiece'}, StdModule.say, {npcHandler = npcHandler, text = 'Zathroth channeled all the hatred and foulness he could muster. He added the burning rage of his son Blog and mixed it with fire. The energy that was released destroyed the chalice, but Zathroth had succeeded in creating the first demon.'})
keywordHandler:addKeyword({'stealthring'}, StdModule.say, {npcHandler = npcHandler, text = 'These rings were created by an ancient, long forgotten race. It is said they valued secrecy above all. They used these magic rings to make themselves invisible.'})
keywordHandler:addKeyword({'lifering'}, StdModule.say, {npcHandler = npcHandler, text = 'These rings improve your regenerative powers, accelerating the recovery of both your mana and your lifeforce.'})
keywordHandler:addKeyword({'timering'}, StdModule.say, {npcHandler = npcHandler, text = 'These rings warp the fabric of time, greatly enhancing your running speed.'})
keywordHandler:addKeyword({'castle'}, StdModule.say, {npcHandler = npcHandler, text = 'A strong wall may protect from an assault, but what will protect you from the enemy within?'})
keywordHandler:addKeyword({'defile'}, StdModule.say, {npcHandler = npcHandler, text = 'Whatever the original meaning of that underground complex was, it is now like an open wound in the nearby lands, spreading madness and attracting all kinds of ghosts and apparitions.'})
keywordHandler:addKeyword({'cenath'}, StdModule.say, {npcHandler = npcHandler, text = 'The cenath favour magic above all other. They are the keeper of elven lore and wisdom. They are resposible for the astounding feats of druidic magic the elves are capable of.'})
keywordHandler:addKeyword({'king'}, StdModule.say, {npcHandler = npcHandler, text = 'Kings are children adorned with crowns.'})
keywordHandler:addKeyword({'dungeon'}, StdModule.say, {npcHandler = npcHandler, text = 'Dungeons are a place of danger, not of joy. Keep that in mind on your travels.'})
keywordHandler:addKeyword({'hugo'}, StdModule.say, {npcHandler = npcHandler, text = 'I think you are referring to the beast Hugo that is said to still haunt the Plains of Havoc. The legends which tell of this creature are ancient and almost forgotten.'})
keywordHandler:addKeyword({'help'}, StdModule.say, {npcHandler = npcHandler, text = 'I would like to help you. What is your problem?'})
keywordHandler:addKeyword({'clubring'}, StdModule.say, {npcHandler = npcHandler, text = 'This ring will increase your skill when wielding a club weapon.'})
keywordHandler:addKeyword({'fuck'}, StdModule.say, {npcHandler = npcHandler, text = 'If that\'s all you can think about...'})
keywordHandler:addKeyword({'magic'}, StdModule.say, {npcHandler = npcHandler, text = 'I believe that true love is stronger than all magic, don\'t you agree?'})
keywordHandler:addKeyword({'darashia'}, StdModule.say, {npcHandler = npcHandler, text = 'The town of Darashia is built around one of the few sweet water supplies of Darama. It is famous for its sand wasp honey and its sandworm stew.'})
keywordHandler:addKeyword({'ghostland'}, StdModule.say, {npcHandler = npcHandler, text = 'The Ghostlands are haunted by their past. In bygone days some ancient race lived there. Deep beneath the earth some of their structures are still intact and defile the surrounding lands.'})
keywordHandler:addKeyword({'cyclops'}, StdModule.say, {npcHandler = npcHandler, text = 'Cyclopses are seen as the smithes of blog, whom they call \'the ragehammer\' or \'ragehammerer\'. Indeed their skills create mostly crude and nasty looking weapons and armor which are incredicle effective nontheles.'})
keywordHandler:addKeyword({'demonlords'}, StdModule.say, {npcHandler = npcHandler, text = 'Demonlords are the generals of their kind. They are more cunning than ordinary demons, and they can channel their hatred more effectively than their lesser brethren, making them even more formidable opponents.'})
keywordHandler:addKeyword({'mintwallin'}, StdModule.say, {npcHandler = npcHandler, text = 'The underground city of the minotaurs can be reached through a dangerous passage from the old temple.'})
keywordHandler:addKeyword({'drefia'}, StdModule.say, {npcHandler = npcHandler, text = 'The dreaded town of Drefia was once a haven for heretics, necromancers and demon worshipper. Its was destroyed in the war of the Djinn.'})
keywordHandler:addKeyword({'edron'}, StdModule.say, {npcHandler = npcHandler, text = 'Edron is the latest colony of the Thaian kingdom. However, structures of an earlier colonisation have been found. We cannot tell if those inhabitants were human or of any other known race.'})
keywordHandler:addKeyword({'swordring'}, StdModule.say, {npcHandler = npcHandler, text = 'This ring will increase your skill when wielding swords.'})
keywordHandler:addKeyword({'necromant'}, StdModule.say, {npcHandler = npcHandler, text = 'How could they try to understand death, if they don\'t care to understand life?'})
keywordHandler:addKeyword({'dwarf'}, StdModule.say, {npcHandler = npcHandler, text = 'The small but strong dwarves are tireless workers and fierce warriors. They are familiar with several crafts and mastered most of them. In our days their smithing skills are rivaled only by those of the cyclopses.'})
keywordHandler:addKeyword({'kazordoon'}, StdModule.say, {npcHandler = npcHandler, text = 'The ancient fortrescity of the dwarf was carved into the mountain known as \'the big old one\'. Its quite hidden and heavily guarded to withstand any assault.'})
keywordHandler:addKeyword({'marvik'}, StdModule.say, {npcHandler = npcHandler, text = 'Druids seek enlightenment in nature, but they often just find what they brought with them.'})
keywordHandler:addKeyword({'edowir'}, StdModule.say, {npcHandler = npcHandler, text = 'That\'s me, but don\'t worry about remembering my name. I will forget your name as well.'})
keywordHandler:addKeyword({'banshee'}, StdModule.say, {npcHandler = npcHandler, text = 'The banshees were creatures that grief and despair turned into vengefull spirits after their deaths. Their wail is deadly and they draw new strength from the pain and fear of others.'})
keywordHandler:addKeyword({'malor'}, StdModule.say, {npcHandler = npcHandler, text = 'Malor was second in power only to Gabel and his followers among the Djinn were many. It was not easy for the evil Djinn to change their ways, and many preferred to follow Malor instead of Gabel. In the end a civil war erupted.'})
keywordHandler:addKeyword({'axering'}, StdModule.say, {npcHandler = npcHandler, text = 'This ring will increase your skill when wielding any kind of axe.'})
keywordHandler:addKeyword({'dwarvenring'}, StdModule.say, {npcHandler = npcHandler, text = 'Actually rings of this kind are not created by dwarves. However, if you wear one you can drink as though you were a dwarf. They give you partial immunity against drunkenness.'})
keywordHandler:addKeyword({'sternum'}, StdModule.say, {npcHandler = npcHandler, text = 'Behind the mountain lies a land of great danger.'})
keywordHandler:addKeyword({'gregor'}, StdModule.say, {npcHandler = npcHandler, text = 'Knights could be artists, but tend to become sellswords.'})
keywordHandler:addKeyword({'carlin'}, StdModule.say, {npcHandler = npcHandler, text = 'A city in the far north. It separated from the Thaian kingdom about 100 years ago. Now it is ruled by a dynasty of queens.'})
keywordHandler:addKeyword({'legend'}, StdModule.say, {npcHandler = npcHandler, text = 'As far as we know, once a terrible beast roamed the lands we now call the Plains of Havoc. It was so fierce that no one dared to even dream about killing it. Finally it was tricked by the knight Endulos.'})
keywordHandler:addKeyword({'monster'}, StdModule.say, {npcHandler = npcHandler, text = 'Man or monster, the difference is often just a matter of hides and scales.'})
keywordHandler:addKeyword({'energyring'}, StdModule.say, {npcHandler = npcHandler, text = 'These rings were created by the sorcerers\' guilds of old. They temporarily provide their wielders with a shield of magic.'})
keywordHandler:addKeyword({'Shadowthorn'}, StdModule.say, {npcHandler = npcHandler, text = 'The elves of shadowthorn are hosile to intruders. Their Kuridai leaders practise some sinister cults and the other castes are more their minions then their equals.'})
keywordHandler:addKeyword({'mightring'}, StdModule.say, {npcHandler = npcHandler, text = 'This ring will give you limited protection against any kind of damage.'})
keywordHandler:addKeyword({'venore'}, StdModule.say, {npcHandler = npcHandler, text = 'The swamp city is a center of commerce and known for it riches and its merchant barons. It is part of the Thaian kingdom.'})
keywordHandler:addKeyword({'philosophy'}, StdModule.say, {npcHandler = npcHandler, text = 'The human whom the Djinn had caught was none other but Daraman. The mighty Gabel was intrigued by his philosophy an changed his ways according to Daramans teachings.'})
keywordHandler:addKeyword({'cabals'}, StdModule.say, {npcHandler = npcHandler, text = 'There are at least five demonic cabals of archdemons. The ruthless seven are the most prominent and powerful.'})
keywordHandler:addKeyword({'djinn'}, StdModule.say, {npcHandler = npcHandler, text = 'Legend has it that the Djinn were created by Zathroth by using the stolen chalice of life. They roamed the world for Aeons causing strife and despair until Gabel, one of their lords met a very special human.'})
keywordHandler:addKeyword({'name'}, StdModule.say, {npcHandler = npcHandler, text = 'I am Edowir, but don\'t worry about remembering my name. I will forget your name as well.'})
keywordHandler:addKeyword({'ghostlands'}, StdModule.say, {npcHandler = npcHandler, text = 'The ancient structures that were found deep beneath the ghostlands were built by an unkown race for an unknown purpose. Its quite certain that, whatever they were once used for, they now cause madness and ghost sightings in the sourounding area.'})
keywordHandler:addKeyword({'bozo'}, StdModule.say, {npcHandler = npcHandler, text = 'Who laughs last, thinks slowest.'})
keywordHandler:addKeyword({'weapon'}, StdModule.say, {npcHandler = npcHandler, text = 'Those who live by the sword get shot by those who don\'t.'})
keywordHandler:addKeyword({'teachings'}, StdModule.say, {npcHandler = npcHandler, text = 'The teachings of asceticism, inner peace and ascension appealed to the Djinn, although in the beginning this was probably only because of his vanity and his greed for divinity. However, Malor and his followers opposed him.'})
keywordHandler:addKeyword({'cave'}, StdModule.say, {npcHandler = npcHandler, text = 'The legends tell us that the Nightmare Knights trapped it beneath one of their fortresses, or rather that they built a fortress on top of his eternal prison.'})
keywordHandler:addKeyword({'muriel'}, StdModule.say, {npcHandler = npcHandler, text = 'Mages claim to be be wise, but how wise can it be to sacrifice your life to books and scrolls and not for the people?'})

local shopModule = ShopModule:new()
npcHandler:addModule(shopModule)

local function creatureSayCallback(cid, type, msg)
    if not npcHandler:isFocused(cid) then return false end
    local player = Player(cid)
    local cost = 10000
    if msgcontains(msg, 'spiritual') then
        npcHandler:say('Do you wish to receive the spiritual shielding for 10000 gold?', cid)
        npcHandler.topic[cid] = 1
    elseif msgcontains(msg, 'yes') and npcHandler.topic[cid] == 1 then
        if player:hasBlessing(1) then
            npcHandler:say('You already possess this blessing.', cid)
        elseif player:removeMoney(cost) then
            player:addBlessing(1)
            player:getPosition():sendMagicEffect(CONST_ME_MAGIC_BLUE)
            npcHandler:say('So receive the spiritual shielding, pilgrim.', cid)
        else
            npcHandler:say('Oh. You do not have enough money.', cid)
        end
        npcHandler.topic[cid] = 0
    elseif msgcontains(msg, 'no') and npcHandler.topic[cid] == 1 then
        npcHandler:say('Ok. May the gods protect you.', cid)
        npcHandler.topic[cid] = 0
    end
    return true
end

npcHandler:setCallback(CALLBACK_MESSAGE_DEFAULT, creatureSayCallback)

local focusModule = FocusModule:new()
focusModule:addGreetMessage('hi')
focusModule:addGreetMessage('hello')
npcHandler:addModule(focusModule)


