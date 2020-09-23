-- TABLES
CREATE TABLE IF NOT EXISTS Users (
  user_id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(40) UNIQUE,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Connections (
  connection_id VARCHAR(255) PRIMARY KEY,
  user_a VARCHAR(255) NOT NULL,
  user_b VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY(user_a) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY(user_b) REFERENCES Users(user_id) ON DELETE CASCADE,
  UNIQUE(user_a, user_b),
  INDEX user_b_ind(user_b)
);

INSERT INTO Users (user_id, email, first_name, last_name, password, username) VALUES
    ('joe_id', 'joe@gmail.com', 'Joe', 'Smith', '123123123', 'joe_smith'),
    ('john_id', 'john@gmail.com', 'John', 'Doe', '123123123', 'john_doe'),
    ('bill_id', 'bill@gmail.com', 'Bill', 'Nye', '123123123', 'bill_nye'),
    ('jill_id', 'jill@gmail.com', 'Jill', 'Old', '123123123', 'jill_old'),
    ('jen_id', 'jen@gmail.com', 'Jen', 'Hong', '123123123', 'jen_hong'),
    ('tom_id', 'tom@gmail.com', 'Tom', 'Lee', '123123123', 'tom_lee'),
    ('jack_id', 'jack@gmail.com', 'Jack', 'Johnson', '123123123', 'jack_johnson');

INSERT INTO Connections (connection_id, user_a, user_b, name) VALUES
    ('connection_1', 'tom_id', 'joe_id', 'tom_joe'),
    ('connection_2', 'tom_id', 'jen_id', 'tom_jen'),
    ('connection_3', 'tom_id', 'jack_id', 'tom_jack'), 
    ('connection_4', 'joe_id', 'jill_id', 'joe_jill'), 
    ('connection_5', 'jack_id', 'jen_id', 'jack_jen'), 
    ('connection_6', 'jen_id', 'john_id', 'jen_john'), 
    ('connection_7', 'john_id', 'jack_id', 'john_jack');


