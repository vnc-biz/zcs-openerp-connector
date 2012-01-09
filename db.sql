
USE `zimbra`;



DROP TABLE IF EXISTS `document_setting`;
CREATE TABLE `tbl_document_setting` (
  `id` integer auto_increment primary key,
  `title` varchar(60) not null unique key,
  `docname` varchar(60) not null unique key

) 
