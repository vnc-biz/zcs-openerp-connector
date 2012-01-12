
USE `zimbra` PREFIX `tbl`;



DROP TABLE IF EXISTS `tbl_document_setting`;
CREATE TABLE `tbl_document_setting` (
  `id` integer auto_increment primary key,
  `title` varchar(60) not null unique key,
  `docname` varchar(60) not null unique key

) 