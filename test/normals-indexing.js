var unindex = require('unindex-mesh')
var bunny = require('bunny')
var test = require('tape')
var Geom = require('../')

test('kindred-geometry: normals indexing', function (t) {
  var mesh = unindex(bunny.positions, bunny.cells)
  var geom1 = Geom(bunny).attrFaceNormals('faceNormal')
  var geom2 = Geom(null, mesh).attrFaceNormals('faceNormal')

  t.deepEqual(geom1.attribData[0], geom2.attribData[0], 'positions equivalent')
  t.deepEqual(geom1.attribData[1], geom2.attribData[1], 'normals equivalent')
  t.end()
})
