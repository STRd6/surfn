Extra Finders
=============

Helpful utility methods for engine finders.

    module.exports = (I={}, self) ->
      self.extend
        first: (selector) ->
          self.find(selector)[0]
