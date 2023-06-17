import { UBO } from "./res/ubo.js";
import { gl } from "./rnddata.js";
import { program } from "./res/shader.js";
import { _matr4 } from "../math/mathmat4.js";
import { _vec3 } from "../math/mathvec3.js";
import { cam } from "../math/mathcam.js";
import { CamUBO } from "./rndbase.js";
import { Ubo_cell } from "./res/ubo.js";
import { material } from "./res/material.js";

export class vertex {
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

export class prim {
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
