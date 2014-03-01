track = $ "<audio />",
  loop: "loop"
.appendTo('body').get(0)

track.volume = 1

module.exports =
  play: (name) ->
    track.src = require("/music")["SurfN-2-Sur5"]
    track.play()
