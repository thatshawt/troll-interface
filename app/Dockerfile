# using node lets go
FROM node:12-alpine

#install some stuff we need
RUN apk update && apk upgrade
RUN apk add --no-cache python3 g++ make

# we are going to work in /app folder
WORKDIR /app

#copy the package.json's and install the dependencies
RUN ls -l
COPY ./package*.json .
RUN yarn install --production
RUN yarn global add nodemon

#copy source code over
COPY . .

#run the app
# CMD echo BRUB RUBRUBRUIBRIURIU
# CMD ls -l
CMD yarn run start
