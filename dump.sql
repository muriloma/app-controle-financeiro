CREATE DATABASE appFinanceiro;

CREATE TABLE usuarios (
  id serial PRIMARY KEY,
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  senha text
);

CREATE TABLE categorias (
  id serial PRIMARY KEY,
  usuario_id integer REFERENCES usuarios(id),
  descricao text
);

CREATE TABLE transacoes (
  id serial PRIMARY KEY,
  descricao text,
  valor integer,
  data date DEFAULT now(),
  tipo text,
  categoria_id integer REFERENCES categorias(id),
  usuario_id integer REFERENCES usuarios(id)
);