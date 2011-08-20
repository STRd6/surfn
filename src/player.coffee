Player = (I) ->
  Object.reverseMerge I,
    airborne: true
    sprite: "player"
    launchBoost: 1.5
    waterSpeed: 5
    zIndex: 5

  self = GameObject(I)

  GRAVITY = Point(0, 0.25)

  wipeout = () ->
    I.x = 0
    I.y = 80
    I.velocity = Point(0, 0)
    I.heading = Math.PI / 2

  land = () ->
    if I.velocity.x > 1.5
      unless 0 <= I.heading <= Math.PI/2
        wipeout()
    else if I.velocity.x < -1.5
      unless Math.PI/2 <= I.heading <= Math.PI
        wipeout()
    else
      unless Math.PI/4 <= I.heading <= 3*Math.PI/4
        wipeout()

    I.airborne = false

  launch = () ->
    I.airborne = true
    I.velocity.$scale(I.launchBoost)

  self.bind "update", ->
    if keydown.left
      I.x -= 1

    if keydown.right
      I.x += 1

    if keydown.up
      I.y -= 1

    if keydown.down
      I.y += 1

    if I.y > CANVAS_HEIGHT
      wipeout()
    else if I.y >= waterLevel
      if I.airborne
        land()

      speed = I.velocity.magnitude()

      speed = speed.approachByRatio(I.waterSpeed, 0.1)

      I.velocity = Point.fromAngle(I.heading).scale(speed)
    else
      if !airborne
        launch()

      I.velocity.$add(GRAVITY)

  return self

