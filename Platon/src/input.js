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

export let myInput = new InPut([0, 0], [0, 0], kf.fill(0, 0, 255));
