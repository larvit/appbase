FROM debian:latest

RUN apt-get update && apt-get install -y wget
RUN echo 'deb http://www.rabbitmq.com/debian/ testing main' | tee /etc/apt/sources.list.d/rabbitmq.list
RUN wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | apt-key add -
RUN apt-get update && apt-get install -y rabbitmq-server

# Create admin user that can be accessed from the outside

## Start up the rabbitmq server
RUN service rabbitmq-server start \

## Last two parameters is username and password
	&& rabbitmqctl add_user test test \

## Give the test user admin possibilities
 	&& rabbitmqctl set_user_tags test administrator \

## Set permissions and stuff... dont know exactly what this does
	&& rabbitmqctl set_permissions -p / test ".*" ".*" ".*" \

## Stop the rabbitmq-server since this should be started in each container
	&& service rabbitmq-server stop
