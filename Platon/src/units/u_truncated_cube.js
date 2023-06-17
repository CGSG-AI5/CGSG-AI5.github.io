let Pr_tru_cub;

function initTruCub() {
  let Vs = [];
  let Vr = [];
  let col = [1, 1, Math.sqrt(2) - 1];

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
    /* triangle*/

    0, 16, 8,

    1, 9, 17,

    2, 10, 18,

    3, 19, 11,

    4, 12, 20,

    5, 21, 13,

    6, 22, 14,

    7, 15, 23,

    /*octagon 1*/

    0, 8, 1,

    8, 9, 1,

    8, 10, 9,

    10, 11, 9,

    10, 2, 11,

    11, 2, 3,

    /*octagon 2*/

    9, 13, 17,

    17, 13, 21,

    13, 9, 11,

    11, 15, 13,

    11, 23, 15,

    19, 23, 11,

    /*octagon 3*/

    5, 13, 4,

    13, 12, 4,

    15, 14, 12,

    14, 15, 7,

    14, 7, 6,

    13, 15, 12,

    /*octagon 4*/

    20, 8, 16,

    20, 12, 8,

    14, 8, 12,

    14, 10, 8,

    14, 18, 10,

    18, 14, 22,

    /*octagon 5*/

    19, 3, 18,

    2, 18, 3,

    18, 22, 19,

    23, 19, 22,

    23, 22, 7,

    6, 7, 22,

    /*octagon 6*/

    0, 1, 16,

    16, 1, 17,

    17, 21, 16,

    16, 21, 20,

    21, 4, 20,

    21, 5, 4,
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
  Pr_tru_cub = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Jade)
  );
}

function renderTruCub() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(0.9, 0.9, 0.9)),
    _matr4.translate(_vec3.set(-5, 0, 3))
  );
  prim.draw(Pr_tru_cub, Worl);
}
