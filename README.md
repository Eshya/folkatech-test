# CAD-IT-TEST
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


### Problems that are frequently encountered

change MONGODB_URL_LOCAL in backend/.env with IP-DOCKER = your_docker_ip

```  MONGODB_URL_LOCAL= 'mongodb://IP-DOCKER:27017/chickin' ```

if you have question , email me


