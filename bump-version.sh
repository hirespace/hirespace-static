#!/usr/bin/env bash
printf "\n\n\nDo you wish to bump current version to ${1}?\n\n"

select yn in "Yes" "No"; do
	case $yn in
		Yes )
			bower version $1
                	npm version $1

                	printf "\n\n\nVersion has been bumped to {$1}\n\n"

			break;;
		No )
			echo "\n\n\nOk, maybe next time :-)\n\n"
			exit;;
	esac
done
