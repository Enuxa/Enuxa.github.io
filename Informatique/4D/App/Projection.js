var C = [0, -1, 0, 0];
var f1;
var f2;
var matrix = null;

var width;
var height;

var canvas = document.getElementById("canvas");

var translation = [0, 0, 0, 0];
var rotation = [0, 0, 0, 0];

function makeMatrix() {
  matrix = [];

  var k;
  var alpha;
  for(k = 0; k < 4; k++) {
    if (!equals(f1[k],0)) {
      alpha = f1[k];
      break;
    }
  }
  if (k == 2) {
    throw new Error("Error : f1 = 0");
  }

  var l;
  var beta;
  for(l = 0; l < 4; l++) {
    if (!equals(f2[l] * f1[k] - f1[l] * f2[k],0)) {
      beta = f2[l] * f1[k] - f1[l] * f2[k];
      break;
    }
  }
  if (l == 2) {
    throw new Error("Error : det(f1,f2) = 0");
  }

  for (var i = 0; i < 4; i++) {
    var line = [0, 0, 0, 0];

    line[i] = f1[k];
    line[k] = f1[i] + (f2[i] * f1[k] - f1[i] * f2[k]) * f1[l] / beta;
    line[l] = (f2[i] * f1[k] - f1[i] * f2[k]) * f1[k] / beta;

    matrix.push(line);
  }
}

function mmul(M, u) {
  var y = [0, 0, 0, 0];
  for(var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      y[i] = M[i][j] * u[j];
    }
  }

  return y;
}

function project(M) {
  var d = dot(vector(M, C), C);
  if (equals(d, 0)) {
    return null;
  }

  var Mp = combinaison_v(1, C, lengthSquared(C) / d, vector(M, C))

  if (!equals_v(mmul(matrix, u), [0, 0, 0, 0])) {
    return null;
  }

  var Mt = [(dot(Mp, f1) / 2 + 0.5) * canvas.width , (dot(Mp, f2) / 2 + 0.5) * canvas.height];

  return Mt;

  if (Math.abs(Mt[0]) <= width && Math.abs(Mt[1]) <= height && dot(vector(M, Mp), vector(M, C) >= 0)) {
    return Mt;
  } else {
    return null;
  }
}

function draw(ctx, line) {
  ctx.beginPath();
  var firstDrawn = false;

  for (var i = 0; i < line.length; i++) {
    var M = project(line[i]);
    if (M != null) {
      if (firstDrawn) {
        ctx.moveTo(add_v(M[0], translation), add_v(translation, M[1]));
      } else {
        ctx.lineTo(add_v(M[0], translation), add_v(translation, M[1]));
      }
      firstDrawn = true;
    } else {
      ctx.stroke();
      ctx.beginPath();
      firstDrawn = false;
    }
  }

  ctx.stroke();
}

function drawMesh(edges) {
  var ctx = canvas.getContext("2d");
  for (var i = 0; i < edges.length; i++) {
    draw(ctx, edges[i]);
  }
}
