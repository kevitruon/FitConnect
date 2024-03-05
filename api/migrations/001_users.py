steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE users (
            user_id serial not null primary key,
            username varchar(100) not null,
            email varchar(50) not null unique,
            hashed_password varchar(200) not null

            );
        """,
        # "Down" SQL statement
        """
        DROP TABLE users;
        """,
    ],
]
