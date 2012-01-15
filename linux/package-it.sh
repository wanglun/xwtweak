#!/bin/bash

rm -rf STAGING
rm *.ipk
mkdir -p STAGING
rsync -r --exclude=.DS_Store --exclude=.svn ../enyo/ STAGING
./buildit_for_device.sh $1
cp Build_Device/xwtweak_plugin STAGING
echo "filemode.755=xwtweak_plugin" > STAGING/package.properties
palm-package STAGING
