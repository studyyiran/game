#scp -ri ~/.ssh/github_studyyiran ./build/web-mobile root@49.232.155.212:/data/mygame/hero
cd build
rm -rf build
mv web-desktop build
cd ../
scp -ri ~/.ssh/github_studyyiran ./build/build root@49.232.155.212:/data/mygame/hero
