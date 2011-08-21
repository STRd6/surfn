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

  sprites = []
  angleSprites = 8
  angleSprites.times (n) ->
    t = n * 2
    sprites.push Sprite.loadByName("player_#{t}")

  setSprite = ->
    angleSprites
    n = (angleSprites * I.heading / Math.TAU).round().mod(angleSprites)

    I.sprite = sprites[n]

  wipeout = (causeOfDeath) ->
    I.active = false

    Sound.play("crash")

    engine.add 
      class: "GameOver"
      causeOfDeath: causeOfDeath
      distance: I.x
      time: I.age
      x: I.x
      y: I.y

  land = () ->
    if I.velocity.x > 1.5
      unless 0 <= I.heading <= Math.PI/2
        wipeout("bad landing")
    else if I.velocity.x < -1.5
      unless Math.PI/2 <= I.heading <= Math.PI
        wipeout("bad landing")
    else
      unless Math.PI/5 <= I.heading <= 4*Math.PI/5
        wipeout("bad landing")

    I.airborne = false

    Sound.play("land")

  launch = () ->
    I.airborne = true
    I.velocity.scale$(I.launchBoost)

    Sound.play("splash")

  self.bind "drawDebug", (canvas) ->
    canvas.strokeColor("rgba(0, 255, 0, 0.75)")

    p = Point.fromAngle(I.heading).scale(10)
    canvas.drawLine(I.x - p.x, I.y - p.y, I.x + p.x, I.y + p.y, 1)

  self.bind "update", ->
    I.x += I.velocity.x
    I.y += I.velocity.y

    I.waterSpeed = 5 + I.age / 200

    circle = self.circle()
    hitRock = false
    engine.find("Rock").each (rock) ->
      if Collision.circular circle, rock.circle()
        hitRock = true

    if hitRock
      wipeout("a rock")
      return

    hitDestruction = false
    engine.find(".destruction").each (destruction) ->
      if I.x < destruction.I.x
        hitDestruction = true
    if hitDestruction
      wipeout("a rogue wave")
      return

    waterLevel = engine.find(".water").first().I.y
    depthsLevel = waterLevel + 160

    headingChange = I.rotationVelocity
    headingChange *= 2 if I.airborne

    if keydown.left
      I.heading -= headingChange
    if keydown.right
      I.heading += headingChange

    I.heading = I.heading.constrainRotation()

    setSprite()

    if I.y > depthsLevel
      wipeout("the depths")
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

