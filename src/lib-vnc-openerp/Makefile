
TOPDIR=../../
JAR_FILE_NAME=zcs-lib-vnc-openerp.jar

INSTALL_USER=n
INSTALL_ADMIN=n
INSTALL_SERVICE=n
INSTALL_EXTENSION=n
INSTALL_LIB=n
INSTALL_ZIMLET=y

ZCS_LIB_JARS=\
	servlet-api.jar			\
	zimbrastore.jar			\
	zimbracommon.jar		\
	zcs-lib-redstone-xmlrpc.jar	\
	zcs-lib-gson.jar		\
	zcs-lib-json-simple.jar		\
	zcs-lib-javacsv.jar		\
	commons-httpclient-3.1.jar

JAR_FILE_PREPARE_RULE=prepare-jar

include $(TOPDIR)/zcs-java-lib.mk

prepare-jar:
	pwd
	mkdir -p classes/com/zimbra/configuration
	cp src/com/zimbra/configuration/contactFields.properties classes/com/zimbra/configuration
