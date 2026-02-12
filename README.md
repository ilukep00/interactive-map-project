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
