let Pr_cub_oct;

function initCubOct() {
  let Vs = [];
  let Vr = [];

  Vr[0] = new vertex(
    _vec3.set(0, 1, 1),
    _vec3.set(0.5, 0.5, 0.5),
    _vec3.set(0, 0, 0)
  );
  Vr[1] = new vertex(
    _vec3.set(0, -1, 1),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[2] = new vertex(
    _vec3.set(0, 1, -1),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[3] = new vertex(
    _vec3.set(0, -1, -1),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[4] = new vertex(
    _vec3.set(1, 0, 1),
    _vec3.set(0, 1, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[5] = new vertex(
    _vec3.set(-1, 0, 1),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[6] = new vertex(
    _vec3.set(1, 0, -1),
    _vec3.set(1, 0, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[7] = new vertex(
    _vec3.set(-1, 0, -1),
    _vec3.set(1, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[8] = new vertex(
    _vec3.set(1, 1, 0),
    _vec3.set(1, 1, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[9] = new vertex(
    _vec3.set(1, -1, 0),
    _vec3.set(0, 0.5, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[10] = new vertex(
    _vec3.set(-1, 1, 0),
    _vec3.set(0, 0, 0.5),
    _vec3.set(0, 0, 0)
  );

  Vr[11] = new vertex(
    _vec3.set(-1, -1, 0),
    _vec3.set(0.5, 0, 0),
    _vec3.set(0, 0, 0)
  );

  let indices = [
    8, 2, 6,

    5, 10, 0,

    3, 9, 6,

    5, 1, 11,

    0, 10, 2,

    /** 15 **/

    0, 2, 8,

    11, 1, 3,

    9, 3, 1,

    0, 8, 4,

    1, 4, 9,

    /* 30 */

    2, 10, 7,

    3, 7, 11,

    11, 7, 10,

    11, 10, 5,

    2, 7, 3,

    /* 45 */

    2, 3, 6,

    1, 5, 0,

    1, 0, 4,

    9, 8, 6,

    9, 4, 8,
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
  Pr_cub_oct = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Brass)
  );
}

function renderCubOct() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(1, 1, 1)),
    _matr4.translate(_vec3.set(-5, 0, 0))
  );
  prim.draw(Pr_cub_oct, Worl);
}
