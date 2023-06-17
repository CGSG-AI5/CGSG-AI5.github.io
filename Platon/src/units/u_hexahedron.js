import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myTimer } from "../timer.js";
let Pr_hex;

export function initHex() {
  let Vs = [];
  let Vr = [];

  Vr[0] = new vertex(
    _vec3.set(1, 0, 0),
    _vec3.set(1, 1, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[1] = new vertex(
    _vec3.set(-1, 0, 0),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  Vr[2] = new vertex(
    _vec3.set(0, 1, 0),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[3] = new vertex(
    _vec3.set(0, -1, 0),
    _vec3.set(1, 1, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[4] = new vertex(
    _vec3.set(0, 0, 1),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  Vr[5] = new vertex(
    _vec3.set(0, 0, -1),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );

  let indices = [
    1, 3, 5,

    0, 5, 3,

    1, 4, 3,

    0, 3, 4,

    1, 5, 2,

    0, 2, 5,

    1, 2, 4,

    0, 4, 2,
  ];
  for (let i = 0; i < 24; i++) {
    Vs[i] = vertex.create(Vr[indices[i]]);
  }

  indices = [
    0, 1, 2,

    3, 4, 5,

    6, 7, 8,

    9, 10, 11,

    12, 13, 14,

    15, 16, 17,

    18, 19, 20,

    21, 22, 23,
  ];

  prim.create_normal(Vs, 0);
  prim.create_normal(Vs, 3);
  prim.create_normal(Vs, 6);
  prim.create_normal(Vs, 9);
  prim.create_normal(Vs, 12);
  prim.create_normal(Vs, 15);
  prim.create_normal(Vs, 18);
  prim.create_normal(Vs, 21);

  let Mtl = material.MtlGetDef();
  Mtl = new material(
    _vec3.set(),
    _vec3.set(0.23125, 0.23125, 0.23125),
    _vec3.set(0.2775, 0.2775, 0.2775),
    _vec3.set(0.773911, 0.773911, 0.773911),
    9.8,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  );
  Pr_hex = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Pearl)
  );
}

export function renderHex() {
  let Worl = _matr4.mulmatr(
    _matr4.mulmatr(
      _matr4.mulmatr(
        _matr4.rotateY(47 * myTimer.localTime * 0),
        _matr4.rotateZ(47 * myTimer.localTime * 0 + 45 * 0)
      ),
      _matr4.rotateY(80 * myTimer.localTime * 0)
    ),
    _matr4.translate(_vec3.set(0, 0, 3))
  );

  prim.draw(Pr_hex, Worl);
}
