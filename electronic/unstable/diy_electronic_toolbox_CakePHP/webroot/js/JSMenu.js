/*
 * jsmenu.js
 * Event setter for jsmenu component
 * Licence GPL
 * 2016 luffah
 * 
 */
//%devonly JSLint directives
/*global document,setTimeout */
//%Require lib/lib_html.js
/*global
htElem,htAddEventListener,
addClassToHierarchy,removeClassToHierarchy,
setDisplay
*/
//%end JSLint directives
 
/* menu_event_listener_tab contains
 * 	for a menu item id and an event name
 *   the corresponding function and argument (e.g. an element id)
 */ 
var menu_event_listener_tab = {};
var last_shown = {};
var last_active_item = {};

function jsmenu_event_trigger(menu_item_id, event_name) {
    if ((menu_item_id in menu_event_listener_tab) &&
        (event_name in menu_event_listener_tab[menu_item_id])
    ) {
        var func = menu_event_listener_tab[menu_item_id][event_name][0];
        var elem_ref = menu_event_listener_tab[menu_item_id][event_name][1];
        func(menu_item_id, elem_ref);
    }
}

function jsmenu_event_add(menu_item_id, event_name, func, elem_ref) {
    var el = htElem(menu_item_id);
    if (el) {
        htAddEventListener(el, event_name, function() {
            jsmenu_event_trigger(menu_item_id, event_name);
            return false;
        });

        if (!(menu_item_id in menu_event_listener_tab)) {
            menu_event_listener_tab[menu_item_id] = [];
        }
        menu_event_listener_tab[menu_item_id][event_name] = [func, elem_ref];
    }
}


function jsmenu_event_add_batch(menu_items_action_args, event_names_to_functions, item_init_function) {
    for (var k in menu_items_action_args) {
        if (menu_items_action_args.hasOwnProperty(k)) {
            for (var i in event_names_to_functions) {
                if (event_names_to_functions.hasOwnProperty(i)) {
                    jsmenu_event_add(k, i,
                        event_names_to_functions[i],
                        menu_items_action_args[k]);
                }
            }
            item_init_function(k, menu_items_action_args[k]);
        }
    }
}

function jsmenu_switch(menu_item_id, elem_id) {
    if (last_shown !== elem_id) {
        if ('jsmenu_switch' in last_shown) {
            setDisplay(last_shown.jsmenu_switch, 'none');
            removeClassToHierarchy(last_active_item.jsmenu_switch, 'active');
        }
        last_shown.jsmenu_switch = elem_id;
        last_active_item.jsmenu_switch = menu_item_id;
        setDisplay(elem_id, 'inline-block');
        addClassToHierarchy(menu_item_id, 'active');
    }
}

function jsmenu_show(menu_item_id, unused) {
    if (!('jsmenu_showmenu' in last_shown)) {
        last_shown.jsmenu_showmenu = menu_item_id;
        last_shown.jsmenu_setup = {};
        var menu_elem = htElem(menu_item_id);
        for (var i = 0; i < menu_elem.childNodes.length; i++) {
            if (menu_elem.childNodes[i].nodeName === "UL") {
                for (var j = 0; j < menu_elem.childNodes[i].childNodes.length; j++) {
                    if (menu_elem.childNodes[i].childNodes[j].nodeName === "LI") {
                        last_shown.jsmenu_setup[i + '-' + j] = menu_elem.childNodes[i].childNodes[j].style.visibility;
                        menu_elem.childNodes[i].childNodes[j].style.visibility = 'visible';
                    }
                }
            }
        }
        setTimeout(function() {
            for (i = 0; i < menu_elem.childNodes.length; i++) {
                if (menu_elem.childNodes[i].nodeName === "UL") {
                    for (j = 0; j < menu_elem.childNodes[i].childNodes.length; j++) {
                        if (menu_elem.childNodes[i].childNodes[j].nodeName === "LI") {
                            menu_elem.childNodes[i].childNodes[j].style.visibility = last_shown.jsmenu_setup[i + '-' + j];
                        }
                    }
                }
            }
        }, 1000);
        setTimeout(function() {
            delete last_shown.jsmenu_showmenu;
            delete last_shown.jsmenu_setup;
        }, 2000);
    }
}
