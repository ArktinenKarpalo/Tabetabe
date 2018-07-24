# Tabetabe

[Tabetabe](http://tabetabe.vatsul.com:3001) provides a way to organize all of your cooking recipes

## Installing

Insert keys in src/keys.js
You may give the port for the server via environment variable PORT (default 3001)

### Docker

`docker build -t tabetabe .`

`docker run -p 3001:3001 --mount source=tabetabe-images,target=/server/recipeImages --mount source=tabetabe-logs,target=/server/logs --name tabetabe-run tabetabe`
