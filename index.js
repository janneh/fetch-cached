/*
* Returns a fetch function (wrapped with cache) to be used as normal fetch
*/

export default function fetchCached(options) {
  if (!options || !options.fetch) throw Error('fetch is a required option')
  if (!options || !options.db) throw Error('db is a required option')

  const { fetch, db } = options

  function setCache(key, fetched) {
    fetched
      .then(response => response.clone().text())
      .then((value) => {
        db.set(key, value)
      })
  }

  function getCache(key) {
    const value = db.get(key).then((data) => {
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
      .then((cached) => {
        // return the cached result if it exist
        if(cached) {
          return cached
        }

        const fetched = fetch(url, options)
        setCache(url, fetched)

        // return fetch for non-cached requests
        return fetched
      })

    return response
  }
}
