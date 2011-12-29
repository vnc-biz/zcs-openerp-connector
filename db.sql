
DROP DATABASE IF EXISTS `signature`;

CREATE DATABASE `signature`;

USE `signature`;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `config` (
  `key` varchar(30) DEFAULT NULL,
  `val` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` VALUES ('template','Warm Regards,${newline}${username}');
INSERT INTO `config` VALUES ('field3','Field 3 info goes here.');
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signature`
--

DROP TABLE IF EXISTS `signature`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `signature` (
  `dname` varchar(30) DEFAULT NULL,
  `did` varchar(50) DEFAULT NULL,
  `dcompany` varchar(100) DEFAULT NULL,
  `daddress` text DEFAULT NULL,
  `dcity` varchar(50) DEFAULT NULL,
  `dstate` varchar(50) DEFAULT NULL,
  `dcountry` varchar(50) DEFAULT NULL,
  `dpostalcode` varchar(50) DEFAULT NULL,
  `field1` text DEFAULT NULL,
  `field2` text DEFAULT NULL
  
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

