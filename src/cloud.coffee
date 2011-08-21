Cloud = (I) ->
  Object.reverseMerge I,
    sprite: "cloud"
    height: 32
    width: 128
    y: -160 + rand(240)
    zIndex: 1

  self = Base(I)

  self.bind "update", ->
    destruction = engine.find(".destruction").first()

    if destruction
      if I.x < destruction.I.x - I.width
        I.active = false

  self

