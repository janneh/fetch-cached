import test from 'tape'
import sinon from 'sinon'
import fetchCached from '../'

const URL = 'http://localhost.com'
const CACHE_JSON = { cached: 'cached' }
const CACHE_TEXT = 'cached'
const FETCH_DATA = { fetched: 'fetched' }

test('returns a function called with new', function (t) {
  t.plan(1)
  t.is(typeof new fetchCached({ fetch: true, cache: true }), 'function')
})

test('returns a function called without new', function (t) {
  t.plan(1)
  t.is(typeof fetchCached({ fetch: true, cache: true }), 'function')
})

test('call without options.cache throws', function (t) {
  t.plan(1)
  t.throws(() => fetchCached({ fetch: true }))
})

test('call without options.fetch throws', function (t) {
  t.plan(1)
  t.throws(() => fetchCached({ cache: true }))
})

test('call with options.fetch and options.cache does not throws', function (t) {
  t.plan(1)
  t.doesNotThrow(() => fetchCached({ fetch: true, cache: true }))
})

test.skip('fetch returns response data if no cache exists', function (t) {
  t.plan(1)

  const fetchStub = sinon.stub().returns(Promise.resolve(FETCH_DATA))
  const cacheStub = {
    get: sinon.stub().withArgs(URL).returns(Promise.resolve(null)),
    set: sinon.spy()
  }

  const fetch = fetchCached({
    fetch: fetchStub,
    cache: cacheStub
  })

  fetch(URL)
    .then(json =>  t.deepEqual(json, FETCH_DATA))
})

test('fetch returns .json() cached data if cache exists', function (t) {
  t.plan(1)

  const fetchStub = sinon.stub().returns(Promise.resolve(FETCH_DATA))
  const cacheStub = {
    get: sinon.stub().returns(Promise.resolve(JSON.stringify(CACHE_JSON))),
    set: sinon.stub()
  }
  const fetch = fetchCached({
    fetch: fetchStub,
    cache: cacheStub
  })

  fetch(URL)
    .then((response) => { return response.json() })
    .then((json) => { t.deepEqual(json, CACHE_JSON) })
})

test('fetch returns .text() cached data if cache exists', function (t) {
  t.plan(1)

  const fetchStub = sinon.stub().returns(Promise.resolve(FETCH_DATA))
  const cacheStub = {
    get: sinon.stub().returns(Promise.resolve(CACHE_TEXT)),
    set: sinon.stub()
  }
  const fetch = fetchCached({
    fetch: fetchStub,
    cache: cacheStub
  })

  fetch(URL)
    .then((response) => { return response.text() })
    .then((json) => { t.deepEqual(json, CACHE_TEXT) })
})
