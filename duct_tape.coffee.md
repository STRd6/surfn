Duct Tape
=========

Load Sprites by named resource.

    {Util:{extend}} = require "dust"
    images = require "./images"

    Sprite.loadByName = (name) ->
      url = images[name]

      Sprite.load(url)

    extend Number.prototype,
      approach: (target, maxDelta) ->
        this + (target - this).clamp(-maxDelta, maxDelta)

      approachByRatio: (target, ratio) ->
        @approach(target, this * ratio)
