#!/usr/bin/env bash
sudo npm install gulp npm-check-updates -g

sudo ncu -u
sudo npm install

bower install

gulp typescript-server concatVendor typescript sass