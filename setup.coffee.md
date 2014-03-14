Setup
=====

Require a bunch of junk and throw in some hacks for good measure.

Expose package for debugging

    global.PACKAGE = PACKAGE

    # TODO: Maybe jQuery should move into Dust since that's what depends on it
    require "jQuery"

    {applyStylesheet} = require "/lib/util"
    applyStylesheet(require("/style"))

Use the Dust game engine.

    Dust = require "dust"

    # TODO: Clean up globals
    global.Observable = require "observable" # HACK: Needed for HamlJr runtime right now
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
