/**
 * Adds all the elements of s1 to s2
 */
function set_addAllSet(s1, s2) {
    for (let e of s2) {
        s1.add(e);
    }
}

/**
 * Returns the sum of the sizes of the sets in this object
 */
function cumulativeSizes(obj) {
    var n = 0;
    for (var i in obj) {
        n += obj[i].size;
    }
    return n;
}

function hasIntersection(s1, s2) {
    for (let x in s1) {
        if (s2.has(x)) {
            return true;
        }
    }
    return false;
}

function createSets(names) {
    var o = {};
    for (var i = 0; i < names.length; i++) {
        o[names[i]] = new Set();
    }
    return o;
}