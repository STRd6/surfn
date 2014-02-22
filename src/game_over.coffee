{Util:{defaults}, GameObject} = require "dust"

module.exports = GameObject.registry.GameOver = (I={}) ->
  defaults I,
    zIndex: 10

  lineHeight = 24
  console.log I

  self = GameObject(I)

  self.off "draw"
  self.on "draw", (canvas) ->
      canvas.font("bold 24px consolas, 'Courier New', 'andale mono', 'lucida console', monospace")
      canvas.fillColor("#FFF")

      canvas.drawText("surf'd for #{I.distance.toFixed(2)} meters", -lineHeight)
      canvas.drawText("sur5'd for #{(I.time / 30).toFixed(2)} seconds", 0)
      canvas.drawText("succumb'd to #{I.causeOfDeath}", lineHeight)

  self.on "update", ->
    if keydown.space or keydown.return or keydown.escape
      engine.trigger "restart"

  return self
