/*
* Returns a fetch function wrapped with cache to be used as normal fetch
*/

export default function fetchCached(options) {
  if (!options || !options.fetch) throw Error('fetch is a required option')
  if (!options || !options.cache) throw Error('cache is a required option')

  const { fetch, cache } = options

  function cachedResponse(url, body) {
    if (!body) return null

    return Promise.resolve({
      ok: true,
      url: url,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(JSON.parse(body)),
      text: () => Promise.resolve(body)
    })
  }

  function cachingFetch(url, options) {
    return fetch(url, options)
      .then(response => {
        response.clone().text().then(value => cache.set(url, value))

        return Promise.resolve(response)
      })
  }

  return function cachedFetch(url, options = {}) {
    // return plain fetch for non-GET requests
    if (options.method && options.method !== 'GET') {
      return fetch(url, options)
    }

    return cache.get(url)
      .then(data => cachedResponse(url, data))
      .then(cached => {
        // return the cached result if it exist
        if(cached) return cached

        // return fetch request after setting cache
        return cachingFetch(url, options)
      })
  }
}
