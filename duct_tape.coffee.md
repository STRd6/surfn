Duct Tape
=========

Load Sprites by named resource.

    images = require "./images"

    Sprite.loadByName = (name) ->
      url = images[name]

      Sprite.load(url)
