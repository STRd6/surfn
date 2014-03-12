Destruction
===========

A rogue wave that will crush the player.

    {Util:{defaults}, GameObject} = require "dust"

    Base = require "./base"

    {width, height} = require "./pixie"

    module.exports = GameObject.registry.Destruction = (I={}) ->
      defaults I,
        color: "red"
        destruction: true
        x: -240
        y: 0
        width: 10
        height: height
        zIndex: 7

      churnSprites = [Sprite.loadByName("churn")]
      waveSprites = ["wave", "wave1"].map (name) ->
        Sprite.loadByName name

      self = GameObject(I)

      self.attrAccessor "destruction"

      self.on "update", (dt) ->
        osc = 30 * Math.sin(Math.TAU * I.age)
        I.x += (osc + 90) * dt

        if player = engine.find("Player").first()
          I.x = I.x.clamp(player.I.x - width/2 + osc, Infinity)

      self.on "draw", (canvas) ->
        waveSprites.wrap((I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height)
        churnSprites.wrap((I.age / 8).floor()).fill(canvas, 0, 0, 32, height)
