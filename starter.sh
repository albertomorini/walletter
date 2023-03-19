

## start docker

docker run -d -p 27017:27017 --restart=unless-stopped --name myMongo -v mongo-data:/data/db mongo:latest &s


## start client
cd
cd dev/Walletter/Walletter
pwd
npm start &


## start server

cd 
cd dev/Walletter/server
node server.js &




