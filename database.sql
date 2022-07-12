CREATE DATABASE foodproduct;


--\c into foodproduct

CREATE TABLE product(
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR,
    price SMALLINT,
    stars SMALLINT,
    location VARCHAR(255),
    created_at VARCHAR(255),
    updated_at VARCHAR(255),
    type_id SMALLINT
);

--heroku pg:psql