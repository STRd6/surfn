Water
=====

    {Util:{defaults}, GameObject} = require "dust"

    module.exports = GameObject.registry.Water = (I={}) ->
      defaults I,
        color: "blue"
        water: true
        x: 0
        y: 240
        width: 480
        height: 160
        zIndex: 1

      depthsSprites = [Sprite.loadByName("depths0"), Sprite.loadByName("depths1")]

      self = GameObject(I)

      self.attrAccessor "water"

      self.on "update", ->
        if player = engine.find("Player").first()
          I.x = player.I.x

        amplitude = (15 + I.age)

        if rand(3) is 0 and I.age.mod(90) is 0
          Sound.play("wave")

        I.y = 240 + amplitude * Math.sin(Math.TAU / 4 * I.age)

      self.on "draw", (canvas) ->
        offset = I.x.mod(32)

        canvas.withTransform Matrix.translation(-I.width/2, 0), (canvas) ->
          depthsSprites.wrap((I.age / 8).floor()).fill(canvas, 0, I.height/2, I.width, I.height)

      return self
