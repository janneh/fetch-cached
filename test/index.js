import test from 'tape'
import sinon from 'sinon'
import fetchCached from '../'

const URL = 'http://localhost.com'
const CACHE_DATA = { cached: 'cached' }
const FETCH_DATA = { fetched: 'fetched' }

test('returns a function called with new', function (t) {
  t.plan(1)
  t.is(typeof new fetchCached({ fetch: true, db: true }), 'function')
})

test('returns a function called without new', function (t) {
  t.plan(1)
  t.is(typeof fetchCached({ fetch: true, db: true }), 'function')
})

test('call without options.db throws', function (t) {
  t.plan(1)
  t.throws(() => fetchCached({ fetch: true }))
})

test('call without options.fetch throws', function (t) {
  t.plan(1)
  t.throws(() => fetchCached({ db: true }))
})

test('call with options.fetch and options.db does not throws', function (t) {
  t.plan(1)
  t.doesNotThrow(() => fetchCached({ fetch: true, db: true }))
})

test('fetch returns response data if no cache exists', function (t) {
  t.plan(1)

  const fetchStub = sinon.stub().returns(Promise.resolve(FETCH_DATA))
  const dbStub = {
    get: sinon.stub().withArgs(URL).returns(Promise.resolve(null)),
    set: sinon.spy()
  }

  const fetch = fetchCached({
    fetch: fetchStub,
    db: dbStub
  })

  fetch(URL)
    .then(json =>  t.deepEqual(json, FETCH_DATA))
})

test('fetch returns cached data if cache exists', function (t) {
  t.plan(1)

  const fetchStub = sinon.stub().returns(Promise.resolve(FETCH_DATA))
  const dbStub = {
    get: sinon.stub().returns(Promise.resolve(JSON.stringify(CACHE_DATA))),
    set: sinon.stub()
  }
  const fetch = fetchCached({
    fetch: fetchStub,
    db: dbStub
  })

  fetch(URL)
    .then((response) => { return response.json() })
    .then((json) => { t.deepEqual(json, CACHE_DATA) })
})
