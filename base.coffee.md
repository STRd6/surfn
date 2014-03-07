Base
====

A common base class for our objects to inherit from.

    {GameObject} = require "dust"

    module.exports = (I) ->

      self = GameObject(I).extend
        center: ->
           Point(I.x, I.y)

      self.on "drawDebug", (canvas) ->
        if I.radius
          center = self.center()
          x = center.x
          y = center.y

          canvas.drawCircle
            x: x
            y: y
            radius: I.radius
            color: "rgba(255, 0, 255, 0.5)"

      self
