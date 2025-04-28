```markdown
# Full-Stack Diet Recommendation System

This project is a full-stack web application that provides personalized diet recommendations based on user inputs such as age, gender, height, weight, activity level, and food preferences.

The application consists of two parts:

- **Frontend**: Built using React.js.
- **Backend**: Built using Node.js and Express.js.

## Features

- Personalized diet recommendations based on user input.
- Displays meal plans with nutritional details (Calories, Protein, Carbs, and Fat).
- No database required—user inputs are processed in real-time.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Others**: Axios for HTTP requests, CORS for cross-origin handling

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Pravin-byte/diet-recommendation-system.git
cd diet-recommendation-system
```

### 2. Install dependencies

For the frontend (React), navigate to the `client` folder and install the dependencies:

```bash
cd client
npm install
```

For the backend (Node.js), navigate to the `server` folder and install the dependencies:

```bash
cd ../server
npm install
```

## Running the Project

### Frontend

1. Navigate to the `client` folder.
2. Start the React development server:

```bash
cd client
npm start
```

This will run the frontend on `http://localhost:3000`.

### Backend

1. Navigate to the `server` folder.
2. Start the backend server:

```bash
cd ../server
node index.js
```

This will run the backend on `http://localhost:3001`.

### Stopping the Servers

- To stop the client server, press `Ctrl + C` in the terminal.
- To stop the backend server, press `Ctrl + C` in the terminal.

