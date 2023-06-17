import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myTimer } from "../timer.js";

let Pr_tetraider;

export function initTetr() {
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
  Pr_tetraider = prim.create(
    Vr,
    Vr.length,
    indices,
    indices.length,
    material.add(Matlib.Emerald)
  );
}

export function renderTetr() {
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
