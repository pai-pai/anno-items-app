#!/bin/sh
ROOT_DIR=/usr/share/nginx/html
echo "Replacing env constants in JS"
for file in $ROOT_DIR/assets/*.js* $ROOT_DIR/index.html;
do
  echo "Processing $file ...";
  sed -i 's|VUE_API_URL|'${VUE_API_URL}'|g' $file
done