fetch-cache
=====================

Fetch cache provides a flexible cache wrapper around fetch.

## Install

```
$ npm install --save fetch-cached
```
## Usage

What fetch implementation to use and how to cache the
data are defined as options. Below is an example
using node-fetch and then-redis to cache for 10 minutes.

The cache option is expected to have functions `set(key, value)` and `get(key)`
(returning a Promise that resolves to the value).

restrictions: Response from cache will come with with these props:
`ok: true`, `url: key`, `status: 200`, `statusText: 'OK'`,
and functions `.json()` and `.text()`

```javascript
import nodeFetch from 'node-fetch'
import { createClient } from 'then-redis'
import fetchCached from 'fetch-cached'

const expiry = 600
const redis = createClient()
const fetch = fetchCached({
  fetch: nodeFetch,
  cache: {
    get: (k) => redis.get(k),
    set: (k, v) => redis.send('set', [k, v, 'EX', expiry])
  }
})

fetch('https://api.github.com')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log(json)
  })
```
