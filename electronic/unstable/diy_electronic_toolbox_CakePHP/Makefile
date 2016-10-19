LANG:='fr'

all: unit_tests diy_electronic_toolbox
	exit

unit_tests:
	cd webroot/js; nodejs testing/functions.js >&2 /dev/null 

clean_logs:
	find logs -type f -mtime +1 -delete

clean_cache:
	find tmp/cache -type f -delete
	
clean_minified:
	find webroot -type f -name "*.min" -delete
	
diy_electronic_toolbox_php: clean_cache diy_electronic_toolbox_php
	APP_DEFAULT_LOCALE=${LANG} php index.php > diy_electronic_toolbox.html.tmp
	
diy_electronic_toolbox_static: clean_cache
	WEB_ROOT=webroot sh make_insert_deps.sh diy_electronic_toolbox.html.tmp > diy_electronic_toolbox_${LANG}.html
	
diy_electronic_toolbox: clean_cache diy_electronic_toolbox_php 
	WEB_ROOT=./webroot sh prepare_testing.sh nowebroot diy_electronic_toolbox.html.tmp > diy_electronic_toolbox.html

clean:
	rm diy_electronic_toolbox_*.html

