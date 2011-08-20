Player = (I) ->
  Object.reverseMerge I,
    airborne: true
    heading: Math.TAU / 4
    sprite: "player"
    launchBoost: 1.5
    rotationVelocity: Math.TAU / 64
    waterSpeed: 5
    velocity: Point(0, 0)
    zIndex: 5

  self = GameObject(I)

  GRAVITY = Point(0, 0.25)
  MAX_DEPTH = App.height

  wipeout = () ->
    I.x = 0
    I.y = 80
    I.velocity = Point(0, 0)
    I.heading = Math.TAU / 4

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
    I.velocity.scale$(I.launchBoost)

  self.bind "draw", (canvas) ->
    canvas.strokeColor("#000")

    p = Point.fromAngle(I.heading).scale(10)
    canvas.drawLine(-p.x, -p.y, p.x, p.y, 5)

  self.bind "update", ->
    waterLevel = 160

    I.x += I.velocity.x
    I.y += I.velocity.y

    headingChange = I.rotationVelocity
    headingChange *= 2 if I.airborne

    if keydown.left
      I.heading -= headingChange
    if keydown.right
      I.heading += headingChange

    I.heading = I.heading.constrainRotation()

    if I.y > MAX_DEPTH
      wipeout()
    else if I.y >= waterLevel
      if I.airborne
        land()

      speed = I.velocity.magnitude()

      speed = speed.approachByRatio(I.waterSpeed, 0.1)

      I.velocity = Point.fromAngle(I.heading).scale(speed)
    else
      if !I.airborne
        launch()

      I.velocity.add$(GRAVITY)

  return self

