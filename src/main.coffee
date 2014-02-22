Dust = require "dust"

require "../duct_tape"

require "./cloud"
require "./player"
require "./rock"

Music = require "./music"

DEBUG_DRAW = false

parent.gameControlData =
  Movement: "Left/Right Arrow Keys"
  Restart: "Enter or Spacebar"

{width, height} = require "/pixie"

window.engine = Dust.init
  width: width
  height: height

engine.I.backgroundColor = "#CC5500"

depthsSprites = [Sprite.loadByName("depths0"), Sprite.loadByName("depths1")]
churnSprites = [Sprite.loadByName("churn")]
waveSprites = ["wave", "wave1"].map (name) ->
  Sprite.loadByName name

setUpGame = ->
  player = engine.add
    class: "Player"
    x: 0
    y: 0

  box = engine.add
    class: "Rock"
    x: 60
    y: 180

  4.times (n) ->
    engine.add
      class: "Cloud"
      x: n * 128

  water = engine.add
    color: "blue"
    water: true
    x: 0
    y: 160
    width: width + 64
    height: height
    zIndex: 0

  destruction = engine.add
    color: "red"
    destruction: true
    x: -240
    y: 0
    width: 10
    height: height
    zIndex: 7

  destruction.bind "update", ->
    destruction.I.x += 2 + destruction.I.age / 175

    destruction.I.x = destruction.I.x.clamp(player.I.x - 4 * width, Infinity)

  destruction.bind "draw", (canvas) ->
    waveSprites.wrap((destruction.I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height)
    churnSprites.wrap((destruction.I.age / 8).floor()).fill(canvas, 0, 0, 32, height)

  water.bind "update", ->
    water.I.x = player.I.x - width/2 - 32

    amplitude = (15 + water.I.age / 30)

    if rand(3) == 0 && water.I.age.mod(90) == 0
      Sound.play("wave")

    water.I.y = 160 + amplitude * Math.sin(Math.TAU / 120 * water.I.age)

  water.bind "draw", (canvas) ->
    canvas.withTransform Matrix.translation(-player.I.x.mod(32), 0), ->
      depthsSprites.wrap((water.I.age / 8).floor()).fill(canvas, 0, height/2, water.I.width, height)

setUpGame()

clock = 0
engine.bind "update", ->
  clock += 1

  if player = engine.find("Player").first()
    if clock % 30 == 0
        engine.add
          class: "Rock"
          x: player.I.x + 2 * width

    if clock % 55 == 0
      engine.add
        class: "Cloud"
        x: player.I.x + 2 * width

restartGame = ->
  doRestart = ->
    engine.I.objects.clear()
    engine.unbind "afterUpdate", doRestart
    setUpGame()

  engine.bind "afterUpdate", doRestart

engine.bind "afterUpdate", ->
  if player = engine.find("Player").first()
    engine.I.cameraTransform = Matrix.translation(width/2 - player.I.x, height/2 - player.I.y)

engine.bind "draw", (canvas) ->
  if DEBUG_DRAW
    engine.find("Player, Rock").invoke("trigger", "drawDebug", canvas)

engine.bind "restart", ->
  restartGame()

Music.play "SurfN-2-Sur5"

engine.start()

