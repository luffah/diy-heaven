//%devonly Requirements & JSLint directives
//%Requirements done
//%end JSLint directives
function reverseDict(dict) {
    var res = {};
    for (var k in dict) {
        if (dict.hasOwnProperty(k)) {
            res[dict[k]] = k;
        }
    }
    return res;
}

function hashToString(h) {
    var h_txt = '{';
    for (var k in h) {
        if (h.hasOwnProperty(k)) {
            h_txt = h_txt + k + ':' + h[k].toString() + ',';
        }
    }
    return h_txt.replace(/,$/, '') + '}';
}
