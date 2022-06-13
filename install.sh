#!/usr/bin/env bash
sudo npm install ts-node@1.0.0 gulp@3.8.11 npm-check-updates@1.5.0 tsc@1.20150619.0+f2044a901165a2a97813772353b57dd9ed4796ca typescript@1.5.3 -g

sudo npm install ts-node -g

npm install

bower install

tsd install
tsd rebundle

gulp typescript-server concatVendor typescript sass
