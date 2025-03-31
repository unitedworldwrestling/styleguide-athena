# uww Styleguide

### Install the styleguide

The easiest way to setup the environment is to use Docker
```bash
docker run -it -v ./:/app node:10-alpine ash
```


```bash
# if running in docker, you must install git command
# $ apk update && apk add git

$ npm install
$ bower install
$ gulp
```

### Build the styleguide with minification

```bash
$ gulp --production
```

### Build only the minimum required for production

```bash
$ gulp build
```

### Watch and compile files as you go

```bash
$ gulp serve
```

### Publish to GH Pages

```bash
$ gulp deploy
```


> This is a Yeoman generated styleguide for uww.