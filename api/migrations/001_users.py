steps = [
    [
        # Create the table
        """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY NOT NULL UNIQUE,
            username VARCHAR(15) NOT NULL,
            email VARCHAR(50) NOT NULL,
            hashed_password VARCHAR(200) NOT NULL
        );
        """,
        # Drop the table
        """
        DROP TABLE users;
        """,
    ]
]
