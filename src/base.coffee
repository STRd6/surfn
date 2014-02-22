{GameObject} = require "dust"

module.exports = (I) ->

  self = GameObject(I).extend
    center: ->
       Point(I.x, I.y)

  self.off "draw"

  self.on "draw", (canvas) ->
    if I.sprite
      if I.sprite.draw?
        I.sprite.draw(canvas, -I.width/2, -I.height/2)

  self.on "drawDebug", (canvas) ->
    if I.radius
      center = self.center()
      x = center.x
      y = center.y

      canvas.fillCircle(x, y, I.radius, "rgba(255, 0, 255, 0.5)")

  self
