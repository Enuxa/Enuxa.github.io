/**
 * Creates the token list associated with a string.
 * inputString  The string to decompose as a token list
 * tokenModel   The array of tokens and its associated regular expresion
 * NOTE: each token in tokenModel must be in the form {regexp : <The regular expression>, type : <The name of this token>}
 */
function toTokenFlow(inputString, tokenModel) {
    var list = [];
    var input = inputString;
    while(input.length > 0) {
        var match = false;
        input = input.trim();
        for (var i = 0; i < tokenModel.length; i++) {
            var token = tokenModel[i];
            var result = token.regexp.exec(input);

            if (result != null && result.length > 0 && input.substring(0, result[0].length) == result[0]) {
                list.push({type : token.type, value : result[0]});
                input = input.replace (result[0], "");
                match = true;
                break;
            }
        }
        if (!match) {
            throw new Error("Can't find a token matching " + input);
        }
    }
    
    return list;
}