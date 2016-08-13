# kindred-geometry

[![](https://img.shields.io/badge/stability-experimental-ffa100.svg?style=flat-square)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)
[![](https://img.shields.io/npm/v/kindred-geometry.svg?style=flat-square)](https://npmjs.com/package/kindred-geometry)

Load, bind and draw geometry data in WebGL.

``` javascript
const Geometry = require('kindred-geometry')
const shader = require('./some-shader')
const icosphere = require('icosphere')
const bunny = require('bunny')

const geom = Geometry(icosphere(2))
  .attrFaceNormals('hardNormal')
  .attrVertNormals('softNormal')

function render () {
  geom.bind(gl, shader.attributes)
  geom.draw(gl)
}
```

## Usage

### `geom = Geometry(cells, positions, normals, uvs)`
### `geom.attr(name, data, opts)`
### `geom.attrFaceNormals(name)`
### `geom.attrVertNormals(name)`
### `geom.bind(gl, attributes)`
### `geom.draw(gl, primitive)`
### `geom.dipose()`

## License

MIT. See [LICENSE.md](LICENSE.md) for details.
