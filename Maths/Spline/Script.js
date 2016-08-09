var points = [];
var step = 2;
var canvas = document.getElementById("canvas");
var handleRadius = 10;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function getPolynom(Mlist, alphalist, k) {
    var delta = Mlist[k+1].x - Mlist[k].x;
    var a = (2 * (Mlist[k].y - Mlist[k+1].y) + delta * (alphalist[k+1] + alphalist[k])) / (delta * delta * delta);
    var b = (3 * (Mlist[k+1].y - Mlist[k].y) - delta * (alphalist[k+1] + 2 * alphalist[k])) / (delta * delta);
    
    return function(X) {
        var x = X - Mlist[k].x;
        return a * x * x * x + b * x * x + alphalist[k] * x + Mlist[k].y;
    }
}

function draw() {
    if (points.length < 2) {
        return;
    }
    
    var alphalist = [(points[1].y - points[0].y) / (points[1].x - points[0].x)];
    alphalist[points.length - 1] = (points[points.length-1].y - points[points.length-2].y) / (points[points.length - 1].x - points[points.length - 2].x);
    
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle="#FFFFFF";
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (var k = 1; k < points.length - 1; k++) {
        alphalist[k] = ((points[k+1].y - points[k].y) / (points[k+1].x - points[k].x) + (points[k].y - points[k-1].y) / (points[k].x - points[k-1].x)) / 2;
        
        P = getPolynom(points, alphalist, k - 1);
        drawPolynom(P, points[k-1].x, points[k].x, step, ctx);
    }
    
    P = getPolynom(points, alphalist, points.length - 2);
    drawPolynom(P, points[points.length - 2].x, points[points.length - 1].x, step, ctx);
    
    ctx.stroke();

    for (var i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, handleRadius, 0, 2*Math.PI);
        ctx.stroke();
    }
}

function drawPolynom(P, a, b, step, ctx) {
    for (var x = a; x < b; x += step) {
        var y = P(x);
        ctx.lineTo(x, y);
    }
    ctx.lineTo(b, P(b));
}


var clickedIndex = null;

function onMouseDown(evt) {
  var x = evt.clientX - canvas.offsetLeft + document.body.scrollLeft;
  var y = evt.clientY - canvas.offsetTop + document.body.scrollTop;

  for (var i = 0; i < points.length; i++) {
    var dx = points[i].x - x;
    var dy = points[i].y - y;
    var r = 10;
    if ((dx * dx) + (dy + dy) < handleRadius * handleRadius) {
      clickedIndex = i;
    }
  }  
}

function onMouseUp(evt) {
  var x = evt.clientX - canvas.offsetLeft + document.body.scrollLeft;
  var y = evt.clientY - canvas.offsetTop + document.body.scrollTop;

  if (clickedIndex == null) {
      if (points.length > 0 && points[points.length - 1].x > x) {
          return;
      }
    points.push({x : x, y : y});
    draw();
  } else {
    clickedIndex = null;
  }
}

function onMouseMove(evt) {
  var x = evt.clientX - canvas.offsetLeft + document.body.scrollLeft;
  var y = evt.clientY - canvas.offsetTop + document.body.scrollTop;
  var safety = 1;

    if (clickedIndex != null) {
        if (clickedIndex > 0 && points[clickedIndex - 1].x > x) {
            points[clickedIndex] = {x : points[clickedIndex - 1].x + safety, y : y};
            draw();
            return;
        }
        if (clickedIndex < points.length - 1 && points[clickedIndex + 1].x < x) {
            points[clickedIndex] = {x : points[clickedIndex + 1].x - safety, y : y};
            draw();
            return;
        }
        points[clickedIndex] = {x : x, y : y};
        draw();
    }
}