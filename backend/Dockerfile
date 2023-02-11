FROM node:17.2.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

COPY . ./
RUN npm install
EXPOSE 3000 27017

CMD ["npm", "run", "server"]
