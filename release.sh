#!/usr/bin/env bash
printf "\n\n\nDo you wish to release to staging?\n\n"

select yn in "Yes" "No"; do
	case $yn in
		Yes )
			gulp concatVendor typescript && gulp test concatDistJS

			divshot login

			rm -r dist
			mkdir dist && mkdir dist/js

			cp -a css dist/css && rm -r dist/css/src
			cp -a images dist/images
			cp js/dist/hirespace.js dist/js/hirespace.js

			divshot push staging

			printf "\n\n\nSuccessfully released to staging\n\n"

			break;;
		No )
			printf "\n\n\nOk, maybe next time :-)\n\n"
			break;;
	esac
done

printf "\n\n\nDo you wish to update production with latest staging release?\n\n"

select yn in "Yes" "No"; do
	case $yn in
		Yes )
			divshot promote staging production

			printf "\n\n\nSuccessfully released to production\n\n"

			break;;
		No )
			printf "\n\n\nOk, maybe next time :-)\n\n"
			exit;;
	esac
done