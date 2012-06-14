#!/bin/bash

if [ `whoami` == "root" ]; then
    echo "$0: please run me as the zimbra user" >&2
    exit 1
fi

ZIMBRA_ROOT=$HOME
ZIMBRA_MYSQL=$ZIMBRA_ROOT/bin/mysql

TABLE="tbl_document_setting"
RESULTS=`echo "USE zimbra; SELECT title from $TABLE;" | $ZIMBRA_MYSQL`

if ! echo "$RESULTS" | grep "Partner" >/dev/null ; then
	echo "USE zimbra; INSERT INTO $TABLE(title,docname) VALUES ('Partner', 'res.partner');" | $ZIMBRA_MYSQL
	echo "Row inserted for Partner"
fi;

if ! echo "$RESULTS" | grep "Address" >/dev/null; then
	echo "USE zimbra; INSERT INTO $TABLE(title,docname) VALUES ('Address', 'res.partner.address');" | $ZIMBRA_MYSQL
	echo "Row inserted for Address"
fi;

if ! echo "$RESULTS" | grep "Lead" >/dev/null; then
	echo "USE zimbra; INSERT INTO $TABLE(title,docname) VALUES ('Lead', 'crm.lead');" | $ZIMBRA_MYSQL
	echo "Row inserted for Lead"
fi;
