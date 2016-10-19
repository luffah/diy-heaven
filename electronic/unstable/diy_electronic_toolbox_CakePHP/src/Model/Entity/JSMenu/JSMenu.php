<?php
namespace App\Model\Entity\JSMenu;


/**
 * JSmenu entity class which extends JSMenuItem.
 *
 * Implementing class : 
 *  JSMenuItem 
 * Children : 
 *   JSMenu
 */
 
class JSMenu extends JSMenuItem{
        function __construct($title,$content){
                //construct as RootMenu
                parent::__construct(array('menu',null,$title,$content));
        }
        // the function below help to find template files of the elements called by the menu
        public static function getTemplatesFiles($filename,$paths,$subPaths,$_ext,$expression,$only_expr=false){			
			$pages_list=array();
        	foreach ($paths as $path) {
				foreach ($subPaths as $subPath) {
					$filetmp=$path.$subPath .DIRECTORY_SEPARATOR.$filename;
					if ( (! $only_expr) &&
						( file_exists( $filetmp . $_ext) ) ) {
						array_push($pages_list,$filename);
					} else if (file_exists( $filetmp )) {
						if (is_dir( $filetmp )){
							$files_in_dir=glob($filetmp . DIRECTORY_SEPARATOR . $expression . $_ext);
							foreach ($files_in_dir as $f){
								$f_begin=strlen($filetmp)-strlen($filename);
								$f_length=strlen($f)-$f_begin-strlen($_ext);
								array_push($pages_list,substr($f,$f_begin,$f_length));
							}
						}
					}
				}
			}
			return $pages_list;
		}
}
?>
