Base = (I) ->

  self = GameObject(I).extend
    center: ->
       Point(I.x, I.y)

  self.bind "drawDebug", (canvas) ->
    if I.radius
      center = self.center()
      x = center.x
      y = center.y

      canvas.fillCircle(x, y, I.radius, "rgba(255, 0, 255, 0.5)")

  self
