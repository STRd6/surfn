window["STRd6/surfn:master"]({
  "source": {
    "TODO.md": {
      "path": "TODO.md",
      "mode": "100644",
      "content": "TODO\n====\n\nTitle Screen\n\nVolume Controls (Mute)\n\nDisplay Gameplay Controls\n\nLink to edit code in Editor\n- Editor needs to be able to be loaded from iframe/popup and load a package to edit\n\nLinks to Docs\n\nFix preloader for Audio\n",
      "type": "blob"
    },
    "base.coffee.md": {
      "path": "base.coffee.md",
      "mode": "100644",
      "content": "Base\n====\n\nA common base class for our objects to inherit from.\n\n    {GameObject} = require \"dust\"\n\n    module.exports = (I) ->\n\n      self = GameObject(I).extend\n        center: ->\n           Point(I.x, I.y)\n\n      self.on \"drawDebug\", (canvas) ->\n        if I.radius\n          center = self.center()\n          x = center.x\n          y = center.y\n\n          canvas.drawCircle\n            x: x\n            y: y\n            radius: I.radius\n            color: \"rgba(255, 0, 255, 0.5)\"\n\n      self\n",
      "type": "blob"
    },
    "bounds_extensions.coffee.md": {
      "path": "bounds_extensions.coffee.md",
      "mode": "100644",
      "content": "Bounds Extensions\n=================\n\n    module.exports = (I={}, self) ->\n      self.extend\n        top: ->\n          I.y - I.height/2\n        bottom: ->\n          I.y + I.height/2\n\n      return self\n",
      "type": "blob"
    },
    "cloud.coffee.md": {
      "path": "cloud.coffee.md",
      "mode": "100644",
      "content": "Cloud\n=====\n\nJust floating along in the background.\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    module.exports = GameObject.registry.Cloud = (I) ->\n      defaults I,\n        spriteName: \"cloud\"\n        height: 32\n        width: 128\n        y: -120 + rand(240)\n        zIndex: 1\n\n      self = Base(I)\n\n      self.on \"update\", ->\n        destruction = engine.find(\".destruction\").first()\n\n        if destruction\n          if I.x < destruction.I.x - I.width\n            I.active = false\n\n      self\n",
      "type": "blob"
    },
    "duct_tape.coffee.md": {
      "path": "duct_tape.coffee.md",
      "mode": "100644",
      "content": "Duct Tape\n=========\n\nLoad Sprites by named resource.\n\n    {Util:{extend}, GameObject} = require \"dust\"\n    images = require \"./images\"\n\n    GameObject.defaultModules.push require \"./bounds_extensions\"\n\n    Sprite.loadByName = (name) ->\n      url = images[name]\n\n      Sprite.load(url)\n\n    extend Number.prototype,\n      approach: (target, maxDelta) ->\n        this + (target - this).clamp(-maxDelta, maxDelta)\n\n      approachByRatio: (target, ratio) ->\n        @approach(target, this * ratio)\n\n      # TODO: Provide this safety for all number extensions\n      floor: ->\n        if isNaN(this)\n          throw \"Can't floor NaN\"\n        else\n          Math.floor(this)\n",
      "type": "blob"
    },
    "game_over.coffee.md": {
      "path": "game_over.coffee.md",
      "mode": "100644",
      "content": "Game Over\n=========\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    module.exports = GameObject.registry.GameOver = (I={}) ->\n      defaults I,\n        zIndex: 10\n\n      lineHeight = 24\n\n      self = GameObject(I)\n\n      self.off \"draw\"\n      self.on \"overlay\", (canvas) ->\n\n        # TODO: Extract multiline text rendering\n        lines = \"\"\"\n          surf'd for #{(I.distance / 100).toFixed(2)} meters\n          sur5'd for #{I.time.toFixed(2)} seconds\n          succumb'd to #{I.causeOfDeath}\n        \"\"\".split(\"\\n\")\n\n        canvas.font \"24px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif\"\n\n        lines.forEach (line, i) ->\n          canvas.centerText\n            color: \"#FFF\"\n            text: line\n            y: 160 - (lines.length/2 - i) * lineHeight\n\n      self.on \"update\", ->\n        if keydown.space or keydown.return or keydown.escape\n          engine.trigger \"restart\"\n\n      return self\n",
      "type": "blob"
    },
    "images.json": {
      "path": "images.json",
      "mode": "100644",
      "content": "{\n  \"churn\": \"http://a0.pixiecdn.com/surfn/images/churn.png\",\n  \"cloud\": \"http://a0.pixiecdn.com/surfn/images/cloud.png\",\n  \"depths\": \"http://a0.pixiecdn.com/surfn/images/depths.png\",\n  \"depths0\": \"http://a0.pixiecdn.com/surfn/images/depths0.png\",\n  \"depths1\": \"http://a0.pixiecdn.com/surfn/images/depths1.png\",\n  \"player\": \"http://a0.pixiecdn.com/surfn/images/player.png\",\n  \"player_0\": \"http://a0.pixiecdn.com/surfn/images/player_0.png\",\n  \"player_10\": \"http://a0.pixiecdn.com/surfn/images/player_10.png\",\n  \"player_12\": \"http://a0.pixiecdn.com/surfn/images/player_12.png\",\n  \"player_14\": \"http://a0.pixiecdn.com/surfn/images/player_14.png\",\n  \"player_2\": \"http://a0.pixiecdn.com/surfn/images/player_2.png\",\n  \"player_4\": \"http://a0.pixiecdn.com/surfn/images/player_4.png\",\n  \"player_6\": \"http://a0.pixiecdn.com/surfn/images/player_6.png\",\n  \"player_8\": \"http://a0.pixiecdn.com/surfn/images/player_8.png\",\n  \"rocks\": \"http://a0.pixiecdn.com/surfn/images/rocks.png\",\n  \"wave\": \"http://a0.pixiecdn.com/surfn/images/wave.png\",\n  \"wave1\": \"http://a0.pixiecdn.com/surfn/images/wave1.png\"\n}",
      "type": "blob"
    },
    "lib/music.coffee.md": {
      "path": "lib/music.coffee.md",
      "mode": "100644",
      "content": "Music\n=====\n\nSuper hack way to have background music.\n\n    track = $ \"<audio />\",\n      loop: \"loop\"\n    .appendTo('body').get(0)\n\n    track.volume = 1\n\n    module.exports =\n      play: (name) ->\n        # TODO: Get music files from resource setup\n        track.src = require(\"/music\")[\"SurfN-2-Sur5\"]\n        track.play()\n",
      "type": "blob"
    },
    "lib/preloader.coffee.md": {
      "path": "lib/preloader.coffee.md",
      "mode": "100644",
      "content": "Preloader\n=========\n\nPreload resources.\n\nTODO: Error handling\n\n    module.exports =\n      preload: ({resources, complete, progress}) ->\n        loading = 0\n        loaded = 0\n\n        failedResource = (url) ->\n          # TODO: Something other than just logging and ignoring\n          console.error \"Failed to load:\", url\n          loadedResource()\n\n        loadedResource = (url) ->\n          console.log \"loaded:\", url\n          loaded += 1\n\n          if loaded is loading\n            complete()\n          else\n            progress?(loaded/loading)\n\n        resources.forEach (resource) ->\n          Object.keys(resource).forEach (name) ->\n            loading += 1\n            url = resource[name]\n\n            if url.match /\\.(png|jpg|git)$/\n              # TODO: Error handling for sprites\n              # NOTE: Using Sprite constructor because otherwise we get flickering\n              Sprite.load url, ->\n                loadedResource(url)\n            else if url.match /\\.(mp3|wav|ogg)/\n              element = new Audio\n              element.onloadeddata = ->\n                loadedResource(url)\n              element.onerror = ->\n                failedResource(url)\n\n              element.src = url\n              element.load()\n              element.volume = 0\n              element.play()\n            else\n              console.warn \"unknown file type\", url\n              setTimeout loadedResource, 0\n\n`softPreload` just tries to load the resources but doesn't keep track of \nprogress, success, or failure. Useful right now for audio which is unreliable.\n\n      softPreload: (resources) ->\n        resources.forEach (resource) ->\n          Object.keys(resource).forEach (name) ->\n            url = resource[name]\n\n            if url.match /\\.(png|jpg|git)$/\n              Sprite.load(url)\n            else if url.match /\\.(mp3|wav|ogg)/\n              element = new Audio\n              element.src = url\n              element.load()\n              element.volume = 0\n              element.play()\n            else\n              console.warn \"unknown file type\", url\n              setTimeout loadedResource, 0\n",
      "type": "blob"
    },
    "lib/sound.coffee.md": {
      "path": "lib/sound.coffee.md",
      "mode": "100644",
      "content": "Sound\n=====\n\nPlay sounds\n\n>     Sound.play \"pew pew\"\n\n>     Sound.playFromURL \"data:audio/wav;base64,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\"\n\nHelpers\n-------\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nImplementation\n--------------\n\n    maxChannels = 16\n    channels = [0...maxChannels].map ->\n      extend document.createElement(\"audio\"),\n        autobuffer: true\n        preload: 'auto'\n\n    freeChannel = ->\n      freeChannels = channels.filter (sound) ->\n        sound.currentTime is sound.duration or sound.currentTime is 0\n\n      freeChannels[0]\n\n    module.exports =\n      playFromURL: (url) ->\n        if channel = freeChannel()\n          try\n            channel.currentTime = 0\n\n          channel.src = url\n          channel.play()\n\n          return channel\n",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "mode": "100644",
      "content": "Surfn\n=====\n\nAs a lone FBI agent you must surf to survive.\n\nUse the Dust game engine.\n\n    Dust = require \"dust\"\n\n    # TODO: Clean up globals\n    global.Collision = Dust.Collision\n    global.Sound = require \"/lib/sound\"\n\n    # TODO: Fix this up a bit\n    Sound.play = (name) ->\n      sounds = require \"/sounds\"\n\n      Sound.playFromURL(sounds[name])\n\n    require \"/duct_tape\"\n\nThese register our GameObjects.\n\n    require \"./cloud\"\n    require \"./destruction\"\n    require \"./player\"\n    require \"./rock\"\n    require \"./water\"\n    require \"./game_over\"\n\n    Music = require \"/lib/music\"\n\n    DEBUG_DRAW = false\n\nGet the app size from our config.\n\n    {width, height} = require \"/pixie\"\n\n    window.engine = Dust.init\n      width: width\n      height: height\n\n    engine.I.backgroundColor = \"#CC5500\"\n\n    setUpGame = ->\n      player = engine.add\n        class: \"Player\"\n        x: 240\n        y: 0\n\n      box = engine.add\n        class: \"Rock\"\n        x: 160\n        y: 200\n\n      4.times (n) ->\n        engine.add\n          class: \"Cloud\"\n          x: n * 128\n\n      water = engine.add\n        class: \"Water\"\n\n      engine.add \"Destruction\"\n\n    loadingBar = engine.add\n      x: width/2\n      y: height/2\n      width: 0\n      height: height\n      color: \"white\"\n\n    require(\"/lib/preloader\").preload\n      resources: [\n        \"/images\"\n      ].map require\n      progress: (percent) ->\n        console.log percent\n        loadingBar.I.width = percent * width\n      complete: ->\n        loadingBar.destroy()\n        setUpGame()\n\n    require(\"/lib/preloader\").softPreload [\n      \"/music\"\n      \"/sounds\"\n    ].map require\n\n    # TODO: This should be simpler like engine.follow(\"Player\")\n    ###\n    camera = engine.camera()\n    camera.on \"afterUpdate\", ->\n      if player = engine.find(\"Player\").first()\n        camera.I.transform.tx = 240 + player.I.x\n    ###\n\n    # TODO: This is a stupid hack because I haven't fixed the cameras yet\n    engine.on \"afterUpdate\", ->\n      if player = engine.find(\"Player\").first()\n        deltaX = 240 - player.I.x\n\n        player.I.distance -= deltaX\n\n        engine.objects().forEach (object) ->\n          object.I.x += deltaX\n\n    clock = 0\n    engine.on \"update\", ->\n      clock += 1\n\n      if player = engine.find(\"Player\").first()\n        if clock % 60 == 0\n            engine.add\n              class: \"Rock\"\n              x: player.I.x + 2 * width\n\n        if clock % 55 == 0\n          engine.add\n            class: \"Cloud\"\n            x: player.I.x + 2 * width\n\n    restartGame = ->\n      engine.objects().invoke \"destroy\"\n\n      doRestart = ->\n        engine.unbind \"afterUpdate\", doRestart\n        setUpGame()\n\n      engine.on \"afterUpdate\", doRestart\n\n    engine.on \"draw\", (canvas) ->\n      if DEBUG_DRAW\n        engine.find(\"Player, Rock\").invoke(\"trigger\", \"drawDebug\", canvas)\n\n    engine.bind \"restart\", ->\n      restartGame()\n\n    Music.play \"SurfN-2-Sur5\"\n\n    engine.start()\n\n    # Meta controls\n    $(document).on \"keydown\", null, \"pause\", ->\n      engine.pause()\n",
      "type": "blob"
    },
    "music.json": {
      "path": "music.json",
      "mode": "100644",
      "content": "{\n  \"SurfN-2-Sur5\": \"http://a0.pixiecdn.com/surfn/music/SurfN-2-Sur5.mp3\"\n}",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "author: \"STRd6\"\nname: \"SurfN-2-Sur5\"\nwidth: 480\nheight: 320\nentryPoint: \"main\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.10.1.min.js\"\n]\ndependencies:\n  dust: \"distri/dust:v0.1.8-alpha.2\"\n  # sound: \"distri/sound:v0.1.0\"\n",
      "type": "blob"
    },
    "player.coffee.md": {
      "path": "player.coffee.md",
      "mode": "100644",
      "content": "Player\n======\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    module.exports = GameObject.registry.Player = (I={}) ->\n      defaults I,\n        airborne: true\n        distance: 0\n        heading: Math.TAU / 4\n        spriteName: \"player\"\n        launchBoost: 1.5\n        radius: 8\n        rotationVelocity: Math.TAU / 64\n        waterSpeed: 5\n        velocity: Point(0, 0)\n        zIndex: 5\n\n      self = Base(I)\n\n      GRAVITY = Point(0, 0.25)\n\n      sprites = []\n      angleSprites = 8\n      angleSprites.times (n) ->\n        t = n * 2\n        sprites.push \"player_#{t}\"\n\n      setSprite = ->\n        n = (angleSprites * I.heading / Math.TAU).round().mod(angleSprites)\n\n        I.spriteName = sprites[n]\n\n      wipeout = (causeOfDeath) ->\n        I.active = false\n\n        Sound.play(\"crash\")\n\n        engine.add\n          class: \"GameOver\"\n          causeOfDeath: causeOfDeath\n          distance: I.distance\n          time: I.age\n          y: 160\n\n      land = () ->\n        projection = self.velocity().norm().dot(Point.fromAngle(I.heading))\n\n        if projection < 0\n          wipeout(\"bad landing\")\n\n        I.airborne = false\n\n        Sound.play(\"land\")\n\n      launch = () ->\n        I.airborne = true\n        I.velocity = I.velocity.norm(I.launchBoost * I.waterSpeed)\n\n        Sound.play(\"splash\")\n\n      self.on \"drawDebug\", (canvas) ->\n        canvas.strokeColor(\"rgba(0, 255, 0, 0.75)\")\n\n        p = Point.fromAngle(I.heading).scale(10)\n        canvas.drawLine\n          start: Point(I.x - p.x, I.y - p.y)\n          end: Point(I.x + p.x, I.y + p.y, 1)\n\n      self.on \"update\", ->\n        I.x += I.velocity.x\n        I.y += I.velocity.y\n\n        I.waterSpeed = 5 + I.age / 30\n\n        circle = self.circle()\n        hitRock = false\n        engine.find(\"Rock\").each (rock) ->\n          if Collision.circular circle, rock.circle()\n            hitRock = true\n\n        if hitRock\n          wipeout(\"a rock\")\n          return\n\n        hitDestruction = false\n        engine.find(\".destruction\").each (destruction) ->\n          if I.x < destruction.I.x\n            hitDestruction = true\n        if hitDestruction\n          wipeout(\"a rogue wave\")\n          return\n\n        water = engine.find(\".water\").first()\n        waterLevel = water.top()\n        depthsLevel = water.bottom()\n\n        headingChange = I.rotationVelocity\n        headingChange *= 2 if I.airborne\n\n        if keydown.left\n          I.heading -= headingChange\n        if keydown.right\n          I.heading += headingChange\n\n        # I.heading = I.heading.constrainRotation()\n\n        setSprite()\n\n        if I.y > depthsLevel\n          wipeout(\"the depths\")\n        else if I.y >= waterLevel\n          if I.airborne\n            land()\n\n          speed = I.velocity.magnitude()\n\n          speed = speed.approachByRatio(I.waterSpeed, 0.1)\n\n          I.velocity = Point.fromAngle(I.heading).scale(speed)\n        else\n          if !I.airborne\n            launch()\n\n          I.velocity = I.velocity.add(GRAVITY)\n\n      return self\n",
      "type": "blob"
    },
    "rock.coffee.md": {
      "path": "rock.coffee.md",
      "mode": "100644",
      "content": "Rock\n====\n\nA little rocky patch that leads to death.\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    module.exports = GameObject.registry.Rock = (I={}) ->\n      defaults I,\n        spriteName: \"rocks\"\n        height: 32\n        radius: 16\n        width: 32\n        y: 160 + rand(160)\n        zIndex: 6\n\n      self = Base(I)\n\n      self.on \"update\", ->\n        destruction = engine.find(\".destruction\").first()\n\n        if destruction\n          if I.x < destruction.I.x - I.width\n            I.active = false\n\n      self\n",
      "type": "blob"
    },
    "sounds.json": {
      "path": "sounds.json",
      "mode": "100644",
      "content": "{\n  \"crash\": \"http://a0.pixiecdn.com/surfn/sounds/crash.wav\",\n  \"land\": \"http://a0.pixiecdn.com/surfn/sounds/land.wav\",\n  \"splash\": \"http://a0.pixiecdn.com/surfn/sounds/splash.wav\",\n  \"wave\": \"http://a0.pixiecdn.com/surfn/sounds/wave.wav\"\n}",
      "type": "blob"
    },
    "water.coffee.md": {
      "path": "water.coffee.md",
      "mode": "100644",
      "content": "Water\n=====\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    depthsSprites = [Sprite.loadByName(\"depths0\"), Sprite.loadByName(\"depths1\")]\n\n    module.exports = GameObject.registry.Water = (I={}) ->\n      defaults I,\n        color: \"blue\"\n        water: true\n        x: 0\n        y: 240\n        width: 480\n        height: 160\n        zIndex: 0\n\n      self = GameObject(I)\n\n      self.attrAccessor \"water\"\n\n      self.on \"update\", ->\n        if player = engine.find(\"Player\").first()\n          I.x = player.I.x\n\n        amplitude = (15 + I.age)\n\n        if rand(3) is 0 and I.age.mod(90) is 0\n          Sound.play(\"wave\")\n\n        I.y = 240 + amplitude * Math.sin(Math.TAU / 4 * I.age)\n\n      self.on \"draw\", (canvas) ->\n        offset = I.x.mod(32)\n\n        canvas.withTransform Matrix.translation(-I.width/2, 0), (canvas) ->\n          depthsSprites.wrap((I.age / 8).floor()).fill(canvas, 0, I.height/2, I.width, I.height)\n\n      return self\n",
      "type": "blob"
    },
    "destruction.coffee.md": {
      "path": "destruction.coffee.md",
      "mode": "100644",
      "content": "Destruction\n===========\n\nA rogue wave that will crush the player.\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    {width, height} = require \"./pixie\"\n\n    churnSprites = [Sprite.loadByName(\"churn\")]\n    waveSprites = [\"wave\", \"wave1\"].map (name) ->\n      Sprite.loadByName name\n\n    module.exports = GameObject.registry.Destruction = (I={}) ->\n      defaults I,\n        color: \"red\"\n        destruction: true\n        x: -240\n        y: 0\n        width: 10\n        height: height\n        zIndex: 7\n\n      self = GameObject(I)\n\n      self.attrAccessor \"destruction\"\n\n      self.on \"update\", ->\n        I.x += 2 + I.age / 175\n\n        if player = engine.find(\"Player\").first()\n          I.x = I.x.clamp(player.I.x - 4 * width, Infinity)\n\n      self.on \"draw\", (canvas) ->\n        waveSprites.wrap((I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height)\n        churnSprites.wrap((I.age / 8).floor()).fill(canvas, 0, 0, 32, height)\n",
      "type": "blob"
    }
  },
  "distribution": {
    "base": {
      "path": "base",
      "content": "(function() {\n  var GameObject;\n\n  GameObject = require(\"dust\").GameObject;\n\n  module.exports = function(I) {\n    var self;\n    self = GameObject(I).extend({\n      center: function() {\n        return Point(I.x, I.y);\n      }\n    });\n    self.on(\"drawDebug\", function(canvas) {\n      var center, x, y;\n      if (I.radius) {\n        center = self.center();\n        x = center.x;\n        y = center.y;\n        return canvas.drawCircle({\n          x: x,\n          y: y,\n          radius: I.radius,\n          color: \"rgba(255, 0, 255, 0.5)\"\n        });\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=base.coffee",
      "type": "blob"
    },
    "bounds_extensions": {
      "path": "bounds_extensions",
      "content": "(function() {\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    self.extend({\n      top: function() {\n        return I.y - I.height / 2;\n      },\n      bottom: function() {\n        return I.y + I.height / 2;\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=bounds_extensions.coffee",
      "type": "blob"
    },
    "cloud": {
      "path": "cloud",
      "content": "(function() {\n  var Base, GameObject, defaults, _ref, _ref1;\n\n  _ref = require(\"dust\"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;\n\n  Base = require(\"./base\");\n\n  module.exports = GameObject.registry.Cloud = function(I) {\n    var self;\n    defaults(I, {\n      spriteName: \"cloud\",\n      height: 32,\n      width: 128,\n      y: -120 + rand(240),\n      zIndex: 1\n    });\n    self = Base(I);\n    self.on(\"update\", function() {\n      var destruction;\n      destruction = engine.find(\".destruction\").first();\n      if (destruction) {\n        if (I.x < destruction.I.x - I.width) {\n          return I.active = false;\n        }\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=cloud.coffee",
      "type": "blob"
    },
    "duct_tape": {
      "path": "duct_tape",
      "content": "(function() {\n  var GameObject, extend, images, _ref, _ref1;\n\n  _ref = require(\"dust\"), (_ref1 = _ref.Util, extend = _ref1.extend), GameObject = _ref.GameObject;\n\n  images = require(\"./images\");\n\n  GameObject.defaultModules.push(require(\"./bounds_extensions\"));\n\n  Sprite.loadByName = function(name) {\n    var url;\n    url = images[name];\n    return Sprite.load(url);\n  };\n\n  extend(Number.prototype, {\n    approach: function(target, maxDelta) {\n      return this + (target - this).clamp(-maxDelta, maxDelta);\n    },\n    approachByRatio: function(target, ratio) {\n      return this.approach(target, this * ratio);\n    },\n    floor: function() {\n      if (isNaN(this)) {\n        throw \"Can't floor NaN\";\n      } else {\n        return Math.floor(this);\n      }\n    }\n  });\n\n}).call(this);\n\n//# sourceURL=duct_tape.coffee",
      "type": "blob"
    },
    "game_over": {
      "path": "game_over",
      "content": "(function() {\n  var GameObject, defaults, _ref, _ref1;\n\n  _ref = require(\"dust\"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;\n\n  module.exports = GameObject.registry.GameOver = function(I) {\n    var lineHeight, self;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      zIndex: 10\n    });\n    lineHeight = 24;\n    self = GameObject(I);\n    self.off(\"draw\");\n    self.on(\"overlay\", function(canvas) {\n      var lines;\n      lines = (\"surf'd for \" + ((I.distance / 100).toFixed(2)) + \" meters\\nsur5'd for \" + (I.time.toFixed(2)) + \" seconds\\nsuccumb'd to \" + I.causeOfDeath).split(\"\\n\");\n      canvas.font(\"24px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif\");\n      return lines.forEach(function(line, i) {\n        return canvas.centerText({\n          color: \"#FFF\",\n          text: line,\n          y: 160 - (lines.length / 2 - i) * lineHeight\n        });\n      });\n    });\n    self.on(\"update\", function() {\n      if (keydown.space || keydown[\"return\"] || keydown.escape) {\n        return engine.trigger(\"restart\");\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=game_over.coffee",
      "type": "blob"
    },
    "images": {
      "path": "images",
      "content": "module.exports = {\"churn\":\"http://a0.pixiecdn.com/surfn/images/churn.png\",\"cloud\":\"http://a0.pixiecdn.com/surfn/images/cloud.png\",\"depths\":\"http://a0.pixiecdn.com/surfn/images/depths.png\",\"depths0\":\"http://a0.pixiecdn.com/surfn/images/depths0.png\",\"depths1\":\"http://a0.pixiecdn.com/surfn/images/depths1.png\",\"player\":\"http://a0.pixiecdn.com/surfn/images/player.png\",\"player_0\":\"http://a0.pixiecdn.com/surfn/images/player_0.png\",\"player_10\":\"http://a0.pixiecdn.com/surfn/images/player_10.png\",\"player_12\":\"http://a0.pixiecdn.com/surfn/images/player_12.png\",\"player_14\":\"http://a0.pixiecdn.com/surfn/images/player_14.png\",\"player_2\":\"http://a0.pixiecdn.com/surfn/images/player_2.png\",\"player_4\":\"http://a0.pixiecdn.com/surfn/images/player_4.png\",\"player_6\":\"http://a0.pixiecdn.com/surfn/images/player_6.png\",\"player_8\":\"http://a0.pixiecdn.com/surfn/images/player_8.png\",\"rocks\":\"http://a0.pixiecdn.com/surfn/images/rocks.png\",\"wave\":\"http://a0.pixiecdn.com/surfn/images/wave.png\",\"wave1\":\"http://a0.pixiecdn.com/surfn/images/wave1.png\"};",
      "type": "blob"
    },
    "lib/music": {
      "path": "lib/music",
      "content": "(function() {\n  var track;\n\n  track = $(\"<audio />\", {\n    loop: \"loop\"\n  }).appendTo('body').get(0);\n\n  track.volume = 1;\n\n  module.exports = {\n    play: function(name) {\n      track.src = require(\"/music\")[\"SurfN-2-Sur5\"];\n      return track.play();\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=lib/music.coffee",
      "type": "blob"
    },
    "lib/preloader": {
      "path": "lib/preloader",
      "content": "(function() {\n  module.exports = {\n    preload: function(_arg) {\n      var complete, failedResource, loaded, loadedResource, loading, progress, resources;\n      resources = _arg.resources, complete = _arg.complete, progress = _arg.progress;\n      loading = 0;\n      loaded = 0;\n      failedResource = function(url) {\n        console.error(\"Failed to load:\", url);\n        return loadedResource();\n      };\n      loadedResource = function(url) {\n        console.log(\"loaded:\", url);\n        loaded += 1;\n        if (loaded === loading) {\n          return complete();\n        } else {\n          return typeof progress === \"function\" ? progress(loaded / loading) : void 0;\n        }\n      };\n      return resources.forEach(function(resource) {\n        return Object.keys(resource).forEach(function(name) {\n          var element, url;\n          loading += 1;\n          url = resource[name];\n          if (url.match(/\\.(png|jpg|git)$/)) {\n            return Sprite.load(url, function() {\n              return loadedResource(url);\n            });\n          } else if (url.match(/\\.(mp3|wav|ogg)/)) {\n            element = new Audio;\n            element.onloadeddata = function() {\n              return loadedResource(url);\n            };\n            element.onerror = function() {\n              return failedResource(url);\n            };\n            element.src = url;\n            element.load();\n            element.volume = 0;\n            return element.play();\n          } else {\n            console.warn(\"unknown file type\", url);\n            return setTimeout(loadedResource, 0);\n          }\n        });\n      });\n    },\n    softPreload: function(resources) {\n      return resources.forEach(function(resource) {\n        return Object.keys(resource).forEach(function(name) {\n          var element, url;\n          url = resource[name];\n          if (url.match(/\\.(png|jpg|git)$/)) {\n            return Sprite.load(url);\n          } else if (url.match(/\\.(mp3|wav|ogg)/)) {\n            element = new Audio;\n            element.src = url;\n            element.load();\n            element.volume = 0;\n            return element.play();\n          } else {\n            console.warn(\"unknown file type\", url);\n            return setTimeout(loadedResource, 0);\n          }\n        });\n      });\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=lib/preloader.coffee",
      "type": "blob"
    },
    "lib/sound": {
      "path": "lib/sound",
      "content": "(function() {\n  var channels, extend, freeChannel, maxChannels, _i, _results,\n    __slice = [].slice;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  maxChannels = 16;\n\n  channels = (function() {\n    _results = [];\n    for (var _i = 0; 0 <= maxChannels ? _i < maxChannels : _i > maxChannels; 0 <= maxChannels ? _i++ : _i--){ _results.push(_i); }\n    return _results;\n  }).apply(this).map(function() {\n    return extend(document.createElement(\"audio\"), {\n      autobuffer: true,\n      preload: 'auto'\n    });\n  });\n\n  freeChannel = function() {\n    var freeChannels;\n    freeChannels = channels.filter(function(sound) {\n      return sound.currentTime === sound.duration || sound.currentTime === 0;\n    });\n    return freeChannels[0];\n  };\n\n  module.exports = {\n    playFromURL: function(url) {\n      var channel;\n      if (channel = freeChannel()) {\n        try {\n          channel.currentTime = 0;\n        } catch (_error) {}\n        channel.src = url;\n        channel.play();\n        return channel;\n      }\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=lib/sound.coffee",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var DEBUG_DRAW, Dust, Music, clock, height, loadingBar, restartGame, setUpGame, width, _ref;\n\n  Dust = require(\"dust\");\n\n  global.Collision = Dust.Collision;\n\n  global.Sound = require(\"/lib/sound\");\n\n  Sound.play = function(name) {\n    var sounds;\n    sounds = require(\"/sounds\");\n    return Sound.playFromURL(sounds[name]);\n  };\n\n  require(\"/duct_tape\");\n\n  require(\"./cloud\");\n\n  require(\"./destruction\");\n\n  require(\"./player\");\n\n  require(\"./rock\");\n\n  require(\"./water\");\n\n  require(\"./game_over\");\n\n  Music = require(\"/lib/music\");\n\n  DEBUG_DRAW = false;\n\n  _ref = require(\"/pixie\"), width = _ref.width, height = _ref.height;\n\n  window.engine = Dust.init({\n    width: width,\n    height: height\n  });\n\n  engine.I.backgroundColor = \"#CC5500\";\n\n  setUpGame = function() {\n    var box, player, water;\n    player = engine.add({\n      \"class\": \"Player\",\n      x: 240,\n      y: 0\n    });\n    box = engine.add({\n      \"class\": \"Rock\",\n      x: 160,\n      y: 200\n    });\n    4..times(function(n) {\n      return engine.add({\n        \"class\": \"Cloud\",\n        x: n * 128\n      });\n    });\n    water = engine.add({\n      \"class\": \"Water\"\n    });\n    return engine.add(\"Destruction\");\n  };\n\n  loadingBar = engine.add({\n    x: width / 2,\n    y: height / 2,\n    width: 0,\n    height: height,\n    color: \"white\"\n  });\n\n  require(\"/lib/preloader\").preload({\n    resources: [\"/images\"].map(require),\n    progress: function(percent) {\n      console.log(percent);\n      return loadingBar.I.width = percent * width;\n    },\n    complete: function() {\n      loadingBar.destroy();\n      return setUpGame();\n    }\n  });\n\n  require(\"/lib/preloader\").softPreload([\"/music\", \"/sounds\"].map(require));\n\n  /*\n  camera = engine.camera()\n  camera.on \"afterUpdate\", ->\n    if player = engine.find(\"Player\").first()\n      camera.I.transform.tx = 240 + player.I.x\n  */\n\n\n  engine.on(\"afterUpdate\", function() {\n    var deltaX, player;\n    if (player = engine.find(\"Player\").first()) {\n      deltaX = 240 - player.I.x;\n      player.I.distance -= deltaX;\n      return engine.objects().forEach(function(object) {\n        return object.I.x += deltaX;\n      });\n    }\n  });\n\n  clock = 0;\n\n  engine.on(\"update\", function() {\n    var player;\n    clock += 1;\n    if (player = engine.find(\"Player\").first()) {\n      if (clock % 60 === 0) {\n        engine.add({\n          \"class\": \"Rock\",\n          x: player.I.x + 2 * width\n        });\n      }\n      if (clock % 55 === 0) {\n        return engine.add({\n          \"class\": \"Cloud\",\n          x: player.I.x + 2 * width\n        });\n      }\n    }\n  });\n\n  restartGame = function() {\n    var doRestart;\n    engine.objects().invoke(\"destroy\");\n    doRestart = function() {\n      engine.unbind(\"afterUpdate\", doRestart);\n      return setUpGame();\n    };\n    return engine.on(\"afterUpdate\", doRestart);\n  };\n\n  engine.on(\"draw\", function(canvas) {\n    if (DEBUG_DRAW) {\n      return engine.find(\"Player, Rock\").invoke(\"trigger\", \"drawDebug\", canvas);\n    }\n  });\n\n  engine.bind(\"restart\", function() {\n    return restartGame();\n  });\n\n  Music.play(\"SurfN-2-Sur5\");\n\n  engine.start();\n\n  $(document).on(\"keydown\", null, \"pause\", function() {\n    return engine.pause();\n  });\n\n}).call(this);\n\n//# sourceURL=main.coffee",
      "type": "blob"
    },
    "music": {
      "path": "music",
      "content": "module.exports = {\"SurfN-2-Sur5\":\"http://a0.pixiecdn.com/surfn/music/SurfN-2-Sur5.mp3\"};",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"author\":\"STRd6\",\"name\":\"SurfN-2-Sur5\",\"width\":480,\"height\":320,\"entryPoint\":\"main\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.10.1.min.js\"],\"dependencies\":{\"dust\":\"distri/dust:v0.1.8-alpha.2\"}};",
      "type": "blob"
    },
    "player": {
      "path": "player",
      "content": "(function() {\n  var Base, GameObject, defaults, _ref, _ref1;\n\n  _ref = require(\"dust\"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;\n\n  Base = require(\"./base\");\n\n  module.exports = GameObject.registry.Player = function(I) {\n    var GRAVITY, angleSprites, land, launch, self, setSprite, sprites, wipeout;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      airborne: true,\n      distance: 0,\n      heading: Math.TAU / 4,\n      spriteName: \"player\",\n      launchBoost: 1.5,\n      radius: 8,\n      rotationVelocity: Math.TAU / 64,\n      waterSpeed: 5,\n      velocity: Point(0, 0),\n      zIndex: 5\n    });\n    self = Base(I);\n    GRAVITY = Point(0, 0.25);\n    sprites = [];\n    angleSprites = 8;\n    angleSprites.times(function(n) {\n      var t;\n      t = n * 2;\n      return sprites.push(\"player_\" + t);\n    });\n    setSprite = function() {\n      var n;\n      n = (angleSprites * I.heading / Math.TAU).round().mod(angleSprites);\n      return I.spriteName = sprites[n];\n    };\n    wipeout = function(causeOfDeath) {\n      I.active = false;\n      Sound.play(\"crash\");\n      return engine.add({\n        \"class\": \"GameOver\",\n        causeOfDeath: causeOfDeath,\n        distance: I.distance,\n        time: I.age,\n        y: 160\n      });\n    };\n    land = function() {\n      var projection;\n      projection = self.velocity().norm().dot(Point.fromAngle(I.heading));\n      if (projection < 0) {\n        wipeout(\"bad landing\");\n      }\n      I.airborne = false;\n      return Sound.play(\"land\");\n    };\n    launch = function() {\n      I.airborne = true;\n      I.velocity = I.velocity.norm(I.launchBoost * I.waterSpeed);\n      return Sound.play(\"splash\");\n    };\n    self.on(\"drawDebug\", function(canvas) {\n      var p;\n      canvas.strokeColor(\"rgba(0, 255, 0, 0.75)\");\n      p = Point.fromAngle(I.heading).scale(10);\n      return canvas.drawLine({\n        start: Point(I.x - p.x, I.y - p.y),\n        end: Point(I.x + p.x, I.y + p.y, 1)\n      });\n    });\n    self.on(\"update\", function() {\n      var circle, depthsLevel, headingChange, hitDestruction, hitRock, speed, water, waterLevel;\n      I.x += I.velocity.x;\n      I.y += I.velocity.y;\n      I.waterSpeed = 5 + I.age / 30;\n      circle = self.circle();\n      hitRock = false;\n      engine.find(\"Rock\").each(function(rock) {\n        if (Collision.circular(circle, rock.circle())) {\n          return hitRock = true;\n        }\n      });\n      if (hitRock) {\n        wipeout(\"a rock\");\n        return;\n      }\n      hitDestruction = false;\n      engine.find(\".destruction\").each(function(destruction) {\n        if (I.x < destruction.I.x) {\n          return hitDestruction = true;\n        }\n      });\n      if (hitDestruction) {\n        wipeout(\"a rogue wave\");\n        return;\n      }\n      water = engine.find(\".water\").first();\n      waterLevel = water.top();\n      depthsLevel = water.bottom();\n      headingChange = I.rotationVelocity;\n      if (I.airborne) {\n        headingChange *= 2;\n      }\n      if (keydown.left) {\n        I.heading -= headingChange;\n      }\n      if (keydown.right) {\n        I.heading += headingChange;\n      }\n      setSprite();\n      if (I.y > depthsLevel) {\n        return wipeout(\"the depths\");\n      } else if (I.y >= waterLevel) {\n        if (I.airborne) {\n          land();\n        }\n        speed = I.velocity.magnitude();\n        speed = speed.approachByRatio(I.waterSpeed, 0.1);\n        return I.velocity = Point.fromAngle(I.heading).scale(speed);\n      } else {\n        if (!I.airborne) {\n          launch();\n        }\n        return I.velocity = I.velocity.add(GRAVITY);\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=player.coffee",
      "type": "blob"
    },
    "rock": {
      "path": "rock",
      "content": "(function() {\n  var Base, GameObject, defaults, _ref, _ref1;\n\n  _ref = require(\"dust\"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;\n\n  Base = require(\"./base\");\n\n  module.exports = GameObject.registry.Rock = function(I) {\n    var self;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      spriteName: \"rocks\",\n      height: 32,\n      radius: 16,\n      width: 32,\n      y: 160 + rand(160),\n      zIndex: 6\n    });\n    self = Base(I);\n    self.on(\"update\", function() {\n      var destruction;\n      destruction = engine.find(\".destruction\").first();\n      if (destruction) {\n        if (I.x < destruction.I.x - I.width) {\n          return I.active = false;\n        }\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=rock.coffee",
      "type": "blob"
    },
    "sounds": {
      "path": "sounds",
      "content": "module.exports = {\"crash\":\"http://a0.pixiecdn.com/surfn/sounds/crash.wav\",\"land\":\"http://a0.pixiecdn.com/surfn/sounds/land.wav\",\"splash\":\"http://a0.pixiecdn.com/surfn/sounds/splash.wav\",\"wave\":\"http://a0.pixiecdn.com/surfn/sounds/wave.wav\"};",
      "type": "blob"
    },
    "water": {
      "path": "water",
      "content": "(function() {\n  var GameObject, defaults, depthsSprites, _ref, _ref1;\n\n  _ref = require(\"dust\"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;\n\n  depthsSprites = [Sprite.loadByName(\"depths0\"), Sprite.loadByName(\"depths1\")];\n\n  module.exports = GameObject.registry.Water = function(I) {\n    var self;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      color: \"blue\",\n      water: true,\n      x: 0,\n      y: 240,\n      width: 480,\n      height: 160,\n      zIndex: 0\n    });\n    self = GameObject(I);\n    self.attrAccessor(\"water\");\n    self.on(\"update\", function() {\n      var amplitude, player;\n      if (player = engine.find(\"Player\").first()) {\n        I.x = player.I.x;\n      }\n      amplitude = 15 + I.age;\n      if (rand(3) === 0 && I.age.mod(90) === 0) {\n        Sound.play(\"wave\");\n      }\n      return I.y = 240 + amplitude * Math.sin(Math.TAU / 4 * I.age);\n    });\n    self.on(\"draw\", function(canvas) {\n      var offset;\n      offset = I.x.mod(32);\n      return canvas.withTransform(Matrix.translation(-I.width / 2, 0), function(canvas) {\n        return depthsSprites.wrap((I.age / 8).floor()).fill(canvas, 0, I.height / 2, I.width, I.height);\n      });\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=water.coffee",
      "type": "blob"
    },
    "destruction": {
      "path": "destruction",
      "content": "(function() {\n  var Base, GameObject, churnSprites, defaults, height, waveSprites, width, _ref, _ref1, _ref2;\n\n  _ref = require(\"dust\"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;\n\n  Base = require(\"./base\");\n\n  _ref2 = require(\"./pixie\"), width = _ref2.width, height = _ref2.height;\n\n  churnSprites = [Sprite.loadByName(\"churn\")];\n\n  waveSprites = [\"wave\", \"wave1\"].map(function(name) {\n    return Sprite.loadByName(name);\n  });\n\n  module.exports = GameObject.registry.Destruction = function(I) {\n    var self;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      color: \"red\",\n      destruction: true,\n      x: -240,\n      y: 0,\n      width: 10,\n      height: height,\n      zIndex: 7\n    });\n    self = GameObject(I);\n    self.attrAccessor(\"destruction\");\n    self.on(\"update\", function() {\n      var player;\n      I.x += 2 + I.age / 175;\n      if (player = engine.find(\"Player\").first()) {\n        return I.x = I.x.clamp(player.I.x - 4 * width, Infinity);\n      }\n    });\n    return self.on(\"draw\", function(canvas) {\n      waveSprites.wrap((I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height);\n      return churnSprites.wrap((I.age / 8).floor()).fill(canvas, 0, 0, 32, height);\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=destruction.coffee",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://strd6.github.io/editor/"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "https://code.jquery.com/jquery-1.10.1.min.js"
  ],
  "repository": {
    "id": 2240037,
    "name": "surfn",
    "full_name": "STRd6/surfn",
    "owner": {
      "login": "STRd6",
      "id": 18894,
      "avatar_url": "https://gravatar.com/avatar/33117162fff8a9cf50544a604f60c045?d=https%3A%2F%2Fidenticons.github.com%2F39df222bffe39629d904e4883eabc654.png&r=x",
      "gravatar_id": "33117162fff8a9cf50544a604f60c045",
      "url": "https://api.github.com/users/STRd6",
      "html_url": "https://github.com/STRd6",
      "followers_url": "https://api.github.com/users/STRd6/followers",
      "following_url": "https://api.github.com/users/STRd6/following{/other_user}",
      "gists_url": "https://api.github.com/users/STRd6/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/STRd6/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/STRd6/subscriptions",
      "organizations_url": "https://api.github.com/users/STRd6/orgs",
      "repos_url": "https://api.github.com/users/STRd6/repos",
      "events_url": "https://api.github.com/users/STRd6/events{/privacy}",
      "received_events_url": "https://api.github.com/users/STRd6/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/STRd6/surfn",
    "description": "As a lone FBI agent you must surf to survive.",
    "fork": false,
    "url": "https://api.github.com/repos/STRd6/surfn",
    "forks_url": "https://api.github.com/repos/STRd6/surfn/forks",
    "keys_url": "https://api.github.com/repos/STRd6/surfn/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/STRd6/surfn/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/STRd6/surfn/teams",
    "hooks_url": "https://api.github.com/repos/STRd6/surfn/hooks",
    "issue_events_url": "https://api.github.com/repos/STRd6/surfn/issues/events{/number}",
    "events_url": "https://api.github.com/repos/STRd6/surfn/events",
    "assignees_url": "https://api.github.com/repos/STRd6/surfn/assignees{/user}",
    "branches_url": "https://api.github.com/repos/STRd6/surfn/branches{/branch}",
    "tags_url": "https://api.github.com/repos/STRd6/surfn/tags",
    "blobs_url": "https://api.github.com/repos/STRd6/surfn/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/STRd6/surfn/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/STRd6/surfn/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/STRd6/surfn/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/STRd6/surfn/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/STRd6/surfn/languages",
    "stargazers_url": "https://api.github.com/repos/STRd6/surfn/stargazers",
    "contributors_url": "https://api.github.com/repos/STRd6/surfn/contributors",
    "subscribers_url": "https://api.github.com/repos/STRd6/surfn/subscribers",
    "subscription_url": "https://api.github.com/repos/STRd6/surfn/subscription",
    "commits_url": "https://api.github.com/repos/STRd6/surfn/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/STRd6/surfn/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/STRd6/surfn/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/STRd6/surfn/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/STRd6/surfn/contents/{+path}",
    "compare_url": "https://api.github.com/repos/STRd6/surfn/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/STRd6/surfn/merges",
    "archive_url": "https://api.github.com/repos/STRd6/surfn/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/STRd6/surfn/downloads",
    "issues_url": "https://api.github.com/repos/STRd6/surfn/issues{/number}",
    "pulls_url": "https://api.github.com/repos/STRd6/surfn/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/STRd6/surfn/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/STRd6/surfn/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/STRd6/surfn/labels{/name}",
    "releases_url": "https://api.github.com/repos/STRd6/surfn/releases{/id}",
    "created_at": "2011-08-20T18:05:31Z",
    "updated_at": "2014-03-05T23:33:08Z",
    "pushed_at": "2014-03-05T23:33:07Z",
    "git_url": "git://github.com/STRd6/surfn.git",
    "ssh_url": "git@github.com:STRd6/surfn.git",
    "clone_url": "https://github.com/STRd6/surfn.git",
    "svn_url": "https://github.com/STRd6/surfn",
    "homepage": "",
    "size": 8756,
    "stargazers_count": 1,
    "watchers_count": 1,
    "language": "CoffeeScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 1,
    "default_branch": "master",
    "master_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "network_count": 0,
    "subscribers_count": 2,
    "branch": "master",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "dust": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "dust\n====\n\nPixieEngine2 Lite!\n",
          "type": "blob"
        },
        "engine.coffee.md": {
          "path": "engine.coffee.md",
          "mode": "100644",
          "content": "Engine\n======\n\nThe Engine controls the game world and manages game state. Once you\nset it up and let it run it pretty much takes care of itself.\n\nYou can use the engine to add or remove objects from the game world.\n\nThere are several modules that can include to add additional capabilities\nto the engine.\n\nEvents\n------\n\nThe engine fires events that you  may bind listeners to. Event listeners\nmay be bound with `engine.on(eventName, callback)`\n\n`beforeAdd` Observe or modify the entity data before it is added to the engine.\n\n@param {Object} entityData\n\n`afterAdd` Observe or configure a `GameObject` that has been added to the engine.\n\n@param {GameObject} object The object that has just been added to the engine.\n\n`update` Called when the engine updates all the game objects.\n\n@param {Number} elapsedTime The time in seconds that has elapsed since the last update.\n\n`afterUpdate` Called after the engine completes an update.\n\n`beforeDraw` is called before the engine draws the game objects on the canvas.\nThe current camera transform is applied.\n\n@params {PixieCanvas} canvas A reference to the canvas to draw on.\n\n`draw` is called after the engine draws on the canvas. The current camera transform is applied.\n\n@params {PixieCanvas} canvas A reference to the canvas to draw on.\n\n>     engine.bind \"draw\", (canvas) ->\n>       # print some directions for the player\n>       canvas.drawText\n>         text: \"Go this way =>\"\n>         x: 200\n>         y: 200\n\n`draw` is called after the engine draws.\n\nThe current camera transform is not applied. This is great for\nadding overlays.\n\n@params {PixieCanvas} canvas A reference to the canvas to draw on.\n\n>     engine.bind \"overlay\", (canvas) ->\n>       # print the player's health. This will be\n>       # positioned absolutely according to the viewport.\n>       canvas.drawText\n>         text: \"HEALTH:\"\n>         position: Point(20, 20)\n>\n>       canvas.drawText\n>         text: player.health()\n>         position: Point(50, 20)\n\nImplementation\n--------------\n\n    {defaults} = require \"./util\"\n    Bindable = require \"./modules/bindable\"\n\n    Engine = (I={}, self=Bindable(I)) ->\n      defaults I,\n        FPS: 60\n        paused: false\n\n      frameAdvance = false\n\n      running = false\n      startTime = +new Date()\n      lastStepTime = -Infinity\n      animLoop = (timestamp) ->\n        timestamp ||= +new Date()\n        msPerFrame = (1000 / I.FPS)\n\n        delta = timestamp - lastStepTime\n        remainder = delta - msPerFrame\n\n        if remainder > 0\n          lastStepTime = timestamp - Math.min(remainder, msPerFrame)\n          step()\n\n        if running\n          window.requestAnimationFrame(animLoop)\n\n      update = (elapsedTime) ->\n        self.trigger \"beforeUpdate\", elapsedTime\n        self.trigger \"update\", elapsedTime\n        self.trigger \"afterUpdate\", elapsedTime\n\n      draw = ->\n        return unless canvas = I.canvas\n\n        self.trigger \"beforeDraw\", canvas\n        self.trigger \"draw\", canvas\n        self.trigger \"overlay\", canvas\n\n      step = ->\n        if !I.paused || frameAdvance\n          elapsedTime = (1 / I.FPS)\n          update(elapsedTime)\n\n        draw()\n\n      self.extend\n        ###*\n        Start the game simulation.\n\n            engine.start()\n\n        @methodOf Engine#\n        @name start\n        ###\n        start: ->\n          unless running\n            running = true\n            window.requestAnimationFrame(animLoop)\n\n          return self\n\n        ###*\n        Stop the simulation.\n\n            engine.stop()\n\n        @methodOf Engine#\n        @name stop\n        ###\n        stop: ->\n          running = false\n\n          return self\n\n        ###*\n        Pause the game and step through 1 update of the engine.\n\n            engine.frameAdvance()\n\n        @methodOf Engine#\n        @name frameAdvance\n        ###\n        frameAdvance: ->\n          I.paused = true\n          frameAdvance = true\n          step()\n          frameAdvance = false\n\n        ###*\n        Resume the game.\n\n            engine.play()\n\n        @methodOf Engine#\n        @name play\n        ###\n        play: ->\n          I.paused = false\n\n        ###*\n        Toggle the paused state of the simulation.\n\n            engine.pause()\n\n        @methodOf Engine#\n        @name pause\n        @param {Boolean} [setTo] Force to pause by passing true or unpause by passing false.\n        ###\n        pause: (setTo) ->\n          if setTo?\n            I.paused = setTo\n          else\n            I.paused = !I.paused\n\n        ###*\n        Query the engine to see if it is paused.\n\n            engine.pause()\n\n            engine.paused()\n            # true\n\n            engine.play()\n\n            engine.paused()\n            # false\n\n        @methodOf Engine#\n        @name paused\n        ###\n        paused: ->\n          I.paused\n\n        ###*\n        Change the framerate of the game. The default framerate is 60 fps.\n\n            engine.setFramerate(60)\n\n        @methodOf Engine#\n        @name setFramerate\n        ###\n        setFramerate: (newFPS) ->\n          I.FPS = newFPS\n          self.stop()\n          self.start()\n\n        update: update\n        draw: draw\n\n      Engine.defaultModules.each (module) ->\n        self.include module\n\n      self.trigger \"init\"\n\n      return self\n\n    Engine.defaultModules = [\n      \"age\"\n      \"engine/background\"\n      \"engine/collision\"\n      \"engine/game_state\"\n      \"engine/finder\"\n      \"engine/keyboard\"\n      \"engine/mouse\"\n      \"timed_events\"\n    ].map (name) ->\n      require \"./modules/#{name}\"\n\n    module.exports = Engine\n\nTODO\n----\n\n- Include these modules\n - \"Tilemap\"\n - \"Levels\"\n- Extract driving loop into a module\n",
          "type": "blob"
        },
        "game_object.coffee.md": {
          "path": "game_object.coffee.md",
          "mode": "100644",
          "content": "GameObject\n==========\n\nThe default base class for all objects you can add to the engine.\n\nEvents\n------\n\nGameObjects fire events that you may attach listeners to. Event listeners\nare bound with `object.on(eventName, handler)`\n\n`create` is triggered when the object is created.\n\n`destroy` is triggered when object is destroyed.\n\nUse the destroy event to add particle effects, play sounds, etc.\n\n>     bomb.on 'destroy', ->\n>       bomb.explode()\n>       Sound.play \"Kaboom\"\n\n`update` is triggered during every step of the game loop.\n\nCheck to see if keys are being pressed and change the player's velocity.\n\n>     player.on 'update', ->\n>       if keydown.left\n>         player.velocity(Point(-1, 0))\n>       else if keydown.right\n>         player.velocity(Point(1, 0))\n>       else\n>         player.velocity(Point(0, 0))\n\nTriggered when the object is removed from the engine. Use the remove event to\nhandle any clean up.\n\nDestroyed objects are always removed, but removed objects may not necessarily have\nbeen destroyed.\n\n>     boss.bind 'remove', ->\n>       unlockDoorToLevel2()\n\n    {defaults} = require \"./util\"\n\n    module.exports = GameObject = (I={}, self=Core(I)) ->\n      defaults I,\n        active: true\n        created: false\n        destroyed: false\n\n      self.attrReader \"id\"\n\n      self.extend\n        class: ->\n          I.class or \"GameObject\"\n\nUpdate the game object. The engine calls this method.\n\n        update: (elapsedTime) ->\n          # TODO: Extract this I.active check out into an engine gameObject remove processor or something\n          # TODO: Remove this method and only use events.\n          if I.active\n            self.trigger 'update', elapsedTime\n\n          I.active\n\nTriggers the create event if the object has not already been created. This method is called by the engine.\n\n        create: ->\n          self.trigger('create') unless I.created\n          I.created = true\n\nDestroys the object and triggers the destroyed event. Anyone can call this method.\n\n        destroy: ->\n          self.trigger('destroy') unless I.destroyed\n\n          I.destroyed = true\n          I.active = false\n\n      GameObject.defaultModules.each (module) ->\n        self.include module\n\n      return self\n\n    GameObject.defaultModules = [\n      \"bindable\"\n      \"age\"\n      \"bounded\"\n      \"clamp\"\n      \"cooldown\"\n      \"drawable\"\n      \"effect\"\n      \"expirable\"\n      \"follow\"\n      \"meter\"\n      \"movable\"\n      \"rotatable\"\n      \"timed_events\"\n      \"tween\"\n    ].map (name) ->\n      require \"./modules/#{name}\"\n\nConstruct an object instance from the given entity data.\n\n    GameObject.construct = (entityData) ->\n      if className = entityData.class\n        if constructor = GameObject.registry[className]\n          constructor(entityData)\n        else\n          throw \"Unregistered constructor: #{className}\"\n      else\n        GameObject(entityData)\n\n    GameObject.registry =\n      GameObject: GameObject\n",
          "type": "blob"
        },
        "game_state.coffee.md": {
          "path": "game_state.coffee.md",
          "mode": "100644",
          "content": "GameState\n=========\n\nA game state is a set of objects in a particular configuration.\n\nEvents\n------\n\n`beforeAdd` is triggered before the object is created from the data and is passed\nthe data itself.\n\n`afterAdd` is triggered after an object is added to the game state and is passed\nthe object that is added.\n\n    {defaults} = require \"./util\"\n    Bindable = require \"./modules/bindable\"\n    GameObject = require \"../../game_object\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        objects: []\n\n      queuedObjects = []\n\n      self.extend\n\nThe `add` method creates an object from data and adds it object to the game world.\n\nReturns the added object.\n\nYou can add arbitrary `entityData` and the engine will make it into a `GameObject`\n\n>     engine.add\n>       x: 50\n>       y: 30\n>       color: \"red\"\n>\n>     player = engine.add\n>       class: \"Player\"\n\n        # TODO: Need some kind of object constructor registry to reconstitute game\n        # objects from data\n        add: (entityData) ->\n          self.trigger \"beforeAdd\", entityData\n\n          object = GameObject.construct entityData\n          object.create()\n\n          self.trigger \"afterAdd\", object\n\n          if I.updating\n            queuedObjects.push object\n          else\n            I.objects.push object\n\n          return object\n\n        objects: ->\n          I.objects.copy()\n\n      # Add events and methods here\n      self.on \"update\", (elapsedTime) ->\n        I.updating = true\n\n        I.objects.invoke \"trigger\", \"beforeUpdate\", elapsedTime\n\n        [toKeep, toRemove] = I.objects.partition (object) ->\n          object.update(elapsedTime)\n\n        I.objects.invoke \"trigger\", \"afterUpdate\", elapsedTime\n\n        toRemove.invoke \"trigger\", \"remove\"\n\n        I.objects = toKeep.concat(queuedObjects)\n        queuedObjects = []\n\n        I.updating = false\n\n      self.include require \"./modules/cameras\"\n      self.include require \"./modules/save_state\"\n\n      return self\n",
          "type": "blob"
        },
        "lib/collision.coffee.md": {
          "path": "lib/collision.coffee.md",
          "mode": "100644",
          "content": "Collision\n=========\n\nCollision holds many useful class methods for checking geometric overlap of various objects.\n\n    # Assume game objects\n    collides = (a, b) ->\n      # TODO: Be smart about auto-detecting collision types\n      Collision.rectangular(a.bounds(), b.bounds())\n\n    Collision =\n      ###*\n      Collision holds many useful class methods for checking geometric overlap of various objects.\n\n          player = engine.add\n            class: \"Player\"\n            x: 0\n            y: 0\n            width: 10\n            height: 10\n\n          enemy = engine.add\n            class: \"Enemy\"\n            x: 5\n            y: 5\n            width: 10\n            height: 10\n\n          enemy2 = engine.add\n            class: \"Enemy\"\n            x: -5\n            y: -5\n            width: 10\n            height: 10\n\n          Collision.collide(player, enemy, (p, e) -> ...)\n          # => callback is called once\n\n          Collision.collide(player, [enemy, enemy2], (p, e) -> ...)\n          # => callback is called twice\n\n          Collision.collide(\"Player\", \"Enemy\", (p, e) -> ...)\n          # => callback is also called twice\n\n      @name collide\n      @methodOf Collision\n      @param {Object|Array|String} groupA An object or set of objects to check collisions with\n      @param {Object|Array|String} groupB An object or set of objects to check collisions with\n      @param {Function} callback The callback to call when an object of groupA collides\n      with an object of groupB: (a, b) ->\n      @param {Function} [detectionMethod] An optional detection method to determine when two\n      objects are colliding.\n      ###\n      collide: (groupA, groupB, callback, detectionMethod=collides) ->\n        if Object.isString(groupA)\n          groupA = engine.find(groupA)\n        else\n          groupA = [].concat(groupA)\n\n        if Object.isString(groupB)\n          groupB = engine.find(groupB)\n        else\n          groupB = [].concat(groupB)\n\n        groupA.each (a) ->\n          groupB.each (b) ->\n            callback(a, b) if detectionMethod(a, b)\n\n      ###*\n      Takes two bounds objects and returns true if they collide (overlap), false otherwise.\n      Bounds objects have x, y, width and height properties.\n\n          player = GameObject\n            x: 0\n            y: 0\n            width: 10\n            height: 10\n\n          enemy = GameObject\n            x: 5\n            y: 5\n            width: 10\n            height: 10\n\n          Collision.rectangular(player, enemy)\n          # => true\n\n          Collision.rectangular(player, {x: 50, y: 40, width: 30, height: 30})\n          # => false\n\n      @name rectangular\n      @methodOf Collision\n      @param {Object} a The first rectangle\n      @param {Object} b The second rectangle\n      @returns {Boolean} true if the rectangles overlap, false otherwise\n      ###\n      rectangular: (a, b) ->\n        a.x < b.x + b.width &&\n        a.x + a.width > b.x &&\n        a.y < b.y + b.height &&\n        a.y + a.height > b.y\n\n      ###*\n      Takes two circle objects and returns true if they collide (overlap), false otherwise.\n      Circle objects have x, y, and radius.\n\n          player = GameObject\n            x: 5\n            y: 5\n            radius: 10\n\n          enemy = GameObject\n            x: 10\n            y: 10\n            radius: 10\n\n          farEnemy = GameObject\n            x: 500\n            y: 500\n            radius: 30\n\n          Collision.circular(player, enemy)\n          # => true\n\n          Collision.circular(player, farEnemy)\n          # => false\n\n      @name circular\n      @methodOf Collision\n      @param {Object} a The first circle\n      @param {Object} b The second circle\n      @returns {Boolean} true is the circles overlap, false otherwise\n      ###\n      circular: (a, b) ->\n        r = a.radius + b.radius\n        dx = b.x - a.x\n        dy = b.y - a.y\n\n        r * r >= dx * dx + dy * dy\n\n      ###*\n      Detects whether a line intersects a circle.\n\n          circle = engine.add\n            class: \"circle\"\n            x: 50\n            y: 50\n            radius: 10\n\n          Collision.rayCircle(Point(0, 0), Point(1, 0), circle)\n          # => true\n\n      @name rayCircle\n      @methodOf Collision\n      @param {Point} source The starting position\n      @param {Point} direction A vector from the point\n      @param {Object} target The circle\n      @returns {Boolean} true if the line intersects the circle, false otherwise\n      ###\n      rayCircle: (source, direction, target) ->\n        radius = target.radius()\n        target = target.position()\n\n        laserToTarget = target.subtract(source)\n\n        projectionLength = direction.dot(laserToTarget)\n\n        if projectionLength < 0\n          return false # object is behind\n\n        projection = direction.scale(projectionLength)\n\n        intersection = source.add(projection)\n        intersectionToTarget = target.subtract(intersection)\n        intersectionToTargetLength = intersectionToTarget.length()\n\n        if intersectionToTargetLength < radius\n          hit = true\n\n        if hit\n          dt = Math.sqrt(radius * radius - intersectionToTargetLength * intersectionToTargetLength)\n\n          hit = direction.scale(projectionLength - dt).add(source)\n\n      ###*\n      Detects whether a line intersects a rectangle.\n\n          rect = engine.add\n            class: \"circle\"\n            x: 50\n            y: 50\n            width: 20\n            height: 20\n\n          Collision.rayRectangle(Point(0, 0), Point(1, 0), rect)\n          # => true\n\n      @name rayRectangle\n      @methodOf Collision\n      @param {Point} source The starting position\n      @param {Point} direction A vector from the point\n      @param {Object} target The rectangle\n      @returns {Boolean} true if the line intersects the rectangle, false otherwise\n      ###\n      rayRectangle: (source, direction, target) ->\n        unless target.xw? and target.yw?\n          if target.width? and target.height?\n            xw = target.width/2\n            yw = target.height/2\n\n            # Convert from bounds rect to centeredBounds rect\n            return Collision.rayRectangle source, direction,\n              x: target.x + xw\n              y: target.y + yw\n              xw: xw\n              yw: yw\n          else\n            error \"Bounds object isn't a rectangle\"\n\n            return\n\n        xw = target.xw\n        yw = target.yw\n\n        if source.x < target.x\n          xval = target.x - xw\n        else\n          xval = target.x + xw\n\n        if source.y < target.y\n          yval = target.y - yw\n        else\n          yval = target.y + yw\n\n        if direction.x == 0\n          p0 = Point(target.x - xw, yval)\n          p1 = Point(target.x + xw, yval)\n\n          t = (yval - source.y) / direction.y\n        else if direction.y == 0\n          p0 = Point(xval, target.y - yw)\n          p1 = Point(xval, target.y + yw)\n\n          t = (xval - source.x) / direction.x\n        else\n          tX = (xval - source.x) / direction.x\n          tY = (yval - source.y) / direction.y\n\n          # TODO: These special cases are gross!\n          if (tX < tY || (-xw < source.x - target.x < xw)) && !(-yw < source.y - target.y < yw)\n            p0 = Point(target.x - xw, yval)\n            p1 = Point(target.x + xw, yval)\n\n            t = tY\n          else\n            p0 = Point(xval, target.y - yw)\n            p1 = Point(xval, target.y + yw)\n\n            t = tX\n\n        if t > 0\n          areaPQ0 = direction.cross(p0.subtract(source))\n          areaPQ1 = direction.cross(p1.subtract(source))\n\n          if areaPQ0 * areaPQ1 < 0\n            hit = direction.scale(t).add(source)\n\n    module.exports = Collision\n",
          "type": "blob"
        },
        "lib/easing.coffee.md": {
          "path": "lib/easing.coffee.md",
          "mode": "100644",
          "content": "Easing\n======\n\n    {PI, sin, cos, pow} = Math\n\n    τ = 2 * PI\n\n    Easing =\n      sinusoidal: (t) ->\n        1 - cos(t * τ / 4)\n\n      sinusoidalOut: (t) ->\n        0 + sin(t * τ / 4)\n\n    polynomialEasings = [\"linear\", \"quadratic\", \"cubic\", \"quartic\", \"quintic\"]\n\n    polynomialEasings.each (easing, i) ->\n      exponent = i + 1\n      sign = if exponent % 2 then 1 else -1\n\n      Easing[easing] = (t) ->\n        pow(t, exponent)\n\n      Easing[\"#{easing}Out\"] = (t) ->\n        1 + sign * pow(t - 1, exponent)\n\n    [\"sinusoidal\"].concat(polynomialEasings).each (easing) ->\n      easeIn = Easing[easing]\n      easeOut = Easing[\"#{easing}Out\"]\n\n      Easing[\"#{easing}InOut\"] = (t) ->\n        if t < 0.5\n          easeIn(2 * t)\n        else\n          easeOut(2 * t - 1)\n\n    module.exports = Easing\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Main\n====\n\n[Engine](./engine)\n[GameObject](./game_object)\n\nModules\n-------\n\n[Age](./modules/age)\n[Bindable](./modules/bindable)\n[Bounded](./modules/bounded)\n[Clamp](./modules/clamp)\n[Cooldown](./modules/cooldown)\n[Drawable](./modules/drawable)\n[Effect](./modules/effect)\n[Expirable](./modules/expirable)\n[Follow](./modules/follow)\n[Meter](./modules/meter)\n[Movable](./modules/movable)\n[Rotatable](./modules/rotatable)\n[Timed Events](./modules/timed_events)\n[Tween](./modules/tween)\n\n    require \"./setup\"\n\n    Engine = require \"./engine\"\n\n    TouchCanvas = require \"touch-canvas\"\n\n    applyStyleSheet = ->\n      styleNode = document.createElement(\"style\")\n      styleNode.innerHTML = require \"./style\"\n      styleNode.className = \"dust\"\n\n      if previousStyleNode = document.head.querySelector(\"style.dust\")\n        previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n      document.head.appendChild(styleNode)\n\n    module.exports =\n      init: (options={}) ->\n        applyStyleSheet()\n\n        {width, height} = options\n        width ?= 640\n        height ?= 480\n\n        canvas = TouchCanvas\n          width: width\n          height: height\n\n        $(\"body\").append $ \"<div>\",\n          class: \"main center\"\n\n        $(\".main\").append(canvas.element())\n        .css\n          width: width\n          height: height\n\n        engine = Engine\n          canvas: canvas\n\n        engine.start()\n\n        return engine\n\n      Collision: require \"/lib/collision\"\n      Engine: Engine\n      GameObject: require \"./game_object\"\n      GameState: require \"./game_state\"\n      Sprite: require \"sprite\"\n      Util: require \"./util\"\n",
          "type": "blob"
        },
        "modules/age.coffee.md": {
          "path": "modules/age.coffee.md",
          "mode": "100644",
          "content": "The `Age` module handles keeping track of an object's age.\n\n>     player = GameObject()\n>\n>     player.update(1)\n>\n>     #=> player.I.age is 1\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        age: 0\n\n      self.bind 'afterUpdate', (dt) ->\n        I.age += dt\n\n      return self\n",
          "type": "blob"
        },
        "modules/bindable.coffee.md": {
          "path": "modules/bindable.coffee.md",
          "mode": "100644",
          "content": "Bindable\n========\n\nAdd event binding to objects.\n\n>     bindable = Bindable()\n>     bindable.on \"greet\", ->\n>       console.log \"yo!\"\n>     bindable.trigger \"greet\"\n>     #=> \"yo!\" is printed to log\n\nUse as a mixin.\n\n>    self.include Bindable\n\n    module.exports = (I={}, self=Core(I)) ->\n      eventCallbacks = {}\n\n      self.extend\n\nAdds a function as an event listener.\n\nThis will call `coolEventHandler` after `yourObject.trigger \"someCustomEvent\"`\nis called.\n\n>     yourObject.on \"someCustomEvent\", coolEventHandler\n\nHandlers can be attached to namespaces as well. The namespaces are only used\nfor finer control of targeting event removal. For example if you are making a\ncustom drawing system you could unbind `\".Drawable\"` events and add your own.\n\n>     yourObject.on \"\"\n\n        on: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          # HACK: Here we annotate the callback function with namespace metadata\n          # This will probably lead to some strange edge cases, but should work fine\n          # for simple cases.\n          if namespace\n            callback.__PIXIE ||= {}\n            callback.__PIXIE[namespace] = true\n\n          eventCallbacks[event] ||= []\n          eventCallbacks[event].push(callback)\n\n          return self\n\nRemoves a specific event listener, or all event listeners if\nno specific listener is given.\n\nRemoves the handler coolEventHandler from the event `\"someCustomEvent\"` while\nleaving the other events intact.\n\n>     yourObject.off \"someCustomEvent\", coolEventHandler\n\nRemoves all handlers attached to `\"anotherCustomEvent\"`\n\n>     yourObject.off \"anotherCustomEvent\"\n\nRemove all handlers from the `\".Drawable\" namespace`\n\n>     yourObject.off \".Drawable\"\n\n        off: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          if event\n            eventCallbacks[event] ||= []\n\n            if namespace\n              # Select only the callbacks that do not have this namespace metadata\n              eventCallbacks[event] = eventCallbacks.select (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n            else\n              if callback\n                eventCallbacks[event].remove(callback)\n              else\n                eventCallbacks[event] = []\n          else if namespace\n            # No event given\n            # Select only the callbacks that do not have this namespace metadata\n            # for any events bound\n            for key, callbacks of eventCallbacks\n              eventCallbacks[key] = callbacks.select (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n          return self\n\nCalls all listeners attached to the specified event.\n\n>     # calls each event handler bound to \"someCustomEvent\"\n>     yourObject.trigger \"someCustomEvent\"\n\nAdditional parameters can be passed to the handlers.\n\n>     yourObject.trigger \"someEvent\", \"hello\", \"anotherParameter\"\n\n        trigger: (event, parameters...) ->\n          callbacks = eventCallbacks[event]\n\n          if callbacks\n            callbacks.forEach (callback) ->\n              callback.apply(self, parameters)\n\n          return self\n\nLegacy method aliases.\n\n      self.extend\n        bind: self.on\n        unbind: self.off\n",
          "type": "blob"
        },
        "modules/bounded.coffee.md": {
          "path": "modules/bounded.coffee.md",
          "mode": "100644",
          "content": "Bounded\n=======\n\nTODO: Maybe rename this Geometry?\n\n    Collision = require \"../lib/collision\"\n\nThe Bounded module is used to provide basic data about the\nlocation and dimensions of the including object. This module is included\nby default in `GameObject`.\n\n>     player = GameObject\n>       x: 10\n>       y: 50\n>       width: 20\n>       height: 20\n>       other: \"stuff\"\n>       more: \"properties\"\n>\n>     player.position()\n>     # => {x: 10, y: 50}\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Core(I)) ->\n      defaults I,\n        x: 0\n        y: 0\n        width: 8\n        height: 8\n        collisionMargin: Point(0, 0)\n\n      self.extend\n\nGet the object closest to this one.\n\n        closest: (selector) ->\n          if typeof selector is \"string\"\n            selector = engine.find(selector)\n          else\n            selector = [].concat(selector)\n\n          position = self.position()\n\n          selector.sort (a, b) ->\n            Point.distanceSquared(position, a.position()) - Point.distanceSquared(position, b.position())\n          .first()\n\nDistance between two objects. Proxies to Point.distance.\nIn order for this to work, `otherObj` must have a\nposition method.\n\n>     player = GameObject\n>       x: 50\n>       y: 50\n>       width: 10\n>       height: 10\n>\n>     enemy = GameObject\n>       x: 110\n>       y: 120\n>       width: 7\n>       height: 20\n>\n>     player.distance(enemy)\n>     # => 92.19544457292888\n\n        distance: (otherObj) ->\n          Point.distance(self.position(), otherObj.position())\n\nThe position of this game object. By default it is the center.\n\n>     player = GameObject\n>       x: 50\n>       y: 40\n>\n>     player.position()\n>     # => {x: 50, y: 40}\n\n        position: (newPosition) ->\n          if newPosition?\n            I.x = newPosition.x\n            I.y = newPosition.y\n          else\n            Point(I.x, I.y)\n\n        changePosition: (delta) ->\n          I.x += delta.x\n          I.y += delta.y\n\n          self\n\nDoes a check to see if this object is overlapping with the bounds passed in.\n\n>     player = GameObject\n>       x: 4\n>       y: 6\n>       width: 20\n>       height: 20\n>\n>     player.collides({x: 5, y: 7, width: 20, height: 20})\n>     # => true\n\n        collides: (bounds) ->\n          Collision.rectangular(self.bounds(), bounds)\n\nThis returns a modified bounds based on the collision margin.\nThe area of the bounds is reduced if collision margin is positive\nand increased if collision margin is negative.\n\n>     player = GameObject\n>       collisionMargin:\n>         x: -2\n>         y: -4\n>       x: 50\n>       y: 50\n>       width: 20\n>       height: 20\n>\n>     player.collisionBounds()\n>     # => {x: 38, y: 36, height: 28, width: 24}\n>\n>     player.collisionBounds(10, 10)\n>     # => {x: 48, y: 46, height: 28, width: 24}\n\n        collisionBounds: (xOffset, yOffset) ->\n          bounds = self.bounds(xOffset, yOffset)\n\n          bounds.x += I.collisionMargin.x\n          bounds.y += I.collisionMargin.y\n          bounds.width -= 2 * I.collisionMargin.x\n          bounds.height -= 2 * I.collisionMargin.y\n\n          return bounds\n\nReturns infomation about the location of the object and its dimensions with optional offsets.\n\n>     player = GameObject\n>       x: 3\n>       y: 6\n>       width: 2\n>       height: 2\n>\n>     player.bounds()\n>     # => {x: 3, y: 6, width: 2, height: 2}\n>\n>     player.bounds(7, 4)\n>     # => {x: 10, y: 10, width: 2, height: 2}\n\n        bounds: (xOffset, yOffset) ->\n          center = self.center()\n\n          x: center.x - I.width/2 + (xOffset || 0)\n          y: center.y - I.height/2 + (yOffset || 0)\n          width: I.width\n          height: I.height\n\nThe centeredBounds method returns infomation about the center\nof the object along with the midpoint of the width and height.\n\n>     player = GameObject\n>       x: 3\n>       y: 6\n>       width: 2\n>       height: 2\n>\n>     player.centeredBounds()\n>     # => {x: 4, y: 7, xw: 1, yw: 1}\n\n        centeredBounds: () ->\n          center = self.center()\n\n          x: center.x\n          y: center.y\n          xw: I.width/2\n          yw: I.height/2\n\n\nThe center method returns the {@link Point} that is\nthe center of the object.\n\n>     player.center()\n>     # => {x: 30, y: 35}\n\n        center: (newCenter) ->\n          self.position(newCenter)\n\nReturn the circular bounds of the object. The circle is\ncentered at the midpoint of the object.\n\n>     player.circle()\n>     # => {radius: 5, x: 50, y: 50}\n\n        circle: () ->\n          circle = self.center()\n          circle.radius = I.radius || I.width/2 || I.height/2\n\n          return circle\n",
          "type": "blob"
        },
        "modules/camera.coffee.md": {
          "path": "modules/camera.coffee.md",
          "mode": "100644",
          "content": "Camera\n======\n\n    Bindable = require \"./bindable\"\n    {defaults} = require \"../util\"\n\n    Camera = (I={}, self=Bindable(I)) ->\n\n      defaults I,\n        screen: # Screen Coordinates\n          x: 0\n          y: 0\n          width: 1024\n          height: 576\n        deadzone: Point(0, 0) # Screen Coordinates\n        zoom: 1\n        transform: Matrix()\n        velocity: Point(0, 0)\n        maxSpeed: 750\n        t90: 2 # Time in seconds for camera to move 90% of the way to the target\n\n      # World Coordinates\n      I.x ?= I.screen.width/2\n      I.y ?= I.screen.height/2\n\n      I.cameraBounds ?= I.screen\n\n      currentType = \"centered\"\n      currentObject = null\n\n      objectFilters = []\n      transformFilters = []\n\n      focusOn = (object, elapsedTime) ->\n        dampingFactor = 2\n\n        #TODO: Different t90 value inside deadzone?\n\n        c = elapsedTime * 3.75 / I.t90\n        if c >= 1\n          # Spring is configured to be too intense, just snap to target\n          self.position(target)\n          I.velocity = Point(0, 0)\n        else\n          objectCenter = object.center()\n\n          target = objectCenter\n\n          delta = target.subtract(self.position())\n\n          force = delta.subtract(I.velocity.scale(dampingFactor))\n          self.changePosition(I.velocity.scale(c).clamp(I.maxSpeed))\n          I.velocity = I.velocity.add(force.scale(c))\n\n      followTypes =\n        centered: (object, elapsedTime) ->\n          I.deadzone = Point(0, 0)\n\n          focusOn(object, elapsedTime)\n\n        topdown: (object, elapsedTime) ->\n          helper = Math.max(I.screen.width, I.screen.height) / 4\n\n          I.deadzone = Point(helper, helper)\n\n          focusOn(object, elapsedTime)\n\n        platformer: (object, elapsedTime) ->\n          width = I.screen.width / 8\n          height = I.screen.height / 3\n\n          I.deadzone = Point(width, height)\n\n          focusOn(object, elapsedTime)\n\n      self.extend\n        follow: (object, type=\"centered\") ->\n          currentObject = object\n          currentType = type\n\n        objectFilterChain: (fn) ->\n          objectFilters.push fn\n\n        transformFilterChain: (fn) ->\n          transformFilters.push fn\n\n        screenToWorld: (point) ->\n          self.transform().inverse().transformPoint(point)\n\n      self.attrAccessor \"transform\"\n\n      self.on \"afterUpdate\", (elapsedTime) ->\n        if currentObject\n          followTypes[currentType](currentObject, elapsedTime)\n\n        # Hard clamp camera to world bounds\n        I.x = I.x.clamp(I.cameraBounds.x + I.screen.width/2, I.cameraBounds.x + I.cameraBounds.width - I.screen.width/2)\n        I.y = I.y.clamp(I.cameraBounds.y + I.screen.height/2, I.cameraBounds.y + I.cameraBounds.height - I.screen.height/2)\n\n        I.transform = Matrix.translate(I.screen.width/2 - I.x.floor(), I.screen.height/2 - I.y.floor())\n\n      self.on \"draw\", (canvas, objects) ->\n        # Move to correct screen coordinates\n        canvas.withTransform Matrix.translate(I.screen.x, I.screen.y), (canvas) ->\n          canvas.clip(0, 0, I.screen.width, I.screen.height)\n\n          objects = objectFilters.pipeline(objects)\n          transform = transformFilters.pipeline(self.transform().copy())\n\n          canvas.withTransform transform, (canvas) ->\n            self.trigger \"beforeDraw\", canvas\n            objects.invoke \"draw\", canvas\n\n      self.on \"overlay\", (canvas, objects) ->\n        canvas.withTransform Matrix.translate(I.screen.x, I.screen.y), (canvas) ->\n          canvas.clip(0, 0, I.screen.width, I.screen.height)\n          objects = objectFilters.pipeline(objects)\n\n          objects.invoke \"trigger\", \"overlay\", canvas\n\n      self.include require \"./age\"\n      self.include require \"./bounded\"\n\n      # The order of theses includes is important for\n      # the way in wich they modify the camera view transform\n\n      for module in Camera.defaultModules\n        self.include module\n\n      return self\n\n    Camera.defaultModules = [\n      \"z_sort\"\n      \"shake\"\n      \"zoom\"\n      \"rotate\"\n      \"flash\"\n      \"fade\"\n      \"transition\"\n    ].map (name) ->\n      require \"./camera/#{name}\"\n\n    module.exports = Camera\n",
          "type": "blob"
        },
        "modules/camera/fade.coffee.md": {
          "path": "modules/camera/fade.coffee.md",
          "mode": "100644",
          "content": "Fade\n====\n\nThe `Fade` module provides convenience methods for accessing common Engine.Flash presets.\n\nCamera Effects\n--------------\n[Flash](./flash)\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->  \n      fadeInDefaults =\n        alpha: 0\n        color: 'black'\n        duration: 30\n    \n      fadeOutDefaults =\n        alpha: 1\n        color: 'transparent'\n        duration: 30\n    \n      configureFade = (duration, color, alpha) ->\n        I.flashDuration = duration\n        I.flashCooldown = duration\n        I.flashColor = Color(color)\n        I.flashTargetAlpha = alpha\n\n      self.extend\n\nMethods\n-------\n\n`fadeIn` provides a convenient way to set the flash effect instance variables. This provides a shorthand for fading the screen in \nfrom a given color over a specified duration.\n\n>     engine.fadeIn()\n>     # => Sets the effect variables to their default state. This will the screen to go from black to transparent over the next 30 frames.\n>  \n>     engine.fadeIn('blue', 50)\n>     # => This effect will start off blue and fade to transparent over 50 frames.\n\n@param {Number} [duration=30] How long the effect lasts\n@param {Color} [color=\"black\"] The color to fade from\n\n        fadeIn: (options={}) ->\n          {alpha, color, duration} = defaults(options, fadeInDefaults)\n      \n          configureFade(duration, color, alpha)\n\n`fadeOut` provides convenient way to set the flash effect instance variables. This provides a shorthand for fading \nthe screen to a given color over a specified duration.\n\n>     camera.fadeOut()\n>     # => Sets the effect variables to their default state. This will the screen to fade from ransparent to black over the next 30 frames.\n>    \n>     camera.fadeOut\n>       color: blue\n>       duration: 30\n>     # => This effect will start off transparent and change to blue over 50 frames.\n\n@param {Number} [duration=30] How long the effect lasts\n@param {Color} [color=\"transparent\"] The color to fade to\n\n        fadeOut: (options={}) ->\n          {alpha, color, duration} = defaults(options, fadeOutDefaults)\n      \n          configureFade(duration, color, alpha)\n",
          "type": "blob"
        },
        "modules/camera/flash.coffee.md": {
          "path": "modules/camera/flash.coffee.md",
          "mode": "100644",
          "content": "Flash\n=====\n\nThe `Flash` module allows you to flash a color onscreen and then fade to transparent over a time period. \nThis is nice for lightning type effects or to accentuate major game events.\n\n    {approach, defaults} = require \"../../util\"\n\n    module.exports = (I, self) ->\n      defaults I,\n        flashAlpha: 0\n        flashColor: \"black\"\n        flashDuration: 0.3\n        flashCooldown: 0\n        flashTargetAlpha: 0\n    \n      defaultParams =\n        color: 'white'\n        duration: 0.3\n        targetAlpha: 0\n\n      self.on 'afterUpdate', (dt) ->\n        if I.flashCooldown > 0\n          # TODO: Use a tween function alpha?\n          I.flashAlpha = approach(I.flashAlpha, 0, dt / I.flashDuration)\n          I.flashCooldown = approach(I.flashCooldown, 0, dt)\n\n      self.on 'overlay', (canvas) ->\n        # TODO: Canvas#withAlpha\n        previousAlpha = canvas.globalAlpha()\n        canvas.globalAlpha(I.flashAlpha)\n        canvas.fill I.flashColor\n        canvas.globalAlpha(previousAlpha)\n\n      ###*\n      A convenient way to set the flash effect instance variables. Alternatively, you can modify them by hand, but\n      using Camera#flash is the suggested approach.\n    \n          camera.flash()\n          # => Sets the flash effect variables to their default state. This will cause a white flash that will turn transparent in the next 12 frames.\n        \n          camera.flash\n            color: 'green'\n            duration: 30\n          # => This flash effect will start off green and fade to transparent over 30 frames.\n        \n          camera.flash\n            color: Color(255, 0, 0, 0)\n            duration: 20\n            targetAlpha: 1\n          # => This flash effect will start off transparent and move toward red over 20 frames \n    \n      @name flash\n      @methodOf Camera#\n      @param {Color} [color=\"white\"] The flash color\n      @param {Number} [duration=12] How long the effect lasts\n      @param {Number} [targetAlpha=0] The alpha value to fade to. By default, this is set to 0, which fades the color to transparent.\n      ###\n      flash: (options={}) ->\n        defaults(options, defaultParams)\n    \n        {color, duration, targetAlpha} = options\n    \n        I.flashColor = Color(color) \n        I.flashTargetAlpha = targetAlpha\n        I.flashCooldown = duration\n        I.flashDuration = duration\n    \n        self\n",
          "type": "blob"
        },
        "modules/camera/rotate.coffee.md": {
          "path": "modules/camera/rotate.coffee.md",
          "mode": "100644",
          "content": "Rotate\n======\n\nAdd rotation to cameras.\n\nIncluded in [Camera](../camera) by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I, self) ->\n      defaults I,\n        rotation: 0\n\n      self.transformFilterChain (transform) ->\n        transform.rotate(I.rotation, self.position())\n\n      self.attrAccessor \"rotation\"\n\n      self.extend\n        rotate: (amount) ->\n          self.rotation(I.rotation + amount)\n",
          "type": "blob"
        },
        "modules/camera/shake.coffee.md": {
          "path": "modules/camera/shake.coffee.md",
          "mode": "100644",
          "content": "Shake\n=====\n\nAdds screen shake to cameras.\n\n    {approach, defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        shakeIntensity: 20\n        shakeCooldown: 0\n\n      defaultParams =\n        duration: 0.3\n        intensity: 20\n\n      self.on \"afterUpdate\", (dt) ->\n        I.shakeCooldown = approach(I.shakeCooldown, 0, dt)\n\n      self.transformFilterChain (transform) ->\n        if I.shakeCooldown > 0\n          transform.tx += Random.signed(I.shakeIntensity)\n          transform.ty += Random.signed(I.shakeIntensity)\n\n        return transform\n\n      self.extend\n        shake: (options={}) ->\n          {duration, intensity} = defaults(options, defaultParams)\n\n          I.shakeCooldown = duration\n          I.shakeIntensity = intensity\n\n          return self\n",
          "type": "blob"
        },
        "modules/camera/transition.coffee.md": {
          "path": "modules/camera/transition.coffee.md",
          "mode": "100644",
          "content": "Transition\n==========\n\n    {defaults, extend} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        transitionActive: null\n        transitionStart: null\n        transitionEnd: null\n\n      defaultOptions =\n        color: \"white\"\n\n      transitionProgress = ->\n        ((I.age - I.transitionStart) / (I.transitionEnd - I.transitionStart)).clamp(0, 1)\n\n      transitions =\n        angle: ({canvas, t, screenSize, color}) ->\n          # Leading point at the center\n          p0 = Point(t * (screenSize.x * 2), screenSize.y / 2)\n\n          p1 = p0.subtract(Point(screenSize.x, screenSize.y / 2))\n          p2 = p1.subtract(Point(screenSize.x, 0))\n          p3 = p2.add(Point(0, screenSize.y))\n          p4 = p3.add(Point(screenSize.x, 0))\n\n          canvas.drawPoly\n            points: [p0, p1, p2, p3, p4]\n            color: color\n\n        square: ({canvas, t, screenSize, color}) ->\n          width = 50\n          height = 50\n\n          (screenSize.y / height).ceil().times (y) ->\n            (screenSize.x / width).ceil().times (x) ->\n              cellProgress = (2 * t - (x + y).mod(2)).clamp(0, 1)\n\n              canvas.drawRect\n                x: x * width\n                y: y * height\n                width: width\n                height: height * cellProgress\n                color: color\n\n        line: ({canvas, t, screenSize, color}) ->\n          height = 50\n\n          (screenSize.y / height).ceil().times (y) ->\n            canvas.drawRect\n              x: 0\n              y: y * height\n              width: screenSize.x\n              height: height * t\n              color: color\n\n      # TODO Use transition options for color\n      # TODO default transition options\n\n      self.on \"overlay\", (canvas) ->\n        if transitionName = I.transitionActive\n          transitions[transitionName] extend\n            canvas: canvas\n            screenSize: Point(I.screen.width, I.screen.height)\n            t: transitionProgress()\n          , I.transitionOptions\n\n      self.extend\n        transition: ({name, duration, options}={}) ->\n          name ?= \"angle\"\n          duration ?= 1\n          options ?= {}\n\n          I.transitionActive = name\n          I.transitionStart = I.age\n          I.transitionEnd = I.age + duration\n          I.transitionOptions = defaults(options, defaultOptions)\n",
          "type": "blob"
        },
        "modules/camera/z_sort.coffee.md": {
          "path": "modules/camera/z_sort.coffee.md",
          "mode": "100644",
          "content": "ZSort\n=====\n\nSort objects by zIndex to draw them in the correct order.\n\nIncluded in [Camera](../camera) by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        zSort: true\n\n      self.objectFilterChain (objects) ->\n        if I.zSort\n          objects.sort (a, b) ->\n            a.I.zIndex - b.I.zIndex\n\n        objects\n\n      return self\n",
          "type": "blob"
        },
        "modules/camera/zoom.coffee.md": {
          "path": "modules/camera/zoom.coffee.md",
          "mode": "100644",
          "content": "Zoom\n====\n\nAdds zoom in and out to cameras.\n\nIncluded in [Camera](../camera) by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        maxZoom: 10\n        minZoom: 0.1\n        zoom: 1\n\n      self.attrAccessor \"zoom\"\n\n      self.transformFilterChain (transform) ->\n        transform.scale(I.zoom, I.zoom, self.position())\n\n      clampZoom = (value) ->\n        value.clamp(I.minZoom, I.maxZoom)\n\n      self.extend\n        zoomIn: (percentage) ->\n          self.zoom clampZoom(I.zoom * (1 + percentage))\n\n        zoomOut: (percentage) ->\n          self.zoom clampZoom(I.zoom * (1 - percentage))\n",
          "type": "blob"
        },
        "modules/cameras.coffee.md": {
          "path": "modules/cameras.coffee.md",
          "mode": "100644",
          "content": "Cameras\n=======\n\nThe Cameras module is included in `GameState` by default.\n\n    Bindable = require \"./bindable\"\n    Camera = require \"./camera\"\n\n    module.exports = (I={}, self=Bindable()) ->\n      cameras = [Camera()]\n\n      self.on 'update', (elapsedTime) ->\n        self.cameras().invoke 'trigger', 'update', elapsedTime\n\n      self.on 'afterUpdate', (elapsedTime) ->\n        self.cameras().invoke 'trigger', 'afterUpdate', elapsedTime\n\n      self.on 'draw', (canvas) ->\n        self.cameras().invoke 'trigger', 'draw', canvas, self.objects()\n\n      self.on 'overlay', (canvas) ->\n        self.cameras().invoke 'trigger', 'overlay', canvas, self.objects()\n\nMethods\n-------\n\n      self.extend\n\n`addCamera` adds a camera to the cameras present.\n\n        addCamera: (data) ->\n          cameras.push(Camera(data))\n\nReturns the array of camera objects or sets them if an argument is passed in.\n\n        cameras: (newCameras) ->\n          if newCameras\n            cameras = newCameras\n\n            return self\n          else\n            return cameras\n",
          "type": "blob"
        },
        "modules/clamp.coffee.md": {
          "path": "modules/clamp.coffee.md",
          "mode": "100644",
          "content": "Clamp\n=====\n\nThe `Clamp` module provides helper methods to clamp object properties.\n\nThis module is included by default in `GameObject`\n\n    Bindable = require \"./bindable\"\n    {defaults, extend} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        clampData: {}\n\n      self.on \"afterUpdate\", ->\n        for property, data of I.clampData\n          I[property] = I[property].clamp(data.min, data.max)\n\n\n      self.extend\n\n`clamp` keeps an object's attributes within a given range.\n\nExample: Player's health will be within [0, 100] at the end of every update\n\n>     player.clamp\n>       health:\n>         min: 0\n>         max: 100\n\nExample: Score can only be positive\n\n>     player.clamp\n>       score:\n>         min: 0\n\n        clamp: (data) ->\n          extend(I.clampData, data)\n\nHelper to clamp the `x` and `y` properties of the object to be within a given bounds.\n\n        clampToBounds: (bounds) ->\n          bounds ||= Rectangle x: 0, y: 0, width: App.width, height: App.height\n\n          self.clamp\n            x:\n              min: bounds.x + I.width/2\n              max: bounds.width - I.width/2\n            y:\n              min: bounds.y + I.height/2\n              max: bounds.height - I.height/2\n",
          "type": "blob"
        },
        "modules/cooldown.coffee.md": {
          "path": "modules/cooldown.coffee.md",
          "mode": "100644",
          "content": "Cooldown\n========\n\nThe `Cooldown` module provides a declarative way to manage cooldowns type changes\nto an objects properties.\n\nExample: Health regeneration\n\nPlayer's health will approach target of `100` by `1` unit every second of elapsed\ngame time.\n\n>     player = GameObject\n>       health: 50\n>\n>     player.cooldown \"health\",\n>       target: 100\n>\n>     elapsedTime = 1\n>     player.update(elapsedTime)\n>\n>     player.I.health\n>     # => 51\n\nExample: Rate of fire timeout\n\nBy default the cooldown approaches the target of `0` by `1` unit each second.\n\n>     player = GameObject()\n>     player.cooldown \"shootTimer\"\n>     player.I.shootTimer = 10 # => Pew! Pew!\n>\n>     player.update(elapsedTime)\n>\n>     player.I.shootTimer # => 9\n\nExample: Turbo cooldown\n\n>     # Turbo Cooldown\n>     player = GameObject()\n>\n>     # turboTimer starts at 1000\n>     # and approaches 12 by 5 each second\n>     player.cooldown \"turboTimer\",\n>       approachBy: 5\n>       target: 12\n>\n>     player.I.turboTimer = 1000\n>\n>     player.update(elapsedTime)\n>\n>     player.I.turboTimer # => 995\n\n    Bindable = require \"./bindable\"\n    {approach, defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        cooldowns: {}\n\n      self.on \"update\", (dt) ->\n        for name, cooldownOptions of I.cooldowns\n          {approachBy, target} = cooldownOptions\n\n          I[name] = approach(I[name], target, approachBy * dt)\n\n      self.extend\n        cooldown: (name, options={}) ->\n          {target, approachBy} = options\n\n          target ?= 0\n          approachBy ?= 1\n\n          I[name] ?= 0\n\n          # Set the cooldown data\n          I.cooldowns[name] = {\n            target\n            approachBy\n          }\n\n          return self\n",
          "type": "blob"
        },
        "modules/drawable.coffee.md": {
          "path": "modules/drawable.coffee.md",
          "mode": "100644",
          "content": "Drawable\n========\n\nThe `Drawable` module is used to provide a simple draw method to the including\nobject.\n\nBinds a default draw listener to draw a rectangle or a sprite, if one exists.\n\nBinds an udtade listener to update the transform of the object.\n\nAutoloads the sprite specified in I.sprite, if any.\n\n>     player = Drawable\n>       x: 15\n>       y: 30\n>       width: 5\n>       height: 5\n>       sprite: \"my_cool_sprite\"\n>\n>     player.draw(canvas)\n\nEvents\n------\n\nThe drawing events triggered are:\n\n>     beforeTransform\n>     beforeDraw\n>     draw\n>     afterDraw\n>     afterTransform\n\nTODO: Find out how much each of these is actually used and cut any that aren't\nuseful.\n\n`beforeTransform` is triggered before the object should be drawn. A canvas is passed as\nthe first argument. This does not apply the object's current transform.\n\n`beforeDraw` is triggered before draw, but after the transform has been applied.\n\n`draw` is triggered every time the object should be drawn. A canvas is passed as\nthe first argument.\n\n>     player = GameObject\n>       x: 0\n>       y: 10\n>       width: 5\n>       height: 5\n>\n>     player.on \"draw\", (canvas) ->\n>       # Text will be drawn positioned relatively to the object.\n>       canvas.drawText\n>         text: \"Hey, drawing stuff is pretty easy.\"\n>         color: \"white\"\n>         x: 5\n>         y: 5\n\n`afterDraw` is triggered after draw with the transform still applied.\n\n`afterTransform` is triggered after the object should be drawn. A canvas is passed as\nthe first argument. This transform is not applied.\n\n    Bindable = require \"./bindable\"\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        alpha: 1\n        color: \"#196\"\n        scale: 1\n        scaleX: 1\n        scaleY: 1\n        zIndex: 0\n\n      self.off \".Drawable\"\n\n      self.on 'draw.Drawable', (canvas) ->\n        if I.alpha? and I.alpha != 1\n          previousAlpha = canvas.context().globalAlpha\n          canvas.context().globalAlpha = I.alpha\n\n        if sprite = self.sprite()\n          sprite.draw(canvas, -sprite.width / 2, -sprite.height / 2)\n        else\n          if I.radius?\n            canvas.drawCircle\n              x: 0\n              y: 0\n              radius: I.radius\n              color: I.color\n          else\n            canvas.drawRect\n              x: -I.width/2\n              y: -I.height/2\n              width: I.width\n              height: I.height\n              color: I.color\n\n        if I.alpha? and I.alpha != 1\n          canvas.context().globalAlpha = previousAlpha\n\n      self.extend\n\nDraw does not actually do any drawing itself, instead it triggers all of the draw events.\nListeners on the events do the actual drawing.\n\n        draw: (canvas) ->\n          self.trigger 'beforeTransform', canvas\n\n          canvas.withTransform self.transform(), (canvas) ->\n            self.trigger 'beforeDraw', canvas\n            self.trigger 'draw', canvas\n            self.trigger 'afterDraw', canvas\n\n          self.trigger 'afterTransform', canvas\n\n          return self\n\n        sprite: ->\n          if name = I.spriteName\n            # TODO: Resource loader?\n            Sprite.loadByName(name)\n          else if url = I.spriteURL\n            Sprite.load url\n\nReturns the current transform, with translation, rotation, and flipping applied.\n\n        transform: ->\n          center = self.center()\n\n          transform = Matrix.translation(center.x.floor(), center.y.floor())\n\n          transform = transform.concat(Matrix.scale(I.scale * I.scaleX, I.scale * I.scaleY))\n          transform = transform.concat(Matrix.rotation(I.rotation)) if I.rotation\n\n          if I.spriteOffset\n            transform = transform.concat(Matrix.translation(I.spriteOffset.x, I.spriteOffset.y))\n\n          return transform\n",
          "type": "blob"
        },
        "modules/effect.coffee.md": {
          "path": "modules/effect.coffee.md",
          "mode": "100644",
          "content": "Effect\n======\n\nA collection of effects to make your game juicy.\n\nIt is included in `GameObject` by default.\n\n    module.exports = (I={}, self) ->\n\n`fadeOut` provides a convenient way to fade out this object over time.\n\nTime to fade out in seconds. The optional second prameter is the function to\nexecute when fade out completes.\n\nFade the player object out over the next 2 seconds.\n\n>     player.fadeOut 2\n\nFade out and then destroy.\n\n>     player.fadeOut, 0.25, ->\n>       self.destroy()\n\n      self.extend\n        fadeOut: (duration=1, complete) ->\n          self.tween duration,\n            alpha: 0\n            complete: complete\n",
          "type": "blob"
        },
        "modules/engine/background.coffee.md": {
          "path": "modules/engine/background.coffee.md",
          "mode": "100644",
          "content": "Background\n==========\n\nThis module clears or fills the canvas before drawing the scene. It also provides\nsupport for drawing a sprite background.\n\nIt is included in Engine by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I, self) ->\n      defaults I,\n        background: null\n        backgroundColor: \"#00010D\"\n        clear: false\n\n      self.attrAccessor \"clear\", \"backgroundColor\"\n\n      backgroundSprite = ->\n        if I.background\n          Sprite.loadByName I.background\n\n      self.on \"beforeDraw\", ->\n        if I.clear\n          I.canvas.clear()\n        else if sprite = backgroundSprite()\n          sprite.fill(I.canvas, 0, 0, I.canvas.width(), I.canvas.height())\n        else if I.backgroundColor\n          I.canvas.fill(I.backgroundColor)\n\n      return self\n",
          "type": "blob"
        },
        "modules/engine/collision.coffee.md": {
          "path": "modules/engine/collision.coffee.md",
          "mode": "100644",
          "content": "Collision\n========\n\nThe `Collision` module provides some simple collision detection methods to engine.\n\n    Collision = require \"/lib/collision\"\n\n    module.exports = (I={}, self) ->\n      self.extend\n        ###*\n        Detects collisions between a bounds and the game objects.\n\n        @name collides\n        @methodOf Engine#\n        @param bounds The bounds to check collisions with.\n        @param [sourceObject] An object to exclude from the results.\n        @returns {Boolean} true if the bounds object collides with any of the game objects, false otherwise.\n        ###\n        collides: (bounds, sourceObject, selector=\".solid\") ->\n          self.find(selector).inject false, (collided, object) ->\n            collided or (object != sourceObject) and object.collides(bounds) and object\n\n        ###*\n        Detects collisions between a bounds and the game objects.\n        Returns an array of objects colliding with the bounds provided.\n\n        @name collidesWith\n        @methodOf Engine#\n        @param bounds The bounds to check collisions with.\n        @param [sourceObject] An object to exclude from the results.\n        @returns {Array} An array of objects that collide with the given bounds.\n        ###\n        collidesWith: (bounds, sourceObject, selector=\".solid\") ->\n          self.find(selector).select (object) ->\n            object != sourceObject and object.collides(bounds)\n\n        ###*\n        Detects collisions between a ray and the game objects.\n\n        @name rayCollides\n        @methodOf Engine#\n        @param source The origin point\n        @param direction A point representing the direction of the ray\n        @param [sourceObject] An object to exclude from the results.\n        @param [selector] A selector to choos which objects in the engine to collide with\n        ###\n        rayCollides: ({source, direction, sourceObject, selector}) ->\n          selector ?= \"\"\n\n          hits = self.find(selector).map (object) ->\n            hit = (object != sourceObject) and Collision.rayRectangle(source, direction, object.centeredBounds())\n            hit.object = object if hit\n\n            hit\n\n          nearestDistance = Infinity\n          nearestHit = null\n\n          hits.each (hit) ->\n            if hit && (d = hit.distance(source)) < nearestDistance\n              nearestDistance = d\n              nearestHit = hit\n\n          nearestHit\n\n        # TODO Allow specification of collision type (i.e. circular)\n        objectsUnderPoint: (point, selector=\"\") ->\n          bounds = {\n            x: point.x\n            y: point.y\n            width: 0\n            height: 0\n          }\n\n          self.find(selector).select (object) ->\n            object.collides(bounds)\n",
          "type": "blob"
        },
        "modules/engine/finder.coffee.md": {
          "path": "modules/engine/finder.coffee.md",
          "mode": "100644",
          "content": "Finder\n======\n\n    Finder = require \"finder\"\n\n    module.exports = (I={}, self) ->\n      finder = Finder()\n\n      self.extend\n        find: (selector) ->\n          finder.find self.objects(), selector\n",
          "type": "blob"
        },
        "modules/engine/game_state.coffee.md": {
          "path": "modules/engine/game_state.coffee.md",
          "mode": "100644",
          "content": "GameState\n=========\n\nThis engine module provides GameState support to the engine.\n\nIt is included in `Engine` by default.\n\n    {defaults} = require \"../../util\"\n    GameState = require \"../../game_state\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        # TODO: Shouldn't store complex objects in I properties\n        currentState: GameState()\n\n      requestedState = null\n\n      # The idea is that all the engine#beforeUpdate triggers happen\n      # before the state beforeUpdate triggers, then the state update\n      # then the state after update, then the engine after update\n      # like a layered cake with states in the middle.\n      self.on \"update\", (elapsedTime) ->\n        I.currentState.trigger \"beforeUpdate\", elapsedTime\n        I.currentState.trigger \"update\", elapsedTime\n        I.currentState.trigger \"afterUpdate\", elapsedTime\n\n      self.on \"afterUpdate\", ->\n        # Handle state change\n        if requestedState?\n          I.currentState.trigger \"exit\", requestedState\n          self.trigger 'stateExited', I.currentState\n\n          previousState = I.currentState\n          I.currentState = requestedState\n\n          I.currentState.trigger \"enter\", previousState\n          self.trigger 'stateEntered', I.currentState\n\n          requestedState = null\n\n      self.on \"draw\", (canvas) ->\n        I.currentState.trigger \"beforeDraw\", canvas\n        I.currentState.trigger \"draw\", canvas\n        I.currentState.trigger \"overlay\", canvas\n\n      self.extend\n        # Just pass through to the current state\n        add: (classNameOrEntityData, entityData={}) ->\n          # Allow optional add \"Class\", data form\n          if typeof classNameOrEntityData is \"string\"\n            entityData.class = classNameOrEntityData\n          else\n            entityData = classNameOrEntityData\n\n          self.trigger \"beforeAdd\", entityData\n          object = I.currentState.add(entityData)\n          self.trigger \"afterAdd\", object\n\n          return object\n\n        camera: (n=0) ->\n          self.cameras()[n]\n\n        cameras: (newCameras) ->\n          if newCameras?\n            I.currentState.cameras(newCameras)\n\n            return self\n          else\n            I.currentState.cameras()\n\n        fadeIn: (options={}) ->\n          self.cameras().invoke('fadeIn', options)\n\n        fadeOut: (options={}) ->\n          self.cameras().invoke('fadeOut', options)\n\n        flash: (options={}) ->\n          self.camera(options.camera).flash(options)\n\n        objects: ->\n          I.currentState.objects()\n\n        setState: (newState) ->\n          requestedState = newState\n\n        shake: (options={}) ->\n          self.camera(options.camera).shake(options)\n\n        saveState: ->\n          I.currentState.saveState()\n\n        loadState: (newState) ->\n          I.currentState.loadState(newState)\n\n        reload: ->\n          I.currentState.reload()\n",
          "type": "blob"
        },
        "modules/engine/keyboard.coffee.md": {
          "path": "modules/engine/keyboard.coffee.md",
          "mode": "100644",
          "content": "Keyboard\n========\n\nThis module sets up the keyboard inputs for each engine update.\n\nSee also [Mouse](./mouse)\n\nUsage\n-----\n\nThe global `keydown` property lets your query the status of keys.\n\n>     if keydown.left\n>       moveLeft()\n>\n>     if keydown.a or keydown.space\n>       attack()\n>\n>     if keydown.return\n>       confirm()\n>\n>     if keydown.esc\n>       cancel()\n\nThe global `justPressed` property lets your query the status of keys. However,\nunlike keydown it will only trigger once for each time the key is pressed.\n\n>     if justPressed.left\n>       moveLeft()\n>\n>     if justPressed.a or justPressed.space\n>       attack()\n>\n>     if justPressed.return\n>       confirm()\n>\n>     if justPressed.esc\n>       cancel()\n\nImplementation\n--------------\n\n    window.keydown = {}\n    window.justPressed = {}\n    window.justReleased = {}\n\n    prevKeysDown = {}\n\n    keyName = (event) ->\n      jQuery.hotkeys.specialKeys[event.which] ||\n      String.fromCharCode(event.which).toLowerCase()\n\n    $(document).bind \"keydown\", (event) ->\n      key = keyName(event)\n      keydown[key] = true\n\n    $(document).bind \"keyup\", (event) ->\n      key = keyName(event)\n      keydown[key] = false\n\n    updateKeys = () ->\n      window.justPressed = {}\n      window.justReleased = {}\n      keydown.any = false\n\n      for key, value of keydown\n        justPressed[key] = value and !prevKeysDown[key]\n        justReleased[key] = !value and prevKeysDown[key]\n\n        justPressed.any = true if (justPressed[key] || mousePressed?.left || mousePressed?.right)\n        keydown.any = true if (value || mouseDown?.left || mouseDown?.right)\n\n      prevKeysDown = {}\n      for key, value of keydown\n        prevKeysDown[key] = value\n\n    module.exports = (I={}, self) ->\n      self.on \"beforeUpdate\", ->\n        updateKeys()\n\n      return self\n\nTODO\n----\n\n- Get rid of jQuery dependency, consolidate with hotkeys lib\n",
          "type": "blob"
        },
        "modules/engine/mouse.coffee.md": {
          "path": "modules/engine/mouse.coffee.md",
          "mode": "100644",
          "content": "Mouse\n=====\n\nThis module sets up the mouse inputs for each engine update.\n\nSee also [Keyboard](./keyboard)\n\nUsage\n-----\n\nThe global mouseDown property lets your query the status of mouse buttons.\n\n>     if mouseDown.left\n>       moveLeft()\n>\n>     if mouseDown.right\n>       attack()\n\nThe global mousePressed property lets your query the status of mouse buttons.\nHowever, unlike mouseDown it will only trigger the first time the button\npressed.\n\n>     if mousePressed.left\n>       moveLeft()\n>\n>     if mousePressed.right\n>       attack()\n\nImplementation\n--------------\n\n    window.mouseDown = {}\n    window.mousePressed = {}\n    window.mouseReleased = {}\n    window.mousePosition = Point(0, 0)\n\n    prevButtonsDown = {}\n\n    buttonNames =\n      1: \"left\"\n      2: \"middle\"\n      3: \"right\"\n\n    buttonName = (event) ->\n      buttonNames[event.which]\n\n    $(document).bind \"mousemove\", (event) ->\n      # Position relative to canvas element\n      offset = $(\"canvas\").offset() or {left: 0, top: 0}\n\n      mousePosition.x = event.pageX - offset.left\n      mousePosition.y = event.pageY - offset.top\n\n    $(document).bind \"mousedown\", (event) ->\n      mouseDown[buttonName(event)] = true\n\n    $(document).bind \"mouseup\", (event) ->\n      mouseDown[buttonName(event)] = false\n\n    window.updateMouse = ->\n      window.mousePressed = {}\n      window.mouseReleased = {}\n\n      for button, value of mouseDown\n        mousePressed[button] = value unless prevButtonsDown[button]\n\n      for button, value of mouseDown\n        mouseReleased[button] = !value if prevButtonsDown[button]\n\n      prevButtonsDown = {}\n      for button, value of mouseDown\n        prevButtonsDown[button] = value\n\n    module.exports = (I={}, self) ->\n      self.on \"beforeUpdate\", ->\n        updateMouse?()\n\n      return self\n\nTODO\n----\n\n- Integrate with TouchCanvas rather than global mouse handling\n",
          "type": "blob"
        },
        "modules/expirable.coffee.md": {
          "path": "modules/expirable.coffee.md",
          "mode": "100644",
          "content": "Expirable\n=========\n\nThe Expirable module deactivates a `GameObject` after a specified duration.\n\nThe duration is specified in seconds. If -1 is\nspecified the object will have an unlimited duration.\n\nThis module is included by default in `GameObject`.\n\n>     enemy = GameObject\n>       duration: 5\n>\n>     enemy.include Expirable\n>\n>     enemy.I.active\n>     # => true\n>\n>     5.times ->\n>       enemy.update(1)\n>\n>     enemy.I.active\n>     # => false\n\n    Bindable = require \"./bindable\"\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        duration: -1\n\n      self.on \"update\", (dt) ->\n        if I.duration != -1 && I.age >= I.duration\n          I.active = false\n\n      return self\n",
          "type": "blob"
        },
        "modules/follow.coffee.md": {
          "path": "modules/follow.coffee.md",
          "mode": "100644",
          "content": "Follow\n======\n\nThe `Follow` module provides a simple method to set an object's\nvelocity so that it is moving towards another object.\n\nThe calculated direction is based on the position of each object.\n\nThis method relies on both objects having the `position` method.\n\nThis module is included in `GameObject` by default.\n\n>     player = GameObject\n>       x: 50\n>       y: 50\n>       width: 10\n>       height: 10\n>\n>     enemy = GameObject\n>       x: 100\n>       y: 50\n>       width: 10\n>       height: 10\n>       velocity: Point(0, 0)\n>       speed: 2\n>\n>     # Make an enemy follow the player\n>     enemy.follow(player)\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Core(I)) ->\n      defaults I,\n        velocity: Point(0, 0)\n        speed: 1\n\n      self.attrAccessor \"speed\"\n\n`follow` sets the velocity of this object to follow another object.\n\nThe velocity is in the direction of the player, with magnitude equal to\nthis object's speed.\n\n>     enemy.follow(player)\n\nCall this in an `update` listener to always follow a target object.\n\n>    self.on \"update\", ->\n>      self.follow(player)\n\n      self.extend\n        follow: (obj) ->\n          if obj.position?\n            position = obj.position()\n          else if obj.x?\n            position = obj\n\n          if position\n            I.velocity = position.subtract(self.position()).norm(self.speed())\n",
          "type": "blob"
        },
        "modules/meter.coffee.md": {
          "path": "modules/meter.coffee.md",
          "mode": "100644",
          "content": "Meter\n=====\n\nThe `Meter` module provides a simple drop-in\nmeter ui to track arbitrary numeric attributes.\n\n>     player = GameObject\n>       health: 100\n>       heathMax: 100\n>\n>     enemy = GameObject\n>       health: 500\n>\n>     someOtherObject = GameObject\n>\n>     player.meter 'health'\n>     # => Sets up a health meter that will be drawn during the player overlay event\n>\n>     enemy.meter 'health'\n>     # => Sets up a health meter that will be drawn during the enemy overlay event.\n>     # Since healthMax wasn't provided, it is set to the value of I.health (500)\n>\n>     someOtherObject.meter 'turbo'\n>     # => Sets up a turbo meter that will be drawn during the someOtherObject overlay event.\n>     # Since neither turbo or turboMax were provided, they are both set to 100.\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        meters: {}\n\n      self.on 'overlay', (canvas) ->\n        for name, meterData of I.meters\n          {\n            backgroundColor,\n            border: {color:borderColor, radius:borderRadius, width:borderWidth}\n            color,\n            height,\n            show,\n            width,\n            x,\n            y\n          } = meterData\n\n          {x, y} = meterData.position if meterData.position?\n\n          return unless show\n\n          ratio = (I[name] / I[\"#{name}Max\"]).clamp(0, 1)\n\n          canvas.drawRoundRect\n            color: backgroundColor\n            radius: borderRadius\n            x: x\n            y: y\n            width: width\n            height: height\n\n          canvas.drawRoundRect\n            color: color\n            x: x\n            y: y\n            radius: borderRadius\n            width: width * ratio\n            height: height\n\n          canvas.drawRoundRect\n            x: x\n            y: y\n            width: width\n            height: height\n            radius: borderRadius\n            stroke:\n              color: borderColor\n              width: borderWidth\n\n      self.extend\n        ###*\n        Configures a meter to be drawn each overlay event.\n\n            player = GameObject\n\n            player.meter 'health',\n              border\n                color: 'brown'\n                radius: 3\n              color: 'pink'\n              height: 20\n              x: 5\n              y: 5\n              show: true\n              width: 150\n\n            # => Sets up a health meter, using all the configuration options\n\n        @name meter\n        @methodOf Metered#\n        @param {String} name The name of the property to meter\n        @param {Object} options The meter configuration options\n        @param {String} border: color Color of the meter's border\n        @param {Number} border: width Width of the meter's border\n        @param {String} color Color of the meter's inner rectangle\n        @param {Number} height Height of the meter\n        @param {Object} position An x, y object representing the position of the meter\n        @param {Number} x x position of the meter\n        @param {Number} y y position of the meter\n        @param {Number} border: radius Border radius of the meter\n        @param {Boolean} show Boolean to toggle whether of not to display the meter\n        @param {Number} width How wide the meter is\n        ###\n        meter: (name, options={}) ->\n          defaults options,\n            backgroundColor: 'black'\n            border:\n              color: 'white'\n              radius: 2\n              width: 1.5\n            color: 'green'\n            height: 10\n            x: 0\n            y: 0\n            show: true\n            width: 100\n\n          I[name] ?= 100\n\n          if not I[\"#{name}Max\"]\n            if I[name]\n              I[\"#{name}Max\"] = I[name]\n            else\n              I[\"#{name}Max\"] = 100\n\n          I.meters[name] = options\n\n        ###*\n        Shows the named meter\n\n            player = GameObject\n\n            # creates a health meter but disables visibility\n            player.meter 'health'\n              show: false\n\n            # enables visibility for the meter named 'health'\n            player.showMeter 'health'\n\n        @name showMeter\n        @methodOf Metered#\n        @param {String} name The name of the meter to show\n        ###\n        showMeter: (name) ->\n          I.meters[name].show = true\n\n        ###*\n        Hides the named meter\n\n            player = GameObject\n\n            # creates a health meter\n            player.meter 'health'\n\n            # disables visibility for the meter named 'health'\n            player.hideMeter 'health'\n\n        @name hideMeter\n        @methodOf Metered#\n        @param {String} name The name of the meter to hide\n        ###\n        hideMeter: (name) ->\n          I.meters[name].show = false\n\n        ###*\n        Toggles visibility of the named meter\n\n            player = GameObject\n\n            # creates a health meter\n            player.meter 'health'\n\n            # toggles visibility for the meter named 'health'\n            player.toggleMeter 'health'\n\n        @name toggleMeter\n        @methodOf Metered#\n        @param {String} name The name of the meter to toggle\n        ###\n        toggleMeter: (name) ->\n          I.meters[name].show = not I.meters[name].show\n",
          "type": "blob"
        },
        "modules/movable.coffee.md": {
          "path": "modules/movable.coffee.md",
          "mode": "100644",
          "content": "Movable\n=======\n\nThe Movable module automatically updates the position and velocity of\nGameObjects based on the velocity and acceleration.\n\nIt is included in `GameObject` by default.\n\n>     player = GameObject\n>       x: 0\n>       y: 0\n>       velocity: Point(0, 0)\n>       acceleration: Point(1, 0)\n>       maxSpeed: 2\n>\n>     # => `velocity is {x: 0, y: 0} and position is {x: 0, y: 0}`\n>\n>     player.update(1)\n>     # => `velocity is {x: 1, y: 0} and position is {x: 1, y: 0}`\n>\n>     player.update(1)\n>     # => `velocity is {x: 2, y: 0} and position is {x: 3, y: 0}`\n>\n>     # we've hit our maxSpeed so our velocity won't increase\n>     player.update(1)\n>     # => `velocity is {x: 2, y: 0} and position is {x: 5, y: 0}`\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        acceleration: Point(0, 0)\n        velocity: Point(0, 0)\n\n      # Force acceleration and velocity to be Points\n      # Useful when reloading data from JSON\n      I.acceleration = Point(I.acceleration.x, I.acceleration.y)\n      I.velocity = Point(I.velocity.x, I.velocity.y)\n\n      self.attrReader \"velocity\", \"acceleration\"\n\n      # Handle multi-include\n      self.off \".Movable\"\n\n      self.on 'update.Movable', (dt) ->\n        I.velocity = I.velocity.add(I.acceleration.scale(dt))\n\n        if I.maxSpeed?\n          currentSpeed = I.velocity.magnitude()\n          if currentSpeed > I.maxSpeed\n            I.velocity = I.velocity.scale(I.maxSpeed / currentSpeed)\n\n        I.x += I.velocity.x * dt\n        I.y += I.velocity.y * dt\n",
          "type": "blob"
        },
        "modules/rotatable.coffee.md": {
          "path": "modules/rotatable.coffee.md",
          "mode": "100644",
          "content": "Rotatable\n=========\n\nThe Rotatable module rotates the object\nbased on its rotational velocity.\n\n>     player = GameObject\n>       x: 0\n>       y: 0\n>       rotationalVelocity: Math.PI / 64\n>\n>     player.I.rotation\n>     # => 0\n>\n>     player.update(1)\n>\n>     player.I.rotation\n>     # => 0.04908738521234052 # Math.PI / 64\n>\n>     player.update(1)\n>\n>     player.I.rotation\n>     # => 0.09817477042468103 # 2 * (Math.PI / 64)\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        rotation: 0\n        rotationalVelocity: 0\n\n      self.on 'update', (dt) ->\n        I.rotation += I.rotationalVelocity * dt\n\n      return self\n",
          "type": "blob"
        },
        "modules/save_state.coffee.md": {
          "path": "modules/save_state.coffee.md",
          "mode": "100644",
          "content": "SaveState\n=========\n\nThe `SaveState` module provides methods to save and restore the current game state.\n\nIt is included in `GameState` by default\n\n    {extend} = require \"/util\"\n\n    module.exports = (I={}, self=Core(I)) ->\n      savedState = null\n\nMethods\n-------\n\n      self.extend\n\n`saveState` saves the current game state and returns a JSON object representing\nthat state.\n\n@returns {Array} An array of the instance data of all objects in the game state\n\n>     engine.on 'update', ->\n>       if justPressed.s\n>         engine.saveState()\n\n        saveState: ->\n          savedState = I.objects.map (object) ->\n            extend({}, object.I)\n\nLoads the game state passed in, or the last saved state, if any.\n\n@param [newState] An array of object instance data to load.\n\n>     engine.on 'update', ->\n>       if justPressed.l\n>         # loads the last saved state\n>         engine.loadState()\n>\n>       if justPressed.o\n>         # removes all game objects, then reinstantiates\n>         # them with the entityData passed in\n>         engine.loadState([{x: 40, y: 50, class: \"Player\"}, {x: 0, y: 0, class: \"Enemy\"}, {x: 500, y: 400, class: \"Boss\"}])\n\n        loadState: (newState) ->\n          if newState ||= savedState\n            I.objects.invoke \"trigger\", \"remove\"\n            I.objects = []\n\n            newState.each (objectData) ->\n              self.add extend({}, objectData)\n\nReloads the current game state, useful for hotswapping code.\n\n        reload: ->\n          oldObjects = I.objects\n          I.objects = []\n\n          oldObjects.each (object) ->\n            object.trigger \"remove\"\n\n            self.add object.I\n\n          return self\n",
          "type": "blob"
        },
        "modules/timed_events.coffee.md": {
          "path": "modules/timed_events.coffee.md",
          "mode": "100644",
          "content": "Timed Events\n============\n\nThe TimedEvents module allows arbitrary code to be executed at set intervals.\n\n`GameObject` includes this module by default.\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        everyEvents: []\n        delayEvents: []\n\n      self.bind \"update\", (elapsedTime) ->\n        for event in I.everyEvents\n          {fn, period} = event\n\n          continue if period <= 0\n\n          while event.lastFired < I.age + elapsedTime\n            self.sendOrApply(fn)\n            event.lastFired += period\n\n        [I.delayEvents, firingEvents] = I.delayEvents.partition (event) ->\n          (event.delay -= elapsedTime) >= 0\n\n        firingEvents.each (event) ->\n          self.sendOrApply(event.fn)\n\n      self.extend\n\nExecute `fn` every `n` seconds.\n\n>     player.every 4, ->\n>       doSomething()\n\nExecute a method by name periodically.\n\n>     monster.every 3, \"growl\"\n\n        every: (period, fn) ->\n          return unless period > 0\n\n          I.everyEvents.push\n            fn: fn\n            period: period\n            lastFired: I.age\n\n          return self\n\nExecute a function or method after a number of seconds have passed.\n\n>     self.delay 5, ->\n>       engine.add\n>         class: \"Ghost\"\n\n        delay: (seconds, fn) ->\n          I.delayEvents.push\n            delay: seconds\n            fn: fn\n\n          return self\n\n        # TODO: Move this into a more core module\n        sendOrApply: (fn, args...) ->\n          if typeof fn is \"function\"\n            fn.apply(self, args)\n          else\n            self[fn](args...)\n",
          "type": "blob"
        },
        "modules/tween.coffee.md": {
          "path": "modules/tween.coffee.md",
          "mode": "100644",
          "content": "Tween\n=====\n\nThe `Tween` module provides a method to tween object properties.\n\n    {defaults, extend} = require \"../util\"\n\n    Easing = require \"../lib/easing\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        activeTweens: {}\n\n      self.on \"update\", (elapsedTime) ->\n        t = I.age + elapsedTime\n\n        for property, data of I.activeTweens\n          {start, end, startTime, endTime, duration, easing} = data\n\n          delta = end - start\n\n          if t >= endTime\n            I[property] = end\n            I.activeTweens[property].complete?()\n            delete I.activeTweens[property]\n          else\n            if typeof easing is \"string\"\n              easingFunction = Easing[easing]\n            else\n              easingFunction = easing\n\n            I[property] = start + delta * easingFunction((t - startTime) / duration)\n\nModify the object's properties over time.\n\nDuration How long (in frames) until the object's properties reach their final values.\nThe second prameter is which properties to tween.\n\nSet the `easing` property to specify the easing function.\n\n>     player.tween 3,\n>       x: 50\n>       y: 50\n>       easing: \"quadratic\"\n\n>     player.tween 3,\n>       x: 150\n>       y: 150\n>       complete: ->\n>         player.dance()\n\n      self.extend\n        tween: (duration, properties) ->\n          properties = extend({}, properties) # Make a local copy\n\n          easing = properties.easing || \"linear\"\n          complete = properties.complete\n\n          delete properties.easing\n          delete properties.complete\n\n          for property, target of properties\n            I.activeTweens[property] =\n              complete: complete\n              end: target\n              start: I[property]\n              easing: easing\n              duration: duration\n              startTime: I.age\n              endTime: I.age + duration\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.1.8-alpha.2\"\nwidth: 640\nheight: 480\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.10.1.min.js\"\n]\ndependencies:\n  appcache: \"distri/appcache:v0.2.0\"\n  cornerstone: \"distri/cornerstone:v0.2.0\"\n  \"finder\": \"distri/finder:v0.1.3\"\n  hotkeys: \"distri/hotkeys:v0.2.0\"\n  \"jquery-utils\": \"distri/jquery-utils:v0.2.0\"\n  sprite: \"distri/sprite:v0.3.0\"\n  \"touch-canvas\": \"distri/touch-canvas:v0.3.0\"\n",
          "type": "blob"
        },
        "setup.coffee.md": {
          "path": "setup.coffee.md",
          "mode": "100644",
          "content": "Setup\n=====\n\n    require \"jquery-utils\"\n\n    # Updating Application Cache and prompting for new version\n    require \"appcache\"\n\n    require \"cornerstone\"\n\n    # TODO: Don't make these pure global\n    global.Bindable = require \"./modules/bindable\"\n    global.Sprite = require \"sprite\"\n",
          "type": "blob"
        },
        "style.styl": {
          "path": "style.styl",
          "mode": "100644",
          "content": "*\n  box-sizing: border-box\n\nhtml\n  height: 100%\n\nbody\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif\n  font-weight: 300\n  font-size: 18px\n  height: 100%\n  margin: 0\n  overflow: hidden\n  user-select: none\n\n.center\n  bottom: 0\n  position: absolute\n  top: 0\n  left: 0\n  right: 0\n  margin: auto\n",
          "type": "blob"
        },
        "test/engine.coffee": {
          "path": "test/engine.coffee",
          "mode": "100644",
          "content": "require \"../test_setup\"\n\nEngine = require \"../engine\"\n\ndescribe \"Engine\", ->\n\n  MockCanvas = ->\n    clear: ->\n    context: ->\n      beginPath: ->\n      clip: ->\n      rect: ->\n    drawRect: ->\n    fill: ->\n    withTransform: (t, fn) ->\n      fn(@)\n    clip: ->\n    globalAlpha: ->\n\n  test \"#play, #pause, and #paused\", ->\n    engine = Engine()\n\n    equal engine.paused(), false\n    engine.pause()\n    equal engine.paused(), true\n    engine.play()\n    equal engine.paused(), false\n\n    engine.pause()\n    equal engine.paused(), true\n    engine.pause()\n    equal engine.paused(), false\n\n    engine.pause(false)\n    equal engine.paused(), false\n\n    engine.pause(true)\n    equal engine.paused(), true\n\n  test \"#save and #restore\", ->\n    engine = Engine()\n\n    engine.add {}\n    engine.add {}\n\n    equals(engine.objects().length, 2)\n\n    engine.saveState()\n\n    engine.add {}\n\n    equals(engine.objects().length, 3)\n\n    engine.loadState()\n\n    equals(engine.objects().length, 2)\n\n  test \"before add event\", ->\n    engine = Engine()\n\n    engine.bind \"beforeAdd\", (data) ->\n      equals data.test, \"test\"\n\n    engine.add\n      test: \"test\"\n\n  test \"#add\", ->\n    engine = Engine()\n\n    assert engine.objects().length is 0\n\n    engine.add \"GameObject\",\n      test: true\n\n    assert engine.objects().length is 1\n\n  test \"#add class name only\", ->\n    engine = Engine()\n\n    assert engine.objects().length is 0\n    engine.add \"GameObject\"\n    assert engine.objects().length is 1\n\n  test \"zSort\", ->\n    engine = Engine\n      canvas: MockCanvas()\n      zSort: true\n\n    n = 0\n    bindDraw = (o) ->\n      o.bind 'draw', ->\n        n += 1\n        o.I.drawnAt = n\n\n    o2 = engine.add\n      zIndex: 2\n    o1 = engine.add\n      zIndex: 1\n\n    bindDraw(o1)\n    bindDraw(o2)\n\n    engine.frameAdvance()\n\n    equals o1.I.drawnAt, 1, \"Object with zIndex #{o1.I.zIndex} should be drawn first\"\n    equals o2.I.drawnAt, 2, \"Object with zIndex #{o2.I.zIndex} should be drawn second\"\n\n  test \"draw events\", ->\n    engine = Engine\n      canvas: MockCanvas()\n      backgroundColor: false\n\n    calls = 0\n\n    engine.bind \"beforeDraw\", ->\n      calls += 1\n      ok true\n\n    engine.bind \"draw\", ->\n      calls += 1\n      ok true\n\n    engine.frameAdvance()\n\n    equals calls, 2\n\n  test \"Remove event\", ->\n    engine = Engine\n      backgroundColor: false\n\n    object = engine.add\n      active: false\n\n    called = 0\n    object.bind \"remove\", ->\n      called += 1\n      ok true, \"remove called\"\n\n    engine.frameAdvance()\n\n    assert.equal called, 1\n\n  test \"#find\", ->\n    engine = Engine()\n\n    engine.add\n      id: \"testy\"\n\n    engine.add\n      test: true\n    .attrReader \"test\"\n\n    engine.add\n      solid: true\n      opaque: false\n    .attrReader \"solid\", \"opaque\"\n\n    equal engine.find(\"#no_testy\").length, 0, \"No object with id `no_testy`\"\n    equal engine.find(\"#testy\").length, 1, \"Object with id `testy`\"\n    equal engine.find(\".test\").length, 1, \"Object with attribute `test`\"\n    equal engine.find(\".solid=true\").length, 1, \"Object with attribute `solid` equal to true\"\n    equal engine.find(\".opaque=false\").length, 1, \"Object with attribute `opaque` equal to false\"\n\n  test \"#camera\", ->\n    engine = Engine()\n\n    equal engine.camera(), engine.cameras().first()\n\n  test \"#collides\", ->\n    engine = Engine()\n\n    engine.collides({x: 0, y: 0, width: 10, height: 10}, null)\n\n  test \"Integration\", ->\n    engine = Engine\n      FPS: 30\n\n    object = engine.add\n      class: \"GameObject\"\n      velocity: Point(30, 0)\n\n    engine.frameAdvance()\n\n    equals object.I.x, 1\n    equals object.I.age, 1/30\n\n  test \"objectsUnderPoint\", ->\n    engine = Engine()\n\n    object = engine.add\n      x: 0\n      y: 0\n      width: 100\n      height: 100\n\n    equals engine.objectsUnderPoint(Point(0, 0)).length, 1\n    equals engine.objectsUnderPoint(Point(300, 300)).length, 0\n\n  # TODO: Maybe this should be a state stack and have pushState and popState\n  # in addition to setState\n  # TODO: This should be in GameStates test, not engine\n  test \"#setState\"# TODO, ->\n  ###\n    engine = Engine()\n\n    # TODO: Shouldn't need to use the GameState constructor itself\n    nextState = GameState()\n\n    engine.setState nextState\n\n    # Test state change events\n    engine.bind \"stateEntered\", ->\n      ok true\n    engine.bind \"stateExited\", ->\n      ok true\n\n    engine.update()\n\n    equal engine.I.currentState, nextState\n  ###\n",
          "type": "blob"
        },
        "test/game_object.coffee": {
          "path": "test/game_object.coffee",
          "mode": "100644",
          "content": "require \"../test_setup\"\n\nGameObject = require \"../game_object\"\n\ndescribe \"GameObject\", ->\n\n  test \"()\", ->\n    gameObject = GameObject()\n    ok gameObject\n\n  test \".construct\", ->\n    gameObject = GameObject.construct\n      name: \"Gandalf\"\n\n    equals(gameObject.I.name, \"Gandalf\")\n\n  test \"construct invalid object\", ->\n    raises ->\n      GameObject.construct\n        class: \"aaaaa\"\n\n  test \"#closest\", ->\n    o = GameObject\n      x: 0\n      y: 0\n\n    other = GameObject\n      x: 1\n      y: 1\n\n    other2 = GameObject\n      x: 10\n      y: 10\n\n    equals o.closest([]), null\n\n    equals o.closest([other, other2]), other\n\n  test \"elapsedTime\", ->\n    gameObject = GameObject()\n\n    timeStep = 33\n\n    gameObject.bind \"update\", (t) ->\n      equals t, timeStep\n\n    gameObject.update(timeStep)\n\n  test \"[event] create\", ->\n    o = GameObject()\n\n    called = 0\n\n    o.bind \"create\", ->\n      called += 1\n      ok true, \"created event is fired on create\"\n\n    o.create()\n    o.create() # Make sure only fired once\n\n    assert.equal called, 1\n\n  test \"[event] update\", ->\n    gameObject = GameObject()\n\n    gameObject.bind \"update\", ->\n      equals(gameObject.I.age, 0, 'Age should be 0 on first update')\n\n    gameObject.trigger \"update\", 1\n\n  test \"[event] destroy\", ->\n    o = GameObject()\n\n    called = 0\n\n    o.bind \"destroy\", ->\n      called += 1\n      ok true, \"destroyed event is fired on destroy\"\n\n    o.destroy()\n    o.destroy() # Make sure it's not called twice\n\n    assert.equal called, 1\n",
          "type": "blob"
        },
        "test/game_state.coffee": {
          "path": "test/game_state.coffee",
          "mode": "100644",
          "content": "require \"../test_setup\"\n\nGameState = require \"../game_state\"\n\ndescribe \"GameState\", ->\n  it \"should be legit\", ->\n    assert GameState()\n",
          "type": "blob"
        },
        "test/modules/bindable.coffee": {
          "path": "test/modules/bindable.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nBindable = require \"../../modules/bindable\"\n\ndescribe \"Bindable\", ->\n\n  test \"#bind and #trigger\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"Multiple bindings\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"#trigger arguments\", ->\n    o = Bindable()\n\n    param1 = \"the message\"\n    param2 = 3\n\n    o.bind \"test\", (p1, p2) ->\n      equal(p1, param1)\n      equal(p2, param2)\n\n    o.trigger \"test\", param1, param2\n\n  test \"#unbind\", ->\n    o = Bindable()\n\n    callback = ->\n      ok false\n\n    o.bind \"test\", callback\n    # Unbind specific event\n    o.unbind \"test\", callback\n    o.trigger \"test\"\n\n    o.bind \"test\", callback\n    # Unbind all events\n    o.unbind \"test\"\n    o.trigger \"test\"\n\n  test \"#trigger namespace\", ->\n    o = Bindable()\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\"\n    o.trigger \"test\"\n\n  test \"#unbind namespaced\", ->\n    o = Bindable()\n\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\", ->\n    o.trigger \"test\"\n\n",
          "type": "blob"
        },
        "test/modules/bounded.coffee": {
          "path": "test/modules/bounded.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nBounded = require \"../../modules/bounded\"\n\ndescribe \"Bounded\", ->\n\n  test 'it should have #distance', ->\n    player = Bounded()\n\n    ok player.distance\n\n  test 'it should proxy #distance to Point.distance', ->\n    player = Bounded\n      x: 50\n      y: 50\n      width: 10\n      height: 10\n\n    enemy = Bounded\n      x: 110\n      y: 120\n      width: 7\n      height: 20\n\n    equals player.distance(enemy), Point.distance(player.position(), enemy.position())\n\n  test \"#bounds returns correct x, y, width, height\", ->\n    x = 5\n    y = 10\n    width = 50\n    height = 75\n\n    obj = Bounded\n      x: x\n      y: y\n      width: width\n      height: height\n\n    equals obj.bounds().x, x - width/2\n    equals obj.bounds().y, y - height/2\n    equals obj.bounds().width, width\n    equals obj.bounds().height, height\n\n  test \"#centeredBounds returns correct x, y, xw, yx\", ->\n    x = -5\n    y = 20\n\n    obj = Bounded\n      x: x\n      y: y\n      width: 100,\n      height: 200\n\n    bounds = obj.centeredBounds()\n\n    equals bounds.x, x\n    equals bounds.y, y\n    equals bounds.xw, 100 / 2\n    equals bounds.yw, 200 / 2\n\n  test \"#bounds(width, height) returns correct x, y\", ->\n    x = 20\n    y = 10\n    width = 15\n    height = 25\n\n    offsetX = 7.5\n    offsetY = 12\n\n    obj = Bounded\n      x: x\n      y: y\n      width: width\n      height: height\n\n    bounds = obj.bounds(offsetX, offsetY)\n\n    equals bounds.x, obj.center().x + offsetX - width/2\n    equals bounds.y, obj.center().y + offsetY - height/2\n\n  test \"#center returns correct center point\", ->\n    obj = Bounded\n      x: -5\n      y: 20\n      width: 10\n      height: 60\n\n    center = obj.center()\n\n    ok center.equal(Point(-5, 20))\n",
          "type": "blob"
        },
        "test/modules/camera.coffee": {
          "path": "test/modules/camera.coffee",
          "mode": "100644",
          "content": "GameObject = require \"../../game_object\"\nCamera = require \"../../modules/camera\"\n\ndescribe \"Camera\", ->\n\n  MockCanvas = ->\n    clear: ->\n    context: ->\n      beginPath: ->\n      clip: ->\n      rect: ->\n    drawRect: ->\n    fill: ->\n    withTransform: (t, fn) ->\n      fn(@)\n    clip: ->\n    globalAlpha: ->\n\n  test \"create\", ->\n    ok Camera()\n  \n  test \"follow\", ->\n    object = GameObject()\n    camera = Camera()\n    dt = 1/60\n\n    camera.follow(object)\n    camera.trigger \"afterUpdate\", dt\n\n    transform = camera.I.transform\n    assert transform.tx?, \"tx exists: #{transform.tx}\"\n    assert transform.ty?, \"ty exists: #{transform.ty}\"\n\n  test \"overlay\", ->\n    object = GameObject()\n\n    called = 0\n    object.bind 'overlay', ->\n      ok true\n      called += 1\n\n    canvas = MockCanvas()\n\n    camera = Camera()\n\n    camera.trigger 'overlay', canvas, [object]\n\n    assert.equal called, 1\n\n  test \"zoom\", ->\n    camera = Camera()\n\n    camera.zoom(2)\n\n    assert.equal camera.zoom(), 2\n\n    camera.zoomOut(0.5)\n\n    assert.equal camera.zoom(), 1\n\n  test \"shake\", ->\n    camera = Camera()\n\n    camera.shake\n      duration: 1\n      intensity: 10\n\n    assert.equal camera.I.shakeCooldown, 1, \"Should set shake duration\"\n    assert.equal camera.I.shakeIntensity, 10, \"Should set intensity\"\n\n    camera.trigger \"draw\", MockCanvas(), []\n",
          "type": "blob"
        },
        "test/modules/clamp.coffee": {
          "path": "test/modules/clamp.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nClamp = require \"../../modules/clamp\"\n\ndescribe \"Clamp\", ->\n\n  test \"#clamp\", ->\n    o = Clamp\n      x: 1500\n\n    max = 100\n\n    o.clamp\n      x:\n        min: 0\n        max: max\n\n    o.trigger \"afterUpdate\"\n\n    equals o.I.x, max\n",
          "type": "blob"
        },
        "test/modules/cooldown.coffee": {
          "path": "test/modules/cooldown.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Cooldown\", ->\n  test \"objects count down each of their cooldowns\", ->\n    obj = GameObject\n      bullet: 83\n      cooldowns:\n        bullet:\n          target: 3\n          approachBy: 1\n\n    5.times ->\n      obj.update(1)\n\n    equals obj.I.bullet, 78, \"bullet should decrease by 5\"\n\n    100.times ->\n      obj.update(1)\n\n    equals obj.I.bullet, 3, \"bullet should not cool down part target value\"\n\n  test \"should handle negative value\", ->\n    obj = GameObject\n      powerup: -70\n      cooldowns:\n        powerup:\n          target: 0\n          approachBy: 1\n\n    11.times ->\n      obj.update(1)\n\n    equals obj.I.powerup, -59, \"powerup should increase by 11\"\n\n    70.times ->\n      obj.update(1)\n\n    equals obj.I.powerup, 0, \"powerup should not cooldown past target value\"\n\n  test \"adding many cooldowns to default instance variables\", ->\n    obj = GameObject\n      cool: 20\n      rad: 0\n      tubular: 0\n      cooldowns:\n        cool:\n          approachBy: 5\n          target: -5\n        rad:\n          approachBy: 0.5\n          target: 1.5\n        tubular:\n          approachBy: 1\n          target: 1000\n\n    4.times ->\n      obj.update(1)\n\n    equals obj.I.cool, 0\n    equals obj.I.rad, 1.5\n    equals obj.I.tubular, 4\n\n  test \"#cooldown\", ->\n    obj = GameObject\n      health: 100\n\n    obj.cooldown 'health'\n\n    3.times ->\n      obj.update(1)\n\n    equals obj.I.health, 97, \"health cooldown should exist and equal 97\"\n\n    obj.cooldown 'turbo',\n      target: 25\n      approachBy: 3\n\n    4.times ->\n      obj.update(1)\n\n    equals obj.I.health, 93, \"health should continue of cool down when new cooldowns are added\"\n    equals obj.I.turbo, 12, \"turbo should cool down normally\"\n\n  test \"should not blow up if cooldowns aren't specified\", ->\n    obj = GameObject()\n\n    obj.update(1)\n    obj.trigger \"afterUpdate\", 1\n\n    equals obj.I.age, 1, \"should successfully update\"\n\n  test \"use existing value of instance variable as starting value if no value param given\", ->\n    obj = GameObject()\n\n    obj.I.health = 3\n\n    obj.cooldown 'health',\n      target: 10\n\n    5.times ->\n      obj.update(1)\n\n    equals obj.I.health, 8\n\n  test \"initialize property to 0 if no current value\", ->\n    obj = GameObject()\n\n    obj.cooldown 'health',\n      target: 10\n\n    5.times ->\n      obj.update(1)\n\n    equals obj.I.health, 5\n",
          "type": "blob"
        },
        "test/modules/drawable.coffee": {
          "path": "test/modules/drawable.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\n# TODO: Test without requiring GameOjbect\nGameObject = require \"../../game_object\"\n\ndescribe \"Drawable\", ->\n  test \"alpha\", ->\n    object = GameObject()\n\n    equal object.I.alpha, 1\n\n    object2 = GameObject\n      alpha: 0.5\n\n    equal object2.I.alpha, 0.5\n\n  test \"scale\", ->\n    object = GameObject()\n\n    transform = object.transform()\n\n    equal transform.a, 1\n    equal transform.d, 1\n\n    object = GameObject\n      scale: 2\n      scaleX: -1\n      scaleY: 0.5\n\n    transform = object.transform()\n\n    equal transform.a, -2\n    equal transform.d, 1\n",
          "type": "blob"
        },
        "test/modules/effect.coffee": {
          "path": "test/modules/effect.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Effect\", ->\n\n  test \"fadeOut\", ->\n    player = GameObject()\n\n    fadedOut = false\n\n    player.fadeOut 1, ->\n      fadedOut = true\n\n    player.trigger \"update\", 1\n    player.trigger \"afterUpdate\", 1\n\n    equals player.I.alpha, 0, \"Player has faded out\"\n    ok fadedOut, \"callback was called\"\n",
          "type": "blob"
        },
        "test/modules/expirable.coffee": {
          "path": "test/modules/expirable.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Expirable\", ->\n\n  test \"objects become inactive after their duration\", ->\n    obj = GameObject\n      duration: 5\n\n    4.times ->\n      obj.update(1)\n      obj.trigger \"afterUpdate\", 1\n\n    equals obj.I.active, true, \"object is active until duration is exceeded\"\n\n    5.times ->\n      obj.update(1)\n      obj.trigger \"afterUpdate\", 1\n\n    equals obj.I.active, false, \"object is inactive after duration\"\n",
          "type": "blob"
        },
        "test/modules/follow.coffee": {
          "path": "test/modules/follow.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Follow\", ->\n\n  test \"should set the correct velocity\", ->\n    player = GameObject\n      x: 50\n      y: 50\n      width: 10\n      height: 10\n\n    enemy = GameObject\n      x: 0\n      y: 50\n      widht: 10\n      height: 10\n      speed: 1\n\n    enemy.follow(player)\n\n    ok enemy.I.velocity.equal(Point(1, 0)), 'enemy should head toward player with a velocity Point(1, 0)'\n\n    rightEnemy = GameObject\n      x: 100\n      y: 50\n      width: 10\n      height: 10\n      speed: 1\n\n    rightEnemy.follow(player)\n\n    ok rightEnemy.I.velocity.equal(Point(-1, 0)), 'rightEnemy should head toward player with a velocity Point(-1, 0)'\n",
          "type": "blob"
        },
        "test/modules/meter.coffee": {
          "path": "test/modules/meter.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe 'Meter', ->\n\n  test \"should respect 0 being set as the meter attribute\", ->\n    obj = GameObject\n      health: 0\n      healthMax: 110\n\n    obj.meter 'health'\n\n    equals obj.I.health, 0\n\n  test \"should set max<Attribute> if it isn't present in the including object\", ->\n    obj = GameObject\n      health: 150\n\n    obj.meter 'health'\n\n    equals obj.I.healthMax, 150\n\n  test \"should set both <attribute> and max<attribute> if they aren't present in the including object\", ->\n    obj = GameObject()\n\n    obj.meter 'turbo'\n\n    equals obj.I.turbo, 100\n    equals obj.I.turboMax, 100\n",
          "type": "blob"
        },
        "test/modules/movable.coffee": {
          "path": "test/modules/movable.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Movable\", ->\n\n  test \"should update velocity\", ->\n    particle = GameObject\n      velocity: Point(1, 2)\n      x: 50\n      y: 50\n\n    particle.update(1)\n\n    equals particle.I.x, 51, \"x position updated according to velocity\"\n    equals particle.I.y, 52, \"y position updated according to velocity\"\n\n  test \"should not exceed max speed\", ->\n    particle = GameObject\n      velocity: Point(5, 5)\n      acceleration: Point(1, 1)\n      maxSpeed: 10\n\n    20.times ->\n      particle.update(1)\n\n    ok particle.I.velocity.magnitude() <= particle.I.maxSpeed, \"magnitude of the velocity should not exceed maxSpeed\"\n\n  test \"should be able to get velocity\", ->\n    object = GameObject()\n\n    ok object.velocity()\n\n  test \"should be able to get acceleration\", ->\n    object = GameObject()\n\n    ok object.acceleration()\n\n  test \"should increase velocity according to acceleration\", ->\n    particle = GameObject\n      velocity: Point(0, -30)\n      acceleration: Point(0, 60)\n\n    60.times ->\n      particle.update(1/60)\n\n    equals particle.I.velocity.x, 0\n    equals particle.I.velocity.y, 30\n\n",
          "type": "blob"
        },
        "test/modules/rotatable.coffee": {
          "path": "test/modules/rotatable.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Rotatable\", ->\n\n  test \"objects update their rotation\", ->\n    obj = GameObject\n      rotationalVelocity: Math.PI / 4\n      rotation: Math.PI / 6\n\n    equals obj.I.rotation, Math.PI / 6, \"Respects default rotation value\"\n\n    2.times ->\n      obj.update(1)\n\n    equals obj.I.rotation, Math.PI / 2 + Math.PI / 6\n\n    4.times ->\n      obj.update(1)\n\n    equals obj.I.rotation, (3 / 2) * Math.PI + Math.PI / 6\n",
          "type": "blob"
        },
        "test/modules/tween.coffee": {
          "path": "test/modules/tween.coffee",
          "mode": "100644",
          "content": "require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Tweening\", ->\n  test \"should allow for simple linear tweening\", ->\n    o = GameObject\n      x: 0\n\n    targetValue = 10\n    o.tween 10,\n      x: targetValue\n\n    12.times (i) ->\n      o.update(1)\n      o.trigger \"afterUpdate\", 1\n\n      equals o.I.x, Math.min(i + 1, targetValue)\n",
          "type": "blob"
        },
        "test_setup.coffee.md": {
          "path": "test_setup.coffee.md",
          "mode": "100644",
          "content": "Test Setup\n==========\n\n    require \"../../setup\"\n\n    global.test = it\n    global.ok = assert\n    global.equal = assert.equal\n    global.equals = assert.equal\n    global.raises = assert.throws\n",
          "type": "blob"
        },
        "util.coffee.md": {
          "path": "util.coffee.md",
          "mode": "100644",
          "content": "Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
          "type": "blob"
        },
        "test/dust.coffee": {
          "path": "test/dust.coffee",
          "mode": "100644",
          "content": "Dust = require \"../main\"\n\ndescribe \"Dust\", ->\n  it \"Should expose Util\", ->\n    assert Dust.Util\n\n  it \"Should expose Collision\", ->\n    assert Dust.Collision\n",
          "type": "blob"
        }
      },
      "distribution": {
        "engine": {
          "path": "engine",
          "content": "(function() {\n  var Bindable, Engine, defaults;\n\n  defaults = require(\"./util\").defaults;\n\n  Bindable = require(\"./modules/bindable\");\n\n  Engine = function(I, self) {\n    var animLoop, draw, frameAdvance, lastStepTime, running, startTime, step, update;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      FPS: 60,\n      paused: false\n    });\n    frameAdvance = false;\n    running = false;\n    startTime = +new Date();\n    lastStepTime = -Infinity;\n    animLoop = function(timestamp) {\n      var delta, msPerFrame, remainder;\n      timestamp || (timestamp = +new Date());\n      msPerFrame = 1000 / I.FPS;\n      delta = timestamp - lastStepTime;\n      remainder = delta - msPerFrame;\n      if (remainder > 0) {\n        lastStepTime = timestamp - Math.min(remainder, msPerFrame);\n        step();\n      }\n      if (running) {\n        return window.requestAnimationFrame(animLoop);\n      }\n    };\n    update = function(elapsedTime) {\n      self.trigger(\"beforeUpdate\", elapsedTime);\n      self.trigger(\"update\", elapsedTime);\n      return self.trigger(\"afterUpdate\", elapsedTime);\n    };\n    draw = function() {\n      var canvas;\n      if (!(canvas = I.canvas)) {\n        return;\n      }\n      self.trigger(\"beforeDraw\", canvas);\n      self.trigger(\"draw\", canvas);\n      return self.trigger(\"overlay\", canvas);\n    };\n    step = function() {\n      var elapsedTime;\n      if (!I.paused || frameAdvance) {\n        elapsedTime = 1 / I.FPS;\n        update(elapsedTime);\n      }\n      return draw();\n    };\n    self.extend({\n      /**\n      Start the game simulation.\n      \n          engine.start()\n      \n      @methodOf Engine#\n      @name start\n      */\n\n      start: function() {\n        if (!running) {\n          running = true;\n          window.requestAnimationFrame(animLoop);\n        }\n        return self;\n      },\n      /**\n      Stop the simulation.\n      \n          engine.stop()\n      \n      @methodOf Engine#\n      @name stop\n      */\n\n      stop: function() {\n        running = false;\n        return self;\n      },\n      /**\n      Pause the game and step through 1 update of the engine.\n      \n          engine.frameAdvance()\n      \n      @methodOf Engine#\n      @name frameAdvance\n      */\n\n      frameAdvance: function() {\n        I.paused = true;\n        frameAdvance = true;\n        step();\n        return frameAdvance = false;\n      },\n      /**\n      Resume the game.\n      \n          engine.play()\n      \n      @methodOf Engine#\n      @name play\n      */\n\n      play: function() {\n        return I.paused = false;\n      },\n      /**\n      Toggle the paused state of the simulation.\n      \n          engine.pause()\n      \n      @methodOf Engine#\n      @name pause\n      @param {Boolean} [setTo] Force to pause by passing true or unpause by passing false.\n      */\n\n      pause: function(setTo) {\n        if (setTo != null) {\n          return I.paused = setTo;\n        } else {\n          return I.paused = !I.paused;\n        }\n      },\n      /**\n      Query the engine to see if it is paused.\n      \n          engine.pause()\n      \n          engine.paused()\n          # true\n      \n          engine.play()\n      \n          engine.paused()\n          # false\n      \n      @methodOf Engine#\n      @name paused\n      */\n\n      paused: function() {\n        return I.paused;\n      },\n      /**\n      Change the framerate of the game. The default framerate is 60 fps.\n      \n          engine.setFramerate(60)\n      \n      @methodOf Engine#\n      @name setFramerate\n      */\n\n      setFramerate: function(newFPS) {\n        I.FPS = newFPS;\n        self.stop();\n        return self.start();\n      },\n      update: update,\n      draw: draw\n    });\n    Engine.defaultModules.each(function(module) {\n      return self.include(module);\n    });\n    self.trigger(\"init\");\n    return self;\n  };\n\n  Engine.defaultModules = [\"age\", \"engine/background\", \"engine/collision\", \"engine/game_state\", \"engine/finder\", \"engine/keyboard\", \"engine/mouse\", \"timed_events\"].map(function(name) {\n    return require(\"./modules/\" + name);\n  });\n\n  module.exports = Engine;\n\n}).call(this);\n\n//# sourceURL=engine.coffee",
          "type": "blob"
        },
        "game_object": {
          "path": "game_object",
          "content": "(function() {\n  var GameObject, defaults;\n\n  defaults = require(\"./util\").defaults;\n\n  module.exports = GameObject = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    defaults(I, {\n      active: true,\n      created: false,\n      destroyed: false\n    });\n    self.attrReader(\"id\");\n    self.extend({\n      \"class\": function() {\n        return I[\"class\"] || \"GameObject\";\n      },\n      update: function(elapsedTime) {\n        if (I.active) {\n          self.trigger('update', elapsedTime);\n        }\n        return I.active;\n      },\n      create: function() {\n        if (!I.created) {\n          self.trigger('create');\n        }\n        return I.created = true;\n      },\n      destroy: function() {\n        if (!I.destroyed) {\n          self.trigger('destroy');\n        }\n        I.destroyed = true;\n        return I.active = false;\n      }\n    });\n    GameObject.defaultModules.each(function(module) {\n      return self.include(module);\n    });\n    return self;\n  };\n\n  GameObject.defaultModules = [\"bindable\", \"age\", \"bounded\", \"clamp\", \"cooldown\", \"drawable\", \"effect\", \"expirable\", \"follow\", \"meter\", \"movable\", \"rotatable\", \"timed_events\", \"tween\"].map(function(name) {\n    return require(\"./modules/\" + name);\n  });\n\n  GameObject.construct = function(entityData) {\n    var className, constructor;\n    if (className = entityData[\"class\"]) {\n      if (constructor = GameObject.registry[className]) {\n        return constructor(entityData);\n      } else {\n        throw \"Unregistered constructor: \" + className;\n      }\n    } else {\n      return GameObject(entityData);\n    }\n  };\n\n  GameObject.registry = {\n    GameObject: GameObject\n  };\n\n}).call(this);\n\n//# sourceURL=game_object.coffee",
          "type": "blob"
        },
        "game_state": {
          "path": "game_state",
          "content": "(function() {\n  var Bindable, GameObject, defaults;\n\n  defaults = require(\"./util\").defaults;\n\n  Bindable = require(\"./modules/bindable\");\n\n  GameObject = require(\"../../game_object\");\n\n  module.exports = function(I, self) {\n    var queuedObjects;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      objects: []\n    });\n    queuedObjects = [];\n    self.extend({\n      add: function(entityData) {\n        var object;\n        self.trigger(\"beforeAdd\", entityData);\n        object = GameObject.construct(entityData);\n        object.create();\n        self.trigger(\"afterAdd\", object);\n        if (I.updating) {\n          queuedObjects.push(object);\n        } else {\n          I.objects.push(object);\n        }\n        return object;\n      },\n      objects: function() {\n        return I.objects.copy();\n      }\n    });\n    self.on(\"update\", function(elapsedTime) {\n      var toKeep, toRemove, _ref;\n      I.updating = true;\n      I.objects.invoke(\"trigger\", \"beforeUpdate\", elapsedTime);\n      _ref = I.objects.partition(function(object) {\n        return object.update(elapsedTime);\n      }), toKeep = _ref[0], toRemove = _ref[1];\n      I.objects.invoke(\"trigger\", \"afterUpdate\", elapsedTime);\n      toRemove.invoke(\"trigger\", \"remove\");\n      I.objects = toKeep.concat(queuedObjects);\n      queuedObjects = [];\n      return I.updating = false;\n    });\n    self.include(require(\"./modules/cameras\"));\n    self.include(require(\"./modules/save_state\"));\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=game_state.coffee",
          "type": "blob"
        },
        "lib/collision": {
          "path": "lib/collision",
          "content": "(function() {\n  var Collision, collides;\n\n  collides = function(a, b) {\n    return Collision.rectangular(a.bounds(), b.bounds());\n  };\n\n  Collision = {\n    /**\n    Collision holds many useful class methods for checking geometric overlap of various objects.\n    \n        player = engine.add\n          class: \"Player\"\n          x: 0\n          y: 0\n          width: 10\n          height: 10\n    \n        enemy = engine.add\n          class: \"Enemy\"\n          x: 5\n          y: 5\n          width: 10\n          height: 10\n    \n        enemy2 = engine.add\n          class: \"Enemy\"\n          x: -5\n          y: -5\n          width: 10\n          height: 10\n    \n        Collision.collide(player, enemy, (p, e) -> ...)\n        # => callback is called once\n    \n        Collision.collide(player, [enemy, enemy2], (p, e) -> ...)\n        # => callback is called twice\n    \n        Collision.collide(\"Player\", \"Enemy\", (p, e) -> ...)\n        # => callback is also called twice\n    \n    @name collide\n    @methodOf Collision\n    @param {Object|Array|String} groupA An object or set of objects to check collisions with\n    @param {Object|Array|String} groupB An object or set of objects to check collisions with\n    @param {Function} callback The callback to call when an object of groupA collides\n    with an object of groupB: (a, b) ->\n    @param {Function} [detectionMethod] An optional detection method to determine when two\n    objects are colliding.\n    */\n\n    collide: function(groupA, groupB, callback, detectionMethod) {\n      if (detectionMethod == null) {\n        detectionMethod = collides;\n      }\n      if (Object.isString(groupA)) {\n        groupA = engine.find(groupA);\n      } else {\n        groupA = [].concat(groupA);\n      }\n      if (Object.isString(groupB)) {\n        groupB = engine.find(groupB);\n      } else {\n        groupB = [].concat(groupB);\n      }\n      return groupA.each(function(a) {\n        return groupB.each(function(b) {\n          if (detectionMethod(a, b)) {\n            return callback(a, b);\n          }\n        });\n      });\n    },\n    /**\n    Takes two bounds objects and returns true if they collide (overlap), false otherwise.\n    Bounds objects have x, y, width and height properties.\n    \n        player = GameObject\n          x: 0\n          y: 0\n          width: 10\n          height: 10\n    \n        enemy = GameObject\n          x: 5\n          y: 5\n          width: 10\n          height: 10\n    \n        Collision.rectangular(player, enemy)\n        # => true\n    \n        Collision.rectangular(player, {x: 50, y: 40, width: 30, height: 30})\n        # => false\n    \n    @name rectangular\n    @methodOf Collision\n    @param {Object} a The first rectangle\n    @param {Object} b The second rectangle\n    @returns {Boolean} true if the rectangles overlap, false otherwise\n    */\n\n    rectangular: function(a, b) {\n      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;\n    },\n    /**\n    Takes two circle objects and returns true if they collide (overlap), false otherwise.\n    Circle objects have x, y, and radius.\n    \n        player = GameObject\n          x: 5\n          y: 5\n          radius: 10\n    \n        enemy = GameObject\n          x: 10\n          y: 10\n          radius: 10\n    \n        farEnemy = GameObject\n          x: 500\n          y: 500\n          radius: 30\n    \n        Collision.circular(player, enemy)\n        # => true\n    \n        Collision.circular(player, farEnemy)\n        # => false\n    \n    @name circular\n    @methodOf Collision\n    @param {Object} a The first circle\n    @param {Object} b The second circle\n    @returns {Boolean} true is the circles overlap, false otherwise\n    */\n\n    circular: function(a, b) {\n      var dx, dy, r;\n      r = a.radius + b.radius;\n      dx = b.x - a.x;\n      dy = b.y - a.y;\n      return r * r >= dx * dx + dy * dy;\n    },\n    /**\n    Detects whether a line intersects a circle.\n    \n        circle = engine.add\n          class: \"circle\"\n          x: 50\n          y: 50\n          radius: 10\n    \n        Collision.rayCircle(Point(0, 0), Point(1, 0), circle)\n        # => true\n    \n    @name rayCircle\n    @methodOf Collision\n    @param {Point} source The starting position\n    @param {Point} direction A vector from the point\n    @param {Object} target The circle\n    @returns {Boolean} true if the line intersects the circle, false otherwise\n    */\n\n    rayCircle: function(source, direction, target) {\n      var dt, hit, intersection, intersectionToTarget, intersectionToTargetLength, laserToTarget, projection, projectionLength, radius;\n      radius = target.radius();\n      target = target.position();\n      laserToTarget = target.subtract(source);\n      projectionLength = direction.dot(laserToTarget);\n      if (projectionLength < 0) {\n        return false;\n      }\n      projection = direction.scale(projectionLength);\n      intersection = source.add(projection);\n      intersectionToTarget = target.subtract(intersection);\n      intersectionToTargetLength = intersectionToTarget.length();\n      if (intersectionToTargetLength < radius) {\n        hit = true;\n      }\n      if (hit) {\n        dt = Math.sqrt(radius * radius - intersectionToTargetLength * intersectionToTargetLength);\n        return hit = direction.scale(projectionLength - dt).add(source);\n      }\n    },\n    /**\n    Detects whether a line intersects a rectangle.\n    \n        rect = engine.add\n          class: \"circle\"\n          x: 50\n          y: 50\n          width: 20\n          height: 20\n    \n        Collision.rayRectangle(Point(0, 0), Point(1, 0), rect)\n        # => true\n    \n    @name rayRectangle\n    @methodOf Collision\n    @param {Point} source The starting position\n    @param {Point} direction A vector from the point\n    @param {Object} target The rectangle\n    @returns {Boolean} true if the line intersects the rectangle, false otherwise\n    */\n\n    rayRectangle: function(source, direction, target) {\n      var areaPQ0, areaPQ1, hit, p0, p1, t, tX, tY, xval, xw, yval, yw, _ref, _ref1;\n      if (!((target.xw != null) && (target.yw != null))) {\n        if ((target.width != null) && (target.height != null)) {\n          xw = target.width / 2;\n          yw = target.height / 2;\n          return Collision.rayRectangle(source, direction, {\n            x: target.x + xw,\n            y: target.y + yw,\n            xw: xw,\n            yw: yw\n          });\n        } else {\n          error(\"Bounds object isn't a rectangle\");\n          return;\n        }\n      }\n      xw = target.xw;\n      yw = target.yw;\n      if (source.x < target.x) {\n        xval = target.x - xw;\n      } else {\n        xval = target.x + xw;\n      }\n      if (source.y < target.y) {\n        yval = target.y - yw;\n      } else {\n        yval = target.y + yw;\n      }\n      if (direction.x === 0) {\n        p0 = Point(target.x - xw, yval);\n        p1 = Point(target.x + xw, yval);\n        t = (yval - source.y) / direction.y;\n      } else if (direction.y === 0) {\n        p0 = Point(xval, target.y - yw);\n        p1 = Point(xval, target.y + yw);\n        t = (xval - source.x) / direction.x;\n      } else {\n        tX = (xval - source.x) / direction.x;\n        tY = (yval - source.y) / direction.y;\n        if ((tX < tY || ((-xw < (_ref = source.x - target.x) && _ref < xw))) && !((-yw < (_ref1 = source.y - target.y) && _ref1 < yw))) {\n          p0 = Point(target.x - xw, yval);\n          p1 = Point(target.x + xw, yval);\n          t = tY;\n        } else {\n          p0 = Point(xval, target.y - yw);\n          p1 = Point(xval, target.y + yw);\n          t = tX;\n        }\n      }\n      if (t > 0) {\n        areaPQ0 = direction.cross(p0.subtract(source));\n        areaPQ1 = direction.cross(p1.subtract(source));\n        if (areaPQ0 * areaPQ1 < 0) {\n          return hit = direction.scale(t).add(source);\n        }\n      }\n    }\n  };\n\n  module.exports = Collision;\n\n}).call(this);\n\n//# sourceURL=lib/collision.coffee",
          "type": "blob"
        },
        "lib/easing": {
          "path": "lib/easing",
          "content": "(function() {\n  var Easing, PI, cos, polynomialEasings, pow, sin, τ;\n\n  PI = Math.PI, sin = Math.sin, cos = Math.cos, pow = Math.pow;\n\n  τ = 2 * PI;\n\n  Easing = {\n    sinusoidal: function(t) {\n      return 1 - cos(t * τ / 4);\n    },\n    sinusoidalOut: function(t) {\n      return 0 + sin(t * τ / 4);\n    }\n  };\n\n  polynomialEasings = [\"linear\", \"quadratic\", \"cubic\", \"quartic\", \"quintic\"];\n\n  polynomialEasings.each(function(easing, i) {\n    var exponent, sign;\n    exponent = i + 1;\n    sign = exponent % 2 ? 1 : -1;\n    Easing[easing] = function(t) {\n      return pow(t, exponent);\n    };\n    return Easing[\"\" + easing + \"Out\"] = function(t) {\n      return 1 + sign * pow(t - 1, exponent);\n    };\n  });\n\n  [\"sinusoidal\"].concat(polynomialEasings).each(function(easing) {\n    var easeIn, easeOut;\n    easeIn = Easing[easing];\n    easeOut = Easing[\"\" + easing + \"Out\"];\n    return Easing[\"\" + easing + \"InOut\"] = function(t) {\n      if (t < 0.5) {\n        return easeIn(2 * t);\n      } else {\n        return easeOut(2 * t - 1);\n      }\n    };\n  });\n\n  module.exports = Easing;\n\n}).call(this);\n\n//# sourceURL=lib/easing.coffee",
          "type": "blob"
        },
        "main": {
          "path": "main",
          "content": "(function() {\n  var Engine, TouchCanvas, applyStyleSheet;\n\n  require(\"./setup\");\n\n  Engine = require(\"./engine\");\n\n  TouchCanvas = require(\"touch-canvas\");\n\n  applyStyleSheet = function() {\n    var previousStyleNode, styleNode;\n    styleNode = document.createElement(\"style\");\n    styleNode.innerHTML = require(\"./style\");\n    styleNode.className = \"dust\";\n    if (previousStyleNode = document.head.querySelector(\"style.dust\")) {\n      previousStyleNode.parentNode.removeChild(prevousStyleNode);\n    }\n    return document.head.appendChild(styleNode);\n  };\n\n  module.exports = {\n    init: function(options) {\n      var canvas, engine, height, width;\n      if (options == null) {\n        options = {};\n      }\n      applyStyleSheet();\n      width = options.width, height = options.height;\n      if (width == null) {\n        width = 640;\n      }\n      if (height == null) {\n        height = 480;\n      }\n      canvas = TouchCanvas({\n        width: width,\n        height: height\n      });\n      $(\"body\").append($(\"<div>\", {\n        \"class\": \"main center\"\n      }));\n      $(\".main\").append(canvas.element()).css({\n        width: width,\n        height: height\n      });\n      engine = Engine({\n        canvas: canvas\n      });\n      engine.start();\n      return engine;\n    },\n    Collision: require(\"/lib/collision\"),\n    Engine: Engine,\n    GameObject: require(\"./game_object\"),\n    GameState: require(\"./game_state\"),\n    Sprite: require(\"sprite\"),\n    Util: require(\"./util\")\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
          "type": "blob"
        },
        "modules/age": {
          "path": "modules/age",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      age: 0\n    });\n    self.bind('afterUpdate', function(dt) {\n      return I.age += dt;\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=modules/age.coffee",
          "type": "blob"
        },
        "modules/bindable": {
          "path": "modules/bindable",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = function(I, self) {\n    var eventCallbacks;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    eventCallbacks = {};\n    self.extend({\n      on: function(namespacedEvent, callback) {\n        var event, namespace, _ref;\n        _ref = namespacedEvent.split(\".\"), event = _ref[0], namespace = _ref[1];\n        if (namespace) {\n          callback.__PIXIE || (callback.__PIXIE = {});\n          callback.__PIXIE[namespace] = true;\n        }\n        eventCallbacks[event] || (eventCallbacks[event] = []);\n        eventCallbacks[event].push(callback);\n        return self;\n      },\n      off: function(namespacedEvent, callback) {\n        var callbacks, event, key, namespace, _ref;\n        _ref = namespacedEvent.split(\".\"), event = _ref[0], namespace = _ref[1];\n        if (event) {\n          eventCallbacks[event] || (eventCallbacks[event] = []);\n          if (namespace) {\n            eventCallbacks[event] = eventCallbacks.select(function(callback) {\n              var _ref1;\n              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;\n            });\n          } else {\n            if (callback) {\n              eventCallbacks[event].remove(callback);\n            } else {\n              eventCallbacks[event] = [];\n            }\n          }\n        } else if (namespace) {\n          for (key in eventCallbacks) {\n            callbacks = eventCallbacks[key];\n            eventCallbacks[key] = callbacks.select(function(callback) {\n              var _ref1;\n              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;\n            });\n          }\n        }\n        return self;\n      },\n      trigger: function() {\n        var callbacks, event, parameters;\n        event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n        callbacks = eventCallbacks[event];\n        if (callbacks) {\n          callbacks.forEach(function(callback) {\n            return callback.apply(self, parameters);\n          });\n        }\n        return self;\n      }\n    });\n    return self.extend({\n      bind: self.on,\n      unbind: self.off\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/bindable.coffee",
          "type": "blob"
        },
        "modules/bounded": {
          "path": "modules/bounded",
          "content": "(function() {\n  var Collision, defaults;\n\n  Collision = require(\"../lib/collision\");\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    defaults(I, {\n      x: 0,\n      y: 0,\n      width: 8,\n      height: 8,\n      collisionMargin: Point(0, 0)\n    });\n    return self.extend({\n      closest: function(selector) {\n        var position;\n        if (typeof selector === \"string\") {\n          selector = engine.find(selector);\n        } else {\n          selector = [].concat(selector);\n        }\n        position = self.position();\n        return selector.sort(function(a, b) {\n          return Point.distanceSquared(position, a.position()) - Point.distanceSquared(position, b.position());\n        }).first();\n      },\n      distance: function(otherObj) {\n        return Point.distance(self.position(), otherObj.position());\n      },\n      position: function(newPosition) {\n        if (newPosition != null) {\n          I.x = newPosition.x;\n          return I.y = newPosition.y;\n        } else {\n          return Point(I.x, I.y);\n        }\n      },\n      changePosition: function(delta) {\n        I.x += delta.x;\n        I.y += delta.y;\n        return self;\n      },\n      collides: function(bounds) {\n        return Collision.rectangular(self.bounds(), bounds);\n      },\n      collisionBounds: function(xOffset, yOffset) {\n        var bounds;\n        bounds = self.bounds(xOffset, yOffset);\n        bounds.x += I.collisionMargin.x;\n        bounds.y += I.collisionMargin.y;\n        bounds.width -= 2 * I.collisionMargin.x;\n        bounds.height -= 2 * I.collisionMargin.y;\n        return bounds;\n      },\n      bounds: function(xOffset, yOffset) {\n        var center;\n        center = self.center();\n        return {\n          x: center.x - I.width / 2 + (xOffset || 0),\n          y: center.y - I.height / 2 + (yOffset || 0),\n          width: I.width,\n          height: I.height\n        };\n      },\n      centeredBounds: function() {\n        var center;\n        center = self.center();\n        return {\n          x: center.x,\n          y: center.y,\n          xw: I.width / 2,\n          yw: I.height / 2\n        };\n      },\n      center: function(newCenter) {\n        return self.position(newCenter);\n      },\n      circle: function() {\n        var circle;\n        circle = self.center();\n        circle.radius = I.radius || I.width / 2 || I.height / 2;\n        return circle;\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/bounded.coffee",
          "type": "blob"
        },
        "modules/camera": {
          "path": "modules/camera",
          "content": "(function() {\n  var Bindable, Camera, defaults;\n\n  Bindable = require(\"./bindable\");\n\n  defaults = require(\"../util\").defaults;\n\n  Camera = function(I, self) {\n    var currentObject, currentType, focusOn, followTypes, module, objectFilters, transformFilters, _i, _len, _ref;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      screen: {\n        x: 0,\n        y: 0,\n        width: 1024,\n        height: 576\n      },\n      deadzone: Point(0, 0),\n      zoom: 1,\n      transform: Matrix(),\n      velocity: Point(0, 0),\n      maxSpeed: 750,\n      t90: 2\n    });\n    if (I.x == null) {\n      I.x = I.screen.width / 2;\n    }\n    if (I.y == null) {\n      I.y = I.screen.height / 2;\n    }\n    if (I.cameraBounds == null) {\n      I.cameraBounds = I.screen;\n    }\n    currentType = \"centered\";\n    currentObject = null;\n    objectFilters = [];\n    transformFilters = [];\n    focusOn = function(object, elapsedTime) {\n      var c, dampingFactor, delta, force, objectCenter, target;\n      dampingFactor = 2;\n      c = elapsedTime * 3.75 / I.t90;\n      if (c >= 1) {\n        self.position(target);\n        return I.velocity = Point(0, 0);\n      } else {\n        objectCenter = object.center();\n        target = objectCenter;\n        delta = target.subtract(self.position());\n        force = delta.subtract(I.velocity.scale(dampingFactor));\n        self.changePosition(I.velocity.scale(c).clamp(I.maxSpeed));\n        return I.velocity = I.velocity.add(force.scale(c));\n      }\n    };\n    followTypes = {\n      centered: function(object, elapsedTime) {\n        I.deadzone = Point(0, 0);\n        return focusOn(object, elapsedTime);\n      },\n      topdown: function(object, elapsedTime) {\n        var helper;\n        helper = Math.max(I.screen.width, I.screen.height) / 4;\n        I.deadzone = Point(helper, helper);\n        return focusOn(object, elapsedTime);\n      },\n      platformer: function(object, elapsedTime) {\n        var height, width;\n        width = I.screen.width / 8;\n        height = I.screen.height / 3;\n        I.deadzone = Point(width, height);\n        return focusOn(object, elapsedTime);\n      }\n    };\n    self.extend({\n      follow: function(object, type) {\n        if (type == null) {\n          type = \"centered\";\n        }\n        currentObject = object;\n        return currentType = type;\n      },\n      objectFilterChain: function(fn) {\n        return objectFilters.push(fn);\n      },\n      transformFilterChain: function(fn) {\n        return transformFilters.push(fn);\n      },\n      screenToWorld: function(point) {\n        return self.transform().inverse().transformPoint(point);\n      }\n    });\n    self.attrAccessor(\"transform\");\n    self.on(\"afterUpdate\", function(elapsedTime) {\n      if (currentObject) {\n        followTypes[currentType](currentObject, elapsedTime);\n      }\n      I.x = I.x.clamp(I.cameraBounds.x + I.screen.width / 2, I.cameraBounds.x + I.cameraBounds.width - I.screen.width / 2);\n      I.y = I.y.clamp(I.cameraBounds.y + I.screen.height / 2, I.cameraBounds.y + I.cameraBounds.height - I.screen.height / 2);\n      return I.transform = Matrix.translate(I.screen.width / 2 - I.x.floor(), I.screen.height / 2 - I.y.floor());\n    });\n    self.on(\"draw\", function(canvas, objects) {\n      return canvas.withTransform(Matrix.translate(I.screen.x, I.screen.y), function(canvas) {\n        var transform;\n        canvas.clip(0, 0, I.screen.width, I.screen.height);\n        objects = objectFilters.pipeline(objects);\n        transform = transformFilters.pipeline(self.transform().copy());\n        return canvas.withTransform(transform, function(canvas) {\n          self.trigger(\"beforeDraw\", canvas);\n          return objects.invoke(\"draw\", canvas);\n        });\n      });\n    });\n    self.on(\"overlay\", function(canvas, objects) {\n      return canvas.withTransform(Matrix.translate(I.screen.x, I.screen.y), function(canvas) {\n        canvas.clip(0, 0, I.screen.width, I.screen.height);\n        objects = objectFilters.pipeline(objects);\n        return objects.invoke(\"trigger\", \"overlay\", canvas);\n      });\n    });\n    self.include(require(\"./age\"));\n    self.include(require(\"./bounded\"));\n    _ref = Camera.defaultModules;\n    for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n      module = _ref[_i];\n      self.include(module);\n    }\n    return self;\n  };\n\n  Camera.defaultModules = [\"z_sort\", \"shake\", \"zoom\", \"rotate\", \"flash\", \"fade\", \"transition\"].map(function(name) {\n    return require(\"./camera/\" + name);\n  });\n\n  module.exports = Camera;\n\n}).call(this);\n\n//# sourceURL=modules/camera.coffee",
          "type": "blob"
        },
        "modules/camera/fade": {
          "path": "modules/camera/fade",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../../util\").defaults;\n\n  module.exports = function(I, self) {\n    var configureFade, fadeInDefaults, fadeOutDefaults;\n    if (I == null) {\n      I = {};\n    }\n    fadeInDefaults = {\n      alpha: 0,\n      color: 'black',\n      duration: 30\n    };\n    fadeOutDefaults = {\n      alpha: 1,\n      color: 'transparent',\n      duration: 30\n    };\n    configureFade = function(duration, color, alpha) {\n      I.flashDuration = duration;\n      I.flashCooldown = duration;\n      I.flashColor = Color(color);\n      return I.flashTargetAlpha = alpha;\n    };\n    return self.extend({\n      fadeIn: function(options) {\n        var alpha, color, duration, _ref;\n        if (options == null) {\n          options = {};\n        }\n        _ref = defaults(options, fadeInDefaults), alpha = _ref.alpha, color = _ref.color, duration = _ref.duration;\n        return configureFade(duration, color, alpha);\n      },\n      fadeOut: function(options) {\n        var alpha, color, duration, _ref;\n        if (options == null) {\n          options = {};\n        }\n        _ref = defaults(options, fadeOutDefaults), alpha = _ref.alpha, color = _ref.color, duration = _ref.duration;\n        return configureFade(duration, color, alpha);\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/camera/fade.coffee",
          "type": "blob"
        },
        "modules/camera/flash": {
          "path": "modules/camera/flash",
          "content": "(function() {\n  var approach, defaults, _ref;\n\n  _ref = require(\"../../util\"), approach = _ref.approach, defaults = _ref.defaults;\n\n  module.exports = function(I, self) {\n    var defaultParams;\n    defaults(I, {\n      flashAlpha: 0,\n      flashColor: \"black\",\n      flashDuration: 0.3,\n      flashCooldown: 0,\n      flashTargetAlpha: 0\n    });\n    defaultParams = {\n      color: 'white',\n      duration: 0.3,\n      targetAlpha: 0\n    };\n    self.on('afterUpdate', function(dt) {\n      if (I.flashCooldown > 0) {\n        I.flashAlpha = approach(I.flashAlpha, 0, dt / I.flashDuration);\n        return I.flashCooldown = approach(I.flashCooldown, 0, dt);\n      }\n    });\n    self.on('overlay', function(canvas) {\n      var previousAlpha;\n      previousAlpha = canvas.globalAlpha();\n      canvas.globalAlpha(I.flashAlpha);\n      canvas.fill(I.flashColor);\n      return canvas.globalAlpha(previousAlpha);\n    });\n    return {\n      /**\n      A convenient way to set the flash effect instance variables. Alternatively, you can modify them by hand, but\n      using Camera#flash is the suggested approach.\n      \n          camera.flash()\n          # => Sets the flash effect variables to their default state. This will cause a white flash that will turn transparent in the next 12 frames.\n        \n          camera.flash\n            color: 'green'\n            duration: 30\n          # => This flash effect will start off green and fade to transparent over 30 frames.\n        \n          camera.flash\n            color: Color(255, 0, 0, 0)\n            duration: 20\n            targetAlpha: 1\n          # => This flash effect will start off transparent and move toward red over 20 frames \n      \n      @name flash\n      @methodOf Camera#\n      @param {Color} [color=\"white\"] The flash color\n      @param {Number} [duration=12] How long the effect lasts\n      @param {Number} [targetAlpha=0] The alpha value to fade to. By default, this is set to 0, which fades the color to transparent.\n      */\n\n      flash: function(options) {\n        var color, duration, targetAlpha;\n        if (options == null) {\n          options = {};\n        }\n        defaults(options, defaultParams);\n        color = options.color, duration = options.duration, targetAlpha = options.targetAlpha;\n        I.flashColor = Color(color);\n        I.flashTargetAlpha = targetAlpha;\n        I.flashCooldown = duration;\n        I.flashDuration = duration;\n        return self;\n      }\n    };\n  };\n\n}).call(this);\n\n//# sourceURL=modules/camera/flash.coffee",
          "type": "blob"
        },
        "modules/camera/rotate": {
          "path": "modules/camera/rotate",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../../util\").defaults;\n\n  module.exports = function(I, self) {\n    defaults(I, {\n      rotation: 0\n    });\n    self.transformFilterChain(function(transform) {\n      return transform.rotate(I.rotation, self.position());\n    });\n    self.attrAccessor(\"rotation\");\n    return self.extend({\n      rotate: function(amount) {\n        return self.rotation(I.rotation + amount);\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/camera/rotate.coffee",
          "type": "blob"
        },
        "modules/camera/shake": {
          "path": "modules/camera/shake",
          "content": "(function() {\n  var approach, defaults, _ref;\n\n  _ref = require(\"../../util\"), approach = _ref.approach, defaults = _ref.defaults;\n\n  module.exports = function(I, self) {\n    var defaultParams;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      shakeIntensity: 20,\n      shakeCooldown: 0\n    });\n    defaultParams = {\n      duration: 0.3,\n      intensity: 20\n    };\n    self.on(\"afterUpdate\", function(dt) {\n      return I.shakeCooldown = approach(I.shakeCooldown, 0, dt);\n    });\n    self.transformFilterChain(function(transform) {\n      if (I.shakeCooldown > 0) {\n        transform.tx += Random.signed(I.shakeIntensity);\n        transform.ty += Random.signed(I.shakeIntensity);\n      }\n      return transform;\n    });\n    return self.extend({\n      shake: function(options) {\n        var duration, intensity, _ref1;\n        if (options == null) {\n          options = {};\n        }\n        _ref1 = defaults(options, defaultParams), duration = _ref1.duration, intensity = _ref1.intensity;\n        I.shakeCooldown = duration;\n        I.shakeIntensity = intensity;\n        return self;\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/camera/shake.coffee",
          "type": "blob"
        },
        "modules/camera/transition": {
          "path": "modules/camera/transition",
          "content": "(function() {\n  var defaults, extend, _ref;\n\n  _ref = require(\"../../util\"), defaults = _ref.defaults, extend = _ref.extend;\n\n  module.exports = function(I, self) {\n    var defaultOptions, transitionProgress, transitions;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      transitionActive: null,\n      transitionStart: null,\n      transitionEnd: null\n    });\n    defaultOptions = {\n      color: \"white\"\n    };\n    transitionProgress = function() {\n      return ((I.age - I.transitionStart) / (I.transitionEnd - I.transitionStart)).clamp(0, 1);\n    };\n    transitions = {\n      angle: function(_arg) {\n        var canvas, color, p0, p1, p2, p3, p4, screenSize, t;\n        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;\n        p0 = Point(t * (screenSize.x * 2), screenSize.y / 2);\n        p1 = p0.subtract(Point(screenSize.x, screenSize.y / 2));\n        p2 = p1.subtract(Point(screenSize.x, 0));\n        p3 = p2.add(Point(0, screenSize.y));\n        p4 = p3.add(Point(screenSize.x, 0));\n        return canvas.drawPoly({\n          points: [p0, p1, p2, p3, p4],\n          color: color\n        });\n      },\n      square: function(_arg) {\n        var canvas, color, height, screenSize, t, width;\n        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;\n        width = 50;\n        height = 50;\n        return (screenSize.y / height).ceil().times(function(y) {\n          return (screenSize.x / width).ceil().times(function(x) {\n            var cellProgress;\n            cellProgress = (2 * t - (x + y).mod(2)).clamp(0, 1);\n            return canvas.drawRect({\n              x: x * width,\n              y: y * height,\n              width: width,\n              height: height * cellProgress,\n              color: color\n            });\n          });\n        });\n      },\n      line: function(_arg) {\n        var canvas, color, height, screenSize, t;\n        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;\n        height = 50;\n        return (screenSize.y / height).ceil().times(function(y) {\n          return canvas.drawRect({\n            x: 0,\n            y: y * height,\n            width: screenSize.x,\n            height: height * t,\n            color: color\n          });\n        });\n      }\n    };\n    self.on(\"overlay\", function(canvas) {\n      var transitionName;\n      if (transitionName = I.transitionActive) {\n        return transitions[transitionName](extend({\n          canvas: canvas,\n          screenSize: Point(I.screen.width, I.screen.height),\n          t: transitionProgress()\n        }, I.transitionOptions));\n      }\n    });\n    return self.extend({\n      transition: function(_arg) {\n        var duration, name, options, _ref1;\n        _ref1 = _arg != null ? _arg : {}, name = _ref1.name, duration = _ref1.duration, options = _ref1.options;\n        if (name == null) {\n          name = \"angle\";\n        }\n        if (duration == null) {\n          duration = 1;\n        }\n        if (options == null) {\n          options = {};\n        }\n        I.transitionActive = name;\n        I.transitionStart = I.age;\n        I.transitionEnd = I.age + duration;\n        return I.transitionOptions = defaults(options, defaultOptions);\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/camera/transition.coffee",
          "type": "blob"
        },
        "modules/camera/z_sort": {
          "path": "modules/camera/z_sort",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      zSort: true\n    });\n    self.objectFilterChain(function(objects) {\n      if (I.zSort) {\n        objects.sort(function(a, b) {\n          return a.I.zIndex - b.I.zIndex;\n        });\n      }\n      return objects;\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=modules/camera/z_sort.coffee",
          "type": "blob"
        },
        "modules/camera/zoom": {
          "path": "modules/camera/zoom",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../../util\").defaults;\n\n  module.exports = function(I, self) {\n    var clampZoom;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      maxZoom: 10,\n      minZoom: 0.1,\n      zoom: 1\n    });\n    self.attrAccessor(\"zoom\");\n    self.transformFilterChain(function(transform) {\n      return transform.scale(I.zoom, I.zoom, self.position());\n    });\n    clampZoom = function(value) {\n      return value.clamp(I.minZoom, I.maxZoom);\n    };\n    return self.extend({\n      zoomIn: function(percentage) {\n        return self.zoom(clampZoom(I.zoom * (1 + percentage)));\n      },\n      zoomOut: function(percentage) {\n        return self.zoom(clampZoom(I.zoom * (1 - percentage)));\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/camera/zoom.coffee",
          "type": "blob"
        },
        "modules/cameras": {
          "path": "modules/cameras",
          "content": "(function() {\n  var Bindable, Camera;\n\n  Bindable = require(\"./bindable\");\n\n  Camera = require(\"./camera\");\n\n  module.exports = function(I, self) {\n    var cameras;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable();\n    }\n    cameras = [Camera()];\n    self.on('update', function(elapsedTime) {\n      return self.cameras().invoke('trigger', 'update', elapsedTime);\n    });\n    self.on('afterUpdate', function(elapsedTime) {\n      return self.cameras().invoke('trigger', 'afterUpdate', elapsedTime);\n    });\n    self.on('draw', function(canvas) {\n      return self.cameras().invoke('trigger', 'draw', canvas, self.objects());\n    });\n    self.on('overlay', function(canvas) {\n      return self.cameras().invoke('trigger', 'overlay', canvas, self.objects());\n    });\n    return self.extend({\n      addCamera: function(data) {\n        return cameras.push(Camera(data));\n      },\n      cameras: function(newCameras) {\n        if (newCameras) {\n          cameras = newCameras;\n          return self;\n        } else {\n          return cameras;\n        }\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/cameras.coffee",
          "type": "blob"
        },
        "modules/clamp": {
          "path": "modules/clamp",
          "content": "(function() {\n  var Bindable, defaults, extend, _ref;\n\n  Bindable = require(\"./bindable\");\n\n  _ref = require(\"../util\"), defaults = _ref.defaults, extend = _ref.extend;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      clampData: {}\n    });\n    self.on(\"afterUpdate\", function() {\n      var data, property, _ref1, _results;\n      _ref1 = I.clampData;\n      _results = [];\n      for (property in _ref1) {\n        data = _ref1[property];\n        _results.push(I[property] = I[property].clamp(data.min, data.max));\n      }\n      return _results;\n    });\n    return self.extend({\n      clamp: function(data) {\n        return extend(I.clampData, data);\n      },\n      clampToBounds: function(bounds) {\n        bounds || (bounds = Rectangle({\n          x: 0,\n          y: 0,\n          width: App.width,\n          height: App.height\n        }));\n        return self.clamp({\n          x: {\n            min: bounds.x + I.width / 2,\n            max: bounds.width - I.width / 2\n          },\n          y: {\n            min: bounds.y + I.height / 2,\n            max: bounds.height - I.height / 2\n          }\n        });\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/clamp.coffee",
          "type": "blob"
        },
        "modules/cooldown": {
          "path": "modules/cooldown",
          "content": "(function() {\n  var Bindable, approach, defaults, _ref;\n\n  Bindable = require(\"./bindable\");\n\n  _ref = require(\"../util\"), approach = _ref.approach, defaults = _ref.defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      cooldowns: {}\n    });\n    self.on(\"update\", function(dt) {\n      var approachBy, cooldownOptions, name, target, _ref1, _results;\n      _ref1 = I.cooldowns;\n      _results = [];\n      for (name in _ref1) {\n        cooldownOptions = _ref1[name];\n        approachBy = cooldownOptions.approachBy, target = cooldownOptions.target;\n        _results.push(I[name] = approach(I[name], target, approachBy * dt));\n      }\n      return _results;\n    });\n    return self.extend({\n      cooldown: function(name, options) {\n        var approachBy, target;\n        if (options == null) {\n          options = {};\n        }\n        target = options.target, approachBy = options.approachBy;\n        if (target == null) {\n          target = 0;\n        }\n        if (approachBy == null) {\n          approachBy = 1;\n        }\n        if (I[name] == null) {\n          I[name] = 0;\n        }\n        I.cooldowns[name] = {\n          target: target,\n          approachBy: approachBy\n        };\n        return self;\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/cooldown.coffee",
          "type": "blob"
        },
        "modules/drawable": {
          "path": "modules/drawable",
          "content": "(function() {\n  var Bindable, defaults;\n\n  Bindable = require(\"./bindable\");\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      alpha: 1,\n      color: \"#196\",\n      scale: 1,\n      scaleX: 1,\n      scaleY: 1,\n      zIndex: 0\n    });\n    self.off(\".Drawable\");\n    self.on('draw.Drawable', function(canvas) {\n      var previousAlpha, sprite;\n      if ((I.alpha != null) && I.alpha !== 1) {\n        previousAlpha = canvas.context().globalAlpha;\n        canvas.context().globalAlpha = I.alpha;\n      }\n      if (sprite = self.sprite()) {\n        sprite.draw(canvas, -sprite.width / 2, -sprite.height / 2);\n      } else {\n        if (I.radius != null) {\n          canvas.drawCircle({\n            x: 0,\n            y: 0,\n            radius: I.radius,\n            color: I.color\n          });\n        } else {\n          canvas.drawRect({\n            x: -I.width / 2,\n            y: -I.height / 2,\n            width: I.width,\n            height: I.height,\n            color: I.color\n          });\n        }\n      }\n      if ((I.alpha != null) && I.alpha !== 1) {\n        return canvas.context().globalAlpha = previousAlpha;\n      }\n    });\n    return self.extend({\n      draw: function(canvas) {\n        self.trigger('beforeTransform', canvas);\n        canvas.withTransform(self.transform(), function(canvas) {\n          self.trigger('beforeDraw', canvas);\n          self.trigger('draw', canvas);\n          return self.trigger('afterDraw', canvas);\n        });\n        self.trigger('afterTransform', canvas);\n        return self;\n      },\n      sprite: function() {\n        var name, url;\n        if (name = I.spriteName) {\n          return Sprite.loadByName(name);\n        } else if (url = I.spriteURL) {\n          return Sprite.load(url);\n        }\n      },\n      transform: function() {\n        var center, transform;\n        center = self.center();\n        transform = Matrix.translation(center.x.floor(), center.y.floor());\n        transform = transform.concat(Matrix.scale(I.scale * I.scaleX, I.scale * I.scaleY));\n        if (I.rotation) {\n          transform = transform.concat(Matrix.rotation(I.rotation));\n        }\n        if (I.spriteOffset) {\n          transform = transform.concat(Matrix.translation(I.spriteOffset.x, I.spriteOffset.y));\n        }\n        return transform;\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/drawable.coffee",
          "type": "blob"
        },
        "modules/effect": {
          "path": "modules/effect",
          "content": "(function() {\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    return self.extend({\n      fadeOut: function(duration, complete) {\n        if (duration == null) {\n          duration = 1;\n        }\n        return self.tween(duration, {\n          alpha: 0,\n          complete: complete\n        });\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/effect.coffee",
          "type": "blob"
        },
        "modules/engine/background": {
          "path": "modules/engine/background",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../../util\").defaults;\n\n  module.exports = function(I, self) {\n    var backgroundSprite;\n    defaults(I, {\n      background: null,\n      backgroundColor: \"#00010D\",\n      clear: false\n    });\n    self.attrAccessor(\"clear\", \"backgroundColor\");\n    backgroundSprite = function() {\n      if (I.background) {\n        return Sprite.loadByName(I.background);\n      }\n    };\n    self.on(\"beforeDraw\", function() {\n      var sprite;\n      if (I.clear) {\n        return I.canvas.clear();\n      } else if (sprite = backgroundSprite()) {\n        return sprite.fill(I.canvas, 0, 0, I.canvas.width(), I.canvas.height());\n      } else if (I.backgroundColor) {\n        return I.canvas.fill(I.backgroundColor);\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=modules/engine/background.coffee",
          "type": "blob"
        },
        "modules/engine/collision": {
          "path": "modules/engine/collision",
          "content": "(function() {\n  var Collision;\n\n  Collision = require(\"/lib/collision\");\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    return self.extend({\n      /**\n      Detects collisions between a bounds and the game objects.\n      \n      @name collides\n      @methodOf Engine#\n      @param bounds The bounds to check collisions with.\n      @param [sourceObject] An object to exclude from the results.\n      @returns {Boolean} true if the bounds object collides with any of the game objects, false otherwise.\n      */\n\n      collides: function(bounds, sourceObject, selector) {\n        if (selector == null) {\n          selector = \".solid\";\n        }\n        return self.find(selector).inject(false, function(collided, object) {\n          return collided || (object !== sourceObject) && object.collides(bounds) && object;\n        });\n      },\n      /**\n      Detects collisions between a bounds and the game objects.\n      Returns an array of objects colliding with the bounds provided.\n      \n      @name collidesWith\n      @methodOf Engine#\n      @param bounds The bounds to check collisions with.\n      @param [sourceObject] An object to exclude from the results.\n      @returns {Array} An array of objects that collide with the given bounds.\n      */\n\n      collidesWith: function(bounds, sourceObject, selector) {\n        if (selector == null) {\n          selector = \".solid\";\n        }\n        return self.find(selector).select(function(object) {\n          return object !== sourceObject && object.collides(bounds);\n        });\n      },\n      /**\n      Detects collisions between a ray and the game objects.\n      \n      @name rayCollides\n      @methodOf Engine#\n      @param source The origin point\n      @param direction A point representing the direction of the ray\n      @param [sourceObject] An object to exclude from the results.\n      @param [selector] A selector to choos which objects in the engine to collide with\n      */\n\n      rayCollides: function(_arg) {\n        var direction, hits, nearestDistance, nearestHit, selector, source, sourceObject;\n        source = _arg.source, direction = _arg.direction, sourceObject = _arg.sourceObject, selector = _arg.selector;\n        if (selector == null) {\n          selector = \"\";\n        }\n        hits = self.find(selector).map(function(object) {\n          var hit;\n          hit = (object !== sourceObject) && Collision.rayRectangle(source, direction, object.centeredBounds());\n          if (hit) {\n            hit.object = object;\n          }\n          return hit;\n        });\n        nearestDistance = Infinity;\n        nearestHit = null;\n        hits.each(function(hit) {\n          var d;\n          if (hit && (d = hit.distance(source)) < nearestDistance) {\n            nearestDistance = d;\n            return nearestHit = hit;\n          }\n        });\n        return nearestHit;\n      },\n      objectsUnderPoint: function(point, selector) {\n        var bounds;\n        if (selector == null) {\n          selector = \"\";\n        }\n        bounds = {\n          x: point.x,\n          y: point.y,\n          width: 0,\n          height: 0\n        };\n        return self.find(selector).select(function(object) {\n          return object.collides(bounds);\n        });\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/engine/collision.coffee",
          "type": "blob"
        },
        "modules/engine/finder": {
          "path": "modules/engine/finder",
          "content": "(function() {\n  var Finder;\n\n  Finder = require(\"finder\");\n\n  module.exports = function(I, self) {\n    var finder;\n    if (I == null) {\n      I = {};\n    }\n    finder = Finder();\n    return self.extend({\n      find: function(selector) {\n        return finder.find(self.objects(), selector);\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/engine/finder.coffee",
          "type": "blob"
        },
        "modules/engine/game_state": {
          "path": "modules/engine/game_state",
          "content": "(function() {\n  var GameState, defaults;\n\n  defaults = require(\"../../util\").defaults;\n\n  GameState = require(\"../../game_state\");\n\n  module.exports = function(I, self) {\n    var requestedState;\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      currentState: GameState()\n    });\n    requestedState = null;\n    self.on(\"update\", function(elapsedTime) {\n      I.currentState.trigger(\"beforeUpdate\", elapsedTime);\n      I.currentState.trigger(\"update\", elapsedTime);\n      return I.currentState.trigger(\"afterUpdate\", elapsedTime);\n    });\n    self.on(\"afterUpdate\", function() {\n      var previousState;\n      if (requestedState != null) {\n        I.currentState.trigger(\"exit\", requestedState);\n        self.trigger('stateExited', I.currentState);\n        previousState = I.currentState;\n        I.currentState = requestedState;\n        I.currentState.trigger(\"enter\", previousState);\n        self.trigger('stateEntered', I.currentState);\n        return requestedState = null;\n      }\n    });\n    self.on(\"draw\", function(canvas) {\n      I.currentState.trigger(\"beforeDraw\", canvas);\n      I.currentState.trigger(\"draw\", canvas);\n      return I.currentState.trigger(\"overlay\", canvas);\n    });\n    return self.extend({\n      add: function(classNameOrEntityData, entityData) {\n        var object;\n        if (entityData == null) {\n          entityData = {};\n        }\n        if (typeof classNameOrEntityData === \"string\") {\n          entityData[\"class\"] = classNameOrEntityData;\n        } else {\n          entityData = classNameOrEntityData;\n        }\n        self.trigger(\"beforeAdd\", entityData);\n        object = I.currentState.add(entityData);\n        self.trigger(\"afterAdd\", object);\n        return object;\n      },\n      camera: function(n) {\n        if (n == null) {\n          n = 0;\n        }\n        return self.cameras()[n];\n      },\n      cameras: function(newCameras) {\n        if (newCameras != null) {\n          I.currentState.cameras(newCameras);\n          return self;\n        } else {\n          return I.currentState.cameras();\n        }\n      },\n      fadeIn: function(options) {\n        if (options == null) {\n          options = {};\n        }\n        return self.cameras().invoke('fadeIn', options);\n      },\n      fadeOut: function(options) {\n        if (options == null) {\n          options = {};\n        }\n        return self.cameras().invoke('fadeOut', options);\n      },\n      flash: function(options) {\n        if (options == null) {\n          options = {};\n        }\n        return self.camera(options.camera).flash(options);\n      },\n      objects: function() {\n        return I.currentState.objects();\n      },\n      setState: function(newState) {\n        return requestedState = newState;\n      },\n      shake: function(options) {\n        if (options == null) {\n          options = {};\n        }\n        return self.camera(options.camera).shake(options);\n      },\n      saveState: function() {\n        return I.currentState.saveState();\n      },\n      loadState: function(newState) {\n        return I.currentState.loadState(newState);\n      },\n      reload: function() {\n        return I.currentState.reload();\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/engine/game_state.coffee",
          "type": "blob"
        },
        "modules/engine/keyboard": {
          "path": "modules/engine/keyboard",
          "content": "(function() {\n  var keyName, prevKeysDown, updateKeys;\n\n  window.keydown = {};\n\n  window.justPressed = {};\n\n  window.justReleased = {};\n\n  prevKeysDown = {};\n\n  keyName = function(event) {\n    return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();\n  };\n\n  $(document).bind(\"keydown\", function(event) {\n    var key;\n    key = keyName(event);\n    return keydown[key] = true;\n  });\n\n  $(document).bind(\"keyup\", function(event) {\n    var key;\n    key = keyName(event);\n    return keydown[key] = false;\n  });\n\n  updateKeys = function() {\n    var key, value, _results;\n    window.justPressed = {};\n    window.justReleased = {};\n    keydown.any = false;\n    for (key in keydown) {\n      value = keydown[key];\n      justPressed[key] = value && !prevKeysDown[key];\n      justReleased[key] = !value && prevKeysDown[key];\n      if (justPressed[key] || (typeof mousePressed !== \"undefined\" && mousePressed !== null ? mousePressed.left : void 0) || (typeof mousePressed !== \"undefined\" && mousePressed !== null ? mousePressed.right : void 0)) {\n        justPressed.any = true;\n      }\n      if (value || (typeof mouseDown !== \"undefined\" && mouseDown !== null ? mouseDown.left : void 0) || (typeof mouseDown !== \"undefined\" && mouseDown !== null ? mouseDown.right : void 0)) {\n        keydown.any = true;\n      }\n    }\n    prevKeysDown = {};\n    _results = [];\n    for (key in keydown) {\n      value = keydown[key];\n      _results.push(prevKeysDown[key] = value);\n    }\n    return _results;\n  };\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    self.on(\"beforeUpdate\", function() {\n      return updateKeys();\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=modules/engine/keyboard.coffee",
          "type": "blob"
        },
        "modules/engine/mouse": {
          "path": "modules/engine/mouse",
          "content": "(function() {\n  var buttonName, buttonNames, prevButtonsDown;\n\n  window.mouseDown = {};\n\n  window.mousePressed = {};\n\n  window.mouseReleased = {};\n\n  window.mousePosition = Point(0, 0);\n\n  prevButtonsDown = {};\n\n  buttonNames = {\n    1: \"left\",\n    2: \"middle\",\n    3: \"right\"\n  };\n\n  buttonName = function(event) {\n    return buttonNames[event.which];\n  };\n\n  $(document).bind(\"mousemove\", function(event) {\n    var offset;\n    offset = $(\"canvas\").offset() || {\n      left: 0,\n      top: 0\n    };\n    mousePosition.x = event.pageX - offset.left;\n    return mousePosition.y = event.pageY - offset.top;\n  });\n\n  $(document).bind(\"mousedown\", function(event) {\n    return mouseDown[buttonName(event)] = true;\n  });\n\n  $(document).bind(\"mouseup\", function(event) {\n    return mouseDown[buttonName(event)] = false;\n  });\n\n  window.updateMouse = function() {\n    var button, value, _results;\n    window.mousePressed = {};\n    window.mouseReleased = {};\n    for (button in mouseDown) {\n      value = mouseDown[button];\n      if (!prevButtonsDown[button]) {\n        mousePressed[button] = value;\n      }\n    }\n    for (button in mouseDown) {\n      value = mouseDown[button];\n      if (prevButtonsDown[button]) {\n        mouseReleased[button] = !value;\n      }\n    }\n    prevButtonsDown = {};\n    _results = [];\n    for (button in mouseDown) {\n      value = mouseDown[button];\n      _results.push(prevButtonsDown[button] = value);\n    }\n    return _results;\n  };\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    self.on(\"beforeUpdate\", function() {\n      return typeof updateMouse === \"function\" ? updateMouse() : void 0;\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=modules/engine/mouse.coffee",
          "type": "blob"
        },
        "modules/expirable": {
          "path": "modules/expirable",
          "content": "(function() {\n  var Bindable, defaults;\n\n  Bindable = require(\"./bindable\");\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      duration: -1\n    });\n    self.on(\"update\", function(dt) {\n      if (I.duration !== -1 && I.age >= I.duration) {\n        return I.active = false;\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=modules/expirable.coffee",
          "type": "blob"
        },
        "modules/follow": {
          "path": "modules/follow",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    defaults(I, {\n      velocity: Point(0, 0),\n      speed: 1\n    });\n    self.attrAccessor(\"speed\");\n    return self.extend({\n      follow: function(obj) {\n        var position;\n        if (obj.position != null) {\n          position = obj.position();\n        } else if (obj.x != null) {\n          position = obj;\n        }\n        if (position) {\n          return I.velocity = position.subtract(self.position()).norm(self.speed());\n        }\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/follow.coffee",
          "type": "blob"
        },
        "modules/meter": {
          "path": "modules/meter",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      meters: {}\n    });\n    self.on('overlay', function(canvas) {\n      var backgroundColor, borderColor, borderRadius, borderWidth, color, height, meterData, name, ratio, show, width, x, y, _ref, _ref1, _ref2;\n      _ref = I.meters;\n      for (name in _ref) {\n        meterData = _ref[name];\n        backgroundColor = meterData.backgroundColor, (_ref1 = meterData.border, borderColor = _ref1.color, borderRadius = _ref1.radius, borderWidth = _ref1.width), color = meterData.color, height = meterData.height, show = meterData.show, width = meterData.width, x = meterData.x, y = meterData.y;\n        if (meterData.position != null) {\n          _ref2 = meterData.position, x = _ref2.x, y = _ref2.y;\n        }\n        if (!show) {\n          return;\n        }\n        ratio = (I[name] / I[\"\" + name + \"Max\"]).clamp(0, 1);\n        canvas.drawRoundRect({\n          color: backgroundColor,\n          radius: borderRadius,\n          x: x,\n          y: y,\n          width: width,\n          height: height\n        });\n        canvas.drawRoundRect({\n          color: color,\n          x: x,\n          y: y,\n          radius: borderRadius,\n          width: width * ratio,\n          height: height\n        });\n        canvas.drawRoundRect({\n          x: x,\n          y: y,\n          width: width,\n          height: height,\n          radius: borderRadius,\n          stroke: {\n            color: borderColor,\n            width: borderWidth\n          }\n        });\n      }\n    });\n    return self.extend({\n      /**\n      Configures a meter to be drawn each overlay event.\n      \n          player = GameObject\n      \n          player.meter 'health',\n            border\n              color: 'brown'\n              radius: 3\n            color: 'pink'\n            height: 20\n            x: 5\n            y: 5\n            show: true\n            width: 150\n      \n          # => Sets up a health meter, using all the configuration options\n      \n      @name meter\n      @methodOf Metered#\n      @param {String} name The name of the property to meter\n      @param {Object} options The meter configuration options\n      @param {String} border: color Color of the meter's border\n      @param {Number} border: width Width of the meter's border\n      @param {String} color Color of the meter's inner rectangle\n      @param {Number} height Height of the meter\n      @param {Object} position An x, y object representing the position of the meter\n      @param {Number} x x position of the meter\n      @param {Number} y y position of the meter\n      @param {Number} border: radius Border radius of the meter\n      @param {Boolean} show Boolean to toggle whether of not to display the meter\n      @param {Number} width How wide the meter is\n      */\n\n      meter: function(name, options) {\n        if (options == null) {\n          options = {};\n        }\n        defaults(options, {\n          backgroundColor: 'black',\n          border: {\n            color: 'white',\n            radius: 2,\n            width: 1.5\n          },\n          color: 'green',\n          height: 10,\n          x: 0,\n          y: 0,\n          show: true,\n          width: 100\n        });\n        if (I[name] == null) {\n          I[name] = 100;\n        }\n        if (!I[\"\" + name + \"Max\"]) {\n          if (I[name]) {\n            I[\"\" + name + \"Max\"] = I[name];\n          } else {\n            I[\"\" + name + \"Max\"] = 100;\n          }\n        }\n        return I.meters[name] = options;\n      },\n      /**\n      Shows the named meter\n      \n          player = GameObject\n      \n          # creates a health meter but disables visibility\n          player.meter 'health'\n            show: false\n      \n          # enables visibility for the meter named 'health'\n          player.showMeter 'health'\n      \n      @name showMeter\n      @methodOf Metered#\n      @param {String} name The name of the meter to show\n      */\n\n      showMeter: function(name) {\n        return I.meters[name].show = true;\n      },\n      /**\n      Hides the named meter\n      \n          player = GameObject\n      \n          # creates a health meter\n          player.meter 'health'\n      \n          # disables visibility for the meter named 'health'\n          player.hideMeter 'health'\n      \n      @name hideMeter\n      @methodOf Metered#\n      @param {String} name The name of the meter to hide\n      */\n\n      hideMeter: function(name) {\n        return I.meters[name].show = false;\n      },\n      /**\n      Toggles visibility of the named meter\n      \n          player = GameObject\n      \n          # creates a health meter\n          player.meter 'health'\n      \n          # toggles visibility for the meter named 'health'\n          player.toggleMeter 'health'\n      \n      @name toggleMeter\n      @methodOf Metered#\n      @param {String} name The name of the meter to toggle\n      */\n\n      toggleMeter: function(name) {\n        return I.meters[name].show = !I.meters[name].show;\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/meter.coffee",
          "type": "blob"
        },
        "modules/movable": {
          "path": "modules/movable",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      acceleration: Point(0, 0),\n      velocity: Point(0, 0)\n    });\n    I.acceleration = Point(I.acceleration.x, I.acceleration.y);\n    I.velocity = Point(I.velocity.x, I.velocity.y);\n    self.attrReader(\"velocity\", \"acceleration\");\n    self.off(\".Movable\");\n    return self.on('update.Movable', function(dt) {\n      var currentSpeed;\n      I.velocity = I.velocity.add(I.acceleration.scale(dt));\n      if (I.maxSpeed != null) {\n        currentSpeed = I.velocity.magnitude();\n        if (currentSpeed > I.maxSpeed) {\n          I.velocity = I.velocity.scale(I.maxSpeed / currentSpeed);\n        }\n      }\n      I.x += I.velocity.x * dt;\n      return I.y += I.velocity.y * dt;\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/movable.coffee",
          "type": "blob"
        },
        "modules/rotatable": {
          "path": "modules/rotatable",
          "content": "(function() {\n  var defaults;\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      rotation: 0,\n      rotationalVelocity: 0\n    });\n    self.on('update', function(dt) {\n      return I.rotation += I.rotationalVelocity * dt;\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=modules/rotatable.coffee",
          "type": "blob"
        },
        "modules/save_state": {
          "path": "modules/save_state",
          "content": "(function() {\n  var extend;\n\n  extend = require(\"/util\").extend;\n\n  module.exports = function(I, self) {\n    var savedState;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    savedState = null;\n    return self.extend({\n      saveState: function() {\n        return savedState = I.objects.map(function(object) {\n          return extend({}, object.I);\n        });\n      },\n      loadState: function(newState) {\n        if (newState || (newState = savedState)) {\n          I.objects.invoke(\"trigger\", \"remove\");\n          I.objects = [];\n          return newState.each(function(objectData) {\n            return self.add(extend({}, objectData));\n          });\n        }\n      },\n      reload: function() {\n        var oldObjects;\n        oldObjects = I.objects;\n        I.objects = [];\n        oldObjects.each(function(object) {\n          object.trigger(\"remove\");\n          return self.add(object.I);\n        });\n        return self;\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/save_state.coffee",
          "type": "blob"
        },
        "modules/timed_events": {
          "path": "modules/timed_events",
          "content": "(function() {\n  var defaults,\n    __slice = [].slice;\n\n  defaults = require(\"../util\").defaults;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      everyEvents: [],\n      delayEvents: []\n    });\n    self.bind(\"update\", function(elapsedTime) {\n      var event, firingEvents, fn, period, _i, _len, _ref, _ref1;\n      _ref = I.everyEvents;\n      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n        event = _ref[_i];\n        fn = event.fn, period = event.period;\n        if (period <= 0) {\n          continue;\n        }\n        while (event.lastFired < I.age + elapsedTime) {\n          self.sendOrApply(fn);\n          event.lastFired += period;\n        }\n      }\n      _ref1 = I.delayEvents.partition(function(event) {\n        return (event.delay -= elapsedTime) >= 0;\n      }), I.delayEvents = _ref1[0], firingEvents = _ref1[1];\n      return firingEvents.each(function(event) {\n        return self.sendOrApply(event.fn);\n      });\n    });\n    return self.extend({\n      every: function(period, fn) {\n        if (!(period > 0)) {\n          return;\n        }\n        I.everyEvents.push({\n          fn: fn,\n          period: period,\n          lastFired: I.age\n        });\n        return self;\n      },\n      delay: function(seconds, fn) {\n        I.delayEvents.push({\n          delay: seconds,\n          fn: fn\n        });\n        return self;\n      },\n      sendOrApply: function() {\n        var args, fn;\n        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n        if (typeof fn === \"function\") {\n          return fn.apply(self, args);\n        } else {\n          return self[fn].apply(self, args);\n        }\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/timed_events.coffee",
          "type": "blob"
        },
        "modules/tween": {
          "path": "modules/tween",
          "content": "(function() {\n  var Easing, defaults, extend, _ref;\n\n  _ref = require(\"../util\"), defaults = _ref.defaults, extend = _ref.extend;\n\n  Easing = require(\"../lib/easing\");\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    defaults(I, {\n      activeTweens: {}\n    });\n    self.on(\"update\", function(elapsedTime) {\n      var data, delta, duration, easing, easingFunction, end, endTime, property, start, startTime, t, _base, _ref1, _results;\n      t = I.age + elapsedTime;\n      _ref1 = I.activeTweens;\n      _results = [];\n      for (property in _ref1) {\n        data = _ref1[property];\n        start = data.start, end = data.end, startTime = data.startTime, endTime = data.endTime, duration = data.duration, easing = data.easing;\n        delta = end - start;\n        if (t >= endTime) {\n          I[property] = end;\n          if (typeof (_base = I.activeTweens[property]).complete === \"function\") {\n            _base.complete();\n          }\n          _results.push(delete I.activeTweens[property]);\n        } else {\n          if (typeof easing === \"string\") {\n            easingFunction = Easing[easing];\n          } else {\n            easingFunction = easing;\n          }\n          _results.push(I[property] = start + delta * easingFunction((t - startTime) / duration));\n        }\n      }\n      return _results;\n    });\n    return self.extend({\n      tween: function(duration, properties) {\n        var complete, easing, property, target, _results;\n        properties = extend({}, properties);\n        easing = properties.easing || \"linear\";\n        complete = properties.complete;\n        delete properties.easing;\n        delete properties.complete;\n        _results = [];\n        for (property in properties) {\n          target = properties[property];\n          _results.push(I.activeTweens[property] = {\n            complete: complete,\n            end: target,\n            start: I[property],\n            easing: easing,\n            duration: duration,\n            startTime: I.age,\n            endTime: I.age + duration\n          });\n        }\n        return _results;\n      }\n    });\n  };\n\n}).call(this);\n\n//# sourceURL=modules/tween.coffee",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.8-alpha.2\",\"width\":640,\"height\":480,\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.10.1.min.js\"],\"dependencies\":{\"appcache\":\"distri/appcache:v0.2.0\",\"cornerstone\":\"distri/cornerstone:v0.2.0\",\"finder\":\"distri/finder:v0.1.3\",\"hotkeys\":\"distri/hotkeys:v0.2.0\",\"jquery-utils\":\"distri/jquery-utils:v0.2.0\",\"sprite\":\"distri/sprite:v0.3.0\",\"touch-canvas\":\"distri/touch-canvas:v0.3.0\"}};",
          "type": "blob"
        },
        "setup": {
          "path": "setup",
          "content": "(function() {\n  require(\"jquery-utils\");\n\n  require(\"appcache\");\n\n  require(\"cornerstone\");\n\n  global.Bindable = require(\"./modules/bindable\");\n\n  global.Sprite = require(\"sprite\");\n\n}).call(this);\n\n//# sourceURL=setup.coffee",
          "type": "blob"
        },
        "style": {
          "path": "style",
          "content": "module.exports = \"* {\\n  -ms-box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n  -webkit-box-sizing: border-box;\\n  box-sizing: border-box;\\n}\\n\\nhtml {\\n  height: 100%;\\n}\\n\\nbody {\\n  font-family: \\\"HelveticaNeue-Light\\\", \\\"Helvetica Neue Light\\\", \\\"Helvetica Neue\\\", Helvetica, Arial, \\\"Lucida Grande\\\", sans-serif;\\n  font-weight: 300;\\n  font-size: 18px;\\n  height: 100%;\\n  margin: 0;\\n  overflow: hidden;\\n  -ms-user-select: none;\\n  -moz-user-select: none;\\n  -webkit-user-select: none;\\n  user-select: none;\\n}\\n\\n.center {\\n  bottom: 0;\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  right: 0;\\n  margin: auto;\\n}\";",
          "type": "blob"
        },
        "test/engine": {
          "path": "test/engine",
          "content": "(function() {\n  var Engine;\n\n  require(\"../test_setup\");\n\n  Engine = require(\"../engine\");\n\n  describe(\"Engine\", function() {\n    var MockCanvas;\n    MockCanvas = function() {\n      return {\n        clear: function() {},\n        context: function() {\n          return {\n            beginPath: function() {},\n            clip: function() {},\n            rect: function() {}\n          };\n        },\n        drawRect: function() {},\n        fill: function() {},\n        withTransform: function(t, fn) {\n          return fn(this);\n        },\n        clip: function() {},\n        globalAlpha: function() {}\n      };\n    };\n    test(\"#play, #pause, and #paused\", function() {\n      var engine;\n      engine = Engine();\n      equal(engine.paused(), false);\n      engine.pause();\n      equal(engine.paused(), true);\n      engine.play();\n      equal(engine.paused(), false);\n      engine.pause();\n      equal(engine.paused(), true);\n      engine.pause();\n      equal(engine.paused(), false);\n      engine.pause(false);\n      equal(engine.paused(), false);\n      engine.pause(true);\n      return equal(engine.paused(), true);\n    });\n    test(\"#save and #restore\", function() {\n      var engine;\n      engine = Engine();\n      engine.add({});\n      engine.add({});\n      equals(engine.objects().length, 2);\n      engine.saveState();\n      engine.add({});\n      equals(engine.objects().length, 3);\n      engine.loadState();\n      return equals(engine.objects().length, 2);\n    });\n    test(\"before add event\", function() {\n      var engine;\n      engine = Engine();\n      engine.bind(\"beforeAdd\", function(data) {\n        return equals(data.test, \"test\");\n      });\n      return engine.add({\n        test: \"test\"\n      });\n    });\n    test(\"#add\", function() {\n      var engine;\n      engine = Engine();\n      assert(engine.objects().length === 0);\n      engine.add(\"GameObject\", {\n        test: true\n      });\n      return assert(engine.objects().length === 1);\n    });\n    test(\"#add class name only\", function() {\n      var engine;\n      engine = Engine();\n      assert(engine.objects().length === 0);\n      engine.add(\"GameObject\");\n      return assert(engine.objects().length === 1);\n    });\n    test(\"zSort\", function() {\n      var bindDraw, engine, n, o1, o2;\n      engine = Engine({\n        canvas: MockCanvas(),\n        zSort: true\n      });\n      n = 0;\n      bindDraw = function(o) {\n        return o.bind('draw', function() {\n          n += 1;\n          return o.I.drawnAt = n;\n        });\n      };\n      o2 = engine.add({\n        zIndex: 2\n      });\n      o1 = engine.add({\n        zIndex: 1\n      });\n      bindDraw(o1);\n      bindDraw(o2);\n      engine.frameAdvance();\n      equals(o1.I.drawnAt, 1, \"Object with zIndex \" + o1.I.zIndex + \" should be drawn first\");\n      return equals(o2.I.drawnAt, 2, \"Object with zIndex \" + o2.I.zIndex + \" should be drawn second\");\n    });\n    test(\"draw events\", function() {\n      var calls, engine;\n      engine = Engine({\n        canvas: MockCanvas(),\n        backgroundColor: false\n      });\n      calls = 0;\n      engine.bind(\"beforeDraw\", function() {\n        calls += 1;\n        return ok(true);\n      });\n      engine.bind(\"draw\", function() {\n        calls += 1;\n        return ok(true);\n      });\n      engine.frameAdvance();\n      return equals(calls, 2);\n    });\n    test(\"Remove event\", function() {\n      var called, engine, object;\n      engine = Engine({\n        backgroundColor: false\n      });\n      object = engine.add({\n        active: false\n      });\n      called = 0;\n      object.bind(\"remove\", function() {\n        called += 1;\n        return ok(true, \"remove called\");\n      });\n      engine.frameAdvance();\n      return assert.equal(called, 1);\n    });\n    test(\"#find\", function() {\n      var engine;\n      engine = Engine();\n      engine.add({\n        id: \"testy\"\n      });\n      engine.add({\n        test: true\n      }).attrReader(\"test\");\n      engine.add({\n        solid: true,\n        opaque: false\n      }).attrReader(\"solid\", \"opaque\");\n      equal(engine.find(\"#no_testy\").length, 0, \"No object with id `no_testy`\");\n      equal(engine.find(\"#testy\").length, 1, \"Object with id `testy`\");\n      equal(engine.find(\".test\").length, 1, \"Object with attribute `test`\");\n      equal(engine.find(\".solid=true\").length, 1, \"Object with attribute `solid` equal to true\");\n      return equal(engine.find(\".opaque=false\").length, 1, \"Object with attribute `opaque` equal to false\");\n    });\n    test(\"#camera\", function() {\n      var engine;\n      engine = Engine();\n      return equal(engine.camera(), engine.cameras().first());\n    });\n    test(\"#collides\", function() {\n      var engine;\n      engine = Engine();\n      return engine.collides({\n        x: 0,\n        y: 0,\n        width: 10,\n        height: 10\n      }, null);\n    });\n    test(\"Integration\", function() {\n      var engine, object;\n      engine = Engine({\n        FPS: 30\n      });\n      object = engine.add({\n        \"class\": \"GameObject\",\n        velocity: Point(30, 0)\n      });\n      engine.frameAdvance();\n      equals(object.I.x, 1);\n      return equals(object.I.age, 1 / 30);\n    });\n    test(\"objectsUnderPoint\", function() {\n      var engine, object;\n      engine = Engine();\n      object = engine.add({\n        x: 0,\n        y: 0,\n        width: 100,\n        height: 100\n      });\n      equals(engine.objectsUnderPoint(Point(0, 0)).length, 1);\n      return equals(engine.objectsUnderPoint(Point(300, 300)).length, 0);\n    });\n    return test(\"#setState\");\n    /*\n      engine = Engine()\n    \n      # TODO: Shouldn't need to use the GameState constructor itself\n      nextState = GameState()\n    \n      engine.setState nextState\n    \n      # Test state change events\n      engine.bind \"stateEntered\", ->\n        ok true\n      engine.bind \"stateExited\", ->\n        ok true\n    \n      engine.update()\n    \n      equal engine.I.currentState, nextState\n    */\n\n  });\n\n}).call(this);\n\n//# sourceURL=test/engine.coffee",
          "type": "blob"
        },
        "test/game_object": {
          "path": "test/game_object",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../test_setup\");\n\n  GameObject = require(\"../game_object\");\n\n  describe(\"GameObject\", function() {\n    test(\"()\", function() {\n      var gameObject;\n      gameObject = GameObject();\n      return ok(gameObject);\n    });\n    test(\".construct\", function() {\n      var gameObject;\n      gameObject = GameObject.construct({\n        name: \"Gandalf\"\n      });\n      return equals(gameObject.I.name, \"Gandalf\");\n    });\n    test(\"construct invalid object\", function() {\n      return raises(function() {\n        return GameObject.construct({\n          \"class\": \"aaaaa\"\n        });\n      });\n    });\n    test(\"#closest\", function() {\n      var o, other, other2;\n      o = GameObject({\n        x: 0,\n        y: 0\n      });\n      other = GameObject({\n        x: 1,\n        y: 1\n      });\n      other2 = GameObject({\n        x: 10,\n        y: 10\n      });\n      equals(o.closest([]), null);\n      return equals(o.closest([other, other2]), other);\n    });\n    test(\"elapsedTime\", function() {\n      var gameObject, timeStep;\n      gameObject = GameObject();\n      timeStep = 33;\n      gameObject.bind(\"update\", function(t) {\n        return equals(t, timeStep);\n      });\n      return gameObject.update(timeStep);\n    });\n    test(\"[event] create\", function() {\n      var called, o;\n      o = GameObject();\n      called = 0;\n      o.bind(\"create\", function() {\n        called += 1;\n        return ok(true, \"created event is fired on create\");\n      });\n      o.create();\n      o.create();\n      return assert.equal(called, 1);\n    });\n    test(\"[event] update\", function() {\n      var gameObject;\n      gameObject = GameObject();\n      gameObject.bind(\"update\", function() {\n        return equals(gameObject.I.age, 0, 'Age should be 0 on first update');\n      });\n      return gameObject.trigger(\"update\", 1);\n    });\n    return test(\"[event] destroy\", function() {\n      var called, o;\n      o = GameObject();\n      called = 0;\n      o.bind(\"destroy\", function() {\n        called += 1;\n        return ok(true, \"destroyed event is fired on destroy\");\n      });\n      o.destroy();\n      o.destroy();\n      return assert.equal(called, 1);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/game_object.coffee",
          "type": "blob"
        },
        "test/game_state": {
          "path": "test/game_state",
          "content": "(function() {\n  var GameState;\n\n  require(\"../test_setup\");\n\n  GameState = require(\"../game_state\");\n\n  describe(\"GameState\", function() {\n    return it(\"should be legit\", function() {\n      return assert(GameState());\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/game_state.coffee",
          "type": "blob"
        },
        "test/modules/bindable": {
          "path": "test/modules/bindable",
          "content": "(function() {\n  var Bindable;\n\n  require(\"../../test_setup\");\n\n  Bindable = require(\"../../modules/bindable\");\n\n  describe(\"Bindable\", function() {\n    test(\"#bind and #trigger\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      return o.trigger(\"test\");\n    });\n    test(\"Multiple bindings\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      o.bind(\"test\", function() {\n        return ok(true);\n      });\n      return o.trigger(\"test\");\n    });\n    test(\"#trigger arguments\", function() {\n      var o, param1, param2;\n      o = Bindable();\n      param1 = \"the message\";\n      param2 = 3;\n      o.bind(\"test\", function(p1, p2) {\n        equal(p1, param1);\n        return equal(p2, param2);\n      });\n      return o.trigger(\"test\", param1, param2);\n    });\n    test(\"#unbind\", function() {\n      var callback, o;\n      o = Bindable();\n      callback = function() {\n        return ok(false);\n      };\n      o.bind(\"test\", callback);\n      o.unbind(\"test\", callback);\n      o.trigger(\"test\");\n      o.bind(\"test\", callback);\n      o.unbind(\"test\");\n      return o.trigger(\"test\");\n    });\n    test(\"#trigger namespace\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test.TestNamespace\", function() {\n        return ok(true);\n      });\n      o.trigger(\"test\");\n      o.unbind(\".TestNamespace\");\n      return o.trigger(\"test\");\n    });\n    return test(\"#unbind namespaced\", function() {\n      var o;\n      o = Bindable();\n      o.bind(\"test.TestNamespace\", function() {\n        return ok(true);\n      });\n      o.trigger(\"test\");\n      o.unbind(\".TestNamespace\", function() {});\n      return o.trigger(\"test\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/bindable.coffee",
          "type": "blob"
        },
        "test/modules/bounded": {
          "path": "test/modules/bounded",
          "content": "(function() {\n  var Bounded;\n\n  require(\"../../test_setup\");\n\n  Bounded = require(\"../../modules/bounded\");\n\n  describe(\"Bounded\", function() {\n    test('it should have #distance', function() {\n      var player;\n      player = Bounded();\n      return ok(player.distance);\n    });\n    test('it should proxy #distance to Point.distance', function() {\n      var enemy, player;\n      player = Bounded({\n        x: 50,\n        y: 50,\n        width: 10,\n        height: 10\n      });\n      enemy = Bounded({\n        x: 110,\n        y: 120,\n        width: 7,\n        height: 20\n      });\n      return equals(player.distance(enemy), Point.distance(player.position(), enemy.position()));\n    });\n    test(\"#bounds returns correct x, y, width, height\", function() {\n      var height, obj, width, x, y;\n      x = 5;\n      y = 10;\n      width = 50;\n      height = 75;\n      obj = Bounded({\n        x: x,\n        y: y,\n        width: width,\n        height: height\n      });\n      equals(obj.bounds().x, x - width / 2);\n      equals(obj.bounds().y, y - height / 2);\n      equals(obj.bounds().width, width);\n      return equals(obj.bounds().height, height);\n    });\n    test(\"#centeredBounds returns correct x, y, xw, yx\", function() {\n      var bounds, obj, x, y;\n      x = -5;\n      y = 20;\n      obj = Bounded({\n        x: x,\n        y: y,\n        width: 100,\n        height: 200\n      });\n      bounds = obj.centeredBounds();\n      equals(bounds.x, x);\n      equals(bounds.y, y);\n      equals(bounds.xw, 100 / 2);\n      return equals(bounds.yw, 200 / 2);\n    });\n    test(\"#bounds(width, height) returns correct x, y\", function() {\n      var bounds, height, obj, offsetX, offsetY, width, x, y;\n      x = 20;\n      y = 10;\n      width = 15;\n      height = 25;\n      offsetX = 7.5;\n      offsetY = 12;\n      obj = Bounded({\n        x: x,\n        y: y,\n        width: width,\n        height: height\n      });\n      bounds = obj.bounds(offsetX, offsetY);\n      equals(bounds.x, obj.center().x + offsetX - width / 2);\n      return equals(bounds.y, obj.center().y + offsetY - height / 2);\n    });\n    return test(\"#center returns correct center point\", function() {\n      var center, obj;\n      obj = Bounded({\n        x: -5,\n        y: 20,\n        width: 10,\n        height: 60\n      });\n      center = obj.center();\n      return ok(center.equal(Point(-5, 20)));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/bounded.coffee",
          "type": "blob"
        },
        "test/modules/camera": {
          "path": "test/modules/camera",
          "content": "(function() {\n  var Camera, GameObject;\n\n  GameObject = require(\"../../game_object\");\n\n  Camera = require(\"../../modules/camera\");\n\n  describe(\"Camera\", function() {\n    var MockCanvas;\n    MockCanvas = function() {\n      return {\n        clear: function() {},\n        context: function() {\n          return {\n            beginPath: function() {},\n            clip: function() {},\n            rect: function() {}\n          };\n        },\n        drawRect: function() {},\n        fill: function() {},\n        withTransform: function(t, fn) {\n          return fn(this);\n        },\n        clip: function() {},\n        globalAlpha: function() {}\n      };\n    };\n    test(\"create\", function() {\n      return ok(Camera());\n    });\n    test(\"follow\", function() {\n      var camera, dt, object, transform;\n      object = GameObject();\n      camera = Camera();\n      dt = 1 / 60;\n      camera.follow(object);\n      camera.trigger(\"afterUpdate\", dt);\n      transform = camera.I.transform;\n      assert(transform.tx != null, \"tx exists: \" + transform.tx);\n      return assert(transform.ty != null, \"ty exists: \" + transform.ty);\n    });\n    test(\"overlay\", function() {\n      var called, camera, canvas, object;\n      object = GameObject();\n      called = 0;\n      object.bind('overlay', function() {\n        ok(true);\n        return called += 1;\n      });\n      canvas = MockCanvas();\n      camera = Camera();\n      camera.trigger('overlay', canvas, [object]);\n      return assert.equal(called, 1);\n    });\n    test(\"zoom\", function() {\n      var camera;\n      camera = Camera();\n      camera.zoom(2);\n      assert.equal(camera.zoom(), 2);\n      camera.zoomOut(0.5);\n      return assert.equal(camera.zoom(), 1);\n    });\n    return test(\"shake\", function() {\n      var camera;\n      camera = Camera();\n      camera.shake({\n        duration: 1,\n        intensity: 10\n      });\n      assert.equal(camera.I.shakeCooldown, 1, \"Should set shake duration\");\n      assert.equal(camera.I.shakeIntensity, 10, \"Should set intensity\");\n      return camera.trigger(\"draw\", MockCanvas(), []);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/camera.coffee",
          "type": "blob"
        },
        "test/modules/clamp": {
          "path": "test/modules/clamp",
          "content": "(function() {\n  var Clamp;\n\n  require(\"../../test_setup\");\n\n  Clamp = require(\"../../modules/clamp\");\n\n  describe(\"Clamp\", function() {\n    return test(\"#clamp\", function() {\n      var max, o;\n      o = Clamp({\n        x: 1500\n      });\n      max = 100;\n      o.clamp({\n        x: {\n          min: 0,\n          max: max\n        }\n      });\n      o.trigger(\"afterUpdate\");\n      return equals(o.I.x, max);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/clamp.coffee",
          "type": "blob"
        },
        "test/modules/cooldown": {
          "path": "test/modules/cooldown",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Cooldown\", function() {\n    test(\"objects count down each of their cooldowns\", function() {\n      var obj;\n      obj = GameObject({\n        bullet: 83,\n        cooldowns: {\n          bullet: {\n            target: 3,\n            approachBy: 1\n          }\n        }\n      });\n      5..times(function() {\n        return obj.update(1);\n      });\n      equals(obj.I.bullet, 78, \"bullet should decrease by 5\");\n      100..times(function() {\n        return obj.update(1);\n      });\n      return equals(obj.I.bullet, 3, \"bullet should not cool down part target value\");\n    });\n    test(\"should handle negative value\", function() {\n      var obj;\n      obj = GameObject({\n        powerup: -70,\n        cooldowns: {\n          powerup: {\n            target: 0,\n            approachBy: 1\n          }\n        }\n      });\n      11..times(function() {\n        return obj.update(1);\n      });\n      equals(obj.I.powerup, -59, \"powerup should increase by 11\");\n      70..times(function() {\n        return obj.update(1);\n      });\n      return equals(obj.I.powerup, 0, \"powerup should not cooldown past target value\");\n    });\n    test(\"adding many cooldowns to default instance variables\", function() {\n      var obj;\n      obj = GameObject({\n        cool: 20,\n        rad: 0,\n        tubular: 0,\n        cooldowns: {\n          cool: {\n            approachBy: 5,\n            target: -5\n          },\n          rad: {\n            approachBy: 0.5,\n            target: 1.5\n          },\n          tubular: {\n            approachBy: 1,\n            target: 1000\n          }\n        }\n      });\n      4..times(function() {\n        return obj.update(1);\n      });\n      equals(obj.I.cool, 0);\n      equals(obj.I.rad, 1.5);\n      return equals(obj.I.tubular, 4);\n    });\n    test(\"#cooldown\", function() {\n      var obj;\n      obj = GameObject({\n        health: 100\n      });\n      obj.cooldown('health');\n      3..times(function() {\n        return obj.update(1);\n      });\n      equals(obj.I.health, 97, \"health cooldown should exist and equal 97\");\n      obj.cooldown('turbo', {\n        target: 25,\n        approachBy: 3\n      });\n      4..times(function() {\n        return obj.update(1);\n      });\n      equals(obj.I.health, 93, \"health should continue of cool down when new cooldowns are added\");\n      return equals(obj.I.turbo, 12, \"turbo should cool down normally\");\n    });\n    test(\"should not blow up if cooldowns aren't specified\", function() {\n      var obj;\n      obj = GameObject();\n      obj.update(1);\n      obj.trigger(\"afterUpdate\", 1);\n      return equals(obj.I.age, 1, \"should successfully update\");\n    });\n    test(\"use existing value of instance variable as starting value if no value param given\", function() {\n      var obj;\n      obj = GameObject();\n      obj.I.health = 3;\n      obj.cooldown('health', {\n        target: 10\n      });\n      5..times(function() {\n        return obj.update(1);\n      });\n      return equals(obj.I.health, 8);\n    });\n    return test(\"initialize property to 0 if no current value\", function() {\n      var obj;\n      obj = GameObject();\n      obj.cooldown('health', {\n        target: 10\n      });\n      5..times(function() {\n        return obj.update(1);\n      });\n      return equals(obj.I.health, 5);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/cooldown.coffee",
          "type": "blob"
        },
        "test/modules/drawable": {
          "path": "test/modules/drawable",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Drawable\", function() {\n    test(\"alpha\", function() {\n      var object, object2;\n      object = GameObject();\n      equal(object.I.alpha, 1);\n      object2 = GameObject({\n        alpha: 0.5\n      });\n      return equal(object2.I.alpha, 0.5);\n    });\n    return test(\"scale\", function() {\n      var object, transform;\n      object = GameObject();\n      transform = object.transform();\n      equal(transform.a, 1);\n      equal(transform.d, 1);\n      object = GameObject({\n        scale: 2,\n        scaleX: -1,\n        scaleY: 0.5\n      });\n      transform = object.transform();\n      equal(transform.a, -2);\n      return equal(transform.d, 1);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/drawable.coffee",
          "type": "blob"
        },
        "test/modules/effect": {
          "path": "test/modules/effect",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Effect\", function() {\n    return test(\"fadeOut\", function() {\n      var fadedOut, player;\n      player = GameObject();\n      fadedOut = false;\n      player.fadeOut(1, function() {\n        return fadedOut = true;\n      });\n      player.trigger(\"update\", 1);\n      player.trigger(\"afterUpdate\", 1);\n      equals(player.I.alpha, 0, \"Player has faded out\");\n      return ok(fadedOut, \"callback was called\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/effect.coffee",
          "type": "blob"
        },
        "test/modules/expirable": {
          "path": "test/modules/expirable",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Expirable\", function() {\n    return test(\"objects become inactive after their duration\", function() {\n      var obj;\n      obj = GameObject({\n        duration: 5\n      });\n      4..times(function() {\n        obj.update(1);\n        return obj.trigger(\"afterUpdate\", 1);\n      });\n      equals(obj.I.active, true, \"object is active until duration is exceeded\");\n      5..times(function() {\n        obj.update(1);\n        return obj.trigger(\"afterUpdate\", 1);\n      });\n      return equals(obj.I.active, false, \"object is inactive after duration\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/expirable.coffee",
          "type": "blob"
        },
        "test/modules/follow": {
          "path": "test/modules/follow",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Follow\", function() {\n    return test(\"should set the correct velocity\", function() {\n      var enemy, player, rightEnemy;\n      player = GameObject({\n        x: 50,\n        y: 50,\n        width: 10,\n        height: 10\n      });\n      enemy = GameObject({\n        x: 0,\n        y: 50,\n        widht: 10,\n        height: 10,\n        speed: 1\n      });\n      enemy.follow(player);\n      ok(enemy.I.velocity.equal(Point(1, 0)), 'enemy should head toward player with a velocity Point(1, 0)');\n      rightEnemy = GameObject({\n        x: 100,\n        y: 50,\n        width: 10,\n        height: 10,\n        speed: 1\n      });\n      rightEnemy.follow(player);\n      return ok(rightEnemy.I.velocity.equal(Point(-1, 0)), 'rightEnemy should head toward player with a velocity Point(-1, 0)');\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/follow.coffee",
          "type": "blob"
        },
        "test/modules/meter": {
          "path": "test/modules/meter",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe('Meter', function() {\n    test(\"should respect 0 being set as the meter attribute\", function() {\n      var obj;\n      obj = GameObject({\n        health: 0,\n        healthMax: 110\n      });\n      obj.meter('health');\n      return equals(obj.I.health, 0);\n    });\n    test(\"should set max<Attribute> if it isn't present in the including object\", function() {\n      var obj;\n      obj = GameObject({\n        health: 150\n      });\n      obj.meter('health');\n      return equals(obj.I.healthMax, 150);\n    });\n    return test(\"should set both <attribute> and max<attribute> if they aren't present in the including object\", function() {\n      var obj;\n      obj = GameObject();\n      obj.meter('turbo');\n      equals(obj.I.turbo, 100);\n      return equals(obj.I.turboMax, 100);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/meter.coffee",
          "type": "blob"
        },
        "test/modules/movable": {
          "path": "test/modules/movable",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Movable\", function() {\n    test(\"should update velocity\", function() {\n      var particle;\n      particle = GameObject({\n        velocity: Point(1, 2),\n        x: 50,\n        y: 50\n      });\n      particle.update(1);\n      equals(particle.I.x, 51, \"x position updated according to velocity\");\n      return equals(particle.I.y, 52, \"y position updated according to velocity\");\n    });\n    test(\"should not exceed max speed\", function() {\n      var particle;\n      particle = GameObject({\n        velocity: Point(5, 5),\n        acceleration: Point(1, 1),\n        maxSpeed: 10\n      });\n      20..times(function() {\n        return particle.update(1);\n      });\n      return ok(particle.I.velocity.magnitude() <= particle.I.maxSpeed, \"magnitude of the velocity should not exceed maxSpeed\");\n    });\n    test(\"should be able to get velocity\", function() {\n      var object;\n      object = GameObject();\n      return ok(object.velocity());\n    });\n    test(\"should be able to get acceleration\", function() {\n      var object;\n      object = GameObject();\n      return ok(object.acceleration());\n    });\n    return test(\"should increase velocity according to acceleration\", function() {\n      var particle;\n      particle = GameObject({\n        velocity: Point(0, -30),\n        acceleration: Point(0, 60)\n      });\n      60..times(function() {\n        return particle.update(1 / 60);\n      });\n      equals(particle.I.velocity.x, 0);\n      return equals(particle.I.velocity.y, 30);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/movable.coffee",
          "type": "blob"
        },
        "test/modules/rotatable": {
          "path": "test/modules/rotatable",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Rotatable\", function() {\n    return test(\"objects update their rotation\", function() {\n      var obj;\n      obj = GameObject({\n        rotationalVelocity: Math.PI / 4,\n        rotation: Math.PI / 6\n      });\n      equals(obj.I.rotation, Math.PI / 6, \"Respects default rotation value\");\n      2..times(function() {\n        return obj.update(1);\n      });\n      equals(obj.I.rotation, Math.PI / 2 + Math.PI / 6);\n      4..times(function() {\n        return obj.update(1);\n      });\n      return equals(obj.I.rotation, (3 / 2) * Math.PI + Math.PI / 6);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/rotatable.coffee",
          "type": "blob"
        },
        "test/modules/tween": {
          "path": "test/modules/tween",
          "content": "(function() {\n  var GameObject;\n\n  require(\"../../test_setup\");\n\n  GameObject = require(\"../../game_object\");\n\n  describe(\"Tweening\", function() {\n    return test(\"should allow for simple linear tweening\", function() {\n      var o, targetValue;\n      o = GameObject({\n        x: 0\n      });\n      targetValue = 10;\n      o.tween(10, {\n        x: targetValue\n      });\n      return 12..times(function(i) {\n        o.update(1);\n        o.trigger(\"afterUpdate\", 1);\n        return equals(o.I.x, Math.min(i + 1, targetValue));\n      });\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/modules/tween.coffee",
          "type": "blob"
        },
        "test_setup": {
          "path": "test_setup",
          "content": "(function() {\n  require(\"../../setup\");\n\n  global.test = it;\n\n  global.ok = assert;\n\n  global.equal = assert.equal;\n\n  global.equals = assert.equal;\n\n  global.raises = assert.throws;\n\n}).call(this);\n\n//# sourceURL=test_setup.coffee",
          "type": "blob"
        },
        "util": {
          "path": "util",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    approach: function(current, target, amount) {\n      return (target - current).clamp(-amount, amount) + current;\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=util.coffee",
          "type": "blob"
        },
        "test/dust": {
          "path": "test/dust",
          "content": "(function() {\n  var Dust;\n\n  Dust = require(\"../main\");\n\n  describe(\"Dust\", function() {\n    it(\"Should expose Util\", function() {\n      return assert(Dust.Util);\n    });\n    return it(\"Should expose Collision\", function() {\n      return assert(Dust.Collision);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/dust.coffee",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.8-alpha.2",
      "entryPoint": "main",
      "remoteDependencies": [
        "https://code.jquery.com/jquery-1.10.1.min.js"
      ],
      "repository": {
        "id": 15406048,
        "name": "dust",
        "full_name": "distri/dust",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/dust",
        "description": "PixieEngine2 Lite!",
        "fork": false,
        "url": "https://api.github.com/repos/distri/dust",
        "forks_url": "https://api.github.com/repos/distri/dust/forks",
        "keys_url": "https://api.github.com/repos/distri/dust/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/dust/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/dust/teams",
        "hooks_url": "https://api.github.com/repos/distri/dust/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/dust/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/dust/events",
        "assignees_url": "https://api.github.com/repos/distri/dust/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/dust/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/dust/tags",
        "blobs_url": "https://api.github.com/repos/distri/dust/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/dust/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/dust/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/dust/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/dust/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/dust/languages",
        "stargazers_url": "https://api.github.com/repos/distri/dust/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/dust/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/dust/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/dust/subscription",
        "commits_url": "https://api.github.com/repos/distri/dust/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/dust/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/dust/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/dust/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/dust/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/dust/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/dust/merges",
        "archive_url": "https://api.github.com/repos/distri/dust/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/dust/downloads",
        "issues_url": "https://api.github.com/repos/distri/dust/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/dust/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/dust/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/dust/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/dust/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/dust/releases{/id}",
        "created_at": "2013-12-23T22:24:48Z",
        "updated_at": "2013-12-31T03:18:24Z",
        "pushed_at": "2013-12-31T03:18:23Z",
        "git_url": "git://github.com/distri/dust.git",
        "ssh_url": "git@github.com:distri/dust.git",
        "clone_url": "https://github.com/distri/dust.git",
        "svn_url": "https://github.com/distri/dust",
        "homepage": null,
        "size": 576,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": "CoffeeScript",
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
          "gravatar_id": null,
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 1,
        "branch": "v0.1.8-alpha.2",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "appcache": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "appcache\n========\n\nHTML5 AppCache Helpers\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "App Cache\n=========\n\nSome helpers for working with HTML5 application cache.\n\nhttp://www.html5rocks.com/en/tutorials/appcache/beginner/\n\n    applicationCache = window.applicationCache\n\n    applicationCache.addEventListener 'updateready', (e) ->\n      if applicationCache.status is applicationCache.UPDATEREADY\n        # Browser downloaded a new app cache.\n        if confirm('A new version of this site is available. Load it?')\n          window.location.reload()\n    , false\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.2.0\"\nentryPoint: \"main\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var applicationCache;\n\n  applicationCache = window.applicationCache;\n\n  applicationCache.addEventListener('updateready', function(e) {\n    if (applicationCache.status === applicationCache.UPDATEREADY) {\n      if (confirm('A new version of this site is available. Load it?')) {\n        return window.location.reload();\n      }\n    }\n  }, false);\n\n}).call(this);\n\n//# sourceURL=main.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"main\"};",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "main",
          "repository": {
            "id": 14539483,
            "name": "appcache",
            "full_name": "distri/appcache",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/appcache",
            "description": "HTML5 AppCache Helpers",
            "fork": false,
            "url": "https://api.github.com/repos/distri/appcache",
            "forks_url": "https://api.github.com/repos/distri/appcache/forks",
            "keys_url": "https://api.github.com/repos/distri/appcache/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/appcache/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/appcache/teams",
            "hooks_url": "https://api.github.com/repos/distri/appcache/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/appcache/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/appcache/events",
            "assignees_url": "https://api.github.com/repos/distri/appcache/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/appcache/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/appcache/tags",
            "blobs_url": "https://api.github.com/repos/distri/appcache/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/appcache/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/appcache/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/appcache/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/appcache/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/appcache/languages",
            "stargazers_url": "https://api.github.com/repos/distri/appcache/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/appcache/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/appcache/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/appcache/subscription",
            "commits_url": "https://api.github.com/repos/distri/appcache/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/appcache/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/appcache/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/appcache/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/appcache/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/appcache/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/appcache/merges",
            "archive_url": "https://api.github.com/repos/distri/appcache/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/appcache/downloads",
            "issues_url": "https://api.github.com/repos/distri/appcache/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/appcache/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/appcache/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/appcache/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/appcache/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/appcache/releases{/id}",
            "created_at": "2013-11-19T22:09:16Z",
            "updated_at": "2013-11-29T20:49:51Z",
            "pushed_at": "2013-11-19T22:10:28Z",
            "git_url": "git://github.com/distri/appcache.git",
            "ssh_url": "git@github.com:distri/appcache.git",
            "clone_url": "https://github.com/distri/appcache.git",
            "svn_url": "https://github.com/distri/appcache",
            "homepage": null,
            "size": 240,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.2.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "cornerstone": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "cornerstone\n===========\n\nCore JavaScript Extensions.\n",
              "type": "blob"
            },
            "cornerstone.coffee.md": {
              "path": "cornerstone.coffee.md",
              "mode": "100644",
              "content": "Cornerstone\n===========\n\nRequire and pollute.\n\n    require \"extensions\"\n\n    global.Core = require(\"core\")\n\n    require(\"math\").pollute()\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.2.0\"\nentryPoint: \"cornerstone\"\ndependencies:\n  math: \"distri/math:v0.2.0\"\n  extensions: \"distri/extensions:v0.2.0\"\n  core: \"distri/core:v0.6.0\"\n",
              "type": "blob"
            },
            "test/cornerstone.coffee": {
              "path": "test/cornerstone.coffee",
              "mode": "100644",
              "content": "require \"../cornerstone\"\n\ndescribe \"Cornerstone\", ->\n  it \"should provide Core\", ->\n    assert Core\n\n  it \"should provide Matrix\", ->\n    assert Matrix\n\n  it \"should provide Point\", ->\n    assert Point\n\n  it \"should provide Random\", ->\n    assert Random\n\n  it \"should provide rand\", ->\n    assert rand\n\n  it \"should provide Function#debounce\", ->\n    assert (->).debounce\n",
              "type": "blob"
            }
          },
          "distribution": {
            "cornerstone": {
              "path": "cornerstone",
              "content": "(function() {\n  require(\"extensions\");\n\n  global.Core = require(\"core\");\n\n  require(\"math\").pollute();\n\n}).call(this);\n\n//# sourceURL=cornerstone.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"cornerstone\",\"dependencies\":{\"math\":\"distri/math:v0.2.0\",\"extensions\":\"distri/extensions:v0.2.0\",\"core\":\"distri/core:v0.6.0\"}};",
              "type": "blob"
            },
            "test/cornerstone": {
              "path": "test/cornerstone",
              "content": "(function() {\n  require(\"../cornerstone\");\n\n  describe(\"Cornerstone\", function() {\n    it(\"should provide Core\", function() {\n      return assert(Core);\n    });\n    it(\"should provide Matrix\", function() {\n      return assert(Matrix);\n    });\n    it(\"should provide Point\", function() {\n      return assert(Point);\n    });\n    it(\"should provide Random\", function() {\n      return assert(Random);\n    });\n    it(\"should provide rand\", function() {\n      return assert(rand);\n    });\n    return it(\"should provide Function#debounce\", function() {\n      return assert((function() {}).debounce);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/cornerstone.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "cornerstone",
          "repository": {
            "id": 13576225,
            "name": "cornerstone",
            "full_name": "distri/cornerstone",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/cornerstone",
            "description": "Core JavaScript Extensions.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/cornerstone",
            "forks_url": "https://api.github.com/repos/distri/cornerstone/forks",
            "keys_url": "https://api.github.com/repos/distri/cornerstone/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/cornerstone/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/cornerstone/teams",
            "hooks_url": "https://api.github.com/repos/distri/cornerstone/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/cornerstone/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/cornerstone/events",
            "assignees_url": "https://api.github.com/repos/distri/cornerstone/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/cornerstone/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/cornerstone/tags",
            "blobs_url": "https://api.github.com/repos/distri/cornerstone/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/cornerstone/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/cornerstone/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/cornerstone/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/cornerstone/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/cornerstone/languages",
            "stargazers_url": "https://api.github.com/repos/distri/cornerstone/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/cornerstone/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/cornerstone/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/cornerstone/subscription",
            "commits_url": "https://api.github.com/repos/distri/cornerstone/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/cornerstone/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/cornerstone/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/cornerstone/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/cornerstone/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/cornerstone/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/cornerstone/merges",
            "archive_url": "https://api.github.com/repos/distri/cornerstone/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/cornerstone/downloads",
            "issues_url": "https://api.github.com/repos/distri/cornerstone/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/cornerstone/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/cornerstone/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/cornerstone/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/cornerstone/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/cornerstone/releases{/id}",
            "created_at": "2013-10-14T23:43:38Z",
            "updated_at": "2013-12-24T01:09:50Z",
            "pushed_at": "2013-12-24T01:09:50Z",
            "git_url": "git://github.com/distri/cornerstone.git",
            "ssh_url": "git@github.com:distri/cornerstone.git",
            "clone_url": "https://github.com/distri/cornerstone.git",
            "svn_url": "https://github.com/distri/cornerstone",
            "homepage": null,
            "size": 504,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.2.0",
            "defaultBranch": "master"
          },
          "dependencies": {
            "math": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "math\n====\n\nMath is for cool guys.\n",
                  "type": "blob"
                },
                "math.coffee.md": {
                  "path": "math.coffee.md",
                  "mode": "100644",
                  "content": "Math\n====\n\nRequire and export many math libraries.\n\n    Point = require \"point\"\n\n    Matrix = require \"matrix\"\n    Matrix.Point = Point\n\n    Random = require \"random\"\n\n    module.exports = self =\n      Point: Point\n      Matrix: Matrix\n      Random: Random\n      rand: Random.rand\n\nPollute all libraries to the global namespace.\n\n      pollute: ->\n        Object.keys(self).forEach (key) ->\n          return if key is \"version\"\n          return if key is \"pollute\"\n\n          global[key] = self[key]\n\n        return self\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "entryPoint: \"math\"\nversion: \"0.2.0\"\ndependencies:\n  point: \"distri/point:v0.2.0\"\n  matrix: \"distri/matrix:v0.3.1\"\n  random: \"distri/random:v0.2.0\"\n",
                  "type": "blob"
                },
                "test/math.coffee": {
                  "path": "test/math.coffee",
                  "mode": "100644",
                  "content": "require(\"../math\").pollute()\n\nconsole.log global\n\ndescribe \"Point\", ->\n  it \"should exist\", ->\n    assert Point\n\n  it \"should construct points\", ->\n    assert Point()\n\ndescribe \"Matrix\", ->\n  it \"should exist and return matrices when invoked\", ->\n    assert Matrix\n\n    assert Matrix()\n\n  it \"should use the same `Point` class\", ->\n    assert Matrix.Point is Point\n\n    assert Matrix().transformPoint(Point()) instanceof Point\n\ndescribe \"Random\", ->\n  it \"should exist\", ->\n    assert Random\n\ndescribe \"rand\", ->\n  it \"should exist\", ->\n    assert rand\n\n    assert rand()?\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "math": {
                  "path": "math",
                  "content": "(function() {\n  var Matrix, Point, Random, self;\n\n  Point = require(\"point\");\n\n  Matrix = require(\"matrix\");\n\n  Matrix.Point = Point;\n\n  Random = require(\"random\");\n\n  module.exports = self = {\n    Point: Point,\n    Matrix: Matrix,\n    Random: Random,\n    rand: Random.rand,\n    pollute: function() {\n      Object.keys(self).forEach(function(key) {\n        if (key === \"version\") {\n          return;\n        }\n        if (key === \"pollute\") {\n          return;\n        }\n        return global[key] = self[key];\n      });\n      return self;\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=math.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"entryPoint\":\"math\",\"version\":\"0.2.0\",\"dependencies\":{\"point\":\"distri/point:v0.2.0\",\"matrix\":\"distri/matrix:v0.3.1\",\"random\":\"distri/random:v0.2.0\"}};",
                  "type": "blob"
                },
                "test/math": {
                  "path": "test/math",
                  "content": "(function() {\n  require(\"../math\").pollute();\n\n  console.log(global);\n\n  describe(\"Point\", function() {\n    it(\"should exist\", function() {\n      return assert(Point);\n    });\n    return it(\"should construct points\", function() {\n      return assert(Point());\n    });\n  });\n\n  describe(\"Matrix\", function() {\n    it(\"should exist and return matrices when invoked\", function() {\n      assert(Matrix);\n      return assert(Matrix());\n    });\n    return it(\"should use the same `Point` class\", function() {\n      assert(Matrix.Point === Point);\n      return assert(Matrix().transformPoint(Point()) instanceof Point);\n    });\n  });\n\n  describe(\"Random\", function() {\n    return it(\"should exist\", function() {\n      return assert(Random);\n    });\n  });\n\n  describe(\"rand\", function() {\n    return it(\"should exist\", function() {\n      assert(rand);\n      return assert(rand() != null);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/math.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.2.0",
              "entryPoint": "math",
              "repository": {
                "id": 13576636,
                "name": "math",
                "full_name": "distri/math",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/math",
                "description": "Math is for cool guys.",
                "fork": false,
                "url": "https://api.github.com/repos/distri/math",
                "forks_url": "https://api.github.com/repos/distri/math/forks",
                "keys_url": "https://api.github.com/repos/distri/math/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/math/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/math/teams",
                "hooks_url": "https://api.github.com/repos/distri/math/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/math/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/math/events",
                "assignees_url": "https://api.github.com/repos/distri/math/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/math/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/math/tags",
                "blobs_url": "https://api.github.com/repos/distri/math/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/math/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/math/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/math/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/math/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/math/languages",
                "stargazers_url": "https://api.github.com/repos/distri/math/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/math/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/math/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/math/subscription",
                "commits_url": "https://api.github.com/repos/distri/math/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/math/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/math/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/math/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/math/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/math/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/math/merges",
                "archive_url": "https://api.github.com/repos/distri/math/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/math/downloads",
                "issues_url": "https://api.github.com/repos/distri/math/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/math/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/math/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/math/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/math/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/math/releases{/id}",
                "created_at": "2013-10-15T00:13:24Z",
                "updated_at": "2013-12-23T23:29:58Z",
                "pushed_at": "2013-10-15T18:45:48Z",
                "git_url": "git://github.com/distri/math.git",
                "ssh_url": "git@github.com:distri/math.git",
                "clone_url": "https://github.com/distri/math.git",
                "svn_url": "https://github.com/distri/math",
                "homepage": null,
                "size": 364,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.2.0",
                "defaultBranch": "master"
              },
              "dependencies": {
                "point": {
                  "source": {
                    "LICENSE": {
                      "path": "LICENSE",
                      "mode": "100644",
                      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                      "type": "blob"
                    },
                    "README.md": {
                      "path": "README.md",
                      "mode": "100644",
                      "content": "point\n=====\n\nJavaScript Point implementation\n",
                      "type": "blob"
                    },
                    "interactive_runtime.coffee.md": {
                      "path": "interactive_runtime.coffee.md",
                      "mode": "100644",
                      "content": "Interactive Runtime\n-------------------\n\n    window.Point = require(\"./point\")\n\nRegister our example runner.\n\n    Interactive.register \"example\", ({source, runtimeElement}) ->\n      program = CoffeeScript.compile(source, bare: true)\n\n      outputElement = document.createElement \"pre\"\n      runtimeElement.empty().append outputElement\n\n      result = eval(program)\n\n      if typeof result is \"number\"\n        if result != (0 | result)\n          result = result.toFixed(4)\n    \n\n      outputElement.textContent = result\n",
                      "type": "blob"
                    },
                    "pixie.cson": {
                      "path": "pixie.cson",
                      "mode": "100644",
                      "content": "version: \"0.2.0\"\nentryPoint: \"point\"\n",
                      "type": "blob"
                    },
                    "point.coffee.md": {
                      "path": "point.coffee.md",
                      "mode": "100644",
                      "content": "\nCreate a new point with given x and y coordinates. If no arguments are given\ndefaults to (0, 0).\n\n>     #! example\n>     Point()\n\n----\n\n>     #! example\n>     Point(-2, 5)\n\n----\n\n    Point = (x, y) ->\n      if isObject(x)\n        {x, y} = x\n\n      __proto__: Point.prototype\n      x: x ? 0\n      y: y ? 0\n\nPoint protoype methods.\n\n    Point:: =\n\nConstrain the magnitude of a vector.\n\n      clamp: (n) ->\n        if @magnitude() > n\n          @norm(n)\n        else\n          @copy()\n\nCreates a copy of this point.\n\n      copy: ->\n        Point(@x, @y)\n\n>     #! example\n>     Point(1, 1).copy()\n\n----\n\nAdds a point to this one and returns the new point. You may\nalso use a two argument call like `point.add(x, y)`\nto add x and y values without a second point object.\n\n      add: (first, second) ->\n        if second?\n          Point(\n            @x + first\n            @y + second\n          )\n        else\n          Point(\n            @x + first.x,\n            @y + first.y\n          )\n\n>     #! example\n>     Point(2, 3).add(Point(3, 4))\n\n----\n\nSubtracts a point to this one and returns the new point.\n\n      subtract: (first, second) ->\n        if second?\n          Point(\n            @x - first,\n            @y - second\n          )\n        else\n          @add(first.scale(-1))\n\n>     #! example\n>     Point(1, 2).subtract(Point(2, 0))\n\n----\n\nScale this Point (Vector) by a constant amount.\n\n      scale: (scalar) ->\n        Point(\n          @x * scalar,\n          @y * scalar\n        )\n\n>     #! example\n>     point = Point(5, 6).scale(2)\n\n----\n\nThe `norm` of a vector is the unit vector pointing in the same direction. This method\ntreats the point as though it is a vector from the origin to (x, y).\n\n      norm: (length=1.0) ->\n        if m = @length()\n          @scale(length/m)\n        else\n          @copy()\n\n>     #! example\n>     point = Point(2, 3).norm()\n\n----\n\nDetermine whether this `Point` is equal to another `Point`. Returns `true` if\nthey are equal and `false` otherwise.\n\n      equal: (other) ->\n        @x == other.x && @y == other.y\n\n>     #! example\n>     point = Point(2, 3)\n>\n>     point.equal(Point(2, 3))\n\n----\n\nComputed the length of this point as though it were a vector from (0,0) to (x,y).\n\n      length: ->\n        Math.sqrt(@dot(this))\n\n>     #! example\n>     Point(5, 7).length()\n\n----\n\nCalculate the magnitude of this Point (Vector).\n\n      magnitude: ->\n        @length()\n\n>     #! example\n>     Point(5, 7).magnitude()\n\n----\n\nReturns the direction in radians of this point from the origin.\n\n      direction: ->\n        Math.atan2(@y, @x)\n\n>     #! example\n>     point = Point(0, 1)\n>\n>     point.direction()\n\n----\n\nCalculate the dot product of this point and another point (Vector).\n\n      dot: (other) ->\n        @x * other.x + @y * other.y\n\n\n`cross` calculates the cross product of this point and another point (Vector).\nUsually cross products are thought of as only applying to three dimensional vectors,\nbut z can be treated as zero. The result of this method is interpreted as the magnitude\nof the vector result of the cross product between [x1, y1, 0] x [x2, y2, 0]\nperpendicular to the xy plane.\n\n      cross: (other) ->\n        @x * other.y - other.x * @y\n\n\n`distance` computes the Euclidean distance between this point and another point.\n\n      distance: (other) ->\n        Point.distance(this, other)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     pointA.distance(pointB)\n\n----\n\n`toFixed` returns a string representation of this point with fixed decimal places.\n\n      toFixed: (n) ->\n        \"Point(#{@x.toFixed(n)}, #{@y.toFixed(n)})\"\n\n`toString` returns a string representation of this point. The representation is\nsuch that if `eval`d it will return a `Point`\n\n      toString: ->\n        \"Point(#{@x}, #{@y})\"\n\n`distance` Compute the Euclidean distance between two points.\n\n    Point.distance = (p1, p2) ->\n      Math.sqrt(Point.distanceSquared(p1, p2))\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distance(pointA, pointB)\n\n----\n\n`distanceSquared` The square of the Euclidean distance between two points.\n\n    Point.distanceSquared = (p1, p2) ->\n      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distanceSquared(pointA, pointB)\n\n----\n\n`interpolate` returns a point along the path from p1 to p2\n\n    Point.interpolate = (p1, p2, t) ->\n      p2.subtract(p1).scale(t).add(p1)\n\nConstruct a point on the unit circle for the given angle.\n\n    Point.fromAngle = (angle) ->\n      Point(Math.cos(angle), Math.sin(angle))\n\n>     #! example\n>     Point.fromAngle(Math.PI / 2)\n\n----\n\nIf you have two dudes, one standing at point p1, and the other\nstanding at point p2, then this method will return the direction\nthat the dude standing at p1 will need to face to look at p2.\n\n>     #! example\n>     p1 = Point(0, 0)\n>     p2 = Point(7, 3)\n>\n>     Point.direction(p1, p2)\n\n    Point.direction = (p1, p2) ->\n      Math.atan2(\n        p2.y - p1.y,\n        p2.x - p1.x\n      )\n\nThe centroid of a set of points is their arithmetic mean.\n\n    Point.centroid = (points...) ->\n      points.reduce((sumPoint, point) ->\n        sumPoint.add(point)\n      , Point(0, 0))\n      .scale(1/points.length)\n\nGenerate a random point on the unit circle.\n\n    Point.random = ->\n      Point.fromAngle(Math.random() * 2 * Math.PI)\n\nExport\n\n    module.exports = Point\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\nLive Examples\n-------------\n\n>     #! setup\n>     require(\"/interactive_runtime\")\n",
                      "type": "blob"
                    },
                    "test/test.coffee": {
                      "path": "test/test.coffee",
                      "mode": "100644",
                      "content": "Point = require \"../point\"\n\nok = assert\nequals = assert.equal\n\nTAU = 2 * Math.PI\n\ndescribe \"Point\", ->\n\n  TOLERANCE = 0.00001\n\n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n\n  it \"copy constructor\", ->\n    p = Point(3, 7)\n\n    p2 = Point(p)\n\n    equals p2.x, p.x\n    equals p2.y, p.y\n\n  it \"#add\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.add(p2)\n\n    equals result.x, p1.x + p2.x\n    equals result.y, p1.y + p2.y\n\n    equals p1.x, 5\n    equals p1.y, 6\n    equals p2.x, 7\n    equals p2.y, 5\n\n  it \"#add with two arguments\", ->\n    point = Point(3, 7)\n    x = 2\n    y = 1\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n    x = 2\n    y = 0\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n  it \"#add existing\", ->\n    p = Point(0, 0)\n\n    p.add(Point(3, 5))\n\n    equals p.x, 0\n    equals p.y, 0\n\n  it \"#subtract\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.subtract(p2)\n\n    equals result.x, p1.x - p2.x\n    equals result.y, p1.y - p2.y\n\n  it \"#subtract existing\", ->\n    p = Point(8, 6)\n\n    p.subtract(3, 4)\n\n    equals p.x, 8\n    equals p.y, 6\n\n  it \"#norm\", ->\n    p = Point(2, 0)\n\n    normal = p.norm()\n    equals normal.x, 1\n\n    normal = p.norm(5)\n    equals normal.x, 5\n\n    p = Point(0, 0)\n\n    normal = p.norm()\n    equals normal.x, 0, \"x value of norm of point(0,0) is 0\"\n    equals normal.y, 0, \"y value of norm of point(0,0) is 0\"\n\n  it \"#norm existing\", ->\n    p = Point(6, 8)\n\n    p.norm(5)\n\n    equals p.x, 6\n    equals p.y, 8\n\n  it \"#scale\", ->\n    p = Point(5, 6)\n    scalar = 2\n\n    result = p.scale(scalar)\n\n    equals result.x, p.x * scalar\n    equals result.y, p.y * scalar\n\n    equals p.x, 5\n    equals p.y, 6\n\n  it \"#scale existing\", ->\n    p = Point(0, 1)\n    scalar = 3\n\n    p.scale(scalar)\n\n    equals p.x, 0\n    equals p.y, 1\n\n  it \"#equal\", ->\n    ok Point(7, 8).equal(Point(7, 8))\n\n  it \"#magnitude\", ->\n    equals Point(3, 4).magnitude(), 5\n\n  it \"#length\", ->\n    equals Point(0, 0).length(), 0\n    equals Point(-1, 0).length(), 1\n\n  it \"#toString\", ->\n    p = Point(7, 5)\n    ok eval(p.toString()).equal(p)\n\n  it \"#clamp\", ->\n    p = Point(10, 10)\n    p2 = p.clamp(5)\n\n    equals p2.length(), 5\n\n  it \".centroid\", ->\n    centroid = Point.centroid(\n      Point(0, 0),\n      Point(10, 10),\n      Point(10, 0),\n      Point(0, 10)\n    )\n\n    equals centroid.x, 5\n    equals centroid.y, 5\n\n  it \".fromAngle\", ->\n    p = Point.fromAngle(TAU / 4)\n\n    equalEnough p.x, 0, TOLERANCE\n    equals p.y, 1\n\n  it \".random\", ->\n    p = Point.random()\n\n    ok p\n\n  it \".interpolate\", ->\n    p1 = Point(10, 7)\n    p2 = Point(-6, 29)\n\n    ok p1.equal(Point.interpolate(p1, p2, 0))\n    ok p2.equal(Point.interpolate(p1, p2, 1))\n",
                      "type": "blob"
                    }
                  },
                  "distribution": {
                    "interactive_runtime": {
                      "path": "interactive_runtime",
                      "content": "(function() {\n  window.Point = require(\"./point\");\n\n  Interactive.register(\"example\", function(_arg) {\n    var outputElement, program, result, runtimeElement, source;\n    source = _arg.source, runtimeElement = _arg.runtimeElement;\n    program = CoffeeScript.compile(source, {\n      bare: true\n    });\n    outputElement = document.createElement(\"pre\");\n    runtimeElement.empty().append(outputElement);\n    result = eval(program);\n    if (typeof result === \"number\") {\n      if (result !== (0 | result)) {\n        result = result.toFixed(4);\n      }\n    }\n    return outputElement.textContent = result;\n  });\n\n}).call(this);\n\n//# sourceURL=interactive_runtime.coffee",
                      "type": "blob"
                    },
                    "pixie": {
                      "path": "pixie",
                      "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"point\"};",
                      "type": "blob"
                    },
                    "point": {
                      "path": "point",
                      "content": "(function() {\n  var Point, isObject,\n    __slice = [].slice;\n\n  Point = function(x, y) {\n    var _ref;\n    if (isObject(x)) {\n      _ref = x, x = _ref.x, y = _ref.y;\n    }\n    return {\n      __proto__: Point.prototype,\n      x: x != null ? x : 0,\n      y: y != null ? y : 0\n    };\n  };\n\n  Point.prototype = {\n    clamp: function(n) {\n      if (this.magnitude() > n) {\n        return this.norm(n);\n      } else {\n        return this.copy();\n      }\n    },\n    copy: function() {\n      return Point(this.x, this.y);\n    },\n    add: function(first, second) {\n      if (second != null) {\n        return Point(this.x + first, this.y + second);\n      } else {\n        return Point(this.x + first.x, this.y + first.y);\n      }\n    },\n    subtract: function(first, second) {\n      if (second != null) {\n        return Point(this.x - first, this.y - second);\n      } else {\n        return this.add(first.scale(-1));\n      }\n    },\n    scale: function(scalar) {\n      return Point(this.x * scalar, this.y * scalar);\n    },\n    norm: function(length) {\n      var m;\n      if (length == null) {\n        length = 1.0;\n      }\n      if (m = this.length()) {\n        return this.scale(length / m);\n      } else {\n        return this.copy();\n      }\n    },\n    equal: function(other) {\n      return this.x === other.x && this.y === other.y;\n    },\n    length: function() {\n      return Math.sqrt(this.dot(this));\n    },\n    magnitude: function() {\n      return this.length();\n    },\n    direction: function() {\n      return Math.atan2(this.y, this.x);\n    },\n    dot: function(other) {\n      return this.x * other.x + this.y * other.y;\n    },\n    cross: function(other) {\n      return this.x * other.y - other.x * this.y;\n    },\n    distance: function(other) {\n      return Point.distance(this, other);\n    },\n    toFixed: function(n) {\n      return \"Point(\" + (this.x.toFixed(n)) + \", \" + (this.y.toFixed(n)) + \")\";\n    },\n    toString: function() {\n      return \"Point(\" + this.x + \", \" + this.y + \")\";\n    }\n  };\n\n  Point.distance = function(p1, p2) {\n    return Math.sqrt(Point.distanceSquared(p1, p2));\n  };\n\n  Point.distanceSquared = function(p1, p2) {\n    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);\n  };\n\n  Point.interpolate = function(p1, p2, t) {\n    return p2.subtract(p1).scale(t).add(p1);\n  };\n\n  Point.fromAngle = function(angle) {\n    return Point(Math.cos(angle), Math.sin(angle));\n  };\n\n  Point.direction = function(p1, p2) {\n    return Math.atan2(p2.y - p1.y, p2.x - p1.x);\n  };\n\n  Point.centroid = function() {\n    var points;\n    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n    return points.reduce(function(sumPoint, point) {\n      return sumPoint.add(point);\n    }, Point(0, 0)).scale(1 / points.length);\n  };\n\n  Point.random = function() {\n    return Point.fromAngle(Math.random() * 2 * Math.PI);\n  };\n\n  module.exports = Point;\n\n  isObject = function(object) {\n    return Object.prototype.toString.call(object) === \"[object Object]\";\n  };\n\n}).call(this);\n\n//# sourceURL=point.coffee",
                      "type": "blob"
                    },
                    "test/test": {
                      "path": "test/test",
                      "content": "(function() {\n  var Point, TAU, equals, ok;\n\n  Point = require(\"../point\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  TAU = 2 * Math.PI;\n\n  describe(\"Point\", function() {\n    var TOLERANCE, equalEnough;\n    TOLERANCE = 0.00001;\n    equalEnough = function(expected, actual, tolerance, message) {\n      message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n    };\n    it(\"copy constructor\", function() {\n      var p, p2;\n      p = Point(3, 7);\n      p2 = Point(p);\n      equals(p2.x, p.x);\n      return equals(p2.y, p.y);\n    });\n    it(\"#add\", function() {\n      var p1, p2, result;\n      p1 = Point(5, 6);\n      p2 = Point(7, 5);\n      result = p1.add(p2);\n      equals(result.x, p1.x + p2.x);\n      equals(result.y, p1.y + p2.y);\n      equals(p1.x, 5);\n      equals(p1.y, 6);\n      equals(p2.x, 7);\n      return equals(p2.y, 5);\n    });\n    it(\"#add with two arguments\", function() {\n      var point, result, x, y;\n      point = Point(3, 7);\n      x = 2;\n      y = 1;\n      result = point.add(x, y);\n      equals(result.x, point.x + x);\n      equals(result.y, point.y + y);\n      x = 2;\n      y = 0;\n      result = point.add(x, y);\n      equals(result.x, point.x + x);\n      return equals(result.y, point.y + y);\n    });\n    it(\"#add existing\", function() {\n      var p;\n      p = Point(0, 0);\n      p.add(Point(3, 5));\n      equals(p.x, 0);\n      return equals(p.y, 0);\n    });\n    it(\"#subtract\", function() {\n      var p1, p2, result;\n      p1 = Point(5, 6);\n      p2 = Point(7, 5);\n      result = p1.subtract(p2);\n      equals(result.x, p1.x - p2.x);\n      return equals(result.y, p1.y - p2.y);\n    });\n    it(\"#subtract existing\", function() {\n      var p;\n      p = Point(8, 6);\n      p.subtract(3, 4);\n      equals(p.x, 8);\n      return equals(p.y, 6);\n    });\n    it(\"#norm\", function() {\n      var normal, p;\n      p = Point(2, 0);\n      normal = p.norm();\n      equals(normal.x, 1);\n      normal = p.norm(5);\n      equals(normal.x, 5);\n      p = Point(0, 0);\n      normal = p.norm();\n      equals(normal.x, 0, \"x value of norm of point(0,0) is 0\");\n      return equals(normal.y, 0, \"y value of norm of point(0,0) is 0\");\n    });\n    it(\"#norm existing\", function() {\n      var p;\n      p = Point(6, 8);\n      p.norm(5);\n      equals(p.x, 6);\n      return equals(p.y, 8);\n    });\n    it(\"#scale\", function() {\n      var p, result, scalar;\n      p = Point(5, 6);\n      scalar = 2;\n      result = p.scale(scalar);\n      equals(result.x, p.x * scalar);\n      equals(result.y, p.y * scalar);\n      equals(p.x, 5);\n      return equals(p.y, 6);\n    });\n    it(\"#scale existing\", function() {\n      var p, scalar;\n      p = Point(0, 1);\n      scalar = 3;\n      p.scale(scalar);\n      equals(p.x, 0);\n      return equals(p.y, 1);\n    });\n    it(\"#equal\", function() {\n      return ok(Point(7, 8).equal(Point(7, 8)));\n    });\n    it(\"#magnitude\", function() {\n      return equals(Point(3, 4).magnitude(), 5);\n    });\n    it(\"#length\", function() {\n      equals(Point(0, 0).length(), 0);\n      return equals(Point(-1, 0).length(), 1);\n    });\n    it(\"#toString\", function() {\n      var p;\n      p = Point(7, 5);\n      return ok(eval(p.toString()).equal(p));\n    });\n    it(\"#clamp\", function() {\n      var p, p2;\n      p = Point(10, 10);\n      p2 = p.clamp(5);\n      return equals(p2.length(), 5);\n    });\n    it(\".centroid\", function() {\n      var centroid;\n      centroid = Point.centroid(Point(0, 0), Point(10, 10), Point(10, 0), Point(0, 10));\n      equals(centroid.x, 5);\n      return equals(centroid.y, 5);\n    });\n    it(\".fromAngle\", function() {\n      var p;\n      p = Point.fromAngle(TAU / 4);\n      equalEnough(p.x, 0, TOLERANCE);\n      return equals(p.y, 1);\n    });\n    it(\".random\", function() {\n      var p;\n      p = Point.random();\n      return ok(p);\n    });\n    return it(\".interpolate\", function() {\n      var p1, p2;\n      p1 = Point(10, 7);\n      p2 = Point(-6, 29);\n      ok(p1.equal(Point.interpolate(p1, p2, 0)));\n      return ok(p2.equal(Point.interpolate(p1, p2, 1)));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/test.coffee",
                      "type": "blob"
                    }
                  },
                  "progenitor": {
                    "url": "http://strd6.github.io/editor/"
                  },
                  "version": "0.2.0",
                  "entryPoint": "point",
                  "repository": {
                    "id": 13484982,
                    "name": "point",
                    "full_name": "distri/point",
                    "owner": {
                      "login": "distri",
                      "id": 6005125,
                      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                      "gravatar_id": null,
                      "url": "https://api.github.com/users/distri",
                      "html_url": "https://github.com/distri",
                      "followers_url": "https://api.github.com/users/distri/followers",
                      "following_url": "https://api.github.com/users/distri/following{/other_user}",
                      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                      "organizations_url": "https://api.github.com/users/distri/orgs",
                      "repos_url": "https://api.github.com/users/distri/repos",
                      "events_url": "https://api.github.com/users/distri/events{/privacy}",
                      "received_events_url": "https://api.github.com/users/distri/received_events",
                      "type": "Organization",
                      "site_admin": false
                    },
                    "private": false,
                    "html_url": "https://github.com/distri/point",
                    "description": "JavaScript Point implementation",
                    "fork": false,
                    "url": "https://api.github.com/repos/distri/point",
                    "forks_url": "https://api.github.com/repos/distri/point/forks",
                    "keys_url": "https://api.github.com/repos/distri/point/keys{/key_id}",
                    "collaborators_url": "https://api.github.com/repos/distri/point/collaborators{/collaborator}",
                    "teams_url": "https://api.github.com/repos/distri/point/teams",
                    "hooks_url": "https://api.github.com/repos/distri/point/hooks",
                    "issue_events_url": "https://api.github.com/repos/distri/point/issues/events{/number}",
                    "events_url": "https://api.github.com/repos/distri/point/events",
                    "assignees_url": "https://api.github.com/repos/distri/point/assignees{/user}",
                    "branches_url": "https://api.github.com/repos/distri/point/branches{/branch}",
                    "tags_url": "https://api.github.com/repos/distri/point/tags",
                    "blobs_url": "https://api.github.com/repos/distri/point/git/blobs{/sha}",
                    "git_tags_url": "https://api.github.com/repos/distri/point/git/tags{/sha}",
                    "git_refs_url": "https://api.github.com/repos/distri/point/git/refs{/sha}",
                    "trees_url": "https://api.github.com/repos/distri/point/git/trees{/sha}",
                    "statuses_url": "https://api.github.com/repos/distri/point/statuses/{sha}",
                    "languages_url": "https://api.github.com/repos/distri/point/languages",
                    "stargazers_url": "https://api.github.com/repos/distri/point/stargazers",
                    "contributors_url": "https://api.github.com/repos/distri/point/contributors",
                    "subscribers_url": "https://api.github.com/repos/distri/point/subscribers",
                    "subscription_url": "https://api.github.com/repos/distri/point/subscription",
                    "commits_url": "https://api.github.com/repos/distri/point/commits{/sha}",
                    "git_commits_url": "https://api.github.com/repos/distri/point/git/commits{/sha}",
                    "comments_url": "https://api.github.com/repos/distri/point/comments{/number}",
                    "issue_comment_url": "https://api.github.com/repos/distri/point/issues/comments/{number}",
                    "contents_url": "https://api.github.com/repos/distri/point/contents/{+path}",
                    "compare_url": "https://api.github.com/repos/distri/point/compare/{base}...{head}",
                    "merges_url": "https://api.github.com/repos/distri/point/merges",
                    "archive_url": "https://api.github.com/repos/distri/point/{archive_format}{/ref}",
                    "downloads_url": "https://api.github.com/repos/distri/point/downloads",
                    "issues_url": "https://api.github.com/repos/distri/point/issues{/number}",
                    "pulls_url": "https://api.github.com/repos/distri/point/pulls{/number}",
                    "milestones_url": "https://api.github.com/repos/distri/point/milestones{/number}",
                    "notifications_url": "https://api.github.com/repos/distri/point/notifications{?since,all,participating}",
                    "labels_url": "https://api.github.com/repos/distri/point/labels{/name}",
                    "releases_url": "https://api.github.com/repos/distri/point/releases{/id}",
                    "created_at": "2013-10-10T22:59:27Z",
                    "updated_at": "2013-12-23T23:33:20Z",
                    "pushed_at": "2013-10-15T00:22:04Z",
                    "git_url": "git://github.com/distri/point.git",
                    "ssh_url": "git@github.com:distri/point.git",
                    "clone_url": "https://github.com/distri/point.git",
                    "svn_url": "https://github.com/distri/point",
                    "homepage": null,
                    "size": 836,
                    "stargazers_count": 0,
                    "watchers_count": 0,
                    "language": "CoffeeScript",
                    "has_issues": true,
                    "has_downloads": true,
                    "has_wiki": true,
                    "forks_count": 0,
                    "mirror_url": null,
                    "open_issues_count": 0,
                    "forks": 0,
                    "open_issues": 0,
                    "watchers": 0,
                    "default_branch": "master",
                    "master_branch": "master",
                    "permissions": {
                      "admin": true,
                      "push": true,
                      "pull": true
                    },
                    "organization": {
                      "login": "distri",
                      "id": 6005125,
                      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                      "gravatar_id": null,
                      "url": "https://api.github.com/users/distri",
                      "html_url": "https://github.com/distri",
                      "followers_url": "https://api.github.com/users/distri/followers",
                      "following_url": "https://api.github.com/users/distri/following{/other_user}",
                      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                      "organizations_url": "https://api.github.com/users/distri/orgs",
                      "repos_url": "https://api.github.com/users/distri/repos",
                      "events_url": "https://api.github.com/users/distri/events{/privacy}",
                      "received_events_url": "https://api.github.com/users/distri/received_events",
                      "type": "Organization",
                      "site_admin": false
                    },
                    "network_count": 0,
                    "subscribers_count": 1,
                    "branch": "v0.2.0",
                    "defaultBranch": "master"
                  },
                  "dependencies": {}
                },
                "matrix": {
                  "source": {
                    "LICENSE": {
                      "path": "LICENSE",
                      "mode": "100644",
                      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                      "type": "blob"
                    },
                    "README.md": {
                      "path": "README.md",
                      "mode": "100644",
                      "content": "matrix\n======\n\nWhere matrices become heroes, together.\n",
                      "type": "blob"
                    },
                    "matrix.coffee.md": {
                      "path": "matrix.coffee.md",
                      "mode": "100644",
                      "content": "Matrix\n======\n\n```\n   _        _\n  | a  c tx  |\n  | b  d ty  |\n  |_0  0  1 _|\n```\n\nCreates a matrix for 2d affine transformations.\n\n`concat`, `inverse`, `rotate`, `scale` and `translate` return new matrices with\nthe transformations applied. The matrix is not modified in place.\n\nReturns the identity matrix when called with no arguments.\n\n    Matrix = (a, b, c, d, tx, ty) ->\n      if isObject(a)\n        {a, b, c, d, tx, ty} = a\n\n      __proto__: Matrix.prototype\n      a: a ? 1\n      b: b ? 0\n      c: c ? 0\n      d: d ? 1\n      tx: tx ? 0\n      ty: ty ? 0\n\nA `Point` constructor for the methods that return points. This can be overridden\nwith a compatible constructor if you want fancier points.\n\n    Matrix.Point = require \"./point\"\n\n    Matrix.prototype =\n\n`concat` returns the result of this matrix multiplied by another matrix\ncombining the geometric effects of the two. In mathematical terms,\nconcatenating two matrixes is the same as combining them using matrix multiplication.\nIf this matrix is A and the matrix passed in is B, the resulting matrix is A x B\nhttp://mathworld.wolfram.com/MatrixMultiplication.html\n\n      concat: (matrix) ->\n        Matrix(\n          @a * matrix.a + @c * matrix.b,\n          @b * matrix.a + @d * matrix.b,\n          @a * matrix.c + @c * matrix.d,\n          @b * matrix.c + @d * matrix.d,\n          @a * matrix.tx + @c * matrix.ty + @tx,\n          @b * matrix.tx + @d * matrix.ty + @ty\n        )\n\n\nReturn a new matrix that is a `copy` of this matrix.\n\n      copy: ->\n        Matrix(@a, @b, @c, @d, @tx, @ty)\n\nGiven a point in the pretransform coordinate space, returns the coordinates of\nthat point after the transformation occurs. Unlike the standard transformation\napplied using the transformPoint() method, the deltaTransformPoint() method\ndoes not consider the translation parameters tx and ty.\n\nReturns a new `Point` transformed by this matrix ignoring tx and ty.\n\n      deltaTransformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y,\n          @b * point.x + @d * point.y\n        )\n\nReturns a new matrix that is the inverse of this matrix.\nhttp://mathworld.wolfram.com/MatrixInverse.html\n\n      inverse: ->\n        determinant = @a * @d - @b * @c\n\n        Matrix(\n          @d / determinant,\n          -@b / determinant,\n          -@c / determinant,\n          @a / determinant,\n          (@c * @ty - @d * @tx) / determinant,\n          (@b * @tx - @a * @ty) / determinant\n        )\n\nReturns a new matrix that corresponds this matrix multiplied by a\na rotation matrix.\n\nThe first parameter `theta` is the amount to rotate in radians.\n\nThe second optional parameter, `aboutPoint` is the point about which the\nrotation occurs. Defaults to (0,0).\n\n      rotate: (theta, aboutPoint) ->\n        @concat(Matrix.rotation(theta, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na scaling matrix.\n\n      scale: (sx, sy, aboutPoint) ->\n        @concat(Matrix.scale(sx, sy, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na skewing matrix.\n\n      skew: (skewX, skewY) ->\n        @concat(Matrix.skew(skewX, skewY))\n\nReturns a string representation of this matrix.\n\n      toString: ->\n        \"Matrix(#{@a}, #{@b}, #{@c}, #{@d}, #{@tx}, #{@ty})\"\n\nReturns the result of applying the geometric transformation represented by the\nMatrix object to the specified point.\n\n      transformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y + @tx,\n          @b * point.x + @d * point.y + @ty\n        )\n\nTranslates the matrix along the x and y axes, as specified by the tx and ty parameters.\n\n      translate: (tx, ty) ->\n        @concat(Matrix.translation(tx, ty))\n\nCreates a matrix transformation that corresponds to the given rotation,\naround (0,0) or the specified point.\n\n    Matrix.rotate = Matrix.rotation = (theta, aboutPoint) ->\n      rotationMatrix = Matrix(\n        Math.cos(theta),\n        Math.sin(theta),\n        -Math.sin(theta),\n        Math.cos(theta)\n      )\n\n      if aboutPoint?\n        rotationMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            rotationMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return rotationMatrix\n\nReturns a matrix that corresponds to scaling by factors of sx, sy along\nthe x and y axis respectively.\n\nIf only one parameter is given the matrix is scaled uniformly along both axis.\n\nIf the optional aboutPoint parameter is given the scaling takes place\nabout the given point.\n\n    Matrix.scale = (sx, sy, aboutPoint) ->\n      sy = sy || sx\n\n      scaleMatrix = Matrix(sx, 0, 0, sy)\n\n      if aboutPoint\n        scaleMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            scaleMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return scaleMatrix\n\n\nReturns a matrix that corresponds to a skew of skewX, skewY.\n\n    Matrix.skew = (skewX, skewY) ->\n      Matrix(0, Math.tan(skewY), Math.tan(skewX), 0)\n\nReturns a matrix that corresponds to a translation of tx, ty.\n\n    Matrix.translate = Matrix.translation = (tx, ty) ->\n      Matrix(1, 0, 0, 1, tx, ty)\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\n    frozen = (object) ->\n      Object.freeze?(object)\n\n      return object\n\nConstants\n---------\n\nA constant representing the identity matrix.\n\n    Matrix.IDENTITY = frozen Matrix()\n\nA constant representing the horizontal flip transformation matrix.\n\n    Matrix.HORIZONTAL_FLIP = frozen Matrix(-1, 0, 0, 1)\n\nA constant representing the vertical flip transformation matrix.\n\n    Matrix.VERTICAL_FLIP = frozen Matrix(1, 0, 0, -1)\n\nExports\n-------\n\n    module.exports = Matrix\n",
                      "type": "blob"
                    },
                    "pixie.cson": {
                      "path": "pixie.cson",
                      "mode": "100644",
                      "content": "version: \"0.3.1\"\nentryPoint: \"matrix\"\n",
                      "type": "blob"
                    },
                    "test/matrix.coffee": {
                      "path": "test/matrix.coffee",
                      "mode": "100644",
                      "content": "Matrix = require \"../matrix\"\nPoint = require \"../point\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Matrix\", ->\n\n  TOLERANCE = 0.00001\n  \n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n  \n  matrixEqual = (m1, m2) ->\n    equalEnough(m1.a, m2.a, TOLERANCE)\n    equalEnough(m1.b, m2.b, TOLERANCE)\n    equalEnough(m1.c, m2.c, TOLERANCE)\n    equalEnough(m1.d, m2.d, TOLERANCE)\n    equalEnough(m1.tx, m2.tx, TOLERANCE)\n    equalEnough(m1.ty, m2.ty, TOLERANCE)\n  \n  test \"copy constructor\", ->\n   matrix = Matrix(1, 0, 0, 1, 10, 12)\n  \n   matrix2 = Matrix(matrix)\n  \n   ok matrix != matrix2\n   matrixEqual(matrix2, matrix)\n  \n  test \"Matrix() (Identity)\", ->\n    matrix = Matrix()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"Empty\", ->\n    matrix = Matrix(0, 0, 0, 0, 0, 0)\n  \n    equals(matrix.a, 0, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 0, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#copy\", ->\n    matrix = Matrix(2, 0, 0, 2)\n  \n    copyMatrix = matrix.copy()\n  \n    matrixEqual copyMatrix, matrix\n  \n    copyMatrix.a = 4\n  \n    equals copyMatrix.a, 4\n    equals matrix.a, 2, \"Old 'a' value is unchanged\"\n  \n  test \".scale\", ->\n    matrix = Matrix.scale(2, 2)\n  \n    equals(matrix.a, 2, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 2, \"d\")\n  \n    matrix = Matrix.scale(3)\n  \n    equals(matrix.a, 3, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 3, \"d\")\n  \n  test \".scale (about a point)\", ->\n    p = Point(5, 17)\n  \n    transformedPoint = Matrix.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#scale (about a point)\", ->\n    p = Point(3, 11)\n  \n    transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#skew\", ->\n    matrix = Matrix()\n\n    angle = 0.25 * Math.PI\n  \n    matrix = matrix.skew(angle, 0)\n  \n    equals matrix.c, Math.tan(angle)\n  \n  test \".rotation\", ->\n    matrix = Matrix.rotation(Math.PI / 2)\n  \n    equalEnough(matrix.a, 0, TOLERANCE)\n    equalEnough(matrix.b, 1, TOLERANCE)\n    equalEnough(matrix.c,-1, TOLERANCE)\n    equalEnough(matrix.d, 0, TOLERANCE)\n  \n  test \".rotation (about a point)\", ->\n    p = Point(11, 7)\n  \n    transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#rotate (about a point)\", ->\n    p = Point(8, 5);\n  \n    transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#inverse (Identity)\", ->\n    matrix = Matrix().inverse()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#concat\", ->\n    matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2))\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"#toString\", ->\n    matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5)\n    matrixEqual eval(matrix.toString()), matrix\n  \n  test \"Maths\", ->\n    a = Matrix(12, 3, 3, 1, 7, 9)\n    b = Matrix(3, 8, 3, 2, 1, 5)\n  \n    c = a.concat(b)\n  \n    equals(c.a, 60)\n    equals(c.b, 17)\n    equals(c.c, 42)\n    equals(c.d, 11)\n    equals(c.tx, 34)\n    equals(c.ty, 17)\n  \n  test \"Order of transformations should match manual concat\", ->\n    tx = 10\n    ty = 5\n    theta = Math.PI/3\n    s = 2\n  \n    m1 = Matrix().translate(tx, ty).scale(s).rotate(theta)\n    m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta))\n  \n    matrixEqual(m1, m2)\n  \n  test \"IDENTITY is immutable\", ->\n    identity = Matrix.IDENTITY\n  \n    identity.a = 5\n  \n    equals identity.a, 1\n",
                      "type": "blob"
                    },
                    "point.coffee.md": {
                      "path": "point.coffee.md",
                      "mode": "100644",
                      "content": "Point\n=====\n\nA very simple Point object constructor.\n\n    module.exports = (x, y) ->\n      x: x\n      y: y\n",
                      "type": "blob"
                    }
                  },
                  "distribution": {
                    "matrix": {
                      "path": "matrix",
                      "content": "(function() {\n  var Matrix, frozen, isObject;\n\n  Matrix = function(a, b, c, d, tx, ty) {\n    var _ref;\n    if (isObject(a)) {\n      _ref = a, a = _ref.a, b = _ref.b, c = _ref.c, d = _ref.d, tx = _ref.tx, ty = _ref.ty;\n    }\n    return {\n      __proto__: Matrix.prototype,\n      a: a != null ? a : 1,\n      b: b != null ? b : 0,\n      c: c != null ? c : 0,\n      d: d != null ? d : 1,\n      tx: tx != null ? tx : 0,\n      ty: ty != null ? ty : 0\n    };\n  };\n\n  Matrix.Point = require(\"./point\");\n\n  Matrix.prototype = {\n    concat: function(matrix) {\n      return Matrix(this.a * matrix.a + this.c * matrix.b, this.b * matrix.a + this.d * matrix.b, this.a * matrix.c + this.c * matrix.d, this.b * matrix.c + this.d * matrix.d, this.a * matrix.tx + this.c * matrix.ty + this.tx, this.b * matrix.tx + this.d * matrix.ty + this.ty);\n    },\n    copy: function() {\n      return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);\n    },\n    deltaTransformPoint: function(point) {\n      return Matrix.Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y);\n    },\n    inverse: function() {\n      var determinant;\n      determinant = this.a * this.d - this.b * this.c;\n      return Matrix(this.d / determinant, -this.b / determinant, -this.c / determinant, this.a / determinant, (this.c * this.ty - this.d * this.tx) / determinant, (this.b * this.tx - this.a * this.ty) / determinant);\n    },\n    rotate: function(theta, aboutPoint) {\n      return this.concat(Matrix.rotation(theta, aboutPoint));\n    },\n    scale: function(sx, sy, aboutPoint) {\n      return this.concat(Matrix.scale(sx, sy, aboutPoint));\n    },\n    skew: function(skewX, skewY) {\n      return this.concat(Matrix.skew(skewX, skewY));\n    },\n    toString: function() {\n      return \"Matrix(\" + this.a + \", \" + this.b + \", \" + this.c + \", \" + this.d + \", \" + this.tx + \", \" + this.ty + \")\";\n    },\n    transformPoint: function(point) {\n      return Matrix.Point(this.a * point.x + this.c * point.y + this.tx, this.b * point.x + this.d * point.y + this.ty);\n    },\n    translate: function(tx, ty) {\n      return this.concat(Matrix.translation(tx, ty));\n    }\n  };\n\n  Matrix.rotate = Matrix.rotation = function(theta, aboutPoint) {\n    var rotationMatrix;\n    rotationMatrix = Matrix(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta));\n    if (aboutPoint != null) {\n      rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(rotationMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));\n    }\n    return rotationMatrix;\n  };\n\n  Matrix.scale = function(sx, sy, aboutPoint) {\n    var scaleMatrix;\n    sy = sy || sx;\n    scaleMatrix = Matrix(sx, 0, 0, sy);\n    if (aboutPoint) {\n      scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(scaleMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));\n    }\n    return scaleMatrix;\n  };\n\n  Matrix.skew = function(skewX, skewY) {\n    return Matrix(0, Math.tan(skewY), Math.tan(skewX), 0);\n  };\n\n  Matrix.translate = Matrix.translation = function(tx, ty) {\n    return Matrix(1, 0, 0, 1, tx, ty);\n  };\n\n  isObject = function(object) {\n    return Object.prototype.toString.call(object) === \"[object Object]\";\n  };\n\n  frozen = function(object) {\n    if (typeof Object.freeze === \"function\") {\n      Object.freeze(object);\n    }\n    return object;\n  };\n\n  Matrix.IDENTITY = frozen(Matrix());\n\n  Matrix.HORIZONTAL_FLIP = frozen(Matrix(-1, 0, 0, 1));\n\n  Matrix.VERTICAL_FLIP = frozen(Matrix(1, 0, 0, -1));\n\n  module.exports = Matrix;\n\n}).call(this);\n\n//# sourceURL=matrix.coffee",
                      "type": "blob"
                    },
                    "pixie": {
                      "path": "pixie",
                      "content": "module.exports = {\"version\":\"0.3.1\",\"entryPoint\":\"matrix\"};",
                      "type": "blob"
                    },
                    "test/matrix": {
                      "path": "test/matrix",
                      "content": "(function() {\n  var Matrix, Point, equals, ok, test;\n\n  Matrix = require(\"../matrix\");\n\n  Point = require(\"../point\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Matrix\", function() {\n    var TOLERANCE, equalEnough, matrixEqual;\n    TOLERANCE = 0.00001;\n    equalEnough = function(expected, actual, tolerance, message) {\n      message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n    };\n    matrixEqual = function(m1, m2) {\n      equalEnough(m1.a, m2.a, TOLERANCE);\n      equalEnough(m1.b, m2.b, TOLERANCE);\n      equalEnough(m1.c, m2.c, TOLERANCE);\n      equalEnough(m1.d, m2.d, TOLERANCE);\n      equalEnough(m1.tx, m2.tx, TOLERANCE);\n      return equalEnough(m1.ty, m2.ty, TOLERANCE);\n    };\n    test(\"copy constructor\", function() {\n      var matrix, matrix2;\n      matrix = Matrix(1, 0, 0, 1, 10, 12);\n      matrix2 = Matrix(matrix);\n      ok(matrix !== matrix2);\n      return matrixEqual(matrix2, matrix);\n    });\n    test(\"Matrix() (Identity)\", function() {\n      var matrix;\n      matrix = Matrix();\n      equals(matrix.a, 1, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 1, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      equals(matrix.ty, 0, \"ty\");\n      return matrixEqual(matrix, Matrix.IDENTITY);\n    });\n    test(\"Empty\", function() {\n      var matrix;\n      matrix = Matrix(0, 0, 0, 0, 0, 0);\n      equals(matrix.a, 0, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 0, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      return equals(matrix.ty, 0, \"ty\");\n    });\n    test(\"#copy\", function() {\n      var copyMatrix, matrix;\n      matrix = Matrix(2, 0, 0, 2);\n      copyMatrix = matrix.copy();\n      matrixEqual(copyMatrix, matrix);\n      copyMatrix.a = 4;\n      equals(copyMatrix.a, 4);\n      return equals(matrix.a, 2, \"Old 'a' value is unchanged\");\n    });\n    test(\".scale\", function() {\n      var matrix;\n      matrix = Matrix.scale(2, 2);\n      equals(matrix.a, 2, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 2, \"d\");\n      matrix = Matrix.scale(3);\n      equals(matrix.a, 3, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      return equals(matrix.d, 3, \"d\");\n    });\n    test(\".scale (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(5, 17);\n      transformedPoint = Matrix.scale(3, 7, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#scale (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(3, 11);\n      transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#skew\", function() {\n      var angle, matrix;\n      matrix = Matrix();\n      angle = 0.25 * Math.PI;\n      matrix = matrix.skew(angle, 0);\n      return equals(matrix.c, Math.tan(angle));\n    });\n    test(\".rotation\", function() {\n      var matrix;\n      matrix = Matrix.rotation(Math.PI / 2);\n      equalEnough(matrix.a, 0, TOLERANCE);\n      equalEnough(matrix.b, 1, TOLERANCE);\n      equalEnough(matrix.c, -1, TOLERANCE);\n      return equalEnough(matrix.d, 0, TOLERANCE);\n    });\n    test(\".rotation (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(11, 7);\n      transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#rotate (about a point)\", function() {\n      var p, transformedPoint;\n      p = Point(8, 5);\n      transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p);\n      equals(transformedPoint.x, p.x, \"Point should remain the same\");\n      return equals(transformedPoint.y, p.y, \"Point should remain the same\");\n    });\n    test(\"#inverse (Identity)\", function() {\n      var matrix;\n      matrix = Matrix().inverse();\n      equals(matrix.a, 1, \"a\");\n      equals(matrix.b, 0, \"b\");\n      equals(matrix.c, 0, \"c\");\n      equals(matrix.d, 1, \"d\");\n      equals(matrix.tx, 0, \"tx\");\n      return equals(matrix.ty, 0, \"ty\");\n    });\n    test(\"#concat\", function() {\n      var matrix;\n      matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2));\n      return matrixEqual(matrix, Matrix.IDENTITY);\n    });\n    test(\"#toString\", function() {\n      var matrix;\n      matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5);\n      return matrixEqual(eval(matrix.toString()), matrix);\n    });\n    test(\"Maths\", function() {\n      var a, b, c;\n      a = Matrix(12, 3, 3, 1, 7, 9);\n      b = Matrix(3, 8, 3, 2, 1, 5);\n      c = a.concat(b);\n      equals(c.a, 60);\n      equals(c.b, 17);\n      equals(c.c, 42);\n      equals(c.d, 11);\n      equals(c.tx, 34);\n      return equals(c.ty, 17);\n    });\n    test(\"Order of transformations should match manual concat\", function() {\n      var m1, m2, s, theta, tx, ty;\n      tx = 10;\n      ty = 5;\n      theta = Math.PI / 3;\n      s = 2;\n      m1 = Matrix().translate(tx, ty).scale(s).rotate(theta);\n      m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta));\n      return matrixEqual(m1, m2);\n    });\n    return test(\"IDENTITY is immutable\", function() {\n      var identity;\n      identity = Matrix.IDENTITY;\n      identity.a = 5;\n      return equals(identity.a, 1);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/matrix.coffee",
                      "type": "blob"
                    },
                    "point": {
                      "path": "point",
                      "content": "(function() {\n  module.exports = function(x, y) {\n    return {\n      x: x,\n      y: y\n    };\n  };\n\n}).call(this);\n\n//# sourceURL=point.coffee",
                      "type": "blob"
                    }
                  },
                  "progenitor": {
                    "url": "http://strd6.github.io/editor/"
                  },
                  "version": "0.3.1",
                  "entryPoint": "matrix",
                  "repository": {
                    "id": 13551996,
                    "name": "matrix",
                    "full_name": "distri/matrix",
                    "owner": {
                      "login": "distri",
                      "id": 6005125,
                      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                      "gravatar_id": null,
                      "url": "https://api.github.com/users/distri",
                      "html_url": "https://github.com/distri",
                      "followers_url": "https://api.github.com/users/distri/followers",
                      "following_url": "https://api.github.com/users/distri/following{/other_user}",
                      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                      "organizations_url": "https://api.github.com/users/distri/orgs",
                      "repos_url": "https://api.github.com/users/distri/repos",
                      "events_url": "https://api.github.com/users/distri/events{/privacy}",
                      "received_events_url": "https://api.github.com/users/distri/received_events",
                      "type": "Organization",
                      "site_admin": false
                    },
                    "private": false,
                    "html_url": "https://github.com/distri/matrix",
                    "description": "Where matrices become heroes, together.",
                    "fork": false,
                    "url": "https://api.github.com/repos/distri/matrix",
                    "forks_url": "https://api.github.com/repos/distri/matrix/forks",
                    "keys_url": "https://api.github.com/repos/distri/matrix/keys{/key_id}",
                    "collaborators_url": "https://api.github.com/repos/distri/matrix/collaborators{/collaborator}",
                    "teams_url": "https://api.github.com/repos/distri/matrix/teams",
                    "hooks_url": "https://api.github.com/repos/distri/matrix/hooks",
                    "issue_events_url": "https://api.github.com/repos/distri/matrix/issues/events{/number}",
                    "events_url": "https://api.github.com/repos/distri/matrix/events",
                    "assignees_url": "https://api.github.com/repos/distri/matrix/assignees{/user}",
                    "branches_url": "https://api.github.com/repos/distri/matrix/branches{/branch}",
                    "tags_url": "https://api.github.com/repos/distri/matrix/tags",
                    "blobs_url": "https://api.github.com/repos/distri/matrix/git/blobs{/sha}",
                    "git_tags_url": "https://api.github.com/repos/distri/matrix/git/tags{/sha}",
                    "git_refs_url": "https://api.github.com/repos/distri/matrix/git/refs{/sha}",
                    "trees_url": "https://api.github.com/repos/distri/matrix/git/trees{/sha}",
                    "statuses_url": "https://api.github.com/repos/distri/matrix/statuses/{sha}",
                    "languages_url": "https://api.github.com/repos/distri/matrix/languages",
                    "stargazers_url": "https://api.github.com/repos/distri/matrix/stargazers",
                    "contributors_url": "https://api.github.com/repos/distri/matrix/contributors",
                    "subscribers_url": "https://api.github.com/repos/distri/matrix/subscribers",
                    "subscription_url": "https://api.github.com/repos/distri/matrix/subscription",
                    "commits_url": "https://api.github.com/repos/distri/matrix/commits{/sha}",
                    "git_commits_url": "https://api.github.com/repos/distri/matrix/git/commits{/sha}",
                    "comments_url": "https://api.github.com/repos/distri/matrix/comments{/number}",
                    "issue_comment_url": "https://api.github.com/repos/distri/matrix/issues/comments/{number}",
                    "contents_url": "https://api.github.com/repos/distri/matrix/contents/{+path}",
                    "compare_url": "https://api.github.com/repos/distri/matrix/compare/{base}...{head}",
                    "merges_url": "https://api.github.com/repos/distri/matrix/merges",
                    "archive_url": "https://api.github.com/repos/distri/matrix/{archive_format}{/ref}",
                    "downloads_url": "https://api.github.com/repos/distri/matrix/downloads",
                    "issues_url": "https://api.github.com/repos/distri/matrix/issues{/number}",
                    "pulls_url": "https://api.github.com/repos/distri/matrix/pulls{/number}",
                    "milestones_url": "https://api.github.com/repos/distri/matrix/milestones{/number}",
                    "notifications_url": "https://api.github.com/repos/distri/matrix/notifications{?since,all,participating}",
                    "labels_url": "https://api.github.com/repos/distri/matrix/labels{/name}",
                    "releases_url": "https://api.github.com/repos/distri/matrix/releases{/id}",
                    "created_at": "2013-10-14T03:46:16Z",
                    "updated_at": "2013-12-23T23:45:28Z",
                    "pushed_at": "2013-10-15T00:22:51Z",
                    "git_url": "git://github.com/distri/matrix.git",
                    "ssh_url": "git@github.com:distri/matrix.git",
                    "clone_url": "https://github.com/distri/matrix.git",
                    "svn_url": "https://github.com/distri/matrix",
                    "homepage": null,
                    "size": 580,
                    "stargazers_count": 0,
                    "watchers_count": 0,
                    "language": "CoffeeScript",
                    "has_issues": true,
                    "has_downloads": true,
                    "has_wiki": true,
                    "forks_count": 0,
                    "mirror_url": null,
                    "open_issues_count": 0,
                    "forks": 0,
                    "open_issues": 0,
                    "watchers": 0,
                    "default_branch": "master",
                    "master_branch": "master",
                    "permissions": {
                      "admin": true,
                      "push": true,
                      "pull": true
                    },
                    "organization": {
                      "login": "distri",
                      "id": 6005125,
                      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                      "gravatar_id": null,
                      "url": "https://api.github.com/users/distri",
                      "html_url": "https://github.com/distri",
                      "followers_url": "https://api.github.com/users/distri/followers",
                      "following_url": "https://api.github.com/users/distri/following{/other_user}",
                      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                      "organizations_url": "https://api.github.com/users/distri/orgs",
                      "repos_url": "https://api.github.com/users/distri/repos",
                      "events_url": "https://api.github.com/users/distri/events{/privacy}",
                      "received_events_url": "https://api.github.com/users/distri/received_events",
                      "type": "Organization",
                      "site_admin": false
                    },
                    "network_count": 0,
                    "subscribers_count": 1,
                    "branch": "v0.3.1",
                    "defaultBranch": "master"
                  },
                  "dependencies": {}
                },
                "random": {
                  "source": {
                    "LICENSE": {
                      "path": "LICENSE",
                      "mode": "100644",
                      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                      "type": "blob"
                    },
                    "README.md": {
                      "path": "README.md",
                      "mode": "100644",
                      "content": "random\n======\n\nRandom generation.\n",
                      "type": "blob"
                    },
                    "pixie.cson": {
                      "path": "pixie.cson",
                      "mode": "100644",
                      "content": "version: \"0.2.0\"\nentryPoint: \"random\"\n",
                      "type": "blob"
                    },
                    "random.coffee.md": {
                      "path": "random.coffee.md",
                      "mode": "100644",
                      "content": "Random\n======\n\nSome useful methods for generating random things.\n\nHelpers\n-------\n\n`τ` is the circle constant.\n\n    τ = 2 * Math.PI\n\n`U` returns a continuous uniform distribution between `min` and `max`.\n\n    U = (min, max) ->\n      ->\n        Math.random() * (max - min) + min\n\n`standardUniformDistribution` is the uniform distribution between [0, 1]\n\n    standardUniformDistribution = U(0, 1)\n\n`rand` is a helpful shortcut for generating random numbers from a standard\nuniform distribution or from a discreet set of integers.\n\n    rand = (n) ->\n      if n\n        Math.floor(n * standardUniformDistribution())\n      else\n        standardUniformDistribution()\n\nMethods\n-------\n\n    module.exports = Random =\n\nReturns a random angle, uniformly distributed, between 0 and τ.\n\n      angle: ->\n        rand() * τ\n\nA binomial distribution.\n\n      binomial: (n=1, p=0.5) ->\n        [0...n].map ->\n          if rand() < p\n            1\n          else\n            0\n        .reduce (a, b) ->\n          a + b\n        , 0\n\nReturns a random float between two numbers.\n\n      between: (min, max) ->\n        rand() * (max - min) + min\n\nReturns random integers from [0, n) if n is given.\nOtherwise returns random float between 0 and 1.\n\n      rand: rand\n\nReturns random float from [-n / 2, n / 2] if n is given.\nOtherwise returns random float between -0.5 and 0.5.\n\n      signed: (n=1) ->\n        (n * rand()) - (n / 2)\n",
                      "type": "blob"
                    },
                    "test/random.coffee": {
                      "path": "test/random.coffee",
                      "mode": "100644",
                      "content": "Random = require \"../random\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Random\", ->\n  \n  test \"methods\", ->\n    [\n      \"angle\"\n      \"binomial\"\n      \"between\"\n      \"rand\"\n      \"signed\"\n    ].forEach (name) ->\n      ok(Random[name], name)\n\n  it \"should have binomial\", ->\n    result = Random.binomial()\n\n    assert result is 1 or result is 0\n",
                      "type": "blob"
                    }
                  },
                  "distribution": {
                    "pixie": {
                      "path": "pixie",
                      "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"random\"};",
                      "type": "blob"
                    },
                    "random": {
                      "path": "random",
                      "content": "(function() {\n  var Random, U, rand, standardUniformDistribution, τ;\n\n  τ = 2 * Math.PI;\n\n  U = function(min, max) {\n    return function() {\n      return Math.random() * (max - min) + min;\n    };\n  };\n\n  standardUniformDistribution = U(0, 1);\n\n  rand = function(n) {\n    if (n) {\n      return Math.floor(n * standardUniformDistribution());\n    } else {\n      return standardUniformDistribution();\n    }\n  };\n\n  module.exports = Random = {\n    angle: function() {\n      return rand() * τ;\n    },\n    binomial: function(n, p) {\n      var _i, _results;\n      if (n == null) {\n        n = 1;\n      }\n      if (p == null) {\n        p = 0.5;\n      }\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).map(function() {\n        if (rand() < p) {\n          return 1;\n        } else {\n          return 0;\n        }\n      }).reduce(function(a, b) {\n        return a + b;\n      }, 0);\n    },\n    between: function(min, max) {\n      return rand() * (max - min) + min;\n    },\n    rand: rand,\n    signed: function(n) {\n      if (n == null) {\n        n = 1;\n      }\n      return (n * rand()) - (n / 2);\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=random.coffee",
                      "type": "blob"
                    },
                    "test/random": {
                      "path": "test/random",
                      "content": "(function() {\n  var Random, equals, ok, test;\n\n  Random = require(\"../random\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Random\", function() {\n    test(\"methods\", function() {\n      return [\"angle\", \"binomial\", \"between\", \"rand\", \"signed\"].forEach(function(name) {\n        return ok(Random[name], name);\n      });\n    });\n    return it(\"should have binomial\", function() {\n      var result;\n      result = Random.binomial();\n      return assert(result === 1 || result === 0);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/random.coffee",
                      "type": "blob"
                    }
                  },
                  "progenitor": {
                    "url": "http://strd6.github.io/editor/"
                  },
                  "version": "0.2.0",
                  "entryPoint": "random",
                  "repository": {
                    "id": 13576812,
                    "name": "random",
                    "full_name": "distri/random",
                    "owner": {
                      "login": "distri",
                      "id": 6005125,
                      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                      "gravatar_id": null,
                      "url": "https://api.github.com/users/distri",
                      "html_url": "https://github.com/distri",
                      "followers_url": "https://api.github.com/users/distri/followers",
                      "following_url": "https://api.github.com/users/distri/following{/other_user}",
                      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                      "organizations_url": "https://api.github.com/users/distri/orgs",
                      "repos_url": "https://api.github.com/users/distri/repos",
                      "events_url": "https://api.github.com/users/distri/events{/privacy}",
                      "received_events_url": "https://api.github.com/users/distri/received_events",
                      "type": "Organization",
                      "site_admin": false
                    },
                    "private": false,
                    "html_url": "https://github.com/distri/random",
                    "description": "Random generation.",
                    "fork": false,
                    "url": "https://api.github.com/repos/distri/random",
                    "forks_url": "https://api.github.com/repos/distri/random/forks",
                    "keys_url": "https://api.github.com/repos/distri/random/keys{/key_id}",
                    "collaborators_url": "https://api.github.com/repos/distri/random/collaborators{/collaborator}",
                    "teams_url": "https://api.github.com/repos/distri/random/teams",
                    "hooks_url": "https://api.github.com/repos/distri/random/hooks",
                    "issue_events_url": "https://api.github.com/repos/distri/random/issues/events{/number}",
                    "events_url": "https://api.github.com/repos/distri/random/events",
                    "assignees_url": "https://api.github.com/repos/distri/random/assignees{/user}",
                    "branches_url": "https://api.github.com/repos/distri/random/branches{/branch}",
                    "tags_url": "https://api.github.com/repos/distri/random/tags",
                    "blobs_url": "https://api.github.com/repos/distri/random/git/blobs{/sha}",
                    "git_tags_url": "https://api.github.com/repos/distri/random/git/tags{/sha}",
                    "git_refs_url": "https://api.github.com/repos/distri/random/git/refs{/sha}",
                    "trees_url": "https://api.github.com/repos/distri/random/git/trees{/sha}",
                    "statuses_url": "https://api.github.com/repos/distri/random/statuses/{sha}",
                    "languages_url": "https://api.github.com/repos/distri/random/languages",
                    "stargazers_url": "https://api.github.com/repos/distri/random/stargazers",
                    "contributors_url": "https://api.github.com/repos/distri/random/contributors",
                    "subscribers_url": "https://api.github.com/repos/distri/random/subscribers",
                    "subscription_url": "https://api.github.com/repos/distri/random/subscription",
                    "commits_url": "https://api.github.com/repos/distri/random/commits{/sha}",
                    "git_commits_url": "https://api.github.com/repos/distri/random/git/commits{/sha}",
                    "comments_url": "https://api.github.com/repos/distri/random/comments{/number}",
                    "issue_comment_url": "https://api.github.com/repos/distri/random/issues/comments/{number}",
                    "contents_url": "https://api.github.com/repos/distri/random/contents/{+path}",
                    "compare_url": "https://api.github.com/repos/distri/random/compare/{base}...{head}",
                    "merges_url": "https://api.github.com/repos/distri/random/merges",
                    "archive_url": "https://api.github.com/repos/distri/random/{archive_format}{/ref}",
                    "downloads_url": "https://api.github.com/repos/distri/random/downloads",
                    "issues_url": "https://api.github.com/repos/distri/random/issues{/number}",
                    "pulls_url": "https://api.github.com/repos/distri/random/pulls{/number}",
                    "milestones_url": "https://api.github.com/repos/distri/random/milestones{/number}",
                    "notifications_url": "https://api.github.com/repos/distri/random/notifications{?since,all,participating}",
                    "labels_url": "https://api.github.com/repos/distri/random/labels{/name}",
                    "releases_url": "https://api.github.com/repos/distri/random/releases{/id}",
                    "created_at": "2013-10-15T00:28:31Z",
                    "updated_at": "2013-12-06T23:31:24Z",
                    "pushed_at": "2013-10-15T01:01:00Z",
                    "git_url": "git://github.com/distri/random.git",
                    "ssh_url": "git@github.com:distri/random.git",
                    "clone_url": "https://github.com/distri/random.git",
                    "svn_url": "https://github.com/distri/random",
                    "homepage": null,
                    "size": 292,
                    "stargazers_count": 0,
                    "watchers_count": 0,
                    "language": "CoffeeScript",
                    "has_issues": true,
                    "has_downloads": true,
                    "has_wiki": true,
                    "forks_count": 0,
                    "mirror_url": null,
                    "open_issues_count": 0,
                    "forks": 0,
                    "open_issues": 0,
                    "watchers": 0,
                    "default_branch": "master",
                    "master_branch": "master",
                    "permissions": {
                      "admin": true,
                      "push": true,
                      "pull": true
                    },
                    "organization": {
                      "login": "distri",
                      "id": 6005125,
                      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                      "gravatar_id": null,
                      "url": "https://api.github.com/users/distri",
                      "html_url": "https://github.com/distri",
                      "followers_url": "https://api.github.com/users/distri/followers",
                      "following_url": "https://api.github.com/users/distri/following{/other_user}",
                      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                      "organizations_url": "https://api.github.com/users/distri/orgs",
                      "repos_url": "https://api.github.com/users/distri/repos",
                      "events_url": "https://api.github.com/users/distri/events{/privacy}",
                      "received_events_url": "https://api.github.com/users/distri/received_events",
                      "type": "Organization",
                      "site_admin": false
                    },
                    "network_count": 0,
                    "subscribers_count": 1,
                    "branch": "v0.2.0",
                    "defaultBranch": "master"
                  },
                  "dependencies": {}
                }
              }
            },
            "extensions": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "Extensions\n==========\n\nExtend built-in prototypes with helpful methods.\n",
                  "type": "blob"
                },
                "array.coffee.md": {
                  "path": "array.coffee.md",
                  "mode": "100644",
                  "content": "Array\n=====\n\n    {extend} = require \"./util\"\n\n    extend Array.prototype,\n\nCalculate the average value of an array. Returns undefined if some elements\nare not numbers.\n\n      average: ->\n        @sum()/@length\n\n>     #! example\n>     [1, 3, 5, 7].average()\n\n----\n\nReturns a copy of the array without null and undefined values.\n\n      compact: ->\n        @select (element) ->\n          element?\n\n>     #! example\n>     [null, undefined, 3, 3, undefined, 5].compact()\n\n----\n\nCreates and returns a copy of the array. The copy contains\nthe same objects.\n\n      copy: ->\n        @concat()\n\n>     #! example\n>     a = [\"a\", \"b\", \"c\"]\n>     b = a.copy()\n>\n>     # their elements are equal\n>     a[0] == b[0] && a[1] == b[1] && a[2] == b[2]\n>     # => true\n>\n>     # but they aren't the same object in memory\n>     a is b\n>     # => false\n\n----\n\nEmpties the array of its contents. It is modified in place.\n\n      clear: ->\n        @length = 0\n\n        return this\n\n>     #! example\n>     fullArray = [1, 2, 3]\n>     fullArray.clear()\n>     fullArray\n\n----\n\nFlatten out an array of arrays into a single array of elements.\n\n      flatten: ->\n        @inject [], (a, b) ->\n          a.concat b\n\n>     #! example\n>     [[1, 2], [3, 4], 5].flatten()\n>     # => [1, 2, 3, 4, 5]\n>\n>     # won't flatten twice nested arrays. call\n>     # flatten twice if that is what you want\n>     [[1, 2], [3, [4, 5]], 6].flatten()\n>     # => [1, 2, 3, [4, 5], 6]\n\n----\n\nInvoke the named method on each element in the array\nand return a new array containing the results of the invocation.\n\n      invoke: (method, args...) ->\n        @map (element) ->\n          element[method].apply(element, args)\n\n>     #! example\n>     [1.1, 2.2, 3.3, 4.4].invoke(\"floor\")\n\n----\n\n>     #! example\n>     ['hello', 'world', 'cool!'].invoke('substring', 0, 3)\n\n----\n\nRandomly select an element from the array.\n\n      rand: ->\n        @[rand(@length)]\n\n>     #! example\n>     [1, 2, 3].rand()\n\n----\n\nRemove the first occurrence of the given object from the array if it is\npresent. The array is modified in place.\n\n      remove: (object) ->\n        index = @indexOf(object)\n\n        if index >= 0\n          @splice(index, 1)[0]\n        else\n          undefined\n\n>     #! example\n>     a = [1, 1, \"a\", \"b\"]\n>     a.remove(1)\n>     a\n\n----\n\nReturns true if the element is present in the array.\n\n      include: (element) ->\n        @indexOf(element) != -1\n\n>     #! example\n>     [\"a\", \"b\", \"c\"].include(\"c\")\n\n----\n\nCall the given iterator once for each element in the array,\npassing in the element as the first argument, the index of\nthe element as the second argument, and this array as the\nthird argument.\n\n      each: (iterator, context) ->\n        if @forEach\n          @forEach iterator, context\n        else\n          for element, i in this\n            iterator.call context, element, i, this\n\n        return this\n\n>     #! example\n>     word = \"\"\n>     indices = []\n>     [\"r\", \"a\", \"d\"].each (letter, index) ->\n>       word += letter\n>       indices.push(index)\n>\n>     # => [\"r\", \"a\", \"d\"]\n>\n>     word\n>     # => \"rad\"\n>\n>     indices\n\n----\n\nCall the given iterator once for each pair of objects in the array.\n\n      eachPair: (iterator, context) ->\n        length = @length\n        i = 0\n        while i < length\n          a = @[i]\n          j = i + 1\n          i += 1\n\n          while j < length\n            b = @[j]\n            j += 1\n\n            iterator.call context, a, b\n\n>     #! example\n>     results = []\n>     [1, 2, 3, 4].eachPair (a, b) ->\n>       results.push [a, b]\n>\n>     results\n\n----\n\nCall the given iterator once for each element in the array,\npassing in the element as the first argument and the given object\nas the second argument. Additional arguments are passed similar to\n`each`.\n\n      eachWithObject: (object, iterator, context) ->\n        @each (element, i, self) ->\n          iterator.call context, element, object, i, self\n\n        return object\n\nCall the given iterator once for each group of elements in the array,\npassing in the elements in groups of n. Additional arguments are\npassed as in `each`.\n\n      eachSlice: (n, iterator, context) ->\n        len = @length / n\n        i = -1\n\n        while ++i < len\n          iterator.call(context, @slice(i*n, (i+1)*n), i*n, this)\n\n        return this\n\n>     #! example\n>     results = []\n>     [1, 2, 3, 4].eachSlice 2, (slice) ->\n>       results.push(slice)\n>\n>     results\n\n----\n\nPipe the input through each function in the array in turn. For example, if you have a\nlist of objects you can perform a series of selection, sorting, and other processing\nmethods and then receive the processed list. This array must contain functions that\naccept a single input and return the processed input. The output of the first function\nis fed to the input of the second and so on until the final processed output is returned.\n\n      pipeline: (input) ->\n        @inject input, (input, fn) ->\n          fn(input)\n\nReturns a new array with the elements all shuffled up.\n\n      shuffle: ->\n        shuffledArray = []\n\n        @each (element) ->\n          shuffledArray.splice(rand(shuffledArray.length + 1), 0, element)\n\n        return shuffledArray\n\n>     #! example\n>     [0..9].shuffle()\n\n----\n\nReturns the first element of the array, undefined if the array is empty.\n\n      first: ->\n        @[0]\n\n>     #! example\n>     [\"first\", \"second\", \"third\"].first()\n\n----\n\nReturns the last element of the array, undefined if the array is empty.\n\n      last: ->\n        @[@length - 1]\n\n>     #! example\n>     [\"first\", \"second\", \"third\"].last()\n\n----\n\nReturns an object containing the extremes of this array.\n\n      extremes: (fn=identity) ->\n        min = max = undefined\n        minResult = maxResult = undefined\n\n        @each (object) ->\n          result = fn(object)\n\n          if min?\n            if result < minResult\n              min = object\n              minResult = result\n          else\n            min = object\n            minResult = result\n\n          if max?\n            if result > maxResult\n              max = object\n              maxResult = result\n          else\n            max = object\n            maxResult = result\n\n        min: min\n        max: max\n\n>     #! example\n>     [-1, 3, 0].extremes()\n\n----\n\n      maxima: (valueFunction=identity) ->\n        @inject([-Infinity, []], (memo, item) ->\n          value = valueFunction(item)\n          [maxValue, maxItems] = memo\n\n          if value > maxValue\n            [value, [item]]\n          else if value is maxValue\n            [value, maxItems.concat(item)]\n          else\n            memo\n        ).last()\n\n      maximum: (valueFunction) ->\n        @maxima(valueFunction).first()\n\n      minima: (valueFunction=identity) ->\n        inverseFn = (x) ->\n          -valueFunction(x)\n\n        @maxima(inverseFn)\n\n      minimum: (valueFunction) ->\n        @minima(valueFunction).first()\n\nPretend the array is a circle and grab a new array containing length elements.\nIf length is not given return the element at start, again assuming the array\nis a circle.\n\n      wrap: (start, length) ->\n        if length?\n          end = start + length\n          i = start\n          result = []\n\n          while i < end\n            result.push(@[mod(i, @length)])\n            i += 1\n\n          return result\n        else\n          return @[mod(start, @length)]\n\n>     #! example\n>     [1, 2, 3].wrap(-1)\n\n----\n\n>     #! example\n>     [1, 2, 3].wrap(6)\n\n----\n\n>     #! example\n>     [\"l\", \"o\", \"o\", \"p\"].wrap(0, 12)\n\n----\n\nPartitions the elements into two groups: those for which the iterator returns\ntrue, and those for which it returns false.\n\n      partition: (iterator, context) ->\n        trueCollection = []\n        falseCollection = []\n\n        @each (element) ->\n          if iterator.call(context, element)\n            trueCollection.push element\n          else\n            falseCollection.push element\n\n        return [trueCollection, falseCollection]\n\n>     #! example\n>     [0..9].partition (n) ->\n>       n % 2 is 0\n\n----\n\nReturn the group of elements for which the return value of the iterator is true.\n\n      select: (iterator, context) ->\n        return @partition(iterator, context)[0]\n\nReturn the group of elements that are not in the passed in set.\n\n      without: (values) ->\n        @reject (element) ->\n          values.include(element)\n\n>     #! example\n>     [1, 2, 3, 4].without [2, 3]\n\n----\n\nReturn the group of elements for which the return value of the iterator is false.\n\n      reject: (iterator, context) ->\n        @partition(iterator, context)[1]\n\nCombines all elements of the array by applying a binary operation.\nfor each element in the arra the iterator is passed an accumulator\nvalue (memo) and the element.\n\n      inject: (initial, iterator) ->\n        @each (element) ->\n          initial = iterator(initial, element)\n\n        return initial\n\nAdd all the elements in the array.\n\n      sum: ->\n        @inject 0, (sum, n) ->\n          sum + n\n\n>     #! example\n>     [1, 2, 3, 4].sum()\n\n----\n\nMultiply all the elements in the array.\n\n      product: ->\n        @inject 1, (product, n) ->\n          product * n\n\n>     #! example\n>     [1, 2, 3, 4].product()\n\n----\n\nProduce a duplicate-free version of the array.\n\n      unique: ->\n        @inject [], (results, element) ->\n          results.push element if results.indexOf(element) is -1\n\n          results\n\nMerges together the values of each of the arrays with the values at the corresponding position.\n\n      zip: (args...) ->\n        @map (element, index) ->\n          output = args.map (arr) ->\n            arr[index]\n\n          output.unshift(element)\n\n          return output\n\n>     #! example\n>     ['a', 'b', 'c'].zip([1, 2, 3])\n\n----\n\nHelpers\n-------\n\n    identity = (x) ->\n      x\n\n    rand = (n) ->\n      Math.floor n * Math.random()\n\n    mod = (n, base) ->\n      result = n % base\n\n      if result < 0 and base > 0\n        result += base\n\n      return result\n",
                  "type": "blob"
                },
                "extensions.coffee.md": {
                  "path": "extensions.coffee.md",
                  "mode": "100644",
                  "content": "Extensions\n==========\n\nExtend built in prototypes with additional behavior.\n\n    require \"./array\"\n    require \"./function\"\n    require \"./number\"\n    require \"./string\"\n",
                  "type": "blob"
                },
                "function.coffee.md": {
                  "path": "function.coffee.md",
                  "mode": "100644",
                  "content": "Function\n========\n\n    {extend} = require \"./util\"\n\nAdd our `Function` extensions.\n\n    extend Function.prototype,\n      once: ->\n        func = this\n\n        ran = false\n        memo = undefined\n\n        return ->\n          return memo if ran\n          ran = true\n\n          return memo = func.apply(this, arguments)\n\nCalling a debounced function will postpone its execution until after\nwait milliseconds have elapsed since the last time the function was\ninvoked. Useful for implementing behavior that should only happen after\nthe input has stopped arriving. For example: rendering a preview of a\nMarkdown comment, recalculating a layout after the window has stopped\nbeing resized...\n\n      debounce: (wait) ->\n        timeout = null\n        func = this\n\n        return ->\n          context = this\n          args = arguments\n\n          later = ->\n            timeout = null\n            func.apply(context, args)\n\n          clearTimeout(timeout)\n          timeout = setTimeout(later, wait)\n\n>     lazyLayout = calculateLayout.debounce(300)\n>     $(window).resize(lazyLayout)\n\n----\n\n      delay: (wait, args...) ->\n        func = this\n\n        setTimeout ->\n          func.apply(null, args)\n        , wait\n\n      defer: (args...) ->\n        this.delay.apply this, [1].concat(args)\n\n    extend Function,\n      identity: (x) ->\n        x\n\n      noop: ->\n",
                  "type": "blob"
                },
                "number.coffee.md": {
                  "path": "number.coffee.md",
                  "mode": "100644",
                  "content": "Number\n======\n\nReturns the absolute value of this number.\n\n>     #! example\n>     (-4).abs()\n\nReturns the mathematical ceiling of this number. The number truncated to the\nnearest integer of greater than or equal value.\n\n>     #! example\n>     4.2.ceil()\n\n---\n\n>     #! example\n>     (-1.2).ceil()\n\n---\n\nReturns the mathematical floor of this number. The number truncated to the\nnearest integer of less than or equal value.\n\n>     #! example\n>     4.9.floor()\n\n---\n\n>     #! example\n>     (-1.2).floor()\n\n---\n\nReturns this number rounded to the nearest integer.\n\n>     #! example\n>     4.5.round()\n\n---\n\n>     #! example\n>     4.4.round()\n\n---\n\n    [\n      \"abs\"\n      \"ceil\"\n      \"floor\"\n      \"round\"\n    ].forEach (method) ->\n      Number::[method] = ->\n        Math[method](this)\n\n    {extend} = require \"./util\"\n\n    extend Number.prototype,\n\nGet a bunch of points equally spaced around the unit circle.\n\n      circularPoints: ->\n        n = this\n\n        [0..n].map (i) ->\n          Point.fromAngle (i/n).turns\n\n>     #! example\n>     4.circularPoints()\n\n---\n\nReturns a number whose value is limited to the given range.\n\n      clamp: (min, max) ->\n        if min? and max?\n          Math.min(Math.max(this, min), max)\n        else if min?\n          Math.max(this, min)\n        else if max?\n          Math.min(this, max)\n        else\n          this\n\n>     #! example\n>     512.clamp(0, 255)\n\n---\n\nA mod method useful for array wrapping. The range of the function is\nconstrained to remain in bounds of array indices.\n\n      mod: (base) ->\n        result = this % base;\n\n        if result < 0 && base > 0\n          result += base\n\n        return result\n\n>     #! example\n>     (-1).mod(5)\n\n---\n\nGet the sign of this number as an integer (1, -1, or 0).\n\n      sign: ->\n        if this > 0\n          1\n        else if this < 0\n          -1\n        else\n          0\n\n>     #! example\n>     5.sign()\n\n---\n\nReturns true if this number is even (evenly divisible by 2).\n\n      even: ->\n        @mod(2) is 0\n\n>     #! example\n>     2.even()\n\n---\n\nReturns true if this number is odd (has remainder of 1 when divided by 2).\n\n      odd: ->\n        @mod(2) is 1\n\n>     #! example\n>     3.odd()\n\n---\n\nCalls iterator the specified number of times, passing in the number of the\ncurrent iteration as a parameter: 0 on first call, 1 on the second call, etc.\n\n      times: (iterator, context) ->\n        i = -1\n\n        while ++i < this\n          iterator.call context, i\n\n        return i\n\n>     #! example\n>     output = []\n>\n>     5.times (n) ->\n>       output.push(n)\n>\n>     output\n\n---\n\nReturns the the nearest grid resolution less than or equal to the number.\n\n      snap: (resolution) ->\n        (n / resolution).floor() * resolution\n\n>     #! example\n>     7.snap(8)\n\n---\n\n      truncate: ->\n        if this > 0\n          @floor()\n        else if this < 0\n          @ceil()\n        else\n          this\n\nConvert a number to an amount of rotations.\n\n    unless 5.rotations\n      Object.defineProperty Number::, 'rotations',\n        get: ->\n          this * Math.TAU\n\n    unless 1.rotation\n      Object.defineProperty Number::, 'rotation',\n        get: ->\n          this * Math.TAU\n\n>     #! example\n>     0.5.rotations\n\n---\n\nConvert a number to an amount of rotations.\n\n    unless 5.turns\n      Object.defineProperty Number.prototype, 'turns',\n        get: ->\n          this * Math.TAU\n\n    unless 1.turn\n      Object.defineProperty Number.prototype, 'turn',\n        get: ->\n          this * Math.TAU\n\n>     #! example\n>     0.5.turns\n\n---\n\nConvert a number to an amount of degrees.\n\n    unless 2.degrees\n      Object.defineProperty Number::, 'degrees',\n        get: ->\n          this * Math.TAU / 360\n\n    unless 1.degree\n      Object.defineProperty Number::, 'degree',\n        get: ->\n          this * Math.TAU / 360\n\n>     #! example\n>     180.degrees\n\n---\n\nExtra\n-----\n\nThe mathematical circle constant of 1 turn.\n\n    Math.TAU = 2 * Math.PI\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "version: \"0.2.0\"\nentryPoint: \"extensions\"\n",
                  "type": "blob"
                },
                "string.coffee.md": {
                  "path": "string.coffee.md",
                  "mode": "100644",
                  "content": "String\n======\n\nExtend strings with utility methods.\n\n    {extend} = require \"./util\"\n\n    extend String.prototype,\n\nReturns true if this string only contains whitespace characters.\n\n      blank: ->\n        /^\\s*$/.test(this)\n\n>     #! example\n>     \"   \".blank()\n\n---\n\nParse this string as though it is JSON and return the object it represents. If it\nis not valid JSON returns the string itself.\n\n      parse: () ->\n        try\n          JSON.parse(this.toString())\n        catch e\n          this.toString()\n\n>     #! example\n>     # this is valid json, so an object is returned\n>     '{\"a\": 3}'.parse()\n\n---\n\nReturns true if this string starts with the given string.\n\n      startsWith: (str) ->\n        @lastIndexOf(str, 0) is 0\n\nReturns true if this string ends with the given string.\n\n      endsWith: (str) ->\n        @indexOf(str, @length - str.length) != -1\n\nGet the file extension of a string.\n\n      extension: ->\n        if extension = this.match(/\\.([^\\.]*)$/, '')?.last()\n          extension\n        else\n          ''\n\n>     #! example\n>     \"README.md\".extension()\n\n---\n\nAssumes the string is something like a file name and returns the\ncontents of the string without the extension.\n\n      withoutExtension: ->\n        this.replace(/\\.[^\\.]*$/, '')\n\n      toInt: (base=10) ->\n        parseInt(this, base)\n\n>     #! example\n>     \"neat.png\".witouthExtension()\n\n---\n",
                  "type": "blob"
                },
                "test/array.coffee": {
                  "path": "test/array.coffee",
                  "mode": "100644",
                  "content": "require \"../array\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Array\", ->\n\n  test \"#average\", ->\n    equals [1, 3, 5, 7].average(), 4\n  \n  test \"#compact\", ->\n    a = [0, 1, undefined, 2, null, 3, '', 4]\n  \n    compacted = a.compact()\n  \n    equals(compacted[0], 0)\n    equals(compacted[1], 1)\n    equals(compacted[2], 2)\n    equals(compacted[3], 3)\n    equals(compacted[4], '')\n    equals(compacted[5], 4)\n  \n  test \"#copy\", ->\n    a = [1,2,3]\n    b = a.copy()\n  \n    ok a != b, \"Original array is not the same array as the copied one\"\n    ok a.length == b.length, \"Both arrays are the same size\"\n    ok a[0] == b[0] && a[1] == b[1] && a[2] == b[2], \"The elements of the two arrays are equal\"\n  \n  test \"#flatten\", ->\n    array = [[0,1], [2,3], [4,5]]\n  \n    flattenedArray = array.flatten()\n  \n    equals flattenedArray.length, 6, \"Flattened array length should equal number of elements in sub-arrays\"\n    equals flattenedArray.first(), 0, \"First element should be first element in first sub-array\"\n    equals flattenedArray.last(), 5, \"Last element should be last element in last sub-array\"\n  \n  test \"#rand\", ->\n    array = [1,2,3]\n  \n    ok array.indexOf(array.rand()) != -1, \"Array includes randomly selected element\"\n    ok [5].rand() == 5, \"[5].rand() === 5\"\n    ok [].rand() == undefined, \"[].rand() === undefined\"\n  \n  test \"#remove\", ->\n    equals [1,2,3].remove(2), 2, \"[1,2,3].remove(2) === 2\"\n    equals [1,3].remove(2), undefined, \"[1,3].remove(2) === undefined\"\n    equals [1,3].remove(3), 3, \"[1,3].remove(3) === 3\"\n  \n    array = [1,2,3]\n    array.remove(2)\n    ok array.length == 2, \"array = [1,2,3]; array.remove(2); array.length === 2\"\n    array.remove(3)\n    ok array.length == 1, \"array = [1,3]; array.remove(3); array.length === 1\"\n  \n  test \"#map\", ->\n    equals [1].map((x) -> return x + 1 )[0], 2\n  \n  test \"#invoke\", ->\n    results = ['hello', 'world', 'cool!'].invoke('substring', 0, 3)\n  \n    equals results[0], \"hel\"\n    equals results[1], \"wor\"\n    equals results[2], \"coo\"\n  \n  test \"#each\", ->\n    array = [1, 2, 3]\n    count = 0\n  \n    equals array, array.each -> count++\n    equals array.length, count\n  \n  test \"#eachPair\", ->\n    array = [1, 2, 3]\n    sum = 0\n  \n    array.eachPair (a, b) ->\n      sum += a + b\n  \n    equals(sum, 12)\n  \n  test \"#eachWithObject\", ->\n    array = [1, 2, 3]\n  \n    result = array.eachWithObject {}, (element, hash) ->\n      hash[element] = (element + 1).toString()\n  \n    equals result[1], \"2\"\n    equals result[2], \"3\"\n    equals result[3], \"4\"\n  \n  test \"#shuffle\", ->\n    array = [0, 1, 2, 3, 4, 5]\n  \n    shuffledArray = array.shuffle()\n  \n    shuffledArray.each (element) ->\n      ok array.indexOf(element) >= 0, \"Every element in shuffled array is in orig array\"\n  \n    array.each (element) ->\n      ok shuffledArray.indexOf(element) >= 0, \"Every element in orig array is in shuffled array\"\n  \n  test \"#first\", ->\n    equals [2].first(), 2\n    equals [1, 2, 3].first(), 1\n    equals [].first(), undefined\n  \n  test \"#last\", ->\n    equals [2].last(), 2\n    equals [1, 2, 3].last(), 3\n    equals [].first(), undefined\n  \n  test \"#maxima\", ->\n    maxima = [-52, 0, 78].maxima()\n  \n    maxima.each (n) ->\n      equals n, 78\n  \n    maxima = [0, 0, 1, 0, 1, 0, 1, 0].maxima()\n  \n    equals 3, maxima.length\n  \n    maxima.each (n) ->\n      equals n, 1\n  \n  test \"#maximum\", ->\n    equals [-345, 38, 8347].maximum(), 8347\n  \n  test \"#maximum with function\", ->\n    equals [3, 4, 5].maximum((n) ->\n      n % 4\n    ), 3\n  \n  test \"#minima\", ->\n    minima = [-52, 0, 78].minima()\n  \n    minima.each (n) ->\n      equals n, -52\n  \n    minima = [0, 0, 1, 0, 1, 0, 1, 0].minima()\n  \n    equals 5, minima.length\n  \n    minima.each (n) ->\n      equals n, 0\n  \n  test \"#minimum\", ->\n    equals [-345, 38, 8347].minimum(), -345\n  \n  test \"#pipeline\", ->\n    pipe = [\n      (x) -> x * x\n      (x) -> x - 10\n    ]\n  \n    equals pipe.pipeline(5), 15\n  \n  test \"#extremes\", ->\n    array = [-7, 1, 11, 94]\n  \n    extremes = array.extremes()\n  \n    equals extremes.min, -7, \"Min is -7\"\n    equals extremes.max, 94, \"Max is 94\"\n  \n  test \"#extremes with fn\", ->\n    array = [1, 11, 94]\n\n    extremes = array.extremes (value) ->\n      value % 11\n\n    equals extremes.min, 11, extremes.min\n    equals extremes.max, 94, extremes.max\n\n  test \"#sum\", ->\n    equals [].sum(), 0, \"Empty array sums to zero\"\n    equals [2].sum(), 2, \"[2] sums to 2\"\n    equals [1, 2, 3, 4, 5].sum(), 15, \"[1, 2, 3, 4, 5] sums to 15\"\n  \n  test \"#eachSlice\", ->\n    [1, 2, 3, 4, 5, 6].eachSlice 2, (array) ->\n      equals array[0] % 2, 1\n      equals array[1] % 2, 0\n  \n  test \"#without\", ->\n    array = [1, 2, 3, 4]\n  \n    excluded = array.without([2, 4])\n  \n    equals excluded[0], 1\n    equals excluded[1], 3\n  \n  test \"#clear\", ->\n    array = [1, 2, 3, 4]\n  \n    equals array.length, 4\n    equals array[0], 1\n  \n    array.clear()\n  \n    equals array.length, 0\n    equals array[0], undefined\n  \n  test \"#unique\", ->\n    array = [0, 0, 0, 1, 1, 1, 2, 3]\n  \n    equals array.unique().first(), 0\n    equals array.unique().last(), 3\n    equals array.unique().length, 4\n  \n  test \"#wrap\", ->\n    array = [0, 1, 2, 3, 4]\n  \n    equals array.wrap(0), 0\n    equals array.wrap(-1), 4\n    equals array.wrap(2), 2\n  \n  test \"#zip\", ->\n    a = [1, 2, 3]\n    b = [4, 5, 6]\n    c = [7, 8]\n  \n    output = a.zip(b, c)\n  \n    equals output[0][0], 1\n    equals output[0][1], 4\n    equals output[0][2], 7\n  \n    equals output[2][2], undefined\n",
                  "type": "blob"
                },
                "test/function.coffee": {
                  "path": "test/function.coffee",
                  "mode": "100644",
                  "content": "require \"../function\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Function\", ->\n\n  test \"#once\", ->\n    score = 0\n  \n    addScore = ->\n      score += 100\n  \n    onceScore = addScore.once()\n  \n    [0..9].map ->\n      onceScore()\n  \n    equals score, 100\n  \n  test \".identity\", ->\n    I = Function.identity\n  \n    [0, 1, true, false, null, undefined].each (x) ->\n      equals I(x), x\n  \n  test \"#debounce\", (done) ->\n    fn = (-> ok true; done()).debounce(1)\n  \n    # Though called multiple times the function is only triggered once\n    fn()\n    fn()\n    fn()\n  \n  test \"#delay\", (done) ->\n    fn = (x, y) ->\n      equals x, 3\n      equals y, \"testy\"\n      done()\n  \n    fn.delay 25, 3, \"testy\"\n  \n  test \"#defer\", (done) ->\n    fn = (x) ->\n      equals x, 3\n      done()\n  \n    fn.defer 3\n",
                  "type": "blob"
                },
                "test/number.coffee": {
                  "path": "test/number.coffee",
                  "mode": "100644",
                  "content": "require \"../number\"\n\nok = assert\nequals = assert.equal\ntest = it\n\nequalEnough = (expected, actual, tolerance, message) ->\n  message ||= \"#{expected} within #{tolerance} of #{actual}\"\n\n  ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n  \ndescribe \"Number\", ->\n  \n  test \"#abs\", ->\n    equals 5.abs(), 5, \"(5).abs() equals 5\"\n    equals 4.2.abs(), 4.2, \"(4.2).abs() equals 4.2\"\n    equals (-1.2).abs(), 1.2, \"(-1.2).abs() equals 1.2\"\n    equals 0.abs(), 0, \"(0).abs() equals 0\"\n  \n  test \"#ceil\", ->\n    equals 4.9.ceil(), 5, \"(4.9).floor() equals 5\"\n    equals 4.2.ceil(), 5, \"(4.2).ceil() equals 5\"\n    equals (-1.2).ceil(), -1, \"(-1.2).ceil() equals -1\"\n    equals 3.ceil(), 3, \"(3).ceil() equals 3\"\n  \n  test \"#clamp\", ->\n    equals 5.clamp(0, 3), 3\n    equals 5.clamp(-1, 0), 0\n    equals (-5).clamp(0, 1), 0\n    equals 1.clamp(0, null), 1\n    equals (-1).clamp(0, null), 0\n    equals (-10).clamp(-5, 0), -5\n    equals (-10).clamp(null, 0), -10\n    equals 50.clamp(null, 10), 10\n  \n  test \"#floor\", ->\n    equals 4.9.floor(), 4, \"(4.9).floor() equals 4\"\n    equals 4.2.floor(), 4, \"(4.2).floor() equals 4\"\n    equals (-1.2).floor(), -2, \"(-1.2).floor() equals -2\"\n    equals 3.floor(), 3, \"(3).floor() equals 3\"\n  \n  test \"#round\", ->\n    equals 4.5.round(), 5, \"(4.5).round() equals 5\"\n    equals 4.4.round(), 4, \"(4.4).round() equals 4\"\n  \n  test \"#sign\", ->\n    equals 5.sign(), 1, \"Positive number's sign is 1\"\n    equals (-3).sign(), -1, \"Negative number's sign is -1\"\n    equals 0.sign(), 0, \"Zero's sign is 0\"\n  \n  test \"#even\", ->\n    [0, 2, -32].each (n) ->\n      ok n.even(), \"#{n} is even\"\n  \n    [1, -1, 2.2, -3.784].each (n) ->\n      equals n.even(), false, \"#{n} is not even\"\n  \n  test \"#odd\", ->\n    [1, 9, -37].each (n) ->\n      ok n.odd(), \"#{n} is odd\"\n  \n    [0, 32, 2.2, -1.1].each (n) ->\n      equals n.odd(), false, \"#{n} is not odd\"\n  \n  test \"#times\", ->\n    n = 5\n    equals n.times(->), n, \"returns n\"\n  \n  test \"#times called correct amount\", ->\n    n = 5\n    count = 0\n  \n    n.times -> count++\n  \n    equals n, count, \"returns n\"\n  \n  test \"#mod should have a positive result when used with a positive base and a negative number\", ->\n    n = -3\n  \n    equals n.mod(8), 5, \"Should 'wrap' and be positive.\"\n  \n  test \"#degrees\", ->\n    equals 180.degrees, Math.PI\n    equals 1.degree, Math.TAU / 360\n  \n  test \"#rotations\", ->\n    equals 1.rotation, Math.TAU\n    equals 0.5.rotations, Math.TAU / 2\n  \n  test \"#turns\", ->\n    equals 1.turn, Math.TAU\n    equals 0.5.turns, Math.TAU / 2\n",
                  "type": "blob"
                },
                "test/string.coffee": {
                  "path": "test/string.coffee",
                  "mode": "100644",
                  "content": "require \"../string\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"String\", ->\n  \n  test \"#blank\", ->\n    equals \"  \".blank(), true, \"A string containing only whitespace should be blank\"\n    equals \"a\".blank(), false, \"A string that contains a letter should not be blank\"\n    equals \"  a \".blank(), false\n    equals \"  \\n\\t \".blank(), true\n  \n  test \"#extension\", ->\n    equals \"README\".extension(), \"\"\n    equals \"README.md\".extension(), \"md\"\n    equals \"jquery.min.js\".extension(), \"js\"\n    equals \"src/bouse.js.coffee\".extension(), \"coffee\"\n  \n  test \"#parse\", ->\n    equals \"true\".parse(), true, \"parsing 'true' should equal boolean true\"\n    equals \"false\".parse(), false, \"parsing 'true' should equal boolean true\"\n    equals \"7.2\".parse(), 7.2, \"numbers should be cool too\"\n  \n    equals '{\"val\": \"a string\"}'.parse().val, \"a string\", \"even parsing objects works\"\n  \n    ok ''.parse() == '', \"Empty string parses to exactly the empty string\"\n  \n  test \"#startsWith\", ->\n    ok \"cool\".startsWith(\"coo\")\n    equals \"cool\".startsWith(\"oo\"), false\n  \n  test \"#toInt\", ->\n    equals \"31.3\".toInt(), 31\n    equals \"31.\".toInt(), 31\n    equals \"-1.02\".toInt(), -1\n  \n    equals \"009\".toInt(), 9\n    equals \"0109\".toInt(), 109\n  \n    equals \"F\".toInt(16), 15\n  \n  test \"#withoutExtension\", ->\n    equals \"neat.png\".withoutExtension(), \"neat\"\n    equals \"not a file\".withoutExtension(), \"not a file\"\n",
                  "type": "blob"
                },
                "util.coffee.md": {
                  "path": "util.coffee.md",
                  "mode": "100644",
                  "content": "Util\n====\n\nUtility methods shared in our extensions.\n\n    module.exports =\n\nExtend an object with the properties of other objects.\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "array": {
                  "path": "array",
                  "content": "(function() {\n  var extend, identity, mod, rand,\n    __slice = [].slice;\n\n  extend = require(\"./util\").extend;\n\n  extend(Array.prototype, {\n    average: function() {\n      return this.sum() / this.length;\n    },\n    compact: function() {\n      return this.select(function(element) {\n        return element != null;\n      });\n    },\n    copy: function() {\n      return this.concat();\n    },\n    clear: function() {\n      this.length = 0;\n      return this;\n    },\n    flatten: function() {\n      return this.inject([], function(a, b) {\n        return a.concat(b);\n      });\n    },\n    invoke: function() {\n      var args, method;\n      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      return this.map(function(element) {\n        return element[method].apply(element, args);\n      });\n    },\n    rand: function() {\n      return this[rand(this.length)];\n    },\n    remove: function(object) {\n      var index;\n      index = this.indexOf(object);\n      if (index >= 0) {\n        return this.splice(index, 1)[0];\n      } else {\n        return void 0;\n      }\n    },\n    include: function(element) {\n      return this.indexOf(element) !== -1;\n    },\n    each: function(iterator, context) {\n      var element, i, _i, _len;\n      if (this.forEach) {\n        this.forEach(iterator, context);\n      } else {\n        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {\n          element = this[i];\n          iterator.call(context, element, i, this);\n        }\n      }\n      return this;\n    },\n    eachPair: function(iterator, context) {\n      var a, b, i, j, length, _results;\n      length = this.length;\n      i = 0;\n      _results = [];\n      while (i < length) {\n        a = this[i];\n        j = i + 1;\n        i += 1;\n        _results.push((function() {\n          var _results1;\n          _results1 = [];\n          while (j < length) {\n            b = this[j];\n            j += 1;\n            _results1.push(iterator.call(context, a, b));\n          }\n          return _results1;\n        }).call(this));\n      }\n      return _results;\n    },\n    eachWithObject: function(object, iterator, context) {\n      this.each(function(element, i, self) {\n        return iterator.call(context, element, object, i, self);\n      });\n      return object;\n    },\n    eachSlice: function(n, iterator, context) {\n      var i, len;\n      len = this.length / n;\n      i = -1;\n      while (++i < len) {\n        iterator.call(context, this.slice(i * n, (i + 1) * n), i * n, this);\n      }\n      return this;\n    },\n    pipeline: function(input) {\n      return this.inject(input, function(input, fn) {\n        return fn(input);\n      });\n    },\n    shuffle: function() {\n      var shuffledArray;\n      shuffledArray = [];\n      this.each(function(element) {\n        return shuffledArray.splice(rand(shuffledArray.length + 1), 0, element);\n      });\n      return shuffledArray;\n    },\n    first: function() {\n      return this[0];\n    },\n    last: function() {\n      return this[this.length - 1];\n    },\n    extremes: function(fn) {\n      var max, maxResult, min, minResult;\n      if (fn == null) {\n        fn = identity;\n      }\n      min = max = void 0;\n      minResult = maxResult = void 0;\n      this.each(function(object) {\n        var result;\n        result = fn(object);\n        if (min != null) {\n          if (result < minResult) {\n            min = object;\n            minResult = result;\n          }\n        } else {\n          min = object;\n          minResult = result;\n        }\n        if (max != null) {\n          if (result > maxResult) {\n            max = object;\n            return maxResult = result;\n          }\n        } else {\n          max = object;\n          return maxResult = result;\n        }\n      });\n      return {\n        min: min,\n        max: max\n      };\n    },\n    maxima: function(valueFunction) {\n      if (valueFunction == null) {\n        valueFunction = identity;\n      }\n      return this.inject([-Infinity, []], function(memo, item) {\n        var maxItems, maxValue, value;\n        value = valueFunction(item);\n        maxValue = memo[0], maxItems = memo[1];\n        if (value > maxValue) {\n          return [value, [item]];\n        } else if (value === maxValue) {\n          return [value, maxItems.concat(item)];\n        } else {\n          return memo;\n        }\n      }).last();\n    },\n    maximum: function(valueFunction) {\n      return this.maxima(valueFunction).first();\n    },\n    minima: function(valueFunction) {\n      var inverseFn;\n      if (valueFunction == null) {\n        valueFunction = identity;\n      }\n      inverseFn = function(x) {\n        return -valueFunction(x);\n      };\n      return this.maxima(inverseFn);\n    },\n    minimum: function(valueFunction) {\n      return this.minima(valueFunction).first();\n    },\n    wrap: function(start, length) {\n      var end, i, result;\n      if (length != null) {\n        end = start + length;\n        i = start;\n        result = [];\n        while (i < end) {\n          result.push(this[mod(i, this.length)]);\n          i += 1;\n        }\n        return result;\n      } else {\n        return this[mod(start, this.length)];\n      }\n    },\n    partition: function(iterator, context) {\n      var falseCollection, trueCollection;\n      trueCollection = [];\n      falseCollection = [];\n      this.each(function(element) {\n        if (iterator.call(context, element)) {\n          return trueCollection.push(element);\n        } else {\n          return falseCollection.push(element);\n        }\n      });\n      return [trueCollection, falseCollection];\n    },\n    select: function(iterator, context) {\n      return this.partition(iterator, context)[0];\n    },\n    without: function(values) {\n      return this.reject(function(element) {\n        return values.include(element);\n      });\n    },\n    reject: function(iterator, context) {\n      return this.partition(iterator, context)[1];\n    },\n    inject: function(initial, iterator) {\n      this.each(function(element) {\n        return initial = iterator(initial, element);\n      });\n      return initial;\n    },\n    sum: function() {\n      return this.inject(0, function(sum, n) {\n        return sum + n;\n      });\n    },\n    product: function() {\n      return this.inject(1, function(product, n) {\n        return product * n;\n      });\n    },\n    unique: function() {\n      return this.inject([], function(results, element) {\n        if (results.indexOf(element) === -1) {\n          results.push(element);\n        }\n        return results;\n      });\n    },\n    zip: function() {\n      var args;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return this.map(function(element, index) {\n        var output;\n        output = args.map(function(arr) {\n          return arr[index];\n        });\n        output.unshift(element);\n        return output;\n      });\n    }\n  });\n\n  identity = function(x) {\n    return x;\n  };\n\n  rand = function(n) {\n    return Math.floor(n * Math.random());\n  };\n\n  mod = function(n, base) {\n    var result;\n    result = n % base;\n    if (result < 0 && base > 0) {\n      result += base;\n    }\n    return result;\n  };\n\n}).call(this);\n\n//# sourceURL=array.coffee",
                  "type": "blob"
                },
                "extensions": {
                  "path": "extensions",
                  "content": "(function() {\n  require(\"./array\");\n\n  require(\"./function\");\n\n  require(\"./number\");\n\n  require(\"./string\");\n\n}).call(this);\n\n//# sourceURL=extensions.coffee",
                  "type": "blob"
                },
                "function": {
                  "path": "function",
                  "content": "(function() {\n  var extend,\n    __slice = [].slice;\n\n  extend = require(\"./util\").extend;\n\n  extend(Function.prototype, {\n    once: function() {\n      var func, memo, ran;\n      func = this;\n      ran = false;\n      memo = void 0;\n      return function() {\n        if (ran) {\n          return memo;\n        }\n        ran = true;\n        return memo = func.apply(this, arguments);\n      };\n    },\n    debounce: function(wait) {\n      var func, timeout;\n      timeout = null;\n      func = this;\n      return function() {\n        var args, context, later;\n        context = this;\n        args = arguments;\n        later = function() {\n          timeout = null;\n          return func.apply(context, args);\n        };\n        clearTimeout(timeout);\n        return timeout = setTimeout(later, wait);\n      };\n    },\n    delay: function() {\n      var args, func, wait;\n      wait = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      func = this;\n      return setTimeout(function() {\n        return func.apply(null, args);\n      }, wait);\n    },\n    defer: function() {\n      var args;\n      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return this.delay.apply(this, [1].concat(args));\n    }\n  });\n\n  extend(Function, {\n    identity: function(x) {\n      return x;\n    },\n    noop: function() {}\n  });\n\n}).call(this);\n\n//# sourceURL=function.coffee",
                  "type": "blob"
                },
                "number": {
                  "path": "number",
                  "content": "(function() {\n  var extend;\n\n  [\"abs\", \"ceil\", \"floor\", \"round\"].forEach(function(method) {\n    return Number.prototype[method] = function() {\n      return Math[method](this);\n    };\n  });\n\n  extend = require(\"./util\").extend;\n\n  extend(Number.prototype, {\n    circularPoints: function() {\n      var n, _i, _results;\n      n = this;\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= n ? _i <= n : _i >= n; 0 <= n ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).map(function(i) {\n        return Point.fromAngle((i / n).turns);\n      });\n    },\n    clamp: function(min, max) {\n      if ((min != null) && (max != null)) {\n        return Math.min(Math.max(this, min), max);\n      } else if (min != null) {\n        return Math.max(this, min);\n      } else if (max != null) {\n        return Math.min(this, max);\n      } else {\n        return this;\n      }\n    },\n    mod: function(base) {\n      var result;\n      result = this % base;\n      if (result < 0 && base > 0) {\n        result += base;\n      }\n      return result;\n    },\n    sign: function() {\n      if (this > 0) {\n        return 1;\n      } else if (this < 0) {\n        return -1;\n      } else {\n        return 0;\n      }\n    },\n    even: function() {\n      return this.mod(2) === 0;\n    },\n    odd: function() {\n      return this.mod(2) === 1;\n    },\n    times: function(iterator, context) {\n      var i;\n      i = -1;\n      while (++i < this) {\n        iterator.call(context, i);\n      }\n      return i;\n    },\n    snap: function(resolution) {\n      return (n / resolution).floor() * resolution;\n    },\n    truncate: function() {\n      if (this > 0) {\n        return this.floor();\n      } else if (this < 0) {\n        return this.ceil();\n      } else {\n        return this;\n      }\n    }\n  });\n\n  if (!5..rotations) {\n    Object.defineProperty(Number.prototype, 'rotations', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!1..rotation) {\n    Object.defineProperty(Number.prototype, 'rotation', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!5..turns) {\n    Object.defineProperty(Number.prototype, 'turns', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!1..turn) {\n    Object.defineProperty(Number.prototype, 'turn', {\n      get: function() {\n        return this * Math.TAU;\n      }\n    });\n  }\n\n  if (!2..degrees) {\n    Object.defineProperty(Number.prototype, 'degrees', {\n      get: function() {\n        return this * Math.TAU / 360;\n      }\n    });\n  }\n\n  if (!1..degree) {\n    Object.defineProperty(Number.prototype, 'degree', {\n      get: function() {\n        return this * Math.TAU / 360;\n      }\n    });\n  }\n\n  Math.TAU = 2 * Math.PI;\n\n}).call(this);\n\n//# sourceURL=number.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"version\":\"0.2.0\",\"entryPoint\":\"extensions\"};",
                  "type": "blob"
                },
                "string": {
                  "path": "string",
                  "content": "(function() {\n  var extend;\n\n  extend = require(\"./util\").extend;\n\n  extend(String.prototype, {\n    blank: function() {\n      return /^\\s*$/.test(this);\n    },\n    parse: function() {\n      var e;\n      try {\n        return JSON.parse(this.toString());\n      } catch (_error) {\n        e = _error;\n        return this.toString();\n      }\n    },\n    startsWith: function(str) {\n      return this.lastIndexOf(str, 0) === 0;\n    },\n    endsWith: function(str) {\n      return this.indexOf(str, this.length - str.length) !== -1;\n    },\n    extension: function() {\n      var extension, _ref;\n      if (extension = (_ref = this.match(/\\.([^\\.]*)$/, '')) != null ? _ref.last() : void 0) {\n        return extension;\n      } else {\n        return '';\n      }\n    },\n    withoutExtension: function() {\n      return this.replace(/\\.[^\\.]*$/, '');\n    },\n    toInt: function(base) {\n      if (base == null) {\n        base = 10;\n      }\n      return parseInt(this, base);\n    }\n  });\n\n}).call(this);\n\n//# sourceURL=string.coffee",
                  "type": "blob"
                },
                "test/array": {
                  "path": "test/array",
                  "content": "(function() {\n  var equals, ok, test;\n\n  require(\"../array\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Array\", function() {\n    test(\"#average\", function() {\n      return equals([1, 3, 5, 7].average(), 4);\n    });\n    test(\"#compact\", function() {\n      var a, compacted;\n      a = [0, 1, void 0, 2, null, 3, '', 4];\n      compacted = a.compact();\n      equals(compacted[0], 0);\n      equals(compacted[1], 1);\n      equals(compacted[2], 2);\n      equals(compacted[3], 3);\n      equals(compacted[4], '');\n      return equals(compacted[5], 4);\n    });\n    test(\"#copy\", function() {\n      var a, b;\n      a = [1, 2, 3];\n      b = a.copy();\n      ok(a !== b, \"Original array is not the same array as the copied one\");\n      ok(a.length === b.length, \"Both arrays are the same size\");\n      return ok(a[0] === b[0] && a[1] === b[1] && a[2] === b[2], \"The elements of the two arrays are equal\");\n    });\n    test(\"#flatten\", function() {\n      var array, flattenedArray;\n      array = [[0, 1], [2, 3], [4, 5]];\n      flattenedArray = array.flatten();\n      equals(flattenedArray.length, 6, \"Flattened array length should equal number of elements in sub-arrays\");\n      equals(flattenedArray.first(), 0, \"First element should be first element in first sub-array\");\n      return equals(flattenedArray.last(), 5, \"Last element should be last element in last sub-array\");\n    });\n    test(\"#rand\", function() {\n      var array;\n      array = [1, 2, 3];\n      ok(array.indexOf(array.rand()) !== -1, \"Array includes randomly selected element\");\n      ok([5].rand() === 5, \"[5].rand() === 5\");\n      return ok([].rand() === void 0, \"[].rand() === undefined\");\n    });\n    test(\"#remove\", function() {\n      var array;\n      equals([1, 2, 3].remove(2), 2, \"[1,2,3].remove(2) === 2\");\n      equals([1, 3].remove(2), void 0, \"[1,3].remove(2) === undefined\");\n      equals([1, 3].remove(3), 3, \"[1,3].remove(3) === 3\");\n      array = [1, 2, 3];\n      array.remove(2);\n      ok(array.length === 2, \"array = [1,2,3]; array.remove(2); array.length === 2\");\n      array.remove(3);\n      return ok(array.length === 1, \"array = [1,3]; array.remove(3); array.length === 1\");\n    });\n    test(\"#map\", function() {\n      return equals([1].map(function(x) {\n        return x + 1;\n      })[0], 2);\n    });\n    test(\"#invoke\", function() {\n      var results;\n      results = ['hello', 'world', 'cool!'].invoke('substring', 0, 3);\n      equals(results[0], \"hel\");\n      equals(results[1], \"wor\");\n      return equals(results[2], \"coo\");\n    });\n    test(\"#each\", function() {\n      var array, count;\n      array = [1, 2, 3];\n      count = 0;\n      equals(array, array.each(function() {\n        return count++;\n      }));\n      return equals(array.length, count);\n    });\n    test(\"#eachPair\", function() {\n      var array, sum;\n      array = [1, 2, 3];\n      sum = 0;\n      array.eachPair(function(a, b) {\n        return sum += a + b;\n      });\n      return equals(sum, 12);\n    });\n    test(\"#eachWithObject\", function() {\n      var array, result;\n      array = [1, 2, 3];\n      result = array.eachWithObject({}, function(element, hash) {\n        return hash[element] = (element + 1).toString();\n      });\n      equals(result[1], \"2\");\n      equals(result[2], \"3\");\n      return equals(result[3], \"4\");\n    });\n    test(\"#shuffle\", function() {\n      var array, shuffledArray;\n      array = [0, 1, 2, 3, 4, 5];\n      shuffledArray = array.shuffle();\n      shuffledArray.each(function(element) {\n        return ok(array.indexOf(element) >= 0, \"Every element in shuffled array is in orig array\");\n      });\n      return array.each(function(element) {\n        return ok(shuffledArray.indexOf(element) >= 0, \"Every element in orig array is in shuffled array\");\n      });\n    });\n    test(\"#first\", function() {\n      equals([2].first(), 2);\n      equals([1, 2, 3].first(), 1);\n      return equals([].first(), void 0);\n    });\n    test(\"#last\", function() {\n      equals([2].last(), 2);\n      equals([1, 2, 3].last(), 3);\n      return equals([].first(), void 0);\n    });\n    test(\"#maxima\", function() {\n      var maxima;\n      maxima = [-52, 0, 78].maxima();\n      maxima.each(function(n) {\n        return equals(n, 78);\n      });\n      maxima = [0, 0, 1, 0, 1, 0, 1, 0].maxima();\n      equals(3, maxima.length);\n      return maxima.each(function(n) {\n        return equals(n, 1);\n      });\n    });\n    test(\"#maximum\", function() {\n      return equals([-345, 38, 8347].maximum(), 8347);\n    });\n    test(\"#maximum with function\", function() {\n      return equals([3, 4, 5].maximum(function(n) {\n        return n % 4;\n      }), 3);\n    });\n    test(\"#minima\", function() {\n      var minima;\n      minima = [-52, 0, 78].minima();\n      minima.each(function(n) {\n        return equals(n, -52);\n      });\n      minima = [0, 0, 1, 0, 1, 0, 1, 0].minima();\n      equals(5, minima.length);\n      return minima.each(function(n) {\n        return equals(n, 0);\n      });\n    });\n    test(\"#minimum\", function() {\n      return equals([-345, 38, 8347].minimum(), -345);\n    });\n    test(\"#pipeline\", function() {\n      var pipe;\n      pipe = [\n        function(x) {\n          return x * x;\n        }, function(x) {\n          return x - 10;\n        }\n      ];\n      return equals(pipe.pipeline(5), 15);\n    });\n    test(\"#extremes\", function() {\n      var array, extremes;\n      array = [-7, 1, 11, 94];\n      extremes = array.extremes();\n      equals(extremes.min, -7, \"Min is -7\");\n      return equals(extremes.max, 94, \"Max is 94\");\n    });\n    test(\"#extremes with fn\", function() {\n      var array, extremes;\n      array = [1, 11, 94];\n      extremes = array.extremes(function(value) {\n        return value % 11;\n      });\n      equals(extremes.min, 11, extremes.min);\n      return equals(extremes.max, 94, extremes.max);\n    });\n    test(\"#sum\", function() {\n      equals([].sum(), 0, \"Empty array sums to zero\");\n      equals([2].sum(), 2, \"[2] sums to 2\");\n      return equals([1, 2, 3, 4, 5].sum(), 15, \"[1, 2, 3, 4, 5] sums to 15\");\n    });\n    test(\"#eachSlice\", function() {\n      return [1, 2, 3, 4, 5, 6].eachSlice(2, function(array) {\n        equals(array[0] % 2, 1);\n        return equals(array[1] % 2, 0);\n      });\n    });\n    test(\"#without\", function() {\n      var array, excluded;\n      array = [1, 2, 3, 4];\n      excluded = array.without([2, 4]);\n      equals(excluded[0], 1);\n      return equals(excluded[1], 3);\n    });\n    test(\"#clear\", function() {\n      var array;\n      array = [1, 2, 3, 4];\n      equals(array.length, 4);\n      equals(array[0], 1);\n      array.clear();\n      equals(array.length, 0);\n      return equals(array[0], void 0);\n    });\n    test(\"#unique\", function() {\n      var array;\n      array = [0, 0, 0, 1, 1, 1, 2, 3];\n      equals(array.unique().first(), 0);\n      equals(array.unique().last(), 3);\n      return equals(array.unique().length, 4);\n    });\n    test(\"#wrap\", function() {\n      var array;\n      array = [0, 1, 2, 3, 4];\n      equals(array.wrap(0), 0);\n      equals(array.wrap(-1), 4);\n      return equals(array.wrap(2), 2);\n    });\n    return test(\"#zip\", function() {\n      var a, b, c, output;\n      a = [1, 2, 3];\n      b = [4, 5, 6];\n      c = [7, 8];\n      output = a.zip(b, c);\n      equals(output[0][0], 1);\n      equals(output[0][1], 4);\n      equals(output[0][2], 7);\n      return equals(output[2][2], void 0);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/array.coffee",
                  "type": "blob"
                },
                "test/function": {
                  "path": "test/function",
                  "content": "(function() {\n  var equals, ok, test;\n\n  require(\"../function\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Function\", function() {\n    test(\"#once\", function() {\n      var addScore, onceScore, score;\n      score = 0;\n      addScore = function() {\n        return score += 100;\n      };\n      onceScore = addScore.once();\n      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function() {\n        return onceScore();\n      });\n      return equals(score, 100);\n    });\n    test(\".identity\", function() {\n      var I;\n      I = Function.identity;\n      return [0, 1, true, false, null, void 0].each(function(x) {\n        return equals(I(x), x);\n      });\n    });\n    test(\"#debounce\", function(done) {\n      var fn;\n      fn = (function() {\n        ok(true);\n        return done();\n      }).debounce(1);\n      fn();\n      fn();\n      return fn();\n    });\n    test(\"#delay\", function(done) {\n      var fn;\n      fn = function(x, y) {\n        equals(x, 3);\n        equals(y, \"testy\");\n        return done();\n      };\n      return fn.delay(25, 3, \"testy\");\n    });\n    return test(\"#defer\", function(done) {\n      var fn;\n      fn = function(x) {\n        equals(x, 3);\n        return done();\n      };\n      return fn.defer(3);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/function.coffee",
                  "type": "blob"
                },
                "test/number": {
                  "path": "test/number",
                  "content": "(function() {\n  var equalEnough, equals, ok, test;\n\n  require(\"../number\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  equalEnough = function(expected, actual, tolerance, message) {\n    message || (message = \"\" + expected + \" within \" + tolerance + \" of \" + actual);\n    return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);\n  };\n\n  describe(\"Number\", function() {\n    test(\"#abs\", function() {\n      equals(5..abs(), 5, \"(5).abs() equals 5\");\n      equals(4.2.abs(), 4.2, \"(4.2).abs() equals 4.2\");\n      equals((-1.2).abs(), 1.2, \"(-1.2).abs() equals 1.2\");\n      return equals(0..abs(), 0, \"(0).abs() equals 0\");\n    });\n    test(\"#ceil\", function() {\n      equals(4.9.ceil(), 5, \"(4.9).floor() equals 5\");\n      equals(4.2.ceil(), 5, \"(4.2).ceil() equals 5\");\n      equals((-1.2).ceil(), -1, \"(-1.2).ceil() equals -1\");\n      return equals(3..ceil(), 3, \"(3).ceil() equals 3\");\n    });\n    test(\"#clamp\", function() {\n      equals(5..clamp(0, 3), 3);\n      equals(5..clamp(-1, 0), 0);\n      equals((-5).clamp(0, 1), 0);\n      equals(1..clamp(0, null), 1);\n      equals((-1).clamp(0, null), 0);\n      equals((-10).clamp(-5, 0), -5);\n      equals((-10).clamp(null, 0), -10);\n      return equals(50..clamp(null, 10), 10);\n    });\n    test(\"#floor\", function() {\n      equals(4.9.floor(), 4, \"(4.9).floor() equals 4\");\n      equals(4.2.floor(), 4, \"(4.2).floor() equals 4\");\n      equals((-1.2).floor(), -2, \"(-1.2).floor() equals -2\");\n      return equals(3..floor(), 3, \"(3).floor() equals 3\");\n    });\n    test(\"#round\", function() {\n      equals(4.5.round(), 5, \"(4.5).round() equals 5\");\n      return equals(4.4.round(), 4, \"(4.4).round() equals 4\");\n    });\n    test(\"#sign\", function() {\n      equals(5..sign(), 1, \"Positive number's sign is 1\");\n      equals((-3).sign(), -1, \"Negative number's sign is -1\");\n      return equals(0..sign(), 0, \"Zero's sign is 0\");\n    });\n    test(\"#even\", function() {\n      [0, 2, -32].each(function(n) {\n        return ok(n.even(), \"\" + n + \" is even\");\n      });\n      return [1, -1, 2.2, -3.784].each(function(n) {\n        return equals(n.even(), false, \"\" + n + \" is not even\");\n      });\n    });\n    test(\"#odd\", function() {\n      [1, 9, -37].each(function(n) {\n        return ok(n.odd(), \"\" + n + \" is odd\");\n      });\n      return [0, 32, 2.2, -1.1].each(function(n) {\n        return equals(n.odd(), false, \"\" + n + \" is not odd\");\n      });\n    });\n    test(\"#times\", function() {\n      var n;\n      n = 5;\n      return equals(n.times(function() {}), n, \"returns n\");\n    });\n    test(\"#times called correct amount\", function() {\n      var count, n;\n      n = 5;\n      count = 0;\n      n.times(function() {\n        return count++;\n      });\n      return equals(n, count, \"returns n\");\n    });\n    test(\"#mod should have a positive result when used with a positive base and a negative number\", function() {\n      var n;\n      n = -3;\n      return equals(n.mod(8), 5, \"Should 'wrap' and be positive.\");\n    });\n    test(\"#degrees\", function() {\n      equals(180..degrees, Math.PI);\n      return equals(1..degree, Math.TAU / 360);\n    });\n    test(\"#rotations\", function() {\n      equals(1..rotation, Math.TAU);\n      return equals(0.5.rotations, Math.TAU / 2);\n    });\n    return test(\"#turns\", function() {\n      equals(1..turn, Math.TAU);\n      return equals(0.5.turns, Math.TAU / 2);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/number.coffee",
                  "type": "blob"
                },
                "test/string": {
                  "path": "test/string",
                  "content": "(function() {\n  var equals, ok, test;\n\n  require(\"../string\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"String\", function() {\n    test(\"#blank\", function() {\n      equals(\"  \".blank(), true, \"A string containing only whitespace should be blank\");\n      equals(\"a\".blank(), false, \"A string that contains a letter should not be blank\");\n      equals(\"  a \".blank(), false);\n      return equals(\"  \\n\\t \".blank(), true);\n    });\n    test(\"#extension\", function() {\n      equals(\"README\".extension(), \"\");\n      equals(\"README.md\".extension(), \"md\");\n      equals(\"jquery.min.js\".extension(), \"js\");\n      return equals(\"src/bouse.js.coffee\".extension(), \"coffee\");\n    });\n    test(\"#parse\", function() {\n      equals(\"true\".parse(), true, \"parsing 'true' should equal boolean true\");\n      equals(\"false\".parse(), false, \"parsing 'true' should equal boolean true\");\n      equals(\"7.2\".parse(), 7.2, \"numbers should be cool too\");\n      equals('{\"val\": \"a string\"}'.parse().val, \"a string\", \"even parsing objects works\");\n      return ok(''.parse() === '', \"Empty string parses to exactly the empty string\");\n    });\n    test(\"#startsWith\", function() {\n      ok(\"cool\".startsWith(\"coo\"));\n      return equals(\"cool\".startsWith(\"oo\"), false);\n    });\n    test(\"#toInt\", function() {\n      equals(\"31.3\".toInt(), 31);\n      equals(\"31.\".toInt(), 31);\n      equals(\"-1.02\".toInt(), -1);\n      equals(\"009\".toInt(), 9);\n      equals(\"0109\".toInt(), 109);\n      return equals(\"F\".toInt(16), 15);\n    });\n    return test(\"#withoutExtension\", function() {\n      equals(\"neat.png\".withoutExtension(), \"neat\");\n      return equals(\"not a file\".withoutExtension(), \"not a file\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/string.coffee",
                  "type": "blob"
                },
                "util": {
                  "path": "util",
                  "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n\n//# sourceURL=util.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.2.0",
              "entryPoint": "extensions",
              "repository": {
                "id": 13577503,
                "name": "extensions",
                "full_name": "distri/extensions",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/extensions",
                "description": "",
                "fork": false,
                "url": "https://api.github.com/repos/distri/extensions",
                "forks_url": "https://api.github.com/repos/distri/extensions/forks",
                "keys_url": "https://api.github.com/repos/distri/extensions/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/extensions/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/extensions/teams",
                "hooks_url": "https://api.github.com/repos/distri/extensions/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/extensions/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/extensions/events",
                "assignees_url": "https://api.github.com/repos/distri/extensions/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/extensions/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/extensions/tags",
                "blobs_url": "https://api.github.com/repos/distri/extensions/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/extensions/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/extensions/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/extensions/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/extensions/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/extensions/languages",
                "stargazers_url": "https://api.github.com/repos/distri/extensions/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/extensions/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/extensions/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/extensions/subscription",
                "commits_url": "https://api.github.com/repos/distri/extensions/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/extensions/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/extensions/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/extensions/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/extensions/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/extensions/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/extensions/merges",
                "archive_url": "https://api.github.com/repos/distri/extensions/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/extensions/downloads",
                "issues_url": "https://api.github.com/repos/distri/extensions/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/extensions/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/extensions/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/extensions/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/extensions/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/extensions/releases{/id}",
                "created_at": "2013-10-15T01:14:11Z",
                "updated_at": "2013-12-24T01:04:48Z",
                "pushed_at": "2013-12-24T01:04:20Z",
                "git_url": "git://github.com/distri/extensions.git",
                "ssh_url": "git@github.com:distri/extensions.git",
                "clone_url": "https://github.com/distri/extensions.git",
                "svn_url": "https://github.com/distri/extensions",
                "homepage": null,
                "size": 964,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.2.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            },
            "core": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "core\n====\n\nAn object extension system.\n",
                  "type": "blob"
                },
                "core.coffee.md": {
                  "path": "core.coffee.md",
                  "mode": "100644",
                  "content": "Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "entryPoint: \"core\"\nversion: \"0.6.0\"\n",
                  "type": "blob"
                },
                "test/core.coffee": {
                  "path": "test/core.coffee",
                  "mode": "100644",
                  "content": "Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "core": {
                  "path": "core",
                  "content": "(function() {\n  var Core, extend,\n    __slice = [].slice;\n\n  Core = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    extend(self, {\n      I: I,\n      attrAccessor: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function(newValue) {\n            if (arguments.length > 0) {\n              I[attrName] = newValue;\n              return self;\n            } else {\n              return I[attrName];\n            }\n          };\n        });\n        return self;\n      },\n      attrReader: function() {\n        var attrNames;\n        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        attrNames.forEach(function(attrName) {\n          return self[attrName] = function() {\n            return I[attrName];\n          };\n        });\n        return self;\n      },\n      extend: function() {\n        var objects;\n        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        return extend.apply(null, [self].concat(__slice.call(objects)));\n      },\n      include: function() {\n        var Module, modules, _i, _len;\n        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        for (_i = 0, _len = modules.length; _i < _len; _i++) {\n          Module = modules[_i];\n          Module(I, self);\n        }\n        return self;\n      }\n    });\n    return self;\n  };\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  module.exports = Core;\n\n}).call(this);\n\n//# sourceURL=core.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"entryPoint\":\"core\",\"version\":\"0.6.0\"};",
                  "type": "blob"
                },
                "test/core": {
                  "path": "test/core",
                  "content": "(function() {\n  var Core, equals, ok, test;\n\n  Core = require(\"../core\");\n\n  ok = assert;\n\n  equals = assert.equal;\n\n  test = it;\n\n  describe(\"Core\", function() {\n    test(\"#extend\", function() {\n      var o;\n      o = Core();\n      o.extend({\n        test: \"jawsome\"\n      });\n      return equals(o.test, \"jawsome\");\n    });\n    test(\"#attrAccessor\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrAccessor(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), o);\n      return equals(o.test(), \"new_val\");\n    });\n    test(\"#attrReader\", function() {\n      var o;\n      o = Core({\n        test: \"my_val\"\n      });\n      o.attrReader(\"test\");\n      equals(o.test(), \"my_val\");\n      equals(o.test(\"new_val\"), \"my_val\");\n      return equals(o.test(), \"my_val\");\n    });\n    test(\"#include\", function() {\n      var M, o, ret;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      ret = o.include(M);\n      equals(ret, o, \"Should return self\");\n      equals(o.test(), \"my_val\");\n      return equals(o.test2, \"cool\");\n    });\n    return test(\"#include multiple\", function() {\n      var M, M2, o;\n      o = Core({\n        test: \"my_val\"\n      });\n      M = function(I, self) {\n        self.attrReader(\"test\");\n        return self.extend({\n          test2: \"cool\"\n        });\n      };\n      M2 = function(I, self) {\n        return self.extend({\n          test2: \"coolio\"\n        });\n      };\n      o.include(M, M2);\n      return equals(o.test2, \"coolio\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/core.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.6.0",
              "entryPoint": "core",
              "repository": {
                "id": 13567517,
                "name": "core",
                "full_name": "distri/core",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/core",
                "description": "An object extension system.",
                "fork": false,
                "url": "https://api.github.com/repos/distri/core",
                "forks_url": "https://api.github.com/repos/distri/core/forks",
                "keys_url": "https://api.github.com/repos/distri/core/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/core/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/core/teams",
                "hooks_url": "https://api.github.com/repos/distri/core/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/core/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/core/events",
                "assignees_url": "https://api.github.com/repos/distri/core/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/core/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/core/tags",
                "blobs_url": "https://api.github.com/repos/distri/core/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/core/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/core/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/core/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/core/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/core/languages",
                "stargazers_url": "https://api.github.com/repos/distri/core/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/core/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/core/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/core/subscription",
                "commits_url": "https://api.github.com/repos/distri/core/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/core/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/core/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/core/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/core/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/core/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/core/merges",
                "archive_url": "https://api.github.com/repos/distri/core/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/core/downloads",
                "issues_url": "https://api.github.com/repos/distri/core/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/core/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/core/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/core/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/core/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/core/releases{/id}",
                "created_at": "2013-10-14T17:04:33Z",
                "updated_at": "2013-12-24T00:49:21Z",
                "pushed_at": "2013-10-14T23:49:11Z",
                "git_url": "git://github.com/distri/core.git",
                "ssh_url": "git@github.com:distri/core.git",
                "clone_url": "https://github.com/distri/core.git",
                "svn_url": "https://github.com/distri/core",
                "homepage": null,
                "size": 592,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.6.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            }
          }
        },
        "finder": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "finder\n======\n\nQuery a set of objects using a jQuery like selector language.\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "Finder\n======\n\nUse a query language to filter an array of objects.\n\n    module.exports = (I={}, self=Core(I)) ->\n      self.extend\n\nGet a selection of objects that match the specified selector criteria.\nThe selector language can select objects by id, type, or attributes. This\nmethod always returns an Array.\n\n        find: (objects, selector, typeMatcher) ->\n          results = []\n\n          matcher = generate(selector, typeMatcher)\n\n          objects.forEach (object) ->\n            results.push object if matcher object\n\n          results\n\n    parseSelector = (selector) ->\n      selector.split(\",\").invoke(\"trim\")\n\n    parseResult = (str) ->\n      try\n        JSON.parse(str)\n      catch\n        str\n\n    process = (item) ->\n      query = /^(\\w+)?#?([\\w\\-]+)?\\.?([\\w\\-]+)?=?([\\w\\-]+)?/.exec(item)\n\n      if query\n        if valueQuery = query[4]\n          query[4] = parseResult valueQuery\n\n        query.splice(1)\n      else\n        []\n\n    get = (object, property) ->\n      value = object?[property]\n\n      if typeof value is \"function\"\n        value.call(object)\n      else\n        value\n\n    defaultTypeMatcher = (type, object) ->\n      type is get(object, \"class\")\n\n    generate = (selector=\"\", typeMatcher=defaultTypeMatcher) ->\n      components = parseSelector(selector).map (piece) ->\n        process(piece)\n\n      (object) ->\n        for component in components\n          [type, id, attr, value] = component\n\n          idMatch = !id or (id is get(object, \"id\"))\n          typeMatch = !type or typeMatcher(type, object)\n\n          if attr\n            if value?\n              attrMatch = get(object, attr) is value\n            else\n              attrMatch = get(object, attr)\n          else\n            attrMatch = true\n\n          return true if idMatch && typeMatch && attrMatch\n\n        return false\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.1.3\"\nremoteDependencies: [\n  \"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js\"\n]\n",
              "type": "blob"
            },
            "test/finder.coffee": {
              "path": "test/finder.coffee",
              "mode": "100644",
              "content": "Finder = require \"../main\"\n\ndescribe \"Finder\", ->\n  finder = Finder()\n\n  it \"should find objects with normal properties\", ->\n    results = finder.find([{\n      name: \"duder\"\n    }], \".name=duder\")\n\n    assert.equal results[0].name, \"duder\"\n\n  it \"should find obects with method properties\", ->\n    results = finder.find([{\n      name: -> \"duder\"\n    }], \".name=duder\")\n\n    assert.equal results[0].name(), \"duder\"\n\n  it \"should find objects by id attribute\", ->\n    results = finder.find([{\n      id: \"duder\"\n    }], \"#duder\")\n\n    assert.equal results[0].id, \"duder\"\n\n  it \"should find objects by id method\", ->\n    results = finder.find([{\n      id: -> \"duder\"\n    }], \"#duder\")\n\n    assert.equal results[0].id(), \"duder\"\n\n  it \"should allow specifying the type matcher\", ->\n    results = finder.find [\n      type: \"duder\"\n    ], \"duder\", (type, object) ->\n      object.type is type\n\n    assert.equal results[0].type, \"duder\"\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var defaultTypeMatcher, generate, get, parseResult, parseSelector, process;\n\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    return self.extend({\n      find: function(objects, selector, typeMatcher) {\n        var matcher, results;\n        results = [];\n        matcher = generate(selector, typeMatcher);\n        objects.forEach(function(object) {\n          if (matcher(object)) {\n            return results.push(object);\n          }\n        });\n        return results;\n      }\n    });\n  };\n\n  parseSelector = function(selector) {\n    return selector.split(\",\").invoke(\"trim\");\n  };\n\n  parseResult = function(str) {\n    try {\n      return JSON.parse(str);\n    } catch (_error) {\n      return str;\n    }\n  };\n\n  process = function(item) {\n    var query, valueQuery;\n    query = /^(\\w+)?#?([\\w\\-]+)?\\.?([\\w\\-]+)?=?([\\w\\-]+)?/.exec(item);\n    if (query) {\n      if (valueQuery = query[4]) {\n        query[4] = parseResult(valueQuery);\n      }\n      return query.splice(1);\n    } else {\n      return [];\n    }\n  };\n\n  get = function(object, property) {\n    var value;\n    value = object != null ? object[property] : void 0;\n    if (typeof value === \"function\") {\n      return value.call(object);\n    } else {\n      return value;\n    }\n  };\n\n  defaultTypeMatcher = function(type, object) {\n    return type === get(object, \"class\");\n  };\n\n  generate = function(selector, typeMatcher) {\n    var components;\n    if (selector == null) {\n      selector = \"\";\n    }\n    if (typeMatcher == null) {\n      typeMatcher = defaultTypeMatcher;\n    }\n    components = parseSelector(selector).map(function(piece) {\n      return process(piece);\n    });\n    return function(object) {\n      var attr, attrMatch, component, id, idMatch, type, typeMatch, value, _i, _len;\n      for (_i = 0, _len = components.length; _i < _len; _i++) {\n        component = components[_i];\n        type = component[0], id = component[1], attr = component[2], value = component[3];\n        idMatch = !id || (id === get(object, \"id\"));\n        typeMatch = !type || typeMatcher(type, object);\n        if (attr) {\n          if (value != null) {\n            attrMatch = get(object, attr) === value;\n          } else {\n            attrMatch = get(object, attr);\n          }\n        } else {\n          attrMatch = true;\n        }\n        if (idMatch && typeMatch && attrMatch) {\n          return true;\n        }\n      }\n      return false;\n    };\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.1.3\",\"remoteDependencies\":[\"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js\"]};",
              "type": "blob"
            },
            "test/finder": {
              "path": "test/finder",
              "content": "(function() {\n  var Finder;\n\n  Finder = require(\"../main\");\n\n  describe(\"Finder\", function() {\n    var finder;\n    finder = Finder();\n    it(\"should find objects with normal properties\", function() {\n      var results;\n      results = finder.find([\n        {\n          name: \"duder\"\n        }\n      ], \".name=duder\");\n      return assert.equal(results[0].name, \"duder\");\n    });\n    it(\"should find obects with method properties\", function() {\n      var results;\n      results = finder.find([\n        {\n          name: function() {\n            return \"duder\";\n          }\n        }\n      ], \".name=duder\");\n      return assert.equal(results[0].name(), \"duder\");\n    });\n    it(\"should find objects by id attribute\", function() {\n      var results;\n      results = finder.find([\n        {\n          id: \"duder\"\n        }\n      ], \"#duder\");\n      return assert.equal(results[0].id, \"duder\");\n    });\n    it(\"should find objects by id method\", function() {\n      var results;\n      results = finder.find([\n        {\n          id: function() {\n            return \"duder\";\n          }\n        }\n      ], \"#duder\");\n      return assert.equal(results[0].id(), \"duder\");\n    });\n    return it(\"should allow specifying the type matcher\", function() {\n      var results;\n      results = finder.find([\n        {\n          type: \"duder\"\n        }\n      ], \"duder\", function(type, object) {\n        return object.type === type;\n      });\n      return assert.equal(results[0].type, \"duder\");\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/finder.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.1.3",
          "entryPoint": "main",
          "remoteDependencies": [
            "http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"
          ],
          "repository": {
            "id": 14910855,
            "name": "finder",
            "full_name": "distri/finder",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/finder",
            "description": "Query a set of objects using a jQuery like selector language.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/finder",
            "forks_url": "https://api.github.com/repos/distri/finder/forks",
            "keys_url": "https://api.github.com/repos/distri/finder/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/finder/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/finder/teams",
            "hooks_url": "https://api.github.com/repos/distri/finder/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/finder/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/finder/events",
            "assignees_url": "https://api.github.com/repos/distri/finder/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/finder/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/finder/tags",
            "blobs_url": "https://api.github.com/repos/distri/finder/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/finder/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/finder/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/finder/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/finder/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/finder/languages",
            "stargazers_url": "https://api.github.com/repos/distri/finder/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/finder/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/finder/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/finder/subscription",
            "commits_url": "https://api.github.com/repos/distri/finder/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/finder/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/finder/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/finder/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/finder/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/finder/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/finder/merges",
            "archive_url": "https://api.github.com/repos/distri/finder/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/finder/downloads",
            "issues_url": "https://api.github.com/repos/distri/finder/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/finder/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/finder/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/finder/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/finder/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/finder/releases{/id}",
            "created_at": "2013-12-04T01:28:49Z",
            "updated_at": "2013-12-04T04:11:25Z",
            "pushed_at": "2013-12-04T04:11:25Z",
            "git_url": "git://github.com/distri/finder.git",
            "ssh_url": "git@github.com:distri/finder.git",
            "clone_url": "https://github.com/distri/finder.git",
            "svn_url": "https://github.com/distri/finder",
            "homepage": null,
            "size": 384,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 2,
            "branch": "v0.1.3",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "hotkeys": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "hotkeys\n=======\n\nHotkeys module for editors\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "Hotkeys\n=======\n\nHotkeys module for the editors.\n\n    module.exports = (I={}, self=Core(I)) ->\n      self.extend\n        addHotkey: (key, method) ->\n          $(document).bind \"keydown\", key, (event) ->\n            if typeof method is \"function\"\n              method\n                editor: self\n            else\n              self[method]()\n\n            event.preventDefault()\n\n      return self\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.2.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n  \"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js\"\n]\n",
              "type": "blob"
            },
            "test/hotkeys.coffee": {
              "path": "test/hotkeys.coffee",
              "mode": "100644",
              "content": "Hotkeys = require \"../main\"\n\ndescribe \"hotkeys\", ->\n  it \"should be hot\", (done) ->\n    hotkeys = Hotkeys()\n    \n    hotkeys.addHotkey \"a\", ->\n      done()\n\n    $(document).trigger $.Event \"keydown\",\n      which: 65 # a\n      keyCode: 65\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  module.exports = function(I, self) {\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Core(I);\n    }\n    self.extend({\n      addHotkey: function(key, method) {\n        return $(document).bind(\"keydown\", key, function(event) {\n          if (typeof method === \"function\") {\n            method({\n              editor: self\n            });\n          } else {\n            self[method]();\n          }\n          return event.preventDefault();\n        });\n      }\n    });\n    return self;\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\",\"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js\"]};",
              "type": "blob"
            },
            "test/hotkeys": {
              "path": "test/hotkeys",
              "content": "(function() {\n  var Hotkeys;\n\n  Hotkeys = require(\"../main\");\n\n  describe(\"hotkeys\", function() {\n    return it(\"should be hot\", function(done) {\n      var hotkeys;\n      hotkeys = Hotkeys();\n      hotkeys.addHotkey(\"a\", function() {\n        return done();\n      });\n      return $(document).trigger($.Event(\"keydown\", {\n        which: 65,\n        keyCode: 65\n      }));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/hotkeys.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "main",
          "remoteDependencies": [
            "//code.jquery.com/jquery-1.10.1.min.js",
            "http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"
          ],
          "repository": {
            "id": 14673639,
            "name": "hotkeys",
            "full_name": "distri/hotkeys",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/hotkeys",
            "description": "Hotkeys module for editors",
            "fork": false,
            "url": "https://api.github.com/repos/distri/hotkeys",
            "forks_url": "https://api.github.com/repos/distri/hotkeys/forks",
            "keys_url": "https://api.github.com/repos/distri/hotkeys/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/hotkeys/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/hotkeys/teams",
            "hooks_url": "https://api.github.com/repos/distri/hotkeys/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/hotkeys/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/hotkeys/events",
            "assignees_url": "https://api.github.com/repos/distri/hotkeys/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/hotkeys/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/hotkeys/tags",
            "blobs_url": "https://api.github.com/repos/distri/hotkeys/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/hotkeys/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/hotkeys/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/hotkeys/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/hotkeys/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/hotkeys/languages",
            "stargazers_url": "https://api.github.com/repos/distri/hotkeys/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/hotkeys/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/hotkeys/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/hotkeys/subscription",
            "commits_url": "https://api.github.com/repos/distri/hotkeys/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/hotkeys/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/hotkeys/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/hotkeys/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/hotkeys/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/hotkeys/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/hotkeys/merges",
            "archive_url": "https://api.github.com/repos/distri/hotkeys/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/hotkeys/downloads",
            "issues_url": "https://api.github.com/repos/distri/hotkeys/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/hotkeys/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/hotkeys/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/hotkeys/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/hotkeys/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/hotkeys/releases{/id}",
            "created_at": "2013-11-25T01:55:42Z",
            "updated_at": "2013-11-25T02:03:57Z",
            "pushed_at": "2013-11-25T02:03:56Z",
            "git_url": "git://github.com/distri/hotkeys.git",
            "ssh_url": "git@github.com:distri/hotkeys.git",
            "clone_url": "https://github.com/distri/hotkeys.git",
            "svn_url": "https://github.com/distri/hotkeys",
            "homepage": null,
            "size": 264,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 2,
            "branch": "v0.2.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "jquery-utils": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "jquery-utils\n============\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "    require \"hotkeys\"\n    require \"image-reader\"\n    require \"./take_class\"\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.2.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n]\ndependencies:\n  hotkeys: \"distri/jquery-hotkeys:v0.9.2\"\n  \"image-reader\": \"distri/jquery-image_reader:v0.2.0\"\n",
              "type": "blob"
            },
            "take_class.coffee.md": {
              "path": "take_class.coffee.md",
              "mode": "100644",
              "content": "Take Class\n==========\n\nTake the named class from all the sibling elements. Perfect for something like\nradio buttons.\n\n    (($) ->\n      $.fn.takeClass = (name) ->\n        @addClass(name).siblings().removeClass(name)\n\n        return this\n    )(jQuery)\n",
              "type": "blob"
            },
            "test/image_reader.coffee": {
              "path": "test/image_reader.coffee",
              "mode": "100644",
              "content": "require \"../main\"\n\ndescribe \"jQuery#pasteImageReader\", ->\n  it \"should exist\", ->\n    assert $.fn.pasteImageReader\n\ndescribe \"jQuery#dropImageReader\", ->\n  it \"should exist\", ->\n    assert $.fn.dropImageReader\n",
              "type": "blob"
            },
            "test/take_class.coffee": {
              "path": "test/take_class.coffee",
              "mode": "100644",
              "content": "require \"../main\"\n\ndescribe \"jQuery#takeClass\", ->\n  it \"should exist\", ->\n    assert $.fn.takeClass\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  require(\"hotkeys\");\n\n  require(\"image-reader\");\n\n  require(\"./take_class\");\n\n}).call(this);\n\n//# sourceURL=main.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\"],\"dependencies\":{\"hotkeys\":\"distri/jquery-hotkeys:v0.9.2\",\"image-reader\":\"distri/jquery-image_reader:v0.2.0\"}};",
              "type": "blob"
            },
            "take_class": {
              "path": "take_class",
              "content": "(function() {\n  (function($) {\n    return $.fn.takeClass = function(name) {\n      this.addClass(name).siblings().removeClass(name);\n      return this;\n    };\n  })(jQuery);\n\n}).call(this);\n\n//# sourceURL=take_class.coffee",
              "type": "blob"
            },
            "test/image_reader": {
              "path": "test/image_reader",
              "content": "(function() {\n  require(\"../main\");\n\n  describe(\"jQuery#pasteImageReader\", function() {\n    return it(\"should exist\", function() {\n      return assert($.fn.pasteImageReader);\n    });\n  });\n\n  describe(\"jQuery#dropImageReader\", function() {\n    return it(\"should exist\", function() {\n      return assert($.fn.dropImageReader);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/image_reader.coffee",
              "type": "blob"
            },
            "test/take_class": {
              "path": "test/take_class",
              "content": "(function() {\n  require(\"../main\");\n\n  describe(\"jQuery#takeClass\", function() {\n    return it(\"should exist\", function() {\n      return assert($.fn.takeClass);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/take_class.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "main",
          "remoteDependencies": [
            "//code.jquery.com/jquery-1.10.1.min.js"
          ],
          "repository": {
            "id": 13183366,
            "name": "jquery-utils",
            "full_name": "distri/jquery-utils",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/jquery-utils",
            "description": "",
            "fork": false,
            "url": "https://api.github.com/repos/distri/jquery-utils",
            "forks_url": "https://api.github.com/repos/distri/jquery-utils/forks",
            "keys_url": "https://api.github.com/repos/distri/jquery-utils/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/jquery-utils/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/jquery-utils/teams",
            "hooks_url": "https://api.github.com/repos/distri/jquery-utils/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/jquery-utils/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/jquery-utils/events",
            "assignees_url": "https://api.github.com/repos/distri/jquery-utils/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/jquery-utils/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/jquery-utils/tags",
            "blobs_url": "https://api.github.com/repos/distri/jquery-utils/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/jquery-utils/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/jquery-utils/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/jquery-utils/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/jquery-utils/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/jquery-utils/languages",
            "stargazers_url": "https://api.github.com/repos/distri/jquery-utils/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/jquery-utils/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/jquery-utils/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/jquery-utils/subscription",
            "commits_url": "https://api.github.com/repos/distri/jquery-utils/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/jquery-utils/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/jquery-utils/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/jquery-utils/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/jquery-utils/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/jquery-utils/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/jquery-utils/merges",
            "archive_url": "https://api.github.com/repos/distri/jquery-utils/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/jquery-utils/downloads",
            "issues_url": "https://api.github.com/repos/distri/jquery-utils/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/jquery-utils/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/jquery-utils/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/jquery-utils/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/jquery-utils/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/jquery-utils/releases{/id}",
            "created_at": "2013-09-29T00:25:09Z",
            "updated_at": "2013-11-29T20:57:42Z",
            "pushed_at": "2013-10-25T17:28:57Z",
            "git_url": "git://github.com/distri/jquery-utils.git",
            "ssh_url": "git@github.com:distri/jquery-utils.git",
            "clone_url": "https://github.com/distri/jquery-utils.git",
            "svn_url": "https://github.com/distri/jquery-utils",
            "homepage": null,
            "size": 592,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.2.0",
            "defaultBranch": "master"
          },
          "dependencies": {
            "hotkeys": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "jquery.hotkeys\n==============\n\njQuery hotkeys plugin\n",
                  "type": "blob"
                },
                "hotkeys.coffee.md": {
                  "path": "hotkeys.coffee.md",
                  "mode": "100644",
                  "content": "jQuery Hotkeys Plugin\n=====================\n\nCopyright 2010, John Resig\nDual licensed under the MIT or GPL Version 2 licenses.\n\nBased upon the plugin by Tzury Bar Yochay:\nhttp://github.com/tzuryby/hotkeys\n\nOriginal idea by:\nBinny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/\n\n    if jQuery?\n      ((jQuery) ->\n        isTextAcceptingInput = (element) ->\n          /textarea|select/i.test(element.nodeName) or element.type is \"text\" or element.type is \"password\"\n\n        isFunctionKey = (event) ->\n          (event.type != \"keypress\") && (112 <= event.which <= 123)\n\n        jQuery.hotkeys =\n          version: \"0.9.0\"\n\n          specialKeys:\n            8: \"backspace\"\n            9: \"tab\"\n            13: \"return\"\n            16: \"shift\"\n            17: \"ctrl\"\n            18: \"alt\"\n            19: \"pause\"\n            20: \"capslock\"\n            27: \"esc\"\n            32: \"space\"\n            33: \"pageup\"\n            34: \"pagedown\"\n            35: \"end\"\n            36: \"home\"\n            37: \"left\"\n            38: \"up\"\n            39: \"right\"\n            40: \"down\"\n            45: \"insert\"\n            46: \"del\"\n            96: \"0\"\n            97: \"1\"\n            98: \"2\"\n            99: \"3\"\n            100: \"4\"\n            101: \"5\"\n            102: \"6\"\n            103: \"7\"\n            104: \"8\"\n            105: \"9\"\n            106: \"*\"\n            107: \"+\"\n            109: \"-\"\n            110: \".\"\n            111 : \"/\"\n            112: \"f1\"\n            113: \"f2\"\n            114: \"f3\"\n            115: \"f4\"\n            116: \"f5\"\n            117: \"f6\"\n            118: \"f7\"\n            119: \"f8\"\n            120: \"f9\"\n            121: \"f10\"\n            122: \"f11\"\n            123: \"f12\"\n            144: \"numlock\"\n            145: \"scroll\"\n            186: \";\"\n            187: \"=\"\n            188: \",\"\n            189: \"-\"\n            190: \".\"\n            191: \"/\"\n            219: \"[\"\n            220: \"\\\\\"\n            221: \"]\"\n            222: \"'\"\n            224: \"meta\"\n\n          shiftNums:\n            \"`\": \"~\"\n            \"1\": \"!\"\n            \"2\": \"@\"\n            \"3\": \"#\"\n            \"4\": \"$\"\n            \"5\": \"%\"\n            \"6\": \"^\"\n            \"7\": \"&\"\n            \"8\": \"*\"\n            \"9\": \"(\"\n            \"0\": \")\"\n            \"-\": \"_\"\n            \"=\": \"+\"\n            \";\": \":\"\n            \"'\": \"\\\"\"\n            \",\": \"<\"\n            \".\": \">\"\n            \"/\": \"?\"\n            \"\\\\\": \"|\"\n\n        keyHandler = (handleObj) ->\n          # Only care when a possible input has been specified\n          if typeof handleObj.data != \"string\"\n            return\n\n          origHandler = handleObj.handler\n          keys = handleObj.data.toLowerCase().split(\" \")\n\n          handleObj.handler = (event) ->\n            # Keypress represents characters, not special keys\n            special = event.type != \"keypress\" && jQuery.hotkeys.specialKeys[ event.which ]\n            character = String.fromCharCode( event.which ).toLowerCase()\n            modif = \"\"\n            possible = {}\n            target = event.target\n\n            # check combinations (alt|ctrl|shift+anything)\n            if event.altKey && special != \"alt\"\n              modif += \"alt+\"\n\n            if event.ctrlKey && special != \"ctrl\"\n              modif += \"ctrl+\"\n\n            # TODO: Need to make sure this works consistently across platforms\n            if event.metaKey && !event.ctrlKey && special != \"meta\"\n              modif += \"meta+\"\n\n            # Don't fire in text-accepting inputs that we didn't directly bind to\n            # unless a non-shift modifier key or function key is pressed\n            unless this == target\n              if isTextAcceptingInput(target) && !modif && !isFunctionKey(event)\n                return\n\n            if event.shiftKey && special != \"shift\"\n              modif += \"shift+\"\n\n            if special\n              possible[ modif + special ] = true\n            else\n              possible[ modif + character ] = true\n              possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true\n\n              # \"$\" can be triggered as \"Shift+4\" or \"Shift+$\" or just \"$\"\n              if modif == \"shift+\"\n                possible[ jQuery.hotkeys.shiftNums[ character ] ] = true\n\n            for key in keys\n              if possible[key]\n                return origHandler.apply( this, arguments )\n\n        jQuery.each [ \"keydown\", \"keyup\", \"keypress\" ], ->\n          jQuery.event.special[ this ] = { add: keyHandler }\n\n      )(jQuery)\n    else\n      console.warn \"jQuery not found, no hotkeys added :(\"\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "version: \"0.9.2\"\nentryPoint: \"hotkeys\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n]\n",
                  "type": "blob"
                },
                "test/hotkeys.coffee": {
                  "path": "test/hotkeys.coffee",
                  "mode": "100644",
                  "content": "require \"../hotkeys\"\n\ndescribe \"hotkeys binding\", ->\n  it \"should bind a hotkey\", (done) ->\n    $(document).bind \"keydown\", \"a\", ->\n      done()\n\n    $(document).trigger $.Event \"keydown\",\n      which: 65 # a\n      keyCode: 65\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "hotkeys": {
                  "path": "hotkeys",
                  "content": "(function() {\n  if (typeof jQuery !== \"undefined\" && jQuery !== null) {\n    (function(jQuery) {\n      var isFunctionKey, isTextAcceptingInput, keyHandler;\n      isTextAcceptingInput = function(element) {\n        return /textarea|select/i.test(element.nodeName) || element.type === \"text\" || element.type === \"password\";\n      };\n      isFunctionKey = function(event) {\n        var _ref;\n        return (event.type !== \"keypress\") && ((112 <= (_ref = event.which) && _ref <= 123));\n      };\n      jQuery.hotkeys = {\n        version: \"0.9.0\",\n        specialKeys: {\n          8: \"backspace\",\n          9: \"tab\",\n          13: \"return\",\n          16: \"shift\",\n          17: \"ctrl\",\n          18: \"alt\",\n          19: \"pause\",\n          20: \"capslock\",\n          27: \"esc\",\n          32: \"space\",\n          33: \"pageup\",\n          34: \"pagedown\",\n          35: \"end\",\n          36: \"home\",\n          37: \"left\",\n          38: \"up\",\n          39: \"right\",\n          40: \"down\",\n          45: \"insert\",\n          46: \"del\",\n          96: \"0\",\n          97: \"1\",\n          98: \"2\",\n          99: \"3\",\n          100: \"4\",\n          101: \"5\",\n          102: \"6\",\n          103: \"7\",\n          104: \"8\",\n          105: \"9\",\n          106: \"*\",\n          107: \"+\",\n          109: \"-\",\n          110: \".\",\n          111: \"/\",\n          112: \"f1\",\n          113: \"f2\",\n          114: \"f3\",\n          115: \"f4\",\n          116: \"f5\",\n          117: \"f6\",\n          118: \"f7\",\n          119: \"f8\",\n          120: \"f9\",\n          121: \"f10\",\n          122: \"f11\",\n          123: \"f12\",\n          144: \"numlock\",\n          145: \"scroll\",\n          186: \";\",\n          187: \"=\",\n          188: \",\",\n          189: \"-\",\n          190: \".\",\n          191: \"/\",\n          219: \"[\",\n          220: \"\\\\\",\n          221: \"]\",\n          222: \"'\",\n          224: \"meta\"\n        },\n        shiftNums: {\n          \"`\": \"~\",\n          \"1\": \"!\",\n          \"2\": \"@\",\n          \"3\": \"#\",\n          \"4\": \"$\",\n          \"5\": \"%\",\n          \"6\": \"^\",\n          \"7\": \"&\",\n          \"8\": \"*\",\n          \"9\": \"(\",\n          \"0\": \")\",\n          \"-\": \"_\",\n          \"=\": \"+\",\n          \";\": \":\",\n          \"'\": \"\\\"\",\n          \",\": \"<\",\n          \".\": \">\",\n          \"/\": \"?\",\n          \"\\\\\": \"|\"\n        }\n      };\n      keyHandler = function(handleObj) {\n        var keys, origHandler;\n        if (typeof handleObj.data !== \"string\") {\n          return;\n        }\n        origHandler = handleObj.handler;\n        keys = handleObj.data.toLowerCase().split(\" \");\n        return handleObj.handler = function(event) {\n          var character, key, modif, possible, special, target, _i, _len;\n          special = event.type !== \"keypress\" && jQuery.hotkeys.specialKeys[event.which];\n          character = String.fromCharCode(event.which).toLowerCase();\n          modif = \"\";\n          possible = {};\n          target = event.target;\n          if (event.altKey && special !== \"alt\") {\n            modif += \"alt+\";\n          }\n          if (event.ctrlKey && special !== \"ctrl\") {\n            modif += \"ctrl+\";\n          }\n          if (event.metaKey && !event.ctrlKey && special !== \"meta\") {\n            modif += \"meta+\";\n          }\n          if (this !== target) {\n            if (isTextAcceptingInput(target) && !modif && !isFunctionKey(event)) {\n              return;\n            }\n          }\n          if (event.shiftKey && special !== \"shift\") {\n            modif += \"shift+\";\n          }\n          if (special) {\n            possible[modif + special] = true;\n          } else {\n            possible[modif + character] = true;\n            possible[modif + jQuery.hotkeys.shiftNums[character]] = true;\n            if (modif === \"shift+\") {\n              possible[jQuery.hotkeys.shiftNums[character]] = true;\n            }\n          }\n          for (_i = 0, _len = keys.length; _i < _len; _i++) {\n            key = keys[_i];\n            if (possible[key]) {\n              return origHandler.apply(this, arguments);\n            }\n          }\n        };\n      };\n      return jQuery.each([\"keydown\", \"keyup\", \"keypress\"], function() {\n        return jQuery.event.special[this] = {\n          add: keyHandler\n        };\n      });\n    })(jQuery);\n  } else {\n    console.warn(\"jQuery not found, no hotkeys added :(\");\n  }\n\n}).call(this);\n\n//# sourceURL=hotkeys.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"version\":\"0.9.2\",\"entryPoint\":\"hotkeys\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\"]};",
                  "type": "blob"
                },
                "test/hotkeys": {
                  "path": "test/hotkeys",
                  "content": "(function() {\n  require(\"../hotkeys\");\n\n  describe(\"hotkeys binding\", function() {\n    return it(\"should bind a hotkey\", function(done) {\n      $(document).bind(\"keydown\", \"a\", function() {\n        return done();\n      });\n      return $(document).trigger($.Event(\"keydown\", {\n        which: 65,\n        keyCode: 65\n      }));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/hotkeys.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.9.2",
              "entryPoint": "hotkeys",
              "remoteDependencies": [
                "//code.jquery.com/jquery-1.10.1.min.js"
              ],
              "repository": {
                "id": 13182272,
                "name": "jquery-hotkeys",
                "full_name": "distri/jquery-hotkeys",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/jquery-hotkeys",
                "description": "jQuery hotkeys plugin",
                "fork": false,
                "url": "https://api.github.com/repos/distri/jquery-hotkeys",
                "forks_url": "https://api.github.com/repos/distri/jquery-hotkeys/forks",
                "keys_url": "https://api.github.com/repos/distri/jquery-hotkeys/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/jquery-hotkeys/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/jquery-hotkeys/teams",
                "hooks_url": "https://api.github.com/repos/distri/jquery-hotkeys/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/jquery-hotkeys/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/jquery-hotkeys/events",
                "assignees_url": "https://api.github.com/repos/distri/jquery-hotkeys/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/jquery-hotkeys/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/jquery-hotkeys/tags",
                "blobs_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/jquery-hotkeys/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/jquery-hotkeys/languages",
                "stargazers_url": "https://api.github.com/repos/distri/jquery-hotkeys/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/jquery-hotkeys/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/jquery-hotkeys/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/jquery-hotkeys/subscription",
                "commits_url": "https://api.github.com/repos/distri/jquery-hotkeys/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/jquery-hotkeys/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/jquery-hotkeys/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/jquery-hotkeys/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/jquery-hotkeys/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/jquery-hotkeys/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/jquery-hotkeys/merges",
                "archive_url": "https://api.github.com/repos/distri/jquery-hotkeys/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/jquery-hotkeys/downloads",
                "issues_url": "https://api.github.com/repos/distri/jquery-hotkeys/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/jquery-hotkeys/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/jquery-hotkeys/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/jquery-hotkeys/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/jquery-hotkeys/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/jquery-hotkeys/releases{/id}",
                "created_at": "2013-09-28T22:58:08Z",
                "updated_at": "2013-11-29T20:59:45Z",
                "pushed_at": "2013-09-29T23:55:14Z",
                "git_url": "git://github.com/distri/jquery-hotkeys.git",
                "ssh_url": "git@github.com:distri/jquery-hotkeys.git",
                "clone_url": "https://github.com/distri/jquery-hotkeys.git",
                "svn_url": "https://github.com/distri/jquery-hotkeys",
                "homepage": null,
                "size": 608,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 0,
                "open_issues": 0,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.9.2",
                "defaultBranch": "master"
              },
              "dependencies": {}
            },
            "image-reader": {
              "source": {
                "LICENSE": {
                  "path": "LICENSE",
                  "mode": "100644",
                  "content": "Copyright (c) 2012 Daniel X. Moore\n\nMIT License\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n\"Software\"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\nNONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE\nLIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION\nOF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION\nWITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
                  "type": "blob"
                },
                "README.md": {
                  "path": "README.md",
                  "mode": "100644",
                  "content": "# Jquery::ImageReader\n\nHelpful jQuery plugins for dropping and pasting image data.\n\n## Usage\n\n```coffeescript\n$(\"html\").pasteImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n\n$(\"html\").dropImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n```\n\n## Contributing\n\n1. Fork it\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Added some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create new Pull Request\n",
                  "type": "blob"
                },
                "drop.coffee.md": {
                  "path": "drop.coffee.md",
                  "mode": "100644",
                  "content": "Drop\n====\n\n    (($) ->\n      $.event.fix = ((originalFix) ->\n        (event) ->\n          event = originalFix.apply(this, arguments)\n\n          if event.type.indexOf('drag') == 0 || event.type.indexOf('drop') == 0\n            event.dataTransfer = event.originalEvent.dataTransfer\n\n          event\n\n      )($.event.fix)\n\n      defaults =\n        callback: $.noop\n        matchType: /image.*/\n\n      $.fn.dropImageReader = (options) ->\n        if typeof options == \"function\"\n          options =\n            callback: options\n\n        options = $.extend({}, defaults, options)\n\n        stopFn = (event) ->\n          event.stopPropagation()\n          event.preventDefault()\n\n        this.each ->\n          element = this\n          $this = $(this)\n\n          $this.bind 'dragenter dragover dragleave', stopFn\n\n          $this.bind 'drop', (event) ->\n            stopFn(event)\n\n            Array::forEach.call event.dataTransfer.files, (file) ->\n              return unless file.type.match(options.matchType)\n\n              reader = new FileReader()\n\n              reader.onload = (evt) ->\n                options.callback.call element,\n                  dataURL: evt.target.result\n                  event: evt\n                  file: file\n                  name: file.name\n\n              reader.readAsDataURL(file)\n\n    )(jQuery)\n",
                  "type": "blob"
                },
                "main.coffee.md": {
                  "path": "main.coffee.md",
                  "mode": "100644",
                  "content": "\n    require \"./paste\"\n    require \"./drop\"\n",
                  "type": "blob"
                },
                "paste.coffee.md": {
                  "path": "paste.coffee.md",
                  "mode": "100644",
                  "content": "Paste\n=====\n\n    (($) ->\n      $.event.fix = ((originalFix) ->\n        (event) ->\n          event = originalFix.apply(this, arguments)\n\n          if event.type.indexOf('copy') == 0 || event.type.indexOf('paste') == 0\n            event.clipboardData = event.originalEvent.clipboardData\n\n          return event\n\n      )($.event.fix)\n\n      defaults =\n        callback: $.noop\n        matchType: /image.*/\n\n      $.fn.pasteImageReader = (options) ->\n        if typeof options == \"function\"\n          options =\n            callback: options\n\n        options = $.extend({}, defaults, options)\n\n        @each ->\n          element = this\n          $this = $(this)\n\n          $this.bind 'paste', (event) ->\n            found = false\n            clipboardData = event.clipboardData\n\n            Array::forEach.call clipboardData.types, (type, i) ->\n              return if found\n\n              if type.match(options.matchType) or (clipboardData.items && clipboardData.items[i].type.match(options.matchType))\n                file = clipboardData.items[i].getAsFile()\n\n                reader = new FileReader()\n\n                reader.onload = (evt) ->\n                  options.callback.call element,\n                    dataURL: evt.target.result\n                    event: evt\n                    file: file\n                    name: file.name\n\n                reader.readAsDataURL(file)\n\n                found = true\n\n    )(jQuery)\n",
                  "type": "blob"
                },
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "version: \"0.2.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n]\n",
                  "type": "blob"
                },
                "test/image_reader.coffee": {
                  "path": "test/image_reader.coffee",
                  "mode": "100644",
                  "content": "require \"../main\"\n\n$(\"html\").pasteImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n\n$(\"html\").dropImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "drop": {
                  "path": "drop",
                  "content": "(function() {\n  (function($) {\n    var defaults;\n    $.event.fix = (function(originalFix) {\n      return function(event) {\n        event = originalFix.apply(this, arguments);\n        if (event.type.indexOf('drag') === 0 || event.type.indexOf('drop') === 0) {\n          event.dataTransfer = event.originalEvent.dataTransfer;\n        }\n        return event;\n      };\n    })($.event.fix);\n    defaults = {\n      callback: $.noop,\n      matchType: /image.*/\n    };\n    return $.fn.dropImageReader = function(options) {\n      var stopFn;\n      if (typeof options === \"function\") {\n        options = {\n          callback: options\n        };\n      }\n      options = $.extend({}, defaults, options);\n      stopFn = function(event) {\n        event.stopPropagation();\n        return event.preventDefault();\n      };\n      return this.each(function() {\n        var $this, element;\n        element = this;\n        $this = $(this);\n        $this.bind('dragenter dragover dragleave', stopFn);\n        return $this.bind('drop', function(event) {\n          stopFn(event);\n          return Array.prototype.forEach.call(event.dataTransfer.files, function(file) {\n            var reader;\n            if (!file.type.match(options.matchType)) {\n              return;\n            }\n            reader = new FileReader();\n            reader.onload = function(evt) {\n              return options.callback.call(element, {\n                dataURL: evt.target.result,\n                event: evt,\n                file: file,\n                name: file.name\n              });\n            };\n            return reader.readAsDataURL(file);\n          });\n        });\n      });\n    };\n  })(jQuery);\n\n}).call(this);\n\n//# sourceURL=drop.coffee",
                  "type": "blob"
                },
                "main": {
                  "path": "main",
                  "content": "(function() {\n  require(\"./paste\");\n\n  require(\"./drop\");\n\n}).call(this);\n\n//# sourceURL=main.coffee",
                  "type": "blob"
                },
                "paste": {
                  "path": "paste",
                  "content": "(function() {\n  (function($) {\n    var defaults;\n    $.event.fix = (function(originalFix) {\n      return function(event) {\n        event = originalFix.apply(this, arguments);\n        if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {\n          event.clipboardData = event.originalEvent.clipboardData;\n        }\n        return event;\n      };\n    })($.event.fix);\n    defaults = {\n      callback: $.noop,\n      matchType: /image.*/\n    };\n    return $.fn.pasteImageReader = function(options) {\n      if (typeof options === \"function\") {\n        options = {\n          callback: options\n        };\n      }\n      options = $.extend({}, defaults, options);\n      return this.each(function() {\n        var $this, element;\n        element = this;\n        $this = $(this);\n        return $this.bind('paste', function(event) {\n          var clipboardData, found;\n          found = false;\n          clipboardData = event.clipboardData;\n          return Array.prototype.forEach.call(clipboardData.types, function(type, i) {\n            var file, reader;\n            if (found) {\n              return;\n            }\n            if (type.match(options.matchType) || (clipboardData.items && clipboardData.items[i].type.match(options.matchType))) {\n              file = clipboardData.items[i].getAsFile();\n              reader = new FileReader();\n              reader.onload = function(evt) {\n                return options.callback.call(element, {\n                  dataURL: evt.target.result,\n                  event: evt,\n                  file: file,\n                  name: file.name\n                });\n              };\n              reader.readAsDataURL(file);\n              return found = true;\n            }\n          });\n        });\n      });\n    };\n  })(jQuery);\n\n}).call(this);\n\n//# sourceURL=paste.coffee",
                  "type": "blob"
                },
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"version\":\"0.2.0\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\"]};",
                  "type": "blob"
                },
                "test/image_reader": {
                  "path": "test/image_reader",
                  "content": "(function() {\n  require(\"../main\");\n\n  $(\"html\").pasteImageReader(function(_arg) {\n    var dataURL, event, file, name;\n    name = _arg.name, dataURL = _arg.dataURL, file = _arg.file, event = _arg.event;\n    return $(\"body\").css({\n      backgroundImage: \"url(\" + dataURL + \")\"\n    });\n  });\n\n  $(\"html\").dropImageReader(function(_arg) {\n    var dataURL, event, file, name;\n    name = _arg.name, dataURL = _arg.dataURL, file = _arg.file, event = _arg.event;\n    return $(\"body\").css({\n      backgroundImage: \"url(\" + dataURL + \")\"\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/image_reader.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.2.0",
              "entryPoint": "main",
              "remoteDependencies": [
                "//code.jquery.com/jquery-1.10.1.min.js"
              ],
              "repository": {
                "id": 4527535,
                "name": "jquery-image_reader",
                "full_name": "distri/jquery-image_reader",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/jquery-image_reader",
                "description": "Paste and Drop images into web apps",
                "fork": false,
                "url": "https://api.github.com/repos/distri/jquery-image_reader",
                "forks_url": "https://api.github.com/repos/distri/jquery-image_reader/forks",
                "keys_url": "https://api.github.com/repos/distri/jquery-image_reader/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/jquery-image_reader/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/jquery-image_reader/teams",
                "hooks_url": "https://api.github.com/repos/distri/jquery-image_reader/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/jquery-image_reader/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/jquery-image_reader/events",
                "assignees_url": "https://api.github.com/repos/distri/jquery-image_reader/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/jquery-image_reader/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/jquery-image_reader/tags",
                "blobs_url": "https://api.github.com/repos/distri/jquery-image_reader/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/jquery-image_reader/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/jquery-image_reader/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/jquery-image_reader/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/jquery-image_reader/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/jquery-image_reader/languages",
                "stargazers_url": "https://api.github.com/repos/distri/jquery-image_reader/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/jquery-image_reader/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/jquery-image_reader/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/jquery-image_reader/subscription",
                "commits_url": "https://api.github.com/repos/distri/jquery-image_reader/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/jquery-image_reader/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/jquery-image_reader/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/jquery-image_reader/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/jquery-image_reader/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/jquery-image_reader/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/jquery-image_reader/merges",
                "archive_url": "https://api.github.com/repos/distri/jquery-image_reader/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/jquery-image_reader/downloads",
                "issues_url": "https://api.github.com/repos/distri/jquery-image_reader/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/jquery-image_reader/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/jquery-image_reader/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/jquery-image_reader/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/jquery-image_reader/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/jquery-image_reader/releases{/id}",
                "created_at": "2012-06-02T07:12:27Z",
                "updated_at": "2013-11-29T21:02:52Z",
                "pushed_at": "2013-10-30T15:54:19Z",
                "git_url": "git://github.com/distri/jquery-image_reader.git",
                "ssh_url": "git@github.com:distri/jquery-image_reader.git",
                "clone_url": "https://github.com/distri/jquery-image_reader.git",
                "svn_url": "https://github.com/distri/jquery-image_reader",
                "homepage": null,
                "size": 142,
                "stargazers_count": 5,
                "watchers_count": 5,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 1,
                "mirror_url": null,
                "open_issues_count": 0,
                "forks": 1,
                "open_issues": 0,
                "watchers": 5,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 1,
                "subscribers_count": 1,
                "branch": "v0.2.0",
                "defaultBranch": "master"
              },
              "dependencies": {}
            }
          }
        },
        "sprite": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "sprite\n======\n\nSprites that can be drawn on an HTML5 canvas.\n",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "mode": "100644",
              "content": "Sprite\n======\n\nThe Sprite class provides a way to load images for use in games.\n\nA sprite is a still 2d image.\n\nAn animation can be created from a collection of sprites.\n\nBy default, images are loaded asynchronously. A proxy object is\nreturned immediately. Even though it has a draw method it will not\ndraw anything to the screen until the image has been loaded.\n\n    LoaderProxy = ->\n      draw: ->\n      fill: ->\n      width: null\n      height: null\n      image: null\n\nCache loaded images\n\n    spriteCache = {}\n\n    Sprite = (image, sourceX, sourceY, width, height) ->\n      sourceX ||= 0\n      sourceY ||= 0\n      width ||= image.width\n      height ||= image.height\n\nDraw this sprite on the given canvas at the given position.\n\n      draw: (canvas, x, y) ->\n        if x.x?\n          {x, y} = x\n\n        canvas.drawImage(\n          image,\n          sourceX,\n          sourceY,\n          width,\n          height,\n          x,\n          y,\n          width,\n          height\n        )\n\nDraw this sprite on the given canvas tiled to the x, y,\nwidth, and height dimensions specified.\n\nRepeat options can be `repeat-x`, `repeat-y`, `no-repeat`, or `repeat`. Defaults to `repeat`\n\n      fill: (canvas, x, y, width, height, repeat=\"repeat\") ->\n        pattern = canvas.createPattern(image, repeat)\n        canvas.drawRect({x, y, width, height, color: pattern})\n\n      width: width\n      height: height\n      image: image\n\nLoads all sprites from a sprite sheet found in\nyour images directory, specified by the name passed in.\n\nReturns an array of sprite objects which will start out empty, but be filled\nonce the image has loaded.\n\n    Sprite.loadSheet = (name, tileWidth, tileHeight) ->\n      url = ResourceLoader.urlFor(\"images\", name)\n\n      sprites = []\n      image = new Image()\n\n      image.onload = ->\n        imgElement = this\n        (image.height / tileHeight).times (row) ->\n          (image.width / tileWidth).times (col) ->\n            sprites.push(Sprite(imgElement, col * tileWidth, row * tileHeight, tileWidth, tileHeight))\n\n      image.src = url\n\n      return sprites\n\nLoads a sprite from a given url.\nA second optional callback parameter may be passet wich is executeh once the\nimage is loaded. The sprite proxy data is passed to it as the only parameter.\n\n    Sprite.fromURL = Sprite.load = (url, loadedCallback) ->\n      if sprite = spriteCache[url]\n        if loadedCallback?\n          defer loadedCallback, sprite\n\n        return sprite\n\n      spriteCache[url] = proxy = LoaderProxy()\n      img = new Image()\n\n      img.onload = ->\n        extend(proxy, Sprite(this))\n\n        loadedCallback?(proxy)\n\n      img.src = url\n\n      return proxy\n\nA sprite that draws nothing.\n\n    Sprite.EMPTY = Sprite.NONE = LoaderProxy()\n\n    module.exports = Sprite\n\nHelpers\n-------\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\n    defer = (fn, args...) ->\n      setTimeout ->\n        fn(args...)\n      , 1\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "version: \"0.3.0\"\n",
              "type": "blob"
            },
            "test/sprite.coffee": {
              "path": "test/sprite.coffee",
              "mode": "100644",
              "content": "Sprite = require \"../main\"\n\ndescribe \"Sprite\", ->\n  it \"should construct sprites\", ->\n    img = new Image\n\n    assert Sprite(img)\n\n  it \"should construct from data urls\", (done) ->\n    assert Sprite.load(\n      \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAACAAAAAgAIf6nJ0AAACGSURBVEjH7ZTRDYAgDEQP46wdgSEcgdncpX6IpsGUi4HGH+8POLhHSQGYFNpbXugBRImkU+cwwfcHJOpQ49LnrmGClaYS3gACL91RAMGL9CkEfV2d2OnIQII21aGY3wtScwoAMfN2XMJ6QcwtpTHuADYA+azHTRHzH4jz6rlSTK3Br18AcABNHBto+dslMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMS0wOC0yMFQxNDo1NjoxMi0wNzowMIGIK7sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDgtMjBUMTQ6NTY6MTItMDc6MDDw1ZMHAAAAAElFTkSuQmCC\",\n      ->\n        done()\n    )\n",
              "type": "blob"
            }
          },
          "distribution": {
            "main": {
              "path": "main",
              "content": "(function() {\n  var LoaderProxy, Sprite, defer, extend, spriteCache,\n    __slice = [].slice;\n\n  LoaderProxy = function() {\n    return {\n      draw: function() {},\n      fill: function() {},\n      width: null,\n      height: null,\n      image: null\n    };\n  };\n\n  spriteCache = {};\n\n  Sprite = function(image, sourceX, sourceY, width, height) {\n    sourceX || (sourceX = 0);\n    sourceY || (sourceY = 0);\n    width || (width = image.width);\n    height || (height = image.height);\n    return {\n      draw: function(canvas, x, y) {\n        var _ref;\n        if (x.x != null) {\n          _ref = x, x = _ref.x, y = _ref.y;\n        }\n        return canvas.drawImage(image, sourceX, sourceY, width, height, x, y, width, height);\n      },\n      fill: function(canvas, x, y, width, height, repeat) {\n        var pattern;\n        if (repeat == null) {\n          repeat = \"repeat\";\n        }\n        pattern = canvas.createPattern(image, repeat);\n        return canvas.drawRect({\n          x: x,\n          y: y,\n          width: width,\n          height: height,\n          color: pattern\n        });\n      },\n      width: width,\n      height: height,\n      image: image\n    };\n  };\n\n  Sprite.loadSheet = function(name, tileWidth, tileHeight) {\n    var image, sprites, url;\n    url = ResourceLoader.urlFor(\"images\", name);\n    sprites = [];\n    image = new Image();\n    image.onload = function() {\n      var imgElement;\n      imgElement = this;\n      return (image.height / tileHeight).times(function(row) {\n        return (image.width / tileWidth).times(function(col) {\n          return sprites.push(Sprite(imgElement, col * tileWidth, row * tileHeight, tileWidth, tileHeight));\n        });\n      });\n    };\n    image.src = url;\n    return sprites;\n  };\n\n  Sprite.fromURL = Sprite.load = function(url, loadedCallback) {\n    var img, proxy, sprite;\n    if (sprite = spriteCache[url]) {\n      if (loadedCallback != null) {\n        defer(loadedCallback, sprite);\n      }\n      return sprite;\n    }\n    spriteCache[url] = proxy = LoaderProxy();\n    img = new Image();\n    img.onload = function() {\n      extend(proxy, Sprite(this));\n      return typeof loadedCallback === \"function\" ? loadedCallback(proxy) : void 0;\n    };\n    img.src = url;\n    return proxy;\n  };\n\n  Sprite.EMPTY = Sprite.NONE = LoaderProxy();\n\n  module.exports = Sprite;\n\n  extend = function() {\n    var name, source, sources, target, _i, _len;\n    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = sources.length; _i < _len; _i++) {\n      source = sources[_i];\n      for (name in source) {\n        target[name] = source[name];\n      }\n    }\n    return target;\n  };\n\n  defer = function() {\n    var args, fn;\n    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    return setTimeout(function() {\n      return fn.apply(null, args);\n    }, 1);\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.3.0\"};",
              "type": "blob"
            },
            "test/sprite": {
              "path": "test/sprite",
              "content": "(function() {\n  var Sprite;\n\n  Sprite = require(\"../main\");\n\n  describe(\"Sprite\", function() {\n    it(\"should construct sprites\", function() {\n      var img;\n      img = new Image;\n      return assert(Sprite(img));\n    });\n    return it(\"should construct from data urls\", function(done) {\n      return assert(Sprite.load(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAACAAAAAgAIf6nJ0AAACGSURBVEjH7ZTRDYAgDEQP46wdgSEcgdncpX6IpsGUi4HGH+8POLhHSQGYFNpbXugBRImkU+cwwfcHJOpQ49LnrmGClaYS3gACL91RAMGL9CkEfV2d2OnIQII21aGY3wtScwoAMfN2XMJ6QcwtpTHuADYA+azHTRHzH4jz6rlSTK3Br18AcABNHBto+dslMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMS0wOC0yMFQxNDo1NjoxMi0wNzowMIGIK7sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDgtMjBUMTQ6NTY6MTItMDc6MDDw1ZMHAAAAAElFTkSuQmCC\", function() {\n        return done();\n      }));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/sprite.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.3.0",
          "entryPoint": "main",
          "repository": {
            "id": 14668729,
            "name": "sprite",
            "full_name": "distri/sprite",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/sprite",
            "description": "Sprites that can be drawn on an HTML5 canvas.",
            "fork": false,
            "url": "https://api.github.com/repos/distri/sprite",
            "forks_url": "https://api.github.com/repos/distri/sprite/forks",
            "keys_url": "https://api.github.com/repos/distri/sprite/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/sprite/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/sprite/teams",
            "hooks_url": "https://api.github.com/repos/distri/sprite/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/sprite/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/sprite/events",
            "assignees_url": "https://api.github.com/repos/distri/sprite/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/sprite/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/sprite/tags",
            "blobs_url": "https://api.github.com/repos/distri/sprite/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/sprite/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/sprite/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/sprite/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/sprite/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/sprite/languages",
            "stargazers_url": "https://api.github.com/repos/distri/sprite/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/sprite/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/sprite/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/sprite/subscription",
            "commits_url": "https://api.github.com/repos/distri/sprite/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/sprite/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/sprite/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/sprite/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/sprite/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/sprite/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/sprite/merges",
            "archive_url": "https://api.github.com/repos/distri/sprite/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/sprite/downloads",
            "issues_url": "https://api.github.com/repos/distri/sprite/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/sprite/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/sprite/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/sprite/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/sprite/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/sprite/releases{/id}",
            "created_at": "2013-11-24T20:34:55Z",
            "updated_at": "2013-11-29T20:33:05Z",
            "pushed_at": "2013-11-29T20:33:04Z",
            "git_url": "git://github.com/distri/sprite.git",
            "ssh_url": "git@github.com:distri/sprite.git",
            "clone_url": "https://github.com/distri/sprite.git",
            "svn_url": "https://github.com/distri/sprite",
            "homepage": null,
            "size": 136,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.3.0",
            "defaultBranch": "master"
          },
          "dependencies": {}
        },
        "touch-canvas": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "mode": "100644",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "mode": "100644",
              "content": "touch-canvas\n============\n\nA canvas you can touch\n",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "mode": "100644",
              "content": "entryPoint: \"touch_canvas\"\nversion: \"0.3.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n  \"http://strd6.github.io/tempest/javascripts/envweb.js\"\n]\ndependencies:\n  \"pixie-canvas\": \"distri/pixie-canvas:v0.9.1\"\n",
              "type": "blob"
            },
            "touch_canvas.coffee.md": {
              "path": "touch_canvas.coffee.md",
              "mode": "100644",
              "content": "Touch Canvas\n============\n\nA canvas element that reports mouse and touch events in the range [0, 1].\n\n    PixieCanvas = require \"pixie-canvas\"\n\nA number really close to 1. We should never actually return 1, but move events\nmay get a little fast and loose with exiting the canvas, so let's play it safe.\n\n    MAX = 0.999999999999\n\n    TouchCanvas = (I={}) ->\n      self = PixieCanvas I\n\n      Core(I, self)\n\n      self.include Bindable\n\n      element = self.element()\n\n      # Keep track of if the mouse is active in the element\n      active = false\n\nWhen we click within the canvas set the value for the position we clicked at.\n\n      $(element).on \"mousedown\", (e) ->\n        active = true\n\n        self.trigger \"touch\", localPosition(e)\n\nHandle touch starts\n\n      $(element).on \"touchstart\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"touch\", localPosition(touch)\n\nWhen the mouse moves apply a change for each x value in the intervening positions.\n\n      $(element).on \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle moves outside of the element.\n\n      $(document).on \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle touch moves.\n\n      $(element).on \"touchmove\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"move\", localPosition(touch)\n\nHandle releases.\n\n      $(element).on \"mouseup\", (e) ->\n        self.trigger \"release\", localPosition(e)\n        active = false\n\n        return\n\nHandle touch ends.\n\n      $(element).on \"touchend\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"release\", localPosition(touch)\n\nWhenever the mouse button is released from anywhere, deactivate. Be sure to\ntrigger the release event if the mousedown started within the element.\n\n      $(document).on \"mouseup\", (e) ->\n        if active\n          self.trigger \"release\", localPosition(e)\n\n        active = false\n\n        return\n\nHelpers\n-------\n\nProcess touches\n\n      processTouches = (event, fn) ->\n        event.preventDefault()\n\n        if event.type is \"touchend\"\n          # touchend doesn't have any touches, but does have changed touches\n          touches = event.changedTouches\n        else\n          touches = event.touches\n\n        self.debug? Array::map.call touches, ({identifier, pageX, pageY}) ->\n          \"[#{identifier}: #{pageX}, #{pageY} (#{event.type})]\\n\"\n\n        Array::forEach.call touches, fn\n\nLocal event position.\n\n      localPosition = (e) ->\n        $currentTarget = $(element)\n        offset = $currentTarget.offset()\n\n        width = $currentTarget.width()\n        height = $currentTarget.height()\n\n        point = Point(\n          ((e.pageX - offset.left) / width).clamp(0, MAX)\n          ((e.pageY - offset.top) / height).clamp(0, MAX)\n        )\n\n        # Add mouse into touch identifiers as 0\n        point.identifier = (e.identifier + 1) or 0\n\n        return point\n\nReturn self\n\n      return self\n\nExport\n\n    module.exports = TouchCanvas\n",
              "type": "blob"
            }
          },
          "distribution": {
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"entryPoint\":\"touch_canvas\",\"version\":\"0.3.0\",\"remoteDependencies\":[\"//code.jquery.com/jquery-1.10.1.min.js\",\"http://strd6.github.io/tempest/javascripts/envweb.js\"],\"dependencies\":{\"pixie-canvas\":\"distri/pixie-canvas:v0.9.1\"}};",
              "type": "blob"
            },
            "touch_canvas": {
              "path": "touch_canvas",
              "content": "(function() {\n  var MAX, PixieCanvas, TouchCanvas;\n\n  PixieCanvas = require(\"pixie-canvas\");\n\n  MAX = 0.999999999999;\n\n  TouchCanvas = function(I) {\n    var active, element, localPosition, processTouches, self;\n    if (I == null) {\n      I = {};\n    }\n    self = PixieCanvas(I);\n    Core(I, self);\n    self.include(Bindable);\n    element = self.element();\n    active = false;\n    $(element).on(\"mousedown\", function(e) {\n      active = true;\n      return self.trigger(\"touch\", localPosition(e));\n    });\n    $(element).on(\"touchstart\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"touch\", localPosition(touch));\n      });\n    });\n    $(element).on(\"mousemove\", function(e) {\n      if (active) {\n        return self.trigger(\"move\", localPosition(e));\n      }\n    });\n    $(document).on(\"mousemove\", function(e) {\n      if (active) {\n        return self.trigger(\"move\", localPosition(e));\n      }\n    });\n    $(element).on(\"touchmove\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"move\", localPosition(touch));\n      });\n    });\n    $(element).on(\"mouseup\", function(e) {\n      self.trigger(\"release\", localPosition(e));\n      active = false;\n    });\n    $(element).on(\"touchend\", function(e) {\n      return processTouches(event, function(touch) {\n        return self.trigger(\"release\", localPosition(touch));\n      });\n    });\n    $(document).on(\"mouseup\", function(e) {\n      if (active) {\n        self.trigger(\"release\", localPosition(e));\n      }\n      active = false;\n    });\n    processTouches = function(event, fn) {\n      var touches;\n      event.preventDefault();\n      if (event.type === \"touchend\") {\n        touches = event.changedTouches;\n      } else {\n        touches = event.touches;\n      }\n      if (typeof self.debug === \"function\") {\n        self.debug(Array.prototype.map.call(touches, function(_arg) {\n          var identifier, pageX, pageY;\n          identifier = _arg.identifier, pageX = _arg.pageX, pageY = _arg.pageY;\n          return \"[\" + identifier + \": \" + pageX + \", \" + pageY + \" (\" + event.type + \")]\\n\";\n        }));\n      }\n      return Array.prototype.forEach.call(touches, fn);\n    };\n    localPosition = function(e) {\n      var $currentTarget, height, offset, point, width;\n      $currentTarget = $(element);\n      offset = $currentTarget.offset();\n      width = $currentTarget.width();\n      height = $currentTarget.height();\n      point = Point(((e.pageX - offset.left) / width).clamp(0, MAX), ((e.pageY - offset.top) / height).clamp(0, MAX));\n      point.identifier = (e.identifier + 1) || 0;\n      return point;\n    };\n    return self;\n  };\n\n  module.exports = TouchCanvas;\n\n}).call(this);\n\n//# sourceURL=touch_canvas.coffee",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://strd6.github.io/editor/"
          },
          "version": "0.3.0",
          "entryPoint": "touch_canvas",
          "remoteDependencies": [
            "//code.jquery.com/jquery-1.10.1.min.js",
            "http://strd6.github.io/tempest/javascripts/envweb.js"
          ],
          "repository": {
            "id": 13783983,
            "name": "touch-canvas",
            "full_name": "distri/touch-canvas",
            "owner": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "private": false,
            "html_url": "https://github.com/distri/touch-canvas",
            "description": "A canvas you can touch",
            "fork": false,
            "url": "https://api.github.com/repos/distri/touch-canvas",
            "forks_url": "https://api.github.com/repos/distri/touch-canvas/forks",
            "keys_url": "https://api.github.com/repos/distri/touch-canvas/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/distri/touch-canvas/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/distri/touch-canvas/teams",
            "hooks_url": "https://api.github.com/repos/distri/touch-canvas/hooks",
            "issue_events_url": "https://api.github.com/repos/distri/touch-canvas/issues/events{/number}",
            "events_url": "https://api.github.com/repos/distri/touch-canvas/events",
            "assignees_url": "https://api.github.com/repos/distri/touch-canvas/assignees{/user}",
            "branches_url": "https://api.github.com/repos/distri/touch-canvas/branches{/branch}",
            "tags_url": "https://api.github.com/repos/distri/touch-canvas/tags",
            "blobs_url": "https://api.github.com/repos/distri/touch-canvas/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/distri/touch-canvas/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/distri/touch-canvas/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/distri/touch-canvas/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/distri/touch-canvas/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/distri/touch-canvas/languages",
            "stargazers_url": "https://api.github.com/repos/distri/touch-canvas/stargazers",
            "contributors_url": "https://api.github.com/repos/distri/touch-canvas/contributors",
            "subscribers_url": "https://api.github.com/repos/distri/touch-canvas/subscribers",
            "subscription_url": "https://api.github.com/repos/distri/touch-canvas/subscription",
            "commits_url": "https://api.github.com/repos/distri/touch-canvas/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/distri/touch-canvas/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/distri/touch-canvas/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/distri/touch-canvas/issues/comments/{number}",
            "contents_url": "https://api.github.com/repos/distri/touch-canvas/contents/{+path}",
            "compare_url": "https://api.github.com/repos/distri/touch-canvas/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/distri/touch-canvas/merges",
            "archive_url": "https://api.github.com/repos/distri/touch-canvas/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/distri/touch-canvas/downloads",
            "issues_url": "https://api.github.com/repos/distri/touch-canvas/issues{/number}",
            "pulls_url": "https://api.github.com/repos/distri/touch-canvas/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/distri/touch-canvas/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/distri/touch-canvas/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/distri/touch-canvas/labels{/name}",
            "releases_url": "https://api.github.com/repos/distri/touch-canvas/releases{/id}",
            "created_at": "2013-10-22T19:46:48Z",
            "updated_at": "2013-11-29T20:39:31Z",
            "pushed_at": "2013-11-29T20:38:52Z",
            "git_url": "git://github.com/distri/touch-canvas.git",
            "ssh_url": "git@github.com:distri/touch-canvas.git",
            "clone_url": "https://github.com/distri/touch-canvas.git",
            "svn_url": "https://github.com/distri/touch-canvas",
            "homepage": null,
            "size": 2900,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": "CoffeeScript",
            "has_issues": true,
            "has_downloads": true,
            "has_wiki": true,
            "forks_count": 0,
            "mirror_url": null,
            "open_issues_count": 0,
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "master",
            "master_branch": "master",
            "permissions": {
              "admin": true,
              "push": true,
              "pull": true
            },
            "organization": {
              "login": "distri",
              "id": 6005125,
              "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
              "gravatar_id": null,
              "url": "https://api.github.com/users/distri",
              "html_url": "https://github.com/distri",
              "followers_url": "https://api.github.com/users/distri/followers",
              "following_url": "https://api.github.com/users/distri/following{/other_user}",
              "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
              "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
              "organizations_url": "https://api.github.com/users/distri/orgs",
              "repos_url": "https://api.github.com/users/distri/repos",
              "events_url": "https://api.github.com/users/distri/events{/privacy}",
              "received_events_url": "https://api.github.com/users/distri/received_events",
              "type": "Organization",
              "site_admin": false
            },
            "network_count": 0,
            "subscribers_count": 1,
            "branch": "v0.3.0",
            "defaultBranch": "master"
          },
          "dependencies": {
            "pixie-canvas": {
              "source": {
                "pixie.cson": {
                  "path": "pixie.cson",
                  "mode": "100644",
                  "content": "entryPoint: \"pixie_canvas\"\nversion: \"0.9.1\"\n",
                  "type": "blob"
                },
                "pixie_canvas.coffee.md": {
                  "path": "pixie_canvas.coffee.md",
                  "mode": "100644",
                  "content": "Pixie Canvas\n============\n\nPixieCanvas provides a convenient wrapper for working with Context2d.\n\nMethods try to be as flexible as possible as to what arguments they take.\n\nNon-getter methods return `this` for method chaining.\n\n    TAU = 2 * Math.PI\n\n    module.exports = (options={}) ->\n        defaults options,\n          width: 400\n          height: 400\n          init: ->\n\n        canvas = document.createElement \"canvas\"\n        canvas.width = options.width\n        canvas.height = options.height\n\n        context = undefined\n\n        self =\n\n`clear` clears the entire canvas (or a portion of it).\n\nTo clear the entire canvas use `canvas.clear()`\n\n>     #! paint\n>     # Set up: Fill canvas with blue\n>     canvas.fill(\"blue\")\n>\n>     # Clear a portion of the canvas\n>     canvas.clear\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n\n          clear: ({x, y, width, height}={}) ->\n            x ?= 0\n            y ?= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            context.clearRect(x, y, width, height)\n\n            return this\n\nFills the entire canvas (or a specified section of it) with\nthe given color.\n\n>     #! paint\n>     # Paint the town (entire canvas) red\n>     canvas.fill \"red\"\n>\n>     # Fill a section of the canvas white (#FFF)\n>     canvas.fill\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#FFF\"\n\n          fill: (color={}) ->\n            unless (typeof color is \"string\") or color.channels\n              {x, y, width, height, bounds, color} = color\n\n            {x, y, width, height} = bounds if bounds\n\n            x ||= 0\n            y ||= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            @fillColor(color)\n            context.fillRect(x, y, width, height)\n\n            return this\n\nA direct map to the Context2d draw image. `GameObject`s\nthat implement drawable will have this wrapped up nicely,\nso there is a good chance that you will not have to deal with\nit directly.\n\n>     #! paint\n>     $ \"<img>\",\n>       src: \"https://secure.gravatar.com/avatar/33117162fff8a9cf50544a604f60c045\"\n>       load: ->\n>         canvas.drawImage(this, 25, 25)\n\n          drawImage: (args...) ->\n            context.drawImage(args...)\n\n            return this\n\nDraws a circle at the specified position with the specified\nradius and color.\n\n>     #! paint\n>     # Draw a large orange circle\n>     canvas.drawCircle\n>       radius: 30\n>       position: Point(100, 75)\n>       color: \"orange\"\n>\n>     # You may also set a stroke\n>     canvas.drawCircle\n>       x: 25\n>       y: 50\n>       radius: 10\n>       color: \"blue\"\n>       stroke:\n>         color: \"red\"\n>         width: 1\n\nYou can pass in circle objects as well.\n\n>     #! paint\n>     # Create a circle object to set up the next examples\n>     circle =\n>       radius: 20\n>       x: 50\n>       y: 50\n>\n>     # Draw a given circle in yellow\n>     canvas.drawCircle\n>       circle: circle\n>       color: \"yellow\"\n>\n>     # Draw the circle in green at a different position\n>     canvas.drawCircle\n>       circle: circle\n>       position: Point(25, 75)\n>       color: \"green\"\n\nYou may set a stroke, or even pass in only a stroke to draw an unfilled circle.\n\n>     #! paint\n>     # Draw an outline circle in purple.\n>     canvas.drawCircle\n>       x: 50\n>       y: 75\n>       radius: 10\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n>\n\n          drawCircle: ({x, y, radius, position, color, stroke, circle}) ->\n            {x, y, radius} = circle if circle\n            {x, y} = position if position\n\n            radius = 0 if radius < 0\n\n            context.beginPath()\n            context.arc(x, y, radius, 0, TAU, true)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return this\n\nDraws a rectangle at the specified position with given\nwidth and height. Optionally takes a position, bounds\nand color argument.\n\n\n          drawRect: ({x, y, width, height, position, bounds, color, stroke}) ->\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            if color\n              @fillColor(color)\n              context.fillRect(x, y, width, height)\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.strokeRect(x, y, width, height)\n\n            return @\n\n>     #! paint\n>     # Draw a red rectangle using x, y, width and height\n>     canvas.drawRect\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#F00\"\n\n----\n\nYou can mix and match position, witdth and height.\n\n>     #! paint\n>     canvas.drawRect\n>       position: Point(0, 0)\n>       width: 50\n>       height: 50\n>       color: \"blue\"\n>       stroke:\n>         color: \"orange\"\n>         width: 3\n\n----\n\nA bounds can be reused to draw multiple rectangles.\n\n>     #! paint\n>     bounds =\n>       x: 100\n>       y: 0\n>       width: 100\n>       height: 100\n>\n>     # Draw a purple rectangle using bounds\n>     canvas.drawRect\n>       bounds: bounds\n>       color: \"green\"\n>\n>     # Draw the outline of the same bounds, but at a different position\n>     canvas.drawRect\n>       bounds: bounds\n>       position: Point(0, 50)\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n\n----\n\nDraw a line from `start` to `end`.\n\n>     #! paint\n>     # Draw a sweet diagonal\n>     canvas.drawLine\n>       start: Point(0, 0)\n>       end: Point(200, 200)\n>       color: \"purple\"\n>\n>     # Draw another sweet diagonal\n>     canvas.drawLine\n>       start: Point(200, 0)\n>       end: Point(0, 200)\n>       color: \"red\"\n>       width: 6\n>\n>     # Now draw a sweet horizontal with a direction and a length\n>     canvas.drawLine\n>       start: Point(0, 100)\n>       length: 200\n>       direction: Point(1, 0)\n>       color: \"orange\"\n\n          drawLine: ({start, end, width, color, direction, length}) ->\n            width ||= 3\n\n            if direction\n              end = direction.norm(length).add(start)\n\n            @lineWidth(width)\n            @strokeColor(color)\n\n            context.beginPath()\n            context.moveTo(start.x, start.y)\n            context.lineTo(end.x, end.y)\n            context.closePath()\n            context.stroke()\n\n            return this\n\nDraw a polygon.\n\n>     #! paint\n>     # Draw a sweet rhombus\n>     canvas.drawPoly\n>       points: [\n>         Point(50, 25)\n>         Point(75, 50)\n>         Point(50, 75)\n>         Point(25, 50)\n>       ]\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawPoly: ({points, color, stroke}) ->\n            context.beginPath()\n            points.forEach (point, i) ->\n              if i == 0\n                context.moveTo(point.x, point.y)\n              else\n                context.lineTo(point.x, point.y)\n            context.lineTo points[0].x, points[0].y\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return @\n\nDraw a rounded rectangle.\n\nAdapted from http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html\n\n>     #! paint\n>     # Draw a purple rounded rectangle with a red outline\n>     canvas.drawRoundRect\n>       position: Point(25, 25)\n>       radius: 10\n>       width: 150\n>       height: 100\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawRoundRect: ({x, y, width, height, radius, position, bounds, color, stroke}) ->\n            radius = 5 unless radius?\n\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            context.beginPath()\n            context.moveTo(x + radius, y)\n            context.lineTo(x + width - radius, y)\n            context.quadraticCurveTo(x + width, y, x + width, y + radius)\n            context.lineTo(x + width, y + height - radius)\n            context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)\n            context.lineTo(x + radius, y + height)\n            context.quadraticCurveTo(x, y + height, x, y + height - radius)\n            context.lineTo(x, y + radius)\n            context.quadraticCurveTo(x, y, x + radius, y)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @lineWidth(stroke.width)\n              @strokeColor(stroke.color)\n              context.stroke()\n\n            return this\n\nDraws text on the canvas at the given position, in the given color.\nIf no color is given then the previous fill color is used.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: '#eee'\n>\n>     # A line to indicate the baseline\n>     canvas.drawLine\n>       start: Point(25, 50)\n>       end: Point(125, 50)\n>       color: \"#333\"\n>       width: 1\n>\n>     # Draw some text, note the position of the baseline\n>     canvas.drawText\n>       position: Point(25, 50)\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n\n\n          drawText: ({x, y, text, position, color, font}) ->\n            {x, y} = position if position\n\n            @fillColor(color)\n            @font(font) if font\n            context.fillText(text, x, y)\n\n            return this\n\nCenters the given text on the canvas at the given y position. An x position\nor point position can also be given in which case the text is centered at the\nx, y or position value specified.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: \"#eee\"\n>\n>     # Center text on the screen at y value 25\n>     canvas.centerText\n>       y: 25\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n>\n>     # Center text at point (75, 75)\n>     canvas.centerText\n>       position: Point(75, 75)\n>       color: \"green\"\n>       text: \"take this\"\n\n          centerText: ({text, x, y, position, color, font}) ->\n            {x, y} = position if position\n\n            x = canvas.width / 2 unless x?\n\n            textWidth = @measureText(text)\n\n            @drawText {\n              text\n              color\n              font\n              x: x - (textWidth) / 2\n              y\n            }\n\nSetting the fill color:\n\n`canvas.fillColor(\"#FF0000\")`\n\nPassing no arguments returns the fillColor:\n\n`canvas.fillColor() # => \"#FF000000\"`\n\nYou can also pass a Color object:\n\n`canvas.fillColor(Color('sky blue'))`\n\n          fillColor: (color) ->\n            if color\n              if color.channels\n                context.fillStyle = color.toString()\n              else\n                context.fillStyle = color\n\n              return @\n            else\n              return context.fillStyle\n\nSetting the stroke color:\n\n`canvas.strokeColor(\"#FF0000\")`\n\nPassing no arguments returns the strokeColor:\n\n`canvas.strokeColor() # => \"#FF0000\"`\n\nYou can also pass a Color object:\n\n`canvas.strokeColor(Color('sky blue'))`\n\n          strokeColor: (color) ->\n            if color\n              if color.channels\n                context.strokeStyle = color.toString()\n              else\n                context.strokeStyle = color\n\n              return this\n            else\n              return context.strokeStyle\n\nDetermine how wide some text is.\n\n`canvas.measureText('Hello World!') # => 55`\n\nIt may have accuracy issues depending on the font used.\n\n          measureText: (text) ->\n            context.measureText(text).width\n\nPasses this canvas to the block with the given matrix transformation\napplied. All drawing methods called within the block will draw\ninto the canvas with the transformation applied. The transformation\nis removed at the end of the block, even if the block throws an error.\n\n          withTransform: (matrix, block) ->\n            context.save()\n\n            context.transform(\n              matrix.a,\n              matrix.b,\n              matrix.c,\n              matrix.d,\n              matrix.tx,\n              matrix.ty\n            )\n\n            try\n              block(this)\n            finally\n              context.restore()\n\n            return this\n\nStraight proxy to context `putImageData` method.\n\n          putImageData: (args...) ->\n            context.putImageData(args...)\n\n            return this\n\nContext getter.\n\n          context: ->\n            context\n\nGetter for the actual html canvas element.\n\n          element: ->\n            canvas\n\nStraight proxy to context pattern creation.\n\n          createPattern: (image, repitition) ->\n            context.createPattern(image, repitition)\n\nSet a clip rectangle.\n\n          clip: (x, y, width, height) ->\n            context.beginPath()\n            context.rect(x, y, width, height)\n            context.clip()\n\n            return this\n\nGenerate accessors that get properties from the context object.\n\n        contextAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                context[attr] = newVal\n                return @\n              else\n                context[attr]\n\n        contextAttrAccessor(\n          \"font\",\n          \"globalAlpha\",\n          \"globalCompositeOperation\",\n          \"lineWidth\",\n          \"textAlign\",\n        )\n\nGenerate accessors that get properties from the canvas object.\n\n        canvasAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                canvas[attr] = newVal\n                return @\n              else\n                canvas[attr]\n\n        canvasAttrAccessor(\n          \"height\",\n          \"width\",\n        )\n\n        context = canvas.getContext('2d')\n\n        options.init(self)\n\n        return self\n\nDepend on either jQuery or Zepto for now (TODO: Don't depend on either)\n\nHelpers\n-------\n\nFill in default properties for an object, setting them only if they are not\nalready present.\n\n    defaults = (target, objects...) ->\n      for object in objects\n        for name of object\n          unless target.hasOwnProperty(name)\n            target[name] = object[name]\n\n      return target\n\nInteractive Examples\n--------------------\n\n>     #! setup\n>     Canvas = require \"/pixie_canvas\"\n>\n>     window.Point ?= (x, y) ->\n>       x: x\n>       y: y\n>\n>     Interactive.register \"paint\", ({source, runtimeElement}) ->\n>       canvas = Canvas\n>         width: 400\n>         height: 200\n>\n>       code = CoffeeScript.compile(source)\n>\n>       runtimeElement.empty().append canvas.element()\n>       Function(\"canvas\", code)(canvas)\n",
                  "type": "blob"
                },
                "test/test.coffee": {
                  "path": "test/test.coffee",
                  "mode": "100644",
                  "content": "Canvas = require \"../pixie_canvas\"\n\ndescribe \"pixie canvas\", ->\n  it \"Should create a canvas\", ->\n    canvas = Canvas\n      width: 400\n      height: 150\n\n    assert canvas\n    \n    assert canvas.width() is 400\n",
                  "type": "blob"
                }
              },
              "distribution": {
                "pixie": {
                  "path": "pixie",
                  "content": "module.exports = {\"entryPoint\":\"pixie_canvas\",\"version\":\"0.9.1\"};",
                  "type": "blob"
                },
                "pixie_canvas": {
                  "path": "pixie_canvas",
                  "content": "(function() {\n  var TAU, defaults,\n    __slice = [].slice;\n\n  TAU = 2 * Math.PI;\n\n  module.exports = function(options) {\n    var canvas, canvasAttrAccessor, context, contextAttrAccessor, self;\n    if (options == null) {\n      options = {};\n    }\n    defaults(options, {\n      width: 400,\n      height: 400,\n      init: function() {}\n    });\n    canvas = document.createElement(\"canvas\");\n    canvas.width = options.width;\n    canvas.height = options.height;\n    context = void 0;\n    self = {\n      clear: function(_arg) {\n        var height, width, x, y, _ref;\n        _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height;\n        if (x == null) {\n          x = 0;\n        }\n        if (y == null) {\n          y = 0;\n        }\n        if (width == null) {\n          width = canvas.width;\n        }\n        if (height == null) {\n          height = canvas.height;\n        }\n        context.clearRect(x, y, width, height);\n        return this;\n      },\n      fill: function(color) {\n        var bounds, height, width, x, y, _ref;\n        if (color == null) {\n          color = {};\n        }\n        if (!((typeof color === \"string\") || color.channels)) {\n          _ref = color, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height, bounds = _ref.bounds, color = _ref.color;\n        }\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        x || (x = 0);\n        y || (y = 0);\n        if (width == null) {\n          width = canvas.width;\n        }\n        if (height == null) {\n          height = canvas.height;\n        }\n        this.fillColor(color);\n        context.fillRect(x, y, width, height);\n        return this;\n      },\n      drawImage: function() {\n        var args;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        context.drawImage.apply(context, args);\n        return this;\n      },\n      drawCircle: function(_arg) {\n        var circle, color, position, radius, stroke, x, y;\n        x = _arg.x, y = _arg.y, radius = _arg.radius, position = _arg.position, color = _arg.color, stroke = _arg.stroke, circle = _arg.circle;\n        if (circle) {\n          x = circle.x, y = circle.y, radius = circle.radius;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (radius < 0) {\n          radius = 0;\n        }\n        context.beginPath();\n        context.arc(x, y, radius, 0, TAU, true);\n        context.closePath();\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.stroke();\n        }\n        return this;\n      },\n      drawRect: function(_arg) {\n        var bounds, color, height, position, stroke, width, x, y;\n        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (color) {\n          this.fillColor(color);\n          context.fillRect(x, y, width, height);\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.strokeRect(x, y, width, height);\n        }\n        return this;\n      },\n      drawLine: function(_arg) {\n        var color, direction, end, length, start, width;\n        start = _arg.start, end = _arg.end, width = _arg.width, color = _arg.color, direction = _arg.direction, length = _arg.length;\n        width || (width = 3);\n        if (direction) {\n          end = direction.norm(length).add(start);\n        }\n        this.lineWidth(width);\n        this.strokeColor(color);\n        context.beginPath();\n        context.moveTo(start.x, start.y);\n        context.lineTo(end.x, end.y);\n        context.closePath();\n        context.stroke();\n        return this;\n      },\n      drawPoly: function(_arg) {\n        var color, points, stroke;\n        points = _arg.points, color = _arg.color, stroke = _arg.stroke;\n        context.beginPath();\n        points.forEach(function(point, i) {\n          if (i === 0) {\n            return context.moveTo(point.x, point.y);\n          } else {\n            return context.lineTo(point.x, point.y);\n          }\n        });\n        context.lineTo(points[0].x, points[0].y);\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.strokeColor(stroke.color);\n          this.lineWidth(stroke.width);\n          context.stroke();\n        }\n        return this;\n      },\n      drawRoundRect: function(_arg) {\n        var bounds, color, height, position, radius, stroke, width, x, y;\n        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, radius = _arg.radius, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;\n        if (radius == null) {\n          radius = 5;\n        }\n        if (bounds) {\n          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;\n        }\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        context.beginPath();\n        context.moveTo(x + radius, y);\n        context.lineTo(x + width - radius, y);\n        context.quadraticCurveTo(x + width, y, x + width, y + radius);\n        context.lineTo(x + width, y + height - radius);\n        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);\n        context.lineTo(x + radius, y + height);\n        context.quadraticCurveTo(x, y + height, x, y + height - radius);\n        context.lineTo(x, y + radius);\n        context.quadraticCurveTo(x, y, x + radius, y);\n        context.closePath();\n        if (color) {\n          this.fillColor(color);\n          context.fill();\n        }\n        if (stroke) {\n          this.lineWidth(stroke.width);\n          this.strokeColor(stroke.color);\n          context.stroke();\n        }\n        return this;\n      },\n      drawText: function(_arg) {\n        var color, font, position, text, x, y;\n        x = _arg.x, y = _arg.y, text = _arg.text, position = _arg.position, color = _arg.color, font = _arg.font;\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        this.fillColor(color);\n        if (font) {\n          this.font(font);\n        }\n        context.fillText(text, x, y);\n        return this;\n      },\n      centerText: function(_arg) {\n        var color, font, position, text, textWidth, x, y;\n        text = _arg.text, x = _arg.x, y = _arg.y, position = _arg.position, color = _arg.color, font = _arg.font;\n        if (position) {\n          x = position.x, y = position.y;\n        }\n        if (x == null) {\n          x = canvas.width / 2;\n        }\n        textWidth = this.measureText(text);\n        return this.drawText({\n          text: text,\n          color: color,\n          font: font,\n          x: x - textWidth / 2,\n          y: y\n        });\n      },\n      fillColor: function(color) {\n        if (color) {\n          if (color.channels) {\n            context.fillStyle = color.toString();\n          } else {\n            context.fillStyle = color;\n          }\n          return this;\n        } else {\n          return context.fillStyle;\n        }\n      },\n      strokeColor: function(color) {\n        if (color) {\n          if (color.channels) {\n            context.strokeStyle = color.toString();\n          } else {\n            context.strokeStyle = color;\n          }\n          return this;\n        } else {\n          return context.strokeStyle;\n        }\n      },\n      measureText: function(text) {\n        return context.measureText(text).width;\n      },\n      withTransform: function(matrix, block) {\n        context.save();\n        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);\n        try {\n          block(this);\n        } finally {\n          context.restore();\n        }\n        return this;\n      },\n      putImageData: function() {\n        var args;\n        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n        context.putImageData.apply(context, args);\n        return this;\n      },\n      context: function() {\n        return context;\n      },\n      element: function() {\n        return canvas;\n      },\n      createPattern: function(image, repitition) {\n        return context.createPattern(image, repitition);\n      },\n      clip: function(x, y, width, height) {\n        context.beginPath();\n        context.rect(x, y, width, height);\n        context.clip();\n        return this;\n      }\n    };\n    contextAttrAccessor = function() {\n      var attrs;\n      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return attrs.forEach(function(attr) {\n        return self[attr] = function(newVal) {\n          if (newVal != null) {\n            context[attr] = newVal;\n            return this;\n          } else {\n            return context[attr];\n          }\n        };\n      });\n    };\n    contextAttrAccessor(\"font\", \"globalAlpha\", \"globalCompositeOperation\", \"lineWidth\", \"textAlign\");\n    canvasAttrAccessor = function() {\n      var attrs;\n      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      return attrs.forEach(function(attr) {\n        return self[attr] = function(newVal) {\n          if (newVal != null) {\n            canvas[attr] = newVal;\n            return this;\n          } else {\n            return canvas[attr];\n          }\n        };\n      });\n    };\n    canvasAttrAccessor(\"height\", \"width\");\n    context = canvas.getContext('2d');\n    options.init(self);\n    return self;\n  };\n\n  defaults = function() {\n    var name, object, objects, target, _i, _len;\n    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = objects.length; _i < _len; _i++) {\n      object = objects[_i];\n      for (name in object) {\n        if (!target.hasOwnProperty(name)) {\n          target[name] = object[name];\n        }\n      }\n    }\n    return target;\n  };\n\n}).call(this);\n\n//# sourceURL=pixie_canvas.coffee",
                  "type": "blob"
                },
                "test/test": {
                  "path": "test/test",
                  "content": "(function() {\n  var Canvas;\n\n  Canvas = require(\"../pixie_canvas\");\n\n  describe(\"pixie canvas\", function() {\n    return it(\"Should create a canvas\", function() {\n      var canvas;\n      canvas = Canvas({\n        width: 400,\n        height: 150\n      });\n      assert(canvas);\n      return assert(canvas.width() === 400);\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/test.coffee",
                  "type": "blob"
                }
              },
              "progenitor": {
                "url": "http://strd6.github.io/editor/"
              },
              "version": "0.9.1",
              "entryPoint": "pixie_canvas",
              "repository": {
                "id": 12096899,
                "name": "pixie-canvas",
                "full_name": "distri/pixie-canvas",
                "owner": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "private": false,
                "html_url": "https://github.com/distri/pixie-canvas",
                "description": "A pretty ok HTML5 canvas wrapper",
                "fork": false,
                "url": "https://api.github.com/repos/distri/pixie-canvas",
                "forks_url": "https://api.github.com/repos/distri/pixie-canvas/forks",
                "keys_url": "https://api.github.com/repos/distri/pixie-canvas/keys{/key_id}",
                "collaborators_url": "https://api.github.com/repos/distri/pixie-canvas/collaborators{/collaborator}",
                "teams_url": "https://api.github.com/repos/distri/pixie-canvas/teams",
                "hooks_url": "https://api.github.com/repos/distri/pixie-canvas/hooks",
                "issue_events_url": "https://api.github.com/repos/distri/pixie-canvas/issues/events{/number}",
                "events_url": "https://api.github.com/repos/distri/pixie-canvas/events",
                "assignees_url": "https://api.github.com/repos/distri/pixie-canvas/assignees{/user}",
                "branches_url": "https://api.github.com/repos/distri/pixie-canvas/branches{/branch}",
                "tags_url": "https://api.github.com/repos/distri/pixie-canvas/tags",
                "blobs_url": "https://api.github.com/repos/distri/pixie-canvas/git/blobs{/sha}",
                "git_tags_url": "https://api.github.com/repos/distri/pixie-canvas/git/tags{/sha}",
                "git_refs_url": "https://api.github.com/repos/distri/pixie-canvas/git/refs{/sha}",
                "trees_url": "https://api.github.com/repos/distri/pixie-canvas/git/trees{/sha}",
                "statuses_url": "https://api.github.com/repos/distri/pixie-canvas/statuses/{sha}",
                "languages_url": "https://api.github.com/repos/distri/pixie-canvas/languages",
                "stargazers_url": "https://api.github.com/repos/distri/pixie-canvas/stargazers",
                "contributors_url": "https://api.github.com/repos/distri/pixie-canvas/contributors",
                "subscribers_url": "https://api.github.com/repos/distri/pixie-canvas/subscribers",
                "subscription_url": "https://api.github.com/repos/distri/pixie-canvas/subscription",
                "commits_url": "https://api.github.com/repos/distri/pixie-canvas/commits{/sha}",
                "git_commits_url": "https://api.github.com/repos/distri/pixie-canvas/git/commits{/sha}",
                "comments_url": "https://api.github.com/repos/distri/pixie-canvas/comments{/number}",
                "issue_comment_url": "https://api.github.com/repos/distri/pixie-canvas/issues/comments/{number}",
                "contents_url": "https://api.github.com/repos/distri/pixie-canvas/contents/{+path}",
                "compare_url": "https://api.github.com/repos/distri/pixie-canvas/compare/{base}...{head}",
                "merges_url": "https://api.github.com/repos/distri/pixie-canvas/merges",
                "archive_url": "https://api.github.com/repos/distri/pixie-canvas/{archive_format}{/ref}",
                "downloads_url": "https://api.github.com/repos/distri/pixie-canvas/downloads",
                "issues_url": "https://api.github.com/repos/distri/pixie-canvas/issues{/number}",
                "pulls_url": "https://api.github.com/repos/distri/pixie-canvas/pulls{/number}",
                "milestones_url": "https://api.github.com/repos/distri/pixie-canvas/milestones{/number}",
                "notifications_url": "https://api.github.com/repos/distri/pixie-canvas/notifications{?since,all,participating}",
                "labels_url": "https://api.github.com/repos/distri/pixie-canvas/labels{/name}",
                "releases_url": "https://api.github.com/repos/distri/pixie-canvas/releases{/id}",
                "created_at": "2013-08-14T01:15:34Z",
                "updated_at": "2013-11-29T20:35:57Z",
                "pushed_at": "2013-11-29T20:34:09Z",
                "git_url": "git://github.com/distri/pixie-canvas.git",
                "ssh_url": "git@github.com:distri/pixie-canvas.git",
                "clone_url": "https://github.com/distri/pixie-canvas.git",
                "svn_url": "https://github.com/distri/pixie-canvas",
                "homepage": null,
                "size": 2464,
                "stargazers_count": 0,
                "watchers_count": 0,
                "language": "CoffeeScript",
                "has_issues": true,
                "has_downloads": true,
                "has_wiki": true,
                "forks_count": 0,
                "mirror_url": null,
                "open_issues_count": 1,
                "forks": 0,
                "open_issues": 1,
                "watchers": 0,
                "default_branch": "master",
                "master_branch": "master",
                "permissions": {
                  "admin": true,
                  "push": true,
                  "pull": true
                },
                "organization": {
                  "login": "distri",
                  "id": 6005125,
                  "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
                  "gravatar_id": null,
                  "url": "https://api.github.com/users/distri",
                  "html_url": "https://github.com/distri",
                  "followers_url": "https://api.github.com/users/distri/followers",
                  "following_url": "https://api.github.com/users/distri/following{/other_user}",
                  "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
                  "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
                  "organizations_url": "https://api.github.com/users/distri/orgs",
                  "repos_url": "https://api.github.com/users/distri/repos",
                  "events_url": "https://api.github.com/users/distri/events{/privacy}",
                  "received_events_url": "https://api.github.com/users/distri/received_events",
                  "type": "Organization",
                  "site_admin": false
                },
                "network_count": 0,
                "subscribers_count": 1,
                "branch": "v0.9.1",
                "defaultBranch": "master"
              },
              "dependencies": {}
            }
          }
        }
      }
    }
  }
});