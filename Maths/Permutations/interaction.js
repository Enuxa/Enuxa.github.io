function onDecomposeClick() {
    var upInput = document.getElementById("decomposition_up");
    var downInput = document.getElementById("decomposition_down");
    
    var upTab = upInput.value.split(" ");
    var downTab = downInput.value.split(" ");
    
    var upNumbers = [];
    var downNumbers = [];
    for (var i = 0; i < upTab.length; i++) {
        var str = upTab[i].trim();
        if (str != "" ) {
            upNumbers.push(parseInt(str));
        }
    }

    for (var i = 0; i < downTab.length; i++) {
        var str = downTab[i].trim();
        if (str != "" ) {
            downNumbers.push(parseInt(str));
        }
    }
    
    var f = new Permutation();
    var latex = "\\left(\\begin{array}{c}";

    var us = "", ds = "";
    
    for (var i = 0; i < upNumbers.length; i++) {
        f[upNumbers[i]] = downNumbers[i];
        us += upNumbers[i] + (i == upNumbers.length - 1 ? "" : "&");
        ds += downNumbers[i]  + (i == upNumbers.length - 1 ? "" : "&");
    }
    
    latex += us + "\\\\" + ds + "\\end{array}\\right)=" + f;
        
    var output = document.getElementById("decomposition");
    output.innerHTML = "\\(" + latex + "\\)";
    
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,output]);
}

function fromString(str) {
    var tab = str.split(/ *[\(\)] */);
    var f = new Permutation();
    for (var i = 0; i < tab.length; i++) {
        var s = tab[i];
        if (s == "") {
            continue;
        }
        
        var elements = s.split(/ *, */);
        var cycle = [];
        for (var j = 0; j < elements.length; j++) {
            cycle.push(parseInt(elements[j]));
        }
        f = multiply(f, fromCycle(cycle));
    }
    
    return f;
}

function onComposeClick() {
    var input = document.getElementById("composition_input").value;

    var f = fromString(input);
    var latex = "\\(" + input + "=" + f.toString() + "\\)";

    var output = document.getElementById("composition");
    output.innerHTML = latex;
    
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,output]);
}

function onCompositionChange() {
    var input = document.getElementById("composition_input");

    try {
        var f = fromString(input.value);
        var s = f.toString();
    } catch(e) {
        input.style = "color:red;"
        return;
    }
    
    if (input.value == "" || / *(\( *\d+ *(, *\d+ *)+ *\) *)+$/.test(input.value)) {
        input.style = "";
    } else {
        input.style = "color:red;";
    }
}