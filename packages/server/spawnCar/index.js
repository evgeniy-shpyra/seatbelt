mp.events.addCommand('car', (player, fullText, vehicleName) => {
  const vehiclePosition = player.position // позиция игрока

  const spawnPosition = new mp.Vector3(
    vehiclePosition.x + 5,
    vehiclePosition.y + 5,
    vehiclePosition.z
  )

  const carName = 'Adder'
  const vehicle = mp.vehicles.new(mp.joaat(carName), spawnPosition, {
    heading: 1,
    numberPlate: 'super car',
    color: [
      [255, 255, 255],
      [255, 255, 255],
    ],
  })
})
