const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: 'play.hayfun.xyz',
    port: 25565,
    username: 'Joonathanjodd',
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

    // 🧭 Directly open selector
    console.log('🧭 Opening server selector...')
    bot.activateItem()
  })

  // ================= WINDOW HANDLER =================
  bot.on('windowOpen', async (window) => {
    const title = JSON.stringify(window.title).toLowerCase()
    console.log('📦 Window:', title)

    if (title.includes('server')) {
      console.log('➡️ Clicking Lifesteal (slot 11)...')

      try {
        await bot.clickWindow(11, 0, 0)
      } catch {
        console.log('❌ Failed clicking slot 11')
      }

      await wait(8000)

      console.log('🟢 AFK mode started')
    }
  })

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
