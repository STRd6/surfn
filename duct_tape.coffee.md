Duct Tape
=========

Load Sprites by named resource.

    {Util:{extend}} = require "dust"

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
