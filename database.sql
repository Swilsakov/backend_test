CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP
);

CREATE TABLE calculator (
    id SERIAL PRIMARY KEY,
    num1 INTEGER,
    num2 INTEGER,
    operator VARCHAR(3)
)