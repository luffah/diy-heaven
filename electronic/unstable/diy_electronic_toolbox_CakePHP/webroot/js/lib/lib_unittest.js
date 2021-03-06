//%devonly JSLint directives
/*global
document,console
*/
//%end JSLint directives
//%devonly unit_test
function equal(a, b) {
    return a === b;
}
function greater_than(a, b) {
    return a > b;
}
var unit_tests_msg = {
	'true': [],
	'false': []
};
var unit_test_idx = 0;

function testFunction(func, par, eres, testvalid, name, error) {
    var res = null;
    try {
		if (par.length === 0) {
			res = func();
		} else if (par.length === 1) {
			res = func(par[0]);
		} else if (par.length === 2) {
			res = func(par[0], par[1]);
		} else if (par.length === 3) {
			res = func(par[0], par[1], par[2]);
		} else if (par.length === 4) {
			res = func(par[0], par[1], par[2], par[3]);
		} else if (par.length === 5) {
			res = func(par[0], par[1], par[2], par[3], par[4]);
		} else if (par.length === 6) {
			res = func(par[0], par[1], par[2], par[3], par[4], par[5]);
		} else if (par.length === 7) {
			res = func(par[0], par[1], par[2], par[3], par[4], par[5], par[6]);
		} else if (par.length === 8) {
			res = func(par[0], par[1], par[2], par[3], par[4], par[5], par[6], par[7]);
		} else if (par.length === 9) {
			res = func(par[0], par[1], par[2], par[3], par[4], par[5], par[6], par[7], par[8]);
		}
		unit_test_idx++;
		var t = testvalid(res, eres) ? true : false;
		var par_txt = par.map(function(a) {
			return a.toString();
		}).join("' ,\n\t'");
		var msg = "Assertion #" + unit_test_idx + ((name !== null && name !== "") ? (" [" + name + "]") : "") + " : " +
			func.name + "(\n\t'" + par_txt + "')\n; expected \n\t'" + eres.toString() +
			"'\n; found\n\t'" + res + "' (" + typeof(res) + ")";
		unit_tests_msg[t+""].push();
    } catch (e) {
    	console.log("Test " + name + " fails ! ",
    		'\nFunction to test : ',func, 
    		'\nParameters : ', par,
    		'\nExpected result : ', eres,
    		'\nValidation function : ', testvalid);
    	throw(" ! Test failure : if function is a native code, try to call it throught a new nammed function.");
    }
    if ((error !== null) && !t) {
       // console.log(msg + "\nthrows '" + error + "'");
        //throw error;
        throw(msg + "\nthrows '" + error + "'");
    }
}
function areUnitTestsOk() {
    if (unit_tests_msg['false'].length > 0) {
        for (var k in unit_tests_msg['false']) {
        	if (unit_tests_msg['false'].hasOwnProperty(k)){
        		console.log(unit_tests_msg['false'][k]);
            }
        }
        return false;
    }
    return true;
}
var LIB_UNITTEST_LOADED = false;
//%end
