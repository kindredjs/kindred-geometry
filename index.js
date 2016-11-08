var faceNormals = require('face-normals')
var Bindings = require('./lib/bindings')
var flatten = require('./lib/flatten')
var pack = require('array-pack-2d')

module.exports = KindredGeometry

var counter = parseInt(Math.random().toString(32).slice(2, 10), 36)

function KindredGeometry (cells, positions, normals, uvs) {
  if (!(this instanceof KindredGeometry)) {
    return new KindredGeometry(cells, positions, normals, uvs)
  }

  if (cells && cells.positions && cells.cells) {
    positions = cells.positions
    normals = cells.normals
    uvs = cells.uvs
    cells = cells.cells
  }

  this.id = counter++
  this.dirty = true
  this.cache = new Map()
  this.length = 0
  this.elements = cells ? pack(cells, Uint32Array) : null

  this.attribData = []
  this.attribSize = []
  this.attribName = []
  this.attribRaw = []

  if (positions) this.attr('position', positions)
  if (normals) this.attr('normal', normals)
  if (uvs) this.attr('uv', uvs)
}

KindredGeometry.prototype.attr = function attr (name, attr, opts) {
  this.dirty = true

  var defaultDims = typeof attr[0] === 'number' ? 3 : attr[0].length
  var dims = (opts && opts.dimensions) || defaultDims
  var type = (opts && opts.type) || 'float32'
  var index = (!opts || opts.index !== false) && this.elements
  var flat = flatten(attr, index, dims, type)

  var i = this.attribName.indexOf(name)
  if (i === -1) i = this.attribName.length
  this.attribName[i] = name
  this.attribSize[i] = dims
  this.attribData[i] = flat
  this.length = (i === 0) ? (flat.length / dims) : this.length

  return this
}

KindredGeometry.prototype.attrFaceNormals = function (name) {
  var faceNorms = faceNormals(this.attribData[0])
  return this.attr(name || 'normal', faceNorms, { index: false })
}

KindredGeometry.prototype.attrVertNormals = function (name) {
  if (!this.elements) {
    throw new Error('Vertex (smooth) normals are only available if your mesh is indexed')
  }

  throw new Error('TODO: implement vertex normal calculation')
  // var vertNorms = vertNormals(this.attribRaw[0], this.elements)
  // return this.attr(name || 'normal', vertNorms, { index: true })
}

KindredGeometry.prototype.attrNormals = function (name) {
  return this.elements
    ? this.attrVertNormals(name)
    : this.attrFaceNormals(name)
}

KindredGeometry.prototype.bind = function (gl, attributeOrder) {
  this._getBindings(gl).bind(attributeOrder)
}

KindredGeometry.prototype._createBindings = function (gl, prev) {
  if (prev) prev.dispose()

  var bindings = new Bindings(gl)
  for (var i = 0; i < this.attribName.length; i++) {
    bindings.push(this.attribName[i], this.attribSize[i], this.attribData[i])
  }

  return bindings
}

KindredGeometry.prototype._getBindings = function (gl) {
  var bindings = this.cache.get(gl)
  if (this.dirty || !bindings) {
    bindings = this._createBindings(gl, bindings)
    this.cache.set(gl, bindings)
  }

  this.dirty = false

  return bindings
}

KindredGeometry.prototype.draw = function (gl, primitive, start, count) {
  var bindings = this._getBindings(gl)
  var state = bindings.attributeState

  var drawStart = start || 0
  var drawCount = typeof count === 'number' ? count : this.length
  var prim = typeof primitive === 'number' ? primitive : gl.TRIANGLES

  state.done(bindings.id)
  gl.drawArrays(prim, drawStart, drawCount)
}

KindredGeometry.prototype.dispose = function () {
  this.cache.forEach(disposeBinding)
  this.cache.clear()
}

function disposeBinding (bindings) {
  bindings.dispose()
}
