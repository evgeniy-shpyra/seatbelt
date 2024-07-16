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
  const allVehicles = mp.vehicles.toArray()

  for (const vehicle of allVehicles) {
    const vehicleId = `${vehicle.id}`
    if (!vehicleHealthStates[vehicleId]) {
      vehicleHealthStates[vehicleId] = {
        bodyHealth: vehicle.bodyHealth,
        engineHealth: vehicle.engineHealth,
      }
      continue
    }
    let prevBodyHealth = vehicleHealthStates[vehicleId].bodyHealth
    let prevEngineHealth = vehicleHealthStates[vehicleId].engineHealth

    let bodyHealthLoss = prevBodyHealth - vehicle.bodyHealth
    let engineHealthLoss = prevEngineHealth - vehicle.engineHealth

    if (bodyHealthLoss > 0 || engineHealthLoss > 0) {
      const allOccupants = vehicle.getOccupants()

      for (const player of allOccupants) {
        const isSeatbeltOn = player.getVariable('seatbelt')
        let healthLoss = bodyHealthLoss

        if (isSeatbeltOn) {
          healthLoss *= 0.2
        }

        // player.health зважди повертає 100, тому зробив не великий костиль (це не добре але працює)
        let prevHealth = player.health
        const prevSavedHealth = player.getVariable('healthInCar')
        if (prevSavedHealth !== null && prevHealth > prevSavedHealth) {
          prevHealth = prevSavedHealth
        }
        const newHealth = prevHealth - healthLoss
        player.setVariable('healthInCar', newHealth)
        player.health = newHealth
      }

      vehicleHealthStates[vehicleId] = {
        bodyHealth: vehicle.bodyHealth,
        engineHealth: vehicle.engineHealth,
      }
    }
  }
})
