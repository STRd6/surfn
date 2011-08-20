window.engine = Engine
  backgroundColor: "orange"
  canvas: $("canvas").powerCanvas()
  zSort: true

player = engine.add
  x: 20
  y: 20

box = engine.add
  x: -50
  y: -50

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


