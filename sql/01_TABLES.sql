CREATE TABLE todos
(
  id serial NOT NULL,
  id_user integer,
  text text,
  priority integer,
  CONSTRAINT todos_pkey PRIMARY KEY (id));

CREATE TABLE users
(
id serial NOT NULL,
name text,
surname text,
password varchar(50),
email text,
CONSTRAINT users_pkey PRIMARY KEY (id));

