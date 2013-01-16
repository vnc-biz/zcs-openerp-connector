
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
	zimbrasoap.jar			\
	zcs-lib-redstone-xmlrpc.jar	\
	zcs-lib-gson22.jar		\
	zcs-lib-json-simple.jar		\
	zcs-lib-javacsv.jar		\
	commons-httpclient.jar		\
	zcs-lib-vnc-common.jar		\
	commons-codec.jar

JAR_FILE_PREPARE_RULE=prepare-jar

include $(TOPDIR)/common.mk
include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/zcs-java-lib.mk

prepare-jar:
	mkdir -p classes/biz/vnc/zimbra/openerp_zimlet
	cp src/biz/vnc/zimbra/openerp_zimlet/contactFields.properties classes/biz/vnc/zimbra/openerp_zimlet
