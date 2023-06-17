import { CamSet, cam } from "../math/mathcam.js";
import { _vec3 } from "../math/mathvec3.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";
import { myTimer } from "../timer.js";
import { UBO, Ubo_cell } from "../rnd/res/ubo.js";
import { CamUBO } from "../rnd/rndbase.js";

export function initCam() {
  CamSet(_vec3.set(16, 0, 3), _vec3.set(0, 0, 3), _vec3.set(0, 1, 0));
}

export function renderCam() {
  let Dist = _vec3.len(_vec3.sub(cam.At, cam.Loc));
  let cosT, sinT, cosP, sinP, plen, Azimuth, Elevator;
  let Wp, Hp, sx, sy;
  let dv;

  Wp = Hp = cam.ProjSize;
  cosT = (cam.Loc.y - cam.At.y) / Dist;
  sinT = Math.sqrt(1 - cosT * cosT);

  plen = Dist * sinT;
  cosP = (cam.Loc.z - cam.At.z) / plen;
  sinP = (cam.Loc.x - cam.At.x) / plen;

  Azimuth = (Math.atan2(sinP, cosP) / Math.PI) * 180;
  Elevator = (Math.atan2(sinT, cosT) / Math.PI) * 180;

  Azimuth +=
    myTimer.globalDeltaTime * 1.5 * (-5 * myInput.MouseClickLeft * myInput.Mdx);
  Elevator +=
    myTimer.globalDeltaTime * 1.5 * (-5 * myInput.MouseClickLeft * myInput.Mdy);

  if (Elevator < 0.08) Elevator = 0.08;
  else if (Elevator > 178.9) Elevator = 178.9;

  Dist += myTimer.globalDeltaTime * (2 * myInput.MouseWheel);

  if (Dist < 0.1) Dist = 0.1;
  if (myInput.MouseClickRight) {
    sx = (((myInput.Mdx * Wp) / 1200) * Dist) / -cam.ProjDist;
    sy = (((myInput.Mdy * Hp) / 1200) * Dist) / cam.ProjDist;

    dv = _vec3.add(_vec3.mulnum(cam.Right, sx), _vec3.mulnum(cam.Up, sy));

    cam.At = _vec3.add(cam.At, dv);
    cam.Loc = _vec3.add(cam.Loc, dv);
  }
  CamSet(
    _vec3.point_transform(
      _vec3.set(0, Dist, 0),
      _matr4.mulmatr(
        _matr4.mulmatr(_matr4.rotateX(Elevator), _matr4.rotateY(Azimuth)),
        _matr4.translate(cam.At)
      )
    ),
    cam.At,
    _vec3.set(0, 1, 0)
  );

  UBO.update(CamUBO, Ubo_cell.MatrVP, cam.MatrVP);
  UBO.update(CamUBO, Ubo_cell.MatrV, cam.MatrView);
  UBO.update(CamUBO, Ubo_cell.CamLoc, cam.Loc);
  UBO.update(CamUBO, Ubo_cell.CamAt, cam.At);
  UBO.update(CamUBO, Ubo_cell.CamRight, cam.Right);
  UBO.update(CamUBO, Ubo_cell.CamUp, cam.Up);
  UBO.update(CamUBO, Ubo_cell.CamDir, cam.Dir);
  //   if (Ani->Keys[VK_SHIFT] && Ani->KeysClick['P'])
  //     Ani->IsPause = !Ani->IsPause;
}
