const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: 'play.shulkermc.fun',
    port: 25565,
    username: 'Joonathanjodd',
    version: '1.20.1'
  })

  const PASSWORD = 'Jeet001'

  function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  let loggedIn = false

  // ================= LOGS =================
  bot.on('login', () => console.log('✅ Connected'))

  bot.on('spawn', () => {
    console.log('🚀 Spawned')
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

  // ================= SMART LOGIN =================
  bot.on('message', async (msg) => {
    const text = msg.toString()

    console.log(msg.toAnsi())

    if (text.toLowerCase().includes('login') && !loggedIn) {
      console.log('🔐 Detected login prompt, sending login...')

      bot.chat(`/login ${PASSWORD}`)
      loggedIn = true

      await wait(6000)

      console.log('➡️ Joining Lifesteal...')
      bot.chat('/server lifesteal')

      await wait(10000)

      console.log('🟢 AFK mode started')

      // 🔥 START AUTO DROP LOOP
      setInterval(() => {
        dropAllItems()
      }, 60000)
    }
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
