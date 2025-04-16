FROM node:22.14.0 AS build
WORKDIR /build
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./webpack.config.js ./.babelrc ./postcss.config.js ./
COPY ./src/ ./src/
ENV NODE_ENV=production
RUN npm run build
CMD ["false"]


FROM node:22.14.0 AS release
WORKDIR /app
COPY ./package.json ./package-lock.json ./
ENV NODE_ENV=production
RUN npm ci
COPY --from=build /build/public_html/ ./public_html/
COPY --from=build /build/server.js ./
COPY ./public_html/index.html ./public_html/
CMD ["node", "server.js"]
