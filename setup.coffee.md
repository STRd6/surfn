Setup
=====

Require a bunch of junk and throw in some hacks for good measure.

    # TODO: Maybe jQuery should move into Dust since that's what depends on it
    require "jQuery"

Use the Dust game engine.

    Dust = require "dust"

    # TODO: Clean up globals
    global.Collision = Dust.Collision
    global.Sound = require "/lib/sound"
    global.Music = require "/lib/music"
    
    # TODO: Fix this up a bit, merge into a resource manager
    Sound.play = (name) ->
      sounds = require "/sounds"

      Sound.playFromURL(sounds[name])

    require "/duct_tape"
    
    require "./engine/options"

These register our GameObjects.

    require "./cloud"
    require "./destruction"
    require "./game_over"
    require "./player"
    require "./rock"
    require "./water"
    require "./score"

    {width, height} = require "/pixie"

    global.engine = Dust.init
      width: width
      height: height
