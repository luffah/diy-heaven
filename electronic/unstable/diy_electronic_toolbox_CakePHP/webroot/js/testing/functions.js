//%devonly JSLint directives
/*global
LIB_UNITTEST_LOADED, areUnitTestsOk
require, console, fs */
//%end JSLint directives
//%devonly unit_test/
var fs = require('fs');

function test_sequence(test_lib, fnames) {
	eval(fs.readFileSync(test_lib).toString());
    LIB_UNITTEST_LOADED = true;
    for (var i = 0; i < fnames.length; i++) {
        console.log("Load " + fnames[i] + " for testing...");
        eval(fs.readFileSync(fnames[i]).toString());
    }
    areUnitTestsOk();
}

test_sequence('lib/lib_unittest.js', ['lib/lib_html.js',
    'lib/lib_js.js',
    'lib/lib_unitconv.js',
    'electronic_toolbox/model/lib_component_desc.js'
]);
//%devonly unit_test