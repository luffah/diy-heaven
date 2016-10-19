#!/bin/sh
#  make_insert_deps.sh
#  
#  Copyright 2016  <luffah>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
## Parameters of this script
# $1 -> input file 
#
## Usage example :
### Source path is located in the same directory
#  WEB_ROOT=webroot make_insert_deps.sh example.html example_standalone.html
#
[ -z "$1" ] && echo "! 1st and 2nd parameters INPUT and OUTPUT file are missing !" >&2 && exit 1
[ ! -f "$1" ] && echo "! 1st parameter INPUT file is actually not a file !" >&2 && exit 1



echo "## Loading post-processors ##" >&2

# block delimited by //%devonly and //%end will be hidden from your javascripts
# sed format for block removal, no spaces no specials chars
alias hidden_block_remover="sed '/\/\/%devonly/,/\/\/%end/d'"
#
# remove empty lines
alias empty_lines_remover='sed "/^[\t ]*$/d"'
alias useless_script_block_remover='sed "/<\\/script>/ {
N
s|</script>\\n<script>||
}"'
alias useless_style_block_remover='sed "/<\\/style>/ {
N
s|</style>\\n<style>||
}"'
set -x
if which uglifyjs  >&2
then 
	js_minifier="uglifyjs"
else
	js_minifier="cat";
fi
if which yui-compressor  >&2
then 
	css_minifier="yui-compressor
--type
css"
else
	css_minifier="cat";
fi
set +x
case "${WEB_ROOT}" in
	/*)
		# do nothing, use the absolute path defined in environnement
	;;
	*)
		WEB_ROOT="`dirname $1`/${WEB_ROOT}"
	;;
esac
echo "## Inserting lines in standard output ##" >&2
changes_on_includes=false
IFS='
'
sed 's/^[ ]*<\(link\)[ ]*/<\1 /;s/^[ ]*<\(script\)[ ]\+/<\1 /;s </script>< </script>\n< g;s/<style>/\n<style>/' $1 |\
while read line
do
	f_name=""
	f_load=""
	case "${line}" in
	"<link "*'rel='?'stylesheet'*)
		# Seek CSS sources
		f_name="`echo $line | sed 's/.*href=.\([-_.a-zA-Z0-9\/]*\).*/\1/'`"
		inc_type="style"
		minifier="${css_minifier}"
	;;
	"<script src="*)
		# Seek JS sources
		f_name="`echo $line | sed 's/.* src=.\([-_.a-zA-Z0-9\/]*\).*/\1/'`"
		inc_type="script"	
		minifier="${js_minifier}"
		;;
	esac
	# Include minified source in output file
	if [ -n "$f_name" ]
	then
		f_load="${WEB_ROOT}${f_name}"
		if [ -f "$f_load" ]
		then	
			echo
			echo "<${inc_type}>"
			echo -n ". ${f_name} .. " >&2
			if [ ! -f "${f_load}.min"  -o "${f_load}" -nt "${f_load}.min" ]
			then
				echo -n "do minify .. " >&2
				cat $f_load | hidden_block_remover | ${minifier}  > "${f_load}.min"
			fi
			cat "${f_load}.min"  
			echo 
			echo "</${inc_type}>"
			echo 'done' >&2
			changes_on_includes=true
		else
			echo "X (omitting $f_load)" >&2
		fi 
	else
		echo "$line" 
	fi
done | empty_lines_remover | useless_style_block_remover | useless_script_block_remover | empty_lines_remover

echo -n "## END " >&2
if ! ${changes_on_includes}
then
	 echo -n "! no changes detected on included files ! " >&2
fi
echo "##" >&2

echo "<script>console.log('File modified by $0 at `date`')</script>"

exit 0