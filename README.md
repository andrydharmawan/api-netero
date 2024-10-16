# GENERATOR FORM

## Project setup
```
npm install
```

### Running apps for mode development
```
npm start
```
or

```
npm run start:dev
```

### Running apps for mode production
```
npm run start:prd
```

### Command Docker for mode developement
```
docker build --no-cache --build-arg env='dev' -t fly-garudaindonesia:latest -f ./Dockerfile .
docker run --name fly-garudaindonesia -d -p 4000:4000 fly-garudaindonesia:latest
```

### Command Docker for mode production
```
docker build --no-cache --build-arg env='prd' -t fly-garudaindonesia:latest -f ./Dockerfile .
docker run --name fly-garudaindonesia -d -p 4000:4000 fly-garudaindonesia:latest
```