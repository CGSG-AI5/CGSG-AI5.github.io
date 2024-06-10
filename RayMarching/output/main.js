var XXX = (function (exports) {
    'use strict';

    // import { UBO, Ubo_cell } from "./rnd/res/ubo.js";
    // import { cam } from "./math/mathcam.js";
    // import { _vec3 } from "./math/mathvec3.js";
    // import { CamUBO } from "./rnd/rndbase.js";
    class Time {
        getTime() {
            const date = new Date();
            let t = date.getMilliseconds() / 1000.0 +
                date.getSeconds() +
                date.getMinutes() * 60;
            return t;
        }
        globalTime;
        localTime;
        globalDeltaTime;
        pauseTime;
        localDeltaTime;
        frameCounter;
        startTime;
        oldTime;
        oldTimeFPS;
        isPause;
        FPS;
        constructor() {
            // Fill timer global data
            this.globalTime = this.localTime = this.getTime();
            this.globalDeltaTime = this.localDeltaTime = 0;
            // Fill timer semi global data
            this.startTime = this.oldTime = this.oldTimeFPS = this.globalTime;
            this.frameCounter = 0;
            this.isPause = false;
            this.FPS = 30.0;
            this.pauseTime = 0;
        }
        Response() {
            let t = this.getTime();
            // Global time
            this.globalTime = t;
            this.globalDeltaTime = t - this.oldTime;
            // Time with pause
            if (this.isPause) {
                this.localDeltaTime = 0;
                this.pauseTime += t - this.oldTime;
            }
            else {
                this.localDeltaTime = this.globalDeltaTime;
                this.localTime = t - this.pauseTime - this.startTime;
            }
            // FPS
            this.frameCounter++;
            if (t - this.oldTimeFPS > 3) {
                this.FPS = this.frameCounter / (t - this.oldTimeFPS);
                this.oldTimeFPS = t;
                this.frameCounter = 0;
            }
            this.oldTime = t;
        }
    }
    let myTimer = new Time();

    class InPut {
        Keys;
        KeysClick;
        Mx;
        My;
        Mz;
        Mdx;
        Mdy;
        Mdz;
        MouseClickLeft;
        MouseClickRight;
        constructor(MouseClick, Keys) {
            this.Keys = this.KeysClick = Keys;
            this.Mx = this.My = this.Mz = this.Mdx = this.Mdy = this.Mdz = 0;
            this.MouseClickLeft = MouseClick[0];
            this.MouseClickRight = MouseClick[1];
        }
        response(M, MouseClick, Wheel, Keys) {
            // if (Keys[17] != 0)
            for (let i = 0; i < 256; i++) {
                this.KeysClick[i] = Keys[i] && !this.Keys[i] ? 1 : 0;
            }
            for (let i = 0; i < 256; i++) {
                this.Keys[i] = Keys[i];
            }
            this.Mdx = M[0];
            this.Mdy = M[1];
            // this.Mx = M[0];
            // this.My = M[1];
            this.Mdz = Wheel;
            this.Mz += Wheel;
            this.MouseClickLeft = MouseClick[0];
            this.MouseClickRight = MouseClick[1];
        }
    } // End of 'Input' function
    let myInput = new InPut([0, 0], []);

    class _vec3 {
        x;
        y;
        z;
        constructor(x1, y1, z1) {
            this.x = x1;
            this.y = y1;
            this.z = z1;
        }
        static set(x1, y1, z1) {
            return new _vec3(x1, y1, z1);
        }
        static add(b, a) {
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
            return new _vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - b.x * a.y);
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
        static vec3(a) {
            return [a.x, a.y, a.z];
        }
    }

    function D2R(degree) {
        return (degree * Math.PI) / 180;
    }
    class _matr4 {
        a;
        constructor(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33) {
            this.a = [
                [a00, a01, a02, a03],
                [a10, a11, a12, a13],
                [a20, a21, a22, a23],
                [a30, a31, a32, a33]
            ];
        }
        static identity() {
            return new _matr4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1).a;
        }
        static set(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33) {
            return new _matr4(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33).a;
        }
        static translate(a) {
            return new _matr4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, a.x, a.y, a.z, 1).a;
        }
        static scale(a) {
            return new _matr4(a.x, 0, 0, 0, 0, a.y, 0, 0, 0, 0, a.z, 0, 0, 0, 0, 1).a;
        }
        static rotateZ(degree) {
            const r = D2R(degree), co = Math.cos(r), si = Math.sin(r);
            let m = _matr4.identity();
            m[0][0] = co;
            m[1][0] = -si;
            m[0][1] = si;
            m[1][1] = co;
            return m;
        }
        static rotateX(degree) {
            const r = D2R(degree), co = Math.cos(r), si = Math.sin(r);
            let m = _matr4.identity();
            m[1][1] = co;
            m[2][1] = -si;
            m[1][2] = si;
            m[2][2] = co;
            return m;
        }
        static rotateY(degree) {
            const r = D2R(degree), co = Math.cos(r), si = Math.sin(r);
            let m = _matr4.identity();
            m[0][0] = co;
            m[2][0] = si;
            m[0][2] = -si;
            m[2][2] = co;
            return m;
        }
        static mulmatr(m1, m2) {
            let r = _matr4.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0), k = 0;
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
            return (a11 * a22 * a33 -
                a11 * a23 * a32 -
                a12 * a21 * a33 +
                a12 * a23 * a31 +
                a13 * a21 * a32 -
                a13 * a22 * a31);
        }
        static determ(m) {
            return (m[0][0] *
                _matr4.determ3x3(m[1][1], m[1][2], m[1][3], m[2][1], m[2][2], m[2][3], m[3][1], m[3][2], m[3][3]) -
                m[0][1] *
                    _matr4.determ3x3(m[1][0], m[1][2], m[1][3], m[2][0], m[2][2], m[2][3], m[3][0], m[3][2], m[3][3]) +
                m[0][2] *
                    _matr4.determ3x3(m[1][0], m[1][1], m[1][3], m[2][0], m[2][1], m[2][3], m[3][0], m[3][1], m[3][3]) -
                m[0][3] *
                    _matr4.determ3x3(m[1][0], m[1][1], m[1][2], m[2][0], m[2][1], m[2][2], m[3][0], m[3][1], m[3][2]));
        }
        static inverse(m) {
            const det = _matr4.determ(m);
            let r = _matr4.identity();
            if (det === 0)
                return r;
            r[0][0] =
                _matr4.determ3x3(m[1][1], m[1][2], m[1][3], m[2][1], m[2][2], m[2][3], m[3][1], m[3][2], m[3][3]) / det;
            r[1][0] =
                _matr4.determ3x3(m[1][0], m[1][2], m[1][3], m[2][0], m[2][2], m[2][3], m[3][0], m[3][2], m[3][3]) / -det;
            r[2][0] =
                _matr4.determ3x3(m[1][0], m[1][1], m[1][3], m[2][0], m[2][1], m[2][3], m[3][0], m[3][1], m[3][3]) / det;
            r[3][0] =
                _matr4.determ3x3(m[1][0], m[1][1], m[1][2], m[2][0], m[2][1], m[2][2], m[3][0], m[3][1], m[3][2]) / -det;
            r[0][1] =
                _matr4.determ3x3(m[0][1], m[0][2], m[0][3], m[2][1], m[2][2], m[2][3], m[3][1], m[3][2], m[3][3]) / -det;
            r[1][1] =
                _matr4.determ3x3(m[0][0], m[0][2], m[0][3], m[2][0], m[2][2], m[2][3], m[3][0], m[3][2], m[3][3]) / det;
            r[2][1] =
                _matr4.determ3x3(m[0][0], m[0][1], m[0][3], m[2][0], m[2][1], m[2][3], m[3][0], m[3][1], m[3][3]) / -det;
            r[3][1] =
                _matr4.determ3x3(m[0][0], m[0][1], m[0][2], m[2][0], m[2][1], m[2][2], m[3][0], m[3][1], m[3][2]) / det;
            r[0][2] =
                _matr4.determ3x3(m[0][1], m[0][2], m[0][3], m[1][1], m[1][2], m[1][3], m[3][1], m[3][2], m[3][3]) / det;
            r[1][2] =
                _matr4.determ3x3(m[0][0], m[0][2], m[0][3], m[1][0], m[1][2], m[1][3], m[3][0], m[3][2], m[3][3]) / -det;
            r[2][2] =
                _matr4.determ3x3(m[0][0], m[0][1], m[0][3], m[1][0], m[1][1], m[1][3], m[3][0], m[3][1], m[3][3]) / det;
            r[3][2] =
                _matr4.determ3x3(m[0][0], m[0][1], m[0][2], m[1][0], m[2][1], m[1][2], m[3][0], m[3][1], m[3][2]) / -det;
            r[0][3] =
                _matr4.determ3x3(m[0][1], m[0][2], m[0][3], m[1][1], m[1][2], m[1][3], m[2][1], m[2][2], m[2][3]) / -det;
            r[1][3] =
                _matr4.determ3x3(m[0][0], m[0][2], m[0][3], m[1][0], m[1][2], m[1][3], m[2][0], m[2][2], m[2][3]) / det;
            r[2][3] =
                _matr4.determ3x3(m[0][0], m[0][1], m[0][3], m[1][0], m[1][1], m[1][3], m[2][0], m[2][1], m[2][3]) / -det;
            r[3][3] =
                _matr4.determ3x3(m[0][0], m[0][1], m[0][2], m[1][0], m[2][1], m[1][2], m[2][0], m[2][1], m[2][2]) / det;
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
        static point_transform(a, b) {
            return new _vec3(a.x * b[0][0] + a.y * b[1][0] + a.z * b[2][0] + b[3][0], a.x * b[0][1] + a.y * b[1][1] + a.z * b[2][1] + b[3][1], a.x * b[0][2] + a.y * b[1][2] + a.z * b[2][2] + b[3][2]);
        }
        static vectort_ransform(a, b) {
            return new _vec3(a.x * b[0][0] + a.y * b[1][0] + a.z * b[2][0], a.x * b[0][1] + a.y * b[1][1] + a.z * b[2][1], a.x * b[0][2] + a.y * b[1][2] + a.z * b[2][2]);
        }
        static mul_matr(a, b) {
            const w = a.x * b[0][3] + a.y * b[1][3] + a.z * b[2][3] + b[3][3];
            return new _vec3((a.x * b[0][0] + a.y * b[1][0] + a.z * b[2][0] + b[3][0]) / w, (a.y * b[0][1] + a.y * b[1][1] + a.z * b[2][1] + b[3][1]) / w, (a.z * b[0][2] + a.y * b[1][2] + a.z * b[2][2] + b[3][2]) / w);
        }
    }

    class surface {
        Name = "Default";
        Ka = _vec3.set(0.1, 0.1, 0.1);
        Kd = _vec3.set(0.9, 0.9, 0.9);
        Ks = _vec3.set(0.3, 0.3, 0.3);
        Ph = 30;
        Kr = _vec3.set(0, 0, 0);
        Kt = _vec3.set(0, 0, 0);
        RefractionCoef = 0;
        Decay = 0;
        GetArray() {
            return [
                ..._vec3.vec3(this.Ka),
                1,
                ..._vec3.vec3(this.Kd),
                1,
                ..._vec3.vec3(this.Ks),
                this.Ph,
                ..._vec3.vec3(this.Kr),
                this.RefractionCoef,
                ..._vec3.vec3(this.Kt),
                this.Decay
            ];
        }
    }
    class shape {
        Obj = _matr4.identity();
        Matrix = _matr4.identity();
        TypeShape = 0;
        Material = 0;
        GetArray() {
            return [..._matr4.toarr(this.Obj), ..._matr4.toarr(this.Matrix), this.TypeShape, this.Material, 0, 0];
        }
    }
    let Shapes = [];
    let Surfaces = [];
    function GetArrayObjects() {
        let Result = [Shapes.length, 0, 0, 0];
        for (let element of Shapes) {
            Result = Result.concat(element.GetArray());
        }
        return new Float32Array(Result);
    }
    function GetArraySurfaces() {
        let Result = [Surfaces.length, 0, 0, 0];
        for (let element of Surfaces) {
            Result = Result.concat(element.GetArray());
        }
        return new Float32Array(Result);
    }

    function ReadVec3fromString(Str) {
        let h;
        if (Str[0] != "{" || Str[Str.length - 1] != "}")
            return null;
        h = Str.slice(1, Str.length - 1)
            .split(",")
            .map(Number);
        if (h.length < 3)
            return null;
        return _vec3.set(h[0], h[1], h[2]);
    }
    function parser(Txt) {
        Shapes.length = 0;
        Surfaces.length = 1;
        let arrayOfStrings = Txt.split("\n");
        for (let i = 0; i < arrayOfStrings.length; i++) {
            if (arrayOfStrings[i][0] == "/" && arrayOfStrings[i][1] == "/")
                continue;
            let words = arrayOfStrings[i].split(" ");
            if (words.length == 1)
                continue;
            let Type = words[0];
            if (Type == "scene") {
                if (words.length != 6)
                    continue;
                let x;
                x = ReadVec3fromString(words[1]);
                if (x == null)
                    continue;
                exports.Ubo_set1_data.AmbientColor = x;
                x = ReadVec3fromString(words[2]);
                if (x == null)
                    continue;
                exports.Ubo_set1_data.BackgroundColor = x;
                exports.Ubo_set1_data.RefractionCoef = Number(words[3]);
                exports.Ubo_set1_data.Decay = Number(words[4]);
                exports.Ubo_set1_data.MaxRecLevel = Number(words[5]);
            }
            else if (Type == "surface") {
                if (words.length != 10)
                    continue;
                let x;
                let Surf = new surface();
                Surf.Name = words[1];
                let flag = false;
                for (let element of Surfaces) {
                    if (element.Name == Surf.Name) {
                        flag = true;
                        break;
                    }
                }
                if (flag)
                    continue;
                x = ReadVec3fromString(words[2]);
                if (x == null)
                    continue;
                Surf.Ka = x;
                x = ReadVec3fromString(words[3]);
                if (x == null)
                    continue;
                Surf.Kd = x;
                x = ReadVec3fromString(words[4]);
                if (x == null)
                    continue;
                Surf.Ks = x;
                Surf.Ph = Number(words[5]);
                x = ReadVec3fromString(words[6]);
                if (x == null)
                    continue;
                Surf.Kr = x;
                x = ReadVec3fromString(words[7]);
                if (x == null)
                    continue;
                Surf.Kt = x;
                Surf.RefractionCoef = Number(words[8]);
                Surf.Decay = Number(words[9]);
                Surfaces.push(Surf);
            }
            else {
                let id = -1;
                let x;
                let Sph = new shape();
                if (Type == "sphere") {
                    if (words.length != 6)
                        continue;
                    Sph.Obj[0][0] = Number(words[1]);
                    Sph.TypeShape = 0;
                    id = 2;
                }
                if (Type == "box") {
                    if (words.length != 6)
                        continue;
                    x = ReadVec3fromString(words[1]);
                    if (x == null)
                        continue;
                    Sph.Obj[0][0] = x.x;
                    Sph.Obj[0][1] = x.y;
                    Sph.Obj[0][2] = x.z;
                    Sph.TypeShape = 1;
                    id = 2;
                }
                if (Type == "round_box") {
                    if (words.length != 7)
                        continue;
                    x = ReadVec3fromString(words[1]);
                    if (x == null)
                        continue;
                    Sph.Obj[0][0] = x.x;
                    Sph.Obj[0][1] = x.y;
                    Sph.Obj[0][2] = x.z;
                    Sph.Obj[0][3] = Number(words[2]);
                    Sph.TypeShape = 2;
                    id = 3;
                }
                if (Type == "torus") {
                    if (words.length != 7)
                        continue;
                    Sph.Obj[0][0] = Number(words[1]);
                    Sph.Obj[0][1] = Number(words[2]);
                    Sph.TypeShape = 3;
                    id = 3;
                }
                if (Type == "cylinder") {
                    if (words.length != 6)
                        continue;
                    x = ReadVec3fromString(words[1]);
                    if (x == null)
                        continue;
                    Sph.Obj[0][0] = x.x;
                    Sph.Obj[0][1] = x.y;
                    Sph.Obj[0][2] = x.z;
                    Sph.TypeShape = 4;
                    id = 2;
                }
                if (id != -1) {
                    let Scale;
                    let Rot;
                    let Trans;
                    x = ReadVec3fromString(words[id]);
                    if (x == null)
                        continue;
                    Trans = _matr4.translate(x);
                    x = ReadVec3fromString(words[id + 1]);
                    if (x == null)
                        continue;
                    Rot = _matr4.mulmatr(_matr4.mulmatr(_matr4.rotateY(x.x), _matr4.rotateY(x.y)), _matr4.rotateZ(x.z));
                    x = ReadVec3fromString(words[id + 2]);
                    if (x == null)
                        continue;
                    Scale = _matr4.scale(x);
                    Sph.Matrix = _matr4.mulmatr(_matr4.mulmatr(Scale, Rot), Trans);
                    let index = 0;
                    for (let element of Surfaces) {
                        if (words[id + 3] == element.Name) {
                            Sph.Material = index;
                        }
                        index++;
                    }
                    Shapes.push(Sph);
                }
            }
        }
    }

    class Ubo_Matr {
        CamLoc;
        CamAt;
        CamRight;
        CamUp;
        CamDir;
        ProjDistFarTimeLocal;
        TimeGlobalDeltaGlobalDeltaLocal;
        flags12FrameW;
        flags45FrameH;
        AmbientColor;
        BackgroundColor;
        RefractionCoef;
        Decay;
        MaxRecLevel;
        constructor(CamLoc, CamAt, CamRight, CamUp, CamDir, ProjDistFarTimeLocal, TimeGlobalDeltaGlobalDeltaLocal, flags12FrameW, flags45FrameH, AmbientColor, BackgroundColor, RefractionCoef, Decay, MaxRecLevel) {
            this.CamLoc = CamLoc;
            this.CamAt = CamAt;
            this.CamRight = CamRight;
            this.CamUp = CamUp;
            this.CamDir = CamDir;
            this.ProjDistFarTimeLocal = ProjDistFarTimeLocal;
            this.TimeGlobalDeltaGlobalDeltaLocal = TimeGlobalDeltaGlobalDeltaLocal;
            this.flags12FrameW = flags12FrameW;
            this.flags45FrameH = flags45FrameH;
            this.AmbientColor = AmbientColor;
            this.BackgroundColor = BackgroundColor;
            this.RefractionCoef = RefractionCoef;
            this.Decay = Decay;
            this.MaxRecLevel = MaxRecLevel;
        }
        GetArray() {
            return new Float32Array([
                ..._vec3.vec3(this.CamLoc),
                1,
                ..._vec3.vec3(this.CamAt),
                1,
                ..._vec3.vec3(this.CamRight),
                1,
                ..._vec3.vec3(this.CamUp),
                1,
                ..._vec3.vec3(this.CamDir),
                1,
                ..._vec3.vec3(this.ProjDistFarTimeLocal),
                1,
                ..._vec3.vec3(this.TimeGlobalDeltaGlobalDeltaLocal),
                1,
                ..._vec3.vec3(this.flags12FrameW),
                1,
                ..._vec3.vec3(this.flags45FrameH),
                1,
                ..._vec3.vec3(this.AmbientColor),
                1,
                ..._vec3.vec3(this.BackgroundColor),
                1,
                this.RefractionCoef,
                this.Decay,
                this.MaxRecLevel,
                1
            ]);
        }
    }
    // ray<Type> Frame( Type Xs, Type Ys, Type dx, Type dy ) const
    // {
    //   vec3<Type> A = Dir * ProjDist;
    //   vec3<Type> B = Right * ((Xs + 0.5 - FrameW / 2.0) / FrameW * Wp);
    //   vec3<Type> C = Up * ((-(Ys + 0.5) + FrameH / 2.0) / FrameH * Hp);
    //   vec3<Type> X = vec3<Type>(A + B + C);
    //   return  ray<Type>(X + Loc, X.Normalizing());
    // } /* End of 'Resize' function */
    class UBO {
        name;
        uboid;
        constructor(name, uboid) {
            this.name = name;
            this.uboid = uboid;
        }
        static create(Size, name, gl) {
            let fr = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, fr);
            gl.bufferData(gl.UNIFORM_BUFFER, Size * 4, gl.STATIC_DRAW);
            return new UBO(name, fr);
        }
        update(UboArray, gl) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, this.uboid);
            gl.bufferSubData(gl.UNIFORM_BUFFER, 0, UboArray);
        }
        apply(point, ShdNo, gl) {
            let blk_loc = gl.getUniformBlockIndex(ShdNo, this.name);
            gl.uniformBlockBinding(ShdNo, blk_loc, point);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, point, this.uboid);
        }
    }

    let ProjSize = 0.1 /* Project plane fit square */, ProjDist = 0.1 /* Distance to project plane from viewer (near) */, ProjFarClip = 3000; /* Distance to project far clip plane (far) */
    class _camera {
        ProjSize;
        ProjDist;
        ProjFarClip;
        FrameW;
        FrameH;
        MatrVP;
        MatrView;
        MatrProj;
        Loc;
        At;
        Dir;
        Up;
        Right;
        constructor(ProjSize, ProjDist, ProjFarClip, MatrVP, MatrView, MatrProj, Loc, At, Dir, Up, Right, FrameW, FrameH) {
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
            this.FrameW = FrameW;
            this.FrameH = FrameH;
        }
        ProjSet() {
            let rx, ry;
            rx = ry = ProjSize;
            if (this.FrameW > this.FrameH)
                rx *= this.FrameW / this.FrameH;
            else
                ry *= this.FrameH / this.FrameW;
            this.MatrProj = _matr4.frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, ProjDist, ProjFarClip);
            this.MatrVP = _matr4.mulmatr(this.MatrView, this.MatrProj);
        }
        static view(Loc, At, Up1) {
            const Dir = _vec3.normalize(_vec3.sub(At, Loc)), Right = _vec3.normalize(_vec3.cross(Dir, Up1)), Up = _vec3.cross(Right, Dir);
            return _matr4.set(Right.x, Up.x, -Dir.x, 0, Right.y, Up.y, -Dir.y, 0, Right.z, Up.z, -Dir.z, 0, -_vec3.dot(Loc, Right), -_vec3.dot(Loc, Up), _vec3.dot(Loc, Dir), 1);
        }
    }
    let cam;
    function CamSet(Loc, At, Up1) {
        let Up, Dir, Right;
        let MatrView = _camera.view(Loc, At, Up1);
        Up = _vec3.set(MatrView[0][1], MatrView[1][1], MatrView[2][1]);
        Dir = _vec3.set(-MatrView[0][2], -MatrView[1][2], -MatrView[2][2]);
        Right = _vec3.set(MatrView[0][0], MatrView[1][0], MatrView[2][0]);
        const rx = ProjSize, ry = ProjSize;
        let MatrProj = _matr4.frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, ProjDist, ProjFarClip), MatrVP = _matr4.mulmatr(MatrView, MatrProj);
        cam = new _camera(ProjSize, ProjDist, ProjFarClip, MatrVP, MatrView, MatrProj, Loc, At, Dir, Up, Right, 500, 500);
    }

    let gl;
    let FpsCnvas;
    let Ubo_set1;
    exports.Ubo_set1_data = void 0;
    let Ubo_set2;
    let Ubo_set3;
    let max_size = 10;
    function initCam() {
        CamSet(_vec3.set(-2, 6, -6), _vec3.set(0, 0, 0), _vec3.set(0, 1, 0));
        exports.Ubo_set1_data.ProjDistFarTimeLocal.x = cam.ProjDist;
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
            myTimer.globalDeltaTime * 3 * (-30 * myInput.MouseClickLeft * myInput.Mdx);
        Elevator +=
            myTimer.globalDeltaTime * 2 * (-30 * myInput.MouseClickLeft * myInput.Mdy);
        if (Elevator < 0.08)
            Elevator = 0.08;
        else if (Elevator > 178.9)
            Elevator = 178.9;
        // if (Azimuth < -45) Azimuth = -45;
        // else if (Azimuth > 45) Azimuth = 45;
        Dist +=
            myTimer.globalDeltaTime * (1 + myInput.Keys[16] * 27) * (1.2 * myInput.Mdz);
        if (Dist < 0.1)
            Dist = 0.1;
        // console.log(key.charCodeAt(0));
        if (myInput.MouseClickRight) {
            if (cam.FrameW > cam.FrameH)
                Wp *= cam.FrameW / cam.FrameH;
            else
                Hp *= cam.FrameH / cam.FrameW;
            sx = (((-myInput.Mdx * Wp * 10) / cam.FrameW) * Dist) / cam.ProjDist;
            sy = (((myInput.Mdy * Hp * 10) / cam.FrameH) * Dist) / cam.ProjDist;
            dv = _vec3.add(_vec3.mulnum(cam.Right, sx), _vec3.mulnum(cam.Up, sy));
            cam.At = _vec3.add(cam.At, dv);
            cam.Loc = _vec3.add(cam.Loc, dv);
        }
        CamSet(_matr4.point_transform(new _vec3(0, Dist, 0), _matr4.mulmatr(_matr4.mulmatr(_matr4.rotateX(Elevator), _matr4.rotateY(Azimuth)), _matr4.translate(cam.At))), cam.At, new _vec3(0, 1, 0));
        exports.Ubo_set1_data.CamLoc = cam.Loc;
        exports.Ubo_set1_data.CamAt = cam.At;
        exports.Ubo_set1_data.CamRight = cam.Right;
        exports.Ubo_set1_data.CamUp = cam.Up;
        exports.Ubo_set1_data.CamDir = cam.Dir;
        //   if (Ani->Keys[VK_SHIFT] && Ani->KeysClick['P'])
        //     Ani->IsPause = !Ani->IsPause;
    }
    function drawFps() {
        FpsCnvas.clearRect(0, 0, FpsCnvas.canvas.width, FpsCnvas.canvas.height);
        FpsCnvas.font = "48px serif";
        FpsCnvas.fillText("FPS:" + myTimer.FPS.toFixed(2), 10, 50);
    }
    function resizeCam(w, h) {
        exports.Ubo_set1_data.flags12FrameW.z = w;
        exports.Ubo_set1_data.flags45FrameH.z = h;
        cam.ProjSet();
    }
    async function reloadShaders() {
        const vsResponse = await fetch("./shader/march.vertex.glsl" + "?nocache" + new Date().getTime());
        const vsText = await vsResponse.text();
        // console.log(vsText);
        const fsResponse = await fetch("./shader/march.fragment.glsl" + "?nocache" + new Date().getTime());
        const fsText = await fsResponse.text();
        const dtResponse = await fetch("./data.txt" + "?nocache" + new Date().getTime());
        const dtText = await dtResponse.text();
        parser(dtText);
        console.log(Shapes);
        console.log(Surfaces);
        Ubo_set2.update(GetArrayObjects(), gl);
        Ubo_set3.update(GetArraySurfaces(), gl);
        const shaderProgram = initShaderProgram(vsText, fsText);
        if (!shaderProgram)
            return null;
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, "in_pos")
            }
        };
        return programInfo;
    }
    function loadShader(type, source) {
        const shader = gl.createShader(type);
        if (!shader)
            return null;
        // Send the source to the shader object
        gl.shaderSource(shader, source);
        // Compile the shader program
        gl.compileShader(shader);
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    //
    // Initialize a shader program, so WebGL knows how to draw our data
    //
    function initShaderProgram(vsSource, fsSource) {
        const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
        if (!vertexShader)
            return;
        const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
        if (!fragmentShader)
            return;
        // Create the shader program
        const shaderProgram = gl.createProgram();
        if (!shaderProgram)
            return;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }
        return shaderProgram;
    }
    function initPositionBuffer() {
        // Create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Now create an array of positions for the square.
        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        return positionBuffer;
    }
    function initBuffers() {
        const positionBuffer = initPositionBuffer();
        return {
            position: positionBuffer
        };
    }
    function setPositionAttribute(buffers, programInfo) {
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    function drawScene(programInfo, buffers, Uni) {
        gl.clearColor(0.28, 0.47, 0.8, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (programInfo == null)
            return;
        setPositionAttribute(buffers, programInfo);
        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);
        Ubo_set1.apply(0, programInfo.program, gl);
        Ubo_set2.apply(1, programInfo.program, gl);
        Ubo_set3.apply(2, programInfo.program, gl);
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
    let Md = [0, 0], MouseClick = [0, 0], Wheel = 0, Keys = new Array(255).fill(0);
    async function main(w, h) {
        const vsResponse = await fetch("./shader/march.vertex.glsl" + "?nocache" + new Date().getTime());
        const vsText = await vsResponse.text();
        console.log(vsText);
        const fsResponse = await fetch("./shader/march.fragment.glsl" + "?nocache" + new Date().getTime());
        const fsText = await fsResponse.text();
        console.log(fsText);
        const canvas = document.querySelector("#glcanvas");
        const canvas1 = document.querySelector("#fpscanvas");
        if (!canvas || !canvas1) {
            return;
        } // Initialize the GL context
        FpsCnvas = canvas1.getContext("2d");
        gl = canvas.getContext("webgl2");
        gl.canvas.width = w;
        gl.canvas.height = h;
        // Only continue if WebGL is available and working
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        // Set clear color to black, fully opaque
        gl.clearColor(0.28, 0.47, 0.8, 1.0);
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT);
        let shaderProgram = initShaderProgram(vsText, fsText);
        if (!shaderProgram)
            return;
        let programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, "in_pos")
            }
        };
        gl.getAttribLocation(shaderProgram, "time");
        const buffers = initBuffers();
        exports.Ubo_set1_data = new Ubo_Matr(new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), new _vec3(0, 0, 0), 0, 0, 0);
        Surfaces.push(new surface());
        Ubo_set1 = UBO.create(exports.Ubo_set1_data.GetArray().length, "BaseData", gl);
        Ubo_set2 = UBO.create(36 * max_size + 4, "Primitives", gl);
        Ubo_set3 = UBO.create(20 * max_size + 4, "PrimitivesSurfaces", gl);
        initCam();
        gl.viewport(0, 0, w, h);
        resizeCam(w, h);
        let programInf;
        programInf = programInfo;
        programInf = await reloadShaders();
        const render = async () => {
            if (myInput.KeysClick[82])
                programInf = await reloadShaders();
            myTimer.Response();
            drawFps();
            window.addEventListener("mousedown", (e) => {
                e.preventDefault();
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
            myInput.response(Md, MouseClick, Wheel, Keys);
            Md[0] = Md[1] = 0;
            renderCam();
            exports.Ubo_set1_data.TimeGlobalDeltaGlobalDeltaLocal.x = myTimer.globalTime;
            Ubo_set1.update(exports.Ubo_set1_data.GetArray(), gl);
            drawScene(programInf, buffers);
            Wheel = 0;
            Keys.fill(0);
            window.requestAnimationFrame(render);
        };
        render();
    }
    window.addEventListener("load", (event) => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        main(w, h);
    });
    window.addEventListener("resize", (event) => {
        let w = window.innerWidth;
        let h = window.innerHeight;
        gl.canvas.width = w;
        gl.canvas.height = h;
        FpsCnvas.canvas.width = w;
        FpsCnvas.canvas.height = h;
        gl.viewport(0, 0, w, h);
        resizeCam(w, h);
    });

    exports.main = main;

    return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vcmVzL3RpbWVyLnRzIiwiLi4vcmVzL2lucHV0LnRzIiwiLi4vbWF0aC9tYXRodmVjMy50cyIsIi4uL21hdGgvbWF0aG1hdDQudHMiLCIuLi9vYmplY3RzLnRzIiwiLi4vcmVzL3BhcnNlci50cyIsIi4uL3Jlcy91Ym8udHMiLCIuLi9tYXRoL21hdGhjYW0udHMiLCIuLi9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IFVCTywgVWJvX2NlbGwgfSBmcm9tIFwiLi9ybmQvcmVzL3Viby5qc1wiO1xuLy8gaW1wb3J0IHsgY2FtIH0gZnJvbSBcIi4vbWF0aC9tYXRoY2FtLmpzXCI7XG4vLyBpbXBvcnQgeyBfdmVjMyB9IGZyb20gXCIuL21hdGgvbWF0aHZlYzMuanNcIjtcbi8vIGltcG9ydCB7IENhbVVCTyB9IGZyb20gXCIuL3JuZC9ybmRiYXNlLmpzXCI7XG5cbmNsYXNzIFRpbWUge1xuICBnZXRUaW1lKCk6IG51bWJlciB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IHQgPVxuICAgICAgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDAuMCArXG4gICAgICBkYXRlLmdldFNlY29uZHMoKSArXG4gICAgICBkYXRlLmdldE1pbnV0ZXMoKSAqIDYwO1xuICAgIHJldHVybiB0O1xuICB9XG5cbiAgZ2xvYmFsVGltZTogbnVtYmVyO1xuICBsb2NhbFRpbWU6IG51bWJlcjtcbiAgZ2xvYmFsRGVsdGFUaW1lOiBudW1iZXI7XG4gIHBhdXNlVGltZTogbnVtYmVyO1xuICBsb2NhbERlbHRhVGltZTogbnVtYmVyO1xuICBmcmFtZUNvdW50ZXI6IG51bWJlcjtcbiAgc3RhcnRUaW1lOiBudW1iZXI7XG4gIG9sZFRpbWU6IG51bWJlcjtcbiAgb2xkVGltZUZQUzogbnVtYmVyO1xuICBpc1BhdXNlOiBib29sZWFuO1xuICBGUFM6IG51bWJlcjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gRmlsbCB0aW1lciBnbG9iYWwgZGF0YVxuICAgIHRoaXMuZ2xvYmFsVGltZSA9IHRoaXMubG9jYWxUaW1lID0gdGhpcy5nZXRUaW1lKCk7XG4gICAgdGhpcy5nbG9iYWxEZWx0YVRpbWUgPSB0aGlzLmxvY2FsRGVsdGFUaW1lID0gMDtcblxuICAgIC8vIEZpbGwgdGltZXIgc2VtaSBnbG9iYWwgZGF0YVxuICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5vbGRUaW1lID0gdGhpcy5vbGRUaW1lRlBTID0gdGhpcy5nbG9iYWxUaW1lO1xuICAgIHRoaXMuZnJhbWVDb3VudGVyID0gMDtcbiAgICB0aGlzLmlzUGF1c2UgPSBmYWxzZTtcbiAgICB0aGlzLkZQUyA9IDMwLjA7XG4gICAgdGhpcy5wYXVzZVRpbWUgPSAwO1xuICB9XG5cbiAgUmVzcG9uc2UoKSB7XG4gICAgbGV0IHQgPSB0aGlzLmdldFRpbWUoKTtcbiAgICAvLyBHbG9iYWwgdGltZVxuICAgIHRoaXMuZ2xvYmFsVGltZSA9IHQ7XG4gICAgdGhpcy5nbG9iYWxEZWx0YVRpbWUgPSB0IC0gdGhpcy5vbGRUaW1lO1xuICAgIC8vIFRpbWUgd2l0aCBwYXVzZVxuICAgIGlmICh0aGlzLmlzUGF1c2UpIHtcbiAgICAgIHRoaXMubG9jYWxEZWx0YVRpbWUgPSAwO1xuICAgICAgdGhpcy5wYXVzZVRpbWUgKz0gdCAtIHRoaXMub2xkVGltZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2NhbERlbHRhVGltZSA9IHRoaXMuZ2xvYmFsRGVsdGFUaW1lO1xuICAgICAgdGhpcy5sb2NhbFRpbWUgPSB0IC0gdGhpcy5wYXVzZVRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICB9XG4gICAgLy8gRlBTXG4gICAgdGhpcy5mcmFtZUNvdW50ZXIrKztcbiAgICBpZiAodCAtIHRoaXMub2xkVGltZUZQUyA+IDMpIHtcbiAgICAgIHRoaXMuRlBTID0gdGhpcy5mcmFtZUNvdW50ZXIgLyAodCAtIHRoaXMub2xkVGltZUZQUyk7XG4gICAgICB0aGlzLm9sZFRpbWVGUFMgPSB0O1xuICAgICAgdGhpcy5mcmFtZUNvdW50ZXIgPSAwO1xuICAgIH1cbiAgICB0aGlzLm9sZFRpbWUgPSB0O1xuICB9XG59XG5cbmV4cG9ydCBsZXQgbXlUaW1lciA9IG5ldyBUaW1lKCk7XG4iLCJjbGFzcyBJblB1dCB7XG4gIEtleXM6IG51bWJlcltdO1xuICBLZXlzQ2xpY2s6IG51bWJlcltdO1xuICBNeDogbnVtYmVyO1xuICBNeTogbnVtYmVyO1xuICBNejogbnVtYmVyO1xuICBNZHg6IG51bWJlcjtcbiAgTWR5OiBudW1iZXI7XG4gIE1kejogbnVtYmVyO1xuXG4gIE1vdXNlQ2xpY2tMZWZ0OiBudW1iZXI7XG4gIE1vdXNlQ2xpY2tSaWdodDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKE1vdXNlQ2xpY2s6IG51bWJlcltdLCBLZXlzOiBudW1iZXJbXSkge1xuICAgIHRoaXMuS2V5cyA9IHRoaXMuS2V5c0NsaWNrID0gS2V5cztcbiAgICB0aGlzLk14ID0gdGhpcy5NeSA9IHRoaXMuTXogPSB0aGlzLk1keCA9IHRoaXMuTWR5ID0gdGhpcy5NZHogPSAwO1xuICAgIHRoaXMuTW91c2VDbGlja0xlZnQgPSBNb3VzZUNsaWNrWzBdO1xuICAgIHRoaXMuTW91c2VDbGlja1JpZ2h0ID0gTW91c2VDbGlja1sxXTtcbiAgfVxuXG4gIHJlc3BvbnNlKE06IG51bWJlcltdLCBNb3VzZUNsaWNrOiBudW1iZXJbXSwgV2hlZWw6IG51bWJlciwgS2V5czogbnVtYmVyW10pIHtcbiAgICAvLyBpZiAoS2V5c1sxN10gIT0gMClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgIHRoaXMuS2V5c0NsaWNrW2ldID0gS2V5c1tpXSAmJiAhdGhpcy5LZXlzW2ldID8gMSA6IDA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICAgIHRoaXMuS2V5c1tpXSA9IEtleXNbaV07XG4gICAgfVxuXG4gICAgdGhpcy5NZHggPSBNWzBdO1xuICAgIHRoaXMuTWR5ID0gTVsxXTtcblxuICAgIC8vIHRoaXMuTXggPSBNWzBdO1xuICAgIC8vIHRoaXMuTXkgPSBNWzFdO1xuICAgIHRoaXMuTWR6ID0gV2hlZWw7XG4gICAgdGhpcy5NeiArPSBXaGVlbDtcblxuICAgIHRoaXMuTW91c2VDbGlja0xlZnQgPSBNb3VzZUNsaWNrWzBdO1xuICAgIHRoaXMuTW91c2VDbGlja1JpZ2h0ID0gTW91c2VDbGlja1sxXTtcbiAgfVxufSAvLyBFbmQgb2YgJ0lucHV0JyBmdW5jdGlvblxuXG5leHBvcnQgbGV0IG15SW5wdXQgPSBuZXcgSW5QdXQoWzAsIDBdLCBbXSk7XG4iLCJleHBvcnQgY2xhc3MgX3ZlYzMge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgejogbnVtYmVyO1xuICBjb25zdHJ1Y3Rvcih4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB6MTogbnVtYmVyKSB7XG4gICAgdGhpcy54ID0geDE7XG4gICAgdGhpcy55ID0geTE7XG4gICAgdGhpcy56ID0gejE7XG4gIH1cblxuICBzdGF0aWMgc2V0KHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHoxOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IF92ZWMzKHgxLCB5MSwgejEpO1xuICB9XG5cbiAgc3RhdGljIGFkZChiOiBfdmVjMywgYTogX3ZlYzMpIHtcbiAgICByZXR1cm4gbmV3IF92ZWMzKGEueCArIGIueCwgYS55ICsgYi55LCBhLnogKyBiLnopO1xuICB9XG5cbiAgc3RhdGljIHN1YihhOiBfdmVjMywgYjogX3ZlYzMpIHtcbiAgICByZXR1cm4gbmV3IF92ZWMzKGEueCAtIGIueCwgYS55IC0gYi55LCBhLnogLSBiLnopO1xuICB9XG5cbiAgc3RhdGljIG11bG51bShhOiBfdmVjMywgYjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBfdmVjMyhhLnggKiBiLCBhLnkgKiBiLCBhLnogKiBiKTtcbiAgfVxuXG4gIHN0YXRpYyBkaXZudW0oYTogX3ZlYzMsIGI6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgX3ZlYzMoYS54IC8gYiwgYS55IC8gYiwgYS56IC8gYik7XG4gIH1cblxuICBzdGF0aWMgbmVnKGE6IF92ZWMzKSB7XG4gICAgcmV0dXJuIG5ldyBfdmVjMygtYS54LCAtYS55LCAtYS56KTtcbiAgfVxuXG4gIHN0YXRpYyBkb3QoYTogX3ZlYzMsIGI6IF92ZWMzKSB7XG4gICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIuejtcbiAgfVxuXG4gIHN0YXRpYyBjcm9zcyhhOiBfdmVjMywgYjogX3ZlYzMpIHtcbiAgICByZXR1cm4gbmV3IF92ZWMzKFxuICAgICAgYS55ICogYi56IC0gYS56ICogYi55LFxuICAgICAgYS56ICogYi54IC0gYS54ICogYi56LFxuICAgICAgYS54ICogYi55IC0gYi54ICogYS55XG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBsZW4yKGE6IF92ZWMzKSB7XG4gICAgcmV0dXJuIGEueCAqIGEueCArIGEueSAqIGEueSArIGEueiAqIGEuejtcbiAgfVxuXG4gIC8vICByZXR1cm4gVmVjM1NldChcbiAgLy8gICAgIFAuWCAqIE0uTVswXVswXSArIFAuWSAqIE0uTVsxXVswXSArIFAuWiAqIE0uTVsyXVswXSArIE0uTVszXVswXSxcbiAgLy8gICAgIFAuWCAqIE0uTVswXVsxXSArIFAuWSAqIE0uTVsxXVsxXSArIFAuWiAqIE0uTVsyXVsxXSArIE0uTVszXVsxXSxcbiAgLy8gICAgIFAuWCAqIE0uTVswXVsyXSArIFAuWSAqIE0uTVsxXVsyXSArIFAuWiAqIE0uTVsyXVsyXSArIE0uTVszXVsyXVxuXG4gIHN0YXRpYyBsZW4oYTogX3ZlYzMpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnNxcnQoX3ZlYzMubGVuMihhKSk7XG4gIH1cblxuICBzdGF0aWMgbm9ybWFsaXplKGE6IF92ZWMzKSB7XG4gICAgcmV0dXJuIF92ZWMzLmRpdm51bShhLCBfdmVjMy5sZW4oYSkpO1xuICB9XG5cbiAgc3RhdGljIHZlYzMoYTogX3ZlYzMpIHtcbiAgICByZXR1cm4gW2EueCwgYS55LCBhLnpdO1xuICB9XG59XG4iLCJpbXBvcnQgeyBfdmVjMyB9IGZyb20gXCIuL21hdGh2ZWMzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBEMlIoZGVncmVlOiBudW1iZXIpIHtcbiAgcmV0dXJuIChkZWdyZWUgKiBNYXRoLlBJKSAvIDE4MDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFIyRChyYWRpYW46IG51bWJlcikge1xuICByZXR1cm4gKHJhZGlhbiAvIE1hdGguUEkpICogMTgwO1xufVxuXG5leHBvcnQgY2xhc3MgX21hdHI0IHtcbiAgYTogbnVtYmVyW11bXTtcbiAgY29uc3RydWN0b3IoXG4gICAgYTAwOiBudW1iZXIsXG4gICAgYTAxOiBudW1iZXIsXG4gICAgYTAyOiBudW1iZXIsXG4gICAgYTAzOiBudW1iZXIsXG4gICAgYTEwOiBudW1iZXIsXG4gICAgYTExOiBudW1iZXIsXG4gICAgYTEyOiBudW1iZXIsXG4gICAgYTEzOiBudW1iZXIsXG4gICAgYTIwOiBudW1iZXIsXG4gICAgYTIxOiBudW1iZXIsXG4gICAgYTIyOiBudW1iZXIsXG4gICAgYTIzOiBudW1iZXIsXG4gICAgYTMwOiBudW1iZXIsXG4gICAgYTMxOiBudW1iZXIsXG4gICAgYTMyOiBudW1iZXIsXG4gICAgYTMzOiBudW1iZXJcbiAgKSB7XG4gICAgdGhpcy5hID0gW1xuICAgICAgW2EwMCwgYTAxLCBhMDIsIGEwM10sXG4gICAgICBbYTEwLCBhMTEsIGExMiwgYTEzXSxcbiAgICAgIFthMjAsIGEyMSwgYTIyLCBhMjNdLFxuICAgICAgW2EzMCwgYTMxLCBhMzIsIGEzM11cbiAgICBdO1xuICB9XG5cbiAgc3RhdGljIGlkZW50aXR5KCkge1xuICAgIHJldHVybiBuZXcgX21hdHI0KDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEpLmE7XG4gIH1cbiAgc3RhdGljIHNldChcbiAgICBhMDA6IG51bWJlcixcbiAgICBhMDE6IG51bWJlcixcbiAgICBhMDI6IG51bWJlcixcbiAgICBhMDM6IG51bWJlcixcbiAgICBhMTA6IG51bWJlcixcbiAgICBhMTE6IG51bWJlcixcbiAgICBhMTI6IG51bWJlcixcbiAgICBhMTM6IG51bWJlcixcbiAgICBhMjA6IG51bWJlcixcbiAgICBhMjE6IG51bWJlcixcbiAgICBhMjI6IG51bWJlcixcbiAgICBhMjM6IG51bWJlcixcbiAgICBhMzA6IG51bWJlcixcbiAgICBhMzE6IG51bWJlcixcbiAgICBhMzI6IG51bWJlcixcbiAgICBhMzM6IG51bWJlclxuICApIHtcbiAgICByZXR1cm4gbmV3IF9tYXRyNChcbiAgICAgIGEwMCxcbiAgICAgIGEwMSxcbiAgICAgIGEwMixcbiAgICAgIGEwMyxcbiAgICAgIGExMCxcbiAgICAgIGExMSxcbiAgICAgIGExMixcbiAgICAgIGExMyxcbiAgICAgIGEyMCxcbiAgICAgIGEyMSxcbiAgICAgIGEyMixcbiAgICAgIGEyMyxcbiAgICAgIGEzMCxcbiAgICAgIGEzMSxcbiAgICAgIGEzMixcbiAgICAgIGEzM1xuICAgICkuYTtcbiAgfVxuICBzdGF0aWMgdHJhbnNsYXRlKGE6IF92ZWMzKSB7XG4gICAgcmV0dXJuIG5ldyBfbWF0cjQoMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgYS54LCBhLnksIGEueiwgMSkuYTtcbiAgfVxuICBzdGF0aWMgc2NhbGUoYTogX3ZlYzMpIHtcbiAgICByZXR1cm4gbmV3IF9tYXRyNChhLngsIDAsIDAsIDAsIDAsIGEueSwgMCwgMCwgMCwgMCwgYS56LCAwLCAwLCAwLCAwLCAxKS5hO1xuICB9XG5cbiAgc3RhdGljIHJvdGF0ZVooZGVncmVlOiBudW1iZXIpIHtcbiAgICBjb25zdCByID0gRDJSKGRlZ3JlZSksXG4gICAgICBjbyA9IE1hdGguY29zKHIpLFxuICAgICAgc2kgPSBNYXRoLnNpbihyKTtcbiAgICBsZXQgbSA9IF9tYXRyNC5pZGVudGl0eSgpO1xuICAgIG1bMF1bMF0gPSBjbztcbiAgICBtWzFdWzBdID0gLXNpO1xuICAgIG1bMF1bMV0gPSBzaTtcbiAgICBtWzFdWzFdID0gY287XG5cbiAgICByZXR1cm4gbTtcbiAgfVxuICBzdGF0aWMgcm90YXRlWChkZWdyZWU6IG51bWJlcikge1xuICAgIGNvbnN0IHIgPSBEMlIoZGVncmVlKSxcbiAgICAgIGNvID0gTWF0aC5jb3MociksXG4gICAgICBzaSA9IE1hdGguc2luKHIpO1xuICAgIGxldCBtID0gX21hdHI0LmlkZW50aXR5KCk7XG5cbiAgICBtWzFdWzFdID0gY287XG4gICAgbVsyXVsxXSA9IC1zaTtcbiAgICBtWzFdWzJdID0gc2k7XG4gICAgbVsyXVsyXSA9IGNvO1xuXG4gICAgcmV0dXJuIG07XG4gIH1cblxuICBzdGF0aWMgcm90YXRlWShkZWdyZWU6IG51bWJlcikge1xuICAgIGNvbnN0IHIgPSBEMlIoZGVncmVlKSxcbiAgICAgIGNvID0gTWF0aC5jb3MociksXG4gICAgICBzaSA9IE1hdGguc2luKHIpO1xuICAgIGxldCBtID0gX21hdHI0LmlkZW50aXR5KCk7XG5cbiAgICBtWzBdWzBdID0gY287XG4gICAgbVsyXVswXSA9IHNpO1xuICAgIG1bMF1bMl0gPSAtc2k7XG4gICAgbVsyXVsyXSA9IGNvO1xuXG4gICAgcmV0dXJuIG07XG4gIH1cblxuICBzdGF0aWMgbXVsbWF0cihtMTogbnVtYmVyW11bXSwgbTI6IG51bWJlcltdW10pIHtcbiAgICBsZXQgciA9IF9tYXRyNC5zZXQoMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCksXG4gICAgICBrID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA0OyBqKyspIHtcbiAgICAgICAgZm9yIChyW2ldW2pdID0gMCwgayA9IDA7IGsgPCA0OyBrKyspIHtcbiAgICAgICAgICByW2ldW2pdICs9IG0xW2ldW2tdICogbTJba11bal07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBzdGF0aWMgdHJhbnNwb3NlKG06IG51bWJlcltdW10pIHtcbiAgICBsZXQgciA9IF9tYXRyNC5zZXQoMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNDsgaisrKSB7XG4gICAgICAgIHJbaV1bal0gPSBtW2pdW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIHN0YXRpYyBkZXRlcm0zeDMoXG4gICAgYTExOiBudW1iZXIsXG4gICAgYTEyOiBudW1iZXIsXG4gICAgYTEzOiBudW1iZXIsXG4gICAgYTIxOiBudW1iZXIsXG4gICAgYTIyOiBudW1iZXIsXG4gICAgYTIzOiBudW1iZXIsXG4gICAgYTMxOiBudW1iZXIsXG4gICAgYTMyOiBudW1iZXIsXG4gICAgYTMzOiBudW1iZXJcbiAgKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGExMSAqIGEyMiAqIGEzMyAtXG4gICAgICBhMTEgKiBhMjMgKiBhMzIgLVxuICAgICAgYTEyICogYTIxICogYTMzICtcbiAgICAgIGExMiAqIGEyMyAqIGEzMSArXG4gICAgICBhMTMgKiBhMjEgKiBhMzIgLVxuICAgICAgYTEzICogYTIyICogYTMxXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBkZXRlcm0obTogbnVtYmVyW11bXSkge1xuICAgIHJldHVybiAoXG4gICAgICBtWzBdWzBdICpcbiAgICAgICAgX21hdHI0LmRldGVybTN4MyhcbiAgICAgICAgICBtWzFdWzFdLFxuICAgICAgICAgIG1bMV1bMl0sXG4gICAgICAgICAgbVsxXVszXSxcbiAgICAgICAgICBtWzJdWzFdLFxuICAgICAgICAgIG1bMl1bMl0sXG4gICAgICAgICAgbVsyXVszXSxcbiAgICAgICAgICBtWzNdWzFdLFxuICAgICAgICAgIG1bM11bMl0sXG4gICAgICAgICAgbVszXVszXVxuICAgICAgICApIC1cbiAgICAgIG1bMF1bMV0gKlxuICAgICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxuICAgICAgICAgIG1bMV1bMF0sXG4gICAgICAgICAgbVsxXVsyXSxcbiAgICAgICAgICBtWzFdWzNdLFxuICAgICAgICAgIG1bMl1bMF0sXG4gICAgICAgICAgbVsyXVsyXSxcbiAgICAgICAgICBtWzJdWzNdLFxuICAgICAgICAgIG1bM11bMF0sXG4gICAgICAgICAgbVszXVsyXSxcbiAgICAgICAgICBtWzNdWzNdXG4gICAgICAgICkgK1xuICAgICAgbVswXVsyXSAqXG4gICAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgICAgbVsxXVswXSxcbiAgICAgICAgICBtWzFdWzFdLFxuICAgICAgICAgIG1bMV1bM10sXG4gICAgICAgICAgbVsyXVswXSxcbiAgICAgICAgICBtWzJdWzFdLFxuICAgICAgICAgIG1bMl1bM10sXG4gICAgICAgICAgbVszXVswXSxcbiAgICAgICAgICBtWzNdWzFdLFxuICAgICAgICAgIG1bM11bM11cbiAgICAgICAgKSAtXG4gICAgICBtWzBdWzNdICpcbiAgICAgICAgX21hdHI0LmRldGVybTN4MyhcbiAgICAgICAgICBtWzFdWzBdLFxuICAgICAgICAgIG1bMV1bMV0sXG4gICAgICAgICAgbVsxXVsyXSxcbiAgICAgICAgICBtWzJdWzBdLFxuICAgICAgICAgIG1bMl1bMV0sXG4gICAgICAgICAgbVsyXVsyXSxcbiAgICAgICAgICBtWzNdWzBdLFxuICAgICAgICAgIG1bM11bMV0sXG4gICAgICAgICAgbVszXVsyXVxuICAgICAgICApXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBpbnZlcnNlKG06IG51bWJlcltdW10pIHtcbiAgICBjb25zdCBkZXQgPSBfbWF0cjQuZGV0ZXJtKG0pO1xuICAgIGxldCByID0gX21hdHI0LmlkZW50aXR5KCk7XG4gICAgaWYgKGRldCA9PT0gMCkgcmV0dXJuIHI7XG4gICAgclswXVswXSA9XG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxuICAgICAgICBtWzFdWzFdLFxuICAgICAgICBtWzFdWzJdLFxuICAgICAgICBtWzFdWzNdLFxuICAgICAgICBtWzJdWzFdLFxuICAgICAgICBtWzJdWzJdLFxuICAgICAgICBtWzJdWzNdLFxuICAgICAgICBtWzNdWzFdLFxuICAgICAgICBtWzNdWzJdLFxuICAgICAgICBtWzNdWzNdXG4gICAgICApIC8gZGV0O1xuXG4gICAgclsxXVswXSA9XG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxuICAgICAgICBtWzFdWzBdLFxuICAgICAgICBtWzFdWzJdLFxuICAgICAgICBtWzFdWzNdLFxuICAgICAgICBtWzJdWzBdLFxuICAgICAgICBtWzJdWzJdLFxuICAgICAgICBtWzJdWzNdLFxuICAgICAgICBtWzNdWzBdLFxuICAgICAgICBtWzNdWzJdLFxuICAgICAgICBtWzNdWzNdXG4gICAgICApIC8gLWRldDtcbiAgICByWzJdWzBdID1cbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgIG1bMV1bMF0sXG4gICAgICAgIG1bMV1bMV0sXG4gICAgICAgIG1bMV1bM10sXG4gICAgICAgIG1bMl1bMF0sXG4gICAgICAgIG1bMl1bMV0sXG4gICAgICAgIG1bMl1bM10sXG4gICAgICAgIG1bM11bMF0sXG4gICAgICAgIG1bM11bMV0sXG4gICAgICAgIG1bM11bM11cbiAgICAgICkgLyBkZXQ7XG4gICAgclszXVswXSA9XG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxuICAgICAgICBtWzFdWzBdLFxuICAgICAgICBtWzFdWzFdLFxuICAgICAgICBtWzFdWzJdLFxuICAgICAgICBtWzJdWzBdLFxuICAgICAgICBtWzJdWzFdLFxuICAgICAgICBtWzJdWzJdLFxuICAgICAgICBtWzNdWzBdLFxuICAgICAgICBtWzNdWzFdLFxuICAgICAgICBtWzNdWzJdXG4gICAgICApIC8gLWRldDtcblxuICAgIHJbMF1bMV0gPVxuICAgICAgX21hdHI0LmRldGVybTN4MyhcbiAgICAgICAgbVswXVsxXSxcbiAgICAgICAgbVswXVsyXSxcbiAgICAgICAgbVswXVszXSxcbiAgICAgICAgbVsyXVsxXSxcbiAgICAgICAgbVsyXVsyXSxcbiAgICAgICAgbVsyXVszXSxcbiAgICAgICAgbVszXVsxXSxcbiAgICAgICAgbVszXVsyXSxcbiAgICAgICAgbVszXVszXVxuICAgICAgKSAvIC1kZXQ7XG5cbiAgICByWzFdWzFdID1cbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgIG1bMF1bMF0sXG4gICAgICAgIG1bMF1bMl0sXG4gICAgICAgIG1bMF1bM10sXG4gICAgICAgIG1bMl1bMF0sXG4gICAgICAgIG1bMl1bMl0sXG4gICAgICAgIG1bMl1bM10sXG4gICAgICAgIG1bM11bMF0sXG4gICAgICAgIG1bM11bMl0sXG4gICAgICAgIG1bM11bM11cbiAgICAgICkgLyBkZXQ7XG5cbiAgICByWzJdWzFdID1cbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgIG1bMF1bMF0sXG4gICAgICAgIG1bMF1bMV0sXG4gICAgICAgIG1bMF1bM10sXG4gICAgICAgIG1bMl1bMF0sXG4gICAgICAgIG1bMl1bMV0sXG4gICAgICAgIG1bMl1bM10sXG4gICAgICAgIG1bM11bMF0sXG4gICAgICAgIG1bM11bMV0sXG4gICAgICAgIG1bM11bM11cbiAgICAgICkgLyAtZGV0O1xuICAgIHJbM11bMV0gPVxuICAgICAgX21hdHI0LmRldGVybTN4MyhcbiAgICAgICAgbVswXVswXSxcbiAgICAgICAgbVswXVsxXSxcbiAgICAgICAgbVswXVsyXSxcbiAgICAgICAgbVsyXVswXSxcbiAgICAgICAgbVsyXVsxXSxcbiAgICAgICAgbVsyXVsyXSxcbiAgICAgICAgbVszXVswXSxcbiAgICAgICAgbVszXVsxXSxcbiAgICAgICAgbVszXVsyXVxuICAgICAgKSAvIGRldDtcbiAgICByWzBdWzJdID1cbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgIG1bMF1bMV0sXG4gICAgICAgIG1bMF1bMl0sXG4gICAgICAgIG1bMF1bM10sXG4gICAgICAgIG1bMV1bMV0sXG4gICAgICAgIG1bMV1bMl0sXG4gICAgICAgIG1bMV1bM10sXG4gICAgICAgIG1bM11bMV0sXG4gICAgICAgIG1bM11bMl0sXG4gICAgICAgIG1bM11bM11cbiAgICAgICkgLyBkZXQ7XG4gICAgclsxXVsyXSA9XG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxuICAgICAgICBtWzBdWzBdLFxuICAgICAgICBtWzBdWzJdLFxuICAgICAgICBtWzBdWzNdLFxuICAgICAgICBtWzFdWzBdLFxuICAgICAgICBtWzFdWzJdLFxuICAgICAgICBtWzFdWzNdLFxuICAgICAgICBtWzNdWzBdLFxuICAgICAgICBtWzNdWzJdLFxuICAgICAgICBtWzNdWzNdXG4gICAgICApIC8gLWRldDtcbiAgICByWzJdWzJdID1cbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgIG1bMF1bMF0sXG4gICAgICAgIG1bMF1bMV0sXG4gICAgICAgIG1bMF1bM10sXG4gICAgICAgIG1bMV1bMF0sXG4gICAgICAgIG1bMV1bMV0sXG4gICAgICAgIG1bMV1bM10sXG4gICAgICAgIG1bM11bMF0sXG4gICAgICAgIG1bM11bMV0sXG4gICAgICAgIG1bM11bM11cbiAgICAgICkgLyBkZXQ7XG4gICAgclszXVsyXSA9XG4gICAgICBfbWF0cjQuZGV0ZXJtM3gzKFxuICAgICAgICBtWzBdWzBdLFxuICAgICAgICBtWzBdWzFdLFxuICAgICAgICBtWzBdWzJdLFxuICAgICAgICBtWzFdWzBdLFxuICAgICAgICBtWzJdWzFdLFxuICAgICAgICBtWzFdWzJdLFxuICAgICAgICBtWzNdWzBdLFxuICAgICAgICBtWzNdWzFdLFxuICAgICAgICBtWzNdWzJdXG4gICAgICApIC8gLWRldDtcbiAgICByWzBdWzNdID1cbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgIG1bMF1bMV0sXG4gICAgICAgIG1bMF1bMl0sXG4gICAgICAgIG1bMF1bM10sXG4gICAgICAgIG1bMV1bMV0sXG4gICAgICAgIG1bMV1bMl0sXG4gICAgICAgIG1bMV1bM10sXG4gICAgICAgIG1bMl1bMV0sXG4gICAgICAgIG1bMl1bMl0sXG4gICAgICAgIG1bMl1bM11cbiAgICAgICkgLyAtZGV0O1xuICAgIHJbMV1bM10gPVxuICAgICAgX21hdHI0LmRldGVybTN4MyhcbiAgICAgICAgbVswXVswXSxcbiAgICAgICAgbVswXVsyXSxcbiAgICAgICAgbVswXVszXSxcbiAgICAgICAgbVsxXVswXSxcbiAgICAgICAgbVsxXVsyXSxcbiAgICAgICAgbVsxXVszXSxcbiAgICAgICAgbVsyXVswXSxcbiAgICAgICAgbVsyXVsyXSxcbiAgICAgICAgbVsyXVszXVxuICAgICAgKSAvIGRldDtcbiAgICByWzJdWzNdID1cbiAgICAgIF9tYXRyNC5kZXRlcm0zeDMoXG4gICAgICAgIG1bMF1bMF0sXG4gICAgICAgIG1bMF1bMV0sXG4gICAgICAgIG1bMF1bM10sXG4gICAgICAgIG1bMV1bMF0sXG4gICAgICAgIG1bMV1bMV0sXG4gICAgICAgIG1bMV1bM10sXG4gICAgICAgIG1bMl1bMF0sXG4gICAgICAgIG1bMl1bMV0sXG4gICAgICAgIG1bMl1bM11cbiAgICAgICkgLyAtZGV0O1xuICAgIHJbM11bM10gPVxuICAgICAgX21hdHI0LmRldGVybTN4MyhcbiAgICAgICAgbVswXVswXSxcbiAgICAgICAgbVswXVsxXSxcbiAgICAgICAgbVswXVsyXSxcbiAgICAgICAgbVsxXVswXSxcbiAgICAgICAgbVsyXVsxXSxcbiAgICAgICAgbVsxXVsyXSxcbiAgICAgICAgbVsyXVswXSxcbiAgICAgICAgbVsyXVsxXSxcbiAgICAgICAgbVsyXVsyXVxuICAgICAgKSAvIGRldDtcbiAgICByZXR1cm4gcjtcbiAgfVxuICBzdGF0aWMgZnJ1c3R1bShcbiAgICBsOiBudW1iZXIsXG4gICAgcjogbnVtYmVyLFxuICAgIGI6IG51bWJlcixcbiAgICB0OiBudW1iZXIsXG4gICAgbjogbnVtYmVyLFxuICAgIGY6IG51bWJlclxuICApIHtcbiAgICBsZXQgbSA9IF9tYXRyNC5pZGVudGl0eSgpO1xuXG4gICAgbVswXVswXSA9ICgyICogbikgLyAociAtIGwpO1xuICAgIG1bMF1bMV0gPSAwO1xuICAgIG1bMF1bMl0gPSAwO1xuICAgIG1bMF1bM10gPSAwO1xuXG4gICAgbVsxXVswXSA9IDA7XG4gICAgbVsxXVsxXSA9ICgyICogbikgLyAodCAtIGIpO1xuICAgIG1bMV1bMl0gPSAwO1xuICAgIG1bMV1bM10gPSAwO1xuXG4gICAgbVsyXVswXSA9IChyICsgbCkgLyAociAtIGwpO1xuICAgIG1bMl1bMV0gPSAodCArIGIpIC8gKHQgLSBiKTtcbiAgICBtWzJdWzJdID0gKGYgKyBuKSAvIC0oZiAtIG4pO1xuICAgIG1bMl1bM10gPSAtMTtcblxuICAgIG1bM11bMF0gPSAwO1xuICAgIG1bM11bMV0gPSAwO1xuICAgIG1bM11bMl0gPSAoLTIgKiBuICogZikgLyAoZiAtIG4pO1xuICAgIG1bM11bM10gPSAwO1xuXG4gICAgcmV0dXJuIG07XG4gIH1cblxuICBzdGF0aWMgdG9hcnIobTogbnVtYmVyW11bXSkge1xuICAgIGxldCB2ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgZm9yIChsZXQgZyA9IDA7IGcgPCA0OyBnKyspIHtcbiAgICAgICAgdi5wdXNoKG1baV1bZ10pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2O1xuICB9XG5cbiAgc3RhdGljIHBvaW50X3RyYW5zZm9ybShhOiBfdmVjMywgYjogbnVtYmVyW11bXSkge1xuICAgIHJldHVybiBuZXcgX3ZlYzMoXG4gICAgICBhLnggKiBiWzBdWzBdICsgYS55ICogYlsxXVswXSArIGEueiAqIGJbMl1bMF0gKyBiWzNdWzBdLFxuICAgICAgYS54ICogYlswXVsxXSArIGEueSAqIGJbMV1bMV0gKyBhLnogKiBiWzJdWzFdICsgYlszXVsxXSxcbiAgICAgIGEueCAqIGJbMF1bMl0gKyBhLnkgKiBiWzFdWzJdICsgYS56ICogYlsyXVsyXSArIGJbM11bMl1cbiAgICApO1xuICB9XG5cbiAgc3RhdGljIHZlY3RvcnRfcmFuc2Zvcm0oYTogX3ZlYzMsIGI6IG51bWJlcltdW10pIHtcbiAgICByZXR1cm4gbmV3IF92ZWMzKFxuICAgICAgYS54ICogYlswXVswXSArIGEueSAqIGJbMV1bMF0gKyBhLnogKiBiWzJdWzBdLFxuICAgICAgYS54ICogYlswXVsxXSArIGEueSAqIGJbMV1bMV0gKyBhLnogKiBiWzJdWzFdLFxuICAgICAgYS54ICogYlswXVsyXSArIGEueSAqIGJbMV1bMl0gKyBhLnogKiBiWzJdWzJdXG4gICAgKTtcbiAgfVxuICBzdGF0aWMgbXVsX21hdHIoYTogX3ZlYzMsIGI6IG51bWJlcltdW10pIHtcbiAgICBjb25zdCB3ID0gYS54ICogYlswXVszXSArIGEueSAqIGJbMV1bM10gKyBhLnogKiBiWzJdWzNdICsgYlszXVszXTtcbiAgICByZXR1cm4gbmV3IF92ZWMzKFxuICAgICAgKGEueCAqIGJbMF1bMF0gKyBhLnkgKiBiWzFdWzBdICsgYS56ICogYlsyXVswXSArIGJbM11bMF0pIC8gdyxcbiAgICAgIChhLnkgKiBiWzBdWzFdICsgYS55ICogYlsxXVsxXSArIGEueiAqIGJbMl1bMV0gKyBiWzNdWzFdKSAvIHcsXG4gICAgICAoYS56ICogYlswXVsyXSArIGEueSAqIGJbMV1bMl0gKyBhLnogKiBiWzJdWzJdICsgYlszXVsyXSkgLyB3XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgX3ZlYzMgfSBmcm9tIFwiLi9tYXRoL21hdGh2ZWMzXCI7XG5pbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi9tYXRoL21hdGhtYXQ0XCI7XG5cblxuZXhwb3J0IGNsYXNzIHN1cmZhY2Uge1xuICBOYW1lOiBzdHJpbmcgPSBcIkRlZmF1bHRcIjtcbiAgS2E6IF92ZWMzID0gX3ZlYzMuc2V0KDAuMSwgMC4xLCAwLjEpO1xuICBLZDogX3ZlYzMgPSBfdmVjMy5zZXQoMC45LCAwLjksIDAuOSk7XG4gIEtzOiBfdmVjMyA9IF92ZWMzLnNldCgwLjMsIDAuMywgMC4zKTtcbiAgUGg6IG51bWJlciA9IDMwO1xuICBLcjogX3ZlYzMgPSBfdmVjMy5zZXQoMCwgMCwgMCk7XG4gIEt0OiBfdmVjMyA9IF92ZWMzLnNldCgwLCAwLCAwKTtcbiAgUmVmcmFjdGlvbkNvZWY6IG51bWJlciA9IDA7XG4gIERlY2F5OiBudW1iZXIgPSAwO1xuICBHZXRBcnJheSgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgLi4uX3ZlYzMudmVjMyh0aGlzLkthKSxcbiAgICAgIDEsXG4gICAgICAuLi5fdmVjMy52ZWMzKHRoaXMuS2QpLFxuICAgICAgMSxcbiAgICAgIC4uLl92ZWMzLnZlYzModGhpcy5LcyksXG4gICAgICB0aGlzLlBoLFxuICAgICAgLi4uX3ZlYzMudmVjMyh0aGlzLktyKSxcbiAgICAgIHRoaXMuUmVmcmFjdGlvbkNvZWYsXG4gICAgICAuLi5fdmVjMy52ZWMzKHRoaXMuS3QpLFxuICAgICAgdGhpcy5EZWNheVxuICAgIF07XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIHNoYXBlIHtcbiAgT2JqOiBudW1iZXJbXVtdID0gX21hdHI0LmlkZW50aXR5KCk7IFxuICBNYXRyaXg6IG51bWJlcltdW10gPSBfbWF0cjQuaWRlbnRpdHkoKTtcbiAgVHlwZVNoYXBlOiBudW1iZXIgPSAwO1xuICBNYXRlcmlhbDogbnVtYmVyID0gMDsgXG4gIEdldEFycmF5KCkge1xuICAgIHJldHVybiBbLi4uX21hdHI0LnRvYXJyKHRoaXMuT2JqKSwgLi4uX21hdHI0LnRvYXJyKHRoaXMuTWF0cml4KSwgdGhpcy5UeXBlU2hhcGUsIHRoaXMuTWF0ZXJpYWwsIDAsIDBdO1xuICB9XG59XG5cbmV4cG9ydCBsZXQgU2hhcGVzOiBzaGFwZVtdID0gW107XG5leHBvcnQgbGV0IFN1cmZhY2VzOiBzdXJmYWNlW10gPSBbXTtcblxuXG5leHBvcnQgZnVuY3Rpb24gR2V0QXJyYXlPYmplY3RzKCkge1xuICBsZXQgUmVzdWx0ID0gW1NoYXBlcy5sZW5ndGgsIDAsIDAsIDBdO1xuICBmb3IgKGxldCBlbGVtZW50IG9mIFNoYXBlcykge1xuICAgIFJlc3VsdCA9IFJlc3VsdC5jb25jYXQoZWxlbWVudC5HZXRBcnJheSgpKTtcbiAgfVxuICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheShSZXN1bHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gR2V0QXJyYXlTdXJmYWNlcygpIHtcbiAgbGV0IFJlc3VsdCA9IFtTdXJmYWNlcy5sZW5ndGgsIDAsIDAsIDBdO1xuICBmb3IgKGxldCBlbGVtZW50IG9mIFN1cmZhY2VzKSB7XG4gICAgUmVzdWx0ID0gUmVzdWx0LmNvbmNhdChlbGVtZW50LkdldEFycmF5KCkpO1xuICB9XG4gIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFJlc3VsdCk7XG59XG4iLCJpbXBvcnQgeyBfdmVjMyB9IGZyb20gXCIuLi9tYXRoL21hdGh2ZWMzXCI7XG5pbXBvcnQgeyBTaGFwZXMsIFN1cmZhY2VzLCBzaGFwZSwgc3VyZmFjZSB9IGZyb20gXCIuLi9vYmplY3RzXCI7XG5cbmltcG9ydCB7IFVib19zZXQxX2RhdGEgfSBmcm9tIFwiLi4vbWFpblwiO1xuaW1wb3J0IHsgX21hdHI0IH0gZnJvbSBcIi4uL21hdGgvbWF0aG1hdDRcIjtcblxuZnVuY3Rpb24gUmVhZFZlYzNmcm9tU3RyaW5nKFN0cjogc3RyaW5nKSB7XG4gIGxldCBoOiBudW1iZXJbXTtcbiAgaWYgKFN0clswXSAhPSBcIntcIiB8fCBTdHJbU3RyLmxlbmd0aCAtIDFdICE9IFwifVwiKSByZXR1cm4gbnVsbDtcbiAgaCA9IFN0ci5zbGljZSgxLCBTdHIubGVuZ3RoIC0gMSlcbiAgICAuc3BsaXQoXCIsXCIpXG4gICAgLm1hcChOdW1iZXIpO1xuXG4gIGlmIChoLmxlbmd0aCA8IDMpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBfdmVjMy5zZXQoaFswXSwgaFsxXSwgaFsyXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZXIoVHh0OiBzdHJpbmcpIHtcbiAgU2hhcGVzLmxlbmd0aCA9IDA7XG4gIFN1cmZhY2VzLmxlbmd0aCA9IDE7XG4gIGxldCBOYW1lOiBzdHJpbmc7XG4gIGxldCBhcnJheU9mU3RyaW5ncyA9IFR4dC5zcGxpdChcIlxcblwiKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheU9mU3RyaW5ncy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChhcnJheU9mU3RyaW5nc1tpXVswXSA9PSBcIi9cIiAmJiBhcnJheU9mU3RyaW5nc1tpXVsxXSA9PSBcIi9cIikgY29udGludWU7XG4gICAgbGV0IHdvcmRzID0gYXJyYXlPZlN0cmluZ3NbaV0uc3BsaXQoXCIgXCIpO1xuICAgIGlmICh3b3Jkcy5sZW5ndGggPT0gMSkgY29udGludWU7XG4gICAgbGV0IFR5cGUgPSB3b3Jkc1swXTtcbiAgICBpZiAoVHlwZSA9PSBcInNjZW5lXCIpIHtcbiAgICAgIGlmICh3b3Jkcy5sZW5ndGggIT0gNikgY29udGludWU7XG4gICAgICBsZXQgeDogX3ZlYzMgfCBudWxsO1xuICAgICAgeCA9IFJlYWRWZWMzZnJvbVN0cmluZyh3b3Jkc1sxXSk7XG4gICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgIFVib19zZXQxX2RhdGEuQW1iaWVudENvbG9yID0geDtcblxuICAgICAgeCA9IFJlYWRWZWMzZnJvbVN0cmluZyh3b3Jkc1syXSk7XG4gICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgIFVib19zZXQxX2RhdGEuQmFja2dyb3VuZENvbG9yID0geDtcblxuICAgICAgVWJvX3NldDFfZGF0YS5SZWZyYWN0aW9uQ29lZiA9IE51bWJlcih3b3Jkc1szXSk7XG4gICAgICBVYm9fc2V0MV9kYXRhLkRlY2F5ID0gTnVtYmVyKHdvcmRzWzRdKTtcbiAgICAgIFVib19zZXQxX2RhdGEuTWF4UmVjTGV2ZWwgPSBOdW1iZXIod29yZHNbNV0pO1xuICAgIH0gZWxzZSBpZiAoVHlwZSA9PSBcInN1cmZhY2VcIikge1xuICAgICAgaWYgKHdvcmRzLmxlbmd0aCAhPSAxMCkgY29udGludWU7XG4gICAgICBsZXQgeDogX3ZlYzMgfCBudWxsO1xuICAgICAgbGV0IFN1cmYgPSBuZXcgc3VyZmFjZSgpO1xuICAgICAgU3VyZi5OYW1lID0gd29yZHNbMV07XG5cbiAgICAgIGxldCBmbGFnID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIFN1cmZhY2VzKSB7XG4gICAgICAgIGlmIChlbGVtZW50Lk5hbWUgPT0gU3VyZi5OYW1lKSB7XG4gICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmbGFnKSBjb250aW51ZTtcblxuICAgICAgeCA9IFJlYWRWZWMzZnJvbVN0cmluZyh3b3Jkc1syXSk7XG4gICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgIFN1cmYuS2EgPSB4O1xuXG4gICAgICB4ID0gUmVhZFZlYzNmcm9tU3RyaW5nKHdvcmRzWzNdKTtcbiAgICAgIGlmICh4ID09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgU3VyZi5LZCA9IHg7XG5cbiAgICAgIHggPSBSZWFkVmVjM2Zyb21TdHJpbmcod29yZHNbNF0pO1xuICAgICAgaWYgKHggPT0gbnVsbCkgY29udGludWU7XG4gICAgICBTdXJmLktzID0geDtcblxuICAgICAgU3VyZi5QaCA9IE51bWJlcih3b3Jkc1s1XSk7XG5cbiAgICAgIHggPSBSZWFkVmVjM2Zyb21TdHJpbmcod29yZHNbNl0pO1xuICAgICAgaWYgKHggPT0gbnVsbCkgY29udGludWU7XG4gICAgICBTdXJmLktyID0geDtcblxuICAgICAgeCA9IFJlYWRWZWMzZnJvbVN0cmluZyh3b3Jkc1s3XSk7XG4gICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgIFN1cmYuS3QgPSB4O1xuXG4gICAgICBTdXJmLlJlZnJhY3Rpb25Db2VmID0gTnVtYmVyKHdvcmRzWzhdKTtcbiAgICAgIFN1cmYuRGVjYXkgPSBOdW1iZXIod29yZHNbOV0pO1xuXG4gICAgICBTdXJmYWNlcy5wdXNoKFN1cmYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaWQgPSAtMTtcbiAgICAgIGxldCB4OiBfdmVjMyB8IG51bGw7XG4gICAgICBsZXQgU3BoID0gbmV3IHNoYXBlKCk7XG5cbiAgICAgIGlmIChUeXBlID09IFwic3BoZXJlXCIpIHtcbiAgICAgICAgaWYgKHdvcmRzLmxlbmd0aCAhPSA2KSBjb250aW51ZTtcbiAgICAgICAgU3BoLk9ialswXVswXSA9IE51bWJlcih3b3Jkc1sxXSk7XG4gICAgICAgIFNwaC5UeXBlU2hhcGUgPSAwO1xuICAgICAgICBpZCA9IDI7XG4gICAgICB9XG4gICAgICBpZiAoVHlwZSA9PSBcImJveFwiKSB7XG4gICAgICAgIGlmICh3b3Jkcy5sZW5ndGggIT0gNikgY29udGludWU7XG4gICAgICAgIHggPSBSZWFkVmVjM2Zyb21TdHJpbmcod29yZHNbMV0pO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgICBTcGguT2JqWzBdWzBdID0geC54O1xuICAgICAgICBTcGguT2JqWzBdWzFdID0geC55O1xuICAgICAgICBTcGguT2JqWzBdWzJdID0geC56O1xuXG4gICAgICAgIFNwaC5UeXBlU2hhcGUgPSAxO1xuICAgICAgICBpZCA9IDI7XG4gICAgICB9XG4gICAgICBpZiAoVHlwZSA9PSBcInJvdW5kX2JveFwiKSB7XG4gICAgICAgIGlmICh3b3Jkcy5sZW5ndGggIT0gNykgY29udGludWU7XG4gICAgICAgIHggPSBSZWFkVmVjM2Zyb21TdHJpbmcod29yZHNbMV0pO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgICBTcGguT2JqWzBdWzBdID0geC54O1xuICAgICAgICBTcGguT2JqWzBdWzFdID0geC55O1xuICAgICAgICBTcGguT2JqWzBdWzJdID0geC56O1xuICAgICAgICBTcGguT2JqWzBdWzNdID0gTnVtYmVyKHdvcmRzWzJdKTtcblxuICAgICAgICBTcGguVHlwZVNoYXBlID0gMjtcbiAgICAgICAgaWQgPSAzO1xuICAgICAgfVxuICAgICAgaWYgKFR5cGUgPT0gXCJ0b3J1c1wiKSB7XG4gICAgICAgIGlmICh3b3Jkcy5sZW5ndGggIT0gNykgY29udGludWU7XG4gICAgICAgIFNwaC5PYmpbMF1bMF0gPSBOdW1iZXIod29yZHNbMV0pO1xuICAgICAgICBTcGguT2JqWzBdWzFdID0gTnVtYmVyKHdvcmRzWzJdKTtcblxuICAgICAgICBTcGguVHlwZVNoYXBlID0gMztcbiAgICAgICAgaWQgPSAzO1xuICAgICAgfVxuICAgICAgaWYgKFR5cGUgPT0gXCJjeWxpbmRlclwiKSB7XG4gICAgICAgIGlmICh3b3Jkcy5sZW5ndGggIT0gNikgY29udGludWU7XG4gICAgICAgIHggPSBSZWFkVmVjM2Zyb21TdHJpbmcod29yZHNbMV0pO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgICBTcGguT2JqWzBdWzBdID0geC54O1xuICAgICAgICBTcGguT2JqWzBdWzFdID0geC55O1xuICAgICAgICBTcGguT2JqWzBdWzJdID0geC56O1xuXG4gICAgICAgIFNwaC5UeXBlU2hhcGUgPSA0O1xuICAgICAgICBpZCA9IDI7XG4gICAgICB9XG4gICAgICBpZiAoaWQgIT0gLTEpIHtcbiAgICAgICAgbGV0IFNjYWxlOiBudW1iZXJbXVtdO1xuICAgICAgICBsZXQgUm90OiBudW1iZXJbXVtdO1xuICAgICAgICBsZXQgVHJhbnM6IG51bWJlcltdW107XG5cbiAgICAgICAgeCA9IFJlYWRWZWMzZnJvbVN0cmluZyh3b3Jkc1tpZF0pO1xuICAgICAgICBpZiAoeCA9PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgVHJhbnMgPSBfbWF0cjQudHJhbnNsYXRlKHgpO1xuXG4gICAgICAgIHggPSBSZWFkVmVjM2Zyb21TdHJpbmcod29yZHNbaWQgKyAxXSk7XG4gICAgICAgIGlmICh4ID09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICBSb3QgPSBfbWF0cjQubXVsbWF0cihcbiAgICAgICAgICBfbWF0cjQubXVsbWF0cihfbWF0cjQucm90YXRlWSh4LngpLCBfbWF0cjQucm90YXRlWSh4LnkpKSxcbiAgICAgICAgICBfbWF0cjQucm90YXRlWih4LnopXG4gICAgICAgICk7XG5cbiAgICAgICAgeCA9IFJlYWRWZWMzZnJvbVN0cmluZyh3b3Jkc1tpZCArIDJdKTtcbiAgICAgICAgaWYgKHggPT0gbnVsbCkgY29udGludWU7XG4gICAgICAgIFNjYWxlID0gX21hdHI0LnNjYWxlKHgpO1xuXG4gICAgICAgIFNwaC5NYXRyaXggPSBfbWF0cjQubXVsbWF0cihfbWF0cjQubXVsbWF0cihTY2FsZSwgUm90KSwgVHJhbnMpO1xuXG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgU3VyZmFjZXMpIHtcbiAgICAgICAgICBpZiAod29yZHNbaWQgKyAzXSA9PSBlbGVtZW50Lk5hbWUpIHtcbiAgICAgICAgICAgIFNwaC5NYXRlcmlhbCA9IGluZGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIFNoYXBlcy5wdXNoKFNwaCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi4vbWF0aC9tYXRobWF0NC5qc1wiO1xuaW1wb3J0IHsgX3ZlYzMgfSBmcm9tIFwiLi4vbWF0aC9tYXRodmVjMy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVWJvX01hdHIge1xuICBDYW1Mb2M6IF92ZWMzO1xuICBDYW1BdDogX3ZlYzM7XG4gIENhbVJpZ2h0OiBfdmVjMztcbiAgQ2FtVXA6IF92ZWMzO1xuICBDYW1EaXI6IF92ZWMzO1xuICBQcm9qRGlzdEZhclRpbWVMb2NhbDogX3ZlYzM7XG4gIFRpbWVHbG9iYWxEZWx0YUdsb2JhbERlbHRhTG9jYWw6IF92ZWMzO1xuICBmbGFnczEyRnJhbWVXOiBfdmVjMztcbiAgZmxhZ3M0NUZyYW1lSDogX3ZlYzM7XG4gIEFtYmllbnRDb2xvcjogX3ZlYzM7XG4gIEJhY2tncm91bmRDb2xvcjogX3ZlYzM7XG4gIFJlZnJhY3Rpb25Db2VmOiBudW1iZXI7XG4gIERlY2F5OiBudW1iZXI7XG4gIE1heFJlY0xldmVsOiBudW1iZXI7XG4gIGNvbnN0cnVjdG9yKFxuICAgIENhbUxvYzogX3ZlYzMsXG4gICAgQ2FtQXQ6IF92ZWMzLFxuICAgIENhbVJpZ2h0OiBfdmVjMyxcbiAgICBDYW1VcDogX3ZlYzMsXG4gICAgQ2FtRGlyOiBfdmVjMyxcbiAgICBQcm9qRGlzdEZhclRpbWVMb2NhbDogX3ZlYzMsXG4gICAgVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbDogX3ZlYzMsXG4gICAgZmxhZ3MxMkZyYW1lVzogX3ZlYzMsXG4gICAgZmxhZ3M0NUZyYW1lSDogX3ZlYzMsXG4gICAgQW1iaWVudENvbG9yOiBfdmVjMyxcbiAgICBCYWNrZ3JvdW5kQ29sb3I6IF92ZWMzLFxuICAgIFJlZnJhY3Rpb25Db2VmOiBudW1iZXIsXG4gICAgRGVjYXk6IG51bWJlcixcbiAgICBNYXhSZWNMZXZlbDogbnVtYmVyXG4gICkge1xuICAgIHRoaXMuQ2FtTG9jID0gQ2FtTG9jO1xuICAgIHRoaXMuQ2FtQXQgPSBDYW1BdDtcbiAgICB0aGlzLkNhbVJpZ2h0ID0gQ2FtUmlnaHQ7XG4gICAgdGhpcy5DYW1VcCA9IENhbVVwO1xuICAgIHRoaXMuQ2FtRGlyID0gQ2FtRGlyO1xuICAgIHRoaXMuUHJvakRpc3RGYXJUaW1lTG9jYWwgPSBQcm9qRGlzdEZhclRpbWVMb2NhbDtcblxuICAgIHRoaXMuVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbCA9IFRpbWVHbG9iYWxEZWx0YUdsb2JhbERlbHRhTG9jYWw7XG4gICAgdGhpcy5mbGFnczEyRnJhbWVXID0gZmxhZ3MxMkZyYW1lVztcbiAgICB0aGlzLmZsYWdzNDVGcmFtZUggPSBmbGFnczQ1RnJhbWVIO1xuICAgIHRoaXMuQW1iaWVudENvbG9yID0gQW1iaWVudENvbG9yO1xuICAgIHRoaXMuQmFja2dyb3VuZENvbG9yID0gQmFja2dyb3VuZENvbG9yO1xuICAgIHRoaXMuUmVmcmFjdGlvbkNvZWYgPSBSZWZyYWN0aW9uQ29lZjtcbiAgICB0aGlzLkRlY2F5ID0gRGVjYXk7XG4gICAgdGhpcy5NYXhSZWNMZXZlbCA9IE1heFJlY0xldmVsO1xuICB9XG4gIEdldEFycmF5KCkge1xuICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgIC4uLl92ZWMzLnZlYzModGhpcy5DYW1Mb2MpLFxuICAgICAgMSxcbiAgICAgIC4uLl92ZWMzLnZlYzModGhpcy5DYW1BdCksXG4gICAgICAxLFxuICAgICAgLi4uX3ZlYzMudmVjMyh0aGlzLkNhbVJpZ2h0KSxcbiAgICAgIDEsXG4gICAgICAuLi5fdmVjMy52ZWMzKHRoaXMuQ2FtVXApLFxuICAgICAgMSxcbiAgICAgIC4uLl92ZWMzLnZlYzModGhpcy5DYW1EaXIpLFxuICAgICAgMSxcbiAgICAgIC4uLl92ZWMzLnZlYzModGhpcy5Qcm9qRGlzdEZhclRpbWVMb2NhbCksXG4gICAgICAxLFxuICAgICAgLi4uX3ZlYzMudmVjMyh0aGlzLlRpbWVHbG9iYWxEZWx0YUdsb2JhbERlbHRhTG9jYWwpLFxuICAgICAgMSxcbiAgICAgIC4uLl92ZWMzLnZlYzModGhpcy5mbGFnczEyRnJhbWVXKSxcbiAgICAgIDEsXG4gICAgICAuLi5fdmVjMy52ZWMzKHRoaXMuZmxhZ3M0NUZyYW1lSCksXG4gICAgICAxLFxuICAgICAgLi4uX3ZlYzMudmVjMyh0aGlzLkFtYmllbnRDb2xvciksXG4gICAgICAxLFxuICAgICAgLi4uX3ZlYzMudmVjMyh0aGlzLkJhY2tncm91bmRDb2xvciksXG4gICAgICAxLFxuICAgICAgdGhpcy5SZWZyYWN0aW9uQ29lZixcbiAgICAgIHRoaXMuRGVjYXksXG4gICAgICB0aGlzLk1heFJlY0xldmVsLFxuICAgICAgMVxuICAgIF0pO1xuICB9XG59XG5cbi8vIHJheTxUeXBlPiBGcmFtZSggVHlwZSBYcywgVHlwZSBZcywgVHlwZSBkeCwgVHlwZSBkeSApIGNvbnN0XG4vLyB7XG4vLyAgIHZlYzM8VHlwZT4gQSA9IERpciAqIFByb2pEaXN0O1xuLy8gICB2ZWMzPFR5cGU+IEIgPSBSaWdodCAqICgoWHMgKyAwLjUgLSBGcmFtZVcgLyAyLjApIC8gRnJhbWVXICogV3ApO1xuLy8gICB2ZWMzPFR5cGU+IEMgPSBVcCAqICgoLShZcyArIDAuNSkgKyBGcmFtZUggLyAyLjApIC8gRnJhbWVIICogSHApO1xuLy8gICB2ZWMzPFR5cGU+IFggPSB2ZWMzPFR5cGU+KEEgKyBCICsgQyk7XG4vLyAgIHJldHVybiAgcmF5PFR5cGU+KFggKyBMb2MsIFguTm9ybWFsaXppbmcoKSk7XG4vLyB9IC8qIEVuZCBvZiAnUmVzaXplJyBmdW5jdGlvbiAqL1xuXG5leHBvcnQgY2xhc3MgVUJPIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1Ym9pZDogV2ViR0xCdWZmZXIgfCBudWxsO1xuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHVib2lkOiBXZWJHTEJ1ZmZlciB8IG51bGwpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudWJvaWQgPSB1Ym9pZDtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUoU2l6ZTogbnVtYmVyLCBuYW1lOiBzdHJpbmcsIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgbGV0IGZyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5VTklGT1JNX0JVRkZFUiwgZnIpO1xuXG4gICAgZ2wuYnVmZmVyRGF0YShnbC5VTklGT1JNX0JVRkZFUiwgU2l6ZSAqIDQsIGdsLlNUQVRJQ19EUkFXKTtcbiAgICByZXR1cm4gbmV3IFVCTyhuYW1lLCBmcik7XG4gIH1cblxuICB1cGRhdGUoVWJvQXJyYXk6IEZsb2F0MzJBcnJheSwgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpIHtcbiAgICBnbC5iaW5kQnVmZmVyKGdsLlVOSUZPUk1fQlVGRkVSLCB0aGlzLnVib2lkKTtcbiAgICBnbC5idWZmZXJTdWJEYXRhKGdsLlVOSUZPUk1fQlVGRkVSLCAwLCBVYm9BcnJheSk7XG4gIH1cblxuICBhcHBseShwb2ludDogbnVtYmVyLCBTaGRObzogV2ViR0xQcm9ncmFtLCBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCkge1xuICAgIGxldCBibGtfbG9jID0gZ2wuZ2V0VW5pZm9ybUJsb2NrSW5kZXgoU2hkTm8sIHRoaXMubmFtZSk7XG5cbiAgICBnbC51bmlmb3JtQmxvY2tCaW5kaW5nKFNoZE5vLCBibGtfbG9jLCBwb2ludCk7XG4gICAgZ2wuYmluZEJ1ZmZlckJhc2UoZ2wuVU5JRk9STV9CVUZGRVIsIHBvaW50LCB0aGlzLnVib2lkKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgX3ZlYzMgfSBmcm9tIFwiLi9tYXRodmVjMy5qc1wiO1xuaW1wb3J0IHsgX21hdHI0IH0gZnJvbSBcIi4vbWF0aG1hdDQuanNcIjtcblxubGV0IFByb2pTaXplID0gMC4xIC8qIFByb2plY3QgcGxhbmUgZml0IHNxdWFyZSAqLyxcbiAgUHJvakRpc3QgPSAwLjEgLyogRGlzdGFuY2UgdG8gcHJvamVjdCBwbGFuZSBmcm9tIHZpZXdlciAobmVhcikgKi8sXG4gIFByb2pGYXJDbGlwID0gMzAwMDsgLyogRGlzdGFuY2UgdG8gcHJvamVjdCBmYXIgY2xpcCBwbGFuZSAoZmFyKSAqL1xuXG5jbGFzcyBfY2FtZXJhIHtcbiAgUHJvalNpemU6IG51bWJlcjtcbiAgUHJvakRpc3Q6IG51bWJlcjtcbiAgUHJvakZhckNsaXA6IG51bWJlcjtcbiAgRnJhbWVXOiBudW1iZXI7XG4gIEZyYW1lSDogbnVtYmVyO1xuICBNYXRyVlA6IG51bWJlcltdW107XG4gIE1hdHJWaWV3OiBudW1iZXJbXVtdO1xuICBNYXRyUHJvajogbnVtYmVyW11bXTtcbiAgTG9jOiBfdmVjMztcbiAgQXQ6IF92ZWMzO1xuICBEaXI6IF92ZWMzO1xuICBVcDogX3ZlYzM7XG4gIFJpZ2h0OiBfdmVjMztcbiAgY29uc3RydWN0b3IoXG4gICAgUHJvalNpemU6IG51bWJlcixcbiAgICBQcm9qRGlzdDogbnVtYmVyLFxuICAgIFByb2pGYXJDbGlwOiBudW1iZXIsXG4gICAgTWF0clZQOiBudW1iZXJbXVtdLFxuICAgIE1hdHJWaWV3OiBudW1iZXJbXVtdLFxuICAgIE1hdHJQcm9qOiBudW1iZXJbXVtdLFxuICAgIExvYzogX3ZlYzMsXG4gICAgQXQ6IF92ZWMzLFxuICAgIERpcjogX3ZlYzMsXG4gICAgVXA6IF92ZWMzLFxuICAgIFJpZ2h0OiBfdmVjMyxcbiAgICBGcmFtZVc6IG51bWJlcixcbiAgICBGcmFtZUg6IG51bWJlclxuICApIHtcbiAgICB0aGlzLlByb2pTaXplID0gUHJvalNpemU7XG4gICAgdGhpcy5Qcm9qRGlzdCA9IFByb2pEaXN0O1xuICAgIHRoaXMuUHJvakZhckNsaXAgPSBQcm9qRmFyQ2xpcDtcbiAgICB0aGlzLk1hdHJWUCA9IE1hdHJWUDtcbiAgICB0aGlzLk1hdHJWaWV3ID0gTWF0clZpZXc7XG4gICAgdGhpcy5NYXRyUHJvaiA9IE1hdHJQcm9qO1xuICAgIHRoaXMuTG9jID0gTG9jO1xuICAgIHRoaXMuQXQgPSBBdDtcbiAgICB0aGlzLkRpciA9IERpcjtcbiAgICB0aGlzLlVwID0gVXA7XG4gICAgdGhpcy5SaWdodCA9IFJpZ2h0O1xuICAgIHRoaXMuRnJhbWVXID0gRnJhbWVXO1xuICAgIHRoaXMuRnJhbWVIID0gRnJhbWVIO1xuICB9XG5cbiAgUHJvalNldCgpIHtcbiAgICBsZXQgcngsIHJ5OiBudW1iZXI7XG5cbiAgICByeCA9IHJ5ID0gUHJvalNpemU7XG5cbiAgICBpZiAodGhpcy5GcmFtZVcgPiB0aGlzLkZyYW1lSCkgcnggKj0gdGhpcy5GcmFtZVcgLyB0aGlzLkZyYW1lSDtcbiAgICBlbHNlIHJ5ICo9IHRoaXMuRnJhbWVIIC8gdGhpcy5GcmFtZVc7XG5cbiAgICBsZXQgV3AgPSByeCxcbiAgICAgIEhwID0gcnk7XG5cbiAgICB0aGlzLk1hdHJQcm9qID0gX21hdHI0LmZydXN0dW0oXG4gICAgICAtcnggLyAyLFxuICAgICAgcnggLyAyLFxuICAgICAgLXJ5IC8gMixcbiAgICAgIHJ5IC8gMixcbiAgICAgIFByb2pEaXN0LFxuICAgICAgUHJvakZhckNsaXBcbiAgICApO1xuICAgIHRoaXMuTWF0clZQID0gX21hdHI0Lm11bG1hdHIodGhpcy5NYXRyVmlldywgdGhpcy5NYXRyUHJvaik7XG4gIH1cblxuICBzdGF0aWMgdmlldyhMb2M6IF92ZWMzLCBBdDogX3ZlYzMsIFVwMTogX3ZlYzMpIHtcbiAgICBjb25zdCBEaXIgPSBfdmVjMy5ub3JtYWxpemUoX3ZlYzMuc3ViKEF0LCBMb2MpKSxcbiAgICAgIFJpZ2h0ID0gX3ZlYzMubm9ybWFsaXplKF92ZWMzLmNyb3NzKERpciwgVXAxKSksXG4gICAgICBVcCA9IF92ZWMzLmNyb3NzKFJpZ2h0LCBEaXIpO1xuICAgIHJldHVybiBfbWF0cjQuc2V0KFxuICAgICAgUmlnaHQueCxcbiAgICAgIFVwLngsXG4gICAgICAtRGlyLngsXG4gICAgICAwLFxuICAgICAgUmlnaHQueSxcbiAgICAgIFVwLnksXG5cbiAgICAgIC1EaXIueSxcbiAgICAgIDAsXG4gICAgICBSaWdodC56LFxuICAgICAgVXAueixcbiAgICAgIC1EaXIueixcbiAgICAgIDAsXG4gICAgICAtX3ZlYzMuZG90KExvYywgUmlnaHQpLFxuICAgICAgLV92ZWMzLmRvdChMb2MsIFVwKSxcbiAgICAgIF92ZWMzLmRvdChMb2MsIERpciksXG4gICAgICAxXG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IGxldCBjYW06IF9jYW1lcmE7XG5cbmV4cG9ydCBmdW5jdGlvbiBDYW1TZXQoTG9jOiBfdmVjMywgQXQ6IF92ZWMzLCBVcDE6IF92ZWMzKSB7XG4gIGxldCBVcCwgRGlyLCBSaWdodDtcbiAgbGV0IE1hdHJWaWV3ID0gX2NhbWVyYS52aWV3KExvYywgQXQsIFVwMSk7XG5cbiAgVXAgPSBfdmVjMy5zZXQoTWF0clZpZXdbMF1bMV0sIE1hdHJWaWV3WzFdWzFdLCBNYXRyVmlld1syXVsxXSk7XG4gIERpciA9IF92ZWMzLnNldCgtTWF0clZpZXdbMF1bMl0sIC1NYXRyVmlld1sxXVsyXSwgLU1hdHJWaWV3WzJdWzJdKTtcbiAgUmlnaHQgPSBfdmVjMy5zZXQoTWF0clZpZXdbMF1bMF0sIE1hdHJWaWV3WzFdWzBdLCBNYXRyVmlld1syXVswXSk7XG5cbiAgY29uc3QgcnggPSBQcm9qU2l6ZSxcbiAgICByeSA9IFByb2pTaXplO1xuXG4gIGxldCBNYXRyUHJvaiA9IF9tYXRyNC5mcnVzdHVtKFxuICAgICAgLXJ4IC8gMixcbiAgICAgIHJ4IC8gMixcbiAgICAgIC1yeSAvIDIsXG4gICAgICByeSAvIDIsXG5cbiAgICAgIFByb2pEaXN0LFxuICAgICAgUHJvakZhckNsaXBcbiAgICApLFxuICAgIE1hdHJWUCA9IF9tYXRyNC5tdWxtYXRyKE1hdHJWaWV3LCBNYXRyUHJvaik7XG5cbiAgY2FtID0gbmV3IF9jYW1lcmEoXG4gICAgUHJvalNpemUsXG4gICAgUHJvakRpc3QsXG4gICAgUHJvakZhckNsaXAsXG4gICAgTWF0clZQLFxuICAgIE1hdHJWaWV3LFxuICAgIE1hdHJQcm9qLFxuICAgIExvYyxcbiAgICBBdCxcbiAgICBEaXIsXG4gICAgVXAsXG4gICAgUmlnaHQsXG4gICAgNTAwLFxuICAgIDUwMFxuICApO1xufVxuIiwiaW1wb3J0IHsgbXlUaW1lciB9IGZyb20gXCIuL3Jlcy90aW1lclwiO1xuaW1wb3J0IHsgbXlJbnB1dCB9IGZyb20gXCIuL3Jlcy9pbnB1dFwiO1xuaW1wb3J0IHsgcGFyc2VyIH0gZnJvbSBcIi4vcmVzL3BhcnNlclwiO1xuaW1wb3J0IHsgVWJvX01hdHIsIFVCTyB9IGZyb20gXCIuL3Jlcy91Ym9cIjtcblxuaW1wb3J0IHsgX3ZlYzMgfSBmcm9tIFwiLi9tYXRoL21hdGh2ZWMzXCI7XG5cbmltcG9ydCB7IGNhbSwgQ2FtU2V0IH0gZnJvbSBcIi4vbWF0aC9tYXRoY2FtXCI7XG5pbXBvcnQgeyBfbWF0cjQgfSBmcm9tIFwiLi9tYXRoL21hdGhtYXQ0XCI7XG5pbXBvcnQge1xuICBTaGFwZXMsXG4gIEdldEFycmF5T2JqZWN0cyxcbiAgU3VyZmFjZXMsXG4gIEdldEFycmF5U3VyZmFjZXMsXG4gIHN1cmZhY2Vcbn0gZnJvbSBcIi4vb2JqZWN0c1wiO1xuXG5sZXQgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XG5sZXQgRnBzQ252YXM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxubGV0IFVib19zZXQxOiBVQk87XG5leHBvcnQgbGV0IFVib19zZXQxX2RhdGE6IFVib19NYXRyO1xubGV0IFVib19zZXQyOiBVQk87XG5sZXQgVWJvX3NldDM6IFVCTztcbmxldCBtYXhfc2l6ZSA9IDEwO1xuXG5sZXQgRmxhZ0RhdGFPYmplY3RVcGRhdGU6IGJvb2xlYW4gPSB0cnVlO1xuXG5pbnRlcmZhY2UgUHJvZ3JhbUluZm8ge1xuICBwcm9ncmFtOiBXZWJHTFByb2dyYW07XG4gIGF0dHJpYkxvY2F0aW9uczoge1xuICAgIHZlcnRleFBvc2l0aW9uOiBudW1iZXI7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRDYW0oKSB7XG4gIENhbVNldChfdmVjMy5zZXQoLTIsIDYsIC02KSwgX3ZlYzMuc2V0KDAsIDAsIDApLCBfdmVjMy5zZXQoMCwgMSwgMCkpO1xuICBVYm9fc2V0MV9kYXRhLlByb2pEaXN0RmFyVGltZUxvY2FsLnggPSBjYW0uUHJvakRpc3Q7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckNhbSgpIHtcbiAgbGV0IERpc3QgPSBfdmVjMy5sZW4oX3ZlYzMuc3ViKGNhbS5BdCwgY2FtLkxvYykpO1xuICBsZXQgY29zVCwgc2luVCwgY29zUCwgc2luUCwgcGxlbiwgQXppbXV0aCwgRWxldmF0b3I7XG4gIGxldCBXcCwgSHAsIHN4LCBzeTtcbiAgbGV0IGR2O1xuXG4gIFdwID0gSHAgPSBjYW0uUHJvalNpemU7XG4gIGNvc1QgPSAoY2FtLkxvYy55IC0gY2FtLkF0LnkpIC8gRGlzdDtcbiAgc2luVCA9IE1hdGguc3FydCgxIC0gY29zVCAqIGNvc1QpO1xuXG4gIHBsZW4gPSBEaXN0ICogc2luVDtcbiAgY29zUCA9IChjYW0uTG9jLnogLSBjYW0uQXQueikgLyBwbGVuO1xuICBzaW5QID0gKGNhbS5Mb2MueCAtIGNhbS5BdC54KSAvIHBsZW47XG5cbiAgQXppbXV0aCA9IChNYXRoLmF0YW4yKHNpblAsIGNvc1ApIC8gTWF0aC5QSSkgKiAxODA7XG4gIEVsZXZhdG9yID0gKE1hdGguYXRhbjIoc2luVCwgY29zVCkgLyBNYXRoLlBJKSAqIDE4MDtcblxuICBsZXQga2V5ID0gXCJBRFwiO1xuXG4gIEF6aW11dGggKz1cbiAgICBteVRpbWVyLmdsb2JhbERlbHRhVGltZSAqIDMgKiAoLTMwICogbXlJbnB1dC5Nb3VzZUNsaWNrTGVmdCAqIG15SW5wdXQuTWR4KTtcbiAgRWxldmF0b3IgKz1cbiAgICBteVRpbWVyLmdsb2JhbERlbHRhVGltZSAqIDIgKiAoLTMwICogbXlJbnB1dC5Nb3VzZUNsaWNrTGVmdCAqIG15SW5wdXQuTWR5KTtcblxuICBpZiAoRWxldmF0b3IgPCAwLjA4KSBFbGV2YXRvciA9IDAuMDg7XG4gIGVsc2UgaWYgKEVsZXZhdG9yID4gMTc4LjkpIEVsZXZhdG9yID0gMTc4Ljk7XG5cbiAgLy8gaWYgKEF6aW11dGggPCAtNDUpIEF6aW11dGggPSAtNDU7XG4gIC8vIGVsc2UgaWYgKEF6aW11dGggPiA0NSkgQXppbXV0aCA9IDQ1O1xuXG4gIERpc3QgKz1cbiAgICBteVRpbWVyLmdsb2JhbERlbHRhVGltZSAqICgxICsgbXlJbnB1dC5LZXlzWzE2XSAqIDI3KSAqICgxLjIgKiBteUlucHV0Lk1keik7XG4gIGlmIChEaXN0IDwgMC4xKSBEaXN0ID0gMC4xO1xuICAvLyBjb25zb2xlLmxvZyhrZXkuY2hhckNvZGVBdCgwKSk7XG4gIGlmIChteUlucHV0Lk1vdXNlQ2xpY2tSaWdodCkge1xuICAgIGlmIChjYW0uRnJhbWVXID4gY2FtLkZyYW1lSCkgV3AgKj0gY2FtLkZyYW1lVyAvIGNhbS5GcmFtZUg7XG4gICAgZWxzZSBIcCAqPSBjYW0uRnJhbWVIIC8gY2FtLkZyYW1lVztcblxuICAgIHN4ID0gKCgoLW15SW5wdXQuTWR4ICogV3AgKiAxMCkgLyBjYW0uRnJhbWVXKSAqIERpc3QpIC8gY2FtLlByb2pEaXN0O1xuICAgIHN5ID0gKCgobXlJbnB1dC5NZHkgKiBIcCAqIDEwKSAvIGNhbS5GcmFtZUgpICogRGlzdCkgLyBjYW0uUHJvakRpc3Q7XG5cbiAgICBkdiA9IF92ZWMzLmFkZChfdmVjMy5tdWxudW0oY2FtLlJpZ2h0LCBzeCksIF92ZWMzLm11bG51bShjYW0uVXAsIHN5KSk7XG5cbiAgICBjYW0uQXQgPSBfdmVjMy5hZGQoY2FtLkF0LCBkdik7XG4gICAgY2FtLkxvYyA9IF92ZWMzLmFkZChjYW0uTG9jLCBkdik7XG4gIH1cbiAgQ2FtU2V0KFxuICAgIF9tYXRyNC5wb2ludF90cmFuc2Zvcm0oXG4gICAgICBuZXcgX3ZlYzMoMCwgRGlzdCwgMCksXG4gICAgICBfbWF0cjQubXVsbWF0cihcbiAgICAgICAgX21hdHI0Lm11bG1hdHIoX21hdHI0LnJvdGF0ZVgoRWxldmF0b3IpLCBfbWF0cjQucm90YXRlWShBemltdXRoKSksXG4gICAgICAgIF9tYXRyNC50cmFuc2xhdGUoY2FtLkF0KVxuICAgICAgKVxuICAgICksXG4gICAgY2FtLkF0LFxuICAgIG5ldyBfdmVjMygwLCAxLCAwKVxuICApO1xuXG4gIFVib19zZXQxX2RhdGEuQ2FtTG9jID0gY2FtLkxvYztcbiAgVWJvX3NldDFfZGF0YS5DYW1BdCA9IGNhbS5BdDtcbiAgVWJvX3NldDFfZGF0YS5DYW1SaWdodCA9IGNhbS5SaWdodDtcbiAgVWJvX3NldDFfZGF0YS5DYW1VcCA9IGNhbS5VcDtcbiAgVWJvX3NldDFfZGF0YS5DYW1EaXIgPSBjYW0uRGlyO1xuXG4gIC8vICAgaWYgKEFuaS0+S2V5c1tWS19TSElGVF0gJiYgQW5pLT5LZXlzQ2xpY2tbJ1AnXSlcbiAgLy8gICAgIEFuaS0+SXNQYXVzZSA9ICFBbmktPklzUGF1c2U7XG59XG5cbmZ1bmN0aW9uIGRyYXdGcHMoKSB7XG4gIEZwc0NudmFzLmNsZWFyUmVjdCgwLCAwLCBGcHNDbnZhcy5jYW52YXMud2lkdGgsIEZwc0NudmFzLmNhbnZhcy5oZWlnaHQpO1xuICBGcHNDbnZhcy5mb250ID0gXCI0OHB4IHNlcmlmXCI7XG4gIEZwc0NudmFzLmZpbGxUZXh0KFwiRlBTOlwiICsgbXlUaW1lci5GUFMudG9GaXhlZCgyKSwgMTAsIDUwKTtcbn1cblxuZnVuY3Rpb24gcmVzaXplQ2FtKHc6IG51bWJlciwgaDogbnVtYmVyKSB7XG4gIFVib19zZXQxX2RhdGEuZmxhZ3MxMkZyYW1lVy56ID0gdztcbiAgVWJvX3NldDFfZGF0YS5mbGFnczQ1RnJhbWVILnogPSBoO1xuICBjYW0uUHJvalNldCgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWxvYWRTaGFkZXJzKCk6IFByb21pc2U8UHJvZ3JhbUluZm8gfCBudWxsPiB7XG4gIGNvbnN0IHZzUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICBcIi4vc2hhZGVyL21hcmNoLnZlcnRleC5nbHNsXCIgKyBcIj9ub2NhY2hlXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICApO1xuICBjb25zdCB2c1RleHQgPSBhd2FpdCB2c1Jlc3BvbnNlLnRleHQoKTtcbiAgLy8gY29uc29sZS5sb2codnNUZXh0KTtcblxuICBjb25zdCBmc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgXCIuL3NoYWRlci9tYXJjaC5mcmFnbWVudC5nbHNsXCIgKyBcIj9ub2NhY2hlXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICApO1xuICBjb25zdCBmc1RleHQgPSBhd2FpdCBmc1Jlc3BvbnNlLnRleHQoKTtcbiAgY29uc3QgZHRSZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgIFwiLi9kYXRhLnR4dFwiICsgXCI/bm9jYWNoZVwiICsgbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgKTtcbiAgY29uc3QgZHRUZXh0ID0gYXdhaXQgZHRSZXNwb25zZS50ZXh0KCk7XG4gIHBhcnNlcihkdFRleHQpO1xuICBjb25zb2xlLmxvZyhTaGFwZXMpO1xuICBjb25zb2xlLmxvZyhTdXJmYWNlcyk7XG4gIFVib19zZXQyLnVwZGF0ZShHZXRBcnJheU9iamVjdHMoKSwgZ2wpO1xuICBVYm9fc2V0My51cGRhdGUoR2V0QXJyYXlTdXJmYWNlcygpLCBnbCk7XG5cbiAgY29uc3Qgc2hhZGVyUHJvZ3JhbSA9IGluaXRTaGFkZXJQcm9ncmFtKHZzVGV4dCwgZnNUZXh0KTtcbiAgaWYgKCFzaGFkZXJQcm9ncmFtKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8gPSB7XG4gICAgcHJvZ3JhbTogc2hhZGVyUHJvZ3JhbSxcbiAgICBhdHRyaWJMb2NhdGlvbnM6IHtcbiAgICAgIHZlcnRleFBvc2l0aW9uOiBnbC5nZXRBdHRyaWJMb2NhdGlvbihzaGFkZXJQcm9ncmFtLCBcImluX3Bvc1wiKVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gcHJvZ3JhbUluZm87XG59XG5cbmZ1bmN0aW9uIGxvYWRTaGFkZXIodHlwZTogbnVtYmVyLCBzb3VyY2U6IHN0cmluZykge1xuICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XG4gIGlmICghc2hhZGVyKSByZXR1cm4gbnVsbDtcbiAgLy8gU2VuZCB0aGUgc291cmNlIHRvIHRoZSBzaGFkZXIgb2JqZWN0XG5cbiAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcblxuICAvLyBDb21waWxlIHRoZSBzaGFkZXIgcHJvZ3JhbVxuXG4gIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAvLyBTZWUgaWYgaXQgY29tcGlsZWQgc3VjY2Vzc2Z1bGx5XG5cbiAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICBhbGVydChcbiAgICAgIGBBbiBlcnJvciBvY2N1cnJlZCBjb21waWxpbmcgdGhlIHNoYWRlcnM6ICR7Z2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpfWBcbiAgICApO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHNoYWRlcjtcbn1cblxuLy9cbi8vIEluaXRpYWxpemUgYSBzaGFkZXIgcHJvZ3JhbSwgc28gV2ViR0wga25vd3MgaG93IHRvIGRyYXcgb3VyIGRhdGFcbi8vXG5mdW5jdGlvbiBpbml0U2hhZGVyUHJvZ3JhbSh2c1NvdXJjZTogc3RyaW5nLCBmc1NvdXJjZTogc3RyaW5nKSB7XG4gIGNvbnN0IHZlcnRleFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUiwgdnNTb3VyY2UpO1xuICBpZiAoIXZlcnRleFNoYWRlcikgcmV0dXJuO1xuICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGxvYWRTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSLCBmc1NvdXJjZSk7XG4gIGlmICghZnJhZ21lbnRTaGFkZXIpIHJldHVybjtcblxuICAvLyBDcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXG5cbiAgY29uc3Qgc2hhZGVyUHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgaWYgKCFzaGFkZXJQcm9ncmFtKSByZXR1cm47XG4gIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCB2ZXJ0ZXhTaGFkZXIpO1xuICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgZnJhZ21lbnRTaGFkZXIpO1xuICBnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcblxuICAvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxuXG4gIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihzaGFkZXJQcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcbiAgICBhbGVydChcbiAgICAgIGBVbmFibGUgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhZGVyIHByb2dyYW06ICR7Z2wuZ2V0UHJvZ3JhbUluZm9Mb2coXG4gICAgICAgIHNoYWRlclByb2dyYW1cbiAgICAgICl9YFxuICAgICk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc2hhZGVyUHJvZ3JhbTtcbn1cblxuZnVuY3Rpb24gaW5pdFBvc2l0aW9uQnVmZmVyKCk6IFdlYkdMQnVmZmVyIHwgbnVsbCB7XG4gIC8vIENyZWF0ZSBhIGJ1ZmZlciBmb3IgdGhlIHNxdWFyZSdzIHBvc2l0aW9ucy5cbiAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblxuICAvLyBTZWxlY3QgdGhlIHBvc2l0aW9uQnVmZmVyIGFzIHRoZSBvbmUgdG8gYXBwbHkgYnVmZmVyXG4gIC8vIG9wZXJhdGlvbnMgdG8gZnJvbSBoZXJlIG91dC5cbiAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcblxuICAvLyBOb3cgY3JlYXRlIGFuIGFycmF5IG9mIHBvc2l0aW9ucyBmb3IgdGhlIHNxdWFyZS5cbiAgY29uc3QgcG9zaXRpb25zID0gWzEuMCwgMS4wLCAtMS4wLCAxLjAsIDEuMCwgLTEuMCwgLTEuMCwgLTEuMF07XG5cbiAgLy8gTm93IHBhc3MgdGhlIGxpc3Qgb2YgcG9zaXRpb25zIGludG8gV2ViR0wgdG8gYnVpbGQgdGhlXG4gIC8vIHNoYXBlLiBXZSBkbyB0aGlzIGJ5IGNyZWF0aW5nIGEgRmxvYXQzMkFycmF5IGZyb20gdGhlXG4gIC8vIEphdmFTY3JpcHQgYXJyYXksIHRoZW4gdXNlIGl0IHRvIGZpbGwgdGhlIGN1cnJlbnQgYnVmZmVyLlxuICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgcmV0dXJuIHBvc2l0aW9uQnVmZmVyO1xufVxuXG5pbnRlcmZhY2UgQnVmZmVycyB7XG4gIHBvc2l0aW9uOiBXZWJHTEJ1ZmZlciB8IG51bGw7XG59XG5cbmZ1bmN0aW9uIGluaXRCdWZmZXJzKCk6IEJ1ZmZlcnMge1xuICBjb25zdCBwb3NpdGlvbkJ1ZmZlciA9IGluaXRQb3NpdGlvbkJ1ZmZlcigpO1xuXG4gIHJldHVybiB7XG4gICAgcG9zaXRpb246IHBvc2l0aW9uQnVmZmVyXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldFBvc2l0aW9uQXR0cmlidXRlKGJ1ZmZlcnM6IEJ1ZmZlcnMsIHByb2dyYW1JbmZvOiBQcm9ncmFtSW5mbykge1xuICBjb25zdCBudW1Db21wb25lbnRzID0gMjsgLy8gcHVsbCBvdXQgMiB2YWx1ZXMgcGVyIGl0ZXJhdGlvblxuICBjb25zdCB0eXBlID0gZ2wuRkxPQVQ7IC8vIHRoZSBkYXRhIGluIHRoZSBidWZmZXIgaXMgMzJiaXQgZmxvYXRzXG4gIGNvbnN0IG5vcm1hbGl6ZSA9IGZhbHNlOyAvLyBkb24ndCBub3JtYWxpemVcbiAgY29uc3Qgc3RyaWRlID0gMDsgLy8gaG93IG1hbnkgYnl0ZXMgdG8gZ2V0IGZyb20gb25lIHNldCBvZiB2YWx1ZXMgdG8gdGhlIG5leHRcbiAgLy8gMCA9IHVzZSB0eXBlIGFuZCBudW1Db21wb25lbnRzIGFib3ZlXG4gIGNvbnN0IG9mZnNldCA9IDA7IC8vIGhvdyBtYW55IGJ5dGVzIGluc2lkZSB0aGUgYnVmZmVyIHRvIHN0YXJ0IGZyb21cbiAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcnMucG9zaXRpb24pO1xuICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxuICAgIHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbixcbiAgICBudW1Db21wb25lbnRzLFxuICAgIHR5cGUsXG4gICAgbm9ybWFsaXplLFxuICAgIHN0cmlkZSxcbiAgICBvZmZzZXRcbiAgKTtcbiAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uKTtcbn1cblxuZnVuY3Rpb24gZHJhd1NjZW5lKFxuICBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8gfCBudWxsLFxuICBidWZmZXJzOiBCdWZmZXJzLFxuICBVbmk6IFdlYkdMVW5pZm9ybUxvY2F0aW9uXG4pIHtcbiAgZ2wuY2xlYXJDb2xvcigwLjI4LCAwLjQ3LCAwLjgsIDEuMCk7IC8vIENsZWFyIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcbiAgZ2wuY2xlYXJEZXB0aCgxLjApOyAvLyBDbGVhciBldmVyeXRoaW5nXG4gIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTsgLy8gRW5hYmxlIGRlcHRoIHRlc3RpbmdcbiAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7IC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xuXG4gIC8vIENsZWFyIHRoZSBjYW52YXMgYmVmb3JlIHdlIHN0YXJ0IGRyYXdpbmcgb24gaXQuXG5cbiAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuICBpZiAocHJvZ3JhbUluZm8gPT0gbnVsbCkgcmV0dXJuO1xuICBzZXRQb3NpdGlvbkF0dHJpYnV0ZShidWZmZXJzLCBwcm9ncmFtSW5mbyk7XG5cbiAgLy8gVGVsbCBXZWJHTCB0byB1c2Ugb3VyIHByb2dyYW0gd2hlbiBkcmF3aW5nXG5cbiAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtSW5mby5wcm9ncmFtKTtcbiAgVWJvX3NldDEuYXBwbHkoMCwgcHJvZ3JhbUluZm8ucHJvZ3JhbSwgZ2wpO1xuICBVYm9fc2V0Mi5hcHBseSgxLCBwcm9ncmFtSW5mby5wcm9ncmFtLCBnbCk7XG4gIFVib19zZXQzLmFwcGx5KDIsIHByb2dyYW1JbmZvLnByb2dyYW0sIGdsKTtcbiAgY29uc3Qgb2Zmc2V0ID0gMDtcbiAgY29uc3QgdmVydGV4Q291bnQgPSA0O1xuICBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFX1NUUklQLCBvZmZzZXQsIHZlcnRleENvdW50KTtcbn1cbmxldCBNZCA9IFswLCAwXSxcbiAgTW91c2VDbGljayA9IFswLCAwXSxcbiAgV2hlZWwgPSAwLFxuICBLZXlzID0gbmV3IEFycmF5KDI1NSkuZmlsbCgwKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4odzogbnVtYmVyLCBoOiBudW1iZXIpIHtcbiAgY29uc3QgdnNSZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgIFwiLi9zaGFkZXIvbWFyY2gudmVydGV4Lmdsc2xcIiArIFwiP25vY2FjaGVcIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICk7XG4gIGNvbnN0IHZzVGV4dCA9IGF3YWl0IHZzUmVzcG9uc2UudGV4dCgpO1xuICBjb25zb2xlLmxvZyh2c1RleHQpO1xuICBjb25zdCBmc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgXCIuL3NoYWRlci9tYXJjaC5mcmFnbWVudC5nbHNsXCIgKyBcIj9ub2NhY2hlXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICApO1xuICBjb25zdCBmc1RleHQgPSBhd2FpdCBmc1Jlc3BvbnNlLnRleHQoKTtcbiAgY29uc29sZS5sb2coZnNUZXh0KTtcblxuICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dsY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICBjb25zdCBjYW52YXMxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmcHNjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGlmICghY2FudmFzIHx8ICFjYW52YXMxKSB7XG4gICAgcmV0dXJuO1xuICB9IC8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcblxuICBGcHNDbnZhcyA9IGNhbnZhczEuZ2V0Q29udGV4dChcIjJkXCIpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsMlwiKSBhcyBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuICBnbC5jYW52YXMud2lkdGggPSB3O1xuICBnbC5jYW52YXMuaGVpZ2h0ID0gaDtcblxuICAvLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xuICBpZiAoZ2wgPT09IG51bGwpIHtcbiAgICBhbGVydChcbiAgICAgIFwiVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC5cIlxuICAgICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU2V0IGNsZWFyIGNvbG9yIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcbiAgZ2wuY2xlYXJDb2xvcigwLjI4LCAwLjQ3LCAwLjgsIDEuMCk7XG4gIC8vIENsZWFyIHRoZSBjb2xvciBidWZmZXIgd2l0aCBzcGVjaWZpZWQgY2xlYXIgY29sb3JcbiAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG5cbiAgbGV0IHNoYWRlclByb2dyYW0gPSBpbml0U2hhZGVyUHJvZ3JhbSh2c1RleHQsIGZzVGV4dCk7XG4gIGlmICghc2hhZGVyUHJvZ3JhbSkgcmV0dXJuO1xuXG4gIGxldCBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8gfCBudWxsID0ge1xuICAgIHByb2dyYW06IHNoYWRlclByb2dyYW0sXG4gICAgYXR0cmliTG9jYXRpb25zOiB7XG4gICAgICB2ZXJ0ZXhQb3NpdGlvbjogZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgXCJpbl9wb3NcIilcbiAgICB9XG4gIH07XG4gIGNvbnN0IFVuaSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIFwidGltZVwiKTtcbiAgY29uc3QgYnVmZmVycyA9IGluaXRCdWZmZXJzKCk7XG4gIFVib19zZXQxX2RhdGEgPSBuZXcgVWJvX01hdHIoXG4gICAgbmV3IF92ZWMzKDAsIDAsIDApLFxuICAgIG5ldyBfdmVjMygwLCAwLCAwKSxcbiAgICBuZXcgX3ZlYzMoMCwgMCwgMCksXG4gICAgbmV3IF92ZWMzKDAsIDAsIDApLFxuICAgIG5ldyBfdmVjMygwLCAwLCAwKSxcbiAgICBuZXcgX3ZlYzMoMCwgMCwgMCksXG4gICAgbmV3IF92ZWMzKDAsIDAsIDApLFxuICAgIG5ldyBfdmVjMygwLCAwLCAwKSxcbiAgICBuZXcgX3ZlYzMoMCwgMCwgMCksXG4gICAgbmV3IF92ZWMzKDAsIDAsIDApLFxuICAgIG5ldyBfdmVjMygwLCAwLCAwKSxcbiAgICAwLFxuICAgIDAsXG4gICAgMFxuICApO1xuICBTdXJmYWNlcy5wdXNoKG5ldyBzdXJmYWNlKCkpO1xuICBVYm9fc2V0MSA9IFVCTy5jcmVhdGUoVWJvX3NldDFfZGF0YS5HZXRBcnJheSgpLmxlbmd0aCwgXCJCYXNlRGF0YVwiLCBnbCk7XG4gIFVib19zZXQyID0gVUJPLmNyZWF0ZSgzNiAqIG1heF9zaXplICsgNCwgXCJQcmltaXRpdmVzXCIsIGdsKTtcbiAgVWJvX3NldDMgPSBVQk8uY3JlYXRlKDIwICogbWF4X3NpemUgKyA0LCBcIlByaW1pdGl2ZXNTdXJmYWNlc1wiLCBnbCk7XG4gIGluaXRDYW0oKTtcbiAgZ2wudmlld3BvcnQoMCwgMCwgdywgaCk7XG4gIHJlc2l6ZUNhbSh3LCBoKTtcbiAgbGV0IHByb2dyYW1JbmY6IFByb2dyYW1JbmZvIHwgbnVsbDtcbiAgcHJvZ3JhbUluZiA9IHByb2dyYW1JbmZvO1xuICBwcm9ncmFtSW5mID0gYXdhaXQgcmVsb2FkU2hhZGVycygpO1xuICBjb25zdCByZW5kZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKG15SW5wdXQuS2V5c0NsaWNrWzgyXSkgcHJvZ3JhbUluZiA9IGF3YWl0IHJlbG9hZFNoYWRlcnMoKTtcbiAgICBteVRpbWVyLlJlc3BvbnNlKCk7XG4gICAgZHJhd0ZwcygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChlLmJ1dHRvbiA9PSAwKSB7XG4gICAgICAgIE1vdXNlQ2xpY2tbMF0gPSAxO1xuICAgICAgfVxuICAgICAgaWYgKGUuYnV0dG9uID09IDIpIHtcbiAgICAgICAgTW91c2VDbGlja1sxXSA9IDE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLmJ1dHRvbiA9PSAwKSB7XG4gICAgICAgIE1vdXNlQ2xpY2tbMF0gPSAwO1xuICAgICAgfVxuICAgICAgaWYgKGUuYnV0dG9uID09IDIpIHtcbiAgICAgICAgTW91c2VDbGlja1sxXSA9IDA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xuICAgICAgTWRbMF0gPSBlLm1vdmVtZW50WDtcbiAgICAgIE1kWzFdID0gZS5tb3ZlbWVudFk7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIEtleXNbZS5rZXlDb2RlXSA9IDE7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICBLZXlzW2Uua2V5Q29kZV0gPSAwO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCAoZSkgPT4ge1xuICAgICAgV2hlZWwgPSBlLmRlbHRhWTtcbiAgICB9KTtcblxuICAgIG15SW5wdXQucmVzcG9uc2UoTWQsIE1vdXNlQ2xpY2ssIFdoZWVsLCBLZXlzKTtcblxuICAgIE1kWzBdID0gTWRbMV0gPSAwO1xuICAgIHJlbmRlckNhbSgpO1xuICAgIFVib19zZXQxX2RhdGEuVGltZUdsb2JhbERlbHRhR2xvYmFsRGVsdGFMb2NhbC54ID0gbXlUaW1lci5nbG9iYWxUaW1lO1xuICAgIFVib19zZXQxLnVwZGF0ZShVYm9fc2V0MV9kYXRhLkdldEFycmF5KCksIGdsKTtcbiAgICBkcmF3U2NlbmUocHJvZ3JhbUluZiwgYnVmZmVycywgVW5pKTtcbiAgICBXaGVlbCA9IDA7XG4gICAgS2V5cy5maWxsKDApO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgfTtcbiAgcmVuZGVyKCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoZXZlbnQpID0+IHtcbiAgbGV0IHc6IG51bWJlciA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICBsZXQgaDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0O1xuICBtYWluKHcsIGgpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIChldmVudCkgPT4ge1xuICBsZXQgdzogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7XG4gIGxldCBoOiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGdsLmNhbnZhcy53aWR0aCA9IHc7XG4gIGdsLmNhbnZhcy5oZWlnaHQgPSBoO1xuICBGcHNDbnZhcy5jYW52YXMud2lkdGggPSB3O1xuICBGcHNDbnZhcy5jYW52YXMuaGVpZ2h0ID0gaDtcbiAgZ2wudmlld3BvcnQoMCwgMCwgdywgaCk7XG4gIHJlc2l6ZUNhbSh3LCBoKTtcbn0pO1xuIl0sIm5hbWVzIjpbIlVib19zZXQxX2RhdGEiXSwibWFwcGluZ3MiOiI7OztJQUFBO0lBQ0E7SUFDQTtJQUNBO0lBRUEsTUFBTSxJQUFJLENBQUE7UUFDUixPQUFPLEdBQUE7SUFDTCxRQUFBLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDeEIsUUFBQSxJQUFJLENBQUMsR0FDSCxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsTUFBTTtnQkFDL0IsSUFBSSxDQUFDLFVBQVUsRUFBRTtJQUNqQixZQUFBLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDekIsUUFBQSxPQUFPLENBQUMsQ0FBQztTQUNWO0lBRUQsSUFBQSxVQUFVLENBQVM7SUFDbkIsSUFBQSxTQUFTLENBQVM7SUFDbEIsSUFBQSxlQUFlLENBQVM7SUFDeEIsSUFBQSxTQUFTLENBQVM7SUFDbEIsSUFBQSxjQUFjLENBQVM7SUFDdkIsSUFBQSxZQUFZLENBQVM7SUFDckIsSUFBQSxTQUFTLENBQVM7SUFDbEIsSUFBQSxPQUFPLENBQVM7SUFDaEIsSUFBQSxVQUFVLENB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T0FBTyxNQUFNLENBQUMsQ0FBUSxFQUFFLENBQVMsRUFBQTtZQUMvQixPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDN0M7UUFFRCxPQUFPLEdBQUcsQ0FBQyxDQUFRLEVBQUE7SUFDakIsUUFBQSxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEM7SUFFRCxJQUFBLE9BQU8sR0FBRyxDQUFDLENBQVEsRUFBRSxDQUFRLEVBQUE7WUFDM0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQztJQUVELElBQUEsT0FBTyxLQUFLLENBQUMsQ0FBUSxFQUFFLENBQVEsRUFBQTtZQUM3QixPQUFPLElBQUksS0FBSyxDQUNkLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQ3JCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQ3JCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQ3RCLENBQUM7U0FDSDtRQUVELE9BQU8sSUFBSSxDQUFDLENBQVEsRUFBQTtZQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFD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QUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUjtJQUNILFlBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLGdCQUFBLE1BQU0sQ0FBQyxTQUFTLENBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1I7SUFDSCxZQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxnQkFBQSxNQUFNLENBQUMsU0FBUyxDQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNSO0lBQ0gsWUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsZ0JBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixFQUNIO1NBQ0g7UUFFRCxPQUFPLE9BQU8sQ0FBQyxDQUFhLEVBQUE7WUFDMUIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixRQUFBLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxQixJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQUUsWUFBQSxPQUFPLENBQUMsQ0FBQztJQUN4QixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxZQUFBLE1BQU0sQ0FBQyxTQUFTLENBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1IsR0FBRyxHQUFHLENBQUM7SUFFVixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxZQUFBLE1BQU0sQ0FBQyxTQUFTLENBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1IsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNYLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLFlBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixHQUFHLEdBQUcsQ0FBQztJQUNWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLFlBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixHQUFHLENBQUMsR0FBRyxDQUFDO0lBRVgsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsWUFBQSxNQUFNLENBQUMsU0FBUyxDQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNSLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFFWCxRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxZQUFBLE1BQU0sQ0FBQyxTQUFTLENBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1IsR0FBRyxHQUFHLENBQUM7SUFFVixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxZQUFBLE1BQU0sQ0FBQyxTQUFTLENBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1IsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNYLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLFlBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixHQUFHLEdBQUcsQ0FBQztJQUNWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLFlBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixHQUFHLEdBQUcsQ0FBQztJQUNWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLFlBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ1gsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsWUFBQSxNQUFNLENBQUMsU0FBUyxDQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNSLEdBQUcsR0FBRyxDQUFDO0lBQ1YsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsWUFBQSxNQUFNLENBQUMsU0FBUyxDQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNSLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDWCxRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxZQUFBLE1BQU0sQ0FBQyxTQUFTLENBQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ1IsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNYLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLFlBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixHQUFHLEdBQUcsQ0FBQztJQUNWLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNMLFlBQUEsTUFBTSxDQUFDLFNBQVMsQ0FDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDUixHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ1gsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsWUFBQSxNQUFNLENBQUMsU0FBUyxDQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ1AsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNSLEdBQUcsR0FBRyxDQUFDO0lBQ1YsUUFBQSxPQUFPLENBQUMsQ0FBQztTQUNWO0lBQ0QsSUFBQSxPQUFPLE9BQU8sQ0FDWixDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFBQTtJQUVULFFBQUEsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTFCLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRVosQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFWixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVCLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUIsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUViLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVaLFFBQUEsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUVELE9BQU8sS0FBSyxDQUFDLENBQWEsRUFBQTtZQUN4QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFWCxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUIsWUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqQjthQUNGO0lBRUQsUUFBQSxPQUFPLENBQUMsQ0FBQztTQUNWO0lBRUQsSUFBQSxPQUFPLGVBQWUsQ0FBQyxDQUFRLEVBQUUsQ0FBYSxFQUFBO0lBQzVDLFFBQUEsT0FBTyxJQUFJLEtBQUssQ0FDZCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3ZELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDdkQsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN4RCxDQUFDO1NBQ0g7SUFFRCxJQUFBLE9BQU8sZ0JBQWdCLENBQUMsQ0FBUSxFQUFFLENBQWEsRUFBQTtZQUM3QyxPQUFPLElBQUksS0FBSyxDQUNkLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUM3QyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDN0MsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzlDLENBQUM7U0FDSDtJQUNELElBQUEsT0FBTyxRQUFRLENBQUMsQ0FBUSxFQUFFLENBQWEsRUFBQTtZQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsUUFBQSxPQUFPLElBQUksS0FBSyxDQUNkLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDN0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUM3RCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQzlELENBQUM7U0FDSDtJQUNGOztVQ3hlWSxPQUFPLENBQUE7UUFDbEIsSUFBSSxHQUFXLFNBQVMsQ0FBQztRQUN6QixFQUFFLEdBQVUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsR0FBVSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDckMsRUFBRSxHQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxFQUFFLEdBQVcsRUFBRSxDQUFDO1FBQ2hCLEVBQUUsR0FBVSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsRUFBRSxHQUFVLEtBQUssQ0FB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SSxRQUFRLEdBQUcsS0FBSztZQUFFLFFBQVEsR0FBRyxLQUFLLENBQUM7OztRQUs1QyxJQUFJO1lBQ0YsT0FBTyxDQUFDLGVBQWUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlFLElBQUksSUFBSSxHQUFHLEdBQUc7WUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDOztJQUUzQixJQUFBLElBQUksT0FBTyxDQUFDLGVBQWUsRUFBRTtJQUMzQixRQUFBLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTTtnQkFBRSxFQUFFLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOztnQkFDdEQsRUFBRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUVuQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUNyRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFFcEUsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXRFLFFBQUEsR0FBRyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFB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
