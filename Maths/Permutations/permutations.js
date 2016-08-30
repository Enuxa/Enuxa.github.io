//  Une permutation f est représentée par un tableau t tel que t[x+1]=f(x)
/// Un cycle c est représenté par un tableau t tel que c=(t[0] t[1] t[2] ... t[t.length - 1])

function Permutation() {
    this.get = function(i) {
        if (!this.hasOwnProperty(i)) {
            return i;
        } else {
            return this[i];
        }
    };
    
    this.getElements = function () {
        var elements = new Set();
        for (let i in this) {
            var x = parseInt(i);
            if (!isNaN(x)) {
                elements.add(x);
            }
        }
        
        return elements;
    }
    
    this.toString = function () {
        var cycles = decompose(this);
        var str = "";
        for (var i = 0; i < cycles.length; i++) {
            str += "(";
            var c = cycles[i];
            for (var j = 0; j < c.length; j++) {
                str += c[j] + (j < c.length - 1 ? ", " : "");
            }
            str+=")";
        }
        
        if (str == "") {
            str = "id";
        }
        
        return str;
    }
}

function multiply(f, g) {
    var h = new Permutation();
    
    var elements = f.getElements();
    for (let i of g.getElements()) {
        elements.add(i);
    }
   
    for (let i of elements) {
        h[i] = g.get(f.get(i));
    }
    
    return h;
}

function decompose(f) {
    var elements = f.getElements();

    var cycles = [];
    var previousSize = elements.size;
    while (elements.size > 0) {
        var initial;
        for (let i of elements) {
            initial = i;
            break;
        }
        elements.delete(initial);
        
        var cycle = [initial];
        var initialSize = elements.size;
        while (initial != f.get(cycle[cycle.length - 1])) {
            var x = f.get(cycle[cycle.length - 1]);

            if (cycle.length> initialSize) {
                throw new Error("Error while decomposing 1");
            }

            cycle.push(x);
            elements.delete(x);
        }
        if (cycle.length > 1) {
            cycles.push(cycle);
        }
        
        if (elements.size == previousSize) {
            throw new Error("Error while decomposing 2");
        }
        previousSize = elements.size;
    }
    
    return cycles;
}

function fromCycle(c) {
    var f = new Permutation();

    for (var i = 0; i < c.length; i++) {
        x = c[i];
        f[x] = c[(i + 1) % c.length];
    }
    
    return f;
}