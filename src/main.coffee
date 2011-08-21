DEBUG_DRAW = false

window.engine = Engine
  backgroundColor: Color("burntorange")
  canvas: $("canvas").powerCanvas()
  zSort: true

depthsSprites = [Sprite.loadByName("depths0"), Sprite.loadByName("depths1")]
churnSprites = [Sprite.loadByName("churn")]

setUpGame = ->
  player = engine.add
    class: "Player"
    x: 0
    y: 0

  box = engine.add
    class: "Rock"
    x: 60
    y: 180

  water = engine.add
    color: "blue"
    x: 0
    y: 160
    width: App.width + 64
    height: App.height
    zIndex: 0

  destruction = engine.add
    color: "red"
    destruction: true
    x: -240
    y: 0
    width: 10
    height: App.height
    zIndex: 7

  destruction.bind "update", ->
    destruction.I.x += 2

  destruction.bind "draw", (canvas) ->
    churnSprites.wrap((destruction.I.age / 8).floor()).fill(canvas, 0, 0, 32, App.height)

  water.bind "update", ->
    water.I.x = player.I.x - App.width/2 - 32

  water.bind "draw", (canvas) ->
    canvas.withTransform Matrix.translation(-player.I.x.mod(32), 0), ->
      depthsSprites.wrap((water.I.age / 8).floor()).fill(canvas, 0, App.height/2, water.I.width, App.height)

setUpGame()

clock = 0
engine.bind "update", ->
  clock += 1

  if clock % 30 == 0
    if player = engine.find("Player").first()
      engine.add
        class: "Rock"
        x: player.I.x + 2 * App.width
        y: 160 + rand(160)

restartGame = ->
  doRestart = ->
    engine.I.objects.clear()
    engine.unbind "afterUpdate", doRestart
    setUpGame()

  engine.bind "afterUpdate", doRestart

engine.bind "afterUpdate", ->
  if player = engine.find("Player").first()
    engine.I.cameraTransform = Matrix.translation(App.width/2 - player.I.x, App.height/2 - player.I.y)

engine.bind "draw", (canvas) ->
  if DEBUG_DRAW
    engine.find("Player, Rock").invoke("trigger", "drawDebug", canvas)

engine.bind "restart", ->
  restartGame()

engine.start()

