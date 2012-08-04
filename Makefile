
TOPDIR=.
include $(TOPDIR)/common.mk

all:	check-depend $(DEBIAN_PACKAGE)

prepare:
	@echo -n > $(TOPDIR)/zimlets.list

build-scripts:
	@mkdir -p $(INSTALL_DIR)
	@if [ -f scripts/mailboxd-db-schema.sql ] ; then cp scripts/mailboxd-db-schema.sql $(INSTALL_DIR) ; fi
	@if [ -f scripts/post-install.sh        ] ; then \
		cp scripts/post-install.sh $(INSTALL_DIR) && chmod +x $(INSTALL_DIR)/post-install.sh ; fi

build-zimlets:	prepare
	@$(MAKE) -C src all

$(DEBIAN_PACKAGE)::	$(DEBIAN_DIR)/control build-scripts build-zimlets
	@dpkg --build $(IMAGE_ROOT) .

$(DEBIAN_DIR)/control:	control.in
	@mkdir -p $(IMAGE_ROOT)/DEBIAN
ifeq ($(DEPENDS),)
	@cat $< | \
	    sed -e 's/@PACKAGE@/$(PACKAGE)/' | \
	    sed -e 's/@VERSION@/$(PACKAGING_VERSION)/' | \
	    sed -e 's/@MAINTAINER@/$(MAINTAINER)/' | \
	    sed -e 's/@SECTION@/$(SECTION)/' | \
	    sed -e 's/@ARCHITECTURE@/$(ARCHITECTURE)/' | \
	    sed -e 's/@PRIORITY@/$(PRIORITY)/' | \
	    sed -e 's/@DEPENDS@/$(DEPENDS)/' | \
	    sed -e 's/@DESCRIPTION@/$(DESCRIPTION)/' | \
	    grep -ve "^Depends: " > $@
else
	@cat $< | \
	    sed -e 's/@PACKAGE@/$(PACKAGE)/' | \
	    sed -e 's/@VERSION@/$(PACKAGING_VERSION)/' | \
	    sed -e 's/@MAINTAINER@/$(MAINTAINER)/' | \
	    sed -e 's/@SECTION@/$(SECTION)/' | \
	    sed -e 's/@ARCHITECTURE@/$(ARCHITECTURE)/' | \
	    sed -e 's/@PRIORITY@/$(PRIORITY)/' | \
	    sed -e 's/@DEPENDS@/$(DEPENDS)/' | \
	    sed -e 's/@DESCRIPTION@/$(DESCRIPTION)/' > $@
endif

clean:
	@$(MAKE) -C src clean
	@rm -Rf $(DISTPREFIX) $(IMAGE_ROOT) $(DEBIAN_PACKAGE) zimlets.list *.deb

check-depend:
	@zmpkg check-installed "$(DEPENDS)"

check_version:
	@echo "$(PACKAGING_VERSION)"

include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/main-src-policy.mk
include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/main-upload-dpkg.mk

.PHONY:	$(DEBIAN_DIR)/control
