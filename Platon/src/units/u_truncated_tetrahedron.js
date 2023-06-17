let Pr_tru_tetr;

function initTruTetr() {
  let Vs = [];
  let Vr = [];
  //   (+3,+1,+1), (+1,+3,+1), (+1,+1,+3)
  // (−3,−1,+1), (−1,−3,+1), (−1,−1,+3)
  // (−3,+1,−1), (−1,+3,−1), (−1,+1,−3)
  // (+3,−1,−1), (+1,−3,−1), (+1,−1,−3)
  Vr[0] = new vertex(
    _vec3.set(3, 1, 1),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );
  Vr[1] = new vertex(
    _vec3.set(1, 3, 1),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[2] = new vertex(
    _vec3.set(1, 1, 3),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[3] = new vertex(
    _vec3.set(-3, -1, 1),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[4] = new vertex(
    _vec3.set(-1, -3, 1),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[5] = new vertex(
    _vec3.set(-1, -1, 3),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[6] = new vertex(
    _vec3.set(-3, 1, -1),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[7] = new vertex(
    _vec3.set(-1, 3, -1),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[8] = new vertex(
    _vec3.set(-1, 1, -3),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[9] = new vertex(
    _vec3.set(3, -1, -1),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Vr[10] = new vertex(
    _vec3.set(1, -3, -1),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );

  Vr[11] = new vertex(
    _vec3.set(1, -1, -3),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );

  let indices = [
    0,
    2,
    1,

    3,
    5,
    4,

    6,
    8,
    7,

    9,
    11,
    10,

    0,
    1,
    7,

    7,
    8,
    0, // 15

    11,
    0,
    8,

    11,
    9,
    0,

    1,
    2,
    7,

    7,
    2,
    6, // 27

    6,
    2,
    3,

    5,
    3,
    2,

    2,
    0,
    9,

    5,
    2,
    9, //39

    4,
    5,
    9,

    4,
    9,
    10,

    3,
    4,
    11, // 48

    4,
    10,
    11,

    6,
    11,
    8,

    11,
    6,
    3,
  ];
  for (let i = 0; i < indices.length; i++) {
    Vs[i] = vertex.create(Vr[indices[i]]);
  }
  for (let i = 0; i < indices.length; i++) {
    indices[i] = i;
  }

  for (let i = 0; i < 60 / 3; i++) {
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
  Pr_tru_tetr = prim.create(
    Vs,
    Vs.length,
    indices,
    indices.length,
    material.add(Matlib.Copper)
  );
}

function renderTruTetr() {
  for (let i = 0; i < 1; i++) {
    let Worl = _matr4.mulmatr(
      _matr4.scale(_vec3.set(0.4, 0.4, 0.4)),
      _matr4.translate(_vec3.set(-5, 0, -3))
    );
    prim.draw(Pr_tru_tetr, Worl);
  }
}
