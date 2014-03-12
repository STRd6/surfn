Surfn
=====

As a lone FBI agent you must surf to survive.

    # TODO: Maybe jQuery should move into Dust since that's what depends on it
    require "jQuery"

Use the Dust game engine.

    Dust = require "dust"

    # TODO: Clean up globals
    global.Collision = Dust.Collision
    global.Sound = require "/lib/sound"

    # TODO: Fix this up a bit
    Sound.play = (name) ->
      sounds = require "/sounds"

      Sound.playFromURL(sounds[name])

    require "/duct_tape"

These register our GameObjects.

    require "./cloud"
    require "./destruction"
    require "./player"
    require "./rock"
    require "./water"
    require "./game_over"

    Music = require "/lib/music"

    DEBUG_DRAW = false

Get the app size from our config.

    {width, height} = require "/pixie"

    window.engine = Dust.init
      width: width
      height: height

    engine.I.backgroundColor = "#CC5500"

    setUpGame = ->
      player = engine.add
        class: "Player"
        x: 240
        y: 0

      box = engine.add
        class: "Rock"
        x: 160
        y: 200

      4.times (n) ->
        engine.add
          class: "Cloud"
          x: n * 128

      water = engine.add
        class: "Water"

      engine.add "Destruction"

    loadingBar = engine.add
      x: width/2
      y: height/2
      width: 0
      height: height
      color: "white"

    require("/lib/preloader").preload
      resources: [
        "/images"
      ].map require
      progress: (percent) ->
        console.log percent
        loadingBar.I.width = percent * width
      complete: ->
        loadingBar.destroy()
        setUpGame()

    require("/lib/preloader").softPreload [
      "/music"
      "/sounds"
    ].map require

    # TODO: This should be simpler like engine.follow("Player")
    ###
    camera = engine.camera()
    camera.on "afterUpdate", ->
      if player = engine.find("Player").first()
        camera.I.transform.tx = 240 + player.I.x
    ###

    # TODO: This is a stupid hack because I haven't fixed the cameras yet
    engine.on "afterUpdate", ->
      if player = engine.find("Player").first()
        deltaX = 240 - player.I.x

        player.I.distance -= deltaX

        engine.objects().forEach (object) ->
          object.I.x += deltaX

    clock = 0
    engine.on "update", ->
      clock += 1

      if player = engine.find("Player").first()
        if clock % 60 == 0
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
