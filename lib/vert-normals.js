var DEFAULT_EPSILON = 1e-6

module.exports = vertNormals

function vertNormals (positions, cells, out, EPSILON) {
  EPSILON = EPSILON || DEFAULT_EPSILON
  var normals = out || new Float32Array(positions.length)

  for (var c = 0; c < cells.length;) {
    var c0 = c++
    var c1 = c++
    var c2 = c++

    for (var j = 0; j < 3; j++) {
      var tmp = c0
      c0 = c1
      c1 = c2
      c2 = tmp

      var v0x = positions[c0]
      var v0y = positions[c0 + 1]
      var v0z = positions[c0 + 2]
      var v1x = positions[c1]
      var v1y = positions[c1 + 1]
      var v1z = positions[c1 + 2]
      var v2x = positions[c2]
      var v2y = positions[c2 + 1]
      var v2z = positions[c2 + 2]

      var d01 = [0, 0, 0]
      var m01 = 0
      var d21 = [0, 0, 0]
      var m21 = 0

      d01[0] = v0x - v1x
      d21[0] = v2x - v1x
      m01 += d01[0] * d01[0]
      m21 += d21[0] * d21[0]
      d01[1] = v0y - v1y
      d21[1] = v2y - v1y
      m01 += d01[1] * d01[1]
      m21 += d21[1] * d21[1]
      d01[2] = v0z - v1z
      d21[2] = v2z - v1z
      m01 += d01[2] * d01[2]
      m21 += d21[2] * d21[2]

      var M = m01 * m21
      if (M > EPSILON) {
        var w = 1 / Math.sqrt(M)
        var nx = c2
        var ny = c2 + 1
        var nz = c2 + 2

        normals[nx] += w * d21[1] * d01[2] - d21[2] * d01[1]
        normals[ny] += w * d21[2] * d01[0] - d21[0] * d01[2]
        normals[nz] += w * d21[0] * d01[1] - d21[1] * d01[0]
      }
    }
  }

  return normals
}
