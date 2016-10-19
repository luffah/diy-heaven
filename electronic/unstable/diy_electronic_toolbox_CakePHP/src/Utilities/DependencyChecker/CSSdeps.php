<?php
namespace App\Utilities\DependencyChecker;
use Cake\ORM\Entity;

class CSSdeps extends Entity {
	public static function get_deps($script){
		$ret=array();
		$file_path=WWW_ROOT . DIRECTORY_SEPARATOR . 'css'  . DIRECTORY_SEPARATOR . $script. '.css';
		$ignore_this_file=false;
		if ( file_exists($file_path) ) {
			$file = fopen($file_path,'r') or die("Unable to open file!");
			// Loop until we reach the end of the file.
			while (!feof($file)) {
				$l=fgets($file);
				// if $line starts with
				if ( strrpos($l, "//%Require", -strlen($l)) !== false ) {
					if ( strrpos($l, "ments done", 9) !== false ) {
						if ( strrpos($l, "this file will not be shown",19) !== false ) {
							$ignore_this_file=true;
						}
						break;
					}  else {
						preg_match_all("#[ ]+(([^ ]+).css)+#",
							$l,
							$out, PREG_PATTERN_ORDER);
						foreach ($out[2] as $script_dep_list){
							foreach ( CSSdeps::get_deps($script_dep_list) as $script_dep){
								array_push($ret,$script_dep);
							}
						}
					}
				}
			}
			fclose($file);
		}
		if (! $ignore_this_file ){ array_push($ret,$script); }
		return $ret;
	}
}
?>
