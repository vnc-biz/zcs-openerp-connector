
SUBDIRS=lib-vnc-openerp com_zimbra_erp_mail_connector

all:
	@for t in $(SUBDIRS) ; do if [ -f "$$t/Makefile" ] ; then $(MAKE) -C $$t ; fi done

clean:
	@for t in $(SUBDIRS) ; do if [ -f "$$t/Makefile" ] ; then $(MAKE) -C $$t clean ; fi ; done
