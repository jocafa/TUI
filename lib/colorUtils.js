function nxyz(n) {
  return (n/=255) <= 0.04045
    ? n/12.92
    : Math.pow((n+0.055)/1.055, 2.4);
}

function nxyzLab(n) {
  return n > 0.008856
    ? Math.pow(n, 1/3)
    : 7.787037 * n + 4/29;
}

function rgbToLab(r, g, b) {
  var
    r = nxyz(r),
    g = nxyz(g),
    b = nxyz(b),
    x = nxyzLab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.950470),
    y = nxyzLab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / 1),
    z = nxyzLab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.088830);

  return {
    L: 116*y - 16,
    a: 500*(x - y),
    b: 200*(y - z)
  }
}

function hexToLab(h) {
  return rgbToLab(h>>16, h>>8&0xff, h&0xff);
}

// Color Index ----------------------------------------------------------------
var
  cubeSteps = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff],
  graySteps = [
    0x08, 0x12, 0x1c, 0x26, 0x30, 0x3a, 0x44, 0x4e, 0x58, 0x62, 0x6c, 0x76,
    0x80, 0x84, 0x94, 0x9e, 0xa8, 0xb2, 0xbc, 0xc6, 0xd0, 0xda, 0xe4, 0xee
  ],
  colorIndex = (function () {
    var colors = [],
    i, ri, gi, bi,
    cl = cubeSteps.length,
    gl = graySteps.length,
    hex,
    red, green, blue,
    Lab
    term = 16;

    for (ri = 0; ri < cl; ri++) {
      red = cubeSteps[ri];
      for (gi = 0; gi < cl; gi++) {
        green = cubeSteps[gi];
        for (bi = 0; bi < cl; bi++) {
          blue = cubeSteps[bi];
          hex = (red << 16) | (green << 8) | blue;
          Lab = rgbToLab(red, green, blue);
          colors.push({
            hex: hex,
            red: red,
            green: green,
            blue: blue,
            L: Lab.L,
            a: Lab.a,
            b: Lab.b,
            term: term
          });
          term++;
        }
      }
    }

    for (i = 0; i < gl; i++) {
      red = green = blue = graySteps[i];
      hex = (red << 16) | (green << 8) | blue;
      Lab = rgbToLab(red, green, blue);
      colors.push({
        hex: hex,
        red: red,
        green: green,
        blue: blue,
        L: Lab.L,
        a: Lab.a,
        b: Lab.b,
        term: term
      });
      term++;
    }

    return colors;
  })();


// Color Matching -------------------------------------------------------------
function nearestHex(hex) {
}

function nearestLab(hex) {
}

/* Color Notes:
   first 16 colors:
     regular:
       black: #000000
       red: #cd0000
       green: #00cd00
       yellow: #cdcd00
       blue: #0000ee
       magenta: #cd00cd
       cyan: #00cdcd
       white: #e5e5e5
     bright:
       black: #7f7f7f
       red: #ff0000
       green: #00ff00
       yellow: #ffff00
       blue: #5c5cff
       magenta: #ff00ff
       cyan: #00ffff
       white: #ffffff

   256-color mode:
     color cube:
       starts at 16
       is 6 wide
       steps are: 0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff
     grayscale:
       starts at 232
       has 24 entries
       ranges from #080808 to #eeeeee
       steps are: 0x08, 0x12, 0x1c, 0x26, 0x30, 0x3a, 0x44, 0x4e, 0x58, 0x62,
         0x6c, 0x76, 0x80, 0x84, 0x94, 0x9e, 0xa8, 0xb2, 0xbc, 0xc6, 0xd0,
         0xda, 0xe4, 0xee

   88-color mode:
     color cube:
       starts at 16
       is 4 wide
       steps are: 0x00, 0x8b, 0xcd, 0xff
     grayscale:
       starts at 80
       has 8 entries
       ranges from #0x2e2e2e to #e7e7e7
       steps are: 0x2e, 0x5c, 0x73, 0x8b, 0xa2, 0xb9, 0xd0, 0xe7
*/
