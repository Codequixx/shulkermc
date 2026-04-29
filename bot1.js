const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: 'play.shulkermc.fun',
    port: 25565,
    username: 'Nitishkumarcm',
    version: '1.20.1'
  })

  function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  // ================= LOGS =================
  bot.on('login', () => console.log('✅ Connected'))
  bot.on('spawn', async () => {
    console.log('🚀 Spawned')

    await wait(10000)

    // 🌐 Join Lifesteal
    console.log('➡️ Joining Lifesteal...')
    bot.chat('/server lifesteal')

    await wait(10000)

    console.log('🟢 AFK mode started')
  })

  bot.on('message', (msg) => {
    console.log(msg.toAnsi())
  })

  bot.on('chat', (username, message) => {
    console.log(`[${username}] ${message}`)
  })

  // ================= ANTI-AFK =================
  setInterval(() => {
    bot.setControlState('jump', true)
    setTimeout(() => bot.setControlState('jump', false), 300)
  }, 60000)

  // ================= AUTO RECONNECT =================
  bot.on('end', () => {
    console.log('🔄 Reconnecting in 5s...')
    setTimeout(startBot, 5000)
  })

  bot.on('error', () => {})
}

startBot()