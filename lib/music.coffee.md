Music
=====

Super hack way to have background music.

    track = $ "<audio />",
      loop: "loop"
    .appendTo('body').get(0)

    track.volume = 1

    module.exports =
      play: (name) ->
        # TODO: Get music files from resource setup
        track.src = require("/music")["SurfN-2-Sur5"]
        track.play()
