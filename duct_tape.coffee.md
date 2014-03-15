Duct Tape
=========

Load Sprites by named resource.

    {Util:{extend}, GameObject, Engine} = require "dust"
    images = require "./images"

    Sprite.loadByName = (name) ->
      # TODO: Decide whether we want sprites or urls in here
      urlOrSprite = images[name]

      if typeof urlOrSprite is "object"
        urlOrSprite
      else
        Sprite.load(urlOrSprite)

    extend Number.prototype,
      approach: (target, maxDelta) ->
        this + (target - this).clamp(-maxDelta, maxDelta)

      approachByRatio: (target, ratio) ->
        @approach(target, this * ratio)

      # TODO: Provide this safety for all number extensions
      floor: ->
        if isNaN(this)
          throw "Can't floor NaN"
        else
          Math.floor(this)
