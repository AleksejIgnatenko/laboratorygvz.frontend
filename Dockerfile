FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure all necessary modules are installed
RUN npm install boxicons js-cookie jwt-decode

RUN npm run build

CMD ["npm", "start"]