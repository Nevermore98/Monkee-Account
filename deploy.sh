rm -rf dist &&
yarn build &&
cd dist &&
git init &&
git add . &&
git commit -m "更新部署" &&
git branch -M main &&
git remote rm origin &&
git remote add origin git@github.com:Nevermore98/Monkee-Account-Website.git &&
git push -u origin main -f &&
cd -
echo https://nevermore98.github.io/Monkee-Account-Website/
