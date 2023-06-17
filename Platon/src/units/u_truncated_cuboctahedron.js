let Pr_tru_cub_oct;
let col = [1, Math.sqrt(2) + 1, 2 * Math.sqrt(2) + 1];

function initTruCubOct() {
  let Vs = [];
  let Vr = [];


  for (let m = 0; m < 2; m++) {
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 2; i++) {
        col[0] *= m * 2 - 1;
        col[1] *= j * 2 - 1;
        col[2] *= i * 2 - 1;

        for (let l = 0; l < 3; l++) {
          for (let k = 0; k < 2; k++) {
            Vr[k + l * 2 + i * 6 + j * 12 + m * 24] = new vertex(
              _vec3.set(
                col[l],
                col[(l + k + 1) % 3],
                col[3 - ((l + k + 1) % 3) - l]
              ),
              _vec3.set((m + k + i) / 7, l / 2, k),
              _vec3.set(0, 0, 0)
            );
          }
        }
        col[0] *= m * 2 - 1;
        col[1] *= j * 2 - 1;
        col[2] *= i * 2 - 1;
      }
    }
  }

  let indices = [
    /*hexagon 1*/

    42, 43, 44,

    45, 47, 46,

    45, 42, 47,

    42, 44, 47,

    /*hexagon 2*/

    30, 21, 22,

    35, 38, 37,

    30, 22, 35,

    35, 37, 30,

    /*hexagon 3*/

    32, 19, 18,

    41, 33, 40,

    33, 41, 32,

    33, 32, 18,

    /*hexagon 4*/

    20, 36, 23,

    23, 36, 39,

    23, 39, 34,

    20, 31, 36,

    /*square 1-3*/

    46, 22, 21,

    46, 21, 45,

    18, 19, 43,

    43, 42, 18,

    20, 23, 44,

    47, 44, 23,

    /*square 4-5*/

    40, 33, 9,

    9, 16, 40,

    41, 17, 32,

    8, 32, 17,

    /*square 6-7*/

    30, 37, 13,

    13, 6, 30, 

    35, 14, 38,

    35, 11, 14,

    /*square 8-9*/

    36, 31, 12,

    31, 7, 12,

    34, 39, 10,

    10, 39, 15,

    /*hexagon 5*/

    13, 9, 6,

    13, 16, 9,

    16, 13, 26,

    16, 26, 29,

    /*hexagon 6*/

    10, 14, 11,

    14, 10, 15,

    15, 25, 14,

    25, 15, 24,

    /*hexagon 7*/

    17, 27, 8,

    17, 28, 27,

    27, 12, 8,

    12, 7, 8,

    /*sqaure 10-12*/

    2, 5, 26,

    5, 29, 26,

    27, 28, 4,

    3, 27, 4, 
    
    0, 1, 25,

    25, 24, 0, 

    /*hexagon 8*/

    0, 2, 1,

    3, 4, 5,

    0, 3, 5,

    0, 5, 2,

    /* octagon  1*/

    7, 20, 8,

    20, 19, 8,

    7, 31, 20,

    8, 19, 32,

    19, 44, 43,

    44, 19, 20,

    /* octagon  2*/

    6, 9, 33,

    18, 6, 33,

    6, 18, 30,

    42, 30, 18,

    30, 42, 45,

    45, 21, 30,

    /* octagon  3*/

    10, 11, 34,

    11, 35, 34,

    35, 23, 34, 

    23, 35, 22,

    23, 22, 46, 

    47, 23, 46
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
  Pr_tru_cub_oct = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Jade)
  );
}

function renderTruCubOct() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(1 / _vec3.len(_vec3.set(col[0], col[1], col[2])),1 / _vec3.len(_vec3.set(col[0], col[1], col[2])),1 / _vec3.len(_vec3.set(col[0], col[1], col[2])))),
    _matr4.translate(_vec3.set(0, 0, 0))
  );
  prim.draw(Pr_tru_cub_oct, Worl);
}
