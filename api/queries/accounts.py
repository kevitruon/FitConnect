from pydantic import BaseModel
from typing import List
import os
from psycopg_pool import ConnectionPool


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class UserIn(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    userId: str
    first: str
    last: str


class UserRepository:
    def get_all(self) -> List[UserOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT *
                        FROM users
                        """
                    )
                    results = []
                    for record in cur:
                        user = UserOut(
                            userId=record[0], first=record[1], last=record[2]
                        )
                        results.append(user)
                    return results
        except Exception:
            return {"message": "Could not get all accounts"}
