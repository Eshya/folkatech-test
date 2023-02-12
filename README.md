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


### User Login And Password can be changed in .env folder backend or docker-compose environment

Default
``` DISPOSABLE_LOGIN_UNAME=root ```
``` DISPOSABLE_LOGIN_PWD=password ```



### Test API

For API Testing , you can import postman data from postman folder
Things to note when trying the API are
1. setup ```{{url}}``` environment variable . default setup is ```http://localhost:{{SERVER_PORT}}``` 
2. check auth collection login request is basic auth is in accordance with backend/.env (if stand alone) or docker-compose environment**DISPOSABLE_LOGIN_UNAME** and **DISPOSABLE_LOGIN_PWD** 
3. You can open postman from this link too **Postman Eshya**: [https://www.postman.com/eshya06/workspace/folkatech-eshya-test](https://www.postman.com/eshya06/workspace/folkatech-eshya-test) 

### Connect to MongoDB

Things to note when connect to mongodb
1. For connecting mongodb within docker using url ```"mongodb://root:mongo-database@localhost:27017"```
2. Connecting mongodb from outside application using url ```"mongodb://root:localhost@localhost:27018"```

### Problems that are frequently encountered

change MONGODB_URL_LOCAL in backend/.env with IP-DOCKER = your_docker_ip

```  MONGODB_URL_LOCAL= 'mongodb://IP-DOCKER:27018/folkatech' ```

if you have question , email me


