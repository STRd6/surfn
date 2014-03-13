Music
=====

Super hack way to have background music.

    globalVolume = require "./global_volume"

    globalVolume.observe ->
      updateVolume(track)

    track = $ "<audio />",
      loop: "loop"
    .appendTo('body').get(0)

    track.baseVolume = 1

    module.exports =
      play: (name, {volume}={}) ->
        volume ?= 1

        # TODO: Get music files from resource setup
        track.src = require("/music")["SurfN-2-Sur5"]
        track.baseVolume = volume

        updateVolume(track)

        track.play()

    updateVolume = (channel) ->
      channel.volume = channel.baseVolume * globalVolume()
