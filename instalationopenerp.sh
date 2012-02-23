#!/bin/bash
if [ $# -ne 1 ] ; then
	echo "Wrong Number of parameters"
	echo "USAGE : /bin/bash installsignature.sh <patch file path>"
	exit 1
fi;

do_run(){
        $* >> $LOG_FILE 2>&1
        if [ $? -ne 0 ] ; then
                echo "Command failed : $*"
                exit 1
        fi;
}

LOG_FILE="/tmp/openerplog.log"
WORK_DIR="/tmp/" 
ZIMLETLIB="/opt/zimbra/mailboxd/webapps/zimlet/WEB-INF/lib"
ZIPFILE=$1
EXTRACTED_DIR=$WORK_DIR"patch_openerp/"
LIB=$EXTRACTED_DIR"lib/*"
OPEN_ERP_ZIMLET=$EXTRACTED_DIR"com_zimbra_erp_mail_connector.zip"
DB_FILE=$EXTRACTED_DIR"db.sql"
JSON_JAR_FILE=$EXTRACTED_DIR"json_simple-1.1.jar"
JSON_JAR_FILE_LOCAL="/opt/zimbra/mailboxd/webapps/zimlet/WEB-INF/lib/"
LINK1="zimbrastore.jar"
LINK2="zimbrasoap.jar"
LINK3="zimbracommon.jar"
echo ""

do_run tar xvzf $ZIPFILE -C $WORK_DIR 

if [ ! -e "$ZIMLETLIB" ] ; then
    do_run mkdir $ZIMLETLIB
fi;
echo "Copying libraries..."
do_run cp -f $LIB $JSON_JAR_FILE_LOCAL
echo -n "Deploying zimlets...."
do_run zmzimletctl deploy $OPEN_ERP_ZIMLET
echo "Done"


do_run cd $JSON_JAR_FILE_LOCAL
if [ ! -L "$LINK1" ] ; then
	do_run ln -s /opt/zimbra/lib/jars/zimbrastore.jar zimbrastore.jar
else
	echo ""
fi;
if [ ! -L "$LINK2" ] ; then
	do_run ln -s /opt/zimbra/lib/jars/zimbrasoap.jar zimbrasoap.jar
else
        echo ""
fi; 

if [ ! -L "$LINK3" ] ; then
	do_run ln -s /opt/zimbra/lib/jars/zimbracommon.jar zimbracommon.jar
else
        echo ""
fi; 


echo -n "Do you want to restart mailbox service?[Y/N]:"
read ans
if [ "$ans" = "Y" -o "$ans" = "y" ]; then
	zmmailboxdctl restart
fi;
exit 0
