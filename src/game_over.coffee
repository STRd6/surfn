GameOver = (I) ->
  Object.reverseMerge I,
    zIndex: 10

  lineHeight = 24

  self = GameObject(I).extend
    draw: (canvas) ->
      canvas.font("bold 24px consolas, 'Courier New', 'andale mono', 'lucida console', monospace")
      canvas.fillColor("#FFF")

      canvas.withTransform Matrix.translation(I.x - App.width/2, 0), ->
        canvas.centerText("surf'd for #{I.distance.toFixed(2)} meters", I.y - lineHeight)
        canvas.centerText("sur5'd for #{(I.time / 30).toFixed(2)} seconds", I.y)
        canvas.centerText("succumb'd to #{I.causeOfDeath}", I.y + lineHeight)

  self.bind "update", ->
    if keydown.space || keydown.return || keydown.escape
      engine.trigger "restart"

  return self

