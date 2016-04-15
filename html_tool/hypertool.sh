#!/bin/sh
[ -n "${TEST}" ] && echo "TEST_MODE"
conf_dir="`dirname $0`/conf/"
#~ conf_tidy_beautify="${conf_dir}/tidy-beautify.conf"
#~ conf_tidy_concat="${conf_dir}/tidy-completion.conf"

errors_files=""

test_presence_of(){
	for i in "yui-compressor: test -x `which 'yui-compressor'`" \
			"python-slimmer: test -r /usr/share/pyshared/slimmer/slimmer.py" \
			"tidy: test -x `which 'tidy'`"
	do
		if [ "${1}" = "${i%%:*}" ]
		then
			if ${i#*:}
			then
				echo "Presence of ${i%%:*} : Ok"
				return 0
			fi
			echo "Presence of ${i%%:*} : Nope)"
			return 1
		fi
	done
}

tidy_wrapper(){
	[ -z "${TIDY}" ] && test_presence_of tidy && TIDY="tidy" || TIDY="none" 
	if [ "${TIDY}" = "tidy" ]
	then
		case $2 in
			beautify)
				tidy -config ${conf_tidy_beautify} -m  $1
			;;
			concat)
				tidy -config ${conf_tidy_concat} -m  $1
			;;
		esac
	fi 
		
}
my_beautifier()
{
	case $1 in
		*.js|*.css)
		curr_tab=""
		cat $1 | sed """s/){/) {/;
			s/}[\w]*else[\w]*{/} else {/;
			s|\([}|{]\)[\w]*\(//\)|\1\n\2|;
			s|\([}|{]\)[\w]*\(/\*\)|\1\n\2|;
			s|\([}]\)\([\w]*\;\)[\w]*\(/\*\)|\n\1\2\3|;
			s|\([}]\)\([\w]*\;\)[\w]*\(//\)|\n\1\2\3|;
			s|\([}]\)\([\w]*\;\)$|\n\1\2|;
			""" | while read -r line
			do
			case "$line" in
				"}"*)
					 curr_tab="${curr_tab%	}"
				;;
			esac	
			/bin/echo -E "$curr_tab$line"
			
			case "$line" in
				"/"*);;
				"<"*);;
				*"{")
				
					curr_tab="${curr_tab}	"
				;;
			esac			
		done  > $1.tmp
		mv $1.tmp $1
		;;
		*.html)
			#~ tidy_wrapper $1 beautify
		;;
	esac
}
finalize()
{
	tmp_files="$errors_files"
	errors_files=""
	for i in ${tmp_files}
	do
		echo "-------------------------"
		echo "Errors in file $i"
		echo "Openning file in vi // please check syntax"
		#~ vi $i 
		read res
		my_beautifier $i
		echo "-------------------------"
	done
	if [ -n "${errors_file}" ]
	then
		echo "Files in errors :"
		for i in ${errors_file}
		do
			echo $i
		done
	fi
}

html_fname()
{
	#idx #id
	printf "%.3d_%s.html" $1 $2
}

css_fname()
{
	#idx #id
	printf "%.3d_%s.css" $1 $2
}

js_fname()
{
	#idx #id
	/usr/bin/printf "%.3d_%s.js" $1 $2
}

set_out_file()
{
	out_file="$1"
	[ "$2" != "quiet" ] && echo "-> ${out_dir}/${out_file}"
	
}

write_to_out_file()
{
	[ -z "${TEST}" ] && /bin/echo -E "$1" >> "${out_dir}/${out_file}"
}

split_html()
{
echo split_html $1
out_dir="$1.split"
idx="0"
article_id="header"
out_file="`html_fname $idx $article_id`"
ls_scripts=""


if [ -d "${out_dir}" ]
then
	rm -r "${out_dir}" 
fi

if [ -f "$1" ]
then
	[ -z "${TEST}" ] && mkdir "${out_dir}"
	cat $1 |\
	sed 's/^[ ]*</</;s/\(<[\]*\(script\|style\|footer\)\([ ]*[^>]*\)>\)\(..*\)/\1\n\4/g' |\
	{
	while read -r line
	do
		case "$line" in
		'<article'*)
			article_id=`/bin/echo -E $line | sed 's/.*id=.\([-_.a-zA-Z0-9\/]*\).*/\1/'`
			idx=$(( idx + 1 ))
			set_out_file "`html_fname $idx $article_id`"
			;;
		'<style>')
			out_file_ref="`css_fname $idx $article_id`"
			write_to_out_file "<link rel='stylesheet' type='text/css' href='${out_file_ref}'>"
			set_out_file "${out_file_ref}"
			line=""
			;;
		'</style>')
			set_out_file "`html_fname $idx $article_id`" quiet
			line=""
		;;
		'<script src'*)
		;;
		'<script'*)
			out_file_ref="`js_fname $idx $article_id`"
			ls_scripts="${ls_scripts% ${out_file_ref}} ${out_file_ref}"
			#~ write_to_out_file "<!-- see ${out_file_ref}  for functions -->"
			set_out_file "${out_file_ref}"
			line=""
		;;
		'</script>')
			set_out_file "`html_fname $idx $article_id`" quiet
			line=""
		;;
		'<footer>'*)
			idx=700
			article_id="footer"
			set_out_file "`html_fname $idx $article_id`"
		;;
		esac
		if [ -n "$line" ]
		then
			write_to_out_file "$line"
		fi
	done
	
	# inserting script loading
	idx=900
	article_id="load_scripts"
	set_out_file "`html_fname $idx $article_id`"
	write_to_out_file "<div>"
	for script_name in ${ls_scripts}
	do
		write_to_out_file "<script src='${script_name}'></script>"
	done
	write_to_out_file "</div>"
	
	}
fi
}

concat_html_files() {
	# <dir containing files> <output filename>
	echo concat_html_files $1 $2
	split_dir=${1}
	all_html_fname=${1}/${2}
	if [ -d "${split_dir}" ]
	then
		cat ${split_dir}/[0-9][0-9][0-9]_*.html >  ${all_html_fname}
		#~ tidy_wrapper ${all_html_fname} concat
	fi
}	
insert_deps() {
	# <file_orig> <file_with_deps_included>
	echo insert_deps $1 $2
	split_dir="`dirname $1`"
	new_fname="$2"
	sed 's/^[ ]*<\(link|script\)[ ]*/<\1 /' $1 |\
	while read line
	do
		f_load=""
		case "${line}" in
		"<link "*'rel='?'stylesheet'*)
			# Seek CSS sources
			f_load="${split_dir}/`echo $line | sed 's/.*href=.\([-_.a-zA-Z0-9\/]*\).*/\1/'`"
			inc_type="style"
		;;
		"<script src="*)
			# Seek JS sources
			f_load="${split_dir}/`echo $line | sed 's/.* src=.\([-_.a-zA-Z0-9\/]*\).*/\1/'`"
			inc_type="script"
			;;
		esac
		if [ -n "$f_load" ]
		then
			if [ -f "$f_load" ]
			then
				echo "<${inc_type}>"
				cat  "$f_load"
				echo "</${inc_type}>"
			else
				echo "Omitting $f_load " 1>&2
			fi 
		else
			echo "$line" 
		fi
	done > ${new_fname}
}
beautify(){
	echo "Beautifying $1"
	if [ -d "$1" ]
	then
		for file in $1/*
		do
			echo $file
			my_beautifier $file
		done
		finalize
	elif [ -f "$1" ]
	then
		my_beautifier $1
	fi
}

case "$1" in
	"split"|"-s")
		if [ -n "$2"]
		then
		 split_html $2
		fi
	;;
	"-sb")
		$0 split_html $2
		$0 beautify $2.split
	;;
	"concat"|"-c")
		if [ -z "${2}" ]
		then
			for  i in src *.split
			do
				if [ -n "${i}" -a -d "${i}" ]
				then
					concat_html_files ${i} complete.html
				fi
			done
		else 
			concat_html_files ${tgt} complete.html 
		fi
	;;	
	"insert_deps"|"-i")
		insert_deps $2/complete.html ${2%.split}.html
	;;	
	"beautify"|"-b")
		beautify $2
	;;
	*)
	ls_html="`find . -maxdepth 1 -type f -name '*.html'`"
	ls_split="`find . -maxdepth 1 -type d -name '*.split'`"
	ls_split="${ls_split} `find . -maxdepth 1 -type d -name 'src'` "
	n=0
	for i in ${ls_split}
	do
		n=$(( n + 1 ))
		i_cmd=${i_cmd}"""concat_html_files $i complete.html \n"""
		echo "$n) Concat files into complete.html for $i" 
		
		n=$(( n + 1 ))
		i_cmd=${i_cmd}"""beautify $i  \n"""
		echo "$n) Reformat/Pretty Print all files of $i" 
		
		if [ -f "$i/complete.html" ]
		then
			n=$(( n + 1 ))
			i_cmd=${i_cmd}"""insert_deps $i/complete.html ${i%.split}.html \n"""
			echo "$n) Insert HTML and dependencies (CSS/JS) in ${i%.split}.html for $i/complete.html" 
		fi
	done
	for i in ${ls_html}
	do
		n=$(( n + 1 ))
		i_cmd=${i_cmd}"""split_html $i \n"""
		echo "$n) Split $i to $i.split" 
		
		n=$(( n + 1 ))
		i_cmd=${i_cmd}"""beautify $i  \n"""
		echo "$n) Reformat/Pretty Print $i"
	done
	echo "What is your choice ?"
	read choice
	cmd=`echo $i_cmd | sed -n ${choice}p`
	${cmd}
	;;	
esac
 
