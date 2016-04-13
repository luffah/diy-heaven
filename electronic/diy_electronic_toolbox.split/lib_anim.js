var anim={
};
var last_shown='';
var current_interval=0;
function shake(elem_id) {
	try {
	if (!(elem_id in anim)) {
		var elem=document.getElementById(elem_id);
		anim[elem_id]=elem.className;
		setTimeout(function() {
			elem.className=anim[elem_id]+" rotate_item_shake";
		},0);
		setTimeout(function() {
			elem.className=anim[elem_id];
		},100);
		setTimeout(function() {
			elem.className=anim[elem_id]+" rotate_item_shake";
		},200);
		setTimeout(function() {
			elem.className=anim[elem_id];
			delete anim[elem_id];
		},300);
	}
	} catch (e){
		throw(e+" -> elem id="+elem_id);
	}
}
function hurt(elem_id) {
	if (!(elem_id in anim)) {
		var elem=document.getElementById(elem_id);
		anim[elem_id]=elem.className;
		setTimeout(function() {
			elem.className=anim[elem_id]+" rotate_item_hurt1";
		},0);
		setTimeout(function() {
			elem.className=anim[elem_id]+" rotate_item_hurt2";;
		},100);
		setTimeout(function() {
			elem.className=anim[elem_id]+" rotate_item_hurt3";
		},200);
		setTimeout(function() {
			elem.className=anim[elem_id]+" rotate_item_hurt4";
		},300);
		setTimeout(function() {
			elem.className=anim[elem_id]+" rotate_item_hurt5";
		},400);
		setTimeout(function() {
			elem.className=anim[elem_id];
			delete anim[elem_id];
		},500);
	}
}
function blink(elem_id,time1,class1,time2,class2,timeinterval) {
	if(current_interval>0) {
		unblink();
	}
	var elem=document.getElementById(elem_id);
	var orig_class=elem.className;
	current_interval=setInterval(function () {
		setTimeout(function() {
			elem.className=orig_class+((class1.length>0)?("( "+class1):"");
		},time1);
		setTimeout(function() {
			elem.className=orig_class+((class2.length>0)?("( "+class2):"");
		},time2);
	},timeinterval);
}
function unblink() {
	clearInterval(current_interval);
	current_interval=0;
}
