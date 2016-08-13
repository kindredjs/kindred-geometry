var getType = require('compute-dtype')
var unindex = require('unindex-mesh')
var pack = require('array-pack-2d')
var dtype = require('dtype')

module.exports = flatten

function flatten (positions, elements, dims, type) {
  if (elements) positions = unindex(unpack(positions, dims), unpack(elements, 3))
  if (typeof positions[0] === 'number') return convert(positions, type)
  return pack(positions, type)
}

function convert (data, to) {
  var from = getType(data)
  if (from === to) return data
  return new (dtype(to))(data)
}

function unpack (flat, dims) {
  if (typeof flat[0] !== 'number') return flat

  var output = []
  var curr = []

  for (var i = 0, j = 0, k = 0; i < flat.length; i++) {
    curr[j++] = flat[i]

    if (j === dims) {
      output[k++] = curr
      curr = []
      j = 0
    }
  }

  return output
}
