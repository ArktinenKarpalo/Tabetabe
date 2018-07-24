FROM node:9


RUN mkdir -p server tmp

# Copy server files
COPY ./server ./server

# Build react and move to server's static files
COPY ./client ./tmp
RUN cd tmp && npm run build && cp -r ./build/* ./../server/react
RUN rm -r tmp/

WORKDIR /server/

RUN npm install && npm cache clean --force

EXPOSE 3001

CMD ["npm", "start"]
