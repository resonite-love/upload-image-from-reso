FROM node:16
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src
RUN npm i
RUN npm run build
CMD ["node","./build/main.js"]
