Options
=======

The options module for the engine.

    module.exports = (I={}, self) ->
      

    optionsMenuShown = false

    template = require "/templates/options"
    
    document.body.appendChild(template)

    # TODO: Handle hot-reloads
    $(document).on "keydown", null, "esc", ->
      optionsMenuShown = !optionsMenuShown
    
      engine.pause(optionsMenuShown)
      
      
