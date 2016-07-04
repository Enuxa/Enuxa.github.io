function TreeBuilder(tree ,height, space, canvas) {
    this.tree  = tree;
    this.leavesLeft = 0;
    this.height = height;
    this.space = space;
    this.canvas = canvas;
    this.maxHeight = 0;

    this.buildTree = function() {
        this.buildTree_rec(this.tree, height);
        canvas.setAttribute("style", "height: " + (this.maxHeight) + "px;");
    }

    this.buildTree_rec = function(tree, top) {
        var node = document.createElementNS("http://www.w3.org/2000/svg", "text");
        if (tree.value == "epsilon") {
            node.innerHTML = "&epsilon;";
        } else {
            node.innerHTML = tree.value;
        }
        node.setAttribute("class", tree.label);
        this.canvas.appendChild(node);

        var bbox = node.getBBox();
        
        var x = this.leavesLeft;
        var us = [];
        if (tree.children != 0) {
            x = 0;
            for (var i = 0; i < tree.children.length; i++) {
                var child = tree.children[i];
                var u = this.buildTree_rec(child, top + height + bbox.height);
                x += u;
                us.push(u);
            }
            x /= tree.children.length;
            x -= bbox.width / 2;
        }

        node.setAttribute("x", x);
        node.setAttribute("y", top);

        this.leavesLeft += bbox.width + this.space;
        
        if (tree.children != 0) {
            var y = top + height + bbox.height;
            for (var i = 0; i < tree.children.length; i++) {
                var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", us[i]);
                line.setAttribute("y1", y - bbox.height / 2 - 10);
                line.setAttribute("x2", x + bbox.width / 2);
                line.setAttribute("y2", top + 10);
                this.canvas.appendChild(line);
            }
        }

        var bbox = node.getBBox();
        
        this.maxHeight = Math.max(this.maxHeight, bbox.y + bbox.height);

        return x + bbox.width / 2;
    }
}