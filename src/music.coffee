track = $ "<audio />",
  loop: "loop"
.appendTo('body').get(0)

track.volume = 1

module.exports =
  play: (name) ->
    # TODO: Music
    # track.src = "#{BASE_URL}/sounds/#{name}.mp3"
    track.play()
