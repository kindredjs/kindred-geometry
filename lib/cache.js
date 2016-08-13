var singleton = require('1t')

singleton('__KINDRED_ATTRIBUTE_CACHE__', module, function () {
  var cache = new WeakMap()

  exports.get = getAttributeCache

  function getAttributeCache (gl) {
    var result = cache.get(gl)
    if (!result) {
      result = AttributeCache(gl)
      cache.set(gl, result)
    }
    return result
  }

  function AttributeCache (gl) {
    if (!(this instanceof AttributeCache)) {
      var ext = gl.getExtension('OES_vertex_array_object')
      return ext || gl.createVertexArray
        ? new VAOAttributeCache(gl, ext)
        : new AttributeCache(gl)
    }

    this.gl = gl
    this.dirty = true
    this.limit = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
    this.enabled = new Uint8Array(this.limit)
    this.updated = new Uint8Array(this.limit)
  }

  AttributeCache.prototype.init = function (id) {
    this.dirty = true
    for (var i = 0; i < this.limit; i++) {
      this.updated[i] = 0
    }
  }

  AttributeCache.prototype.enable = function (id, index) {
    this.dirty = true
    if (!this.enabled[index]) {
      this.gl.enableVertexAttribArray(index)
      this.enabled[index] = 1
    }
  }

  AttributeCache.prototype.disable = function (id, index) {
    this.dirty = true
    if (this.enabled[index]) {
      this.gl.disableVertexAttribArray(index)
      this.enabled[index] = 0
    }
  }

  AttributeCache.prototype.done = function (id) {
    if (this.dirty) {
      for (var i = 0; i < this.limit; i++) {
        if (!this.enabled[i] && this.updated[i]) {
          this.disable(id, i)
          this.updated[i] = 0
        } else {
          this.updated[i] = 1
        }
      }
    }

    this.dirty = true
  }

  AttributeCache.prototype.dispose = function (id) {}
  AttributeCache.prototype.shouldBind = function (id) {
    return true
  }

  // TODO: test multiple attribute orders
  function VAOAttributeCache (gl, ext) {
    this.gl = gl
    this.ext = ext || null
    this.limit = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)

    this.index = {}
    this.setup = {}
    delete this.index.x
    delete this.setup.x
  }

  VAOAttributeCache.prototype.init = function (id) {
    if (!this.index[id]) {
      if (this.ext) {
        this.index[id] = this.ext.createVertexArrayOES()
      } else {
        this.index[id] = this.gl.createVertexArray()
      }
    }

    if (this.ext) {
      this.ext.bindVertexArrayOES(this.index[id])
    } else {
      this.gl.bindVertexArray(this.index[id])
    }
  }

  VAOAttributeCache.prototype.enable = function (id, index) {
    if (this.setup[id]) return
    this.gl.enableVertexAttribArray(index)
  }

  VAOAttributeCache.prototype.disable = function (id, index) {
    if (this.setup[id]) return
    this.gl.disableVertexAttribArray(index)
  }

  VAOAttributeCache.prototype.done = function (id) {
    if (!this.index[id]) throw new Error('Unexpectedly calling .done(id) on AttributeCache before calling .init(id)')
    if (!this.setup[id]) this.setup[id] = true
  }

  VAOAttributeCache.prototype.dispose = function (id) {
    if (!this.index[id]) return
    if (this.ext) {
      this.ext.deleteVertexArrayOES(this.index[id])
    } else {
      this.gl.deleteVertexArray(this.index[id])
    }

    delete this.index[id]
    delete this.setup[id]
  }

  VAOAttributeCache.prototype.shouldBind = function (id) {
    return !this.setup[id]
  }
})
