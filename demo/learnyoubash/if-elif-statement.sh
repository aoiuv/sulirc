#!/usr/bin/env bash

TARGET=$1
echo "$TARGET"

if [[ $TARGET == "Adam" ]]; then
	echo "Do not eat an apple!"
elif [[ $TARGET == "Eva" ]]; then
	echo "Do not take an apple"
else
	echo "Apples are delicious"
fi

