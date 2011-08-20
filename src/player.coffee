Player = (I) ->
  Object.reverseMerge I,
    sprite: "player"
    zIndex: 5

  self = GameObject(I)

  return self

