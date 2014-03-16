Duct Tape
=========

Load Sprites by named resource.

    {Util:{extend}, Resource} = require "dust"

    Resource.add
      images: require "./images"
      music: require "./music"
      sounds: require "./sounds"

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
