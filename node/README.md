# Boilerplate for creating node containers

Example of how to use this boilerplate

```bash
git clone <some repo> repo; # This will be copied into the container
docker build -t <appName> .;
docker run -d appName;
```


## Developing alternatives

When working it's easier to mount the cloned repository into the docker container rather than copy. We're using a separate dockerfile for that purpose.

```bash
git clone <some repo> repo;
docker build -f ./Dockerfile-development -t <appName> .;
docker run -v $PWD/repo:/srv/ -it  <appName> bash;
cd ..;
```
While inside the interactive docker container we need to install all npm packages specified in package.json.

```bash
cd /srv;
npm i;
```

And now we should be able to run the minion.

```bash
node-supervisor -e js,json ./index.js
