//%devonly Requirements & JSLint directives
//%Require lib/lib_html.js
/*global */
//%Require lib/lib_js.js
/*global reverseDict*/
//%Require lib/lib_unitconv.js
/*global formatUnit*/
//%Require lib/lib_unittest.js
/*global testFunction,equal,LIB_UNITTEST_LOADED*/
//%Require lib/lib_html.js
/*global secureText,htElem,
htmlArticle,htmlFigure,htmlSpan,htmlBig,htmlDiv,htmlBtn,htmlLarge,
htmlSmall,htmlStrong
*/
//%Require electronic_toolbox/model/lib_component_desc.js
/*global get_tab_desc_in_desc,get_standard_mode,get_cei_color_tab,
splitValueNDesc,get3DigitNotation,get_value_from_tab_desc,
is_ring,is_bobine_resistor,is_ceramic,is_plastic,is_electrolytic
*/
//%Require electronic_toolbox/lib_cei_colors.js
/*global PKG_ID_TO_MODE*/
//%Requirements done
//%end JSLint directives

var ring_pkg_model=htElem('PACKAGE_RING');

function htComponent(class_type, class_coloration, content) {
    return htmlSpan(content, {
        'class': class_type + ' ' + class_coloration
    });
}
function htSubPart(classname, content,after) {
    return htmlSpan(content, {
        'class': classname
    }) + after;
}
function fill_component_template(htelem,component_desc_txt,helper_infos) {
	var elems = htelem.getElementsByTagName('span');
	var val;
	var idx;
	var tab_desc;
    //var mode = get_standard_mode(tab_desc);
    //var value = splitValueNDesc(data)[0];
    
    var classes_list;
    var cei_coloration;
    for (idx = 0; idx < elems.length; idx++) {
		classes_list=reverseDict(elems[idx].className.split(" "));
        if('template_field' in classes_list) {
			if('color' in classes_list) {
				if (typeof cei_coloration === 'undefined') {
					cei_coloration=get_cei_color_tab(component_desc_txt);
				}
				if('cbody' in classes_list) {
					val=cei_coloration[5];
				} else if ('val1' in classes_list) {
					val=cei_coloration[0];
				} else if ('val2' in classes_list) {
					val=cei_coloration[1];
				} else if ('val3' in classes_list) {
					val=cei_coloration[2];
				} else if ('mult' in classes_list) {
					val=cei_coloration[3];
				} else if ('tol' in classes_list) {
					val=cei_coloration[4];
				}
				elems[idx].className="template_field color " + val;
			}
			if('text' in classes_list) {
				if (typeof tab_desc === 'undefined') {
					tab_desc=get_tab_desc_in_desc(component_desc_txt);
				}
				if('value' in classes_list) {
					val=formatUnit(get_value_from_tab_desc(tab_desc));
				} else if ('vve_value' in classes_list) {
					val=get3DigitNotation(tab_desc);
				} else if ('txtbody' in classes_list) {
					val=tab_desc[5];
				} else if ('val1' in classes_list) {
					val=tab_desc[0];
				} else if ('val2' in classes_list) {
					val=tab_desc[1];
				} else if ('val3' in classes_list) {
					val=tab_desc[2];
				} else if ('mult' in classes_list) {
					val=tab_desc[3];
				} else if ('tol' in classes_list) {
					val=tab_desc[4];
				}
				elems[idx].innerHTML=val;
			}
		}
    }
}

function ring_package_view_html(data) {
    var new_component=ring_pkg_model.cloneNode(true);
    fill_component_template(new_component,data);
    return new_component.innerHTML;
}

function ring_package_view(data) {
    var tab_desc = get_tab_desc_in_desc(data);
    var mode = get_standard_mode(tab_desc);
    var space = "&nbsp;&nbsp;";
    var cei_coloration = get_cei_color_tab(data);
    return "&mdash;" +
        htComponent("resistor_view ", cei_coloration[5],
        	"&nbsp;" +
            htSubPart(cei_coloration[0], space, ' ') +
            htSubPart(cei_coloration[1], space, ' ') +
            (mode > PKG_ID_TO_MODE.PACKAGE_RING + 1 ? htSubPart(cei_coloration[2], space, ' ') : "") +
            htSubPart(cei_coloration[3], space, ' ') +
            htSubPart(cei_coloration[4], space, ' ') +
            (mode === 6 ? htSubPart('cei_color_None',space, ' ') : "") +
            "&nbsp;") + "&mdash;";
}

function electrolytic_capacitor_view(data) {
    var value = splitValueNDesc(data)[0];
    return htmlSmall(
            htmlSpan(
                htmlSmall(
                    htSubPart('eletrolytic_pkg_view_round cei_color_Silver','&nbsp;&nbsp;&nbsp;', htmlStrong('..') + value + htmlStrong("..")
                    )
                ), {
                    'class': 'eletrolytic_pkg_view_cylinder cei_color_Black'
                }
            )
        ) +
        htSubPart('rotate_item_unvertical',"||",'');
}

function plastic_capacitor_view(data) {
    var value = splitValueNDesc(data)[0];
    return htComponent('plastic_pkg_view','cei_color_Blue',value);
}

function ceramic_capacitor_view(data) {
    var tab_desc = get_tab_desc_in_desc(data);
    return htmlSpan("&nbsp;" + get3DigitNotation(tab_desc) + "&nbsp;", {
            'class': 'eletrolytic_pkg_view_cylinder ceramic_color_Brown down_small_item'
        }) +
        htmlDiv("|&nbsp;|", {});
}

function bobine_resistor_view(data) {
    var tab_desc = get_tab_desc_in_desc(data);
    return "&mdash;" +
        htComponent('power_resistor_view','',"&nbsp;&nbsp;" +
            formatUnit(get_value_from_tab_desc(tab_desc)) + " " + tab_desc[5] + "&nbsp;&nbsp;") + "&mdash;";
}

function undefined_component(data) {
    var value = splitValueNDesc(data)[0];
    return "&mdash;" +
        htComponent('','cei_color_Black',"&nbsp;&nbsp;" + data + "&nbsp;&nbsp;") + "&mdash;";
}
function get_component_view(data){
	return  is_ring(data) ? ring_package_view_html(data) :
                (is_bobine_resistor(data) ? bobine_resistor_view(data) :
                    (is_ceramic(data) ? ceramic_capacitor_view(data) :
                        (is_plastic(data) ? plastic_capacitor_view(data) :
                            (is_electrolytic(data) ? electrolytic_capacitor_view(data) :
                                undefined_component(data)))));
}

