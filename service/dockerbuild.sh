gradle clean build installDist
docker image rm hlcservice
docker build -t hlcservice . 