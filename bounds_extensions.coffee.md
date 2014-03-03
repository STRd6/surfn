Bounds Extensions
=================

    module.exports = (I={}, self) ->
      self.extend
        top: ->
          I.y - I.height/2
        bottom: ->
          I.y + I.height/2

      return self
