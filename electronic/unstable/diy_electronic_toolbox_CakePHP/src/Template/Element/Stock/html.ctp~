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
 * * $menu_item->get_id()
 * id is defined during creation of menu :
 * new JSMenu(...,[...,JSMenu::Element(<title>,<id>,<page template or directory containing it>)...
 * $menu_item->get_id() is typically 'block_stock_resistor' or 'block_stock_capacitor'
 * $menu_item->get_id() is splitted with '_' in order to get the component type at the end.
 */
 $component_def=explode('_',$menu_item->get_id());
 $component=$component_def[count($component_def)-1];
 $help_text='';
 $label_text='';
 
 $menu_item->set_memory('view_id','stock_view_'.$component);
 $menu_item->set_memory('textarea_id','my_stock_'.$component);
 
 switch ($component){
	case 'resistor':
		$help_text="Aide : les notations m=e-3 k=e3 M=e6 sont reconnues par ce programme";
		$label_text="Stock de résistances <small>(en Ohm, séparées par des espaces)</small>:";
		break;
	case 'capacitor':
		$help_text="Aide : les notations u=e-6 n=e-9 p=e-12  sont reconnues par ce programme";
		$label_text="Stock de condensateurs <small>(en Farad, séparées par des espaces)</small>:";
		break;
}
?>

		<section id='<?= $menu_item->get_memory('view_id') ?>' ></section>
		<section class='block_stock'>
			<div class='title'>
			  <label for="<?= $menu_item->get_memory('textarea_id') ?>"><?= $label_text?><br></label>
			</div>
			<form>
			  <textarea  id="<?= $menu_item->get_memory('textarea_id') ?>"
			  title="<?= $help_text?>"
			   rows="4" cols=
			  "50"></textarea>
			</form>
		</section>
