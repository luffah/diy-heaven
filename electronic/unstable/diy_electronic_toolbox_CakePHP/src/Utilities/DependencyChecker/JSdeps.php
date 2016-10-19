<?php
namespace App\Utilities\DependencyChecker;
use Cake\Core\Exception\Exception;
use Cake\ORM\Entity;

class JSdeps extends Entity {
    public static $already_included=array();
    public static $ordered_inclusion=array();
	public static function get_deps($dep_list,$caller_name="",$root=true,$orig_script=""){
		if ( $root == true ) {				
			self::$ordered_inclusion=array();
		}
		foreach ($dep_list as $script){
			if ( $root == true ) {
				$orig_script = $script;
				file_put_contents('php://stderr', print_r("Require ". $orig_script . "...\n", TRUE));
			}
			if ( !in_array($script,self::$already_included) ) {
				try {
					$file_path=WWW_ROOT . DIRECTORY_SEPARATOR . 'js'  . DIRECTORY_SEPARATOR . $script. '.js';
					$ignore_this_file=false;
					
					if ( file_exists($file_path) ) {
						$file = fopen($file_path,'r') or die("Unable to open file!");
						// Reserve current file
						array_push(self::$already_included,$script);
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
								} else {
									preg_match_all("#[ ]+(([^ ]+).js)+#",
										$l,
										$out, PREG_PATTERN_ORDER);
									JSdeps::get_deps($out[2],$caller_name,false,$orig_script);
								}
							}
						}
						fclose($file);
						if ( $ignore_this_file ){
							file_put_contents('php://stderr', print_r("! ". $script . " ignored\n", TRUE));
						} else {
							array_push(self::$ordered_inclusion,$script);
						}
					} else {
						throw new Exception("file not exists" . $file_path);
					}
				} catch (Exception $e) {
					echo "The exception was created on line: " . $e->getLine();
					file_put_contents('php://stderr', print_r("! :". $e->getLine() . ": in JSdeps::get_deps('".$orig_script."') : file not exists : ". $file_path . " [ ". $e->getTraceAsString()." ]\n", TRUE));
				}	
			}
		}
		if ( $root == true ) {
			if (count(self::$ordered_inclusion) > 0 ) {
				file_put_contents('php://stderr', print_r("Requirements added => ", TRUE));
				file_put_contents('php://stderr', print_r(self::$ordered_inclusion, TRUE));
				file_put_contents('php://stderr', print_r("\n", TRUE));
			}
			return self::$ordered_inclusion;
		}
	}
}
?>
