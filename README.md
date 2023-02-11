# Folkatech Test
### Installation

##  Install nodeJS If not yet installed

Recommended for using PC with Linux Environment

``` sudo apt install curl ```

``` curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash ```

``` source ~/.profile ```

``` nvm install node ```

Check Version Node & NPM

``` node -v ```

``` npm -v ```
##  Install Docker and docker-compose

Recommended for using PC with Linux Environment

``` sudo apt install docker docker-compose ```

Check Version docker & docker-compose

``` docker -v ```

``` docker-compose -v ```

##  BUILD PROGRAM

Fill variable on the .env file 

RUN TEST

``` sudo docker-compose --build ```



### Run Detach
```  sudo docker-compose --build -d ```


### Docker Hub URL 

**Docker Hub Eshya**: [https://hub.docker.com/r/eshya/folkatech-test/tags](https://hub.docker.com/r/eshya/folkatech-test/tags)


### Problems that are frequently encountered

change MONGODB_URL_LOCAL in backend/.env with IP-DOCKER = your_docker_ip

```  MONGODB_URL_LOCAL= 'mongodb://IP-DOCKER:27018/folkatech' ```


if you have question , email me


