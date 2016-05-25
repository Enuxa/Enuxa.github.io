var grammar = new Grammar();

function newToken() {
    var form = document.forms["newtoken"];
    var tokentype = form["tokentype"].value;
    var regexp = form["regexp"].value;

    if (/[A-Z]+/.exec(tokentype).indexOf(tokentype) < 0) {
        alert("The name of a token must be made up of uppercase letters.");
        return;
    }

    for (var i = 0; i < grammar.tokens.length; i++) {
        if (grammar.tokens[i].type == tokentype) {
            alert("The token " + tokentype + " already exists.");
            return;
        }
    }

    grammar.addToken(tokentype, new RegExp(regexp));
    
    var btnHTML = "<button onclick=\"removeToken('" + tokentype + "\')\">X</button>";
    var table = document.getElementById("tokentable");
    var row = document.createElement("tr");
    row.id = tokentype;
    row.innerHTML = btnHTML + "<td>" + tokentype + "</td><td>" + regexp + "</td>";
    table.appendChild(row);
}

function removeToken(type) {
    grammar.removeToken(type);

    var token = {type : "token", value : type};
    var table = document.getElementById("ruletable");
    var rows = table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var row = rows.item(i);
        var cells = row.getElementsByTagName("td");
        var left = cells.item(0).innerHTML;
        for (var j = 0; grammar.rules.hasOwnProperty(left) && j < grammar.rules[left].length; j++) {
            if (grammar.rules[left][j].usesSymbol(token)) {
                cells.item(2 + j).remove();
                grammar.removeRule(grammar.rules[left][j]);
                j--;
            }
        }
        if (!grammar.rules.hasOwnProperty(left)) {
            rows.item(i).remove();
            i--;
        }
    }
    
    document.getElementById(type).remove();
}

function newRule() {
    var form = document.forms["newrule"];
    var left = form["left"].value;
    var right = form["right"].value;

    if (grammar.nonTerminals.indexOf(left) < 0) {
        alert("The non-terminal symbole " + left + " doesn't exist.");
        return;
    }

    try{
        var symbolList = toSymbolList(right);
    } catch (error) {
        alert(error.message);
        return;
    }
    
    var rule = new Rule(left, symbolList);
    
    if (grammar.hasRule(rule)) {
        alert("The rule " + left + " => " + right + " already exists.");
        return;
    }

    var table = document.getElementById("ruletable");        
    if (grammar.rules.hasOwnProperty(left)) {
        var row = document.getElementsByName(left).item(0);
    } else {
        var row = document.createElement("tr");
        row.setAttribute("name", left);
        row.innerHTML += "<td>" + left + "</td><td>&#8658</td>";
        table.appendChild(row);
    }

    var html = "<td onmouseover='onRuleHoverOut(this, true)' onmouseout='onRuleHoverOut(this, false)'><button onclick=\"removeRule(this.parentElement)\">x</button>";
    
    for (var i = 0; i < symbolList.length; i++) {
        var symbol = symbolList[i];
        html += "<span class=\"" + symbol.type + "\">" + symbol.value + "</span>";
    }

    row.innerHTML += html + "</td>";

    grammar.addRule(rule);
    
    updateAnalysis();
    
    parse(false);
}

function removeRule(elt) {
    var row = elt.parentElement;
    var cells = row.children;
    var left = row.getAttribute("name").valueOf();
    
    for (var i = 0; i < cells.length; i++) {
        if (cells.item(i) == elt) {
            grammar.removeRule(grammar.rules[left][i - 2]);
            elt.remove();
            break;
        }
    }
    if(grammar.rules[left] == undefined) {
        row.remove();
    }
    
    updateAnalysis();
    
    parse(false);
}

function newNonTerminal() {
    var form = document.forms["newnonterminal"];
    var name = form["nonterminalname"].value;

    if (name == "" || /[A-Z]+/.exec(name).indexOf(name) < 0) {
        alert("The name of a non-terminal symbol must be made up of uppercase letters.");
        return;
    }
    
    if (grammar.nonTerminals.indexOf(name) >= 0) {
        alert("The grammar already has the non-terminal symbol " + name + ".");
        return;
    }
    
    grammar.nonTerminals.push(name);
    
    var list = document.getElementById("nonterminallist");
    var element = document.createElement("li");
    element.innerHTML = "<input type='radio' name='axiom' onchange='onAxiomChange(this)' value='" + name + "'>" + name;
    list.appendChild(element);
    
    if (grammar.nonTerminals.length == 1) {
        onAxiomChange(element.children.item(0));
    }
}

function onAxiomChange(element) {
    var name = element.value;
    grammar.axiom = name;
    element.setAttribute("checked", "");

    var list = document.getElementById("nonterminallist").children;
    for (var i = 0; i < list.length; i++) {
        var elt = list.item(i);
        var input = elt.getElementsByTagName("input").item(0);
        var X = input.value;
        if (X == grammar.axiom) {
            elt.setAttribute("id", "axiom");
        } else {
            elt.removeAttribute("id");
        }
    }
    
    parse(false);
}

function updateAnalysis() {
    var analysis = grammar.analysis;
    if (analysis != null) {
        updateEPS(analysis.EPS);
        updateLL1(analysis.isLL1);
        var btn = document.getElementById("parsebutton");
        if (!analysis.isLL1) {
            btn.setAttribute("disabled", "");
        } else {
            btn.removeAttribute("disabled");            
        }
    }
}

function updateLL1(isLL1) {
    var cell = document.getElementById("LL1");
    
    cell.innerHTML = isLL1.toString();
}

function updateEPS(EPS) {
    var cell = document.getElementById("EPS");
    
    cell.innerHTML = "";
    for (var i = 0; i < EPS.length; i++) {
        cell.innerHTML += EPS[i];
        if (i < EPS.length - 1) {
            cell.innerHTML += ", ";
        }
    }
    if(EPS.length == 0) {
        cell.innerHTML = "&empty;"
    }
}

function onRuleHover(elt, left, ruleNb) {
    var symbols = grammar.analysis.FIRST1s[left][ruleNb - 2];
    var fis = grammar.analysis.Fis[left][ruleNb - 2];
    
    var hoverElt = document.createElement("div");
    hoverElt.setAttribute("class", "ruledescription");
    
    var br = elt.getBoundingClientRect();
    hoverElt.setAttribute("style", "top: " + (br.bottom + 10 + scrollY) + "px; left: " + br.left + "px;");
    
    var first1Str = "";
    var it = symbols.values();
    var o = it.next();
    while (!o.done) {
        first1Str += o.value;
        o = it.next();
        if (!o.done) {
            first1Str += ", ";
        }
    }
    if(first1Str == "") {
        first1Str = "&empty;";
    }
    hoverElt.innerHTML = "FIRST1 : " + first1Str;
    
    elt.appendChild(hoverElt);
}

function onRuleOut(elt) {
    for (var i = 0; i < elt.children.length; i++) {
        var child = elt.children.item(i);
        var classAttribute = child.getAttribute("class");
        if (classAttribute != null && classAttribute.valueOf() == "ruledescription") {
            child.remove();
            return;
        }
    }
}

function onRuleHoverOut(elt, isHover) {
    var row = elt.parentElement;
    var left = row.getAttribute("name").valueOf(); 
    var cells = row.children;
    
    var ruleNb = 0;
    for (; ruleNb < cells.length; ruleNb++) {
        if (cells.item(ruleNb) == elt) {
            break;
        }
    }

    if (isHover) {
        onRuleHover(elt, left, ruleNb);
    } else {
        onRuleOut(elt);
    }
}

function parse(display) {
    var input = document.forms["parseinput"]["input"];
    var text = input.value;
    try {
        var tree = grammar.parse(text);
        var array = treeToString(tree, [], [], []);

        input.removeAttribute("style");
        input.removeAttribute("title");

        if(!display) {
            return;
        }

        var ps = document.getElementById("parsesequence");
        ps.innerHTML = "";
        
        var html = "";
        for (var i = 0; i < array.length; i++) {
            html += "<span class='" + array[i].type + "'>" + array[i].value + "</span>";
        }
        
        ps.innerHTML = html;
    } catch (error) {
        input.setAttribute("style", "color: red;");
        input.setAttribute("title", error.message);
    }
}