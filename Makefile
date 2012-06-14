
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

upload:	all
	@if [ ! "$(REDMINE_UPLOAD_USER)" ];     then echo "REDMINE_UPLOAD_USER environment variable must be set"     ; exit 1 ; fi
	@if [ ! "$(REDMINE_UPLOAD_PASSWORD)" ]; then echo "REDMINE_UPLOAD_PASSWORD environment variable must be set" ; exit 1 ; fi
	@if [ ! "$(REDMINE_UPLOAD_URL)" ];      then echo "REDMINE_UPLOAD_URL variable must be set"                  ; exit 1 ; fi
	@if [ ! "$(REDMINE_UPLOAD_PROJECT)" ];  then echo "REDMINE_UPLOAD_PROJECT variable must be set"              ; exit 1 ; fi
	@zm_redmine_upload			\
		-f "$(DEBIAN_PACKAGE)"		\
		-l "$(REDMINE_UPLOAD_URL)"	\
		-u "$(REDMINE_UPLOAD_USER)"	\
		-w "$(REDMINE_UPLOAD_PASSWORD)"	\
		-p "$(REDMINE_UPLOAD_PROJECT)"	\
		-d "$(DEBIAN_PACKAGE)"

check-depend:
	@zmpkg check-installed "$(DEPENDS)"

check_version:
	@echo "$(PACKAGING_VERSION)"

policy-dos2unix:
	@find -name "*.java"		\
	    -or -name "*.properties"	\
	    -or -name "*.xml" 		\
	    -or -name "Makefile"	\
	    -or -name "*.jsp"		\
	    -or -name "*.js"		\
	    -or -name "*.css"		\
	    -or -name "*.mk"		\
	    -or -name "README*"		\
	    -exec "dos2unix" "{}" ";"

policy-java:
	@find -name "*.java" \
	    | xargs astyle --style=allman --indent=tab --suffix=none --indent-switches 2>&1 | grep -ve "^unchanged" || true

policy-xml:
	@find -name "*.xml" | ( \
	    while read fn ; do xmlindent -t -w "$$fn" ; rm -f "$$fn~" ; done )

policy-css:
	@find -name "*.css" | ( \
	    while read fn ; do 	csstidy "$$fn" "$$fn.tmp" --compress_colors=false --preserve_css=true --template=low && mv "$$fn.tmp" "$$fn" ; done )

policy:	policy-dos2unix policy-java policy-xml policy-css

.PHONY:	$(DEBIAN_DIR)/control
