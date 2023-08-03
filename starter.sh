

## start docker

docker run -d -p 27017:27017 --restart=unless-stopped --name myMongo -v mongo-data:/data/db mongo:latest &


## start client
cd
cd ./Walletter
npx serve -s build --listen 1998 --ssl-cert ./cert/cert.pem --ssl-key ./cert/key.pem &


## start server

cd 
cd ./server
node server.js &




