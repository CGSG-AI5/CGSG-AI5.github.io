function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("!!!!!!");
  }

  return shader;
}
async function fetchShader(shaderURL) {
  try {
    const response = await fetch(shaderURL);
    const text = await response.text();
    return text;
  } catch (err) {
    array(err);
  }
}

let IsPressMouse = false;
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl2");
const k = fetchShader("./vert.glsl");
gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

const vs = `#version 300 es
      in highp vec4 in_pos;

      out highp vec2 color;
      void main() {
        gl_Position = in_pos;
        color = in_pos.xy;
    }
`;

const fs = `#version 300 es
    out highp vec4 o_color;
    in highp vec2 color;
    uniform highp float time;
    uniform highp float  x0, y0, x1, y1;
    uniform highp float mouseX, mouseY; 

    void main() {
        highp float n, mouseOtX = mouseX / 500.0 - 1.0, mouseOtY = mouseY / 500.0 + 1.0;
        highp vec2 Z, Z0, C = vec2(0.35 + 0.08 * sin(time + 3.0), 0.39 + 0.08 * sin(1.1 * time));
        


        if (mouseOtX - color.x < 0.1 && mouseOtX - color.x > -0.1 &&
            mouseOtY - color.y < 0.1 && mouseOtY - color.y > -0.1 || 1 == 0) 
        {  
            highp float dx = (x1 - x0) / 4.0, dy = (y1 - y0) / 4.0, X0 = x0, Y0 = y0, X1 = x1, Y1 = y1;
           
           X0 += dx * (mouseX / 250.0 - 2.0) + 1.0 *  dx;
           X1 += dx * (mouseX / 250.0 - 2.0) - 1.0 * dx;
           Y1 += dy * (mouseY / -250.0 + 2.0) - 1.0 * dy;
           Y0 += dy * (mouseY / -250.0 + 2.0) + 1.0 * dy;
           
          dx = (X1 - X0) / 4.0;
          dy = (Y1 - Y0) / 4.0;

           X0 -= dx * (mouseX / 250.0 - 2.0);
           X1 -= dx * (mouseX / 250.0 - 2.0);
           Y1 -= dy * (mouseY / -250.0 + 2.0);
           Y0 -= dy * (mouseY / -250.0 + 2.0);

           Z0 = vec2(gl_FragCoord.x * (X1 - X0) / 1000.0 + X0, gl_FragCoord.y * (Y1 - Y0) / 1000.0 + Y0); 
          
           Z = Z0;
           n = 0.0;

           while (n < 255.0 && Z.x * Z.x + Z.y * Z.y < 4.0)
           {
               Z = vec2(Z.x * Z.x - Z.y * Z.y + C.x, Z.x * Z.y + Z.y * Z.x + C.y);
               n++;
           }

           o_color = vec4(n * 2.0 / 255.0, n * 8.0 / 255.0, n * 4.0 / 255.0, 1);
           //o_color = vec4(1, 1, 1, 1);
           
           return;
        }

        Z0 = vec2(gl_FragCoord.x * (x1 - x0) / 1000.0 + x0, gl_FragCoord.y * (y1-y0) / 1000.0 + y0);
        
        Z = Z0;
        n = 0.0;

        while (n < 255.0 && Z.x * Z.x + Z.y * Z.y < 4.0)
        {
            Z = vec2(Z.x * Z.x - Z.y * Z.y + C.x, Z.x * Z.y + Z.y * Z.x + C.y);
            n++;
        }

        o_color = vec4(n * 2.0 / 255.0, n * 8.0 / 255.0, n * 4.0 / 255.0, 1);
    }
`;

const vertexSh = loadShader(gl, gl.VERTEX_SHADER, vs);
const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, fs);

const program = gl.createProgram();
gl.attachShader(program, vertexSh);
gl.attachShader(program, fragmentSh);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  alert(gl.getProgramInfoLog(program));
}

let StartTime = -1 /* Start program time */,
  FPSTime = 0,
  FrameCount = 0,
  IsPause = false,
  FPS = 30,
  SyncTime;

function Timer() {
  let t;

  t = Date.now();
  if (StartTime == -1) {
    StartTime = FPSTime = t;
  }
  SyncTime = (t - StartTime) / 1000.0;
  FrameCount++;
  if (t - FPSTime > 3 * 1000.0) {
    FPS = FrameCount / ((t - FPSTime) / 1000.0);
    FPSTime = t;
    FrameCount = 0;
  }
  console.log(FPS);
}
let x0 = -2.0,
  x1 = 2.0,
  y0 = -2.0,
  y1 = 2.0;

let mouseX, mouseY;
const posLoc = gl.getAttribLocation(program, "in_pos");
const unifomLoc = gl.getUniformLocation(program, "time");
const unifomLoc1 = gl.getUniformLocation(program, "x0");
const unifomLoc2 = gl.getUniformLocation(program, "y0");
const unifomLoc3 = gl.getUniformLocation(program, "x1");
const unifomLoc4 = gl.getUniformLocation(program, "y1");
const unifomMouseLocX = gl.getUniformLocation(program, "mouseX");
const unifomMouseLocY = gl.getUniformLocation(program, "mouseY");

const posBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
const pos = [-1, 1, 0, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posLoc);
gl.useProgram(program);

const draw = () => {
  if (!IsPause) Timer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(posLoc);
  gl.useProgram(program);
  gl.uniform1f(unifomLoc, SyncTime);
  gl.uniform1f(unifomLoc1, x0);
  gl.uniform1f(unifomLoc2, y0);
  gl.uniform1f(unifomLoc3, x1);
  gl.uniform1f(unifomLoc4, y1);
  gl.uniform1f(unifomMouseLocX, mouseX);
  gl.uniform1f(unifomMouseLocY, mouseY);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  window.requestAnimationFrame(draw);
};
draw();
