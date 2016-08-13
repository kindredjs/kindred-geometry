uniform mat4 uProj;
uniform mat4 uView;

attribute vec3 faceNormal;
attribute vec3 position;

varying vec3 vFaceNorm;

void vert() {
  vFaceNorm = normalize(faceNormal);
  gl_Position = uProj * uView * vec4(position, 1);
}

void frag() {
  gl_FragColor = vec4(vFaceNorm * 0.5 + 0.5, 1);
}
