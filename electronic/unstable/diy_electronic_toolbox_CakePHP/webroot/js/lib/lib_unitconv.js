//%devonly Requirements & JSLint directives
//%Require lib/lib_unittest.js
/*global testFunction,equal,LIB_UNITTEST_LOADED*/
//%Requirements done
//%end JSLint directives
var parse_unit_regexp = new RegExp('(k|M|m|n|u|p)', '');

function parseUnit(a) {
    var res;
    var pos_mult = a.search(parse_unit_regexp);
    if (pos_mult > -1) {
        var mult;
        res = a.charAt(pos_mult);
        switch (res) {
            case 'M':
                mult = 1000000;
                break;
            case 'k':
                mult = 1000;
                break;
            case 'm':
                mult = parseFloat(Math.pow(10, -3));
                break;
            case 'u':
                mult = parseFloat(Math.pow(10, -6));
                break;
            case 'n':
                mult = parseFloat(Math.pow(10, -9));
                break;
            case 'p':
                mult = parseFloat(Math.pow(10, -12));
                break;
        }
        res = parseFloat(
            a.replace(res, '.')) * mult;
    } else {
        res = parseFloat(a);
    }
    return res;
}

function roundRelative(a, p) {
    var res = a + "";
    var e_num = (Math.round(Math.log(a) / Math.log(10))) - p; //get exp number
    return Math.round(a / Math.pow(10, e_num)) / Math.pow(10, -e_num);
}

function formatUnit(a, details) {
    var res = a + "";
    var p = 4; //precision
    if (a > -1) {
        if (a >= 1000000) {
            res = Math.round(a * Math.pow(10, p)) / Math.pow(10, p + 6) + 'M';
        } else if (a >= 1000) {
            res = Math.round(a * Math.pow(10, p)) / Math.pow(10, p + 3) + 'k';
        } else if (a >= 1) {
            res = Math.round(a * Math.pow(10, p)) / Math.pow(10, p);
        } else if (a >= Math.pow(10, -3)) {
            res = Math.round(a * Math.pow(10, 3 + p)) / Math.pow(10, p) + 'm';
        } else if (a >= Math.pow(10, -6)) {
            res = Math.round(a * Math.pow(10, 6 + p)) / Math.pow(10, p) + '&mu;';
        } else if (a >= Math.pow(10, -9)) {
            p = 6;
            res = (details ? Math.round(a * Math.pow(10, 6 + p)) / Math.pow(10, p) + '&mu;' +
                ' ou ' : "") + Math.round(a * Math.pow(10, 9 + p)) / Math.pow(10, p) + 'n';
        } else {
            p = 8;
            res = Math.round(a * Math.pow(10, 6 + p)) / Math.pow(10, p) + '&mu;';
            res = res + ' ou ' + Math.round(a * Math.pow(10, 9 + p)) / Math.pow(10, p) + 'n';
            res = (details ? Math.round(a * Math.pow(10, 6 + p)) / Math.pow(10, p) + '&mu;' +
                ' ou' + Math.round(a * Math.pow(10, 9 + p)) / Math.pow(10, p) + 'n' +
                ' ou ' : "") + Math.round(a * Math.pow(10, 12 + p)) / Math.pow(10, p) + 'p';

        }
    }
    return res;
}
//%devonly unit_test
if (LIB_UNITTEST_LOADED) {
    var err = new Error("lib_unit");
    testFunction(roundRelative, [0.00123456789, 3], 0.001235, equal, "", err);
    testFunction(roundRelative, [0.0123456789, 3], 0.01235, equal, "", err);
    testFunction(roundRelative, [1.23456789, 3], 1.235, equal, "", err);
    testFunction(parseUnit, ['10nf'], 1e-8, equal, "", err);
    testFunction(formatUnit, ['1e-8'], '10n', equal, "", err);
    testFunction(formatUnit, ['1e-8', true], '0.01&mu; ou 10n', equal, "", err);
}
//%end
