const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: 'play.mangosmp.in',
    port: 25565,
    username: 'Harryputtar391',
    version: '1.20.1'
  })

  const PASSWORD = 'Jeet001'

  function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  // ================= LOGS =================
  bot.on('login', () => console.log('✅ Connected'))
  bot.on('spawn', async () => {
    console.log('🚀 Spawned')

    // 🔥 WAIT FOR SERVER LOAD
    await wait(12000)

    // 🔐 LOGIN (FORCED)
    console.log('🔐 Sending login...')
    bot.chat(`/login ${PASSWORD}`)

    await wait(6000)

    // 🌐 JOIN SERVER
    console.log('➡️ Joining Lifesteal...')
    bot.chat('/server lifesteal')

    await wait(8000)

    console.log('🟢 AFK mode started')

    // ================= AUTO DROP LOOP =================
    setInterval(() => {
      dropAllItems()
    }, 60000)
  })

  // ================= DROP FUNCTION =================
  async function dropAllItems() {
    const items = bot.inventory.items()

    if (items.length === 0) {
      console.log('📭 Inventory empty')
      return
    }

    console.log('📦 Dropping all items...')

    for (const item of items) {
      try {
        await bot.tossStack(item)
        await wait(200)
      } catch {
        console.log('❌ Failed dropping item')
      }
    }

    console.log('✅ Inventory cleared')
  }

  // ================= CHAT LOGS =================
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
