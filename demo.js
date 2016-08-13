var canvas = document.body.appendChild(document.createElement('canvas'))
var gl = canvas.getContext('webgl')

var perspective = require('gl-mat4/perspective')
var Camera = require('canvas-orbit-camera')
var Shader = require('kindred-shader')
var Fit = require('canvas-fit')
var bunny = require('bunny')
var Geom = require('./')

var shader = Shader.file('./demo.glsl')
var camera = Camera(canvas)
var proj = new Float32Array(16)
var view = new Float32Array(16)
var geom = Geom(bunny)
  .attrFaceNormals('faceNormal')

render()
function render () {
  var width = canvas.width
  var height = canvas.height

  perspective(proj, Math.PI / 4, width / height, 0.1, 100)
  camera.view(view)
  camera.tick()

  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  shader.bind(gl)
  shader.uniforms.uProj = proj
  shader.uniforms.uView = view

  geom.bind(gl, shader.attributes)
  geom.draw(gl)

  window.requestAnimationFrame(render)
}

window.addEventListener('resize', Fit(canvas), false)
