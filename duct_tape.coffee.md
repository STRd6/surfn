Duct Tape
=========

Load Sprites by named resource.

    {Util:{extend}, GameObject} = require "dust"
    images = require "./images"

    GameObject.defaultModules.push require "./bounds_extensions"

    Sprite.loadByName = (name) ->
      url = images[name]

      Sprite.load(url)

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
