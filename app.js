;(function(PACKAGE) {
var oldRequire = window.Require;
(function() {
  var cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(parentModule, pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(parentModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, module, program, values;
    if (!(program = pkg.distribution[path])) {
      throw "Could not find program at " + path + " in " + pkg.name;
    }
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    program.apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        return loadPackage(rootModule, otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

}).call(this);

//# sourceURL=require.coffee
var require = Require.generateFor(PACKAGE);
window.Require = oldRequire;
require('./main')
})({"source":{"TODO.md":{"path":"TODO.md","mode":"100644","content":"TODO\n====\n\nTitle Screen\n- Game States\n\nVolume Controls (Mute)\n\nDisplay Gameplay Controls\n\nLink to edit code in Editor\n- Editor needs to be able to be loaded from iframe/popup and load a package to edit\n\nLinks to Docs\n\nFix preloader for Audio\n","type":"blob"},"base.coffee.md":{"path":"base.coffee.md","mode":"100644","content":"Base\n====\n\nA common base class for our objects to inherit from.\n\n    {GameObject} = require \"dust\"\n\n    module.exports = (I) ->\n\n      self = GameObject(I).extend\n        center: ->\n           Point(I.x, I.y)\n\n      self.on \"drawDebug\", (canvas) ->\n        if I.radius\n          center = self.center()\n          x = center.x\n          y = center.y\n\n          canvas.drawCircle\n            x: x\n            y: y\n            radius: I.radius\n            color: \"rgba(255, 0, 255, 0.5)\"\n\n      self\n","type":"blob"},"bounds_extensions.coffee.md":{"path":"bounds_extensions.coffee.md","mode":"100644","content":"Bounds Extensions\n=================\n\n    module.exports = (I={}, self) ->\n      self.extend\n        top: ->\n          I.y - I.height/2\n        bottom: ->\n          I.y + I.height/2\n\n      return self\n","type":"blob"},"cloud.coffee.md":{"path":"cloud.coffee.md","mode":"100644","content":"Cloud\n=====\n\nJust floating along in the background.\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    module.exports = GameObject.registry.Cloud = (I) ->\n      defaults I,\n        spriteName: \"cloud\"\n        height: 32\n        width: 128\n        y: -120 + rand(240)\n        zIndex: 1\n\n      self = Base(I)\n\n      self.on \"update\", ->\n        destruction = engine.find(\".destruction\").first()\n\n        if destruction\n          if I.x < destruction.I.x - I.width\n            I.active = false\n\n      self\n","type":"blob"},"destruction.coffee.md":{"path":"destruction.coffee.md","mode":"100644","content":"Destruction\n===========\n\nA rogue wave that will crush the player.\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    {width, height} = require \"./pixie\"\n\n    churnSprites = [Sprite.loadByName(\"churn\")]\n    waveSprites = [\"wave\", \"wave1\"].map (name) ->\n      Sprite.loadByName name\n\n    module.exports = GameObject.registry.Destruction = (I={}) ->\n      defaults I,\n        color: \"red\"\n        destruction: true\n        x: -240\n        y: 0\n        width: 10\n        height: height\n        zIndex: 7\n\n      self = GameObject(I)\n\n      self.attrAccessor \"destruction\"\n\n      self.on \"update\", (dt) ->\n        osc = 30 * Math.sin(Math.TAU * I.age)\n        I.x += (osc + 90) * dt\n\n        if player = engine.find(\"Player\").first()\n          I.x = I.x.clamp(player.I.x - width/2 + osc, Infinity)\n\n      self.on \"draw\", (canvas) ->\n        waveSprites.wrap((I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height)\n        churnSprites.wrap((I.age / 8).floor()).fill(canvas, 0, 0, 32, height)\n","type":"blob"},"duct_tape.coffee.md":{"path":"duct_tape.coffee.md","mode":"100644","content":"Duct Tape\n=========\n\nLoad Sprites by named resource.\n\n    {Util:{extend}, GameObject} = require \"dust\"\n    images = require \"./images\"\n\n    GameObject.defaultModules.push require \"./bounds_extensions\"\n\n    Sprite.loadByName = (name) ->\n      url = images[name]\n\n      Sprite.load(url)\n\n    extend Number.prototype,\n      approach: (target, maxDelta) ->\n        this + (target - this).clamp(-maxDelta, maxDelta)\n\n      approachByRatio: (target, ratio) ->\n        @approach(target, this * ratio)\n\n      # TODO: Provide this safety for all number extensions\n      floor: ->\n        if isNaN(this)\n          throw \"Can't floor NaN\"\n        else\n          Math.floor(this)\n","type":"blob"},"game_over.coffee.md":{"path":"game_over.coffee.md","mode":"100644","content":"Game Over\n=========\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    module.exports = GameObject.registry.GameOver = (I={}) ->\n      defaults I,\n        zIndex: 10\n\n      lineHeight = 24\n\n      self = GameObject(I)\n\n      self.off \"draw\"\n      self.on \"overlay\", (canvas) ->\n\n        # TODO: Extract multiline text rendering\n        lines = \"\"\"\n          surf'd for #{(I.distance / 100).toFixed(2)} meters\n          sur5'd for #{I.time.toFixed(2)} seconds\n          succumb'd to #{I.causeOfDeath}\n        \"\"\".split(\"\\n\")\n\n        canvas.font \"24px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif\"\n\n        lines.forEach (line, i) ->\n          canvas.centerText\n            color: \"#FFF\"\n            text: line\n            y: 160 - (lines.length/2 - i) * lineHeight\n\n      self.on \"update\", ->\n        if keydown.space or keydown.return or keydown.escape\n          engine.trigger \"restart\"\n\n      return self\n","type":"blob"},"images.json":{"path":"images.json","mode":"100644","content":"{\n  \"churn\": \"http://a0.pixiecdn.com/surfn/images/churn.png\",\n  \"cloud\": \"http://a0.pixiecdn.com/surfn/images/cloud.png\",\n  \"depths\": \"http://a0.pixiecdn.com/surfn/images/depths.png\",\n  \"depths0\": \"http://a0.pixiecdn.com/surfn/images/depths0.png\",\n  \"depths1\": \"http://a0.pixiecdn.com/surfn/images/depths1.png\",\n  \"player\": \"http://a0.pixiecdn.com/surfn/images/player.png\",\n  \"player_0\": \"http://a0.pixiecdn.com/surfn/images/player_0.png\",\n  \"player_10\": \"http://a0.pixiecdn.com/surfn/images/player_10.png\",\n  \"player_12\": \"http://a0.pixiecdn.com/surfn/images/player_12.png\",\n  \"player_14\": \"http://a0.pixiecdn.com/surfn/images/player_14.png\",\n  \"player_2\": \"http://a0.pixiecdn.com/surfn/images/player_2.png\",\n  \"player_4\": \"http://a0.pixiecdn.com/surfn/images/player_4.png\",\n  \"player_6\": \"http://a0.pixiecdn.com/surfn/images/player_6.png\",\n  \"player_8\": \"http://a0.pixiecdn.com/surfn/images/player_8.png\",\n  \"rocks\": \"http://a0.pixiecdn.com/surfn/images/rocks.png\",\n  \"wave\": \"http://a0.pixiecdn.com/surfn/images/wave.png\",\n  \"wave1\": \"http://a0.pixiecdn.com/surfn/images/wave1.png\"\n}","type":"blob"},"lib/music.coffee.md":{"path":"lib/music.coffee.md","mode":"100644","content":"Music\n=====\n\nSuper hack way to have background music.\n\n    track = $ \"<audio />\",\n      loop: \"loop\"\n    .appendTo('body').get(0)\n\n    track.volume = 1\n\n    module.exports =\n      play: (name) ->\n        # TODO: Get music files from resource setup\n        track.src = require(\"/music\")[\"SurfN-2-Sur5\"]\n        track.play()\n","type":"blob"},"lib/preloader.coffee.md":{"path":"lib/preloader.coffee.md","mode":"100644","content":"Preloader\n=========\n\nPreload resources.\n\nTODO: Error handling\n\nTODO: Gross hack forcing image url update\n\n    images = require \"/images\"\n\n    module.exports =\n      preload: ({resources, complete, progress}) ->\n        loading = 0\n        loaded = 0\n\n        failedResource = (url) ->\n          # TODO: Something other than just logging and ignoring\n          console.error \"Failed to load:\", url\n          loadedResource()\n\n        loadedResource = (url) ->\n          console.log \"loaded:\", url\n          loaded += 1\n\n          if loaded is loading\n            complete()\n          else\n            progress?(loaded/loading)\n\n        resources.forEach (resource) ->\n          Object.keys(resource).forEach (name) ->\n            loading += 1\n            url = resource[name]\n\n            success = (resourceUrl) ->\n              # TODO: Grosso McNasty\n              images[name] = resourceUrl\n              loadedResource(resourceUrl)\n\n            error = ->\n              failedResource(url)\n\n            if url.match /\\.(png|jpg|gif)$/\n              imagePreload(url, success, error)\n            else if url.match /\\.(mp3|wav|ogg)/\n              element = new Audio\n              element.onloadeddata = ->\n                loadedResource(url)\n              element.onerror = ->\n                failedResource(url)\n\n              element.src = url\n              element.load()\n              element.volume = 0\n              element.play()\n            else\n              console.warn \"unknown file type\", url\n              setTimeout loadedResource, 0\n\n`softPreload` just tries to load the resources but doesn't keep track of\nprogress, success, or failure. Useful right now for audio which is unreliable.\n\n      softPreload: (resources) ->\n        resources.forEach (resource) ->\n          Object.keys(resource).forEach (name) ->\n            url = resource[name]\n\n            if url.match /\\.(png|jpg|gif)$/\n              Sprite.load(url)\n            else if url.match /\\.(mp3|wav|ogg)/\n              element = new Audio\n              element.src = url\n              element.load()\n              element.volume = 0\n              element.play()\n            else\n              console.warn \"unknown file type\", url\n              setTimeout loadedResource, 0\n\n    imagePreload = (url, success, error) ->\n      if chrome?.app?.window\n        console.log \"loading\", url\n        ajaxSuccess = (resourceUrl) ->\n          console.log resourceUrl\n          Sprite resourceUrl, ->\n            success(resourceUrl)\n\n        chromeAppImagePreload(url, ajaxSuccess, error)\n      else\n        regularImagePreload(url, success, error)\n\n    regularImagePreload = (url, success, error) ->\n      # TODO: Error handling for sprites\n      # NOTE: Using Sprite constructor because otherwise we get flickering\n\n      Sprite.load url, success\n\n    chromeAppImagePreload = (url, success, error) ->\n      xhr = new XMLHttpRequest()\n      xhr.open('GET', url)\n      xhr.responseType = 'blob'\n      xhr.onload = (e) ->\n        success window.URL.createObjectURL(@response)\n      xhr.onerror = error\n\n      xhr.send()\n","type":"blob"},"lib/sound.coffee.md":{"path":"lib/sound.coffee.md","mode":"100644","content":"Sound\n=====\n\nPlay sounds\n\n>     Sound.play \"pew pew\"\n\n>     Sound.playFromURL \"data:audio/wav;base64,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\"\n\nHelpers\n-------\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nImplementation\n--------------\n\n    maxChannels = 16\n    channels = [0...maxChannels].map ->\n      extend document.createElement(\"audio\"),\n        autobuffer: true\n        preload: 'auto'\n\n    freeChannel = ->\n      freeChannels = channels.filter (sound) ->\n        sound.currentTime is sound.duration or sound.currentTime is 0\n\n      freeChannels[0]\n\n    module.exports =\n      playFromURL: (url) ->\n        if channel = freeChannel()\n          try\n            channel.currentTime = 0\n\n          channel.src = url\n          channel.play()\n\n          return channel\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"Surfn\n=====\n\nAs a lone FBI agent you must surf to survive.\n\n    # TODO: Maybe jQuery should move into Dust since that's what depends on it\n    require \"jQuery\"\n\nUse the Dust game engine.\n\n    Dust = require \"dust\"\n\n    # TODO: Clean up globals\n    global.Collision = Dust.Collision\n    global.Sound = require \"/lib/sound\"\n\n    # TODO: Fix this up a bit\n    Sound.play = (name) ->\n      sounds = require \"/sounds\"\n\n      Sound.playFromURL(sounds[name])\n\n    require \"/duct_tape\"\n\nThese register our GameObjects.\n\n    require \"./cloud\"\n    require \"./destruction\"\n    require \"./player\"\n    require \"./rock\"\n    require \"./water\"\n    require \"./game_over\"\n\n    Music = require \"/lib/music\"\n\n    DEBUG_DRAW = false\n\nGet the app size from our config.\n\n    {width, height} = require \"/pixie\"\n\n    window.engine = Dust.init\n      width: width\n      height: height\n\n    engine.I.backgroundColor = \"#CC5500\"\n\n    setUpGame = ->\n      player = engine.add\n        class: \"Player\"\n        x: 240\n        y: 0\n\n      box = engine.add\n        class: \"Rock\"\n        x: 160\n        y: 200\n\n      4.times (n) ->\n        engine.add\n          class: \"Cloud\"\n          x: n * 128\n\n      water = engine.add\n        class: \"Water\"\n\n      engine.add \"Destruction\"\n\n    loadingBar = engine.add\n      x: width/2\n      y: height/2\n      width: 0\n      height: height\n      color: \"white\"\n\n    require(\"/lib/preloader\").preload\n      resources: [\n        \"/images\"\n      ].map require\n      progress: (percent) ->\n        console.log percent\n        loadingBar.I.width = percent * width\n      complete: ->\n        loadingBar.destroy()\n        setUpGame()\n\n    require(\"/lib/preloader\").softPreload [\n      \"/music\"\n      \"/sounds\"\n    ].map require\n\n    # TODO: This should be simpler like engine.follow(\"Player\")\n    ###\n    camera = engine.camera()\n    camera.on \"afterUpdate\", ->\n      if player = engine.find(\"Player\").first()\n        camera.I.transform.tx = 240 + player.I.x\n    ###\n\n    # TODO: This is a stupid hack because I haven't fixed the cameras yet\n    engine.on \"afterUpdate\", ->\n      if player = engine.find(\"Player\").first()\n        deltaX = 240 - player.I.x\n\n        player.I.distance -= deltaX\n\n        engine.objects().forEach (object) ->\n          object.I.x += deltaX\n\n    clock = 0\n    engine.on \"update\", ->\n      clock += 1\n\n      if player = engine.find(\"Player\").first()\n        if clock % 60 == 0\n            engine.add\n              class: \"Rock\"\n              x: player.I.x + 2 * width\n\n        if clock % 55 == 0\n          engine.add\n            class: \"Cloud\"\n            x: player.I.x + 2 * width\n\n    restartGame = ->\n      engine.objects().invoke \"destroy\"\n\n      doRestart = ->\n        engine.unbind \"afterUpdate\", doRestart\n        setUpGame()\n\n      engine.on \"afterUpdate\", doRestart\n\n    engine.on \"draw\", (canvas) ->\n      if DEBUG_DRAW\n        engine.find(\"Player, Rock\").invoke(\"trigger\", \"drawDebug\", canvas)\n\n    engine.bind \"restart\", ->\n      restartGame()\n\n    Music.play \"SurfN-2-Sur5\"\n\n    engine.start()\n\n    # Meta controls\n    $(document).on \"keydown\", null, \"pause\", ->\n      engine.pause()\n","type":"blob"},"music.json":{"path":"music.json","mode":"100644","content":"{\n  \"SurfN-2-Sur5\": \"http://a0.pixiecdn.com/surfn/music/SurfN-2-Sur5.mp3\"\n}","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"author: \"STRd6\"\nname: \"Surfing 2 Survive\"\ndescription: \"As a lone FBI agent you must surf to survive.\"\nversion: \"0.1.0\"\nwidth: 480\nheight: 320\nentryPoint: \"main\"\ndependencies:\n  jQuery: \"distri/jQuery:v1.11.0.0\"\n  dust: \"distri/dust:v0.1.8-alpha.2\"\n  # sound: \"distri/sound:v0.1.0\"\npermissions: [\n  \"<all_urls>\"\n]\n","type":"blob"},"player.coffee.md":{"path":"player.coffee.md","mode":"100644","content":"Player\n======\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    module.exports = GameObject.registry.Player = (I={}) ->\n      defaults I,\n        airborne: true\n        distance: 0\n        heading: Math.TAU / 4\n        spriteName: \"player\"\n        launchBoost: 1.5\n        radius: 8\n        rotationVelocity: Math.TAU / 64\n        waterSpeed: 5\n        velocity: Point(0, 0)\n        zIndex: 5\n\n      self = Base(I)\n\n      GRAVITY = Point(0, 0.25)\n\n      sprites = []\n      angleSprites = 8\n      angleSprites.times (n) ->\n        t = n * 2\n        sprites.push \"player_#{t}\"\n\n      setSprite = ->\n        n = (angleSprites * I.heading / Math.TAU).round().mod(angleSprites)\n\n        I.spriteName = sprites[n]\n\n      wipeout = (causeOfDeath) ->\n        I.active = false\n\n        Sound.play(\"crash\")\n\n        engine.add\n          class: \"GameOver\"\n          causeOfDeath: causeOfDeath\n          distance: I.distance\n          time: I.age\n          y: 160\n\n      land = () ->\n        projection = self.velocity().norm().dot(Point.fromAngle(I.heading))\n\n        if projection < 0\n          wipeout(\"bad landing\")\n\n        I.airborne = false\n\n        Sound.play(\"land\")\n\n      launch = () ->\n        I.airborne = true\n        I.velocity = I.velocity.norm(I.launchBoost * I.waterSpeed)\n\n        Sound.play(\"splash\")\n\n      self.on \"drawDebug\", (canvas) ->\n        canvas.strokeColor(\"rgba(0, 255, 0, 0.75)\")\n\n        p = Point.fromAngle(I.heading).scale(10)\n        canvas.drawLine\n          start: Point(I.x - p.x, I.y - p.y)\n          end: Point(I.x + p.x, I.y + p.y, 1)\n\n      self.on \"update\", ->\n        I.x += I.velocity.x\n        I.y += I.velocity.y\n\n        I.waterSpeed = 5 + I.age / 30\n\n        circle = self.circle()\n        hitRock = false\n        engine.find(\"Rock\").each (rock) ->\n          if Collision.circular circle, rock.circle()\n            hitRock = true\n\n        if hitRock\n          wipeout(\"a rock\")\n          return\n\n        hitDestruction = false\n        engine.find(\".destruction\").each (destruction) ->\n          if I.x < destruction.I.x\n            hitDestruction = true\n        if hitDestruction\n          wipeout(\"a rogue wave\")\n          return\n\n        water = engine.find(\".water\").first()\n        waterLevel = water.top()\n        depthsLevel = water.bottom()\n\n        headingChange = I.rotationVelocity\n        headingChange *= 2 if I.airborne\n\n        if keydown.left\n          I.heading -= headingChange\n        if keydown.right\n          I.heading += headingChange\n\n        # I.heading = I.heading.constrainRotation()\n\n        setSprite()\n\n        if I.y > depthsLevel\n          wipeout(\"the depths\")\n        else if I.y >= waterLevel\n          if I.airborne\n            land()\n\n          speed = I.velocity.magnitude()\n\n          speed = speed.approachByRatio(I.waterSpeed, 0.1)\n\n          I.velocity = Point.fromAngle(I.heading).scale(speed)\n        else\n          if !I.airborne\n            launch()\n\n          I.velocity = I.velocity.add(GRAVITY)\n\n      return self\n","type":"blob"},"rock.coffee.md":{"path":"rock.coffee.md","mode":"100644","content":"Rock\n====\n\nA little rocky patch that leads to death.\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    Base = require \"./base\"\n\n    module.exports = GameObject.registry.Rock = (I={}) ->\n      defaults I,\n        spriteName: \"rocks\"\n        height: 32\n        radius: 16\n        width: 32\n        y: 160 + rand(160)\n        zIndex: 6\n\n      self = Base(I)\n\n      self.on \"update\", ->\n        destruction = engine.find(\".destruction\").first()\n\n        if destruction\n          if I.x < destruction.I.x - I.width\n            I.active = false\n\n      self\n","type":"blob"},"sounds.json":{"path":"sounds.json","mode":"100644","content":"{\n  \"crash\": \"http://a0.pixiecdn.com/surfn/sounds/crash.wav\",\n  \"land\": \"http://a0.pixiecdn.com/surfn/sounds/land.wav\",\n  \"splash\": \"http://a0.pixiecdn.com/surfn/sounds/splash.wav\",\n  \"wave\": \"http://a0.pixiecdn.com/surfn/sounds/wave.wav\"\n}","type":"blob"},"water.coffee.md":{"path":"water.coffee.md","mode":"100644","content":"Water\n=====\n\n    {Util:{defaults}, GameObject} = require \"dust\"\n\n    depthsSprites = [Sprite.loadByName(\"depths0\"), Sprite.loadByName(\"depths1\")]\n\n    module.exports = GameObject.registry.Water = (I={}) ->\n      defaults I,\n        color: \"blue\"\n        water: true\n        x: 0\n        y: 240\n        width: 480\n        height: 160\n        zIndex: 0\n\n      self = GameObject(I)\n\n      self.attrAccessor \"water\"\n\n      self.on \"update\", ->\n        if player = engine.find(\"Player\").first()\n          I.x = player.I.x\n\n        amplitude = (15 + I.age)\n\n        if rand(3) is 0 and I.age.mod(90) is 0\n          Sound.play(\"wave\")\n\n        I.y = 240 + amplitude * Math.sin(Math.TAU / 4 * I.age)\n\n      self.on \"draw\", (canvas) ->\n        offset = I.x.mod(32)\n\n        canvas.withTransform Matrix.translation(-I.width/2, 0), (canvas) ->\n          depthsSprites.wrap((I.age / 8).floor()).fill(canvas, 0, I.height/2, I.width, I.height)\n\n      return self\n","type":"blob"}},"distribution":{"base":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  GameObject = require("dust").GameObject;

  module.exports = function(I) {
    var self;
    self = GameObject(I).extend({
      center: function() {
        return Point(I.x, I.y);
      }
    });
    self.on("drawDebug", function(canvas) {
      var center, x, y;
      if (I.radius) {
        center = self.center();
        x = center.x;
        y = center.y;
        return canvas.drawCircle({
          x: x,
          y: y,
          radius: I.radius,
          color: "rgba(255, 0, 255, 0.5)"
        });
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=base.coffee;

  return module.exports;
},"bounds_extensions":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    self.extend({
      top: function() {
        return I.y - I.height / 2;
      },
      bottom: function() {
        return I.y + I.height / 2;
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=bounds_extensions.coffee;

  return module.exports;
},"cloud":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  module.exports = GameObject.registry.Cloud = function(I) {
    var self;
    defaults(I, {
      spriteName: "cloud",
      height: 32,
      width: 128,
      y: -120 + rand(240),
      zIndex: 1
    });
    self = Base(I);
    self.on("update", function() {
      var destruction;
      destruction = engine.find(".destruction").first();
      if (destruction) {
        if (I.x < destruction.I.x - I.width) {
          return I.active = false;
        }
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=cloud.coffee;

  return module.exports;
},"destruction":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, churnSprites, defaults, height, waveSprites, width, _ref, _ref1, _ref2;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  _ref2 = require("./pixie"), width = _ref2.width, height = _ref2.height;

  churnSprites = [Sprite.loadByName("churn")];

  waveSprites = ["wave", "wave1"].map(function(name) {
    return Sprite.loadByName(name);
  });

  module.exports = GameObject.registry.Destruction = function(I) {
    var self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      color: "red",
      destruction: true,
      x: -240,
      y: 0,
      width: 10,
      height: height,
      zIndex: 7
    });
    self = GameObject(I);
    self.attrAccessor("destruction");
    self.on("update", function(dt) {
      var osc, player;
      osc = 30 * Math.sin(Math.TAU * I.age);
      I.x += (osc + 90) * dt;
      if (player = engine.find("Player").first()) {
        return I.x = I.x.clamp(player.I.x - width / 2 + osc, Infinity);
      }
    });
    return self.on("draw", function(canvas) {
      waveSprites.wrap((I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height);
      return churnSprites.wrap((I.age / 8).floor()).fill(canvas, 0, 0, 32, height);
    });
  };

}).call(this);

//# sourceURL=destruction.coffee;

  return module.exports;
},"duct_tape":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, extend, images, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, extend = _ref1.extend), GameObject = _ref.GameObject;

  images = require("./images");

  GameObject.defaultModules.push(require("./bounds_extensions"));

  Sprite.loadByName = function(name) {
    var url;
    url = images[name];
    return Sprite.load(url);
  };

  extend(Number.prototype, {
    approach: function(target, maxDelta) {
      return this + (target - this).clamp(-maxDelta, maxDelta);
    },
    approachByRatio: function(target, ratio) {
      return this.approach(target, this * ratio);
    },
    floor: function() {
      if (isNaN(this)) {
        throw "Can't floor NaN";
      } else {
        return Math.floor(this);
      }
    }
  });

}).call(this);

//# sourceURL=duct_tape.coffee;

  return module.exports;
},"game_over":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  module.exports = GameObject.registry.GameOver = function(I) {
    var lineHeight, self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      zIndex: 10
    });
    lineHeight = 24;
    self = GameObject(I);
    self.off("draw");
    self.on("overlay", function(canvas) {
      var lines;
      lines = ("surf'd for " + ((I.distance / 100).toFixed(2)) + " meters\nsur5'd for " + (I.time.toFixed(2)) + " seconds\nsuccumb'd to " + I.causeOfDeath).split("\n");
      canvas.font("24px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif");
      return lines.forEach(function(line, i) {
        return canvas.centerText({
          color: "#FFF",
          text: line,
          y: 160 - (lines.length / 2 - i) * lineHeight
        });
      });
    });
    self.on("update", function() {
      if (keydown.space || keydown["return"] || keydown.escape) {
        return engine.trigger("restart");
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=game_over.coffee;

  return module.exports;
},"images":function(require, global, module, exports, PACKAGE) {
  module.exports = {"churn":"http://a0.pixiecdn.com/surfn/images/churn.png","cloud":"http://a0.pixiecdn.com/surfn/images/cloud.png","depths":"http://a0.pixiecdn.com/surfn/images/depths.png","depths0":"http://a0.pixiecdn.com/surfn/images/depths0.png","depths1":"http://a0.pixiecdn.com/surfn/images/depths1.png","player":"http://a0.pixiecdn.com/surfn/images/player.png","player_0":"http://a0.pixiecdn.com/surfn/images/player_0.png","player_10":"http://a0.pixiecdn.com/surfn/images/player_10.png","player_12":"http://a0.pixiecdn.com/surfn/images/player_12.png","player_14":"http://a0.pixiecdn.com/surfn/images/player_14.png","player_2":"http://a0.pixiecdn.com/surfn/images/player_2.png","player_4":"http://a0.pixiecdn.com/surfn/images/player_4.png","player_6":"http://a0.pixiecdn.com/surfn/images/player_6.png","player_8":"http://a0.pixiecdn.com/surfn/images/player_8.png","rocks":"http://a0.pixiecdn.com/surfn/images/rocks.png","wave":"http://a0.pixiecdn.com/surfn/images/wave.png","wave1":"http://a0.pixiecdn.com/surfn/images/wave1.png"};;

  return module.exports;
},"lib/music":function(require, global, module, exports, PACKAGE) {
  (function() {
  var track;

  track = $("<audio />", {
    loop: "loop"
  }).appendTo('body').get(0);

  track.volume = 1;

  module.exports = {
    play: function(name) {
      track.src = require("/music")["SurfN-2-Sur5"];
      return track.play();
    }
  };

}).call(this);

//# sourceURL=lib/music.coffee;

  return module.exports;
},"lib/preloader":function(require, global, module, exports, PACKAGE) {
  (function() {
  var chromeAppImagePreload, imagePreload, images, regularImagePreload;

  images = require("/images");

  module.exports = {
    preload: function(_arg) {
      var complete, failedResource, loaded, loadedResource, loading, progress, resources;
      resources = _arg.resources, complete = _arg.complete, progress = _arg.progress;
      loading = 0;
      loaded = 0;
      failedResource = function(url) {
        console.error("Failed to load:", url);
        return loadedResource();
      };
      loadedResource = function(url) {
        console.log("loaded:", url);
        loaded += 1;
        if (loaded === loading) {
          return complete();
        } else {
          return typeof progress === "function" ? progress(loaded / loading) : void 0;
        }
      };
      return resources.forEach(function(resource) {
        return Object.keys(resource).forEach(function(name) {
          var element, error, success, url;
          loading += 1;
          url = resource[name];
          success = function(resourceUrl) {
            images[name] = resourceUrl;
            return loadedResource(resourceUrl);
          };
          error = function() {
            return failedResource(url);
          };
          if (url.match(/\.(png|jpg|gif)$/)) {
            return imagePreload(url, success, error);
          } else if (url.match(/\.(mp3|wav|ogg)/)) {
            element = new Audio;
            element.onloadeddata = function() {
              return loadedResource(url);
            };
            element.onerror = function() {
              return failedResource(url);
            };
            element.src = url;
            element.load();
            element.volume = 0;
            return element.play();
          } else {
            console.warn("unknown file type", url);
            return setTimeout(loadedResource, 0);
          }
        });
      });
    },
    softPreload: function(resources) {
      return resources.forEach(function(resource) {
        return Object.keys(resource).forEach(function(name) {
          var element, url;
          url = resource[name];
          if (url.match(/\.(png|jpg|gif)$/)) {
            return Sprite.load(url);
          } else if (url.match(/\.(mp3|wav|ogg)/)) {
            element = new Audio;
            element.src = url;
            element.load();
            element.volume = 0;
            return element.play();
          } else {
            console.warn("unknown file type", url);
            return setTimeout(loadedResource, 0);
          }
        });
      });
    }
  };

  imagePreload = function(url, success, error) {
    var ajaxSuccess, _ref;
    if (typeof chrome !== "undefined" && chrome !== null ? (_ref = chrome.app) != null ? _ref.window : void 0 : void 0) {
      console.log("loading", url);
      ajaxSuccess = function(resourceUrl) {
        console.log(resourceUrl);
        return Sprite(resourceUrl, function() {
          return success(resourceUrl);
        });
      };
      return chromeAppImagePreload(url, ajaxSuccess, error);
    } else {
      return regularImagePreload(url, success, error);
    }
  };

  regularImagePreload = function(url, success, error) {
    return Sprite.load(url, success);
  };

  chromeAppImagePreload = function(url, success, error) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      return success(window.URL.createObjectURL(this.response));
    };
    xhr.onerror = error;
    return xhr.send();
  };

}).call(this);

//# sourceURL=lib/preloader.coffee;

  return module.exports;
},"lib/sound":function(require, global, module, exports, PACKAGE) {
  (function() {
  var channels, extend, freeChannel, maxChannels, _i, _results,
    __slice = [].slice;

  extend = function() {
    var name, source, sources, target, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (name in source) {
        target[name] = source[name];
      }
    }
    return target;
  };

  maxChannels = 16;

  channels = (function() {
    _results = [];
    for (var _i = 0; 0 <= maxChannels ? _i < maxChannels : _i > maxChannels; 0 <= maxChannels ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this).map(function() {
    return extend(document.createElement("audio"), {
      autobuffer: true,
      preload: 'auto'
    });
  });

  freeChannel = function() {
    var freeChannels;
    freeChannels = channels.filter(function(sound) {
      return sound.currentTime === sound.duration || sound.currentTime === 0;
    });
    return freeChannels[0];
  };

  module.exports = {
    playFromURL: function(url) {
      var channel;
      if (channel = freeChannel()) {
        try {
          channel.currentTime = 0;
        } catch (_error) {}
        channel.src = url;
        channel.play();
        return channel;
      }
    }
  };

}).call(this);

//# sourceURL=lib/sound.coffee;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var DEBUG_DRAW, Dust, Music, clock, height, loadingBar, restartGame, setUpGame, width, _ref;

  require("jQuery");

  Dust = require("dust");

  global.Collision = Dust.Collision;

  global.Sound = require("/lib/sound");

  Sound.play = function(name) {
    var sounds;
    sounds = require("/sounds");
    return Sound.playFromURL(sounds[name]);
  };

  require("/duct_tape");

  require("./cloud");

  require("./destruction");

  require("./player");

  require("./rock");

  require("./water");

  require("./game_over");

  Music = require("/lib/music");

  DEBUG_DRAW = false;

  _ref = require("/pixie"), width = _ref.width, height = _ref.height;

  window.engine = Dust.init({
    width: width,
    height: height
  });

  engine.I.backgroundColor = "#CC5500";

  setUpGame = function() {
    var box, player, water;
    player = engine.add({
      "class": "Player",
      x: 240,
      y: 0
    });
    box = engine.add({
      "class": "Rock",
      x: 160,
      y: 200
    });
    4..times(function(n) {
      return engine.add({
        "class": "Cloud",
        x: n * 128
      });
    });
    water = engine.add({
      "class": "Water"
    });
    return engine.add("Destruction");
  };

  loadingBar = engine.add({
    x: width / 2,
    y: height / 2,
    width: 0,
    height: height,
    color: "white"
  });

  require("/lib/preloader").preload({
    resources: ["/images"].map(require),
    progress: function(percent) {
      console.log(percent);
      return loadingBar.I.width = percent * width;
    },
    complete: function() {
      loadingBar.destroy();
      return setUpGame();
    }
  });

  require("/lib/preloader").softPreload(["/music", "/sounds"].map(require));

  /*
  camera = engine.camera()
  camera.on "afterUpdate", ->
    if player = engine.find("Player").first()
      camera.I.transform.tx = 240 + player.I.x
  */


  engine.on("afterUpdate", function() {
    var deltaX, player;
    if (player = engine.find("Player").first()) {
      deltaX = 240 - player.I.x;
      player.I.distance -= deltaX;
      return engine.objects().forEach(function(object) {
        return object.I.x += deltaX;
      });
    }
  });

  clock = 0;

  engine.on("update", function() {
    var player;
    clock += 1;
    if (player = engine.find("Player").first()) {
      if (clock % 60 === 0) {
        engine.add({
          "class": "Rock",
          x: player.I.x + 2 * width
        });
      }
      if (clock % 55 === 0) {
        return engine.add({
          "class": "Cloud",
          x: player.I.x + 2 * width
        });
      }
    }
  });

  restartGame = function() {
    var doRestart;
    engine.objects().invoke("destroy");
    doRestart = function() {
      engine.unbind("afterUpdate", doRestart);
      return setUpGame();
    };
    return engine.on("afterUpdate", doRestart);
  };

  engine.on("draw", function(canvas) {
    if (DEBUG_DRAW) {
      return engine.find("Player, Rock").invoke("trigger", "drawDebug", canvas);
    }
  });

  engine.bind("restart", function() {
    return restartGame();
  });

  Music.play("SurfN-2-Sur5");

  engine.start();

  $(document).on("keydown", null, "pause", function() {
    return engine.pause();
  });

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"music":function(require, global, module, exports, PACKAGE) {
  module.exports = {"SurfN-2-Sur5":"http://a0.pixiecdn.com/surfn/music/SurfN-2-Sur5.mp3"};;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"author":"STRd6","name":"Surfing 2 Survive","description":"As a lone FBI agent you must surf to survive.","version":"0.1.0","width":480,"height":320,"entryPoint":"main","dependencies":{"jQuery":"distri/jQuery:v1.11.0.0","dust":"distri/dust:v0.1.8-alpha.2"},"permissions":["<all_urls>"]};;

  return module.exports;
},"player":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  module.exports = GameObject.registry.Player = function(I) {
    var GRAVITY, angleSprites, land, launch, self, setSprite, sprites, wipeout;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      airborne: true,
      distance: 0,
      heading: Math.TAU / 4,
      spriteName: "player",
      launchBoost: 1.5,
      radius: 8,
      rotationVelocity: Math.TAU / 64,
      waterSpeed: 5,
      velocity: Point(0, 0),
      zIndex: 5
    });
    self = Base(I);
    GRAVITY = Point(0, 0.25);
    sprites = [];
    angleSprites = 8;
    angleSprites.times(function(n) {
      var t;
      t = n * 2;
      return sprites.push("player_" + t);
    });
    setSprite = function() {
      var n;
      n = (angleSprites * I.heading / Math.TAU).round().mod(angleSprites);
      return I.spriteName = sprites[n];
    };
    wipeout = function(causeOfDeath) {
      I.active = false;
      Sound.play("crash");
      return engine.add({
        "class": "GameOver",
        causeOfDeath: causeOfDeath,
        distance: I.distance,
        time: I.age,
        y: 160
      });
    };
    land = function() {
      var projection;
      projection = self.velocity().norm().dot(Point.fromAngle(I.heading));
      if (projection < 0) {
        wipeout("bad landing");
      }
      I.airborne = false;
      return Sound.play("land");
    };
    launch = function() {
      I.airborne = true;
      I.velocity = I.velocity.norm(I.launchBoost * I.waterSpeed);
      return Sound.play("splash");
    };
    self.on("drawDebug", function(canvas) {
      var p;
      canvas.strokeColor("rgba(0, 255, 0, 0.75)");
      p = Point.fromAngle(I.heading).scale(10);
      return canvas.drawLine({
        start: Point(I.x - p.x, I.y - p.y),
        end: Point(I.x + p.x, I.y + p.y, 1)
      });
    });
    self.on("update", function() {
      var circle, depthsLevel, headingChange, hitDestruction, hitRock, speed, water, waterLevel;
      I.x += I.velocity.x;
      I.y += I.velocity.y;
      I.waterSpeed = 5 + I.age / 30;
      circle = self.circle();
      hitRock = false;
      engine.find("Rock").each(function(rock) {
        if (Collision.circular(circle, rock.circle())) {
          return hitRock = true;
        }
      });
      if (hitRock) {
        wipeout("a rock");
        return;
      }
      hitDestruction = false;
      engine.find(".destruction").each(function(destruction) {
        if (I.x < destruction.I.x) {
          return hitDestruction = true;
        }
      });
      if (hitDestruction) {
        wipeout("a rogue wave");
        return;
      }
      water = engine.find(".water").first();
      waterLevel = water.top();
      depthsLevel = water.bottom();
      headingChange = I.rotationVelocity;
      if (I.airborne) {
        headingChange *= 2;
      }
      if (keydown.left) {
        I.heading -= headingChange;
      }
      if (keydown.right) {
        I.heading += headingChange;
      }
      setSprite();
      if (I.y > depthsLevel) {
        return wipeout("the depths");
      } else if (I.y >= waterLevel) {
        if (I.airborne) {
          land();
        }
        speed = I.velocity.magnitude();
        speed = speed.approachByRatio(I.waterSpeed, 0.1);
        return I.velocity = Point.fromAngle(I.heading).scale(speed);
      } else {
        if (!I.airborne) {
          launch();
        }
        return I.velocity = I.velocity.add(GRAVITY);
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=player.coffee;

  return module.exports;
},"rock":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  module.exports = GameObject.registry.Rock = function(I) {
    var self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      spriteName: "rocks",
      height: 32,
      radius: 16,
      width: 32,
      y: 160 + rand(160),
      zIndex: 6
    });
    self = Base(I);
    self.on("update", function() {
      var destruction;
      destruction = engine.find(".destruction").first();
      if (destruction) {
        if (I.x < destruction.I.x - I.width) {
          return I.active = false;
        }
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=rock.coffee;

  return module.exports;
},"sounds":function(require, global, module, exports, PACKAGE) {
  module.exports = {"crash":"http://a0.pixiecdn.com/surfn/sounds/crash.wav","land":"http://a0.pixiecdn.com/surfn/sounds/land.wav","splash":"http://a0.pixiecdn.com/surfn/sounds/splash.wav","wave":"http://a0.pixiecdn.com/surfn/sounds/wave.wav"};;

  return module.exports;
},"water":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, defaults, depthsSprites, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  depthsSprites = [Sprite.loadByName("depths0"), Sprite.loadByName("depths1")];

  module.exports = GameObject.registry.Water = function(I) {
    var self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      color: "blue",
      water: true,
      x: 0,
      y: 240,
      width: 480,
      height: 160,
      zIndex: 0
    });
    self = GameObject(I);
    self.attrAccessor("water");
    self.on("update", function() {
      var amplitude, player;
      if (player = engine.find("Player").first()) {
        I.x = player.I.x;
      }
      amplitude = 15 + I.age;
      if (rand(3) === 0 && I.age.mod(90) === 0) {
        Sound.play("wave");
      }
      return I.y = 240 + amplitude * Math.sin(Math.TAU / 4 * I.age);
    });
    self.on("draw", function(canvas) {
      var offset;
      offset = I.x.mod(32);
      return canvas.withTransform(Matrix.translation(-I.width / 2, 0), function(canvas) {
        return depthsSprites.wrap((I.age / 8).floor()).fill(canvas, 0, I.height / 2, I.width, I.height);
      });
    });
    return self;
  };

}).call(this);

//# sourceURL=water.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.1.0","entryPoint":"main","remoteDependencies":undefined,"repository":{"id":2240037,"name":"surfn","full_name":"STRd6/surfn","owner":{"login":"STRd6","id":18894,"avatar_url":"https://gravatar.com/avatar/33117162fff8a9cf50544a604f60c045?d=https%3A%2F%2Fidenticons.github.com%2F39df222bffe39629d904e4883eabc654.png&r=x","gravatar_id":"33117162fff8a9cf50544a604f60c045","url":"https://api.github.com/users/STRd6","html_url":"https://github.com/STRd6","followers_url":"https://api.github.com/users/STRd6/followers","following_url":"https://api.github.com/users/STRd6/following{/other_user}","gists_url":"https://api.github.com/users/STRd6/gists{/gist_id}","starred_url":"https://api.github.com/users/STRd6/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/STRd6/subscriptions","organizations_url":"https://api.github.com/users/STRd6/orgs","repos_url":"https://api.github.com/users/STRd6/repos","events_url":"https://api.github.com/users/STRd6/events{/privacy}","received_events_url":"https://api.github.com/users/STRd6/received_events","type":"User","site_admin":false},"private":false,"html_url":"https://github.com/STRd6/surfn","description":"As a lone FBI agent you must surf to survive.","fork":false,"url":"https://api.github.com/repos/STRd6/surfn","forks_url":"https://api.github.com/repos/STRd6/surfn/forks","keys_url":"https://api.github.com/repos/STRd6/surfn/keys{/key_id}","collaborators_url":"https://api.github.com/repos/STRd6/surfn/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/STRd6/surfn/teams","hooks_url":"https://api.github.com/repos/STRd6/surfn/hooks","issue_events_url":"https://api.github.com/repos/STRd6/surfn/issues/events{/number}","events_url":"https://api.github.com/repos/STRd6/surfn/events","assignees_url":"https://api.github.com/repos/STRd6/surfn/assignees{/user}","branches_url":"https://api.github.com/repos/STRd6/surfn/branches{/branch}","tags_url":"https://api.github.com/repos/STRd6/surfn/tags","blobs_url":"https://api.github.com/repos/STRd6/surfn/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/STRd6/surfn/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/STRd6/surfn/git/refs{/sha}","trees_url":"https://api.github.com/repos/STRd6/surfn/git/trees{/sha}","statuses_url":"https://api.github.com/repos/STRd6/surfn/statuses/{sha}","languages_url":"https://api.github.com/repos/STRd6/surfn/languages","stargazers_url":"https://api.github.com/repos/STRd6/surfn/stargazers","contributors_url":"https://api.github.com/repos/STRd6/surfn/contributors","subscribers_url":"https://api.github.com/repos/STRd6/surfn/subscribers","subscription_url":"https://api.github.com/repos/STRd6/surfn/subscription","commits_url":"https://api.github.com/repos/STRd6/surfn/commits{/sha}","git_commits_url":"https://api.github.com/repos/STRd6/surfn/git/commits{/sha}","comments_url":"https://api.github.com/repos/STRd6/surfn/comments{/number}","issue_comment_url":"https://api.github.com/repos/STRd6/surfn/issues/comments/{number}","contents_url":"https://api.github.com/repos/STRd6/surfn/contents/{+path}","compare_url":"https://api.github.com/repos/STRd6/surfn/compare/{base}...{head}","merges_url":"https://api.github.com/repos/STRd6/surfn/merges","archive_url":"https://api.github.com/repos/STRd6/surfn/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/STRd6/surfn/downloads","issues_url":"https://api.github.com/repos/STRd6/surfn/issues{/number}","pulls_url":"https://api.github.com/repos/STRd6/surfn/pulls{/number}","milestones_url":"https://api.github.com/repos/STRd6/surfn/milestones{/number}","notifications_url":"https://api.github.com/repos/STRd6/surfn/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/STRd6/surfn/labels{/name}","releases_url":"https://api.github.com/repos/STRd6/surfn/releases{/id}","created_at":"2011-08-20T18:05:31Z","updated_at":"2014-03-12T00:55:57Z","pushed_at":"2014-03-12T00:55:57Z","git_url":"git://github.com/STRd6/surfn.git","ssh_url":"git@github.com:STRd6/surfn.git","clone_url":"https://github.com/STRd6/surfn.git","svn_url":"https://github.com/STRd6/surfn","homepage":"","size":8756,"stargazers_count":1,"watchers_count":1,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":1,"default_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"network_count":0,"subscribers_count":2,"branch":"master","publishBranch":"gh-pages"},"dependencies":{"jQuery":{"source":{"README.md":{"path":"README.md","mode":"100644","content":"jQuery\n======\n\nHosting me some jQuery\n","type":"blob"},"lib/jquery.js":{"path":"lib/jquery.js","mode":"100644","content":"/*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */\n!function(a,b){\"object\"==typeof module&&\"object\"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error(\"jQuery requires a window with a document\");return b(a)}:b(a)}(\"undefined\"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k=\"\".trim,l={},m=\"1.11.0\",n=function(a,b){return new n.fn.init(a,b)},o=/^[\\s\\uFEFF\\xA0]+|[\\s\\uFEFF\\xA0]+$/g,p=/^-ms-/,q=/-([\\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:\"\",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for(\"boolean\"==typeof g&&(j=g,g=arguments[h]||{},h++),\"object\"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(n.isPlainObject(c)||(b=n.isArray(c)))?(b?(b=!1,f=a&&n.isArray(a)?a:[]):f=a&&n.isPlainObject(a)?a:{},g[d]=n.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},n.extend({expando:\"jQuery\"+(m+Math.random()).replace(/\\D/g,\"\"),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return\"function\"===n.type(a)},isArray:Array.isArray||function(a){return\"array\"===n.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return a-parseFloat(a)>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||\"object\"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,\"constructor\")&&!j.call(a.constructor.prototype,\"isPrototypeOf\"))return!1}catch(c){return!1}if(l.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+\"\":\"object\"==typeof a||\"function\"==typeof a?h[i.call(a)]||\"object\":typeof a},globalEval:function(b){b&&n.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(p,\"ms-\").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:k&&!k.call(\"\\ufeff\\xa0\")?function(a){return null==a?\"\":k.call(a)}:function(a){return null==a?\"\":(a+\"\").replace(o,\"\")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,\"string\"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return\"string\"==typeof b&&(f=a[b],b=a,a=f),n.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||n.guid++,e):void 0},now:function(){return+new Date},support:l}),n.each(\"Boolean Number String Function Array Date RegExp Object Error\".split(\" \"),function(a,b){h[\"[object \"+b+\"]\"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return\"function\"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:\"array\"===c||0===b||\"number\"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s=\"sizzle\"+-new Date,t=a.document,u=0,v=0,w=eb(),x=eb(),y=eb(),z=function(a,b){return a===b&&(j=!0),0},A=\"undefined\",B=1<<31,C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=D.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},J=\"checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped\",K=\"[\\\\x20\\\\t\\\\r\\\\n\\\\f]\",L=\"(?:\\\\\\\\.|[\\\\w-]|[^\\\\x00-\\\\xa0])+\",M=L.replace(\"w\",\"w#\"),N=\"\\\\[\"+K+\"*(\"+L+\")\"+K+\"*(?:([*^$|!~]?=)\"+K+\"*(?:(['\\\"])((?:\\\\\\\\.|[^\\\\\\\\])*?)\\\\3|(\"+M+\")|)|)\"+K+\"*\\\\]\",O=\":(\"+L+\")(?:\\\\(((['\\\"])((?:\\\\\\\\.|[^\\\\\\\\])*?)\\\\3|((?:\\\\\\\\.|[^\\\\\\\\()[\\\\]]|\"+N.replace(3,8)+\")*)|.*)\\\\)|)\",P=new RegExp(\"^\"+K+\"+|((?:^|[^\\\\\\\\])(?:\\\\\\\\.)*)\"+K+\"+$\",\"g\"),Q=new RegExp(\"^\"+K+\"*,\"+K+\"*\"),R=new RegExp(\"^\"+K+\"*([>+~]|\"+K+\")\"+K+\"*\"),S=new RegExp(\"=\"+K+\"*([^\\\\]'\\\"]*?)\"+K+\"*\\\\]\",\"g\"),T=new RegExp(O),U=new RegExp(\"^\"+M+\"$\"),V={ID:new RegExp(\"^#(\"+L+\")\"),CLASS:new RegExp(\"^\\\\.(\"+L+\")\"),TAG:new RegExp(\"^(\"+L.replace(\"w\",\"w*\")+\")\"),ATTR:new RegExp(\"^\"+N),PSEUDO:new RegExp(\"^\"+O),CHILD:new RegExp(\"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\\\(\"+K+\"*(even|odd|(([+-]|)(\\\\d*)n|)\"+K+\"*(?:([+-]|)\"+K+\"*(\\\\d+)|))\"+K+\"*\\\\)|)\",\"i\"),bool:new RegExp(\"^(?:\"+J+\")$\",\"i\"),needsContext:new RegExp(\"^\"+K+\"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\\\(\"+K+\"*((?:-\\\\d)?\\\\d*)\"+K+\"*\\\\)|)(?=[^-]|$)\",\"i\")},W=/^(?:input|select|textarea|button)$/i,X=/^h\\d$/i,Y=/^[^{]+\\{\\s*\\[native \\w/,Z=/^(?:#([\\w-]+)|(\\w+)|\\.([\\w-]+))$/,$=/[+~]/,_=/'|\\\\/g,ab=new RegExp(\"\\\\\\\\([\\\\da-f]{1,6}\"+K+\"?|(\"+K+\")|.)\",\"ig\"),bb=function(a,b,c){var d=\"0x\"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{G.apply(D=H.call(t.childNodes),t.childNodes),D[t.childNodes.length].nodeType}catch(cb){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function db(a,b,d,e){var f,g,h,i,j,m,p,q,u,v;if((b?b.ownerDocument||b:t)!==l&&k(b),b=b||l,d=d||[],!a||\"string\"!=typeof a)return d;if(1!==(i=b.nodeType)&&9!==i)return[];if(n&&!e){if(f=Z.exec(a))if(h=f[1]){if(9===i){if(g=b.getElementById(h),!g||!g.parentNode)return d;if(g.id===h)return d.push(g),d}else if(b.ownerDocument&&(g=b.ownerDocument.getElementById(h))&&r(b,g)&&g.id===h)return d.push(g),d}else{if(f[2])return G.apply(d,b.getElementsByTagName(a)),d;if((h=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(h)),d}if(c.qsa&&(!o||!o.test(a))){if(q=p=s,u=b,v=9===i&&a,1===i&&\"object\"!==b.nodeName.toLowerCase()){m=ob(a),(p=b.getAttribute(\"id\"))?q=p.replace(_,\"\\\\$&\"):b.setAttribute(\"id\",q),q=\"[id='\"+q+\"'] \",j=m.length;while(j--)m[j]=q+pb(m[j]);u=$.test(a)&&mb(b.parentNode)||b,v=m.join(\",\")}if(v)try{return G.apply(d,u.querySelectorAll(v)),d}catch(w){}finally{p||b.removeAttribute(\"id\")}}}return xb(a.replace(P,\"$1\"),b,d,e)}function eb(){var a=[];function b(c,e){return a.push(c+\" \")>d.cacheLength&&delete b[a.shift()],b[c+\" \"]=e}return b}function fb(a){return a[s]=!0,a}function gb(a){var b=l.createElement(\"div\");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function hb(a,b){var c=a.split(\"|\"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function ib(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||B)-(~a.sourceIndex||B);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function jb(a){return function(b){var c=b.nodeName.toLowerCase();return\"input\"===c&&b.type===a}}function kb(a){return function(b){var c=b.nodeName.toLowerCase();return(\"input\"===c||\"button\"===c)&&b.type===a}}function lb(a){return fb(function(b){return b=+b,fb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function mb(a){return a&&typeof a.getElementsByTagName!==A&&a}c=db.support={},f=db.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?\"HTML\"!==b.nodeName:!1},k=db.setDocument=function(a){var b,e=a?a.ownerDocument||a:t,g=e.defaultView;return e!==l&&9===e.nodeType&&e.documentElement?(l=e,m=e.documentElement,n=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener(\"unload\",function(){k()},!1):g.attachEvent&&g.attachEvent(\"onunload\",function(){k()})),c.attributes=gb(function(a){return a.className=\"i\",!a.getAttribute(\"className\")}),c.getElementsByTagName=gb(function(a){return a.appendChild(e.createComment(\"\")),!a.getElementsByTagName(\"*\").length}),c.getElementsByClassName=Y.test(e.getElementsByClassName)&&gb(function(a){return a.innerHTML=\"<div class='a'></div><div class='a i'></div>\",a.firstChild.className=\"i\",2===a.getElementsByClassName(\"i\").length}),c.getById=gb(function(a){return m.appendChild(a).id=s,!e.getElementsByName||!e.getElementsByName(s).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==A&&n){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){return a.getAttribute(\"id\")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){var c=typeof a.getAttributeNode!==A&&a.getAttributeNode(\"id\");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==A?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if(\"*\"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==A&&n?b.getElementsByClassName(a):void 0},p=[],o=[],(c.qsa=Y.test(e.querySelectorAll))&&(gb(function(a){a.innerHTML=\"<select t=''><option selected=''></option></select>\",a.querySelectorAll(\"[t^='']\").length&&o.push(\"[*^$]=\"+K+\"*(?:''|\\\"\\\")\"),a.querySelectorAll(\"[selected]\").length||o.push(\"\\\\[\"+K+\"*(?:value|\"+J+\")\"),a.querySelectorAll(\":checked\").length||o.push(\":checked\")}),gb(function(a){var b=e.createElement(\"input\");b.setAttribute(\"type\",\"hidden\"),a.appendChild(b).setAttribute(\"name\",\"D\"),a.querySelectorAll(\"[name=d]\").length&&o.push(\"name\"+K+\"*[*^$|!~]?=\"),a.querySelectorAll(\":enabled\").length||o.push(\":enabled\",\":disabled\"),a.querySelectorAll(\"*,:x\"),o.push(\",.*:\")})),(c.matchesSelector=Y.test(q=m.webkitMatchesSelector||m.mozMatchesSelector||m.oMatchesSelector||m.msMatchesSelector))&&gb(function(a){c.disconnectedMatch=q.call(a,\"div\"),q.call(a,\"[s!='']:x\"),p.push(\"!=\",O)}),o=o.length&&new RegExp(o.join(\"|\")),p=p.length&&new RegExp(p.join(\"|\")),b=Y.test(m.compareDocumentPosition),r=b||Y.test(m.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},z=b?function(a,b){if(a===b)return j=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===t&&r(t,a)?-1:b===e||b.ownerDocument===t&&r(t,b)?1:i?I.call(i,a)-I.call(i,b):0:4&d?-1:1)}:function(a,b){if(a===b)return j=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],k=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:i?I.call(i,a)-I.call(i,b):0;if(f===g)return ib(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)k.unshift(c);while(h[d]===k[d])d++;return d?ib(h[d],k[d]):h[d]===t?-1:k[d]===t?1:0},e):l},db.matches=function(a,b){return db(a,null,null,b)},db.matchesSelector=function(a,b){if((a.ownerDocument||a)!==l&&k(a),b=b.replace(S,\"='$1']\"),!(!c.matchesSelector||!n||p&&p.test(b)||o&&o.test(b)))try{var d=q.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return db(b,l,null,[a]).length>0},db.contains=function(a,b){return(a.ownerDocument||a)!==l&&k(a),r(a,b)},db.attr=function(a,b){(a.ownerDocument||a)!==l&&k(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!n):void 0;return void 0!==f?f:c.attributes||!n?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},db.error=function(a){throw new Error(\"Syntax error, unrecognized expression: \"+a)},db.uniqueSort=function(a){var b,d=[],e=0,f=0;if(j=!c.detectDuplicates,i=!c.sortStable&&a.slice(0),a.sort(z),j){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return i=null,a},e=db.getText=function(a){var b,c=\"\",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if(\"string\"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=db.selectors={cacheLength:50,createPseudo:fb,match:V,attrHandle:{},find:{},relative:{\">\":{dir:\"parentNode\",first:!0},\" \":{dir:\"parentNode\"},\"+\":{dir:\"previousSibling\",first:!0},\"~\":{dir:\"previousSibling\"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ab,bb),a[3]=(a[4]||a[5]||\"\").replace(ab,bb),\"~=\"===a[2]&&(a[3]=\" \"+a[3]+\" \"),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),\"nth\"===a[1].slice(0,3)?(a[3]||db.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*(\"even\"===a[3]||\"odd\"===a[3])),a[5]=+(a[7]+a[8]||\"odd\"===a[3])):a[3]&&db.error(a[0]),a},PSEUDO:function(a){var b,c=!a[5]&&a[2];return V.CHILD.test(a[0])?null:(a[3]&&void 0!==a[4]?a[2]=a[4]:c&&T.test(c)&&(b=ob(c,!0))&&(b=c.indexOf(\")\",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ab,bb).toLowerCase();return\"*\"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=w[a+\" \"];return b||(b=new RegExp(\"(^|\"+K+\")\"+a+\"(\"+K+\"|$)\"))&&w(a,function(a){return b.test(\"string\"==typeof a.className&&a.className||typeof a.getAttribute!==A&&a.getAttribute(\"class\")||\"\")})},ATTR:function(a,b,c){return function(d){var e=db.attr(d,a);return null==e?\"!=\"===b:b?(e+=\"\",\"=\"===b?e===c:\"!=\"===b?e!==c:\"^=\"===b?c&&0===e.indexOf(c):\"*=\"===b?c&&e.indexOf(c)>-1:\"$=\"===b?c&&e.slice(-c.length)===c:\"~=\"===b?(\" \"+e+\" \").indexOf(c)>-1:\"|=\"===b?e===c||e.slice(0,c.length+1)===c+\"-\":!1):!0}},CHILD:function(a,b,c,d,e){var f=\"nth\"!==a.slice(0,3),g=\"last\"!==a.slice(-4),h=\"of-type\"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?\"nextSibling\":\"previousSibling\",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),t=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p=\"only\"===a&&!o&&\"nextSibling\"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&t){k=q[s]||(q[s]={}),j=k[a]||[],n=j[0]===u&&j[1],m=j[0]===u&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[u,n,m];break}}else if(t&&(j=(b[s]||(b[s]={}))[a])&&j[0]===u)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(t&&((l[s]||(l[s]={}))[a]=[u,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||db.error(\"unsupported pseudo: \"+a);return e[s]?e(b):e.length>1?(c=[a,a,\"\",b],d.setFilters.hasOwnProperty(a.toLowerCase())?fb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:fb(function(a){var b=[],c=[],d=g(a.replace(P,\"$1\"));return d[s]?fb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:fb(function(a){return function(b){return db(a,b).length>0}}),contains:fb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:fb(function(a){return U.test(a||\"\")||db.error(\"unsupported lang: \"+a),a=a.replace(ab,bb).toLowerCase(),function(b){var c;do if(c=n?b.lang:b.getAttribute(\"xml:lang\")||b.getAttribute(\"lang\"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+\"-\");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===m},focus:function(a){return a===l.activeElement&&(!l.hasFocus||l.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return\"input\"===b&&!!a.checked||\"option\"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return\"input\"===b&&\"button\"===a.type||\"button\"===b},text:function(a){var b;return\"input\"===a.nodeName.toLowerCase()&&\"text\"===a.type&&(null==(b=a.getAttribute(\"type\"))||\"text\"===b.toLowerCase())},first:lb(function(){return[0]}),last:lb(function(a,b){return[b-1]}),eq:lb(function(a,b,c){return[0>c?c+b:c]}),even:lb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:lb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:lb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:lb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=jb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=kb(b);function nb(){}nb.prototype=d.filters=d.pseudos,d.setFilters=new nb;function ob(a,b){var c,e,f,g,h,i,j,k=x[a+\" \"];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=Q.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P,\" \")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?db.error(a):x(a,i).slice(0)}function pb(a){for(var b=0,c=a.length,d=\"\";c>b;b++)d+=a[b].value;return d}function qb(a,b,c){var d=b.dir,e=c&&\"parentNode\"===d,f=v++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[u,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[s]||(b[s]={}),(h=i[d])&&h[0]===u&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function rb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function sb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function tb(a,b,c,d,e,f){return d&&!d[s]&&(d=tb(d)),e&&!e[s]&&(e=tb(e,f)),fb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||wb(b||\"*\",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:sb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=sb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=sb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ub(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],i=g||d.relative[\" \"],j=g?1:0,k=qb(function(a){return a===b},i,!0),l=qb(function(a){return I.call(b,a)>-1},i,!0),m=[function(a,c,d){return!g&&(d||c!==h)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>j;j++)if(c=d.relative[a[j].type])m=[qb(rb(m),c)];else{if(c=d.filter[a[j].type].apply(null,a[j].matches),c[s]){for(e=++j;f>e;e++)if(d.relative[a[e].type])break;return tb(j>1&&rb(m),j>1&&pb(a.slice(0,j-1).concat({value:\" \"===a[j-2].type?\"*\":\"\"})).replace(P,\"$1\"),c,e>j&&ub(a.slice(j,e)),f>e&&ub(a=a.slice(e)),f>e&&pb(a))}m.push(c)}return rb(m)}function vb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,i,j,k){var m,n,o,p=0,q=\"0\",r=f&&[],s=[],t=h,v=f||e&&d.find.TAG(\"*\",k),w=u+=null==t?1:Math.random()||.1,x=v.length;for(k&&(h=g!==l&&g);q!==x&&null!=(m=v[q]);q++){if(e&&m){n=0;while(o=a[n++])if(o(m,g,i)){j.push(m);break}k&&(u=w)}c&&((m=!o&&m)&&p--,f&&r.push(m))}if(p+=q,c&&q!==p){n=0;while(o=b[n++])o(r,s,g,i);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=E.call(j));s=sb(s)}G.apply(j,s),k&&!f&&s.length>0&&p+b.length>1&&db.uniqueSort(j)}return k&&(u=w,h=t),r};return c?fb(f):f}g=db.compile=function(a,b){var c,d=[],e=[],f=y[a+\" \"];if(!f){b||(b=ob(a)),c=b.length;while(c--)f=ub(b[c]),f[s]?d.push(f):e.push(f);f=y(a,vb(e,d))}return f};function wb(a,b,c){for(var d=0,e=b.length;e>d;d++)db(a,b[d],c);return c}function xb(a,b,e,f){var h,i,j,k,l,m=ob(a);if(!f&&1===m.length){if(i=m[0]=m[0].slice(0),i.length>2&&\"ID\"===(j=i[0]).type&&c.getById&&9===b.nodeType&&n&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(ab,bb),b)||[])[0],!b)return e;a=a.slice(i.shift().value.length)}h=V.needsContext.test(a)?0:i.length;while(h--){if(j=i[h],d.relative[k=j.type])break;if((l=d.find[k])&&(f=l(j.matches[0].replace(ab,bb),$.test(i[0].type)&&mb(b.parentNode)||b))){if(i.splice(h,1),a=f.length&&pb(i),!a)return G.apply(e,f),e;break}}}return g(a,m)(f,b,!n,e,$.test(a)&&mb(b.parentNode)||b),e}return c.sortStable=s.split(\"\").sort(z).join(\"\")===s,c.detectDuplicates=!!j,k(),c.sortDetached=gb(function(a){return 1&a.compareDocumentPosition(l.createElement(\"div\"))}),gb(function(a){return a.innerHTML=\"<a href='#'></a>\",\"#\"===a.firstChild.getAttribute(\"href\")})||hb(\"type|href|height|width\",function(a,b,c){return c?void 0:a.getAttribute(b,\"type\"===b.toLowerCase()?1:2)}),c.attributes&&gb(function(a){return a.innerHTML=\"<input/>\",a.firstChild.setAttribute(\"value\",\"\"),\"\"===a.firstChild.getAttribute(\"value\")})||hb(\"value\",function(a,b,c){return c||\"input\"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),gb(function(a){return null==a.getAttribute(\"disabled\")})||hb(J,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),db}(a);n.find=t,n.expr=t.selectors,n.expr[\":\"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\\w+)\\s*\\/?>(?:<\\/\\1>|)$/,w=/^.[^:#\\[\\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if(\"string\"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return n.inArray(a,b)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=\":not(\"+a+\")\"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if(\"string\"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;e>b;b++)if(n.contains(d[b],this))return!0}));for(b=0;e>b;b++)n.find(a,d[b],c);return c=this.pushStack(e>1?n.unique(c):c),c.selector=this.selector?this.selector+\" \"+a:a,c},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,\"string\"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=a.document,A=/^(?:\\s*(<[\\w\\W]+>)[^>]*|#([\\w-]*))$/,B=n.fn.init=function(a,b){var c,d;if(!a)return this;if(\"string\"==typeof a){if(c=\"<\"===a.charAt(0)&&\">\"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:A.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:z,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=z.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return y.find(a);this.length=1,this[0]=d}return this.context=z,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?\"undefined\"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};B.prototype=n.fn,y=n(z);var C=/^(?:parents|prev(?:Until|All))/,D={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!n(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b,c=n(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(n.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||\"string\"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?\"string\"==typeof a?n.inArray(this[0],n(a)):n.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function E(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,\"parentNode\")},parentsUntil:function(a,b,c){return n.dir(a,\"parentNode\",c)},next:function(a){return E(a,\"nextSibling\")},prev:function(a){return E(a,\"previousSibling\")},nextAll:function(a){return n.dir(a,\"nextSibling\")},prevAll:function(a){return n.dir(a,\"previousSibling\")},nextUntil:function(a,b,c){return n.dir(a,\"nextSibling\",c)},prevUntil:function(a,b,c){return n.dir(a,\"previousSibling\",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return n.nodeName(a,\"iframe\")?a.contentDocument||a.contentWindow.document:n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return\"Until\"!==a.slice(-5)&&(d=c),d&&\"string\"==typeof d&&(e=n.filter(d,e)),this.length>1&&(D[a]||(e=n.unique(e)),C.test(a)&&(e=e.reverse())),this.pushStack(e)}});var F=/\\S+/g,G={};function H(a){var b=G[a]={};return n.each(a.match(F)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a=\"string\"==typeof a?G[a]||H(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){n.each(b,function(b,c){var d=n.type(c);\"function\"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&\"string\"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&n.each(arguments,function(a,c){var d;while((d=n.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},n.extend({Deferred:function(a){var b=[[\"resolve\",\"done\",n.Callbacks(\"once memory\"),\"resolved\"],[\"reject\",\"fail\",n.Callbacks(\"once memory\"),\"rejected\"],[\"notify\",\"progress\",n.Callbacks(\"memory\")]],c=\"pending\",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+\"With\"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+\"With\"](this===e?d:this,arguments),this},e[f[0]+\"With\"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){if(a===!0?!--n.readyWait:!n.isReady){if(!z.body)return setTimeout(n.ready);n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(z,[n]),n.fn.trigger&&n(z).trigger(\"ready\").off(\"ready\"))}}});function J(){z.addEventListener?(z.removeEventListener(\"DOMContentLoaded\",K,!1),a.removeEventListener(\"load\",K,!1)):(z.detachEvent(\"onreadystatechange\",K),a.detachEvent(\"onload\",K))}function K(){(z.addEventListener||\"load\"===event.type||\"complete\"===z.readyState)&&(J(),n.ready())}n.ready.promise=function(b){if(!I)if(I=n.Deferred(),\"complete\"===z.readyState)setTimeout(n.ready);else if(z.addEventListener)z.addEventListener(\"DOMContentLoaded\",K,!1),a.addEventListener(\"load\",K,!1);else{z.attachEvent(\"onreadystatechange\",K),a.attachEvent(\"onload\",K);var c=!1;try{c=null==a.frameElement&&z.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!n.isReady){try{c.doScroll(\"left\")}catch(a){return setTimeout(e,50)}J(),n.ready()}}()}return I.promise(b)};var L=\"undefined\",M;for(M in n(l))break;l.ownLast=\"0\"!==M,l.inlineBlockNeedsLayout=!1,n(function(){var a,b,c=z.getElementsByTagName(\"body\")[0];c&&(a=z.createElement(\"div\"),a.style.cssText=\"border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px\",b=z.createElement(\"div\"),c.appendChild(a).appendChild(b),typeof b.style.zoom!==L&&(b.style.cssText=\"border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1\",(l.inlineBlockNeedsLayout=3===b.offsetWidth)&&(c.style.zoom=1)),c.removeChild(a),a=b=null)}),function(){var a=z.createElement(\"div\");if(null==l.deleteExpando){l.deleteExpando=!0;try{delete a.test}catch(b){l.deleteExpando=!1}}a=null}(),n.acceptData=function(a){var b=n.noData[(a.nodeName+\" \").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute(\"classid\")===b};var N=/^(?:\\{[\\w\\W]*\\}|\\[[\\w\\W]*\\])$/,O=/([A-Z])/g;function P(a,b,c){if(void 0===c&&1===a.nodeType){var d=\"data-\"+b.replace(O,\"-$1\").toLowerCase();if(c=a.getAttribute(d),\"string\"==typeof c){try{c=\"true\"===c?!0:\"false\"===c?!1:\"null\"===c?null:+c+\"\"===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}n.data(a,b,c)}else c=void 0}return c}function Q(a){var b;for(b in a)if((\"data\"!==b||!n.isEmptyObject(a[b]))&&\"toJSON\"!==b)return!1;return!0}function R(a,b,d,e){if(n.acceptData(a)){var f,g,h=n.expando,i=a.nodeType,j=i?n.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||\"string\"!=typeof b)return k||(k=i?a[h]=c.pop()||n.guid++:h),j[k]||(j[k]=i?{}:{toJSON:n.noop}),(\"object\"==typeof b||\"function\"==typeof b)&&(e?j[k]=n.extend(j[k],b):j[k].data=n.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[n.camelCase(b)]=d),\"string\"==typeof b?(f=g[b],null==f&&(f=g[n.camelCase(b)])):f=g,f\n}}function S(a,b,c){if(n.acceptData(a)){var d,e,f=a.nodeType,g=f?n.cache:a,h=f?a[n.expando]:n.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){n.isArray(b)?b=b.concat(n.map(b,n.camelCase)):b in d?b=[b]:(b=n.camelCase(b),b=b in d?[b]:b.split(\" \")),e=b.length;while(e--)delete d[b[e]];if(c?!Q(d):!n.isEmptyObject(d))return}(c||(delete g[h].data,Q(g[h])))&&(f?n.cleanData([a],!0):l.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}n.extend({cache:{},noData:{\"applet \":!0,\"embed \":!0,\"object \":\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\"},hasData:function(a){return a=a.nodeType?n.cache[a[n.expando]]:a[n.expando],!!a&&!Q(a)},data:function(a,b,c){return R(a,b,c)},removeData:function(a,b){return S(a,b)},_data:function(a,b,c){return R(a,b,c,!0)},_removeData:function(a,b){return S(a,b,!0)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=n.data(f),1===f.nodeType&&!n._data(f,\"parsedAttrs\"))){c=g.length;while(c--)d=g[c].name,0===d.indexOf(\"data-\")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d]));n._data(f,\"parsedAttrs\",!0)}return e}return\"object\"==typeof a?this.each(function(){n.data(this,a)}):arguments.length>1?this.each(function(){n.data(this,a,b)}):f?P(f,a,n.data(f,a)):void 0},removeData:function(a){return this.each(function(){n.removeData(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||\"fx\")+\"queue\",d=n._data(a,b),c&&(!d||n.isArray(c)?d=n._data(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||\"fx\";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};\"inprogress\"===e&&(e=c.shift(),d--),e&&(\"fx\"===b&&c.unshift(\"inprogress\"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+\"queueHooks\";return n._data(a,c)||n._data(a,c,{empty:n.Callbacks(\"once memory\").add(function(){n._removeData(a,b+\"queue\"),n._removeData(a,c)})})}}),n.fn.extend({queue:function(a,b){var c=2;return\"string\"!=typeof a&&(b=a,a=\"fx\",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),\"fx\"===a&&\"inprogress\"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||\"fx\",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};\"string\"!=typeof a&&(b=a,a=void 0),a=a||\"fx\";while(g--)c=n._data(f[g],a+\"queueHooks\"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var T=/[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)/.source,U=[\"Top\",\"Right\",\"Bottom\",\"Left\"],V=function(a,b){return a=b||a,\"none\"===n.css(a,\"display\")||!n.contains(a.ownerDocument,a)},W=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if(\"object\"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},X=/^(?:checkbox|radio)$/i;!function(){var a=z.createDocumentFragment(),b=z.createElement(\"div\"),c=z.createElement(\"input\");if(b.setAttribute(\"className\",\"t\"),b.innerHTML=\"  <link/><table></table><a href='/a'>a</a>\",l.leadingWhitespace=3===b.firstChild.nodeType,l.tbody=!b.getElementsByTagName(\"tbody\").length,l.htmlSerialize=!!b.getElementsByTagName(\"link\").length,l.html5Clone=\"<:nav></:nav>\"!==z.createElement(\"nav\").cloneNode(!0).outerHTML,c.type=\"checkbox\",c.checked=!0,a.appendChild(c),l.appendChecked=c.checked,b.innerHTML=\"<textarea>x</textarea>\",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,a.appendChild(b),b.innerHTML=\"<input type='radio' checked='checked' name='t'/>\",l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,l.noCloneEvent=!0,b.attachEvent&&(b.attachEvent(\"onclick\",function(){l.noCloneEvent=!1}),b.cloneNode(!0).click()),null==l.deleteExpando){l.deleteExpando=!0;try{delete b.test}catch(d){l.deleteExpando=!1}}a=b=c=null}(),function(){var b,c,d=z.createElement(\"div\");for(b in{submit:!0,change:!0,focusin:!0})c=\"on\"+b,(l[b+\"Bubbles\"]=c in a)||(d.setAttribute(c,\"t\"),l[b+\"Bubbles\"]=d.attributes[c].expando===!1);d=null}();var Y=/^(?:input|select|textarea)$/i,Z=/^key/,$=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,ab=/^([^.]*)(?:\\.(.+)|)$/;function bb(){return!0}function cb(){return!1}function db(){try{return z.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=n.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof n===L||a&&n.event.triggered===a.type?void 0:n.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||\"\").match(F)||[\"\"],h=b.length;while(h--)f=ab.exec(b[h])||[],o=q=f[1],p=(f[2]||\"\").split(\".\").sort(),o&&(j=n.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=n.event.special[o]||{},l=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(\".\")},i),(m=g[o])||(m=g[o]=[],m.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent(\"on\"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,l):m.push(l),n.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n.hasData(a)&&n._data(a);if(r&&(k=r.events)){b=(b||\"\").match(F)||[\"\"],j=b.length;while(j--)if(h=ab.exec(b[j])||[],o=q=h[1],p=(h[2]||\"\").split(\".\").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=k[o]||[],h=h[2]&&new RegExp(\"(^|\\\\.)\"+p.join(\"\\\\.(?:.*\\\\.|)\")+\"(\\\\.|$)\"),i=f=m.length;while(f--)g=m[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&(\"**\"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(k)&&(delete r.handle,n._removeData(a,\"events\"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,m,o=[d||z],p=j.call(b,\"type\")?b.type:b,q=j.call(b,\"namespace\")?b.namespace.split(\".\"):[];if(h=l=d=d||z,3!==d.nodeType&&8!==d.nodeType&&!_.test(p+n.event.triggered)&&(p.indexOf(\".\")>=0&&(q=p.split(\".\"),p=q.shift(),q.sort()),g=p.indexOf(\":\")<0&&\"on\"+p,b=b[n.expando]?b:new n.Event(p,\"object\"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join(\".\"),b.namespace_re=b.namespace?new RegExp(\"(^|\\\\.)\"+q.join(\"\\\\.(?:.*\\\\.|)\")+\"(\\\\.|$)\"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),k=n.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!n.isWindow(d)){for(i=k.delegateType||p,_.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||z)&&o.push(l.defaultView||l.parentWindow||a)}m=0;while((h=o[m++])&&!b.isPropagationStopped())b.type=m>1?i:k.bindType||p,f=(n._data(h,\"events\")||{})[b.type]&&n._data(h,\"handle\"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&n.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&n.acceptData(d)&&g&&d[p]&&!n.isWindow(d)){l=d[g],l&&(d[g]=null),n.event.triggered=p;try{d[p]()}catch(r){}n.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(n._data(this,\"events\")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((n.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||\"click\"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||\"click\"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+\" \",void 0===e[c]&&(e[c]=d.needsContext?n(c,this).index(i)>=0:n.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=$.test(e)?this.mouseHooks:Z.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||z),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:\"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which\".split(\" \"),fixHooks:{},keyHooks:{props:\"char charCode key keyCode\".split(\" \"),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:\"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement\".split(\" \"),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||z,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==db()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:\"focusin\"},blur:{trigger:function(){return this===db()&&this.blur?(this.blur(),!1):void 0},delegateType:\"focusout\"},click:{trigger:function(){return n.nodeName(this,\"input\")&&\"checkbox\"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,\"a\")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=z.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d=\"on\"+b;a.detachEvent&&(typeof a[d]===L&&(a[d]=null),a.detachEvent(d,c))},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&(a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault())?bb:cb):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:cb,isPropagationStopped:cb,isImmediatePropagationStopped:cb,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=bb,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=bb,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()}},n.each({mouseenter:\"mouseover\",mouseleave:\"mouseout\"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.submitBubbles||(n.event.special.submit={setup:function(){return n.nodeName(this,\"form\")?!1:void n.event.add(this,\"click._submit keypress._submit\",function(a){var b=a.target,c=n.nodeName(b,\"input\")||n.nodeName(b,\"button\")?b.form:void 0;c&&!n._data(c,\"submitBubbles\")&&(n.event.add(c,\"submit._submit\",function(a){a._submit_bubble=!0}),n._data(c,\"submitBubbles\",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&n.event.simulate(\"submit\",this.parentNode,a,!0))},teardown:function(){return n.nodeName(this,\"form\")?!1:void n.event.remove(this,\"._submit\")}}),l.changeBubbles||(n.event.special.change={setup:function(){return Y.test(this.nodeName)?((\"checkbox\"===this.type||\"radio\"===this.type)&&(n.event.add(this,\"propertychange._change\",function(a){\"checked\"===a.originalEvent.propertyName&&(this._just_changed=!0)}),n.event.add(this,\"click._change\",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),n.event.simulate(\"change\",this,a,!0)})),!1):void n.event.add(this,\"beforeactivate._change\",function(a){var b=a.target;Y.test(b.nodeName)&&!n._data(b,\"changeBubbles\")&&(n.event.add(b,\"change._change\",function(a){!this.parentNode||a.isSimulated||a.isTrigger||n.event.simulate(\"change\",this.parentNode,a,!0)}),n._data(b,\"changeBubbles\",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||\"radio\"!==b.type&&\"checkbox\"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return n.event.remove(this,\"._change\"),!Y.test(this.nodeName)}}),l.focusinBubbles||n.each({focus:\"focusin\",blur:\"focusout\"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=n._data(d,b);e||d.addEventListener(a,c,!0),n._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=n._data(d,b)-1;e?n._data(d,b,e):(d.removeEventListener(a,c,!0),n._removeData(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if(\"object\"==typeof a){\"string\"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&(\"string\"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=cb;else if(!d)return this;return 1===e&&(g=d,d=function(a){return n().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+\".\"+d.namespace:d.origType,d.selector,d.handler),this;if(\"object\"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||\"function\"==typeof b)&&(c=b,b=void 0),c===!1&&(c=cb),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});function eb(a){var b=fb.split(\"|\"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var fb=\"abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video\",gb=/ jQuery\\d+=\"(?:null|\\d+)\"/g,hb=new RegExp(\"<(?:\"+fb+\")[\\\\s/>]\",\"i\"),ib=/^\\s+/,jb=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\\w:]+)[^>]*)\\/>/gi,kb=/<([\\w:]+)/,lb=/<tbody/i,mb=/<|&#?\\w+;/,nb=/<(?:script|style|link)/i,ob=/checked\\s*(?:[^=]|=\\s*.checked.)/i,pb=/^$|\\/(?:java|ecma)script/i,qb=/^true\\/(.*)/,rb=/^\\s*<!(?:\\[CDATA\\[|--)|(?:\\]\\]|--)>\\s*$/g,sb={option:[1,\"<select multiple='multiple'>\",\"</select>\"],legend:[1,\"<fieldset>\",\"</fieldset>\"],area:[1,\"<map>\",\"</map>\"],param:[1,\"<object>\",\"</object>\"],thead:[1,\"<table>\",\"</table>\"],tr:[2,\"<table><tbody>\",\"</tbody></table>\"],col:[2,\"<table><tbody></tbody><colgroup>\",\"</colgroup></table>\"],td:[3,\"<table><tbody><tr>\",\"</tr></tbody></table>\"],_default:l.htmlSerialize?[0,\"\",\"\"]:[1,\"X<div>\",\"</div>\"]},tb=eb(z),ub=tb.appendChild(z.createElement(\"div\"));sb.optgroup=sb.option,sb.tbody=sb.tfoot=sb.colgroup=sb.caption=sb.thead,sb.th=sb.td;function vb(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==L?a.getElementsByTagName(b||\"*\"):typeof a.querySelectorAll!==L?a.querySelectorAll(b||\"*\"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||n.nodeName(d,b)?f.push(d):n.merge(f,vb(d,b));return void 0===b||b&&n.nodeName(a,b)?n.merge([a],f):f}function wb(a){X.test(a.type)&&(a.defaultChecked=a.checked)}function xb(a,b){return n.nodeName(a,\"table\")&&n.nodeName(11!==b.nodeType?b:b.firstChild,\"tr\")?a.getElementsByTagName(\"tbody\")[0]||a.appendChild(a.ownerDocument.createElement(\"tbody\")):a}function yb(a){return a.type=(null!==n.find.attr(a,\"type\"))+\"/\"+a.type,a}function zb(a){var b=qb.exec(a.type);return b?a.type=b[1]:a.removeAttribute(\"type\"),a}function Ab(a,b){for(var c,d=0;null!=(c=a[d]);d++)n._data(c,\"globalEval\",!b||n._data(b[d],\"globalEval\"))}function Bb(a,b){if(1===b.nodeType&&n.hasData(a)){var c,d,e,f=n._data(a),g=n._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)n.event.add(b,c,h[c][d])}g.data&&(g.data=n.extend({},g.data))}}function Cb(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!l.noCloneEvent&&b[n.expando]){e=n._data(b);for(d in e.events)n.removeEvent(b,d,e.handle);b.removeAttribute(n.expando)}\"script\"===c&&b.text!==a.text?(yb(b).text=a.text,zb(b)):\"object\"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),l.html5Clone&&a.innerHTML&&!n.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):\"input\"===c&&X.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):\"option\"===c?b.defaultSelected=b.selected=a.defaultSelected:(\"input\"===c||\"textarea\"===c)&&(b.defaultValue=a.defaultValue)}}n.extend({clone:function(a,b,c){var d,e,f,g,h,i=n.contains(a.ownerDocument,a);if(l.html5Clone||n.isXMLDoc(a)||!hb.test(\"<\"+a.nodeName+\">\")?f=a.cloneNode(!0):(ub.innerHTML=a.outerHTML,ub.removeChild(f=ub.firstChild)),!(l.noCloneEvent&&l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(d=vb(f),h=vb(a),g=0;null!=(e=h[g]);++g)d[g]&&Cb(e,d[g]);if(b)if(c)for(h=h||vb(a),d=d||vb(f),g=0;null!=(e=h[g]);g++)Bb(e,d[g]);else Bb(a,f);return d=vb(f,\"script\"),d.length>0&&Ab(d,!i&&vb(a,\"script\")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k,m=a.length,o=eb(b),p=[],q=0;m>q;q++)if(f=a[q],f||0===f)if(\"object\"===n.type(f))n.merge(p,f.nodeType?[f]:f);else if(mb.test(f)){h=h||o.appendChild(b.createElement(\"div\")),i=(kb.exec(f)||[\"\",\"\"])[1].toLowerCase(),k=sb[i]||sb._default,h.innerHTML=k[1]+f.replace(jb,\"<$1></$2>\")+k[2],e=k[0];while(e--)h=h.lastChild;if(!l.leadingWhitespace&&ib.test(f)&&p.push(b.createTextNode(ib.exec(f)[0])),!l.tbody){f=\"table\"!==i||lb.test(f)?\"<table>\"!==k[1]||lb.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)n.nodeName(j=f.childNodes[e],\"tbody\")&&!j.childNodes.length&&f.removeChild(j)}n.merge(p,h.childNodes),h.textContent=\"\";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),l.appendChecked||n.grep(vb(p,\"input\"),wb),q=0;while(f=p[q++])if((!d||-1===n.inArray(f,d))&&(g=n.contains(f.ownerDocument,f),h=vb(o.appendChild(f),\"script\"),g&&Ab(h),c)){e=0;while(f=h[e++])pb.test(f.type||\"\")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=n.expando,j=n.cache,k=l.deleteExpando,m=n.event.special;null!=(d=a[h]);h++)if((b||n.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)m[e]?n.event.remove(d,e):n.removeEvent(d,e,g.handle);j[f]&&(delete j[f],k?delete d[i]:typeof d.removeAttribute!==L?d.removeAttribute(i):d[i]=null,c.push(f))}}}),n.fn.extend({text:function(a){return W(this,function(a){return void 0===a?n.text(this):this.empty().append((this[0]&&this[0].ownerDocument||z).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(vb(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&Ab(vb(c,\"script\")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&n.cleanData(vb(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&n.nodeName(a,\"select\")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return W(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(gb,\"\"):void 0;if(!(\"string\"!=typeof a||nb.test(a)||!l.htmlSerialize&&hb.test(a)||!l.leadingWhitespace&&ib.test(a)||sb[(kb.exec(a)||[\"\",\"\"])[1].toLowerCase()])){a=a.replace(jb,\"<$1></$2>\");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(vb(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(vb(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,k=this.length,m=this,o=k-1,p=a[0],q=n.isFunction(p);if(q||k>1&&\"string\"==typeof p&&!l.checkClone&&ob.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(k&&(i=n.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=n.map(vb(i,\"script\"),yb),f=g.length;k>j;j++)d=i,j!==o&&(d=n.clone(d,!0,!0),f&&n.merge(g,vb(d,\"script\"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,n.map(g,zb),j=0;f>j;j++)d=g[j],pb.test(d.type||\"\")&&!n._data(d,\"globalEval\")&&n.contains(h,d)&&(d.src?n._evalUrl&&n._evalUrl(d.src):n.globalEval((d.text||d.textContent||d.innerHTML||\"\").replace(rb,\"\")));i=c=null}return this}}),n.each({appendTo:\"append\",prependTo:\"prepend\",insertBefore:\"before\",insertAfter:\"after\",replaceAll:\"replaceWith\"},function(a,b){n.fn[a]=function(a){for(var c,d=0,e=[],g=n(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),n(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Db,Eb={};function Fb(b,c){var d=n(c.createElement(b)).appendTo(c.body),e=a.getDefaultComputedStyle?a.getDefaultComputedStyle(d[0]).display:n.css(d[0],\"display\");return d.detach(),e}function Gb(a){var b=z,c=Eb[a];return c||(c=Fb(a,b),\"none\"!==c&&c||(Db=(Db||n(\"<iframe frameborder='0' width='0' height='0'/>\")).appendTo(b.documentElement),b=(Db[0].contentWindow||Db[0].contentDocument).document,b.write(),b.close(),c=Fb(a,b),Db.detach()),Eb[a]=c),c}!function(){var a,b,c=z.createElement(\"div\"),d=\"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0\";c.innerHTML=\"  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>\",a=c.getElementsByTagName(\"a\")[0],a.style.cssText=\"float:left;opacity:.5\",l.opacity=/^0.5/.test(a.style.opacity),l.cssFloat=!!a.style.cssFloat,c.style.backgroundClip=\"content-box\",c.cloneNode(!0).style.backgroundClip=\"\",l.clearCloneStyle=\"content-box\"===c.style.backgroundClip,a=c=null,l.shrinkWrapBlocks=function(){var a,c,e,f;if(null==b){if(a=z.getElementsByTagName(\"body\")[0],!a)return;f=\"border:0;width:0;height:0;position:absolute;top:0;left:-9999px\",c=z.createElement(\"div\"),e=z.createElement(\"div\"),a.appendChild(c).appendChild(e),b=!1,typeof e.style.zoom!==L&&(e.style.cssText=d+\";width:1px;padding:1px;zoom:1\",e.innerHTML=\"<div></div>\",e.firstChild.style.width=\"5px\",b=3!==e.offsetWidth),a.removeChild(c),a=c=e=null}return b}}();var Hb=/^margin/,Ib=new RegExp(\"^(\"+T+\")(?!px)[a-z%]+$\",\"i\"),Jb,Kb,Lb=/^(top|right|bottom|left)$/;a.getComputedStyle?(Jb=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(\"\"!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),Ib.test(g)&&Hb.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+\"\"}):z.documentElement.currentStyle&&(Jb=function(a){return a.currentStyle},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Ib.test(g)&&!Lb.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left=\"fontSize\"===b?\"1em\":g,g=h.pixelLeft+\"px\",h.left=d,f&&(e.left=f)),void 0===g?g:g+\"\"||\"auto\"});function Mb(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h=z.createElement(\"div\"),i=\"border:0;width:0;height:0;position:absolute;top:0;left:-9999px\",j=\"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0\";h.innerHTML=\"  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>\",b=h.getElementsByTagName(\"a\")[0],b.style.cssText=\"float:left;opacity:.5\",l.opacity=/^0.5/.test(b.style.opacity),l.cssFloat=!!b.style.cssFloat,h.style.backgroundClip=\"content-box\",h.cloneNode(!0).style.backgroundClip=\"\",l.clearCloneStyle=\"content-box\"===h.style.backgroundClip,b=h=null,n.extend(l,{reliableHiddenOffsets:function(){if(null!=c)return c;var a,b,d,e=z.createElement(\"div\"),f=z.getElementsByTagName(\"body\")[0];if(f)return e.setAttribute(\"className\",\"t\"),e.innerHTML=\"  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>\",a=z.createElement(\"div\"),a.style.cssText=i,f.appendChild(a).appendChild(e),e.innerHTML=\"<table><tr><td></td><td>t</td></tr></table>\",b=e.getElementsByTagName(\"td\"),b[0].style.cssText=\"padding:0;margin:0;border:0;display:none\",d=0===b[0].offsetHeight,b[0].style.display=\"\",b[1].style.display=\"none\",c=d&&0===b[0].offsetHeight,f.removeChild(a),e=f=null,c},boxSizing:function(){return null==d&&k(),d},boxSizingReliable:function(){return null==e&&k(),e},pixelPosition:function(){return null==f&&k(),f},reliableMarginRight:function(){var b,c,d,e;if(null==g&&a.getComputedStyle){if(b=z.getElementsByTagName(\"body\")[0],!b)return;c=z.createElement(\"div\"),d=z.createElement(\"div\"),c.style.cssText=i,b.appendChild(c).appendChild(d),e=d.appendChild(z.createElement(\"div\")),e.style.cssText=d.style.cssText=j,e.style.marginRight=e.style.width=\"0\",d.style.width=\"1px\",g=!parseFloat((a.getComputedStyle(e,null)||{}).marginRight),b.removeChild(c)}return g}});function k(){var b,c,h=z.getElementsByTagName(\"body\")[0];h&&(b=z.createElement(\"div\"),c=z.createElement(\"div\"),b.style.cssText=i,h.appendChild(b).appendChild(c),c.style.cssText=\"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%\",n.swap(h,null!=h.style.zoom?{zoom:1}:{},function(){d=4===c.offsetWidth}),e=!0,f=!1,g=!0,a.getComputedStyle&&(f=\"1%\"!==(a.getComputedStyle(c,null)||{}).top,e=\"4px\"===(a.getComputedStyle(c,null)||{width:\"4px\"}).width),h.removeChild(b),c=h=null)}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Nb=/alpha\\([^)]*\\)/i,Ob=/opacity\\s*=\\s*([^)]*)/,Pb=/^(none|table(?!-c[ea]).+)/,Qb=new RegExp(\"^(\"+T+\")(.*)$\",\"i\"),Rb=new RegExp(\"^([+-])=(\"+T+\")\",\"i\"),Sb={position:\"absolute\",visibility:\"hidden\",display:\"block\"},Tb={letterSpacing:0,fontWeight:400},Ub=[\"Webkit\",\"O\",\"Moz\",\"ms\"];function Vb(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Ub.length;while(e--)if(b=Ub[e]+c,b in a)return b;return d}function Wb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=n._data(d,\"olddisplay\"),c=d.style.display,b?(f[g]||\"none\"!==c||(d.style.display=\"\"),\"\"===d.style.display&&V(d)&&(f[g]=n._data(d,\"olddisplay\",Gb(d.nodeName)))):f[g]||(e=V(d),(c&&\"none\"!==c||!e)&&n._data(d,\"olddisplay\",e?c:n.css(d,\"display\"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&\"none\"!==d.style.display&&\"\"!==d.style.display||(d.style.display=b?f[g]||\"\":\"none\"));return a}function Xb(a,b,c){var d=Qb.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||\"px\"):b}function Yb(a,b,c,d,e){for(var f=c===(d?\"border\":\"content\")?4:\"width\"===b?1:0,g=0;4>f;f+=2)\"margin\"===c&&(g+=n.css(a,c+U[f],!0,e)),d?(\"content\"===c&&(g-=n.css(a,\"padding\"+U[f],!0,e)),\"margin\"!==c&&(g-=n.css(a,\"border\"+U[f]+\"Width\",!0,e))):(g+=n.css(a,\"padding\"+U[f],!0,e),\"padding\"!==c&&(g+=n.css(a,\"border\"+U[f]+\"Width\",!0,e)));return g}function Zb(a,b,c){var d=!0,e=\"width\"===b?a.offsetWidth:a.offsetHeight,f=Jb(a),g=l.boxSizing()&&\"border-box\"===n.css(a,\"boxSizing\",!1,f);if(0>=e||null==e){if(e=Kb(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ib.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Yb(a,b,c||(g?\"border\":\"content\"),d,f)+\"px\"}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Kb(a,\"opacity\");return\"\"===c?\"1\":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{\"float\":l.cssFloat?\"cssFloat\":\"styleFloat\"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;if(b=n.cssProps[h]||(n.cssProps[h]=Vb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c)return g&&\"get\"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,\"string\"===f&&(e=Rb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f=\"number\"),null!=c&&c===c&&(\"number\"!==f||n.cssNumber[h]||(c+=\"px\"),l.clearCloneStyle||\"\"!==c||0!==b.indexOf(\"background\")||(i[b]=\"inherit\"),!(g&&\"set\"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=\"\",i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Vb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&\"get\"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Kb(a,b,d)),\"normal\"===f&&b in Tb&&(f=Tb[b]),\"\"===c||c?(e=parseFloat(f),c===!0||n.isNumeric(e)?e||0:f):f}}),n.each([\"height\",\"width\"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?0===a.offsetWidth&&Pb.test(n.css(a,\"display\"))?n.swap(a,Sb,function(){return Zb(a,b,d)}):Zb(a,b,d):void 0},set:function(a,c,d){var e=d&&Jb(a);return Xb(a,c,d?Yb(a,b,d,l.boxSizing()&&\"border-box\"===n.css(a,\"boxSizing\",!1,e),e):0)}}}),l.opacity||(n.cssHooks.opacity={get:function(a,b){return Ob.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||\"\")?.01*parseFloat(RegExp.$1)+\"\":b?\"1\":\"\"},set:function(a,b){var c=a.style,d=a.currentStyle,e=n.isNumeric(b)?\"alpha(opacity=\"+100*b+\")\":\"\",f=d&&d.filter||c.filter||\"\";c.zoom=1,(b>=1||\"\"===b)&&\"\"===n.trim(f.replace(Nb,\"\"))&&c.removeAttribute&&(c.removeAttribute(\"filter\"),\"\"===b||d&&!d.filter)||(c.filter=Nb.test(f)?f.replace(Nb,e):f+\" \"+e)}}),n.cssHooks.marginRight=Mb(l.reliableMarginRight,function(a,b){return b?n.swap(a,{display:\"inline-block\"},Kb,[a,\"marginRight\"]):void 0}),n.each({margin:\"\",padding:\"\",border:\"Width\"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f=\"string\"==typeof c?c.split(\" \"):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Hb.test(a)||(n.cssHooks[a+b].set=Xb)}),n.fn.extend({css:function(a,b){return W(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Jb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)\n},a,b,arguments.length>1)},show:function(){return Wb(this,!0)},hide:function(){return Wb(this)},toggle:function(a){return\"boolean\"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function $b(a,b,c,d,e){return new $b.prototype.init(a,b,c,d,e)}n.Tween=$b,$b.prototype={constructor:$b,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||\"swing\",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?\"\":\"px\")},cur:function(){var a=$b.propHooks[this.prop];return a&&a.get?a.get(this):$b.propHooks._default.get(this)},run:function(a){var b,c=$b.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):$b.propHooks._default.set(this),this}},$b.prototype.init.prototype=$b.prototype,$b.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,\"\"),b&&\"auto\"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},$b.propHooks.scrollTop=$b.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=$b.prototype.init,n.fx.step={};var _b,ac,bc=/^(?:toggle|show|hide)$/,cc=new RegExp(\"^(?:([+-])=|)(\"+T+\")([a-z%]*)$\",\"i\"),dc=/queueHooks$/,ec=[jc],fc={\"*\":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=cc.exec(b),f=e&&e[3]||(n.cssNumber[a]?\"\":\"px\"),g=(n.cssNumber[a]||\"px\"!==f&&+d)&&cc.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||\".5\",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function gc(){return setTimeout(function(){_b=void 0}),_b=n.now()}function hc(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=U[e],d[\"margin\"+c]=d[\"padding\"+c]=a;return b&&(d.opacity=d.width=a),d}function ic(a,b,c){for(var d,e=(fc[b]||[]).concat(fc[\"*\"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function jc(a,b,c){var d,e,f,g,h,i,j,k,m=this,o={},p=a.style,q=a.nodeType&&V(a),r=n._data(a,\"fxshow\");c.queue||(h=n._queueHooks(a,\"fx\"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,m.always(function(){m.always(function(){h.unqueued--,n.queue(a,\"fx\").length||h.empty.fire()})})),1===a.nodeType&&(\"height\"in b||\"width\"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=n.css(a,\"display\"),k=Gb(a.nodeName),\"none\"===j&&(j=k),\"inline\"===j&&\"none\"===n.css(a,\"float\")&&(l.inlineBlockNeedsLayout&&\"inline\"!==k?p.zoom=1:p.display=\"inline-block\")),c.overflow&&(p.overflow=\"hidden\",l.shrinkWrapBlocks()||m.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],bc.exec(e)){if(delete b[d],f=f||\"toggle\"===e,e===(q?\"hide\":\"show\")){if(\"show\"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||n.style(a,d)}if(!n.isEmptyObject(o)){r?\"hidden\"in r&&(q=r.hidden):r=n._data(a,\"fxshow\",{}),f&&(r.hidden=!q),q?n(a).show():m.done(function(){n(a).hide()}),m.done(function(){var b;n._removeData(a,\"fxshow\");for(b in o)n.style(a,b,o[b])});for(d in o)g=ic(q?r[d]:0,d,m),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start=\"width\"===d||\"height\"===d?1:0))}}function kc(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&\"expand\"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function lc(a,b,c){var d,e,f=0,g=ec.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=_b||gc(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:_b||gc(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(kc(k,j.opts.specialEasing);g>f;f++)if(d=ec[f].call(j,a,k,j.opts))return d;return n.map(k,ic,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(lc,{tweener:function(a,b){n.isFunction(a)?(b=a,a=[\"*\"]):a=a.split(\" \");for(var c,d=0,e=a.length;e>d;d++)c=a[d],fc[c]=fc[c]||[],fc[c].unshift(b)},prefilter:function(a,b){b?ec.unshift(a):ec.push(a)}}),n.speed=function(a,b,c){var d=a&&\"object\"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:\"number\"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue=\"fx\"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css(\"opacity\",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=lc(this,n.extend({},a),f);(e||n._data(this,\"finish\"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return\"string\"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||\"fx\",[]),this.each(function(){var b=!0,e=null!=a&&a+\"queueHooks\",f=n.timers,g=n._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&dc.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||\"fx\"),this.each(function(){var b,c=n._data(this),d=c[a+\"queue\"],e=c[a+\"queueHooks\"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each([\"toggle\",\"show\",\"hide\"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||\"boolean\"==typeof a?c.apply(this,arguments):this.animate(hc(b,!0),a,d,e)}}),n.each({slideDown:hc(\"show\"),slideUp:hc(\"hide\"),slideToggle:hc(\"toggle\"),fadeIn:{opacity:\"show\"},fadeOut:{opacity:\"hide\"},fadeToggle:{opacity:\"toggle\"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=n.timers,c=0;for(_b=n.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||n.fx.stop(),_b=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){ac||(ac=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(ac),ac=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||\"fx\",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e=z.createElement(\"div\");e.setAttribute(\"className\",\"t\"),e.innerHTML=\"  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>\",a=e.getElementsByTagName(\"a\")[0],c=z.createElement(\"select\"),d=c.appendChild(z.createElement(\"option\")),b=e.getElementsByTagName(\"input\")[0],a.style.cssText=\"top:1px\",l.getSetAttribute=\"t\"!==e.className,l.style=/top/.test(a.getAttribute(\"style\")),l.hrefNormalized=\"/a\"===a.getAttribute(\"href\"),l.checkOn=!!b.value,l.optSelected=d.selected,l.enctype=!!z.createElement(\"form\").enctype,c.disabled=!0,l.optDisabled=!d.disabled,b=z.createElement(\"input\"),b.setAttribute(\"value\",\"\"),l.input=\"\"===b.getAttribute(\"value\"),b.value=\"t\",b.setAttribute(\"type\",\"radio\"),l.radioValue=\"t\"===b.value,a=b=c=d=e=null}();var mc=/\\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e=\"\":\"number\"==typeof e?e+=\"\":n.isArray(e)&&(e=n.map(e,function(a){return null==a?\"\":a+\"\"})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&\"set\"in b&&void 0!==b.set(this,e,\"value\")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&\"get\"in b&&void 0!==(c=b.get(e,\"value\"))?c:(c=e.value,\"string\"==typeof c?c.replace(mc,\"\"):null==c?\"\":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,\"value\");return null!=b?b:n.text(a)}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f=\"select-one\"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(l.optDisabled?c.disabled:null!==c.getAttribute(\"disabled\"))||c.parentNode.disabled&&n.nodeName(c.parentNode,\"optgroup\"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)if(d=e[g],n.inArray(n.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),n.each([\"radio\",\"checkbox\"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute(\"value\")?\"on\":a.value})});var nc,oc,pc=n.expr.attrHandle,qc=/^(?:checked|selected)$/i,rc=l.getSetAttribute,sc=l.input;n.fn.extend({attr:function(a,b){return W(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===L?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?oc:nc)),void 0===c?d&&\"get\"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&\"set\"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+\"\"),c):void n.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(F);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)?sc&&rc||!qc.test(c)?a[d]=!1:a[n.camelCase(\"default-\"+c)]=a[d]=!1:n.attr(a,c,\"\"),a.removeAttribute(rc?c:d)},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&\"radio\"===b&&n.nodeName(a,\"input\")){var c=a.value;return a.setAttribute(\"type\",b),c&&(a.value=c),b}}}}}),oc={set:function(a,b,c){return b===!1?n.removeAttr(a,c):sc&&rc||!qc.test(c)?a.setAttribute(!rc&&n.propFix[c]||c,c):a[n.camelCase(\"default-\"+c)]=a[c]=!0,c}},n.each(n.expr.match.bool.source.match(/\\w+/g),function(a,b){var c=pc[b]||n.find.attr;pc[b]=sc&&rc||!qc.test(b)?function(a,b,d){var e,f;return d||(f=pc[b],pc[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,pc[b]=f),e}:function(a,b,c){return c?void 0:a[n.camelCase(\"default-\"+b)]?b.toLowerCase():null}}),sc&&rc||(n.attrHooks.value={set:function(a,b,c){return n.nodeName(a,\"input\")?void(a.defaultValue=b):nc&&nc.set(a,b,c)}}),rc||(nc={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+=\"\",\"value\"===c||b===a.getAttribute(c)?b:void 0}},pc.id=pc.name=pc.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&\"\"!==d.value?d.value:null},n.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:nc.set},n.attrHooks.contenteditable={set:function(a,b,c){nc.set(a,\"\"===b?!1:b,c)}},n.each([\"width\",\"height\"],function(a,b){n.attrHooks[b]={set:function(a,c){return\"\"===c?(a.setAttribute(b,\"auto\"),c):void 0}}})),l.style||(n.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+\"\"}});var tc=/^(?:input|select|textarea|button|object)$/i,uc=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return W(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return a=n.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),n.extend({propFix:{\"for\":\"htmlFor\",\"class\":\"className\"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&\"set\"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&\"get\"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,\"tabindex\");return b?parseInt(b,10):tc.test(a.nodeName)||uc.test(a.nodeName)&&a.href?0:-1}}}}),l.hrefNormalized||n.each([\"href\",\"src\"],function(a,b){n.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),n.each([\"tabIndex\",\"readOnly\",\"maxLength\",\"cellSpacing\",\"cellPadding\",\"rowSpan\",\"colSpan\",\"useMap\",\"frameBorder\",\"contentEditable\"],function(){n.propFix[this.toLowerCase()]=this}),l.enctype||(n.propFix.enctype=\"encoding\");var vc=/[\\t\\r\\n\\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=\"string\"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||\"\").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(\" \"+c.className+\" \").replace(vc,\" \"):\" \")){f=0;while(e=b[f++])d.indexOf(\" \"+e+\" \")<0&&(d+=e+\" \");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||\"string\"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||\"\").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(\" \"+c.className+\" \").replace(vc,\" \"):\"\")){f=0;while(e=b[f++])while(d.indexOf(\" \"+e+\" \")>=0)d=d.replace(\" \"+e+\" \",\" \");g=a?n.trim(d):\"\",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return\"boolean\"==typeof b&&\"string\"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if(\"string\"===c){var b,d=0,e=n(this),f=a.match(F)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===L||\"boolean\"===c)&&(this.className&&n._data(this,\"__className__\",this.className),this.className=this.className||a===!1?\"\":n._data(this,\"__className__\")||\"\")})},hasClass:function(a){for(var b=\" \"+a+\" \",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(\" \"+this[c].className+\" \").replace(vc,\" \").indexOf(b)>=0)return!0;return!1}}),n.each(\"blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu\".split(\" \"),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,\"**\"):this.off(b,a||\"**\",c)}});var wc=n.now(),xc=/\\?/,yc=/(,)|(\\[|{)|(}|])|\"(?:[^\"\\\\\\r\\n]|\\\\[\"\\\\\\/bfnrt]|\\\\u[\\da-fA-F]{4})*\"\\s*:?|true|false|null|-?(?!0\\d)\\d+(?:\\.\\d+|)(?:[eE][+-]?\\d+|)/g;n.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+\"\");var c,d=null,e=n.trim(b+\"\");return e&&!n.trim(e.replace(yc,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,\"\")}))?Function(\"return \"+e)():n.error(\"Invalid JSON: \"+b)},n.parseXML=function(b){var c,d;if(!b||\"string\"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,\"text/xml\")):(c=new ActiveXObject(\"Microsoft.XMLDOM\"),c.async=\"false\",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName(\"parsererror\").length||n.error(\"Invalid XML: \"+b),c};var zc,Ac,Bc=/#.*$/,Cc=/([?&])_=[^&]*/,Dc=/^(.*?):[ \\t]*([^\\r\\n]*)\\r?$/gm,Ec=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Fc=/^(?:GET|HEAD)$/,Gc=/^\\/\\//,Hc=/^([\\w.+-]+:)(?:\\/\\/(?:[^\\/?#]*@|)([^\\/?#:]*)(?::(\\d+)|)|)/,Ic={},Jc={},Kc=\"*/\".concat(\"*\");try{Ac=location.href}catch(Lc){Ac=z.createElement(\"a\"),Ac.href=\"\",Ac=Ac.href}zc=Hc.exec(Ac.toLowerCase())||[];function Mc(a){return function(b,c){\"string\"!=typeof b&&(c=b,b=\"*\");var d,e=0,f=b.toLowerCase().match(F)||[];if(n.isFunction(c))while(d=f[e++])\"+\"===d.charAt(0)?(d=d.slice(1)||\"*\",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nc(a,b,c,d){var e={},f=a===Jc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return\"string\"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e[\"*\"]&&g(\"*\")}function Oc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&n.extend(!0,a,c),a}function Pc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while(\"*\"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader(\"Content-Type\"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+\" \"+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Qc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if(\"*\"===f)f=i;else if(\"*\"!==i&&i!==f){if(g=j[i+\" \"+f]||j[\"* \"+f],!g)for(e in j)if(h=e.split(\" \"),h[1]===f&&(g=j[i+\" \"+h[0]]||j[\"* \"+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a[\"throws\"])b=g(b);else try{b=g(b)}catch(l){return{state:\"parsererror\",error:g?l:\"No conversion from \"+i+\" to \"+f}}}return{state:\"success\",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ac,type:\"GET\",isLocal:Ec.test(zc[1]),global:!0,processData:!0,async:!0,contentType:\"application/x-www-form-urlencoded; charset=UTF-8\",accepts:{\"*\":Kc,text:\"text/plain\",html:\"text/html\",xml:\"application/xml, text/xml\",json:\"application/json, text/javascript\"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:\"responseXML\",text:\"responseText\",json:\"responseJSON\"},converters:{\"* text\":String,\"text html\":!0,\"text json\":n.parseJSON,\"text xml\":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Oc(Oc(a,n.ajaxSettings),b):Oc(n.ajaxSettings,a)},ajaxPrefilter:Mc(Ic),ajaxTransport:Mc(Jc),ajax:function(a,b){\"object\"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks(\"once memory\"),q=k.statusCode||{},r={},s={},t=0,u=\"canceled\",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Dc.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||Ac)+\"\").replace(Bc,\"\").replace(Gc,zc[1]+\"//\"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||\"*\").toLowerCase().match(F)||[\"\"],null==k.crossDomain&&(c=Hc.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===zc[1]&&c[2]===zc[2]&&(c[3]||(\"http:\"===c[1]?\"80\":\"443\"))===(zc[3]||(\"http:\"===zc[1]?\"80\":\"443\")))),k.data&&k.processData&&\"string\"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),Nc(Ic,k,b,v),2===t)return v;h=k.global,h&&0===n.active++&&n.event.trigger(\"ajaxStart\"),k.type=k.type.toUpperCase(),k.hasContent=!Fc.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(xc.test(e)?\"&\":\"?\")+k.data,delete k.data),k.cache===!1&&(k.url=Cc.test(e)?e.replace(Cc,\"$1_=\"+wc++):e+(xc.test(e)?\"&\":\"?\")+\"_=\"+wc++)),k.ifModified&&(n.lastModified[e]&&v.setRequestHeader(\"If-Modified-Since\",n.lastModified[e]),n.etag[e]&&v.setRequestHeader(\"If-None-Match\",n.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader(\"Content-Type\",k.contentType),v.setRequestHeader(\"Accept\",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+(\"*\"!==k.dataTypes[0]?\", \"+Kc+\"; q=0.01\":\"\"):k.accepts[\"*\"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u=\"abort\";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Nc(Jc,k,b,v)){v.readyState=1,h&&m.trigger(\"ajaxSend\",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort(\"timeout\")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,\"No Transport\");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||\"\",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Pc(k,v,c)),u=Qc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader(\"Last-Modified\"),w&&(n.lastModified[e]=w),w=v.getResponseHeader(\"etag\"),w&&(n.etag[e]=w)),204===a||\"HEAD\"===k.type?x=\"nocontent\":304===a?x=\"notmodified\":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x=\"error\",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+\"\",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&m.trigger(j?\"ajaxSuccess\":\"ajaxError\",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(m.trigger(\"ajaxComplete\",[v,k]),--n.active||n.event.trigger(\"ajaxStop\")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,\"json\")},getScript:function(a,b){return n.get(a,void 0,b,\"script\")}}),n.each([\"get\",\"post\"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n.each([\"ajaxStart\",\"ajaxStop\",\"ajaxComplete\",\"ajaxError\",\"ajaxSuccess\",\"ajaxSend\"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n._evalUrl=function(a){return n.ajax({url:a,type:\"GET\",dataType:\"script\",async:!1,global:!1,\"throws\":!0})},n.fn.extend({wrapAll:function(a){if(n.isFunction(a))return this.each(function(b){n(this).wrapAll(a.call(this,b))});if(this[0]){var b=n(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,\"body\")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!l.reliableHiddenOffsets()&&\"none\"===(a.style&&a.style.display||n.css(a,\"display\"))},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var Rc=/%20/g,Sc=/\\[\\]$/,Tc=/\\r?\\n/g,Uc=/^(?:submit|button|image|reset|file)$/i,Vc=/^(?:input|select|textarea|keygen)/i;function Wc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Sc.test(a)?d(a,e):Wc(a+\"[\"+(\"object\"==typeof e?b:\"\")+\"]\",e,c,d)});else if(c||\"object\"!==n.type(b))d(a,b);else for(e in b)Wc(a+\"[\"+e+\"]\",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?\"\":b,d[d.length]=encodeURIComponent(a)+\"=\"+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Wc(c,a[c],b,e);return d.join(\"&\").replace(Rc,\"+\")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,\"elements\");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(\":disabled\")&&Vc.test(this.nodeName)&&!Uc.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Tc,\"\\r\\n\")}}):{name:b.name,value:c.replace(Tc,\"\\r\\n\")}}).get()}}),n.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&$c()||_c()}:$c;var Xc=0,Yc={},Zc=n.ajaxSettings.xhr();a.ActiveXObject&&n(a).on(\"unload\",function(){for(var a in Yc)Yc[a](void 0,!0)}),l.cors=!!Zc&&\"withCredentials\"in Zc,Zc=l.ajax=!!Zc,Zc&&n.ajaxTransport(function(a){if(!a.crossDomain||l.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Xc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c[\"X-Requested-With\"]||(c[\"X-Requested-With\"]=\"XMLHttpRequest\");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+\"\");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Yc[g],b=void 0,f.onreadystatechange=n.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,\"string\"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=\"\"}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Yc[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function $c(){try{return new a.XMLHttpRequest}catch(b){}}function _c(){try{return new a.ActiveXObject(\"Microsoft.XMLHTTP\")}catch(b){}}n.ajaxSetup({accepts:{script:\"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript\"},contents:{script:/(?:java|ecma)script/},converters:{\"text script\":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter(\"script\",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type=\"GET\",a.global=!1)}),n.ajaxTransport(\"script\",function(a){if(a.crossDomain){var b,c=z.head||n(\"head\")[0]||z.documentElement;return{send:function(d,e){b=z.createElement(\"script\"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,\"success\"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var ad=[],bd=/(=)\\?(?=&|$)|\\?\\?/;n.ajaxSetup({jsonp:\"callback\",jsonpCallback:function(){var a=ad.pop()||n.expando+\"_\"+wc++;return this[a]=!0,a}}),n.ajaxPrefilter(\"json jsonp\",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(bd.test(b.url)?\"url\":\"string\"==typeof b.data&&!(b.contentType||\"\").indexOf(\"application/x-www-form-urlencoded\")&&bd.test(b.data)&&\"data\");return h||\"jsonp\"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(bd,\"$1\"+e):b.jsonp!==!1&&(b.url+=(xc.test(b.url)?\"&\":\"?\")+b.jsonp+\"=\"+e),b.converters[\"script json\"]=function(){return g||n.error(e+\" was not called\"),g[0]},b.dataTypes[0]=\"json\",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,ad.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),\"script\"):void 0}),n.parseHTML=function(a,b,c){if(!a||\"string\"!=typeof a)return null;\"boolean\"==typeof b&&(c=b,b=!1),b=b||z;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var cd=n.fn.load;n.fn.load=function(a,b,c){if(\"string\"!=typeof a&&cd)return cd.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(\" \");return h>=0&&(d=a.slice(h,a.length),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&\"object\"==typeof b&&(f=\"POST\"),g.length>0&&n.ajax({url:a,type:f,dataType:\"html\",data:b}).done(function(a){e=arguments,g.html(d?n(\"<div>\").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var dd=a.document.documentElement;function ed(a){return n.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,\"position\"),l=n(a),m={};\"static\"===k&&(a.style.position=\"relative\"),h=l.offset(),f=n.css(a,\"top\"),i=n.css(a,\"left\"),j=(\"absolute\"===k||\"fixed\"===k)&&n.inArray(\"auto\",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),\"using\"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,n.contains(b,e)?(typeof e.getBoundingClientRect!==L&&(d=e.getBoundingClientRect()),c=ed(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return\"fixed\"===n.css(d,\"position\")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],\"html\")||(c=a.offset()),c.top+=n.css(a[0],\"borderTopWidth\",!0),c.left+=n.css(a[0],\"borderLeftWidth\",!0)),{top:b.top-c.top-n.css(d,\"marginTop\",!0),left:b.left-c.left-n.css(d,\"marginLeft\",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||dd;while(a&&!n.nodeName(a,\"html\")&&\"static\"===n.css(a,\"position\"))a=a.offsetParent;return a||dd})}}),n.each({scrollLeft:\"pageXOffset\",scrollTop:\"pageYOffset\"},function(a,b){var c=/Y/.test(b);n.fn[a]=function(d){return W(this,function(a,d,e){var f=ed(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?n(f).scrollLeft():e,c?e:n(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),n.each([\"top\",\"left\"],function(a,b){n.cssHooks[b]=Mb(l.pixelPosition,function(a,c){return c?(c=Kb(a,b),Ib.test(c)?n(a).position()[b]+\"px\":c):void 0})}),n.each({Height:\"height\",Width:\"width\"},function(a,b){n.each({padding:\"inner\"+a,content:b,\"\":\"outer\"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||\"boolean\"!=typeof d),g=c||(d===!0||e===!0?\"margin\":\"border\");return W(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement[\"client\"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body[\"scroll\"+a],e[\"scroll\"+a],b.body[\"offset\"+a],e[\"offset\"+a],e[\"client\"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,\"function\"==typeof define&&define.amd&&define(\"jquery\",[],function(){return n});var fd=a.jQuery,gd=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=gd),b&&a.jQuery===n&&(a.jQuery=fd),n},typeof b===L&&(a.jQuery=a.$=n),n});","type":"blob"},"test/jquery.coffee":{"path":"test/jquery.coffee","mode":"100644","content":"myQuery = require \"../lib/jquery\"\nrequire \"../main\"\n\ndescribe \"jQuery\", ->\n  it \"should totes exist\", ->\n    assert myQuery\n    assert jQuery\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"jQuery\n======\n\nRequire jQuery for all to see!\n\n    global.$ = global.jQuery = require \"./lib/jquery\"\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"1.11.0.0\"\n","type":"blob"}},"distribution":{"lib/jquery":function(require, global, module, exports, PACKAGE) {
  /*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k="".trim,l={},m="1.11.0",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(n.isPlainObject(c)||(b=n.isArray(c)))?(b?(b=!1,f=a&&n.isArray(a)?a:[]):f=a&&n.isPlainObject(a)?a:{},g[d]=n.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray||function(a){return"array"===n.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return a-parseFloat(a)>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(l.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&n.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:k&&!k.call("\ufeff\xa0")?function(a){return null==a?"":k.call(a)}:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),n.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||n.guid++,e):void 0},now:function(){return+new Date},support:l}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s="sizzle"+-new Date,t=a.document,u=0,v=0,w=eb(),x=eb(),y=eb(),z=function(a,b){return a===b&&(j=!0),0},A="undefined",B=1<<31,C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=D.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",M=L.replace("w","w#"),N="\\["+K+"*("+L+")"+K+"*(?:([*^$|!~]?=)"+K+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+M+")|)|)"+K+"*\\]",O=":("+L+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+N.replace(3,8)+")*)|.*)\\)|)",P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(O),U=new RegExp("^"+M+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L.replace("w","w*")+")"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=/'|\\/g,ab=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),bb=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{G.apply(D=H.call(t.childNodes),t.childNodes),D[t.childNodes.length].nodeType}catch(cb){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function db(a,b,d,e){var f,g,h,i,j,m,p,q,u,v;if((b?b.ownerDocument||b:t)!==l&&k(b),b=b||l,d=d||[],!a||"string"!=typeof a)return d;if(1!==(i=b.nodeType)&&9!==i)return[];if(n&&!e){if(f=Z.exec(a))if(h=f[1]){if(9===i){if(g=b.getElementById(h),!g||!g.parentNode)return d;if(g.id===h)return d.push(g),d}else if(b.ownerDocument&&(g=b.ownerDocument.getElementById(h))&&r(b,g)&&g.id===h)return d.push(g),d}else{if(f[2])return G.apply(d,b.getElementsByTagName(a)),d;if((h=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(h)),d}if(c.qsa&&(!o||!o.test(a))){if(q=p=s,u=b,v=9===i&&a,1===i&&"object"!==b.nodeName.toLowerCase()){m=ob(a),(p=b.getAttribute("id"))?q=p.replace(_,"\\$&"):b.setAttribute("id",q),q="[id='"+q+"'] ",j=m.length;while(j--)m[j]=q+pb(m[j]);u=$.test(a)&&mb(b.parentNode)||b,v=m.join(",")}if(v)try{return G.apply(d,u.querySelectorAll(v)),d}catch(w){}finally{p||b.removeAttribute("id")}}}return xb(a.replace(P,"$1"),b,d,e)}function eb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function fb(a){return a[s]=!0,a}function gb(a){var b=l.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function hb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function ib(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||B)-(~a.sourceIndex||B);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function jb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function kb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function lb(a){return fb(function(b){return b=+b,fb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function mb(a){return a&&typeof a.getElementsByTagName!==A&&a}c=db.support={},f=db.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},k=db.setDocument=function(a){var b,e=a?a.ownerDocument||a:t,g=e.defaultView;return e!==l&&9===e.nodeType&&e.documentElement?(l=e,m=e.documentElement,n=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){k()},!1):g.attachEvent&&g.attachEvent("onunload",function(){k()})),c.attributes=gb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=gb(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(e.getElementsByClassName)&&gb(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=gb(function(a){return m.appendChild(a).id=s,!e.getElementsByName||!e.getElementsByName(s).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==A&&n){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){var c=typeof a.getAttributeNode!==A&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==A?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==A&&n?b.getElementsByClassName(a):void 0},p=[],o=[],(c.qsa=Y.test(e.querySelectorAll))&&(gb(function(a){a.innerHTML="<select t=''><option selected=''></option></select>",a.querySelectorAll("[t^='']").length&&o.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||o.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll(":checked").length||o.push(":checked")}),gb(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&o.push("name"+K+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||o.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),o.push(",.*:")})),(c.matchesSelector=Y.test(q=m.webkitMatchesSelector||m.mozMatchesSelector||m.oMatchesSelector||m.msMatchesSelector))&&gb(function(a){c.disconnectedMatch=q.call(a,"div"),q.call(a,"[s!='']:x"),p.push("!=",O)}),o=o.length&&new RegExp(o.join("|")),p=p.length&&new RegExp(p.join("|")),b=Y.test(m.compareDocumentPosition),r=b||Y.test(m.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},z=b?function(a,b){if(a===b)return j=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===t&&r(t,a)?-1:b===e||b.ownerDocument===t&&r(t,b)?1:i?I.call(i,a)-I.call(i,b):0:4&d?-1:1)}:function(a,b){if(a===b)return j=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],k=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:i?I.call(i,a)-I.call(i,b):0;if(f===g)return ib(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)k.unshift(c);while(h[d]===k[d])d++;return d?ib(h[d],k[d]):h[d]===t?-1:k[d]===t?1:0},e):l},db.matches=function(a,b){return db(a,null,null,b)},db.matchesSelector=function(a,b){if((a.ownerDocument||a)!==l&&k(a),b=b.replace(S,"='$1']"),!(!c.matchesSelector||!n||p&&p.test(b)||o&&o.test(b)))try{var d=q.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return db(b,l,null,[a]).length>0},db.contains=function(a,b){return(a.ownerDocument||a)!==l&&k(a),r(a,b)},db.attr=function(a,b){(a.ownerDocument||a)!==l&&k(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!n):void 0;return void 0!==f?f:c.attributes||!n?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},db.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},db.uniqueSort=function(a){var b,d=[],e=0,f=0;if(j=!c.detectDuplicates,i=!c.sortStable&&a.slice(0),a.sort(z),j){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return i=null,a},e=db.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=db.selectors={cacheLength:50,createPseudo:fb,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ab,bb),a[3]=(a[4]||a[5]||"").replace(ab,bb),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||db.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&db.error(a[0]),a},PSEUDO:function(a){var b,c=!a[5]&&a[2];return V.CHILD.test(a[0])?null:(a[3]&&void 0!==a[4]?a[2]=a[4]:c&&T.test(c)&&(b=ob(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ab,bb).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=w[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&w(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==A&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=db.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),t=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&t){k=q[s]||(q[s]={}),j=k[a]||[],n=j[0]===u&&j[1],m=j[0]===u&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[u,n,m];break}}else if(t&&(j=(b[s]||(b[s]={}))[a])&&j[0]===u)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(t&&((l[s]||(l[s]={}))[a]=[u,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||db.error("unsupported pseudo: "+a);return e[s]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?fb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:fb(function(a){var b=[],c=[],d=g(a.replace(P,"$1"));return d[s]?fb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:fb(function(a){return function(b){return db(a,b).length>0}}),contains:fb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:fb(function(a){return U.test(a||"")||db.error("unsupported lang: "+a),a=a.replace(ab,bb).toLowerCase(),function(b){var c;do if(c=n?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===m},focus:function(a){return a===l.activeElement&&(!l.hasFocus||l.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:lb(function(){return[0]}),last:lb(function(a,b){return[b-1]}),eq:lb(function(a,b,c){return[0>c?c+b:c]}),even:lb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:lb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:lb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:lb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=jb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=kb(b);function nb(){}nb.prototype=d.filters=d.pseudos,d.setFilters=new nb;function ob(a,b){var c,e,f,g,h,i,j,k=x[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=Q.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?db.error(a):x(a,i).slice(0)}function pb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function qb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=v++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[u,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[s]||(b[s]={}),(h=i[d])&&h[0]===u&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function rb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function sb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function tb(a,b,c,d,e,f){return d&&!d[s]&&(d=tb(d)),e&&!e[s]&&(e=tb(e,f)),fb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||wb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:sb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=sb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=sb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ub(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],i=g||d.relative[" "],j=g?1:0,k=qb(function(a){return a===b},i,!0),l=qb(function(a){return I.call(b,a)>-1},i,!0),m=[function(a,c,d){return!g&&(d||c!==h)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>j;j++)if(c=d.relative[a[j].type])m=[qb(rb(m),c)];else{if(c=d.filter[a[j].type].apply(null,a[j].matches),c[s]){for(e=++j;f>e;e++)if(d.relative[a[e].type])break;return tb(j>1&&rb(m),j>1&&pb(a.slice(0,j-1).concat({value:" "===a[j-2].type?"*":""})).replace(P,"$1"),c,e>j&&ub(a.slice(j,e)),f>e&&ub(a=a.slice(e)),f>e&&pb(a))}m.push(c)}return rb(m)}function vb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,i,j,k){var m,n,o,p=0,q="0",r=f&&[],s=[],t=h,v=f||e&&d.find.TAG("*",k),w=u+=null==t?1:Math.random()||.1,x=v.length;for(k&&(h=g!==l&&g);q!==x&&null!=(m=v[q]);q++){if(e&&m){n=0;while(o=a[n++])if(o(m,g,i)){j.push(m);break}k&&(u=w)}c&&((m=!o&&m)&&p--,f&&r.push(m))}if(p+=q,c&&q!==p){n=0;while(o=b[n++])o(r,s,g,i);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=E.call(j));s=sb(s)}G.apply(j,s),k&&!f&&s.length>0&&p+b.length>1&&db.uniqueSort(j)}return k&&(u=w,h=t),r};return c?fb(f):f}g=db.compile=function(a,b){var c,d=[],e=[],f=y[a+" "];if(!f){b||(b=ob(a)),c=b.length;while(c--)f=ub(b[c]),f[s]?d.push(f):e.push(f);f=y(a,vb(e,d))}return f};function wb(a,b,c){for(var d=0,e=b.length;e>d;d++)db(a,b[d],c);return c}function xb(a,b,e,f){var h,i,j,k,l,m=ob(a);if(!f&&1===m.length){if(i=m[0]=m[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&c.getById&&9===b.nodeType&&n&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(ab,bb),b)||[])[0],!b)return e;a=a.slice(i.shift().value.length)}h=V.needsContext.test(a)?0:i.length;while(h--){if(j=i[h],d.relative[k=j.type])break;if((l=d.find[k])&&(f=l(j.matches[0].replace(ab,bb),$.test(i[0].type)&&mb(b.parentNode)||b))){if(i.splice(h,1),a=f.length&&pb(i),!a)return G.apply(e,f),e;break}}}return g(a,m)(f,b,!n,e,$.test(a)&&mb(b.parentNode)||b),e}return c.sortStable=s.split("").sort(z).join("")===s,c.detectDuplicates=!!j,k(),c.sortDetached=gb(function(a){return 1&a.compareDocumentPosition(l.createElement("div"))}),gb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||hb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&gb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||hb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),gb(function(a){return null==a.getAttribute("disabled")})||hb(J,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),db}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return n.inArray(a,b)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;e>b;b++)if(n.contains(d[b],this))return!0}));for(b=0;e>b;b++)n.find(a,d[b],c);return c=this.pushStack(e>1?n.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=a.document,A=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,B=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:A.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:z,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=z.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return y.find(a);this.length=1,this[0]=d}return this.context=z,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};B.prototype=n.fn,y=n(z);var C=/^(?:parents|prev(?:Until|All))/,D={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!n(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b,c=n(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(n.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?n.inArray(this[0],n(a)):n.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function E(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return E(a,"nextSibling")},prev:function(a){return E(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return n.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(D[a]||(e=n.unique(e)),C.test(a)&&(e=e.reverse())),this.pushStack(e)}});var F=/\S+/g,G={};function H(a){var b=G[a]={};return n.each(a.match(F)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?G[a]||H(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&n.each(arguments,function(a,c){var d;while((d=n.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){if(a===!0?!--n.readyWait:!n.isReady){if(!z.body)return setTimeout(n.ready);n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(z,[n]),n.fn.trigger&&n(z).trigger("ready").off("ready"))}}});function J(){z.addEventListener?(z.removeEventListener("DOMContentLoaded",K,!1),a.removeEventListener("load",K,!1)):(z.detachEvent("onreadystatechange",K),a.detachEvent("onload",K))}function K(){(z.addEventListener||"load"===event.type||"complete"===z.readyState)&&(J(),n.ready())}n.ready.promise=function(b){if(!I)if(I=n.Deferred(),"complete"===z.readyState)setTimeout(n.ready);else if(z.addEventListener)z.addEventListener("DOMContentLoaded",K,!1),a.addEventListener("load",K,!1);else{z.attachEvent("onreadystatechange",K),a.attachEvent("onload",K);var c=!1;try{c=null==a.frameElement&&z.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!n.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}J(),n.ready()}}()}return I.promise(b)};var L="undefined",M;for(M in n(l))break;l.ownLast="0"!==M,l.inlineBlockNeedsLayout=!1,n(function(){var a,b,c=z.getElementsByTagName("body")[0];c&&(a=z.createElement("div"),a.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",b=z.createElement("div"),c.appendChild(a).appendChild(b),typeof b.style.zoom!==L&&(b.style.cssText="border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1",(l.inlineBlockNeedsLayout=3===b.offsetWidth)&&(c.style.zoom=1)),c.removeChild(a),a=b=null)}),function(){var a=z.createElement("div");if(null==l.deleteExpando){l.deleteExpando=!0;try{delete a.test}catch(b){l.deleteExpando=!1}}a=null}(),n.acceptData=function(a){var b=n.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(O,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}n.data(a,b,c)}else c=void 0}return c}function Q(a){var b;for(b in a)if(("data"!==b||!n.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function R(a,b,d,e){if(n.acceptData(a)){var f,g,h=n.expando,i=a.nodeType,j=i?n.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||n.guid++:h),j[k]||(j[k]=i?{}:{toJSON:n.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=n.extend(j[k],b):j[k].data=n.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[n.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[n.camelCase(b)])):f=g,f
}}function S(a,b,c){if(n.acceptData(a)){var d,e,f=a.nodeType,g=f?n.cache:a,h=f?a[n.expando]:n.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){n.isArray(b)?b=b.concat(n.map(b,n.camelCase)):b in d?b=[b]:(b=n.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!Q(d):!n.isEmptyObject(d))return}(c||(delete g[h].data,Q(g[h])))&&(f?n.cleanData([a],!0):l.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}n.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?n.cache[a[n.expando]]:a[n.expando],!!a&&!Q(a)},data:function(a,b,c){return R(a,b,c)},removeData:function(a,b){return S(a,b)},_data:function(a,b,c){return R(a,b,c,!0)},_removeData:function(a,b){return S(a,b,!0)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=n.data(f),1===f.nodeType&&!n._data(f,"parsedAttrs"))){c=g.length;while(c--)d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d]));n._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){n.data(this,a)}):arguments.length>1?this.each(function(){n.data(this,a,b)}):f?P(f,a,n.data(f,a)):void 0},removeData:function(a){return this.each(function(){n.removeData(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=n._data(a,b),c&&(!d||n.isArray(c)?d=n._data(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return n._data(a,c)||n._data(a,c,{empty:n.Callbacks("once memory").add(function(){n._removeData(a,b+"queue"),n._removeData(a,c)})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=n._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var T=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},W=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},X=/^(?:checkbox|radio)$/i;!function(){var a=z.createDocumentFragment(),b=z.createElement("div"),c=z.createElement("input");if(b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a>",l.leadingWhitespace=3===b.firstChild.nodeType,l.tbody=!b.getElementsByTagName("tbody").length,l.htmlSerialize=!!b.getElementsByTagName("link").length,l.html5Clone="<:nav></:nav>"!==z.createElement("nav").cloneNode(!0).outerHTML,c.type="checkbox",c.checked=!0,a.appendChild(c),l.appendChecked=c.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,a.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,l.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){l.noCloneEvent=!1}),b.cloneNode(!0).click()),null==l.deleteExpando){l.deleteExpando=!0;try{delete b.test}catch(d){l.deleteExpando=!1}}a=b=c=null}(),function(){var b,c,d=z.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(l[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),l[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var Y=/^(?:input|select|textarea)$/i,Z=/^key/,$=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,ab=/^([^.]*)(?:\.(.+)|)$/;function bb(){return!0}function cb(){return!1}function db(){try{return z.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=n.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof n===L||a&&n.event.triggered===a.type?void 0:n.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(F)||[""],h=b.length;while(h--)f=ab.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=n.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=n.event.special[o]||{},l=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},i),(m=g[o])||(m=g[o]=[],m.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,l):m.push(l),n.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n.hasData(a)&&n._data(a);if(r&&(k=r.events)){b=(b||"").match(F)||[""],j=b.length;while(j--)if(h=ab.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=m.length;while(f--)g=m[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(k)&&(delete r.handle,n._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,m,o=[d||z],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||z,3!==d.nodeType&&8!==d.nodeType&&!_.test(p+n.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[n.expando]?b:new n.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),k=n.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!n.isWindow(d)){for(i=k.delegateType||p,_.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||z)&&o.push(l.defaultView||l.parentWindow||a)}m=0;while((h=o[m++])&&!b.isPropagationStopped())b.type=m>1?i:k.bindType||p,f=(n._data(h,"events")||{})[b.type]&&n._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&n.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&n.acceptData(d)&&g&&d[p]&&!n.isWindow(d)){l=d[g],l&&(d[g]=null),n.event.triggered=p;try{d[p]()}catch(r){}n.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(n._data(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((n.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?n(c,this).index(i)>=0:n.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=$.test(e)?this.mouseHooks:Z.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||z),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||z,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==db()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===db()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return n.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=z.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===L&&(a[d]=null),a.detachEvent(d,c))},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&(a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault())?bb:cb):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:cb,isPropagationStopped:cb,isImmediatePropagationStopped:cb,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=bb,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=bb,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.submitBubbles||(n.event.special.submit={setup:function(){return n.nodeName(this,"form")?!1:void n.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=n.nodeName(b,"input")||n.nodeName(b,"button")?b.form:void 0;c&&!n._data(c,"submitBubbles")&&(n.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),n._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&n.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return n.nodeName(this,"form")?!1:void n.event.remove(this,"._submit")}}),l.changeBubbles||(n.event.special.change={setup:function(){return Y.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(n.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),n.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),n.event.simulate("change",this,a,!0)})),!1):void n.event.add(this,"beforeactivate._change",function(a){var b=a.target;Y.test(b.nodeName)&&!n._data(b,"changeBubbles")&&(n.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||n.event.simulate("change",this.parentNode,a,!0)}),n._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return n.event.remove(this,"._change"),!Y.test(this.nodeName)}}),l.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=n._data(d,b);e||d.addEventListener(a,c,!0),n._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=n._data(d,b)-1;e?n._data(d,b,e):(d.removeEventListener(a,c,!0),n._removeData(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=cb;else if(!d)return this;return 1===e&&(g=d,d=function(a){return n().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=cb),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});function eb(a){var b=fb.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var fb="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gb=/ jQuery\d+="(?:null|\d+)"/g,hb=new RegExp("<(?:"+fb+")[\\s/>]","i"),ib=/^\s+/,jb=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,kb=/<([\w:]+)/,lb=/<tbody/i,mb=/<|&#?\w+;/,nb=/<(?:script|style|link)/i,ob=/checked\s*(?:[^=]|=\s*.checked.)/i,pb=/^$|\/(?:java|ecma)script/i,qb=/^true\/(.*)/,rb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,sb={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:l.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},tb=eb(z),ub=tb.appendChild(z.createElement("div"));sb.optgroup=sb.option,sb.tbody=sb.tfoot=sb.colgroup=sb.caption=sb.thead,sb.th=sb.td;function vb(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==L?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==L?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||n.nodeName(d,b)?f.push(d):n.merge(f,vb(d,b));return void 0===b||b&&n.nodeName(a,b)?n.merge([a],f):f}function wb(a){X.test(a.type)&&(a.defaultChecked=a.checked)}function xb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function yb(a){return a.type=(null!==n.find.attr(a,"type"))+"/"+a.type,a}function zb(a){var b=qb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ab(a,b){for(var c,d=0;null!=(c=a[d]);d++)n._data(c,"globalEval",!b||n._data(b[d],"globalEval"))}function Bb(a,b){if(1===b.nodeType&&n.hasData(a)){var c,d,e,f=n._data(a),g=n._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)n.event.add(b,c,h[c][d])}g.data&&(g.data=n.extend({},g.data))}}function Cb(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!l.noCloneEvent&&b[n.expando]){e=n._data(b);for(d in e.events)n.removeEvent(b,d,e.handle);b.removeAttribute(n.expando)}"script"===c&&b.text!==a.text?(yb(b).text=a.text,zb(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),l.html5Clone&&a.innerHTML&&!n.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&X.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}n.extend({clone:function(a,b,c){var d,e,f,g,h,i=n.contains(a.ownerDocument,a);if(l.html5Clone||n.isXMLDoc(a)||!hb.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(ub.innerHTML=a.outerHTML,ub.removeChild(f=ub.firstChild)),!(l.noCloneEvent&&l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(d=vb(f),h=vb(a),g=0;null!=(e=h[g]);++g)d[g]&&Cb(e,d[g]);if(b)if(c)for(h=h||vb(a),d=d||vb(f),g=0;null!=(e=h[g]);g++)Bb(e,d[g]);else Bb(a,f);return d=vb(f,"script"),d.length>0&&Ab(d,!i&&vb(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k,m=a.length,o=eb(b),p=[],q=0;m>q;q++)if(f=a[q],f||0===f)if("object"===n.type(f))n.merge(p,f.nodeType?[f]:f);else if(mb.test(f)){h=h||o.appendChild(b.createElement("div")),i=(kb.exec(f)||["",""])[1].toLowerCase(),k=sb[i]||sb._default,h.innerHTML=k[1]+f.replace(jb,"<$1></$2>")+k[2],e=k[0];while(e--)h=h.lastChild;if(!l.leadingWhitespace&&ib.test(f)&&p.push(b.createTextNode(ib.exec(f)[0])),!l.tbody){f="table"!==i||lb.test(f)?"<table>"!==k[1]||lb.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)n.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}n.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),l.appendChecked||n.grep(vb(p,"input"),wb),q=0;while(f=p[q++])if((!d||-1===n.inArray(f,d))&&(g=n.contains(f.ownerDocument,f),h=vb(o.appendChild(f),"script"),g&&Ab(h),c)){e=0;while(f=h[e++])pb.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=n.expando,j=n.cache,k=l.deleteExpando,m=n.event.special;null!=(d=a[h]);h++)if((b||n.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)m[e]?n.event.remove(d,e):n.removeEvent(d,e,g.handle);j[f]&&(delete j[f],k?delete d[i]:typeof d.removeAttribute!==L?d.removeAttribute(i):d[i]=null,c.push(f))}}}),n.fn.extend({text:function(a){return W(this,function(a){return void 0===a?n.text(this):this.empty().append((this[0]&&this[0].ownerDocument||z).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(vb(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&Ab(vb(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&n.cleanData(vb(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&n.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return W(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(gb,""):void 0;if(!("string"!=typeof a||nb.test(a)||!l.htmlSerialize&&hb.test(a)||!l.leadingWhitespace&&ib.test(a)||sb[(kb.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(jb,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(vb(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(vb(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,k=this.length,m=this,o=k-1,p=a[0],q=n.isFunction(p);if(q||k>1&&"string"==typeof p&&!l.checkClone&&ob.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(k&&(i=n.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=n.map(vb(i,"script"),yb),f=g.length;k>j;j++)d=i,j!==o&&(d=n.clone(d,!0,!0),f&&n.merge(g,vb(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,n.map(g,zb),j=0;f>j;j++)d=g[j],pb.test(d.type||"")&&!n._data(d,"globalEval")&&n.contains(h,d)&&(d.src?n._evalUrl&&n._evalUrl(d.src):n.globalEval((d.text||d.textContent||d.innerHTML||"").replace(rb,"")));i=c=null}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=0,e=[],g=n(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),n(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Db,Eb={};function Fb(b,c){var d=n(c.createElement(b)).appendTo(c.body),e=a.getDefaultComputedStyle?a.getDefaultComputedStyle(d[0]).display:n.css(d[0],"display");return d.detach(),e}function Gb(a){var b=z,c=Eb[a];return c||(c=Fb(a,b),"none"!==c&&c||(Db=(Db||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Db[0].contentWindow||Db[0].contentDocument).document,b.write(),b.close(),c=Fb(a,b),Db.detach()),Eb[a]=c),c}!function(){var a,b,c=z.createElement("div"),d="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";c.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=c.getElementsByTagName("a")[0],a.style.cssText="float:left;opacity:.5",l.opacity=/^0.5/.test(a.style.opacity),l.cssFloat=!!a.style.cssFloat,c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===c.style.backgroundClip,a=c=null,l.shrinkWrapBlocks=function(){var a,c,e,f;if(null==b){if(a=z.getElementsByTagName("body")[0],!a)return;f="border:0;width:0;height:0;position:absolute;top:0;left:-9999px",c=z.createElement("div"),e=z.createElement("div"),a.appendChild(c).appendChild(e),b=!1,typeof e.style.zoom!==L&&(e.style.cssText=d+";width:1px;padding:1px;zoom:1",e.innerHTML="<div></div>",e.firstChild.style.width="5px",b=3!==e.offsetWidth),a.removeChild(c),a=c=e=null}return b}}();var Hb=/^margin/,Ib=new RegExp("^("+T+")(?!px)[a-z%]+$","i"),Jb,Kb,Lb=/^(top|right|bottom|left)$/;a.getComputedStyle?(Jb=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),Ib.test(g)&&Hb.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):z.documentElement.currentStyle&&(Jb=function(a){return a.currentStyle},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Ib.test(g)&&!Lb.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Mb(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h=z.createElement("div"),i="border:0;width:0;height:0;position:absolute;top:0;left:-9999px",j="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";h.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",b=h.getElementsByTagName("a")[0],b.style.cssText="float:left;opacity:.5",l.opacity=/^0.5/.test(b.style.opacity),l.cssFloat=!!b.style.cssFloat,h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,b=h=null,n.extend(l,{reliableHiddenOffsets:function(){if(null!=c)return c;var a,b,d,e=z.createElement("div"),f=z.getElementsByTagName("body")[0];if(f)return e.setAttribute("className","t"),e.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=z.createElement("div"),a.style.cssText=i,f.appendChild(a).appendChild(e),e.innerHTML="<table><tr><td></td><td>t</td></tr></table>",b=e.getElementsByTagName("td"),b[0].style.cssText="padding:0;margin:0;border:0;display:none",d=0===b[0].offsetHeight,b[0].style.display="",b[1].style.display="none",c=d&&0===b[0].offsetHeight,f.removeChild(a),e=f=null,c},boxSizing:function(){return null==d&&k(),d},boxSizingReliable:function(){return null==e&&k(),e},pixelPosition:function(){return null==f&&k(),f},reliableMarginRight:function(){var b,c,d,e;if(null==g&&a.getComputedStyle){if(b=z.getElementsByTagName("body")[0],!b)return;c=z.createElement("div"),d=z.createElement("div"),c.style.cssText=i,b.appendChild(c).appendChild(d),e=d.appendChild(z.createElement("div")),e.style.cssText=d.style.cssText=j,e.style.marginRight=e.style.width="0",d.style.width="1px",g=!parseFloat((a.getComputedStyle(e,null)||{}).marginRight),b.removeChild(c)}return g}});function k(){var b,c,h=z.getElementsByTagName("body")[0];h&&(b=z.createElement("div"),c=z.createElement("div"),b.style.cssText=i,h.appendChild(b).appendChild(c),c.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%",n.swap(h,null!=h.style.zoom?{zoom:1}:{},function(){d=4===c.offsetWidth}),e=!0,f=!1,g=!0,a.getComputedStyle&&(f="1%"!==(a.getComputedStyle(c,null)||{}).top,e="4px"===(a.getComputedStyle(c,null)||{width:"4px"}).width),h.removeChild(b),c=h=null)}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Nb=/alpha\([^)]*\)/i,Ob=/opacity\s*=\s*([^)]*)/,Pb=/^(none|table(?!-c[ea]).+)/,Qb=new RegExp("^("+T+")(.*)$","i"),Rb=new RegExp("^([+-])=("+T+")","i"),Sb={position:"absolute",visibility:"hidden",display:"block"},Tb={letterSpacing:0,fontWeight:400},Ub=["Webkit","O","Moz","ms"];function Vb(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Ub.length;while(e--)if(b=Ub[e]+c,b in a)return b;return d}function Wb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=n._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=n._data(d,"olddisplay",Gb(d.nodeName)))):f[g]||(e=V(d),(c&&"none"!==c||!e)&&n._data(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Xb(a,b,c){var d=Qb.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Yb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Zb(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Jb(a),g=l.boxSizing()&&"border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Kb(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ib.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Yb(a,b,c||(g?"border":"content"),d,f)+"px"}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Kb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":l.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;if(b=n.cssProps[h]||(n.cssProps[h]=Vb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Rb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]="",i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Vb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Kb(a,b,d)),"normal"===f&&b in Tb&&(f=Tb[b]),""===c||c?(e=parseFloat(f),c===!0||n.isNumeric(e)?e||0:f):f}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?0===a.offsetWidth&&Pb.test(n.css(a,"display"))?n.swap(a,Sb,function(){return Zb(a,b,d)}):Zb(a,b,d):void 0},set:function(a,c,d){var e=d&&Jb(a);return Xb(a,c,d?Yb(a,b,d,l.boxSizing()&&"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),l.opacity||(n.cssHooks.opacity={get:function(a,b){return Ob.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=n.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===n.trim(f.replace(Nb,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Nb.test(f)?f.replace(Nb,e):f+" "+e)}}),n.cssHooks.marginRight=Mb(l.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},Kb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Hb.test(a)||(n.cssHooks[a+b].set=Xb)}),n.fn.extend({css:function(a,b){return W(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Jb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)
},a,b,arguments.length>1)},show:function(){return Wb(this,!0)},hide:function(){return Wb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function $b(a,b,c,d,e){return new $b.prototype.init(a,b,c,d,e)}n.Tween=$b,$b.prototype={constructor:$b,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=$b.propHooks[this.prop];return a&&a.get?a.get(this):$b.propHooks._default.get(this)},run:function(a){var b,c=$b.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):$b.propHooks._default.set(this),this}},$b.prototype.init.prototype=$b.prototype,$b.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},$b.propHooks.scrollTop=$b.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=$b.prototype.init,n.fx.step={};var _b,ac,bc=/^(?:toggle|show|hide)$/,cc=new RegExp("^(?:([+-])=|)("+T+")([a-z%]*)$","i"),dc=/queueHooks$/,ec=[jc],fc={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=cc.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&cc.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function gc(){return setTimeout(function(){_b=void 0}),_b=n.now()}function hc(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=U[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function ic(a,b,c){for(var d,e=(fc[b]||[]).concat(fc["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function jc(a,b,c){var d,e,f,g,h,i,j,k,m=this,o={},p=a.style,q=a.nodeType&&V(a),r=n._data(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,m.always(function(){m.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=n.css(a,"display"),k=Gb(a.nodeName),"none"===j&&(j=k),"inline"===j&&"none"===n.css(a,"float")&&(l.inlineBlockNeedsLayout&&"inline"!==k?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",l.shrinkWrapBlocks()||m.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],bc.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||n.style(a,d)}if(!n.isEmptyObject(o)){r?"hidden"in r&&(q=r.hidden):r=n._data(a,"fxshow",{}),f&&(r.hidden=!q),q?n(a).show():m.done(function(){n(a).hide()}),m.done(function(){var b;n._removeData(a,"fxshow");for(b in o)n.style(a,b,o[b])});for(d in o)g=ic(q?r[d]:0,d,m),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function kc(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function lc(a,b,c){var d,e,f=0,g=ec.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=_b||gc(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:_b||gc(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(kc(k,j.opts.specialEasing);g>f;f++)if(d=ec[f].call(j,a,k,j.opts))return d;return n.map(k,ic,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(lc,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],fc[c]=fc[c]||[],fc[c].unshift(b)},prefilter:function(a,b){b?ec.unshift(a):ec.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=lc(this,n.extend({},a),f);(e||n._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=n._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&dc.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=n._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(hc(b,!0),a,d,e)}}),n.each({slideDown:hc("show"),slideUp:hc("hide"),slideToggle:hc("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=n.timers,c=0;for(_b=n.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||n.fx.stop(),_b=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){ac||(ac=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(ac),ac=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e=z.createElement("div");e.setAttribute("className","t"),e.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=e.getElementsByTagName("a")[0],c=z.createElement("select"),d=c.appendChild(z.createElement("option")),b=e.getElementsByTagName("input")[0],a.style.cssText="top:1px",l.getSetAttribute="t"!==e.className,l.style=/top/.test(a.getAttribute("style")),l.hrefNormalized="/a"===a.getAttribute("href"),l.checkOn=!!b.value,l.optSelected=d.selected,l.enctype=!!z.createElement("form").enctype,c.disabled=!0,l.optDisabled=!d.disabled,b=z.createElement("input"),b.setAttribute("value",""),l.input=""===b.getAttribute("value"),b.value="t",b.setAttribute("type","radio"),l.radioValue="t"===b.value,a=b=c=d=e=null}();var mc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(mc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.text(a)}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(l.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)if(d=e[g],n.inArray(n.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var nc,oc,pc=n.expr.attrHandle,qc=/^(?:checked|selected)$/i,rc=l.getSetAttribute,sc=l.input;n.fn.extend({attr:function(a,b){return W(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===L?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?oc:nc)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(F);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)?sc&&rc||!qc.test(c)?a[d]=!1:a[n.camelCase("default-"+c)]=a[d]=!1:n.attr(a,c,""),a.removeAttribute(rc?c:d)},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),oc={set:function(a,b,c){return b===!1?n.removeAttr(a,c):sc&&rc||!qc.test(c)?a.setAttribute(!rc&&n.propFix[c]||c,c):a[n.camelCase("default-"+c)]=a[c]=!0,c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=pc[b]||n.find.attr;pc[b]=sc&&rc||!qc.test(b)?function(a,b,d){var e,f;return d||(f=pc[b],pc[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,pc[b]=f),e}:function(a,b,c){return c?void 0:a[n.camelCase("default-"+b)]?b.toLowerCase():null}}),sc&&rc||(n.attrHooks.value={set:function(a,b,c){return n.nodeName(a,"input")?void(a.defaultValue=b):nc&&nc.set(a,b,c)}}),rc||(nc={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},pc.id=pc.name=pc.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},n.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:nc.set},n.attrHooks.contenteditable={set:function(a,b,c){nc.set(a,""===b?!1:b,c)}},n.each(["width","height"],function(a,b){n.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),l.style||(n.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var tc=/^(?:input|select|textarea|button|object)$/i,uc=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return W(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return a=n.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):tc.test(a.nodeName)||uc.test(a.nodeName)&&a.href?0:-1}}}}),l.hrefNormalized||n.each(["href","src"],function(a,b){n.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this}),l.enctype||(n.propFix.enctype="encoding");var vc=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(vc," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(vc," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(F)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===L||"boolean"===c)&&(this.className&&n._data(this,"__className__",this.className),this.className=this.className||a===!1?"":n._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(vc," ").indexOf(b)>=0)return!0;return!1}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var wc=n.now(),xc=/\?/,yc=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;n.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=n.trim(b+"");return e&&!n.trim(e.replace(yc,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():n.error("Invalid JSON: "+b)},n.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var zc,Ac,Bc=/#.*$/,Cc=/([?&])_=[^&]*/,Dc=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Ec=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Fc=/^(?:GET|HEAD)$/,Gc=/^\/\//,Hc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Ic={},Jc={},Kc="*/".concat("*");try{Ac=location.href}catch(Lc){Ac=z.createElement("a"),Ac.href="",Ac=Ac.href}zc=Hc.exec(Ac.toLowerCase())||[];function Mc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(F)||[];if(n.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nc(a,b,c,d){var e={},f=a===Jc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Oc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&n.extend(!0,a,c),a}function Pc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Qc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ac,type:"GET",isLocal:Ec.test(zc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Oc(Oc(a,n.ajaxSettings),b):Oc(n.ajaxSettings,a)},ajaxPrefilter:Mc(Ic),ajaxTransport:Mc(Jc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Dc.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||Ac)+"").replace(Bc,"").replace(Gc,zc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(F)||[""],null==k.crossDomain&&(c=Hc.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===zc[1]&&c[2]===zc[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(zc[3]||("http:"===zc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),Nc(Ic,k,b,v),2===t)return v;h=k.global,h&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Fc.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(xc.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Cc.test(e)?e.replace(Cc,"$1_="+wc++):e+(xc.test(e)?"&":"?")+"_="+wc++)),k.ifModified&&(n.lastModified[e]&&v.setRequestHeader("If-Modified-Since",n.lastModified[e]),n.etag[e]&&v.setRequestHeader("If-None-Match",n.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Kc+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Nc(Jc,k,b,v)){v.readyState=1,h&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Pc(k,v,c)),u=Qc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(n.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){if(n.isFunction(a))return this.each(function(b){n(this).wrapAll(a.call(this,b))});if(this[0]){var b=n(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!l.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||n.css(a,"display"))},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var Rc=/%20/g,Sc=/\[\]$/,Tc=/\r?\n/g,Uc=/^(?:submit|button|image|reset|file)$/i,Vc=/^(?:input|select|textarea|keygen)/i;function Wc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Sc.test(a)?d(a,e):Wc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Wc(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Wc(c,a[c],b,e);return d.join("&").replace(Rc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Vc.test(this.nodeName)&&!Uc.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Tc,"\r\n")}}):{name:b.name,value:c.replace(Tc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&$c()||_c()}:$c;var Xc=0,Yc={},Zc=n.ajaxSettings.xhr();a.ActiveXObject&&n(a).on("unload",function(){for(var a in Yc)Yc[a](void 0,!0)}),l.cors=!!Zc&&"withCredentials"in Zc,Zc=l.ajax=!!Zc,Zc&&n.ajaxTransport(function(a){if(!a.crossDomain||l.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Xc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Yc[g],b=void 0,f.onreadystatechange=n.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Yc[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function $c(){try{return new a.XMLHttpRequest}catch(b){}}function _c(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=z.head||n("head")[0]||z.documentElement;return{send:function(d,e){b=z.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var ad=[],bd=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=ad.pop()||n.expando+"_"+wc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(bd.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&bd.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(bd,"$1"+e):b.jsonp!==!1&&(b.url+=(xc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,ad.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||z;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var cd=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&cd)return cd.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=a.slice(h,a.length),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&n.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var dd=a.document.documentElement;function ed(a){return n.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&n.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,n.contains(b,e)?(typeof e.getBoundingClientRect!==L&&(d=e.getBoundingClientRect()),c=ed(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===n.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(c=a.offset()),c.top+=n.css(a[0],"borderTopWidth",!0),c.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-n.css(d,"marginTop",!0),left:b.left-c.left-n.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||dd;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||dd})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);n.fn[a]=function(d){return W(this,function(a,d,e){var f=ed(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?n(f).scrollLeft():e,c?e:n(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Mb(l.pixelPosition,function(a,c){return c?(c=Kb(a,b),Ib.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return W(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var fd=a.jQuery,gd=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=gd),b&&a.jQuery===n&&(a.jQuery=fd),n},typeof b===L&&(a.jQuery=a.$=n),n});;

  return module.exports;
},"test/jquery":function(require, global, module, exports, PACKAGE) {
  (function() {
  var myQuery;

  myQuery = require("../lib/jquery");

  require("../main");

  describe("jQuery", function() {
    return it("should totes exist", function() {
      assert(myQuery);
      return assert(jQuery);
    });
  });

}).call(this);

//# sourceURL=test/jquery.coffee;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  global.$ = global.jQuery = require("./lib/jquery");

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"1.11.0.0"};;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"1.11.0.0","entryPoint":"main","repository":{"id":17651330,"name":"jQuery","full_name":"distri/jQuery","owner":{"login":"distri","id":6005125,"avatar_url":"https://gravatar.com/avatar/192f3f168409e79c42107f081139d9f3?d=https%3A%2F%2Fidenticons.github.com%2Ff90c81ffc1498e260c820082f2e7ca5f.png&r=x","gravatar_id":"192f3f168409e79c42107f081139d9f3","url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/jQuery","description":"Hosting me some jQuery","fork":false,"url":"https://api.github.com/repos/distri/jQuery","forks_url":"https://api.github.com/repos/distri/jQuery/forks","keys_url":"https://api.github.com/repos/distri/jQuery/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/jQuery/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/jQuery/teams","hooks_url":"https://api.github.com/repos/distri/jQuery/hooks","issue_events_url":"https://api.github.com/repos/distri/jQuery/issues/events{/number}","events_url":"https://api.github.com/repos/distri/jQuery/events","assignees_url":"https://api.github.com/repos/distri/jQuery/assignees{/user}","branches_url":"https://api.github.com/repos/distri/jQuery/branches{/branch}","tags_url":"https://api.github.com/repos/distri/jQuery/tags","blobs_url":"https://api.github.com/repos/distri/jQuery/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/jQuery/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/jQuery/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/jQuery/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/jQuery/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/jQuery/languages","stargazers_url":"https://api.github.com/repos/distri/jQuery/stargazers","contributors_url":"https://api.github.com/repos/distri/jQuery/contributors","subscribers_url":"https://api.github.com/repos/distri/jQuery/subscribers","subscription_url":"https://api.github.com/repos/distri/jQuery/subscription","commits_url":"https://api.github.com/repos/distri/jQuery/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/jQuery/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/jQuery/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/jQuery/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/jQuery/contents/{+path}","compare_url":"https://api.github.com/repos/distri/jQuery/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/jQuery/merges","archive_url":"https://api.github.com/repos/distri/jQuery/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/jQuery/downloads","issues_url":"https://api.github.com/repos/distri/jQuery/issues{/number}","pulls_url":"https://api.github.com/repos/distri/jQuery/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/jQuery/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/jQuery/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/jQuery/labels{/name}","releases_url":"https://api.github.com/repos/distri/jQuery/releases{/id}","created_at":"2014-03-12T01:25:42Z","updated_at":"2014-03-12T01:25:42Z","pushed_at":"2014-03-12T01:25:42Z","git_url":"git://github.com/distri/jQuery.git","ssh_url":"git@github.com:distri/jQuery.git","clone_url":"https://github.com/distri/jQuery.git","svn_url":"https://github.com/distri/jQuery","homepage":null,"size":0,"stargazers_count":0,"watchers_count":0,"language":null,"has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://gravatar.com/avatar/192f3f168409e79c42107f081139d9f3?d=https%3A%2F%2Fidenticons.github.com%2Ff90c81ffc1498e260c820082f2e7ca5f.png&r=x","gravatar_id":"192f3f168409e79c42107f081139d9f3","url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":2,"branch":"v1.11.0.0","publishBranch":"gh-pages"},"dependencies":{}},"dust":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"dust\n====\n\nPixieEngine2 Lite!\n","type":"blob"},"engine.coffee.md":{"path":"engine.coffee.md","mode":"100644","content":"Engine\n======\n\nThe Engine controls the game world and manages game state. Once you\nset it up and let it run it pretty much takes care of itself.\n\nYou can use the engine to add or remove objects from the game world.\n\nThere are several modules that can include to add additional capabilities\nto the engine.\n\nEvents\n------\n\nThe engine fires events that you  may bind listeners to. Event listeners\nmay be bound with `engine.on(eventName, callback)`\n\n`beforeAdd` Observe or modify the entity data before it is added to the engine.\n\n@param {Object} entityData\n\n`afterAdd` Observe or configure a `GameObject` that has been added to the engine.\n\n@param {GameObject} object The object that has just been added to the engine.\n\n`update` Called when the engine updates all the game objects.\n\n@param {Number} elapsedTime The time in seconds that has elapsed since the last update.\n\n`afterUpdate` Called after the engine completes an update.\n\n`beforeDraw` is called before the engine draws the game objects on the canvas.\nThe current camera transform is applied.\n\n@params {PixieCanvas} canvas A reference to the canvas to draw on.\n\n`draw` is called after the engine draws on the canvas. The current camera transform is applied.\n\n@params {PixieCanvas} canvas A reference to the canvas to draw on.\n\n>     engine.bind \"draw\", (canvas) ->\n>       # print some directions for the player\n>       canvas.drawText\n>         text: \"Go this way =>\"\n>         x: 200\n>         y: 200\n\n`draw` is called after the engine draws.\n\nThe current camera transform is not applied. This is great for\nadding overlays.\n\n@params {PixieCanvas} canvas A reference to the canvas to draw on.\n\n>     engine.bind \"overlay\", (canvas) ->\n>       # print the player's health. This will be\n>       # positioned absolutely according to the viewport.\n>       canvas.drawText\n>         text: \"HEALTH:\"\n>         position: Point(20, 20)\n>\n>       canvas.drawText\n>         text: player.health()\n>         position: Point(50, 20)\n\nImplementation\n--------------\n\n    {defaults} = require \"./util\"\n    Bindable = require \"./modules/bindable\"\n\n    Engine = (I={}, self=Bindable(I)) ->\n      defaults I,\n        FPS: 60\n        paused: false\n\n      frameAdvance = false\n\n      running = false\n      startTime = +new Date()\n      lastStepTime = -Infinity\n      animLoop = (timestamp) ->\n        timestamp ||= +new Date()\n        msPerFrame = (1000 / I.FPS)\n\n        delta = timestamp - lastStepTime\n        remainder = delta - msPerFrame\n\n        if remainder > 0\n          lastStepTime = timestamp - Math.min(remainder, msPerFrame)\n          step()\n\n        if running\n          window.requestAnimationFrame(animLoop)\n\n      update = (elapsedTime) ->\n        self.trigger \"beforeUpdate\", elapsedTime\n        self.trigger \"update\", elapsedTime\n        self.trigger \"afterUpdate\", elapsedTime\n\n      draw = ->\n        return unless canvas = I.canvas\n\n        self.trigger \"beforeDraw\", canvas\n        self.trigger \"draw\", canvas\n        self.trigger \"overlay\", canvas\n\n      step = ->\n        if !I.paused || frameAdvance\n          elapsedTime = (1 / I.FPS)\n          update(elapsedTime)\n\n        draw()\n\n      self.extend\n        ###*\n        Start the game simulation.\n\n            engine.start()\n\n        @methodOf Engine#\n        @name start\n        ###\n        start: ->\n          unless running\n            running = true\n            window.requestAnimationFrame(animLoop)\n\n          return self\n\n        ###*\n        Stop the simulation.\n\n            engine.stop()\n\n        @methodOf Engine#\n        @name stop\n        ###\n        stop: ->\n          running = false\n\n          return self\n\n        ###*\n        Pause the game and step through 1 update of the engine.\n\n            engine.frameAdvance()\n\n        @methodOf Engine#\n        @name frameAdvance\n        ###\n        frameAdvance: ->\n          I.paused = true\n          frameAdvance = true\n          step()\n          frameAdvance = false\n\n        ###*\n        Resume the game.\n\n            engine.play()\n\n        @methodOf Engine#\n        @name play\n        ###\n        play: ->\n          I.paused = false\n\n        ###*\n        Toggle the paused state of the simulation.\n\n            engine.pause()\n\n        @methodOf Engine#\n        @name pause\n        @param {Boolean} [setTo] Force to pause by passing true or unpause by passing false.\n        ###\n        pause: (setTo) ->\n          if setTo?\n            I.paused = setTo\n          else\n            I.paused = !I.paused\n\n        ###*\n        Query the engine to see if it is paused.\n\n            engine.pause()\n\n            engine.paused()\n            # true\n\n            engine.play()\n\n            engine.paused()\n            # false\n\n        @methodOf Engine#\n        @name paused\n        ###\n        paused: ->\n          I.paused\n\n        ###*\n        Change the framerate of the game. The default framerate is 60 fps.\n\n            engine.setFramerate(60)\n\n        @methodOf Engine#\n        @name setFramerate\n        ###\n        setFramerate: (newFPS) ->\n          I.FPS = newFPS\n          self.stop()\n          self.start()\n\n        update: update\n        draw: draw\n\n      Engine.defaultModules.each (module) ->\n        self.include module\n\n      self.trigger \"init\"\n\n      return self\n\n    Engine.defaultModules = [\n      \"age\"\n      \"engine/background\"\n      \"engine/collision\"\n      \"engine/game_state\"\n      \"engine/finder\"\n      \"engine/keyboard\"\n      \"engine/mouse\"\n      \"timed_events\"\n    ].map (name) ->\n      require \"./modules/#{name}\"\n\n    module.exports = Engine\n\nTODO\n----\n\n- Include these modules\n - \"Tilemap\"\n - \"Levels\"\n- Extract driving loop into a module\n","type":"blob"},"game_object.coffee.md":{"path":"game_object.coffee.md","mode":"100644","content":"GameObject\n==========\n\nThe default base class for all objects you can add to the engine.\n\nEvents\n------\n\nGameObjects fire events that you may attach listeners to. Event listeners\nare bound with `object.on(eventName, handler)`\n\n`create` is triggered when the object is created.\n\n`destroy` is triggered when object is destroyed.\n\nUse the destroy event to add particle effects, play sounds, etc.\n\n>     bomb.on 'destroy', ->\n>       bomb.explode()\n>       Sound.play \"Kaboom\"\n\n`update` is triggered during every step of the game loop.\n\nCheck to see if keys are being pressed and change the player's velocity.\n\n>     player.on 'update', ->\n>       if keydown.left\n>         player.velocity(Point(-1, 0))\n>       else if keydown.right\n>         player.velocity(Point(1, 0))\n>       else\n>         player.velocity(Point(0, 0))\n\nTriggered when the object is removed from the engine. Use the remove event to\nhandle any clean up.\n\nDestroyed objects are always removed, but removed objects may not necessarily have\nbeen destroyed.\n\n>     boss.bind 'remove', ->\n>       unlockDoorToLevel2()\n\n    {defaults} = require \"./util\"\n\n    module.exports = GameObject = (I={}, self=Core(I)) ->\n      defaults I,\n        active: true\n        created: false\n        destroyed: false\n\n      self.attrReader \"id\"\n\n      self.extend\n        class: ->\n          I.class or \"GameObject\"\n\nUpdate the game object. The engine calls this method.\n\n        update: (elapsedTime) ->\n          # TODO: Extract this I.active check out into an engine gameObject remove processor or something\n          # TODO: Remove this method and only use events.\n          if I.active\n            self.trigger 'update', elapsedTime\n\n          I.active\n\nTriggers the create event if the object has not already been created. This method is called by the engine.\n\n        create: ->\n          self.trigger('create') unless I.created\n          I.created = true\n\nDestroys the object and triggers the destroyed event. Anyone can call this method.\n\n        destroy: ->\n          self.trigger('destroy') unless I.destroyed\n\n          I.destroyed = true\n          I.active = false\n\n      GameObject.defaultModules.each (module) ->\n        self.include module\n\n      return self\n\n    GameObject.defaultModules = [\n      \"bindable\"\n      \"age\"\n      \"bounded\"\n      \"clamp\"\n      \"cooldown\"\n      \"drawable\"\n      \"effect\"\n      \"expirable\"\n      \"follow\"\n      \"meter\"\n      \"movable\"\n      \"rotatable\"\n      \"timed_events\"\n      \"tween\"\n    ].map (name) ->\n      require \"./modules/#{name}\"\n\nConstruct an object instance from the given entity data.\n\n    GameObject.construct = (entityData) ->\n      if className = entityData.class\n        if constructor = GameObject.registry[className]\n          constructor(entityData)\n        else\n          throw \"Unregistered constructor: #{className}\"\n      else\n        GameObject(entityData)\n\n    GameObject.registry =\n      GameObject: GameObject\n","type":"blob"},"game_state.coffee.md":{"path":"game_state.coffee.md","mode":"100644","content":"GameState\n=========\n\nA game state is a set of objects in a particular configuration.\n\nEvents\n------\n\n`beforeAdd` is triggered before the object is created from the data and is passed\nthe data itself.\n\n`afterAdd` is triggered after an object is added to the game state and is passed\nthe object that is added.\n\n    {defaults} = require \"./util\"\n    Bindable = require \"./modules/bindable\"\n    GameObject = require \"../../game_object\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        objects: []\n\n      queuedObjects = []\n\n      self.extend\n\nThe `add` method creates an object from data and adds it object to the game world.\n\nReturns the added object.\n\nYou can add arbitrary `entityData` and the engine will make it into a `GameObject`\n\n>     engine.add\n>       x: 50\n>       y: 30\n>       color: \"red\"\n>\n>     player = engine.add\n>       class: \"Player\"\n\n        # TODO: Need some kind of object constructor registry to reconstitute game\n        # objects from data\n        add: (entityData) ->\n          self.trigger \"beforeAdd\", entityData\n\n          object = GameObject.construct entityData\n          object.create()\n\n          self.trigger \"afterAdd\", object\n\n          if I.updating\n            queuedObjects.push object\n          else\n            I.objects.push object\n\n          return object\n\n        objects: ->\n          I.objects.copy()\n\n      # Add events and methods here\n      self.on \"update\", (elapsedTime) ->\n        I.updating = true\n\n        I.objects.invoke \"trigger\", \"beforeUpdate\", elapsedTime\n\n        [toKeep, toRemove] = I.objects.partition (object) ->\n          object.update(elapsedTime)\n\n        I.objects.invoke \"trigger\", \"afterUpdate\", elapsedTime\n\n        toRemove.invoke \"trigger\", \"remove\"\n\n        I.objects = toKeep.concat(queuedObjects)\n        queuedObjects = []\n\n        I.updating = false\n\n      self.include require \"./modules/cameras\"\n      self.include require \"./modules/save_state\"\n\n      return self\n","type":"blob"},"lib/collision.coffee.md":{"path":"lib/collision.coffee.md","mode":"100644","content":"Collision\n=========\n\nCollision holds many useful class methods for checking geometric overlap of various objects.\n\n    # Assume game objects\n    collides = (a, b) ->\n      # TODO: Be smart about auto-detecting collision types\n      Collision.rectangular(a.bounds(), b.bounds())\n\n    Collision =\n      ###*\n      Collision holds many useful class methods for checking geometric overlap of various objects.\n\n          player = engine.add\n            class: \"Player\"\n            x: 0\n            y: 0\n            width: 10\n            height: 10\n\n          enemy = engine.add\n            class: \"Enemy\"\n            x: 5\n            y: 5\n            width: 10\n            height: 10\n\n          enemy2 = engine.add\n            class: \"Enemy\"\n            x: -5\n            y: -5\n            width: 10\n            height: 10\n\n          Collision.collide(player, enemy, (p, e) -> ...)\n          # => callback is called once\n\n          Collision.collide(player, [enemy, enemy2], (p, e) -> ...)\n          # => callback is called twice\n\n          Collision.collide(\"Player\", \"Enemy\", (p, e) -> ...)\n          # => callback is also called twice\n\n      @name collide\n      @methodOf Collision\n      @param {Object|Array|String} groupA An object or set of objects to check collisions with\n      @param {Object|Array|String} groupB An object or set of objects to check collisions with\n      @param {Function} callback The callback to call when an object of groupA collides\n      with an object of groupB: (a, b) ->\n      @param {Function} [detectionMethod] An optional detection method to determine when two\n      objects are colliding.\n      ###\n      collide: (groupA, groupB, callback, detectionMethod=collides) ->\n        if Object.isString(groupA)\n          groupA = engine.find(groupA)\n        else\n          groupA = [].concat(groupA)\n\n        if Object.isString(groupB)\n          groupB = engine.find(groupB)\n        else\n          groupB = [].concat(groupB)\n\n        groupA.each (a) ->\n          groupB.each (b) ->\n            callback(a, b) if detectionMethod(a, b)\n\n      ###*\n      Takes two bounds objects and returns true if they collide (overlap), false otherwise.\n      Bounds objects have x, y, width and height properties.\n\n          player = GameObject\n            x: 0\n            y: 0\n            width: 10\n            height: 10\n\n          enemy = GameObject\n            x: 5\n            y: 5\n            width: 10\n            height: 10\n\n          Collision.rectangular(player, enemy)\n          # => true\n\n          Collision.rectangular(player, {x: 50, y: 40, width: 30, height: 30})\n          # => false\n\n      @name rectangular\n      @methodOf Collision\n      @param {Object} a The first rectangle\n      @param {Object} b The second rectangle\n      @returns {Boolean} true if the rectangles overlap, false otherwise\n      ###\n      rectangular: (a, b) ->\n        a.x < b.x + b.width &&\n        a.x + a.width > b.x &&\n        a.y < b.y + b.height &&\n        a.y + a.height > b.y\n\n      ###*\n      Takes two circle objects and returns true if they collide (overlap), false otherwise.\n      Circle objects have x, y, and radius.\n\n          player = GameObject\n            x: 5\n            y: 5\n            radius: 10\n\n          enemy = GameObject\n            x: 10\n            y: 10\n            radius: 10\n\n          farEnemy = GameObject\n            x: 500\n            y: 500\n            radius: 30\n\n          Collision.circular(player, enemy)\n          # => true\n\n          Collision.circular(player, farEnemy)\n          # => false\n\n      @name circular\n      @methodOf Collision\n      @param {Object} a The first circle\n      @param {Object} b The second circle\n      @returns {Boolean} true is the circles overlap, false otherwise\n      ###\n      circular: (a, b) ->\n        r = a.radius + b.radius\n        dx = b.x - a.x\n        dy = b.y - a.y\n\n        r * r >= dx * dx + dy * dy\n\n      ###*\n      Detects whether a line intersects a circle.\n\n          circle = engine.add\n            class: \"circle\"\n            x: 50\n            y: 50\n            radius: 10\n\n          Collision.rayCircle(Point(0, 0), Point(1, 0), circle)\n          # => true\n\n      @name rayCircle\n      @methodOf Collision\n      @param {Point} source The starting position\n      @param {Point} direction A vector from the point\n      @param {Object} target The circle\n      @returns {Boolean} true if the line intersects the circle, false otherwise\n      ###\n      rayCircle: (source, direction, target) ->\n        radius = target.radius()\n        target = target.position()\n\n        laserToTarget = target.subtract(source)\n\n        projectionLength = direction.dot(laserToTarget)\n\n        if projectionLength < 0\n          return false # object is behind\n\n        projection = direction.scale(projectionLength)\n\n        intersection = source.add(projection)\n        intersectionToTarget = target.subtract(intersection)\n        intersectionToTargetLength = intersectionToTarget.length()\n\n        if intersectionToTargetLength < radius\n          hit = true\n\n        if hit\n          dt = Math.sqrt(radius * radius - intersectionToTargetLength * intersectionToTargetLength)\n\n          hit = direction.scale(projectionLength - dt).add(source)\n\n      ###*\n      Detects whether a line intersects a rectangle.\n\n          rect = engine.add\n            class: \"circle\"\n            x: 50\n            y: 50\n            width: 20\n            height: 20\n\n          Collision.rayRectangle(Point(0, 0), Point(1, 0), rect)\n          # => true\n\n      @name rayRectangle\n      @methodOf Collision\n      @param {Point} source The starting position\n      @param {Point} direction A vector from the point\n      @param {Object} target The rectangle\n      @returns {Boolean} true if the line intersects the rectangle, false otherwise\n      ###\n      rayRectangle: (source, direction, target) ->\n        unless target.xw? and target.yw?\n          if target.width? and target.height?\n            xw = target.width/2\n            yw = target.height/2\n\n            # Convert from bounds rect to centeredBounds rect\n            return Collision.rayRectangle source, direction,\n              x: target.x + xw\n              y: target.y + yw\n              xw: xw\n              yw: yw\n          else\n            error \"Bounds object isn't a rectangle\"\n\n            return\n\n        xw = target.xw\n        yw = target.yw\n\n        if source.x < target.x\n          xval = target.x - xw\n        else\n          xval = target.x + xw\n\n        if source.y < target.y\n          yval = target.y - yw\n        else\n          yval = target.y + yw\n\n        if direction.x == 0\n          p0 = Point(target.x - xw, yval)\n          p1 = Point(target.x + xw, yval)\n\n          t = (yval - source.y) / direction.y\n        else if direction.y == 0\n          p0 = Point(xval, target.y - yw)\n          p1 = Point(xval, target.y + yw)\n\n          t = (xval - source.x) / direction.x\n        else\n          tX = (xval - source.x) / direction.x\n          tY = (yval - source.y) / direction.y\n\n          # TODO: These special cases are gross!\n          if (tX < tY || (-xw < source.x - target.x < xw)) && !(-yw < source.y - target.y < yw)\n            p0 = Point(target.x - xw, yval)\n            p1 = Point(target.x + xw, yval)\n\n            t = tY\n          else\n            p0 = Point(xval, target.y - yw)\n            p1 = Point(xval, target.y + yw)\n\n            t = tX\n\n        if t > 0\n          areaPQ0 = direction.cross(p0.subtract(source))\n          areaPQ1 = direction.cross(p1.subtract(source))\n\n          if areaPQ0 * areaPQ1 < 0\n            hit = direction.scale(t).add(source)\n\n    module.exports = Collision\n","type":"blob"},"lib/easing.coffee.md":{"path":"lib/easing.coffee.md","mode":"100644","content":"Easing\n======\n\n    {PI, sin, cos, pow} = Math\n\n    τ = 2 * PI\n\n    Easing =\n      sinusoidal: (t) ->\n        1 - cos(t * τ / 4)\n\n      sinusoidalOut: (t) ->\n        0 + sin(t * τ / 4)\n\n    polynomialEasings = [\"linear\", \"quadratic\", \"cubic\", \"quartic\", \"quintic\"]\n\n    polynomialEasings.each (easing, i) ->\n      exponent = i + 1\n      sign = if exponent % 2 then 1 else -1\n\n      Easing[easing] = (t) ->\n        pow(t, exponent)\n\n      Easing[\"#{easing}Out\"] = (t) ->\n        1 + sign * pow(t - 1, exponent)\n\n    [\"sinusoidal\"].concat(polynomialEasings).each (easing) ->\n      easeIn = Easing[easing]\n      easeOut = Easing[\"#{easing}Out\"]\n\n      Easing[\"#{easing}InOut\"] = (t) ->\n        if t < 0.5\n          easeIn(2 * t)\n        else\n          easeOut(2 * t - 1)\n\n    module.exports = Easing\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"Main\n====\n\n[Engine](./engine)\n[GameObject](./game_object)\n\nModules\n-------\n\n[Age](./modules/age)\n[Bindable](./modules/bindable)\n[Bounded](./modules/bounded)\n[Clamp](./modules/clamp)\n[Cooldown](./modules/cooldown)\n[Drawable](./modules/drawable)\n[Effect](./modules/effect)\n[Expirable](./modules/expirable)\n[Follow](./modules/follow)\n[Meter](./modules/meter)\n[Movable](./modules/movable)\n[Rotatable](./modules/rotatable)\n[Timed Events](./modules/timed_events)\n[Tween](./modules/tween)\n\n    require \"./setup\"\n\n    Engine = require \"./engine\"\n\n    TouchCanvas = require \"touch-canvas\"\n\n    applyStyleSheet = ->\n      styleNode = document.createElement(\"style\")\n      styleNode.innerHTML = require \"./style\"\n      styleNode.className = \"dust\"\n\n      if previousStyleNode = document.head.querySelector(\"style.dust\")\n        previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n      document.head.appendChild(styleNode)\n\n    module.exports =\n      init: (options={}) ->\n        applyStyleSheet()\n\n        {width, height} = options\n        width ?= 640\n        height ?= 480\n\n        canvas = TouchCanvas\n          width: width\n          height: height\n\n        $(\"body\").append $ \"<div>\",\n          class: \"main center\"\n\n        $(\".main\").append(canvas.element())\n        .css\n          width: width\n          height: height\n\n        engine = Engine\n          canvas: canvas\n\n        engine.start()\n\n        return engine\n\n      Collision: require \"/lib/collision\"\n      Engine: Engine\n      GameObject: require \"./game_object\"\n      GameState: require \"./game_state\"\n      Sprite: require \"sprite\"\n      Util: require \"./util\"\n","type":"blob"},"modules/age.coffee.md":{"path":"modules/age.coffee.md","mode":"100644","content":"The `Age` module handles keeping track of an object's age.\n\n>     player = GameObject()\n>\n>     player.update(1)\n>\n>     #=> player.I.age is 1\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        age: 0\n\n      self.bind 'afterUpdate', (dt) ->\n        I.age += dt\n\n      return self\n","type":"blob"},"modules/bindable.coffee.md":{"path":"modules/bindable.coffee.md","mode":"100644","content":"Bindable\n========\n\nAdd event binding to objects.\n\n>     bindable = Bindable()\n>     bindable.on \"greet\", ->\n>       console.log \"yo!\"\n>     bindable.trigger \"greet\"\n>     #=> \"yo!\" is printed to log\n\nUse as a mixin.\n\n>    self.include Bindable\n\n    module.exports = (I={}, self=Core(I)) ->\n      eventCallbacks = {}\n\n      self.extend\n\nAdds a function as an event listener.\n\nThis will call `coolEventHandler` after `yourObject.trigger \"someCustomEvent\"`\nis called.\n\n>     yourObject.on \"someCustomEvent\", coolEventHandler\n\nHandlers can be attached to namespaces as well. The namespaces are only used\nfor finer control of targeting event removal. For example if you are making a\ncustom drawing system you could unbind `\".Drawable\"` events and add your own.\n\n>     yourObject.on \"\"\n\n        on: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          # HACK: Here we annotate the callback function with namespace metadata\n          # This will probably lead to some strange edge cases, but should work fine\n          # for simple cases.\n          if namespace\n            callback.__PIXIE ||= {}\n            callback.__PIXIE[namespace] = true\n\n          eventCallbacks[event] ||= []\n          eventCallbacks[event].push(callback)\n\n          return self\n\nRemoves a specific event listener, or all event listeners if\nno specific listener is given.\n\nRemoves the handler coolEventHandler from the event `\"someCustomEvent\"` while\nleaving the other events intact.\n\n>     yourObject.off \"someCustomEvent\", coolEventHandler\n\nRemoves all handlers attached to `\"anotherCustomEvent\"`\n\n>     yourObject.off \"anotherCustomEvent\"\n\nRemove all handlers from the `\".Drawable\" namespace`\n\n>     yourObject.off \".Drawable\"\n\n        off: (namespacedEvent, callback) ->\n          [event, namespace] = namespacedEvent.split(\".\")\n\n          if event\n            eventCallbacks[event] ||= []\n\n            if namespace\n              # Select only the callbacks that do not have this namespace metadata\n              eventCallbacks[event] = eventCallbacks.select (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n            else\n              if callback\n                eventCallbacks[event].remove(callback)\n              else\n                eventCallbacks[event] = []\n          else if namespace\n            # No event given\n            # Select only the callbacks that do not have this namespace metadata\n            # for any events bound\n            for key, callbacks of eventCallbacks\n              eventCallbacks[key] = callbacks.select (callback) ->\n                !callback.__PIXIE?[namespace]?\n\n          return self\n\nCalls all listeners attached to the specified event.\n\n>     # calls each event handler bound to \"someCustomEvent\"\n>     yourObject.trigger \"someCustomEvent\"\n\nAdditional parameters can be passed to the handlers.\n\n>     yourObject.trigger \"someEvent\", \"hello\", \"anotherParameter\"\n\n        trigger: (event, parameters...) ->\n          callbacks = eventCallbacks[event]\n\n          if callbacks\n            callbacks.forEach (callback) ->\n              callback.apply(self, parameters)\n\n          return self\n\nLegacy method aliases.\n\n      self.extend\n        bind: self.on\n        unbind: self.off\n","type":"blob"},"modules/bounded.coffee.md":{"path":"modules/bounded.coffee.md","mode":"100644","content":"Bounded\n=======\n\nTODO: Maybe rename this Geometry?\n\n    Collision = require \"../lib/collision\"\n\nThe Bounded module is used to provide basic data about the\nlocation and dimensions of the including object. This module is included\nby default in `GameObject`.\n\n>     player = GameObject\n>       x: 10\n>       y: 50\n>       width: 20\n>       height: 20\n>       other: \"stuff\"\n>       more: \"properties\"\n>\n>     player.position()\n>     # => {x: 10, y: 50}\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Core(I)) ->\n      defaults I,\n        x: 0\n        y: 0\n        width: 8\n        height: 8\n        collisionMargin: Point(0, 0)\n\n      self.extend\n\nGet the object closest to this one.\n\n        closest: (selector) ->\n          if typeof selector is \"string\"\n            selector = engine.find(selector)\n          else\n            selector = [].concat(selector)\n\n          position = self.position()\n\n          selector.sort (a, b) ->\n            Point.distanceSquared(position, a.position()) - Point.distanceSquared(position, b.position())\n          .first()\n\nDistance between two objects. Proxies to Point.distance.\nIn order for this to work, `otherObj` must have a\nposition method.\n\n>     player = GameObject\n>       x: 50\n>       y: 50\n>       width: 10\n>       height: 10\n>\n>     enemy = GameObject\n>       x: 110\n>       y: 120\n>       width: 7\n>       height: 20\n>\n>     player.distance(enemy)\n>     # => 92.19544457292888\n\n        distance: (otherObj) ->\n          Point.distance(self.position(), otherObj.position())\n\nThe position of this game object. By default it is the center.\n\n>     player = GameObject\n>       x: 50\n>       y: 40\n>\n>     player.position()\n>     # => {x: 50, y: 40}\n\n        position: (newPosition) ->\n          if newPosition?\n            I.x = newPosition.x\n            I.y = newPosition.y\n          else\n            Point(I.x, I.y)\n\n        changePosition: (delta) ->\n          I.x += delta.x\n          I.y += delta.y\n\n          self\n\nDoes a check to see if this object is overlapping with the bounds passed in.\n\n>     player = GameObject\n>       x: 4\n>       y: 6\n>       width: 20\n>       height: 20\n>\n>     player.collides({x: 5, y: 7, width: 20, height: 20})\n>     # => true\n\n        collides: (bounds) ->\n          Collision.rectangular(self.bounds(), bounds)\n\nThis returns a modified bounds based on the collision margin.\nThe area of the bounds is reduced if collision margin is positive\nand increased if collision margin is negative.\n\n>     player = GameObject\n>       collisionMargin:\n>         x: -2\n>         y: -4\n>       x: 50\n>       y: 50\n>       width: 20\n>       height: 20\n>\n>     player.collisionBounds()\n>     # => {x: 38, y: 36, height: 28, width: 24}\n>\n>     player.collisionBounds(10, 10)\n>     # => {x: 48, y: 46, height: 28, width: 24}\n\n        collisionBounds: (xOffset, yOffset) ->\n          bounds = self.bounds(xOffset, yOffset)\n\n          bounds.x += I.collisionMargin.x\n          bounds.y += I.collisionMargin.y\n          bounds.width -= 2 * I.collisionMargin.x\n          bounds.height -= 2 * I.collisionMargin.y\n\n          return bounds\n\nReturns infomation about the location of the object and its dimensions with optional offsets.\n\n>     player = GameObject\n>       x: 3\n>       y: 6\n>       width: 2\n>       height: 2\n>\n>     player.bounds()\n>     # => {x: 3, y: 6, width: 2, height: 2}\n>\n>     player.bounds(7, 4)\n>     # => {x: 10, y: 10, width: 2, height: 2}\n\n        bounds: (xOffset, yOffset) ->\n          center = self.center()\n\n          x: center.x - I.width/2 + (xOffset || 0)\n          y: center.y - I.height/2 + (yOffset || 0)\n          width: I.width\n          height: I.height\n\nThe centeredBounds method returns infomation about the center\nof the object along with the midpoint of the width and height.\n\n>     player = GameObject\n>       x: 3\n>       y: 6\n>       width: 2\n>       height: 2\n>\n>     player.centeredBounds()\n>     # => {x: 4, y: 7, xw: 1, yw: 1}\n\n        centeredBounds: () ->\n          center = self.center()\n\n          x: center.x\n          y: center.y\n          xw: I.width/2\n          yw: I.height/2\n\n\nThe center method returns the {@link Point} that is\nthe center of the object.\n\n>     player.center()\n>     # => {x: 30, y: 35}\n\n        center: (newCenter) ->\n          self.position(newCenter)\n\nReturn the circular bounds of the object. The circle is\ncentered at the midpoint of the object.\n\n>     player.circle()\n>     # => {radius: 5, x: 50, y: 50}\n\n        circle: () ->\n          circle = self.center()\n          circle.radius = I.radius || I.width/2 || I.height/2\n\n          return circle\n","type":"blob"},"modules/camera.coffee.md":{"path":"modules/camera.coffee.md","mode":"100644","content":"Camera\n======\n\n    Bindable = require \"./bindable\"\n    {defaults} = require \"../util\"\n\n    Camera = (I={}, self=Bindable(I)) ->\n\n      defaults I,\n        screen: # Screen Coordinates\n          x: 0\n          y: 0\n          width: 1024\n          height: 576\n        deadzone: Point(0, 0) # Screen Coordinates\n        zoom: 1\n        transform: Matrix()\n        velocity: Point(0, 0)\n        maxSpeed: 750\n        t90: 2 # Time in seconds for camera to move 90% of the way to the target\n\n      # World Coordinates\n      I.x ?= I.screen.width/2\n      I.y ?= I.screen.height/2\n\n      I.cameraBounds ?= I.screen\n\n      currentType = \"centered\"\n      currentObject = null\n\n      objectFilters = []\n      transformFilters = []\n\n      focusOn = (object, elapsedTime) ->\n        dampingFactor = 2\n\n        #TODO: Different t90 value inside deadzone?\n\n        c = elapsedTime * 3.75 / I.t90\n        if c >= 1\n          # Spring is configured to be too intense, just snap to target\n          self.position(target)\n          I.velocity = Point(0, 0)\n        else\n          objectCenter = object.center()\n\n          target = objectCenter\n\n          delta = target.subtract(self.position())\n\n          force = delta.subtract(I.velocity.scale(dampingFactor))\n          self.changePosition(I.velocity.scale(c).clamp(I.maxSpeed))\n          I.velocity = I.velocity.add(force.scale(c))\n\n      followTypes =\n        centered: (object, elapsedTime) ->\n          I.deadzone = Point(0, 0)\n\n          focusOn(object, elapsedTime)\n\n        topdown: (object, elapsedTime) ->\n          helper = Math.max(I.screen.width, I.screen.height) / 4\n\n          I.deadzone = Point(helper, helper)\n\n          focusOn(object, elapsedTime)\n\n        platformer: (object, elapsedTime) ->\n          width = I.screen.width / 8\n          height = I.screen.height / 3\n\n          I.deadzone = Point(width, height)\n\n          focusOn(object, elapsedTime)\n\n      self.extend\n        follow: (object, type=\"centered\") ->\n          currentObject = object\n          currentType = type\n\n        objectFilterChain: (fn) ->\n          objectFilters.push fn\n\n        transformFilterChain: (fn) ->\n          transformFilters.push fn\n\n        screenToWorld: (point) ->\n          self.transform().inverse().transformPoint(point)\n\n      self.attrAccessor \"transform\"\n\n      self.on \"afterUpdate\", (elapsedTime) ->\n        if currentObject\n          followTypes[currentType](currentObject, elapsedTime)\n\n        # Hard clamp camera to world bounds\n        I.x = I.x.clamp(I.cameraBounds.x + I.screen.width/2, I.cameraBounds.x + I.cameraBounds.width - I.screen.width/2)\n        I.y = I.y.clamp(I.cameraBounds.y + I.screen.height/2, I.cameraBounds.y + I.cameraBounds.height - I.screen.height/2)\n\n        I.transform = Matrix.translate(I.screen.width/2 - I.x.floor(), I.screen.height/2 - I.y.floor())\n\n      self.on \"draw\", (canvas, objects) ->\n        # Move to correct screen coordinates\n        canvas.withTransform Matrix.translate(I.screen.x, I.screen.y), (canvas) ->\n          canvas.clip(0, 0, I.screen.width, I.screen.height)\n\n          objects = objectFilters.pipeline(objects)\n          transform = transformFilters.pipeline(self.transform().copy())\n\n          canvas.withTransform transform, (canvas) ->\n            self.trigger \"beforeDraw\", canvas\n            objects.invoke \"draw\", canvas\n\n      self.on \"overlay\", (canvas, objects) ->\n        canvas.withTransform Matrix.translate(I.screen.x, I.screen.y), (canvas) ->\n          canvas.clip(0, 0, I.screen.width, I.screen.height)\n          objects = objectFilters.pipeline(objects)\n\n          objects.invoke \"trigger\", \"overlay\", canvas\n\n      self.include require \"./age\"\n      self.include require \"./bounded\"\n\n      # The order of theses includes is important for\n      # the way in wich they modify the camera view transform\n\n      for module in Camera.defaultModules\n        self.include module\n\n      return self\n\n    Camera.defaultModules = [\n      \"z_sort\"\n      \"shake\"\n      \"zoom\"\n      \"rotate\"\n      \"flash\"\n      \"fade\"\n      \"transition\"\n    ].map (name) ->\n      require \"./camera/#{name}\"\n\n    module.exports = Camera\n","type":"blob"},"modules/camera/fade.coffee.md":{"path":"modules/camera/fade.coffee.md","mode":"100644","content":"Fade\n====\n\nThe `Fade` module provides convenience methods for accessing common Engine.Flash presets.\n\nCamera Effects\n--------------\n[Flash](./flash)\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->  \n      fadeInDefaults =\n        alpha: 0\n        color: 'black'\n        duration: 30\n    \n      fadeOutDefaults =\n        alpha: 1\n        color: 'transparent'\n        duration: 30\n    \n      configureFade = (duration, color, alpha) ->\n        I.flashDuration = duration\n        I.flashCooldown = duration\n        I.flashColor = Color(color)\n        I.flashTargetAlpha = alpha\n\n      self.extend\n\nMethods\n-------\n\n`fadeIn` provides a convenient way to set the flash effect instance variables. This provides a shorthand for fading the screen in \nfrom a given color over a specified duration.\n\n>     engine.fadeIn()\n>     # => Sets the effect variables to their default state. This will the screen to go from black to transparent over the next 30 frames.\n>  \n>     engine.fadeIn('blue', 50)\n>     # => This effect will start off blue and fade to transparent over 50 frames.\n\n@param {Number} [duration=30] How long the effect lasts\n@param {Color} [color=\"black\"] The color to fade from\n\n        fadeIn: (options={}) ->\n          {alpha, color, duration} = defaults(options, fadeInDefaults)\n      \n          configureFade(duration, color, alpha)\n\n`fadeOut` provides convenient way to set the flash effect instance variables. This provides a shorthand for fading \nthe screen to a given color over a specified duration.\n\n>     camera.fadeOut()\n>     # => Sets the effect variables to their default state. This will the screen to fade from ransparent to black over the next 30 frames.\n>    \n>     camera.fadeOut\n>       color: blue\n>       duration: 30\n>     # => This effect will start off transparent and change to blue over 50 frames.\n\n@param {Number} [duration=30] How long the effect lasts\n@param {Color} [color=\"transparent\"] The color to fade to\n\n        fadeOut: (options={}) ->\n          {alpha, color, duration} = defaults(options, fadeOutDefaults)\n      \n          configureFade(duration, color, alpha)\n","type":"blob"},"modules/camera/flash.coffee.md":{"path":"modules/camera/flash.coffee.md","mode":"100644","content":"Flash\n=====\n\nThe `Flash` module allows you to flash a color onscreen and then fade to transparent over a time period. \nThis is nice for lightning type effects or to accentuate major game events.\n\n    {approach, defaults} = require \"../../util\"\n\n    module.exports = (I, self) ->\n      defaults I,\n        flashAlpha: 0\n        flashColor: \"black\"\n        flashDuration: 0.3\n        flashCooldown: 0\n        flashTargetAlpha: 0\n    \n      defaultParams =\n        color: 'white'\n        duration: 0.3\n        targetAlpha: 0\n\n      self.on 'afterUpdate', (dt) ->\n        if I.flashCooldown > 0\n          # TODO: Use a tween function alpha?\n          I.flashAlpha = approach(I.flashAlpha, 0, dt / I.flashDuration)\n          I.flashCooldown = approach(I.flashCooldown, 0, dt)\n\n      self.on 'overlay', (canvas) ->\n        # TODO: Canvas#withAlpha\n        previousAlpha = canvas.globalAlpha()\n        canvas.globalAlpha(I.flashAlpha)\n        canvas.fill I.flashColor\n        canvas.globalAlpha(previousAlpha)\n\n      ###*\n      A convenient way to set the flash effect instance variables. Alternatively, you can modify them by hand, but\n      using Camera#flash is the suggested approach.\n    \n          camera.flash()\n          # => Sets the flash effect variables to their default state. This will cause a white flash that will turn transparent in the next 12 frames.\n        \n          camera.flash\n            color: 'green'\n            duration: 30\n          # => This flash effect will start off green and fade to transparent over 30 frames.\n        \n          camera.flash\n            color: Color(255, 0, 0, 0)\n            duration: 20\n            targetAlpha: 1\n          # => This flash effect will start off transparent and move toward red over 20 frames \n    \n      @name flash\n      @methodOf Camera#\n      @param {Color} [color=\"white\"] The flash color\n      @param {Number} [duration=12] How long the effect lasts\n      @param {Number} [targetAlpha=0] The alpha value to fade to. By default, this is set to 0, which fades the color to transparent.\n      ###\n      flash: (options={}) ->\n        defaults(options, defaultParams)\n    \n        {color, duration, targetAlpha} = options\n    \n        I.flashColor = Color(color) \n        I.flashTargetAlpha = targetAlpha\n        I.flashCooldown = duration\n        I.flashDuration = duration\n    \n        self\n","type":"blob"},"modules/camera/rotate.coffee.md":{"path":"modules/camera/rotate.coffee.md","mode":"100644","content":"Rotate\n======\n\nAdd rotation to cameras.\n\nIncluded in [Camera](../camera) by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I, self) ->\n      defaults I,\n        rotation: 0\n\n      self.transformFilterChain (transform) ->\n        transform.rotate(I.rotation, self.position())\n\n      self.attrAccessor \"rotation\"\n\n      self.extend\n        rotate: (amount) ->\n          self.rotation(I.rotation + amount)\n","type":"blob"},"modules/camera/shake.coffee.md":{"path":"modules/camera/shake.coffee.md","mode":"100644","content":"Shake\n=====\n\nAdds screen shake to cameras.\n\n    {approach, defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        shakeIntensity: 20\n        shakeCooldown: 0\n\n      defaultParams =\n        duration: 0.3\n        intensity: 20\n\n      self.on \"afterUpdate\", (dt) ->\n        I.shakeCooldown = approach(I.shakeCooldown, 0, dt)\n\n      self.transformFilterChain (transform) ->\n        if I.shakeCooldown > 0\n          transform.tx += Random.signed(I.shakeIntensity)\n          transform.ty += Random.signed(I.shakeIntensity)\n\n        return transform\n\n      self.extend\n        shake: (options={}) ->\n          {duration, intensity} = defaults(options, defaultParams)\n\n          I.shakeCooldown = duration\n          I.shakeIntensity = intensity\n\n          return self\n","type":"blob"},"modules/camera/transition.coffee.md":{"path":"modules/camera/transition.coffee.md","mode":"100644","content":"Transition\n==========\n\n    {defaults, extend} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        transitionActive: null\n        transitionStart: null\n        transitionEnd: null\n\n      defaultOptions =\n        color: \"white\"\n\n      transitionProgress = ->\n        ((I.age - I.transitionStart) / (I.transitionEnd - I.transitionStart)).clamp(0, 1)\n\n      transitions =\n        angle: ({canvas, t, screenSize, color}) ->\n          # Leading point at the center\n          p0 = Point(t * (screenSize.x * 2), screenSize.y / 2)\n\n          p1 = p0.subtract(Point(screenSize.x, screenSize.y / 2))\n          p2 = p1.subtract(Point(screenSize.x, 0))\n          p3 = p2.add(Point(0, screenSize.y))\n          p4 = p3.add(Point(screenSize.x, 0))\n\n          canvas.drawPoly\n            points: [p0, p1, p2, p3, p4]\n            color: color\n\n        square: ({canvas, t, screenSize, color}) ->\n          width = 50\n          height = 50\n\n          (screenSize.y / height).ceil().times (y) ->\n            (screenSize.x / width).ceil().times (x) ->\n              cellProgress = (2 * t - (x + y).mod(2)).clamp(0, 1)\n\n              canvas.drawRect\n                x: x * width\n                y: y * height\n                width: width\n                height: height * cellProgress\n                color: color\n\n        line: ({canvas, t, screenSize, color}) ->\n          height = 50\n\n          (screenSize.y / height).ceil().times (y) ->\n            canvas.drawRect\n              x: 0\n              y: y * height\n              width: screenSize.x\n              height: height * t\n              color: color\n\n      # TODO Use transition options for color\n      # TODO default transition options\n\n      self.on \"overlay\", (canvas) ->\n        if transitionName = I.transitionActive\n          transitions[transitionName] extend\n            canvas: canvas\n            screenSize: Point(I.screen.width, I.screen.height)\n            t: transitionProgress()\n          , I.transitionOptions\n\n      self.extend\n        transition: ({name, duration, options}={}) ->\n          name ?= \"angle\"\n          duration ?= 1\n          options ?= {}\n\n          I.transitionActive = name\n          I.transitionStart = I.age\n          I.transitionEnd = I.age + duration\n          I.transitionOptions = defaults(options, defaultOptions)\n","type":"blob"},"modules/camera/z_sort.coffee.md":{"path":"modules/camera/z_sort.coffee.md","mode":"100644","content":"ZSort\n=====\n\nSort objects by zIndex to draw them in the correct order.\n\nIncluded in [Camera](../camera) by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        zSort: true\n\n      self.objectFilterChain (objects) ->\n        if I.zSort\n          objects.sort (a, b) ->\n            a.I.zIndex - b.I.zIndex\n\n        objects\n\n      return self\n","type":"blob"},"modules/camera/zoom.coffee.md":{"path":"modules/camera/zoom.coffee.md","mode":"100644","content":"Zoom\n====\n\nAdds zoom in and out to cameras.\n\nIncluded in [Camera](../camera) by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        maxZoom: 10\n        minZoom: 0.1\n        zoom: 1\n\n      self.attrAccessor \"zoom\"\n\n      self.transformFilterChain (transform) ->\n        transform.scale(I.zoom, I.zoom, self.position())\n\n      clampZoom = (value) ->\n        value.clamp(I.minZoom, I.maxZoom)\n\n      self.extend\n        zoomIn: (percentage) ->\n          self.zoom clampZoom(I.zoom * (1 + percentage))\n\n        zoomOut: (percentage) ->\n          self.zoom clampZoom(I.zoom * (1 - percentage))\n","type":"blob"},"modules/cameras.coffee.md":{"path":"modules/cameras.coffee.md","mode":"100644","content":"Cameras\n=======\n\nThe Cameras module is included in `GameState` by default.\n\n    Bindable = require \"./bindable\"\n    Camera = require \"./camera\"\n\n    module.exports = (I={}, self=Bindable()) ->\n      cameras = [Camera()]\n\n      self.on 'update', (elapsedTime) ->\n        self.cameras().invoke 'trigger', 'update', elapsedTime\n\n      self.on 'afterUpdate', (elapsedTime) ->\n        self.cameras().invoke 'trigger', 'afterUpdate', elapsedTime\n\n      self.on 'draw', (canvas) ->\n        self.cameras().invoke 'trigger', 'draw', canvas, self.objects()\n\n      self.on 'overlay', (canvas) ->\n        self.cameras().invoke 'trigger', 'overlay', canvas, self.objects()\n\nMethods\n-------\n\n      self.extend\n\n`addCamera` adds a camera to the cameras present.\n\n        addCamera: (data) ->\n          cameras.push(Camera(data))\n\nReturns the array of camera objects or sets them if an argument is passed in.\n\n        cameras: (newCameras) ->\n          if newCameras\n            cameras = newCameras\n\n            return self\n          else\n            return cameras\n","type":"blob"},"modules/clamp.coffee.md":{"path":"modules/clamp.coffee.md","mode":"100644","content":"Clamp\n=====\n\nThe `Clamp` module provides helper methods to clamp object properties.\n\nThis module is included by default in `GameObject`\n\n    Bindable = require \"./bindable\"\n    {defaults, extend} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        clampData: {}\n\n      self.on \"afterUpdate\", ->\n        for property, data of I.clampData\n          I[property] = I[property].clamp(data.min, data.max)\n\n\n      self.extend\n\n`clamp` keeps an object's attributes within a given range.\n\nExample: Player's health will be within [0, 100] at the end of every update\n\n>     player.clamp\n>       health:\n>         min: 0\n>         max: 100\n\nExample: Score can only be positive\n\n>     player.clamp\n>       score:\n>         min: 0\n\n        clamp: (data) ->\n          extend(I.clampData, data)\n\nHelper to clamp the `x` and `y` properties of the object to be within a given bounds.\n\n        clampToBounds: (bounds) ->\n          bounds ||= Rectangle x: 0, y: 0, width: App.width, height: App.height\n\n          self.clamp\n            x:\n              min: bounds.x + I.width/2\n              max: bounds.width - I.width/2\n            y:\n              min: bounds.y + I.height/2\n              max: bounds.height - I.height/2\n","type":"blob"},"modules/cooldown.coffee.md":{"path":"modules/cooldown.coffee.md","mode":"100644","content":"Cooldown\n========\n\nThe `Cooldown` module provides a declarative way to manage cooldowns type changes\nto an objects properties.\n\nExample: Health regeneration\n\nPlayer's health will approach target of `100` by `1` unit every second of elapsed\ngame time.\n\n>     player = GameObject\n>       health: 50\n>\n>     player.cooldown \"health\",\n>       target: 100\n>\n>     elapsedTime = 1\n>     player.update(elapsedTime)\n>\n>     player.I.health\n>     # => 51\n\nExample: Rate of fire timeout\n\nBy default the cooldown approaches the target of `0` by `1` unit each second.\n\n>     player = GameObject()\n>     player.cooldown \"shootTimer\"\n>     player.I.shootTimer = 10 # => Pew! Pew!\n>\n>     player.update(elapsedTime)\n>\n>     player.I.shootTimer # => 9\n\nExample: Turbo cooldown\n\n>     # Turbo Cooldown\n>     player = GameObject()\n>\n>     # turboTimer starts at 1000\n>     # and approaches 12 by 5 each second\n>     player.cooldown \"turboTimer\",\n>       approachBy: 5\n>       target: 12\n>\n>     player.I.turboTimer = 1000\n>\n>     player.update(elapsedTime)\n>\n>     player.I.turboTimer # => 995\n\n    Bindable = require \"./bindable\"\n    {approach, defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        cooldowns: {}\n\n      self.on \"update\", (dt) ->\n        for name, cooldownOptions of I.cooldowns\n          {approachBy, target} = cooldownOptions\n\n          I[name] = approach(I[name], target, approachBy * dt)\n\n      self.extend\n        cooldown: (name, options={}) ->\n          {target, approachBy} = options\n\n          target ?= 0\n          approachBy ?= 1\n\n          I[name] ?= 0\n\n          # Set the cooldown data\n          I.cooldowns[name] = {\n            target\n            approachBy\n          }\n\n          return self\n","type":"blob"},"modules/drawable.coffee.md":{"path":"modules/drawable.coffee.md","mode":"100644","content":"Drawable\n========\n\nThe `Drawable` module is used to provide a simple draw method to the including\nobject.\n\nBinds a default draw listener to draw a rectangle or a sprite, if one exists.\n\nBinds an udtade listener to update the transform of the object.\n\nAutoloads the sprite specified in I.sprite, if any.\n\n>     player = Drawable\n>       x: 15\n>       y: 30\n>       width: 5\n>       height: 5\n>       sprite: \"my_cool_sprite\"\n>\n>     player.draw(canvas)\n\nEvents\n------\n\nThe drawing events triggered are:\n\n>     beforeTransform\n>     beforeDraw\n>     draw\n>     afterDraw\n>     afterTransform\n\nTODO: Find out how much each of these is actually used and cut any that aren't\nuseful.\n\n`beforeTransform` is triggered before the object should be drawn. A canvas is passed as\nthe first argument. This does not apply the object's current transform.\n\n`beforeDraw` is triggered before draw, but after the transform has been applied.\n\n`draw` is triggered every time the object should be drawn. A canvas is passed as\nthe first argument.\n\n>     player = GameObject\n>       x: 0\n>       y: 10\n>       width: 5\n>       height: 5\n>\n>     player.on \"draw\", (canvas) ->\n>       # Text will be drawn positioned relatively to the object.\n>       canvas.drawText\n>         text: \"Hey, drawing stuff is pretty easy.\"\n>         color: \"white\"\n>         x: 5\n>         y: 5\n\n`afterDraw` is triggered after draw with the transform still applied.\n\n`afterTransform` is triggered after the object should be drawn. A canvas is passed as\nthe first argument. This transform is not applied.\n\n    Bindable = require \"./bindable\"\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        alpha: 1\n        color: \"#196\"\n        scale: 1\n        scaleX: 1\n        scaleY: 1\n        zIndex: 0\n\n      self.off \".Drawable\"\n\n      self.on 'draw.Drawable', (canvas) ->\n        if I.alpha? and I.alpha != 1\n          previousAlpha = canvas.context().globalAlpha\n          canvas.context().globalAlpha = I.alpha\n\n        if sprite = self.sprite()\n          sprite.draw(canvas, -sprite.width / 2, -sprite.height / 2)\n        else\n          if I.radius?\n            canvas.drawCircle\n              x: 0\n              y: 0\n              radius: I.radius\n              color: I.color\n          else\n            canvas.drawRect\n              x: -I.width/2\n              y: -I.height/2\n              width: I.width\n              height: I.height\n              color: I.color\n\n        if I.alpha? and I.alpha != 1\n          canvas.context().globalAlpha = previousAlpha\n\n      self.extend\n\nDraw does not actually do any drawing itself, instead it triggers all of the draw events.\nListeners on the events do the actual drawing.\n\n        draw: (canvas) ->\n          self.trigger 'beforeTransform', canvas\n\n          canvas.withTransform self.transform(), (canvas) ->\n            self.trigger 'beforeDraw', canvas\n            self.trigger 'draw', canvas\n            self.trigger 'afterDraw', canvas\n\n          self.trigger 'afterTransform', canvas\n\n          return self\n\n        sprite: ->\n          if name = I.spriteName\n            # TODO: Resource loader?\n            Sprite.loadByName(name)\n          else if url = I.spriteURL\n            Sprite.load url\n\nReturns the current transform, with translation, rotation, and flipping applied.\n\n        transform: ->\n          center = self.center()\n\n          transform = Matrix.translation(center.x.floor(), center.y.floor())\n\n          transform = transform.concat(Matrix.scale(I.scale * I.scaleX, I.scale * I.scaleY))\n          transform = transform.concat(Matrix.rotation(I.rotation)) if I.rotation\n\n          if I.spriteOffset\n            transform = transform.concat(Matrix.translation(I.spriteOffset.x, I.spriteOffset.y))\n\n          return transform\n","type":"blob"},"modules/effect.coffee.md":{"path":"modules/effect.coffee.md","mode":"100644","content":"Effect\n======\n\nA collection of effects to make your game juicy.\n\nIt is included in `GameObject` by default.\n\n    module.exports = (I={}, self) ->\n\n`fadeOut` provides a convenient way to fade out this object over time.\n\nTime to fade out in seconds. The optional second prameter is the function to\nexecute when fade out completes.\n\nFade the player object out over the next 2 seconds.\n\n>     player.fadeOut 2\n\nFade out and then destroy.\n\n>     player.fadeOut, 0.25, ->\n>       self.destroy()\n\n      self.extend\n        fadeOut: (duration=1, complete) ->\n          self.tween duration,\n            alpha: 0\n            complete: complete\n","type":"blob"},"modules/engine/background.coffee.md":{"path":"modules/engine/background.coffee.md","mode":"100644","content":"Background\n==========\n\nThis module clears or fills the canvas before drawing the scene. It also provides\nsupport for drawing a sprite background.\n\nIt is included in Engine by default.\n\n    {defaults} = require \"../../util\"\n\n    module.exports = (I, self) ->\n      defaults I,\n        background: null\n        backgroundColor: \"#00010D\"\n        clear: false\n\n      self.attrAccessor \"clear\", \"backgroundColor\"\n\n      backgroundSprite = ->\n        if I.background\n          Sprite.loadByName I.background\n\n      self.on \"beforeDraw\", ->\n        if I.clear\n          I.canvas.clear()\n        else if sprite = backgroundSprite()\n          sprite.fill(I.canvas, 0, 0, I.canvas.width(), I.canvas.height())\n        else if I.backgroundColor\n          I.canvas.fill(I.backgroundColor)\n\n      return self\n","type":"blob"},"modules/engine/collision.coffee.md":{"path":"modules/engine/collision.coffee.md","mode":"100644","content":"Collision\n========\n\nThe `Collision` module provides some simple collision detection methods to engine.\n\n    Collision = require \"/lib/collision\"\n\n    module.exports = (I={}, self) ->\n      self.extend\n        ###*\n        Detects collisions between a bounds and the game objects.\n\n        @name collides\n        @methodOf Engine#\n        @param bounds The bounds to check collisions with.\n        @param [sourceObject] An object to exclude from the results.\n        @returns {Boolean} true if the bounds object collides with any of the game objects, false otherwise.\n        ###\n        collides: (bounds, sourceObject, selector=\".solid\") ->\n          self.find(selector).inject false, (collided, object) ->\n            collided or (object != sourceObject) and object.collides(bounds) and object\n\n        ###*\n        Detects collisions between a bounds and the game objects.\n        Returns an array of objects colliding with the bounds provided.\n\n        @name collidesWith\n        @methodOf Engine#\n        @param bounds The bounds to check collisions with.\n        @param [sourceObject] An object to exclude from the results.\n        @returns {Array} An array of objects that collide with the given bounds.\n        ###\n        collidesWith: (bounds, sourceObject, selector=\".solid\") ->\n          self.find(selector).select (object) ->\n            object != sourceObject and object.collides(bounds)\n\n        ###*\n        Detects collisions between a ray and the game objects.\n\n        @name rayCollides\n        @methodOf Engine#\n        @param source The origin point\n        @param direction A point representing the direction of the ray\n        @param [sourceObject] An object to exclude from the results.\n        @param [selector] A selector to choos which objects in the engine to collide with\n        ###\n        rayCollides: ({source, direction, sourceObject, selector}) ->\n          selector ?= \"\"\n\n          hits = self.find(selector).map (object) ->\n            hit = (object != sourceObject) and Collision.rayRectangle(source, direction, object.centeredBounds())\n            hit.object = object if hit\n\n            hit\n\n          nearestDistance = Infinity\n          nearestHit = null\n\n          hits.each (hit) ->\n            if hit && (d = hit.distance(source)) < nearestDistance\n              nearestDistance = d\n              nearestHit = hit\n\n          nearestHit\n\n        # TODO Allow specification of collision type (i.e. circular)\n        objectsUnderPoint: (point, selector=\"\") ->\n          bounds = {\n            x: point.x\n            y: point.y\n            width: 0\n            height: 0\n          }\n\n          self.find(selector).select (object) ->\n            object.collides(bounds)\n","type":"blob"},"modules/engine/finder.coffee.md":{"path":"modules/engine/finder.coffee.md","mode":"100644","content":"Finder\n======\n\n    Finder = require \"finder\"\n\n    module.exports = (I={}, self) ->\n      finder = Finder()\n\n      self.extend\n        find: (selector) ->\n          finder.find self.objects(), selector\n","type":"blob"},"modules/engine/game_state.coffee.md":{"path":"modules/engine/game_state.coffee.md","mode":"100644","content":"GameState\n=========\n\nThis engine module provides GameState support to the engine.\n\nIt is included in `Engine` by default.\n\n    {defaults} = require \"../../util\"\n    GameState = require \"../../game_state\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        # TODO: Shouldn't store complex objects in I properties\n        currentState: GameState()\n\n      requestedState = null\n\n      # The idea is that all the engine#beforeUpdate triggers happen\n      # before the state beforeUpdate triggers, then the state update\n      # then the state after update, then the engine after update\n      # like a layered cake with states in the middle.\n      self.on \"update\", (elapsedTime) ->\n        I.currentState.trigger \"beforeUpdate\", elapsedTime\n        I.currentState.trigger \"update\", elapsedTime\n        I.currentState.trigger \"afterUpdate\", elapsedTime\n\n      self.on \"afterUpdate\", ->\n        # Handle state change\n        if requestedState?\n          I.currentState.trigger \"exit\", requestedState\n          self.trigger 'stateExited', I.currentState\n\n          previousState = I.currentState\n          I.currentState = requestedState\n\n          I.currentState.trigger \"enter\", previousState\n          self.trigger 'stateEntered', I.currentState\n\n          requestedState = null\n\n      self.on \"draw\", (canvas) ->\n        I.currentState.trigger \"beforeDraw\", canvas\n        I.currentState.trigger \"draw\", canvas\n        I.currentState.trigger \"overlay\", canvas\n\n      self.extend\n        # Just pass through to the current state\n        add: (classNameOrEntityData, entityData={}) ->\n          # Allow optional add \"Class\", data form\n          if typeof classNameOrEntityData is \"string\"\n            entityData.class = classNameOrEntityData\n          else\n            entityData = classNameOrEntityData\n\n          self.trigger \"beforeAdd\", entityData\n          object = I.currentState.add(entityData)\n          self.trigger \"afterAdd\", object\n\n          return object\n\n        camera: (n=0) ->\n          self.cameras()[n]\n\n        cameras: (newCameras) ->\n          if newCameras?\n            I.currentState.cameras(newCameras)\n\n            return self\n          else\n            I.currentState.cameras()\n\n        fadeIn: (options={}) ->\n          self.cameras().invoke('fadeIn', options)\n\n        fadeOut: (options={}) ->\n          self.cameras().invoke('fadeOut', options)\n\n        flash: (options={}) ->\n          self.camera(options.camera).flash(options)\n\n        objects: ->\n          I.currentState.objects()\n\n        setState: (newState) ->\n          requestedState = newState\n\n        shake: (options={}) ->\n          self.camera(options.camera).shake(options)\n\n        saveState: ->\n          I.currentState.saveState()\n\n        loadState: (newState) ->\n          I.currentState.loadState(newState)\n\n        reload: ->\n          I.currentState.reload()\n","type":"blob"},"modules/engine/keyboard.coffee.md":{"path":"modules/engine/keyboard.coffee.md","mode":"100644","content":"Keyboard\n========\n\nThis module sets up the keyboard inputs for each engine update.\n\nSee also [Mouse](./mouse)\n\nUsage\n-----\n\nThe global `keydown` property lets your query the status of keys.\n\n>     if keydown.left\n>       moveLeft()\n>\n>     if keydown.a or keydown.space\n>       attack()\n>\n>     if keydown.return\n>       confirm()\n>\n>     if keydown.esc\n>       cancel()\n\nThe global `justPressed` property lets your query the status of keys. However,\nunlike keydown it will only trigger once for each time the key is pressed.\n\n>     if justPressed.left\n>       moveLeft()\n>\n>     if justPressed.a or justPressed.space\n>       attack()\n>\n>     if justPressed.return\n>       confirm()\n>\n>     if justPressed.esc\n>       cancel()\n\nImplementation\n--------------\n\n    window.keydown = {}\n    window.justPressed = {}\n    window.justReleased = {}\n\n    prevKeysDown = {}\n\n    keyName = (event) ->\n      jQuery.hotkeys.specialKeys[event.which] ||\n      String.fromCharCode(event.which).toLowerCase()\n\n    $(document).bind \"keydown\", (event) ->\n      key = keyName(event)\n      keydown[key] = true\n\n    $(document).bind \"keyup\", (event) ->\n      key = keyName(event)\n      keydown[key] = false\n\n    updateKeys = () ->\n      window.justPressed = {}\n      window.justReleased = {}\n      keydown.any = false\n\n      for key, value of keydown\n        justPressed[key] = value and !prevKeysDown[key]\n        justReleased[key] = !value and prevKeysDown[key]\n\n        justPressed.any = true if (justPressed[key] || mousePressed?.left || mousePressed?.right)\n        keydown.any = true if (value || mouseDown?.left || mouseDown?.right)\n\n      prevKeysDown = {}\n      for key, value of keydown\n        prevKeysDown[key] = value\n\n    module.exports = (I={}, self) ->\n      self.on \"beforeUpdate\", ->\n        updateKeys()\n\n      return self\n\nTODO\n----\n\n- Get rid of jQuery dependency, consolidate with hotkeys lib\n","type":"blob"},"modules/engine/mouse.coffee.md":{"path":"modules/engine/mouse.coffee.md","mode":"100644","content":"Mouse\n=====\n\nThis module sets up the mouse inputs for each engine update.\n\nSee also [Keyboard](./keyboard)\n\nUsage\n-----\n\nThe global mouseDown property lets your query the status of mouse buttons.\n\n>     if mouseDown.left\n>       moveLeft()\n>\n>     if mouseDown.right\n>       attack()\n\nThe global mousePressed property lets your query the status of mouse buttons.\nHowever, unlike mouseDown it will only trigger the first time the button\npressed.\n\n>     if mousePressed.left\n>       moveLeft()\n>\n>     if mousePressed.right\n>       attack()\n\nImplementation\n--------------\n\n    window.mouseDown = {}\n    window.mousePressed = {}\n    window.mouseReleased = {}\n    window.mousePosition = Point(0, 0)\n\n    prevButtonsDown = {}\n\n    buttonNames =\n      1: \"left\"\n      2: \"middle\"\n      3: \"right\"\n\n    buttonName = (event) ->\n      buttonNames[event.which]\n\n    $(document).bind \"mousemove\", (event) ->\n      # Position relative to canvas element\n      offset = $(\"canvas\").offset() or {left: 0, top: 0}\n\n      mousePosition.x = event.pageX - offset.left\n      mousePosition.y = event.pageY - offset.top\n\n    $(document).bind \"mousedown\", (event) ->\n      mouseDown[buttonName(event)] = true\n\n    $(document).bind \"mouseup\", (event) ->\n      mouseDown[buttonName(event)] = false\n\n    window.updateMouse = ->\n      window.mousePressed = {}\n      window.mouseReleased = {}\n\n      for button, value of mouseDown\n        mousePressed[button] = value unless prevButtonsDown[button]\n\n      for button, value of mouseDown\n        mouseReleased[button] = !value if prevButtonsDown[button]\n\n      prevButtonsDown = {}\n      for button, value of mouseDown\n        prevButtonsDown[button] = value\n\n    module.exports = (I={}, self) ->\n      self.on \"beforeUpdate\", ->\n        updateMouse?()\n\n      return self\n\nTODO\n----\n\n- Integrate with TouchCanvas rather than global mouse handling\n","type":"blob"},"modules/expirable.coffee.md":{"path":"modules/expirable.coffee.md","mode":"100644","content":"Expirable\n=========\n\nThe Expirable module deactivates a `GameObject` after a specified duration.\n\nThe duration is specified in seconds. If -1 is\nspecified the object will have an unlimited duration.\n\nThis module is included by default in `GameObject`.\n\n>     enemy = GameObject\n>       duration: 5\n>\n>     enemy.include Expirable\n>\n>     enemy.I.active\n>     # => true\n>\n>     5.times ->\n>       enemy.update(1)\n>\n>     enemy.I.active\n>     # => false\n\n    Bindable = require \"./bindable\"\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Bindable(I)) ->\n      defaults I,\n        duration: -1\n\n      self.on \"update\", (dt) ->\n        if I.duration != -1 && I.age >= I.duration\n          I.active = false\n\n      return self\n","type":"blob"},"modules/follow.coffee.md":{"path":"modules/follow.coffee.md","mode":"100644","content":"Follow\n======\n\nThe `Follow` module provides a simple method to set an object's\nvelocity so that it is moving towards another object.\n\nThe calculated direction is based on the position of each object.\n\nThis method relies on both objects having the `position` method.\n\nThis module is included in `GameObject` by default.\n\n>     player = GameObject\n>       x: 50\n>       y: 50\n>       width: 10\n>       height: 10\n>\n>     enemy = GameObject\n>       x: 100\n>       y: 50\n>       width: 10\n>       height: 10\n>       velocity: Point(0, 0)\n>       speed: 2\n>\n>     # Make an enemy follow the player\n>     enemy.follow(player)\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self=Core(I)) ->\n      defaults I,\n        velocity: Point(0, 0)\n        speed: 1\n\n      self.attrAccessor \"speed\"\n\n`follow` sets the velocity of this object to follow another object.\n\nThe velocity is in the direction of the player, with magnitude equal to\nthis object's speed.\n\n>     enemy.follow(player)\n\nCall this in an `update` listener to always follow a target object.\n\n>    self.on \"update\", ->\n>      self.follow(player)\n\n      self.extend\n        follow: (obj) ->\n          if obj.position?\n            position = obj.position()\n          else if obj.x?\n            position = obj\n\n          if position\n            I.velocity = position.subtract(self.position()).norm(self.speed())\n","type":"blob"},"modules/meter.coffee.md":{"path":"modules/meter.coffee.md","mode":"100644","content":"Meter\n=====\n\nThe `Meter` module provides a simple drop-in\nmeter ui to track arbitrary numeric attributes.\n\n>     player = GameObject\n>       health: 100\n>       heathMax: 100\n>\n>     enemy = GameObject\n>       health: 500\n>\n>     someOtherObject = GameObject\n>\n>     player.meter 'health'\n>     # => Sets up a health meter that will be drawn during the player overlay event\n>\n>     enemy.meter 'health'\n>     # => Sets up a health meter that will be drawn during the enemy overlay event.\n>     # Since healthMax wasn't provided, it is set to the value of I.health (500)\n>\n>     someOtherObject.meter 'turbo'\n>     # => Sets up a turbo meter that will be drawn during the someOtherObject overlay event.\n>     # Since neither turbo or turboMax were provided, they are both set to 100.\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        meters: {}\n\n      self.on 'overlay', (canvas) ->\n        for name, meterData of I.meters\n          {\n            backgroundColor,\n            border: {color:borderColor, radius:borderRadius, width:borderWidth}\n            color,\n            height,\n            show,\n            width,\n            x,\n            y\n          } = meterData\n\n          {x, y} = meterData.position if meterData.position?\n\n          return unless show\n\n          ratio = (I[name] / I[\"#{name}Max\"]).clamp(0, 1)\n\n          canvas.drawRoundRect\n            color: backgroundColor\n            radius: borderRadius\n            x: x\n            y: y\n            width: width\n            height: height\n\n          canvas.drawRoundRect\n            color: color\n            x: x\n            y: y\n            radius: borderRadius\n            width: width * ratio\n            height: height\n\n          canvas.drawRoundRect\n            x: x\n            y: y\n            width: width\n            height: height\n            radius: borderRadius\n            stroke:\n              color: borderColor\n              width: borderWidth\n\n      self.extend\n        ###*\n        Configures a meter to be drawn each overlay event.\n\n            player = GameObject\n\n            player.meter 'health',\n              border\n                color: 'brown'\n                radius: 3\n              color: 'pink'\n              height: 20\n              x: 5\n              y: 5\n              show: true\n              width: 150\n\n            # => Sets up a health meter, using all the configuration options\n\n        @name meter\n        @methodOf Metered#\n        @param {String} name The name of the property to meter\n        @param {Object} options The meter configuration options\n        @param {String} border: color Color of the meter's border\n        @param {Number} border: width Width of the meter's border\n        @param {String} color Color of the meter's inner rectangle\n        @param {Number} height Height of the meter\n        @param {Object} position An x, y object representing the position of the meter\n        @param {Number} x x position of the meter\n        @param {Number} y y position of the meter\n        @param {Number} border: radius Border radius of the meter\n        @param {Boolean} show Boolean to toggle whether of not to display the meter\n        @param {Number} width How wide the meter is\n        ###\n        meter: (name, options={}) ->\n          defaults options,\n            backgroundColor: 'black'\n            border:\n              color: 'white'\n              radius: 2\n              width: 1.5\n            color: 'green'\n            height: 10\n            x: 0\n            y: 0\n            show: true\n            width: 100\n\n          I[name] ?= 100\n\n          if not I[\"#{name}Max\"]\n            if I[name]\n              I[\"#{name}Max\"] = I[name]\n            else\n              I[\"#{name}Max\"] = 100\n\n          I.meters[name] = options\n\n        ###*\n        Shows the named meter\n\n            player = GameObject\n\n            # creates a health meter but disables visibility\n            player.meter 'health'\n              show: false\n\n            # enables visibility for the meter named 'health'\n            player.showMeter 'health'\n\n        @name showMeter\n        @methodOf Metered#\n        @param {String} name The name of the meter to show\n        ###\n        showMeter: (name) ->\n          I.meters[name].show = true\n\n        ###*\n        Hides the named meter\n\n            player = GameObject\n\n            # creates a health meter\n            player.meter 'health'\n\n            # disables visibility for the meter named 'health'\n            player.hideMeter 'health'\n\n        @name hideMeter\n        @methodOf Metered#\n        @param {String} name The name of the meter to hide\n        ###\n        hideMeter: (name) ->\n          I.meters[name].show = false\n\n        ###*\n        Toggles visibility of the named meter\n\n            player = GameObject\n\n            # creates a health meter\n            player.meter 'health'\n\n            # toggles visibility for the meter named 'health'\n            player.toggleMeter 'health'\n\n        @name toggleMeter\n        @methodOf Metered#\n        @param {String} name The name of the meter to toggle\n        ###\n        toggleMeter: (name) ->\n          I.meters[name].show = not I.meters[name].show\n","type":"blob"},"modules/movable.coffee.md":{"path":"modules/movable.coffee.md","mode":"100644","content":"Movable\n=======\n\nThe Movable module automatically updates the position and velocity of\nGameObjects based on the velocity and acceleration.\n\nIt is included in `GameObject` by default.\n\n>     player = GameObject\n>       x: 0\n>       y: 0\n>       velocity: Point(0, 0)\n>       acceleration: Point(1, 0)\n>       maxSpeed: 2\n>\n>     # => `velocity is {x: 0, y: 0} and position is {x: 0, y: 0}`\n>\n>     player.update(1)\n>     # => `velocity is {x: 1, y: 0} and position is {x: 1, y: 0}`\n>\n>     player.update(1)\n>     # => `velocity is {x: 2, y: 0} and position is {x: 3, y: 0}`\n>\n>     # we've hit our maxSpeed so our velocity won't increase\n>     player.update(1)\n>     # => `velocity is {x: 2, y: 0} and position is {x: 5, y: 0}`\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        acceleration: Point(0, 0)\n        velocity: Point(0, 0)\n\n      # Force acceleration and velocity to be Points\n      # Useful when reloading data from JSON\n      I.acceleration = Point(I.acceleration.x, I.acceleration.y)\n      I.velocity = Point(I.velocity.x, I.velocity.y)\n\n      self.attrReader \"velocity\", \"acceleration\"\n\n      # Handle multi-include\n      self.off \".Movable\"\n\n      self.on 'update.Movable', (dt) ->\n        I.velocity = I.velocity.add(I.acceleration.scale(dt))\n\n        if I.maxSpeed?\n          currentSpeed = I.velocity.magnitude()\n          if currentSpeed > I.maxSpeed\n            I.velocity = I.velocity.scale(I.maxSpeed / currentSpeed)\n\n        I.x += I.velocity.x * dt\n        I.y += I.velocity.y * dt\n","type":"blob"},"modules/rotatable.coffee.md":{"path":"modules/rotatable.coffee.md","mode":"100644","content":"Rotatable\n=========\n\nThe Rotatable module rotates the object\nbased on its rotational velocity.\n\n>     player = GameObject\n>       x: 0\n>       y: 0\n>       rotationalVelocity: Math.PI / 64\n>\n>     player.I.rotation\n>     # => 0\n>\n>     player.update(1)\n>\n>     player.I.rotation\n>     # => 0.04908738521234052 # Math.PI / 64\n>\n>     player.update(1)\n>\n>     player.I.rotation\n>     # => 0.09817477042468103 # 2 * (Math.PI / 64)\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        rotation: 0\n        rotationalVelocity: 0\n\n      self.on 'update', (dt) ->\n        I.rotation += I.rotationalVelocity * dt\n\n      return self\n","type":"blob"},"modules/save_state.coffee.md":{"path":"modules/save_state.coffee.md","mode":"100644","content":"SaveState\n=========\n\nThe `SaveState` module provides methods to save and restore the current game state.\n\nIt is included in `GameState` by default\n\n    {extend} = require \"/util\"\n\n    module.exports = (I={}, self=Core(I)) ->\n      savedState = null\n\nMethods\n-------\n\n      self.extend\n\n`saveState` saves the current game state and returns a JSON object representing\nthat state.\n\n@returns {Array} An array of the instance data of all objects in the game state\n\n>     engine.on 'update', ->\n>       if justPressed.s\n>         engine.saveState()\n\n        saveState: ->\n          savedState = I.objects.map (object) ->\n            extend({}, object.I)\n\nLoads the game state passed in, or the last saved state, if any.\n\n@param [newState] An array of object instance data to load.\n\n>     engine.on 'update', ->\n>       if justPressed.l\n>         # loads the last saved state\n>         engine.loadState()\n>\n>       if justPressed.o\n>         # removes all game objects, then reinstantiates\n>         # them with the entityData passed in\n>         engine.loadState([{x: 40, y: 50, class: \"Player\"}, {x: 0, y: 0, class: \"Enemy\"}, {x: 500, y: 400, class: \"Boss\"}])\n\n        loadState: (newState) ->\n          if newState ||= savedState\n            I.objects.invoke \"trigger\", \"remove\"\n            I.objects = []\n\n            newState.each (objectData) ->\n              self.add extend({}, objectData)\n\nReloads the current game state, useful for hotswapping code.\n\n        reload: ->\n          oldObjects = I.objects\n          I.objects = []\n\n          oldObjects.each (object) ->\n            object.trigger \"remove\"\n\n            self.add object.I\n\n          return self\n","type":"blob"},"modules/timed_events.coffee.md":{"path":"modules/timed_events.coffee.md","mode":"100644","content":"Timed Events\n============\n\nThe TimedEvents module allows arbitrary code to be executed at set intervals.\n\n`GameObject` includes this module by default.\n\n    {defaults} = require \"../util\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        everyEvents: []\n        delayEvents: []\n\n      self.bind \"update\", (elapsedTime) ->\n        for event in I.everyEvents\n          {fn, period} = event\n\n          continue if period <= 0\n\n          while event.lastFired < I.age + elapsedTime\n            self.sendOrApply(fn)\n            event.lastFired += period\n\n        [I.delayEvents, firingEvents] = I.delayEvents.partition (event) ->\n          (event.delay -= elapsedTime) >= 0\n\n        firingEvents.each (event) ->\n          self.sendOrApply(event.fn)\n\n      self.extend\n\nExecute `fn` every `n` seconds.\n\n>     player.every 4, ->\n>       doSomething()\n\nExecute a method by name periodically.\n\n>     monster.every 3, \"growl\"\n\n        every: (period, fn) ->\n          return unless period > 0\n\n          I.everyEvents.push\n            fn: fn\n            period: period\n            lastFired: I.age\n\n          return self\n\nExecute a function or method after a number of seconds have passed.\n\n>     self.delay 5, ->\n>       engine.add\n>         class: \"Ghost\"\n\n        delay: (seconds, fn) ->\n          I.delayEvents.push\n            delay: seconds\n            fn: fn\n\n          return self\n\n        # TODO: Move this into a more core module\n        sendOrApply: (fn, args...) ->\n          if typeof fn is \"function\"\n            fn.apply(self, args)\n          else\n            self[fn](args...)\n","type":"blob"},"modules/tween.coffee.md":{"path":"modules/tween.coffee.md","mode":"100644","content":"Tween\n=====\n\nThe `Tween` module provides a method to tween object properties.\n\n    {defaults, extend} = require \"../util\"\n\n    Easing = require \"../lib/easing\"\n\n    module.exports = (I={}, self) ->\n      defaults I,\n        activeTweens: {}\n\n      self.on \"update\", (elapsedTime) ->\n        t = I.age + elapsedTime\n\n        for property, data of I.activeTweens\n          {start, end, startTime, endTime, duration, easing} = data\n\n          delta = end - start\n\n          if t >= endTime\n            I[property] = end\n            I.activeTweens[property].complete?()\n            delete I.activeTweens[property]\n          else\n            if typeof easing is \"string\"\n              easingFunction = Easing[easing]\n            else\n              easingFunction = easing\n\n            I[property] = start + delta * easingFunction((t - startTime) / duration)\n\nModify the object's properties over time.\n\nDuration How long (in frames) until the object's properties reach their final values.\nThe second prameter is which properties to tween.\n\nSet the `easing` property to specify the easing function.\n\n>     player.tween 3,\n>       x: 50\n>       y: 50\n>       easing: \"quadratic\"\n\n>     player.tween 3,\n>       x: 150\n>       y: 150\n>       complete: ->\n>         player.dance()\n\n      self.extend\n        tween: (duration, properties) ->\n          properties = extend({}, properties) # Make a local copy\n\n          easing = properties.easing || \"linear\"\n          complete = properties.complete\n\n          delete properties.easing\n          delete properties.complete\n\n          for property, target of properties\n            I.activeTweens[property] =\n              complete: complete\n              end: target\n              start: I[property]\n              easing: easing\n              duration: duration\n              startTime: I.age\n              endTime: I.age + duration\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.1.8-alpha.2\"\nwidth: 640\nheight: 480\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.10.1.min.js\"\n]\ndependencies:\n  appcache: \"distri/appcache:v0.2.0\"\n  cornerstone: \"distri/cornerstone:v0.2.0\"\n  \"finder\": \"distri/finder:v0.1.3\"\n  hotkeys: \"distri/hotkeys:v0.2.0\"\n  \"jquery-utils\": \"distri/jquery-utils:v0.2.0\"\n  sprite: \"distri/sprite:v0.3.0\"\n  \"touch-canvas\": \"distri/touch-canvas:v0.3.0\"\n","type":"blob"},"setup.coffee.md":{"path":"setup.coffee.md","mode":"100644","content":"Setup\n=====\n\n    require \"jquery-utils\"\n\n    # Updating Application Cache and prompting for new version\n    require \"appcache\"\n\n    require \"cornerstone\"\n\n    # TODO: Don't make these pure global\n    global.Bindable = require \"./modules/bindable\"\n    global.Sprite = require \"sprite\"\n","type":"blob"},"style.styl":{"path":"style.styl","mode":"100644","content":"*\n  box-sizing: border-box\n\nhtml\n  height: 100%\n\nbody\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif\n  font-weight: 300\n  font-size: 18px\n  height: 100%\n  margin: 0\n  overflow: hidden\n  user-select: none\n\n.center\n  bottom: 0\n  position: absolute\n  top: 0\n  left: 0\n  right: 0\n  margin: auto\n","type":"blob"},"test/engine.coffee":{"path":"test/engine.coffee","mode":"100644","content":"require \"../test_setup\"\n\nEngine = require \"../engine\"\n\ndescribe \"Engine\", ->\n\n  MockCanvas = ->\n    clear: ->\n    context: ->\n      beginPath: ->\n      clip: ->\n      rect: ->\n    drawRect: ->\n    fill: ->\n    withTransform: (t, fn) ->\n      fn(@)\n    clip: ->\n    globalAlpha: ->\n\n  test \"#play, #pause, and #paused\", ->\n    engine = Engine()\n\n    equal engine.paused(), false\n    engine.pause()\n    equal engine.paused(), true\n    engine.play()\n    equal engine.paused(), false\n\n    engine.pause()\n    equal engine.paused(), true\n    engine.pause()\n    equal engine.paused(), false\n\n    engine.pause(false)\n    equal engine.paused(), false\n\n    engine.pause(true)\n    equal engine.paused(), true\n\n  test \"#save and #restore\", ->\n    engine = Engine()\n\n    engine.add {}\n    engine.add {}\n\n    equals(engine.objects().length, 2)\n\n    engine.saveState()\n\n    engine.add {}\n\n    equals(engine.objects().length, 3)\n\n    engine.loadState()\n\n    equals(engine.objects().length, 2)\n\n  test \"before add event\", ->\n    engine = Engine()\n\n    engine.bind \"beforeAdd\", (data) ->\n      equals data.test, \"test\"\n\n    engine.add\n      test: \"test\"\n\n  test \"#add\", ->\n    engine = Engine()\n\n    assert engine.objects().length is 0\n\n    engine.add \"GameObject\",\n      test: true\n\n    assert engine.objects().length is 1\n\n  test \"#add class name only\", ->\n    engine = Engine()\n\n    assert engine.objects().length is 0\n    engine.add \"GameObject\"\n    assert engine.objects().length is 1\n\n  test \"zSort\", ->\n    engine = Engine\n      canvas: MockCanvas()\n      zSort: true\n\n    n = 0\n    bindDraw = (o) ->\n      o.bind 'draw', ->\n        n += 1\n        o.I.drawnAt = n\n\n    o2 = engine.add\n      zIndex: 2\n    o1 = engine.add\n      zIndex: 1\n\n    bindDraw(o1)\n    bindDraw(o2)\n\n    engine.frameAdvance()\n\n    equals o1.I.drawnAt, 1, \"Object with zIndex #{o1.I.zIndex} should be drawn first\"\n    equals o2.I.drawnAt, 2, \"Object with zIndex #{o2.I.zIndex} should be drawn second\"\n\n  test \"draw events\", ->\n    engine = Engine\n      canvas: MockCanvas()\n      backgroundColor: false\n\n    calls = 0\n\n    engine.bind \"beforeDraw\", ->\n      calls += 1\n      ok true\n\n    engine.bind \"draw\", ->\n      calls += 1\n      ok true\n\n    engine.frameAdvance()\n\n    equals calls, 2\n\n  test \"Remove event\", ->\n    engine = Engine\n      backgroundColor: false\n\n    object = engine.add\n      active: false\n\n    called = 0\n    object.bind \"remove\", ->\n      called += 1\n      ok true, \"remove called\"\n\n    engine.frameAdvance()\n\n    assert.equal called, 1\n\n  test \"#find\", ->\n    engine = Engine()\n\n    engine.add\n      id: \"testy\"\n\n    engine.add\n      test: true\n    .attrReader \"test\"\n\n    engine.add\n      solid: true\n      opaque: false\n    .attrReader \"solid\", \"opaque\"\n\n    equal engine.find(\"#no_testy\").length, 0, \"No object with id `no_testy`\"\n    equal engine.find(\"#testy\").length, 1, \"Object with id `testy`\"\n    equal engine.find(\".test\").length, 1, \"Object with attribute `test`\"\n    equal engine.find(\".solid=true\").length, 1, \"Object with attribute `solid` equal to true\"\n    equal engine.find(\".opaque=false\").length, 1, \"Object with attribute `opaque` equal to false\"\n\n  test \"#camera\", ->\n    engine = Engine()\n\n    equal engine.camera(), engine.cameras().first()\n\n  test \"#collides\", ->\n    engine = Engine()\n\n    engine.collides({x: 0, y: 0, width: 10, height: 10}, null)\n\n  test \"Integration\", ->\n    engine = Engine\n      FPS: 30\n\n    object = engine.add\n      class: \"GameObject\"\n      velocity: Point(30, 0)\n\n    engine.frameAdvance()\n\n    equals object.I.x, 1\n    equals object.I.age, 1/30\n\n  test \"objectsUnderPoint\", ->\n    engine = Engine()\n\n    object = engine.add\n      x: 0\n      y: 0\n      width: 100\n      height: 100\n\n    equals engine.objectsUnderPoint(Point(0, 0)).length, 1\n    equals engine.objectsUnderPoint(Point(300, 300)).length, 0\n\n  # TODO: Maybe this should be a state stack and have pushState and popState\n  # in addition to setState\n  # TODO: This should be in GameStates test, not engine\n  test \"#setState\"# TODO, ->\n  ###\n    engine = Engine()\n\n    # TODO: Shouldn't need to use the GameState constructor itself\n    nextState = GameState()\n\n    engine.setState nextState\n\n    # Test state change events\n    engine.bind \"stateEntered\", ->\n      ok true\n    engine.bind \"stateExited\", ->\n      ok true\n\n    engine.update()\n\n    equal engine.I.currentState, nextState\n  ###\n","type":"blob"},"test/game_object.coffee":{"path":"test/game_object.coffee","mode":"100644","content":"require \"../test_setup\"\n\nGameObject = require \"../game_object\"\n\ndescribe \"GameObject\", ->\n\n  test \"()\", ->\n    gameObject = GameObject()\n    ok gameObject\n\n  test \".construct\", ->\n    gameObject = GameObject.construct\n      name: \"Gandalf\"\n\n    equals(gameObject.I.name, \"Gandalf\")\n\n  test \"construct invalid object\", ->\n    raises ->\n      GameObject.construct\n        class: \"aaaaa\"\n\n  test \"#closest\", ->\n    o = GameObject\n      x: 0\n      y: 0\n\n    other = GameObject\n      x: 1\n      y: 1\n\n    other2 = GameObject\n      x: 10\n      y: 10\n\n    equals o.closest([]), null\n\n    equals o.closest([other, other2]), other\n\n  test \"elapsedTime\", ->\n    gameObject = GameObject()\n\n    timeStep = 33\n\n    gameObject.bind \"update\", (t) ->\n      equals t, timeStep\n\n    gameObject.update(timeStep)\n\n  test \"[event] create\", ->\n    o = GameObject()\n\n    called = 0\n\n    o.bind \"create\", ->\n      called += 1\n      ok true, \"created event is fired on create\"\n\n    o.create()\n    o.create() # Make sure only fired once\n\n    assert.equal called, 1\n\n  test \"[event] update\", ->\n    gameObject = GameObject()\n\n    gameObject.bind \"update\", ->\n      equals(gameObject.I.age, 0, 'Age should be 0 on first update')\n\n    gameObject.trigger \"update\", 1\n\n  test \"[event] destroy\", ->\n    o = GameObject()\n\n    called = 0\n\n    o.bind \"destroy\", ->\n      called += 1\n      ok true, \"destroyed event is fired on destroy\"\n\n    o.destroy()\n    o.destroy() # Make sure it's not called twice\n\n    assert.equal called, 1\n","type":"blob"},"test/game_state.coffee":{"path":"test/game_state.coffee","mode":"100644","content":"require \"../test_setup\"\n\nGameState = require \"../game_state\"\n\ndescribe \"GameState\", ->\n  it \"should be legit\", ->\n    assert GameState()\n","type":"blob"},"test/modules/bindable.coffee":{"path":"test/modules/bindable.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nBindable = require \"../../modules/bindable\"\n\ndescribe \"Bindable\", ->\n\n  test \"#bind and #trigger\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"Multiple bindings\", ->\n    o = Bindable()\n\n    o.bind(\"test\", -> ok true)\n    o.bind(\"test\", -> ok true)\n\n    o.trigger(\"test\")\n\n  test \"#trigger arguments\", ->\n    o = Bindable()\n\n    param1 = \"the message\"\n    param2 = 3\n\n    o.bind \"test\", (p1, p2) ->\n      equal(p1, param1)\n      equal(p2, param2)\n\n    o.trigger \"test\", param1, param2\n\n  test \"#unbind\", ->\n    o = Bindable()\n\n    callback = ->\n      ok false\n\n    o.bind \"test\", callback\n    # Unbind specific event\n    o.unbind \"test\", callback\n    o.trigger \"test\"\n\n    o.bind \"test\", callback\n    # Unbind all events\n    o.unbind \"test\"\n    o.trigger \"test\"\n\n  test \"#trigger namespace\", ->\n    o = Bindable()\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\"\n    o.trigger \"test\"\n\n  test \"#unbind namespaced\", ->\n    o = Bindable()\n\n    o.bind \"test.TestNamespace\", ->\n      ok true\n\n    o.trigger \"test\"\n\n    o.unbind \".TestNamespace\", ->\n    o.trigger \"test\"\n\n","type":"blob"},"test/modules/bounded.coffee":{"path":"test/modules/bounded.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nBounded = require \"../../modules/bounded\"\n\ndescribe \"Bounded\", ->\n\n  test 'it should have #distance', ->\n    player = Bounded()\n\n    ok player.distance\n\n  test 'it should proxy #distance to Point.distance', ->\n    player = Bounded\n      x: 50\n      y: 50\n      width: 10\n      height: 10\n\n    enemy = Bounded\n      x: 110\n      y: 120\n      width: 7\n      height: 20\n\n    equals player.distance(enemy), Point.distance(player.position(), enemy.position())\n\n  test \"#bounds returns correct x, y, width, height\", ->\n    x = 5\n    y = 10\n    width = 50\n    height = 75\n\n    obj = Bounded\n      x: x\n      y: y\n      width: width\n      height: height\n\n    equals obj.bounds().x, x - width/2\n    equals obj.bounds().y, y - height/2\n    equals obj.bounds().width, width\n    equals obj.bounds().height, height\n\n  test \"#centeredBounds returns correct x, y, xw, yx\", ->\n    x = -5\n    y = 20\n\n    obj = Bounded\n      x: x\n      y: y\n      width: 100,\n      height: 200\n\n    bounds = obj.centeredBounds()\n\n    equals bounds.x, x\n    equals bounds.y, y\n    equals bounds.xw, 100 / 2\n    equals bounds.yw, 200 / 2\n\n  test \"#bounds(width, height) returns correct x, y\", ->\n    x = 20\n    y = 10\n    width = 15\n    height = 25\n\n    offsetX = 7.5\n    offsetY = 12\n\n    obj = Bounded\n      x: x\n      y: y\n      width: width\n      height: height\n\n    bounds = obj.bounds(offsetX, offsetY)\n\n    equals bounds.x, obj.center().x + offsetX - width/2\n    equals bounds.y, obj.center().y + offsetY - height/2\n\n  test \"#center returns correct center point\", ->\n    obj = Bounded\n      x: -5\n      y: 20\n      width: 10\n      height: 60\n\n    center = obj.center()\n\n    ok center.equal(Point(-5, 20))\n","type":"blob"},"test/modules/camera.coffee":{"path":"test/modules/camera.coffee","mode":"100644","content":"GameObject = require \"../../game_object\"\nCamera = require \"../../modules/camera\"\n\ndescribe \"Camera\", ->\n\n  MockCanvas = ->\n    clear: ->\n    context: ->\n      beginPath: ->\n      clip: ->\n      rect: ->\n    drawRect: ->\n    fill: ->\n    withTransform: (t, fn) ->\n      fn(@)\n    clip: ->\n    globalAlpha: ->\n\n  test \"create\", ->\n    ok Camera()\n  \n  test \"follow\", ->\n    object = GameObject()\n    camera = Camera()\n    dt = 1/60\n\n    camera.follow(object)\n    camera.trigger \"afterUpdate\", dt\n\n    transform = camera.I.transform\n    assert transform.tx?, \"tx exists: #{transform.tx}\"\n    assert transform.ty?, \"ty exists: #{transform.ty}\"\n\n  test \"overlay\", ->\n    object = GameObject()\n\n    called = 0\n    object.bind 'overlay', ->\n      ok true\n      called += 1\n\n    canvas = MockCanvas()\n\n    camera = Camera()\n\n    camera.trigger 'overlay', canvas, [object]\n\n    assert.equal called, 1\n\n  test \"zoom\", ->\n    camera = Camera()\n\n    camera.zoom(2)\n\n    assert.equal camera.zoom(), 2\n\n    camera.zoomOut(0.5)\n\n    assert.equal camera.zoom(), 1\n\n  test \"shake\", ->\n    camera = Camera()\n\n    camera.shake\n      duration: 1\n      intensity: 10\n\n    assert.equal camera.I.shakeCooldown, 1, \"Should set shake duration\"\n    assert.equal camera.I.shakeIntensity, 10, \"Should set intensity\"\n\n    camera.trigger \"draw\", MockCanvas(), []\n","type":"blob"},"test/modules/clamp.coffee":{"path":"test/modules/clamp.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nClamp = require \"../../modules/clamp\"\n\ndescribe \"Clamp\", ->\n\n  test \"#clamp\", ->\n    o = Clamp\n      x: 1500\n\n    max = 100\n\n    o.clamp\n      x:\n        min: 0\n        max: max\n\n    o.trigger \"afterUpdate\"\n\n    equals o.I.x, max\n","type":"blob"},"test/modules/cooldown.coffee":{"path":"test/modules/cooldown.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Cooldown\", ->\n  test \"objects count down each of their cooldowns\", ->\n    obj = GameObject\n      bullet: 83\n      cooldowns:\n        bullet:\n          target: 3\n          approachBy: 1\n\n    5.times ->\n      obj.update(1)\n\n    equals obj.I.bullet, 78, \"bullet should decrease by 5\"\n\n    100.times ->\n      obj.update(1)\n\n    equals obj.I.bullet, 3, \"bullet should not cool down part target value\"\n\n  test \"should handle negative value\", ->\n    obj = GameObject\n      powerup: -70\n      cooldowns:\n        powerup:\n          target: 0\n          approachBy: 1\n\n    11.times ->\n      obj.update(1)\n\n    equals obj.I.powerup, -59, \"powerup should increase by 11\"\n\n    70.times ->\n      obj.update(1)\n\n    equals obj.I.powerup, 0, \"powerup should not cooldown past target value\"\n\n  test \"adding many cooldowns to default instance variables\", ->\n    obj = GameObject\n      cool: 20\n      rad: 0\n      tubular: 0\n      cooldowns:\n        cool:\n          approachBy: 5\n          target: -5\n        rad:\n          approachBy: 0.5\n          target: 1.5\n        tubular:\n          approachBy: 1\n          target: 1000\n\n    4.times ->\n      obj.update(1)\n\n    equals obj.I.cool, 0\n    equals obj.I.rad, 1.5\n    equals obj.I.tubular, 4\n\n  test \"#cooldown\", ->\n    obj = GameObject\n      health: 100\n\n    obj.cooldown 'health'\n\n    3.times ->\n      obj.update(1)\n\n    equals obj.I.health, 97, \"health cooldown should exist and equal 97\"\n\n    obj.cooldown 'turbo',\n      target: 25\n      approachBy: 3\n\n    4.times ->\n      obj.update(1)\n\n    equals obj.I.health, 93, \"health should continue of cool down when new cooldowns are added\"\n    equals obj.I.turbo, 12, \"turbo should cool down normally\"\n\n  test \"should not blow up if cooldowns aren't specified\", ->\n    obj = GameObject()\n\n    obj.update(1)\n    obj.trigger \"afterUpdate\", 1\n\n    equals obj.I.age, 1, \"should successfully update\"\n\n  test \"use existing value of instance variable as starting value if no value param given\", ->\n    obj = GameObject()\n\n    obj.I.health = 3\n\n    obj.cooldown 'health',\n      target: 10\n\n    5.times ->\n      obj.update(1)\n\n    equals obj.I.health, 8\n\n  test \"initialize property to 0 if no current value\", ->\n    obj = GameObject()\n\n    obj.cooldown 'health',\n      target: 10\n\n    5.times ->\n      obj.update(1)\n\n    equals obj.I.health, 5\n","type":"blob"},"test/modules/drawable.coffee":{"path":"test/modules/drawable.coffee","mode":"100644","content":"require \"../../test_setup\"\n\n# TODO: Test without requiring GameOjbect\nGameObject = require \"../../game_object\"\n\ndescribe \"Drawable\", ->\n  test \"alpha\", ->\n    object = GameObject()\n\n    equal object.I.alpha, 1\n\n    object2 = GameObject\n      alpha: 0.5\n\n    equal object2.I.alpha, 0.5\n\n  test \"scale\", ->\n    object = GameObject()\n\n    transform = object.transform()\n\n    equal transform.a, 1\n    equal transform.d, 1\n\n    object = GameObject\n      scale: 2\n      scaleX: -1\n      scaleY: 0.5\n\n    transform = object.transform()\n\n    equal transform.a, -2\n    equal transform.d, 1\n","type":"blob"},"test/modules/effect.coffee":{"path":"test/modules/effect.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Effect\", ->\n\n  test \"fadeOut\", ->\n    player = GameObject()\n\n    fadedOut = false\n\n    player.fadeOut 1, ->\n      fadedOut = true\n\n    player.trigger \"update\", 1\n    player.trigger \"afterUpdate\", 1\n\n    equals player.I.alpha, 0, \"Player has faded out\"\n    ok fadedOut, \"callback was called\"\n","type":"blob"},"test/modules/expirable.coffee":{"path":"test/modules/expirable.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Expirable\", ->\n\n  test \"objects become inactive after their duration\", ->\n    obj = GameObject\n      duration: 5\n\n    4.times ->\n      obj.update(1)\n      obj.trigger \"afterUpdate\", 1\n\n    equals obj.I.active, true, \"object is active until duration is exceeded\"\n\n    5.times ->\n      obj.update(1)\n      obj.trigger \"afterUpdate\", 1\n\n    equals obj.I.active, false, \"object is inactive after duration\"\n","type":"blob"},"test/modules/follow.coffee":{"path":"test/modules/follow.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Follow\", ->\n\n  test \"should set the correct velocity\", ->\n    player = GameObject\n      x: 50\n      y: 50\n      width: 10\n      height: 10\n\n    enemy = GameObject\n      x: 0\n      y: 50\n      widht: 10\n      height: 10\n      speed: 1\n\n    enemy.follow(player)\n\n    ok enemy.I.velocity.equal(Point(1, 0)), 'enemy should head toward player with a velocity Point(1, 0)'\n\n    rightEnemy = GameObject\n      x: 100\n      y: 50\n      width: 10\n      height: 10\n      speed: 1\n\n    rightEnemy.follow(player)\n\n    ok rightEnemy.I.velocity.equal(Point(-1, 0)), 'rightEnemy should head toward player with a velocity Point(-1, 0)'\n","type":"blob"},"test/modules/meter.coffee":{"path":"test/modules/meter.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe 'Meter', ->\n\n  test \"should respect 0 being set as the meter attribute\", ->\n    obj = GameObject\n      health: 0\n      healthMax: 110\n\n    obj.meter 'health'\n\n    equals obj.I.health, 0\n\n  test \"should set max<Attribute> if it isn't present in the including object\", ->\n    obj = GameObject\n      health: 150\n\n    obj.meter 'health'\n\n    equals obj.I.healthMax, 150\n\n  test \"should set both <attribute> and max<attribute> if they aren't present in the including object\", ->\n    obj = GameObject()\n\n    obj.meter 'turbo'\n\n    equals obj.I.turbo, 100\n    equals obj.I.turboMax, 100\n","type":"blob"},"test/modules/movable.coffee":{"path":"test/modules/movable.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Movable\", ->\n\n  test \"should update velocity\", ->\n    particle = GameObject\n      velocity: Point(1, 2)\n      x: 50\n      y: 50\n\n    particle.update(1)\n\n    equals particle.I.x, 51, \"x position updated according to velocity\"\n    equals particle.I.y, 52, \"y position updated according to velocity\"\n\n  test \"should not exceed max speed\", ->\n    particle = GameObject\n      velocity: Point(5, 5)\n      acceleration: Point(1, 1)\n      maxSpeed: 10\n\n    20.times ->\n      particle.update(1)\n\n    ok particle.I.velocity.magnitude() <= particle.I.maxSpeed, \"magnitude of the velocity should not exceed maxSpeed\"\n\n  test \"should be able to get velocity\", ->\n    object = GameObject()\n\n    ok object.velocity()\n\n  test \"should be able to get acceleration\", ->\n    object = GameObject()\n\n    ok object.acceleration()\n\n  test \"should increase velocity according to acceleration\", ->\n    particle = GameObject\n      velocity: Point(0, -30)\n      acceleration: Point(0, 60)\n\n    60.times ->\n      particle.update(1/60)\n\n    equals particle.I.velocity.x, 0\n    equals particle.I.velocity.y, 30\n\n","type":"blob"},"test/modules/rotatable.coffee":{"path":"test/modules/rotatable.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Rotatable\", ->\n\n  test \"objects update their rotation\", ->\n    obj = GameObject\n      rotationalVelocity: Math.PI / 4\n      rotation: Math.PI / 6\n\n    equals obj.I.rotation, Math.PI / 6, \"Respects default rotation value\"\n\n    2.times ->\n      obj.update(1)\n\n    equals obj.I.rotation, Math.PI / 2 + Math.PI / 6\n\n    4.times ->\n      obj.update(1)\n\n    equals obj.I.rotation, (3 / 2) * Math.PI + Math.PI / 6\n","type":"blob"},"test/modules/tween.coffee":{"path":"test/modules/tween.coffee","mode":"100644","content":"require \"../../test_setup\"\n\nGameObject = require \"../../game_object\"\n\ndescribe \"Tweening\", ->\n  test \"should allow for simple linear tweening\", ->\n    o = GameObject\n      x: 0\n\n    targetValue = 10\n    o.tween 10,\n      x: targetValue\n\n    12.times (i) ->\n      o.update(1)\n      o.trigger \"afterUpdate\", 1\n\n      equals o.I.x, Math.min(i + 1, targetValue)\n","type":"blob"},"test_setup.coffee.md":{"path":"test_setup.coffee.md","mode":"100644","content":"Test Setup\n==========\n\n    require \"../../setup\"\n\n    global.test = it\n    global.ok = assert\n    global.equal = assert.equal\n    global.equals = assert.equal\n    global.raises = assert.throws\n","type":"blob"},"util.coffee.md":{"path":"util.coffee.md","mode":"100644","content":"Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n","type":"blob"},"test/dust.coffee":{"path":"test/dust.coffee","mode":"100644","content":"Dust = require \"../main\"\n\ndescribe \"Dust\", ->\n  it \"Should expose Util\", ->\n    assert Dust.Util\n\n  it \"Should expose Collision\", ->\n    assert Dust.Collision\n","type":"blob"}},"distribution":{"engine":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, Engine, defaults;

  defaults = require("./util").defaults;

  Bindable = require("./modules/bindable");

  Engine = function(I, self) {
    var animLoop, draw, frameAdvance, lastStepTime, running, startTime, step, update;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      FPS: 60,
      paused: false
    });
    frameAdvance = false;
    running = false;
    startTime = +new Date();
    lastStepTime = -Infinity;
    animLoop = function(timestamp) {
      var delta, msPerFrame, remainder;
      timestamp || (timestamp = +new Date());
      msPerFrame = 1000 / I.FPS;
      delta = timestamp - lastStepTime;
      remainder = delta - msPerFrame;
      if (remainder > 0) {
        lastStepTime = timestamp - Math.min(remainder, msPerFrame);
        step();
      }
      if (running) {
        return window.requestAnimationFrame(animLoop);
      }
    };
    update = function(elapsedTime) {
      self.trigger("beforeUpdate", elapsedTime);
      self.trigger("update", elapsedTime);
      return self.trigger("afterUpdate", elapsedTime);
    };
    draw = function() {
      var canvas;
      if (!(canvas = I.canvas)) {
        return;
      }
      self.trigger("beforeDraw", canvas);
      self.trigger("draw", canvas);
      return self.trigger("overlay", canvas);
    };
    step = function() {
      var elapsedTime;
      if (!I.paused || frameAdvance) {
        elapsedTime = 1 / I.FPS;
        update(elapsedTime);
      }
      return draw();
    };
    self.extend({
      /**
      Start the game simulation.
      
          engine.start()
      
      @methodOf Engine#
      @name start
      */

      start: function() {
        if (!running) {
          running = true;
          window.requestAnimationFrame(animLoop);
        }
        return self;
      },
      /**
      Stop the simulation.
      
          engine.stop()
      
      @methodOf Engine#
      @name stop
      */

      stop: function() {
        running = false;
        return self;
      },
      /**
      Pause the game and step through 1 update of the engine.
      
          engine.frameAdvance()
      
      @methodOf Engine#
      @name frameAdvance
      */

      frameAdvance: function() {
        I.paused = true;
        frameAdvance = true;
        step();
        return frameAdvance = false;
      },
      /**
      Resume the game.
      
          engine.play()
      
      @methodOf Engine#
      @name play
      */

      play: function() {
        return I.paused = false;
      },
      /**
      Toggle the paused state of the simulation.
      
          engine.pause()
      
      @methodOf Engine#
      @name pause
      @param {Boolean} [setTo] Force to pause by passing true or unpause by passing false.
      */

      pause: function(setTo) {
        if (setTo != null) {
          return I.paused = setTo;
        } else {
          return I.paused = !I.paused;
        }
      },
      /**
      Query the engine to see if it is paused.
      
          engine.pause()
      
          engine.paused()
          # true
      
          engine.play()
      
          engine.paused()
          # false
      
      @methodOf Engine#
      @name paused
      */

      paused: function() {
        return I.paused;
      },
      /**
      Change the framerate of the game. The default framerate is 60 fps.
      
          engine.setFramerate(60)
      
      @methodOf Engine#
      @name setFramerate
      */

      setFramerate: function(newFPS) {
        I.FPS = newFPS;
        self.stop();
        return self.start();
      },
      update: update,
      draw: draw
    });
    Engine.defaultModules.each(function(module) {
      return self.include(module);
    });
    self.trigger("init");
    return self;
  };

  Engine.defaultModules = ["age", "engine/background", "engine/collision", "engine/game_state", "engine/finder", "engine/keyboard", "engine/mouse", "timed_events"].map(function(name) {
    return require("./modules/" + name);
  });

  module.exports = Engine;

}).call(this);

//# sourceURL=engine.coffee;

  return module.exports;
},"game_object":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, defaults;

  defaults = require("./util").defaults;

  module.exports = GameObject = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    defaults(I, {
      active: true,
      created: false,
      destroyed: false
    });
    self.attrReader("id");
    self.extend({
      "class": function() {
        return I["class"] || "GameObject";
      },
      update: function(elapsedTime) {
        if (I.active) {
          self.trigger('update', elapsedTime);
        }
        return I.active;
      },
      create: function() {
        if (!I.created) {
          self.trigger('create');
        }
        return I.created = true;
      },
      destroy: function() {
        if (!I.destroyed) {
          self.trigger('destroy');
        }
        I.destroyed = true;
        return I.active = false;
      }
    });
    GameObject.defaultModules.each(function(module) {
      return self.include(module);
    });
    return self;
  };

  GameObject.defaultModules = ["bindable", "age", "bounded", "clamp", "cooldown", "drawable", "effect", "expirable", "follow", "meter", "movable", "rotatable", "timed_events", "tween"].map(function(name) {
    return require("./modules/" + name);
  });

  GameObject.construct = function(entityData) {
    var className, constructor;
    if (className = entityData["class"]) {
      if (constructor = GameObject.registry[className]) {
        return constructor(entityData);
      } else {
        throw "Unregistered constructor: " + className;
      }
    } else {
      return GameObject(entityData);
    }
  };

  GameObject.registry = {
    GameObject: GameObject
  };

}).call(this);

//# sourceURL=game_object.coffee;

  return module.exports;
},"game_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, GameObject, defaults;

  defaults = require("./util").defaults;

  Bindable = require("./modules/bindable");

  GameObject = require("../../game_object");

  module.exports = function(I, self) {
    var queuedObjects;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      objects: []
    });
    queuedObjects = [];
    self.extend({
      add: function(entityData) {
        var object;
        self.trigger("beforeAdd", entityData);
        object = GameObject.construct(entityData);
        object.create();
        self.trigger("afterAdd", object);
        if (I.updating) {
          queuedObjects.push(object);
        } else {
          I.objects.push(object);
        }
        return object;
      },
      objects: function() {
        return I.objects.copy();
      }
    });
    self.on("update", function(elapsedTime) {
      var toKeep, toRemove, _ref;
      I.updating = true;
      I.objects.invoke("trigger", "beforeUpdate", elapsedTime);
      _ref = I.objects.partition(function(object) {
        return object.update(elapsedTime);
      }), toKeep = _ref[0], toRemove = _ref[1];
      I.objects.invoke("trigger", "afterUpdate", elapsedTime);
      toRemove.invoke("trigger", "remove");
      I.objects = toKeep.concat(queuedObjects);
      queuedObjects = [];
      return I.updating = false;
    });
    self.include(require("./modules/cameras"));
    self.include(require("./modules/save_state"));
    return self;
  };

}).call(this);

//# sourceURL=game_state.coffee;

  return module.exports;
},"lib/collision":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Collision, collides;

  collides = function(a, b) {
    return Collision.rectangular(a.bounds(), b.bounds());
  };

  Collision = {
    /**
    Collision holds many useful class methods for checking geometric overlap of various objects.
    
        player = engine.add
          class: "Player"
          x: 0
          y: 0
          width: 10
          height: 10
    
        enemy = engine.add
          class: "Enemy"
          x: 5
          y: 5
          width: 10
          height: 10
    
        enemy2 = engine.add
          class: "Enemy"
          x: -5
          y: -5
          width: 10
          height: 10
    
        Collision.collide(player, enemy, (p, e) -> ...)
        # => callback is called once
    
        Collision.collide(player, [enemy, enemy2], (p, e) -> ...)
        # => callback is called twice
    
        Collision.collide("Player", "Enemy", (p, e) -> ...)
        # => callback is also called twice
    
    @name collide
    @methodOf Collision
    @param {Object|Array|String} groupA An object or set of objects to check collisions with
    @param {Object|Array|String} groupB An object or set of objects to check collisions with
    @param {Function} callback The callback to call when an object of groupA collides
    with an object of groupB: (a, b) ->
    @param {Function} [detectionMethod] An optional detection method to determine when two
    objects are colliding.
    */

    collide: function(groupA, groupB, callback, detectionMethod) {
      if (detectionMethod == null) {
        detectionMethod = collides;
      }
      if (Object.isString(groupA)) {
        groupA = engine.find(groupA);
      } else {
        groupA = [].concat(groupA);
      }
      if (Object.isString(groupB)) {
        groupB = engine.find(groupB);
      } else {
        groupB = [].concat(groupB);
      }
      return groupA.each(function(a) {
        return groupB.each(function(b) {
          if (detectionMethod(a, b)) {
            return callback(a, b);
          }
        });
      });
    },
    /**
    Takes two bounds objects and returns true if they collide (overlap), false otherwise.
    Bounds objects have x, y, width and height properties.
    
        player = GameObject
          x: 0
          y: 0
          width: 10
          height: 10
    
        enemy = GameObject
          x: 5
          y: 5
          width: 10
          height: 10
    
        Collision.rectangular(player, enemy)
        # => true
    
        Collision.rectangular(player, {x: 50, y: 40, width: 30, height: 30})
        # => false
    
    @name rectangular
    @methodOf Collision
    @param {Object} a The first rectangle
    @param {Object} b The second rectangle
    @returns {Boolean} true if the rectangles overlap, false otherwise
    */

    rectangular: function(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    },
    /**
    Takes two circle objects and returns true if they collide (overlap), false otherwise.
    Circle objects have x, y, and radius.
    
        player = GameObject
          x: 5
          y: 5
          radius: 10
    
        enemy = GameObject
          x: 10
          y: 10
          radius: 10
    
        farEnemy = GameObject
          x: 500
          y: 500
          radius: 30
    
        Collision.circular(player, enemy)
        # => true
    
        Collision.circular(player, farEnemy)
        # => false
    
    @name circular
    @methodOf Collision
    @param {Object} a The first circle
    @param {Object} b The second circle
    @returns {Boolean} true is the circles overlap, false otherwise
    */

    circular: function(a, b) {
      var dx, dy, r;
      r = a.radius + b.radius;
      dx = b.x - a.x;
      dy = b.y - a.y;
      return r * r >= dx * dx + dy * dy;
    },
    /**
    Detects whether a line intersects a circle.
    
        circle = engine.add
          class: "circle"
          x: 50
          y: 50
          radius: 10
    
        Collision.rayCircle(Point(0, 0), Point(1, 0), circle)
        # => true
    
    @name rayCircle
    @methodOf Collision
    @param {Point} source The starting position
    @param {Point} direction A vector from the point
    @param {Object} target The circle
    @returns {Boolean} true if the line intersects the circle, false otherwise
    */

    rayCircle: function(source, direction, target) {
      var dt, hit, intersection, intersectionToTarget, intersectionToTargetLength, laserToTarget, projection, projectionLength, radius;
      radius = target.radius();
      target = target.position();
      laserToTarget = target.subtract(source);
      projectionLength = direction.dot(laserToTarget);
      if (projectionLength < 0) {
        return false;
      }
      projection = direction.scale(projectionLength);
      intersection = source.add(projection);
      intersectionToTarget = target.subtract(intersection);
      intersectionToTargetLength = intersectionToTarget.length();
      if (intersectionToTargetLength < radius) {
        hit = true;
      }
      if (hit) {
        dt = Math.sqrt(radius * radius - intersectionToTargetLength * intersectionToTargetLength);
        return hit = direction.scale(projectionLength - dt).add(source);
      }
    },
    /**
    Detects whether a line intersects a rectangle.
    
        rect = engine.add
          class: "circle"
          x: 50
          y: 50
          width: 20
          height: 20
    
        Collision.rayRectangle(Point(0, 0), Point(1, 0), rect)
        # => true
    
    @name rayRectangle
    @methodOf Collision
    @param {Point} source The starting position
    @param {Point} direction A vector from the point
    @param {Object} target The rectangle
    @returns {Boolean} true if the line intersects the rectangle, false otherwise
    */

    rayRectangle: function(source, direction, target) {
      var areaPQ0, areaPQ1, hit, p0, p1, t, tX, tY, xval, xw, yval, yw, _ref, _ref1;
      if (!((target.xw != null) && (target.yw != null))) {
        if ((target.width != null) && (target.height != null)) {
          xw = target.width / 2;
          yw = target.height / 2;
          return Collision.rayRectangle(source, direction, {
            x: target.x + xw,
            y: target.y + yw,
            xw: xw,
            yw: yw
          });
        } else {
          error("Bounds object isn't a rectangle");
          return;
        }
      }
      xw = target.xw;
      yw = target.yw;
      if (source.x < target.x) {
        xval = target.x - xw;
      } else {
        xval = target.x + xw;
      }
      if (source.y < target.y) {
        yval = target.y - yw;
      } else {
        yval = target.y + yw;
      }
      if (direction.x === 0) {
        p0 = Point(target.x - xw, yval);
        p1 = Point(target.x + xw, yval);
        t = (yval - source.y) / direction.y;
      } else if (direction.y === 0) {
        p0 = Point(xval, target.y - yw);
        p1 = Point(xval, target.y + yw);
        t = (xval - source.x) / direction.x;
      } else {
        tX = (xval - source.x) / direction.x;
        tY = (yval - source.y) / direction.y;
        if ((tX < tY || ((-xw < (_ref = source.x - target.x) && _ref < xw))) && !((-yw < (_ref1 = source.y - target.y) && _ref1 < yw))) {
          p0 = Point(target.x - xw, yval);
          p1 = Point(target.x + xw, yval);
          t = tY;
        } else {
          p0 = Point(xval, target.y - yw);
          p1 = Point(xval, target.y + yw);
          t = tX;
        }
      }
      if (t > 0) {
        areaPQ0 = direction.cross(p0.subtract(source));
        areaPQ1 = direction.cross(p1.subtract(source));
        if (areaPQ0 * areaPQ1 < 0) {
          return hit = direction.scale(t).add(source);
        }
      }
    }
  };

  module.exports = Collision;

}).call(this);

//# sourceURL=lib/collision.coffee;

  return module.exports;
},"lib/easing":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Easing, PI, cos, polynomialEasings, pow, sin, τ;

  PI = Math.PI, sin = Math.sin, cos = Math.cos, pow = Math.pow;

  τ = 2 * PI;

  Easing = {
    sinusoidal: function(t) {
      return 1 - cos(t * τ / 4);
    },
    sinusoidalOut: function(t) {
      return 0 + sin(t * τ / 4);
    }
  };

  polynomialEasings = ["linear", "quadratic", "cubic", "quartic", "quintic"];

  polynomialEasings.each(function(easing, i) {
    var exponent, sign;
    exponent = i + 1;
    sign = exponent % 2 ? 1 : -1;
    Easing[easing] = function(t) {
      return pow(t, exponent);
    };
    return Easing["" + easing + "Out"] = function(t) {
      return 1 + sign * pow(t - 1, exponent);
    };
  });

  ["sinusoidal"].concat(polynomialEasings).each(function(easing) {
    var easeIn, easeOut;
    easeIn = Easing[easing];
    easeOut = Easing["" + easing + "Out"];
    return Easing["" + easing + "InOut"] = function(t) {
      if (t < 0.5) {
        return easeIn(2 * t);
      } else {
        return easeOut(2 * t - 1);
      }
    };
  });

  module.exports = Easing;

}).call(this);

//# sourceURL=lib/easing.coffee;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Engine, TouchCanvas, applyStyleSheet;

  require("./setup");

  Engine = require("./engine");

  TouchCanvas = require("touch-canvas");

  applyStyleSheet = function() {
    var previousStyleNode, styleNode;
    styleNode = document.createElement("style");
    styleNode.innerHTML = require("./style");
    styleNode.className = "dust";
    if (previousStyleNode = document.head.querySelector("style.dust")) {
      previousStyleNode.parentNode.removeChild(prevousStyleNode);
    }
    return document.head.appendChild(styleNode);
  };

  module.exports = {
    init: function(options) {
      var canvas, engine, height, width;
      if (options == null) {
        options = {};
      }
      applyStyleSheet();
      width = options.width, height = options.height;
      if (width == null) {
        width = 640;
      }
      if (height == null) {
        height = 480;
      }
      canvas = TouchCanvas({
        width: width,
        height: height
      });
      $("body").append($("<div>", {
        "class": "main center"
      }));
      $(".main").append(canvas.element()).css({
        width: width,
        height: height
      });
      engine = Engine({
        canvas: canvas
      });
      engine.start();
      return engine;
    },
    Collision: require("/lib/collision"),
    Engine: Engine,
    GameObject: require("./game_object"),
    GameState: require("./game_state"),
    Sprite: require("sprite"),
    Util: require("./util")
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"modules/age":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      age: 0
    });
    self.bind('afterUpdate', function(dt) {
      return I.age += dt;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/age.coffee;

  return module.exports;
},"modules/bindable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var __slice = [].slice;

  module.exports = function(I, self) {
    var eventCallbacks;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    eventCallbacks = {};
    self.extend({
      on: function(namespacedEvent, callback) {
        var event, namespace, _ref;
        _ref = namespacedEvent.split("."), event = _ref[0], namespace = _ref[1];
        if (namespace) {
          callback.__PIXIE || (callback.__PIXIE = {});
          callback.__PIXIE[namespace] = true;
        }
        eventCallbacks[event] || (eventCallbacks[event] = []);
        eventCallbacks[event].push(callback);
        return self;
      },
      off: function(namespacedEvent, callback) {
        var callbacks, event, key, namespace, _ref;
        _ref = namespacedEvent.split("."), event = _ref[0], namespace = _ref[1];
        if (event) {
          eventCallbacks[event] || (eventCallbacks[event] = []);
          if (namespace) {
            eventCallbacks[event] = eventCallbacks.select(function(callback) {
              var _ref1;
              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;
            });
          } else {
            if (callback) {
              eventCallbacks[event].remove(callback);
            } else {
              eventCallbacks[event] = [];
            }
          }
        } else if (namespace) {
          for (key in eventCallbacks) {
            callbacks = eventCallbacks[key];
            eventCallbacks[key] = callbacks.select(function(callback) {
              var _ref1;
              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;
            });
          }
        }
        return self;
      },
      trigger: function() {
        var callbacks, event, parameters;
        event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        callbacks = eventCallbacks[event];
        if (callbacks) {
          callbacks.forEach(function(callback) {
            return callback.apply(self, parameters);
          });
        }
        return self;
      }
    });
    return self.extend({
      bind: self.on,
      unbind: self.off
    });
  };

}).call(this);

//# sourceURL=modules/bindable.coffee;

  return module.exports;
},"modules/bounded":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Collision, defaults;

  Collision = require("../lib/collision");

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    defaults(I, {
      x: 0,
      y: 0,
      width: 8,
      height: 8,
      collisionMargin: Point(0, 0)
    });
    return self.extend({
      closest: function(selector) {
        var position;
        if (typeof selector === "string") {
          selector = engine.find(selector);
        } else {
          selector = [].concat(selector);
        }
        position = self.position();
        return selector.sort(function(a, b) {
          return Point.distanceSquared(position, a.position()) - Point.distanceSquared(position, b.position());
        }).first();
      },
      distance: function(otherObj) {
        return Point.distance(self.position(), otherObj.position());
      },
      position: function(newPosition) {
        if (newPosition != null) {
          I.x = newPosition.x;
          return I.y = newPosition.y;
        } else {
          return Point(I.x, I.y);
        }
      },
      changePosition: function(delta) {
        I.x += delta.x;
        I.y += delta.y;
        return self;
      },
      collides: function(bounds) {
        return Collision.rectangular(self.bounds(), bounds);
      },
      collisionBounds: function(xOffset, yOffset) {
        var bounds;
        bounds = self.bounds(xOffset, yOffset);
        bounds.x += I.collisionMargin.x;
        bounds.y += I.collisionMargin.y;
        bounds.width -= 2 * I.collisionMargin.x;
        bounds.height -= 2 * I.collisionMargin.y;
        return bounds;
      },
      bounds: function(xOffset, yOffset) {
        var center;
        center = self.center();
        return {
          x: center.x - I.width / 2 + (xOffset || 0),
          y: center.y - I.height / 2 + (yOffset || 0),
          width: I.width,
          height: I.height
        };
      },
      centeredBounds: function() {
        var center;
        center = self.center();
        return {
          x: center.x,
          y: center.y,
          xw: I.width / 2,
          yw: I.height / 2
        };
      },
      center: function(newCenter) {
        return self.position(newCenter);
      },
      circle: function() {
        var circle;
        circle = self.center();
        circle.radius = I.radius || I.width / 2 || I.height / 2;
        return circle;
      }
    });
  };

}).call(this);

//# sourceURL=modules/bounded.coffee;

  return module.exports;
},"modules/camera":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, Camera, defaults;

  Bindable = require("./bindable");

  defaults = require("../util").defaults;

  Camera = function(I, self) {
    var currentObject, currentType, focusOn, followTypes, module, objectFilters, transformFilters, _i, _len, _ref;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      screen: {
        x: 0,
        y: 0,
        width: 1024,
        height: 576
      },
      deadzone: Point(0, 0),
      zoom: 1,
      transform: Matrix(),
      velocity: Point(0, 0),
      maxSpeed: 750,
      t90: 2
    });
    if (I.x == null) {
      I.x = I.screen.width / 2;
    }
    if (I.y == null) {
      I.y = I.screen.height / 2;
    }
    if (I.cameraBounds == null) {
      I.cameraBounds = I.screen;
    }
    currentType = "centered";
    currentObject = null;
    objectFilters = [];
    transformFilters = [];
    focusOn = function(object, elapsedTime) {
      var c, dampingFactor, delta, force, objectCenter, target;
      dampingFactor = 2;
      c = elapsedTime * 3.75 / I.t90;
      if (c >= 1) {
        self.position(target);
        return I.velocity = Point(0, 0);
      } else {
        objectCenter = object.center();
        target = objectCenter;
        delta = target.subtract(self.position());
        force = delta.subtract(I.velocity.scale(dampingFactor));
        self.changePosition(I.velocity.scale(c).clamp(I.maxSpeed));
        return I.velocity = I.velocity.add(force.scale(c));
      }
    };
    followTypes = {
      centered: function(object, elapsedTime) {
        I.deadzone = Point(0, 0);
        return focusOn(object, elapsedTime);
      },
      topdown: function(object, elapsedTime) {
        var helper;
        helper = Math.max(I.screen.width, I.screen.height) / 4;
        I.deadzone = Point(helper, helper);
        return focusOn(object, elapsedTime);
      },
      platformer: function(object, elapsedTime) {
        var height, width;
        width = I.screen.width / 8;
        height = I.screen.height / 3;
        I.deadzone = Point(width, height);
        return focusOn(object, elapsedTime);
      }
    };
    self.extend({
      follow: function(object, type) {
        if (type == null) {
          type = "centered";
        }
        currentObject = object;
        return currentType = type;
      },
      objectFilterChain: function(fn) {
        return objectFilters.push(fn);
      },
      transformFilterChain: function(fn) {
        return transformFilters.push(fn);
      },
      screenToWorld: function(point) {
        return self.transform().inverse().transformPoint(point);
      }
    });
    self.attrAccessor("transform");
    self.on("afterUpdate", function(elapsedTime) {
      if (currentObject) {
        followTypes[currentType](currentObject, elapsedTime);
      }
      I.x = I.x.clamp(I.cameraBounds.x + I.screen.width / 2, I.cameraBounds.x + I.cameraBounds.width - I.screen.width / 2);
      I.y = I.y.clamp(I.cameraBounds.y + I.screen.height / 2, I.cameraBounds.y + I.cameraBounds.height - I.screen.height / 2);
      return I.transform = Matrix.translate(I.screen.width / 2 - I.x.floor(), I.screen.height / 2 - I.y.floor());
    });
    self.on("draw", function(canvas, objects) {
      return canvas.withTransform(Matrix.translate(I.screen.x, I.screen.y), function(canvas) {
        var transform;
        canvas.clip(0, 0, I.screen.width, I.screen.height);
        objects = objectFilters.pipeline(objects);
        transform = transformFilters.pipeline(self.transform().copy());
        return canvas.withTransform(transform, function(canvas) {
          self.trigger("beforeDraw", canvas);
          return objects.invoke("draw", canvas);
        });
      });
    });
    self.on("overlay", function(canvas, objects) {
      return canvas.withTransform(Matrix.translate(I.screen.x, I.screen.y), function(canvas) {
        canvas.clip(0, 0, I.screen.width, I.screen.height);
        objects = objectFilters.pipeline(objects);
        return objects.invoke("trigger", "overlay", canvas);
      });
    });
    self.include(require("./age"));
    self.include(require("./bounded"));
    _ref = Camera.defaultModules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      module = _ref[_i];
      self.include(module);
    }
    return self;
  };

  Camera.defaultModules = ["z_sort", "shake", "zoom", "rotate", "flash", "fade", "transition"].map(function(name) {
    return require("./camera/" + name);
  });

  module.exports = Camera;

}).call(this);

//# sourceURL=modules/camera.coffee;

  return module.exports;
},"modules/camera/fade":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    var configureFade, fadeInDefaults, fadeOutDefaults;
    if (I == null) {
      I = {};
    }
    fadeInDefaults = {
      alpha: 0,
      color: 'black',
      duration: 30
    };
    fadeOutDefaults = {
      alpha: 1,
      color: 'transparent',
      duration: 30
    };
    configureFade = function(duration, color, alpha) {
      I.flashDuration = duration;
      I.flashCooldown = duration;
      I.flashColor = Color(color);
      return I.flashTargetAlpha = alpha;
    };
    return self.extend({
      fadeIn: function(options) {
        var alpha, color, duration, _ref;
        if (options == null) {
          options = {};
        }
        _ref = defaults(options, fadeInDefaults), alpha = _ref.alpha, color = _ref.color, duration = _ref.duration;
        return configureFade(duration, color, alpha);
      },
      fadeOut: function(options) {
        var alpha, color, duration, _ref;
        if (options == null) {
          options = {};
        }
        _ref = defaults(options, fadeOutDefaults), alpha = _ref.alpha, color = _ref.color, duration = _ref.duration;
        return configureFade(duration, color, alpha);
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/fade.coffee;

  return module.exports;
},"modules/camera/flash":function(require, global, module, exports, PACKAGE) {
  (function() {
  var approach, defaults, _ref;

  _ref = require("../../util"), approach = _ref.approach, defaults = _ref.defaults;

  module.exports = function(I, self) {
    var defaultParams;
    defaults(I, {
      flashAlpha: 0,
      flashColor: "black",
      flashDuration: 0.3,
      flashCooldown: 0,
      flashTargetAlpha: 0
    });
    defaultParams = {
      color: 'white',
      duration: 0.3,
      targetAlpha: 0
    };
    self.on('afterUpdate', function(dt) {
      if (I.flashCooldown > 0) {
        I.flashAlpha = approach(I.flashAlpha, 0, dt / I.flashDuration);
        return I.flashCooldown = approach(I.flashCooldown, 0, dt);
      }
    });
    self.on('overlay', function(canvas) {
      var previousAlpha;
      previousAlpha = canvas.globalAlpha();
      canvas.globalAlpha(I.flashAlpha);
      canvas.fill(I.flashColor);
      return canvas.globalAlpha(previousAlpha);
    });
    return {
      /**
      A convenient way to set the flash effect instance variables. Alternatively, you can modify them by hand, but
      using Camera#flash is the suggested approach.
      
          camera.flash()
          # => Sets the flash effect variables to their default state. This will cause a white flash that will turn transparent in the next 12 frames.
        
          camera.flash
            color: 'green'
            duration: 30
          # => This flash effect will start off green and fade to transparent over 30 frames.
        
          camera.flash
            color: Color(255, 0, 0, 0)
            duration: 20
            targetAlpha: 1
          # => This flash effect will start off transparent and move toward red over 20 frames 
      
      @name flash
      @methodOf Camera#
      @param {Color} [color="white"] The flash color
      @param {Number} [duration=12] How long the effect lasts
      @param {Number} [targetAlpha=0] The alpha value to fade to. By default, this is set to 0, which fades the color to transparent.
      */

      flash: function(options) {
        var color, duration, targetAlpha;
        if (options == null) {
          options = {};
        }
        defaults(options, defaultParams);
        color = options.color, duration = options.duration, targetAlpha = options.targetAlpha;
        I.flashColor = Color(color);
        I.flashTargetAlpha = targetAlpha;
        I.flashCooldown = duration;
        I.flashDuration = duration;
        return self;
      }
    };
  };

}).call(this);

//# sourceURL=modules/camera/flash.coffee;

  return module.exports;
},"modules/camera/rotate":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    defaults(I, {
      rotation: 0
    });
    self.transformFilterChain(function(transform) {
      return transform.rotate(I.rotation, self.position());
    });
    self.attrAccessor("rotation");
    return self.extend({
      rotate: function(amount) {
        return self.rotation(I.rotation + amount);
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/rotate.coffee;

  return module.exports;
},"modules/camera/shake":function(require, global, module, exports, PACKAGE) {
  (function() {
  var approach, defaults, _ref;

  _ref = require("../../util"), approach = _ref.approach, defaults = _ref.defaults;

  module.exports = function(I, self) {
    var defaultParams;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      shakeIntensity: 20,
      shakeCooldown: 0
    });
    defaultParams = {
      duration: 0.3,
      intensity: 20
    };
    self.on("afterUpdate", function(dt) {
      return I.shakeCooldown = approach(I.shakeCooldown, 0, dt);
    });
    self.transformFilterChain(function(transform) {
      if (I.shakeCooldown > 0) {
        transform.tx += Random.signed(I.shakeIntensity);
        transform.ty += Random.signed(I.shakeIntensity);
      }
      return transform;
    });
    return self.extend({
      shake: function(options) {
        var duration, intensity, _ref1;
        if (options == null) {
          options = {};
        }
        _ref1 = defaults(options, defaultParams), duration = _ref1.duration, intensity = _ref1.intensity;
        I.shakeCooldown = duration;
        I.shakeIntensity = intensity;
        return self;
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/shake.coffee;

  return module.exports;
},"modules/camera/transition":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults, extend, _ref;

  _ref = require("../../util"), defaults = _ref.defaults, extend = _ref.extend;

  module.exports = function(I, self) {
    var defaultOptions, transitionProgress, transitions;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      transitionActive: null,
      transitionStart: null,
      transitionEnd: null
    });
    defaultOptions = {
      color: "white"
    };
    transitionProgress = function() {
      return ((I.age - I.transitionStart) / (I.transitionEnd - I.transitionStart)).clamp(0, 1);
    };
    transitions = {
      angle: function(_arg) {
        var canvas, color, p0, p1, p2, p3, p4, screenSize, t;
        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;
        p0 = Point(t * (screenSize.x * 2), screenSize.y / 2);
        p1 = p0.subtract(Point(screenSize.x, screenSize.y / 2));
        p2 = p1.subtract(Point(screenSize.x, 0));
        p3 = p2.add(Point(0, screenSize.y));
        p4 = p3.add(Point(screenSize.x, 0));
        return canvas.drawPoly({
          points: [p0, p1, p2, p3, p4],
          color: color
        });
      },
      square: function(_arg) {
        var canvas, color, height, screenSize, t, width;
        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;
        width = 50;
        height = 50;
        return (screenSize.y / height).ceil().times(function(y) {
          return (screenSize.x / width).ceil().times(function(x) {
            var cellProgress;
            cellProgress = (2 * t - (x + y).mod(2)).clamp(0, 1);
            return canvas.drawRect({
              x: x * width,
              y: y * height,
              width: width,
              height: height * cellProgress,
              color: color
            });
          });
        });
      },
      line: function(_arg) {
        var canvas, color, height, screenSize, t;
        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;
        height = 50;
        return (screenSize.y / height).ceil().times(function(y) {
          return canvas.drawRect({
            x: 0,
            y: y * height,
            width: screenSize.x,
            height: height * t,
            color: color
          });
        });
      }
    };
    self.on("overlay", function(canvas) {
      var transitionName;
      if (transitionName = I.transitionActive) {
        return transitions[transitionName](extend({
          canvas: canvas,
          screenSize: Point(I.screen.width, I.screen.height),
          t: transitionProgress()
        }, I.transitionOptions));
      }
    });
    return self.extend({
      transition: function(_arg) {
        var duration, name, options, _ref1;
        _ref1 = _arg != null ? _arg : {}, name = _ref1.name, duration = _ref1.duration, options = _ref1.options;
        if (name == null) {
          name = "angle";
        }
        if (duration == null) {
          duration = 1;
        }
        if (options == null) {
          options = {};
        }
        I.transitionActive = name;
        I.transitionStart = I.age;
        I.transitionEnd = I.age + duration;
        return I.transitionOptions = defaults(options, defaultOptions);
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/transition.coffee;

  return module.exports;
},"modules/camera/z_sort":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      zSort: true
    });
    self.objectFilterChain(function(objects) {
      if (I.zSort) {
        objects.sort(function(a, b) {
          return a.I.zIndex - b.I.zIndex;
        });
      }
      return objects;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/camera/z_sort.coffee;

  return module.exports;
},"modules/camera/zoom":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    var clampZoom;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      maxZoom: 10,
      minZoom: 0.1,
      zoom: 1
    });
    self.attrAccessor("zoom");
    self.transformFilterChain(function(transform) {
      return transform.scale(I.zoom, I.zoom, self.position());
    });
    clampZoom = function(value) {
      return value.clamp(I.minZoom, I.maxZoom);
    };
    return self.extend({
      zoomIn: function(percentage) {
        return self.zoom(clampZoom(I.zoom * (1 + percentage)));
      },
      zoomOut: function(percentage) {
        return self.zoom(clampZoom(I.zoom * (1 - percentage)));
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/zoom.coffee;

  return module.exports;
},"modules/cameras":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, Camera;

  Bindable = require("./bindable");

  Camera = require("./camera");

  module.exports = function(I, self) {
    var cameras;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable();
    }
    cameras = [Camera()];
    self.on('update', function(elapsedTime) {
      return self.cameras().invoke('trigger', 'update', elapsedTime);
    });
    self.on('afterUpdate', function(elapsedTime) {
      return self.cameras().invoke('trigger', 'afterUpdate', elapsedTime);
    });
    self.on('draw', function(canvas) {
      return self.cameras().invoke('trigger', 'draw', canvas, self.objects());
    });
    self.on('overlay', function(canvas) {
      return self.cameras().invoke('trigger', 'overlay', canvas, self.objects());
    });
    return self.extend({
      addCamera: function(data) {
        return cameras.push(Camera(data));
      },
      cameras: function(newCameras) {
        if (newCameras) {
          cameras = newCameras;
          return self;
        } else {
          return cameras;
        }
      }
    });
  };

}).call(this);

//# sourceURL=modules/cameras.coffee;

  return module.exports;
},"modules/clamp":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, defaults, extend, _ref;

  Bindable = require("./bindable");

  _ref = require("../util"), defaults = _ref.defaults, extend = _ref.extend;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      clampData: {}
    });
    self.on("afterUpdate", function() {
      var data, property, _ref1, _results;
      _ref1 = I.clampData;
      _results = [];
      for (property in _ref1) {
        data = _ref1[property];
        _results.push(I[property] = I[property].clamp(data.min, data.max));
      }
      return _results;
    });
    return self.extend({
      clamp: function(data) {
        return extend(I.clampData, data);
      },
      clampToBounds: function(bounds) {
        bounds || (bounds = Rectangle({
          x: 0,
          y: 0,
          width: App.width,
          height: App.height
        }));
        return self.clamp({
          x: {
            min: bounds.x + I.width / 2,
            max: bounds.width - I.width / 2
          },
          y: {
            min: bounds.y + I.height / 2,
            max: bounds.height - I.height / 2
          }
        });
      }
    });
  };

}).call(this);

//# sourceURL=modules/clamp.coffee;

  return module.exports;
},"modules/cooldown":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, approach, defaults, _ref;

  Bindable = require("./bindable");

  _ref = require("../util"), approach = _ref.approach, defaults = _ref.defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      cooldowns: {}
    });
    self.on("update", function(dt) {
      var approachBy, cooldownOptions, name, target, _ref1, _results;
      _ref1 = I.cooldowns;
      _results = [];
      for (name in _ref1) {
        cooldownOptions = _ref1[name];
        approachBy = cooldownOptions.approachBy, target = cooldownOptions.target;
        _results.push(I[name] = approach(I[name], target, approachBy * dt));
      }
      return _results;
    });
    return self.extend({
      cooldown: function(name, options) {
        var approachBy, target;
        if (options == null) {
          options = {};
        }
        target = options.target, approachBy = options.approachBy;
        if (target == null) {
          target = 0;
        }
        if (approachBy == null) {
          approachBy = 1;
        }
        if (I[name] == null) {
          I[name] = 0;
        }
        I.cooldowns[name] = {
          target: target,
          approachBy: approachBy
        };
        return self;
      }
    });
  };

}).call(this);

//# sourceURL=modules/cooldown.coffee;

  return module.exports;
},"modules/drawable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, defaults;

  Bindable = require("./bindable");

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      alpha: 1,
      color: "#196",
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      zIndex: 0
    });
    self.off(".Drawable");
    self.on('draw.Drawable', function(canvas) {
      var previousAlpha, sprite;
      if ((I.alpha != null) && I.alpha !== 1) {
        previousAlpha = canvas.context().globalAlpha;
        canvas.context().globalAlpha = I.alpha;
      }
      if (sprite = self.sprite()) {
        sprite.draw(canvas, -sprite.width / 2, -sprite.height / 2);
      } else {
        if (I.radius != null) {
          canvas.drawCircle({
            x: 0,
            y: 0,
            radius: I.radius,
            color: I.color
          });
        } else {
          canvas.drawRect({
            x: -I.width / 2,
            y: -I.height / 2,
            width: I.width,
            height: I.height,
            color: I.color
          });
        }
      }
      if ((I.alpha != null) && I.alpha !== 1) {
        return canvas.context().globalAlpha = previousAlpha;
      }
    });
    return self.extend({
      draw: function(canvas) {
        self.trigger('beforeTransform', canvas);
        canvas.withTransform(self.transform(), function(canvas) {
          self.trigger('beforeDraw', canvas);
          self.trigger('draw', canvas);
          return self.trigger('afterDraw', canvas);
        });
        self.trigger('afterTransform', canvas);
        return self;
      },
      sprite: function() {
        var name, url;
        if (name = I.spriteName) {
          return Sprite.loadByName(name);
        } else if (url = I.spriteURL) {
          return Sprite.load(url);
        }
      },
      transform: function() {
        var center, transform;
        center = self.center();
        transform = Matrix.translation(center.x.floor(), center.y.floor());
        transform = transform.concat(Matrix.scale(I.scale * I.scaleX, I.scale * I.scaleY));
        if (I.rotation) {
          transform = transform.concat(Matrix.rotation(I.rotation));
        }
        if (I.spriteOffset) {
          transform = transform.concat(Matrix.translation(I.spriteOffset.x, I.spriteOffset.y));
        }
        return transform;
      }
    });
  };

}).call(this);

//# sourceURL=modules/drawable.coffee;

  return module.exports;
},"modules/effect":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    return self.extend({
      fadeOut: function(duration, complete) {
        if (duration == null) {
          duration = 1;
        }
        return self.tween(duration, {
          alpha: 0,
          complete: complete
        });
      }
    });
  };

}).call(this);

//# sourceURL=modules/effect.coffee;

  return module.exports;
},"modules/engine/background":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    var backgroundSprite;
    defaults(I, {
      background: null,
      backgroundColor: "#00010D",
      clear: false
    });
    self.attrAccessor("clear", "backgroundColor");
    backgroundSprite = function() {
      if (I.background) {
        return Sprite.loadByName(I.background);
      }
    };
    self.on("beforeDraw", function() {
      var sprite;
      if (I.clear) {
        return I.canvas.clear();
      } else if (sprite = backgroundSprite()) {
        return sprite.fill(I.canvas, 0, 0, I.canvas.width(), I.canvas.height());
      } else if (I.backgroundColor) {
        return I.canvas.fill(I.backgroundColor);
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/engine/background.coffee;

  return module.exports;
},"modules/engine/collision":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Collision;

  Collision = require("/lib/collision");

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    return self.extend({
      /**
      Detects collisions between a bounds and the game objects.
      
      @name collides
      @methodOf Engine#
      @param bounds The bounds to check collisions with.
      @param [sourceObject] An object to exclude from the results.
      @returns {Boolean} true if the bounds object collides with any of the game objects, false otherwise.
      */

      collides: function(bounds, sourceObject, selector) {
        if (selector == null) {
          selector = ".solid";
        }
        return self.find(selector).inject(false, function(collided, object) {
          return collided || (object !== sourceObject) && object.collides(bounds) && object;
        });
      },
      /**
      Detects collisions between a bounds and the game objects.
      Returns an array of objects colliding with the bounds provided.
      
      @name collidesWith
      @methodOf Engine#
      @param bounds The bounds to check collisions with.
      @param [sourceObject] An object to exclude from the results.
      @returns {Array} An array of objects that collide with the given bounds.
      */

      collidesWith: function(bounds, sourceObject, selector) {
        if (selector == null) {
          selector = ".solid";
        }
        return self.find(selector).select(function(object) {
          return object !== sourceObject && object.collides(bounds);
        });
      },
      /**
      Detects collisions between a ray and the game objects.
      
      @name rayCollides
      @methodOf Engine#
      @param source The origin point
      @param direction A point representing the direction of the ray
      @param [sourceObject] An object to exclude from the results.
      @param [selector] A selector to choos which objects in the engine to collide with
      */

      rayCollides: function(_arg) {
        var direction, hits, nearestDistance, nearestHit, selector, source, sourceObject;
        source = _arg.source, direction = _arg.direction, sourceObject = _arg.sourceObject, selector = _arg.selector;
        if (selector == null) {
          selector = "";
        }
        hits = self.find(selector).map(function(object) {
          var hit;
          hit = (object !== sourceObject) && Collision.rayRectangle(source, direction, object.centeredBounds());
          if (hit) {
            hit.object = object;
          }
          return hit;
        });
        nearestDistance = Infinity;
        nearestHit = null;
        hits.each(function(hit) {
          var d;
          if (hit && (d = hit.distance(source)) < nearestDistance) {
            nearestDistance = d;
            return nearestHit = hit;
          }
        });
        return nearestHit;
      },
      objectsUnderPoint: function(point, selector) {
        var bounds;
        if (selector == null) {
          selector = "";
        }
        bounds = {
          x: point.x,
          y: point.y,
          width: 0,
          height: 0
        };
        return self.find(selector).select(function(object) {
          return object.collides(bounds);
        });
      }
    });
  };

}).call(this);

//# sourceURL=modules/engine/collision.coffee;

  return module.exports;
},"modules/engine/finder":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Finder;

  Finder = require("finder");

  module.exports = function(I, self) {
    var finder;
    if (I == null) {
      I = {};
    }
    finder = Finder();
    return self.extend({
      find: function(selector) {
        return finder.find(self.objects(), selector);
      }
    });
  };

}).call(this);

//# sourceURL=modules/engine/finder.coffee;

  return module.exports;
},"modules/engine/game_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameState, defaults;

  defaults = require("../../util").defaults;

  GameState = require("../../game_state");

  module.exports = function(I, self) {
    var requestedState;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      currentState: GameState()
    });
    requestedState = null;
    self.on("update", function(elapsedTime) {
      I.currentState.trigger("beforeUpdate", elapsedTime);
      I.currentState.trigger("update", elapsedTime);
      return I.currentState.trigger("afterUpdate", elapsedTime);
    });
    self.on("afterUpdate", function() {
      var previousState;
      if (requestedState != null) {
        I.currentState.trigger("exit", requestedState);
        self.trigger('stateExited', I.currentState);
        previousState = I.currentState;
        I.currentState = requestedState;
        I.currentState.trigger("enter", previousState);
        self.trigger('stateEntered', I.currentState);
        return requestedState = null;
      }
    });
    self.on("draw", function(canvas) {
      I.currentState.trigger("beforeDraw", canvas);
      I.currentState.trigger("draw", canvas);
      return I.currentState.trigger("overlay", canvas);
    });
    return self.extend({
      add: function(classNameOrEntityData, entityData) {
        var object;
        if (entityData == null) {
          entityData = {};
        }
        if (typeof classNameOrEntityData === "string") {
          entityData["class"] = classNameOrEntityData;
        } else {
          entityData = classNameOrEntityData;
        }
        self.trigger("beforeAdd", entityData);
        object = I.currentState.add(entityData);
        self.trigger("afterAdd", object);
        return object;
      },
      camera: function(n) {
        if (n == null) {
          n = 0;
        }
        return self.cameras()[n];
      },
      cameras: function(newCameras) {
        if (newCameras != null) {
          I.currentState.cameras(newCameras);
          return self;
        } else {
          return I.currentState.cameras();
        }
      },
      fadeIn: function(options) {
        if (options == null) {
          options = {};
        }
        return self.cameras().invoke('fadeIn', options);
      },
      fadeOut: function(options) {
        if (options == null) {
          options = {};
        }
        return self.cameras().invoke('fadeOut', options);
      },
      flash: function(options) {
        if (options == null) {
          options = {};
        }
        return self.camera(options.camera).flash(options);
      },
      objects: function() {
        return I.currentState.objects();
      },
      setState: function(newState) {
        return requestedState = newState;
      },
      shake: function(options) {
        if (options == null) {
          options = {};
        }
        return self.camera(options.camera).shake(options);
      },
      saveState: function() {
        return I.currentState.saveState();
      },
      loadState: function(newState) {
        return I.currentState.loadState(newState);
      },
      reload: function() {
        return I.currentState.reload();
      }
    });
  };

}).call(this);

//# sourceURL=modules/engine/game_state.coffee;

  return module.exports;
},"modules/engine/keyboard":function(require, global, module, exports, PACKAGE) {
  (function() {
  var keyName, prevKeysDown, updateKeys;

  window.keydown = {};

  window.justPressed = {};

  window.justReleased = {};

  prevKeysDown = {};

  keyName = function(event) {
    return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
  };

  $(document).bind("keydown", function(event) {
    var key;
    key = keyName(event);
    return keydown[key] = true;
  });

  $(document).bind("keyup", function(event) {
    var key;
    key = keyName(event);
    return keydown[key] = false;
  });

  updateKeys = function() {
    var key, value, _results;
    window.justPressed = {};
    window.justReleased = {};
    keydown.any = false;
    for (key in keydown) {
      value = keydown[key];
      justPressed[key] = value && !prevKeysDown[key];
      justReleased[key] = !value && prevKeysDown[key];
      if (justPressed[key] || (typeof mousePressed !== "undefined" && mousePressed !== null ? mousePressed.left : void 0) || (typeof mousePressed !== "undefined" && mousePressed !== null ? mousePressed.right : void 0)) {
        justPressed.any = true;
      }
      if (value || (typeof mouseDown !== "undefined" && mouseDown !== null ? mouseDown.left : void 0) || (typeof mouseDown !== "undefined" && mouseDown !== null ? mouseDown.right : void 0)) {
        keydown.any = true;
      }
    }
    prevKeysDown = {};
    _results = [];
    for (key in keydown) {
      value = keydown[key];
      _results.push(prevKeysDown[key] = value);
    }
    return _results;
  };

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    self.on("beforeUpdate", function() {
      return updateKeys();
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/engine/keyboard.coffee;

  return module.exports;
},"modules/engine/mouse":function(require, global, module, exports, PACKAGE) {
  (function() {
  var buttonName, buttonNames, prevButtonsDown;

  window.mouseDown = {};

  window.mousePressed = {};

  window.mouseReleased = {};

  window.mousePosition = Point(0, 0);

  prevButtonsDown = {};

  buttonNames = {
    1: "left",
    2: "middle",
    3: "right"
  };

  buttonName = function(event) {
    return buttonNames[event.which];
  };

  $(document).bind("mousemove", function(event) {
    var offset;
    offset = $("canvas").offset() || {
      left: 0,
      top: 0
    };
    mousePosition.x = event.pageX - offset.left;
    return mousePosition.y = event.pageY - offset.top;
  });

  $(document).bind("mousedown", function(event) {
    return mouseDown[buttonName(event)] = true;
  });

  $(document).bind("mouseup", function(event) {
    return mouseDown[buttonName(event)] = false;
  });

  window.updateMouse = function() {
    var button, value, _results;
    window.mousePressed = {};
    window.mouseReleased = {};
    for (button in mouseDown) {
      value = mouseDown[button];
      if (!prevButtonsDown[button]) {
        mousePressed[button] = value;
      }
    }
    for (button in mouseDown) {
      value = mouseDown[button];
      if (prevButtonsDown[button]) {
        mouseReleased[button] = !value;
      }
    }
    prevButtonsDown = {};
    _results = [];
    for (button in mouseDown) {
      value = mouseDown[button];
      _results.push(prevButtonsDown[button] = value);
    }
    return _results;
  };

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    self.on("beforeUpdate", function() {
      return typeof updateMouse === "function" ? updateMouse() : void 0;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/engine/mouse.coffee;

  return module.exports;
},"modules/expirable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, defaults;

  Bindable = require("./bindable");

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      duration: -1
    });
    self.on("update", function(dt) {
      if (I.duration !== -1 && I.age >= I.duration) {
        return I.active = false;
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/expirable.coffee;

  return module.exports;
},"modules/follow":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    defaults(I, {
      velocity: Point(0, 0),
      speed: 1
    });
    self.attrAccessor("speed");
    return self.extend({
      follow: function(obj) {
        var position;
        if (obj.position != null) {
          position = obj.position();
        } else if (obj.x != null) {
          position = obj;
        }
        if (position) {
          return I.velocity = position.subtract(self.position()).norm(self.speed());
        }
      }
    });
  };

}).call(this);

//# sourceURL=modules/follow.coffee;

  return module.exports;
},"modules/meter":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      meters: {}
    });
    self.on('overlay', function(canvas) {
      var backgroundColor, borderColor, borderRadius, borderWidth, color, height, meterData, name, ratio, show, width, x, y, _ref, _ref1, _ref2;
      _ref = I.meters;
      for (name in _ref) {
        meterData = _ref[name];
        backgroundColor = meterData.backgroundColor, (_ref1 = meterData.border, borderColor = _ref1.color, borderRadius = _ref1.radius, borderWidth = _ref1.width), color = meterData.color, height = meterData.height, show = meterData.show, width = meterData.width, x = meterData.x, y = meterData.y;
        if (meterData.position != null) {
          _ref2 = meterData.position, x = _ref2.x, y = _ref2.y;
        }
        if (!show) {
          return;
        }
        ratio = (I[name] / I["" + name + "Max"]).clamp(0, 1);
        canvas.drawRoundRect({
          color: backgroundColor,
          radius: borderRadius,
          x: x,
          y: y,
          width: width,
          height: height
        });
        canvas.drawRoundRect({
          color: color,
          x: x,
          y: y,
          radius: borderRadius,
          width: width * ratio,
          height: height
        });
        canvas.drawRoundRect({
          x: x,
          y: y,
          width: width,
          height: height,
          radius: borderRadius,
          stroke: {
            color: borderColor,
            width: borderWidth
          }
        });
      }
    });
    return self.extend({
      /**
      Configures a meter to be drawn each overlay event.
      
          player = GameObject
      
          player.meter 'health',
            border
              color: 'brown'
              radius: 3
            color: 'pink'
            height: 20
            x: 5
            y: 5
            show: true
            width: 150
      
          # => Sets up a health meter, using all the configuration options
      
      @name meter
      @methodOf Metered#
      @param {String} name The name of the property to meter
      @param {Object} options The meter configuration options
      @param {String} border: color Color of the meter's border
      @param {Number} border: width Width of the meter's border
      @param {String} color Color of the meter's inner rectangle
      @param {Number} height Height of the meter
      @param {Object} position An x, y object representing the position of the meter
      @param {Number} x x position of the meter
      @param {Number} y y position of the meter
      @param {Number} border: radius Border radius of the meter
      @param {Boolean} show Boolean to toggle whether of not to display the meter
      @param {Number} width How wide the meter is
      */

      meter: function(name, options) {
        if (options == null) {
          options = {};
        }
        defaults(options, {
          backgroundColor: 'black',
          border: {
            color: 'white',
            radius: 2,
            width: 1.5
          },
          color: 'green',
          height: 10,
          x: 0,
          y: 0,
          show: true,
          width: 100
        });
        if (I[name] == null) {
          I[name] = 100;
        }
        if (!I["" + name + "Max"]) {
          if (I[name]) {
            I["" + name + "Max"] = I[name];
          } else {
            I["" + name + "Max"] = 100;
          }
        }
        return I.meters[name] = options;
      },
      /**
      Shows the named meter
      
          player = GameObject
      
          # creates a health meter but disables visibility
          player.meter 'health'
            show: false
      
          # enables visibility for the meter named 'health'
          player.showMeter 'health'
      
      @name showMeter
      @methodOf Metered#
      @param {String} name The name of the meter to show
      */

      showMeter: function(name) {
        return I.meters[name].show = true;
      },
      /**
      Hides the named meter
      
          player = GameObject
      
          # creates a health meter
          player.meter 'health'
      
          # disables visibility for the meter named 'health'
          player.hideMeter 'health'
      
      @name hideMeter
      @methodOf Metered#
      @param {String} name The name of the meter to hide
      */

      hideMeter: function(name) {
        return I.meters[name].show = false;
      },
      /**
      Toggles visibility of the named meter
      
          player = GameObject
      
          # creates a health meter
          player.meter 'health'
      
          # toggles visibility for the meter named 'health'
          player.toggleMeter 'health'
      
      @name toggleMeter
      @methodOf Metered#
      @param {String} name The name of the meter to toggle
      */

      toggleMeter: function(name) {
        return I.meters[name].show = !I.meters[name].show;
      }
    });
  };

}).call(this);

//# sourceURL=modules/meter.coffee;

  return module.exports;
},"modules/movable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      acceleration: Point(0, 0),
      velocity: Point(0, 0)
    });
    I.acceleration = Point(I.acceleration.x, I.acceleration.y);
    I.velocity = Point(I.velocity.x, I.velocity.y);
    self.attrReader("velocity", "acceleration");
    self.off(".Movable");
    return self.on('update.Movable', function(dt) {
      var currentSpeed;
      I.velocity = I.velocity.add(I.acceleration.scale(dt));
      if (I.maxSpeed != null) {
        currentSpeed = I.velocity.magnitude();
        if (currentSpeed > I.maxSpeed) {
          I.velocity = I.velocity.scale(I.maxSpeed / currentSpeed);
        }
      }
      I.x += I.velocity.x * dt;
      return I.y += I.velocity.y * dt;
    });
  };

}).call(this);

//# sourceURL=modules/movable.coffee;

  return module.exports;
},"modules/rotatable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      rotation: 0,
      rotationalVelocity: 0
    });
    self.on('update', function(dt) {
      return I.rotation += I.rotationalVelocity * dt;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/rotatable.coffee;

  return module.exports;
},"modules/save_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend;

  extend = require("/util").extend;

  module.exports = function(I, self) {
    var savedState;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    savedState = null;
    return self.extend({
      saveState: function() {
        return savedState = I.objects.map(function(object) {
          return extend({}, object.I);
        });
      },
      loadState: function(newState) {
        if (newState || (newState = savedState)) {
          I.objects.invoke("trigger", "remove");
          I.objects = [];
          return newState.each(function(objectData) {
            return self.add(extend({}, objectData));
          });
        }
      },
      reload: function() {
        var oldObjects;
        oldObjects = I.objects;
        I.objects = [];
        oldObjects.each(function(object) {
          object.trigger("remove");
          return self.add(object.I);
        });
        return self;
      }
    });
  };

}).call(this);

//# sourceURL=modules/save_state.coffee;

  return module.exports;
},"modules/timed_events":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults,
    __slice = [].slice;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      everyEvents: [],
      delayEvents: []
    });
    self.bind("update", function(elapsedTime) {
      var event, firingEvents, fn, period, _i, _len, _ref, _ref1;
      _ref = I.everyEvents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        fn = event.fn, period = event.period;
        if (period <= 0) {
          continue;
        }
        while (event.lastFired < I.age + elapsedTime) {
          self.sendOrApply(fn);
          event.lastFired += period;
        }
      }
      _ref1 = I.delayEvents.partition(function(event) {
        return (event.delay -= elapsedTime) >= 0;
      }), I.delayEvents = _ref1[0], firingEvents = _ref1[1];
      return firingEvents.each(function(event) {
        return self.sendOrApply(event.fn);
      });
    });
    return self.extend({
      every: function(period, fn) {
        if (!(period > 0)) {
          return;
        }
        I.everyEvents.push({
          fn: fn,
          period: period,
          lastFired: I.age
        });
        return self;
      },
      delay: function(seconds, fn) {
        I.delayEvents.push({
          delay: seconds,
          fn: fn
        });
        return self;
      },
      sendOrApply: function() {
        var args, fn;
        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (typeof fn === "function") {
          return fn.apply(self, args);
        } else {
          return self[fn].apply(self, args);
        }
      }
    });
  };

}).call(this);

//# sourceURL=modules/timed_events.coffee;

  return module.exports;
},"modules/tween":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Easing, defaults, extend, _ref;

  _ref = require("../util"), defaults = _ref.defaults, extend = _ref.extend;

  Easing = require("../lib/easing");

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      activeTweens: {}
    });
    self.on("update", function(elapsedTime) {
      var data, delta, duration, easing, easingFunction, end, endTime, property, start, startTime, t, _base, _ref1, _results;
      t = I.age + elapsedTime;
      _ref1 = I.activeTweens;
      _results = [];
      for (property in _ref1) {
        data = _ref1[property];
        start = data.start, end = data.end, startTime = data.startTime, endTime = data.endTime, duration = data.duration, easing = data.easing;
        delta = end - start;
        if (t >= endTime) {
          I[property] = end;
          if (typeof (_base = I.activeTweens[property]).complete === "function") {
            _base.complete();
          }
          _results.push(delete I.activeTweens[property]);
        } else {
          if (typeof easing === "string") {
            easingFunction = Easing[easing];
          } else {
            easingFunction = easing;
          }
          _results.push(I[property] = start + delta * easingFunction((t - startTime) / duration));
        }
      }
      return _results;
    });
    return self.extend({
      tween: function(duration, properties) {
        var complete, easing, property, target, _results;
        properties = extend({}, properties);
        easing = properties.easing || "linear";
        complete = properties.complete;
        delete properties.easing;
        delete properties.complete;
        _results = [];
        for (property in properties) {
          target = properties[property];
          _results.push(I.activeTweens[property] = {
            complete: complete,
            end: target,
            start: I[property],
            easing: easing,
            duration: duration,
            startTime: I.age,
            endTime: I.age + duration
          });
        }
        return _results;
      }
    });
  };

}).call(this);

//# sourceURL=modules/tween.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.1.8-alpha.2","width":640,"height":480,"remoteDependencies":["https://code.jquery.com/jquery-1.10.1.min.js"],"dependencies":{"appcache":"distri/appcache:v0.2.0","cornerstone":"distri/cornerstone:v0.2.0","finder":"distri/finder:v0.1.3","hotkeys":"distri/hotkeys:v0.2.0","jquery-utils":"distri/jquery-utils:v0.2.0","sprite":"distri/sprite:v0.3.0","touch-canvas":"distri/touch-canvas:v0.3.0"}};;

  return module.exports;
},"setup":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("jquery-utils");

  require("appcache");

  require("cornerstone");

  global.Bindable = require("./modules/bindable");

  global.Sprite = require("sprite");

}).call(this);

//# sourceURL=setup.coffee;

  return module.exports;
},"style":function(require, global, module, exports, PACKAGE) {
  module.exports = "* {\n  -ms-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\nhtml {\n  height: 100%;\n}\n\nbody {\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\n  font-weight: 300;\n  font-size: 18px;\n  height: 100%;\n  margin: 0;\n  overflow: hidden;\n  -ms-user-select: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n\n.center {\n  bottom: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n}";;

  return module.exports;
},"test/engine":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Engine;

  require("../test_setup");

  Engine = require("../engine");

  describe("Engine", function() {
    var MockCanvas;
    MockCanvas = function() {
      return {
        clear: function() {},
        context: function() {
          return {
            beginPath: function() {},
            clip: function() {},
            rect: function() {}
          };
        },
        drawRect: function() {},
        fill: function() {},
        withTransform: function(t, fn) {
          return fn(this);
        },
        clip: function() {},
        globalAlpha: function() {}
      };
    };
    test("#play, #pause, and #paused", function() {
      var engine;
      engine = Engine();
      equal(engine.paused(), false);
      engine.pause();
      equal(engine.paused(), true);
      engine.play();
      equal(engine.paused(), false);
      engine.pause();
      equal(engine.paused(), true);
      engine.pause();
      equal(engine.paused(), false);
      engine.pause(false);
      equal(engine.paused(), false);
      engine.pause(true);
      return equal(engine.paused(), true);
    });
    test("#save and #restore", function() {
      var engine;
      engine = Engine();
      engine.add({});
      engine.add({});
      equals(engine.objects().length, 2);
      engine.saveState();
      engine.add({});
      equals(engine.objects().length, 3);
      engine.loadState();
      return equals(engine.objects().length, 2);
    });
    test("before add event", function() {
      var engine;
      engine = Engine();
      engine.bind("beforeAdd", function(data) {
        return equals(data.test, "test");
      });
      return engine.add({
        test: "test"
      });
    });
    test("#add", function() {
      var engine;
      engine = Engine();
      assert(engine.objects().length === 0);
      engine.add("GameObject", {
        test: true
      });
      return assert(engine.objects().length === 1);
    });
    test("#add class name only", function() {
      var engine;
      engine = Engine();
      assert(engine.objects().length === 0);
      engine.add("GameObject");
      return assert(engine.objects().length === 1);
    });
    test("zSort", function() {
      var bindDraw, engine, n, o1, o2;
      engine = Engine({
        canvas: MockCanvas(),
        zSort: true
      });
      n = 0;
      bindDraw = function(o) {
        return o.bind('draw', function() {
          n += 1;
          return o.I.drawnAt = n;
        });
      };
      o2 = engine.add({
        zIndex: 2
      });
      o1 = engine.add({
        zIndex: 1
      });
      bindDraw(o1);
      bindDraw(o2);
      engine.frameAdvance();
      equals(o1.I.drawnAt, 1, "Object with zIndex " + o1.I.zIndex + " should be drawn first");
      return equals(o2.I.drawnAt, 2, "Object with zIndex " + o2.I.zIndex + " should be drawn second");
    });
    test("draw events", function() {
      var calls, engine;
      engine = Engine({
        canvas: MockCanvas(),
        backgroundColor: false
      });
      calls = 0;
      engine.bind("beforeDraw", function() {
        calls += 1;
        return ok(true);
      });
      engine.bind("draw", function() {
        calls += 1;
        return ok(true);
      });
      engine.frameAdvance();
      return equals(calls, 2);
    });
    test("Remove event", function() {
      var called, engine, object;
      engine = Engine({
        backgroundColor: false
      });
      object = engine.add({
        active: false
      });
      called = 0;
      object.bind("remove", function() {
        called += 1;
        return ok(true, "remove called");
      });
      engine.frameAdvance();
      return assert.equal(called, 1);
    });
    test("#find", function() {
      var engine;
      engine = Engine();
      engine.add({
        id: "testy"
      });
      engine.add({
        test: true
      }).attrReader("test");
      engine.add({
        solid: true,
        opaque: false
      }).attrReader("solid", "opaque");
      equal(engine.find("#no_testy").length, 0, "No object with id `no_testy`");
      equal(engine.find("#testy").length, 1, "Object with id `testy`");
      equal(engine.find(".test").length, 1, "Object with attribute `test`");
      equal(engine.find(".solid=true").length, 1, "Object with attribute `solid` equal to true");
      return equal(engine.find(".opaque=false").length, 1, "Object with attribute `opaque` equal to false");
    });
    test("#camera", function() {
      var engine;
      engine = Engine();
      return equal(engine.camera(), engine.cameras().first());
    });
    test("#collides", function() {
      var engine;
      engine = Engine();
      return engine.collides({
        x: 0,
        y: 0,
        width: 10,
        height: 10
      }, null);
    });
    test("Integration", function() {
      var engine, object;
      engine = Engine({
        FPS: 30
      });
      object = engine.add({
        "class": "GameObject",
        velocity: Point(30, 0)
      });
      engine.frameAdvance();
      equals(object.I.x, 1);
      return equals(object.I.age, 1 / 30);
    });
    test("objectsUnderPoint", function() {
      var engine, object;
      engine = Engine();
      object = engine.add({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      equals(engine.objectsUnderPoint(Point(0, 0)).length, 1);
      return equals(engine.objectsUnderPoint(Point(300, 300)).length, 0);
    });
    return test("#setState");
    /*
      engine = Engine()
    
      # TODO: Shouldn't need to use the GameState constructor itself
      nextState = GameState()
    
      engine.setState nextState
    
      # Test state change events
      engine.bind "stateEntered", ->
        ok true
      engine.bind "stateExited", ->
        ok true
    
      engine.update()
    
      equal engine.I.currentState, nextState
    */

  });

}).call(this);

//# sourceURL=test/engine.coffee;

  return module.exports;
},"test/game_object":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../test_setup");

  GameObject = require("../game_object");

  describe("GameObject", function() {
    test("()", function() {
      var gameObject;
      gameObject = GameObject();
      return ok(gameObject);
    });
    test(".construct", function() {
      var gameObject;
      gameObject = GameObject.construct({
        name: "Gandalf"
      });
      return equals(gameObject.I.name, "Gandalf");
    });
    test("construct invalid object", function() {
      return raises(function() {
        return GameObject.construct({
          "class": "aaaaa"
        });
      });
    });
    test("#closest", function() {
      var o, other, other2;
      o = GameObject({
        x: 0,
        y: 0
      });
      other = GameObject({
        x: 1,
        y: 1
      });
      other2 = GameObject({
        x: 10,
        y: 10
      });
      equals(o.closest([]), null);
      return equals(o.closest([other, other2]), other);
    });
    test("elapsedTime", function() {
      var gameObject, timeStep;
      gameObject = GameObject();
      timeStep = 33;
      gameObject.bind("update", function(t) {
        return equals(t, timeStep);
      });
      return gameObject.update(timeStep);
    });
    test("[event] create", function() {
      var called, o;
      o = GameObject();
      called = 0;
      o.bind("create", function() {
        called += 1;
        return ok(true, "created event is fired on create");
      });
      o.create();
      o.create();
      return assert.equal(called, 1);
    });
    test("[event] update", function() {
      var gameObject;
      gameObject = GameObject();
      gameObject.bind("update", function() {
        return equals(gameObject.I.age, 0, 'Age should be 0 on first update');
      });
      return gameObject.trigger("update", 1);
    });
    return test("[event] destroy", function() {
      var called, o;
      o = GameObject();
      called = 0;
      o.bind("destroy", function() {
        called += 1;
        return ok(true, "destroyed event is fired on destroy");
      });
      o.destroy();
      o.destroy();
      return assert.equal(called, 1);
    });
  });

}).call(this);

//# sourceURL=test/game_object.coffee;

  return module.exports;
},"test/game_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameState;

  require("../test_setup");

  GameState = require("../game_state");

  describe("GameState", function() {
    return it("should be legit", function() {
      return assert(GameState());
    });
  });

}).call(this);

//# sourceURL=test/game_state.coffee;

  return module.exports;
},"test/modules/bindable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable;

  require("../../test_setup");

  Bindable = require("../../modules/bindable");

  describe("Bindable", function() {
    test("#bind and #trigger", function() {
      var o;
      o = Bindable();
      o.bind("test", function() {
        return ok(true);
      });
      return o.trigger("test");
    });
    test("Multiple bindings", function() {
      var o;
      o = Bindable();
      o.bind("test", function() {
        return ok(true);
      });
      o.bind("test", function() {
        return ok(true);
      });
      return o.trigger("test");
    });
    test("#trigger arguments", function() {
      var o, param1, param2;
      o = Bindable();
      param1 = "the message";
      param2 = 3;
      o.bind("test", function(p1, p2) {
        equal(p1, param1);
        return equal(p2, param2);
      });
      return o.trigger("test", param1, param2);
    });
    test("#unbind", function() {
      var callback, o;
      o = Bindable();
      callback = function() {
        return ok(false);
      };
      o.bind("test", callback);
      o.unbind("test", callback);
      o.trigger("test");
      o.bind("test", callback);
      o.unbind("test");
      return o.trigger("test");
    });
    test("#trigger namespace", function() {
      var o;
      o = Bindable();
      o.bind("test.TestNamespace", function() {
        return ok(true);
      });
      o.trigger("test");
      o.unbind(".TestNamespace");
      return o.trigger("test");
    });
    return test("#unbind namespaced", function() {
      var o;
      o = Bindable();
      o.bind("test.TestNamespace", function() {
        return ok(true);
      });
      o.trigger("test");
      o.unbind(".TestNamespace", function() {});
      return o.trigger("test");
    });
  });

}).call(this);

//# sourceURL=test/modules/bindable.coffee;

  return module.exports;
},"test/modules/bounded":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bounded;

  require("../../test_setup");

  Bounded = require("../../modules/bounded");

  describe("Bounded", function() {
    test('it should have #distance', function() {
      var player;
      player = Bounded();
      return ok(player.distance);
    });
    test('it should proxy #distance to Point.distance', function() {
      var enemy, player;
      player = Bounded({
        x: 50,
        y: 50,
        width: 10,
        height: 10
      });
      enemy = Bounded({
        x: 110,
        y: 120,
        width: 7,
        height: 20
      });
      return equals(player.distance(enemy), Point.distance(player.position(), enemy.position()));
    });
    test("#bounds returns correct x, y, width, height", function() {
      var height, obj, width, x, y;
      x = 5;
      y = 10;
      width = 50;
      height = 75;
      obj = Bounded({
        x: x,
        y: y,
        width: width,
        height: height
      });
      equals(obj.bounds().x, x - width / 2);
      equals(obj.bounds().y, y - height / 2);
      equals(obj.bounds().width, width);
      return equals(obj.bounds().height, height);
    });
    test("#centeredBounds returns correct x, y, xw, yx", function() {
      var bounds, obj, x, y;
      x = -5;
      y = 20;
      obj = Bounded({
        x: x,
        y: y,
        width: 100,
        height: 200
      });
      bounds = obj.centeredBounds();
      equals(bounds.x, x);
      equals(bounds.y, y);
      equals(bounds.xw, 100 / 2);
      return equals(bounds.yw, 200 / 2);
    });
    test("#bounds(width, height) returns correct x, y", function() {
      var bounds, height, obj, offsetX, offsetY, width, x, y;
      x = 20;
      y = 10;
      width = 15;
      height = 25;
      offsetX = 7.5;
      offsetY = 12;
      obj = Bounded({
        x: x,
        y: y,
        width: width,
        height: height
      });
      bounds = obj.bounds(offsetX, offsetY);
      equals(bounds.x, obj.center().x + offsetX - width / 2);
      return equals(bounds.y, obj.center().y + offsetY - height / 2);
    });
    return test("#center returns correct center point", function() {
      var center, obj;
      obj = Bounded({
        x: -5,
        y: 20,
        width: 10,
        height: 60
      });
      center = obj.center();
      return ok(center.equal(Point(-5, 20)));
    });
  });

}).call(this);

//# sourceURL=test/modules/bounded.coffee;

  return module.exports;
},"test/modules/camera":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Camera, GameObject;

  GameObject = require("../../game_object");

  Camera = require("../../modules/camera");

  describe("Camera", function() {
    var MockCanvas;
    MockCanvas = function() {
      return {
        clear: function() {},
        context: function() {
          return {
            beginPath: function() {},
            clip: function() {},
            rect: function() {}
          };
        },
        drawRect: function() {},
        fill: function() {},
        withTransform: function(t, fn) {
          return fn(this);
        },
        clip: function() {},
        globalAlpha: function() {}
      };
    };
    test("create", function() {
      return ok(Camera());
    });
    test("follow", function() {
      var camera, dt, object, transform;
      object = GameObject();
      camera = Camera();
      dt = 1 / 60;
      camera.follow(object);
      camera.trigger("afterUpdate", dt);
      transform = camera.I.transform;
      assert(transform.tx != null, "tx exists: " + transform.tx);
      return assert(transform.ty != null, "ty exists: " + transform.ty);
    });
    test("overlay", function() {
      var called, camera, canvas, object;
      object = GameObject();
      called = 0;
      object.bind('overlay', function() {
        ok(true);
        return called += 1;
      });
      canvas = MockCanvas();
      camera = Camera();
      camera.trigger('overlay', canvas, [object]);
      return assert.equal(called, 1);
    });
    test("zoom", function() {
      var camera;
      camera = Camera();
      camera.zoom(2);
      assert.equal(camera.zoom(), 2);
      camera.zoomOut(0.5);
      return assert.equal(camera.zoom(), 1);
    });
    return test("shake", function() {
      var camera;
      camera = Camera();
      camera.shake({
        duration: 1,
        intensity: 10
      });
      assert.equal(camera.I.shakeCooldown, 1, "Should set shake duration");
      assert.equal(camera.I.shakeIntensity, 10, "Should set intensity");
      return camera.trigger("draw", MockCanvas(), []);
    });
  });

}).call(this);

//# sourceURL=test/modules/camera.coffee;

  return module.exports;
},"test/modules/clamp":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Clamp;

  require("../../test_setup");

  Clamp = require("../../modules/clamp");

  describe("Clamp", function() {
    return test("#clamp", function() {
      var max, o;
      o = Clamp({
        x: 1500
      });
      max = 100;
      o.clamp({
        x: {
          min: 0,
          max: max
        }
      });
      o.trigger("afterUpdate");
      return equals(o.I.x, max);
    });
  });

}).call(this);

//# sourceURL=test/modules/clamp.coffee;

  return module.exports;
},"test/modules/cooldown":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Cooldown", function() {
    test("objects count down each of their cooldowns", function() {
      var obj;
      obj = GameObject({
        bullet: 83,
        cooldowns: {
          bullet: {
            target: 3,
            approachBy: 1
          }
        }
      });
      5..times(function() {
        return obj.update(1);
      });
      equals(obj.I.bullet, 78, "bullet should decrease by 5");
      100..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.bullet, 3, "bullet should not cool down part target value");
    });
    test("should handle negative value", function() {
      var obj;
      obj = GameObject({
        powerup: -70,
        cooldowns: {
          powerup: {
            target: 0,
            approachBy: 1
          }
        }
      });
      11..times(function() {
        return obj.update(1);
      });
      equals(obj.I.powerup, -59, "powerup should increase by 11");
      70..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.powerup, 0, "powerup should not cooldown past target value");
    });
    test("adding many cooldowns to default instance variables", function() {
      var obj;
      obj = GameObject({
        cool: 20,
        rad: 0,
        tubular: 0,
        cooldowns: {
          cool: {
            approachBy: 5,
            target: -5
          },
          rad: {
            approachBy: 0.5,
            target: 1.5
          },
          tubular: {
            approachBy: 1,
            target: 1000
          }
        }
      });
      4..times(function() {
        return obj.update(1);
      });
      equals(obj.I.cool, 0);
      equals(obj.I.rad, 1.5);
      return equals(obj.I.tubular, 4);
    });
    test("#cooldown", function() {
      var obj;
      obj = GameObject({
        health: 100
      });
      obj.cooldown('health');
      3..times(function() {
        return obj.update(1);
      });
      equals(obj.I.health, 97, "health cooldown should exist and equal 97");
      obj.cooldown('turbo', {
        target: 25,
        approachBy: 3
      });
      4..times(function() {
        return obj.update(1);
      });
      equals(obj.I.health, 93, "health should continue of cool down when new cooldowns are added");
      return equals(obj.I.turbo, 12, "turbo should cool down normally");
    });
    test("should not blow up if cooldowns aren't specified", function() {
      var obj;
      obj = GameObject();
      obj.update(1);
      obj.trigger("afterUpdate", 1);
      return equals(obj.I.age, 1, "should successfully update");
    });
    test("use existing value of instance variable as starting value if no value param given", function() {
      var obj;
      obj = GameObject();
      obj.I.health = 3;
      obj.cooldown('health', {
        target: 10
      });
      5..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.health, 8);
    });
    return test("initialize property to 0 if no current value", function() {
      var obj;
      obj = GameObject();
      obj.cooldown('health', {
        target: 10
      });
      5..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.health, 5);
    });
  });

}).call(this);

//# sourceURL=test/modules/cooldown.coffee;

  return module.exports;
},"test/modules/drawable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Drawable", function() {
    test("alpha", function() {
      var object, object2;
      object = GameObject();
      equal(object.I.alpha, 1);
      object2 = GameObject({
        alpha: 0.5
      });
      return equal(object2.I.alpha, 0.5);
    });
    return test("scale", function() {
      var object, transform;
      object = GameObject();
      transform = object.transform();
      equal(transform.a, 1);
      equal(transform.d, 1);
      object = GameObject({
        scale: 2,
        scaleX: -1,
        scaleY: 0.5
      });
      transform = object.transform();
      equal(transform.a, -2);
      return equal(transform.d, 1);
    });
  });

}).call(this);

//# sourceURL=test/modules/drawable.coffee;

  return module.exports;
},"test/modules/effect":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Effect", function() {
    return test("fadeOut", function() {
      var fadedOut, player;
      player = GameObject();
      fadedOut = false;
      player.fadeOut(1, function() {
        return fadedOut = true;
      });
      player.trigger("update", 1);
      player.trigger("afterUpdate", 1);
      equals(player.I.alpha, 0, "Player has faded out");
      return ok(fadedOut, "callback was called");
    });
  });

}).call(this);

//# sourceURL=test/modules/effect.coffee;

  return module.exports;
},"test/modules/expirable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Expirable", function() {
    return test("objects become inactive after their duration", function() {
      var obj;
      obj = GameObject({
        duration: 5
      });
      4..times(function() {
        obj.update(1);
        return obj.trigger("afterUpdate", 1);
      });
      equals(obj.I.active, true, "object is active until duration is exceeded");
      5..times(function() {
        obj.update(1);
        return obj.trigger("afterUpdate", 1);
      });
      return equals(obj.I.active, false, "object is inactive after duration");
    });
  });

}).call(this);

//# sourceURL=test/modules/expirable.coffee;

  return module.exports;
},"test/modules/follow":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Follow", function() {
    return test("should set the correct velocity", function() {
      var enemy, player, rightEnemy;
      player = GameObject({
        x: 50,
        y: 50,
        width: 10,
        height: 10
      });
      enemy = GameObject({
        x: 0,
        y: 50,
        widht: 10,
        height: 10,
        speed: 1
      });
      enemy.follow(player);
      ok(enemy.I.velocity.equal(Point(1, 0)), 'enemy should head toward player with a velocity Point(1, 0)');
      rightEnemy = GameObject({
        x: 100,
        y: 50,
        width: 10,
        height: 10,
        speed: 1
      });
      rightEnemy.follow(player);
      return ok(rightEnemy.I.velocity.equal(Point(-1, 0)), 'rightEnemy should head toward player with a velocity Point(-1, 0)');
    });
  });

}).call(this);

//# sourceURL=test/modules/follow.coffee;

  return module.exports;
},"test/modules/meter":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe('Meter', function() {
    test("should respect 0 being set as the meter attribute", function() {
      var obj;
      obj = GameObject({
        health: 0,
        healthMax: 110
      });
      obj.meter('health');
      return equals(obj.I.health, 0);
    });
    test("should set max<Attribute> if it isn't present in the including object", function() {
      var obj;
      obj = GameObject({
        health: 150
      });
      obj.meter('health');
      return equals(obj.I.healthMax, 150);
    });
    return test("should set both <attribute> and max<attribute> if they aren't present in the including object", function() {
      var obj;
      obj = GameObject();
      obj.meter('turbo');
      equals(obj.I.turbo, 100);
      return equals(obj.I.turboMax, 100);
    });
  });

}).call(this);

//# sourceURL=test/modules/meter.coffee;

  return module.exports;
},"test/modules/movable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Movable", function() {
    test("should update velocity", function() {
      var particle;
      particle = GameObject({
        velocity: Point(1, 2),
        x: 50,
        y: 50
      });
      particle.update(1);
      equals(particle.I.x, 51, "x position updated according to velocity");
      return equals(particle.I.y, 52, "y position updated according to velocity");
    });
    test("should not exceed max speed", function() {
      var particle;
      particle = GameObject({
        velocity: Point(5, 5),
        acceleration: Point(1, 1),
        maxSpeed: 10
      });
      20..times(function() {
        return particle.update(1);
      });
      return ok(particle.I.velocity.magnitude() <= particle.I.maxSpeed, "magnitude of the velocity should not exceed maxSpeed");
    });
    test("should be able to get velocity", function() {
      var object;
      object = GameObject();
      return ok(object.velocity());
    });
    test("should be able to get acceleration", function() {
      var object;
      object = GameObject();
      return ok(object.acceleration());
    });
    return test("should increase velocity according to acceleration", function() {
      var particle;
      particle = GameObject({
        velocity: Point(0, -30),
        acceleration: Point(0, 60)
      });
      60..times(function() {
        return particle.update(1 / 60);
      });
      equals(particle.I.velocity.x, 0);
      return equals(particle.I.velocity.y, 30);
    });
  });

}).call(this);

//# sourceURL=test/modules/movable.coffee;

  return module.exports;
},"test/modules/rotatable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Rotatable", function() {
    return test("objects update their rotation", function() {
      var obj;
      obj = GameObject({
        rotationalVelocity: Math.PI / 4,
        rotation: Math.PI / 6
      });
      equals(obj.I.rotation, Math.PI / 6, "Respects default rotation value");
      2..times(function() {
        return obj.update(1);
      });
      equals(obj.I.rotation, Math.PI / 2 + Math.PI / 6);
      4..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.rotation, (3 / 2) * Math.PI + Math.PI / 6);
    });
  });

}).call(this);

//# sourceURL=test/modules/rotatable.coffee;

  return module.exports;
},"test/modules/tween":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Tweening", function() {
    return test("should allow for simple linear tweening", function() {
      var o, targetValue;
      o = GameObject({
        x: 0
      });
      targetValue = 10;
      o.tween(10, {
        x: targetValue
      });
      return 12..times(function(i) {
        o.update(1);
        o.trigger("afterUpdate", 1);
        return equals(o.I.x, Math.min(i + 1, targetValue));
      });
    });
  });

}).call(this);

//# sourceURL=test/modules/tween.coffee;

  return module.exports;
},"test_setup":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../../setup");

  global.test = it;

  global.ok = assert;

  global.equal = assert.equal;

  global.equals = assert.equal;

  global.raises = assert.throws;

}).call(this);

//# sourceURL=test_setup.coffee;

  return module.exports;
},"util":function(require, global, module, exports, PACKAGE) {
  (function() {
  var __slice = [].slice;

  module.exports = {
    approach: function(current, target, amount) {
      return (target - current).clamp(-amount, amount) + current;
    },
    defaults: function() {
      var name, object, objects, target, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (name in object) {
          if (!target.hasOwnProperty(name)) {
            target[name] = object[name];
          }
        }
      }
      return target;
    },
    extend: function() {
      var name, source, sources, target, _i, _len;
      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        for (name in source) {
          target[name] = source[name];
        }
      }
      return target;
    }
  };

}).call(this);

//# sourceURL=util.coffee;

  return module.exports;
},"test/dust":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Dust;

  Dust = require("../main");

  describe("Dust", function() {
    it("Should expose Util", function() {
      return assert(Dust.Util);
    });
    return it("Should expose Collision", function() {
      return assert(Dust.Collision);
    });
  });

}).call(this);

//# sourceURL=test/dust.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.1.8-alpha.2","entryPoint":"main","remoteDependencies":{"0":"https://code.jquery.com/jquery-1.10.1.min.js"},"repository":{"id":15406048,"name":"dust","full_name":"distri/dust","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/dust","description":"PixieEngine2 Lite!","fork":false,"url":"https://api.github.com/repos/distri/dust","forks_url":"https://api.github.com/repos/distri/dust/forks","keys_url":"https://api.github.com/repos/distri/dust/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/dust/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/dust/teams","hooks_url":"https://api.github.com/repos/distri/dust/hooks","issue_events_url":"https://api.github.com/repos/distri/dust/issues/events{/number}","events_url":"https://api.github.com/repos/distri/dust/events","assignees_url":"https://api.github.com/repos/distri/dust/assignees{/user}","branches_url":"https://api.github.com/repos/distri/dust/branches{/branch}","tags_url":"https://api.github.com/repos/distri/dust/tags","blobs_url":"https://api.github.com/repos/distri/dust/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/dust/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/dust/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/dust/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/dust/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/dust/languages","stargazers_url":"https://api.github.com/repos/distri/dust/stargazers","contributors_url":"https://api.github.com/repos/distri/dust/contributors","subscribers_url":"https://api.github.com/repos/distri/dust/subscribers","subscription_url":"https://api.github.com/repos/distri/dust/subscription","commits_url":"https://api.github.com/repos/distri/dust/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/dust/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/dust/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/dust/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/dust/contents/{+path}","compare_url":"https://api.github.com/repos/distri/dust/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/dust/merges","archive_url":"https://api.github.com/repos/distri/dust/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/dust/downloads","issues_url":"https://api.github.com/repos/distri/dust/issues{/number}","pulls_url":"https://api.github.com/repos/distri/dust/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/dust/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/dust/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/dust/labels{/name}","releases_url":"https://api.github.com/repos/distri/dust/releases{/id}","created_at":"2013-12-23T22:24:48Z","updated_at":"2013-12-31T03:18:24Z","pushed_at":"2013-12-31T03:18:23Z","git_url":"git://github.com/distri/dust.git","ssh_url":"git@github.com:distri/dust.git","clone_url":"https://github.com/distri/dust.git","svn_url":"https://github.com/distri/dust","homepage":null,"size":576,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.1.8-alpha.2","publishBranch":"gh-pages"},"dependencies":{"appcache":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"appcache\n========\n\nHTML5 AppCache Helpers\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"App Cache\n=========\n\nSome helpers for working with HTML5 application cache.\n\nhttp://www.html5rocks.com/en/tutorials/appcache/beginner/\n\n    applicationCache = window.applicationCache\n\n    applicationCache.addEventListener 'updateready', (e) ->\n      if applicationCache.status is applicationCache.UPDATEREADY\n        # Browser downloaded a new app cache.\n        if confirm('A new version of this site is available. Load it?')\n          window.location.reload()\n    , false\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nentryPoint: \"main\"\n","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var applicationCache;

  applicationCache = window.applicationCache;

  applicationCache.addEventListener('updateready', function(e) {
    if (applicationCache.status === applicationCache.UPDATEREADY) {
      if (confirm('A new version of this site is available. Load it?')) {
        return window.location.reload();
      }
    }
  }, false);

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"main"};;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"main","repository":{"id":14539483,"name":"appcache","full_name":"distri/appcache","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/appcache","description":"HTML5 AppCache Helpers","fork":false,"url":"https://api.github.com/repos/distri/appcache","forks_url":"https://api.github.com/repos/distri/appcache/forks","keys_url":"https://api.github.com/repos/distri/appcache/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/appcache/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/appcache/teams","hooks_url":"https://api.github.com/repos/distri/appcache/hooks","issue_events_url":"https://api.github.com/repos/distri/appcache/issues/events{/number}","events_url":"https://api.github.com/repos/distri/appcache/events","assignees_url":"https://api.github.com/repos/distri/appcache/assignees{/user}","branches_url":"https://api.github.com/repos/distri/appcache/branches{/branch}","tags_url":"https://api.github.com/repos/distri/appcache/tags","blobs_url":"https://api.github.com/repos/distri/appcache/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/appcache/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/appcache/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/appcache/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/appcache/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/appcache/languages","stargazers_url":"https://api.github.com/repos/distri/appcache/stargazers","contributors_url":"https://api.github.com/repos/distri/appcache/contributors","subscribers_url":"https://api.github.com/repos/distri/appcache/subscribers","subscription_url":"https://api.github.com/repos/distri/appcache/subscription","commits_url":"https://api.github.com/repos/distri/appcache/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/appcache/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/appcache/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/appcache/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/appcache/contents/{+path}","compare_url":"https://api.github.com/repos/distri/appcache/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/appcache/merges","archive_url":"https://api.github.com/repos/distri/appcache/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/appcache/downloads","issues_url":"https://api.github.com/repos/distri/appcache/issues{/number}","pulls_url":"https://api.github.com/repos/distri/appcache/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/appcache/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/appcache/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/appcache/labels{/name}","releases_url":"https://api.github.com/repos/distri/appcache/releases{/id}","created_at":"2013-11-19T22:09:16Z","updated_at":"2013-11-29T20:49:51Z","pushed_at":"2013-11-19T22:10:28Z","git_url":"git://github.com/distri/appcache.git","ssh_url":"git@github.com:distri/appcache.git","clone_url":"https://github.com/distri/appcache.git","svn_url":"https://github.com/distri/appcache","homepage":null,"size":240,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{}},"cornerstone":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"cornerstone\n===========\n\nCore JavaScript Extensions.\n","type":"blob"},"cornerstone.coffee.md":{"path":"cornerstone.coffee.md","mode":"100644","content":"Cornerstone\n===========\n\nRequire and pollute.\n\n    require \"extensions\"\n\n    global.Core = require(\"core\")\n\n    require(\"math\").pollute()\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nentryPoint: \"cornerstone\"\ndependencies:\n  math: \"distri/math:v0.2.0\"\n  extensions: \"distri/extensions:v0.2.0\"\n  core: \"distri/core:v0.6.0\"\n","type":"blob"},"test/cornerstone.coffee":{"path":"test/cornerstone.coffee","mode":"100644","content":"require \"../cornerstone\"\n\ndescribe \"Cornerstone\", ->\n  it \"should provide Core\", ->\n    assert Core\n\n  it \"should provide Matrix\", ->\n    assert Matrix\n\n  it \"should provide Point\", ->\n    assert Point\n\n  it \"should provide Random\", ->\n    assert Random\n\n  it \"should provide rand\", ->\n    assert rand\n\n  it \"should provide Function#debounce\", ->\n    assert (->).debounce\n","type":"blob"}},"distribution":{"cornerstone":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("extensions");

  global.Core = require("core");

  require("math").pollute();

}).call(this);

//# sourceURL=cornerstone.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"cornerstone","dependencies":{"math":"distri/math:v0.2.0","extensions":"distri/extensions:v0.2.0","core":"distri/core:v0.6.0"}};;

  return module.exports;
},"test/cornerstone":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../cornerstone");

  describe("Cornerstone", function() {
    it("should provide Core", function() {
      return assert(Core);
    });
    it("should provide Matrix", function() {
      return assert(Matrix);
    });
    it("should provide Point", function() {
      return assert(Point);
    });
    it("should provide Random", function() {
      return assert(Random);
    });
    it("should provide rand", function() {
      return assert(rand);
    });
    return it("should provide Function#debounce", function() {
      return assert((function() {}).debounce);
    });
  });

}).call(this);

//# sourceURL=test/cornerstone.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"cornerstone","repository":{"id":13576225,"name":"cornerstone","full_name":"distri/cornerstone","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/cornerstone","description":"Core JavaScript Extensions.","fork":false,"url":"https://api.github.com/repos/distri/cornerstone","forks_url":"https://api.github.com/repos/distri/cornerstone/forks","keys_url":"https://api.github.com/repos/distri/cornerstone/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/cornerstone/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/cornerstone/teams","hooks_url":"https://api.github.com/repos/distri/cornerstone/hooks","issue_events_url":"https://api.github.com/repos/distri/cornerstone/issues/events{/number}","events_url":"https://api.github.com/repos/distri/cornerstone/events","assignees_url":"https://api.github.com/repos/distri/cornerstone/assignees{/user}","branches_url":"https://api.github.com/repos/distri/cornerstone/branches{/branch}","tags_url":"https://api.github.com/repos/distri/cornerstone/tags","blobs_url":"https://api.github.com/repos/distri/cornerstone/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/cornerstone/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/cornerstone/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/cornerstone/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/cornerstone/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/cornerstone/languages","stargazers_url":"https://api.github.com/repos/distri/cornerstone/stargazers","contributors_url":"https://api.github.com/repos/distri/cornerstone/contributors","subscribers_url":"https://api.github.com/repos/distri/cornerstone/subscribers","subscription_url":"https://api.github.com/repos/distri/cornerstone/subscription","commits_url":"https://api.github.com/repos/distri/cornerstone/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/cornerstone/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/cornerstone/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/cornerstone/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/cornerstone/contents/{+path}","compare_url":"https://api.github.com/repos/distri/cornerstone/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/cornerstone/merges","archive_url":"https://api.github.com/repos/distri/cornerstone/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/cornerstone/downloads","issues_url":"https://api.github.com/repos/distri/cornerstone/issues{/number}","pulls_url":"https://api.github.com/repos/distri/cornerstone/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/cornerstone/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/cornerstone/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/cornerstone/labels{/name}","releases_url":"https://api.github.com/repos/distri/cornerstone/releases{/id}","created_at":"2013-10-14T23:43:38Z","updated_at":"2013-12-24T01:09:50Z","pushed_at":"2013-12-24T01:09:50Z","git_url":"git://github.com/distri/cornerstone.git","ssh_url":"git@github.com:distri/cornerstone.git","clone_url":"https://github.com/distri/cornerstone.git","svn_url":"https://github.com/distri/cornerstone","homepage":null,"size":504,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{"math":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"math\n====\n\nMath is for cool guys.\n","type":"blob"},"math.coffee.md":{"path":"math.coffee.md","mode":"100644","content":"Math\n====\n\nRequire and export many math libraries.\n\n    Point = require \"point\"\n\n    Matrix = require \"matrix\"\n    Matrix.Point = Point\n\n    Random = require \"random\"\n\n    module.exports = self =\n      Point: Point\n      Matrix: Matrix\n      Random: Random\n      rand: Random.rand\n\nPollute all libraries to the global namespace.\n\n      pollute: ->\n        Object.keys(self).forEach (key) ->\n          return if key is \"version\"\n          return if key is \"pollute\"\n\n          global[key] = self[key]\n\n        return self\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"entryPoint: \"math\"\nversion: \"0.2.0\"\ndependencies:\n  point: \"distri/point:v0.2.0\"\n  matrix: \"distri/matrix:v0.3.1\"\n  random: \"distri/random:v0.2.0\"\n","type":"blob"},"test/math.coffee":{"path":"test/math.coffee","mode":"100644","content":"require(\"../math\").pollute()\n\nconsole.log global\n\ndescribe \"Point\", ->\n  it \"should exist\", ->\n    assert Point\n\n  it \"should construct points\", ->\n    assert Point()\n\ndescribe \"Matrix\", ->\n  it \"should exist and return matrices when invoked\", ->\n    assert Matrix\n\n    assert Matrix()\n\n  it \"should use the same `Point` class\", ->\n    assert Matrix.Point is Point\n\n    assert Matrix().transformPoint(Point()) instanceof Point\n\ndescribe \"Random\", ->\n  it \"should exist\", ->\n    assert Random\n\ndescribe \"rand\", ->\n  it \"should exist\", ->\n    assert rand\n\n    assert rand()?\n","type":"blob"}},"distribution":{"math":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Matrix, Point, Random, self;

  Point = require("point");

  Matrix = require("matrix");

  Matrix.Point = Point;

  Random = require("random");

  module.exports = self = {
    Point: Point,
    Matrix: Matrix,
    Random: Random,
    rand: Random.rand,
    pollute: function() {
      Object.keys(self).forEach(function(key) {
        if (key === "version") {
          return;
        }
        if (key === "pollute") {
          return;
        }
        return global[key] = self[key];
      });
      return self;
    }
  };

}).call(this);

//# sourceURL=math.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"math","version":"0.2.0","dependencies":{"point":"distri/point:v0.2.0","matrix":"distri/matrix:v0.3.1","random":"distri/random:v0.2.0"}};;

  return module.exports;
},"test/math":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../math").pollute();

  console.log(global);

  describe("Point", function() {
    it("should exist", function() {
      return assert(Point);
    });
    return it("should construct points", function() {
      return assert(Point());
    });
  });

  describe("Matrix", function() {
    it("should exist and return matrices when invoked", function() {
      assert(Matrix);
      return assert(Matrix());
    });
    return it("should use the same `Point` class", function() {
      assert(Matrix.Point === Point);
      return assert(Matrix().transformPoint(Point()) instanceof Point);
    });
  });

  describe("Random", function() {
    return it("should exist", function() {
      return assert(Random);
    });
  });

  describe("rand", function() {
    return it("should exist", function() {
      assert(rand);
      return assert(rand() != null);
    });
  });

}).call(this);

//# sourceURL=test/math.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"math","repository":{"id":13576636,"name":"math","full_name":"distri/math","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/math","description":"Math is for cool guys.","fork":false,"url":"https://api.github.com/repos/distri/math","forks_url":"https://api.github.com/repos/distri/math/forks","keys_url":"https://api.github.com/repos/distri/math/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/math/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/math/teams","hooks_url":"https://api.github.com/repos/distri/math/hooks","issue_events_url":"https://api.github.com/repos/distri/math/issues/events{/number}","events_url":"https://api.github.com/repos/distri/math/events","assignees_url":"https://api.github.com/repos/distri/math/assignees{/user}","branches_url":"https://api.github.com/repos/distri/math/branches{/branch}","tags_url":"https://api.github.com/repos/distri/math/tags","blobs_url":"https://api.github.com/repos/distri/math/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/math/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/math/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/math/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/math/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/math/languages","stargazers_url":"https://api.github.com/repos/distri/math/stargazers","contributors_url":"https://api.github.com/repos/distri/math/contributors","subscribers_url":"https://api.github.com/repos/distri/math/subscribers","subscription_url":"https://api.github.com/repos/distri/math/subscription","commits_url":"https://api.github.com/repos/distri/math/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/math/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/math/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/math/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/math/contents/{+path}","compare_url":"https://api.github.com/repos/distri/math/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/math/merges","archive_url":"https://api.github.com/repos/distri/math/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/math/downloads","issues_url":"https://api.github.com/repos/distri/math/issues{/number}","pulls_url":"https://api.github.com/repos/distri/math/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/math/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/math/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/math/labels{/name}","releases_url":"https://api.github.com/repos/distri/math/releases{/id}","created_at":"2013-10-15T00:13:24Z","updated_at":"2013-12-23T23:29:58Z","pushed_at":"2013-10-15T18:45:48Z","git_url":"git://github.com/distri/math.git","ssh_url":"git@github.com:distri/math.git","clone_url":"https://github.com/distri/math.git","svn_url":"https://github.com/distri/math","homepage":null,"size":364,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{"point":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"point\n=====\n\nJavaScript Point implementation\n","type":"blob"},"interactive_runtime.coffee.md":{"path":"interactive_runtime.coffee.md","mode":"100644","content":"Interactive Runtime\n-------------------\n\n    window.Point = require(\"./point\")\n\nRegister our example runner.\n\n    Interactive.register \"example\", ({source, runtimeElement}) ->\n      program = CoffeeScript.compile(source, bare: true)\n\n      outputElement = document.createElement \"pre\"\n      runtimeElement.empty().append outputElement\n\n      result = eval(program)\n\n      if typeof result is \"number\"\n        if result != (0 | result)\n          result = result.toFixed(4)\n    \n\n      outputElement.textContent = result\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nentryPoint: \"point\"\n","type":"blob"},"point.coffee.md":{"path":"point.coffee.md","mode":"100644","content":"\nCreate a new point with given x and y coordinates. If no arguments are given\ndefaults to (0, 0).\n\n>     #! example\n>     Point()\n\n----\n\n>     #! example\n>     Point(-2, 5)\n\n----\n\n    Point = (x, y) ->\n      if isObject(x)\n        {x, y} = x\n\n      __proto__: Point.prototype\n      x: x ? 0\n      y: y ? 0\n\nPoint protoype methods.\n\n    Point:: =\n\nConstrain the magnitude of a vector.\n\n      clamp: (n) ->\n        if @magnitude() > n\n          @norm(n)\n        else\n          @copy()\n\nCreates a copy of this point.\n\n      copy: ->\n        Point(@x, @y)\n\n>     #! example\n>     Point(1, 1).copy()\n\n----\n\nAdds a point to this one and returns the new point. You may\nalso use a two argument call like `point.add(x, y)`\nto add x and y values without a second point object.\n\n      add: (first, second) ->\n        if second?\n          Point(\n            @x + first\n            @y + second\n          )\n        else\n          Point(\n            @x + first.x,\n            @y + first.y\n          )\n\n>     #! example\n>     Point(2, 3).add(Point(3, 4))\n\n----\n\nSubtracts a point to this one and returns the new point.\n\n      subtract: (first, second) ->\n        if second?\n          Point(\n            @x - first,\n            @y - second\n          )\n        else\n          @add(first.scale(-1))\n\n>     #! example\n>     Point(1, 2).subtract(Point(2, 0))\n\n----\n\nScale this Point (Vector) by a constant amount.\n\n      scale: (scalar) ->\n        Point(\n          @x * scalar,\n          @y * scalar\n        )\n\n>     #! example\n>     point = Point(5, 6).scale(2)\n\n----\n\nThe `norm` of a vector is the unit vector pointing in the same direction. This method\ntreats the point as though it is a vector from the origin to (x, y).\n\n      norm: (length=1.0) ->\n        if m = @length()\n          @scale(length/m)\n        else\n          @copy()\n\n>     #! example\n>     point = Point(2, 3).norm()\n\n----\n\nDetermine whether this `Point` is equal to another `Point`. Returns `true` if\nthey are equal and `false` otherwise.\n\n      equal: (other) ->\n        @x == other.x && @y == other.y\n\n>     #! example\n>     point = Point(2, 3)\n>\n>     point.equal(Point(2, 3))\n\n----\n\nComputed the length of this point as though it were a vector from (0,0) to (x,y).\n\n      length: ->\n        Math.sqrt(@dot(this))\n\n>     #! example\n>     Point(5, 7).length()\n\n----\n\nCalculate the magnitude of this Point (Vector).\n\n      magnitude: ->\n        @length()\n\n>     #! example\n>     Point(5, 7).magnitude()\n\n----\n\nReturns the direction in radians of this point from the origin.\n\n      direction: ->\n        Math.atan2(@y, @x)\n\n>     #! example\n>     point = Point(0, 1)\n>\n>     point.direction()\n\n----\n\nCalculate the dot product of this point and another point (Vector).\n\n      dot: (other) ->\n        @x * other.x + @y * other.y\n\n\n`cross` calculates the cross product of this point and another point (Vector).\nUsually cross products are thought of as only applying to three dimensional vectors,\nbut z can be treated as zero. The result of this method is interpreted as the magnitude\nof the vector result of the cross product between [x1, y1, 0] x [x2, y2, 0]\nperpendicular to the xy plane.\n\n      cross: (other) ->\n        @x * other.y - other.x * @y\n\n\n`distance` computes the Euclidean distance between this point and another point.\n\n      distance: (other) ->\n        Point.distance(this, other)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     pointA.distance(pointB)\n\n----\n\n`toFixed` returns a string representation of this point with fixed decimal places.\n\n      toFixed: (n) ->\n        \"Point(#{@x.toFixed(n)}, #{@y.toFixed(n)})\"\n\n`toString` returns a string representation of this point. The representation is\nsuch that if `eval`d it will return a `Point`\n\n      toString: ->\n        \"Point(#{@x}, #{@y})\"\n\n`distance` Compute the Euclidean distance between two points.\n\n    Point.distance = (p1, p2) ->\n      Math.sqrt(Point.distanceSquared(p1, p2))\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distance(pointA, pointB)\n\n----\n\n`distanceSquared` The square of the Euclidean distance between two points.\n\n    Point.distanceSquared = (p1, p2) ->\n      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)\n\n>     #! example\n>     pointA = Point(2, 3)\n>     pointB = Point(9, 2)\n>\n>     Point.distanceSquared(pointA, pointB)\n\n----\n\n`interpolate` returns a point along the path from p1 to p2\n\n    Point.interpolate = (p1, p2, t) ->\n      p2.subtract(p1).scale(t).add(p1)\n\nConstruct a point on the unit circle for the given angle.\n\n    Point.fromAngle = (angle) ->\n      Point(Math.cos(angle), Math.sin(angle))\n\n>     #! example\n>     Point.fromAngle(Math.PI / 2)\n\n----\n\nIf you have two dudes, one standing at point p1, and the other\nstanding at point p2, then this method will return the direction\nthat the dude standing at p1 will need to face to look at p2.\n\n>     #! example\n>     p1 = Point(0, 0)\n>     p2 = Point(7, 3)\n>\n>     Point.direction(p1, p2)\n\n    Point.direction = (p1, p2) ->\n      Math.atan2(\n        p2.y - p1.y,\n        p2.x - p1.x\n      )\n\nThe centroid of a set of points is their arithmetic mean.\n\n    Point.centroid = (points...) ->\n      points.reduce((sumPoint, point) ->\n        sumPoint.add(point)\n      , Point(0, 0))\n      .scale(1/points.length)\n\nGenerate a random point on the unit circle.\n\n    Point.random = ->\n      Point.fromAngle(Math.random() * 2 * Math.PI)\n\nExport\n\n    module.exports = Point\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\nLive Examples\n-------------\n\n>     #! setup\n>     require(\"/interactive_runtime\")\n","type":"blob"},"test/test.coffee":{"path":"test/test.coffee","mode":"100644","content":"Point = require \"../point\"\n\nok = assert\nequals = assert.equal\n\nTAU = 2 * Math.PI\n\ndescribe \"Point\", ->\n\n  TOLERANCE = 0.00001\n\n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n\n  it \"copy constructor\", ->\n    p = Point(3, 7)\n\n    p2 = Point(p)\n\n    equals p2.x, p.x\n    equals p2.y, p.y\n\n  it \"#add\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.add(p2)\n\n    equals result.x, p1.x + p2.x\n    equals result.y, p1.y + p2.y\n\n    equals p1.x, 5\n    equals p1.y, 6\n    equals p2.x, 7\n    equals p2.y, 5\n\n  it \"#add with two arguments\", ->\n    point = Point(3, 7)\n    x = 2\n    y = 1\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n    x = 2\n    y = 0\n\n    result = point.add(x, y)\n\n    equals result.x, point.x + x\n    equals result.y, point.y + y\n\n  it \"#add existing\", ->\n    p = Point(0, 0)\n\n    p.add(Point(3, 5))\n\n    equals p.x, 0\n    equals p.y, 0\n\n  it \"#subtract\", ->\n    p1 = Point(5, 6)\n    p2 = Point(7, 5)\n\n    result = p1.subtract(p2)\n\n    equals result.x, p1.x - p2.x\n    equals result.y, p1.y - p2.y\n\n  it \"#subtract existing\", ->\n    p = Point(8, 6)\n\n    p.subtract(3, 4)\n\n    equals p.x, 8\n    equals p.y, 6\n\n  it \"#norm\", ->\n    p = Point(2, 0)\n\n    normal = p.norm()\n    equals normal.x, 1\n\n    normal = p.norm(5)\n    equals normal.x, 5\n\n    p = Point(0, 0)\n\n    normal = p.norm()\n    equals normal.x, 0, \"x value of norm of point(0,0) is 0\"\n    equals normal.y, 0, \"y value of norm of point(0,0) is 0\"\n\n  it \"#norm existing\", ->\n    p = Point(6, 8)\n\n    p.norm(5)\n\n    equals p.x, 6\n    equals p.y, 8\n\n  it \"#scale\", ->\n    p = Point(5, 6)\n    scalar = 2\n\n    result = p.scale(scalar)\n\n    equals result.x, p.x * scalar\n    equals result.y, p.y * scalar\n\n    equals p.x, 5\n    equals p.y, 6\n\n  it \"#scale existing\", ->\n    p = Point(0, 1)\n    scalar = 3\n\n    p.scale(scalar)\n\n    equals p.x, 0\n    equals p.y, 1\n\n  it \"#equal\", ->\n    ok Point(7, 8).equal(Point(7, 8))\n\n  it \"#magnitude\", ->\n    equals Point(3, 4).magnitude(), 5\n\n  it \"#length\", ->\n    equals Point(0, 0).length(), 0\n    equals Point(-1, 0).length(), 1\n\n  it \"#toString\", ->\n    p = Point(7, 5)\n    ok eval(p.toString()).equal(p)\n\n  it \"#clamp\", ->\n    p = Point(10, 10)\n    p2 = p.clamp(5)\n\n    equals p2.length(), 5\n\n  it \".centroid\", ->\n    centroid = Point.centroid(\n      Point(0, 0),\n      Point(10, 10),\n      Point(10, 0),\n      Point(0, 10)\n    )\n\n    equals centroid.x, 5\n    equals centroid.y, 5\n\n  it \".fromAngle\", ->\n    p = Point.fromAngle(TAU / 4)\n\n    equalEnough p.x, 0, TOLERANCE\n    equals p.y, 1\n\n  it \".random\", ->\n    p = Point.random()\n\n    ok p\n\n  it \".interpolate\", ->\n    p1 = Point(10, 7)\n    p2 = Point(-6, 29)\n\n    ok p1.equal(Point.interpolate(p1, p2, 0))\n    ok p2.equal(Point.interpolate(p1, p2, 1))\n","type":"blob"}},"distribution":{"interactive_runtime":function(require, global, module, exports, PACKAGE) {
  (function() {
  window.Point = require("./point");

  Interactive.register("example", function(_arg) {
    var outputElement, program, result, runtimeElement, source;
    source = _arg.source, runtimeElement = _arg.runtimeElement;
    program = CoffeeScript.compile(source, {
      bare: true
    });
    outputElement = document.createElement("pre");
    runtimeElement.empty().append(outputElement);
    result = eval(program);
    if (typeof result === "number") {
      if (result !== (0 | result)) {
        result = result.toFixed(4);
      }
    }
    return outputElement.textContent = result;
  });

}).call(this);

//# sourceURL=interactive_runtime.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"point"};;

  return module.exports;
},"point":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Point, isObject,
    __slice = [].slice;

  Point = function(x, y) {
    var _ref;
    if (isObject(x)) {
      _ref = x, x = _ref.x, y = _ref.y;
    }
    return {
      __proto__: Point.prototype,
      x: x != null ? x : 0,
      y: y != null ? y : 0
    };
  };

  Point.prototype = {
    clamp: function(n) {
      if (this.magnitude() > n) {
        return this.norm(n);
      } else {
        return this.copy();
      }
    },
    copy: function() {
      return Point(this.x, this.y);
    },
    add: function(first, second) {
      if (second != null) {
        return Point(this.x + first, this.y + second);
      } else {
        return Point(this.x + first.x, this.y + first.y);
      }
    },
    subtract: function(first, second) {
      if (second != null) {
        return Point(this.x - first, this.y - second);
      } else {
        return this.add(first.scale(-1));
      }
    },
    scale: function(scalar) {
      return Point(this.x * scalar, this.y * scalar);
    },
    norm: function(length) {
      var m;
      if (length == null) {
        length = 1.0;
      }
      if (m = this.length()) {
        return this.scale(length / m);
      } else {
        return this.copy();
      }
    },
    equal: function(other) {
      return this.x === other.x && this.y === other.y;
    },
    length: function() {
      return Math.sqrt(this.dot(this));
    },
    magnitude: function() {
      return this.length();
    },
    direction: function() {
      return Math.atan2(this.y, this.x);
    },
    dot: function(other) {
      return this.x * other.x + this.y * other.y;
    },
    cross: function(other) {
      return this.x * other.y - other.x * this.y;
    },
    distance: function(other) {
      return Point.distance(this, other);
    },
    toFixed: function(n) {
      return "Point(" + (this.x.toFixed(n)) + ", " + (this.y.toFixed(n)) + ")";
    },
    toString: function() {
      return "Point(" + this.x + ", " + this.y + ")";
    }
  };

  Point.distance = function(p1, p2) {
    return Math.sqrt(Point.distanceSquared(p1, p2));
  };

  Point.distanceSquared = function(p1, p2) {
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
  };

  Point.interpolate = function(p1, p2, t) {
    return p2.subtract(p1).scale(t).add(p1);
  };

  Point.fromAngle = function(angle) {
    return Point(Math.cos(angle), Math.sin(angle));
  };

  Point.direction = function(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  };

  Point.centroid = function() {
    var points;
    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return points.reduce(function(sumPoint, point) {
      return sumPoint.add(point);
    }, Point(0, 0)).scale(1 / points.length);
  };

  Point.random = function() {
    return Point.fromAngle(Math.random() * 2 * Math.PI);
  };

  module.exports = Point;

  isObject = function(object) {
    return Object.prototype.toString.call(object) === "[object Object]";
  };

}).call(this);

//# sourceURL=point.coffee;

  return module.exports;
},"test/test":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Point, TAU, equals, ok;

  Point = require("../point");

  ok = assert;

  equals = assert.equal;

  TAU = 2 * Math.PI;

  describe("Point", function() {
    var TOLERANCE, equalEnough;
    TOLERANCE = 0.00001;
    equalEnough = function(expected, actual, tolerance, message) {
      message || (message = "" + expected + " within " + tolerance + " of " + actual);
      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);
    };
    it("copy constructor", function() {
      var p, p2;
      p = Point(3, 7);
      p2 = Point(p);
      equals(p2.x, p.x);
      return equals(p2.y, p.y);
    });
    it("#add", function() {
      var p1, p2, result;
      p1 = Point(5, 6);
      p2 = Point(7, 5);
      result = p1.add(p2);
      equals(result.x, p1.x + p2.x);
      equals(result.y, p1.y + p2.y);
      equals(p1.x, 5);
      equals(p1.y, 6);
      equals(p2.x, 7);
      return equals(p2.y, 5);
    });
    it("#add with two arguments", function() {
      var point, result, x, y;
      point = Point(3, 7);
      x = 2;
      y = 1;
      result = point.add(x, y);
      equals(result.x, point.x + x);
      equals(result.y, point.y + y);
      x = 2;
      y = 0;
      result = point.add(x, y);
      equals(result.x, point.x + x);
      return equals(result.y, point.y + y);
    });
    it("#add existing", function() {
      var p;
      p = Point(0, 0);
      p.add(Point(3, 5));
      equals(p.x, 0);
      return equals(p.y, 0);
    });
    it("#subtract", function() {
      var p1, p2, result;
      p1 = Point(5, 6);
      p2 = Point(7, 5);
      result = p1.subtract(p2);
      equals(result.x, p1.x - p2.x);
      return equals(result.y, p1.y - p2.y);
    });
    it("#subtract existing", function() {
      var p;
      p = Point(8, 6);
      p.subtract(3, 4);
      equals(p.x, 8);
      return equals(p.y, 6);
    });
    it("#norm", function() {
      var normal, p;
      p = Point(2, 0);
      normal = p.norm();
      equals(normal.x, 1);
      normal = p.norm(5);
      equals(normal.x, 5);
      p = Point(0, 0);
      normal = p.norm();
      equals(normal.x, 0, "x value of norm of point(0,0) is 0");
      return equals(normal.y, 0, "y value of norm of point(0,0) is 0");
    });
    it("#norm existing", function() {
      var p;
      p = Point(6, 8);
      p.norm(5);
      equals(p.x, 6);
      return equals(p.y, 8);
    });
    it("#scale", function() {
      var p, result, scalar;
      p = Point(5, 6);
      scalar = 2;
      result = p.scale(scalar);
      equals(result.x, p.x * scalar);
      equals(result.y, p.y * scalar);
      equals(p.x, 5);
      return equals(p.y, 6);
    });
    it("#scale existing", function() {
      var p, scalar;
      p = Point(0, 1);
      scalar = 3;
      p.scale(scalar);
      equals(p.x, 0);
      return equals(p.y, 1);
    });
    it("#equal", function() {
      return ok(Point(7, 8).equal(Point(7, 8)));
    });
    it("#magnitude", function() {
      return equals(Point(3, 4).magnitude(), 5);
    });
    it("#length", function() {
      equals(Point(0, 0).length(), 0);
      return equals(Point(-1, 0).length(), 1);
    });
    it("#toString", function() {
      var p;
      p = Point(7, 5);
      return ok(eval(p.toString()).equal(p));
    });
    it("#clamp", function() {
      var p, p2;
      p = Point(10, 10);
      p2 = p.clamp(5);
      return equals(p2.length(), 5);
    });
    it(".centroid", function() {
      var centroid;
      centroid = Point.centroid(Point(0, 0), Point(10, 10), Point(10, 0), Point(0, 10));
      equals(centroid.x, 5);
      return equals(centroid.y, 5);
    });
    it(".fromAngle", function() {
      var p;
      p = Point.fromAngle(TAU / 4);
      equalEnough(p.x, 0, TOLERANCE);
      return equals(p.y, 1);
    });
    it(".random", function() {
      var p;
      p = Point.random();
      return ok(p);
    });
    return it(".interpolate", function() {
      var p1, p2;
      p1 = Point(10, 7);
      p2 = Point(-6, 29);
      ok(p1.equal(Point.interpolate(p1, p2, 0)));
      return ok(p2.equal(Point.interpolate(p1, p2, 1)));
    });
  });

}).call(this);

//# sourceURL=test/test.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"point","repository":{"id":13484982,"name":"point","full_name":"distri/point","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/point","description":"JavaScript Point implementation","fork":false,"url":"https://api.github.com/repos/distri/point","forks_url":"https://api.github.com/repos/distri/point/forks","keys_url":"https://api.github.com/repos/distri/point/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/point/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/point/teams","hooks_url":"https://api.github.com/repos/distri/point/hooks","issue_events_url":"https://api.github.com/repos/distri/point/issues/events{/number}","events_url":"https://api.github.com/repos/distri/point/events","assignees_url":"https://api.github.com/repos/distri/point/assignees{/user}","branches_url":"https://api.github.com/repos/distri/point/branches{/branch}","tags_url":"https://api.github.com/repos/distri/point/tags","blobs_url":"https://api.github.com/repos/distri/point/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/point/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/point/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/point/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/point/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/point/languages","stargazers_url":"https://api.github.com/repos/distri/point/stargazers","contributors_url":"https://api.github.com/repos/distri/point/contributors","subscribers_url":"https://api.github.com/repos/distri/point/subscribers","subscription_url":"https://api.github.com/repos/distri/point/subscription","commits_url":"https://api.github.com/repos/distri/point/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/point/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/point/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/point/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/point/contents/{+path}","compare_url":"https://api.github.com/repos/distri/point/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/point/merges","archive_url":"https://api.github.com/repos/distri/point/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/point/downloads","issues_url":"https://api.github.com/repos/distri/point/issues{/number}","pulls_url":"https://api.github.com/repos/distri/point/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/point/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/point/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/point/labels{/name}","releases_url":"https://api.github.com/repos/distri/point/releases{/id}","created_at":"2013-10-10T22:59:27Z","updated_at":"2013-12-23T23:33:20Z","pushed_at":"2013-10-15T00:22:04Z","git_url":"git://github.com/distri/point.git","ssh_url":"git@github.com:distri/point.git","clone_url":"https://github.com/distri/point.git","svn_url":"https://github.com/distri/point","homepage":null,"size":836,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{}},"matrix":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"matrix\n======\n\nWhere matrices become heroes, together.\n","type":"blob"},"matrix.coffee.md":{"path":"matrix.coffee.md","mode":"100644","content":"Matrix\n======\n\n```\n   _        _\n  | a  c tx  |\n  | b  d ty  |\n  |_0  0  1 _|\n```\n\nCreates a matrix for 2d affine transformations.\n\n`concat`, `inverse`, `rotate`, `scale` and `translate` return new matrices with\nthe transformations applied. The matrix is not modified in place.\n\nReturns the identity matrix when called with no arguments.\n\n    Matrix = (a, b, c, d, tx, ty) ->\n      if isObject(a)\n        {a, b, c, d, tx, ty} = a\n\n      __proto__: Matrix.prototype\n      a: a ? 1\n      b: b ? 0\n      c: c ? 0\n      d: d ? 1\n      tx: tx ? 0\n      ty: ty ? 0\n\nA `Point` constructor for the methods that return points. This can be overridden\nwith a compatible constructor if you want fancier points.\n\n    Matrix.Point = require \"./point\"\n\n    Matrix.prototype =\n\n`concat` returns the result of this matrix multiplied by another matrix\ncombining the geometric effects of the two. In mathematical terms,\nconcatenating two matrixes is the same as combining them using matrix multiplication.\nIf this matrix is A and the matrix passed in is B, the resulting matrix is A x B\nhttp://mathworld.wolfram.com/MatrixMultiplication.html\n\n      concat: (matrix) ->\n        Matrix(\n          @a * matrix.a + @c * matrix.b,\n          @b * matrix.a + @d * matrix.b,\n          @a * matrix.c + @c * matrix.d,\n          @b * matrix.c + @d * matrix.d,\n          @a * matrix.tx + @c * matrix.ty + @tx,\n          @b * matrix.tx + @d * matrix.ty + @ty\n        )\n\n\nReturn a new matrix that is a `copy` of this matrix.\n\n      copy: ->\n        Matrix(@a, @b, @c, @d, @tx, @ty)\n\nGiven a point in the pretransform coordinate space, returns the coordinates of\nthat point after the transformation occurs. Unlike the standard transformation\napplied using the transformPoint() method, the deltaTransformPoint() method\ndoes not consider the translation parameters tx and ty.\n\nReturns a new `Point` transformed by this matrix ignoring tx and ty.\n\n      deltaTransformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y,\n          @b * point.x + @d * point.y\n        )\n\nReturns a new matrix that is the inverse of this matrix.\nhttp://mathworld.wolfram.com/MatrixInverse.html\n\n      inverse: ->\n        determinant = @a * @d - @b * @c\n\n        Matrix(\n          @d / determinant,\n          -@b / determinant,\n          -@c / determinant,\n          @a / determinant,\n          (@c * @ty - @d * @tx) / determinant,\n          (@b * @tx - @a * @ty) / determinant\n        )\n\nReturns a new matrix that corresponds this matrix multiplied by a\na rotation matrix.\n\nThe first parameter `theta` is the amount to rotate in radians.\n\nThe second optional parameter, `aboutPoint` is the point about which the\nrotation occurs. Defaults to (0,0).\n\n      rotate: (theta, aboutPoint) ->\n        @concat(Matrix.rotation(theta, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na scaling matrix.\n\n      scale: (sx, sy, aboutPoint) ->\n        @concat(Matrix.scale(sx, sy, aboutPoint))\n\nReturns a new matrix that corresponds this matrix multiplied by a\na skewing matrix.\n\n      skew: (skewX, skewY) ->\n        @concat(Matrix.skew(skewX, skewY))\n\nReturns a string representation of this matrix.\n\n      toString: ->\n        \"Matrix(#{@a}, #{@b}, #{@c}, #{@d}, #{@tx}, #{@ty})\"\n\nReturns the result of applying the geometric transformation represented by the\nMatrix object to the specified point.\n\n      transformPoint: (point) ->\n        Matrix.Point(\n          @a * point.x + @c * point.y + @tx,\n          @b * point.x + @d * point.y + @ty\n        )\n\nTranslates the matrix along the x and y axes, as specified by the tx and ty parameters.\n\n      translate: (tx, ty) ->\n        @concat(Matrix.translation(tx, ty))\n\nCreates a matrix transformation that corresponds to the given rotation,\naround (0,0) or the specified point.\n\n    Matrix.rotate = Matrix.rotation = (theta, aboutPoint) ->\n      rotationMatrix = Matrix(\n        Math.cos(theta),\n        Math.sin(theta),\n        -Math.sin(theta),\n        Math.cos(theta)\n      )\n\n      if aboutPoint?\n        rotationMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            rotationMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return rotationMatrix\n\nReturns a matrix that corresponds to scaling by factors of sx, sy along\nthe x and y axis respectively.\n\nIf only one parameter is given the matrix is scaled uniformly along both axis.\n\nIf the optional aboutPoint parameter is given the scaling takes place\nabout the given point.\n\n    Matrix.scale = (sx, sy, aboutPoint) ->\n      sy = sy || sx\n\n      scaleMatrix = Matrix(sx, 0, 0, sy)\n\n      if aboutPoint\n        scaleMatrix =\n          Matrix.translation(aboutPoint.x, aboutPoint.y).concat(\n            scaleMatrix\n          ).concat(\n            Matrix.translation(-aboutPoint.x, -aboutPoint.y)\n          )\n\n      return scaleMatrix\n\n\nReturns a matrix that corresponds to a skew of skewX, skewY.\n\n    Matrix.skew = (skewX, skewY) ->\n      Matrix(0, Math.tan(skewY), Math.tan(skewX), 0)\n\nReturns a matrix that corresponds to a translation of tx, ty.\n\n    Matrix.translate = Matrix.translation = (tx, ty) ->\n      Matrix(1, 0, 0, 1, tx, ty)\n\nHelpers\n-------\n\n    isObject = (object) ->\n      Object.prototype.toString.call(object) is \"[object Object]\"\n\n    frozen = (object) ->\n      Object.freeze?(object)\n\n      return object\n\nConstants\n---------\n\nA constant representing the identity matrix.\n\n    Matrix.IDENTITY = frozen Matrix()\n\nA constant representing the horizontal flip transformation matrix.\n\n    Matrix.HORIZONTAL_FLIP = frozen Matrix(-1, 0, 0, 1)\n\nA constant representing the vertical flip transformation matrix.\n\n    Matrix.VERTICAL_FLIP = frozen Matrix(1, 0, 0, -1)\n\nExports\n-------\n\n    module.exports = Matrix\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.3.1\"\nentryPoint: \"matrix\"\n","type":"blob"},"test/matrix.coffee":{"path":"test/matrix.coffee","mode":"100644","content":"Matrix = require \"../matrix\"\nPoint = require \"../point\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Matrix\", ->\n\n  TOLERANCE = 0.00001\n  \n  equalEnough = (expected, actual, tolerance, message) ->\n    message ||= \"\" + expected + \" within \" + tolerance + \" of \" + actual\n    ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n  \n  matrixEqual = (m1, m2) ->\n    equalEnough(m1.a, m2.a, TOLERANCE)\n    equalEnough(m1.b, m2.b, TOLERANCE)\n    equalEnough(m1.c, m2.c, TOLERANCE)\n    equalEnough(m1.d, m2.d, TOLERANCE)\n    equalEnough(m1.tx, m2.tx, TOLERANCE)\n    equalEnough(m1.ty, m2.ty, TOLERANCE)\n  \n  test \"copy constructor\", ->\n   matrix = Matrix(1, 0, 0, 1, 10, 12)\n  \n   matrix2 = Matrix(matrix)\n  \n   ok matrix != matrix2\n   matrixEqual(matrix2, matrix)\n  \n  test \"Matrix() (Identity)\", ->\n    matrix = Matrix()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"Empty\", ->\n    matrix = Matrix(0, 0, 0, 0, 0, 0)\n  \n    equals(matrix.a, 0, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 0, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#copy\", ->\n    matrix = Matrix(2, 0, 0, 2)\n  \n    copyMatrix = matrix.copy()\n  \n    matrixEqual copyMatrix, matrix\n  \n    copyMatrix.a = 4\n  \n    equals copyMatrix.a, 4\n    equals matrix.a, 2, \"Old 'a' value is unchanged\"\n  \n  test \".scale\", ->\n    matrix = Matrix.scale(2, 2)\n  \n    equals(matrix.a, 2, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 2, \"d\")\n  \n    matrix = Matrix.scale(3)\n  \n    equals(matrix.a, 3, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 3, \"d\")\n  \n  test \".scale (about a point)\", ->\n    p = Point(5, 17)\n  \n    transformedPoint = Matrix.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#scale (about a point)\", ->\n    p = Point(3, 11)\n  \n    transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p)\n  \n    equals(transformedPoint.x, p.x, \"Point should remain the same\")\n    equals(transformedPoint.y, p.y, \"Point should remain the same\")\n  \n  test \"#skew\", ->\n    matrix = Matrix()\n\n    angle = 0.25 * Math.PI\n  \n    matrix = matrix.skew(angle, 0)\n  \n    equals matrix.c, Math.tan(angle)\n  \n  test \".rotation\", ->\n    matrix = Matrix.rotation(Math.PI / 2)\n  \n    equalEnough(matrix.a, 0, TOLERANCE)\n    equalEnough(matrix.b, 1, TOLERANCE)\n    equalEnough(matrix.c,-1, TOLERANCE)\n    equalEnough(matrix.d, 0, TOLERANCE)\n  \n  test \".rotation (about a point)\", ->\n    p = Point(11, 7)\n  \n    transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#rotate (about a point)\", ->\n    p = Point(8, 5);\n  \n    transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p)\n  \n    equals transformedPoint.x, p.x, \"Point should remain the same\"\n    equals transformedPoint.y, p.y, \"Point should remain the same\"\n  \n  test \"#inverse (Identity)\", ->\n    matrix = Matrix().inverse()\n  \n    equals(matrix.a, 1, \"a\")\n    equals(matrix.b, 0, \"b\")\n    equals(matrix.c, 0, \"c\")\n    equals(matrix.d, 1, \"d\")\n    equals(matrix.tx, 0, \"tx\")\n    equals(matrix.ty, 0, \"ty\")\n  \n  test \"#concat\", ->\n    matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2))\n  \n    matrixEqual(matrix, Matrix.IDENTITY)\n  \n  test \"#toString\", ->\n    matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5)\n    matrixEqual eval(matrix.toString()), matrix\n  \n  test \"Maths\", ->\n    a = Matrix(12, 3, 3, 1, 7, 9)\n    b = Matrix(3, 8, 3, 2, 1, 5)\n  \n    c = a.concat(b)\n  \n    equals(c.a, 60)\n    equals(c.b, 17)\n    equals(c.c, 42)\n    equals(c.d, 11)\n    equals(c.tx, 34)\n    equals(c.ty, 17)\n  \n  test \"Order of transformations should match manual concat\", ->\n    tx = 10\n    ty = 5\n    theta = Math.PI/3\n    s = 2\n  \n    m1 = Matrix().translate(tx, ty).scale(s).rotate(theta)\n    m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta))\n  \n    matrixEqual(m1, m2)\n  \n  test \"IDENTITY is immutable\", ->\n    identity = Matrix.IDENTITY\n  \n    identity.a = 5\n  \n    equals identity.a, 1\n","type":"blob"},"point.coffee.md":{"path":"point.coffee.md","mode":"100644","content":"Point\n=====\n\nA very simple Point object constructor.\n\n    module.exports = (x, y) ->\n      x: x\n      y: y\n","type":"blob"}},"distribution":{"matrix":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Matrix, frozen, isObject;

  Matrix = function(a, b, c, d, tx, ty) {
    var _ref;
    if (isObject(a)) {
      _ref = a, a = _ref.a, b = _ref.b, c = _ref.c, d = _ref.d, tx = _ref.tx, ty = _ref.ty;
    }
    return {
      __proto__: Matrix.prototype,
      a: a != null ? a : 1,
      b: b != null ? b : 0,
      c: c != null ? c : 0,
      d: d != null ? d : 1,
      tx: tx != null ? tx : 0,
      ty: ty != null ? ty : 0
    };
  };

  Matrix.Point = require("./point");

  Matrix.prototype = {
    concat: function(matrix) {
      return Matrix(this.a * matrix.a + this.c * matrix.b, this.b * matrix.a + this.d * matrix.b, this.a * matrix.c + this.c * matrix.d, this.b * matrix.c + this.d * matrix.d, this.a * matrix.tx + this.c * matrix.ty + this.tx, this.b * matrix.tx + this.d * matrix.ty + this.ty);
    },
    copy: function() {
      return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    deltaTransformPoint: function(point) {
      return Matrix.Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y);
    },
    inverse: function() {
      var determinant;
      determinant = this.a * this.d - this.b * this.c;
      return Matrix(this.d / determinant, -this.b / determinant, -this.c / determinant, this.a / determinant, (this.c * this.ty - this.d * this.tx) / determinant, (this.b * this.tx - this.a * this.ty) / determinant);
    },
    rotate: function(theta, aboutPoint) {
      return this.concat(Matrix.rotation(theta, aboutPoint));
    },
    scale: function(sx, sy, aboutPoint) {
      return this.concat(Matrix.scale(sx, sy, aboutPoint));
    },
    skew: function(skewX, skewY) {
      return this.concat(Matrix.skew(skewX, skewY));
    },
    toString: function() {
      return "Matrix(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
    },
    transformPoint: function(point) {
      return Matrix.Point(this.a * point.x + this.c * point.y + this.tx, this.b * point.x + this.d * point.y + this.ty);
    },
    translate: function(tx, ty) {
      return this.concat(Matrix.translation(tx, ty));
    }
  };

  Matrix.rotate = Matrix.rotation = function(theta, aboutPoint) {
    var rotationMatrix;
    rotationMatrix = Matrix(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta));
    if (aboutPoint != null) {
      rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(rotationMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
    }
    return rotationMatrix;
  };

  Matrix.scale = function(sx, sy, aboutPoint) {
    var scaleMatrix;
    sy = sy || sx;
    scaleMatrix = Matrix(sx, 0, 0, sy);
    if (aboutPoint) {
      scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(scaleMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
    }
    return scaleMatrix;
  };

  Matrix.skew = function(skewX, skewY) {
    return Matrix(0, Math.tan(skewY), Math.tan(skewX), 0);
  };

  Matrix.translate = Matrix.translation = function(tx, ty) {
    return Matrix(1, 0, 0, 1, tx, ty);
  };

  isObject = function(object) {
    return Object.prototype.toString.call(object) === "[object Object]";
  };

  frozen = function(object) {
    if (typeof Object.freeze === "function") {
      Object.freeze(object);
    }
    return object;
  };

  Matrix.IDENTITY = frozen(Matrix());

  Matrix.HORIZONTAL_FLIP = frozen(Matrix(-1, 0, 0, 1));

  Matrix.VERTICAL_FLIP = frozen(Matrix(1, 0, 0, -1));

  module.exports = Matrix;

}).call(this);

//# sourceURL=matrix.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.3.1","entryPoint":"matrix"};;

  return module.exports;
},"test/matrix":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Matrix, Point, equals, ok, test;

  Matrix = require("../matrix");

  Point = require("../point");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Matrix", function() {
    var TOLERANCE, equalEnough, matrixEqual;
    TOLERANCE = 0.00001;
    equalEnough = function(expected, actual, tolerance, message) {
      message || (message = "" + expected + " within " + tolerance + " of " + actual);
      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);
    };
    matrixEqual = function(m1, m2) {
      equalEnough(m1.a, m2.a, TOLERANCE);
      equalEnough(m1.b, m2.b, TOLERANCE);
      equalEnough(m1.c, m2.c, TOLERANCE);
      equalEnough(m1.d, m2.d, TOLERANCE);
      equalEnough(m1.tx, m2.tx, TOLERANCE);
      return equalEnough(m1.ty, m2.ty, TOLERANCE);
    };
    test("copy constructor", function() {
      var matrix, matrix2;
      matrix = Matrix(1, 0, 0, 1, 10, 12);
      matrix2 = Matrix(matrix);
      ok(matrix !== matrix2);
      return matrixEqual(matrix2, matrix);
    });
    test("Matrix() (Identity)", function() {
      var matrix;
      matrix = Matrix();
      equals(matrix.a, 1, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 1, "d");
      equals(matrix.tx, 0, "tx");
      equals(matrix.ty, 0, "ty");
      return matrixEqual(matrix, Matrix.IDENTITY);
    });
    test("Empty", function() {
      var matrix;
      matrix = Matrix(0, 0, 0, 0, 0, 0);
      equals(matrix.a, 0, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 0, "d");
      equals(matrix.tx, 0, "tx");
      return equals(matrix.ty, 0, "ty");
    });
    test("#copy", function() {
      var copyMatrix, matrix;
      matrix = Matrix(2, 0, 0, 2);
      copyMatrix = matrix.copy();
      matrixEqual(copyMatrix, matrix);
      copyMatrix.a = 4;
      equals(copyMatrix.a, 4);
      return equals(matrix.a, 2, "Old 'a' value is unchanged");
    });
    test(".scale", function() {
      var matrix;
      matrix = Matrix.scale(2, 2);
      equals(matrix.a, 2, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 2, "d");
      matrix = Matrix.scale(3);
      equals(matrix.a, 3, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      return equals(matrix.d, 3, "d");
    });
    test(".scale (about a point)", function() {
      var p, transformedPoint;
      p = Point(5, 17);
      transformedPoint = Matrix.scale(3, 7, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#scale (about a point)", function() {
      var p, transformedPoint;
      p = Point(3, 11);
      transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#skew", function() {
      var angle, matrix;
      matrix = Matrix();
      angle = 0.25 * Math.PI;
      matrix = matrix.skew(angle, 0);
      return equals(matrix.c, Math.tan(angle));
    });
    test(".rotation", function() {
      var matrix;
      matrix = Matrix.rotation(Math.PI / 2);
      equalEnough(matrix.a, 0, TOLERANCE);
      equalEnough(matrix.b, 1, TOLERANCE);
      equalEnough(matrix.c, -1, TOLERANCE);
      return equalEnough(matrix.d, 0, TOLERANCE);
    });
    test(".rotation (about a point)", function() {
      var p, transformedPoint;
      p = Point(11, 7);
      transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#rotate (about a point)", function() {
      var p, transformedPoint;
      p = Point(8, 5);
      transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#inverse (Identity)", function() {
      var matrix;
      matrix = Matrix().inverse();
      equals(matrix.a, 1, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 1, "d");
      equals(matrix.tx, 0, "tx");
      return equals(matrix.ty, 0, "ty");
    });
    test("#concat", function() {
      var matrix;
      matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2));
      return matrixEqual(matrix, Matrix.IDENTITY);
    });
    test("#toString", function() {
      var matrix;
      matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5);
      return matrixEqual(eval(matrix.toString()), matrix);
    });
    test("Maths", function() {
      var a, b, c;
      a = Matrix(12, 3, 3, 1, 7, 9);
      b = Matrix(3, 8, 3, 2, 1, 5);
      c = a.concat(b);
      equals(c.a, 60);
      equals(c.b, 17);
      equals(c.c, 42);
      equals(c.d, 11);
      equals(c.tx, 34);
      return equals(c.ty, 17);
    });
    test("Order of transformations should match manual concat", function() {
      var m1, m2, s, theta, tx, ty;
      tx = 10;
      ty = 5;
      theta = Math.PI / 3;
      s = 2;
      m1 = Matrix().translate(tx, ty).scale(s).rotate(theta);
      m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta));
      return matrixEqual(m1, m2);
    });
    return test("IDENTITY is immutable", function() {
      var identity;
      identity = Matrix.IDENTITY;
      identity.a = 5;
      return equals(identity.a, 1);
    });
  });

}).call(this);

//# sourceURL=test/matrix.coffee;

  return module.exports;
},"point":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(x, y) {
    return {
      x: x,
      y: y
    };
  };

}).call(this);

//# sourceURL=point.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.3.1","entryPoint":"matrix","repository":{"id":13551996,"name":"matrix","full_name":"distri/matrix","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/matrix","description":"Where matrices become heroes, together.","fork":false,"url":"https://api.github.com/repos/distri/matrix","forks_url":"https://api.github.com/repos/distri/matrix/forks","keys_url":"https://api.github.com/repos/distri/matrix/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/matrix/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/matrix/teams","hooks_url":"https://api.github.com/repos/distri/matrix/hooks","issue_events_url":"https://api.github.com/repos/distri/matrix/issues/events{/number}","events_url":"https://api.github.com/repos/distri/matrix/events","assignees_url":"https://api.github.com/repos/distri/matrix/assignees{/user}","branches_url":"https://api.github.com/repos/distri/matrix/branches{/branch}","tags_url":"https://api.github.com/repos/distri/matrix/tags","blobs_url":"https://api.github.com/repos/distri/matrix/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/matrix/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/matrix/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/matrix/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/matrix/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/matrix/languages","stargazers_url":"https://api.github.com/repos/distri/matrix/stargazers","contributors_url":"https://api.github.com/repos/distri/matrix/contributors","subscribers_url":"https://api.github.com/repos/distri/matrix/subscribers","subscription_url":"https://api.github.com/repos/distri/matrix/subscription","commits_url":"https://api.github.com/repos/distri/matrix/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/matrix/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/matrix/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/matrix/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/matrix/contents/{+path}","compare_url":"https://api.github.com/repos/distri/matrix/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/matrix/merges","archive_url":"https://api.github.com/repos/distri/matrix/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/matrix/downloads","issues_url":"https://api.github.com/repos/distri/matrix/issues{/number}","pulls_url":"https://api.github.com/repos/distri/matrix/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/matrix/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/matrix/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/matrix/labels{/name}","releases_url":"https://api.github.com/repos/distri/matrix/releases{/id}","created_at":"2013-10-14T03:46:16Z","updated_at":"2013-12-23T23:45:28Z","pushed_at":"2013-10-15T00:22:51Z","git_url":"git://github.com/distri/matrix.git","ssh_url":"git@github.com:distri/matrix.git","clone_url":"https://github.com/distri/matrix.git","svn_url":"https://github.com/distri/matrix","homepage":null,"size":580,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.3.1","defaultBranch":"master"},"dependencies":{}},"random":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"random\n======\n\nRandom generation.\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nentryPoint: \"random\"\n","type":"blob"},"random.coffee.md":{"path":"random.coffee.md","mode":"100644","content":"Random\n======\n\nSome useful methods for generating random things.\n\nHelpers\n-------\n\n`τ` is the circle constant.\n\n    τ = 2 * Math.PI\n\n`U` returns a continuous uniform distribution between `min` and `max`.\n\n    U = (min, max) ->\n      ->\n        Math.random() * (max - min) + min\n\n`standardUniformDistribution` is the uniform distribution between [0, 1]\n\n    standardUniformDistribution = U(0, 1)\n\n`rand` is a helpful shortcut for generating random numbers from a standard\nuniform distribution or from a discreet set of integers.\n\n    rand = (n) ->\n      if n\n        Math.floor(n * standardUniformDistribution())\n      else\n        standardUniformDistribution()\n\nMethods\n-------\n\n    module.exports = Random =\n\nReturns a random angle, uniformly distributed, between 0 and τ.\n\n      angle: ->\n        rand() * τ\n\nA binomial distribution.\n\n      binomial: (n=1, p=0.5) ->\n        [0...n].map ->\n          if rand() < p\n            1\n          else\n            0\n        .reduce (a, b) ->\n          a + b\n        , 0\n\nReturns a random float between two numbers.\n\n      between: (min, max) ->\n        rand() * (max - min) + min\n\nReturns random integers from [0, n) if n is given.\nOtherwise returns random float between 0 and 1.\n\n      rand: rand\n\nReturns random float from [-n / 2, n / 2] if n is given.\nOtherwise returns random float between -0.5 and 0.5.\n\n      signed: (n=1) ->\n        (n * rand()) - (n / 2)\n","type":"blob"},"test/random.coffee":{"path":"test/random.coffee","mode":"100644","content":"Random = require \"../random\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Random\", ->\n  \n  test \"methods\", ->\n    [\n      \"angle\"\n      \"binomial\"\n      \"between\"\n      \"rand\"\n      \"signed\"\n    ].forEach (name) ->\n      ok(Random[name], name)\n\n  it \"should have binomial\", ->\n    result = Random.binomial()\n\n    assert result is 1 or result is 0\n","type":"blob"}},"distribution":{"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"random"};;

  return module.exports;
},"random":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Random, U, rand, standardUniformDistribution, τ;

  τ = 2 * Math.PI;

  U = function(min, max) {
    return function() {
      return Math.random() * (max - min) + min;
    };
  };

  standardUniformDistribution = U(0, 1);

  rand = function(n) {
    if (n) {
      return Math.floor(n * standardUniformDistribution());
    } else {
      return standardUniformDistribution();
    }
  };

  module.exports = Random = {
    angle: function() {
      return rand() * τ;
    },
    binomial: function(n, p) {
      var _i, _results;
      if (n == null) {
        n = 1;
      }
      if (p == null) {
        p = 0.5;
      }
      return (function() {
        _results = [];
        for (var _i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function() {
        if (rand() < p) {
          return 1;
        } else {
          return 0;
        }
      }).reduce(function(a, b) {
        return a + b;
      }, 0);
    },
    between: function(min, max) {
      return rand() * (max - min) + min;
    },
    rand: rand,
    signed: function(n) {
      if (n == null) {
        n = 1;
      }
      return (n * rand()) - (n / 2);
    }
  };

}).call(this);

//# sourceURL=random.coffee;

  return module.exports;
},"test/random":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Random, equals, ok, test;

  Random = require("../random");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Random", function() {
    test("methods", function() {
      return ["angle", "binomial", "between", "rand", "signed"].forEach(function(name) {
        return ok(Random[name], name);
      });
    });
    return it("should have binomial", function() {
      var result;
      result = Random.binomial();
      return assert(result === 1 || result === 0);
    });
  });

}).call(this);

//# sourceURL=test/random.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"random","repository":{"id":13576812,"name":"random","full_name":"distri/random","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/random","description":"Random generation.","fork":false,"url":"https://api.github.com/repos/distri/random","forks_url":"https://api.github.com/repos/distri/random/forks","keys_url":"https://api.github.com/repos/distri/random/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/random/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/random/teams","hooks_url":"https://api.github.com/repos/distri/random/hooks","issue_events_url":"https://api.github.com/repos/distri/random/issues/events{/number}","events_url":"https://api.github.com/repos/distri/random/events","assignees_url":"https://api.github.com/repos/distri/random/assignees{/user}","branches_url":"https://api.github.com/repos/distri/random/branches{/branch}","tags_url":"https://api.github.com/repos/distri/random/tags","blobs_url":"https://api.github.com/repos/distri/random/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/random/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/random/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/random/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/random/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/random/languages","stargazers_url":"https://api.github.com/repos/distri/random/stargazers","contributors_url":"https://api.github.com/repos/distri/random/contributors","subscribers_url":"https://api.github.com/repos/distri/random/subscribers","subscription_url":"https://api.github.com/repos/distri/random/subscription","commits_url":"https://api.github.com/repos/distri/random/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/random/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/random/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/random/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/random/contents/{+path}","compare_url":"https://api.github.com/repos/distri/random/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/random/merges","archive_url":"https://api.github.com/repos/distri/random/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/random/downloads","issues_url":"https://api.github.com/repos/distri/random/issues{/number}","pulls_url":"https://api.github.com/repos/distri/random/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/random/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/random/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/random/labels{/name}","releases_url":"https://api.github.com/repos/distri/random/releases{/id}","created_at":"2013-10-15T00:28:31Z","updated_at":"2013-12-06T23:31:24Z","pushed_at":"2013-10-15T01:01:00Z","git_url":"git://github.com/distri/random.git","ssh_url":"git@github.com:distri/random.git","clone_url":"https://github.com/distri/random.git","svn_url":"https://github.com/distri/random","homepage":null,"size":292,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{}}}},"extensions":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"Extensions\n==========\n\nExtend built-in prototypes with helpful methods.\n","type":"blob"},"array.coffee.md":{"path":"array.coffee.md","mode":"100644","content":"Array\n=====\n\n    {extend} = require \"./util\"\n\n    extend Array.prototype,\n\nCalculate the average value of an array. Returns undefined if some elements\nare not numbers.\n\n      average: ->\n        @sum()/@length\n\n>     #! example\n>     [1, 3, 5, 7].average()\n\n----\n\nReturns a copy of the array without null and undefined values.\n\n      compact: ->\n        @select (element) ->\n          element?\n\n>     #! example\n>     [null, undefined, 3, 3, undefined, 5].compact()\n\n----\n\nCreates and returns a copy of the array. The copy contains\nthe same objects.\n\n      copy: ->\n        @concat()\n\n>     #! example\n>     a = [\"a\", \"b\", \"c\"]\n>     b = a.copy()\n>\n>     # their elements are equal\n>     a[0] == b[0] && a[1] == b[1] && a[2] == b[2]\n>     # => true\n>\n>     # but they aren't the same object in memory\n>     a is b\n>     # => false\n\n----\n\nEmpties the array of its contents. It is modified in place.\n\n      clear: ->\n        @length = 0\n\n        return this\n\n>     #! example\n>     fullArray = [1, 2, 3]\n>     fullArray.clear()\n>     fullArray\n\n----\n\nFlatten out an array of arrays into a single array of elements.\n\n      flatten: ->\n        @inject [], (a, b) ->\n          a.concat b\n\n>     #! example\n>     [[1, 2], [3, 4], 5].flatten()\n>     # => [1, 2, 3, 4, 5]\n>\n>     # won't flatten twice nested arrays. call\n>     # flatten twice if that is what you want\n>     [[1, 2], [3, [4, 5]], 6].flatten()\n>     # => [1, 2, 3, [4, 5], 6]\n\n----\n\nInvoke the named method on each element in the array\nand return a new array containing the results of the invocation.\n\n      invoke: (method, args...) ->\n        @map (element) ->\n          element[method].apply(element, args)\n\n>     #! example\n>     [1.1, 2.2, 3.3, 4.4].invoke(\"floor\")\n\n----\n\n>     #! example\n>     ['hello', 'world', 'cool!'].invoke('substring', 0, 3)\n\n----\n\nRandomly select an element from the array.\n\n      rand: ->\n        @[rand(@length)]\n\n>     #! example\n>     [1, 2, 3].rand()\n\n----\n\nRemove the first occurrence of the given object from the array if it is\npresent. The array is modified in place.\n\n      remove: (object) ->\n        index = @indexOf(object)\n\n        if index >= 0\n          @splice(index, 1)[0]\n        else\n          undefined\n\n>     #! example\n>     a = [1, 1, \"a\", \"b\"]\n>     a.remove(1)\n>     a\n\n----\n\nReturns true if the element is present in the array.\n\n      include: (element) ->\n        @indexOf(element) != -1\n\n>     #! example\n>     [\"a\", \"b\", \"c\"].include(\"c\")\n\n----\n\nCall the given iterator once for each element in the array,\npassing in the element as the first argument, the index of\nthe element as the second argument, and this array as the\nthird argument.\n\n      each: (iterator, context) ->\n        if @forEach\n          @forEach iterator, context\n        else\n          for element, i in this\n            iterator.call context, element, i, this\n\n        return this\n\n>     #! example\n>     word = \"\"\n>     indices = []\n>     [\"r\", \"a\", \"d\"].each (letter, index) ->\n>       word += letter\n>       indices.push(index)\n>\n>     # => [\"r\", \"a\", \"d\"]\n>\n>     word\n>     # => \"rad\"\n>\n>     indices\n\n----\n\nCall the given iterator once for each pair of objects in the array.\n\n      eachPair: (iterator, context) ->\n        length = @length\n        i = 0\n        while i < length\n          a = @[i]\n          j = i + 1\n          i += 1\n\n          while j < length\n            b = @[j]\n            j += 1\n\n            iterator.call context, a, b\n\n>     #! example\n>     results = []\n>     [1, 2, 3, 4].eachPair (a, b) ->\n>       results.push [a, b]\n>\n>     results\n\n----\n\nCall the given iterator once for each element in the array,\npassing in the element as the first argument and the given object\nas the second argument. Additional arguments are passed similar to\n`each`.\n\n      eachWithObject: (object, iterator, context) ->\n        @each (element, i, self) ->\n          iterator.call context, element, object, i, self\n\n        return object\n\nCall the given iterator once for each group of elements in the array,\npassing in the elements in groups of n. Additional arguments are\npassed as in `each`.\n\n      eachSlice: (n, iterator, context) ->\n        len = @length / n\n        i = -1\n\n        while ++i < len\n          iterator.call(context, @slice(i*n, (i+1)*n), i*n, this)\n\n        return this\n\n>     #! example\n>     results = []\n>     [1, 2, 3, 4].eachSlice 2, (slice) ->\n>       results.push(slice)\n>\n>     results\n\n----\n\nPipe the input through each function in the array in turn. For example, if you have a\nlist of objects you can perform a series of selection, sorting, and other processing\nmethods and then receive the processed list. This array must contain functions that\naccept a single input and return the processed input. The output of the first function\nis fed to the input of the second and so on until the final processed output is returned.\n\n      pipeline: (input) ->\n        @inject input, (input, fn) ->\n          fn(input)\n\nReturns a new array with the elements all shuffled up.\n\n      shuffle: ->\n        shuffledArray = []\n\n        @each (element) ->\n          shuffledArray.splice(rand(shuffledArray.length + 1), 0, element)\n\n        return shuffledArray\n\n>     #! example\n>     [0..9].shuffle()\n\n----\n\nReturns the first element of the array, undefined if the array is empty.\n\n      first: ->\n        @[0]\n\n>     #! example\n>     [\"first\", \"second\", \"third\"].first()\n\n----\n\nReturns the last element of the array, undefined if the array is empty.\n\n      last: ->\n        @[@length - 1]\n\n>     #! example\n>     [\"first\", \"second\", \"third\"].last()\n\n----\n\nReturns an object containing the extremes of this array.\n\n      extremes: (fn=identity) ->\n        min = max = undefined\n        minResult = maxResult = undefined\n\n        @each (object) ->\n          result = fn(object)\n\n          if min?\n            if result < minResult\n              min = object\n              minResult = result\n          else\n            min = object\n            minResult = result\n\n          if max?\n            if result > maxResult\n              max = object\n              maxResult = result\n          else\n            max = object\n            maxResult = result\n\n        min: min\n        max: max\n\n>     #! example\n>     [-1, 3, 0].extremes()\n\n----\n\n      maxima: (valueFunction=identity) ->\n        @inject([-Infinity, []], (memo, item) ->\n          value = valueFunction(item)\n          [maxValue, maxItems] = memo\n\n          if value > maxValue\n            [value, [item]]\n          else if value is maxValue\n            [value, maxItems.concat(item)]\n          else\n            memo\n        ).last()\n\n      maximum: (valueFunction) ->\n        @maxima(valueFunction).first()\n\n      minima: (valueFunction=identity) ->\n        inverseFn = (x) ->\n          -valueFunction(x)\n\n        @maxima(inverseFn)\n\n      minimum: (valueFunction) ->\n        @minima(valueFunction).first()\n\nPretend the array is a circle and grab a new array containing length elements.\nIf length is not given return the element at start, again assuming the array\nis a circle.\n\n      wrap: (start, length) ->\n        if length?\n          end = start + length\n          i = start\n          result = []\n\n          while i < end\n            result.push(@[mod(i, @length)])\n            i += 1\n\n          return result\n        else\n          return @[mod(start, @length)]\n\n>     #! example\n>     [1, 2, 3].wrap(-1)\n\n----\n\n>     #! example\n>     [1, 2, 3].wrap(6)\n\n----\n\n>     #! example\n>     [\"l\", \"o\", \"o\", \"p\"].wrap(0, 12)\n\n----\n\nPartitions the elements into two groups: those for which the iterator returns\ntrue, and those for which it returns false.\n\n      partition: (iterator, context) ->\n        trueCollection = []\n        falseCollection = []\n\n        @each (element) ->\n          if iterator.call(context, element)\n            trueCollection.push element\n          else\n            falseCollection.push element\n\n        return [trueCollection, falseCollection]\n\n>     #! example\n>     [0..9].partition (n) ->\n>       n % 2 is 0\n\n----\n\nReturn the group of elements for which the return value of the iterator is true.\n\n      select: (iterator, context) ->\n        return @partition(iterator, context)[0]\n\nReturn the group of elements that are not in the passed in set.\n\n      without: (values) ->\n        @reject (element) ->\n          values.include(element)\n\n>     #! example\n>     [1, 2, 3, 4].without [2, 3]\n\n----\n\nReturn the group of elements for which the return value of the iterator is false.\n\n      reject: (iterator, context) ->\n        @partition(iterator, context)[1]\n\nCombines all elements of the array by applying a binary operation.\nfor each element in the arra the iterator is passed an accumulator\nvalue (memo) and the element.\n\n      inject: (initial, iterator) ->\n        @each (element) ->\n          initial = iterator(initial, element)\n\n        return initial\n\nAdd all the elements in the array.\n\n      sum: ->\n        @inject 0, (sum, n) ->\n          sum + n\n\n>     #! example\n>     [1, 2, 3, 4].sum()\n\n----\n\nMultiply all the elements in the array.\n\n      product: ->\n        @inject 1, (product, n) ->\n          product * n\n\n>     #! example\n>     [1, 2, 3, 4].product()\n\n----\n\nProduce a duplicate-free version of the array.\n\n      unique: ->\n        @inject [], (results, element) ->\n          results.push element if results.indexOf(element) is -1\n\n          results\n\nMerges together the values of each of the arrays with the values at the corresponding position.\n\n      zip: (args...) ->\n        @map (element, index) ->\n          output = args.map (arr) ->\n            arr[index]\n\n          output.unshift(element)\n\n          return output\n\n>     #! example\n>     ['a', 'b', 'c'].zip([1, 2, 3])\n\n----\n\nHelpers\n-------\n\n    identity = (x) ->\n      x\n\n    rand = (n) ->\n      Math.floor n * Math.random()\n\n    mod = (n, base) ->\n      result = n % base\n\n      if result < 0 and base > 0\n        result += base\n\n      return result\n","type":"blob"},"extensions.coffee.md":{"path":"extensions.coffee.md","mode":"100644","content":"Extensions\n==========\n\nExtend built in prototypes with additional behavior.\n\n    require \"./array\"\n    require \"./function\"\n    require \"./number\"\n    require \"./string\"\n","type":"blob"},"function.coffee.md":{"path":"function.coffee.md","mode":"100644","content":"Function\n========\n\n    {extend} = require \"./util\"\n\nAdd our `Function` extensions.\n\n    extend Function.prototype,\n      once: ->\n        func = this\n\n        ran = false\n        memo = undefined\n\n        return ->\n          return memo if ran\n          ran = true\n\n          return memo = func.apply(this, arguments)\n\nCalling a debounced function will postpone its execution until after\nwait milliseconds have elapsed since the last time the function was\ninvoked. Useful for implementing behavior that should only happen after\nthe input has stopped arriving. For example: rendering a preview of a\nMarkdown comment, recalculating a layout after the window has stopped\nbeing resized...\n\n      debounce: (wait) ->\n        timeout = null\n        func = this\n\n        return ->\n          context = this\n          args = arguments\n\n          later = ->\n            timeout = null\n            func.apply(context, args)\n\n          clearTimeout(timeout)\n          timeout = setTimeout(later, wait)\n\n>     lazyLayout = calculateLayout.debounce(300)\n>     $(window).resize(lazyLayout)\n\n----\n\n      delay: (wait, args...) ->\n        func = this\n\n        setTimeout ->\n          func.apply(null, args)\n        , wait\n\n      defer: (args...) ->\n        this.delay.apply this, [1].concat(args)\n\n    extend Function,\n      identity: (x) ->\n        x\n\n      noop: ->\n","type":"blob"},"number.coffee.md":{"path":"number.coffee.md","mode":"100644","content":"Number\n======\n\nReturns the absolute value of this number.\n\n>     #! example\n>     (-4).abs()\n\nReturns the mathematical ceiling of this number. The number truncated to the\nnearest integer of greater than or equal value.\n\n>     #! example\n>     4.2.ceil()\n\n---\n\n>     #! example\n>     (-1.2).ceil()\n\n---\n\nReturns the mathematical floor of this number. The number truncated to the\nnearest integer of less than or equal value.\n\n>     #! example\n>     4.9.floor()\n\n---\n\n>     #! example\n>     (-1.2).floor()\n\n---\n\nReturns this number rounded to the nearest integer.\n\n>     #! example\n>     4.5.round()\n\n---\n\n>     #! example\n>     4.4.round()\n\n---\n\n    [\n      \"abs\"\n      \"ceil\"\n      \"floor\"\n      \"round\"\n    ].forEach (method) ->\n      Number::[method] = ->\n        Math[method](this)\n\n    {extend} = require \"./util\"\n\n    extend Number.prototype,\n\nGet a bunch of points equally spaced around the unit circle.\n\n      circularPoints: ->\n        n = this\n\n        [0..n].map (i) ->\n          Point.fromAngle (i/n).turns\n\n>     #! example\n>     4.circularPoints()\n\n---\n\nReturns a number whose value is limited to the given range.\n\n      clamp: (min, max) ->\n        if min? and max?\n          Math.min(Math.max(this, min), max)\n        else if min?\n          Math.max(this, min)\n        else if max?\n          Math.min(this, max)\n        else\n          this\n\n>     #! example\n>     512.clamp(0, 255)\n\n---\n\nA mod method useful for array wrapping. The range of the function is\nconstrained to remain in bounds of array indices.\n\n      mod: (base) ->\n        result = this % base;\n\n        if result < 0 && base > 0\n          result += base\n\n        return result\n\n>     #! example\n>     (-1).mod(5)\n\n---\n\nGet the sign of this number as an integer (1, -1, or 0).\n\n      sign: ->\n        if this > 0\n          1\n        else if this < 0\n          -1\n        else\n          0\n\n>     #! example\n>     5.sign()\n\n---\n\nReturns true if this number is even (evenly divisible by 2).\n\n      even: ->\n        @mod(2) is 0\n\n>     #! example\n>     2.even()\n\n---\n\nReturns true if this number is odd (has remainder of 1 when divided by 2).\n\n      odd: ->\n        @mod(2) is 1\n\n>     #! example\n>     3.odd()\n\n---\n\nCalls iterator the specified number of times, passing in the number of the\ncurrent iteration as a parameter: 0 on first call, 1 on the second call, etc.\n\n      times: (iterator, context) ->\n        i = -1\n\n        while ++i < this\n          iterator.call context, i\n\n        return i\n\n>     #! example\n>     output = []\n>\n>     5.times (n) ->\n>       output.push(n)\n>\n>     output\n\n---\n\nReturns the the nearest grid resolution less than or equal to the number.\n\n      snap: (resolution) ->\n        (n / resolution).floor() * resolution\n\n>     #! example\n>     7.snap(8)\n\n---\n\n      truncate: ->\n        if this > 0\n          @floor()\n        else if this < 0\n          @ceil()\n        else\n          this\n\nConvert a number to an amount of rotations.\n\n    unless 5.rotations\n      Object.defineProperty Number::, 'rotations',\n        get: ->\n          this * Math.TAU\n\n    unless 1.rotation\n      Object.defineProperty Number::, 'rotation',\n        get: ->\n          this * Math.TAU\n\n>     #! example\n>     0.5.rotations\n\n---\n\nConvert a number to an amount of rotations.\n\n    unless 5.turns\n      Object.defineProperty Number.prototype, 'turns',\n        get: ->\n          this * Math.TAU\n\n    unless 1.turn\n      Object.defineProperty Number.prototype, 'turn',\n        get: ->\n          this * Math.TAU\n\n>     #! example\n>     0.5.turns\n\n---\n\nConvert a number to an amount of degrees.\n\n    unless 2.degrees\n      Object.defineProperty Number::, 'degrees',\n        get: ->\n          this * Math.TAU / 360\n\n    unless 1.degree\n      Object.defineProperty Number::, 'degree',\n        get: ->\n          this * Math.TAU / 360\n\n>     #! example\n>     180.degrees\n\n---\n\nExtra\n-----\n\nThe mathematical circle constant of 1 turn.\n\n    Math.TAU = 2 * Math.PI\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nentryPoint: \"extensions\"\n","type":"blob"},"string.coffee.md":{"path":"string.coffee.md","mode":"100644","content":"String\n======\n\nExtend strings with utility methods.\n\n    {extend} = require \"./util\"\n\n    extend String.prototype,\n\nReturns true if this string only contains whitespace characters.\n\n      blank: ->\n        /^\\s*$/.test(this)\n\n>     #! example\n>     \"   \".blank()\n\n---\n\nParse this string as though it is JSON and return the object it represents. If it\nis not valid JSON returns the string itself.\n\n      parse: () ->\n        try\n          JSON.parse(this.toString())\n        catch e\n          this.toString()\n\n>     #! example\n>     # this is valid json, so an object is returned\n>     '{\"a\": 3}'.parse()\n\n---\n\nReturns true if this string starts with the given string.\n\n      startsWith: (str) ->\n        @lastIndexOf(str, 0) is 0\n\nReturns true if this string ends with the given string.\n\n      endsWith: (str) ->\n        @indexOf(str, @length - str.length) != -1\n\nGet the file extension of a string.\n\n      extension: ->\n        if extension = this.match(/\\.([^\\.]*)$/, '')?.last()\n          extension\n        else\n          ''\n\n>     #! example\n>     \"README.md\".extension()\n\n---\n\nAssumes the string is something like a file name and returns the\ncontents of the string without the extension.\n\n      withoutExtension: ->\n        this.replace(/\\.[^\\.]*$/, '')\n\n      toInt: (base=10) ->\n        parseInt(this, base)\n\n>     #! example\n>     \"neat.png\".witouthExtension()\n\n---\n","type":"blob"},"test/array.coffee":{"path":"test/array.coffee","mode":"100644","content":"require \"../array\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Array\", ->\n\n  test \"#average\", ->\n    equals [1, 3, 5, 7].average(), 4\n  \n  test \"#compact\", ->\n    a = [0, 1, undefined, 2, null, 3, '', 4]\n  \n    compacted = a.compact()\n  \n    equals(compacted[0], 0)\n    equals(compacted[1], 1)\n    equals(compacted[2], 2)\n    equals(compacted[3], 3)\n    equals(compacted[4], '')\n    equals(compacted[5], 4)\n  \n  test \"#copy\", ->\n    a = [1,2,3]\n    b = a.copy()\n  \n    ok a != b, \"Original array is not the same array as the copied one\"\n    ok a.length == b.length, \"Both arrays are the same size\"\n    ok a[0] == b[0] && a[1] == b[1] && a[2] == b[2], \"The elements of the two arrays are equal\"\n  \n  test \"#flatten\", ->\n    array = [[0,1], [2,3], [4,5]]\n  \n    flattenedArray = array.flatten()\n  \n    equals flattenedArray.length, 6, \"Flattened array length should equal number of elements in sub-arrays\"\n    equals flattenedArray.first(), 0, \"First element should be first element in first sub-array\"\n    equals flattenedArray.last(), 5, \"Last element should be last element in last sub-array\"\n  \n  test \"#rand\", ->\n    array = [1,2,3]\n  \n    ok array.indexOf(array.rand()) != -1, \"Array includes randomly selected element\"\n    ok [5].rand() == 5, \"[5].rand() === 5\"\n    ok [].rand() == undefined, \"[].rand() === undefined\"\n  \n  test \"#remove\", ->\n    equals [1,2,3].remove(2), 2, \"[1,2,3].remove(2) === 2\"\n    equals [1,3].remove(2), undefined, \"[1,3].remove(2) === undefined\"\n    equals [1,3].remove(3), 3, \"[1,3].remove(3) === 3\"\n  \n    array = [1,2,3]\n    array.remove(2)\n    ok array.length == 2, \"array = [1,2,3]; array.remove(2); array.length === 2\"\n    array.remove(3)\n    ok array.length == 1, \"array = [1,3]; array.remove(3); array.length === 1\"\n  \n  test \"#map\", ->\n    equals [1].map((x) -> return x + 1 )[0], 2\n  \n  test \"#invoke\", ->\n    results = ['hello', 'world', 'cool!'].invoke('substring', 0, 3)\n  \n    equals results[0], \"hel\"\n    equals results[1], \"wor\"\n    equals results[2], \"coo\"\n  \n  test \"#each\", ->\n    array = [1, 2, 3]\n    count = 0\n  \n    equals array, array.each -> count++\n    equals array.length, count\n  \n  test \"#eachPair\", ->\n    array = [1, 2, 3]\n    sum = 0\n  \n    array.eachPair (a, b) ->\n      sum += a + b\n  \n    equals(sum, 12)\n  \n  test \"#eachWithObject\", ->\n    array = [1, 2, 3]\n  \n    result = array.eachWithObject {}, (element, hash) ->\n      hash[element] = (element + 1).toString()\n  \n    equals result[1], \"2\"\n    equals result[2], \"3\"\n    equals result[3], \"4\"\n  \n  test \"#shuffle\", ->\n    array = [0, 1, 2, 3, 4, 5]\n  \n    shuffledArray = array.shuffle()\n  \n    shuffledArray.each (element) ->\n      ok array.indexOf(element) >= 0, \"Every element in shuffled array is in orig array\"\n  \n    array.each (element) ->\n      ok shuffledArray.indexOf(element) >= 0, \"Every element in orig array is in shuffled array\"\n  \n  test \"#first\", ->\n    equals [2].first(), 2\n    equals [1, 2, 3].first(), 1\n    equals [].first(), undefined\n  \n  test \"#last\", ->\n    equals [2].last(), 2\n    equals [1, 2, 3].last(), 3\n    equals [].first(), undefined\n  \n  test \"#maxima\", ->\n    maxima = [-52, 0, 78].maxima()\n  \n    maxima.each (n) ->\n      equals n, 78\n  \n    maxima = [0, 0, 1, 0, 1, 0, 1, 0].maxima()\n  \n    equals 3, maxima.length\n  \n    maxima.each (n) ->\n      equals n, 1\n  \n  test \"#maximum\", ->\n    equals [-345, 38, 8347].maximum(), 8347\n  \n  test \"#maximum with function\", ->\n    equals [3, 4, 5].maximum((n) ->\n      n % 4\n    ), 3\n  \n  test \"#minima\", ->\n    minima = [-52, 0, 78].minima()\n  \n    minima.each (n) ->\n      equals n, -52\n  \n    minima = [0, 0, 1, 0, 1, 0, 1, 0].minima()\n  \n    equals 5, minima.length\n  \n    minima.each (n) ->\n      equals n, 0\n  \n  test \"#minimum\", ->\n    equals [-345, 38, 8347].minimum(), -345\n  \n  test \"#pipeline\", ->\n    pipe = [\n      (x) -> x * x\n      (x) -> x - 10\n    ]\n  \n    equals pipe.pipeline(5), 15\n  \n  test \"#extremes\", ->\n    array = [-7, 1, 11, 94]\n  \n    extremes = array.extremes()\n  \n    equals extremes.min, -7, \"Min is -7\"\n    equals extremes.max, 94, \"Max is 94\"\n  \n  test \"#extremes with fn\", ->\n    array = [1, 11, 94]\n\n    extremes = array.extremes (value) ->\n      value % 11\n\n    equals extremes.min, 11, extremes.min\n    equals extremes.max, 94, extremes.max\n\n  test \"#sum\", ->\n    equals [].sum(), 0, \"Empty array sums to zero\"\n    equals [2].sum(), 2, \"[2] sums to 2\"\n    equals [1, 2, 3, 4, 5].sum(), 15, \"[1, 2, 3, 4, 5] sums to 15\"\n  \n  test \"#eachSlice\", ->\n    [1, 2, 3, 4, 5, 6].eachSlice 2, (array) ->\n      equals array[0] % 2, 1\n      equals array[1] % 2, 0\n  \n  test \"#without\", ->\n    array = [1, 2, 3, 4]\n  \n    excluded = array.without([2, 4])\n  \n    equals excluded[0], 1\n    equals excluded[1], 3\n  \n  test \"#clear\", ->\n    array = [1, 2, 3, 4]\n  \n    equals array.length, 4\n    equals array[0], 1\n  \n    array.clear()\n  \n    equals array.length, 0\n    equals array[0], undefined\n  \n  test \"#unique\", ->\n    array = [0, 0, 0, 1, 1, 1, 2, 3]\n  \n    equals array.unique().first(), 0\n    equals array.unique().last(), 3\n    equals array.unique().length, 4\n  \n  test \"#wrap\", ->\n    array = [0, 1, 2, 3, 4]\n  \n    equals array.wrap(0), 0\n    equals array.wrap(-1), 4\n    equals array.wrap(2), 2\n  \n  test \"#zip\", ->\n    a = [1, 2, 3]\n    b = [4, 5, 6]\n    c = [7, 8]\n  \n    output = a.zip(b, c)\n  \n    equals output[0][0], 1\n    equals output[0][1], 4\n    equals output[0][2], 7\n  \n    equals output[2][2], undefined\n","type":"blob"},"test/function.coffee":{"path":"test/function.coffee","mode":"100644","content":"require \"../function\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Function\", ->\n\n  test \"#once\", ->\n    score = 0\n  \n    addScore = ->\n      score += 100\n  \n    onceScore = addScore.once()\n  \n    [0..9].map ->\n      onceScore()\n  \n    equals score, 100\n  \n  test \".identity\", ->\n    I = Function.identity\n  \n    [0, 1, true, false, null, undefined].each (x) ->\n      equals I(x), x\n  \n  test \"#debounce\", (done) ->\n    fn = (-> ok true; done()).debounce(1)\n  \n    # Though called multiple times the function is only triggered once\n    fn()\n    fn()\n    fn()\n  \n  test \"#delay\", (done) ->\n    fn = (x, y) ->\n      equals x, 3\n      equals y, \"testy\"\n      done()\n  \n    fn.delay 25, 3, \"testy\"\n  \n  test \"#defer\", (done) ->\n    fn = (x) ->\n      equals x, 3\n      done()\n  \n    fn.defer 3\n","type":"blob"},"test/number.coffee":{"path":"test/number.coffee","mode":"100644","content":"require \"../number\"\n\nok = assert\nequals = assert.equal\ntest = it\n\nequalEnough = (expected, actual, tolerance, message) ->\n  message ||= \"#{expected} within #{tolerance} of #{actual}\"\n\n  ok(expected + tolerance >= actual && expected - tolerance <= actual, message)\n  \ndescribe \"Number\", ->\n  \n  test \"#abs\", ->\n    equals 5.abs(), 5, \"(5).abs() equals 5\"\n    equals 4.2.abs(), 4.2, \"(4.2).abs() equals 4.2\"\n    equals (-1.2).abs(), 1.2, \"(-1.2).abs() equals 1.2\"\n    equals 0.abs(), 0, \"(0).abs() equals 0\"\n  \n  test \"#ceil\", ->\n    equals 4.9.ceil(), 5, \"(4.9).floor() equals 5\"\n    equals 4.2.ceil(), 5, \"(4.2).ceil() equals 5\"\n    equals (-1.2).ceil(), -1, \"(-1.2).ceil() equals -1\"\n    equals 3.ceil(), 3, \"(3).ceil() equals 3\"\n  \n  test \"#clamp\", ->\n    equals 5.clamp(0, 3), 3\n    equals 5.clamp(-1, 0), 0\n    equals (-5).clamp(0, 1), 0\n    equals 1.clamp(0, null), 1\n    equals (-1).clamp(0, null), 0\n    equals (-10).clamp(-5, 0), -5\n    equals (-10).clamp(null, 0), -10\n    equals 50.clamp(null, 10), 10\n  \n  test \"#floor\", ->\n    equals 4.9.floor(), 4, \"(4.9).floor() equals 4\"\n    equals 4.2.floor(), 4, \"(4.2).floor() equals 4\"\n    equals (-1.2).floor(), -2, \"(-1.2).floor() equals -2\"\n    equals 3.floor(), 3, \"(3).floor() equals 3\"\n  \n  test \"#round\", ->\n    equals 4.5.round(), 5, \"(4.5).round() equals 5\"\n    equals 4.4.round(), 4, \"(4.4).round() equals 4\"\n  \n  test \"#sign\", ->\n    equals 5.sign(), 1, \"Positive number's sign is 1\"\n    equals (-3).sign(), -1, \"Negative number's sign is -1\"\n    equals 0.sign(), 0, \"Zero's sign is 0\"\n  \n  test \"#even\", ->\n    [0, 2, -32].each (n) ->\n      ok n.even(), \"#{n} is even\"\n  \n    [1, -1, 2.2, -3.784].each (n) ->\n      equals n.even(), false, \"#{n} is not even\"\n  \n  test \"#odd\", ->\n    [1, 9, -37].each (n) ->\n      ok n.odd(), \"#{n} is odd\"\n  \n    [0, 32, 2.2, -1.1].each (n) ->\n      equals n.odd(), false, \"#{n} is not odd\"\n  \n  test \"#times\", ->\n    n = 5\n    equals n.times(->), n, \"returns n\"\n  \n  test \"#times called correct amount\", ->\n    n = 5\n    count = 0\n  \n    n.times -> count++\n  \n    equals n, count, \"returns n\"\n  \n  test \"#mod should have a positive result when used with a positive base and a negative number\", ->\n    n = -3\n  \n    equals n.mod(8), 5, \"Should 'wrap' and be positive.\"\n  \n  test \"#degrees\", ->\n    equals 180.degrees, Math.PI\n    equals 1.degree, Math.TAU / 360\n  \n  test \"#rotations\", ->\n    equals 1.rotation, Math.TAU\n    equals 0.5.rotations, Math.TAU / 2\n  \n  test \"#turns\", ->\n    equals 1.turn, Math.TAU\n    equals 0.5.turns, Math.TAU / 2\n","type":"blob"},"test/string.coffee":{"path":"test/string.coffee","mode":"100644","content":"require \"../string\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"String\", ->\n  \n  test \"#blank\", ->\n    equals \"  \".blank(), true, \"A string containing only whitespace should be blank\"\n    equals \"a\".blank(), false, \"A string that contains a letter should not be blank\"\n    equals \"  a \".blank(), false\n    equals \"  \\n\\t \".blank(), true\n  \n  test \"#extension\", ->\n    equals \"README\".extension(), \"\"\n    equals \"README.md\".extension(), \"md\"\n    equals \"jquery.min.js\".extension(), \"js\"\n    equals \"src/bouse.js.coffee\".extension(), \"coffee\"\n  \n  test \"#parse\", ->\n    equals \"true\".parse(), true, \"parsing 'true' should equal boolean true\"\n    equals \"false\".parse(), false, \"parsing 'true' should equal boolean true\"\n    equals \"7.2\".parse(), 7.2, \"numbers should be cool too\"\n  \n    equals '{\"val\": \"a string\"}'.parse().val, \"a string\", \"even parsing objects works\"\n  \n    ok ''.parse() == '', \"Empty string parses to exactly the empty string\"\n  \n  test \"#startsWith\", ->\n    ok \"cool\".startsWith(\"coo\")\n    equals \"cool\".startsWith(\"oo\"), false\n  \n  test \"#toInt\", ->\n    equals \"31.3\".toInt(), 31\n    equals \"31.\".toInt(), 31\n    equals \"-1.02\".toInt(), -1\n  \n    equals \"009\".toInt(), 9\n    equals \"0109\".toInt(), 109\n  \n    equals \"F\".toInt(16), 15\n  \n  test \"#withoutExtension\", ->\n    equals \"neat.png\".withoutExtension(), \"neat\"\n    equals \"not a file\".withoutExtension(), \"not a file\"\n","type":"blob"},"util.coffee.md":{"path":"util.coffee.md","mode":"100644","content":"Util\n====\n\nUtility methods shared in our extensions.\n\n    module.exports =\n\nExtend an object with the properties of other objects.\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n","type":"blob"}},"distribution":{"array":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend, identity, mod, rand,
    __slice = [].slice;

  extend = require("./util").extend;

  extend(Array.prototype, {
    average: function() {
      return this.sum() / this.length;
    },
    compact: function() {
      return this.select(function(element) {
        return element != null;
      });
    },
    copy: function() {
      return this.concat();
    },
    clear: function() {
      this.length = 0;
      return this;
    },
    flatten: function() {
      return this.inject([], function(a, b) {
        return a.concat(b);
      });
    },
    invoke: function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.map(function(element) {
        return element[method].apply(element, args);
      });
    },
    rand: function() {
      return this[rand(this.length)];
    },
    remove: function(object) {
      var index;
      index = this.indexOf(object);
      if (index >= 0) {
        return this.splice(index, 1)[0];
      } else {
        return void 0;
      }
    },
    include: function(element) {
      return this.indexOf(element) !== -1;
    },
    each: function(iterator, context) {
      var element, i, _i, _len;
      if (this.forEach) {
        this.forEach(iterator, context);
      } else {
        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
          element = this[i];
          iterator.call(context, element, i, this);
        }
      }
      return this;
    },
    eachPair: function(iterator, context) {
      var a, b, i, j, length, _results;
      length = this.length;
      i = 0;
      _results = [];
      while (i < length) {
        a = this[i];
        j = i + 1;
        i += 1;
        _results.push((function() {
          var _results1;
          _results1 = [];
          while (j < length) {
            b = this[j];
            j += 1;
            _results1.push(iterator.call(context, a, b));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    eachWithObject: function(object, iterator, context) {
      this.each(function(element, i, self) {
        return iterator.call(context, element, object, i, self);
      });
      return object;
    },
    eachSlice: function(n, iterator, context) {
      var i, len;
      len = this.length / n;
      i = -1;
      while (++i < len) {
        iterator.call(context, this.slice(i * n, (i + 1) * n), i * n, this);
      }
      return this;
    },
    pipeline: function(input) {
      return this.inject(input, function(input, fn) {
        return fn(input);
      });
    },
    shuffle: function() {
      var shuffledArray;
      shuffledArray = [];
      this.each(function(element) {
        return shuffledArray.splice(rand(shuffledArray.length + 1), 0, element);
      });
      return shuffledArray;
    },
    first: function() {
      return this[0];
    },
    last: function() {
      return this[this.length - 1];
    },
    extremes: function(fn) {
      var max, maxResult, min, minResult;
      if (fn == null) {
        fn = identity;
      }
      min = max = void 0;
      minResult = maxResult = void 0;
      this.each(function(object) {
        var result;
        result = fn(object);
        if (min != null) {
          if (result < minResult) {
            min = object;
            minResult = result;
          }
        } else {
          min = object;
          minResult = result;
        }
        if (max != null) {
          if (result > maxResult) {
            max = object;
            return maxResult = result;
          }
        } else {
          max = object;
          return maxResult = result;
        }
      });
      return {
        min: min,
        max: max
      };
    },
    maxima: function(valueFunction) {
      if (valueFunction == null) {
        valueFunction = identity;
      }
      return this.inject([-Infinity, []], function(memo, item) {
        var maxItems, maxValue, value;
        value = valueFunction(item);
        maxValue = memo[0], maxItems = memo[1];
        if (value > maxValue) {
          return [value, [item]];
        } else if (value === maxValue) {
          return [value, maxItems.concat(item)];
        } else {
          return memo;
        }
      }).last();
    },
    maximum: function(valueFunction) {
      return this.maxima(valueFunction).first();
    },
    minima: function(valueFunction) {
      var inverseFn;
      if (valueFunction == null) {
        valueFunction = identity;
      }
      inverseFn = function(x) {
        return -valueFunction(x);
      };
      return this.maxima(inverseFn);
    },
    minimum: function(valueFunction) {
      return this.minima(valueFunction).first();
    },
    wrap: function(start, length) {
      var end, i, result;
      if (length != null) {
        end = start + length;
        i = start;
        result = [];
        while (i < end) {
          result.push(this[mod(i, this.length)]);
          i += 1;
        }
        return result;
      } else {
        return this[mod(start, this.length)];
      }
    },
    partition: function(iterator, context) {
      var falseCollection, trueCollection;
      trueCollection = [];
      falseCollection = [];
      this.each(function(element) {
        if (iterator.call(context, element)) {
          return trueCollection.push(element);
        } else {
          return falseCollection.push(element);
        }
      });
      return [trueCollection, falseCollection];
    },
    select: function(iterator, context) {
      return this.partition(iterator, context)[0];
    },
    without: function(values) {
      return this.reject(function(element) {
        return values.include(element);
      });
    },
    reject: function(iterator, context) {
      return this.partition(iterator, context)[1];
    },
    inject: function(initial, iterator) {
      this.each(function(element) {
        return initial = iterator(initial, element);
      });
      return initial;
    },
    sum: function() {
      return this.inject(0, function(sum, n) {
        return sum + n;
      });
    },
    product: function() {
      return this.inject(1, function(product, n) {
        return product * n;
      });
    },
    unique: function() {
      return this.inject([], function(results, element) {
        if (results.indexOf(element) === -1) {
          results.push(element);
        }
        return results;
      });
    },
    zip: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.map(function(element, index) {
        var output;
        output = args.map(function(arr) {
          return arr[index];
        });
        output.unshift(element);
        return output;
      });
    }
  });

  identity = function(x) {
    return x;
  };

  rand = function(n) {
    return Math.floor(n * Math.random());
  };

  mod = function(n, base) {
    var result;
    result = n % base;
    if (result < 0 && base > 0) {
      result += base;
    }
    return result;
  };

}).call(this);

//# sourceURL=array.coffee;

  return module.exports;
},"extensions":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("./array");

  require("./function");

  require("./number");

  require("./string");

}).call(this);

//# sourceURL=extensions.coffee;

  return module.exports;
},"function":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend,
    __slice = [].slice;

  extend = require("./util").extend;

  extend(Function.prototype, {
    once: function() {
      var func, memo, ran;
      func = this;
      ran = false;
      memo = void 0;
      return function() {
        if (ran) {
          return memo;
        }
        ran = true;
        return memo = func.apply(this, arguments);
      };
    },
    debounce: function(wait) {
      var func, timeout;
      timeout = null;
      func = this;
      return function() {
        var args, context, later;
        context = this;
        args = arguments;
        later = function() {
          timeout = null;
          return func.apply(context, args);
        };
        clearTimeout(timeout);
        return timeout = setTimeout(later, wait);
      };
    },
    delay: function() {
      var args, func, wait;
      wait = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      func = this;
      return setTimeout(function() {
        return func.apply(null, args);
      }, wait);
    },
    defer: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.delay.apply(this, [1].concat(args));
    }
  });

  extend(Function, {
    identity: function(x) {
      return x;
    },
    noop: function() {}
  });

}).call(this);

//# sourceURL=function.coffee;

  return module.exports;
},"number":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend;

  ["abs", "ceil", "floor", "round"].forEach(function(method) {
    return Number.prototype[method] = function() {
      return Math[method](this);
    };
  });

  extend = require("./util").extend;

  extend(Number.prototype, {
    circularPoints: function() {
      var n, _i, _results;
      n = this;
      return (function() {
        _results = [];
        for (var _i = 0; 0 <= n ? _i <= n : _i >= n; 0 <= n ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(i) {
        return Point.fromAngle((i / n).turns);
      });
    },
    clamp: function(min, max) {
      if ((min != null) && (max != null)) {
        return Math.min(Math.max(this, min), max);
      } else if (min != null) {
        return Math.max(this, min);
      } else if (max != null) {
        return Math.min(this, max);
      } else {
        return this;
      }
    },
    mod: function(base) {
      var result;
      result = this % base;
      if (result < 0 && base > 0) {
        result += base;
      }
      return result;
    },
    sign: function() {
      if (this > 0) {
        return 1;
      } else if (this < 0) {
        return -1;
      } else {
        return 0;
      }
    },
    even: function() {
      return this.mod(2) === 0;
    },
    odd: function() {
      return this.mod(2) === 1;
    },
    times: function(iterator, context) {
      var i;
      i = -1;
      while (++i < this) {
        iterator.call(context, i);
      }
      return i;
    },
    snap: function(resolution) {
      return (n / resolution).floor() * resolution;
    },
    truncate: function() {
      if (this > 0) {
        return this.floor();
      } else if (this < 0) {
        return this.ceil();
      } else {
        return this;
      }
    }
  });

  if (!5..rotations) {
    Object.defineProperty(Number.prototype, 'rotations', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!1..rotation) {
    Object.defineProperty(Number.prototype, 'rotation', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!5..turns) {
    Object.defineProperty(Number.prototype, 'turns', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!1..turn) {
    Object.defineProperty(Number.prototype, 'turn', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!2..degrees) {
    Object.defineProperty(Number.prototype, 'degrees', {
      get: function() {
        return this * Math.TAU / 360;
      }
    });
  }

  if (!1..degree) {
    Object.defineProperty(Number.prototype, 'degree', {
      get: function() {
        return this * Math.TAU / 360;
      }
    });
  }

  Math.TAU = 2 * Math.PI;

}).call(this);

//# sourceURL=number.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"extensions"};;

  return module.exports;
},"string":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend;

  extend = require("./util").extend;

  extend(String.prototype, {
    blank: function() {
      return /^\s*$/.test(this);
    },
    parse: function() {
      var e;
      try {
        return JSON.parse(this.toString());
      } catch (_error) {
        e = _error;
        return this.toString();
      }
    },
    startsWith: function(str) {
      return this.lastIndexOf(str, 0) === 0;
    },
    endsWith: function(str) {
      return this.indexOf(str, this.length - str.length) !== -1;
    },
    extension: function() {
      var extension, _ref;
      if (extension = (_ref = this.match(/\.([^\.]*)$/, '')) != null ? _ref.last() : void 0) {
        return extension;
      } else {
        return '';
      }
    },
    withoutExtension: function() {
      return this.replace(/\.[^\.]*$/, '');
    },
    toInt: function(base) {
      if (base == null) {
        base = 10;
      }
      return parseInt(this, base);
    }
  });

}).call(this);

//# sourceURL=string.coffee;

  return module.exports;
},"test/array":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equals, ok, test;

  require("../array");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Array", function() {
    test("#average", function() {
      return equals([1, 3, 5, 7].average(), 4);
    });
    test("#compact", function() {
      var a, compacted;
      a = [0, 1, void 0, 2, null, 3, '', 4];
      compacted = a.compact();
      equals(compacted[0], 0);
      equals(compacted[1], 1);
      equals(compacted[2], 2);
      equals(compacted[3], 3);
      equals(compacted[4], '');
      return equals(compacted[5], 4);
    });
    test("#copy", function() {
      var a, b;
      a = [1, 2, 3];
      b = a.copy();
      ok(a !== b, "Original array is not the same array as the copied one");
      ok(a.length === b.length, "Both arrays are the same size");
      return ok(a[0] === b[0] && a[1] === b[1] && a[2] === b[2], "The elements of the two arrays are equal");
    });
    test("#flatten", function() {
      var array, flattenedArray;
      array = [[0, 1], [2, 3], [4, 5]];
      flattenedArray = array.flatten();
      equals(flattenedArray.length, 6, "Flattened array length should equal number of elements in sub-arrays");
      equals(flattenedArray.first(), 0, "First element should be first element in first sub-array");
      return equals(flattenedArray.last(), 5, "Last element should be last element in last sub-array");
    });
    test("#rand", function() {
      var array;
      array = [1, 2, 3];
      ok(array.indexOf(array.rand()) !== -1, "Array includes randomly selected element");
      ok([5].rand() === 5, "[5].rand() === 5");
      return ok([].rand() === void 0, "[].rand() === undefined");
    });
    test("#remove", function() {
      var array;
      equals([1, 2, 3].remove(2), 2, "[1,2,3].remove(2) === 2");
      equals([1, 3].remove(2), void 0, "[1,3].remove(2) === undefined");
      equals([1, 3].remove(3), 3, "[1,3].remove(3) === 3");
      array = [1, 2, 3];
      array.remove(2);
      ok(array.length === 2, "array = [1,2,3]; array.remove(2); array.length === 2");
      array.remove(3);
      return ok(array.length === 1, "array = [1,3]; array.remove(3); array.length === 1");
    });
    test("#map", function() {
      return equals([1].map(function(x) {
        return x + 1;
      })[0], 2);
    });
    test("#invoke", function() {
      var results;
      results = ['hello', 'world', 'cool!'].invoke('substring', 0, 3);
      equals(results[0], "hel");
      equals(results[1], "wor");
      return equals(results[2], "coo");
    });
    test("#each", function() {
      var array, count;
      array = [1, 2, 3];
      count = 0;
      equals(array, array.each(function() {
        return count++;
      }));
      return equals(array.length, count);
    });
    test("#eachPair", function() {
      var array, sum;
      array = [1, 2, 3];
      sum = 0;
      array.eachPair(function(a, b) {
        return sum += a + b;
      });
      return equals(sum, 12);
    });
    test("#eachWithObject", function() {
      var array, result;
      array = [1, 2, 3];
      result = array.eachWithObject({}, function(element, hash) {
        return hash[element] = (element + 1).toString();
      });
      equals(result[1], "2");
      equals(result[2], "3");
      return equals(result[3], "4");
    });
    test("#shuffle", function() {
      var array, shuffledArray;
      array = [0, 1, 2, 3, 4, 5];
      shuffledArray = array.shuffle();
      shuffledArray.each(function(element) {
        return ok(array.indexOf(element) >= 0, "Every element in shuffled array is in orig array");
      });
      return array.each(function(element) {
        return ok(shuffledArray.indexOf(element) >= 0, "Every element in orig array is in shuffled array");
      });
    });
    test("#first", function() {
      equals([2].first(), 2);
      equals([1, 2, 3].first(), 1);
      return equals([].first(), void 0);
    });
    test("#last", function() {
      equals([2].last(), 2);
      equals([1, 2, 3].last(), 3);
      return equals([].first(), void 0);
    });
    test("#maxima", function() {
      var maxima;
      maxima = [-52, 0, 78].maxima();
      maxima.each(function(n) {
        return equals(n, 78);
      });
      maxima = [0, 0, 1, 0, 1, 0, 1, 0].maxima();
      equals(3, maxima.length);
      return maxima.each(function(n) {
        return equals(n, 1);
      });
    });
    test("#maximum", function() {
      return equals([-345, 38, 8347].maximum(), 8347);
    });
    test("#maximum with function", function() {
      return equals([3, 4, 5].maximum(function(n) {
        return n % 4;
      }), 3);
    });
    test("#minima", function() {
      var minima;
      minima = [-52, 0, 78].minima();
      minima.each(function(n) {
        return equals(n, -52);
      });
      minima = [0, 0, 1, 0, 1, 0, 1, 0].minima();
      equals(5, minima.length);
      return minima.each(function(n) {
        return equals(n, 0);
      });
    });
    test("#minimum", function() {
      return equals([-345, 38, 8347].minimum(), -345);
    });
    test("#pipeline", function() {
      var pipe;
      pipe = [
        function(x) {
          return x * x;
        }, function(x) {
          return x - 10;
        }
      ];
      return equals(pipe.pipeline(5), 15);
    });
    test("#extremes", function() {
      var array, extremes;
      array = [-7, 1, 11, 94];
      extremes = array.extremes();
      equals(extremes.min, -7, "Min is -7");
      return equals(extremes.max, 94, "Max is 94");
    });
    test("#extremes with fn", function() {
      var array, extremes;
      array = [1, 11, 94];
      extremes = array.extremes(function(value) {
        return value % 11;
      });
      equals(extremes.min, 11, extremes.min);
      return equals(extremes.max, 94, extremes.max);
    });
    test("#sum", function() {
      equals([].sum(), 0, "Empty array sums to zero");
      equals([2].sum(), 2, "[2] sums to 2");
      return equals([1, 2, 3, 4, 5].sum(), 15, "[1, 2, 3, 4, 5] sums to 15");
    });
    test("#eachSlice", function() {
      return [1, 2, 3, 4, 5, 6].eachSlice(2, function(array) {
        equals(array[0] % 2, 1);
        return equals(array[1] % 2, 0);
      });
    });
    test("#without", function() {
      var array, excluded;
      array = [1, 2, 3, 4];
      excluded = array.without([2, 4]);
      equals(excluded[0], 1);
      return equals(excluded[1], 3);
    });
    test("#clear", function() {
      var array;
      array = [1, 2, 3, 4];
      equals(array.length, 4);
      equals(array[0], 1);
      array.clear();
      equals(array.length, 0);
      return equals(array[0], void 0);
    });
    test("#unique", function() {
      var array;
      array = [0, 0, 0, 1, 1, 1, 2, 3];
      equals(array.unique().first(), 0);
      equals(array.unique().last(), 3);
      return equals(array.unique().length, 4);
    });
    test("#wrap", function() {
      var array;
      array = [0, 1, 2, 3, 4];
      equals(array.wrap(0), 0);
      equals(array.wrap(-1), 4);
      return equals(array.wrap(2), 2);
    });
    return test("#zip", function() {
      var a, b, c, output;
      a = [1, 2, 3];
      b = [4, 5, 6];
      c = [7, 8];
      output = a.zip(b, c);
      equals(output[0][0], 1);
      equals(output[0][1], 4);
      equals(output[0][2], 7);
      return equals(output[2][2], void 0);
    });
  });

}).call(this);

//# sourceURL=test/array.coffee;

  return module.exports;
},"test/function":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equals, ok, test;

  require("../function");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Function", function() {
    test("#once", function() {
      var addScore, onceScore, score;
      score = 0;
      addScore = function() {
        return score += 100;
      };
      onceScore = addScore.once();
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function() {
        return onceScore();
      });
      return equals(score, 100);
    });
    test(".identity", function() {
      var I;
      I = Function.identity;
      return [0, 1, true, false, null, void 0].each(function(x) {
        return equals(I(x), x);
      });
    });
    test("#debounce", function(done) {
      var fn;
      fn = (function() {
        ok(true);
        return done();
      }).debounce(1);
      fn();
      fn();
      return fn();
    });
    test("#delay", function(done) {
      var fn;
      fn = function(x, y) {
        equals(x, 3);
        equals(y, "testy");
        return done();
      };
      return fn.delay(25, 3, "testy");
    });
    return test("#defer", function(done) {
      var fn;
      fn = function(x) {
        equals(x, 3);
        return done();
      };
      return fn.defer(3);
    });
  });

}).call(this);

//# sourceURL=test/function.coffee;

  return module.exports;
},"test/number":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equalEnough, equals, ok, test;

  require("../number");

  ok = assert;

  equals = assert.equal;

  test = it;

  equalEnough = function(expected, actual, tolerance, message) {
    message || (message = "" + expected + " within " + tolerance + " of " + actual);
    return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);
  };

  describe("Number", function() {
    test("#abs", function() {
      equals(5..abs(), 5, "(5).abs() equals 5");
      equals(4.2.abs(), 4.2, "(4.2).abs() equals 4.2");
      equals((-1.2).abs(), 1.2, "(-1.2).abs() equals 1.2");
      return equals(0..abs(), 0, "(0).abs() equals 0");
    });
    test("#ceil", function() {
      equals(4.9.ceil(), 5, "(4.9).floor() equals 5");
      equals(4.2.ceil(), 5, "(4.2).ceil() equals 5");
      equals((-1.2).ceil(), -1, "(-1.2).ceil() equals -1");
      return equals(3..ceil(), 3, "(3).ceil() equals 3");
    });
    test("#clamp", function() {
      equals(5..clamp(0, 3), 3);
      equals(5..clamp(-1, 0), 0);
      equals((-5).clamp(0, 1), 0);
      equals(1..clamp(0, null), 1);
      equals((-1).clamp(0, null), 0);
      equals((-10).clamp(-5, 0), -5);
      equals((-10).clamp(null, 0), -10);
      return equals(50..clamp(null, 10), 10);
    });
    test("#floor", function() {
      equals(4.9.floor(), 4, "(4.9).floor() equals 4");
      equals(4.2.floor(), 4, "(4.2).floor() equals 4");
      equals((-1.2).floor(), -2, "(-1.2).floor() equals -2");
      return equals(3..floor(), 3, "(3).floor() equals 3");
    });
    test("#round", function() {
      equals(4.5.round(), 5, "(4.5).round() equals 5");
      return equals(4.4.round(), 4, "(4.4).round() equals 4");
    });
    test("#sign", function() {
      equals(5..sign(), 1, "Positive number's sign is 1");
      equals((-3).sign(), -1, "Negative number's sign is -1");
      return equals(0..sign(), 0, "Zero's sign is 0");
    });
    test("#even", function() {
      [0, 2, -32].each(function(n) {
        return ok(n.even(), "" + n + " is even");
      });
      return [1, -1, 2.2, -3.784].each(function(n) {
        return equals(n.even(), false, "" + n + " is not even");
      });
    });
    test("#odd", function() {
      [1, 9, -37].each(function(n) {
        return ok(n.odd(), "" + n + " is odd");
      });
      return [0, 32, 2.2, -1.1].each(function(n) {
        return equals(n.odd(), false, "" + n + " is not odd");
      });
    });
    test("#times", function() {
      var n;
      n = 5;
      return equals(n.times(function() {}), n, "returns n");
    });
    test("#times called correct amount", function() {
      var count, n;
      n = 5;
      count = 0;
      n.times(function() {
        return count++;
      });
      return equals(n, count, "returns n");
    });
    test("#mod should have a positive result when used with a positive base and a negative number", function() {
      var n;
      n = -3;
      return equals(n.mod(8), 5, "Should 'wrap' and be positive.");
    });
    test("#degrees", function() {
      equals(180..degrees, Math.PI);
      return equals(1..degree, Math.TAU / 360);
    });
    test("#rotations", function() {
      equals(1..rotation, Math.TAU);
      return equals(0.5.rotations, Math.TAU / 2);
    });
    return test("#turns", function() {
      equals(1..turn, Math.TAU);
      return equals(0.5.turns, Math.TAU / 2);
    });
  });

}).call(this);

//# sourceURL=test/number.coffee;

  return module.exports;
},"test/string":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equals, ok, test;

  require("../string");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("String", function() {
    test("#blank", function() {
      equals("  ".blank(), true, "A string containing only whitespace should be blank");
      equals("a".blank(), false, "A string that contains a letter should not be blank");
      equals("  a ".blank(), false);
      return equals("  \n\t ".blank(), true);
    });
    test("#extension", function() {
      equals("README".extension(), "");
      equals("README.md".extension(), "md");
      equals("jquery.min.js".extension(), "js");
      return equals("src/bouse.js.coffee".extension(), "coffee");
    });
    test("#parse", function() {
      equals("true".parse(), true, "parsing 'true' should equal boolean true");
      equals("false".parse(), false, "parsing 'true' should equal boolean true");
      equals("7.2".parse(), 7.2, "numbers should be cool too");
      equals('{"val": "a string"}'.parse().val, "a string", "even parsing objects works");
      return ok(''.parse() === '', "Empty string parses to exactly the empty string");
    });
    test("#startsWith", function() {
      ok("cool".startsWith("coo"));
      return equals("cool".startsWith("oo"), false);
    });
    test("#toInt", function() {
      equals("31.3".toInt(), 31);
      equals("31.".toInt(), 31);
      equals("-1.02".toInt(), -1);
      equals("009".toInt(), 9);
      equals("0109".toInt(), 109);
      return equals("F".toInt(16), 15);
    });
    return test("#withoutExtension", function() {
      equals("neat.png".withoutExtension(), "neat");
      return equals("not a file".withoutExtension(), "not a file");
    });
  });

}).call(this);

//# sourceURL=test/string.coffee;

  return module.exports;
},"util":function(require, global, module, exports, PACKAGE) {
  (function() {
  var __slice = [].slice;

  module.exports = {
    extend: function() {
      var name, source, sources, target, _i, _len;
      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        for (name in source) {
          target[name] = source[name];
        }
      }
      return target;
    }
  };

}).call(this);

//# sourceURL=util.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"extensions","repository":{"id":13577503,"name":"extensions","full_name":"distri/extensions","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/extensions","description":"","fork":false,"url":"https://api.github.com/repos/distri/extensions","forks_url":"https://api.github.com/repos/distri/extensions/forks","keys_url":"https://api.github.com/repos/distri/extensions/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/extensions/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/extensions/teams","hooks_url":"https://api.github.com/repos/distri/extensions/hooks","issue_events_url":"https://api.github.com/repos/distri/extensions/issues/events{/number}","events_url":"https://api.github.com/repos/distri/extensions/events","assignees_url":"https://api.github.com/repos/distri/extensions/assignees{/user}","branches_url":"https://api.github.com/repos/distri/extensions/branches{/branch}","tags_url":"https://api.github.com/repos/distri/extensions/tags","blobs_url":"https://api.github.com/repos/distri/extensions/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/extensions/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/extensions/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/extensions/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/extensions/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/extensions/languages","stargazers_url":"https://api.github.com/repos/distri/extensions/stargazers","contributors_url":"https://api.github.com/repos/distri/extensions/contributors","subscribers_url":"https://api.github.com/repos/distri/extensions/subscribers","subscription_url":"https://api.github.com/repos/distri/extensions/subscription","commits_url":"https://api.github.com/repos/distri/extensions/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/extensions/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/extensions/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/extensions/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/extensions/contents/{+path}","compare_url":"https://api.github.com/repos/distri/extensions/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/extensions/merges","archive_url":"https://api.github.com/repos/distri/extensions/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/extensions/downloads","issues_url":"https://api.github.com/repos/distri/extensions/issues{/number}","pulls_url":"https://api.github.com/repos/distri/extensions/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/extensions/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/extensions/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/extensions/labels{/name}","releases_url":"https://api.github.com/repos/distri/extensions/releases{/id}","created_at":"2013-10-15T01:14:11Z","updated_at":"2013-12-24T01:04:48Z","pushed_at":"2013-12-24T01:04:20Z","git_url":"git://github.com/distri/extensions.git","ssh_url":"git@github.com:distri/extensions.git","clone_url":"https://github.com/distri/extensions.git","svn_url":"https://github.com/distri/extensions","homepage":null,"size":964,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{}},"core":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"core\n====\n\nAn object extension system.\n","type":"blob"},"core.coffee.md":{"path":"core.coffee.md","mode":"100644","content":"Core\n====\n\nThe Core module is used to add extended functionality to objects without\nextending `Object.prototype` directly.\n\n    Core = (I={}, self={}) ->\n      extend self,\n\nExternal access to instance variables. Use of this property should be avoided\nin general, but can come in handy from time to time.\n\n>     #! example\n>     I =\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject = Core(I)\n>\n>     [myObject.I.r, myObject.I.g, myObject.I.b]\n\n        I: I\n\nGenerates a public jQuery style getter / setter method for each `String` argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrAccessor \"r\", \"g\", \"b\"\n>\n>     myObject.r(254)\n\n        attrAccessor: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = (newValue) ->\n              if arguments.length > 0\n                I[attrName] = newValue\n\n                return self\n              else\n                I[attrName]\n\n          return self\n\nGenerates a public jQuery style getter method for each String argument.\n\n>     #! example\n>     myObject = Core\n>       r: 255\n>       g: 0\n>       b: 100\n>\n>     myObject.attrReader \"r\", \"g\", \"b\"\n>\n>     [myObject.r(), myObject.g(), myObject.b()]\n\n        attrReader: (attrNames...) ->\n          attrNames.forEach (attrName) ->\n            self[attrName] = ->\n              I[attrName]\n\n          return self\n\nExtends this object with methods from the passed in object. A shortcut for Object.extend(self, methods)\n\n>     I =\n>       x: 30\n>       y: 40\n>       maxSpeed: 5\n>\n>     # we are using extend to give player\n>     # additional methods that Core doesn't have\n>     player = Core(I).extend\n>       increaseSpeed: ->\n>         I.maxSpeed += 1\n>\n>     player.increaseSpeed()\n\n        extend: (objects...) ->\n          extend self, objects...\n\nIncludes a module in this object. A module is a constructor that takes two parameters, `I` and `self`\n\n>     myObject = Core()\n>     myObject.include(Bindable)\n\n>     # now you can bind handlers to functions\n>     myObject.bind \"someEvent\", ->\n>       alert(\"wow. that was easy.\")\n\n        include: (modules...) ->\n          for Module in modules\n            Module(I, self)\n\n          return self\n\n      return self\n\nHelpers\n-------\n\nExtend an object with the properties of other objects.\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\nExport\n\n    module.exports = Core\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"entryPoint: \"core\"\nversion: \"0.6.0\"\n","type":"blob"},"test/core.coffee":{"path":"test/core.coffee","mode":"100644","content":"Core = require \"../core\"\n\nok = assert\nequals = assert.equal\ntest = it\n\ndescribe \"Core\", ->\n\n  test \"#extend\", ->\n    o = Core()\n  \n    o.extend\n      test: \"jawsome\"\n  \n    equals o.test, \"jawsome\"\n  \n  test \"#attrAccessor\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrAccessor(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), o\n    equals o.test(), \"new_val\"\n  \n  test \"#attrReader\", ->\n    o = Core\n      test: \"my_val\"\n  \n    o.attrReader(\"test\")\n  \n    equals o.test(), \"my_val\"\n    equals o.test(\"new_val\"), \"my_val\"\n    equals o.test(), \"my_val\"\n  \n  test \"#include\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    ret = o.include M\n  \n    equals ret, o, \"Should return self\"\n  \n    equals o.test(), \"my_val\"\n    equals o.test2, \"cool\"\n  \n  test \"#include multiple\", ->\n    o = Core\n      test: \"my_val\"\n  \n    M = (I, self) ->\n      self.attrReader \"test\"\n  \n      self.extend\n        test2: \"cool\"\n  \n    M2 = (I, self) ->\n      self.extend\n        test2: \"coolio\"\n  \n    o.include M, M2\n  \n    equals o.test2, \"coolio\"\n","type":"blob"}},"distribution":{"core":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Core, extend,
    __slice = [].slice;

  Core = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = {};
    }
    extend(self, {
      I: I,
      attrAccessor: function() {
        var attrNames;
        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        attrNames.forEach(function(attrName) {
          return self[attrName] = function(newValue) {
            if (arguments.length > 0) {
              I[attrName] = newValue;
              return self;
            } else {
              return I[attrName];
            }
          };
        });
        return self;
      },
      attrReader: function() {
        var attrNames;
        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        attrNames.forEach(function(attrName) {
          return self[attrName] = function() {
            return I[attrName];
          };
        });
        return self;
      },
      extend: function() {
        var objects;
        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return extend.apply(null, [self].concat(__slice.call(objects)));
      },
      include: function() {
        var Module, modules, _i, _len;
        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_i = 0, _len = modules.length; _i < _len; _i++) {
          Module = modules[_i];
          Module(I, self);
        }
        return self;
      }
    });
    return self;
  };

  extend = function() {
    var name, source, sources, target, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (name in source) {
        target[name] = source[name];
      }
    }
    return target;
  };

  module.exports = Core;

}).call(this);

//# sourceURL=core.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"core","version":"0.6.0"};;

  return module.exports;
},"test/core":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Core, equals, ok, test;

  Core = require("../core");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Core", function() {
    test("#extend", function() {
      var o;
      o = Core();
      o.extend({
        test: "jawsome"
      });
      return equals(o.test, "jawsome");
    });
    test("#attrAccessor", function() {
      var o;
      o = Core({
        test: "my_val"
      });
      o.attrAccessor("test");
      equals(o.test(), "my_val");
      equals(o.test("new_val"), o);
      return equals(o.test(), "new_val");
    });
    test("#attrReader", function() {
      var o;
      o = Core({
        test: "my_val"
      });
      o.attrReader("test");
      equals(o.test(), "my_val");
      equals(o.test("new_val"), "my_val");
      return equals(o.test(), "my_val");
    });
    test("#include", function() {
      var M, o, ret;
      o = Core({
        test: "my_val"
      });
      M = function(I, self) {
        self.attrReader("test");
        return self.extend({
          test2: "cool"
        });
      };
      ret = o.include(M);
      equals(ret, o, "Should return self");
      equals(o.test(), "my_val");
      return equals(o.test2, "cool");
    });
    return test("#include multiple", function() {
      var M, M2, o;
      o = Core({
        test: "my_val"
      });
      M = function(I, self) {
        self.attrReader("test");
        return self.extend({
          test2: "cool"
        });
      };
      M2 = function(I, self) {
        return self.extend({
          test2: "coolio"
        });
      };
      o.include(M, M2);
      return equals(o.test2, "coolio");
    });
  });

}).call(this);

//# sourceURL=test/core.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.6.0","entryPoint":"core","repository":{"id":13567517,"name":"core","full_name":"distri/core","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/core","description":"An object extension system.","fork":false,"url":"https://api.github.com/repos/distri/core","forks_url":"https://api.github.com/repos/distri/core/forks","keys_url":"https://api.github.com/repos/distri/core/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/core/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/core/teams","hooks_url":"https://api.github.com/repos/distri/core/hooks","issue_events_url":"https://api.github.com/repos/distri/core/issues/events{/number}","events_url":"https://api.github.com/repos/distri/core/events","assignees_url":"https://api.github.com/repos/distri/core/assignees{/user}","branches_url":"https://api.github.com/repos/distri/core/branches{/branch}","tags_url":"https://api.github.com/repos/distri/core/tags","blobs_url":"https://api.github.com/repos/distri/core/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/core/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/core/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/core/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/core/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/core/languages","stargazers_url":"https://api.github.com/repos/distri/core/stargazers","contributors_url":"https://api.github.com/repos/distri/core/contributors","subscribers_url":"https://api.github.com/repos/distri/core/subscribers","subscription_url":"https://api.github.com/repos/distri/core/subscription","commits_url":"https://api.github.com/repos/distri/core/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/core/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/core/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/core/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/core/contents/{+path}","compare_url":"https://api.github.com/repos/distri/core/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/core/merges","archive_url":"https://api.github.com/repos/distri/core/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/core/downloads","issues_url":"https://api.github.com/repos/distri/core/issues{/number}","pulls_url":"https://api.github.com/repos/distri/core/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/core/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/core/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/core/labels{/name}","releases_url":"https://api.github.com/repos/distri/core/releases{/id}","created_at":"2013-10-14T17:04:33Z","updated_at":"2013-12-24T00:49:21Z","pushed_at":"2013-10-14T23:49:11Z","git_url":"git://github.com/distri/core.git","ssh_url":"git@github.com:distri/core.git","clone_url":"https://github.com/distri/core.git","svn_url":"https://github.com/distri/core","homepage":null,"size":592,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.6.0","defaultBranch":"master"},"dependencies":{}}}},"finder":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"finder\n======\n\nQuery a set of objects using a jQuery like selector language.\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"Finder\n======\n\nUse a query language to filter an array of objects.\n\n    module.exports = (I={}, self=Core(I)) ->\n      self.extend\n\nGet a selection of objects that match the specified selector criteria.\nThe selector language can select objects by id, type, or attributes. This\nmethod always returns an Array.\n\n        find: (objects, selector, typeMatcher) ->\n          results = []\n\n          matcher = generate(selector, typeMatcher)\n\n          objects.forEach (object) ->\n            results.push object if matcher object\n\n          results\n\n    parseSelector = (selector) ->\n      selector.split(\",\").invoke(\"trim\")\n\n    parseResult = (str) ->\n      try\n        JSON.parse(str)\n      catch\n        str\n\n    process = (item) ->\n      query = /^(\\w+)?#?([\\w\\-]+)?\\.?([\\w\\-]+)?=?([\\w\\-]+)?/.exec(item)\n\n      if query\n        if valueQuery = query[4]\n          query[4] = parseResult valueQuery\n\n        query.splice(1)\n      else\n        []\n\n    get = (object, property) ->\n      value = object?[property]\n\n      if typeof value is \"function\"\n        value.call(object)\n      else\n        value\n\n    defaultTypeMatcher = (type, object) ->\n      type is get(object, \"class\")\n\n    generate = (selector=\"\", typeMatcher=defaultTypeMatcher) ->\n      components = parseSelector(selector).map (piece) ->\n        process(piece)\n\n      (object) ->\n        for component in components\n          [type, id, attr, value] = component\n\n          idMatch = !id or (id is get(object, \"id\"))\n          typeMatch = !type or typeMatcher(type, object)\n\n          if attr\n            if value?\n              attrMatch = get(object, attr) is value\n            else\n              attrMatch = get(object, attr)\n          else\n            attrMatch = true\n\n          return true if idMatch && typeMatch && attrMatch\n\n        return false\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.1.3\"\nremoteDependencies: [\n  \"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js\"\n]\n","type":"blob"},"test/finder.coffee":{"path":"test/finder.coffee","mode":"100644","content":"Finder = require \"../main\"\n\ndescribe \"Finder\", ->\n  finder = Finder()\n\n  it \"should find objects with normal properties\", ->\n    results = finder.find([{\n      name: \"duder\"\n    }], \".name=duder\")\n\n    assert.equal results[0].name, \"duder\"\n\n  it \"should find obects with method properties\", ->\n    results = finder.find([{\n      name: -> \"duder\"\n    }], \".name=duder\")\n\n    assert.equal results[0].name(), \"duder\"\n\n  it \"should find objects by id attribute\", ->\n    results = finder.find([{\n      id: \"duder\"\n    }], \"#duder\")\n\n    assert.equal results[0].id, \"duder\"\n\n  it \"should find objects by id method\", ->\n    results = finder.find([{\n      id: -> \"duder\"\n    }], \"#duder\")\n\n    assert.equal results[0].id(), \"duder\"\n\n  it \"should allow specifying the type matcher\", ->\n    results = finder.find [\n      type: \"duder\"\n    ], \"duder\", (type, object) ->\n      object.type is type\n\n    assert.equal results[0].type, \"duder\"\n","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaultTypeMatcher, generate, get, parseResult, parseSelector, process;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    return self.extend({
      find: function(objects, selector, typeMatcher) {
        var matcher, results;
        results = [];
        matcher = generate(selector, typeMatcher);
        objects.forEach(function(object) {
          if (matcher(object)) {
            return results.push(object);
          }
        });
        return results;
      }
    });
  };

  parseSelector = function(selector) {
    return selector.split(",").invoke("trim");
  };

  parseResult = function(str) {
    try {
      return JSON.parse(str);
    } catch (_error) {
      return str;
    }
  };

  process = function(item) {
    var query, valueQuery;
    query = /^(\w+)?#?([\w\-]+)?\.?([\w\-]+)?=?([\w\-]+)?/.exec(item);
    if (query) {
      if (valueQuery = query[4]) {
        query[4] = parseResult(valueQuery);
      }
      return query.splice(1);
    } else {
      return [];
    }
  };

  get = function(object, property) {
    var value;
    value = object != null ? object[property] : void 0;
    if (typeof value === "function") {
      return value.call(object);
    } else {
      return value;
    }
  };

  defaultTypeMatcher = function(type, object) {
    return type === get(object, "class");
  };

  generate = function(selector, typeMatcher) {
    var components;
    if (selector == null) {
      selector = "";
    }
    if (typeMatcher == null) {
      typeMatcher = defaultTypeMatcher;
    }
    components = parseSelector(selector).map(function(piece) {
      return process(piece);
    });
    return function(object) {
      var attr, attrMatch, component, id, idMatch, type, typeMatch, value, _i, _len;
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        component = components[_i];
        type = component[0], id = component[1], attr = component[2], value = component[3];
        idMatch = !id || (id === get(object, "id"));
        typeMatch = !type || typeMatcher(type, object);
        if (attr) {
          if (value != null) {
            attrMatch = get(object, attr) === value;
          } else {
            attrMatch = get(object, attr);
          }
        } else {
          attrMatch = true;
        }
        if (idMatch && typeMatch && attrMatch) {
          return true;
        }
      }
      return false;
    };
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.1.3","remoteDependencies":["http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"]};;

  return module.exports;
},"test/finder":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Finder;

  Finder = require("../main");

  describe("Finder", function() {
    var finder;
    finder = Finder();
    it("should find objects with normal properties", function() {
      var results;
      results = finder.find([
        {
          name: "duder"
        }
      ], ".name=duder");
      return assert.equal(results[0].name, "duder");
    });
    it("should find obects with method properties", function() {
      var results;
      results = finder.find([
        {
          name: function() {
            return "duder";
          }
        }
      ], ".name=duder");
      return assert.equal(results[0].name(), "duder");
    });
    it("should find objects by id attribute", function() {
      var results;
      results = finder.find([
        {
          id: "duder"
        }
      ], "#duder");
      return assert.equal(results[0].id, "duder");
    });
    it("should find objects by id method", function() {
      var results;
      results = finder.find([
        {
          id: function() {
            return "duder";
          }
        }
      ], "#duder");
      return assert.equal(results[0].id(), "duder");
    });
    return it("should allow specifying the type matcher", function() {
      var results;
      results = finder.find([
        {
          type: "duder"
        }
      ], "duder", function(type, object) {
        return object.type === type;
      });
      return assert.equal(results[0].type, "duder");
    });
  });

}).call(this);

//# sourceURL=test/finder.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.1.3","entryPoint":"main","remoteDependencies":{"0":"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"},"repository":{"id":14910855,"name":"finder","full_name":"distri/finder","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/finder","description":"Query a set of objects using a jQuery like selector language.","fork":false,"url":"https://api.github.com/repos/distri/finder","forks_url":"https://api.github.com/repos/distri/finder/forks","keys_url":"https://api.github.com/repos/distri/finder/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/finder/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/finder/teams","hooks_url":"https://api.github.com/repos/distri/finder/hooks","issue_events_url":"https://api.github.com/repos/distri/finder/issues/events{/number}","events_url":"https://api.github.com/repos/distri/finder/events","assignees_url":"https://api.github.com/repos/distri/finder/assignees{/user}","branches_url":"https://api.github.com/repos/distri/finder/branches{/branch}","tags_url":"https://api.github.com/repos/distri/finder/tags","blobs_url":"https://api.github.com/repos/distri/finder/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/finder/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/finder/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/finder/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/finder/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/finder/languages","stargazers_url":"https://api.github.com/repos/distri/finder/stargazers","contributors_url":"https://api.github.com/repos/distri/finder/contributors","subscribers_url":"https://api.github.com/repos/distri/finder/subscribers","subscription_url":"https://api.github.com/repos/distri/finder/subscription","commits_url":"https://api.github.com/repos/distri/finder/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/finder/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/finder/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/finder/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/finder/contents/{+path}","compare_url":"https://api.github.com/repos/distri/finder/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/finder/merges","archive_url":"https://api.github.com/repos/distri/finder/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/finder/downloads","issues_url":"https://api.github.com/repos/distri/finder/issues{/number}","pulls_url":"https://api.github.com/repos/distri/finder/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/finder/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/finder/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/finder/labels{/name}","releases_url":"https://api.github.com/repos/distri/finder/releases{/id}","created_at":"2013-12-04T01:28:49Z","updated_at":"2013-12-04T04:11:25Z","pushed_at":"2013-12-04T04:11:25Z","git_url":"git://github.com/distri/finder.git","ssh_url":"git@github.com:distri/finder.git","clone_url":"https://github.com/distri/finder.git","svn_url":"https://github.com/distri/finder","homepage":null,"size":384,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":2,"branch":"v0.1.3","defaultBranch":"master"},"dependencies":{}},"hotkeys":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"hotkeys\n=======\n\nHotkeys module for editors\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"Hotkeys\n=======\n\nHotkeys module for the editors.\n\n    module.exports = (I={}, self=Core(I)) ->\n      self.extend\n        addHotkey: (key, method) ->\n          $(document).bind \"keydown\", key, (event) ->\n            if typeof method is \"function\"\n              method\n                editor: self\n            else\n              self[method]()\n\n            event.preventDefault()\n\n      return self\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n  \"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js\"\n]\n","type":"blob"},"test/hotkeys.coffee":{"path":"test/hotkeys.coffee","mode":"100644","content":"Hotkeys = require \"../main\"\n\ndescribe \"hotkeys\", ->\n  it \"should be hot\", (done) ->\n    hotkeys = Hotkeys()\n    \n    hotkeys.addHotkey \"a\", ->\n      done()\n\n    $(document).trigger $.Event \"keydown\",\n      which: 65 # a\n      keyCode: 65\n","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    self.extend({
      addHotkey: function(key, method) {
        return $(document).bind("keydown", key, function(event) {
          if (typeof method === "function") {
            method({
              editor: self
            });
          } else {
            self[method]();
          }
          return event.preventDefault();
        });
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js","http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"]};;

  return module.exports;
},"test/hotkeys":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Hotkeys;

  Hotkeys = require("../main");

  describe("hotkeys", function() {
    return it("should be hot", function(done) {
      var hotkeys;
      hotkeys = Hotkeys();
      hotkeys.addHotkey("a", function() {
        return done();
      });
      return $(document).trigger($.Event("keydown", {
        which: 65,
        keyCode: 65
      }));
    });
  });

}).call(this);

//# sourceURL=test/hotkeys.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"main","remoteDependencies":{"0":"//code.jquery.com/jquery-1.10.1.min.js","1":"http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"},"repository":{"id":14673639,"name":"hotkeys","full_name":"distri/hotkeys","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/hotkeys","description":"Hotkeys module for editors","fork":false,"url":"https://api.github.com/repos/distri/hotkeys","forks_url":"https://api.github.com/repos/distri/hotkeys/forks","keys_url":"https://api.github.com/repos/distri/hotkeys/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/hotkeys/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/hotkeys/teams","hooks_url":"https://api.github.com/repos/distri/hotkeys/hooks","issue_events_url":"https://api.github.com/repos/distri/hotkeys/issues/events{/number}","events_url":"https://api.github.com/repos/distri/hotkeys/events","assignees_url":"https://api.github.com/repos/distri/hotkeys/assignees{/user}","branches_url":"https://api.github.com/repos/distri/hotkeys/branches{/branch}","tags_url":"https://api.github.com/repos/distri/hotkeys/tags","blobs_url":"https://api.github.com/repos/distri/hotkeys/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/hotkeys/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/hotkeys/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/hotkeys/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/hotkeys/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/hotkeys/languages","stargazers_url":"https://api.github.com/repos/distri/hotkeys/stargazers","contributors_url":"https://api.github.com/repos/distri/hotkeys/contributors","subscribers_url":"https://api.github.com/repos/distri/hotkeys/subscribers","subscription_url":"https://api.github.com/repos/distri/hotkeys/subscription","commits_url":"https://api.github.com/repos/distri/hotkeys/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/hotkeys/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/hotkeys/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/hotkeys/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/hotkeys/contents/{+path}","compare_url":"https://api.github.com/repos/distri/hotkeys/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/hotkeys/merges","archive_url":"https://api.github.com/repos/distri/hotkeys/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/hotkeys/downloads","issues_url":"https://api.github.com/repos/distri/hotkeys/issues{/number}","pulls_url":"https://api.github.com/repos/distri/hotkeys/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/hotkeys/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/hotkeys/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/hotkeys/labels{/name}","releases_url":"https://api.github.com/repos/distri/hotkeys/releases{/id}","created_at":"2013-11-25T01:55:42Z","updated_at":"2013-11-25T02:03:57Z","pushed_at":"2013-11-25T02:03:56Z","git_url":"git://github.com/distri/hotkeys.git","ssh_url":"git@github.com:distri/hotkeys.git","clone_url":"https://github.com/distri/hotkeys.git","svn_url":"https://github.com/distri/hotkeys","homepage":null,"size":264,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":2,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{}},"jquery-utils":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"jquery-utils\n============\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"    require \"hotkeys\"\n    require \"image-reader\"\n    require \"./take_class\"\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n]\ndependencies:\n  hotkeys: \"distri/jquery-hotkeys:v0.9.2\"\n  \"image-reader\": \"distri/jquery-image_reader:v0.2.0\"\n","type":"blob"},"take_class.coffee.md":{"path":"take_class.coffee.md","mode":"100644","content":"Take Class\n==========\n\nTake the named class from all the sibling elements. Perfect for something like\nradio buttons.\n\n    (($) ->\n      $.fn.takeClass = (name) ->\n        @addClass(name).siblings().removeClass(name)\n\n        return this\n    )(jQuery)\n","type":"blob"},"test/image_reader.coffee":{"path":"test/image_reader.coffee","mode":"100644","content":"require \"../main\"\n\ndescribe \"jQuery#pasteImageReader\", ->\n  it \"should exist\", ->\n    assert $.fn.pasteImageReader\n\ndescribe \"jQuery#dropImageReader\", ->\n  it \"should exist\", ->\n    assert $.fn.dropImageReader\n","type":"blob"},"test/take_class.coffee":{"path":"test/take_class.coffee","mode":"100644","content":"require \"../main\"\n\ndescribe \"jQuery#takeClass\", ->\n  it \"should exist\", ->\n    assert $.fn.takeClass\n","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("hotkeys");

  require("image-reader");

  require("./take_class");

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js"],"dependencies":{"hotkeys":"distri/jquery-hotkeys:v0.9.2","image-reader":"distri/jquery-image_reader:v0.2.0"}};;

  return module.exports;
},"take_class":function(require, global, module, exports, PACKAGE) {
  (function() {
  (function($) {
    return $.fn.takeClass = function(name) {
      this.addClass(name).siblings().removeClass(name);
      return this;
    };
  })(jQuery);

}).call(this);

//# sourceURL=take_class.coffee;

  return module.exports;
},"test/image_reader":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../main");

  describe("jQuery#pasteImageReader", function() {
    return it("should exist", function() {
      return assert($.fn.pasteImageReader);
    });
  });

  describe("jQuery#dropImageReader", function() {
    return it("should exist", function() {
      return assert($.fn.dropImageReader);
    });
  });

}).call(this);

//# sourceURL=test/image_reader.coffee;

  return module.exports;
},"test/take_class":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../main");

  describe("jQuery#takeClass", function() {
    return it("should exist", function() {
      return assert($.fn.takeClass);
    });
  });

}).call(this);

//# sourceURL=test/take_class.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"main","remoteDependencies":{"0":"//code.jquery.com/jquery-1.10.1.min.js"},"repository":{"id":13183366,"name":"jquery-utils","full_name":"distri/jquery-utils","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/jquery-utils","description":"","fork":false,"url":"https://api.github.com/repos/distri/jquery-utils","forks_url":"https://api.github.com/repos/distri/jquery-utils/forks","keys_url":"https://api.github.com/repos/distri/jquery-utils/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/jquery-utils/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/jquery-utils/teams","hooks_url":"https://api.github.com/repos/distri/jquery-utils/hooks","issue_events_url":"https://api.github.com/repos/distri/jquery-utils/issues/events{/number}","events_url":"https://api.github.com/repos/distri/jquery-utils/events","assignees_url":"https://api.github.com/repos/distri/jquery-utils/assignees{/user}","branches_url":"https://api.github.com/repos/distri/jquery-utils/branches{/branch}","tags_url":"https://api.github.com/repos/distri/jquery-utils/tags","blobs_url":"https://api.github.com/repos/distri/jquery-utils/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/jquery-utils/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/jquery-utils/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/jquery-utils/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/jquery-utils/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/jquery-utils/languages","stargazers_url":"https://api.github.com/repos/distri/jquery-utils/stargazers","contributors_url":"https://api.github.com/repos/distri/jquery-utils/contributors","subscribers_url":"https://api.github.com/repos/distri/jquery-utils/subscribers","subscription_url":"https://api.github.com/repos/distri/jquery-utils/subscription","commits_url":"https://api.github.com/repos/distri/jquery-utils/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/jquery-utils/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/jquery-utils/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/jquery-utils/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/jquery-utils/contents/{+path}","compare_url":"https://api.github.com/repos/distri/jquery-utils/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/jquery-utils/merges","archive_url":"https://api.github.com/repos/distri/jquery-utils/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/jquery-utils/downloads","issues_url":"https://api.github.com/repos/distri/jquery-utils/issues{/number}","pulls_url":"https://api.github.com/repos/distri/jquery-utils/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/jquery-utils/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/jquery-utils/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/jquery-utils/labels{/name}","releases_url":"https://api.github.com/repos/distri/jquery-utils/releases{/id}","created_at":"2013-09-29T00:25:09Z","updated_at":"2013-11-29T20:57:42Z","pushed_at":"2013-10-25T17:28:57Z","git_url":"git://github.com/distri/jquery-utils.git","ssh_url":"git@github.com:distri/jquery-utils.git","clone_url":"https://github.com/distri/jquery-utils.git","svn_url":"https://github.com/distri/jquery-utils","homepage":null,"size":592,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{"hotkeys":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"jquery.hotkeys\n==============\n\njQuery hotkeys plugin\n","type":"blob"},"hotkeys.coffee.md":{"path":"hotkeys.coffee.md","mode":"100644","content":"jQuery Hotkeys Plugin\n=====================\n\nCopyright 2010, John Resig\nDual licensed under the MIT or GPL Version 2 licenses.\n\nBased upon the plugin by Tzury Bar Yochay:\nhttp://github.com/tzuryby/hotkeys\n\nOriginal idea by:\nBinny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/\n\n    if jQuery?\n      ((jQuery) ->\n        isTextAcceptingInput = (element) ->\n          /textarea|select/i.test(element.nodeName) or element.type is \"text\" or element.type is \"password\"\n\n        isFunctionKey = (event) ->\n          (event.type != \"keypress\") && (112 <= event.which <= 123)\n\n        jQuery.hotkeys =\n          version: \"0.9.0\"\n\n          specialKeys:\n            8: \"backspace\"\n            9: \"tab\"\n            13: \"return\"\n            16: \"shift\"\n            17: \"ctrl\"\n            18: \"alt\"\n            19: \"pause\"\n            20: \"capslock\"\n            27: \"esc\"\n            32: \"space\"\n            33: \"pageup\"\n            34: \"pagedown\"\n            35: \"end\"\n            36: \"home\"\n            37: \"left\"\n            38: \"up\"\n            39: \"right\"\n            40: \"down\"\n            45: \"insert\"\n            46: \"del\"\n            96: \"0\"\n            97: \"1\"\n            98: \"2\"\n            99: \"3\"\n            100: \"4\"\n            101: \"5\"\n            102: \"6\"\n            103: \"7\"\n            104: \"8\"\n            105: \"9\"\n            106: \"*\"\n            107: \"+\"\n            109: \"-\"\n            110: \".\"\n            111 : \"/\"\n            112: \"f1\"\n            113: \"f2\"\n            114: \"f3\"\n            115: \"f4\"\n            116: \"f5\"\n            117: \"f6\"\n            118: \"f7\"\n            119: \"f8\"\n            120: \"f9\"\n            121: \"f10\"\n            122: \"f11\"\n            123: \"f12\"\n            144: \"numlock\"\n            145: \"scroll\"\n            186: \";\"\n            187: \"=\"\n            188: \",\"\n            189: \"-\"\n            190: \".\"\n            191: \"/\"\n            219: \"[\"\n            220: \"\\\\\"\n            221: \"]\"\n            222: \"'\"\n            224: \"meta\"\n\n          shiftNums:\n            \"`\": \"~\"\n            \"1\": \"!\"\n            \"2\": \"@\"\n            \"3\": \"#\"\n            \"4\": \"$\"\n            \"5\": \"%\"\n            \"6\": \"^\"\n            \"7\": \"&\"\n            \"8\": \"*\"\n            \"9\": \"(\"\n            \"0\": \")\"\n            \"-\": \"_\"\n            \"=\": \"+\"\n            \";\": \":\"\n            \"'\": \"\\\"\"\n            \",\": \"<\"\n            \".\": \">\"\n            \"/\": \"?\"\n            \"\\\\\": \"|\"\n\n        keyHandler = (handleObj) ->\n          # Only care when a possible input has been specified\n          if typeof handleObj.data != \"string\"\n            return\n\n          origHandler = handleObj.handler\n          keys = handleObj.data.toLowerCase().split(\" \")\n\n          handleObj.handler = (event) ->\n            # Keypress represents characters, not special keys\n            special = event.type != \"keypress\" && jQuery.hotkeys.specialKeys[ event.which ]\n            character = String.fromCharCode( event.which ).toLowerCase()\n            modif = \"\"\n            possible = {}\n            target = event.target\n\n            # check combinations (alt|ctrl|shift+anything)\n            if event.altKey && special != \"alt\"\n              modif += \"alt+\"\n\n            if event.ctrlKey && special != \"ctrl\"\n              modif += \"ctrl+\"\n\n            # TODO: Need to make sure this works consistently across platforms\n            if event.metaKey && !event.ctrlKey && special != \"meta\"\n              modif += \"meta+\"\n\n            # Don't fire in text-accepting inputs that we didn't directly bind to\n            # unless a non-shift modifier key or function key is pressed\n            unless this == target\n              if isTextAcceptingInput(target) && !modif && !isFunctionKey(event)\n                return\n\n            if event.shiftKey && special != \"shift\"\n              modif += \"shift+\"\n\n            if special\n              possible[ modif + special ] = true\n            else\n              possible[ modif + character ] = true\n              possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true\n\n              # \"$\" can be triggered as \"Shift+4\" or \"Shift+$\" or just \"$\"\n              if modif == \"shift+\"\n                possible[ jQuery.hotkeys.shiftNums[ character ] ] = true\n\n            for key in keys\n              if possible[key]\n                return origHandler.apply( this, arguments )\n\n        jQuery.each [ \"keydown\", \"keyup\", \"keypress\" ], ->\n          jQuery.event.special[ this ] = { add: keyHandler }\n\n      )(jQuery)\n    else\n      console.warn \"jQuery not found, no hotkeys added :(\"\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.9.2\"\nentryPoint: \"hotkeys\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n]\n","type":"blob"},"test/hotkeys.coffee":{"path":"test/hotkeys.coffee","mode":"100644","content":"require \"../hotkeys\"\n\ndescribe \"hotkeys binding\", ->\n  it \"should bind a hotkey\", (done) ->\n    $(document).bind \"keydown\", \"a\", ->\n      done()\n\n    $(document).trigger $.Event \"keydown\",\n      which: 65 # a\n      keyCode: 65\n","type":"blob"}},"distribution":{"hotkeys":function(require, global, module, exports, PACKAGE) {
  (function() {
  if (typeof jQuery !== "undefined" && jQuery !== null) {
    (function(jQuery) {
      var isFunctionKey, isTextAcceptingInput, keyHandler;
      isTextAcceptingInput = function(element) {
        return /textarea|select/i.test(element.nodeName) || element.type === "text" || element.type === "password";
      };
      isFunctionKey = function(event) {
        var _ref;
        return (event.type !== "keypress") && ((112 <= (_ref = event.which) && _ref <= 123));
      };
      jQuery.hotkeys = {
        version: "0.9.0",
        specialKeys: {
          8: "backspace",
          9: "tab",
          13: "return",
          16: "shift",
          17: "ctrl",
          18: "alt",
          19: "pause",
          20: "capslock",
          27: "esc",
          32: "space",
          33: "pageup",
          34: "pagedown",
          35: "end",
          36: "home",
          37: "left",
          38: "up",
          39: "right",
          40: "down",
          45: "insert",
          46: "del",
          96: "0",
          97: "1",
          98: "2",
          99: "3",
          100: "4",
          101: "5",
          102: "6",
          103: "7",
          104: "8",
          105: "9",
          106: "*",
          107: "+",
          109: "-",
          110: ".",
          111: "/",
          112: "f1",
          113: "f2",
          114: "f3",
          115: "f4",
          116: "f5",
          117: "f6",
          118: "f7",
          119: "f8",
          120: "f9",
          121: "f10",
          122: "f11",
          123: "f12",
          144: "numlock",
          145: "scroll",
          186: ";",
          187: "=",
          188: ",",
          189: "-",
          190: ".",
          191: "/",
          219: "[",
          220: "\\",
          221: "]",
          222: "'",
          224: "meta"
        },
        shiftNums: {
          "`": "~",
          "1": "!",
          "2": "@",
          "3": "#",
          "4": "$",
          "5": "%",
          "6": "^",
          "7": "&",
          "8": "*",
          "9": "(",
          "0": ")",
          "-": "_",
          "=": "+",
          ";": ":",
          "'": "\"",
          ",": "<",
          ".": ">",
          "/": "?",
          "\\": "|"
        }
      };
      keyHandler = function(handleObj) {
        var keys, origHandler;
        if (typeof handleObj.data !== "string") {
          return;
        }
        origHandler = handleObj.handler;
        keys = handleObj.data.toLowerCase().split(" ");
        return handleObj.handler = function(event) {
          var character, key, modif, possible, special, target, _i, _len;
          special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which];
          character = String.fromCharCode(event.which).toLowerCase();
          modif = "";
          possible = {};
          target = event.target;
          if (event.altKey && special !== "alt") {
            modif += "alt+";
          }
          if (event.ctrlKey && special !== "ctrl") {
            modif += "ctrl+";
          }
          if (event.metaKey && !event.ctrlKey && special !== "meta") {
            modif += "meta+";
          }
          if (this !== target) {
            if (isTextAcceptingInput(target) && !modif && !isFunctionKey(event)) {
              return;
            }
          }
          if (event.shiftKey && special !== "shift") {
            modif += "shift+";
          }
          if (special) {
            possible[modif + special] = true;
          } else {
            possible[modif + character] = true;
            possible[modif + jQuery.hotkeys.shiftNums[character]] = true;
            if (modif === "shift+") {
              possible[jQuery.hotkeys.shiftNums[character]] = true;
            }
          }
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            if (possible[key]) {
              return origHandler.apply(this, arguments);
            }
          }
        };
      };
      return jQuery.each(["keydown", "keyup", "keypress"], function() {
        return jQuery.event.special[this] = {
          add: keyHandler
        };
      });
    })(jQuery);
  } else {
    console.warn("jQuery not found, no hotkeys added :(");
  }

}).call(this);

//# sourceURL=hotkeys.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.9.2","entryPoint":"hotkeys","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js"]};;

  return module.exports;
},"test/hotkeys":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../hotkeys");

  describe("hotkeys binding", function() {
    return it("should bind a hotkey", function(done) {
      $(document).bind("keydown", "a", function() {
        return done();
      });
      return $(document).trigger($.Event("keydown", {
        which: 65,
        keyCode: 65
      }));
    });
  });

}).call(this);

//# sourceURL=test/hotkeys.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.9.2","entryPoint":"hotkeys","remoteDependencies":{"0":"//code.jquery.com/jquery-1.10.1.min.js"},"repository":{"id":13182272,"name":"jquery-hotkeys","full_name":"distri/jquery-hotkeys","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/jquery-hotkeys","description":"jQuery hotkeys plugin","fork":false,"url":"https://api.github.com/repos/distri/jquery-hotkeys","forks_url":"https://api.github.com/repos/distri/jquery-hotkeys/forks","keys_url":"https://api.github.com/repos/distri/jquery-hotkeys/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/jquery-hotkeys/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/jquery-hotkeys/teams","hooks_url":"https://api.github.com/repos/distri/jquery-hotkeys/hooks","issue_events_url":"https://api.github.com/repos/distri/jquery-hotkeys/issues/events{/number}","events_url":"https://api.github.com/repos/distri/jquery-hotkeys/events","assignees_url":"https://api.github.com/repos/distri/jquery-hotkeys/assignees{/user}","branches_url":"https://api.github.com/repos/distri/jquery-hotkeys/branches{/branch}","tags_url":"https://api.github.com/repos/distri/jquery-hotkeys/tags","blobs_url":"https://api.github.com/repos/distri/jquery-hotkeys/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/jquery-hotkeys/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/jquery-hotkeys/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/jquery-hotkeys/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/jquery-hotkeys/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/jquery-hotkeys/languages","stargazers_url":"https://api.github.com/repos/distri/jquery-hotkeys/stargazers","contributors_url":"https://api.github.com/repos/distri/jquery-hotkeys/contributors","subscribers_url":"https://api.github.com/repos/distri/jquery-hotkeys/subscribers","subscription_url":"https://api.github.com/repos/distri/jquery-hotkeys/subscription","commits_url":"https://api.github.com/repos/distri/jquery-hotkeys/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/jquery-hotkeys/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/jquery-hotkeys/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/jquery-hotkeys/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/jquery-hotkeys/contents/{+path}","compare_url":"https://api.github.com/repos/distri/jquery-hotkeys/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/jquery-hotkeys/merges","archive_url":"https://api.github.com/repos/distri/jquery-hotkeys/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/jquery-hotkeys/downloads","issues_url":"https://api.github.com/repos/distri/jquery-hotkeys/issues{/number}","pulls_url":"https://api.github.com/repos/distri/jquery-hotkeys/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/jquery-hotkeys/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/jquery-hotkeys/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/jquery-hotkeys/labels{/name}","releases_url":"https://api.github.com/repos/distri/jquery-hotkeys/releases{/id}","created_at":"2013-09-28T22:58:08Z","updated_at":"2013-11-29T20:59:45Z","pushed_at":"2013-09-29T23:55:14Z","git_url":"git://github.com/distri/jquery-hotkeys.git","ssh_url":"git@github.com:distri/jquery-hotkeys.git","clone_url":"https://github.com/distri/jquery-hotkeys.git","svn_url":"https://github.com/distri/jquery-hotkeys","homepage":null,"size":608,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.9.2","defaultBranch":"master"},"dependencies":{}},"image-reader":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"Copyright (c) 2012 Daniel X. Moore\n\nMIT License\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n\"Software\"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\nNONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE\nLIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION\nOF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION\nWITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"# Jquery::ImageReader\n\nHelpful jQuery plugins for dropping and pasting image data.\n\n## Usage\n\n```coffeescript\n$(\"html\").pasteImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n\n$(\"html\").dropImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n```\n\n## Contributing\n\n1. Fork it\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Added some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create new Pull Request\n","type":"blob"},"drop.coffee.md":{"path":"drop.coffee.md","mode":"100644","content":"Drop\n====\n\n    (($) ->\n      $.event.fix = ((originalFix) ->\n        (event) ->\n          event = originalFix.apply(this, arguments)\n\n          if event.type.indexOf('drag') == 0 || event.type.indexOf('drop') == 0\n            event.dataTransfer = event.originalEvent.dataTransfer\n\n          event\n\n      )($.event.fix)\n\n      defaults =\n        callback: $.noop\n        matchType: /image.*/\n\n      $.fn.dropImageReader = (options) ->\n        if typeof options == \"function\"\n          options =\n            callback: options\n\n        options = $.extend({}, defaults, options)\n\n        stopFn = (event) ->\n          event.stopPropagation()\n          event.preventDefault()\n\n        this.each ->\n          element = this\n          $this = $(this)\n\n          $this.bind 'dragenter dragover dragleave', stopFn\n\n          $this.bind 'drop', (event) ->\n            stopFn(event)\n\n            Array::forEach.call event.dataTransfer.files, (file) ->\n              return unless file.type.match(options.matchType)\n\n              reader = new FileReader()\n\n              reader.onload = (evt) ->\n                options.callback.call element,\n                  dataURL: evt.target.result\n                  event: evt\n                  file: file\n                  name: file.name\n\n              reader.readAsDataURL(file)\n\n    )(jQuery)\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"\n    require \"./paste\"\n    require \"./drop\"\n","type":"blob"},"paste.coffee.md":{"path":"paste.coffee.md","mode":"100644","content":"Paste\n=====\n\n    (($) ->\n      $.event.fix = ((originalFix) ->\n        (event) ->\n          event = originalFix.apply(this, arguments)\n\n          if event.type.indexOf('copy') == 0 || event.type.indexOf('paste') == 0\n            event.clipboardData = event.originalEvent.clipboardData\n\n          return event\n\n      )($.event.fix)\n\n      defaults =\n        callback: $.noop\n        matchType: /image.*/\n\n      $.fn.pasteImageReader = (options) ->\n        if typeof options == \"function\"\n          options =\n            callback: options\n\n        options = $.extend({}, defaults, options)\n\n        @each ->\n          element = this\n          $this = $(this)\n\n          $this.bind 'paste', (event) ->\n            found = false\n            clipboardData = event.clipboardData\n\n            Array::forEach.call clipboardData.types, (type, i) ->\n              return if found\n\n              if type.match(options.matchType) or (clipboardData.items && clipboardData.items[i].type.match(options.matchType))\n                file = clipboardData.items[i].getAsFile()\n\n                reader = new FileReader()\n\n                reader.onload = (evt) ->\n                  options.callback.call element,\n                    dataURL: evt.target.result\n                    event: evt\n                    file: file\n                    name: file.name\n\n                reader.readAsDataURL(file)\n\n                found = true\n\n    )(jQuery)\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.2.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n]\n","type":"blob"},"test/image_reader.coffee":{"path":"test/image_reader.coffee","mode":"100644","content":"require \"../main\"\n\n$(\"html\").pasteImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n\n$(\"html\").dropImageReader ({name, dataURL, file, event}) ->\n  $(\"body\").css\n    backgroundImage: \"url(#{dataURL})\"\n","type":"blob"}},"distribution":{"drop":function(require, global, module, exports, PACKAGE) {
  (function() {
  (function($) {
    var defaults;
    $.event.fix = (function(originalFix) {
      return function(event) {
        event = originalFix.apply(this, arguments);
        if (event.type.indexOf('drag') === 0 || event.type.indexOf('drop') === 0) {
          event.dataTransfer = event.originalEvent.dataTransfer;
        }
        return event;
      };
    })($.event.fix);
    defaults = {
      callback: $.noop,
      matchType: /image.*/
    };
    return $.fn.dropImageReader = function(options) {
      var stopFn;
      if (typeof options === "function") {
        options = {
          callback: options
        };
      }
      options = $.extend({}, defaults, options);
      stopFn = function(event) {
        event.stopPropagation();
        return event.preventDefault();
      };
      return this.each(function() {
        var $this, element;
        element = this;
        $this = $(this);
        $this.bind('dragenter dragover dragleave', stopFn);
        return $this.bind('drop', function(event) {
          stopFn(event);
          return Array.prototype.forEach.call(event.dataTransfer.files, function(file) {
            var reader;
            if (!file.type.match(options.matchType)) {
              return;
            }
            reader = new FileReader();
            reader.onload = function(evt) {
              return options.callback.call(element, {
                dataURL: evt.target.result,
                event: evt,
                file: file,
                name: file.name
              });
            };
            return reader.readAsDataURL(file);
          });
        });
      });
    };
  })(jQuery);

}).call(this);

//# sourceURL=drop.coffee;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("./paste");

  require("./drop");

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"paste":function(require, global, module, exports, PACKAGE) {
  (function() {
  (function($) {
    var defaults;
    $.event.fix = (function(originalFix) {
      return function(event) {
        event = originalFix.apply(this, arguments);
        if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {
          event.clipboardData = event.originalEvent.clipboardData;
        }
        return event;
      };
    })($.event.fix);
    defaults = {
      callback: $.noop,
      matchType: /image.*/
    };
    return $.fn.pasteImageReader = function(options) {
      if (typeof options === "function") {
        options = {
          callback: options
        };
      }
      options = $.extend({}, defaults, options);
      return this.each(function() {
        var $this, element;
        element = this;
        $this = $(this);
        return $this.bind('paste', function(event) {
          var clipboardData, found;
          found = false;
          clipboardData = event.clipboardData;
          return Array.prototype.forEach.call(clipboardData.types, function(type, i) {
            var file, reader;
            if (found) {
              return;
            }
            if (type.match(options.matchType) || (clipboardData.items && clipboardData.items[i].type.match(options.matchType))) {
              file = clipboardData.items[i].getAsFile();
              reader = new FileReader();
              reader.onload = function(evt) {
                return options.callback.call(element, {
                  dataURL: evt.target.result,
                  event: evt,
                  file: file,
                  name: file.name
                });
              };
              reader.readAsDataURL(file);
              return found = true;
            }
          });
        });
      });
    };
  })(jQuery);

}).call(this);

//# sourceURL=paste.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js"]};;

  return module.exports;
},"test/image_reader":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../main");

  $("html").pasteImageReader(function(_arg) {
    var dataURL, event, file, name;
    name = _arg.name, dataURL = _arg.dataURL, file = _arg.file, event = _arg.event;
    return $("body").css({
      backgroundImage: "url(" + dataURL + ")"
    });
  });

  $("html").dropImageReader(function(_arg) {
    var dataURL, event, file, name;
    name = _arg.name, dataURL = _arg.dataURL, file = _arg.file, event = _arg.event;
    return $("body").css({
      backgroundImage: "url(" + dataURL + ")"
    });
  });

}).call(this);

//# sourceURL=test/image_reader.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.2.0","entryPoint":"main","remoteDependencies":{"0":"//code.jquery.com/jquery-1.10.1.min.js"},"repository":{"id":4527535,"name":"jquery-image_reader","full_name":"distri/jquery-image_reader","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/jquery-image_reader","description":"Paste and Drop images into web apps","fork":false,"url":"https://api.github.com/repos/distri/jquery-image_reader","forks_url":"https://api.github.com/repos/distri/jquery-image_reader/forks","keys_url":"https://api.github.com/repos/distri/jquery-image_reader/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/jquery-image_reader/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/jquery-image_reader/teams","hooks_url":"https://api.github.com/repos/distri/jquery-image_reader/hooks","issue_events_url":"https://api.github.com/repos/distri/jquery-image_reader/issues/events{/number}","events_url":"https://api.github.com/repos/distri/jquery-image_reader/events","assignees_url":"https://api.github.com/repos/distri/jquery-image_reader/assignees{/user}","branches_url":"https://api.github.com/repos/distri/jquery-image_reader/branches{/branch}","tags_url":"https://api.github.com/repos/distri/jquery-image_reader/tags","blobs_url":"https://api.github.com/repos/distri/jquery-image_reader/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/jquery-image_reader/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/jquery-image_reader/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/jquery-image_reader/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/jquery-image_reader/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/jquery-image_reader/languages","stargazers_url":"https://api.github.com/repos/distri/jquery-image_reader/stargazers","contributors_url":"https://api.github.com/repos/distri/jquery-image_reader/contributors","subscribers_url":"https://api.github.com/repos/distri/jquery-image_reader/subscribers","subscription_url":"https://api.github.com/repos/distri/jquery-image_reader/subscription","commits_url":"https://api.github.com/repos/distri/jquery-image_reader/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/jquery-image_reader/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/jquery-image_reader/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/jquery-image_reader/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/jquery-image_reader/contents/{+path}","compare_url":"https://api.github.com/repos/distri/jquery-image_reader/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/jquery-image_reader/merges","archive_url":"https://api.github.com/repos/distri/jquery-image_reader/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/jquery-image_reader/downloads","issues_url":"https://api.github.com/repos/distri/jquery-image_reader/issues{/number}","pulls_url":"https://api.github.com/repos/distri/jquery-image_reader/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/jquery-image_reader/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/jquery-image_reader/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/jquery-image_reader/labels{/name}","releases_url":"https://api.github.com/repos/distri/jquery-image_reader/releases{/id}","created_at":"2012-06-02T07:12:27Z","updated_at":"2013-11-29T21:02:52Z","pushed_at":"2013-10-30T15:54:19Z","git_url":"git://github.com/distri/jquery-image_reader.git","ssh_url":"git@github.com:distri/jquery-image_reader.git","clone_url":"https://github.com/distri/jquery-image_reader.git","svn_url":"https://github.com/distri/jquery-image_reader","homepage":null,"size":142,"stargazers_count":5,"watchers_count":5,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":1,"mirror_url":null,"open_issues_count":0,"forks":1,"open_issues":0,"watchers":5,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":1,"subscribers_count":1,"branch":"v0.2.0","defaultBranch":"master"},"dependencies":{}}}},"sprite":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"sprite\n======\n\nSprites that can be drawn on an HTML5 canvas.\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"Sprite\n======\n\nThe Sprite class provides a way to load images for use in games.\n\nA sprite is a still 2d image.\n\nAn animation can be created from a collection of sprites.\n\nBy default, images are loaded asynchronously. A proxy object is\nreturned immediately. Even though it has a draw method it will not\ndraw anything to the screen until the image has been loaded.\n\n    LoaderProxy = ->\n      draw: ->\n      fill: ->\n      width: null\n      height: null\n      image: null\n\nCache loaded images\n\n    spriteCache = {}\n\n    Sprite = (image, sourceX, sourceY, width, height) ->\n      sourceX ||= 0\n      sourceY ||= 0\n      width ||= image.width\n      height ||= image.height\n\nDraw this sprite on the given canvas at the given position.\n\n      draw: (canvas, x, y) ->\n        if x.x?\n          {x, y} = x\n\n        canvas.drawImage(\n          image,\n          sourceX,\n          sourceY,\n          width,\n          height,\n          x,\n          y,\n          width,\n          height\n        )\n\nDraw this sprite on the given canvas tiled to the x, y,\nwidth, and height dimensions specified.\n\nRepeat options can be `repeat-x`, `repeat-y`, `no-repeat`, or `repeat`. Defaults to `repeat`\n\n      fill: (canvas, x, y, width, height, repeat=\"repeat\") ->\n        pattern = canvas.createPattern(image, repeat)\n        canvas.drawRect({x, y, width, height, color: pattern})\n\n      width: width\n      height: height\n      image: image\n\nLoads all sprites from a sprite sheet found in\nyour images directory, specified by the name passed in.\n\nReturns an array of sprite objects which will start out empty, but be filled\nonce the image has loaded.\n\n    Sprite.loadSheet = (name, tileWidth, tileHeight) ->\n      url = ResourceLoader.urlFor(\"images\", name)\n\n      sprites = []\n      image = new Image()\n\n      image.onload = ->\n        imgElement = this\n        (image.height / tileHeight).times (row) ->\n          (image.width / tileWidth).times (col) ->\n            sprites.push(Sprite(imgElement, col * tileWidth, row * tileHeight, tileWidth, tileHeight))\n\n      image.src = url\n\n      return sprites\n\nLoads a sprite from a given url.\nA second optional callback parameter may be passet wich is executeh once the\nimage is loaded. The sprite proxy data is passed to it as the only parameter.\n\n    Sprite.fromURL = Sprite.load = (url, loadedCallback) ->\n      if sprite = spriteCache[url]\n        if loadedCallback?\n          defer loadedCallback, sprite\n\n        return sprite\n\n      spriteCache[url] = proxy = LoaderProxy()\n      img = new Image()\n\n      img.onload = ->\n        extend(proxy, Sprite(this))\n\n        loadedCallback?(proxy)\n\n      img.src = url\n\n      return proxy\n\nA sprite that draws nothing.\n\n    Sprite.EMPTY = Sprite.NONE = LoaderProxy()\n\n    module.exports = Sprite\n\nHelpers\n-------\n\n    extend = (target, sources...) ->\n      for source in sources\n        for name of source\n          target[name] = source[name]\n\n      return target\n\n    defer = (fn, args...) ->\n      setTimeout ->\n        fn(args...)\n      , 1\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.3.0\"\n","type":"blob"},"test/sprite.coffee":{"path":"test/sprite.coffee","mode":"100644","content":"Sprite = require \"../main\"\n\ndescribe \"Sprite\", ->\n  it \"should construct sprites\", ->\n    img = new Image\n\n    assert Sprite(img)\n\n  it \"should construct from data urls\", (done) ->\n    assert Sprite.load(\n      \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAACAAAAAgAIf6nJ0AAACGSURBVEjH7ZTRDYAgDEQP46wdgSEcgdncpX6IpsGUi4HGH+8POLhHSQGYFNpbXugBRImkU+cwwfcHJOpQ49LnrmGClaYS3gACL91RAMGL9CkEfV2d2OnIQII21aGY3wtScwoAMfN2XMJ6QcwtpTHuADYA+azHTRHzH4jz6rlSTK3Br18AcABNHBto+dslMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMS0wOC0yMFQxNDo1NjoxMi0wNzowMIGIK7sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDgtMjBUMTQ6NTY6MTItMDc6MDDw1ZMHAAAAAElFTkSuQmCC\",\n      ->\n        done()\n    )\n","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var LoaderProxy, Sprite, defer, extend, spriteCache,
    __slice = [].slice;

  LoaderProxy = function() {
    return {
      draw: function() {},
      fill: function() {},
      width: null,
      height: null,
      image: null
    };
  };

  spriteCache = {};

  Sprite = function(image, sourceX, sourceY, width, height) {
    sourceX || (sourceX = 0);
    sourceY || (sourceY = 0);
    width || (width = image.width);
    height || (height = image.height);
    return {
      draw: function(canvas, x, y) {
        var _ref;
        if (x.x != null) {
          _ref = x, x = _ref.x, y = _ref.y;
        }
        return canvas.drawImage(image, sourceX, sourceY, width, height, x, y, width, height);
      },
      fill: function(canvas, x, y, width, height, repeat) {
        var pattern;
        if (repeat == null) {
          repeat = "repeat";
        }
        pattern = canvas.createPattern(image, repeat);
        return canvas.drawRect({
          x: x,
          y: y,
          width: width,
          height: height,
          color: pattern
        });
      },
      width: width,
      height: height,
      image: image
    };
  };

  Sprite.loadSheet = function(name, tileWidth, tileHeight) {
    var image, sprites, url;
    url = ResourceLoader.urlFor("images", name);
    sprites = [];
    image = new Image();
    image.onload = function() {
      var imgElement;
      imgElement = this;
      return (image.height / tileHeight).times(function(row) {
        return (image.width / tileWidth).times(function(col) {
          return sprites.push(Sprite(imgElement, col * tileWidth, row * tileHeight, tileWidth, tileHeight));
        });
      });
    };
    image.src = url;
    return sprites;
  };

  Sprite.fromURL = Sprite.load = function(url, loadedCallback) {
    var img, proxy, sprite;
    if (sprite = spriteCache[url]) {
      if (loadedCallback != null) {
        defer(loadedCallback, sprite);
      }
      return sprite;
    }
    spriteCache[url] = proxy = LoaderProxy();
    img = new Image();
    img.onload = function() {
      extend(proxy, Sprite(this));
      return typeof loadedCallback === "function" ? loadedCallback(proxy) : void 0;
    };
    img.src = url;
    return proxy;
  };

  Sprite.EMPTY = Sprite.NONE = LoaderProxy();

  module.exports = Sprite;

  extend = function() {
    var name, source, sources, target, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (name in source) {
        target[name] = source[name];
      }
    }
    return target;
  };

  defer = function() {
    var args, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return setTimeout(function() {
      return fn.apply(null, args);
    }, 1);
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.3.0"};;

  return module.exports;
},"test/sprite":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Sprite;

  Sprite = require("../main");

  describe("Sprite", function() {
    it("should construct sprites", function() {
      var img;
      img = new Image;
      return assert(Sprite(img));
    });
    return it("should construct from data urls", function(done) {
      return assert(Sprite.load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAACAAAAAgAIf6nJ0AAACGSURBVEjH7ZTRDYAgDEQP46wdgSEcgdncpX6IpsGUi4HGH+8POLhHSQGYFNpbXugBRImkU+cwwfcHJOpQ49LnrmGClaYS3gACL91RAMGL9CkEfV2d2OnIQII21aGY3wtScwoAMfN2XMJ6QcwtpTHuADYA+azHTRHzH4jz6rlSTK3Br18AcABNHBto+dslMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMS0wOC0yMFQxNDo1NjoxMi0wNzowMIGIK7sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDgtMjBUMTQ6NTY6MTItMDc6MDDw1ZMHAAAAAElFTkSuQmCC", function() {
        return done();
      }));
    });
  });

}).call(this);

//# sourceURL=test/sprite.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.3.0","entryPoint":"main","repository":{"id":14668729,"name":"sprite","full_name":"distri/sprite","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/sprite","description":"Sprites that can be drawn on an HTML5 canvas.","fork":false,"url":"https://api.github.com/repos/distri/sprite","forks_url":"https://api.github.com/repos/distri/sprite/forks","keys_url":"https://api.github.com/repos/distri/sprite/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/sprite/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/sprite/teams","hooks_url":"https://api.github.com/repos/distri/sprite/hooks","issue_events_url":"https://api.github.com/repos/distri/sprite/issues/events{/number}","events_url":"https://api.github.com/repos/distri/sprite/events","assignees_url":"https://api.github.com/repos/distri/sprite/assignees{/user}","branches_url":"https://api.github.com/repos/distri/sprite/branches{/branch}","tags_url":"https://api.github.com/repos/distri/sprite/tags","blobs_url":"https://api.github.com/repos/distri/sprite/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/sprite/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/sprite/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/sprite/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/sprite/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/sprite/languages","stargazers_url":"https://api.github.com/repos/distri/sprite/stargazers","contributors_url":"https://api.github.com/repos/distri/sprite/contributors","subscribers_url":"https://api.github.com/repos/distri/sprite/subscribers","subscription_url":"https://api.github.com/repos/distri/sprite/subscription","commits_url":"https://api.github.com/repos/distri/sprite/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/sprite/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/sprite/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/sprite/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/sprite/contents/{+path}","compare_url":"https://api.github.com/repos/distri/sprite/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/sprite/merges","archive_url":"https://api.github.com/repos/distri/sprite/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/sprite/downloads","issues_url":"https://api.github.com/repos/distri/sprite/issues{/number}","pulls_url":"https://api.github.com/repos/distri/sprite/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/sprite/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/sprite/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/sprite/labels{/name}","releases_url":"https://api.github.com/repos/distri/sprite/releases{/id}","created_at":"2013-11-24T20:34:55Z","updated_at":"2013-11-29T20:33:05Z","pushed_at":"2013-11-29T20:33:04Z","git_url":"git://github.com/distri/sprite.git","ssh_url":"git@github.com:distri/sprite.git","clone_url":"https://github.com/distri/sprite.git","svn_url":"https://github.com/distri/sprite","homepage":null,"size":136,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.3.0","defaultBranch":"master"},"dependencies":{}},"touch-canvas":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"touch-canvas\n============\n\nA canvas you can touch\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"entryPoint: \"touch_canvas\"\nversion: \"0.3.0\"\nremoteDependencies: [\n  \"//code.jquery.com/jquery-1.10.1.min.js\"\n  \"http://strd6.github.io/tempest/javascripts/envweb.js\"\n]\ndependencies:\n  \"pixie-canvas\": \"distri/pixie-canvas:v0.9.1\"\n","type":"blob"},"touch_canvas.coffee.md":{"path":"touch_canvas.coffee.md","mode":"100644","content":"Touch Canvas\n============\n\nA canvas element that reports mouse and touch events in the range [0, 1].\n\n    PixieCanvas = require \"pixie-canvas\"\n\nA number really close to 1. We should never actually return 1, but move events\nmay get a little fast and loose with exiting the canvas, so let's play it safe.\n\n    MAX = 0.999999999999\n\n    TouchCanvas = (I={}) ->\n      self = PixieCanvas I\n\n      Core(I, self)\n\n      self.include Bindable\n\n      element = self.element()\n\n      # Keep track of if the mouse is active in the element\n      active = false\n\nWhen we click within the canvas set the value for the position we clicked at.\n\n      $(element).on \"mousedown\", (e) ->\n        active = true\n\n        self.trigger \"touch\", localPosition(e)\n\nHandle touch starts\n\n      $(element).on \"touchstart\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"touch\", localPosition(touch)\n\nWhen the mouse moves apply a change for each x value in the intervening positions.\n\n      $(element).on \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle moves outside of the element.\n\n      $(document).on \"mousemove\", (e) ->\n        if active\n          self.trigger \"move\", localPosition(e)\n\nHandle touch moves.\n\n      $(element).on \"touchmove\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"move\", localPosition(touch)\n\nHandle releases.\n\n      $(element).on \"mouseup\", (e) ->\n        self.trigger \"release\", localPosition(e)\n        active = false\n\n        return\n\nHandle touch ends.\n\n      $(element).on \"touchend\", (e) ->\n        # Global `event`\n        processTouches event, (touch) ->\n          self.trigger \"release\", localPosition(touch)\n\nWhenever the mouse button is released from anywhere, deactivate. Be sure to\ntrigger the release event if the mousedown started within the element.\n\n      $(document).on \"mouseup\", (e) ->\n        if active\n          self.trigger \"release\", localPosition(e)\n\n        active = false\n\n        return\n\nHelpers\n-------\n\nProcess touches\n\n      processTouches = (event, fn) ->\n        event.preventDefault()\n\n        if event.type is \"touchend\"\n          # touchend doesn't have any touches, but does have changed touches\n          touches = event.changedTouches\n        else\n          touches = event.touches\n\n        self.debug? Array::map.call touches, ({identifier, pageX, pageY}) ->\n          \"[#{identifier}: #{pageX}, #{pageY} (#{event.type})]\\n\"\n\n        Array::forEach.call touches, fn\n\nLocal event position.\n\n      localPosition = (e) ->\n        $currentTarget = $(element)\n        offset = $currentTarget.offset()\n\n        width = $currentTarget.width()\n        height = $currentTarget.height()\n\n        point = Point(\n          ((e.pageX - offset.left) / width).clamp(0, MAX)\n          ((e.pageY - offset.top) / height).clamp(0, MAX)\n        )\n\n        # Add mouse into touch identifiers as 0\n        point.identifier = (e.identifier + 1) or 0\n\n        return point\n\nReturn self\n\n      return self\n\nExport\n\n    module.exports = TouchCanvas\n","type":"blob"}},"distribution":{"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"touch_canvas","version":"0.3.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js","http://strd6.github.io/tempest/javascripts/envweb.js"],"dependencies":{"pixie-canvas":"distri/pixie-canvas:v0.9.1"}};;

  return module.exports;
},"touch_canvas":function(require, global, module, exports, PACKAGE) {
  (function() {
  var MAX, PixieCanvas, TouchCanvas;

  PixieCanvas = require("pixie-canvas");

  MAX = 0.999999999999;

  TouchCanvas = function(I) {
    var active, element, localPosition, processTouches, self;
    if (I == null) {
      I = {};
    }
    self = PixieCanvas(I);
    Core(I, self);
    self.include(Bindable);
    element = self.element();
    active = false;
    $(element).on("mousedown", function(e) {
      active = true;
      return self.trigger("touch", localPosition(e));
    });
    $(element).on("touchstart", function(e) {
      return processTouches(event, function(touch) {
        return self.trigger("touch", localPosition(touch));
      });
    });
    $(element).on("mousemove", function(e) {
      if (active) {
        return self.trigger("move", localPosition(e));
      }
    });
    $(document).on("mousemove", function(e) {
      if (active) {
        return self.trigger("move", localPosition(e));
      }
    });
    $(element).on("touchmove", function(e) {
      return processTouches(event, function(touch) {
        return self.trigger("move", localPosition(touch));
      });
    });
    $(element).on("mouseup", function(e) {
      self.trigger("release", localPosition(e));
      active = false;
    });
    $(element).on("touchend", function(e) {
      return processTouches(event, function(touch) {
        return self.trigger("release", localPosition(touch));
      });
    });
    $(document).on("mouseup", function(e) {
      if (active) {
        self.trigger("release", localPosition(e));
      }
      active = false;
    });
    processTouches = function(event, fn) {
      var touches;
      event.preventDefault();
      if (event.type === "touchend") {
        touches = event.changedTouches;
      } else {
        touches = event.touches;
      }
      if (typeof self.debug === "function") {
        self.debug(Array.prototype.map.call(touches, function(_arg) {
          var identifier, pageX, pageY;
          identifier = _arg.identifier, pageX = _arg.pageX, pageY = _arg.pageY;
          return "[" + identifier + ": " + pageX + ", " + pageY + " (" + event.type + ")]\n";
        }));
      }
      return Array.prototype.forEach.call(touches, fn);
    };
    localPosition = function(e) {
      var $currentTarget, height, offset, point, width;
      $currentTarget = $(element);
      offset = $currentTarget.offset();
      width = $currentTarget.width();
      height = $currentTarget.height();
      point = Point(((e.pageX - offset.left) / width).clamp(0, MAX), ((e.pageY - offset.top) / height).clamp(0, MAX));
      point.identifier = (e.identifier + 1) || 0;
      return point;
    };
    return self;
  };

  module.exports = TouchCanvas;

}).call(this);

//# sourceURL=touch_canvas.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.3.0","entryPoint":"touch_canvas","remoteDependencies":{"0":"//code.jquery.com/jquery-1.10.1.min.js","1":"http://strd6.github.io/tempest/javascripts/envweb.js"},"repository":{"id":13783983,"name":"touch-canvas","full_name":"distri/touch-canvas","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/touch-canvas","description":"A canvas you can touch","fork":false,"url":"https://api.github.com/repos/distri/touch-canvas","forks_url":"https://api.github.com/repos/distri/touch-canvas/forks","keys_url":"https://api.github.com/repos/distri/touch-canvas/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/touch-canvas/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/touch-canvas/teams","hooks_url":"https://api.github.com/repos/distri/touch-canvas/hooks","issue_events_url":"https://api.github.com/repos/distri/touch-canvas/issues/events{/number}","events_url":"https://api.github.com/repos/distri/touch-canvas/events","assignees_url":"https://api.github.com/repos/distri/touch-canvas/assignees{/user}","branches_url":"https://api.github.com/repos/distri/touch-canvas/branches{/branch}","tags_url":"https://api.github.com/repos/distri/touch-canvas/tags","blobs_url":"https://api.github.com/repos/distri/touch-canvas/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/touch-canvas/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/touch-canvas/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/touch-canvas/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/touch-canvas/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/touch-canvas/languages","stargazers_url":"https://api.github.com/repos/distri/touch-canvas/stargazers","contributors_url":"https://api.github.com/repos/distri/touch-canvas/contributors","subscribers_url":"https://api.github.com/repos/distri/touch-canvas/subscribers","subscription_url":"https://api.github.com/repos/distri/touch-canvas/subscription","commits_url":"https://api.github.com/repos/distri/touch-canvas/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/touch-canvas/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/touch-canvas/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/touch-canvas/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/touch-canvas/contents/{+path}","compare_url":"https://api.github.com/repos/distri/touch-canvas/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/touch-canvas/merges","archive_url":"https://api.github.com/repos/distri/touch-canvas/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/touch-canvas/downloads","issues_url":"https://api.github.com/repos/distri/touch-canvas/issues{/number}","pulls_url":"https://api.github.com/repos/distri/touch-canvas/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/touch-canvas/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/touch-canvas/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/touch-canvas/labels{/name}","releases_url":"https://api.github.com/repos/distri/touch-canvas/releases{/id}","created_at":"2013-10-22T19:46:48Z","updated_at":"2013-11-29T20:39:31Z","pushed_at":"2013-11-29T20:38:52Z","git_url":"git://github.com/distri/touch-canvas.git","ssh_url":"git@github.com:distri/touch-canvas.git","clone_url":"https://github.com/distri/touch-canvas.git","svn_url":"https://github.com/distri/touch-canvas","homepage":null,"size":2900,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.3.0","defaultBranch":"master"},"dependencies":{"pixie-canvas":{"source":{"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"entryPoint: \"pixie_canvas\"\nversion: \"0.9.1\"\n","type":"blob"},"pixie_canvas.coffee.md":{"path":"pixie_canvas.coffee.md","mode":"100644","content":"Pixie Canvas\n============\n\nPixieCanvas provides a convenient wrapper for working with Context2d.\n\nMethods try to be as flexible as possible as to what arguments they take.\n\nNon-getter methods return `this` for method chaining.\n\n    TAU = 2 * Math.PI\n\n    module.exports = (options={}) ->\n        defaults options,\n          width: 400\n          height: 400\n          init: ->\n\n        canvas = document.createElement \"canvas\"\n        canvas.width = options.width\n        canvas.height = options.height\n\n        context = undefined\n\n        self =\n\n`clear` clears the entire canvas (or a portion of it).\n\nTo clear the entire canvas use `canvas.clear()`\n\n>     #! paint\n>     # Set up: Fill canvas with blue\n>     canvas.fill(\"blue\")\n>\n>     # Clear a portion of the canvas\n>     canvas.clear\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n\n          clear: ({x, y, width, height}={}) ->\n            x ?= 0\n            y ?= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            context.clearRect(x, y, width, height)\n\n            return this\n\nFills the entire canvas (or a specified section of it) with\nthe given color.\n\n>     #! paint\n>     # Paint the town (entire canvas) red\n>     canvas.fill \"red\"\n>\n>     # Fill a section of the canvas white (#FFF)\n>     canvas.fill\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#FFF\"\n\n          fill: (color={}) ->\n            unless (typeof color is \"string\") or color.channels\n              {x, y, width, height, bounds, color} = color\n\n            {x, y, width, height} = bounds if bounds\n\n            x ||= 0\n            y ||= 0\n            width = canvas.width unless width?\n            height = canvas.height unless height?\n\n            @fillColor(color)\n            context.fillRect(x, y, width, height)\n\n            return this\n\nA direct map to the Context2d draw image. `GameObject`s\nthat implement drawable will have this wrapped up nicely,\nso there is a good chance that you will not have to deal with\nit directly.\n\n>     #! paint\n>     $ \"<img>\",\n>       src: \"https://secure.gravatar.com/avatar/33117162fff8a9cf50544a604f60c045\"\n>       load: ->\n>         canvas.drawImage(this, 25, 25)\n\n          drawImage: (args...) ->\n            context.drawImage(args...)\n\n            return this\n\nDraws a circle at the specified position with the specified\nradius and color.\n\n>     #! paint\n>     # Draw a large orange circle\n>     canvas.drawCircle\n>       radius: 30\n>       position: Point(100, 75)\n>       color: \"orange\"\n>\n>     # You may also set a stroke\n>     canvas.drawCircle\n>       x: 25\n>       y: 50\n>       radius: 10\n>       color: \"blue\"\n>       stroke:\n>         color: \"red\"\n>         width: 1\n\nYou can pass in circle objects as well.\n\n>     #! paint\n>     # Create a circle object to set up the next examples\n>     circle =\n>       radius: 20\n>       x: 50\n>       y: 50\n>\n>     # Draw a given circle in yellow\n>     canvas.drawCircle\n>       circle: circle\n>       color: \"yellow\"\n>\n>     # Draw the circle in green at a different position\n>     canvas.drawCircle\n>       circle: circle\n>       position: Point(25, 75)\n>       color: \"green\"\n\nYou may set a stroke, or even pass in only a stroke to draw an unfilled circle.\n\n>     #! paint\n>     # Draw an outline circle in purple.\n>     canvas.drawCircle\n>       x: 50\n>       y: 75\n>       radius: 10\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n>\n\n          drawCircle: ({x, y, radius, position, color, stroke, circle}) ->\n            {x, y, radius} = circle if circle\n            {x, y} = position if position\n\n            radius = 0 if radius < 0\n\n            context.beginPath()\n            context.arc(x, y, radius, 0, TAU, true)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return this\n\nDraws a rectangle at the specified position with given\nwidth and height. Optionally takes a position, bounds\nand color argument.\n\n\n          drawRect: ({x, y, width, height, position, bounds, color, stroke}) ->\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            if color\n              @fillColor(color)\n              context.fillRect(x, y, width, height)\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.strokeRect(x, y, width, height)\n\n            return @\n\n>     #! paint\n>     # Draw a red rectangle using x, y, width and height\n>     canvas.drawRect\n>       x: 50\n>       y: 50\n>       width: 50\n>       height: 50\n>       color: \"#F00\"\n\n----\n\nYou can mix and match position, witdth and height.\n\n>     #! paint\n>     canvas.drawRect\n>       position: Point(0, 0)\n>       width: 50\n>       height: 50\n>       color: \"blue\"\n>       stroke:\n>         color: \"orange\"\n>         width: 3\n\n----\n\nA bounds can be reused to draw multiple rectangles.\n\n>     #! paint\n>     bounds =\n>       x: 100\n>       y: 0\n>       width: 100\n>       height: 100\n>\n>     # Draw a purple rectangle using bounds\n>     canvas.drawRect\n>       bounds: bounds\n>       color: \"green\"\n>\n>     # Draw the outline of the same bounds, but at a different position\n>     canvas.drawRect\n>       bounds: bounds\n>       position: Point(0, 50)\n>       stroke:\n>         color: \"purple\"\n>         width: 2\n\n----\n\nDraw a line from `start` to `end`.\n\n>     #! paint\n>     # Draw a sweet diagonal\n>     canvas.drawLine\n>       start: Point(0, 0)\n>       end: Point(200, 200)\n>       color: \"purple\"\n>\n>     # Draw another sweet diagonal\n>     canvas.drawLine\n>       start: Point(200, 0)\n>       end: Point(0, 200)\n>       color: \"red\"\n>       width: 6\n>\n>     # Now draw a sweet horizontal with a direction and a length\n>     canvas.drawLine\n>       start: Point(0, 100)\n>       length: 200\n>       direction: Point(1, 0)\n>       color: \"orange\"\n\n          drawLine: ({start, end, width, color, direction, length}) ->\n            width ||= 3\n\n            if direction\n              end = direction.norm(length).add(start)\n\n            @lineWidth(width)\n            @strokeColor(color)\n\n            context.beginPath()\n            context.moveTo(start.x, start.y)\n            context.lineTo(end.x, end.y)\n            context.closePath()\n            context.stroke()\n\n            return this\n\nDraw a polygon.\n\n>     #! paint\n>     # Draw a sweet rhombus\n>     canvas.drawPoly\n>       points: [\n>         Point(50, 25)\n>         Point(75, 50)\n>         Point(50, 75)\n>         Point(25, 50)\n>       ]\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawPoly: ({points, color, stroke}) ->\n            context.beginPath()\n            points.forEach (point, i) ->\n              if i == 0\n                context.moveTo(point.x, point.y)\n              else\n                context.lineTo(point.x, point.y)\n            context.lineTo points[0].x, points[0].y\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @strokeColor(stroke.color)\n              @lineWidth(stroke.width)\n              context.stroke()\n\n            return @\n\nDraw a rounded rectangle.\n\nAdapted from http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html\n\n>     #! paint\n>     # Draw a purple rounded rectangle with a red outline\n>     canvas.drawRoundRect\n>       position: Point(25, 25)\n>       radius: 10\n>       width: 150\n>       height: 100\n>       color: \"purple\"\n>       stroke:\n>         color: \"red\"\n>         width: 2\n\n          drawRoundRect: ({x, y, width, height, radius, position, bounds, color, stroke}) ->\n            radius = 5 unless radius?\n\n            {x, y, width, height} = bounds if bounds\n            {x, y} = position if position\n\n            context.beginPath()\n            context.moveTo(x + radius, y)\n            context.lineTo(x + width - radius, y)\n            context.quadraticCurveTo(x + width, y, x + width, y + radius)\n            context.lineTo(x + width, y + height - radius)\n            context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)\n            context.lineTo(x + radius, y + height)\n            context.quadraticCurveTo(x, y + height, x, y + height - radius)\n            context.lineTo(x, y + radius)\n            context.quadraticCurveTo(x, y, x + radius, y)\n            context.closePath()\n\n            if color\n              @fillColor(color)\n              context.fill()\n\n            if stroke\n              @lineWidth(stroke.width)\n              @strokeColor(stroke.color)\n              context.stroke()\n\n            return this\n\nDraws text on the canvas at the given position, in the given color.\nIf no color is given then the previous fill color is used.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: '#eee'\n>\n>     # A line to indicate the baseline\n>     canvas.drawLine\n>       start: Point(25, 50)\n>       end: Point(125, 50)\n>       color: \"#333\"\n>       width: 1\n>\n>     # Draw some text, note the position of the baseline\n>     canvas.drawText\n>       position: Point(25, 50)\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n\n\n          drawText: ({x, y, text, position, color, font}) ->\n            {x, y} = position if position\n\n            @fillColor(color)\n            @font(font) if font\n            context.fillText(text, x, y)\n\n            return this\n\nCenters the given text on the canvas at the given y position. An x position\nor point position can also be given in which case the text is centered at the\nx, y or position value specified.\n\n>     #! paint\n>     # Fill canvas to indicate bounds\n>     canvas.fill\n>       color: \"#eee\"\n>\n>     # Center text on the screen at y value 25\n>     canvas.centerText\n>       y: 25\n>       color: \"red\"\n>       text: \"It's dangerous to go alone\"\n>\n>     # Center text at point (75, 75)\n>     canvas.centerText\n>       position: Point(75, 75)\n>       color: \"green\"\n>       text: \"take this\"\n\n          centerText: ({text, x, y, position, color, font}) ->\n            {x, y} = position if position\n\n            x = canvas.width / 2 unless x?\n\n            textWidth = @measureText(text)\n\n            @drawText {\n              text\n              color\n              font\n              x: x - (textWidth) / 2\n              y\n            }\n\nSetting the fill color:\n\n`canvas.fillColor(\"#FF0000\")`\n\nPassing no arguments returns the fillColor:\n\n`canvas.fillColor() # => \"#FF000000\"`\n\nYou can also pass a Color object:\n\n`canvas.fillColor(Color('sky blue'))`\n\n          fillColor: (color) ->\n            if color\n              if color.channels\n                context.fillStyle = color.toString()\n              else\n                context.fillStyle = color\n\n              return @\n            else\n              return context.fillStyle\n\nSetting the stroke color:\n\n`canvas.strokeColor(\"#FF0000\")`\n\nPassing no arguments returns the strokeColor:\n\n`canvas.strokeColor() # => \"#FF0000\"`\n\nYou can also pass a Color object:\n\n`canvas.strokeColor(Color('sky blue'))`\n\n          strokeColor: (color) ->\n            if color\n              if color.channels\n                context.strokeStyle = color.toString()\n              else\n                context.strokeStyle = color\n\n              return this\n            else\n              return context.strokeStyle\n\nDetermine how wide some text is.\n\n`canvas.measureText('Hello World!') # => 55`\n\nIt may have accuracy issues depending on the font used.\n\n          measureText: (text) ->\n            context.measureText(text).width\n\nPasses this canvas to the block with the given matrix transformation\napplied. All drawing methods called within the block will draw\ninto the canvas with the transformation applied. The transformation\nis removed at the end of the block, even if the block throws an error.\n\n          withTransform: (matrix, block) ->\n            context.save()\n\n            context.transform(\n              matrix.a,\n              matrix.b,\n              matrix.c,\n              matrix.d,\n              matrix.tx,\n              matrix.ty\n            )\n\n            try\n              block(this)\n            finally\n              context.restore()\n\n            return this\n\nStraight proxy to context `putImageData` method.\n\n          putImageData: (args...) ->\n            context.putImageData(args...)\n\n            return this\n\nContext getter.\n\n          context: ->\n            context\n\nGetter for the actual html canvas element.\n\n          element: ->\n            canvas\n\nStraight proxy to context pattern creation.\n\n          createPattern: (image, repitition) ->\n            context.createPattern(image, repitition)\n\nSet a clip rectangle.\n\n          clip: (x, y, width, height) ->\n            context.beginPath()\n            context.rect(x, y, width, height)\n            context.clip()\n\n            return this\n\nGenerate accessors that get properties from the context object.\n\n        contextAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                context[attr] = newVal\n                return @\n              else\n                context[attr]\n\n        contextAttrAccessor(\n          \"font\",\n          \"globalAlpha\",\n          \"globalCompositeOperation\",\n          \"lineWidth\",\n          \"textAlign\",\n        )\n\nGenerate accessors that get properties from the canvas object.\n\n        canvasAttrAccessor = (attrs...) ->\n          attrs.forEach (attr) ->\n            self[attr] = (newVal) ->\n              if newVal?\n                canvas[attr] = newVal\n                return @\n              else\n                canvas[attr]\n\n        canvasAttrAccessor(\n          \"height\",\n          \"width\",\n        )\n\n        context = canvas.getContext('2d')\n\n        options.init(self)\n\n        return self\n\nDepend on either jQuery or Zepto for now (TODO: Don't depend on either)\n\nHelpers\n-------\n\nFill in default properties for an object, setting them only if they are not\nalready present.\n\n    defaults = (target, objects...) ->\n      for object in objects\n        for name of object\n          unless target.hasOwnProperty(name)\n            target[name] = object[name]\n\n      return target\n\nInteractive Examples\n--------------------\n\n>     #! setup\n>     Canvas = require \"/pixie_canvas\"\n>\n>     window.Point ?= (x, y) ->\n>       x: x\n>       y: y\n>\n>     Interactive.register \"paint\", ({source, runtimeElement}) ->\n>       canvas = Canvas\n>         width: 400\n>         height: 200\n>\n>       code = CoffeeScript.compile(source)\n>\n>       runtimeElement.empty().append canvas.element()\n>       Function(\"canvas\", code)(canvas)\n","type":"blob"},"test/test.coffee":{"path":"test/test.coffee","mode":"100644","content":"Canvas = require \"../pixie_canvas\"\n\ndescribe \"pixie canvas\", ->\n  it \"Should create a canvas\", ->\n    canvas = Canvas\n      width: 400\n      height: 150\n\n    assert canvas\n    \n    assert canvas.width() is 400\n","type":"blob"}},"distribution":{"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"pixie_canvas","version":"0.9.1"};;

  return module.exports;
},"pixie_canvas":function(require, global, module, exports, PACKAGE) {
  (function() {
  var TAU, defaults,
    __slice = [].slice;

  TAU = 2 * Math.PI;

  module.exports = function(options) {
    var canvas, canvasAttrAccessor, context, contextAttrAccessor, self;
    if (options == null) {
      options = {};
    }
    defaults(options, {
      width: 400,
      height: 400,
      init: function() {}
    });
    canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    context = void 0;
    self = {
      clear: function(_arg) {
        var height, width, x, y, _ref;
        _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height;
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        if (width == null) {
          width = canvas.width;
        }
        if (height == null) {
          height = canvas.height;
        }
        context.clearRect(x, y, width, height);
        return this;
      },
      fill: function(color) {
        var bounds, height, width, x, y, _ref;
        if (color == null) {
          color = {};
        }
        if (!((typeof color === "string") || color.channels)) {
          _ref = color, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height, bounds = _ref.bounds, color = _ref.color;
        }
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        x || (x = 0);
        y || (y = 0);
        if (width == null) {
          width = canvas.width;
        }
        if (height == null) {
          height = canvas.height;
        }
        this.fillColor(color);
        context.fillRect(x, y, width, height);
        return this;
      },
      drawImage: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        context.drawImage.apply(context, args);
        return this;
      },
      drawCircle: function(_arg) {
        var circle, color, position, radius, stroke, x, y;
        x = _arg.x, y = _arg.y, radius = _arg.radius, position = _arg.position, color = _arg.color, stroke = _arg.stroke, circle = _arg.circle;
        if (circle) {
          x = circle.x, y = circle.y, radius = circle.radius;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        if (radius < 0) {
          radius = 0;
        }
        context.beginPath();
        context.arc(x, y, radius, 0, TAU, true);
        context.closePath();
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.stroke();
        }
        return this;
      },
      drawRect: function(_arg) {
        var bounds, color, height, position, stroke, width, x, y;
        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        if (color) {
          this.fillColor(color);
          context.fillRect(x, y, width, height);
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.strokeRect(x, y, width, height);
        }
        return this;
      },
      drawLine: function(_arg) {
        var color, direction, end, length, start, width;
        start = _arg.start, end = _arg.end, width = _arg.width, color = _arg.color, direction = _arg.direction, length = _arg.length;
        width || (width = 3);
        if (direction) {
          end = direction.norm(length).add(start);
        }
        this.lineWidth(width);
        this.strokeColor(color);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        context.stroke();
        return this;
      },
      drawPoly: function(_arg) {
        var color, points, stroke;
        points = _arg.points, color = _arg.color, stroke = _arg.stroke;
        context.beginPath();
        points.forEach(function(point, i) {
          if (i === 0) {
            return context.moveTo(point.x, point.y);
          } else {
            return context.lineTo(point.x, point.y);
          }
        });
        context.lineTo(points[0].x, points[0].y);
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.stroke();
        }
        return this;
      },
      drawRoundRect: function(_arg) {
        var bounds, color, height, position, radius, stroke, width, x, y;
        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, radius = _arg.radius, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;
        if (radius == null) {
          radius = 5;
        }
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.lineWidth(stroke.width);
          this.strokeColor(stroke.color);
          context.stroke();
        }
        return this;
      },
      drawText: function(_arg) {
        var color, font, position, text, x, y;
        x = _arg.x, y = _arg.y, text = _arg.text, position = _arg.position, color = _arg.color, font = _arg.font;
        if (position) {
          x = position.x, y = position.y;
        }
        this.fillColor(color);
        if (font) {
          this.font(font);
        }
        context.fillText(text, x, y);
        return this;
      },
      centerText: function(_arg) {
        var color, font, position, text, textWidth, x, y;
        text = _arg.text, x = _arg.x, y = _arg.y, position = _arg.position, color = _arg.color, font = _arg.font;
        if (position) {
          x = position.x, y = position.y;
        }
        if (x == null) {
          x = canvas.width / 2;
        }
        textWidth = this.measureText(text);
        return this.drawText({
          text: text,
          color: color,
          font: font,
          x: x - textWidth / 2,
          y: y
        });
      },
      fillColor: function(color) {
        if (color) {
          if (color.channels) {
            context.fillStyle = color.toString();
          } else {
            context.fillStyle = color;
          }
          return this;
        } else {
          return context.fillStyle;
        }
      },
      strokeColor: function(color) {
        if (color) {
          if (color.channels) {
            context.strokeStyle = color.toString();
          } else {
            context.strokeStyle = color;
          }
          return this;
        } else {
          return context.strokeStyle;
        }
      },
      measureText: function(text) {
        return context.measureText(text).width;
      },
      withTransform: function(matrix, block) {
        context.save();
        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        try {
          block(this);
        } finally {
          context.restore();
        }
        return this;
      },
      putImageData: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        context.putImageData.apply(context, args);
        return this;
      },
      context: function() {
        return context;
      },
      element: function() {
        return canvas;
      },
      createPattern: function(image, repitition) {
        return context.createPattern(image, repitition);
      },
      clip: function(x, y, width, height) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.clip();
        return this;
      }
    };
    contextAttrAccessor = function() {
      var attrs;
      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return attrs.forEach(function(attr) {
        return self[attr] = function(newVal) {
          if (newVal != null) {
            context[attr] = newVal;
            return this;
          } else {
            return context[attr];
          }
        };
      });
    };
    contextAttrAccessor("font", "globalAlpha", "globalCompositeOperation", "lineWidth", "textAlign");
    canvasAttrAccessor = function() {
      var attrs;
      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return attrs.forEach(function(attr) {
        return self[attr] = function(newVal) {
          if (newVal != null) {
            canvas[attr] = newVal;
            return this;
          } else {
            return canvas[attr];
          }
        };
      });
    };
    canvasAttrAccessor("height", "width");
    context = canvas.getContext('2d');
    options.init(self);
    return self;
  };

  defaults = function() {
    var name, object, objects, target, _i, _len;
    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      for (name in object) {
        if (!target.hasOwnProperty(name)) {
          target[name] = object[name];
        }
      }
    }
    return target;
  };

}).call(this);

//# sourceURL=pixie_canvas.coffee;

  return module.exports;
},"test/test":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Canvas;

  Canvas = require("../pixie_canvas");

  describe("pixie canvas", function() {
    return it("Should create a canvas", function() {
      var canvas;
      canvas = Canvas({
        width: 400,
        height: 150
      });
      assert(canvas);
      return assert(canvas.width() === 400);
    });
  });

}).call(this);

//# sourceURL=test/test.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.9.1","entryPoint":"pixie_canvas","repository":{"id":12096899,"name":"pixie-canvas","full_name":"distri/pixie-canvas","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/pixie-canvas","description":"A pretty ok HTML5 canvas wrapper","fork":false,"url":"https://api.github.com/repos/distri/pixie-canvas","forks_url":"https://api.github.com/repos/distri/pixie-canvas/forks","keys_url":"https://api.github.com/repos/distri/pixie-canvas/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/pixie-canvas/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/pixie-canvas/teams","hooks_url":"https://api.github.com/repos/distri/pixie-canvas/hooks","issue_events_url":"https://api.github.com/repos/distri/pixie-canvas/issues/events{/number}","events_url":"https://api.github.com/repos/distri/pixie-canvas/events","assignees_url":"https://api.github.com/repos/distri/pixie-canvas/assignees{/user}","branches_url":"https://api.github.com/repos/distri/pixie-canvas/branches{/branch}","tags_url":"https://api.github.com/repos/distri/pixie-canvas/tags","blobs_url":"https://api.github.com/repos/distri/pixie-canvas/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/pixie-canvas/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/pixie-canvas/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/pixie-canvas/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/pixie-canvas/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/pixie-canvas/languages","stargazers_url":"https://api.github.com/repos/distri/pixie-canvas/stargazers","contributors_url":"https://api.github.com/repos/distri/pixie-canvas/contributors","subscribers_url":"https://api.github.com/repos/distri/pixie-canvas/subscribers","subscription_url":"https://api.github.com/repos/distri/pixie-canvas/subscription","commits_url":"https://api.github.com/repos/distri/pixie-canvas/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/pixie-canvas/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/pixie-canvas/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/pixie-canvas/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/pixie-canvas/contents/{+path}","compare_url":"https://api.github.com/repos/distri/pixie-canvas/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/pixie-canvas/merges","archive_url":"https://api.github.com/repos/distri/pixie-canvas/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/pixie-canvas/downloads","issues_url":"https://api.github.com/repos/distri/pixie-canvas/issues{/number}","pulls_url":"https://api.github.com/repos/distri/pixie-canvas/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/pixie-canvas/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/pixie-canvas/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/pixie-canvas/labels{/name}","releases_url":"https://api.github.com/repos/distri/pixie-canvas/releases{/id}","created_at":"2013-08-14T01:15:34Z","updated_at":"2013-11-29T20:35:57Z","pushed_at":"2013-11-29T20:34:09Z","git_url":"git://github.com/distri/pixie-canvas.git","ssh_url":"git@github.com:distri/pixie-canvas.git","clone_url":"https://github.com/distri/pixie-canvas.git","svn_url":"https://github.com/distri/pixie-canvas","homepage":null,"size":2464,"stargazers_count":0,"watchers_count":0,"language":"CoffeeScript","has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":1,"forks":0,"open_issues":1,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":1,"branch":"v0.9.1","defaultBranch":"master"},"dependencies":{}}}}}}}});