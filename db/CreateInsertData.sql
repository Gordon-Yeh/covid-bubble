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
  name VARCHAR(255),
  FOREIGN KEY(user_a) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY(user_b) REFERENCES Users(user_id) ON DELETE CASCADE,
  UNIQUE(user_a, user_b),
  INDEX user_b_ind(user_b)
);

INSERT INTO Users (user_id, email, first_name, last_name, password, username) VALUES
    ('f599906e-bb86-47bd-99be-4f6436eaec41', 'joe@gmail.com', 'Joe', 'Smith', '123123123', 'joe_smith'),
    ('afe4a1ee-b802-43c6-b489-4c63d03f632f', 'john@gmail.com', 'John', 'Doe', '123123123', 'john_doe'),
    ('7eb22b80-3f16-4317-b374-f957394345c8', 'bill@gmail.com', 'Bill', 'Nye', '123123123', 'bill_nye');
