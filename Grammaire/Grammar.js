/**
 * Creates a non-contextual LL(1) grammar.
 * By default, its axiom is 'S'
 */
var Grammar = function() {
    this.rules = {};
    this.nonTerminals = [];
    this.axiom = null;
    this.tokens = [];
    
    this.removeToken = function (type) {
        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i].type == type) {
                this.tokens.splice(i, 1);
                return;
            }
        }
    }
    
    this.addRule = function (rule) {
        if (!this.rules.hasOwnProperty(rule.left)) {
            this.rules[rule.left] = [];
        }
        
        if (this.axiom == null) {
            this.axiom = rule.left;
        }
        this.rules[rule.left].push(rule);
    }
    
    this.removeRule = function (rule) {
        if(this.rules.hasOwnProperty(rule.left)) {
            for (var i = 0; i < this.rules[rule.left].length; i++) {
                if (this.rules[rule.left][i].equals(rule)) {
                    this.rules[rule.left].splice(i, 1);
                    break;
                }
            }
            if (this.rules[rule.left].length == 0) {
                delete this.rules[rule.left];
            }
        }
    }
    
    this.hasRule = function (rule) {
        if (!this.rules.hasOwnProperty(rule.left)) {
            return false;
        }
        
        var rules = this.rules[rule.left];
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].equals(rule)) {
                return true;
            }
        }
        
        return false;
    }
    
    this.addToken = function (type, regexp) {
        this.tokens.push({type : type, regexp : regexp});
    }
    
    this.getEPS = function () {
        var EPS = [];
        var previousLength = 0;
        var step = 0;
        do {
            previousLength = EPS.length;
            for(var left in this.rules) {
                var rules = this.rules[left];
                var found = false;
                for (var i = 0; !found && i < rules.length; i++) {
                    var rule = rules[i];
                    if(step == 0) {
                        if (rule.symbols[0].type == "epsilon" && rule.symbols.length == 1) {
                            EPS.push(left);
                            found = true;
                            break;
                        }
                    } else {
                        var allEPS = true;
                        for (var j = 0; j < rule.symbols.length; j++) {
                            var symbol = rule.symbols[j];
                            if(symbol.type != "epsilon" && (symbol.type != "nonterminal" || EPS.indexOf(symbol.value) < 0)) {
                                allEPS = false;
                                break;
                            }
                        }
                        if (allEPS && EPS.indexOf(left) < 0) {
                            EPS.push(left);
                            break;
                        }
                    }
                }
            }
            step++;
        } while(EPS.length > previousLength)
        
        return EPS;
    }
    
    this.getFis = function (EPS) {
		var Fis = {
			symbolsArray : {},
			getFi : function (A) {
				if (!this.symbolsArray.hasOwnProperty(A)) {
					return new Set();
				}
				return this.symbolsArray[A];
			},
			newFi : function(A) {
				this.symbolsArray[A] = new Set();
			},
			add : function(A, a) {
				if (!this.symbolsArray.hasOwnProperty(A)) {
					this.newFi(A);
				}
				this.symbolsArray[A].add(a);
			},
			addAll : function(A, s) {
				if (!this.symbolsArray.hasOwnProperty(A)) {
					this.newFi(A);
				}
				for (let elt of s) {
					this.symbolsArray[A].add(elt);
				}
			},
			length : function() {
				var n = 0;
				for (var i = 0; i < this.symbolsArray.length; i++) {
					n += this.symbolsArray[i].length;
				}
				return n;
			}
		}
		
		var previousLength = 0;
		do{
			previousLength = Fis.length();
			for (var left in this.rules) {
				var rules = this.rules[left];
				for (var i = 0; i < rules.length; i++) {
					var symbols = rules[i].symbols;
					for (var j = 0; j < symbols.length; j++) {
						var symbol = symbols[j];
						if (symbol.type == "epsilon") {
							continue;
						} else if (symbol.type != "nonterminal") {
							Fis.add(left, symbol.value);
							break;
						} else {
							Fis.addAll(left, Fis.getFi(symbol.value));
							if (EPS.indexOf(left) < 0) {
								break;
							}
						}
					}
				}
			}
		}while(previousLength != Fis.length())
		
		return Fis.symbolsArray;
    }
	
	this.getFIRST1 = function(Fis, symbols, EPS){
		var FIRST1 = new Set();

		for (var i = 0; i < symbols.length; i++) {
			var symbol = symbols[i];
			if(symbol.type == "token") {
				FIRST1.add(symbol.value);
				break;
			} else if (symbol.type == "nonterminal") {
				if (Fis.hasOwnProperty(symbol.value)) {
					for (let s of Fis[symbol.value]) {
						FIRST1.add(s);
					}
				}
				if (!EPS.indexOf(symbol.value)) {
					break;
				}
			} else if (symbol.type == "epsilon") {
				FIRST1.add("epsilon");
			}
		}
		
		return FIRST1;
	}
	
	this.getFIRST1s = function(Fis, EPS) {
		var FIRST1s = {};
		for (var left in this.rules) {
			var rules = this.rules[left];
			FIRST1s[left] = [];
			for (var i = 0; i < rules.length; i++) {
				FIRST1s[left].push(this.getFIRST1(Fis, rules[i].symbols, EPS));
			}
		}
		
		return FIRST1s;
	}
	
	this.isLL1 = function(FIRST1s) {
		for (var left in FIRST1s) {
			var rules = FIRST1s[left];
			for (var i = 0; i < rules.length; i++) {
				var symbols = rules[i];
				for (var j = 0; j < i; j++) {
					var symbols2 = rules[j];
					for (let s of symbols2) {
						if (symbols.has(s)) {
							return false;
						}
					}
				}
			}
		}
		
		return true;
	}
	
	this.analyze = function() {
		var EPS = this.getEPS();
		var Fis = this.getFis(EPS);
		var FIRST1s = this.getFIRST1s(Fis, EPS);
		
		return {EPS : EPS, FIRST1s : FIRST1s, isLL1 : this.isLL1(FIRST1s)};
	}
}

function Rule(left, symbols) {
    this.symbols = [];
    this.left = left;
    this.symbols = symbols;
    
    this.usesSymbol = function (symbol) {
        for (var i = 0; i < this.symbols.length; i++) {
            var s = this.symbols[i];
            if (symbol.type == s.type && symbol.value == s.value) {
                return true;
            }
        }
        
        return false;
    }
    
    this.equals = function(rule) {
        if (this.symbols.length != rule.symbols.length) {
            return false;
        }
        
        for (var j = 0; j < rule.symbols.length; j++) {
            if (rule.symbols[j].value != this.symbols[j].value) {
                break;
            }
            if (j == rule.symbols.length - 1) {
                return true;
            }
        }
    }
}

/**
 * Creates the list of symbols to replace the left-hand side of a production rule.
 */
function toSymbolList(inputString) {
    var list = [];
    var input = inputString.split(/ +/);

	if (input.length == 1 && input[0] == "\\e") {
		return [{type : "epsilon", value : "&epsilon;"}];
	}
    
    for (var k = 0; k < input.length; k++) {
        var symbol =  input[k];
        var matched = false;
            
        if (symbol == "" || symbol == "\\e") {
            continue;
        }
        
        for (var i = 0; i < grammar.tokens.length && !matched; i++) {
            var token = grammar.tokens[i].type;
            if (token == symbol) {
                list.push({type : "token", value : token});
                matched = true;
                break;
            }
        }
        
        for (var i = 0; i < grammar.nonTerminals.length && !matched; i++) {
            var nonTerminal = grammar.nonTerminals[i];
            if (symbol == nonTerminal) {
                list.push({type : "nonterminal", value : nonTerminal});
                matched = true;
                break;
            }
        }
        
        if (!matched) {
            throw new Error("Impossible to decompose the right-hand side of the rule.\n" +
            "Unknown symbol " + input[k]);
        }
    }
    
    return list;
}