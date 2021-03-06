<?php
/* Client menu element (designed to act on the page offline) 
 * HTML part 
 * 
 * Load the pages templates referenced in the menu,
 * and so produce the page output shown to the user.
 * 
 * If the page address defined is a directory then any file containing
 * <prefix>html<suffix>.ctp inside this directory will be loaded.
 * 
 * How to call this file ?
 *  
 * <?php echo $this->element('jsmenu_pages_loader',$menu); ?>
 * 
 * with $menu=array(
 *	'menu_items' => new JSMenu(...),
 *  ...
 *	)
 */
use Cake\Cache\Cache;
use Cake\Core\Configure;
use Cake\Datasource\ConnectionManager;
use Cake\Error\Debugger;
use Cake\Network\Exception\NotFoundException;
use App\Model\Entity\JSMenu\JSMenu;

$this->layout = false;

(! isset($template_arguments)) && $template_arguments=array(); 
(! isset($template_containers_class)) &&  $template_containers_class=''; 
(! isset($tag_section)) && $tag_section='section'; 
(! isset($tag_article)) && $tag_article='article'; 
if ($tag_section != null){
	echo "<".$tag_section."><!--content displayed by menu '".$menu_items->get_item_id()."'-->\n";
}
foreach ($menu_items->getPageTemplateItems() as $menu_item){
	echo "  <".$tag_article." id='".$menu_item->get_id()."' class='".$template_containers_class."'>\n";
	// load the template of specifie type with the id store in the item
	$tmp_loader=$menu_item->type;
	$tmp_type=strtoupper(substr($tmp_loader,0,1)).substr($tmp_loader,1);
	$template_arguments['menu_item']=$menu_item;
	$page=$menu_item->get_content();
	# get the path for the element type
	list($plugin, )= $this->pluginSplit($page);	
	$subPaths = $this->_getSubPaths($tmp_type);
	$paths = $this->_paths($plugin);

	$pages_list=JSMenu::getTemplatesFiles($page,$paths,$subPaths,$this->_ext,'*html*',false);	
	
	foreach ($pages_list as $tmp){
		echo $this->$tmp_loader($tmp,$template_arguments)."\n";
	}
	echo "  </".$tag_article.">\n";
}
if ($tag_section != null){
	echo "</".$tag_section.">\n";
}
?>
