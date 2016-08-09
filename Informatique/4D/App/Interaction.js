function readVector(input) {
  var split = input.value.split(";");
  var vec = [];
  for (var i = 0; i < 4; i++) {
    vec[i] = parseFloat(split[i]);
  }
  return vec;
}

function readValue(input) {
  return parseFloat(input.value);
}

function updateBase() {
  f1 = readVector(document.getElementById("f1input"));
  f1 = multiply_v(1 / length(f1), f1);
  f2 = readVector(document.getElementById("f2input"));
  f2 = multiply_v(1 / length(f2), f2);
  makeMatrix();
}

function updateView() {
  var fovx = Math.PI * readValue(document.getElementById("fovx")) / 180;
  var fovy = Math.PI * readValue(document.getElementById("fovy")) / 180;
  C = readVector(document.getElementById("cinput"));
  width = Math.tan(fovx) * length(C);
  height = Math.tan(fovy) * length(C);
}

function updateTransform() {
  translation = [
    readValue(document.getElementById("translationx")),
    readValue(document.getElementById("translationy")),
    readValue(document.getElementById("translationz")),
    readValue(document.getElementById("translationt"))
  ];
}
