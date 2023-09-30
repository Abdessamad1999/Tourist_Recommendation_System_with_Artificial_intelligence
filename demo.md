## Prerequisites

  ### Data-base
  - Download and install [MongoDb Compass](https://www.mongodb.com/try/download/compass)

  - Create a database with the name 'Rihla_db'.

  ### Back-end
  - [python_version >= "3.9"](https://www.python.org/)

  - Install all packages in the file 'requirement.txt' with the command : $ pip install requirement.txt

  ### Front-end
  - You need to have [node](https://nodejs.org/en/)
    [demo](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac)

  - Open folder 'front-end' in vs code or any IDE and in the terminal run this command : 
    $ npm install


## Getting Started

1- Run mongodb and Connect to a MongoDB deployment

2- Open folder 'back-end' in vs code or any IDE and in the terminal run these commands :
    $ python .\manage.py makemigrations
    $ python .\manage.py migrate
    $ python .\manage.py runserver

4- Go to 'http://localhost:8000/api/items/insert_data/' for insert items draa-tafilalet

5- Open folder 'front-end' in vs code or any IDE and in the terminal run this command :
    $ npm start

## Create Admin

1- Go to the sign-up page and register as a simple user
2- Go to the database 'Rihla_db' in Mongodb
3- Go to Collection/Table 'user' and set attribute 'is_staff' to true and save the modifications