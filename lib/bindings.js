var AttributeCache = require('./cache')
var shortid = require('shortid')
var bufferCache = []

module.exports = Bindings

function Bindings (gl) {
  this.gl = gl
  this.id = shortid.generate()
  this.attributeState = AttributeCache.get(gl)
  this.bindings = Object.create(null)
}

Bindings.prototype.push = function (name, size, data) {
  var gl = this.gl
  var buffer = bufferCache.length
    ? bufferCache.pop()
    : gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  this.bindings[name] = {
    buffer: buffer,
    size: size
  }
}

Bindings.prototype.bind = function (attributeOrder) {
  var state = this.attributeState
  var gl = this.gl

  state.init(this.id)

  for (var key in attributeOrder) {
    var binding = this.bindings[key]
    var idx = attributeOrder[key]

    if (!binding) continue
    if (state.shouldBind(this.id)) {
      gl.bindBuffer(gl.ARRAY_BUFFER, binding.buffer)
      state.enable(this.id, idx)
      gl.vertexAttribPointer(idx, binding.size, gl.FLOAT, false, 0, 0)
    }
  }
}

Bindings.prototype.dispose = function () {
  var gl = this.gl

  for (var k in this.bindings) {
    var buffer = this.bindings[k].buffer
    bufferCache.push(buffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, 0, gl.STATIC_DRAW)
  }

  this.attributeState.dispose(this.id)
  this.attributeState = null
  this.bindings = null
  this.gl = null
  this.id = null
}
