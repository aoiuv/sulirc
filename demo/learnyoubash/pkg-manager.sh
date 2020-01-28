#!/bin/bash

PS3="Choose the package manager: "
select ITEM in bower npm gem pip yarn
do
  echo -n "Enter the package name: " && read PACKAGE
  case $ITEM in
    bower) bower install $PACKAGE ;;
    npm)   npm   install $PACKAGE ;;
    gem)   gem   install $PACKAGE ;;
    pip)   pip   install $PACKAGE ;;
	yarn)  yarn  add     $PACKAGE ;;
  esac
  break # avoid infinite loop
done
