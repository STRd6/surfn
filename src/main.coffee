Dust = require "dust"

# TODO: Clean up globals
global.Collision = Dust.Collision

global.Sound = require "sound"

require "../duct_tape"

require "./cloud"
require "./player"
require "./rock"
require "/water"
require "./game_over"

Music = require "./music"

DEBUG_DRAW = 0# true

parent.gameControlData =
  Movement: "Left/Right Arrow Keys"
  Restart: "Enter or Spacebar"

{width, height} = require "/pixie"

window.engine = Dust.init
  width: width
  height: height

engine.I.backgroundColor = "#CC5500"

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
    class: "Water"

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
  engine.objects().invoke "destroy"

  doRestart = ->
    engine.unbind "afterUpdate", doRestart
    setUpGame()

  engine.on "afterUpdate", doRestart

engine.on "afterUpdate", ->
  if player = engine.find("Player").first()
    engine.I.cameraTransform = Matrix.translation(width/2 - player.I.x, height/2 - player.I.y)

engine.on "draw", (canvas) ->
  if DEBUG_DRAW
    engine.find("Player, Rock").invoke("trigger", "drawDebug", canvas)

engine.bind "restart", ->
  restartGame()

Music.play "SurfN-2-Sur5"

engine.start()

# Meta controls
$(document).on "keydown", null, "pause", ->
  engine.pause()
