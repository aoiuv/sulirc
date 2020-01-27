Update macOS bash version to > v3
https://apple.stackexchange.com/questions/193411/update-bash-to-version-4-0-on-osx

Fix homebrew permissions
https://stackoverflow.com/questions/16432071/how-to-fix-homebrew-permissions
e.g. sudo chown -R $(whoami) $(brew --prefix)/*

brew install bash

e.g. mkdir -p
mkdir -p $(echo project/{src,dest,test})
rm -rf ./project
