document.getElementById('ecart_link').value=document.getElementById('ecart').value;
document.getElementById('nbresistances_link').value=document.getElementById('nbresistances').value;
function cherche_div_tension() {
	setTimeout(function() {
			document.getElementById('btn_cherche_div_tension').className='button_hidden';
			document.getElementById('btn_cherche_div_tension_loading').innerHTML='Recherche en cours...';
			document.getElementById('btn_cherche_div_tension_loading').className='button_waiting';
		},0);
	setTimeout(function() {
		calcul_div_tension();
		setTimeout(function() {
			document.getElementById('btn_cherche_div_tension').className='';
			document.getElementById('btn_cherche_div_tension_loading').className='button_hidden';
		},100);
	},100);
}
function cherche_div_tension_stock() {
	setTimeout(function() {
			document.getElementById('btn_cherche_div_tension_stock').className='button_hidden';
			document.getElementById('btn_cherche_div_tension_stock_loading').innerHTML='Recherche en cours...';
			document.getElementById('btn_cherche_div_tension_stock_loading').className='button_waiting';
		},0);
	setTimeout(function() {
		calcul_div_tension();
		setTimeout(function() {
			document.getElementById('btn_cherche_div_tension_stock').className='';
			document.getElementById('btn_cherche_div_tension_stock_loading').className='button_hidden';
		},100);
	},100);
}
// Equation (without charge) :
//Us=Ue*(R2)/(R1+R2) ->
//Us/R2=Ue/(R1+R2) ->
//R2/U2=(R1+R2)/Ue ->
//R2=(R1+R2)Us/Ue ->
//R2-(R2*Us/Ue)=R1*Us/Ue ->
//R2*Ue/Us - R2 = R1 -> R1 !!!
//R2*(Ue/Us - 1) = R1 ->
//R2= R1/(Ue/Us - 1) -> R2 !!!
// with charge : sub R2 by R2' = (R2 // Rs) (we can compute R2')
function calcul_div_tension() {
	var v_entree=parseUnit(document.getElementById("t_in").value);
	var v_sortie=parseUnit(document.getElementById("t_out").value);
	var r_entree=parseUnit(document.getElementById("charge_in").value);
	var r_sortie=parseUnit(document.getElementById("charge_out").value);
	var rs_influence=getCheckedElementByName(document,"influence_percent").value;
	// reinitialization of the output
	var v_solution=[];
	var v_r1=-1;
	var v_r2=0;
	var v_r2rl;
	var r=Math.round(rs_influence*(r_sortie+r_entree)/100);
	var r_round=(r>10000)?1000:((r>1000)?100:((r>100)?10:1));
	r=(Math.round(r/r_round)*r_round);
	while ((v_r1<0) && (r>0)) {
		//R1 + Re  = (R2 // Rs)*Ue/Us - (R2 // Rs)
		v_r2=r;
		v_r2rl=getValResistancesEnParallel(v_r2,r_sortie);
		v_r1=Math.round((((v_r2rl*v_entree)/v_sortie)-v_r2rl)-r_entree);
		r=r-r_round;
	}
	if (v_r1>0) {
		//solution avec forte influence de Rs...
		document.getElementById("solution_div_tension").innerHTML="".concat(
		"<strong>R1</strong>"," = ",formatUnit(v_r1),"<br>",
		"<strong>R2</strong>"," = ",formatUnit(v_r2));
		shake("solution_div_tension");
	} else {
		document.getElementById("solution_div_tension").innerHTML="Pas de solution trouvée. Essayez de faire varier l'influence de Rs.";
	}
	return false;
}
function calcul_div_tension_stock() {
	var v_entree=parseUnit(document.getElementById("t_in").value);
	var v_sortie=parseUnit(document.getElementById("t_out").value);
	var r_entree=parseUnit(document.getElementById("charge_in").value);
	var r_sortie=parseUnit(document.getElementById("charge_out").value);
	var rs_influence=getCheckedElementByName(document,"influence_percent").value;
	var stock={
	};
	var stock_parse_tab=document.getElementById('my_stock_resistor').value.split(" ");
	var max_qte=parseInt(document.getElementById('nbresistances').value);
	var ecart=parseFloat(document.getElementById('ecart').value);
	var v_tolerance;
	// reinitialization of the output
	reformat_input_stock();// include quantification between { }
	var comb_final_set=calcul_combinaisons(max_qte);
	var v_solution=[];
	var v_r1;
	var v_r2;
	var v_r2rl;
	var v_solution_r;
	var r_virtual=Math.round(rs_influence*(r_sortie+r_entree)/100);
	var r_virtual_round=(r>10000)?1000:((r>1000)?100:((r>100)?10:1));
	var r_min=r_virtual-(r_virtual_round)*10;
	var r_max=r_virtual+(r_virtual_round)*10;
	for (var r in comb_final_set) {
		if ((r > r_max) || (r < r_min)) {continue;}
		v_tolerance=(ecart*r)/100;
		//R1' = R2'*U/U2 - R2'
		//  R1' = (R1 + Re)      R2' = (R2 // Rs)
		v_r2rl=getValResistancesEnParallel(r,r_sortie);
		v_r1=(((v_r2rl*v_entree)/v_sortie)-v_r2rl)-r_entree;
		if ((v_r1<0)) {continue;}
		//~ console.log(r,v_entree,v_sortie,v_r1);
		v_solution_r=SearchGroup(r,v_tolerance,comb_final_set);
		if (v_solution_r.length>0) {
			//check if the tolerance for the current resistor is enough
			v_solution=SearchGroup(v_r1,v_tolerance,comb_final_set);
			if (v_solution.length>0) {
				document.getElementById("solution_div_tension").innerHTML="".concat(
				"<strong>R1</strong>"," = ",formatUnit(r)," = ",v_solution_r[0][1],"<br>",
				"<strong>R2</strong>"," = ",formatUnit(Math.round(v_r1))," = ",v_solution[0][1]);
				shake("solution_div_tension")
				return true;
			}
		}
	}
	document.getElementById("solution_div_tension").innerHTML="Pas de solution trouvée en fouillant dans le stock. Essayez de faire varier l'influence de Rs.";
	return false;
}
var c=document.getElementById("monCanvas");
var canvOK=1;
try {c.getContext("2d");}
catch (er) {canvOK=0;}
if (canvOK==1) {
	var ctx=c.getContext("2d");
	var x=0;
	var y=0;
	ctx.fillStyle="black";
	ctx.font="10px Sans-Serif";
	ctx.beginPath();
	ctx.moveTo(30,y+10);
	ctx.lineTo(30,y+20);
	ctx.strokeRect(20,y+20,20,40);
	ctx.moveTo(30,y+60);
	ctx.lineTo(30,y+70);
	ctx.moveTo(20,y+70);
	ctx.lineTo(40,y+70);
	ctx.moveTo(25,y+80);
	ctx.lineTo(35,y+80);
	ctx.moveTo(30,y+80);
	ctx.lineTo(30,y+130);
	ctx.moveTo(30,y+10);
	ctx.lineTo(85,y+10);
	ctx.lineTo(85,y+20);
	ctx.strokeRect(75,y+20,20,40);
	ctx.moveTo(85,y+60);
	ctx.lineTo(85,y+80);
	ctx.moveTo(85,y+70);
	ctx.lineTo(135,y+70)
	ctx.moveTo(85,y+130);
	ctx.strokeRect(75,y+80,20,40);
	ctx.moveTo(85,y+120);
	ctx.lineTo(85,y+130)
	ctx.moveTo(30,y+130);
	ctx.lineTo(135,y+130);
	ctx.strokeRect(170,y+80,20,40);
	ctx.moveTo(180,y+80);
	ctx.lineTo(180,y+70)
	ctx.lineTo(145,y+70);
	ctx.moveTo(180,y+120);
	ctx.lineTo(180,y+130)
	ctx.lineTo(145,y+130);
	ctx.stroke();
	ctx.fillText ("Re", 25, y+30); 
	ctx.fillText ("R1", 80, y+30); 
	ctx.fillText ("R2", 80, y+90);
	ctx.fillText ("Rs", 175, y+90);
	//tensions
	ctx.fillStyle="green";
	ctx.strokeStyle=ctx.fillStyle;
	ctx.beginPath();
	ctx.moveTo(125,y+85);
	ctx.lineTo(125,y+120);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(125,y+80);
	ctx.lineTo(120,y+85);
	ctx.lineTo(130,y+85);
	ctx.fill();
	ctx.fillText ("Us", 130, y+105);
	ctx.beginPath();
	ctx.moveTo(60,y+25);
	ctx.lineTo(60,y+120);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(60,y+20);
	ctx.lineTo(55,y+25);
	ctx.lineTo(65,y+25);
	ctx.fill();
	ctx.fillText ("Ue", 40, y+80);
}
