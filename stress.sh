#!/bin/sh

for file in testcases/*
do
  tree-sitter parse $file > /dev/null
  if [ $? -ne 0 ];
  then
    echo "$file didn't parse"
  fi
done

