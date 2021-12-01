# CSE412 Traffic Accidents

![Overview](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/overview.png)


# Synopsis:

The intention of this project was to give a way to visualize traffic accidents within the counties of Washington and Clackamas in Oregon. This map is a heat map of every traffic accident injury or non injury between the years 2014 and 2016. This allows the user to view hot spots with the county, spot trouble intersections or determine of fire stations are placed appropriately around the county with relation to traffic accident incidents. This data was provided by the Washington County Coordinated Communications Agency ([WCCCA](https://wccca.com/)).

This was created during Fall 2021 as a semester project for Dr. Jia Zou's Database Management (CSE412) class at Arizona State University

## Contents

- [Prerequisites](#Prerequisites)
- [Features](#Features)
- [Installation](#Installation)
- [Misc Images](#Misc-Images)
- [Credits](#Credits)

## Prerequisites:

PostgreSQL >= 12.9

PHP >= 8.0

## Features 

* Dynamically generated hotspots
* Filtering by area, date or both
* Data table of calls on map with units assigned
* Adjustable heatmap extrema / radius

## Installation 
1. Create a Postgres database 
2. Import the provided database in Database/psql_database.backup
This can be done with this by running pg_restore in the root direcotry of the projectex. `pg_restore --dbname=dbname --verbose backup/psql_database.backup`
3.  Copy config.php.example to config.php, open it, and edit the database connection configuration. 

## Misc Images

### Filter Page
![Settings](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/filter.png)

![Settings](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/CircleEx1.png)

### Data View Page
![Data View](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/DataView.png)

### Settings Page 
![Data View](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/Settings.png)

## Credits
* Brandan Tyler Lasley -[GitHub](https://github.com/TylerTheFox/)
* Daniel Salas -  [GitHub](https://github.com/Daniel-Salas481)
* Andrew Thomas - [GitHub](https://github.com/andrewgucci)