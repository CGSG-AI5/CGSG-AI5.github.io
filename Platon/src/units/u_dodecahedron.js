import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myTimer } from "../timer.js";
let Pr_dod;

export function initDod() {
  let Vs = [];
  let Vr = [];

  Vr[0] = new vertex(
    _vec3.set(-0.149071198499986, 0.6314757303333053, -0.4587939734903912),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );
  Vr[1] = new vertex(
    _vec3.set(0.3902734644166456, 0.6314757303333053, -0.28355026945068),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[2] = new vertex(
    _vec3.set(-0.149071198499986, 0.6314757303333053, 0.4587939734903912),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[3] = new vertex(
    _vec3.set(0.3902734644166456, 0.6314757303333053, 0.28355026945068),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[4] = new vertex(
    _vec3.set(-0.4824045318333194, 0.6314757303333053, 0),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[5] = new vertex(
    _vec3.set(0.24120226591665964, -0.14907119849998599, -0.7423442429410713),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[6] = new vertex(
    _vec3.set(0.6314757303333053, 0.14907119849998599, -0.4587939734903912),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[7] = new vertex(
    _vec3.set(-0.24120226591665964, 0.14907119849998599, -0.7423442429410713),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[8] = new vertex(
    _vec3.set(-0.6314757303333053, -0.14907119849998599, -0.4587939734903912),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[9] = new vertex(
    _vec3.set(-0.7805469288332914, 0.14907119849998599, 0),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[10] = new vertex(
    _vec3.set(-0.6314757303333053, -0.14907119849998599, 0.4587939734903912),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[11] = new vertex(
    _vec3.set(-0.24120226591665964, 0.14907119849998599, 0.7423442429410713),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[12] = new vertex(
    _vec3.set(0.24120226591665964, -0.14907119849998599, 0.7423442429410713),
    _vec3.set(1, 1, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[13] = new vertex(
    _vec3.set(0.6314757303333053, 0.14907119849998599, 0.4587939734903912),
    _vec3.set(1, 1, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[14] = new vertex(
    _vec3.set(0.7805469288332914, -0.14907119849998599, 0),
    _vec3.set(1, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[15] = new vertex(
    _vec3.set(-0.3902734644166456, -0.6314757303333053, -0.28355026945068),
    _vec3.set(0, 1, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[16] = new vertex(
    _vec3.set(-0.3902734644166456, -0.6314757303333053, 0.28355026945068),
    _vec3.set(1, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[17] = new vertex(
    _vec3.set(0.14907119849998599, -0.6314757303333053, 0.4587939734903912),
    _vec3.set(1, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[18] = new vertex(
    _vec3.set(0.48240453183331927, -0.6314757303333053, 0),
    _vec3.set(1, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[19] = new vertex(
    _vec3.set(0.14907119849998599, -0.6314757303333053, -0.4587939734903912),
    _vec3.set(1, 1, 0),
    _vec3.set(0, 0, 0)
  );

  let indices = [
    0,
    1,
    2, // 0

    2,
    1,
    3,

    2,
    4,
    0,

    0,
    5,
    1, // 9

    5,
    6,
    1,

    5,
    0,
    7,

    0,
    4,
    8, // 18

    0,
    8,
    7,

    4,
    9,
    8,

    10,
    4,
    2, // 27

    10,
    9,
    4,

    10,
    2,
    11,

    12,
    2,
    3, // 36

    12,
    11,
    2,

    12,
    3,
    13,

    3,
    1,
    14, // 45

    3,
    14,
    13,

    1,
    6,
    14,

    9,
    16,
    15, // 54

    9,
    15,
    8,

    9,
    10,
    16,

    16,
    11,
    17, // 63

    11,
    16,
    10,

    11,
    12,
    17,

    18,
    17,
    13, // 72

    13,
    14,
    18,

    13,
    17,
    12,

    18,
    6,
    19, // 81

    6,
    18,
    14,

    6,
    5,
    19,

    15,
    19,
    7, // 90

    7,
    8,
    15,

    7,
    19,
    5,

    19,
    15,
    17, // 99

    16,
    17,
    15,

    19,
    17,
    18,
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
  Pr_dod = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Gold)
  );
}

export function renderDod() {
  let Worl = _matr4.mulmatr(
    _matr4.mulmatr(
      _matr4.mulmatr(
        _matr4.rotateY(47 * myTimer.localTime * 0),
        _matr4.scale(_vec3.set(1 / _vec3.len(_vec3.set(0.14907119849998599, -0.6314757303333053, 0.4587939734903912)),1 / _vec3.len(_vec3.set(0.14907119849998599, -0.6314757303333053, 0.4587939734903912)),1 / _vec3.len(_vec3.set(0.14907119849998599, -0.6314757303333053, 0.4587939734903912))))
      ),
      _matr4.rotateY(80 * myTimer.localTime * 0)
    ),
    _matr4.translate(_vec3.set(0, 0, 9))
  );
  prim.draw(Pr_dod, Worl);
}
