import test from 'tape'
import sinon from 'sinon'
import fetchCached from '../'

const URL = 'http://localhost.com'
const FETCH_DATA = { fetched: 'fetched' }
const CACHE_JSON = { cached: 'cached' }
const CACHE_TEXT = 'cached'
const fetchStub = sinon.stub().withArgs(URL).returns(
  Promise.resolve({
    json: () => Promise.resolve(FETCH_DATA),
    clone: () => {
      return { text: () => Promise.resolve(JSON.stringify(FETCH_DATA)) }
    }
  })
)

test('returns a function called with new', function (t) {
  t.plan(1)
  t.is(typeof new fetchCached({ fetch: {}, cache: {} }), 'function')
})

test('returns a function called without new', function (t) {
  t.plan(1)
  t.is(typeof fetchCached({ fetch: {}, cache: {} }), 'function')
})

test('call without options.cache throws', function (t) {
  t.plan(1)
  t.throws(() => fetchCached({ fetch: {} }))
})

test('call without options.fetch throws', function (t) {
  t.plan(1)
  t.throws(() => fetchCached({ cache: {} }))
})

test('call with options.fetch and options.cache does not throws', function (t) {
  t.plan(1)
  t.doesNotThrow(() => fetchCached({ fetch: {}, cache: {} }))
})

test('returns response data if no cache exists', function (t) {
  t.plan(1)

  const cacheStub = {
    get: sinon.stub().withArgs(URL).returns(Promise.resolve(null)),
    set: sinon.stub()
  }

  const fetch = fetchCached({
    fetch: fetchStub,
    cache: cacheStub
  })

  fetch(URL)
    .then(response => response.json())
    .then(json => t.equal(json, FETCH_DATA))
})

test('returns .json() cached data if cache exists', function (t) {
  t.plan(1)

  const cacheStub = {
    get: sinon.stub().returns(Promise.resolve(JSON.stringify(CACHE_JSON))),
    set: sinon.stub()
  }

  const fetch = fetchCached({
    fetch: fetchStub,
    cache: cacheStub
  })

  fetch(URL)
    .then(response => response.json())
    .then(json => t.deepEqual(json, CACHE_JSON))
})

test('returns .text() cached data if cache exists', function (t) {
  t.plan(1)

  const cacheStub = {
    get: sinon.stub().returns(Promise.resolve(CACHE_TEXT)),
    set: sinon.stub()
  }

  const fetch = fetchCached({
    fetch: fetchStub,
    cache: cacheStub
  })

  fetch(URL)
    .then(response => response.text())
    .then(text => t.deepEqual(text, CACHE_TEXT))
})
