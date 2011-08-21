Player = (I) ->
  Object.reverseMerge I,
    airborne: true
    heading: Math.TAU / 4
    sprite: "player"
    launchBoost: 1.5
    radius: 8
    rotationVelocity: Math.TAU / 64
    waterSpeed: 5
    velocity: Point(0, 0)
    zIndex: 5

  self = Base(I)

  GRAVITY = Point(0, 0.25)
  MAX_DEPTH = App.height

  sprites = []
  angleSprites = 8
  angleSprites.times (n) ->
    t = n * 2
    sprites.push Sprite.loadByName("player_#{t}")

  setSprite = ->
    angleSprites
    n = (angleSprites * I.heading / Math.TAU).round().mod(angleSprites)

    I.sprite = sprites[n]

  wipeout = () ->
    I.active = false

    engine.add 
      class: "Game Over"
      distance: I.x
      time: I.age
      y: I.y

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

  self.bind "drawDebug", (canvas) ->
    canvas.strokeColor("rgba(0, 255, 0, 0.75)")

    p = Point.fromAngle(I.heading).scale(10)
    canvas.drawLine(I.x - p.x, I.y - p.y, I.x + p.x, I.y + p.y, 1)

  self.bind "update", ->
    I.x += I.velocity.x
    I.y += I.velocity.y

    circle = self.circle()
    hitRock = false
    engine.find("Rock").each (rock) ->
      if Collision.circular circle, rock.circle()
        hitRock = true

    if hitRock
      wipeout()
      return

    waterLevel = 160

    headingChange = I.rotationVelocity
    headingChange *= 2 if I.airborne

    if keydown.left
      I.heading -= headingChange
    if keydown.right
      I.heading += headingChange

    I.heading = I.heading.constrainRotation()

    setSprite()

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

