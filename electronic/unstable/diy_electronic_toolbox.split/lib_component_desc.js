
var ComponentDesc= function(){
	this.value=['','',''];
	this.mult='';
	this.tolerance='';
	this.pow='';
	this.mode='';
	this.type='';
	this.corps='';
	this.package='';
	this.setValue=function (n,v){this.value[n]=v;}
	this.setMult=function (v){this.mult=v+"";}
	this.setTolerance=function (v){this.tolerance=v;}
	this.setPower=function (v){this.pow=v;}
	this.setMode=function (v){this.mode=v;}
	this.setType=function (v){this.type=v;}
	this.setCorps=function (v){this.corps=v;}
	this.setPackage=function (v){this.package=v;}
	this.getRef=function () {
		return secureText(formatUnit(this.getValue())+'['+this.getDesc()+']');
	}
	this.getDesc= function(){
		return "" +
		this.value[0] + "," +
		this.value[1] + "," +
		this.value[2] + "," +
		this.mult.replace(/000000$/,'M').replace(/000$/,'k') + "," +
		this.tolerance + "," +
		((this.pow!='')?this.pow:this.corps);
	}
	this.autosetMode=function (){
		this.mode=get_standard_mode(this.getDesc());
	}
	this.isComplete= function() {
		var nb=PKG_ID_TO_MODE['PACKAGE_RING'];
		return ( (this.value[0] != '') && 
			(this.value[1] != '' || (this.mode<nb+1)) &&
			(this.value[2] != '' || (this.mode<nb+2)) &&
			(this.mult != '' ) &&
			(this.tolerance != '' ) &&
			(this.pow != '' || this.mode!=PKG_ID_TO_MODE['PACKAGE_BOBINE'])
		);
	}
	this.getValue= function() {  
		return compute_value(this.value,this.mult,this.type);
	}
	this.getMeasureAndUnit= function() {
		return this.type=='CAPACITOR'?['C','Farad']:['R','Ohm'];
	}
	this.fromRef= function(desc){
		var tab_desc=get_tab_desc_in_desc(desc);
		
		this.value[0]=tab_desc[0];
		this.value[1]=tab_desc[1];
		this.value[2]=tab_desc[2];
		this.mult=tab_desc[3];
		this.tolerance=tab_desc[4];
		this.type=tab_desc[6];
		if (/^[0-9]+w$/i.test(tab_desc[5])){
			this.pow=tab_desc[5];
		} else if (/^[a-z]+$/i.test(tab_desc[5])) {
			this.corps=tab_desc[5];
		}
	}
}

function compute_value(value,mult,component_type) {
	var val="";
	if (value[0] + "" != "") {
		val=parseInt(value[0]+"");
		if (value[1] + "" !='' ) {
			val=(val*10)+parseInt(value[1]+"");
		}
		if (value[2] + "" != "" ) {
			val=(val*10)+parseInt(value[2]+"");
		}
		if (mult.length>0) {
			val=val*parseFloat(mult+"")*(
			component_type=='CAPACITOR'?Math.pow(10,-12):1);
		}
		
	}
	return val;
}

function get_value_from_tab_desc(tab_desc) {
	//[v0,v1,v2,mult,tolerance,power/color,type=RESISTOR/CAPACITOR];
	return compute_value(
		[tab_desc[0],tab_desc[1],tab_desc[2]],
		tab_desc[3],
		tab_desc[6]);
}
function get_cei_color_tab(desc) {
	var color_tab=['cei_color_None',
	'cei_color_None',
	'cei_color_None',
	'cei_color_None',
	'cei_color_None',
	'cei_color_None'];
	var tab_desc=get_tab_desc_in_desc(desc);
	color_tab[0]=color_tab_val[tab_desc[0]];
	color_tab[1]=color_tab_val[tab_desc[1]];
	color_tab[2]=color_tab_val[tab_desc[2]];
	color_tab[3]=color_tab_mult[tab_desc[3]];
	color_tab[4]=color_tab_tolerance[tab_desc[4]];
	color_tab[5]=color_tab_corps[PKG_COLOR_CHAR_TO_ID[tab_desc[5]]];
	return color_tab;
}
function get_tab_desc_in_desc(desc) {
	//tab_desc format=
	//[val1,val2,val3,mult,tolerance,power/color,type=RESISTOR/CAPACITOR];
	var value_desc=splitValueNDesc(desc);
	var v_val=value_desc[0];
	var v_desc=value_desc[1];
	var tmp_tab;
	var tab_desc=['1','','','1','0.01','C',
								is_capacitor_value(v_val)?'CAPACITOR':
								(is_resistor_value(v_val)?'RESISTOR':'')];

	if (is_desc(v_desc)) {
		tmp_tab=v_desc.split(',');
		for (var i=0; i<6;i++) {
			//default if not defined
			if (tmp_tab[i]!="") {
				tab_desc[i]=tmp_tab[i];
			}
		}
		if (tab_desc[3].length>1) {
			tab_desc[3]=tab_desc[3].replace('k','000').replace('M','000000');
		}
	} else if (is_value(v_val)){
		v_val=parseUnit(v_val);
		if (tab_desc[6]=='CAPACITOR'){
			v_val=v_val*Math.pow(10,12);
		}
		if (v_val<1) {
			v_val=""+v_val*100;
			tab_desc[0]=v_val[1];
			tab_desc[1]=(v_val[2]+"" != "" )?v_val[2]:0;
			tab_desc[2]='';
			tab_desc[3]=0.01;
		} else if (v_val<10){
			v_val=""+v_val*10;
			tab_desc[0]=v_val[1];
			tab_desc[1]=(v_val[2]+"" != "" )?v_val[2]:0;
			tab_desc[2]='';
			tab_desc[3]=0.1;
		} else {
			var e_num = (Math.round(Math.log(v_val/100)/Math.log(10)));//get exp number
			v_val=""+v_val;
			tab_desc[0]=v_val[1];
			tab_desc[1]=v_val[2];
			tab_desc[2]=v_val[3];
			tab_desc[3]=Math.pow(10,e_num);
		}
	}
	return tab_desc;
}
function get_standard_mode(tab_desc) {
	var mode;
	if (/[wW]/.test(tab_desc[5])){
		mode=PKG_ID_TO_MODE['PACKAGE_BOBINE'];
	} else {
		mode=PKG_ID_TO_MODE['PACKAGE_RING'];
		mode=mode+(tab_desc[1]!=''?1:0)+(tab_desc[2]!=''?1:0);
	}
	return mode;
}

function splitValueNDesc(desc){
	var pos1=desc.indexOf('[');
	var pos2=desc.indexOf(']',pos1);
	return [ (pos1 > -1)?desc.substring(0,pos1):'',
			 ((pos1 > -1) &&(pos2 > -1))?desc.substring(pos1+1,pos2):desc ];
}
function is_bobine_resistor(data) {
	return (/^[0-9.]+([kmM][0-9]*)?\[[0-9],[0-9]*,[0-9]*,[01.]+[kmM]?,[a-z0-9.]*,[0-9]+[wW]\]$/i).test(data);
}
function is_conform(data) {
	return (/^[0-9].*\[[0-9],[0-9]?,[0-9]?,[01.]+[kmM]?,[0-9.]*,[a-zA-Z0-9.]*\]$/).test(data);
}
function is_desc(data) {
	return (/^[0-9]?,[0-9]?,[0-9]?,[01.]*[kmM]?,[0-9.]*,[a-zA-Z0-9.]*$/).test(data);
}
function is_value(data) {
	return (/^[0-9]*[kMmnup][0-9]*$/).test(data);
}
function is_ring(data) {
	return (/^[^[]*\[[0-9],[0-9]*,[0-9]*,[01.]+[kmM]?,[0-9.]*,[A-Z]\]$/).test(data);
}
function is_ceramic(data) {
	return (/^[^[]*\[[0-9],[0-9]*,[0-9]*,[01.]+[kmM]?,[0-9.]*,c\]$/).test(data);
}
function is_electrolytic(data) {
	return (/^[^[]*\[[0-9],[0-9]*,[0-9]*,[01.]+[kmM]?,[0-9.]*,e\]$/).test(data);
}
function is_plastic(data) {
	return (/^[^[]*\[[0-9],[0-9]*,[0-9]*,[01.]+[kmM]?,[0-9.]*,p\]$/).test(data);
}
function is_resistor_value(data) {
	return (/^[0-9.]+[kM]?.*$/i).test(data);
}
function is_capacitor_value(data) {
	return (/^[0-9.]+[unp][fF]?.*$/).test(data);
}
function is_resistor(data) {
	return (/^[0-9.]+([kM][0-9]*)?\[.*\]$/).test(data);
}
function is_capacitor(data) {
	return (/^[0-9.]+[unp][fF]?([0-9]*)?\[.*\]$/).test(data);
}
function is_inductance(data) {
	return (/^[0-9.]+[m]?[hH]?([0-9]*)?\[.*\]$/).test(data);
}

function get3DigitNotation(tab_desc){
	var e_num = (Math.round(Math.log(tab_desc[3])/Math.log(10)));//get exp number
	var round_val2=0;//for case [1,0,9,1k,0.01,] we round the value -> 114
	var res=""+tab_desc[0];
	if (tab_desc[1] + "" != ""){
		if (tab_desc[2] + "" != ""){
			 round_val2=Math.round(parseFloat(tab_desc[2])/10);
			 e_num=e_num+1;
		}
		res=res+(parseInt(tab_desc[1])+round_val2);
	} else {
		res=res+'0';
		e_num=e_num-1;
	}
	
	return res + e_num;
}
function correctValueFromDesc(desc){
		var cmpnt=new ComponentDesc();
		cmpnt.fromRef(desc);
		return cmpnt.getRef();
	
}

if(LIB_UNITTEST_LOADED){
	testFunction(is_conform,['21[2,1,,1k,0.01,C]'],true,equal,"",Error('lib_component_desc'));
}
