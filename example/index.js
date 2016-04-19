import nodeFetch from 'node-fetch'
import { createClient } from 'then-redis'
import fetchCache from '../'

const expiry = 600
const redis = createClient()
const options = {
  fetch: nodeFetch,
  db: {
    get: (k) => redis.get(k),
    set: (k, v) => redis.send('set', [k, v, 'EX', expiry])
  }
}

const fetch = fetchCache(options)

fetch('https://api.github.com')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log(json)
  })

setTimeout(() => {
  fetch('https://api.github.com')
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json)
    })
}, 3000)
