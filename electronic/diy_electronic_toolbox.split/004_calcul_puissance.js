document.getElementById('resistance_link').value=document.getElementById('resistance').value;

function calcul_puissance() {
	setTimeout(function(){
		do_calcul_puissance();
	},0);
}

function do_calcul_puissance() {
	var v_U=parseUnit(document.getElementById('tension').value);
	var v_R=parseUnit(document.getElementById('resistance_link').value);
	var v_P=(v_U*v_U)/v_R;
	var msg="ndef";
	if (v_P>=1) {
		msg="Attention : seul des resistances de puissance".concat(((v_P>=3)?" bobinées ":" "),"peuvent supporter plus de ",((v_P>=3)?3:1), "W !");
	} else if (v_P>=0.5) {
		msg="Attention : il faut utiliser des résistances haute tension ou des résistances de puissance pour supporter plus de 0,5W !";
	} else {
		msg="Note : les résistances métalliques (bleu ou vert) génèrent moins de bruit que des résistances carbone (marron).";
	}
	document.getElementById('puissance').value=Math.round(v_P*1000)/1000;
	document.getElementById('indication_puissance').innerHTML=msg;
}
