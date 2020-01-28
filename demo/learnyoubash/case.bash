#!/usr/bin/env bash

EXT=$1

case "$EXT" in
	(jpg|jpeg|png|gif)
		echo "It is $EXT."
		;;
	(*)
		echo "$EXT is not an image!" && exit 1
		;;
esac 
