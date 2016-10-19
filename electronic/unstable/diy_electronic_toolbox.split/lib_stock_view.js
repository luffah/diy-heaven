function add_to_stock(data) {
	var t=(is_resistor(data)?'resistor':(is_capacitor(data)?'capacitor':''));
	if ( t != '' ){
		t='my_stock_'+t;
		htElem(t).value=htElem(t).value.concat(" ",data);	
	}
	updateStock();
}
function is_valid_stock(inputField) {
	var isValid = (/^(\s)*[0-9.]+([kmMnup][fFhH]?[0-9]*[fFhH]?)?(\[[a-z0-9.,]*\])?(\{[0-9]+\})?((\s)*[0-9.]+([kmMnup][fFhH]?[0-9]*[fFhH]?)?(\[[a-z0-9.,]*\])?(\{[0-9]+\})?)*(\s)*$/i).test(inputField.value);
	if (isValid) {
		inputField.style.backgroundColor = '#bfa';
	} else {
		inputField.style.backgroundColor = '#fba';
	}
	return isValid;
}
function reformat_input_stock() {
	htElem('my_stock_resistor').value=reformat_stock(htElem('my_stock_resistor').value);
	htElem('my_stock_capacitor').value=reformat_stock(htElem('my_stock_capacitor').value);
}
function make_view_from_formatted_stock(stock_txt_id,stock_view_id) {
	var stock_parse_tab=htElem(stock_txt_id).value.split(" ");
	var i;
	var k;
	var qte;
	var node=htElem(stock_view_id);
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
	for (i=0; (i <stock_parse_tab.length); i++) {
		k=stock_parse_tab[i];
		qte=parseInt(k.replace(/(.*\{)/,'').replace(/(\})/,''));
		k=k.replace(/(\{.*)/,'');
		if (k!="") {
			node.appendChild(get_component_view(k,qte,stock_txt_id));
		}
	}
}
function makeViewFromFormattedTakenStock(node_id,source_txt_id,combinefuncset) {
	var node=htElem(node_id);
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
	var formulas=new FormulaSet();
	formulas.populateFromTxt(htElem(source_txt_id).value);
	var h=formulas.getHash();
	for (k in h) {
		var value_min_max_tab=formulas.getMinMaxValues(k,combinefuncset);
		var formula_value=(value_min_max_tab[0]+value_min_max_tab[1])/2;
		formula_tol=Math.round((Math.abs(formula_value-value_min_max_tab[0])/formula_value)*100);
		add_to_taken_stock_view_resistor(k,"<em>=".concat(formula_value," (+/- ",formula_tol,"%) Ohm</em>"));
	}
}
function componentImgDiv(data_id,data_list,article_prop,figure_prop,caption_html,aside_html) {
	var div = document.createElement('tmp_div');
	var data;
	var tmp_html="";
	for (var i=0;i<data_list.length;i++) {
		data=data_list[i];
		if (data=="//") {
			tmp_html = tmp_html.concat("<br>");
		} else if (data=="(") {
			tmp_html = tmp_html.concat("<div class='resistor_inline'>");
		} else if (data==")") {
			tmp_html = tmp_html.concat("</div>");
		} else {
			tmp_html= tmp_html + (is_ring(data)?ring_package_view(data):
				(is_bobine_resistor(data)?bobine_resistor_view(data):
				(is_ceramic(data)?ceramic_capacitor_view(data):
				(is_plastic(data)?plastic_capacitor_view(data):
				(is_electrolytic(data)?electrolytic_capacitor_view(data):
				undefined_component(data))))));
		}
	}
	figure_prop['id']=data_id;
	div.innerHTML=htmlArticle(
		htmlFigure(tmp_html,caption_html,figure_prop) + aside_html,
	article_prop);
	return div;
}
function get_component_view(data,qte,input_id) {
	return componentImgDiv(
	/*id*/ data 
	/*components to show*/,[data] 
	/* article prop */,{class:'div_article'} 
	/* figure prop */,{class:'resistor_view_canvas', draggable:'true',
			ondragstart:"event.dataTransfer.setData('text','"+data+"')"}
	/* caption */,
		data + htmlSpan(htmlBig("&times; "+qte),
						{class:'shown_data', id:"qte"+data}) 
	/* aside */,
		htmlDiv(
		[
			htmlBtn(htmlLarge('+'),{onclick:"unblink();add_to_stock('"+data+"');"}),
			htmlBtn(htmlLarge((qte>1)?'-':'x'),
				{onclick:"popElemFromInputStock('"+data+"','"+input_id+"');",
				class:((qte>1)?null:'button_deprecated')})
			],
		{class:'div_button',
		onmouseover:"blink('qte"+data+"',0,'blink_data',200,'shown_data',500);",
		onmouseout:"unblink();"})
	);
}
function add_to_taken_stock_view_resistor(data,info) { //!TODO! affiche undefined, cf data/ 
	var formatted_caption=data.replace(
	/(\(.*)(\()/g, function(a,x,y) {return x+"<br>"+y;}).replace(
	/^(\()(.*)(\))$/g,function(a,b,x,c) {return x;}).replace(
	/(\(|\))/g,function(x) {return "&#8239;<small>"+x+"</small>&#8239;";}).replace(
	/(\/\/|\+)/g,function(x) {return "&#8239;<strong>"+x+"</strong>&#8239;";});
	
	htElem('taken_stock_view_resistor').appendChild(
	componentImgDiv(
	/*id*/ data
	/*components to show*/,data.match(/(\(|\)|\/\/|[a-z0-9.]+(\[[a-z0-9.,]*\])?)/ig)
	/* article prop */,{class:'resistor_view_canvas_resistor_small'}
	/* figure prop */,{class:' resistor_small', draggable:'true',
			ondragstart:"event.dataTransfer.setData('text','"+data+"')"}
	/* caption */,formatted_caption + 
		htmlSpan("<br>"+info,{class:'shown_data', id:data}) +
		htmlDiv([
		htmlBtn('Remettre',{onclick:"add_to_stock('"+data+"');taken_stock_remove('"+data+"');"}),
		htmlBtn('x',{onclick:"taken_stock_remove('"+data+"');",
				class:'button_deprecated'})
		],{})
	/* aside */,""
	)
	);
}
function updateStock() {
	reformat_input_stock();
	make_view_from_formatted_stock('my_stock_resistor','stock_view_resistor');
	make_view_from_formatted_stock('my_stock_capacitor','stock_view_capacitor');
}
function taken_stock_remove(formule) {
	htElem('my_stock_resistor_pris').value=htElem('my_stock_resistor_pris').value.replace(formule,"");
	makeViewFromFormattedTakenStock('taken_stock_view_resistor','my_stock_resistor_pris',combine_resistance);
}
function popElemFromInputStock(formule,input_id) {
	var grp_parse_tab=formule.replace(/[(+)]/g,function(x) {return ' '+x+' '}).replace(/(\s)+/g," ").split(" ");
	var i;
	var new_stock=htElem(input_id).value.replace(/(^|$)/g," ");
	var pos, pos2, pos3;
	var qte;
	var detailled_componant;
	var taken_stock="";
	for (i=0;i<grp_parse_tab.length;i++) {
		if ((grp_parse_tab[i]=='')||(grp_parse_tab[i]=='(')||(grp_parse_tab[i]==')')||(grp_parse_tab[i]=='+')||(grp_parse_tab[i]=='//')) {
			taken_stock=taken_stock.concat(grp_parse_tab[i]);
		} else {
			//~ console.log("|"+grp_parse_tab[i]+"|","|"+new_stock+"|");
			//check if stock still avaible
			pos=new_stock.indexOf(" "+grp_parse_tab[i]+"{");
			if (pos<0) {
				//obsolete : alternative checking : usefull if the formula doesn't contains details
				pos=new_stock.indexOf(" "+grp_parse_tab[i]+"\\[");
				if (pos<0) {
					//if not found, exit
					return "";
				}
				pos2=new_stock.indexOf("]",pos);
				if (pos2<0) {
					alert(new_stock.slice(pos,pos+grp_parse_tab[i].length+2), " est incomplet. Le format pour indiquer la référence est 'valeur[référence]'. ");
					return "";
				}
				detailled_componant=new_stock.slice(pos+1,pos2+1);
				taken_stock=taken_stock.concat(detailled_componant);
			} else {
				taken_stock=taken_stock.concat(grp_parse_tab[i]);
			}
			pos2=new_stock.indexOf("{",pos);
			pos3=new_stock.indexOf("}",pos2);
			qte=new_stock.substring(pos2+1,pos3);
			//~ console.log(qte,new_stock,pos,pos2,pos3);
			if (qte=="1") {
				new_stock=new_stock.substring(0,pos+1)+new_stock.substr(pos3+2);
			} else {
				new_stock=new_stock.substring(0,pos2+1)+(parseInt(qte)-1)+new_stock.substr(pos3);
			}
			//~ console.log(taken_stock,"<",new_stock);
		}
	}
	htElem(input_id).value=new_stock.replace(/(^\s|\s$)/g,"");
	
	updateStock();
	return taken_stock;
}
