export class _vec3 {
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
