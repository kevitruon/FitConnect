from pydantic import BaseModel
from queries.pool import pool
from typing import Union, Optional


class AccountErrorMsg(BaseModel):
    message: str


class DuplicateAccountError(ValueError):
    message: str


class AccountIn(BaseModel):
    username: str
    email: str
    password: str


class AccountOut(BaseModel):
    id: str
    username: str
    email: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountRepository:
    def user_in_to_out(self, id: int, user: AccountOutWithPassword):
        old_data = user.dict()
        return AccountOut(id=id, **old_data)

    def record_to_user_out(self, record):
        return AccountOut(
            id=record[0],
            username=record[1],
            email=record[2],
            hashed_password=record[3],
        )

    # def create(
    #     self, user: AccountIn, hashed_password: str
    # ) -> AccountOutWithPassword:
    #     try:
    #         with pool.connection() as conn:
    #             with conn.cursor() as db:
    #                 params = [
    #                     "CoolUser1",
    #                     "Something1@gmail.com",
    #                     hashed_password,
    #                 ]
    #                 print("Hashed PASS:", hashed_password)
    #                 print("User is", user)
    #                 result = db.execute(
    #                     """
    #                     INSERT INTO users (username, email, hashed_password)
    #                     VALUES ("CoolUser1", "Something1@gmail.com", %s)
    #                     RETURNING id, username, email, hashed_password;
    #                     """,
    #                     params,
    #                 )
    #                 user_id = result.fetchone()[0]
    #                 print("AAAAAAAAAAAAAAAsdasdsasAAAAAAAAAAAAAAAA", user_id)
    #                 coolVar = AccountOutWithPassword(
    #                     id=user_id,
    #                     username="CoolUser1",
    #                     email="Something1@gmail.com",
    #                     hashed_password=hashed_password,
    #                 )
    #                 print("COOLVAR", coolVar)
    #                 return coolVar

    #                 # return AccountOutWithPassword(
    #                 #     id=user_id,
    #                 #     username=user.username,
    #                 #     email=user.email,
    #                 #     hashed_password=hashed_password,
    #                 # )

    # except Exception:
    #     return {"message": "Could not create a user"}
    def create(
        self, user: AccountIn, hashed_password: str
    ) -> AccountOutWithPassword:
        try:
            print("USER", user)
            print("HASHED", hashed_password)
            uname = user.username
            uemail = user.email
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO users
                            (username,
                            email,
                            hashed_password)
                        VALUES
                            (%s, %s, %s)
                        RETURNING
                        id;
                        """,
                        [
                            user.username,
                            user.email,
                            hashed_password,
                        ],
                    )
                    print("insert worked?")
                    cur.execute("SELECT * FROM users")
                    res = cur.fetchone()
                    print("RESULT", res)
                    # user_id = result.fetchone()[0]
                    print("ID GOTTEN", user_id="99")
                    (id, username, email, hashed_password) = res
                    print("ID", id)
                    print("USERNAME", username)
                    print("EMAIL", email)
                    print("HASHED_PASSWORD", hashed_password)
                    return AccountOutWithPassword(
                        id, username, email, hashed_password
                    )
        except Exception:
            return {"message": "Could not create a user"}

    def get_all(self) -> Union[AccountOut, AccountErrorMsg]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT id, username, email, hashed_password
                        FROM users
                        ORDER BY id;
                        """
                    )
                    return [
                        self.record_to_user_out(record)
                        for record in db.fetchall()
                    ]
        except Exception as e:
            return AccountErrorMsg(message="error!" + str(e))

    # def get_detail(self, user_id: str) -> Optional[AccountOut]:
    #     try:
    #         with pool.connection() as conn:
    #             with conn.cursor() as db:
    #                 result = db.execute(
    #                     """
    #                     SELECT id, username, email, hashed_password
    #                     FROM users
    #                     WHERE id = %s
    #                     """,
    #                     [user_id],
    #                 )
    #                 record = result.fetchone()
    #                 return self.record_to_user_out(record)
    #     except Exception as e:
    #         return AccountErrorMsg(message="error!" + str(e))
    def get(self, email: str) -> AccountOutWithPassword:
        try:
            print("is trying get somehow?")
            print("email", email)
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT
                        id,
                        username,
                        email,
                        hashed_password
                        FROM users
                        WHERE email = %s
                        """,
                        [email],
                    )
                    record = result.fetchone()
                    print("record found", record)
                    if record is None:
                        return None
                    return self.record_to_account_out(record)
        except Exception:
            return {"message": "Could not get account"}

    def update(
        self, user_id: int, user: AccountIn
    ) -> Union[AccountOut, AccountErrorMsg]:
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
                        [user.username, user.email, user.password, user_id],
                    )
                    return self.user_in_to_out(user_id, user)
        except Exception as e:
            return AccountErrorMsg(message="error! " + str(e))

    def delete(self, user_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM users
                        WHERE id = %s
                        """,
                        [user_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False
