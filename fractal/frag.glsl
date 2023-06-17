    /*
   highp vec2 CmplAddcmpl( highp vec2 A, highp vec2 B )
    {
        highp vec2 z;
        z.x = A.x + B.x;
        z.y = A.y + B.y;
        return z;
    } 

    highp vec2 CmplMULcmpl( highp vec2 A, highp vec2 B )
    {
        highp vec2 z;
        z.x = A.x * B.x  - A.y * B.y;
        z.y = A.x * B.y  + A.y * B.x;
        return z;
    }
    highp double CmplNorm( highp vec2 A )
    {   
        return sqrt(A.x * A.x + A.y * A.y);
    }
    highp vec2 CmplNorm1( highp vec2 A )
    {   
        return CmplMULcmpl( A, A );
    }

    highp vec2 CmplNorm2( highp vec2 A )
    {
        return A.x * A.x + A.y * A.y;
    }*/

             /*  highp float dx = (x1 - x0) / 4.0, dy = (y1 - y0) / 4.0;*/
           
          /* x0 += dx * (mouseX / 250.0  - 2.0);
           x1 += dx * (mouseX / 250.0 - 2.0);
           y0 += dy * (mouseY / -250.0 + 2.0);
           y1 += dy * (mouseY / -250.0 + 2.0);*/

                      Z0 = vec2((gl_FragCoord.x + (mouseX - 501.0) / 2.0) * ((x1 - x0 - 1.0)) / 1000.0 + x0 + 0.5, (gl_FragCoord.y - (mouseY - 501.0) / 2.0) * (y1 - y0 - 1.0) / 1000.0 + y0 + zoomy + 0.5);
        
            Z = Z0;
            n = 0.0;
    
            while (n < 255.0 && Z.x * Z.x + Z.y * Z.y < 4.0)
            {
                Z = vec2(Z.x * Z.x - Z.y * Z.y + C.x, Z.x * Z.y + Z.y * Z.x + C.y);
                n++;
            } 


      /*X0 += dx * (mouseX / 250.0 - 2.0);
           X1 += dx * (mouseX / 250.0 - 2.0);
           Y1 += dy * (mouseY / -250.0 + 2.0);
           Y0 += dy * (mouseY / -250.0 + 2.0);*/

           /*dx = (X1 - X0) / 4.0;
           dy = (Y1 - Y0) / 4.0;*/

          /* X0 -= dx * (mouseX / 250.0 - 2.0);
           X1 -= dx * (mouseX / 250.0 - 2.0);
           Y1 -= dy * (mouseY / -250.0 + 2.0);
           Y0 -= dy * (mouseY / -250.0 + 2.0);*/