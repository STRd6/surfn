window.engine = Engine
  backgroundColor: "blue"
  canvas: $("canvas").powerCanvas()
  zSort: true

player = engine.add
  x: 20
  y: 20

player.bind "update", ->
  if keydown.left
    player.I.x -= 1

  if keydown.right
    player.I.x += 1

engine.bind "afterUpdate", ->
  engine.I.cameraTransform = Matrix.translation(App.width/2 - player.I.x, App.height/2 - player.I.y)

engine.start()


