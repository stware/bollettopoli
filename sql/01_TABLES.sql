CREATE TABLE test_table
(
  id serial NOT NULL,
  name text,
  CONSTRAINT test_table_pkey PRIMARY KEY (id));


CREATE TABLE users
(
id serial NOT NULL,
name text,
surname text,
password varchar(50),
email text,
CONSTRAINT users_pkey PRIMARY KEY (id));

