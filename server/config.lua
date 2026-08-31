-- Combat settings
-- NOTE: valid values for worldType are: "pvp", "no-pvp" and "pvp-enforced"
worldType = "pvp"
protectionLevel = 1
killsToRedSkull = 3
dailyKillsToRedSkull = 3
weeklyKillsToRedSkull = 5
monthlyKillsToRedSkull = 10
killsToBlackSkull = 6
dailyKillsToBanishment = 6
weeklyKillsToBanishment = 10
monthlyKillsToBanishment = 20
redSkullLength = 15 * 24 * 60 * 60
banLength = 30 * 24 * 60 * 60
pzLocked = 60000
removeChargesFromRunes = true
timeToDecreaseFrags = 24 * 60 * 60 * 1000
whiteSkullTime = 15 * 60 * 1000
stairJumpExhaustion = 0
experienceByKillingPlayers = false
expFromPlayersLevelRange = 75
allowFightBack = true

-- Connection Config
-- NOTE: maxPlayers set to 0 means no limit
ip = "127.0.0.1"
bindOnlyGlobalAddress = false
loginProtocolPort = 7171
gameProtocolPort = 7172
statusProtocolPort = 7171
maxPlayers = 0
motd = "Welcome to Global-War!"
onePlayerOnlinePerAccount = true
allowClones = false
serverName = "Global-War"
statusTimeout = 5000
replaceKickOnLogin = true
maxPacketsPerSecond = 25

-- Deaths
-- NOTE: Leave deathLosePercent as -1 if you want to use the default
-- death penalty formula. For the old formula, set it to 10. For
-- no skill/experience loss, set it to 0.
deathLosePercent = -1

-- Houses
-- NOTE: set housePriceEachSQM to -1 to disable the ingame buy house functionality
housePriceEachSQM = 1000
houseRentPeriod = "never"
houseAntiTrash = false

-- Item Usage
timeBetweenActions = 200
timeBetweenExActions = 2000

-- Map
-- NOTE: set mapName WITHOUT .otbm at the end
mapName = "world"
mapAuthor = "ond"

-- MySQL
mysqlHost = "mysql"
mysqlUser = "ot74"
mysqlPass = "ot74"
mysqlDatabase = "ot74"
mysqlPort = 3306
mysqlSock = ""
passwordType = "sha1"

-- Misc.
allowChangeOutfit = true
freePremium = false
kickIdlePlayerAfterMinutes = 15
maxMessageBuffer = 4
emoteSpells = false
classicEquipmentSlots = true
hotkeyAimbotEnabled = false
UHTrap = true
-- Can walk/push over 2 items with height attribute (Parcels, boxes etc.)
heightStackBlock = true

-- Rates
-- NOTE: rateExp is not used if you have enabled stages in data/XML/stages.xml
rateExp = 1
rateSkill = 1
rateLoot = 1
rateMagic = 1
rateSpawn = 1

-- Monsters
deSpawnRange = 2
deSpawnRadius = 0

-- Scripts
warnUnsafeScripts = true
convertUnsafeScripts = true

-- Startup
-- NOTE: defaultPriority only works on Windows and sets process
-- priority, valid values are: "normal", "above-normal", "high"
defaultPriority = "high"
startupDatabaseOptimization = false

-- Status server information
ownerName = ""
ownerEmail = ""
url = "https://otland.net/"
location = "Sweden"


