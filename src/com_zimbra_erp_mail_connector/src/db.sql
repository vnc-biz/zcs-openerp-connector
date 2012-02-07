
USE `zimbra`;



DROP TABLE IF EXISTS `tbl_document_setting`;
CREATE TABLE `tbl_document_setting` (
  `id` integer auto_increment primary key,
  `title` varchar(60) not null unique key,
  `docname` varchar(60) not null unique key

);

INSERT INTO `tbl_document_setting`(title,docname) VALUES ('Partner','res.partner');
INSERT INTO `tbl_document_setting`(title,docname) VALUES ('Address','res.partner.address'); 
INSERT INTO `tbl_document_setting`(title,docname) VALUES ('Lead','crm.lead'); 
 
