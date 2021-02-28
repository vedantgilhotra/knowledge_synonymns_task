pm2 delete all
cd api
npx kill-port 8888
pm2 start app.js -l app.log
cd ..
cd cron
npx kill-port 3000
pm2 start app.js -l app.log