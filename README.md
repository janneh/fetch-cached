fetch-cache
=====================

caution: This is work in progress.

Fetch cache provides a cache wrapper around fetch.
It is up to the user of it to define what fetch implementation to use
and how to cache the data. Below is an example using node-fetch and then-redis.
The db option is required to provide a
`get(key)` (returning a Promise) and `set(key, value)`.


```
import nodeFetch from 'node-fetch'
import { createClient } from 'then-redis'
import fetchCached from 'fetch-cached'

const redis = createClient()
const fetch = fetchCached({
  fetch: nodeFetch,
  cache: {
    get: (key) => redis.get(key),
    set: (key, value) => redis.set(key, value)
  }
})

fetch('https://api.github.com')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log(json)
  })
```

Note that this example will not set an expiry on the cached data.
Take a look at the example for how that can be done.
