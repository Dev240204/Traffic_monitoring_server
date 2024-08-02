# Road and Location Management API

Welcome to the Road and Location Management API! This API provides endpoints for managing locations and roads. You can add, update, and retrieve information about roads and locations, as well as calculate the shortest path between two locations.

## Table of Contents

- [Features](#features)
- [Installation](#installation)

## Features

- **Location Management**
  - Add new locations
- **Road Management**
  - Add new roads between locations
  - Update traffic conditions of roads
  - Retrieve traffic condition reports
  - Retrive traffic condition of particular road
  - Calculate the shortest path between locations

## Installation

To set up this API locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/road-location-api.git
   cd road-location-api
   ```

2. **Then install all the dependencies of the application**

  ```bash
  npm install
  ```
3. **Then place your mongodb atlas url in your .env file

   ```bash
    MONGODB_URI=mongodb://localhost:27017/road-location-api
   ```
4. **Start the server**

    ``` bash
    npm start
    ```
