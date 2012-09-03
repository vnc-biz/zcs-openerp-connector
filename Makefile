
TOPDIR=.
include $(TOPDIR)/common.mk

all:	check-depend $(DEBIAN_PACKAGE)

prepare:
	@echo -n > $(TOPDIR)/zimlets.list

build-zimlets:	prepare
	@$(MAKE) -C src all

clean:
	@$(MAKE) -C src clean
	@rm -Rf $(DISTPREFIX) $(IMAGE_ROOT) $(DEBIAN_PACKAGE) zimlets.list *.deb

check-depend:
	@zmpkg check-installed "$(DEPENDS)"

check_version:
	@echo "$(PACKAGING_VERSION)"

include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/main-src-policy.mk
include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/main-upload-dpkg.mk
include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/main-scripts.mk
include $(ZIMBRA_BUILD_ROOT)/extensions-extra/zmpkg/mk/main-dpkg.mk

.PHONY:	$(DEBIAN_DIR)/control
