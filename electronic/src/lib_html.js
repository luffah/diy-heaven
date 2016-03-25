function regexp_class(class_a){
	return new RegExp('(^| )'+class_a+'( |$)','');
}
function htElem(elem_id){
	return document.getElementById(elem_id);
}
function htRemoveClass(ht_elem,class_a){
	ht_elem.className=ht_elem.className.replace(regexp_class(class_a)," ");
}
function htAddClass(ht_elem,class_a){
	ht_elem.className=ht_elem.className+' '+class_a;
}
function htGoTrough(el,obj,func){
	for (var k in obj){
		if (k=='parent'){
			func(el.parentNode,obj[k]);
		}  else if (k=='this'){
			func(el,obj[k]);
		} else {
			func(el.childNodes[k],obj[k]);
		}
	}
}
function addClass(elem_id,class_a){
	var el=htElem(elem_id);
	if (typeof class_a == 'object'){
		htGoTrough(el,class_a,htAddClass);
	} else {
		htAddClass(el,class_a);
	}
}
function removeClass(elem_id,class_a){
	var el=htElem(elem_id);
	if (typeof class_a == 'object'){
		htGoTrough(el,class_a,htRemoveClass);
	} else {
		htRemoveClass(el,class_a);
	}
}
function htSetClassOnEvents(elem,elem_id,class_a){
	if (typeof class_a == 'object'){
		for (var k in class_a){
			elem.setAttribute(k,"setClass('"+elem_id+"','"+class_a[k]+"')");
		}
	}
}
function translateContents(pre_id,h){
	for (var k in h){
		htElem(pre_id+k).innerHTML=h[k];
	}
}
function htSetHover(elem,elem_id,class_a){
	elem.setAttribute('onmouseover',"addClass('"+elem_id+"',"+class_a+")");		
	elem.setAttribute('onmouseout',"removeClass('"+elem_id+"',"+class_a+")");		
}
function setClass(elem_id,class_a){
	htElem(elem_id).className=class_a;
}
function setInputValue(elem_id,val){
	htElem(elem_id).value=val;
}
function setDisplay(elem_id,dis_a){
	htElem(elem_id).style.display=dis_a;
}
function setVisible(elem_id,boolean){
	htElem(elem_id).style.visibility=boolean?'visible':'hidden';
}
function setInnerHTML(elem_id,txt){
	htElem(elem_id).innerHTML=txt;
}
function getClass(elem_id){
	return htElem(elem_id).className;
}
function switchClass(array_id_a,class_a,array_id_b) {
	var idx;
	for (idx=0;idx<array_id_a.length;idx++) {
		addClass(array_id_a[idx],class_a);
	}
	for (idx=0;idx<array_id_b.length;idx++) {
		removeClass(array_id_b[idx],class_a);
	}
}
function getCheckedElementByName(doc,elem_name) {
	var radios=doc.getElementsByName(elem_name);
	var res;
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			res=radios[i];
			break;
		}
	}
	return res;
}
function secureText(data) {
	return data.replace("<",'&lt;').replace(">",'&gt;').replace("&mu;","u").replace("µ","u");
}
function makeHtmlTag(tagname,txt,list_attr){
	var res="<"+tagname;
	for (k in list_attr){
		if (list_attr[k]!=null){
			res=res+" "+k+'="'+list_attr[k]+'"'
		}
	}
	res=res+">"+txt+"</"+tagname+">";
	return res;
}
function htmlBtn(txt,list_attr){
	return makeHtmlTag("button",txt,list_attr);
}
function htmlArticle(txt,list_attr){
	return makeHtmlTag("article",txt,list_attr);
}
function htmlFigure(txt,caption,list_attr){
	return makeHtmlTag("figure",txt + makeHtmlTag('figcaption',caption,{}) ,list_attr);
}
function htmlDiv(tab_txt,list_attr,tab_order){
	var txt;
	if (typeof tab_txt == 'string') {
		txt=tab_txt;
	} else if (tab_order != null) {
		txt="";
		for (var i=0; i<tab_order.length; i++){
			txt=txt+tab_txt[tab_order[i]];
		}
	} else {
		txt=tab_txt.join("");
	}
	return makeHtmlTag("div",txt,list_attr);
}
function htmlSmall(txt){
	return makeHtmlTag("small",txt,{});
}
function htmlLarge(txt){
	return makeHtmlTag("large",txt,{});
}
function htmlBig(txt){
	return makeHtmlTag("big",txt,{});
}
function htmlStrong(txt){
	return makeHtmlTag("big",txt,{});
}
function htmlSpan(txt,list_attr){
	return makeHtmlTag("span",txt,list_attr);
}
function htmlMatrix(tab_fill,tag,hash_elem_func){
	var elems="";
	for (var i = 0; i < tab_fill.length; i++) {
		elems=elems+'<'+tag+'>';
		for (var k = 0; k < tab_fill[i].length; k++) {
			if (hash_elem_func!=null){
				if ( tab_fill[i][k] in hash_elem_func ){
					func=hash_elem_func[tab_fill[i][k]];
				} else if ('default' in hash_elem_func ){
					func=hash_elem_func['default'];
				} else {
					func=tab_fill[i][k];
				}
			} else { func=tab_fill[i][k]; }
			elems=elems+((typeof func=='function')?func(tab_fill[i][k]):func);
		}
		elems=elems+'</'+tag+'>';
	}
	return elems;
}
