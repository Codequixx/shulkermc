const mineflayer = require('mineflayer')

let reconnecting = false

function startBot() {

  const bot = mineflayer.createBot({
    host: 'java.shulkermc.fun',
    port: 19132,
    username: 'Joonathanjodd',
    version: '1.20.1'
  })

  const PASSWORD = 'Jeet001'

  function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  let started = false
  let dropLoop = null

  // ================= LOGS =================
  bot.on('login', () => console.log('✅ Connected'))

  bot.once('spawn', async () => {
    if (started) return
    started = true

    console.log('🚀 Spawned')

    await wait(12000)

    // 🔐 LOGIN
    console.log('🔐 Sending login...')
    bot.chat(`/login ${PASSWORD}`)

    await wait(6000)

    // 🌐 JOIN SERVER
    console.log('➡️ Joining Lifesteal...')
    bot.chat('/server lifesteal')

    await wait(8000)

    console.log('🟢 AFK mode started')

    // ================= AUTO DROP LOOP =================
    dropLoop = setInterval(async () => {
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
        } catch {}
      }

      console.log('✅ Inventory cleared')

    }, 60000)
  })

  // ================= CHAT LOGS =================
  bot.on('message', (msg) => {
    console.log(msg.toAnsi())
  })

  // ================= ANTI AFK =================
  const afkLoop = setInterval(() => {
    if (!bot.entity) return

    bot.setControlState('jump', true)

    setTimeout(() => {
      bot.setControlState('jump', false)
    }, 300)

  }, 60000)

  // ================= CLEAN RECONNECT =================
  bot.on('end', () => {

    clearInterval(afkLoop)

    if (dropLoop) clearInterval(dropLoop)

    if (reconnecting) return
    reconnecting = true

    console.log('🔄 Reconnecting in 5s...')

    setTimeout(() => {
      reconnecting = false
      startBot()
    }, 5000)
  })

  bot.on('error', () => {})
}

startBot()
