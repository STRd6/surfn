Options
=======

The options module for the engine.

    options =
      volume: require "/lib/global_volume"

    options.volume.observe (newValue) ->
      console.log newValue

    module.exports = (I={}, self) ->


    optionsMenuShown = false

    template = require "/templates/options"

    document.body.appendChild(template(options))

    # TODO: Handle hot-reloads
    $(document).on "keydown", null, "esc", ->
      optionsMenuShown = !optionsMenuShown

      engine.pause(optionsMenuShown)
