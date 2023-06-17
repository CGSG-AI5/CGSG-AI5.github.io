#version 300 es
    out highp vec4 o_color;
    in highp vec3 DrawColor;
    in highp vec3 DrawPos;
    in highp vec3 DrawNormal;

    precision highp float;

    uniform BaseData
    {
        mat4 WVP;
        mat4 MatrW;
        mat4 MatrWInv;
        mat4 MatrVP;
        mat4 MatrV;
        vec4 CamLoc;
        vec4 CamAt;
        vec4 CamRight;
        vec4 CamUp;
        vec4 CamDir;
        vec4 ProjDistFarTimeLocal;
        vec4 TimeGlobalDeltaGlobalDeltaLocal;
        vec4 ProjectSize;
    }; 

    uniform Material
    {
        vec4 Ka;
        vec4 Kd;
        vec4 Ks;
        vec4 PhTrans;
        vec4 Tex0123;
        vec4 Tex4567;
    }; 


    vec3 shade (vec3 P, vec3 N)
    {
      vec3 L = normalize(vec3(1.0, 2.0, 3.0));
      vec3 LC = vec3(1.0, 1.0, 1.0);
      vec3 V = normalize(P - CamLoc.xyz);

      // vec3 Ka = vec3(0.24725,0.1995,0.0745);
      // vec3 Kd = vec3(0.75164,0.60648,0.22648 );
      // vec3 Ks = vec3(0.628281,0.555802,0.366065);
      // float Ph = 51.2;

      vec3 color = Ka.xyz;


      N = faceforward(N, V, N);

      color += max(0.0, dot(N, L)) * Kd.xyz * LC;

      vec3 R = reflect(V, N);
      color += pow(max(0.0, dot (R, L)), PhTrans.x) * Ks.xyz * LC;

      //color *= DrawColor;
      
      return color;
    }
      void main() {
        o_color =  vec4(shade(DrawPos, normalize(DrawNormal)), 1.0);
        //o_color =  vec4(normalize(DrawNormal), 1.0);
        //o_color =  vec4(DrawColor, 1.0);

    
    }
