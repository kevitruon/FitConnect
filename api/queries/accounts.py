from pydantic import BaseModel
from queries.pool import pool
from typing import Union, Optional


class UserErrorMsg(BaseModel):
    message: str


class UserIn(BaseModel):
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    password: str


class UserRepository:
    def user_in_to_out(self, id: int, user: UserIn):
        old_data = user.dict()
        return UserOut(id=id, **old_data)

    def record_to_user_out(self, record):
        return UserOut(
            id=record[0],
            username=record[1],
            email=record[2],
            password=record[3],
        )

    def create(self, user: UserIn) -> Union[UserOut, UserErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO users
                            (username, email, password)
                        VALUES
                            (%s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            user.username,
                            user.email,
                            user.password
                        ]
                    )
                    id = result.fetchone()[0]
                    return self.user_in_to_out(id, user)

        except Exception as e:
            return UserErrorMsg(message="error! " + str(e))

    def get_all(self) -> Union[UserOut, UserErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT id, username, email, password
                        FROM users
                        ORDER BY id;
                        """
                    )
                    return [
                        self.record_to_user_out(record)
                        for record in db.fetchall()
                    ]
        except Exception as e:
            return UserErrorMsg(message="error!" + str(e))

    def get_detail(self, user_id: int) -> Optional[UserOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT id, username, email, password
                        FROM users
                        WHERE id = %s
                        """,
                        [user_id]
                    )
                    record = result.fetchone()
                    return self.record_to_user_out(record)
        except Exception as e:
            return UserErrorMsg(message="error!" + str(e))

    def update(self, user_id: int, user: UserIn) -> Union[
        UserOut,
        UserErrorMsg
    ]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE users
                        SET username = %s
                            , email = %s
                            , password = %s
                        WHERE id = %s
                        """,
                        [
                            user.username,
                            user.email,
                            user.password,
                            user_id
                        ]
                    )
                    return self.user_in_to_out(user_id, user)
        except Exception as e:
            return UserErrorMsg(message="error! " + str(e))

    def delete(self, user_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM users
                        WHERE id = %s
                        """,
                        [user_id]
                    )
                    return True
        except Exception as e:
            print(e)
            return False
