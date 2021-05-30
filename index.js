const mineflayer = require('mineflayer')
const dotenv = require("dotenv");
const Vec3 = require('vec3');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow

dotenv.config();

let userName = process.env.USER_NAME;


if (process.argv.length < 4 || process.argv.length > 6) {
  console.log("ERROR OCCURED")
  console.log('Usage : node index.js <host> <port> [<UserName>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'MineAssist',
  version: "1.16.5",
})

bot.loadPlugin(pathfinder);

let blockAt = (x, y, z) => bot.blockAt(new Vec3(x, y, z));

let mcData;

bot.on('inject_allowed', () => {
  mcData = require('minecraft-data')(bot.version)
})


bot.on('spawn', () => {
  return bot.chat("/login " + process.env.PASSWORD)
})

Say("Hi ;)")

function followPlayer(param) {
  const MIplayer = bot.players[userName]

  if (!MIplayer || !MIplayer.entity) {
    return Say("I can't see You!")
  }

  const movements = new Movements(bot, mcData)
  movements.scafoldingBlocks = []

  bot.pathfinder.setMovements(movements)

  const goal = new GoalFollow(MIplayer.entity, 1)
  if (param === 'follow') {
    bot.pathfinder.setGoal(goal, true)
  } else {
    bot.pathfinder.setGoal(goal)
  }

}


bot.on('chat', (username, message) => {

  if (username == userName && message == 'stand here') {
    Say("Coming...");
    followPlayer()
  }

  if (username == userName && message == 'lol') {
    Say("LOL");
  }

  if (username == userName && message == 'follow me') {
    Say("Ok");
    followPlayer("follow")
  }

  if (username == userName && message == 'place') {
    Say("Placing blocks...")
    setInterval(() => startClicking(), 2000);
    // startClicking()
  }
})

const onBlockPlace = (error) => console.log(error);

async function startClicking() {
  await bot.equip(mcData.itemsByName.acacia_sapling.id, 'hand');
  await bot.placeBlock(blockAt(-276, 67, -69), new Vec3(0, 1, 0), onBlockPlace);
}

function Say(msg) {
  return setTimeout(() => bot.chat(msg), 1500)
}

bot.on('kicked', (res) => console.log("kicked :", res))
bot.on('death', () => console.log("BOT Experienced Death!"))
bot.on('error', (error) => console.log("ERROR Occured :", error))

