const browser = mp.browsers.new('package://index.html')
browser.active = false

const canFlyFlag = 32

function handleSafetyBeltOn() {
  mp.events.callRemote('seatbeltOn')
}

mp.events.add('changeSeatbelt', (isOn) => {
  const player = mp.players.local
  if (isOn) {
    player.setConfigFlag(canFlyFlag, false)
    browser.active = true
    mp.gui.chat.push(`!{00FF00}Ви пристібнули ремінь безпеки`)
  } else {
    player.setConfigFlag(canFlyFlag, true)
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
