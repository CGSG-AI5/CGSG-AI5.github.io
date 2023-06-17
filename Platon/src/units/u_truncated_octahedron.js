let Pr_tru_oct;

function initTruOct() {
  let Vs = [];
  let Vr = [];
  let col = [0, 1, 2, 0, -1, -2, 0, -1, 2, 0, 1, -2];

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      for (let l = 0; l < 2; l++) {
        Vr[i * 2 + l + j * 6] = new vertex(
          _vec3.set(
            col[j * 3 + i],
            col[j * 3 + ((i + l + 1) % 3)],
            col[j * 3 + ((i + 2 * l + 2) % 3)]
          ),
          _vec3.set(j / 3, l / 2, l),
          _vec3.set(0, 0, 0)
        );
      }
    }
  }

  let indices = [
    /*squere 1*/

    0, 12, 15,

    0, 3, 12,

    /*squere 2*/

    1, 13, 2,

    1, 14, 13,

    /*squere 3*/

    5, 17, 4,

    5, 16, 17,

    /*squere 4*/

    11, 10, 22,

    10, 23, 22,

    /*squere 5*/

    20, 7, 19,

    19, 7, 8,

    /*squere 6*/

    6, 18, 9,

    6, 21, 18,

    /* hexagon 1 */

    5, 2, 13,

    13, 18, 5,

    5, 18, 21,

    21, 16, 5,

    /* hexagon 2 */

    5, 1, 2,

    1, 5, 0,

    5, 3, 0,

    3, 5, 4,

    /* hexagon 3 */

    14, 1, 0,

    0, 23, 14,

    0, 22, 23,

    22, 0, 15 /* hexagon 4 */,

    18, 13, 14,

    14, 23, 18,

    9, 18, 23,

    9, 23, 10,

    /* hexagon 5 */

    8, 11, 19,

    19, 11, 12,

    11, 15, 12,

    11, 22, 15,

    /* hexagon 6 */

    19, 12, 20,

    20, 12, 17,

    12, 3, 17,

    17, 3, 4,

    /* hexagon 7 */

    20, 17, 7,

    17, 6, 7,

    17, 21, 6,

    21, 17, 16,

    /* hexagon 8 */

    8, 7, 11,

    11, 7, 6,

    11, 6, 10,

    9, 10, 6,
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
  Pr_tru_oct = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Ruby)
  );
}

function renderTruOct() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(0.5, 0.5, 0.5)),
    _matr4.translate(_vec3.set(-5, 0, 6))
  );
  prim.draw(Pr_tru_oct, Worl);
}
