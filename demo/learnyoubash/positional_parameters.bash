#!/usr/bin/env bash
echo "Positional parameters $0, $1, $2, ${3:-'default 3 param'}"
echo "All positional parameters $*"
echo "All positional parameters $@"
echo "The number of parameters $#"
echo "***************************"
