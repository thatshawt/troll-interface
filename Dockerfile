# using node lets go
FROM node:12-alpine

#install some stuff we need
RUN apk update && apk upgrade
RUN apk add --no-cache python3 g++ make

# we are going to work in /app folder
# WORKDIR /app

#copy the package.json's and install the dependencies
# RUN ls -l
# idk anymore
# COPY app app
COPY app/package*.json ./app/
# RUN npm install
# COPY package-lock.json .
# COPY yarn.lock .
RUN yarn --cwd /app/install --production
RUN yarn --cwd /app/ global add nodemon
#copy source code over
COPY app ./app/

#run the app
# CMD echo BRUB RUBRUBRUIBRIURIU
# CMD ls -l
CMD yarn --cwd /app/ run start
# CMD yarn run start
