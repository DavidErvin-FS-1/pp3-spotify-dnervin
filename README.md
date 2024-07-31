# pp3-spotify-dnervin

## Project Overview

This project utilizes [Spotify's Web API](https://developer.spotify.com/documentation/web-api) to create a web application that allows users to search for songs, albums, and artists.

## Prerequisites

- [Node.js](https://nodejs.org/en/) >= v20.14.0
- [npm](https://www.npmjs.com/) >= v10.7.0
- Web browser with JavaScript enabled (e.g. Chrome, Firefox, Safari)

## Getting Started

Make sure you have Node.js and npm installed on your machine. You can check if you have them installed by running the following commands in your terminal:

```bash
#Node.js
node -v # v20.14.0

#NPM
npm -v # v10.7.0
```

Next you will need to clone this repository to your local machine. You can do this by running the following command in your terminal:

```bash
git clone https://github.com/DavidErvin-FS-1/pp3-spotify-dnervin.git
```

Open the project root directory in your terminal and run the following command to install the project dependencies:

```bash
npm install && npm run install:all
```

> This will install concurrently in the root directory and then install the client and server dependencies in their respective directories.

After the dependencies have been installed, you can build the client and start server by running the following command:

```bash
npm run start
```

> This will start the the server on `http://localhost:3001`.

## Links

The following links are available for the project:

> <sup>**Note:** The port number may vary depending on the environment configuration.</sup>

### API Auth Routes

- [http://localhost:3001/auth/login](http://localhost:3001/auth/login) - Get an access token from Spotify API to use the application features.

- [http://localhost:3001/auth/callback](http://localhost:3001/auth/callback) - Callback URL for Spotify API to redirect to after user authentication.

- [http://localhost:3001/auth/refresh](http://localhost:3001/auth/refresh) - Refresh the access token from Spotify API.

### API Spotify Routes

- [http://localhost:3001/api/search](http://localhost:3001/api/search) - Search for albums, artists, or tracks.

### Client Routes (React Web Application)

- [http://localhost:3001/\*](http://localhost:3001/) - Home page for the web application. Served via static files from the `client/build` directory.

---

Project Structure

<details>
<summary>Click to expand</summary>

```
pp3-spotify-dnervin
├─ README.md
├─ package-lock.json
├─ package.json
├─ client
│  ├─ README.md
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  └─ src
│     ├─ App.js
│     ├─ index.js
│     ├─ pages
│     │  └─ SpotifyApp.js
│     └─ styles
│        ├─ App.css
│        ├─ Spotify.css
│        └─ index.css
└─ server
   ├─ configs
   │  └─ db.js
   ├─ index.js
   ├─ middlewares
   │  └─ validateJWT.js
   ├─ models
   │  └─ SpotifyToken.js
   ├─ package-lock.json
   ├─ package.json
   └─ utils
      └─ genRandomString.js

```
