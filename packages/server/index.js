require('./spawnCar/index.js')

function toggleSeatbelt(player, isOn) {
  const vehicle = player.vehicle
  const currentSeatbelt = player.getVariable('seatbelt') ? true : false
  if (!vehicle || currentSeatbelt === isOn) return

  player.setVariable('seatbelt', isOn)
  player.call('changeSeatbelt', [isOn])
}

mp.events.add('playerExitVehicle', (player) => {
  toggleSeatbelt(player, false)
})

mp.events.add('seatbeltOn', (player) => {
  const isSeatbeltOn = player.getVariable('seatbelt')
  toggleSeatbelt(player, !isSeatbeltOn)
})

mp.events.add('playerDeath', (player) => {
  toggleSeatbelt(player, false)
})
