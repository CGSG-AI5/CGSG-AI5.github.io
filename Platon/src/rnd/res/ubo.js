import { gl } from "../rnddata.js";
import { _matr4 } from "../../math/mathmat4.js";
import { _vec3 } from "../../math/mathvec3.js";
import { program } from "./shader.js";
export let Ubos = [];

export let Ubo_cell = {
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

export class Ubo_Matr {
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

export class UBO {
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
      let x = [
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
