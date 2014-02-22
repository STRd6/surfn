Water
=====

    {Util:{defaults}, GameObject} = require "dust"

    module.exports = GameObject.registry.Water = (I={}) ->
      defaults I,
        color: "blue"
        water: true
        x: 0
        y: 160
        zIndex: 0

      self = GameObject(I)

      self.attrAccessor "water"

      return self
