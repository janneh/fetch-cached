import nodeFetch from 'node-fetch'
import { createClient } from 'then-redis'
import fetchCached from '../'

const expiry = 600
const redis = createClient()
const options = {
  fetch: nodeFetch,
  cache: {
    get: (k) => redis.get(k),
    set: (k, v) => redis.send('set', [k, v, 'EX', expiry])
  }
}

const fetch = fetchCached(options)

fetch('https://api.github.com')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log(json) // eslint-disable-line
  })

setTimeout(() => {
  fetch('https://api.github.com')
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log(json) // eslint-disable-line
    })
}, 3000)
