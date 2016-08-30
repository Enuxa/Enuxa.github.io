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
    
    this.equals = function (f) {
        var different = false;
        var elements = f.getElements();
        for (let i of this.getElements()) {
            elements.add(i);
        }
        
        for (let i of elements) {
            if (f.get(i) != this.get(i)) {
                return false;
            }
        }
        
        return true;
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

function PermutationSet() {
    this.values = new Set();
    this.add = function (f) {
        for (let g of this.values) {
            if (g.equals(f)) {
                return;
            }
        }
        
        this.values.add(f);
    }
    
    this.remove = function(f) {
        for (let g of this.values) {
            if (g.equals(f)) {
                this.values.delete(g);
                return;
            }
        }
    }
    
    this.union = function(E){
        for (let f of E.values) {
            this.add(f);
        }
    }
    
    this.toString = function() {
        var str = "";
        var i = 1;
        for (let f of this.values) {
            str += f.toString();
            if (i < this.values.size) {
                str += ", ";
            }
            i++;
        }
        
        return str;
    }
    
    this.sort = function () {
        var t = [];
        for (let f of this.values) {
            t.push(f);
        }
        
        return t.sort(
            function(f, g) {
                var cyclesf = decompose(f);
                var cyclesg = decompose(g);
                
                if (cyclesf.length > cyclesg.length)
                    return 1;
                else if (cyclesf.length < cyclesg.length)
                    return -1;
                
                var lengthf = [], lengthg = [];
                for (var i = 0; i < cyclesf.length; i++) {
                    lengthf.push(cyclesf[i].length);
                    lengthg.push(cyclesg[i].length);
                }
                var intSort = function (a, b) {
                        if (a > b)
                            return 1;
                        else if (a < b)
                            return -1;
                        else
                            return 0;
                    };
                lengthf.sort(intSort);
                lengthg.sort(intSort);
                
                for (var i = 0; i < lengthf.length; i++) {
                    if (lengthf[i] > lengthg[i]) {
                        return 1;
                    } else if (lengthf[i] < lengthg[i]) {
                        return -1;
                    }
                }
                
                return 0;
            }
        );
    }
}

function generateSubgroup(family) {
    var subgroup = new PermutationSet();
    subgroup.add(new Permutation());
    
    var previousSize;
    do {
        var previousSize = subgroup.values.size;
        var P = new PermutationSet();
        for (let f of family.values) {
            for (let g of subgroup.values) {
                var h1 = multiply(f, g);
                var h2 = multiply(g, f);
                P.add(h1);
                P.add(h2);
            }
        }
        
        subgroup.union(P);
    } while (previousSize != subgroup.values.size)
    
    return subgroup;
}