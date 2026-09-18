-- Script para remover o aviso "towns/temples não carregados" no MyAAC
-- Esse script insere as cidades clássicas do Tibia 7.4 no banco de dados.

CREATE TABLE IF NOT EXISTS 	owns (
  id int(11) NOT NULL,
  
ame varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

TRUNCATE TABLE 	owns;

INSERT INTO 	owns (id, 
ame) VALUES
(1, 'Rookgaard'),
(2, 'Thais'),
(3, 'Kazordoon'),
(4, 'Carlin'),
(5, 'Ab''Dendriel'),
(6, 'Venore'),
(7, 'Darashia'),
(8, 'Ankrahmun'),
(9, 'Edron'),
(21, 'Rookgaard');
