# CSE412 Traffic Accidents

![Overview](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/overview.png)


# Synopsis:

The goal of this project was to provide a way to visualize traffic accidents within the Washington and Clackamas counties in Oregon. This map has a heatmap overlay of every traffic accident, injury or non-injury incident, between the years 2014 and 2016. This allows the user to view hotspots in both counties which can help identify problematic intersections or determine if fire stations are located appropriately around the county with relation to traffic accident incidents. This data was provided by the Washington County Consolidated Communications Agency ([WCCCA](https://wccca.com/)).

This was created during Fall 2021 as the semester project for Dr. Jia Zou's Database Management (CSE412) course at Arizona State University.

[Demo Site](https://network.brandanlasley.com/)

## Contents:

- [Prerequisites](#Prerequisites)
- [Features](#Features)
- [Installation](#Installation)
- [Misc Images](#Misc-Images)
- [Credits](#Credits)

## Prerequisites:

PostgreSQL >= 12.9

PHP >= 8.0

## Features: 

* Dynamically generated heatmap
* Heatmap filtering by area, date, or both
* Data table of mapped incidents with units assigned
* Adjustable heatmap extrema and radius

## Installation: 
1. Create a Postgres database 
2. Import the provided database in Database/psql_database.backup
This can be done with this by running pg_restore in the root direcotry of the project ex. `pg_restore --dbname=dbname --verbose backup/psql_database.backup`
3.  Copy config.php.example to config.php, open it, and edit the database connection configuration. 

## Misc. Images:

### Filter Page
![Settings](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/filter.png)
![Settings](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/CircleEx1.png)


### Data View Page
![Data View](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/DataView.png)


### Settings Page 
![Data View](https://github.com/TylerTheFox/CSE412-Traffic-Accident-Project/raw/develop/images/ex/github/Settings.png)

## Credits:
* Brandan Tyler Lasley - [GitHub](https://github.com/TylerTheFox/)
* Daniel Salas -  [GitHub](https://github.com/Daniel-Salas481)
* Andrew Thomas - [GitHub](https://github.com/andrewgucci)