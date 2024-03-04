steps = [
    [
        # Create the table
        """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY NOT NULL UNIQUE,
            username VARCHAR(15) NOT NULL UNIQUE,
            email VARCHAR(50) NOT NULL UNIQUE,
            hashed_password VARCHAR(200) NOT NULL
        );
        """,
        # Drop the table
        """
        DROP TABLE users;
        """
    ]
]
