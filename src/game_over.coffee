GameOver = (I) ->

  lineHeight = 16

  self = GameObject(I).extend
    draw: (canvas) ->
      canvas.font()
      canvas.centerText("You surf'd for #{I.distance} meters", I.y - lineHeight)
      canvas.centerText("and", I.y)
      canvas.centerText("sur5'd for #{(I.time / 30).toFixed(2)}", I.y + lineHeight)

  return self

