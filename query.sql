CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(500)
);

CREATE TABLE travelchat(
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
    details VARCHAR(1000),
    image_url VARCHAR(255)
);

CREATE TABLE user_statuses(
    id SERIAL PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(255),
    trip_name VARCHAR(255),
    destination VARCHAR(255),
    status INT
);

CREATE TABLE TRAINS(
    NUMBER INTEGER,
    YET_TO_BOOK INTEGER,
    BOOKED INTEGER,
    DATE VARCHAR(255)
);

CREATE TABLE NOT_BOOKED_TRAIN_USERS(
    TRAIN_NUMBER INTEGER,
    USER_ID INTEGER,
    DATE VARCHAR(255),
    FROM_STATION TEXT,
    TO_STATION TEXT
);

-- Create Trigger Function when entry added to NOT_BOOKED_TRAIN_USERS
CREATE OR REPLACE FUNCTION add_train_not_booked()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE TRAINS
    SET YET_TO_BOOK = YET_TO_BOOK + 1
    WHERE NUMBER = NEW.TRAIN_NUMBER AND DATE= NEW.DATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger Function when entry deleted from NOT_BOOKED_TRAIN_USERS
CREATE OR REPLACE FUNCTION delete_train_not_booked()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE TRAINS
    SET YET_TO_BOOK = YET_TO_BOOK - 1
    WHERE NUMBER = OLD.TRAIN_NUMBER AND DATE= OLD.DATE;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger when train-user added
CREATE TRIGGER train_user_insert_not_booked
AFTER INSERT ON NOT_BOOKED_TRAIN_USERS
FOR EACH ROW
EXECUTE FUNCTION add_train_not_booked();

-- Create Trigger when train-user deleted
CREATE TRIGGER train_user_delete_not_booked
AFTER DELETE ON NOT_BOOKED_TRAIN_USERS
FOR EACH ROW
EXECUTE FUNCTION delete_train_not_booked();

CREATE TABLE BOOKED_TRAIN_USERS(
    TRAIN_NUMBER INTEGER,
    USER_ID INTEGER,
    DATE VARCHAR(255),
    FROM_STATION TEXT,
    TO_STATION TEXT
);

-- Create Trigger Function when entry added to BOOKED_TRAIN_USERS
CREATE OR REPLACE FUNCTION add_train_booked()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE TRAINS
    SET BOOKED = BOOKED + 1
    WHERE NUMBER = NEW.TRAIN_NUMBER AND DATE= NEW.DATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger Function when entry deleted from BOOKED_TRAIN_USERS
CREATE OR REPLACE FUNCTION delete_train_booked()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE TRAINS
    SET BOOKED = BOOKED - 1
    WHERE NUMBER = OLD.TRAIN_NUMBER AND DATE= OLD.DATE;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger for train-user added
CREATE TRIGGER train_user_insert_booked
AFTER INSERT ON BOOKED_TRAIN_USERS
FOR EACH ROW
EXECUTE FUNCTION add_train_booked();

-- Create Trigger when train-user deleted
CREATE TRIGGER train_user_delete_booked
AFTER DELETE ON BOOKED_TRAIN_USERS
FOR EACH ROW
EXECUTE FUNCTION delete_train_booked();

CREATE TABLE TRAINCHAT(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    message TEXT
);

