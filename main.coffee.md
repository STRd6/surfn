Surfn
=====

As a lone FBI agent you must surf to survive.

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
    
    churnSprites = [Sprite.loadByName("churn")]
    waveSprites = ["wave", "wave1"].map (name) ->
      Sprite.loadByName name
    
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
    
      destruction = engine.add
        color: "red"
        destruction: true
        x: -240
        y: 0
        width: 10
        height: height
        zIndex: 7
    
      do (I=destruction.I, self=destruction) ->
        self.on "update", ->
          I.x += 2 + I.age / 175
    
          I.x = I.x.clamp(player.I.x - 4 * width, Infinity)
    
        self.on "draw", (canvas) ->
          waveSprites.wrap((I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height)
          churnSprites.wrap((I.age / 8).floor()).fill(canvas, 0, 0, 32, height)
    
    loadingBar = engine.add
      x: width/2
      y: height/2
      width: 0
      height: height
      color: "white"
    
    require("/lib/preloader").preload
      resources: [
        "/images"
        "/music"
        "/sounds"
      ].map require
      progress: (percent) ->
        console.log percent
        loadingBar.I.width = percent * width
    
      complete: ->
        loadingBar.destroy()
        setUpGame()
    
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
