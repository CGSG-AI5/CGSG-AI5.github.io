let Pr_rhom;

function initRhom() {
  let Vs = [];
  let Vr = [];
  let col = [1, 1, Math.sqrt(2) + 1];

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 2; i++) {
      for (let l = 0; l < 2; l++) {
        for (let k = 0; k < 2; k++) {
          Vr[k + l * 2 + i * 4 + j * 8] = new vertex(
            _vec3.set(
              col[j] * (i * 2 - 1),
              col[(j + 1) % 3] * (l * 2 - 1),
              col[(j + 2) % 3] * (k * 2 - 1)
            ),
            _vec3.set(i, l, k),
            _vec3.set(0, 0, 0)
          );
        }
      }
    }
  }

  let indices = [
    /*triangles*/

    0, 16, 8,

    1, 9, 17,

    2, 10, 18,

    3, 19, 11,

    4, 12, 20,

    5, 21, 13,

    6, 22, 14,

    7, 15, 23,

    /* square before 1 - 5*/

    7, 23, 5,

    23, 21, 5,

    23, 22, 21,

    22, 20, 21,

    20, 13, 21,

    13, 20, 12,

    15, 14, 23,

    23, 14, 22,

    22, 6, 20,

    4, 20, 6,

    /* square back 6 - 10*/

    16, 17, 9,

    16, 9, 8,

    0, 2, 16,

    16, 2, 18,

    18, 19, 16,

    19, 17, 16,

    19, 1, 17,

    1, 19, 3,

    18, 10, 19,

    10, 11, 19,

    /*squre up-down 11 - 12*/

    10, 15, 11,

    14, 15, 10,

    8, 9, 12,

    12, 9, 13,

    /*squre right 13 - 15*/

    6, 2, 4,

    0, 4, 2,

    14, 2, 6,

    2, 14, 10,

    12, 4, 0,

    0, 8, 12,

    /*squre left 16 - 18*/

    3, 7, 1,

    1, 7, 5,

    7, 3, 15,

    11, 15, 3,

    1, 5, 9,

    9, 5, 13,
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
  Pr_rhom = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Bronze)
  );
}

function renderRhom() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(0.4, 0.4, 0.4)),
    _matr4.translate(_vec3.set(-5, 0, 9))
  );
  prim.draw(Pr_rhom, Worl);
}
