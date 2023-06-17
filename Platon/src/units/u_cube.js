import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";
let Pr_cube;

export function initCube() {
  let Vrts = [];
  Vrts[0] = new vertex(
    _vec3.set(-1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1)
  );
  Vrts[1] = new vertex(
    _vec3.set(-1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1)
  );
  Vrts[2] = new vertex(
    _vec3.set(1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1)
  );
  Vrts[3] = new vertex(
    _vec3.set(1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1)
  );

  Vrts[4] = new vertex(
    _vec3.set(-1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(-1, 0, 0)
  );
  Vrts[5] = new vertex(
    _vec3.set(-1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(-1, 0, 0)
  );
  Vrts[6] = new vertex(
    _vec3.set(-1, 1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(-1, 0, 0)
  );
  Vrts[7] = new vertex(
    _vec3.set(-1, -1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(-1, 0, 0)
  );

  Vrts[8] = new vertex(
    _vec3.set(-1, 1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, -1)
  );
  Vrts[9] = new vertex(
    _vec3.set(-1, -1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, -1)
  );
  Vrts[10] = new vertex(
    _vec3.set(1, 1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, -1)
  );
  Vrts[11] = new vertex(
    _vec3.set(1, -1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, -1)
  );

  Vrts[12] = new vertex(
    _vec3.set(1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(1, 0, 0)
  );
  Vrts[13] = new vertex(
    _vec3.set(1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(1, 0, 0)
  );
  Vrts[14] = new vertex(
    _vec3.set(1, 1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(1, 0, 0)
  );
  Vrts[15] = new vertex(
    _vec3.set(1, -1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(1, 0, 0)
  );

  Vrts[16] = new vertex(
    _vec3.set(-1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0)
  );
  Vrts[17] = new vertex(
    _vec3.set(1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0)
  );
  Vrts[18] = new vertex(
    _vec3.set(-1, 1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0)
  );
  Vrts[19] = new vertex(
    _vec3.set(1, 1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0)
  );

  Vrts[20] = new vertex(
    _vec3.set(-1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, -1, 0)
  );
  Vrts[21] = new vertex(
    _vec3.set(1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, -1, 0)
  );
  Vrts[22] = new vertex(
    _vec3.set(-1, -1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, -1, 0)
  );
  Vrts[23] = new vertex(
    _vec3.set(1, -1, -1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, -1, 0)
  );

  let indices = [
    0, 1, 2,

    2, 3, 1,

    4, 5, 6,

    5, 6, 7,

    8, 9, 10,

    10, 9, 11,

    12, 13, 14,

    13, 14, 15,

    12, 13, 14,

    16, 17, 18,

    17, 18, 19,

    20, 21, 22,

    21, 22, 23,
  ];
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
  Pr_cube = prim.create(
    Vrts,
    Vrts.length,
    indices,
    indices.length,
    material.add(Matlib.Obsidian)
  );
}

export function renderCube() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(0.7, 0.7, 0.7)),
    _matr4.translate(_vec3.set(0, 0, 0))
  );

  prim.draw(Pr_cube, Worl);
}
