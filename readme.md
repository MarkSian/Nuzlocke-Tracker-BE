
# Pokemon: Nuzlocke Tracker

The Nuzlocke Tracker is a full-stack web application designed to help Pokémon Nuzlocke challengers to record and manage their playthroughs for any game version. It provides a digital companion to help players adhere to the challenging self-imposed rules while maintaining a detailed and visual history of their painful playthrough.

### Frontend URL: https://github.com/MarkSian/Nuzlocke-Tracker-Frontend


## Features

- Secure User Accounts: Create and manage individual user profiles to track multiple Nuzlocke runs.
- Detailed Run Management: Users can create and oversee distinct Nuzlocke runs, each representing a unique challenge journey.
- Encounter Tracking: Meticulously log Pokémon encounters for each route, capturing vital details such as:
    - Species name and official sprite (via PokeAPI integration)
    - Custom nickname
    - Current status (Captured, Fainted, Skipped, Upcoming)
    - Nature and Level
    - Route of capture/encounter
- Dynamic Pokémon Visuals: Seamlessly integrates with the PokeAPI to fetch and display official Pokémon sprites, enhancing the visual appeal of your tracked creatures.
- Box & Grave Views: Dedicated sections to easily review your active (boxed) Pokémon and those that have unfortunately fainted during the run, adhering to Nuzlocke's core rules.
- Milestone Tracking: Keep a precise record of crucial game milestones, including defeated Gym Leaders (Bosses) and Rival battles, providing a clear progression overview.
- Data Persistence: All run data, encounters, and milestones are securely stored in a MongoDB database, ensuring your progress is always saved.





## Technologies Used

**Frontend (Nuzlocke-Tracker-Frontend)** 
- React.js: A JavaScript library for building user interfaces.
- Vite: A fast build tool that provides a rapid development environment.
- Jotai: A minimalist state management library for React, offering flexible and performant global state.
- TailwindCSS: A utility-first CSS framework for rapidly styling the application.
- DaisyUI: A Tailwind CSS component library that provides pre-built UI components with DaisyUI class names.
- Axios: A promise-based HTTP client for making API requests to the backend.
- React Router DOM: For declarative routing within the single-page application.
- jwt-decode: A small utility to decode JWTs in the browser.
- react-select: A library for creating customizable select inputs with features like searching, multi-select, and clearable options.


**Backend (Nuzlocke-Tracker-BE)**
- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express.js: A fast, unopinionated, minimalist web framework for Node.js.
- Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js, providing a straightforward, schema-based solution to model your application data.
- MongoDB Atlas: A cloud-based NoSQL database for flexible and scalable data storage. (Can also be used with local MongoDB).
- JSON Web Token (JWT): For secure, stateless authentication between the client and server.
- Bcrypt.js: A library for hashing passwords securely.
- CORS: Node.js middleware for enabling Cross-Origin Resource Sharing.
- Dotenv: A module to load environment variables from a .env file.


## API Endpoints
### Authentication
- POST /api/auth/register - Register a new user.
- POST /api/auth/login - Authenticate a user and receive a JWT.

### Nuzlocke Runs (Protected by JWT)
- GET /api/nuzlocke/runs - Retrieve all Nuzlocke runs for the authenticated user.
- POST /api/nuzlocke/runs - Create a new Nuzlocke run.
- PUT /api/nuzlocke/runs/:id - Update an existing Nuzlocke run (including encounters, bosses, rivals).
- DELETE /api/nuzlocke/runs/:id - Delete a specific Nuzlocke run.

## Project Structure

```
├── Nuzlocke-Tracker-BE/             # Backend (Node.js/Express)
│   ├── config/                      # Database configuration (if separated)
│   ├── controllers/                 # Business logic for routes
│   ├── middleware/                  # Authentication middleware (e.g., authMiddleware.js)
│   ├── models/                      # Mongoose schemas (e.g., User.js, NuzlockeRun.js)
│   ├── routes/                      # API route definitions (e.g., authRoutes.js, nuzlockeRoutes.js)
│   ├── .env                         # Environment variables for backend
│   ├── server.js                    # Main server entry point
│   ├── package.json
│   └── ...
└── Nuzlocke-Tracker-Frontend/       # Frontend (React/Vite)
├── public/
├── src/
│   ├── assets/
│   ├── atoms.js                 # Jotai state definitions
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Main application views (Login, Register, Tracker, Box, Grave)
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── TrackerPage.jsx
│   │   ├── BoxPage.jsx
│   │   └── GravePage.jsx
│   ├── api.js                   # Axios instance configuration
│   ├── App.jsx                  # Main React component, routing
│   ├── main.jsx                 # React entry point
│   ├── index.css                # TailwindCSS directives
│   └── ...
├── .env                         # Environment variables for frontend
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── ...