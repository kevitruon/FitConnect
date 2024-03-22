# FitConnect

The Website

-   [Web link](https://fitconnect1.gitlab.io/fit-connect/)

The Team

-   Kevin Truong | [linkedin](https://www.linkedin.com/in/kevitruon/)
-   Steele Jackson | [linkedin](https://www.linkedin.com/in/steelejackson/)

FitConnect is a social fitness app that allows users to track their workouts, connect with friends, and share their fitness journey. Whether you're a beginner or a seasoned fitness enthusiast, FitConnect provides a platform to stay motivated, inspired, and accountable.

## Design

-[Wireframe Design](https://excalidraw.com/#json=io2YLf7WaiG4rc0ekB43m,BHGjqp2cDVRW0eZ_HhH7cw) -[API Design](https://imgur.com/a/2qJTk3i) -[Database Design](https://imgur.com/a/XHfpuXy)

## Features

-   **User Registration and Authentication**: Create an account, log in, and securely access your personalized dashboard.
-   **Workout Tracking**: Log your workouts, including exercise details, sets, reps, and weights. Keep a history of your fitness progress.
-   **Social Connections**: Connect with friends, send friend requests, and build a supportive fitness community.
-   **News Feed**: Stay updated with your friends' workout activities and engage with their posts through likes and comments.
-   **Exercise Library**: Explore a comprehensive library of exercises with detailed descriptions and instructions.
-   **Analytics and Insights**: Gain valuable insights into your workout patterns, progress, and trends.

## Technologies Used

-   **Frontend**: React, HTML, CSS, JavaScript
-   **Backend**: FastAPI, Python
-   **Database**: PostgreSQL
-   **Authentication**: JWTdown (JSON Web Tokens)
-   **Containerization**: Docker
-   **CI/CD**: GitLab CI/CD
-   **Deployment**: GitLab Pages

## Getting Started

To run FitConnect locally, follow these steps:

1. Clone the repository:
   git clone https://gitlab.com/fitconnect1/fit-connect.git

2. Navigate to the project directory:
   cd fitconnect

3. Create a Docker volume for the database:
   docker volume create postgres-data
   docker volume create pg-admin

4. Build the Docker containers:
   docker-compose build

5. Start the containers:
   docker-compose up
