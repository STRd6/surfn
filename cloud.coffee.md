Cloud
=====

Just floating along in the background.

    {Util:{defaults}, GameObject} = require "dust"

    Base = require "./base"

    module.exports = GameObject.registry.Cloud = (I) ->
      defaults I,
        spriteName: "cloud"
        height: 32
        width: 128
        y: -60 + rand(240)
        zIndex: 0

      self = Base(I)

      self.on "update", ->
        destruction = engine.find(".destruction").first()

        if destruction
          if I.x < destruction.I.x - I.width
            I.active = false

      self
