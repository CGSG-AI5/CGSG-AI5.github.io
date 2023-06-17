import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myTimer } from "../timer.js";

let Pr_iso;

export function initIso() {
  let Vs = [];
  let Vr = [];

  Vr[0] = new vertex(
    _vec3.set(0, -1, 0),
    _vec3.set(1, 1, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[1] = new vertex(
    _vec3.set(0, 1, 0),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  Vr[2] = new vertex(
    _vec3.set(-2 / Math.sqrt(5), -1 / Math.sqrt(5), 0),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[3] = new vertex(
    _vec3.set(2 / Math.sqrt(5), 1 / Math.sqrt(5), 0),
    _vec3.set(1, 1, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[4] = new vertex(
    _vec3.set(
      0.5 + 0.5 / Math.sqrt(5),
      -1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  Vr[5] = new vertex(
    _vec3.set(
      0.5 + 0.5 / Math.sqrt(5),
      -1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[6] = new vertex(
    _vec3.set(
      -0.1 * (5 + Math.sqrt(5)),
      1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[7] = new vertex(
    _vec3.set(
      -0.1 * (5 + Math.sqrt(5)),
      1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 - Math.sqrt(5)))
    ),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[8] = new vertex(
    _vec3.set(
      0.1 * Math.sqrt(5) - 0.5,
      -1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[9] = new vertex(
    _vec3.set(
      0.1 * Math.sqrt(5) - 0.5,
      -1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[10] = new vertex(
    _vec3.set(
      0.5 - 0.1 * Math.sqrt(5),
      1 / Math.sqrt(5),
      -Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vr[11] = new vertex(
    _vec3.set(
      0.5 - 0.1 * Math.sqrt(5),
      1 / Math.sqrt(5),
      Math.sqrt(0.1 * (5 + Math.sqrt(5)))
    ),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );

  let indices = [
    1, 6, 10,

    1, 10, 3,

    1, 11, 7,

    1, 3, 11,

    1, 7, 6,

    6, 7, 2,

    11, 9, 7,

    11, 3, 5,

    10, 4, 3,

    10, 6, 8,

    4, 5, 3,

    11, 5, 9,

    4, 10, 8,

    2, 7, 9,

    6, 2, 8,

    0, 8, 2,

    2, 9, 0,

    9, 5, 0,

    4, 0, 5,

    4, 8, 0,
  ];
  for (let i = 0; i < indices.length; i++) {
    Vs[i] = vertex.create(Vr[indices[i]]);
  }
  for (let i = 0; i < indices.length; i++) {
    indices[i] = i;
  }

  for (let i = 0; i < indices.length / 3; i++) {
    prim.create_normal(Vs, i * 3);
  }

  let Mtl = material.MtlGetDef();
  Mtl = new material(
    _vec3.set(),
    _vec3.set(0.23125, 0.23125, 0.23125),
    _vec3.set(0.2775, 0.2775, 0.2775),
    _vec3.set(0.773911, 0.773911, 0.773911),
    96.8,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  );
  Pr_iso = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Peweter)
  );
}

export function renderIso() {
  let Worl = _matr4.mulmatr(
    _matr4.mulmatr(
      _matr4.mulmatr(
        _matr4.rotateY(47 * myTimer.localTime * 0),
        _matr4.rotateZ(47 * myTimer.localTime * 0 + 45 * 0)
      ),
      _matr4.rotateY(80 * myTimer.localTime * 0)
    ),
    _matr4.translate(_vec3.set(0, 0, 6))
  );

  prim.draw(Pr_iso, Worl);
}
