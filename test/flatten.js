const flatten = require('../lib/flatten')
const test = require('tape')

test('kindred-geometry: flatten (nested, unindexed)', function (t) {
  const out3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const flat3 = out3.slice()
  const nest3 = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11]
  ]

  t.deepEqual(flatten(nest3, null, 3, 'float32'), new Float32Array(out3), '3d / nested / float32')
  t.deepEqual(flatten(nest3, null, 3, 'float64'), new Float64Array(out3), '3d / nested / float64')
  t.deepEqual(flatten(nest3, null, 3, 'int32'), new Int32Array(out3), '3d / nested / int32')

  t.deepEqual(flatten(flat3, null, 3, 'float32'), new Float32Array(out3), '3d / flat / float32')
  t.deepEqual(flatten(flat3, null, 3, 'float64'), new Float64Array(out3), '3d / flat / float64')
  t.deepEqual(flatten(flat3, null, 3, 'int32'), new Int32Array(out3), '3d / flat / int32')

  t.deepEqual(flatten(new Uint8Array(flat3), null, 3, 'float32'), new Float32Array(out3), '3d / typed / float32')
  t.deepEqual(flatten(new Uint8Array(flat3), null, 3, 'float64'), new Float64Array(out3), '3d / typed / float64')
  t.deepEqual(flatten(new Uint8Array(flat3), null, 3, 'int32'), new Int32Array(out3), '3d / typed / int32')

  const out2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const flat2 = out2.slice()
  const nest2 = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
    [8, 9]
  ]

  t.deepEqual(flatten(nest2, null, 3, 'float32'), new Float32Array(out2), '2d / nested / float32')
  t.deepEqual(flatten(nest2, null, 3, 'float64'), new Float64Array(out2), '2d / nested / float64')
  t.deepEqual(flatten(nest2, null, 3, 'int32'), new Int32Array(out2), '2d / nested / int32')

  t.deepEqual(flatten(flat2, null, 3, 'float32'), new Float32Array(out2), '2d / flat / float32')
  t.deepEqual(flatten(flat2, null, 3, 'float64'), new Float64Array(out2), '2d / flat / float64')
  t.deepEqual(flatten(flat2, null, 3, 'int32'), new Int32Array(out2), '2d / flat / int32')

  t.deepEqual(flatten(new Uint8Array(flat2), null, 3, 'float32'), new Float32Array(out2), '2d / typed / float32')
  t.deepEqual(flatten(new Uint8Array(flat2), null, 3, 'float64'), new Float64Array(out2), '2d / typed / float64')
  t.deepEqual(flatten(new Uint8Array(flat2), null, 3, 'int32'), new Int32Array(out2), '2d / typed / int32')

  t.end()
})

test('kindred-geometry: flatten (nested, indexed)', function (t) {
  const out3 = [0, 1, 2, 3, 4, 5, 9, 10, 11, 9, 10, 11, 6, 7, 8, 3, 4, 5]
  const cell3 = [
    [0, 1, 3],
    [3, 2, 1]
  ]
  const cellFlat3 = [0, 1, 3, 3, 2, 1]
  const flat3 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const nest3 = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11]
  ]

  ;[cell3, new Int16Array(cellFlat3)].forEach(function (cell, i) {
    var c = i ? 'nested cells' : 'flat cells'

    t.deepEqual(flatten(nest3, cell, 3, 'float32'), new Float32Array(out3), '3d / nested / float32 / ' + c)
    t.deepEqual(flatten(nest3, cell, 3, 'float64'), new Float64Array(out3), '3d / nested / float64 / ' + c)
    t.deepEqual(flatten(nest3, cell, 3, 'int32'), new Int32Array(out3), '3d / nested / int32 / ' + c)

    t.deepEqual(flatten(flat3, cell, 3, 'float32'), new Float32Array(out3), '3d / flat / float32 / ' + c)
    t.deepEqual(flatten(flat3, cell, 3, 'float64'), new Float64Array(out3), '3d / flat / float64 / ' + c)
    t.deepEqual(flatten(flat3, cell, 3, 'int32'), new Int32Array(out3), '3d / flat / int32 / ' + c)

    t.deepEqual(flatten(new Uint8Array(flat3), cell, 3, 'float32'), new Float32Array(out3), '3d / typed / float32 / ' + c)
    t.deepEqual(flatten(new Uint8Array(flat3), cell, 3, 'float64'), new Float64Array(out3), '3d / typed / float64 / ' + c)
    t.deepEqual(flatten(new Uint8Array(flat3), cell, 3, 'int32'), new Int32Array(out3), '3d / typed / int32 / ' + c)
  })

  const out2 = [0, 1, 2, 3, 4, 5, 2, 3, 6, 7, 8, 9, 8, 9, 0, 1, 6, 7]
  const cellFlat2 = [0, 1, 2, 1, 3, 4, 4, 0, 3]
  const cell2 = [
    [0, 1, 2],
    [1, 3, 4],
    [4, 0, 3]
  ]
  const flat2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const nest2 = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
    [8, 9]
  ]

  ;[cell2, new Int16Array(cellFlat2)].forEach(function (cell, i) {
    var c = i ? 'nested cells' : 'flat cells'

    t.deepEqual(flatten(nest2, cell2, 2, 'float32'), new Float32Array(out2), '2d / nested / float32 / ' + c)
    t.deepEqual(flatten(nest2, cell2, 2, 'float64'), new Float64Array(out2), '2d / nested / float64 / ' + c)
    t.deepEqual(flatten(nest2, cell2, 2, 'int32'), new Int32Array(out2), '2d / nested / int32 / ' + c)

    t.deepEqual(flatten(flat2, cell2, 2, 'float32'), new Float32Array(out2), '2d / flat / float32 / ' + c)
    t.deepEqual(flatten(flat2, cell2, 2, 'float64'), new Float64Array(out2), '2d / flat / float64 / ' + c)
    t.deepEqual(flatten(flat2, cell2, 2, 'int32'), new Int32Array(out2), '2d / flat / int32 / ' + c)

    t.deepEqual(flatten(new Uint8Array(flat2), cell2, 2, 'float32'), new Float32Array(out2), '2d / typed / float32 / ' + c)
    t.deepEqual(flatten(new Uint8Array(flat2), cell2, 2, 'float64'), new Float64Array(out2), '2d / typed / float64 / ' + c)
    t.deepEqual(flatten(new Uint8Array(flat2), cell2, 2, 'int32'), new Int32Array(out2), '2d / typed / int32 / ' + c)
  })

  t.end()
})
