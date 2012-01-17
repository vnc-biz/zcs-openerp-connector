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

echo -n "Creating new database..."
do_run mysql < $DB_FILE
echo "Done"
echo -n "Do you want to restart mailbox service?[Y/N]:"
read ans
if [ "$ans" = "Y" -o "$ans" = "y" ]; then
	zmmailboxdctl restart
fi;
exit 0
