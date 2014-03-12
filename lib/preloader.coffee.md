Preloader
=========

Preload resources.

TODO: Error handling

TODO: Gross hack forcing image url update

    images = require "/images"

    module.exports =
      preload: ({resources, complete, progress}) ->
        loading = 0
        loaded = 0

        failedResource = (url) ->
          # TODO: Something other than just logging and ignoring
          console.error "Failed to load:", url
          loadedResource()

        loadedResource = (url) ->
          console.log "loaded:", url
          loaded += 1

          if loaded is loading
            console.log images
            complete()
          else
            progress?(loaded/loading)

        resources.forEach (resource) ->
          Object.keys(resource).forEach (name) ->
            loading += 1
            url = resource[name]

            success = (resourceUrl) ->
              # TODO: Grosso McNasty
              images[name] = resourceUrl
              loadedResource(resourceUrl)

            error = ->
              failedResource(url)

            if url.match /\.(png|jpg|gif)$/
              imagePreload(url, success, error)
            else if url.match /\.(mp3|wav|ogg)/
              element = new Audio
              element.onloadeddata = ->
                loadedResource(url)
              element.onerror = ->
                failedResource(url)

              element.src = url
              element.load()
              element.volume = 0
              element.play()
            else
              console.warn "unknown file type", url
              setTimeout loadedResource, 0

`softPreload` just tries to load the resources but doesn't keep track of
progress, success, or failure. Useful right now for audio which is unreliable.

      softPreload: (resources) ->
        resources.forEach (resource) ->
          Object.keys(resource).forEach (name) ->
            url = resource[name]

            if url.match /\.(png|jpg|gif)$/
              Sprite.load(url)
            else if url.match /\.(mp3|wav|ogg)/
              element = new Audio
              element.src = url
              element.load()
              element.volume = 0
              element.play()
            else
              console.warn "unknown file type", url
              setTimeout loadedResource, 0

    imagePreload = (url, success, error) ->
      if chrome?.app?.window
        console.log "loading", url
        ajaxSuccess = (resourceUrl) ->
          console.log resourceUrl
          Sprite.load resourceUrl, ->
            success(resourceUrl)

        chromeAppImagePreload(url, ajaxSuccess, error)
      else
        regularImagePreload(url, success, error)

    regularImagePreload = (url, success, error) ->
      # TODO: Error handling for sprites
      # NOTE: Using Sprite constructor because otherwise we get flickering

      Sprite.load url, success

    chromeAppImagePreload = (url, success, error) ->
      xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.onload = (e) ->
        success window.URL.createObjectURL(@response)
      xhr.onerror = error

      xhr.send()
