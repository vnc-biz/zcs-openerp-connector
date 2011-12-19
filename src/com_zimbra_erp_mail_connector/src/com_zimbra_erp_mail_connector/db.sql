
DROP DATABASE IF EXISTS `openerp_connector`;

CREATE DATABASE `openerp_connector`;

USE `openerp_connector`;



DROP TABLE IF EXISTS `document_setting`;
CREATE TABLE `document_setting` (
  `id` integer auto_increment primary key,
  `title` varchar(60) not null unique key,
  `docname` varchar(60) not null unique key

) 
