import { _vec3 } from "./mathvec3.js";
import { _matr4 } from "./mathmat4.js";
export let cam;

let ProjSize = 0.1 /* Project plane fit square */,
  ProjDist = 0.1 /* Distance to project plane from viewer (near) */,
  ProjFarClip = 300; /* Distance to project far clip plane (far) */


class _camera {
  constructor(
    ProjSize,
    ProjDist,
    ProjFarClip,
    MatrVP,
    MatrView,
    MatrProj,
    Loc,
    At,
    Dir,
    Up,
    Right
  ) {
    this.ProjSize = ProjSize;
    this.ProjDist = ProjDist;
    this.ProjFarClip = ProjFarClip;
    this.MatrVP = MatrVP;
    this.MatrView = MatrView;
    this.MatrProj = MatrProj;
    this.Loc = Loc;
    this.At = At;
    this.Dir = Dir;
    this.Up = Up;
    this.Right = Right;
  }

  static view(Loc, At, Up1) {
    const Dir = _vec3.normalize(_vec3.sub(At, Loc)),
      Right = _vec3.normalize(_vec3.cross(Dir, Up1)),
      Up = _vec3.cross(Right, Dir);
    return _matr4.set(
      Right.x,
      Up.x,
      -Dir.x,
      0,
      Right.y,
      Up.y,

      -Dir.y,
      0,
      Right.z,
      Up.z,
      -Dir.z,
      0,
      -_vec3.dot(Loc, Right),
      -_vec3.dot(Loc, Up),
      _vec3.dot(Loc, Dir),
      1
    );
  }
}

export function CamSet(Loc, At, Up1) {
  let Up, Dir, Right;
  ``;
  let FrameW = 1200,
    FrameH = 1200;
  let MatrView = _camera.view(Loc, At, Up1);

  Up = _vec3.set(MatrView[0][1], MatrView[1][1], MatrView[2][1]);
  Dir = _vec3.set(-MatrView[0][2], -MatrView[1][2], -MatrView[2][2]);
  Right = _vec3.set(MatrView[0][0], MatrView[1][0], MatrView[2][0]);

  const rx = ProjSize,
    ry = ProjSize;

  let MatrProj = _matr4.frustum(
      -rx / 2,
      rx / 2,
      -ry / 2,
      ry / 2,

      ProjDist,
      ProjFarClip
    ),
    MatrVP = _matr4.mulmatr(MatrView, MatrProj);

  cam =  new _camera(
    ProjSize,
    ProjDist,
    ProjFarClip,
    MatrVP,
    MatrView,
    MatrProj,
    Loc,
    At,
    Dir,
    Up,
    Right
  );
}
