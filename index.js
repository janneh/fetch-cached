/*
* Returns a fetch function wrapped with cache to be used as normal fetch
*/

export default function fetchCached(options) {
  if (!options || !options.fetch) throw Error('fetch is a required option')
  if (!options || !options.cache) throw Error('cache is a required option')

  const { fetch, cache } = options

  function setCache(key, data) {
    data.then(value => { cache.set(key, value) })
  }

  function getCache(key) {
    const value = cache.get(key).then(data => {
      if (!data) return null

      return Promise.resolve({
        ok: true,
        url: key,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve(JSON.parse(data)),
        text: () => Promise.resolve(data)
      })
    })

    return value
  }

  return function cachedFetch(url, options = {}) {
    // return plain fetch for non-GET requests
    if (options.method && options.method !== 'GET') {
      return fetch(url, options)
    }

    const response = getCache(url)
      .then(cached => {
        // return the cached result if it exist
        if(cached) return cached

        // return fetch for non-cached requests and set cache
        return fetch(url, options).then(response => {
          setCache(url, response.clone().text())

          return Promise.resolve(response)
        })
      })

    return response
  }
}
