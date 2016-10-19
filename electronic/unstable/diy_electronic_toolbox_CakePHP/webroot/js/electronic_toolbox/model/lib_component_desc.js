//%devonly Requirements & JSLint directives
/*global console*/
//%Require lib/lib_html.js
/*global secureText*/
//%Require lib/lib_unitconv.js
/*global formatUnit,parseUnit*/
//%Require lib/lib_unittest.js
/*global testFunction,equal,LIB_UNITTEST_LOADED*/
//%Require electronic_toolbox/lib_cei_colors.js
/*global PKG_CHAR_TO_ID,PKG_ID_TO_MODE,PKG_COLOR_CHAR_TO_ID,
color_tab_tolerance,color_tab_corps,color_tab_val,color_tab_mult*/
//%Requirements done
//%end JSLint directives
var digit = "[0-9]";
var float_value = "[0-9.]+";
var int_value = "[0-9]+";
var opt_value = digit + "*";
var multiple = '[01.]*[kMm]?';
var opt_digit = digit + "?";
var resistor_units = "kM";
var capacitor_units = "unp";
var inductor_units = "m";
var opt_capacitor_unit = "fF";
var opt_inductor_unit = "hH";
var all_units = "[" + resistor_units + capacitor_units + inductor_units + "]?[" + opt_capacitor_unit + opt_inductor_unit + "]?";
var power_unit = "wW";
var desc_format = digit + ',' + opt_digit + ',' + opt_digit + ',' + multiple + ',' + float_value + ',' + "[a-zA-Z0-9.]+";

var letter_regexp = new RegExp('^[a-zA-Z]+$', '');
var power_regexp = new RegExp('^' + float_value + '[' + power_unit + ']$');

var desc_regexp = new RegExp('^' + desc_format + '$', '');
var value_regexp = new RegExp('^' + float_value + all_units + opt_value + '$', '');

//var component_desc_regexp = new RegExp('^' + float_value + all_units + opt_value + '\\[' + desc_format + '\\]' + '$', '');

var power_prop_regexp = new RegExp(".*," + float_value + '[' + power_unit + ']' + "\\]" + '$', '');

var ring_prop_regexp = new RegExp(".*,[A-Z]\\]" + '$', '');
var ceramic_prop_regexp = new RegExp(".*,c\\]" + '$', '');
var electrolytic_prop_regexp = new RegExp(".*,e\\]" + '$', '');
var plastic_prop_regexp = new RegExp(".*,p\\]" + '$', '');

var has_resistor_value_regexp = new RegExp('^' + float_value + '[' + resistor_units + ']?' + opt_value + '.*');

var has_capacitor_value_regexp = new RegExp('^' + float_value + '[' + capacitor_units + '][' + opt_capacitor_unit + ']?' + opt_value + '($|\\[)');

var has_inductor_value_regexp = new RegExp('^' + float_value + '[' + inductor_units + ']?[' + opt_inductor_unit + ']' + opt_value + '($|\\[)');

function is_resistor(data) {
    return has_resistor_value_regexp.test(data);
}

function is_capacitor(data) {
    return has_capacitor_value_regexp.test(data);
}

function is_inductor(data) {
    return has_inductor_value_regexp.test(data);
}

// components type checking
function is_bobine_resistor(data) {
    return power_prop_regexp.test(data);
}

function is_ring(data) {
    return ring_prop_regexp.test(data);
}

function is_ceramic(data) {
    return ceramic_prop_regexp.test(data);
}

function is_electrolytic(data) {
    return electrolytic_prop_regexp.test(data);
}

function is_plastic(data) {
    return plastic_prop_regexp.test(data);
}

function splitValueNDesc(desc) {
    var pos1 = desc.indexOf('[');
    var pos2 = desc.indexOf(']', pos1);
    return [(pos1 > -1) ? desc.substring(0, pos1) : desc,
        ((pos1 > -1) && (pos2 > -1)) ? desc.substring(pos1 + 1, pos2) : ''
    ];
}

function get_tab_desc_in_desc(desc) {
    //tab_desc format=
    //[val1,val2,val3,mult,tolerance,power/color,type=RESISTOR/CAPACITOR];
    var value_desc = splitValueNDesc(desc);
    var v_val = value_desc[0];
    var v_desc = value_desc[1];
    var tmp_tab;
    var tab_desc = ['1', '', '', '1', '0.01', 'C',
        has_capacitor_value_regexp.test(v_val) ? 'CAPACITOR' :
        (has_resistor_value_regexp.test(v_val) ? 'RESISTOR' : '')
    ];
    if (desc_regexp.test(v_desc)) {
        tmp_tab = v_desc.split(',');
        for (var i = 0; i < 6; i++) {
            //default if not defined
            if (tmp_tab[i] !== "") {
                tab_desc[i] = tmp_tab[i];
            }
        }
        if (tab_desc[3].length > 1) {
            tab_desc[3] = '' + parseUnit(tab_desc[3]);
        }
    } else if (value_regexp.test(v_val)) {
        v_val = parseUnit(v_val);
        if (tab_desc[6] === 'CAPACITOR') {
            v_val = v_val * Math.pow(10, 12);
        }
        if (v_val < 1) {
            v_val = "" + v_val * 100;
            tab_desc[0] = v_val[1];
            tab_desc[1] = (v_val[2] + "" !== "") ? v_val[2] : 0;
            tab_desc[2] = '';
            tab_desc[3] = '0.01';
        } else if (v_val < 10) {
            v_val = "" + v_val * 10;
            tab_desc[0] = v_val[1];
            tab_desc[1] = (v_val[2] + "" !== "") ? v_val[2] : 0;
            tab_desc[2] = '';
            tab_desc[3] = '0.1';
        } else {
            var e_num = (Math.round(Math.log(v_val / 10) / Math.log(10))); //get exp number
            v_val = "" + v_val;
            tab_desc[0] = v_val[0];
            if (v_val[1] !== '0') {
                tab_desc[1] = v_val[1];
                if (v_val[2] !== '0') {
                    tab_desc[2] = v_val[2];
                } else {
                    e_num++;
                }
            } else {
            	e_num++;
            }
            tab_desc[3] = '' + Math.pow(10, e_num);
        }
    }
    return tab_desc;
}

function get_standard_mode(tab_desc) {
    var mode;
    if (power_regexp.test(tab_desc[5])) {
        mode = PKG_ID_TO_MODE.PACKAGE_BOBINE;
    } else {
        mode = PKG_ID_TO_MODE.PACKAGE_RING;
        mode = mode + (tab_desc[1] !== '' ? 1 : 0) + (tab_desc[2] !== '' ? 1 : 0);
    }
    return mode;
}

function get3DigitNotation(tab_desc) {
    var e_num = (Math.round(Math.log(tab_desc[3]) / Math.log(10))); //get exp number
    var round_val2 = 0; //for case [1,0,9,1k,0.01,] we round the value -> 114
    var res = "" + tab_desc[0];
    if (tab_desc[1] + "" !== "") {
        if (tab_desc[2] + "" !== "") {
            round_val2 = Math.round(parseFloat(tab_desc[2]) / 10);
            e_num = e_num + 1;
        }
        res = res + (parseInt(tab_desc[1], 10) + round_val2);
    } else {
        res = res + '0';
        e_num = e_num - 1;
    }

    return res + e_num;
}

function compute_value(value, mult, component_type) {
	// compute component value with specified value in txt format
	// eg ['1','',''],'1k','RESISTOR'
    var val = "";
    if (value[0].length === 1) {
        val = parseInt(value[0], 10);
        if (value[1].length === 1) {
            val = (val * 10) + parseInt(value[1], 10);
        }
        if (value[2].length === 1 ) {
            val = (val * 10) + parseInt(value[2], 10);
        }
        if (mult.length > 0) {
            val = val * parseUnit(mult) * (
                component_type === 'CAPACITOR' ? Math.pow(10, -12) : 1);
        }

    }
    return val;
}

var ComponentDesc = function() {
    this.value = ['', '', ''];
    this.mult = '';
    this.tolerance = '';
    this.pow = '';
    this.mode = '';
    this.type = '';
    this.corps = '';
    this.package = '';
    this.setValue = function(n, v) {
    	if ( ( typeof v !== 'string' ) && ! v ) {
    		console.log('Warning : value '+ n +' is undefined (type shall be string)');
    		this.value[n] = '';
    	} else {
    		this.value[n] = v + "" ;
    	}
    };
    this.setMult = function(v) {
        this.mult = v + "";
    };
    this.setTolerance = function(v) {
        this.tolerance = v;
    };
    this.setPower = function(v) {
        this.pow = v;
    };
    this.setMode = function(v) {
        this.mode = v;
    };
    this.setType = function(v) {
        this.type = v;
    };
    this.setCorps = function(v) {
        this.corps = v;
    };
    this.setPackage = function(v) {
        this.package = v;
    };
    this.getRef = function() {
        return secureText(formatUnit(this.getValue()) + '[' + this.getDesc() + ']');
    };
    this.getDesc = function() {
        return "" +
            this.value[0] + "," +
            this.value[1] + "," +
            this.value[2] + "," +
            formatUnit(this.mult) + "," +
            this.tolerance + "," +
            ((this.pow !== '') ? this.pow : this.corps);
    };
    this.autosetMode = function() {
        this.mode = get_standard_mode(this.getDesc());
    };
    this.isComplete = function() {
        var nb = PKG_ID_TO_MODE.PACKAGE_RING;
        return ((this.value[0] !== '') &&
            (this.value[1] !== '' || (this.mode < nb + 1)) &&
            (this.value[2] !== '' || (this.mode < nb + 2)) &&
            (this.mult !== '') &&
            (this.tolerance !== '') &&
            (this.pow !== '' || this.mode !== PKG_ID_TO_MODE.PACKAGE_BOBINE)
        );
    };
    this.getValue = function() {
        return compute_value(this.value, this.mult, this.type);
    };
    this.getMeasureAndUnit = function() {
        return this.type === 'CAPACITOR' ? ['C', 'Farad'] : ['R', 'Ohm'];
    };
    this.fromRef = function(desc) {
    	var tab_desc = get_tab_desc_in_desc(desc);
    	//
        this.setValue(0,tab_desc[0]);
        this.setValue(1,tab_desc[1]);
        this.setValue(2,tab_desc[2]);
        this.setMult(tab_desc[3]);
        this.setTolerance(tab_desc[4]);
        this.setType(tab_desc[6]);
        if (power_regexp.test(tab_desc[5])) {
            this.setPower(tab_desc[5]);
        } else if (letter_regexp.test(tab_desc[5])) {
            this.setCorps(tab_desc[5]);
        }
    };
};


function get_value_from_tab_desc(tab_desc) {
    //[v0,v1,v2,mult,tolerance,power/color,type=RESISTOR/CAPACITOR];
    return compute_value(
        [tab_desc[0], tab_desc[1], tab_desc[2]],
        tab_desc[3],
        tab_desc[6]);
}

function get_cei_color_tab(desc) {
    var color_tab = ['cei_color_None',
        'cei_color_None',
        'cei_color_None',
        'cei_color_None',
        'cei_color_None',
        'cei_color_None'
    ];
    var tab_desc = get_tab_desc_in_desc(desc);
    color_tab[0] = color_tab_val[tab_desc[0]];
    color_tab[1] = color_tab_val[tab_desc[1]];
    color_tab[2] = color_tab_val[tab_desc[2]];
    color_tab[3] = color_tab_mult[tab_desc[3]];
    color_tab[4] = color_tab_tolerance[tab_desc[4]];
    color_tab[5] = color_tab_corps[PKG_COLOR_CHAR_TO_ID[tab_desc[5]]];
    return color_tab;
}

function correctValueFromDesc(desc) {
    var cmpnt = new ComponentDesc();
    cmpnt.fromRef(desc);
    return cmpnt.getRef();

}
//%devonly unit_test
function test_value_regexp(val){
		if ( value_regexp.test(val) ){
			return true;
		} else {
			return false;
		}
}
if (LIB_UNITTEST_LOADED) {
	var error_component=new Error('lib_component_desc');
	var desc_test='21[2,1,,1k,0.01,C]';
    testFunction(is_capacitor, ['21[2,1,,1k,0.01,C]'], false, equal, "", error_component);
	testFunction(is_resistor, ['21[2,1,,1k,0.01,C]'], true, equal, "", error_component);
    testFunction(test_value_regexp, [desc_test], false, equal, "", error_component);
    var value_desc = splitValueNDesc(desc_test);
    var value_desc_bis = get_tab_desc_in_desc(desc_test);
    testFunction(test_value_regexp, [value_desc[0]], true, equal, "", error_component);
    testFunction(get_value_from_tab_desc,[value_desc_bis],21000, equal, "", error_component);
    testFunction(compute_value,[['1','',''],'1k','RESISTOR'],1000, equal, "", error_component);
}
//%end unit_test
