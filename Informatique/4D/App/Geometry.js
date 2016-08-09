var precision = 0.00001;

function equals(x, y) {
  return Math.abs(x-y) < precision;
}

function equals_v(x, y) {
  for (var i = 0; i < x.length; i++) {
    if (Math.abs(x[i]-y[i]) > precision) {
      return false;
    }
  }
  return true;
}

function dot(u, v) {
  var s = 0;

  for (var i = 0; i < u.length; i++) {
    s += u[i] * v[i];
  }

  return s;
}

function lengthSquared(u) {
  return dot(u, u);
}

function length(u) {
  return Math.sqrt(lengthSquared(u));
}

function dist(u, v) {
  return length(substract_v(u, v));
}

function combinaison_v(a, u, b, v) {
  var w = [];
  for (var i = 0; i < u.length; i++) {
    w[i] = a * u[i] + b * v[i];
  }

  return w;
}

function add_v(u, v) {
  return combinaison_v(1, u, 1, v);
}

function substract_v(u, v) {
  return combinaison_v(1, u, -1, v);
}

function multiply_v(a, u) {
  return combinaison_v(a, u, 0, u);
}

function vector(A, B) {
  return substract_v(B, A);
}

function decomposeMesh(mesh) {

}
