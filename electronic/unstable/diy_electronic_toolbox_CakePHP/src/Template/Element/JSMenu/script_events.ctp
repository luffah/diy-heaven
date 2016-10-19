<?php
use App\Model\Entity\JSMenu\JSMenu;
use App\Utilities\DependencyChecker\JSdeps;

// load Javascript part of 'jsmenu' element and its dependency
foreach ( JSdeps::get_deps(array('JSMenu'),$this->_current) as $dep_script ){
	echo $this->Html->script($dep_script)."\n";
}

// construct link menu_item -> element_id to show
$js_menu_action_summary=$menu_items->gen_action_summary();

// add scripts for each linked element
$scripts_linked_events="";
//
foreach ($menu_items->getPageTemplateItems() as $menu_item){
	$scripts_linked_events.="<!--add event to element linked to menu_item '".$menu_item->get_id()."-->\n";
	$tmp_loader=$menu_item->type;
	$tmp_type=strtoupper(substr($tmp_loader,0,1)).substr($tmp_loader,1);
	$page=$menu_item->get_content();
	$template_arguments['menu_item']=$menu_item;
	# get the path for the element type
	list($plugin, )= $this->pluginSplit($page);	
	$subPaths = $this->_getSubPaths($tmp_type);
	$paths = $this->_paths($plugin);

	$pages_list=JSMenu::getTemplatesFiles($page,$paths,$subPaths,$this->_ext,'*script*',true);	

	foreach ($pages_list as $tmp){
		$scripts_linked_events.=$this->$tmp_loader($tmp,$template_arguments)."\n";
	}
}
?>
<?= $scripts_linked_events ?>
<script>
// set view switching (based on the id of the HTML block) on clicks events 
jsmenu_event_add_batch(
		<?= json_encode($js_menu_action_summary['menu']) ?>,
		{
			dragover:jsmenu_show
		}, function (menu_item_id,unused){}
)
jsmenu_event_add_batch(
		<?= json_encode($js_menu_action_summary['page']) ?>,
		{
			click:jsmenu_switch,
			dragover:jsmenu_switch
		}, function (menu_item_id,div_id){
			setDisplay(div_id,'none');
		}
)
</script>
