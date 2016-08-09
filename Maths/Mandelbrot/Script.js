var canvasSize = {w : 500, h : 500};
var region = {x0 : -2, y0 : -2, x1 : 2, y1 : 2};

var cursor = {x : canvasSize.w/2, y : canvasSize.h/2};
var zoomSize = 0.25;

var canvas = document.getElementById("canvas");
canvas.width = canvasSize.w;
canvas.height = canvasSize.h;
var context = canvas.getContext("2d");
var imgData = null;

var maxIteration = 50;

function setPixel(x, y, color) {
  var index = (y * canvasSize.w + x) * 4;
  imgData.data[index] = color.r;
  imgData.data[index + 1] = color.g;
  imgData.data[index + 2] = color.b;
  imgData.data[index + 3] = color.a;
}

function lerp(u, v, t) {
  return u + t * (v - u);
}

function cerp(u, v, t) {
  return lerp(u, v, (1 - Math.cos(t * Math.PI / 2)) / 2);
}

function getIterationNumber(c) {
  var z = c;
  var i = 1;
  for (i = 0; i < maxIteration; i++) {
    if (z.size() >= 2) {
      return i;
    } else {
      z = c.add(z.mul(z));
    }
  }

  return -1;
}

function fillRectangle() {
  imgData = context.createImageData(canvasSize.w, canvasSize.h)
  for (var i = 0; i < canvasSize.w; i++) {
    for (var j = 0; j < canvasSize.h; j++) {
      var c = new Complex(lerp(region.x0, region.x1, i / canvasSize.w), lerp(region.y0, region.y1, j / canvasSize.h));
      var ite = getIterationNumber(c);
      if (ite < 0) {
        setPixel(i, j, {r : 0, g : 0, b : 0, a : 255});
      } else {
        var f = ite / maxIteration;
          setPixel(i, j, {
            r : f * 255,
            g : 255,
            b : 255,
            a : f * 255}
          );
      }
    }
  }

  context.putImageData(imgData, 0, 0);
}

function onClick(evt) {
  var x = evt.clientX - canvas.offsetLeft + document.body.scrollLeft;
  var y = evt.clientY - canvas.offsetTop + document.body.scrollTop;
  var cx = lerp(region.x0, region.x1, x / canvasSize.w);
  var cy = lerp(region.y0, region.y1, y / canvasSize.h);
  var s = (region.x1 - region.x0) * zoomSize;
  region.x0 = cx - s / 2;
  region.x1 = cx + s / 2;
  region.y0 = cy - s / 2;
  region.y1 = cy + s / 2;
  fillRectangle();
}

function onMove(evt) {
  var x = evt.clientX - canvas.offsetLeft + document.body.scrollLeft - zoomSize * canvasSize.w / 2;
  var y = evt.clientY - canvas.offsetTop + document.body.scrollTop - zoomSize * canvasSize.h / 2;

  context.clearRect(0, 0, canvasSize.w, canvasSize.h);
  context.putImageData(imgData, 0, 0);
  context.strokeStyle = "blue";
  context.strokeRect(x, y, canvasSize.w * zoomSize, canvasSize.h * zoomSize);
}
