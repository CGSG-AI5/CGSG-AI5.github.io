(function () {
  'use strict';

  class _vec3 {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    static set(x, y, z) {
      return new _vec3(x, y, z);
    }

    static add(a, b) {
      return new _vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static sub(a, b) {
      return new _vec3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static mulnum(a, b) {
      return new _vec3(a.x * b, a.y * b, a.z * b);
    }

    static divnum(a, b) {
      return new _vec3(a.x / b, a.y / b, a.z / b);
    }

    static neg(a) {
      return new _vec3(-a.x, -a.y, -a.z);
    }

    static dot(a, b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static cross(a, b) {
      return new _vec3(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - b.x * a.y
      );
    }

    static len2(a) {
      return a.x * a.x + a.y * a.y + a.z * a.z;
    }

    //  return Vec3Set(
    //     P.X * M.M[0][0] + P.Y * M.M[1][0] + P.Z * M.M[2][0] + M.M[3][0],
    //     P.X * M.M[0][1] + P.Y * M.M[1][1] + P.Z * M.M[2][1] + M.M[3][1],
    //     P.X * M.M[0][2] + P.Y * M.M[1][2] + P.Z * M.M[2][2] + M.M[3][2]

    static len(a) {
      return Math.sqrt(_vec3.len2(a));
    }

    static normalize(a) {
      return _vec3.divnum(a, _vec3.len(a));
    }

    static point_transform(a, b) {
      return new _vec3(
        a.x * b[0][0] + a.y * b[1][0] + a.z * b[2][0] + b[3][0],
        a.x * b[0][1] + a.y * b[1][1] + a.z * b[2][1] + b[3][1],
        a.x * b[0][2] + a.y * b[1][2] + a.z * b[2][2] + b[3][2]
      );
    }

    static vectort_ransform(a, b) {
      return new _vec3(
        a.x * b[0][0] + a.y * b[1][0] + a.z * b[2][0],
        a.x * b[0][1] + a.y * b[1][1] + a.z * b[2][1],
        a.x * b[0][2] + a.y * b[1][2] + a.z * b[2][2]
      );
    }
    // FLT w = V.X * M.M[0][3] + V.Y * M.M[1][3] + V.Z * M.M[2][3] + M.M[3][3];

    static mul_matr(a, b) {
      const w = a.x * b[0][3] + a.y * b[1][3] + a.z * b[2][3] + b[3][3];
      return new _vec3(
        (a * b[0][0] + a.y * b[1][0] + a.z * b[2][0] + b[3][0]) / w,
        (a * b[0][1] + a.y * b[1][1] + a.z * b[2][1] + b[3][1]) / w,
        (a * b[0][2] + a.y * b[1][2] + a.z * b[2][2] + b[3][2]) / w
      );
    }

    static vec3(a) {
      return [a.x, a.y, a.z];
    }
  }

  function D2R(degree) {
    return (degree * Math.PI) / 180;
  }

  class _matr4 {
    constructor(
      a00,
      a01,
      a02,
      a03,
      a10,
      a11,
      a12,
      a13,
      a20,
      a21,
      a22,
      a23,
      a30,
      a31,
      a32,
      a33
    ) {
      this.a = [
        [a00, a01, a02, a03],
        [a10, a11, a12, a13],
        [a20, a21, a22, a23],
        [a30, a31, a32, a33],
      ];
    }

    static identity() {
      return new _matr4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).a;
    }
    static set(
      a00,
      a01,
      a02,
      a03,
      a10,
      a11,
      a12,
      a13,
      a20,
      a21,
      a22,
      a23,
      a30,
      a31,
      a32,
      a33
    ) {
      return new _matr4(
        a00,
        a01,
        a02,
        a03,
        a10,
        a11,
        a12,
        a13,
        a20,
        a21,
        a22,
        a23,
        a30,
        a31,
        a32,
        a33
      ).a;
    }
    static translate(a) {
      return new _matr4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, a.x, a.y, a.z, 1).a;
    }
    static scale(a) {
      return new _matr4(a.x, 0, 0, 0, 0, a.y, 0, 0, 0, 0, a.z, 0, 0, 0, 0, 1).a;
    }

    static rotateZ(degree) {
      const r = D2R(degree),
        co = Math.cos(r),
        si = Math.sin(r);
      let m = _matr4.identity();

      m[0][0] = co;
      m[1][0] = -si;
      m[0][1] = si;
      m[1][1] = co;

      return m;
    }
    static rotateX(degree) {
      const r = D2R(degree),
        co = Math.cos(r),
        si = Math.sin(r);
      let m = _matr4.identity();

      m[1][1] = co;
      m[2][1] = -si;
      m[1][2] = si;
      m[2][2] = co;

      return m;
    }

    static rotateY(degree) {
      const r = D2R(degree),
        co = Math.cos(r),
        si = Math.sin(r);
      let m = _matr4.identity();

      m[0][0] = co;
      m[2][0] = si;
      m[0][2] = -si;
      m[2][2] = co;

      return m;
    }

    static mulmatr(m1, m2) {
      let r = _matr4.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
        k = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          for (r[i][j] = 0, k = 0; k < 4; k++) {
            r[i][j] += m1[i][k] * m2[k][j];
          }
        }
      }
    }

    static mulmatr(m1, m2) {
      let r = _matr4.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
        k = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          for (r[i][j] = 0, k = 0; k < 4; k++) {
            r[i][j] += m1[i][k] * m2[k][j];
          }
        }
      }
      return r;
    }

    static transpose(m) {
      let r = _matr4.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          r[i][j] = m[j][i];
        }
      }
      return r;
    }

    static determ3x3(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
      return (
        a11 * a22 * a33 -
        a11 * a23 * a32 -
        a12 * a21 * a33 +
        a12 * a23 * a31 +
        a13 * a21 * a32 -
        a13 * a22 * a31
      );
    }

    static determ(m) {
      return (
        m[0][0] *
          _matr4.determ3x3(
            m[1][1],
            m[1][2],
            m[1][3],
            m[2][1],
            m[2][2],
            m[2][3],
            m[3][1],
            m[3][2],
            m[3][3]
          ) -
        m[0][1] *
          _matr4.determ3x3(
            m[1][0],
            m[1][2],
            m[1][3],
            m[2][0],
            m[2][2],
            m[2][3],
            m[3][0],
            m[3][2],
            m[3][3]
          ) +
        m[0][2] *
          _matr4.determ3x3(
            m[1][0],
            m[1][1],
            m[1][3],
            m[2][0],
            m[2][1],
            m[2][3],
            m[3][0],
            m[3][1],
            m[3][3]
          ) -
        m[0][3] *
          _matr4.determ3x3(
            m[1][0],
            m[1][1],
            m[1][2],
            m[2][0],
            m[2][1],
            m[2][2],
            m[3][0],
            m[3][1],
            m[3][2]
          )
      );
    }

    static inverse(m) {
      const det = _matr4.determ(m);
      let r = _matr4.identity();
      if (det === 0) return r;
      r[0][0] =
        _matr4.determ3x3(
          m[1][1],
          m[1][2],
          m[1][3],
          m[2][1],
          m[2][2],
          m[2][3],
          m[3][1],
          m[3][2],
          m[3][3]
        ) / det;

      r[1][0] =
        _matr4.determ3x3(
          m[1][0],
          m[1][2],
          m[1][3],
          m[2][0],
          m[2][2],
          m[2][3],
          m[3][0],
          m[3][2],
          m[3][3]
        ) / -det;
      r[2][0] =
        _matr4.determ3x3(
          m[1][0],
          m[1][1],
          m[1][3],
          m[2][0],
          m[2][1],
          m[2][3],
          m[3][0],
          m[3][1],
          m[3][3]
        ) / det;
      r[3][0] =
        _matr4.determ3x3(
          m[1][0],
          m[1][1],
          m[1][2],
          m[2][0],
          m[2][1],
          m[2][2],
          m[3][0],
          m[3][1],
          m[3][2]
        ) / -det;

      r[0][1] =
        _matr4.determ3x3(
          m[0][1],
          m[0][2],
          m[0][3],
          m[2][1],
          m[2][2],
          m[2][3],
          m[3][1],
          m[3][2],
          m[3][3]
        ) / -det;

      r[1][1] =
        _matr4.determ3x3(
          m[0][0],
          m[0][2],
          m[0][3],
          m[2][0],
          m[2][2],
          m[2][3],
          m[3][0],
          m[3][2],
          m[3][3]
        ) / det;

      r[2][1] =
        _matr4.determ3x3(
          m[0][0],
          m[0][1],
          m[0][3],
          m[2][0],
          m[2][1],
          m[2][3],
          m[3][0],
          m[3][1],
          m[3][3]
        ) / -det;
      r[3][1] =
        _matr4.determ3x3(
          m[0][0],
          m[0][1],
          m[0][2],
          m[2][0],
          m[2][1],
          m[2][2],
          m[3][0],
          m[3][1],
          m[3][2]
        ) / det;
      r[0][2] =
        _matr4.determ3x3(
          m[0][1],
          m[0][2],
          m[0][3],
          m[1][1],
          m[1][2],
          m[1][3],
          m[3][1],
          m[3][2],
          m[3][3]
        ) / det;
      r[1][2] =
        _matr4.determ3x3(
          m[0][0],
          m[0][2],
          m[0][3],
          m[1][0],
          m[1][2],
          m[1][3],
          m[3][0],
          m[3][2],
          m[3][3]
        ) / -det;
      r[2][2] =
        _matr4.determ3x3(
          m[0][0],
          m[0][1],
          m[0][3],
          m[1][0],
          m[1][1],
          m[1][3],
          m[3][0],
          m[3][1],
          m[3][3]
        ) / det;
      r[3][2] =
        _matr4.determ3x3(
          m[0][0],
          m[0][1],
          m[0][2],
          m[1][0],
          m[2][1],
          m[1][2],
          m[3][0],
          m[3][1],
          m[3][2]
        ) / -det;
      r[0][3] =
        _matr4.determ3x3(
          m[0][1],
          m[0][2],
          m[0][3],
          m[1][1],
          m[1][2],
          m[1][3],
          m[2][1],
          m[2][2],
          m[2][3]
        ) / -det;
      r[1][3] =
        _matr4.determ3x3(
          m[0][0],
          m[0][2],
          m[0][3],
          m[1][0],
          m[1][2],
          m[1][3],
          m[2][0],
          m[2][2],
          m[2][3]
        ) / det;
      r[2][3] =
        _matr4.determ3x3(
          m[0][0],
          m[0][1],
          m[0][3],
          m[1][0],
          m[1][1],
          m[1][3],
          m[2][0],
          m[2][1],
          m[2][3]
        ) / -det;
      r[3][3] =
        _matr4.determ3x3(
          m[0][0],
          m[0][1],
          m[0][2],
          m[1][0],
          m[2][1],
          m[1][2],
          m[2][0],
          m[2][1],
          m[2][2]
        ) / det;
      return r;
    }
    static frustum(l, r, b, t, n, f) {
      let m = _matr4.identity();

      m[0][0] = (2 * n) / (r - l);
      m[0][1] = 0;
      m[0][2] = 0;
      m[0][3] = 0;

      m[1][0] = 0;
      m[1][1] = (2 * n) / (t - b);
      m[1][2] = 0;
      m[1][3] = 0;

      m[2][0] = (r + l) / (r - l);
      m[2][1] = (t + b) / (t - b);
      m[2][2] = (f + n) / -(f - n);
      m[2][3] = -1;

      m[3][0] = 0;
      m[3][1] = 0;
      m[3][2] = (-2 * n * f) / (f - n);
      m[3][3] = 0;

      return m;
    }

    static toarr(m) {
      let v = [];

      for (let i = 0; i < 4; i++) {
        for (let g = 0; g < 4; g++) {
          v.push(m[i][g]);
        }
      }

      return v;
    }
  }

  let cam;

  let ProjSize = 0.1 /* Project plane fit square */,
    ProjDist = 0.1 /* Distance to project plane from viewer (near) */,
    ProjFarClip = 300; /* Distance to project far clip plane (far) */


  class _camera {
    constructor(
      ProjSize,
      ProjDist,
      ProjFarClip,
      MatrVP,
      MatrView,
      MatrProj,
      Loc,
      At,
      Dir,
      Up,
      Right
    ) {
      this.ProjSize = ProjSize;
      this.ProjDist = ProjDist;
      this.ProjFarClip = ProjFarClip;
      this.MatrVP = MatrVP;
      this.MatrView = MatrView;
      this.MatrProj = MatrProj;
      this.Loc = Loc;
      this.At = At;
      this.Dir = Dir;
      this.Up = Up;
      this.Right = Right;
    }

    static view(Loc, At, Up1) {
      const Dir = _vec3.normalize(_vec3.sub(At, Loc)),
        Right = _vec3.normalize(_vec3.cross(Dir, Up1)),
        Up = _vec3.cross(Right, Dir);
      return _matr4.set(
        Right.x,
        Up.x,
        -Dir.x,
        0,
        Right.y,
        Up.y,

        -Dir.y,
        0,
        Right.z,
        Up.z,
        -Dir.z,
        0,
        -_vec3.dot(Loc, Right),
        -_vec3.dot(Loc, Up),
        _vec3.dot(Loc, Dir),
        1
      );
    }
  }

  function CamSet(Loc, At, Up1) {
    let Up, Dir, Right;
    let MatrView = _camera.view(Loc, At, Up1);

    Up = _vec3.set(MatrView[0][1], MatrView[1][1], MatrView[2][1]);
    Dir = _vec3.set(-MatrView[0][2], -MatrView[1][2], -MatrView[2][2]);
    Right = _vec3.set(MatrView[0][0], MatrView[1][0], MatrView[2][0]);

    const rx = ProjSize,
      ry = ProjSize;

    let MatrProj = _matr4.frustum(
        -rx / 2,
        rx / 2,
        -ry / 2,
        ry / 2,

        ProjDist,
        ProjFarClip
      ),
      MatrVP = _matr4.mulmatr(MatrView, MatrProj);

    cam =  new _camera(
      ProjSize,
      ProjDist,
      ProjFarClip,
      MatrVP,
      MatrView,
      MatrProj,
      Loc,
      At,
      Dir,
      Up,
      Right
    );
  }

  const canvas = document.getElementById("glCanvas");
  let gl = canvas.getContext("webgl2");

  let program;

  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("!!!!!!");
    }

    return shader;
  }

  function shaderInit(vs, fs) {
    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    program = gl.createProgram();
    gl.attachShader(program, vertexSh);
    gl.attachShader(program, fragmentSh);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert(gl.getProgramInfoLog(program));
    }
  }

  let Ubos = [];

  let Ubo_cell = {
    MatrWVP: "matrwvp",
    MatrW: "matrw",
    MatrWInv: "matrwinv",
    MatrVP: "matrvp",
    MatrV: "matrv",
    CamLoc: "camloc",
    CamAt: "camat",
    CamRight: "camright",
    CamUp: "camup",
    CamDir: "camdir",
    ProjDistFarTimeLocal: "projdistfartimelocal",
    TimeGlobalDeltaGlobalDeltaLocal: "timeglobal",
    ProjectSize: "projsize",
  };

  class Ubo_Matr {
    constructor(
      MatrWVP,
      MatrW,
      MatrWInv,
      MatrVP,
      MatrV,
      CamLoc,
      CamAt,
      CamRight,
      CamUp,
      CamDir,
      ProjDistFarTimeLocal,
      TimeGlobalDeltaGlobalDeltaLocal,
      ProjectSize
    ) {
      this.MatrWVP = MatrWVP;
      this.MatrW = MatrW;
      this.MatrWInv = MatrWInv;
      this.MatrVP = MatrVP;
      this.MatrV = MatrV;
      this.CamLoc = CamLoc;
      this.CamAt = CamAt;
      this.CamRight = CamRight;
      this.CamUp = CamUp;
      this.CamDir = CamDir;
      this.ProjDistFarTimeLocal = ProjDistFarTimeLocal;

      this.TimeGlobalDeltaGlobalDeltaLocal = TimeGlobalDeltaGlobalDeltaLocal;
      this.ProjectSize = ProjectSize;
    }
  }

  class UBO {
    constructor(ubo, name, uboid, Type) {
      this.ubo = ubo;
      this.name = name;
      this.uboid = uboid;

      this.Type = Type;
    }

    static add(Ubo, name) {
      let fr = gl.createBuffer();
      gl.bindBuffer(gl.UNIFORM_BUFFER, fr);
      if (name === "BaseData") {
        gl.bufferData(
          gl.UNIFORM_BUFFER,
          new Float32Array([
            ..._matr4.toarr(Ubo.MatrWVP),
            ..._matr4.toarr(Ubo.MatrW),
            ..._matr4.toarr(Ubo.MatrWInv),
            ..._matr4.toarr(Ubo.MatrVP),
            ..._matr4.toarr(Ubo.MatrV),
            ..._vec3.vec3(Ubo.CamLoc),
            1,
            ..._vec3.vec3(Ubo.CamAt),
            1,
            ..._vec3.vec3(Ubo.CamRight),
            1,
            ..._vec3.vec3(Ubo.CamUp),
            1,
            ..._vec3.vec3(Ubo.CamDir),
            1,
            ..._vec3.vec3(Ubo.ProjDistFarTimeLocal),
            1,
            ..._vec3.vec3(Ubo.TimeGlobalDeltaGlobalDeltaLocal),
            1,
            ..._vec3.vec3(Ubo.ProjectSize),
            1,
          ]),
          gl.STATIC_DRAW
        );
      }
      if (name === "Material") {
        [
          ..._vec3.vec3(Ubo.Ka),
          1,
          ..._vec3.vec3(Ubo.Kd),
          1,
          ..._vec3.vec3(Ubo.Ks),
          1,
          Ubo.Ph,
          Ubo.Trans,
          1,
          1,
          ...Ubo.Tex,
        ];
        gl.bufferData(
          gl.UNIFORM_BUFFER,
          new Float32Array([
            ..._vec3.vec3(Ubo.Ka),
            1,
            ..._vec3.vec3(Ubo.Kd),
            1,
            ..._vec3.vec3(Ubo.Ks),
            1,
            Ubo.Ph,
            Ubo.Trans,
            1,
            1,
            ...Ubo.Tex,
          ]),
          gl.STATIC_DRAW
        );
      }
      Ubos.push(new UBO(Ubo, name, fr));
      return Ubos.length - 1;
    }
    static update(id, name_cell, cell_data) {
      gl.bindBuffer(gl.UNIFORM_BUFFER, Ubos[id].uboid);
      if (Ubos[id].name === "BaseData") {
        if (name_cell == Ubo_cell.MatrWVP) {
          Ubos[id].ubo.MatrWVP = cell_data;
        } else if (name_cell == Ubo_cell.MatrW) {
          Ubos[id].ubo.MatrW = cell_data;
        } else if (name_cell == Ubo_cell.MatrWInv) {
          Ubos[id].ubo.MatrWInv = cell_data;
        } else if (name_cell == Ubo_cell.MatrVP) {
          Ubos[id].ubo.MatrVP = cell_data;
        } else if (name_cell == Ubo_cell.MatrV) {
          Ubos[id].ubo.MatrV = cell_data;
        } else if (name_cell == Ubo_cell.CamLoc) {
          Ubos[id].ubo.CamLoc = cell_data;
        } else if (name_cell == Ubo_cell.CamAt) {
          Ubos[id].ubo.CamAt = cell_data;
        } else if (name_cell == Ubo_cell.CamRight) {
          Ubos[id].ubo.CamRight = cell_data;
        } else if (name_cell == Ubo_cell.CamDir) {
          Ubos[id].ubo.CamDir = cell_data;
        } else if (name_cell == Ubo_cell.ProjDistFarTimeLocal) {
          Ubos[id].ubo.ProjDistFarTimeLocal = cell_data;
        } else if (name_cell == Ubo_cell.TimeGlobalDeltaGlobalDeltaLocal) {
          Ubos[id].ubo.TimeGlobalDeltaGlobalDeltaLocal = cell_data;
        } else if (name_cell == Ubo_cell.ProjectSize) {
          Ubos[id].ubo.ProjDistFarTimeLocal = cell_data;
        }
        let x = new Float32Array([
          ..._matr4.toarr(Ubos[id].ubo.MatrWVP),
          ..._matr4.toarr(Ubos[id].ubo.MatrW),
          ..._matr4.toarr(Ubos[id].ubo.MatrWInv),
          ..._matr4.toarr(Ubos[id].ubo.MatrVP),
          ..._matr4.toarr(Ubos[id].ubo.MatrV),
          ..._vec3.vec3(Ubos[id].ubo.CamLoc),
          1,
          ..._vec3.vec3(Ubos[id].ubo.CamAt),
          1,
          ..._vec3.vec3(Ubos[id].ubo.CamRight),
          1,
          ..._vec3.vec3(Ubos[id].ubo.CamUp),
          1,
          ..._vec3.vec3(Ubos[id].ubo.CamDir),
          1,
          ..._vec3.vec3(Ubos[id].ubo.ProjDistFarTimeLocal),
          1,
          ..._vec3.vec3(Ubos[id].ubo.TimeGlobalDeltaGlobalDeltaLocal),
          1,
          ..._vec3.vec3(Ubos[id].ubo.ProjectSize),
          1,
        ]);

        gl.bufferData(gl.UNIFORM_BUFFER, x, gl.STATIC_DRAW);
      }
    }
    static applay(id, point) {
      let blk_loc = gl.getUniformBlockIndex(program, Ubos[id].name);

      gl.uniformBlockBinding(program, blk_loc, point);

      gl.bindBufferBase(gl.UNIFORM_BUFFER, point, Ubos[id].uboid);
    }
  }

  function Timer() {
    // Timer obtain current time in seconds method
    const getTime = () => {
      const date = new Date();
      let t =
        date.getMilliseconds() / 1000.0 +
        date.getSeconds() +
        date.getMinutes() * 60;
      return t;
    };

    // Timer response method
    this.response = (tag_id = null) => {
      let t = getTime();
      // Global time
      this.globalTime = t;
      this.globalDeltaTime = t - this.oldTime;
      // Time with pause
      if (this.isPause) {
        this.localDeltaTime = 0;
        this.pauseTime += t - this.oldTime;
      } else {
        this.localDeltaTime = this.globalDeltaTime;
        this.localTime = t - this.pauseTime - this.startTime;
      }
      // FPS
      this.frameCounter++;
      if (t - this.oldTimeFPS > 3) {
        this.FPS = this.frameCounter / (t - this.oldTimeFPS);
        this.oldTimeFPS = t;
        this.frameCounter = 0;
        if (tag_id != null)
          document.getElementById(tag_id).innerHTML = this.getFPS();
      }
      this.oldTime = t;

      UBO.update(
        CamUBO,
        Ubo_cell.ProjDistFarTimeLocal,
        _vec3.set(cam.ProjDist, cam.ProjFarClip, this.localTime)
      );
      UBO.update(
        CamUBO,
        Ubo_cell.TimeGlobalDeltaGlobalDeltaLocal,
        _vec3.set(this.globalTime, this.globalDeltaTime, this.localDeltaTime)
      );
    };

    // Obtain FPS as string method
    this.getFPS = () => this.FPS.toFixed(3);

    // Fill timer global data
    this.globalTime = this.localTime = getTime();
    this.globalDeltaTime = this.localDeltaTime = 0;

    // Fill timer semi global data
    this.startTime = this.oldTime = this.oldTimeFPS = this.globalTime;
    this.frameCounter = 0;
    this.isPause = false;
    this.FPS = 30.0;
    this.pauseTime = 0;

    return this;
  } // End of 'Timer' function

  let myTimer = new Timer();

  let Material = [];

  class material {
    constructor(Name, Ka, Kd, Ks, Ph, Trans, Tex, UboNo) {
      this.Name = Name; /* Material name */

      /* Illumination coefficients */

      this.Ka = Ka;
      this.Kd = Kd;
      this.Ks = Ks;
      this.Trans = Trans;
      this.Ph = Ph;
      this.Tex = Tex;
      this.UboNo = UboNo;
    }

    static MtlGetDef() {
      return new material(
        "Default",
        _vec3.set(0.1, 0.1, 0.1),
        _vec3.set(0.9, 0.9, 0.9),
        _vec3.set(0.3, 0.3, 0.3),
        30,
        1,
        [-1, -1, -1, -1, -1, -1, -1, -1]
      );
    }
    static add(Mtl) {
      Mtl.UboNo = UBO.add(Mtl, "Material");
      Material.push(Mtl);
      return Material.length - 1;
    }
    static applay(MtlNo, point) {
      UBO.applay(Material[MtlNo].UboNo, point);
    }
  }

  let Matlib = {
    Black_Plastic: new material(
      "Black_Plastic",
      _vec3.set(0.0, 0.0, 0.0),
      _vec3.set(0.01, 0.01, 0.01),
      _vec3.set(0.5, 0.5, 0.5),
      32,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Brass: new material(
      "Brass",
      _vec3.set(0.329412, 0.223529, 0.027451),
      _vec3.set(0.780392, 0.568627, 0.113725),
      _vec3.set(0.992157, 0.941176, 0.807843),
      27.8974,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Bronze: new material(
      "Bronze",
      _vec3.set(0.2125, 0.1275, 0.054),
      _vec3.set(0.714, 0.4284, 0.18144),
      _vec3.set(0.393548, 0.271906, 0.166721),
      25.6,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Chrome: new material(
      "Chrome",
      _vec3.set(0.25, 0.25, 0.25),
      _vec3.set(0.4, 0.4, 0.4),
      _vec3.set(0.774597, 0.774597, 0.774597),
      76.8,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Copper: new material(
      "Copper",
      _vec3.set(0.19125, 0.0735, 0.0225),
      _vec3.set(0.7038, 0.27048, 0.0828),
      _vec3.set(0.256777, 0.137622, 0.086014),
      12.8,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Gold: new material(
      "Gold",
      _vec3.set(0.24725, 0.1995, 0.0745),
      _vec3.set(0.75164, 0.60648, 0.22648),
      _vec3.set(0.628281, 0.555802, 0.366065),
      51.2,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Peweter: new material(
      "Peweter",
      _vec3.set(0.10588, 0.058824, 0.113725),
      _vec3.set(0.427451, 0.470588, 0.541176),
      _vec3.set(0.3333, 0.3333, 0.521569),
      9.84615,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Silver: new material(
      "Silver",
      _vec3.set(0.19225, 0.19225, 0.19225),
      _vec3.set(0.50754, 0.50754, 0.50754),
      _vec3.set(0.508273, 0.508273, 0.508273),
      51.2,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Polished_Silver: new material(
      "Polished_Silver",
      _vec3.set(0.23125, 0.23125, 0.23125),
      _vec3.set(0.2775, 0.2775, 0.2775),
      _vec3.set(0.773911, 0.773911, 0.773911),
      89.6,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Turquoise: new material(
      "Turquoise",
      _vec3.set(0.1, 0.18725, 0.1745),
      _vec3.set(0.396, 0.74151, 0.69102),
      _vec3.set(0.297254, 0.30829, 0.306678),
      12.8,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Ruby: new material(
      "Ruby",
      _vec3.set(0.1745, 0.01175, 0.01175),
      _vec3.set(0.61424, 0.04136, 0.04136),
      _vec3.set(0.727811, 0.626959, 0.626959),
      76.8,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Polished_Gold: new material(
      "Polished_Gold",
      _vec3.set(0.24725, 0.2245, 0.0645),
      _vec3.set(0.34615, 0.3143, 0.0903),
      _vec3.set(0.797357, 0.723991, 0.208006),
      83.2,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Polished_Bronze: new material(
      "Polished_Bronze",
      _vec3.set(0.25, 0.148, 0.06475),
      _vec3.set(0.4, 0.2368, 0.1036),
      _vec3.set(0.774597, 0.458561, 0.200621),
      76.8,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Polished_Copper: new material(
      "Polished_Copper",
      _vec3.set(0.2295, 0.08825, 0.0275),
      _vec3.set(0.5508, 0.2118, 0.066),
      _vec3.set(0.580594, 0.223257, 0.0695701),
      51.2,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Jade: new material(
      "Jade",
      _vec3.set(0.135, 0.2225, 0.1575),
      _vec3.set(0.135, 0.2225, 0.1575),
      _vec3.set(0.316228, 0.316228, 0.316228),
      12.8,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Obsidian: new material(
      "Obsidian",
      _vec3.set(0.05375, 0.05, 0.06625),
      _vec3.set(0.18275, 0.17, 0.22525),
      _vec3.set(0.332741, 0.328634, 0.346435),
      38.4,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Pearl: new material(
      "Pearl",
      _vec3.set(0.25, 0.20725, 0.20725),
      _vec3.set(1.0, 0.829, 0.829),
      _vec3.set(0.296648, 0.296648, 0.296648),
      11.264,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Emerald: new material(
      "Emerald",
      _vec3.set(0.0215, 0.1745, 0.0215),
      _vec3.set(0.07568, 0.61424, 0.07568),
      _vec3.set(0.633, 0.727811, 0.633),
      76.8,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
    Black_Rubber: new material(
      "Black_Rubber",
      _vec3.set(0.02, 0.02, 0.02),
      _vec3.set(0.01, 0.01, 0.01),
      _vec3.set(0.4, 0.4, 0.4),
      10.0,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1]
    ),
  };

  class vertex {
    constructor(P, C, N) {
      this.P = P;
      this.C = C;
      this.N = N;
    }
    static vert2arr(a) {
      return [a.P.x, a.P.y, a.P.z, a.C.x, a.C.y, a.C.z, a.N.x, a.N.y, a.N.z];
    }

    static create(a) {
      return new vertex(a.P, a.C, a.N);
    }
  }

  class prim {
    constructor(VA, VBuf, IBuf, NumOfElements, Trans, MtlNo) {
      this.VA = VA;
      this.VBuf = VBuf;
      this.IBuf = IBuf;
      this.NumOfElements = NumOfElements;
      this.Trans = Trans;
      this.MtlNo = MtlNo;
    }
    static create(Vert, NumofVert, Ind, NumofInd, MtlNo) {
      let primVertexArray = gl.createVertexArray();
      gl.bindVertexArray(primVertexArray);

      let primVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, primVertexBuffer);

      let pos = [];
      for (let i = 0; i < NumofVert; i++) {
        pos = pos.concat(vertex.vert2arr(Vert[i]));
      }
      pos = new Float32Array(pos);

      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

      let primIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, primIndexBuffer);

      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(Ind),
        gl.STATIC_DRAW
      );

      let Fsize = pos.BYTES_PER_ELEMENT;
      let posLoc = gl.getAttribLocation(program, "in_pos");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, Fsize * 9, 0);

      let posCol = gl.getAttribLocation(program, "in_color");
      if (posCol != -1) {
        gl.vertexAttribPointer(posCol, 3, gl.FLOAT, false, Fsize * 9, Fsize * 3);
        gl.enableVertexAttribArray(posCol);
      }

      let posNorm = gl.getAttribLocation(program, "in_normal");

      if (posNorm != -1) {
        gl.vertexAttribPointer(posNorm, 3, gl.FLOAT, false, Fsize * 9, Fsize * 6);
        gl.enableVertexAttribArray(posNorm);
      }

      return new prim(
        primVertexArray,
        primVertexBuffer,
        primIndexBuffer,
        NumofInd,
        _matr4.identity(),
        MtlNo
      );
    }

    static draw(Pr, World) {
      let w = _matr4.mulmatr(Pr.Trans, World);
      let winv = _matr4.transpose(_matr4.inverse(w));
      let WVP = _matr4.mulmatr(w, cam.MatrVP);

      gl.useProgram(program);

      gl.bindVertexArray(Pr.VA);

      UBO.update(CamUBO, Ubo_cell.MatrWVP, WVP);
      UBO.update(CamUBO, Ubo_cell.MatrW, w);
      UBO.update(CamUBO, Ubo_cell.MatrWInv, winv);
      UBO.applay(CamUBO, 0);
      material.applay(Pr.MtlNo, 1);

      gl.drawElements(
        gl.TRIANGLES, // TRIANGLES, TRIANGLE_STRIP
        Pr.NumOfElements, //Pr.NumOfElements
        gl.UNSIGNED_SHORT,
        Pr.IBuf
      );
    }

    static create_normal(a, i) {
      a[i].N = _vec3.normalize(
        _vec3.cross(_vec3.sub(a[i + 2].P, a[i].P), _vec3.sub(a[i + 1].P, a[i].P))
      );
      a[i + 1].N = _vec3.normalize(
        _vec3.cross(
          _vec3.sub(a[i].P, a[i + 1].P),
          _vec3.sub(a[i + 2].P, a[i + 1].P)
        )
      );
      a[i + 2].N = _vec3.normalize(
        _vec3.cross(
          _vec3.sub(a[i + 1].P, a[i + 2].P),
          _vec3.sub(a[i].P, a[i + 2].P)
        )
      );

      // console.log(i + ":" + a[i].N.x + "," + a[i].N.y + "," + a[i].N.z);
    }
  }

  let kf = [];

  class InPut {
    constructor(Md, MouseClick, Wheel, Keys) {
      this.Keys = Keys;
      this.Mdx = Md[0];
      this.Mdy = Md[1];
      this.MouseClickLeft = MouseClick[0];
      this.MouseClickRight = MouseClick[1];
      this.MouseWheel = Wheel;
    }

    response(Md, MC, Wheel, K) {
      this.Keys = K;
      this.Mdx = Md[0];
      this.Mdy = Md[1];
      this.MouseClickLeft = MC[0];
      this.MouseClickRight = MC[1];
      this.MouseWheel = Wheel;
    }
  } // End of 'Input' function

  let myInput = new InPut([0, 0], [0, 0], kf.fill(0, 0, 255));

  let Pr_cube;

  function initCube() {
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
    Pr_cube = prim.create(
      Vrts,
      Vrts.length,
      indices,
      indices.length,
      material.add(Matlib.Obsidian)
    );
  }

  function renderCube() {
    let Worl = _matr4.mulmatr(
      _matr4.scale(_vec3.set(0.7, 0.7, 0.7)),
      _matr4.translate(_vec3.set(0, 0, 0))
    );

    prim.draw(Pr_cube, Worl);
  }

  function initCam() {
    CamSet(_vec3.set(16, 0, 3), _vec3.set(0, 0, 3), _vec3.set(0, 1, 0));
  }

  function renderCam() {
    let Dist = _vec3.len(_vec3.sub(cam.At, cam.Loc));
    let cosT, sinT, cosP, sinP, plen, Azimuth, Elevator;
    let Wp, Hp, sx, sy;
    let dv;

    Wp = Hp = cam.ProjSize;
    cosT = (cam.Loc.y - cam.At.y) / Dist;
    sinT = Math.sqrt(1 - cosT * cosT);

    plen = Dist * sinT;
    cosP = (cam.Loc.z - cam.At.z) / plen;
    sinP = (cam.Loc.x - cam.At.x) / plen;

    Azimuth = (Math.atan2(sinP, cosP) / Math.PI) * 180;
    Elevator = (Math.atan2(sinT, cosT) / Math.PI) * 180;

    Azimuth +=
      myTimer.globalDeltaTime * 1.5 * (-5 * myInput.MouseClickLeft * myInput.Mdx);
    Elevator +=
      myTimer.globalDeltaTime * 1.5 * (-5 * myInput.MouseClickLeft * myInput.Mdy);

    if (Elevator < 0.08) Elevator = 0.08;
    else if (Elevator > 178.9) Elevator = 178.9;

    Dist += myTimer.globalDeltaTime * (2 * myInput.MouseWheel);

    if (Dist < 0.1) Dist = 0.1;
    if (myInput.MouseClickRight) {
      sx = (((myInput.Mdx * Wp) / 1200) * Dist) / -cam.ProjDist;
      sy = (((myInput.Mdy * Hp) / 1200) * Dist) / cam.ProjDist;

      dv = _vec3.add(_vec3.mulnum(cam.Right, sx), _vec3.mulnum(cam.Up, sy));

      cam.At = _vec3.add(cam.At, dv);
      cam.Loc = _vec3.add(cam.Loc, dv);
    }
    CamSet(
      _vec3.point_transform(
        _vec3.set(0, Dist, 0),
        _matr4.mulmatr(
          _matr4.mulmatr(_matr4.rotateX(Elevator), _matr4.rotateY(Azimuth)),
          _matr4.translate(cam.At)
        )
      ),
      cam.At,
      _vec3.set(0, 1, 0)
    );

    UBO.update(CamUBO, Ubo_cell.MatrVP, cam.MatrVP);
    UBO.update(CamUBO, Ubo_cell.MatrV, cam.MatrView);
    UBO.update(CamUBO, Ubo_cell.CamLoc, cam.Loc);
    UBO.update(CamUBO, Ubo_cell.CamAt, cam.At);
    UBO.update(CamUBO, Ubo_cell.CamRight, cam.Right);
    UBO.update(CamUBO, Ubo_cell.CamUp, cam.Up);
    UBO.update(CamUBO, Ubo_cell.CamDir, cam.Dir);
    //   if (Ani->Keys[VK_SHIFT] && Ani->KeysClick['P'])
    //     Ani->IsPause = !Ani->IsPause;
  }

  let Pr_dod;

  function initDod() {
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
    Pr_dod = prim.create(
      Vs,
      Vs.length,
      indices,
      indices.length,
      material.add(Matlib.Gold)
    );
  }

  function renderDod() {
    let Worl = _matr4.mulmatr(
      _matr4.mulmatr(
        _matr4.mulmatr(
          _matr4.rotateY(47 * myTimer.localTime * 0),
          _matr4.scale(_vec3.set(1.5, 1.5, 1.5))
        ),
        _matr4.rotateY(80 * myTimer.localTime * 0)
      ),
      _matr4.translate(_vec3.set(0, 0, 9))
    );
    prim.draw(Pr_dod, Worl);
  }

  let Pr_hex;

  function initHex() {
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
    Pr_hex = prim.create(
      Vs,
      Vs.length,
      indices,
      indices.length,
      material.add(Matlib.Pearl)
    );
  }

  function renderHex() {
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

  let Pr_iso;

  function initIso() {
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
    Pr_iso = prim.create(
      Vs,
      Vs.length,
      indices,
      indices.length,
      material.add(Matlib.Peweter)
    );
  }

  function renderIso() {
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

  let Pr_tetraider;

  function initTetr() {
    let Vr = [];

    Vr[0] = new vertex(
      _vec3.set(0, 1, 0),
      _vec3.set(1, 1, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[1] = new vertex(
      _vec3.set(-Math.sqrt(2) / 3, -1 / 3, -Math.sqrt(6) / 3),
      _vec3.set(0, 1, 0),
      _vec3.set(0, 0, 0)
    );
    Vr[2] = new vertex(
      _vec3.set(-Math.sqrt(2) / 3, -1 / 3, Math.sqrt(6) / 3),
      _vec3.set(1, 0, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[3] = new vertex(
      _vec3.set((2 * Math.sqrt(2)) / 3, -1 / 3, 0),
      _vec3.set(0, 0, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[4] = new vertex(
      _vec3.set(0, 1, 0),
      _vec3.set(1, 1, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[5] = new vertex(
      _vec3.set(-Math.sqrt(2) / 3, -1 / 3, -Math.sqrt(6) / 3),
      _vec3.set(0, 1, 0),
      _vec3.set(0, 0, 0)
    );
    Vr[6] = new vertex(
      _vec3.set(-Math.sqrt(2) / 3, -1 / 3, Math.sqrt(6) / 3),
      _vec3.set(1, 0, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[7] = new vertex(
      _vec3.set((2 * Math.sqrt(2)) / 3, -1 / 3, 0),
      _vec3.set(0, 0, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[8] = new vertex(
      _vec3.set(0, 1, 0),
      _vec3.set(1, 1, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[9] = new vertex(
      _vec3.set(-Math.sqrt(2) / 3, -1 / 3, -Math.sqrt(6) / 3),
      _vec3.set(0, 1, 0),
      _vec3.set(0, 0, 0)
    );
    Vr[10] = new vertex(
      _vec3.set(-Math.sqrt(2) / 3, -1 / 3, Math.sqrt(6) / 3),
      _vec3.set(1, 0, 1),
      _vec3.set(0, 0, 0)
    );
    Vr[11] = new vertex(
      _vec3.set((2 * Math.sqrt(2)) / 3, -1 / 3, 0),
      _vec3.set(0, 0, 1),
      _vec3.set(0, 0, 0)
    );

    Vr[0].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[1].P, Vr[0].P), _vec3.sub(Vr[2].P, Vr[0].P))
    );
    Vr[1].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[2].P, Vr[1].P), _vec3.sub(Vr[0].P, Vr[1].P))
    );
    Vr[2].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[0].P, Vr[2].P), _vec3.sub(Vr[1].P, Vr[2].P))
    );

    Vr[3].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[5].P, Vr[3].P), _vec3.sub(Vr[4].P, Vr[3].P))
    );
    Vr[4].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[3].P, Vr[4].P), _vec3.sub(Vr[5].P, Vr[4].P))
    );
    Vr[5].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[4].P, Vr[5].P), _vec3.sub(Vr[3].P, Vr[5].P))
    );

    Vr[6].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[7].P, Vr[6].P), _vec3.sub(Vr[8].P, Vr[6].P))
    );
    Vr[7].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[8].P, Vr[7].P), _vec3.sub(Vr[6].P, Vr[7].P))
    );
    Vr[8].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[6].P, Vr[8].P), _vec3.sub(Vr[7].P, Vr[8].P))
    );

    Vr[9].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[11].P, Vr[9].P), _vec3.sub(Vr[10].P, Vr[9].P))
    );
    Vr[10].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[9].P, Vr[10].P), _vec3.sub(Vr[11].P, Vr[10].P))
    );
    Vr[11].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(Vr[10].P, Vr[11].P), _vec3.sub(Vr[9].P, Vr[11].P))
    );

    let indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    Pr_tetraider = prim.create(
      Vr,
      Vr.length,
      indices,
      indices.length,
      material.add(Matlib.Emerald)
    );
  }

  function renderTetr() {
    let Worl = _matr4.mulmatr(
      _matr4.mulmatr(
        _matr4.mulmatr(
          _matr4.rotateY(47 * myTimer.localTime * 0),
          _matr4.rotateZ(47 * myTimer.localTime * 0 + 45 * 0)
        ),
        _matr4.rotateY(80 * myTimer.localTime * 0)
      ),
      _matr4.translate(_vec3.set(0, 0, -3))
    );

    prim.draw(Pr_tetraider, Worl);
  }

  let CamUBO;

  function rndInit(vs, fs) {
    gl.clearColor(0.28, 0.47, 0.8, 1);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    initCam();
    //CamSet(_vec3.set(0, 0, 10), _vec3.set(0, 0, 0), _vec3.set(0, 1, 0));
    let World = _matr4.identity();
    let w = _matr4.mulmatr(_matr4.identity(), World);
    let winv = _matr4.transpose(_matr4.inverse(w));
    let WVP = _matr4.mulmatr(w, cam.MatrVP);

    let U = new Ubo_Matr(
      WVP,
      w,
      winv,
      cam.MatrVP,
      cam.MatrView,
      cam.Loc,
      cam.At,
      cam.Right,
      cam.Up,
      cam.Dir,
      _vec3.set(cam.ProjDist, cam.ProjFarClip, myTimer.localTime),
      _vec3.set(
        myTimer.globalTime,
        myTimer.globalDeltaTime,
        myTimer.localDeltaTime
      ),
      _vec3.set(cam.ProjSize, 1, 1)
    );

    CamUBO = UBO.add(U, "BaseData");

    shaderInit(vs, fs);

    initTetr();
    initCube();
    initHex();
    initIso();
    // initTruTetr();
    // initCubOct();
    // initTruCub();
    // initTruOct();
    initDod();
    // initRhom();
    //initTruCubOct();
  }

  function render() {
    gl.clearColor(0.28, 0.47, 0.8, 1);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    renderCam();
    renderTetr();
    renderHex();
    renderCube();
    renderIso();
    renderDod();
    // renderTruTetr();
    // renderCubOct();
    // renderTruCub();
    // renderTruOct();
    // renderRhom();
    //renderTruCubOct();
  }

  let names = ["../bin/frag.glsl", "../bin/vert.glsl"];
  let Md = [0, 0],
    MouseClick = [0, 0],
    Wheel = 0,
    Keys = [];
  Keys.fill(0, 0, 255);

  Promise.all(names.map((u) => fetch(u)))
    .then((responses) => Promise.all(responses.map((res) => res.text())))
    .then((texts) => {
      rndInit(texts[1], texts[0]);
      const draw = () => {
        //
        window.addEventListener("mousedown", (e) => {
          if (e.button == 0) {
            MouseClick[0] = 1;
          }
          if (e.button == 2) {
            MouseClick[1] = 1;
          }
        });

        window.addEventListener("mouseup", (e) => {
          if (e.button == 0) {
            MouseClick[0] = 0;
          }
          if (e.button == 2) {
            MouseClick[1] = 0;
          }
        });

        window.addEventListener("mousemove", (e) => {
          Md[0] = e.movementX;
          Md[1] = e.movementY;
        });

        window.addEventListener("keydown", (e) => {
          Keys[e.keyCode] = 1;
        });

        window.addEventListener("keyup", (e) => {
          Keys[e.keyCode] = 0;
        });

        window.addEventListener("wheel", (e) => {
          Wheel = e.deltaY;
        });

        myTimer.response();
        myInput.response(Md, MouseClick, Wheel, Keys);
        render();
        Wheel = 0;
        window.requestAnimationFrame(draw);

      };
      draw();
    });

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL21hdGgvbWF0aHZlYzMuanMiLCIuLi9zcmMvbWF0aC9tYXRobWF0NC5qcyIsIi4uL3NyYy9tYXRoL21hdGhjYW0uanMiLCIuLi9zcmMvcm5kL3JuZGRhdGEuanMiLCIuLi9zcmMvcm5kL3Jlcy9zaGFkZXIuanMiLCIuLi9zcmMvcm5kL3Jlcy91Ym8uanMiLCIuLi9zcmMvdGltZXIuanMiLCIuLi9zcmMvcm5kL3Jlcy9tYXRlcmlhbC5qcyIsIi4uL3NyYy9ybmQvcHJpbS5qcyIsIi4uL3NyYy9pbnB1dC5qcyIsIi4uL3NyYy91bml0cy91X2N1YmUuanMiLCIuLi9zcmMvdW5pdHMvdV9jb250cm9sLmpzIiwiLi4vc3JjL3VuaXRzL3VfZG9kZWNhaGVkcm9uLmpzIiwiLi4vc3JjL3VuaXRzL3VfaGV4YWhlZHJvbi5qcyIsIi4uL3NyYy91bml0cy91X2lzb2NhaGVkcm9uLmpzIiwiLi4vc3JjL3VuaXRzL3VfdGV0cmFpZGVyLmpzIiwiLi4vc3JjL3JuZC9ybmRiYXNlLmpzIiwiLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIF92ZWMzIHtcclxuICBjb25zdHJ1Y3Rvcih4LCB5LCB6KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICAgIHRoaXMueiA9IHo7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0KHgsIHksIHopIHtcclxuICAgIHJldHVybiBuZXcgX3ZlYzMoeCwgeSwgeik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYWRkKGEsIGIpIHtcclxuICAgIHJldHVybiBuZXcgX3ZlYzMoYS54ICsgYi54LCBhLnkgKyBiLnksIGEueiArIGIueik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc3ViKGEsIGIpIHtcclxuICAgIHJldHVybiBuZXcgX3ZlYzMoYS54IC0gYi54LCBhLnkgLSBiLnksIGEueiAtIGIueik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbXVsbnVtKGEsIGIpIHtcclxuICAgIHJldHVybiBuZXcgX3ZlYzMoYS54ICogYiwgYS55ICogYiwgYS56ICogYik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZGl2bnVtKGEsIGIpIHtcclxuICAgIHJldHVybiBuZXcgX3ZlYzMoYS54IC8gYiwgYS55IC8gYiwgYS56IC8gYik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbmVnKGEpIHtcclxuICAgIHJldHVybiBuZXcgX3ZlYzMoLWEueCwgLWEueSwgLWEueik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZG90KGEsIGIpIHtcclxuICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLno7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY3Jvc3MoYSwgYikge1xyXG4gICAgcmV0dXJuIG5ldyBfdmVjMyhcclxuICAgICAgYS55ICogYi56IC0gYS56ICogYi55LFxyXG4gICAgICBhLnogKiBiLnggLSBhLnggKiBiLnosXHJcbiAgICAgIGEueCAqIGIueSAtIGIueCAqIGEueVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsZW4yKGEpIHtcclxuICAgIHJldHVybiBhLnggKiBhLnggKyBhLnkgKiBhLnkgKyBhLnogKiBhLno7XHJcbiAgfVxyXG5cclxuICAvLyAgcmV0dXJuIFZlYzNTZXQoXHJcbiAgLy8gICAgIFAuWCAqIE0uTVswXVswXSArIFAuWSAqIE0uTVsxXVswXSArIFAuWiAqIE0uTVsyXVswXSArIE0uTVszXVswXSxcclxuICAvLyAgICAgUC5YICogTS5NWzBdWzFdICsgUC5ZICogTS5NWzFdWzFdICsgUC5aICogTS5NWzJdWzFdICsgTS5NWzNdWzFdLFxyXG4gIC8vICAgICBQLlggKiBNLk1bMF1bMl0gKyBQLlkgKiBNLk1bMV1bMl0gKyBQLlogKiBNLk1bMl1bMl0gKyBNLk1bM11bMl1cclxuXHJcbiAgc3RhdGljIGxlbihhKSB7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KF92ZWMzLmxlbjIoYSkpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG5vcm1hbGl6ZShhKSB7XHJcbiAgICByZXR1cm4gX3ZlYzMuZGl2bnVtKGEsIF92ZWMzLmxlbihhKSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcG9pbnRfdHJhbnNmb3JtKGEsIGIpIHtcclxuICAgIHJldHVybiBuZXcgX3ZlYzMoXHJcbiAgICAgIGEueCAqIGJbMF1bMF0gKyBhLnkgKiBiWzFdWzBdICsgYS56ICogYlsyXVswXSArIGJbM11bMF0sXHJcbiAgICAgIGEueCAqIGJbMF1bMV0gKyBhLnkgKiBiWzFdWzFdICsgYS56ICogYlsyXVsxXSArIGJbM11bMV0sXHJcbiAgICAgIGEueCAqIGJbMF1bMl0gKyBhLnkgKiBiWzFdWzJdICsgYS56ICogYlsyXVsyXSArIGJbM11bMl1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgdmVjdG9ydF9yYW5zZm9ybShhLCBiKSB7XHJcbiAgICByZXR1cm4gbmV3IF92ZWMzKFxyXG4gICAgICBhLnggKiBiWzBdWzBdICsgYS55ICogYlsxXVswXSArIGEueiAqIGJbMl1bMF0sXHJcbiAgICAgIGEueCAqIGJbMF1bMV0gKyBhLnkgKiBiWzFdWzFdICsgYS56ICogYlsyXVsxXSxcclxuICAgICAgYS54ICogYlswXVsyXSArIGEueSAqIGJbMV1bMl0gKyBhLnogKiBiWzJdWzJdXHJcbiAgICApO1xyXG4gIH1cclxuICAvLyBGTFQgdyA9IFYuWCAqIE0uTVswXVszXSArIFYuWSAqIE0uTVsxXVszXSArIFYuWiAqIE0uTVsyXVszXSArIE0uTVszXVszXTtcclxuXHJcbiAgc3RhdGljIG11bF9tYXRyKGEsIGIpIHtcclxuICAgIGNvbnN0IHcgPSBhLnggKiBiWzBdWzNdICsgYS55ICogYlsxXVszXSArIGEueiAqIGJbMl1bM10gKyBiWzNdWzNdO1xyXG4gICAgcmV0dXJuIG5ldyBfdmVjMyhcclxuICAgICAgKGEgKiBiWzBdWzBdICsgYS55ICogYlsxXVswXSArIGEueiAqIGJbMl1bMF0gKyBiWzNdWzBdKSAvIHcsXHJcbiAgICAgIChhICogYlswXVsxXSArIGEueSAqIGJbMV1bMV0gKyBhLnogKiBiWzJdWzFdICsgYlszXVsxXSkgLyB3LFxyXG4gICAgICAoYSAqIGJbMF1bMl0gKyBhLnkgKiBiWzFdWzJdICsgYS56ICogYlsyXVsyXSArIGJbM11bMl0pIC8gd1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyB2ZWMzKGEpIHtcclxuICAgIHJldHVybiBbYS54LCBhLnksIGEuel07XHJcbiAgfVxyXG59XHJcbiIsImZ1bmN0aW9uIEQyUihkZWdyZWUpIHtcclxuICByZXR1cm4gKGRlZ3JlZSAqIE1hdGguUEkpIC8gMTgwO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgX21hdHI0IHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGEwMCxcclxuICAgIGEwMSxcclxuICAgIGEwMixcclxuICAgIGEwMyxcclxuICAgIGExMCxcclxuICAgIGExMSxcclxuICAgIGExMixcclxuICAgIGExMyxcclxuICAgIGEyMCxcclxuICAgIGEyMSxcclxuICAgIGEyMixcclxuICAgIGEyMyxcclxuICAgIGEzMCxcclxuICAgIGEzMSxcclxuICAgIGEzMixcclxuICAgIGEzM1xyXG4gICkge1xyXG4gICAgdGhpcy5hID0gW1xyXG4gICAgICBbYTAwLCBhMDEsIGEwMiwgYTAzXSxcclxuICAgICAgW2ExMCwgYTExLCBhMTIsIGExM10sXHJcbiAgICAgIFthMjAsIGEyMSwgYTIyLCBhMjNdLFxyXG4gICAgICBbYTMwLCBhMzEsIGEzMiwgYTMzXSxcclxuICAgIF07XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaWRlbnRpdHkoKSB7XHJcbiAgICByZXR1cm4gbmV3IF9tYXRyNCgxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxKS5hO1xyXG4gIH1cclxuICBzdGF0aWMgc2V0KFxyXG4gICAgYTAwLFxyXG4gICAgYTAxLFxyXG4gICAgYTAyLFxyXG4gICAgYTAzLFxyXG4gICAgYTEwLFxyXG4gICAgYTExLFxyXG4gICAgYTEyLFxyXG4gICAgYTEzLFxyXG4gICAgYTIwLFxyXG4gICAgYTIxLFxyXG4gICAgYTIyLFxyXG4gICAgYTIzLFxyXG4gICAgYTMwLFxyXG4gICAgYTMxLFxyXG4gICAgYTMyLFxyXG4gICAgYTMzXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gbmV3IF9tYXRyNChcclxuICAgICAgYTAwLFxyXG4gICAgICBhMDEsXHJcbiAgICAgIGEwMixcclxuICAgICAgYTAzLFxyXG4gICAgICBhMTAsXHJcbiAgICAgIGExMSxcclxuICAgICAgYTEyLFxyXG4gICAgICBhMTMsXHJcbiAgICAgIGEyMCxcclxuICAgICAgYTIxLFxyXG4gICAgICBhMjIsXHJcbiAgICAgIGEyMyxcclxuICAgICAgYTMwLFxyXG4gICAgICBhMzEsXHJcbiAgICAgIGEzMixcclxuICAgICAgYTMzXHJcbiAgICApLmE7XHJcbiAgfVxyXG4gIHN0YXRpYyB0cmFuc2xhdGUoYSkge1xyXG4gICAgcmV0dXJuIG5ldyBfbWF0cjQoMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgYS54LCBhLnksIGEueiwgMSkuYTtcclxuICB9XHJcbiAgc3RhdGljIHNjYWxlKGEpIHtcclxuICAgIHJldHVybiBuZXcgX21hdHI0KGEueCwgMCwgMCwgMCwgMCwgYS55LCAwLCAwLCAwLCAwLCBhLnosIDAsIDAsIDAsIDAsIDEpLmE7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcm90YXRlWihkZWdyZWUpIHtcclxuICAgIGNvbnN0IHIgPSBEMlIoZGVncmVlKSxcclxuICAgICAgY28gPSBNYXRoLmNvcyhyKSxcclxuICAgICAgc2kgPSBNYXRoLnNpbihyKTtcclxuICAgIGxldCBtID0gX21hdHI0LmlkZW50aXR5KCk7XHJcblxyXG4gICAgbVswXVswXSA9IGNvO1xyXG4gICAgbVsxXVswXSA9IC1zaTtcclxuICAgIG1bMF1bMV0gPSBzaTtcclxuICAgIG1bMV1bMV0gPSBjbztcclxuXHJcbiAgICByZXR1cm4gbTtcclxuICB9XHJcbiAgc3RhdGljIHJvdGF0ZVgoZGVncmVlKSB7XHJcbiAgICBjb25zdCByID0gRDJSKGRlZ3JlZSksXHJcbiAgICAgIGNvID0gTWF0aC5jb3MociksXHJcbiAgICAgIHNpID0gTWF0aC5zaW4ocik7XHJcbiAgICBsZXQgbSA9IF9tYXRyNC5pZGVudGl0eSgpO1xyXG5cclxuICAgIG1bMV1bMV0gPSBjbztcclxuICAgIG1bMl1bMV0gPSAtc2k7XHJcbiAgICBtWzFdWzJdID0gc2k7XHJcbiAgICBtWzJdWzJdID0gY287XHJcblxyXG4gICAgcmV0dXJuIG07XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcm90YXRlWShkZWdyZWUpIHtcclxuICAgIGNvbnN0IHIgPSBEMlIoZGVncmVlKSxcclxuICAgICAgY28gPSBNYXRoLmNvcyhyKSxcclxuICAgICAgc2kgPSBNYXRoLnNpbihyKTtcclxuICAgIGxldCBtID0gX21hdHI0LmlkZW50aXR5KCk7XHJcblxyXG4gICAgbVswXVswXSA9IGNvO1xyXG4gICAgbVsyXVswXSA9IHNpO1xyXG4gICAgbVswXVsyXSA9IC1zaTtcclxuICAgIG1bMl1bMl0gPSBjbztcclxuXHJcbiAgICByZXR1cm4gbTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtdWxtYXRyKG0xLCBtMikge1xyXG4gICAgbGV0IHIgPSBfbWF0cjQuc2V0KDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDApLFxyXG4gICAgICBrID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNDsgaisrKSB7XHJcbiAgICAgICAgZm9yIChyW2ldW2pdID0gMCwgayA9IDA7IGsgPCA0OyBrKyspIHtcclxuICAgICAgICAgIHJbaV1bal0gKz0gbTFbaV1ba10gKiBtMltrXVtqXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBtdWxtYXRyKG0xLCBtMikge1xyXG4gICAgbGV0IHIgPSBfbWF0cjQuc2V0KDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDApLFxyXG4gICAgICBrID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNDsgaisrKSB7XHJcbiAgICAgICAgZm9yIChyW2ldW2pdID0gMCwgayA9IDA7IGsgPCA0OyBrKyspIHtcclxuICAgICAgICAgIHJbaV1bal0gKz0gbTFbaV1ba10gKiBtMltrXVtqXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHRyYW5zcG9zZShtKSB7XHJcbiAgICBsZXQgciA9IF9tYXRyNC5zZXQoMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDQ7IGorKykge1xyXG4gICAgICAgIHJbaV1bal0gPSBtW2pdW2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcjtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBkZXRlcm0zeDMoYTExLCBhMTIsIGExMywgYTIxLCBhMjIsIGEyMywgYTMxLCBhMzIsIGEzMykge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgYTExICogYTIyICogYTMzIC1cclxuICAgICAgYTExICogYTIzICogYTMyIC1cclxuICAgICAgYTEyICogYTIxICogYTMzICtcclxuICAgICAgYTEyICogYTIzICogYTMxICtcclxuICAgICAgYTEzICogYTIxICogYTMyIC1cclxuICAgICAgYTEzICogYTIyICogYTMxXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRldGVybShtKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBtWzBdWzBdICpcclxuICAgICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgbVsxXVsxXSxcclxuICAgICAgICAgIG1bMV1bMl0sXHJcbiAgICAgICAgICBtWzFdWzNdLFxyXG4gICAgICAgICAgbVsyXVsxXSxcclxuICAgICAgICAgIG1bMl1bMl0sXHJcbiAgICAgICAgICBtWzJdWzNdLFxyXG4gICAgICAgICAgbVszXVsxXSxcclxuICAgICAgICAgIG1bM11bMl0sXHJcbiAgICAgICAgICBtWzNdWzNdXHJcbiAgICAgICAgKSAtXHJcbiAgICAgIG1bMF1bMV0gKlxyXG4gICAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXHJcbiAgICAgICAgICBtWzFdWzBdLFxyXG4gICAgICAgICAgbVsxXVsyXSxcclxuICAgICAgICAgIG1bMV1bM10sXHJcbiAgICAgICAgICBtWzJdWzBdLFxyXG4gICAgICAgICAgbVsyXVsyXSxcclxuICAgICAgICAgIG1bMl1bM10sXHJcbiAgICAgICAgICBtWzNdWzBdLFxyXG4gICAgICAgICAgbVszXVsyXSxcclxuICAgICAgICAgIG1bM11bM11cclxuICAgICAgICApICtcclxuICAgICAgbVswXVsyXSAqXHJcbiAgICAgICAgX21hdHI0LmRldGVybTN4MyhcclxuICAgICAgICAgIG1bMV1bMF0sXHJcbiAgICAgICAgICBtWzFdWzFdLFxyXG4gICAgICAgICAgbVsxXVszXSxcclxuICAgICAgICAgIG1bMl1bMF0sXHJcbiAgICAgICAgICBtWzJdWzFdLFxyXG4gICAgICAgICAgbVsyXVszXSxcclxuICAgICAgICAgIG1bM11bMF0sXHJcbiAgICAgICAgICBtWzNdWzFdLFxyXG4gICAgICAgICAgbVszXVszXVxyXG4gICAgICAgICkgLVxyXG4gICAgICBtWzBdWzNdICpcclxuICAgICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgICAgbVsxXVswXSxcclxuICAgICAgICAgIG1bMV1bMV0sXHJcbiAgICAgICAgICBtWzFdWzJdLFxyXG4gICAgICAgICAgbVsyXVswXSxcclxuICAgICAgICAgIG1bMl1bMV0sXHJcbiAgICAgICAgICBtWzJdWzJdLFxyXG4gICAgICAgICAgbVszXVswXSxcclxuICAgICAgICAgIG1bM11bMV0sXHJcbiAgICAgICAgICBtWzNdWzJdXHJcbiAgICAgICAgKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpbnZlcnNlKG0pIHtcclxuICAgIGNvbnN0IGRldCA9IF9tYXRyNC5kZXRlcm0obSk7XHJcbiAgICBsZXQgciA9IF9tYXRyNC5pZGVudGl0eSgpO1xyXG4gICAgaWYgKGRldCA9PT0gMCkgcmV0dXJuIHI7XHJcbiAgICByWzBdWzBdID1cclxuICAgICAgX21hdHI0LmRldGVybTN4MyhcclxuICAgICAgICBtWzFdWzFdLFxyXG4gICAgICAgIG1bMV1bMl0sXHJcbiAgICAgICAgbVsxXVszXSxcclxuICAgICAgICBtWzJdWzFdLFxyXG4gICAgICAgIG1bMl1bMl0sXHJcbiAgICAgICAgbVsyXVszXSxcclxuICAgICAgICBtWzNdWzFdLFxyXG4gICAgICAgIG1bM11bMl0sXHJcbiAgICAgICAgbVszXVszXVxyXG4gICAgICApIC8gZGV0O1xyXG5cclxuICAgIHJbMV1bMF0gPVxyXG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgIG1bMV1bMF0sXHJcbiAgICAgICAgbVsxXVsyXSxcclxuICAgICAgICBtWzFdWzNdLFxyXG4gICAgICAgIG1bMl1bMF0sXHJcbiAgICAgICAgbVsyXVsyXSxcclxuICAgICAgICBtWzJdWzNdLFxyXG4gICAgICAgIG1bM11bMF0sXHJcbiAgICAgICAgbVszXVsyXSxcclxuICAgICAgICBtWzNdWzNdXHJcbiAgICAgICkgLyAtZGV0O1xyXG4gICAgclsyXVswXSA9XHJcbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXHJcbiAgICAgICAgbVsxXVswXSxcclxuICAgICAgICBtWzFdWzFdLFxyXG4gICAgICAgIG1bMV1bM10sXHJcbiAgICAgICAgbVsyXVswXSxcclxuICAgICAgICBtWzJdWzFdLFxyXG4gICAgICAgIG1bMl1bM10sXHJcbiAgICAgICAgbVszXVswXSxcclxuICAgICAgICBtWzNdWzFdLFxyXG4gICAgICAgIG1bM11bM11cclxuICAgICAgKSAvIGRldDtcclxuICAgIHJbM11bMF0gPVxyXG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgIG1bMV1bMF0sXHJcbiAgICAgICAgbVsxXVsxXSxcclxuICAgICAgICBtWzFdWzJdLFxyXG4gICAgICAgIG1bMl1bMF0sXHJcbiAgICAgICAgbVsyXVsxXSxcclxuICAgICAgICBtWzJdWzJdLFxyXG4gICAgICAgIG1bM11bMF0sXHJcbiAgICAgICAgbVszXVsxXSxcclxuICAgICAgICBtWzNdWzJdXHJcbiAgICAgICkgLyAtZGV0O1xyXG5cclxuICAgIHJbMF1bMV0gPVxyXG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgIG1bMF1bMV0sXHJcbiAgICAgICAgbVswXVsyXSxcclxuICAgICAgICBtWzBdWzNdLFxyXG4gICAgICAgIG1bMl1bMV0sXHJcbiAgICAgICAgbVsyXVsyXSxcclxuICAgICAgICBtWzJdWzNdLFxyXG4gICAgICAgIG1bM11bMV0sXHJcbiAgICAgICAgbVszXVsyXSxcclxuICAgICAgICBtWzNdWzNdXHJcbiAgICAgICkgLyAtZGV0O1xyXG5cclxuICAgIHJbMV1bMV0gPVxyXG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgIG1bMF1bMF0sXHJcbiAgICAgICAgbVswXVsyXSxcclxuICAgICAgICBtWzBdWzNdLFxyXG4gICAgICAgIG1bMl1bMF0sXHJcbiAgICAgICAgbVsyXVsyXSxcclxuICAgICAgICBtWzJdWzNdLFxyXG4gICAgICAgIG1bM11bMF0sXHJcbiAgICAgICAgbVszXVsyXSxcclxuICAgICAgICBtWzNdWzNdXHJcbiAgICAgICkgLyBkZXQ7XHJcblxyXG4gICAgclsyXVsxXSA9XHJcbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXHJcbiAgICAgICAgbVswXVswXSxcclxuICAgICAgICBtWzBdWzFdLFxyXG4gICAgICAgIG1bMF1bM10sXHJcbiAgICAgICAgbVsyXVswXSxcclxuICAgICAgICBtWzJdWzFdLFxyXG4gICAgICAgIG1bMl1bM10sXHJcbiAgICAgICAgbVszXVswXSxcclxuICAgICAgICBtWzNdWzFdLFxyXG4gICAgICAgIG1bM11bM11cclxuICAgICAgKSAvIC1kZXQ7XHJcbiAgICByWzNdWzFdID1cclxuICAgICAgX21hdHI0LmRldGVybTN4MyhcclxuICAgICAgICBtWzBdWzBdLFxyXG4gICAgICAgIG1bMF1bMV0sXHJcbiAgICAgICAgbVswXVsyXSxcclxuICAgICAgICBtWzJdWzBdLFxyXG4gICAgICAgIG1bMl1bMV0sXHJcbiAgICAgICAgbVsyXVsyXSxcclxuICAgICAgICBtWzNdWzBdLFxyXG4gICAgICAgIG1bM11bMV0sXHJcbiAgICAgICAgbVszXVsyXVxyXG4gICAgICApIC8gZGV0O1xyXG4gICAgclswXVsyXSA9XHJcbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXHJcbiAgICAgICAgbVswXVsxXSxcclxuICAgICAgICBtWzBdWzJdLFxyXG4gICAgICAgIG1bMF1bM10sXHJcbiAgICAgICAgbVsxXVsxXSxcclxuICAgICAgICBtWzFdWzJdLFxyXG4gICAgICAgIG1bMV1bM10sXHJcbiAgICAgICAgbVszXVsxXSxcclxuICAgICAgICBtWzNdWzJdLFxyXG4gICAgICAgIG1bM11bM11cclxuICAgICAgKSAvIGRldDtcclxuICAgIHJbMV1bMl0gPVxyXG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgIG1bMF1bMF0sXHJcbiAgICAgICAgbVswXVsyXSxcclxuICAgICAgICBtWzBdWzNdLFxyXG4gICAgICAgIG1bMV1bMF0sXHJcbiAgICAgICAgbVsxXVsyXSxcclxuICAgICAgICBtWzFdWzNdLFxyXG4gICAgICAgIG1bM11bMF0sXHJcbiAgICAgICAgbVszXVsyXSxcclxuICAgICAgICBtWzNdWzNdXHJcbiAgICAgICkgLyAtZGV0O1xyXG4gICAgclsyXVsyXSA9XHJcbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXHJcbiAgICAgICAgbVswXVswXSxcclxuICAgICAgICBtWzBdWzFdLFxyXG4gICAgICAgIG1bMF1bM10sXHJcbiAgICAgICAgbVsxXVswXSxcclxuICAgICAgICBtWzFdWzFdLFxyXG4gICAgICAgIG1bMV1bM10sXHJcbiAgICAgICAgbVszXVswXSxcclxuICAgICAgICBtWzNdWzFdLFxyXG4gICAgICAgIG1bM11bM11cclxuICAgICAgKSAvIGRldDtcclxuICAgIHJbM11bMl0gPVxyXG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxyXG4gICAgICAgIG1bMF1bMF0sXHJcbiAgICAgICAgbVswXVsxXSxcclxuICAgICAgICBtWzBdWzJdLFxyXG4gICAgICAgIG1bMV1bMF0sXHJcbiAgICAgICAgbVsyXVsxXSxcclxuICAgICAgICBtWzFdWzJdLFxyXG4gICAgICAgIG1bM11bMF0sXHJcbiAgICAgICAgbVszXVsxXSxcclxuICAgICAgICBtWzNdWzJdXHJcbiAgICAgICkgLyAtZGV0O1xyXG4gICAgclswXVszXSA9XHJcbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXHJcbiAgICAgICAgbVswXVsxXSxcclxuICAgICAgICBtWzBdWzJdLFxyXG4gICAgICAgIG1bMF1bM10sXHJcbiAgICAgICAgbVsxXVsxXSxcclxuICAgICAgICBtWzFdWzJdLFxyXG4gICAgICAgIG1bMV1bM10sXHJcbiAgICAgICAgbVsyXVsxXSxcclxuICAgICAgICBtWzJdWzJdLFxyXG4gICAgICAgIG1bMl1bM11cclxuICAgICAgKSAvIC1kZXQ7XHJcbiAgICByWzFdWzNdID1cclxuICAgICAgX21hdHI0LmRldGVybTN4MyhcclxuICAgICAgICBtWzBdWzBdLFxyXG4gICAgICAgIG1bMF1bMl0sXHJcbiAgICAgICAgbVswXVszXSxcclxuICAgICAgICBtWzFdWzBdLFxyXG4gICAgICAgIG1bMV1bMl0sXHJcbiAgICAgICAgbVsxXVszXSxcclxuICAgICAgICBtWzJdWzBdLFxyXG4gICAgICAgIG1bMl1bMl0sXHJcbiAgICAgICAgbVsyXVszXVxyXG4gICAgICApIC8gZGV0O1xyXG4gICAgclsyXVszXSA9XHJcbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXHJcbiAgICAgICAgbVswXVswXSxcclxuICAgICAgICBtWzBdWzFdLFxyXG4gICAgICAgIG1bMF1bM10sXHJcbiAgICAgICAgbVsxXVswXSxcclxuICAgICAgICBtWzFdWzFdLFxyXG4gICAgICAgIG1bMV1bM10sXHJcbiAgICAgICAgbVsyXVswXSxcclxuICAgICAgICBtWzJdWzFdLFxyXG4gICAgICAgIG1bMl1bM11cclxuICAgICAgKSAvIC1kZXQ7XHJcbiAgICByWzNdWzNdID1cclxuICAgICAgX21hdHI0LmRldGVybTN4MyhcclxuICAgICAgICBtWzBdWzBdLFxyXG4gICAgICAgIG1bMF1bMV0sXHJcbiAgICAgICAgbVswXVsyXSxcclxuICAgICAgICBtWzFdWzBdLFxyXG4gICAgICAgIG1bMl1bMV0sXHJcbiAgICAgICAgbVsxXVsyXSxcclxuICAgICAgICBtWzJdWzBdLFxyXG4gICAgICAgIG1bMl1bMV0sXHJcbiAgICAgICAgbVsyXVsyXVxyXG4gICAgICApIC8gZGV0O1xyXG4gICAgcmV0dXJuIHI7XHJcbiAgfVxyXG4gIHN0YXRpYyBmcnVzdHVtKGwsIHIsIGIsIHQsIG4sIGYpIHtcclxuICAgIGxldCBtID0gX21hdHI0LmlkZW50aXR5KCk7XHJcblxyXG4gICAgbVswXVswXSA9ICgyICogbikgLyAociAtIGwpO1xyXG4gICAgbVswXVsxXSA9IDA7XHJcbiAgICBtWzBdWzJdID0gMDtcclxuICAgIG1bMF1bM10gPSAwO1xyXG5cclxuICAgIG1bMV1bMF0gPSAwO1xyXG4gICAgbVsxXVsxXSA9ICgyICogbikgLyAodCAtIGIpO1xyXG4gICAgbVsxXVsyXSA9IDA7XHJcbiAgICBtWzFdWzNdID0gMDtcclxuXHJcbiAgICBtWzJdWzBdID0gKHIgKyBsKSAvIChyIC0gbCk7XHJcbiAgICBtWzJdWzFdID0gKHQgKyBiKSAvICh0IC0gYik7XHJcbiAgICBtWzJdWzJdID0gKGYgKyBuKSAvIC0oZiAtIG4pO1xyXG4gICAgbVsyXVszXSA9IC0xO1xyXG5cclxuICAgIG1bM11bMF0gPSAwO1xyXG4gICAgbVszXVsxXSA9IDA7XHJcbiAgICBtWzNdWzJdID0gKC0yICogbiAqIGYpIC8gKGYgLSBuKTtcclxuICAgIG1bM11bM10gPSAwO1xyXG5cclxuICAgIHJldHVybiBtO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHRvYXJyKG0pIHtcclxuICAgIGxldCB2ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgZm9yIChsZXQgZyA9IDA7IGcgPCA0OyBnKyspIHtcclxuICAgICAgICB2LnB1c2gobVtpXVtnXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdjtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgX3ZlYzMgfSBmcm9tIFwiLi9tYXRodmVjMy5qc1wiO1xyXG5pbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi9tYXRobWF0NC5qc1wiO1xyXG5leHBvcnQgbGV0IGNhbTtcclxuXHJcbmxldCBQcm9qU2l6ZSA9IDAuMSAvKiBQcm9qZWN0IHBsYW5lIGZpdCBzcXVhcmUgKi8sXHJcbiAgUHJvakRpc3QgPSAwLjEgLyogRGlzdGFuY2UgdG8gcHJvamVjdCBwbGFuZSBmcm9tIHZpZXdlciAobmVhcikgKi8sXHJcbiAgUHJvakZhckNsaXAgPSAzMDA7IC8qIERpc3RhbmNlIHRvIHByb2plY3QgZmFyIGNsaXAgcGxhbmUgKGZhcikgKi9cclxuXHJcblxyXG5jbGFzcyBfY2FtZXJhIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIFByb2pTaXplLFxyXG4gICAgUHJvakRpc3QsXHJcbiAgICBQcm9qRmFyQ2xpcCxcclxuICAgIE1hdHJWUCxcclxuICAgIE1hdHJWaWV3LFxyXG4gICAgTWF0clByb2osXHJcbiAgICBMb2MsXHJcbiAgICBBdCxcclxuICAgIERpcixcclxuICAgIFVwLFxyXG4gICAgUmlnaHRcclxuICApIHtcclxuICAgIHRoaXMuUHJvalNpemUgPSBQcm9qU2l6ZTtcclxuICAgIHRoaXMuUHJvakRpc3QgPSBQcm9qRGlzdDtcclxuICAgIHRoaXMuUHJvakZhckNsaXAgPSBQcm9qRmFyQ2xpcDtcclxuICAgIHRoaXMuTWF0clZQID0gTWF0clZQO1xyXG4gICAgdGhpcy5NYXRyVmlldyA9IE1hdHJWaWV3O1xyXG4gICAgdGhpcy5NYXRyUHJvaiA9IE1hdHJQcm9qO1xyXG4gICAgdGhpcy5Mb2MgPSBMb2M7XHJcbiAgICB0aGlzLkF0ID0gQXQ7XHJcbiAgICB0aGlzLkRpciA9IERpcjtcclxuICAgIHRoaXMuVXAgPSBVcDtcclxuICAgIHRoaXMuUmlnaHQgPSBSaWdodDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyB2aWV3KExvYywgQXQsIFVwMSkge1xyXG4gICAgY29uc3QgRGlyID0gX3ZlYzMubm9ybWFsaXplKF92ZWMzLnN1YihBdCwgTG9jKSksXHJcbiAgICAgIFJpZ2h0ID0gX3ZlYzMubm9ybWFsaXplKF92ZWMzLmNyb3NzKERpciwgVXAxKSksXHJcbiAgICAgIFVwID0gX3ZlYzMuY3Jvc3MoUmlnaHQsIERpcik7XHJcbiAgICByZXR1cm4gX21hdHI0LnNldChcclxuICAgICAgUmlnaHQueCxcclxuICAgICAgVXAueCxcclxuICAgICAgLURpci54LFxyXG4gICAgICAwLFxyXG4gICAgICBSaWdodC55LFxyXG4gICAgICBVcC55LFxyXG5cclxuICAgICAgLURpci55LFxyXG4gICAgICAwLFxyXG4gICAgICBSaWdodC56LFxyXG4gICAgICBVcC56LFxyXG4gICAgICAtRGlyLnosXHJcbiAgICAgIDAsXHJcbiAgICAgIC1fdmVjMy5kb3QoTG9jLCBSaWdodCksXHJcbiAgICAgIC1fdmVjMy5kb3QoTG9jLCBVcCksXHJcbiAgICAgIF92ZWMzLmRvdChMb2MsIERpciksXHJcbiAgICAgIDFcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ2FtU2V0KExvYywgQXQsIFVwMSkge1xyXG4gIGxldCBVcCwgRGlyLCBSaWdodDtcclxuICBgYDtcclxuICBsZXQgRnJhbWVXID0gMTIwMCxcclxuICAgIEZyYW1lSCA9IDEyMDA7XHJcbiAgbGV0IE1hdHJWaWV3ID0gX2NhbWVyYS52aWV3KExvYywgQXQsIFVwMSk7XHJcblxyXG4gIFVwID0gX3ZlYzMuc2V0KE1hdHJWaWV3WzBdWzFdLCBNYXRyVmlld1sxXVsxXSwgTWF0clZpZXdbMl1bMV0pO1xyXG4gIERpciA9IF92ZWMzLnNldCgtTWF0clZpZXdbMF1bMl0sIC1NYXRyVmlld1sxXVsyXSwgLU1hdHJWaWV3WzJdWzJdKTtcclxuICBSaWdodCA9IF92ZWMzLnNldChNYXRyVmlld1swXVswXSwgTWF0clZpZXdbMV1bMF0sIE1hdHJWaWV3WzJdWzBdKTtcclxuXHJcbiAgY29uc3QgcnggPSBQcm9qU2l6ZSxcclxuICAgIHJ5ID0gUHJvalNpemU7XHJcblxyXG4gIGxldCBNYXRyUHJvaiA9IF9tYXRyNC5mcnVzdHVtKFxyXG4gICAgICAtcnggLyAyLFxyXG4gICAgICByeCAvIDIsXHJcbiAgICAgIC1yeSAvIDIsXHJcbiAgICAgIHJ5IC8gMixcclxuXHJcbiAgICAgIFByb2pEaXN0LFxyXG4gICAgICBQcm9qRmFyQ2xpcFxyXG4gICAgKSxcclxuICAgIE1hdHJWUCA9IF9tYXRyNC5tdWxtYXRyKE1hdHJWaWV3LCBNYXRyUHJvaik7XHJcblxyXG4gIGNhbSA9ICBuZXcgX2NhbWVyYShcclxuICAgIFByb2pTaXplLFxyXG4gICAgUHJvakRpc3QsXHJcbiAgICBQcm9qRmFyQ2xpcCxcclxuICAgIE1hdHJWUCxcclxuICAgIE1hdHJWaWV3LFxyXG4gICAgTWF0clByb2osXHJcbiAgICBMb2MsXHJcbiAgICBBdCxcclxuICAgIERpcixcclxuICAgIFVwLFxyXG4gICAgUmlnaHRcclxuICApO1xyXG59XHJcbiIsImxldCBJc0NvbnRyb2wgPSBmYWxzZTtcclxubGV0IElzTEJ1dHRvbiA9IGZhbHNlO1xyXG5sZXQgSXNSQnV0dG9uID0gZmFsc2U7XHJcbmxldCBNZHggPSAwLFxyXG4gIE1keSA9IDAsXHJcbiAgTWR6ID0gMDtcclxuXHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdsQ2FudmFzXCIpO1xyXG5leHBvcnQgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbDJcIik7XHJcblxyXG5cclxuXHJcbiIsImltcG9ydCB7IGdsIH0gZnJvbSBcIi4uL3JuZGRhdGEuanNcIjtcclxuXHJcbmV4cG9ydCBsZXQgcHJvZ3JhbVxyXG5cclxuZnVuY3Rpb24gbG9hZFNoYWRlcihnbCwgdHlwZSwgc291cmNlKSB7XHJcbiAgY29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xyXG4gIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG5cclxuICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgYWxlcnQoXCIhISEhISFcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc2hhZGVyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hhZGVySW5pdCh2cywgZnMpIHtcclxuICBjb25zdCB2ZXJ0ZXhTaCA9IGxvYWRTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZzKTtcclxuICBjb25zdCBmcmFnbWVudFNoID0gbG9hZFNoYWRlcihnbCwgZ2wuRlJBR01FTlRfU0hBREVSLCBmcyk7XHJcblxyXG4gIHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZlcnRleFNoKTtcclxuICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJhZ21lbnRTaCk7XHJcbiAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcblxyXG4gIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcclxuICAgIGFsZXJ0KGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgZ2wgfSBmcm9tIFwiLi4vcm5kZGF0YS5qc1wiO1xyXG5pbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi4vLi4vbWF0aC9tYXRobWF0NC5qc1wiO1xyXG5pbXBvcnQgeyBfdmVjMyB9IGZyb20gXCIuLi8uLi9tYXRoL21hdGh2ZWMzLmpzXCI7XHJcbmltcG9ydCB7IHByb2dyYW0gfSBmcm9tIFwiLi9zaGFkZXIuanNcIjtcclxuZXhwb3J0IGxldCBVYm9zID0gW107XHJcblxyXG5leHBvcnQgbGV0IFVib19jZWxsID0ge1xyXG4gIE1hdHJXVlA6IFwibWF0cnd2cFwiLFxyXG4gIE1hdHJXOiBcIm1hdHJ3XCIsXHJcbiAgTWF0cldJbnY6IFwibWF0cndpbnZcIixcclxuICBNYXRyVlA6IFwibWF0cnZwXCIsXHJcbiAgTWF0clY6IFwibWF0cnZcIixcclxuICBDYW1Mb2M6IFwiY2FtbG9jXCIsXHJcbiAgQ2FtQXQ6IFwiY2FtYXRcIixcclxuICBDYW1SaWdodDogXCJjYW1yaWdodFwiLFxyXG4gIENhbVVwOiBcImNhbXVwXCIsXHJcbiAgQ2FtRGlyOiBcImNhbWRpclwiLFxyXG4gIFByb2pEaXN0RmFyVGltZUxvY2FsOiBcInByb2pkaXN0ZmFydGltZWxvY2FsXCIsXHJcbiAgVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbDogXCJ0aW1lZ2xvYmFsXCIsXHJcbiAgUHJvamVjdFNpemU6IFwicHJvanNpemVcIixcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBVYm9fTWF0ciB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBNYXRyV1ZQLFxyXG4gICAgTWF0clcsXHJcbiAgICBNYXRyV0ludixcclxuICAgIE1hdHJWUCxcclxuICAgIE1hdHJWLFxyXG4gICAgQ2FtTG9jLFxyXG4gICAgQ2FtQXQsXHJcbiAgICBDYW1SaWdodCxcclxuICAgIENhbVVwLFxyXG4gICAgQ2FtRGlyLFxyXG4gICAgUHJvakRpc3RGYXJUaW1lTG9jYWwsXHJcbiAgICBUaW1lR2xvYmFsRGVsdGFHbG9iYWxEZWx0YUxvY2FsLFxyXG4gICAgUHJvamVjdFNpemVcclxuICApIHtcclxuICAgIHRoaXMuTWF0cldWUCA9IE1hdHJXVlA7XHJcbiAgICB0aGlzLk1hdHJXID0gTWF0clc7XHJcbiAgICB0aGlzLk1hdHJXSW52ID0gTWF0cldJbnY7XHJcbiAgICB0aGlzLk1hdHJWUCA9IE1hdHJWUDtcclxuICAgIHRoaXMuTWF0clYgPSBNYXRyVjtcclxuICAgIHRoaXMuQ2FtTG9jID0gQ2FtTG9jO1xyXG4gICAgdGhpcy5DYW1BdCA9IENhbUF0O1xyXG4gICAgdGhpcy5DYW1SaWdodCA9IENhbVJpZ2h0O1xyXG4gICAgdGhpcy5DYW1VcCA9IENhbVVwO1xyXG4gICAgdGhpcy5DYW1EaXIgPSBDYW1EaXI7XHJcbiAgICB0aGlzLlByb2pEaXN0RmFyVGltZUxvY2FsID0gUHJvakRpc3RGYXJUaW1lTG9jYWw7XHJcblxyXG4gICAgdGhpcy5UaW1lR2xvYmFsRGVsdGFHbG9iYWxEZWx0YUxvY2FsID0gVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbDtcclxuICAgIHRoaXMuUHJvamVjdFNpemUgPSBQcm9qZWN0U2l6ZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVQk8ge1xyXG4gIGNvbnN0cnVjdG9yKHVibywgbmFtZSwgdWJvaWQsIFR5cGUpIHtcclxuICAgIHRoaXMudWJvID0gdWJvO1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMudWJvaWQgPSB1Ym9pZDtcclxuXHJcbiAgICB0aGlzLlR5cGUgPSBUeXBlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFkZChVYm8sIG5hbWUpIHtcclxuICAgIGxldCBmciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5VTklGT1JNX0JVRkZFUiwgZnIpO1xyXG4gICAgaWYgKG5hbWUgPT09IFwiQmFzZURhdGFcIikge1xyXG4gICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgIGdsLlVOSUZPUk1fQlVGRkVSLFxyXG4gICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgLi4uX21hdHI0LnRvYXJyKFViby5NYXRyV1ZQKSxcclxuICAgICAgICAgIC4uLl9tYXRyNC50b2FycihVYm8uTWF0clcpLFxyXG4gICAgICAgICAgLi4uX21hdHI0LnRvYXJyKFViby5NYXRyV0ludiksXHJcbiAgICAgICAgICAuLi5fbWF0cjQudG9hcnIoVWJvLk1hdHJWUCksXHJcbiAgICAgICAgICAuLi5fbWF0cjQudG9hcnIoVWJvLk1hdHJWKSxcclxuICAgICAgICAgIC4uLl92ZWMzLnZlYzMoVWJvLkNhbUxvYyksXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgLi4uX3ZlYzMudmVjMyhVYm8uQ2FtQXQpLFxyXG4gICAgICAgICAgMSxcclxuICAgICAgICAgIC4uLl92ZWMzLnZlYzMoVWJvLkNhbVJpZ2h0KSxcclxuICAgICAgICAgIDEsXHJcbiAgICAgICAgICAuLi5fdmVjMy52ZWMzKFViby5DYW1VcCksXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgLi4uX3ZlYzMudmVjMyhVYm8uQ2FtRGlyKSxcclxuICAgICAgICAgIDEsXHJcbiAgICAgICAgICAuLi5fdmVjMy52ZWMzKFViby5Qcm9qRGlzdEZhclRpbWVMb2NhbCksXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgLi4uX3ZlYzMudmVjMyhVYm8uVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbCksXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgLi4uX3ZlYzMudmVjMyhVYm8uUHJvamVjdFNpemUpLFxyXG4gICAgICAgICAgMSxcclxuICAgICAgICBdKSxcclxuICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKG5hbWUgPT09IFwiTWF0ZXJpYWxcIikge1xyXG4gICAgICBsZXQgeCA9IFtcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFViby5LYSksXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFViby5LZCksXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFViby5LcyksXHJcbiAgICAgICAgMSxcclxuICAgICAgICBVYm8uUGgsXHJcbiAgICAgICAgVWJvLlRyYW5zLFxyXG4gICAgICAgIDEsXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5VYm8uVGV4LFxyXG4gICAgICBdO1xyXG4gICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgIGdsLlVOSUZPUk1fQlVGRkVSLFxyXG4gICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgICAgLi4uX3ZlYzMudmVjMyhVYm8uS2EpLFxyXG4gICAgICAgICAgMSxcclxuICAgICAgICAgIC4uLl92ZWMzLnZlYzMoVWJvLktkKSxcclxuICAgICAgICAgIDEsXHJcbiAgICAgICAgICAuLi5fdmVjMy52ZWMzKFViby5LcyksXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgVWJvLlBoLFxyXG4gICAgICAgICAgVWJvLlRyYW5zLFxyXG4gICAgICAgICAgMSxcclxuICAgICAgICAgIDEsXHJcbiAgICAgICAgICAuLi5VYm8uVGV4LFxyXG4gICAgICAgIF0pLFxyXG4gICAgICAgIGdsLlNUQVRJQ19EUkFXXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBVYm9zLnB1c2gobmV3IFVCTyhVYm8sIG5hbWUsIGZyKSk7XHJcbiAgICByZXR1cm4gVWJvcy5sZW5ndGggLSAxO1xyXG4gIH1cclxuICBzdGF0aWMgdXBkYXRlKGlkLCBuYW1lX2NlbGwsIGNlbGxfZGF0YSkge1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5VTklGT1JNX0JVRkZFUiwgVWJvc1tpZF0udWJvaWQpO1xyXG4gICAgaWYgKFVib3NbaWRdLm5hbWUgPT09IFwiQmFzZURhdGFcIikge1xyXG4gICAgICBpZiAobmFtZV9jZWxsID09IFVib19jZWxsLk1hdHJXVlApIHtcclxuICAgICAgICBVYm9zW2lkXS51Ym8uTWF0cldWUCA9IGNlbGxfZGF0YTtcclxuICAgICAgfSBlbHNlIGlmIChuYW1lX2NlbGwgPT0gVWJvX2NlbGwuTWF0clcpIHtcclxuICAgICAgICBVYm9zW2lkXS51Ym8uTWF0clcgPSBjZWxsX2RhdGE7XHJcbiAgICAgIH0gZWxzZSBpZiAobmFtZV9jZWxsID09IFVib19jZWxsLk1hdHJXSW52KSB7XHJcbiAgICAgICAgVWJvc1tpZF0udWJvLk1hdHJXSW52ID0gY2VsbF9kYXRhO1xyXG4gICAgICB9IGVsc2UgaWYgKG5hbWVfY2VsbCA9PSBVYm9fY2VsbC5NYXRyVlApIHtcclxuICAgICAgICBVYm9zW2lkXS51Ym8uTWF0clZQID0gY2VsbF9kYXRhO1xyXG4gICAgICB9IGVsc2UgaWYgKG5hbWVfY2VsbCA9PSBVYm9fY2VsbC5NYXRyVikge1xyXG4gICAgICAgIFVib3NbaWRdLnViby5NYXRyViA9IGNlbGxfZGF0YTtcclxuICAgICAgfSBlbHNlIGlmIChuYW1lX2NlbGwgPT0gVWJvX2NlbGwuQ2FtTG9jKSB7XHJcbiAgICAgICAgVWJvc1tpZF0udWJvLkNhbUxvYyA9IGNlbGxfZGF0YTtcclxuICAgICAgfSBlbHNlIGlmIChuYW1lX2NlbGwgPT0gVWJvX2NlbGwuQ2FtQXQpIHtcclxuICAgICAgICBVYm9zW2lkXS51Ym8uQ2FtQXQgPSBjZWxsX2RhdGE7XHJcbiAgICAgIH0gZWxzZSBpZiAobmFtZV9jZWxsID09IFVib19jZWxsLkNhbVJpZ2h0KSB7XHJcbiAgICAgICAgVWJvc1tpZF0udWJvLkNhbVJpZ2h0ID0gY2VsbF9kYXRhO1xyXG4gICAgICB9IGVsc2UgaWYgKG5hbWVfY2VsbCA9PSBVYm9fY2VsbC5DYW1EaXIpIHtcclxuICAgICAgICBVYm9zW2lkXS51Ym8uQ2FtRGlyID0gY2VsbF9kYXRhO1xyXG4gICAgICB9IGVsc2UgaWYgKG5hbWVfY2VsbCA9PSBVYm9fY2VsbC5Qcm9qRGlzdEZhclRpbWVMb2NhbCkge1xyXG4gICAgICAgIFVib3NbaWRdLnViby5Qcm9qRGlzdEZhclRpbWVMb2NhbCA9IGNlbGxfZGF0YTtcclxuICAgICAgfSBlbHNlIGlmIChuYW1lX2NlbGwgPT0gVWJvX2NlbGwuVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbCkge1xyXG4gICAgICAgIFVib3NbaWRdLnViby5UaW1lR2xvYmFsRGVsdGFHbG9iYWxEZWx0YUxvY2FsID0gY2VsbF9kYXRhO1xyXG4gICAgICB9IGVsc2UgaWYgKG5hbWVfY2VsbCA9PSBVYm9fY2VsbC5Qcm9qZWN0U2l6ZSkge1xyXG4gICAgICAgIFVib3NbaWRdLnViby5Qcm9qRGlzdEZhclRpbWVMb2NhbCA9IGNlbGxfZGF0YTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgeCA9IG5ldyBGbG9hdDMyQXJyYXkoW1xyXG4gICAgICAgIC4uLl9tYXRyNC50b2FycihVYm9zW2lkXS51Ym8uTWF0cldWUCksXHJcbiAgICAgICAgLi4uX21hdHI0LnRvYXJyKFVib3NbaWRdLnViby5NYXRyVyksXHJcbiAgICAgICAgLi4uX21hdHI0LnRvYXJyKFVib3NbaWRdLnViby5NYXRyV0ludiksXHJcbiAgICAgICAgLi4uX21hdHI0LnRvYXJyKFVib3NbaWRdLnViby5NYXRyVlApLFxyXG4gICAgICAgIC4uLl9tYXRyNC50b2FycihVYm9zW2lkXS51Ym8uTWF0clYpLFxyXG4gICAgICAgIC4uLl92ZWMzLnZlYzMoVWJvc1tpZF0udWJvLkNhbUxvYyksXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFVib3NbaWRdLnViby5DYW1BdCksXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFVib3NbaWRdLnViby5DYW1SaWdodCksXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFVib3NbaWRdLnViby5DYW1VcCksXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFVib3NbaWRdLnViby5DYW1EaXIpLFxyXG4gICAgICAgIDEsXHJcbiAgICAgICAgLi4uX3ZlYzMudmVjMyhVYm9zW2lkXS51Ym8uUHJvakRpc3RGYXJUaW1lTG9jYWwpLFxyXG4gICAgICAgIDEsXHJcbiAgICAgICAgLi4uX3ZlYzMudmVjMyhVYm9zW2lkXS51Ym8uVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbCksXHJcbiAgICAgICAgMSxcclxuICAgICAgICAuLi5fdmVjMy52ZWMzKFVib3NbaWRdLnViby5Qcm9qZWN0U2l6ZSksXHJcbiAgICAgICAgMSxcclxuICAgICAgXSk7XHJcblxyXG4gICAgICBnbC5idWZmZXJEYXRhKGdsLlVOSUZPUk1fQlVGRkVSLCB4LCBnbC5TVEFUSUNfRFJBVyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHN0YXRpYyBhcHBsYXkoaWQsIHBvaW50KSB7XHJcbiAgICBsZXQgYmxrX2xvYyA9IGdsLmdldFVuaWZvcm1CbG9ja0luZGV4KHByb2dyYW0sIFVib3NbaWRdLm5hbWUpO1xyXG5cclxuICAgIGdsLnVuaWZvcm1CbG9ja0JpbmRpbmcocHJvZ3JhbSwgYmxrX2xvYywgcG9pbnQpO1xyXG5cclxuICAgIGdsLmJpbmRCdWZmZXJCYXNlKGdsLlVOSUZPUk1fQlVGRkVSLCBwb2ludCwgVWJvc1tpZF0udWJvaWQpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBVQk8sIFVib19jZWxsIH0gZnJvbSBcIi4vcm5kL3Jlcy91Ym8uanNcIjtcclxuaW1wb3J0IHsgY2FtIH0gZnJvbSBcIi4vbWF0aC9tYXRoY2FtLmpzXCI7XHJcbmltcG9ydCB7IF92ZWMzIH0gZnJvbSBcIi4vbWF0aC9tYXRodmVjMy5qc1wiO1xyXG5pbXBvcnQgeyBDYW1VQk8gfSBmcm9tIFwiLi9ybmQvcm5kYmFzZS5qc1wiO1xyXG5cclxuZnVuY3Rpb24gVGltZXIoKSB7XHJcbiAgLy8gVGltZXIgb2J0YWluIGN1cnJlbnQgdGltZSBpbiBzZWNvbmRzIG1ldGhvZFxyXG4gIGNvbnN0IGdldFRpbWUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCB0ID1cclxuICAgICAgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDAuMCArXHJcbiAgICAgIGRhdGUuZ2V0U2Vjb25kcygpICtcclxuICAgICAgZGF0ZS5nZXRNaW51dGVzKCkgKiA2MDtcclxuICAgIHJldHVybiB0O1xyXG4gIH07XHJcblxyXG4gIC8vIFRpbWVyIHJlc3BvbnNlIG1ldGhvZFxyXG4gIHRoaXMucmVzcG9uc2UgPSAodGFnX2lkID0gbnVsbCkgPT4ge1xyXG4gICAgbGV0IHQgPSBnZXRUaW1lKCk7XHJcbiAgICAvLyBHbG9iYWwgdGltZVxyXG4gICAgdGhpcy5nbG9iYWxUaW1lID0gdDtcclxuICAgIHRoaXMuZ2xvYmFsRGVsdGFUaW1lID0gdCAtIHRoaXMub2xkVGltZTtcclxuICAgIC8vIFRpbWUgd2l0aCBwYXVzZVxyXG4gICAgaWYgKHRoaXMuaXNQYXVzZSkge1xyXG4gICAgICB0aGlzLmxvY2FsRGVsdGFUaW1lID0gMDtcclxuICAgICAgdGhpcy5wYXVzZVRpbWUgKz0gdCAtIHRoaXMub2xkVGltZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubG9jYWxEZWx0YVRpbWUgPSB0aGlzLmdsb2JhbERlbHRhVGltZTtcclxuICAgICAgdGhpcy5sb2NhbFRpbWUgPSB0IC0gdGhpcy5wYXVzZVRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcclxuICAgIH1cclxuICAgIC8vIEZQU1xyXG4gICAgdGhpcy5mcmFtZUNvdW50ZXIrKztcclxuICAgIGlmICh0IC0gdGhpcy5vbGRUaW1lRlBTID4gMykge1xyXG4gICAgICB0aGlzLkZQUyA9IHRoaXMuZnJhbWVDb3VudGVyIC8gKHQgLSB0aGlzLm9sZFRpbWVGUFMpO1xyXG4gICAgICB0aGlzLm9sZFRpbWVGUFMgPSB0O1xyXG4gICAgICB0aGlzLmZyYW1lQ291bnRlciA9IDA7XHJcbiAgICAgIGlmICh0YWdfaWQgIT0gbnVsbClcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWdfaWQpLmlubmVySFRNTCA9IHRoaXMuZ2V0RlBTKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9sZFRpbWUgPSB0O1xyXG5cclxuICAgIFVCTy51cGRhdGUoXHJcbiAgICAgIENhbVVCTyxcclxuICAgICAgVWJvX2NlbGwuUHJvakRpc3RGYXJUaW1lTG9jYWwsXHJcbiAgICAgIF92ZWMzLnNldChjYW0uUHJvakRpc3QsIGNhbS5Qcm9qRmFyQ2xpcCwgdGhpcy5sb2NhbFRpbWUpXHJcbiAgICApO1xyXG4gICAgVUJPLnVwZGF0ZShcclxuICAgICAgQ2FtVUJPLFxyXG4gICAgICBVYm9fY2VsbC5UaW1lR2xvYmFsRGVsdGFHbG9iYWxEZWx0YUxvY2FsLFxyXG4gICAgICBfdmVjMy5zZXQodGhpcy5nbG9iYWxUaW1lLCB0aGlzLmdsb2JhbERlbHRhVGltZSwgdGhpcy5sb2NhbERlbHRhVGltZSlcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgLy8gT2J0YWluIEZQUyBhcyBzdHJpbmcgbWV0aG9kXHJcbiAgdGhpcy5nZXRGUFMgPSAoKSA9PiB0aGlzLkZQUy50b0ZpeGVkKDMpO1xyXG5cclxuICAvLyBGaWxsIHRpbWVyIGdsb2JhbCBkYXRhXHJcbiAgdGhpcy5nbG9iYWxUaW1lID0gdGhpcy5sb2NhbFRpbWUgPSBnZXRUaW1lKCk7XHJcbiAgdGhpcy5nbG9iYWxEZWx0YVRpbWUgPSB0aGlzLmxvY2FsRGVsdGFUaW1lID0gMDtcclxuXHJcbiAgLy8gRmlsbCB0aW1lciBzZW1pIGdsb2JhbCBkYXRhXHJcbiAgdGhpcy5zdGFydFRpbWUgPSB0aGlzLm9sZFRpbWUgPSB0aGlzLm9sZFRpbWVGUFMgPSB0aGlzLmdsb2JhbFRpbWU7XHJcbiAgdGhpcy5mcmFtZUNvdW50ZXIgPSAwO1xyXG4gIHRoaXMuaXNQYXVzZSA9IGZhbHNlO1xyXG4gIHRoaXMuRlBTID0gMzAuMDtcclxuICB0aGlzLnBhdXNlVGltZSA9IDA7XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59IC8vIEVuZCBvZiAnVGltZXInIGZ1bmN0aW9uXHJcblxyXG5leHBvcnQgbGV0IG15VGltZXIgPSBuZXcgVGltZXIoKTtcclxuIiwiaW1wb3J0IHsgVUJPIH0gZnJvbSBcIi4vdWJvLmpzXCI7XHJcbmltcG9ydCB7IF92ZWMzIH0gZnJvbSBcIi4uLy4uL21hdGgvbWF0aHZlYzMuanNcIjtcclxuXHJcbmxldCBNYXRlcmlhbCA9IFtdO1xyXG5cclxuZXhwb3J0IGNsYXNzIG1hdGVyaWFsIHtcclxuICBjb25zdHJ1Y3RvcihOYW1lLCBLYSwgS2QsIEtzLCBQaCwgVHJhbnMsIFRleCwgVWJvTm8pIHtcclxuICAgIHRoaXMuTmFtZSA9IE5hbWU7IC8qIE1hdGVyaWFsIG5hbWUgKi9cclxuXHJcbiAgICAvKiBJbGx1bWluYXRpb24gY29lZmZpY2llbnRzICovXHJcblxyXG4gICAgdGhpcy5LYSA9IEthO1xyXG4gICAgdGhpcy5LZCA9IEtkO1xyXG4gICAgdGhpcy5LcyA9IEtzO1xyXG4gICAgdGhpcy5UcmFucyA9IFRyYW5zO1xyXG4gICAgdGhpcy5QaCA9IFBoO1xyXG4gICAgdGhpcy5UZXggPSBUZXg7XHJcbiAgICB0aGlzLlVib05vID0gVWJvTm87XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgTXRsR2V0RGVmKCkge1xyXG4gICAgcmV0dXJuIG5ldyBtYXRlcmlhbChcclxuICAgICAgXCJEZWZhdWx0XCIsXHJcbiAgICAgIF92ZWMzLnNldCgwLjEsIDAuMSwgMC4xKSxcclxuICAgICAgX3ZlYzMuc2V0KDAuOSwgMC45LCAwLjkpLFxyXG4gICAgICBfdmVjMy5zZXQoMC4zLCAwLjMsIDAuMyksXHJcbiAgICAgIDMwLFxyXG4gICAgICAxLFxyXG4gICAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICAgKTtcclxuICB9XHJcbiAgc3RhdGljIGFkZChNdGwpIHtcclxuICAgIE10bC5VYm9ObyA9IFVCTy5hZGQoTXRsLCBcIk1hdGVyaWFsXCIpO1xyXG4gICAgTWF0ZXJpYWwucHVzaChNdGwpO1xyXG4gICAgcmV0dXJuIE1hdGVyaWFsLmxlbmd0aCAtIDE7XHJcbiAgfVxyXG4gIHN0YXRpYyBhcHBsYXkoTXRsTm8sIHBvaW50KSB7XHJcbiAgICBVQk8uYXBwbGF5KE1hdGVyaWFsW010bE5vXS5VYm9ObywgcG9pbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBNYXRsaWIgPSB7XHJcbiAgQmxhY2tfUGxhc3RpYzogbmV3IG1hdGVyaWFsKFxyXG4gICAgXCJCbGFja19QbGFzdGljXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4wLCAwLjAsIDAuMCksXHJcbiAgICBfdmVjMy5zZXQoMC4wMSwgMC4wMSwgMC4wMSksXHJcbiAgICBfdmVjMy5zZXQoMC41LCAwLjUsIDAuNSksXHJcbiAgICAzMixcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICksXHJcbiAgQnJhc3M6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiQnJhc3NcIixcclxuICAgIF92ZWMzLnNldCgwLjMyOTQxMiwgMC4yMjM1MjksIDAuMDI3NDUxKSxcclxuICAgIF92ZWMzLnNldCgwLjc4MDM5MiwgMC41Njg2MjcsIDAuMTEzNzI1KSxcclxuICAgIF92ZWMzLnNldCgwLjk5MjE1NywgMC45NDExNzYsIDAuODA3ODQzKSxcclxuICAgIDI3Ljg5NzQsXHJcbiAgICAxLFxyXG4gICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMV1cclxuICApLFxyXG4gIEJyb256ZTogbmV3IG1hdGVyaWFsKFxyXG4gICAgXCJCcm9uemVcIixcclxuICAgIF92ZWMzLnNldCgwLjIxMjUsIDAuMTI3NSwgMC4wNTQpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNzE0LCAwLjQyODQsIDAuMTgxNDQpLFxyXG4gICAgX3ZlYzMuc2V0KDAuMzkzNTQ4LCAwLjI3MTkwNiwgMC4xNjY3MjEpLFxyXG4gICAgMjUuNixcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICksXHJcbiAgQ2hyb21lOiBuZXcgbWF0ZXJpYWwoXHJcbiAgICBcIkNocm9tZVwiLFxyXG4gICAgX3ZlYzMuc2V0KDAuMjUsIDAuMjUsIDAuMjUpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNCwgMC40LCAwLjQpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNzc0NTk3LCAwLjc3NDU5NywgMC43NzQ1OTcpLFxyXG4gICAgNzYuOCxcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICksXHJcbiAgQ29wcGVyOiBuZXcgbWF0ZXJpYWwoXHJcbiAgICBcIkNvcHBlclwiLFxyXG4gICAgX3ZlYzMuc2V0KDAuMTkxMjUsIDAuMDczNSwgMC4wMjI1KSxcclxuICAgIF92ZWMzLnNldCgwLjcwMzgsIDAuMjcwNDgsIDAuMDgyOCksXHJcbiAgICBfdmVjMy5zZXQoMC4yNTY3NzcsIDAuMTM3NjIyLCAwLjA4NjAxNCksXHJcbiAgICAxMi44LFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBHb2xkOiBuZXcgbWF0ZXJpYWwoXHJcbiAgICBcIkdvbGRcIixcclxuICAgIF92ZWMzLnNldCgwLjI0NzI1LCAwLjE5OTUsIDAuMDc0NSksXHJcbiAgICBfdmVjMy5zZXQoMC43NTE2NCwgMC42MDY0OCwgMC4yMjY0OCksXHJcbiAgICBfdmVjMy5zZXQoMC42MjgyODEsIDAuNTU1ODAyLCAwLjM2NjA2NSksXHJcbiAgICA1MS4yLFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBQZXdldGVyOiBuZXcgbWF0ZXJpYWwoXHJcbiAgICBcIlBld2V0ZXJcIixcclxuICAgIF92ZWMzLnNldCgwLjEwNTg4LCAwLjA1ODgyNCwgMC4xMTM3MjUpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNDI3NDUxLCAwLjQ3MDU4OCwgMC41NDExNzYpLFxyXG4gICAgX3ZlYzMuc2V0KDAuMzMzMywgMC4zMzMzLCAwLjUyMTU2OSksXHJcbiAgICA5Ljg0NjE1LFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBTaWx2ZXI6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiU2lsdmVyXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4xOTIyNSwgMC4xOTIyNSwgMC4xOTIyNSksXHJcbiAgICBfdmVjMy5zZXQoMC41MDc1NCwgMC41MDc1NCwgMC41MDc1NCksXHJcbiAgICBfdmVjMy5zZXQoMC41MDgyNzMsIDAuNTA4MjczLCAwLjUwODI3MyksXHJcbiAgICA1MS4yLFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBQb2xpc2hlZF9TaWx2ZXI6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiUG9saXNoZWRfU2lsdmVyXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4yMzEyNSwgMC4yMzEyNSwgMC4yMzEyNSksXHJcbiAgICBfdmVjMy5zZXQoMC4yNzc1LCAwLjI3NzUsIDAuMjc3NSksXHJcbiAgICBfdmVjMy5zZXQoMC43NzM5MTEsIDAuNzczOTExLCAwLjc3MzkxMSksXHJcbiAgICA4OS42LFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBUdXJxdW9pc2U6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiVHVycXVvaXNlXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4xLCAwLjE4NzI1LCAwLjE3NDUpLFxyXG4gICAgX3ZlYzMuc2V0KDAuMzk2LCAwLjc0MTUxLCAwLjY5MTAyKSxcclxuICAgIF92ZWMzLnNldCgwLjI5NzI1NCwgMC4zMDgyOSwgMC4zMDY2NzgpLFxyXG4gICAgMTIuOCxcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICksXHJcbiAgUnVieTogbmV3IG1hdGVyaWFsKFxyXG4gICAgXCJSdWJ5XCIsXHJcbiAgICBfdmVjMy5zZXQoMC4xNzQ1LCAwLjAxMTc1LCAwLjAxMTc1KSxcclxuICAgIF92ZWMzLnNldCgwLjYxNDI0LCAwLjA0MTM2LCAwLjA0MTM2KSxcclxuICAgIF92ZWMzLnNldCgwLjcyNzgxMSwgMC42MjY5NTksIDAuNjI2OTU5KSxcclxuICAgIDc2LjgsXHJcbiAgICAxLFxyXG4gICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMV1cclxuICApLFxyXG4gIFBvbGlzaGVkX0dvbGQ6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiUG9saXNoZWRfR29sZFwiLFxyXG4gICAgX3ZlYzMuc2V0KDAuMjQ3MjUsIDAuMjI0NSwgMC4wNjQ1KSxcclxuICAgIF92ZWMzLnNldCgwLjM0NjE1LCAwLjMxNDMsIDAuMDkwMyksXHJcbiAgICBfdmVjMy5zZXQoMC43OTczNTcsIDAuNzIzOTkxLCAwLjIwODAwNiksXHJcbiAgICA4My4yLFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBQb2xpc2hlZF9Ccm9uemU6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiUG9saXNoZWRfQnJvbnplXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4yNSwgMC4xNDgsIDAuMDY0NzUpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNCwgMC4yMzY4LCAwLjEwMzYpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNzc0NTk3LCAwLjQ1ODU2MSwgMC4yMDA2MjEpLFxyXG4gICAgNzYuOCxcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICksXHJcbiAgUG9saXNoZWRfQ29wcGVyOiBuZXcgbWF0ZXJpYWwoXHJcbiAgICBcIlBvbGlzaGVkX0NvcHBlclwiLFxyXG4gICAgX3ZlYzMuc2V0KDAuMjI5NSwgMC4wODgyNSwgMC4wMjc1KSxcclxuICAgIF92ZWMzLnNldCgwLjU1MDgsIDAuMjExOCwgMC4wNjYpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNTgwNTk0LCAwLjIyMzI1NywgMC4wNjk1NzAxKSxcclxuICAgIDUxLjIsXHJcbiAgICAxLFxyXG4gICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMV1cclxuICApLFxyXG4gIEphZGU6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiSmFkZVwiLFxyXG4gICAgX3ZlYzMuc2V0KDAuMTM1LCAwLjIyMjUsIDAuMTU3NSksXHJcbiAgICBfdmVjMy5zZXQoMC4xMzUsIDAuMjIyNSwgMC4xNTc1KSxcclxuICAgIF92ZWMzLnNldCgwLjMxNjIyOCwgMC4zMTYyMjgsIDAuMzE2MjI4KSxcclxuICAgIDEyLjgsXHJcbiAgICAxLFxyXG4gICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMV1cclxuICApLFxyXG4gIE9ic2lkaWFuOiBuZXcgbWF0ZXJpYWwoXHJcbiAgICBcIk9ic2lkaWFuXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4wNTM3NSwgMC4wNSwgMC4wNjYyNSksXHJcbiAgICBfdmVjMy5zZXQoMC4xODI3NSwgMC4xNywgMC4yMjUyNSksXHJcbiAgICBfdmVjMy5zZXQoMC4zMzI3NDEsIDAuMzI4NjM0LCAwLjM0NjQzNSksXHJcbiAgICAzOC40LFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBQZWFybDogbmV3IG1hdGVyaWFsKFxyXG4gICAgXCJQZWFybFwiLFxyXG4gICAgX3ZlYzMuc2V0KDAuMjUsIDAuMjA3MjUsIDAuMjA3MjUpLFxyXG4gICAgX3ZlYzMuc2V0KDEuMCwgMC44MjksIDAuODI5KSxcclxuICAgIF92ZWMzLnNldCgwLjI5NjY0OCwgMC4yOTY2NDgsIDAuMjk2NjQ4KSxcclxuICAgIDExLjI2NCxcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICksXHJcbiAgRW1lcmFsZDogbmV3IG1hdGVyaWFsKFxyXG4gICAgXCJFbWVyYWxkXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4wMjE1LCAwLjE3NDUsIDAuMDIxNSksXHJcbiAgICBfdmVjMy5zZXQoMC4wNzU2OCwgMC42MTQyNCwgMC4wNzU2OCksXHJcbiAgICBfdmVjMy5zZXQoMC42MzMsIDAuNzI3ODExLCAwLjYzMyksXHJcbiAgICA3Ni44LFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxuICBCbGFja19SdWJiZXI6IG5ldyBtYXRlcmlhbChcclxuICAgIFwiQmxhY2tfUnViYmVyXCIsXHJcbiAgICBfdmVjMy5zZXQoMC4wMiwgMC4wMiwgMC4wMiksXHJcbiAgICBfdmVjMy5zZXQoMC4wMSwgMC4wMSwgMC4wMSksXHJcbiAgICBfdmVjMy5zZXQoMC40LCAwLjQsIDAuNCksXHJcbiAgICAxMC4wLFxyXG4gICAgMSxcclxuICAgIFstMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTFdXHJcbiAgKSxcclxufTtcclxuIiwiaW1wb3J0IHsgVUJPIH0gZnJvbSBcIi4vcmVzL3Viby5qc1wiO1xyXG5pbXBvcnQgeyBnbCB9IGZyb20gXCIuL3JuZGRhdGEuanNcIjtcclxuaW1wb3J0IHsgcHJvZ3JhbSB9IGZyb20gXCIuL3Jlcy9zaGFkZXIuanNcIjtcclxuaW1wb3J0IHsgX21hdHI0IH0gZnJvbSBcIi4uL21hdGgvbWF0aG1hdDQuanNcIjtcclxuaW1wb3J0IHsgX3ZlYzMgfSBmcm9tIFwiLi4vbWF0aC9tYXRodmVjMy5qc1wiO1xyXG5pbXBvcnQgeyBjYW0gfSBmcm9tIFwiLi4vbWF0aC9tYXRoY2FtLmpzXCI7XHJcbmltcG9ydCB7IENhbVVCTyB9IGZyb20gXCIuL3JuZGJhc2UuanNcIjtcclxuaW1wb3J0IHsgVWJvX2NlbGwgfSBmcm9tIFwiLi9yZXMvdWJvLmpzXCI7XHJcbmltcG9ydCB7IG1hdGVyaWFsIH0gZnJvbSBcIi4vcmVzL21hdGVyaWFsLmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgdmVydGV4IHtcclxuICBjb25zdHJ1Y3RvcihQLCBDLCBOKSB7XHJcbiAgICB0aGlzLlAgPSBQO1xyXG4gICAgdGhpcy5DID0gQztcclxuICAgIHRoaXMuTiA9IE47XHJcbiAgfVxyXG4gIHN0YXRpYyB2ZXJ0MmFycihhKSB7XHJcbiAgICByZXR1cm4gW2EuUC54LCBhLlAueSwgYS5QLnosIGEuQy54LCBhLkMueSwgYS5DLnosIGEuTi54LCBhLk4ueSwgYS5OLnpdO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNyZWF0ZShhKSB7XHJcbiAgICByZXR1cm4gbmV3IHZlcnRleChhLlAsIGEuQywgYS5OKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBwcmltIHtcclxuICBjb25zdHJ1Y3RvcihWQSwgVkJ1ZiwgSUJ1ZiwgTnVtT2ZFbGVtZW50cywgVHJhbnMsIE10bE5vKSB7XHJcbiAgICB0aGlzLlZBID0gVkE7XHJcbiAgICB0aGlzLlZCdWYgPSBWQnVmO1xyXG4gICAgdGhpcy5JQnVmID0gSUJ1ZjtcclxuICAgIHRoaXMuTnVtT2ZFbGVtZW50cyA9IE51bU9mRWxlbWVudHM7XHJcbiAgICB0aGlzLlRyYW5zID0gVHJhbnM7XHJcbiAgICB0aGlzLk10bE5vID0gTXRsTm87XHJcbiAgfVxyXG4gIHN0YXRpYyBjcmVhdGUoVmVydCwgTnVtb2ZWZXJ0LCBJbmQsIE51bW9mSW5kLCBNdGxObykge1xyXG4gICAgbGV0IHByaW1WZXJ0ZXhBcnJheSA9IGdsLmNyZWF0ZVZlcnRleEFycmF5KCk7XHJcbiAgICBnbC5iaW5kVmVydGV4QXJyYXkocHJpbVZlcnRleEFycmF5KTtcclxuXHJcbiAgICBsZXQgcHJpbVZlcnRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHByaW1WZXJ0ZXhCdWZmZXIpO1xyXG5cclxuICAgIGxldCBwb3MgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTnVtb2ZWZXJ0OyBpKyspIHtcclxuICAgICAgcG9zID0gcG9zLmNvbmNhdCh2ZXJ0ZXgudmVydDJhcnIoVmVydFtpXSkpO1xyXG4gICAgfVxyXG4gICAgcG9zID0gbmV3IEZsb2F0MzJBcnJheShwb3MpO1xyXG5cclxuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBwb3MsIGdsLlNUQVRJQ19EUkFXKTtcclxuXHJcbiAgICBsZXQgcHJpbUluZGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBwcmltSW5kZXhCdWZmZXIpO1xyXG5cclxuICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLFxyXG4gICAgICBuZXcgVWludDE2QXJyYXkoSW5kKSxcclxuICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICk7XHJcblxyXG4gICAgbGV0IEZzaXplID0gcG9zLkJZVEVTX1BFUl9FTEVNRU5UO1xyXG4gICAgbGV0IHBvc0xvYyA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIFwiaW5fcG9zXCIpO1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zTG9jKTtcclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zTG9jLCAzLCBnbC5GTE9BVCwgZmFsc2UsIEZzaXplICogOSwgMCk7XHJcblxyXG4gICAgbGV0IHBvc0NvbCA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIFwiaW5fY29sb3JcIik7XHJcbiAgICBpZiAocG9zQ29sICE9IC0xKSB7XHJcbiAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zQ29sLCAzLCBnbC5GTE9BVCwgZmFsc2UsIEZzaXplICogOSwgRnNpemUgKiAzKTtcclxuICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zQ29sKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcG9zTm9ybSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sIFwiaW5fbm9ybWFsXCIpO1xyXG5cclxuICAgIGlmIChwb3NOb3JtICE9IC0xKSB7XHJcbiAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zTm9ybSwgMywgZ2wuRkxPQVQsIGZhbHNlLCBGc2l6ZSAqIDksIEZzaXplICogNik7XHJcbiAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvc05vcm0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgcHJpbShcclxuICAgICAgcHJpbVZlcnRleEFycmF5LFxyXG4gICAgICBwcmltVmVydGV4QnVmZmVyLFxyXG4gICAgICBwcmltSW5kZXhCdWZmZXIsXHJcbiAgICAgIE51bW9mSW5kLFxyXG4gICAgICBfbWF0cjQuaWRlbnRpdHkoKSxcclxuICAgICAgTXRsTm9cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZHJhdyhQciwgV29ybGQpIHtcclxuICAgIGxldCB3ID0gX21hdHI0Lm11bG1hdHIoUHIuVHJhbnMsIFdvcmxkKTtcclxuICAgIGxldCB3aW52ID0gX21hdHI0LnRyYW5zcG9zZShfbWF0cjQuaW52ZXJzZSh3KSk7XHJcbiAgICBsZXQgV1ZQID0gX21hdHI0Lm11bG1hdHIodywgY2FtLk1hdHJWUCk7XHJcblxyXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuXHJcbiAgICBnbC5iaW5kVmVydGV4QXJyYXkoUHIuVkEpO1xyXG5cclxuICAgIFVCTy51cGRhdGUoQ2FtVUJPLCBVYm9fY2VsbC5NYXRyV1ZQLCBXVlApO1xyXG4gICAgVUJPLnVwZGF0ZShDYW1VQk8sIFVib19jZWxsLk1hdHJXLCB3KTtcclxuICAgIFVCTy51cGRhdGUoQ2FtVUJPLCBVYm9fY2VsbC5NYXRyV0ludiwgd2ludik7XHJcbiAgICBVQk8uYXBwbGF5KENhbVVCTywgMCk7XHJcbiAgICBtYXRlcmlhbC5hcHBsYXkoUHIuTXRsTm8sIDEpO1xyXG5cclxuICAgIGdsLmRyYXdFbGVtZW50cyhcclxuICAgICAgZ2wuVFJJQU5HTEVTLCAvLyBUUklBTkdMRVMsIFRSSUFOR0xFX1NUUklQXHJcbiAgICAgIFByLk51bU9mRWxlbWVudHMsIC8vUHIuTnVtT2ZFbGVtZW50c1xyXG4gICAgICBnbC5VTlNJR05FRF9TSE9SVCxcclxuICAgICAgUHIuSUJ1ZlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjcmVhdGVfbm9ybWFsKGEsIGkpIHtcclxuICAgIGFbaV0uTiA9IF92ZWMzLm5vcm1hbGl6ZShcclxuICAgICAgX3ZlYzMuY3Jvc3MoX3ZlYzMuc3ViKGFbaSArIDJdLlAsIGFbaV0uUCksIF92ZWMzLnN1YihhW2kgKyAxXS5QLCBhW2ldLlApKVxyXG4gICAgKTtcclxuICAgIGFbaSArIDFdLk4gPSBfdmVjMy5ub3JtYWxpemUoXHJcbiAgICAgIF92ZWMzLmNyb3NzKFxyXG4gICAgICAgIF92ZWMzLnN1YihhW2ldLlAsIGFbaSArIDFdLlApLFxyXG4gICAgICAgIF92ZWMzLnN1YihhW2kgKyAyXS5QLCBhW2kgKyAxXS5QKVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gICAgYVtpICsgMl0uTiA9IF92ZWMzLm5vcm1hbGl6ZShcclxuICAgICAgX3ZlYzMuY3Jvc3MoXHJcbiAgICAgICAgX3ZlYzMuc3ViKGFbaSArIDFdLlAsIGFbaSArIDJdLlApLFxyXG4gICAgICAgIF92ZWMzLnN1YihhW2ldLlAsIGFbaSArIDJdLlApXHJcbiAgICAgIClcclxuICAgICk7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coaSArIFwiOlwiICsgYVtpXS5OLnggKyBcIixcIiArIGFbaV0uTi55ICsgXCIsXCIgKyBhW2ldLk4ueik7XHJcbiAgfVxyXG59XHJcbiIsImxldCBrZiA9IFtdO1xyXG5cclxuY2xhc3MgSW5QdXQge1xyXG4gIGNvbnN0cnVjdG9yKE1kLCBNb3VzZUNsaWNrLCBXaGVlbCwgS2V5cykge1xyXG4gICAgdGhpcy5LZXlzID0gS2V5cztcclxuICAgIHRoaXMuTWR4ID0gTWRbMF07XHJcbiAgICB0aGlzLk1keSA9IE1kWzFdO1xyXG4gICAgdGhpcy5Nb3VzZUNsaWNrTGVmdCA9IE1vdXNlQ2xpY2tbMF07XHJcbiAgICB0aGlzLk1vdXNlQ2xpY2tSaWdodCA9IE1vdXNlQ2xpY2tbMV07XHJcbiAgICB0aGlzLk1vdXNlV2hlZWwgPSBXaGVlbDtcclxuICB9XHJcblxyXG4gIHJlc3BvbnNlKE1kLCBNQywgV2hlZWwsIEspIHtcclxuICAgIHRoaXMuS2V5cyA9IEs7XHJcbiAgICB0aGlzLk1keCA9IE1kWzBdO1xyXG4gICAgdGhpcy5NZHkgPSBNZFsxXTtcclxuICAgIHRoaXMuTW91c2VDbGlja0xlZnQgPSBNQ1swXTtcclxuICAgIHRoaXMuTW91c2VDbGlja1JpZ2h0ID0gTUNbMV07XHJcbiAgICB0aGlzLk1vdXNlV2hlZWwgPSBXaGVlbDtcclxuICB9XHJcbn0gLy8gRW5kIG9mICdJbnB1dCcgZnVuY3Rpb25cclxuXHJcbmV4cG9ydCBsZXQgbXlJbnB1dCA9IG5ldyBJblB1dChbMCwgMF0sIFswLCAwXSwga2YuZmlsbCgwLCAwLCAyNTUpKTtcclxuIiwiaW1wb3J0IHsgcHJpbSwgdmVydGV4IH0gZnJvbSBcIi4uL3JuZC9wcmltLmpzXCI7XHJcbmltcG9ydCB7IF92ZWMzIH0gZnJvbSBcIi4uL21hdGgvbWF0aHZlYzMuanNcIjtcclxuaW1wb3J0IHsgbWF0ZXJpYWwsIE1hdGxpYiB9IGZyb20gXCIuLi9ybmQvcmVzL21hdGVyaWFsLmpzXCI7XHJcbmltcG9ydCB7IF9tYXRyNCB9IGZyb20gXCIuLi9tYXRoL21hdGhtYXQ0LmpzXCI7XHJcbmltcG9ydCB7IG15SW5wdXQgfSBmcm9tIFwiLi4vaW5wdXQuanNcIjtcclxubGV0IFByX2N1YmU7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEN1YmUoKSB7XHJcbiAgbGV0IFZydHMgPSBbXTtcclxuICBWcnRzWzBdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtMSwgMSwgMSksXHJcbiAgICBfdmVjMy5zZXQoMC40NywgMC4zLCAwLjI3KSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAxKVxyXG4gICk7XHJcbiAgVnJ0c1sxXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIC0xLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDEpXHJcbiAgKTtcclxuICBWcnRzWzJdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgxLCAxLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDEpXHJcbiAgKTtcclxuICBWcnRzWzNdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgxLCAtMSwgMSksXHJcbiAgICBfdmVjMy5zZXQoMC40NywgMC4zLCAwLjI3KSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAxKVxyXG4gICk7XHJcblxyXG4gIFZydHNbNF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC0xLCAxLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KC0xLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJ0c1s1XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIC0xLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KC0xLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJ0c1s2XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIDEsIC0xKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KC0xLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJ0c1s3XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIC0xLCAtMSksXHJcbiAgICBfdmVjMy5zZXQoMC40NywgMC4zLCAwLjI3KSxcclxuICAgIF92ZWMzLnNldCgtMSwgMCwgMClcclxuICApO1xyXG5cclxuICBWcnRzWzhdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtMSwgMSwgLTEpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNDcsIDAuMywgMC4yNyksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgLTEpXHJcbiAgKTtcclxuICBWcnRzWzldID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtMSwgLTEsIC0xKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIC0xKVxyXG4gICk7XHJcbiAgVnJ0c1sxMF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDEsIDEsIC0xKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIC0xKVxyXG4gICk7XHJcbiAgVnJ0c1sxMV0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDEsIC0xLCAtMSksXHJcbiAgICBfdmVjMy5zZXQoMC40NywgMC4zLCAwLjI3KSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAtMSlcclxuICApO1xyXG5cclxuICBWcnRzWzEyXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMSwgMSwgMSksXHJcbiAgICBfdmVjMy5zZXQoMC40NywgMC4zLCAwLjI3KSxcclxuICAgIF92ZWMzLnNldCgxLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJ0c1sxM10gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDEsIC0xLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDAsIDApXHJcbiAgKTtcclxuICBWcnRzWzE0XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMSwgMSwgLTEpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNDcsIDAuMywgMC4yNyksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMClcclxuICApO1xyXG4gIFZydHNbMTVdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgxLCAtMSwgLTEpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNDcsIDAuMywgMC4yNyksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMClcclxuICApO1xyXG5cclxuICBWcnRzWzE2XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIDEsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNDcsIDAuMywgMC4yNyksXHJcbiAgICBfdmVjMy5zZXQoMCwgMSwgMClcclxuICApO1xyXG4gIFZydHNbMTddID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgxLCAxLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDEsIDApXHJcbiAgKTtcclxuICBWcnRzWzE4XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIDEsIC0xKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDEsIDApXHJcbiAgKTtcclxuICBWcnRzWzE5XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMSwgMSwgLTEpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNDcsIDAuMywgMC4yNyksXHJcbiAgICBfdmVjMy5zZXQoMCwgMSwgMClcclxuICApO1xyXG5cclxuICBWcnRzWzIwXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIC0xLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIC0xLCAwKVxyXG4gICk7XHJcbiAgVnJ0c1syMV0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDEsIC0xLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIC0xLCAwKVxyXG4gICk7XHJcbiAgVnJ0c1syMl0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC0xLCAtMSwgLTEpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNDcsIDAuMywgMC4yNyksXHJcbiAgICBfdmVjMy5zZXQoMCwgLTEsIDApXHJcbiAgKTtcclxuICBWcnRzWzIzXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMSwgLTEsIC0xKSxcclxuICAgIF92ZWMzLnNldCgwLjQ3LCAwLjMsIDAuMjcpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIC0xLCAwKVxyXG4gICk7XHJcblxyXG4gIGxldCBpbmRpY2VzID0gW1xyXG4gICAgMCwgMSwgMixcclxuXHJcbiAgICAyLCAzLCAxLFxyXG5cclxuICAgIDQsIDUsIDYsXHJcblxyXG4gICAgNSwgNiwgNyxcclxuXHJcbiAgICA4LCA5LCAxMCxcclxuXHJcbiAgICAxMCwgOSwgMTEsXHJcblxyXG4gICAgMTIsIDEzLCAxNCxcclxuXHJcbiAgICAxMywgMTQsIDE1LFxyXG5cclxuICAgIDEyLCAxMywgMTQsXHJcblxyXG4gICAgMTYsIDE3LCAxOCxcclxuXHJcbiAgICAxNywgMTgsIDE5LFxyXG5cclxuICAgIDIwLCAyMSwgMjIsXHJcblxyXG4gICAgMjEsIDIyLCAyMyxcclxuICBdO1xyXG4gIGxldCBNdGwgPSBtYXRlcmlhbC5NdGxHZXREZWYoKTtcclxuICBNdGwgPSBuZXcgbWF0ZXJpYWwoXHJcbiAgICBfdmVjMy5zZXQoKSxcclxuICAgIF92ZWMzLnNldCgwLjIzMTI1LCAwLjIzMTI1LCAwLjIzMTI1KSxcclxuICAgIF92ZWMzLnNldCgwLjI3NzUsIDAuMjc3NSwgMC4yNzc1KSxcclxuICAgIF92ZWMzLnNldCgwLjc3MzkxMSwgMC43NzM5MTEsIDAuNzczOTExKSxcclxuICAgIDkuOCxcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICk7XHJcbiAgUHJfY3ViZSA9IHByaW0uY3JlYXRlKFxyXG4gICAgVnJ0cyxcclxuICAgIFZydHMubGVuZ3RoLFxyXG4gICAgaW5kaWNlcyxcclxuICAgIGluZGljZXMubGVuZ3RoLFxyXG4gICAgbWF0ZXJpYWwuYWRkKE1hdGxpYi5PYnNpZGlhbilcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ3ViZSgpIHtcclxuICBsZXQgV29ybCA9IF9tYXRyNC5tdWxtYXRyKFxyXG4gICAgX21hdHI0LnNjYWxlKF92ZWMzLnNldCgwLjcsIDAuNywgMC43KSksXHJcbiAgICBfbWF0cjQudHJhbnNsYXRlKF92ZWMzLnNldCgwLCAwLCAwKSlcclxuICApO1xyXG5cclxuICBwcmltLmRyYXcoUHJfY3ViZSwgV29ybCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FtU2V0LCBjYW0gfSBmcm9tIFwiLi4vbWF0aC9tYXRoY2FtLmpzXCI7XHJcbmltcG9ydCB7IF92ZWMzIH0gZnJvbSBcIi4uL21hdGgvbWF0aHZlYzMuanNcIjtcclxuaW1wb3J0IHsgX21hdHI0IH0gZnJvbSBcIi4uL21hdGgvbWF0aG1hdDQuanNcIjtcclxuaW1wb3J0IHsgbXlJbnB1dCB9IGZyb20gXCIuLi9pbnB1dC5qc1wiO1xyXG5pbXBvcnQgeyBteVRpbWVyIH0gZnJvbSBcIi4uL3RpbWVyLmpzXCI7XHJcbmltcG9ydCB7IFVCTywgVWJvX2NlbGwgfSBmcm9tIFwiLi4vcm5kL3Jlcy91Ym8uanNcIjtcclxuaW1wb3J0IHsgQ2FtVUJPIH0gZnJvbSBcIi4uL3JuZC9ybmRiYXNlLmpzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdENhbSgpIHtcclxuICBDYW1TZXQoX3ZlYzMuc2V0KDE2LCAwLCAzKSwgX3ZlYzMuc2V0KDAsIDAsIDMpLCBfdmVjMy5zZXQoMCwgMSwgMCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2FtKCkge1xyXG4gIGxldCBEaXN0ID0gX3ZlYzMubGVuKF92ZWMzLnN1YihjYW0uQXQsIGNhbS5Mb2MpKTtcclxuICBsZXQgY29zVCwgc2luVCwgY29zUCwgc2luUCwgcGxlbiwgQXppbXV0aCwgRWxldmF0b3I7XHJcbiAgbGV0IFdwLCBIcCwgc3gsIHN5O1xyXG4gIGxldCBkdjtcclxuXHJcbiAgV3AgPSBIcCA9IGNhbS5Qcm9qU2l6ZTtcclxuICBjb3NUID0gKGNhbS5Mb2MueSAtIGNhbS5BdC55KSAvIERpc3Q7XHJcbiAgc2luVCA9IE1hdGguc3FydCgxIC0gY29zVCAqIGNvc1QpO1xyXG5cclxuICBwbGVuID0gRGlzdCAqIHNpblQ7XHJcbiAgY29zUCA9IChjYW0uTG9jLnogLSBjYW0uQXQueikgLyBwbGVuO1xyXG4gIHNpblAgPSAoY2FtLkxvYy54IC0gY2FtLkF0LngpIC8gcGxlbjtcclxuXHJcbiAgQXppbXV0aCA9IChNYXRoLmF0YW4yKHNpblAsIGNvc1ApIC8gTWF0aC5QSSkgKiAxODA7XHJcbiAgRWxldmF0b3IgPSAoTWF0aC5hdGFuMihzaW5ULCBjb3NUKSAvIE1hdGguUEkpICogMTgwO1xyXG5cclxuICBBemltdXRoICs9XHJcbiAgICBteVRpbWVyLmdsb2JhbERlbHRhVGltZSAqIDEuNSAqICgtNSAqIG15SW5wdXQuTW91c2VDbGlja0xlZnQgKiBteUlucHV0Lk1keCk7XHJcbiAgRWxldmF0b3IgKz1cclxuICAgIG15VGltZXIuZ2xvYmFsRGVsdGFUaW1lICogMS41ICogKC01ICogbXlJbnB1dC5Nb3VzZUNsaWNrTGVmdCAqIG15SW5wdXQuTWR5KTtcclxuXHJcbiAgaWYgKEVsZXZhdG9yIDwgMC4wOCkgRWxldmF0b3IgPSAwLjA4O1xyXG4gIGVsc2UgaWYgKEVsZXZhdG9yID4gMTc4LjkpIEVsZXZhdG9yID0gMTc4Ljk7XHJcblxyXG4gIERpc3QgKz0gbXlUaW1lci5nbG9iYWxEZWx0YVRpbWUgKiAoMiAqIG15SW5wdXQuTW91c2VXaGVlbCk7XHJcblxyXG4gIGlmIChEaXN0IDwgMC4xKSBEaXN0ID0gMC4xO1xyXG4gIGlmIChteUlucHV0Lk1vdXNlQ2xpY2tSaWdodCkge1xyXG4gICAgc3ggPSAoKChteUlucHV0Lk1keCAqIFdwKSAvIDEyMDApICogRGlzdCkgLyAtY2FtLlByb2pEaXN0O1xyXG4gICAgc3kgPSAoKChteUlucHV0Lk1keSAqIEhwKSAvIDEyMDApICogRGlzdCkgLyBjYW0uUHJvakRpc3Q7XHJcblxyXG4gICAgZHYgPSBfdmVjMy5hZGQoX3ZlYzMubXVsbnVtKGNhbS5SaWdodCwgc3gpLCBfdmVjMy5tdWxudW0oY2FtLlVwLCBzeSkpO1xyXG5cclxuICAgIGNhbS5BdCA9IF92ZWMzLmFkZChjYW0uQXQsIGR2KTtcclxuICAgIGNhbS5Mb2MgPSBfdmVjMy5hZGQoY2FtLkxvYywgZHYpO1xyXG4gIH1cclxuICBDYW1TZXQoXHJcbiAgICBfdmVjMy5wb2ludF90cmFuc2Zvcm0oXHJcbiAgICAgIF92ZWMzLnNldCgwLCBEaXN0LCAwKSxcclxuICAgICAgX21hdHI0Lm11bG1hdHIoXHJcbiAgICAgICAgX21hdHI0Lm11bG1hdHIoX21hdHI0LnJvdGF0ZVgoRWxldmF0b3IpLCBfbWF0cjQucm90YXRlWShBemltdXRoKSksXHJcbiAgICAgICAgX21hdHI0LnRyYW5zbGF0ZShjYW0uQXQpXHJcbiAgICAgIClcclxuICAgICksXHJcbiAgICBjYW0uQXQsXHJcbiAgICBfdmVjMy5zZXQoMCwgMSwgMClcclxuICApO1xyXG5cclxuICBVQk8udXBkYXRlKENhbVVCTywgVWJvX2NlbGwuTWF0clZQLCBjYW0uTWF0clZQKTtcclxuICBVQk8udXBkYXRlKENhbVVCTywgVWJvX2NlbGwuTWF0clYsIGNhbS5NYXRyVmlldyk7XHJcbiAgVUJPLnVwZGF0ZShDYW1VQk8sIFVib19jZWxsLkNhbUxvYywgY2FtLkxvYyk7XHJcbiAgVUJPLnVwZGF0ZShDYW1VQk8sIFVib19jZWxsLkNhbUF0LCBjYW0uQXQpO1xyXG4gIFVCTy51cGRhdGUoQ2FtVUJPLCBVYm9fY2VsbC5DYW1SaWdodCwgY2FtLlJpZ2h0KTtcclxuICBVQk8udXBkYXRlKENhbVVCTywgVWJvX2NlbGwuQ2FtVXAsIGNhbS5VcCk7XHJcbiAgVUJPLnVwZGF0ZShDYW1VQk8sIFVib19jZWxsLkNhbURpciwgY2FtLkRpcik7XHJcbiAgLy8gICBpZiAoQW5pLT5LZXlzW1ZLX1NISUZUXSAmJiBBbmktPktleXNDbGlja1snUCddKVxyXG4gIC8vICAgICBBbmktPklzUGF1c2UgPSAhQW5pLT5Jc1BhdXNlO1xyXG59XHJcbiIsImltcG9ydCB7IHByaW0sIHZlcnRleCB9IGZyb20gXCIuLi9ybmQvcHJpbS5qc1wiO1xyXG5pbXBvcnQgeyBfdmVjMyB9IGZyb20gXCIuLi9tYXRoL21hdGh2ZWMzLmpzXCI7XHJcbmltcG9ydCB7IG1hdGVyaWFsLCBNYXRsaWIgfSBmcm9tIFwiLi4vcm5kL3Jlcy9tYXRlcmlhbC5qc1wiO1xyXG5pbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi4vbWF0aC9tYXRobWF0NC5qc1wiO1xyXG5pbXBvcnQgeyBteVRpbWVyIH0gZnJvbSBcIi4uL3RpbWVyLmpzXCI7XHJcbmxldCBQcl9kb2Q7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdERvZCgpIHtcclxuICBsZXQgVnMgPSBbXTtcclxuICBsZXQgVnIgPSBbXTtcclxuXHJcbiAgVnJbMF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC0wLjE0OTA3MTE5ODQ5OTk4NiwgMC42MzE0NzU3MzAzMzMzMDUzLCAtMC40NTg3OTM5NzM0OTAzOTEyKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbMV0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDAuMzkwMjczNDY0NDE2NjQ1NiwgMC42MzE0NzU3MzAzMzMzMDUzLCAtMC4yODM1NTAyNjk0NTA2OCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWclsyXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTAuMTQ5MDcxMTk4NDk5OTg2LCAwLjYzMTQ3NTczMDMzMzMwNTMsIDAuNDU4NzkzOTczNDkwMzkxMiksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWclszXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMC4zOTAyNzM0NjQ0MTY2NDU2LCAwLjYzMTQ3NTczMDMzMzMwNTMsIDAuMjgzNTUwMjY5NDUwNjgpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgVnJbNF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC0wLjQ4MjQwNDUzMTgzMzMxOTQsIDAuNjMxNDc1NzMwMzMzMzA1MywgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWcls1XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMC4yNDEyMDIyNjU5MTY2NTk2NCwgLTAuMTQ5MDcxMTk4NDk5OTg1OTksIC0wLjc0MjM0NDI0Mjk0MTA3MTMpLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDAsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgVnJbNl0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDAuNjMxNDc1NzMwMzMzMzA1MywgMC4xNDkwNzExOTg0OTk5ODU5OSwgLTAuNDU4NzkzOTczNDkwMzkxMiksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWcls3XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTAuMjQxMjAyMjY1OTE2NjU5NjQsIDAuMTQ5MDcxMTk4NDk5OTg1OTksIC0wLjc0MjM0NDI0Mjk0MTA3MTMpLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDAsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgVnJbOF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC0wLjYzMTQ3NTczMDMzMzMwNTMsIC0wLjE0OTA3MTE5ODQ5OTk4NTk5LCAtMC40NTg3OTM5NzM0OTAzOTEyKSxcclxuICAgIF92ZWMzLnNldCgwLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcblxyXG4gIFZyWzldID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtMC43ODA1NDY5Mjg4MzMyOTE0LCAwLjE0OTA3MTE5ODQ5OTk4NTk5LCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcblxyXG4gIFZyWzEwXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTAuNjMxNDc1NzMwMzMzMzA1MywgLTAuMTQ5MDcxMTk4NDk5OTg1OTksIDAuNDU4NzkzOTczNDkwMzkxMiksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWclsxMV0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC0wLjI0MTIwMjI2NTkxNjY1OTY0LCAwLjE0OTA3MTE5ODQ5OTk4NTk5LCAwLjc0MjM0NDI0Mjk0MTA3MTMpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgVnJbMTJdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgwLjI0MTIwMjI2NTkxNjY1OTY0LCAtMC4xNDkwNzExOTg0OTk5ODU5OSwgMC43NDIzNDQyNDI5NDEwNzEzKSxcclxuICAgIF92ZWMzLnNldCgxLCAxLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcblxyXG4gIFZyWzEzXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMC42MzE0NzU3MzAzMzMzMDUzLCAwLjE0OTA3MTE5ODQ5OTk4NTk5LCAwLjQ1ODc5Mzk3MzQ5MDM5MTIpLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDEsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgVnJbMTRdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgwLjc4MDU0NjkyODgzMzI5MTQsIC0wLjE0OTA3MTE5ODQ5OTk4NTk5LCAwKSxcclxuICAgIF92ZWMzLnNldCgxLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcblxyXG4gIFZyWzE1XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTAuMzkwMjczNDY0NDE2NjQ1NiwgLTAuNjMxNDc1NzMwMzMzMzA1MywgLTAuMjgzNTUwMjY5NDUwNjgpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDEsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgVnJbMTZdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtMC4zOTAyNzM0NjQ0MTY2NDU2LCAtMC42MzE0NzU3MzAzMzMzMDUzLCAwLjI4MzU1MDI2OTQ1MDY4KSxcclxuICAgIF92ZWMzLnNldCgxLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcblxyXG4gIFZyWzE3XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMC4xNDkwNzExOTg0OTk5ODU5OSwgLTAuNjMxNDc1NzMwMzMzMzA1MywgMC40NTg3OTM5NzM0OTAzOTEyKSxcclxuICAgIF92ZWMzLnNldCgxLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcblxyXG4gIFZyWzE4XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMC40ODI0MDQ1MzE4MzMzMTkyNywgLTAuNjMxNDc1NzMwMzMzMzA1MywgMCksXHJcbiAgICBfdmVjMy5zZXQoMSwgMSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWclsxOV0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDAuMTQ5MDcxMTk4NDk5OTg1OTksIC0wLjYzMTQ3NTczMDMzMzMwNTMsIC0wLjQ1ODc5Mzk3MzQ5MDM5MTIpLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDEsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgbGV0IGluZGljZXMgPSBbXHJcbiAgICAwLFxyXG4gICAgMSxcclxuICAgIDIsIC8vIDBcclxuXHJcbiAgICAyLFxyXG4gICAgMSxcclxuICAgIDMsXHJcblxyXG4gICAgMixcclxuICAgIDQsXHJcbiAgICAwLFxyXG5cclxuICAgIDAsXHJcbiAgICA1LFxyXG4gICAgMSwgLy8gOVxyXG5cclxuICAgIDUsXHJcbiAgICA2LFxyXG4gICAgMSxcclxuXHJcbiAgICA1LFxyXG4gICAgMCxcclxuICAgIDcsXHJcblxyXG4gICAgMCxcclxuICAgIDQsXHJcbiAgICA4LCAvLyAxOFxyXG5cclxuICAgIDAsXHJcbiAgICA4LFxyXG4gICAgNyxcclxuXHJcbiAgICA0LFxyXG4gICAgOSxcclxuICAgIDgsXHJcblxyXG4gICAgMTAsXHJcbiAgICA0LFxyXG4gICAgMiwgLy8gMjdcclxuXHJcbiAgICAxMCxcclxuICAgIDksXHJcbiAgICA0LFxyXG5cclxuICAgIDEwLFxyXG4gICAgMixcclxuICAgIDExLFxyXG5cclxuICAgIDEyLFxyXG4gICAgMixcclxuICAgIDMsIC8vIDM2XHJcblxyXG4gICAgMTIsXHJcbiAgICAxMSxcclxuICAgIDIsXHJcblxyXG4gICAgMTIsXHJcbiAgICAzLFxyXG4gICAgMTMsXHJcblxyXG4gICAgMyxcclxuICAgIDEsXHJcbiAgICAxNCwgLy8gNDVcclxuXHJcbiAgICAzLFxyXG4gICAgMTQsXHJcbiAgICAxMyxcclxuXHJcbiAgICAxLFxyXG4gICAgNixcclxuICAgIDE0LFxyXG5cclxuICAgIDksXHJcbiAgICAxNixcclxuICAgIDE1LCAvLyA1NFxyXG5cclxuICAgIDksXHJcbiAgICAxNSxcclxuICAgIDgsXHJcblxyXG4gICAgOSxcclxuICAgIDEwLFxyXG4gICAgMTYsXHJcblxyXG4gICAgMTYsXHJcbiAgICAxMSxcclxuICAgIDE3LCAvLyA2M1xyXG5cclxuICAgIDExLFxyXG4gICAgMTYsXHJcbiAgICAxMCxcclxuXHJcbiAgICAxMSxcclxuICAgIDEyLFxyXG4gICAgMTcsXHJcblxyXG4gICAgMTgsXHJcbiAgICAxNyxcclxuICAgIDEzLCAvLyA3MlxyXG5cclxuICAgIDEzLFxyXG4gICAgMTQsXHJcbiAgICAxOCxcclxuXHJcbiAgICAxMyxcclxuICAgIDE3LFxyXG4gICAgMTIsXHJcblxyXG4gICAgMTgsXHJcbiAgICA2LFxyXG4gICAgMTksIC8vIDgxXHJcblxyXG4gICAgNixcclxuICAgIDE4LFxyXG4gICAgMTQsXHJcblxyXG4gICAgNixcclxuICAgIDUsXHJcbiAgICAxOSxcclxuXHJcbiAgICAxNSxcclxuICAgIDE5LFxyXG4gICAgNywgLy8gOTBcclxuXHJcbiAgICA3LFxyXG4gICAgOCxcclxuICAgIDE1LFxyXG5cclxuICAgIDcsXHJcbiAgICAxOSxcclxuICAgIDUsXHJcblxyXG4gICAgMTksXHJcbiAgICAxNSxcclxuICAgIDE3LCAvLyA5OVxyXG5cclxuICAgIDE2LFxyXG4gICAgMTcsXHJcbiAgICAxNSxcclxuXHJcbiAgICAxOSxcclxuICAgIDE3LFxyXG4gICAgMTgsXHJcbiAgXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIFZzW2ldID0gdmVydGV4LmNyZWF0ZShWcltpbmRpY2VzW2ldXSk7XHJcbiAgfVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgaW5kaWNlc1tpXSA9IGk7XHJcbiAgfVxyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGljZXMubGVuZ3RoIC8gMzsgaSsrKSB7XHJcbiAgICBwcmltLmNyZWF0ZV9ub3JtYWwoVnMsIGkgKiAzKTtcclxuICB9XHJcblxyXG4gIGxldCBNdGwgPSBtYXRlcmlhbC5NdGxHZXREZWYoKTtcclxuICBNdGwgPSBuZXcgbWF0ZXJpYWwoXHJcbiAgICBfdmVjMy5zZXQoKSxcclxuICAgIF92ZWMzLnNldCgwLjIzMTI1LCAwLjIzMTI1LCAwLjIzMTI1KSxcclxuICAgIF92ZWMzLnNldCgwLjI3NzUsIDAuMjc3NSwgMC4yNzc1KSxcclxuICAgIF92ZWMzLnNldCgwLjc3MzkxMSwgMC43NzM5MTEsIDAuNzczOTExKSxcclxuICAgIDk2LjgsXHJcbiAgICAxLFxyXG4gICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMV1cclxuICApO1xyXG4gIFByX2RvZCA9IHByaW0uY3JlYXRlKFxyXG4gICAgVnMsXHJcbiAgICBWcy5sZW5ndGgsXHJcbiAgICBpbmRpY2VzLFxyXG4gICAgaW5kaWNlcy5sZW5ndGgsXHJcbiAgICBtYXRlcmlhbC5hZGQoTWF0bGliLkdvbGQpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckRvZCgpIHtcclxuICBsZXQgV29ybCA9IF9tYXRyNC5tdWxtYXRyKFxyXG4gICAgX21hdHI0Lm11bG1hdHIoXHJcbiAgICAgIF9tYXRyNC5tdWxtYXRyKFxyXG4gICAgICAgIF9tYXRyNC5yb3RhdGVZKDQ3ICogbXlUaW1lci5sb2NhbFRpbWUgKiAwKSxcclxuICAgICAgICBfbWF0cjQuc2NhbGUoX3ZlYzMuc2V0KDEuNSwgMS41LCAxLjUpKVxyXG4gICAgICApLFxyXG4gICAgICBfbWF0cjQucm90YXRlWSg4MCAqIG15VGltZXIubG9jYWxUaW1lICogMClcclxuICAgICksXHJcbiAgICBfbWF0cjQudHJhbnNsYXRlKF92ZWMzLnNldCgwLCAwLCA5KSlcclxuICApO1xyXG4gIHByaW0uZHJhdyhQcl9kb2QsIFdvcmwpO1xyXG59XHJcbiIsImltcG9ydCB7IHByaW0sIHZlcnRleCB9IGZyb20gXCIuLi9ybmQvcHJpbS5qc1wiO1xyXG5pbXBvcnQgeyBfdmVjMyB9IGZyb20gXCIuLi9tYXRoL21hdGh2ZWMzLmpzXCI7XHJcbmltcG9ydCB7IG1hdGVyaWFsLCBNYXRsaWIgfSBmcm9tIFwiLi4vcm5kL3Jlcy9tYXRlcmlhbC5qc1wiO1xyXG5pbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi4vbWF0aC9tYXRobWF0NC5qc1wiO1xyXG5pbXBvcnQgeyBteVRpbWVyIH0gZnJvbSBcIi4uL3RpbWVyLmpzXCI7XHJcbmxldCBQcl9oZXg7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdEhleCgpIHtcclxuICBsZXQgVnMgPSBbXTtcclxuICBsZXQgVnIgPSBbXTtcclxuXHJcbiAgVnJbMF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDEsIDAsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDEsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWclsxXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLTEsIDAsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDEsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWclsyXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMCwgMSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWclszXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMCwgLTEsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDEsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWcls0XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzVdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgwLCAwLCAtMSksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBsZXQgaW5kaWNlcyA9IFtcclxuICAgIDEsIDMsIDUsXHJcblxyXG4gICAgMCwgNSwgMyxcclxuXHJcbiAgICAxLCA0LCAzLFxyXG5cclxuICAgIDAsIDMsIDQsXHJcblxyXG4gICAgMSwgNSwgMixcclxuXHJcbiAgICAwLCAyLCA1LFxyXG5cclxuICAgIDEsIDIsIDQsXHJcblxyXG4gICAgMCwgNCwgMixcclxuICBdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG4gICAgVnNbaV0gPSB2ZXJ0ZXguY3JlYXRlKFZyW2luZGljZXNbaV1dKTtcclxuICB9XHJcblxyXG4gIGluZGljZXMgPSBbXHJcbiAgICAwLCAxLCAyLFxyXG5cclxuICAgIDMsIDQsIDUsXHJcblxyXG4gICAgNiwgNywgOCxcclxuXHJcbiAgICA5LCAxMCwgMTEsXHJcblxyXG4gICAgMTIsIDEzLCAxNCxcclxuXHJcbiAgICAxNSwgMTYsIDE3LFxyXG5cclxuICAgIDE4LCAxOSwgMjAsXHJcblxyXG4gICAgMjEsIDIyLCAyMyxcclxuICBdO1xyXG5cclxuICBwcmltLmNyZWF0ZV9ub3JtYWwoVnMsIDApO1xyXG4gIHByaW0uY3JlYXRlX25vcm1hbChWcywgMyk7XHJcbiAgcHJpbS5jcmVhdGVfbm9ybWFsKFZzLCA2KTtcclxuICBwcmltLmNyZWF0ZV9ub3JtYWwoVnMsIDkpO1xyXG4gIHByaW0uY3JlYXRlX25vcm1hbChWcywgMTIpO1xyXG4gIHByaW0uY3JlYXRlX25vcm1hbChWcywgMTUpO1xyXG4gIHByaW0uY3JlYXRlX25vcm1hbChWcywgMTgpO1xyXG4gIHByaW0uY3JlYXRlX25vcm1hbChWcywgMjEpO1xyXG5cclxuICBsZXQgTXRsID0gbWF0ZXJpYWwuTXRsR2V0RGVmKCk7XHJcbiAgTXRsID0gbmV3IG1hdGVyaWFsKFxyXG4gICAgX3ZlYzMuc2V0KCksXHJcbiAgICBfdmVjMy5zZXQoMC4yMzEyNSwgMC4yMzEyNSwgMC4yMzEyNSksXHJcbiAgICBfdmVjMy5zZXQoMC4yNzc1LCAwLjI3NzUsIDAuMjc3NSksXHJcbiAgICBfdmVjMy5zZXQoMC43NzM5MTEsIDAuNzczOTExLCAwLjc3MzkxMSksXHJcbiAgICA5LjgsXHJcbiAgICAxLFxyXG4gICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMV1cclxuICApO1xyXG4gIFByX2hleCA9IHByaW0uY3JlYXRlKFxyXG4gICAgVnMsXHJcbiAgICBWcy5sZW5ndGgsXHJcbiAgICBpbmRpY2VzLFxyXG4gICAgaW5kaWNlcy5sZW5ndGgsXHJcbiAgICBtYXRlcmlhbC5hZGQoTWF0bGliLlBlYXJsKVxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJIZXgoKSB7XHJcbiAgbGV0IFdvcmwgPSBfbWF0cjQubXVsbWF0cihcclxuICAgIF9tYXRyNC5tdWxtYXRyKFxyXG4gICAgICBfbWF0cjQubXVsbWF0cihcclxuICAgICAgICBfbWF0cjQucm90YXRlWSg0NyAqIG15VGltZXIubG9jYWxUaW1lICogMCksXHJcbiAgICAgICAgX21hdHI0LnJvdGF0ZVooNDcgKiBteVRpbWVyLmxvY2FsVGltZSAqIDAgKyA0NSAqIDApXHJcbiAgICAgICksXHJcbiAgICAgIF9tYXRyNC5yb3RhdGVZKDgwICogbXlUaW1lci5sb2NhbFRpbWUgKiAwKVxyXG4gICAgKSxcclxuICAgIF9tYXRyNC50cmFuc2xhdGUoX3ZlYzMuc2V0KDAsIDAsIDMpKVxyXG4gICk7XHJcblxyXG4gIHByaW0uZHJhdyhQcl9oZXgsIFdvcmwpO1xyXG59XHJcbiIsImltcG9ydCB7IHByaW0sIHZlcnRleCB9IGZyb20gXCIuLi9ybmQvcHJpbS5qc1wiO1xyXG5pbXBvcnQgeyBfdmVjMyB9IGZyb20gXCIuLi9tYXRoL21hdGh2ZWMzLmpzXCI7XHJcbmltcG9ydCB7IG1hdGVyaWFsLCBNYXRsaWIgfSBmcm9tIFwiLi4vcm5kL3Jlcy9tYXRlcmlhbC5qc1wiO1xyXG5pbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi4vbWF0aC9tYXRobWF0NC5qc1wiO1xyXG5pbXBvcnQgeyBteVRpbWVyIH0gZnJvbSBcIi4uL3RpbWVyLmpzXCI7XHJcblxyXG5sZXQgUHJfaXNvO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluaXRJc28oKSB7XHJcbiAgbGV0IFZzID0gW107XHJcbiAgbGV0IFZyID0gW107XHJcblxyXG4gIFZyWzBdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgwLCAtMSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMSwgMSwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzFdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgwLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbMl0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC0yIC8gTWF0aC5zcXJ0KDUpLCAtMSAvIE1hdGguc3FydCg1KSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWclszXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMiAvIE1hdGguc3FydCg1KSwgMSAvIE1hdGguc3FydCg1KSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMSwgMSwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG5cclxuICBWcls0XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoXHJcbiAgICAgIDAuNSArIDAuNSAvIE1hdGguc3FydCg1KSxcclxuICAgICAgLTEgLyBNYXRoLnNxcnQoNSksXHJcbiAgICAgIC1NYXRoLnNxcnQoMC4xICogKDUgLSBNYXRoLnNxcnQoNSkpKVxyXG4gICAgKSxcclxuICAgIF92ZWMzLnNldCgwLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbNV0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KFxyXG4gICAgICAwLjUgKyAwLjUgLyBNYXRoLnNxcnQoNSksXHJcbiAgICAgIC0xIC8gTWF0aC5zcXJ0KDUpLFxyXG4gICAgICBNYXRoLnNxcnQoMC4xICogKDUgLSBNYXRoLnNxcnQoNSkpKVxyXG4gICAgKSxcclxuICAgIF92ZWMzLnNldCgxLCAwLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbNl0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KFxyXG4gICAgICAtMC4xICogKDUgKyBNYXRoLnNxcnQoNSkpLFxyXG4gICAgICAxIC8gTWF0aC5zcXJ0KDUpLFxyXG4gICAgICAtTWF0aC5zcXJ0KDAuMSAqICg1IC0gTWF0aC5zcXJ0KDUpKSlcclxuICAgICksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzddID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldChcclxuICAgICAgLTAuMSAqICg1ICsgTWF0aC5zcXJ0KDUpKSxcclxuICAgICAgMSAvIE1hdGguc3FydCg1KSxcclxuICAgICAgTWF0aC5zcXJ0KDAuMSAqICg1IC0gTWF0aC5zcXJ0KDUpKSlcclxuICAgICksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzhdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldChcclxuICAgICAgMC4xICogTWF0aC5zcXJ0KDUpIC0gMC41LFxyXG4gICAgICAtMSAvIE1hdGguc3FydCg1KSxcclxuICAgICAgLU1hdGguc3FydCgwLjEgKiAoNSArIE1hdGguc3FydCg1KSkpXHJcbiAgICApLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDAsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWcls5XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoXHJcbiAgICAgIDAuMSAqIE1hdGguc3FydCg1KSAtIDAuNSxcclxuICAgICAgLTEgLyBNYXRoLnNxcnQoNSksXHJcbiAgICAgIE1hdGguc3FydCgwLjEgKiAoNSArIE1hdGguc3FydCg1KSkpXHJcbiAgICApLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDAsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWclsxMF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KFxyXG4gICAgICAwLjUgLSAwLjEgKiBNYXRoLnNxcnQoNSksXHJcbiAgICAgIDEgLyBNYXRoLnNxcnQoNSksXHJcbiAgICAgIC1NYXRoLnNxcnQoMC4xICogKDUgKyBNYXRoLnNxcnQoNSkpKVxyXG4gICAgKSxcclxuICAgIF92ZWMzLnNldCgxLCAwLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbMTFdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldChcclxuICAgICAgMC41IC0gMC4xICogTWF0aC5zcXJ0KDUpLFxyXG4gICAgICAxIC8gTWF0aC5zcXJ0KDUpLFxyXG4gICAgICBNYXRoLnNxcnQoMC4xICogKDUgKyBNYXRoLnNxcnQoNSkpKVxyXG4gICAgKSxcclxuICAgIF92ZWMzLnNldCgxLCAwLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcblxyXG4gIGxldCBpbmRpY2VzID0gW1xyXG4gICAgMSwgNiwgMTAsXHJcblxyXG4gICAgMSwgMTAsIDMsXHJcblxyXG4gICAgMSwgMTEsIDcsXHJcblxyXG4gICAgMSwgMywgMTEsXHJcblxyXG4gICAgMSwgNywgNixcclxuXHJcbiAgICA2LCA3LCAyLFxyXG5cclxuICAgIDExLCA5LCA3LFxyXG5cclxuICAgIDExLCAzLCA1LFxyXG5cclxuICAgIDEwLCA0LCAzLFxyXG5cclxuICAgIDEwLCA2LCA4LFxyXG5cclxuICAgIDQsIDUsIDMsXHJcblxyXG4gICAgMTEsIDUsIDksXHJcblxyXG4gICAgNCwgMTAsIDgsXHJcblxyXG4gICAgMiwgNywgOSxcclxuXHJcbiAgICA2LCAyLCA4LFxyXG5cclxuICAgIDAsIDgsIDIsXHJcblxyXG4gICAgMiwgOSwgMCxcclxuXHJcbiAgICA5LCA1LCAwLFxyXG5cclxuICAgIDQsIDAsIDUsXHJcblxyXG4gICAgNCwgOCwgMCxcclxuICBdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgVnNbaV0gPSB2ZXJ0ZXguY3JlYXRlKFZyW2luZGljZXNbaV1dKTtcclxuICB9XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpbmRpY2VzW2ldID0gaTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGggLyAzOyBpKyspIHtcclxuICAgIHByaW0uY3JlYXRlX25vcm1hbChWcywgaSAqIDMpO1xyXG4gIH1cclxuXHJcbiAgbGV0IE10bCA9IG1hdGVyaWFsLk10bEdldERlZigpO1xyXG4gIE10bCA9IG5ldyBtYXRlcmlhbChcclxuICAgIF92ZWMzLnNldCgpLFxyXG4gICAgX3ZlYzMuc2V0KDAuMjMxMjUsIDAuMjMxMjUsIDAuMjMxMjUpLFxyXG4gICAgX3ZlYzMuc2V0KDAuMjc3NSwgMC4yNzc1LCAwLjI3NzUpLFxyXG4gICAgX3ZlYzMuc2V0KDAuNzczOTExLCAwLjc3MzkxMSwgMC43NzM5MTEpLFxyXG4gICAgOTYuOCxcclxuICAgIDEsXHJcbiAgICBbLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xXVxyXG4gICk7XHJcbiAgUHJfaXNvID0gcHJpbS5jcmVhdGUoXHJcbiAgICBWcyxcclxuICAgIFZzLmxlbmd0aCxcclxuICAgIGluZGljZXMsXHJcbiAgICBpbmRpY2VzLmxlbmd0aCxcclxuICAgIG1hdGVyaWFsLmFkZChNYXRsaWIuUGV3ZXRlcilcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVySXNvKCkge1xyXG4gIGxldCBXb3JsID0gX21hdHI0Lm11bG1hdHIoXHJcbiAgICBfbWF0cjQubXVsbWF0cihcclxuICAgICAgX21hdHI0Lm11bG1hdHIoXHJcbiAgICAgICAgX21hdHI0LnJvdGF0ZVkoNDcgKiBteVRpbWVyLmxvY2FsVGltZSAqIDApLFxyXG4gICAgICAgIF9tYXRyNC5yb3RhdGVaKDQ3ICogbXlUaW1lci5sb2NhbFRpbWUgKiAwICsgNDUgKiAwKVxyXG4gICAgICApLFxyXG4gICAgICBfbWF0cjQucm90YXRlWSg4MCAqIG15VGltZXIubG9jYWxUaW1lICogMClcclxuICAgICksXHJcbiAgICBfbWF0cjQudHJhbnNsYXRlKF92ZWMzLnNldCgwLCAwLCA2KSlcclxuICApO1xyXG5cclxuICBwcmltLmRyYXcoUHJfaXNvLCBXb3JsKTtcclxufVxyXG4iLCJpbXBvcnQgeyBwcmltLCB2ZXJ0ZXggfSBmcm9tIFwiLi4vcm5kL3ByaW0uanNcIjtcclxuaW1wb3J0IHsgX3ZlYzMgfSBmcm9tIFwiLi4vbWF0aC9tYXRodmVjMy5qc1wiO1xyXG5pbXBvcnQgeyBtYXRlcmlhbCwgTWF0bGliIH0gZnJvbSBcIi4uL3JuZC9yZXMvbWF0ZXJpYWwuanNcIjtcclxuaW1wb3J0IHsgX21hdHI0IH0gZnJvbSBcIi4uL21hdGgvbWF0aG1hdDQuanNcIjtcclxuaW1wb3J0IHsgbXlUaW1lciB9IGZyb20gXCIuLi90aW1lci5qc1wiO1xyXG5cclxubGV0IFByX3RldHJhaWRlcjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0VGV0cigpIHtcclxuICBsZXQgVnIgPSBbXTtcclxuXHJcbiAgVnJbMF0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KDAsIDEsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDEsIDEsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWclsxXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLU1hdGguc3FydCgyKSAvIDMsIC0xIC8gMywgLU1hdGguc3FydCg2KSAvIDMpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDEsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWclsyXSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoLU1hdGguc3FydCgyKSAvIDMsIC0xIC8gMywgTWF0aC5zcXJ0KDYpIC8gMyksXHJcbiAgICBfdmVjMy5zZXQoMSwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzNdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgoMiAqIE1hdGguc3FydCgyKSkgLyAzLCAtMSAvIDMsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuICBWcls0XSA9IG5ldyB2ZXJ0ZXgoXHJcbiAgICBfdmVjMy5zZXQoMCwgMSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMSwgMSwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzVdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtTWF0aC5zcXJ0KDIpIC8gMywgLTEgLyAzLCAtTWF0aC5zcXJ0KDYpIC8gMyksXHJcbiAgICBfdmVjMy5zZXQoMCwgMSwgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzZdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtTWF0aC5zcXJ0KDIpIC8gMywgLTEgLyAzLCBNYXRoLnNxcnQoNikgLyAzKSxcclxuICAgIF92ZWMzLnNldCgxLCAwLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbN10gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KCgyICogTWF0aC5zcXJ0KDIpKSAvIDMsIC0xIC8gMywgMCksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMSksXHJcbiAgICBfdmVjMy5zZXQoMCwgMCwgMClcclxuICApO1xyXG4gIFZyWzhdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgwLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgxLCAxLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbOV0gPSBuZXcgdmVydGV4KFxyXG4gICAgX3ZlYzMuc2V0KC1NYXRoLnNxcnQoMikgLyAzLCAtMSAvIDMsIC1NYXRoLnNxcnQoNikgLyAzKSxcclxuICAgIF92ZWMzLnNldCgwLCAxLCAwKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbMTBdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgtTWF0aC5zcXJ0KDIpIC8gMywgLTEgLyAzLCBNYXRoLnNxcnQoNikgLyAzKSxcclxuICAgIF92ZWMzLnNldCgxLCAwLCAxKSxcclxuICAgIF92ZWMzLnNldCgwLCAwLCAwKVxyXG4gICk7XHJcbiAgVnJbMTFdID0gbmV3IHZlcnRleChcclxuICAgIF92ZWMzLnNldCgoMiAqIE1hdGguc3FydCgyKSkgLyAzLCAtMSAvIDMsIDApLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDEpLFxyXG4gICAgX3ZlYzMuc2V0KDAsIDAsIDApXHJcbiAgKTtcclxuXHJcbiAgVnJbMF0uTiA9IF92ZWMzLm5vcm1hbGl6ZShcclxuICAgIF92ZWMzLmNyb3NzKF92ZWMzLnN1YihWclsxXS5QLCBWclswXS5QKSwgX3ZlYzMuc3ViKFZyWzJdLlAsIFZyWzBdLlApKVxyXG4gICk7XHJcbiAgVnJbMV0uTiA9IF92ZWMzLm5vcm1hbGl6ZShcclxuICAgIF92ZWMzLmNyb3NzKF92ZWMzLnN1YihWclsyXS5QLCBWclsxXS5QKSwgX3ZlYzMuc3ViKFZyWzBdLlAsIFZyWzFdLlApKVxyXG4gICk7XHJcbiAgVnJbMl0uTiA9IF92ZWMzLm5vcm1hbGl6ZShcclxuICAgIF92ZWMzLmNyb3NzKF92ZWMzLnN1YihWclswXS5QLCBWclsyXS5QKSwgX3ZlYzMuc3ViKFZyWzFdLlAsIFZyWzJdLlApKVxyXG4gICk7XHJcblxyXG4gIFZyWzNdLk4gPSBfdmVjMy5ub3JtYWxpemUoXHJcbiAgICBfdmVjMy5jcm9zcyhfdmVjMy5zdWIoVnJbNV0uUCwgVnJbM10uUCksIF92ZWMzLnN1YihWcls0XS5QLCBWclszXS5QKSlcclxuICApO1xyXG4gIFZyWzRdLk4gPSBfdmVjMy5ub3JtYWxpemUoXHJcbiAgICBfdmVjMy5jcm9zcyhfdmVjMy5zdWIoVnJbM10uUCwgVnJbNF0uUCksIF92ZWMzLnN1YihWcls1XS5QLCBWcls0XS5QKSlcclxuICApO1xyXG4gIFZyWzVdLk4gPSBfdmVjMy5ub3JtYWxpemUoXHJcbiAgICBfdmVjMy5jcm9zcyhfdmVjMy5zdWIoVnJbNF0uUCwgVnJbNV0uUCksIF92ZWMzLnN1YihWclszXS5QLCBWcls1XS5QKSlcclxuICApO1xyXG5cclxuICBWcls2XS5OID0gX3ZlYzMubm9ybWFsaXplKFxyXG4gICAgX3ZlYzMuY3Jvc3MoX3ZlYzMuc3ViKFZyWzddLlAsIFZyWzZdLlApLCBfdmVjMy5zdWIoVnJbOF0uUCwgVnJbNl0uUCkpXHJcbiAgKTtcclxuICBWcls3XS5OID0gX3ZlYzMubm9ybWFsaXplKFxyXG4gICAgX3ZlYzMuY3Jvc3MoX3ZlYzMuc3ViKFZyWzhdLlAsIFZyWzddLlApLCBfdmVjMy5zdWIoVnJbNl0uUCwgVnJbN10uUCkpXHJcbiAgKTtcclxuICBWcls4XS5OID0gX3ZlYzMubm9ybWFsaXplKFxyXG4gICAgX3ZlYzMuY3Jvc3MoX3ZlYzMuc3ViKFZyWzZdLlAsIFZyWzhdLlApLCBfdmVjMy5zdWIoVnJbN10uUCwgVnJbOF0uUCkpXHJcbiAgKTtcclxuXHJcbiAgVnJbOV0uTiA9IF92ZWMzLm5vcm1hbGl6ZShcclxuICAgIF92ZWMzLmNyb3NzKF92ZWMzLnN1YihWclsxMV0uUCwgVnJbOV0uUCksIF92ZWMzLnN1YihWclsxMF0uUCwgVnJbOV0uUCkpXHJcbiAgKTtcclxuICBWclsxMF0uTiA9IF92ZWMzLm5vcm1hbGl6ZShcclxuICAgIF92ZWMzLmNyb3NzKF92ZWMzLnN1YihWcls5XS5QLCBWclsxMF0uUCksIF92ZWMzLnN1YihWclsxMV0uUCwgVnJbMTBdLlApKVxyXG4gICk7XHJcbiAgVnJbMTFdLk4gPSBfdmVjMy5ub3JtYWxpemUoXHJcbiAgICBfdmVjMy5jcm9zcyhfdmVjMy5zdWIoVnJbMTBdLlAsIFZyWzExXS5QKSwgX3ZlYzMuc3ViKFZyWzldLlAsIFZyWzExXS5QKSlcclxuICApO1xyXG5cclxuICBsZXQgaW5kaWNlcyA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTFdO1xyXG5cclxuICBsZXQgTXRsID0gbWF0ZXJpYWwuTXRsR2V0RGVmKCk7XHJcbiAgTXRsID0gbmV3IG1hdGVyaWFsKFxyXG4gICAgX3ZlYzMuc2V0KCksXHJcbiAgICBfdmVjMy5zZXQoMC4yMzEyNSwgMC4yMzEyNSwgMC4yMzEyNSksXHJcbiAgICBfdmVjMy5zZXQoMC4yNzc1LCAwLjI3NzUsIDAuMjc3NSksXHJcbiAgICBfdmVjMy5zZXQoMC43NzM5MTEsIDAuNzczOTExLCAwLjc3MzkxMSksXHJcbiAgICA5LjgsXHJcbiAgICAxLFxyXG4gICAgWy0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMV1cclxuICApO1xyXG4gIFByX3RldHJhaWRlciA9IHByaW0uY3JlYXRlKFxyXG4gICAgVnIsXHJcbiAgICBWci5sZW5ndGgsXHJcbiAgICBpbmRpY2VzLFxyXG4gICAgaW5kaWNlcy5sZW5ndGgsXHJcbiAgICBtYXRlcmlhbC5hZGQoTWF0bGliLkVtZXJhbGQpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclRldHIoKSB7XHJcbiAgbGV0IFdvcmwgPSBfbWF0cjQubXVsbWF0cihcclxuICAgIF9tYXRyNC5tdWxtYXRyKFxyXG4gICAgICBfbWF0cjQubXVsbWF0cihcclxuICAgICAgICBfbWF0cjQucm90YXRlWSg0NyAqIG15VGltZXIubG9jYWxUaW1lICogMCksXHJcbiAgICAgICAgX21hdHI0LnJvdGF0ZVooNDcgKiBteVRpbWVyLmxvY2FsVGltZSAqIDAgKyA0NSAqIDApXHJcbiAgICAgICksXHJcbiAgICAgIF9tYXRyNC5yb3RhdGVZKDgwICogbXlUaW1lci5sb2NhbFRpbWUgKiAwKVxyXG4gICAgKSxcclxuICAgIF9tYXRyNC50cmFuc2xhdGUoX3ZlYzMuc2V0KDAsIDAsIC0zKSlcclxuICApO1xyXG5cclxuICBwcmltLmRyYXcoUHJfdGV0cmFpZGVyLCBXb3JsKTtcclxufVxyXG4iLCJpbXBvcnQgeyBDYW1TZXQsIGNhbSB9IGZyb20gXCIuLi9tYXRoL21hdGhjYW0uanNcIjtcclxuaW1wb3J0IHsgZ2wgfSBmcm9tIFwiLi9ybmRkYXRhLmpzXCI7XHJcbmltcG9ydCB7IF92ZWMzIH0gZnJvbSBcIi4uL21hdGgvbWF0aHZlYzMuanNcIjtcclxuaW1wb3J0IHsgX21hdHI0IH0gZnJvbSBcIi4uL21hdGgvbWF0aG1hdDQuanNcIjtcclxuaW1wb3J0IHsgVUJPLCBVYm9fTWF0ciB9IGZyb20gXCIuL3Jlcy91Ym8uanNcIjtcclxuaW1wb3J0IHsgbXlUaW1lciB9IGZyb20gXCIuLi90aW1lci5qc1wiO1xyXG5pbXBvcnQgeyBzaGFkZXJJbml0IH0gZnJvbSBcIi4vcmVzL3NoYWRlci5qc1wiO1xyXG5pbXBvcnQgeyBpbml0Q3ViZSwgcmVuZGVyQ3ViZSB9IGZyb20gXCIuLi91bml0cy91X2N1YmUuanNcIjtcclxuaW1wb3J0IHsgaW5pdENhbSwgcmVuZGVyQ2FtIH0gZnJvbSBcIi4uL3VuaXRzL3VfY29udHJvbC5qc1wiO1xyXG5pbXBvcnQgeyBpbml0RG9kLCByZW5kZXJEb2QgfSBmcm9tIFwiLi4vdW5pdHMvdV9kb2RlY2FoZWRyb24uanNcIjtcclxuaW1wb3J0IHsgaW5pdEhleCwgcmVuZGVySGV4IH0gZnJvbSBcIi4uL3VuaXRzL3VfaGV4YWhlZHJvbi5qc1wiO1xyXG5pbXBvcnQgeyBpbml0SXNvLCByZW5kZXJJc28gfSBmcm9tIFwiLi4vdW5pdHMvdV9pc29jYWhlZHJvbi5qc1wiO1xyXG5pbXBvcnQgeyBpbml0VGV0ciwgcmVuZGVyVGV0ciB9IGZyb20gXCIuLi91bml0cy91X3RldHJhaWRlci5qc1wiO1xyXG5leHBvcnQgbGV0IENhbVVCTztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBybmRJbml0KHZzLCBmcykge1xyXG4gIGdsLmNsZWFyQ29sb3IoMC4yOCwgMC40NywgMC44LCAxKTtcclxuXHJcbiAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xyXG4gIGdsLmNsZWFyKGdsLkRFUFRIX0JVRkZFUl9CSVQgfCBnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuXHJcbiAgaW5pdENhbSgpO1xyXG4gIC8vQ2FtU2V0KF92ZWMzLnNldCgwLCAwLCAxMCksIF92ZWMzLnNldCgwLCAwLCAwKSwgX3ZlYzMuc2V0KDAsIDEsIDApKTtcclxuICBsZXQgV29ybGQgPSBfbWF0cjQuaWRlbnRpdHkoKTtcclxuICBsZXQgdyA9IF9tYXRyNC5tdWxtYXRyKF9tYXRyNC5pZGVudGl0eSgpLCBXb3JsZCk7XHJcbiAgbGV0IHdpbnYgPSBfbWF0cjQudHJhbnNwb3NlKF9tYXRyNC5pbnZlcnNlKHcpKTtcclxuICBsZXQgV1ZQID0gX21hdHI0Lm11bG1hdHIodywgY2FtLk1hdHJWUCk7XHJcblxyXG4gIGxldCBVID0gbmV3IFVib19NYXRyKFxyXG4gICAgV1ZQLFxyXG4gICAgdyxcclxuICAgIHdpbnYsXHJcbiAgICBjYW0uTWF0clZQLFxyXG4gICAgY2FtLk1hdHJWaWV3LFxyXG4gICAgY2FtLkxvYyxcclxuICAgIGNhbS5BdCxcclxuICAgIGNhbS5SaWdodCxcclxuICAgIGNhbS5VcCxcclxuICAgIGNhbS5EaXIsXHJcbiAgICBfdmVjMy5zZXQoY2FtLlByb2pEaXN0LCBjYW0uUHJvakZhckNsaXAsIG15VGltZXIubG9jYWxUaW1lKSxcclxuICAgIF92ZWMzLnNldChcclxuICAgICAgbXlUaW1lci5nbG9iYWxUaW1lLFxyXG4gICAgICBteVRpbWVyLmdsb2JhbERlbHRhVGltZSxcclxuICAgICAgbXlUaW1lci5sb2NhbERlbHRhVGltZVxyXG4gICAgKSxcclxuICAgIF92ZWMzLnNldChjYW0uUHJvalNpemUsIDEsIDEpXHJcbiAgKTtcclxuXHJcbiAgQ2FtVUJPID0gVUJPLmFkZChVLCBcIkJhc2VEYXRhXCIpO1xyXG5cclxuICBzaGFkZXJJbml0KHZzLCBmcyk7XHJcblxyXG4gIGluaXRUZXRyKCk7XHJcbiAgaW5pdEN1YmUoKTtcclxuICBpbml0SGV4KCk7XHJcbiAgaW5pdElzbygpO1xyXG4gIC8vIGluaXRUcnVUZXRyKCk7XHJcbiAgLy8gaW5pdEN1Yk9jdCgpO1xyXG4gIC8vIGluaXRUcnVDdWIoKTtcclxuICAvLyBpbml0VHJ1T2N0KCk7XHJcbiAgaW5pdERvZCgpO1xyXG4gIC8vIGluaXRSaG9tKCk7XHJcbiAgLy9pbml0VHJ1Q3ViT2N0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgZ2wuY2xlYXJDb2xvcigwLjI4LCAwLjQ3LCAwLjgsIDEpO1xyXG4gIGdsLmNsZWFyKGdsLkRFUFRIX0JVRkZFUl9CSVQgfCBnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuXHJcbiAgcmVuZGVyQ2FtKCk7XHJcbiAgcmVuZGVyVGV0cigpO1xyXG4gIHJlbmRlckhleCgpO1xyXG4gIHJlbmRlckN1YmUoKTtcclxuICByZW5kZXJJc28oKTtcclxuICByZW5kZXJEb2QoKTtcclxuICAvLyByZW5kZXJUcnVUZXRyKCk7XHJcbiAgLy8gcmVuZGVyQ3ViT2N0KCk7XHJcbiAgLy8gcmVuZGVyVHJ1Q3ViKCk7XHJcbiAgLy8gcmVuZGVyVHJ1T2N0KCk7XHJcbiAgLy8gcmVuZGVyUmhvbSgpO1xyXG4gIC8vcmVuZGVyVHJ1Q3ViT2N0KCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgcm5kSW5pdCwgcmVuZGVyIH0gZnJvbSBcIi4vcm5kL3JuZGJhc2UuanNcIjtcclxuaW1wb3J0IHsgbXlUaW1lciB9IGZyb20gXCIuL3RpbWVyLmpzXCI7XHJcbmltcG9ydCB7IG15SW5wdXQgfSBmcm9tIFwiLi9pbnB1dC5qc1wiO1xyXG5cclxuXHJcbmxldCBuYW1lcyA9IFtcIi4uL2Jpbi9mcmFnLmdsc2xcIiwgXCIuLi9iaW4vdmVydC5nbHNsXCJdO1xyXG5sZXQgTWQgPSBbMCwgMF0sXHJcbiAgTW91c2VDbGljayA9IFswLCAwXSxcclxuICBXaGVlbCA9IDAsXHJcbiAgS2V5cyA9IFtdO1xyXG5LZXlzLmZpbGwoMCwgMCwgMjU1KTtcclxuXHJcblByb21pc2UuYWxsKG5hbWVzLm1hcCgodSkgPT4gZmV0Y2godSkpKVxyXG4gIC50aGVuKChyZXNwb25zZXMpID0+IFByb21pc2UuYWxsKHJlc3BvbnNlcy5tYXAoKHJlcykgPT4gcmVzLnRleHQoKSkpKVxyXG4gIC50aGVuKCh0ZXh0cykgPT4ge1xyXG4gICAgcm5kSW5pdCh0ZXh0c1sxXSwgdGV4dHNbMF0pO1xyXG4gICAgY29uc3QgZHJhdyA9ICgpID0+IHtcclxuICAgICAgLy9cclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcclxuICAgICAgICBpZiAoZS5idXR0b24gPT0gMCkge1xyXG4gICAgICAgICAgTW91c2VDbGlja1swXSA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlLmJ1dHRvbiA9PSAyKSB7XHJcbiAgICAgICAgICBNb3VzZUNsaWNrWzFdID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlKSA9PiB7XHJcbiAgICAgICAgaWYgKGUuYnV0dG9uID09IDApIHtcclxuICAgICAgICAgIE1vdXNlQ2xpY2tbMF0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZS5idXR0b24gPT0gMikge1xyXG4gICAgICAgICAgTW91c2VDbGlja1sxXSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIChlKSA9PiB7XHJcbiAgICAgICAgTWRbMF0gPSBlLm1vdmVtZW50WDtcclxuICAgICAgICBNZFsxXSA9IGUubW92ZW1lbnRZO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gICAgICAgIEtleXNbZS5rZXlDb2RlXSA9IDE7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xyXG4gICAgICAgIEtleXNbZS5rZXlDb2RlXSA9IDA7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCAoZSkgPT4ge1xyXG4gICAgICAgIFdoZWVsID0gZS5kZWx0YVk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgbXlUaW1lci5yZXNwb25zZSgpO1xyXG4gICAgICBteUlucHV0LnJlc3BvbnNlKE1kLCBNb3VzZUNsaWNrLCBXaGVlbCwgS2V5cyk7XHJcbiAgICAgIHJlbmRlcigpO1xyXG4gICAgICBXaGVlbCA9IDA7XHJcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XHJcblxyXG4gICAgfTtcclxuICAgIGRyYXcoKTtcclxuICB9KTtcclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztFQUFPLE1BQU0sS0FBSyxDQUFDO0VBQ25CLEVBQUUs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QUFDLENBQUM7RUFDM0IsS0FBSyxDQUFDO0VBQ04sR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDakIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzdDLEdBQUc7QUFDSDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtFQUNoQixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDcEMsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLEVBQUU7RUFDdEIsSUFBSSxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6QyxHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7RUFDL0IsSUFBSSxPQUFPLElBQUksS0FBSztFQUNwQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM3RCxLQUFLLENBQUM7RUFDTixHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtFQUNoQyxJQUFJLE9BQU8sSUFBSSxLQUFLO0VBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ25ELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ25ELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ25ELEtBQUssQ0FBQztFQUNOLEdBQUc7RUFDSDtBQUNBO0VBQ0EsRUFBRSxPQUFPLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0VBQ3hCLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3RFLElBQUksT0FBTyxJQUFJLEtBQUs7RUFDcEIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDakUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDakUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDakUsS0FBSyxDQUFDO0VBQ04sR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUU7RUFDakIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMzQixHQUFHO0VBQ0g7O0VDekZBLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRTtFQUNyQixFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7RUFDbEMsQ0FBQztBQUNEO0VBQ08sTUFBTSxNQUFNLENBQUM7RUFDcEIsRUFBRSxXQUFXO0VBQ2IsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSSxHQUFHO0VBQ1AsSUFBSTtFQUNKLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRztFQUNiLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7RUFDMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztFQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0VBQzFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7RUFDMUIsS0FBSyxDQUFDO0VBQ04sR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLFFBQVEsR0FBRztFQUNwQixJQUFJLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3hFLEdBQUc7RUFDSCxFQUFFLE9BQU8sR0FBRztFQUNaLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUksR0FBRztFQUNQLElBQUk7RUFDSixJQUFJLE9BQU8sSUFBSSxNQUFNO0VBQ3JCLE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULE1BQU0sR0FBRztFQUNULEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDUixHQUFHO0VBQ0gsRUFBRSxPQUFPLFNBQVMsQ0FBQyxDQUFDLEVBQUU7RUFDdEIsSUFBSSxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5RSxHQUFHO0VBQ0gsRUFBRSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7RUFDbEIsSUFBSSxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM5RSxHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRTtFQUN6QixJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDekIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN2QixJQUFJ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RyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUNsQyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDN0MsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6QyxTQUFTO0VBQ1QsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7RUFDekIsSUFBSSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0RSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDWixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7RUFDaEMsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ2xDLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUM3QyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pDLFNBQVM7RUFDVCxPQUFPO0VBQ1AsS0FBSztFQUNMLElBQUksT0FBTyxDQUFDLENBQUM7RUFDYixHQUFHO0FBQ0g7RUFDQSxFQUFFLE9BQU8sU0FBUyxDQUFDLENBQUMsRUFBRTtFQUN0QixJQUFJLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDdkUsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ2hDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUNsQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUIsT0FBTztFQUNQLEtBQUs7RUFDTCxJQUFJLE9BQU8sQ0FBQyxDQUFDO0VBQ2IsR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtFQUNoRSxJQUFJO0VBQ0osTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7RUFDckIsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7RUFDckIsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7RUFDckIsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7RUFDckIsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7RUFDckIsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7RUFDckIsTUFBTTtFQUNOLEdBQUc7QUFDSDtFQUNBLEVBQUUsT0FBTyxNQUFNLENBQUMsQ0FBQyxFQUFFO0VBQ25CLElBQUk7RUFDSixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDYixRQUFRLE1BQU0sQ0FBQyxTQUFTO0VBQ3hCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFNBQVM7RUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDYixRQUFRLE1BQU0sQ0FBQyxTQUFTO0VBQ3hCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFNBQVM7RUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDYixRQUFRLE1BQU0sQ0FBQyxTQUFTO0VBQ3hCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFNBQVM7RUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDYixRQUFRLE1BQU0sQ0FBQyxTQUFTO0VBQ3hCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pCLFNBQVM7RUFDVCxNQUFNO0VBQ04sR0FBRztBQUNIO0VBQ0EsRUFBRSxPQUFPLE9BQU8sQ0FBQyxDQUFDLEVBQUU7RUFDcEIsSUFBSSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pDLElBQUksSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0VBQzlCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQzVCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNYLE1BQU0sTUFBTSxDQUFDLFNBQVM7RUFDdEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNkO0VBQ0EsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ1gsTUFBTSxNQUFNLENBQUMsU0FBUztFQUN0QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWCxNQUFNLE1BQU0sQ0FBQyxTQUFTO0VBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLE9BQU8sR0FBRyxHQUFHLENBQUM7RUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWCxNQUFNLE1BQU0sQ0FBQyxTQUFTO0VBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQztBQUNmO0VBQ0EsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ1gsTUFBTSxNQUFNLENBQUMsU0FBUztFQUN0QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDZjtFQUNBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNYLE1BQU0sTUFBTSxDQUFDLFNBQVM7RUFDdEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNkO0VBQ0EsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ1gsTUFBTSxNQUFNLENBQUMsU0FBUztFQUN0QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWCxNQUFNLE1BQU0sQ0FBQyxTQUFTO0VBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLE9BQU8sR0FBRyxHQUFHLENBQUM7RUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWCxNQUFNLE1BQU0sQ0FBQyxTQUFTO0VBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLE9BQU8sR0FBRyxHQUFHLENBQUM7RUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWCxNQUFNLE1BQU0sQ0FBQyxTQUFTO0VBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNYLE1BQU0sTUFBTSxDQUFDLFNBQVM7RUFDdEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsT0FBTyxHQUFHLEdBQUcsQ0FBQztFQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNYLE1BQU0sTUFBTSxDQUFDLFNBQVM7RUFDdEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDO0VBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ1gsTUFBTSxNQUFNLENBQUMsU0FBUztFQUN0QixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDZixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUM7RUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWCxNQUFNLE1BQU0sQ0FBQyxTQUFTO0VBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLE9BQU8sR0FBRyxHQUFHLENBQUM7RUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDWCxNQUFNLE1BQU0sQ0FBQyxTQUFTO0VBQ3RCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNmLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQztFQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNYLE1BQU0sTUFBTSxDQUFDLFNBQVM7RUFDdEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2YsT0FBTyxHQUFHLEdBQUcsQ0FBQztFQUNkLElBQUksT0FBTyxDQUFDLENBQUM7RUFDYixHQUFHO0VBQ0gsRUFBRSxPQUFPLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtFQUNuQyxJQUFJLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM5QjtFQUNBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDaEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEI7RUFDQSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNoQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCO0VBQ0EsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNoQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ2hDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztFQUNqQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqQjtFQUNBLElBQUksQ0FBQyxDQUFDLENB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LE1BQU0sQ0FBQyxHQUFHO0VBQ3JCLE1BQU0sS0FBSyxDQUFDLENBQUM7RUFDYixNQUFNLEVBQUUsQ0FBQyxDQUFDO0VBQ1YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ1osTUFBTSxDQUFDO0VBQ1AsTUFBTSxLQUFLLENBQUMsQ0FBQztFQUNiLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDVjtFQUNBLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNaLE1BQU0sQ0FBQztFQUNQLE1BQU0sS0FBSyxDQUFDLENBQUM7RUFDYixNQUFNLEVBQUUsQ0FBQyxDQUFDO0VBQ1YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ1osTUFBTSxDQUFDO0VBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztFQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO0VBQ3pCLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0VBQ3pCLE1BQU0sQ0FBQztFQUNQLEtBQUssQ0FBQztFQUNOLEdBQUc7RUFDSCxDQUFDO0FBQ0Q7RUFDTyxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtFQUNyQyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUM7RUFJckIsRUFBRSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDNUM7RUFDQSxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakUsRUFBRSxHQUFHLEdBQUcsS0FBSyxD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QUMsV0FBVyxFQUFFO0VBQ3BELFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7RUFDdEQsT0FBTztFQUNQLE1BQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUM7RUFDL0IsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7RUFDN0MsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7RUFDM0MsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7RUFDOUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDNUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7RUFDM0MsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7RUFDMUMsUUFBUSxDQUFDO0VBQ1QsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7RUFDekMsUUFBUSxDQUFDO0VBQ1QsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7RUFDNUMsUUFBUSxDQUFDO0VBQ1QsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFL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QUM1QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7RUFDL0IsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0VBQzVCLElBQUksRUFBRTtFQUNOLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNwQyxHQUFHO0VBQ0gsRUFBRSxLQUFLLEVBQUUsSUFBSSxRQUFRO0VBQ3JCLElBQUksT0FBTztFQUNYLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztFQUMzQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7RUFDM0MsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO0VBQzNDLElBQUksT0FBTztFQUNYLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNwQyxHQUFHO0VBQ0gsRUFBRSxNQUFNLEVBQUUsSUFBSSxRQUFRO0VBQ3RCLElBQUksUUFBUTtFQUNaLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQztFQUNwQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7RUFDckMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO0VBQzNDLElBQUksSUFBSTtFQUNSLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNwQyxHQUFHO0VBQ0gsRUFBRSxNQUFNLEVBQUUsSUFBSSxRQUFRO0VBQ3RCLElBQUksUUFBUTtFQUNaLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztFQUMvQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7RUFDNUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO0VBQzNDLElBQUksSUFBSTtFQUNSLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUNwQyxHQUFHO0VBQ0gsRUFBRSxNQUFNLEVBQUUsSUFBSSxRQUFRO0VBQ3RCLElBQUksUUFBUTtFQUNaLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztFQUN0QyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7RUFDdEMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDO0VBQzNDLElBQUksSUFBSTtFQUNSLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsRUFB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QyxJQUFJLElBQUk7RUFDUixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDcEMsR0FBRztFQUNILEVBQUUsSUFBSSxFQUFFLElBQUksUUFBUTtFQUNwQixJQUFJLE1BQU07RUFDVixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7RUFDcEMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0VBQ3BDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztFQUMzQyxJQUFJLElBQUk7RUFDUixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDcEMsR0FBRztFQUNILEVBQUUsUUFBUSxFQUFFLElBQUksUUFBUTtFQUN4QixJQUFJLFVBQVU7RUFDZCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7RUFDckMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO0VBQ3JDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztFQUMzQyxJQUFJLElBQUk7RUFDUixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDcEMsR0FBRztFQUNILEVBQUUsS0FBSyxFQUFFLElBQUksUUFBUTtFQUNyQixJQUFJLE9BQU87RUFDWCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7RUFDckMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO0VBQ2hDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztFQUMzQyxJQUFJLE1BQU07RUFDVixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDcEMsR0FBRztFQUNILEVBQUUsT0FBTyxFQUFFLElBQUksUUFBUTtFQUN2QixJQUFJLFNBQVM7RUFDYixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7RUFDckMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0VBQ3hDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQztFQUNyQyxJQUFJLElBQUk7RUFDUixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDcEMsR0FBRztFQUNILEVB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LENBQUMsU0FBUztFQUM1QixNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDL0UsS0FBSyxDQUFDO0VBQ04sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUztFQUNoQyxNQUFNLEtBQUssQ0FBQyxLQUFLO0VBQ2pCLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3JDLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6QyxPQUFPO0VBQ1AsS0FBSyxDQUFDO0VBQ04sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUztFQUNoQyxNQUFNLEtBQUssQ0FBQyxLQUFLO0VBQ2pCLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6QyxRQUFRLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNyQyxPQUFPO0VBQ1AsS0FBSyxDQUFDO0FBQ047RUFDQTtFQUNBLEdBQUc7RUFDSDs7RUNoSUEsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ1o7RUFDQSxNQUFNLEtBQUssQ0FBQztFQUNaLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtFQUMzQyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0VBQ3JCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDckIsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNyQixJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3hDLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekMsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztFQUM1QixHQUFHO0FBQ0g7RUFDQSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7RUFDN0IsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztFQUNsQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3JCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDckIsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNoQyxJQUFJLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ2pDLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7RUFDNUIsR0FBRztFQUNILENBQUM7QUFDRDtFQUNPLElBQUksT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7RUNqQmxFLElBQUksT0FBTyxDQUFDO0FBQ1o7RUFDTyxTQUFTLFFBQVEsR0FBRztFQUMzQixFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztFQUNoQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN4QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7RUFDOUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7QUFDSjtFQUNBLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN2QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7RUFDOUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdkIsR0FBRyxDQUFDO0VBQ0osRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDeEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3ZCLEdBQUcsQ0FBQztFQUNKLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3hCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN2QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3pCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN2QixHQUFHLENBQUM7QUFDSjtFQUNBLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3hCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN2QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3pCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN2QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3ZCLEdBQUcsQ0FBQztFQUNKLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUN2QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3hCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN2QixHQUFHLENBQUM7QUFDSjtFQUNBLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUN2QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0VBQzlCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN4QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7RUFDOUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7RUFDOUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUN2QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3hCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN4QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7RUFDOUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdkIsR0FBRyxDQUFDO0VBQ0osRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN2QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQ3pCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUM5QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN2QixHQUFHLENBQUM7RUFDSixFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDdkIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN4QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7RUFDOUIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdkIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLElBQUksT0FBTyxHQUFHO0VBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ1g7RUFDQSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNYO0VBQ0EsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDWDtFQUNBLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ1g7RUFDQSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNaO0VBQ0EsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDYjtFQUNBLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ2Q7RUFDQSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNkO0VBQ0EsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDZDtFQUNBLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0FBQ2Q7RUFDQSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtBQUNkO0VBQ0EsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDZDtFQUNBLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO0VBQ2QsR0FBRyxDQUFDO0VBV0osRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU07RUFDdkIsSUFBSSxJQUFJO0VBQ1IsSUFBSSxJQUFJLENBQUMsTUFBTTtFQUNmLElBQUksT0FBTztFQUNYLElBQUksT0FBTyxDQUFDLE1BQU07RUFDbEIsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7RUFDakMsR0FBRyxDQUFDO0VBQ0osQ0FBQztBQUNEO0VBQ08sU0FBUyxVQUFVLEdBQUc7RUFDN0IsRUFBRSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTztFQUMzQixJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQzFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDeEMsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQzNCOztFQ3BMTyxTQUFTLE9BQU8sR0FBRztFQUMxQixFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3RFLENBQUM7QUFDRDtFQUNPLFNBQVMsU0FBUyxHQUFHO0VBQzVCLEVBQUUsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDbkQsRUFBRSxJQUFJLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztFQUN0RCxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0VBQ3JCLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDVDtFQUNBLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0VBQ3pCLEVBQUUsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO0VBQ3ZDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztBQUNwQztFQUNBLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7RUFDckIsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7RUFDdkMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDdkM7RUFDQSxFQUFFLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDO0VBQ3JELEVBQUUsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7QUFDdEQ7RUFDQSxFQUFFLE9BQU87RUFDVCxJQUFJLE9BQU8sQ0FBQyxlQUFlLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2hGLEVBQUUsUUFBUTtFQUNWLElBQUksT0FBTyxDQUFDLGVBQWUsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEY7RUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLElBQUksRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDO0VBQ3ZDLE9BQU8sSUFBSSxRQUFRLEdBQUcsS0FBSyxFQUFFLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDOUM7RUFDQSxFQUFFLElBQUksSUFBSSxPQUFPLENBQUMsZUFBZSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0Q7RUFDQSxFQUFFLElBQUksSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0VBQzdCLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxFQUFFO0VBQy9CLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0VBQzlELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUM3RDtFQUNBLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFFO0VBQ0EsSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztFQUNuQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ3JDLEdBQUc7RUFDSCxFQUFFLE1BQU07RUFDUixJQUFJLEtBQUssQ0FBQyxlQUFlO0VBQ3pCLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztFQUMzQixNQUFNLE1BQU0sQ0FBQyxPQUFPO0VBQ3BCLFFB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SyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztFQUM3RSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztFQUM3RSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLENBQUMsQ0FBQztFQUMxRCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3JCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsbUJBQW1CLEVBQUUsa0JBQWtCLENBQUM7RUFDNUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7QUFDSjtFQUNBLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNyQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQztFQUM1RSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3JCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDO0VBQzVFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDckIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixDQUFDO0VBQzFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDckIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO0VBQzFELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDckIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0VBQzFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDckIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQztFQUN6RSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3JCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDO0VBQzNFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDckIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0VBQzFELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDckIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztFQUM1RSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxJQUFJLE9BQU8sR0FBRztFQUNoQixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7QUFDTDtFQUNBLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztBQUNMO0VBQ0EsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0FBQ0w7RUFDQSxJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7QUFDTDtFQUNBLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztBQUNMO0VBQ0EsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0FBQ0w7RUFDQSxJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7QUFDTDtFQUNBLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztBQUNMO0VBQ0EsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0FBQ0w7RUFDQSxJQUFJLEVBQUU7RUFDTixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7QUFDTDtFQUNBLElBQUksRUFBRTtFQUNOLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztBQUNMO0VBQ0EsSUFBSSxFQUFFO0VBQ04sSUFBSSxDQUFDO0VBQ0wsSUFBSSxFQUFFO0FBQ047RUFDQSxJQUFJLEVBQUU7RUFDTixJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7QUFDTDtFQUNBLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtFQUNOLElBQUksQ0FBQztBQUNMO0VBQ0EsSUFBSSxFQUFFO0VBQ04sSUFBSSxDQUFDO0VBQ0wsSUFBSSxFQUFFO0FBQ047RUFDQSxJQUFJLENBQUM7RUFDTCxJQUFJLENBQUM7RUFDTCxJQUFJLEVBQUU7QUFDTjtFQUNBLElBQUksQ0FBQztFQUNMLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtBQUNOO0VBQ0EsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0VBQ0wsSUFBSSxFQUFFO0FBQ047RUFDQSxJQUFJLENBQUM7RUFDTCxJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7QUFDTjtFQUNBLElBQUksQ0FBQztFQUNMLElBQUksRUFBRTtFQUNOLElBQUksQ0FBQztBQUNMO0VBQ0EsSUFBSSxDQUFDO0VBQ0wsSUFBSSxFQUFFO0VBQ04sSUFBSSxFQUFFO0FBQ047RUFDQSxJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7QUFDTjtFQUNBLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtBQUNOO0VBQ0EsSUFBSSxFQUFFO0VBQ04sSUFBSSxFQUFFO0VBQ04sSUFBSSxFQUFFO0FBQ047RUFDQSxJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7QUFDTjtFQUNBLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtBQUNOO0VBQ0EsSUFBSSxFQUFFO0VBQ04sSUFBSSxFQUFFO0VBQ04sSUFBSSxFQUFFO0FBQ047RUFDQSxJQUFJLEVBQUU7RUFDTixJQUFJLENBQUM7RUFDTCxJQUFJLEVBQUU7QUFDTjtFQUNBLElBQUksQ0FBQztFQUNMLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtBQUNOO0VBQ0EsSUFBSSxDQUFDO0VBQ0wsSUFBSSxDQUFDO0VBQ0wsSUFBSSxFQUFFO0FBQ047RUFDQSxJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7RUFDTixJQUFJLENBQUM7QUFDTDtFQUNBLElBQUksQ0FBQztFQUNMLElBQUksQ0FBQztFQUNMLElBQUksRUFBRTtBQUNOO0VBQ0EsSUFBSSxDQUFDO0VBQ0wsSUFBSSxFQUFFO0VBQ04sSUFBSSxDQUFDO0FBQ0w7RUFDQSxJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7RUFDTixJQUFJLEVBQUU7QUFDTjtFQUNBLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtFQUNOLElBQUksRUFBRTtBQUNOO0VBQ0EsSUFBSSxFQUFFO0VBQ04sSUFBSSxFQUFFO0VBQ04sSUFBSSxFQUFFO0VBQ04sR0FBRyxDQUFDO0VBQ0osRUFBRSxLQUFLLElBQUksQ0FBQyxH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RSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3ZCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN2QixJQUFJLEtBQUssQ0FB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LENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEQsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7QUFDSjtFQUNBLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3BELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRztFQUNiLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUM5QixNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzFDLEtBQUs7RUFDTCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHO0VBQ2IsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDdkIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pDLEtBQUs7RUFDTCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHO0VBQ2IsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMvQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMxQyxLQUFLO0VBQ0wsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRztFQUNiLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDL0IsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDdEIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pDLEtBQUs7RUFDTCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHO0VBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHO0VBQzlCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUMsS0FBSztFQUNMLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUc7RUFDYixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUc7RUFDOUIsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUN2QixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekMsS0FBSztFQUNMLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3JCLElBQUksS0FBSyxDQUFDLEdBQUc7RUFDYixNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMs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WUFBWSxDQUFDO0FBQ2pCO0VBQ08sU0FBUyxRQUFRLEdBQUc7RUFDM0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZDtFQUNBLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDM0QsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzFELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ2hELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMzRCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNwQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDMUQsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDaEQsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU07RUFDcEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3BCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzNELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUN0QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxNQUFNO0VBQ3JCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMxRCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksTUFBTTtFQUNyQixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNoRCxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDdEIsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ3RCLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTO0VBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekUsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTO0VBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekUsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTO0VBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDekUsR0FBRyxDQUFDO0FBQ0o7RUFDQSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVM7RUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RSxHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVM7RUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RSxHQUFHLENBQUM7RUFDSixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVM7RUFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN6RSxHQUFHLENBQUM7QUFDSjtFQUNBLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUztFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pFLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUztFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pFLEdBQUcsQ0FBQztFQUNKLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUztFQUMzQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pFLEdBQUcsQ0FBQztBQUNKO0VBQ0EsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTO0VBQzNCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDM0UsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTO0VBQzVCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDNUUsR0FBRyxDQUFDO0VBQ0osRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTO0VBQzVCLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVB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V0FBVyxFQUFFLENBQUMsQ0FBQyxLQUFLO0VBQ2xELFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtFQUMzQixVQUFVLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDNUIsU0FBUztFQUNULFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtFQUMzQixVQUFVLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDNUIsU0FBUztFQUNULE9BQU8sQ0FBQyxDQUFDO0FBQ1Q7RUFDQSxNQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEtBQUs7RUFDaEQsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0VBQzNCLFVBQVUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1QixTQUFTO0VBQ1QsUUFBUSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0VBQzNCLFVBQVUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1QixTQUFTO0VBQ1QsT0FBTyxDQUFDLENBQUM7QUFDVDtFQUNBLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsS0FBSztFQUNsRCxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0VBQzVCLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7RUFDNUIsT0FBTyxDQUFDLENBQUM7QUFDVDtFQUNBLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsS0FBSztFQUNoRCxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzVCLE9BQU8sQ0FBQyxDQUFDO0FBQ1Q7RUFDQSxNQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEtBQUs7RUFDOUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1QixPQUFPLENBQUMsQ0FBQztBQUNUO0VBQ0EsTUFBTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLO0VBQzlDLFFBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDekIsT0FBTyxDQUFDLENBQUM7QUFDVDtFQUNBLE1BQU0sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0VBQ3pCLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztFQUNwRCxNQUFNLE1BQU0sRUFBRSxDQUFDO0VBQ2YsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0VBQ2hCLE1BQU0sTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDO0VBQ0EsS0FBSyxDQUFDO0VBQ04sSUFBSSxJQUFJLEVBQUUsQ0FBQztFQUNYLEdBQUcsQ0FBQzs7Ozs7OyJ9
