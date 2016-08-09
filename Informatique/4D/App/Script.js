updateBase();
updateView()
updateTransform();

var vertices = [];
var edges = [];
for (var i = -1; i <= 1; i+= 2) {
    for (var j = -1; j <= 1; j+=2) {
      for (var k = -1; k <= 1; k+= 2) {
        for (var l = -1; l <= 1; l+=2) {
          vertices.push([i, j, k, l]);
        }
      }
    }
}
for (var i = 0; i < vertices.length; i++) {
  var u = vertices[i];
  for (var j = 0; j < vertices.length; j++) {
    var v = vertices[j];
    if (equals(dist(u, v), 2)) {
      edges.push([u, v]);
    }
  }
}

drawMesh(edges);
