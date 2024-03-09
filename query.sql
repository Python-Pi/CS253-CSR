CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(500)
);

CREATE TABLE chattable(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    message TEXT
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INT,
    trip_name VARCHAR(255),
    destination VARCHAR(255),
    start_date DATE,
    end_date DATE,
    amount NUMERIC(10, 2),
    user_name VARCHAR(255),
    details VARCHAR(1000)
);

CREATE TABLE user_statuses(
    id SERIAL PRIMARY KEY,
    user_id INT,
    username VARCHAR(255),
    trip_name VARCHAR(255),
    destination VARCHAR(255),
    status INT
);



