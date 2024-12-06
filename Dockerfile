FROM node:20.9.0-bullseye AS build

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install

COPY . .

RUN yarn build

RUN rm -rf node_modules
RUN yarn install --production

RUN ls -l /app

FROM node:20.9.0-bullseye

WORKDIR /app

RUN yarn global add pm2

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/tsconfig.json ./tsconfig.json

RUN ls -l /app

EXPOSE 3000

CMD ["pm2-runtime", "./dist/index.js"]
