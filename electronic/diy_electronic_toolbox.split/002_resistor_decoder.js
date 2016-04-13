function store_resistance() {
	t=PKG_CHAR_TO_ID[my_component.package];
	if (updateComponentValueView(true)) {
		shake(t);
		updateStock();
		shake(my_component.getRef());
	} else {
		hurt(t);
	}
}
function get_resistance(desc) {
	if (!(desc != null )){ 
		desc='['+
		htElem('desc_v0').value+','+
		htElem('desc_v1').value+','+
		htElem('desc_v2').value+','+
		htElem('desc_mult').value+','+
		htElem('desc_tol').value+','+
		htElem('desc_pkg').value+']';
	}
	var tab_desc=get_tab_desc_in_desc(desc);
	if (tab_desc.length>=5) {
		val_set(0,tab_desc[0]);
		val_set(1,tab_desc[1]);
		val_set(2,tab_desc[2]);
		mult_set(tab_desc[3]);
		tolerance_set(tab_desc[4]);
		if(/[wW]$/.test(tab_desc[5])){
			package_set('PACKAGE_BOBINE');
			pow_set(tab_desc[5].replace(/[wW]/,''));
		} else if (/[A-Z]/.test(tab_desc[5])){
			package_set('PACKAGE_RING');
			corps_set(PKG_COLOR_CHAR_TO_ID[tab_desc[5]]);
		} else if (/c/.test(tab_desc[5])){
			package_set('PACKAGE_CERAMIC');
		} else if (/e/.test(tab_desc[5])){
			package_set('PACKAGE_ELECTROLYTIC');
		}
		if(my_component.mode==''){
			my_component.autosetMode();
			mode_set(my_component.mode);//imply update value and delete useless values
		}
	} else {
		alert("Format de référence non reconnu");
	}
}
function run_get_resistance(event) {
	if (event.which == 13 || event.keyCode == 13) {
		get_resistance();
		return false;
	}
	return true;
}
function format_component_value_with_tolerance(val,lettre,unite) {
	if (my_component.tolerance > 0) {
		var tol=val*my_component.tolerance;
		val=formatUnit(val-tol) + ' <small>'+ unite +
		'</small> &le; ' + lettre +' &le; '+
		formatUnit(val+tol) +' <small>'+unite+'</small>';
	}
	else{
		val=lettre + '= ' +formatUnit(val) +' <small>'+ unite+'</small>';
	}
	return val;
}
function updateComponentValueView(do_store) {
	var desc=my_component.getDesc();
	var complete=my_component.isComplete();
	var measure_and_unit=my_component.getMeasureAndUnit();
	var component_stock_text=(my_component.type=='CAPACITOR')?'my_stock_capacitor':
	'my_stock_resistor';
	
	var add_btn_id='stock_add_btn';
	var add_btn_disabled_class='button_disabled';
	var val;
	htElem('component_desc').value=desc;
	if ( complete && do_store) {
		val=my_component.getRef();
		if (isValidStockFormat(val)) {
			htElem(component_stock_text).value=htElem(component_stock_text).value.concat(" ",val);
			return true;
		}
	} else {
		val=my_component.getValue();
		htElem('component_value').innerHTML=( val != "" )?(
		format_component_value_with_tolerance(val,measure_and_unit[0],measure_and_unit[1])):"?";
		htElem(add_btn_id).disabled=( !complete );
		htElem(add_btn_id).className=complete?'':add_btn_disabled_class;
	}
	return false;
}
function mode_to_prerequisite(val){
	var prereq={};
	var pim=PKG_ID_TO_MODE;
	var nb=pim['PACKAGE_RING'];
	prereq['mult']=true;
	prereq['tol']=true;
	prereq['nb_ring']=(val>=nb);
	prereq['pkg_color']=(val>=nb); 
	prereq['value0']=true; 
	prereq['value1']=((val>=(nb+1))||(val<nb));
	prereq['value2']=((val>=(nb+2))||(val<nb) && (val!=pim['PACKAGE_CERAMIC']));
	prereq['ppm']=(val>=(nb+3));
	prereq['pow']=(val==pim['PACKAGE_BOBINE']);
	prereq['view_ppm']=(val>=(nb+3));
	return prereq;
}
function mode_set(val) {;
	my_component.setMode(val);
	var prereq=mode_to_prerequisite(val);
	for (var k in prereq){
		setVisible(k,prereq[k]);
	}
	if (prereq['nb_ring']) {
		if (my_component.type=='CAPACITOR'){
			corps_set('CAPACITOR_PINK');
		} else {
			corps_set('RESISTOR_CARBON');
		}	
		if (!(prereq['ppm'])) {	setClass('view_ppm',"cei_color_None");
			if (!(prereq['value2'])) {	setClass('view_value2',"cei_color_None");
							my_component.setValue(2,'');
				if (!(prereq["value1"])) {	setClass('view_value1',"cei_color_None");
								my_component.setValue(1,'');
				}
			}
		}
		val=val-PKG_ID_TO_MODE['PACKAGE_RING']+3;
		switchClass(['NBANNEAUX'+val],'active',last_button['NBANNEAUX']);
		last_button['NBANNEAUX'][0]='NBANNEAUX'+val;
	}
	updateComponentValueView();
}
function val_set(n,val){
	if (val!=null){
	var new_last_button=[];
	setClass('view_value'+n, color_tab_val[val]);
	setInputValue('desc_v'+n,val);
	if (my_component.package==PKG_ID_TO_CHAR['PACKAGE_RING']) {
		mode_set(PKG_ID_TO_MODE[val]+n);
	}
	my_component.setValue(n,val);
	if ( (val + "") != "" ){
		new_last_button[0]='VAL'+n+'_'+val;
	}
	switchClass(new_last_button,'active',last_button['VAL'+n]);
	last_button['VAL'+n]=new_last_button;
	updateComponentValueView();
	}
}
function mult_set(val) {
	if (val!=null){
	setClass('view_mult',color_tab_mult[val]);
	setInputValue('desc_mult',val);
	my_component.setMult(val);
	switchClass(['MULT'+val],'active',last_button['MULT']);
	last_button['MULT'][0]='MULT'+val;
	updateComponentValueView();
	}
}
function tolerance_set(val) {
	if (val!=null){
	setClass('view_tol',color_tab_tolerance[val]);
	setInputValue('desc_tol',val);
	my_component.setTolerance(val);
	switchClass(['TOLERANCE'+val],'active',last_button['TOLERANCE']);
	last_button['TOLERANCE'][0]='TOLERANCE'+val;
	updateComponentValueView();
	}
}
function pow_set(val) {
	if (val!=null){
	my_component.setPower(val+'W');
	setInputValue('desc_pkg',val+'W');
	var tmpid='POW'+val;
	switchClass([tmpid],'active',last_button['POW']);
	last_button['POW'][0]=tmpid;
	updateComponentValueView();
	}
}
function package_set(val) {
	if (val!=null){
	my_component.setPackage(PKG_ID_TO_CHAR[val]);
	translateContents('MULT',PKG_ID_TO_CONTENTS_MULT[val]);
	if (val=='PACKAGE_RING') {
		mode_set(PKG_ID_TO_MODE[val]+
		(my_component.value[1]+""+my_component.value[2]).length);
	} else {
		mode_set(PKG_ID_TO_MODE[val]);
		my_component.setType(PKG_ID_TO_TYPE_DEF[val]);
		my_component.setCorps(PKG_ID_TO_CHAR[val]);
		if (val!='PACKAGE_BOBINE') {
			setInputValue('desc_pkg',PKG_ID_TO_CHAR[val]);
		}
	}
	switchClass([val],'active',last_button['PACKAGE']);
	last_button['PACKAGE'][0]=val;
	updateComponentValueView();
	}
}
function corps_set(val) {
	if (val!=null){
	htElem('resistor_body').className="resistor_view "+color_tab_corps[val];
	my_component.setType(val.match(/^(CAPACITOR|RESISTOR)/)[0]);
	my_component.setCorps(PKG_COLOR_ID_TO_CHAR[val]);
	
	setInputValue('desc_pkg',PKG_COLOR_ID_TO_CHAR[val]);
	switchClass([val],'active',last_button['PKG_COLOR']);
	last_button['PKG_COLOR'][0]=val;
	updateComponentValueView();
	}
}
function ppm_set(val,view_class) {
	if (val!=null){
	htElem('view_ppm').className=view_class;
	}
}
function init_decoder_tool() {
	var elems;
	var elem;
	var val;
	var tab_fill;
	var i, j, k, val;
	tab_fill=['value0','value1','value2','mult','tol','ppm']
	for (i=0, length = tab_fill.length; i<length; i++){
		//~ console.log(tab_fill[i]);
		elem=htElem(tab_fill[i]);
		htSetClassOnEvents(elem,'border_view_'+tab_fill[i],
		{onmouseover:'resistor_blink_val',onmouseout:'resistor_blink_val_hidden'});	
		elem=htElem('border_view_'+tab_fill[i]);
		elem.className='resistor_blink_val_hidden';
		htSetHover(elem,tab_fill[i],"{parent:'highlight'}");		
		setClass('view_'+tab_fill[i],'cei_color_None');
		setInnerHTML('view_'+tab_fill[i],'&nbsp;');
	}
	elems=document.getElementsByName('PKG_COLOR');
	last_button['PKG_COLOR']=[];
	for (i = 0, length = elems.length; i < length; i++) {
		elems[i].className=color_tab_corps[elems[i].id];
		elems[i].setAttribute('onClick','corps_set("'+elems[i].id+'")');
	}
	elems=document.getElementsByName('PACKAGE');
	last_button['PACKAGE']=[];
	for (i = 0, length = elems.length; i < length; i++) {
		elems[i].setAttribute('onClick','package_set("'+elems[i].id+'")');
	}
	
	last_button['NBANNEAUX']=[];
	htElem('nb_ring').innerHTML=htmlMatrix(
		[['title',3,4,5,6]],
		'ul',
		{ 	title : '<li class="title">'+htElem('nb_ring').title+'</li>',
			default : function(elt){
				return '<li id="NBANNEAUX'+elt+'" onClick="mode_set('+
				(PKG_ID_TO_MODE['PACKAGE_RING']+(elt-3))+')" >'+ elt+'</li> ';
				
			}
		}
	 );
	
	
	last_button['MULT']=[];
	htElem('mult').innerHTML=htmlMatrix(
		[[0,1,4,7,],[-1,2,5,'x'],[-2,3,6,'x']],
		'ul',
		{ x:'<li onClick="mult_set(1)">&nbsp;</li>',
		  default : function(elt){
				var val=Math.pow(10,elt);
				return '<li class="'+color_tab_mult[val]+
				'" id="MULT'+val+
				'" onClick="mult_set('+val+')" title="x'+formatUnit(val)+'" >'+
				elt+'</li> ';
			}
		}
	 );
	last_button['TOLERANCE']=[];
	htElem('tol').innerHTML=htmlMatrix(
		[[0.01,0.001,0.05],[0.02,0.0025,0.1],[0,0.005,0.2]],
		'ul',
		{ 0:'<li id="TOLERANCE0" onClick="tolerance_set(0)">&nbsp;</li>',
		  default : function(elt){
				return '<li id="TOLERANCE'+elt+
		'" class="'+color_tab_tolerance[elt] +
		'" onClick="tolerance_set('+elt+')">&nbsp;'+ 
		((elt*100)+"").replace(/0(\.[0-9][0-9])/,function(a,b){return b;}) +
		'&nbsp;</li> ';
			}
		}
	);
	last_button['POW']=[];
	htElem('pow').innerHTML=htmlMatrix(
		[[1,2,2.5,3,4],[5,7,11,12,20],[25,30,50,90,100],[180,250,300]],
		'ul',
		{ x:'<li>&nbsp;</li>',
		  default : function(elt){
				return '<li id="POW'+elt+'" onClick="pow_set('+elt+')">'+elt+'</li>';
			}
		 }
	);
	
	for (var j=0 ; j<3 ; j++ ){
		last_button['VAL'+j]=[];
		
		htElem('value'+j).innerHTML=htmlMatrix(
			[[0,1,4,7,],['x',2,5,8],['x',3,6,9]],
			'ul',
			{ x:'<li onClick="val_set('+j+',\'\')">&nbsp;</li>',
			default : function(elt){
				return '<li class="'+color_tab_val[elt]+
				'"id="VAL'+j+'_'+elt+
				'" onClick="val_set('+j+','+elt+')">'+
				elt+'</li> ';
			}
			});
	}
	package_set('PACKAGE_RING');
}
//memory for last activated buttons
var last_button={};
//current component desc
var my_component=new ComponentDesc();
//init graphical elements
init_decoder_tool();
