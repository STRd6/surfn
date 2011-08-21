GameOver = (I) ->

  lineHeight = 20

  self = GameObject(I).extend
    draw: (canvas) ->
      canvas.font("bold 24px consolas, 'Courier New', 'andale mono', 'lucida console', monospace")
      canvas.fillColor("#FFF")

      canvas.withTransform Matrix.translation(-App.width/2, 0), ->
        canvas.centerText("You surf'd for #{I.distance} meters", I.y - lineHeight)
        canvas.centerText("and", I.y)
        canvas.centerText("sur5'd for #{(I.time / 30).toFixed(2)} seconds", I.y + lineHeight)

  return self

