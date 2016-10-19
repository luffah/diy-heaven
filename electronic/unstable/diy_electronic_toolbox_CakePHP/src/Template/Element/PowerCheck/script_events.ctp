<?php
/* Block stock : allow to view and define component in text format
 * 	How to call this file ?
 *  
 * <?php echo $this->element('jsmenu_css',
 *		array(menu_item=>JSMenuItem linked to this part)); ?>
 * 
 * menu_item provide usefull tricks :
 * * 
 *  $menu_item->get_memory($a)
 *  $menu_item->set_memory($a,$b)
 *  $menu_item->unset_memory($a)
 *  $menu_item->clear_memory()
 *
 */
use App\Utilities\DependencyChecker\JSdeps;
use App\Utilities\DependencyChecker\CSSdeps;

foreach ( JSdeps::get_deps(array(
	'lib/lib_calc',
	'lib/lib_html'),$this->_current) as $dep_script ){
	echo $this->Html->script($dep_script)."\n";
}
?>
<script>
htElem('resistance_link').value=htElem('resistance').value;

function calcul_puissance() {
	setTimeout(function(){
		do_calcul_puissance();
	},0);
}

function do_calcul_puissance() {
	var v_U=parseUnit(htElem('tension').value);
	var v_R=parseUnit(htElem('resistance_link').value);
	var v_P=(v_U*v_U)/v_R;
	var msg="ndef";
	if (v_P>=1) {
		msg="Attention : seul des resistances de puissance".concat(((v_P>=3)?" bobinées ":" "),"peuvent supporter plus de ",((v_P>=3)?3:1), "W !");
	} else if (v_P>=0.5) {
		msg="Attention : il faut utiliser des résistances haute tension ou des résistances de puissance pour supporter plus de 0,5W !";
	} else {
		msg="Note : les résistances métalliques (bleu ou vert) génèrent moins de bruit que des résistances carbone (marron).";
	}
	htElem('puissance').value=Math.round(v_P*1000)/1000;
	htElem('indication_puissance').innerHTML=msg;
}

</script>