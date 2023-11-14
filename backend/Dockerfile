
FROM node:14

WORKDIR /app


COPY package*.json ./


RUN npm install
# Install nodemon globally
RUN npm install -g nodemon



COPY . .

Expose 9000

CMD ["npm", "start"]