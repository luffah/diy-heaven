#!/bin/sh
#  prepare_testing.sh
#  
case "$1" in
	nowebroot)
	sed "s|src=\"/js|src=\"${WEB_ROOT}/js|g;s|href=\"/css|href=\"${WEB_ROOT}/css|g;" $2
	;;
esac