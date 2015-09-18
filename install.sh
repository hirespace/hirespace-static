#!/usr/bin/env bash
sudo npm install gulp@latest npm-check-updates@latest tsc@latest typescript@latest -g

sudo ncu -u
sudo npm install

bower install

gulp sass typescript-server concatVendor typescript sass
