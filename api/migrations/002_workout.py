steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE exercises (
            exercise_id SERIAL PRIMARY KEY,
            exercise_name VARCHAR(100) NOT NULL,
            description TEXT,
            category VARCHAR(50) NOT NULL
        );

        """,
        # "Down" SQL statement
        """
        DROP TABLE exercises;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE workouts (
            workout_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            workout_date DATE NOT NULL,
            notes TEXT
        );


        """,
        # "Down" SQL statement
        """
        DROP TABLE workouts;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE sets (
            set_id SERIAL PRIMARY KEY,
            workout_id INTEGER REFERENCES workouts(workout_id),
            exercise_id INTEGER REFERENCES exercises(exercise_id),
            set_number INTEGER NOT NULL,
            weight DECIMAL,
            reps INTEGER
        );


        """,
        # "Down" SQL statement
        """
        DROP TABLE sets;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE friendships (
            friendship_id SERIAL PRIMARY KEY,
            user1_id INTEGER REFERENCES users(user_id),
            user2_id INTEGER REFERENCES users(user_id),
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
            date_requested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            date_accepted TIMESTAMP
        );


        """,
        # "Down" SQL statement
        """
        DROP TABLE friendships;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE workout_comments (
            comment_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            workout_id INTEGER REFERENCES workouts(workout_id),
            comment_text TEXT NOT NULL,
            comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );



        """,
        # "Down" SQL statement
        """
        DROP TABLE workout_comments;
        """,
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE workout_likes (
            like_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            workout_id INTEGER REFERENCES workouts(workout_id),
            like_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );


        """,
        # "Down" SQL statement
        """
        DROP TABLE workout_likes;
        """,
    ],
]
