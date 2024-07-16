const browser = mp.browsers.new('package://index.html')
browser.active = false

function handleSafetyBeltOn() {
  mp.events.callRemote('seatbeltOn')
}

const canFlyFlag = 32
const canFlyFlagHash = '0x1913FE4CBF41C463'
mp.events.add('changeSeatbelt', (isOn) => {
  const player = mp.players.local
  if (isOn) {
    mp.game.invoke(canFlyFlagHash, player.handle, canFlyFlag, false)
    browser.active = true
    mp.gui.chat.push(`!{00FF00}Ви пристібнули ремінь безпеки`)
  } else {
    mp.game.invoke(canFlyFlagHash, player.handle, canFlyFlag, true)

    browser.active = false
    mp.gui.chat.push(`!{FF0000}Ви відстібнули ремінь безпеки`)
  }
  browser.execute(`toggleSeatbeltIcons(${isOn})`)
})

mp.keys.bind(0x42, true, () => {
  const player = mp.players.local
  if (player.vehicle) {
    handleSafetyBeltOn()
  }
})
