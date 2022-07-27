CREATE DATABASE foodproduct;


--\c into foodproduct
-- product table
CREATE TABLE product(
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR,
    price SMALLINT,
    stars SMALLINT,
    img VARCHAR,
    location VARCHAR(255),
    created_at VARCHAR(255),
    updated_at VARCHAR(255),
    type_id SMALLINT
);
-- registration table
--     data["f_name"] = this.name;
--     data["phone"] = this.phone;
--     data["email"] = this.email;
--     data["password"] = this.password;
CREATE TABLE register(
    id SERIAL PRIMARY KEY,
    f_name VARCHAR(70),
    phone SMALLINT,
    email VARCHAR(100),
    password VARCHAR(100)
);

-- cart table
CREATE TABLE 


--heroku pg:psql