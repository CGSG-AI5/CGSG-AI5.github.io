import { gl } from "../rnddata.js";

export let program

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("!!!!!!");
  }

  return shader;
}

export function shaderInit(vs, fs) {
  const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

  program = gl.createProgram();
  gl.attachShader(program, vertexSh);
  gl.attachShader(program, fragmentSh);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(program));
  }
}
