

## start docker

docker run -d -p 27017:27017 --restart=unless-stopped --name myMongo -v mongo-data:/data/db mongo:latest &

cd ~/dev/walletter/
## start client
cd ./Walletter
npx serve -s build --listen 1998 --ssl-cert ./cert/cert.pem --ssl-key ./cert/key.pem &


cd ~/dev/walletter/

## start server
cd ./server
node server.js &




