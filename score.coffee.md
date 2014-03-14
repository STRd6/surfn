Score
=====

Display a score in the upper right of the screen.

    {Util:{defaults}, GameObject} = require "dust"

    module.exports = (I={}) ->
      value = 0

      self = GameObject(I)

      self.on "update", ->
        if player = engine.first("Player")
          value = player.I.distance

      self.off "draw"
      self.on "overlay", (canvas) ->
        canvas.drawText
          color: "white"
          font: "24px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif"
          text: (value / 100).toFixed(2)
          x: 400
          y: 30

      return self
