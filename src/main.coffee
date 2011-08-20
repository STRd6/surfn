window.engine = Engine
  backgroundColor: "orange"
  canvas: $("canvas").powerCanvas()
  zSort: true

player = engine.add
  class: "Player"
  x: 20
  y: 20

box = engine.add
  sprite: "rocks"
  x: 60
  y: 180
  zIndex: 6

water = engine.add
  color: "blue"
  x: 0
  y: 160
  width: 480
  height: 320
  zIndex: 0

water.bind "update", ->
  water.I.x = player.I.x - App.width/2

player.bind "update", ->
  if keydown.left
    player.I.x -= 1

  if keydown.right
    player.I.x += 1

  if keydown.up
    player.I.y -= 1

  if keydown.down
    player.I.y += 1

engine.bind "afterUpdate", ->
  engine.I.cameraTransform = Matrix.translation(App.width/2 - player.I.x, App.height/2 - player.I.y)

engine.start()


