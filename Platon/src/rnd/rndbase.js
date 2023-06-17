import { CamSet, cam } from "../math/mathcam.js";
import { gl } from "./rnddata.js";
import { _vec3 } from "../math/mathvec3.js";
import { _matr4 } from "../math/mathmat4.js";
import { UBO, Ubo_Matr } from "./res/ubo.js";
import { myTimer } from "../timer.js";
import { shaderInit } from "./res/shader.js";
import { initCube, renderCube } from "../units/u_cube.js";
import { initCam, renderCam } from "../units/u_control.js";
import { initDod, renderDod } from "../units/u_dodecahedron.js";
import { initHex, renderHex } from "../units/u_hexahedron.js";
import { initIso, renderIso } from "../units/u_isocahedron.js";
import { initTetr, renderTetr } from "../units/u_tetraider.js";
export let CamUBO;

export function rndInit(vs, fs) {
  gl.clearColor(0.28, 0.47, 0.8, 1);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  initCam();
  //CamSet(_vec3.set(0, 0, 10), _vec3.set(0, 0, 0), _vec3.set(0, 1, 0));
  let World = _matr4.identity();
  let w = _matr4.mulmatr(_matr4.identity(), World);
  let winv = _matr4.transpose(_matr4.inverse(w));
  let WVP = _matr4.mulmatr(w, cam.MatrVP);

  let U = new Ubo_Matr(
    WVP,
    w,
    winv,
    cam.MatrVP,
    cam.MatrView,
    cam.Loc,
    cam.At,
    cam.Right,
    cam.Up,
    cam.Dir,
    _vec3.set(cam.ProjDist, cam.ProjFarClip, myTimer.localTime),
    _vec3.set(
      myTimer.globalTime,
      myTimer.globalDeltaTime,
      myTimer.localDeltaTime
    ),
    _vec3.set(cam.ProjSize, 1, 1)
  );

  CamUBO = UBO.add(U, "BaseData");

  shaderInit(vs, fs);

  initTetr();
  initCube();
  initHex();
  initIso();
  // initTruTetr();
  // initCubOct();
  // initTruCub();
  // initTruOct();
  initDod();
  // initRhom();
  //initTruCubOct();
}

export function render() {
  gl.clearColor(0.28, 0.47, 0.8, 1);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  renderCam();
  renderTetr();
  renderHex();
  renderCube();
  renderIso();
  renderDod();
  // renderTruTetr();
  // renderCubOct();
  // renderTruCub();
  // renderTruOct();
  // renderRhom();
  //renderTruCubOct();
}
