FROM debian:latest

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y \
	nodejs \
	build-essential

# Have the application source code lying in "repo" for this to work
COPY repo /srv/

# Run npm i in the place
#RUN cd /srv &&
