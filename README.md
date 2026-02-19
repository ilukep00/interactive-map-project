# Map Interactive

## Author
Iñaki Luque Pastor

## Description

The main goal of this project is the development of an interactive map allowing to create and persist geometry

## Project Structure

### Database

The following tables have been created for persisting the geometries:
* buildings: In this table polygon geometries are stored
* streets: In this table line geometries are stored
* points: In this table point geometries are stored

All the tables include a geom column for indicating the type of geometry that will be stored on it

### Geoserver
Those tables have been published as layers in Geoserver. Also some styles have been published and associated
to the layers in order to show it in a proper way in the web application

### API webservice
An API webservice have been created using fastAPI for allowing to do modifications in the database tables for external systems
The following endpoints have been created:
* registerBuilding: This endpoint receives a polygon geometry and creates a new record for it in the buildings table
* registerStreet: This endpoint receives a line geometry and creates a new record for it in the streets table
* registerPoint: This endpoint receives a point geometry and creates a new record for it in the points table
* buildingDeletion: This endpoint receives an id of building record and removes it from the buildings table
* streetDeletion: This endpoint receives an id of street record and removes it from the streets table
* pointDeletion: This endpoint receives an id of point record and removes it from the points table
* buildingApprove: This endpoint receives an id of building record and change the status to approved of that record in the table

Using this endpoints the web application can interact with the database to persist the information

## Deploying project locally

### Steps for running map web locally
#### Prerequisites

It is necessary to have this tools installed
* Java: 
    - [Installation Guide](https://www.oracle.com/java/technologies/downloads/)
    - Version used for this project: 25.0.1
* Python:
    - [Installation Guide](https://www.python.org/downloads/)
    - Version used for this project: 3.12.5
* Node.js:
    - [Installation Guide](https://nodejs.org/en/download)
    - Version used for this project: 22.20.0
* PostgreSql:
    - [Installation Guide](https://www.postgresql.org/download/)
    - Install PostGIS Extension:
  <img width="431" height="312" alt="image" src="https://github.com/user-attachments/assets/4f1ced6b-3382-412e-8a42-ea7644a22199" />

    - Version used for this project: 18.0
* Geoserver:
    - [Installation Guide](https://docs.geoserver.org/main/en/user/installation/index.html)
    - Version used for this project: 2.27.2
      
### Creating project structure
There is a Jar file inside the geomInfra directory, which is in charge of genereting all the structure related to the database and geoserver for this project.
* Jar file: geomInfra-jar-with-dependencies.jar
* For execute it, the following command needs to be launched: ```java -jar geomInfra-jar-with-dependencies.jar```

This script will create a new postgres database and geoserver workspace both called ol_project. Take this into account because if you have a database or workspace with the same name, the script will fail.

### Installing dependencies
#### Python dependencies

The following commands need to be launched for creating a python environment and install all the required libraries in order to run the fastapi api webservice
* python -m venv venv
* venv\Scripts\activate
* pip install -r requirements.txt

Note: When running the venv\Scripts\activate command maybe some warning will appear indicating that you do not have permission for executing the script, with this command it will be solved: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

#### Npm dependencies
For installing the npm dependencies the following command is necessary
* npm install





