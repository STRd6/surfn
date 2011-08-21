Rock = (I) ->
  Object.reverseMerge I,
    sprite: "rocks"
    height: 32
    radius: 16
    width: 32
    zIndex: 6

  self = Base(I)

  self.bind "update", ->
    destruction = engine.find(".destruction").first()

    if destruction
      if I.x < destruction.I.x - I.width
        I.active = false

  self

