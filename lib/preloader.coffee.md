Preloader
=========

Preload resources

TODO: Error handling

    module.exports =
      preload: ({resources, complete, progress}) ->
        loading = 0
        loaded = 0

        loadedResource = (url) ->
          console.log "loaded:", url
          loaded += 1

          if loaded is loading
            complete()
          else
            progress?(loaded/loading)

        resources.forEach (resource) ->
          Object.keys(resource).forEach (name) ->
            loading += 1
            url = resource[name]

            if url.match /\.(png|jpg|git)$/
              Sprite.load url, ->
                loadedResource(url)
            else if url.match /\.(mp3|wav|ogg)/
              element = new Audio
              element.load()
              element.volume = 0
              element.play()
              element.onloadeddata = ->
                loadedResource(url)  
              element.src = url
            else
              console.warn "unknown file type", url
              setTimeout loadedResource, 0
