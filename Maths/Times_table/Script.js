var canvasSize = 500;
var margin = 50;

var canvas = document.getElementById("canvas");
canvas.setAttribute("style", "width:" + (canvasSize + 2 * margin) + "; height:" + (canvasSize + 2 * margin));

function drawTimesTable(n, m) {
canvas.innerHTML = "";

  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", margin + canvasSize / 2);
  circle.setAttribute("cy", margin + canvasSize / 2);
  circle.setAttribute("r", canvasSize / 2);

  for (var i = 0; i < n; i++) {
    var p1 = {x : margin + canvasSize / 2 * (1 + Math.cos(2 * i * Math.PI / n)), y : margin + canvasSize / 2 * (1 + Math.sin(2 * i * Math.PI / n))};

    var r = (i * m) % n;
    var angle = 2 * Math.PI * r / n;
    var p2 = {x : margin + canvasSize / 2 * (1 + Math.cos(angle)), y : margin + canvasSize / 2 * (1 + Math.sin(angle))};

    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);

    canvas.appendChild(line);

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.innerHTML = i;
    text.setAttribute("x", p1.x);
    text.setAttribute("y", p1.y);
    canvas.appendChild(text);
  }

  canvas.appendChild(circle);
}

function onChange() {
  var nElt = document.getElementById("modulo");
  var n = parseInt(nElt.value);

  var mElt = document.getElementById("mul");
  var m = parseInt(mElt.value);

  drawTimesTable(n, m);
}
