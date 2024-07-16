require('./spawnCar/index.js')

function toggleSeatbelt(player, isOn) {
  const vehicle = player.vehicle
  const currentSeatbelt = player.getVariable('seatbelt') ? true : false
  if (!vehicle || currentSeatbelt === isOn) return

  player.setVariable('seatbelt', isOn)
  player.call('changeSeatbelt', [isOn])
}

mp.events.add('playerStartExitVehicle', (player) => {
  toggleSeatbelt(player, false)
})

mp.events.add('seatbeltOn', (player) => {
  const isSeatbeltOn = player.getVariable('seatbelt')
  toggleSeatbelt(player, !isSeatbeltOn)
})

mp.events.add('playerDeath', (player) => {
  toggleSeatbelt(player, false)
})

const vehicleHealthStates = {}
setInterval(() => {
  const allPlayers = mp.players.toArray()
  for (const player of allPlayers) {
    if (!player.vehicle) continue

    const vehicle = player.vehicle

    const platerCarId = `${player.id}-${vehicle.id}`
    if (!vehicleHealthStates[platerCarId]) {
      vehicleHealthStates[platerCarId] = {
        bodyHealth: vehicle.bodyHealth,
        engineHealth: vehicle.engineHealth,
      }
      continue
    }
    let prevBodyHealth = vehicleHealthStates[platerCarId].bodyHealth
    let prevEngineHealth = vehicleHealthStates[platerCarId].engineHealth

    let bodyHealthLoss = prevBodyHealth - vehicle.bodyHealth
    let engineHealthLoss = prevEngineHealth - vehicle.engineHealth

    if (bodyHealthLoss > 0 || engineHealthLoss > 0) {
      const isSeatbeltOn = player.getVariable('seatbelt')

      if (isSeatbeltOn) {
        player.health -= bodyHealthLoss * 0.2
      } else {
        player.health -= bodyHealthLoss * 1.2
      }

      vehicleHealthStates[platerCarId] = {
        bodyHealth: vehicle.bodyHealth,
        engineHealth: vehicle.engineHealth,
      }
    }
  }
})
