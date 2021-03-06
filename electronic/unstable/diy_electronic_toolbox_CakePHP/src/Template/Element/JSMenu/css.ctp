<?php
/* Client menu element (designed to act on the page offline) 
 * Custom CSS part 
 * 
 * Produce CSS attributes for the specified menu.
 * (See structure in jsmenu.ctp)
 * 
 * 	How to call this file ?
 *  
 * <?php echo $this->element('jsmenu_css',$menu); ?>
 * 
 * with $menu=array(
 *  'menu_items' => [ // specific to jsmenu.ctp ] ,
 *	'menu_levels'=> array( 0 => "menu_lvl0", 1=> "menu_lvl1" ...
 *	),
 *	'menu_levels_css_class' => array(0 => 'rootLevelMenuClass',... 
 *	),
 * 	'menu_levels_css_styles' => array(
 *		// selector to match from level specified
 *		'' => array( 
 *				// --> #menuid .menu_lvl0 {...}
 *				0 => [ 'attr_css' => 'val_css', .. ],
 *				// --> #menuid .menu_lvl1 ...}
 *				1 => [<css properties for first level>] ...) 
 * 		),
 *		' li ' => [ // one another format for array(...)
 *				// --> #menuid .menu_lvl0 li {...}
 *				['width'=>'33%'],
 *				// --> #menuid .menu_lvl1 li {...}
 *				['width'=>'100%']
 *		]
 *	),
 *	'medias' => [// specific media queries in the menu context
 *				'max-width:480px' => [
 *					// --> #menuid .longdesc {...}
 *					'.longdesc' => [ 'display' => 'none' ],...
 *					],...
 *				]
 *	)
 */
	function make_css_props($css_props,$indent_space){
		if (gettype($css_props)=='array') {
			$ret="";
			foreach($css_props as $key => $value){
				$ret.=$indent_space;
				if (gettype($value)=='array'){// allow to define alternative function for each browser
					foreach($value as $val){
						$ret.=$key. ":".$val.";\n";
					}
				} else {
					if (gettype($key)=='integer'){// no hash, simple orderred array
						$ret.=$value.";\n";
					} else {
						$ret.=$key. ":".$value.";\n";
					}
				}
			}
		} else { $ret=$indent_space.$css_props.";\n" ;}
		return $ret;
	}
	function make_media_queries($media_props,$parent_id){
		if (! isset($parent_id)){$parent_id='';}
		$ret="";
		foreach($media_props as $key => $value){
			$ret.="\n"."@media screen and (".$key.") {\n";
			foreach($value as $selector => $css_props ){
				$ret.="    ".$parent_id." ".$selector."{\n";
				$ret.=make_css_props($css_props,"        ");
				$ret.="    "."}\n";
			}
			$ret.="}\n";
		}		
		return $ret;
	}
	function _css($css_selec, $css_array){
		$ret="";
		if (! empty($css_array)){
			if ( $css_selec == "" ) {
				$ret.=make_css_props($css_array,"    ");
			} else {
				$ret="\n".$css_selec."{\n";
				$ret.=make_css_props($css_array,"    ");
				$ret.="}\n";
			}
		}
		return $ret;
	}

	// This part prepare CSS properties
	(! isset($menu_level_css_styles)) && $menu_level_css_styles=array();
	// Following part print the CSS 
	// add specifics properties
	echo "<style>\n";
	foreach($menu_levels_css_styles as $sel => $menu_level_css_array){
		foreach($menu_level_css_array as $level => $css_array){
			echo _css("#".$menu_id." .".$menu_levels[$level].$sel,$css_array);
		}
	}
	
	if (! empty($medias)){
		echo make_media_queries($medias,"#".$menu_id);
	}
	echo "</style>\n";

	// add styles for each linked element
	use App\Model\Entity\JSMenu\JSMenu;
	// construct link menu_item -> element_id to show
	$js_menu_action_summary=$menu_items->gen_action_summary();
	$style_linked_events="";
	//
	foreach ($menu_items->getPageTemplateItems() as $menu_item){
		$style_linked_events.="<!--add style to element linked to menu_item '".$menu_item->get_id()."-->\n";
		$tmp_loader=$menu_item->type;
		$tmp_type=strtoupper(substr($tmp_loader,0,1)).substr($tmp_loader,1);
		$page=$menu_item->get_content();
		$template_arguments['menu_item']=$menu_item;
		# get the path for the element type
		list($plugin, )= $this->pluginSplit($page);	
		$subPaths = $this->_getSubPaths($tmp_type);
		$paths = $this->_paths($plugin);
	
		$pages_list=JSMenu::getTemplatesFiles($page,$paths,$subPaths,$this->_ext,'*css*',true);	
	
		foreach ($pages_list as $tmp){
			$style_linked_events.=$this->$tmp_loader($tmp,$template_arguments)."\n";
		}
	}
?>
<?= $style_linked_events ?>