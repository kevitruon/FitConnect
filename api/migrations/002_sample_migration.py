steps = [
    [
        """
        CREATE TABLE users (
            id SERIAL NOT NULL PRIMARY KEY,
            first VARCHAR(100) NOT NULL UNIQUE,
            last VARCHAR(100) NOT NULL
        );
        """,
        """
        DROP TABLE users;
        """,
    ],
]
