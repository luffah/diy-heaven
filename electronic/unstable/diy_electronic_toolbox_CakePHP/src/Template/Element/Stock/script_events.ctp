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

$text=$menu_item->get_memory('textarea_id');
$draw=$menu_item->get_memory('view_id');

foreach ( JSdeps::get_deps(array(
	'electronic_toolbox/view/lib_stock_view'),$this->_current) as $dep_script ){
	echo $this->Html->script($dep_script)."\n";
}
?>
<script>

addEventListener('<?= $text ?>', 'keyup',
	function (event) {
		declareInputChanged();
	});
addEventListener('<?= $text ?>', 'drop',
	function (event) {
		add_to_stock(event.dataTransfer.getData('text'))
	});
addEventListener('<?= $text ?>','dragover',
	function (event) {
		allowDrop(event);
	});
addEventListener('<?= $text ?>', 'mouseout',
	function (event) {
		updateStock(); is_valid_stock(this);
	});
addEventListener('<?= $text ?>', 'blur',
	function (event) {
		updateStock(); is_valid_stock(this);
	});
addEventListener('<?=$draw ?>', 'drop',
	function (event) {
		dropOnStock(event);
	});
addEventListener('<?= $draw ?>', 'drop',
	function (event) {
		dropOnStock(event);
		
	});
addEventListener('<?= $draw ?>', 'dragover',
	function (event) {
		allowDrop(event);
	});
addClass('<?= $draw ?>', "droppable");
</script>

