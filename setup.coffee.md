Setup
=====

Require a bunch of junk and throw in some hacks for good measure.

    require("analytics").init("UA-3464282-15")

Expose package for debugging.

    global.PACKAGE = PACKAGE

    # TODO: Maybe jQuery should move into Dust since that's what depends on it
    require "jQuery"

Use the Dust game engine.

    Dust = require "dust"

Extract some things we'll need.

    {
      Collision
      Resource
    } = Dust

    {Sound} = Resource

Add our resource files.

    Resource.add
      images: require "./images"
      music: require "./music"
      sounds: require "./sounds"

    # TODO: Clean up globals
    global.Collision = Collision
    global.Sound = Sound

    require "/duct_tape"

Create the engine.

    {width, height} = require "/pixie"

    global.engine = Dust.init
      width: width
      height: height

Register our GameObjects.

TODO: Figure out some sort of auto-registration mechanism.

    engine.register "Cloud", require "./cloud"
    engine.register "Destruction", require "./destruction"
    engine.register "GameOver", require "./game_over"
    engine.register "Player", require "./player"
    engine.register "Rock", require "./rock"
    engine.register "Water", require "./water"
    engine.register "Score", require "./score"
