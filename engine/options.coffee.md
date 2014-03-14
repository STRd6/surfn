Options
=======

The options module for the engine.

    options = require("audio").Control

    options.volume.observe (newValue) ->
      console.log newValue

    optionsMenuShown = false

    template = require "/templates/options"

    document.body.appendChild(template(options))

    $(document).on "keydown", null, "esc", ->
      optionsMenuShown = !optionsMenuShown

      engine.pause(optionsMenuShown)

      $(".options").toggleClass "up", optionsMenuShown

      if !optionsMenuShown
        $(".options input").blur()
