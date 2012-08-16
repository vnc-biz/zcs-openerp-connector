/*##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (<http://www.vnc.biz>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################*/

var contactBook;
function contactSync_HandlerObject() {
}
contactSync_HandlerObject.prototype = new ZmZimletBase();
contactSync_HandlerObject.prototype.constructor = contactSync_HandlerObject;

function VncContactSync () {}

VncContactSync = contactSync_HandlerObject;

VncContactSync.prototype.init = function() {
};
VncContactSync.prototype.LIMIT = 500;
VncContactSync.prototype.requestCount = 0;

/**
 * Duplicate contact object.
 * Contains the information of which contacts are part of this duplicate.
 */
function DupContact(id, contact) {
	this.ids = [id];
    // the duplicate contacts for this entry
    this.contacts = [];
    this.contactIds = [];
    this.addContact(contact);
}

/**
 * Add the contact to the duplicate only if it hasn't been added before.
 * @param contact the ZmContact
 */
DupContact.prototype.addContact = function(contact) {
    if (contact && !this.contactIds[contact.id]) {
        this.contacts.push(contact);
        this.contactIds[contact.id] = true;
    }
};

/**
 * Merges the information of two duplicate object onto one.
 * @param duplicate the duplicate to merge into.
 */
DupContact.prototype.merge = function(duplicate) {
    var dupIds = duplicate.getIds();
    for (var i = 0; i < dupIds.length; i++) {
        this.ids.push(dupIds[i]);
    }   
    var contacts = duplicate.getContacts();
    var size = contacts.length;
    for (var j = 0; j < size; j++) {
        var contactToMerge = contacts[j];
        if (!this.contactIds[contactToMerge.id]) {
            this.addContact(contactToMerge);
        }
    }
};

/**
 * Gets the number of contacts for this duplicate.
 * @returns number
 */
DupContact.prototype.size = function() {
    return this.contacts.length;
};

/**
 * Returns the duplicate id.
 * @returns {Array}
 */
DupContact.prototype.getIds = function() {
    return this.ids;
};

/**
 * Returns the array of contacts.
 * @returns {Array}
 */
DupContact.prototype.getContacts = function() {
    return this.contacts;
};

/**
 * A list that contains all the information on duplicates.
 */
function DuplicateList() {
    // hash of the emails that contain a reference to the duplicate id
    this.emailHash = [];
    // hash of the contact ids that contain a reference to the duplicate
    this.contactHash = [];

    this.duplicates = [];
    this.duplicateId = 0;
}

DuplicateList.CC_fullName = "ccSimpleFullName";
/**
 * Add the contact to the respective duplicate item.
 * @param contact ZmContact
 */
DuplicateList.prototype.add = function(contact) {
    // use attr if the object was initialized as ZmContact, _attrs otherwise
    var attr = contact.attr || contact._attrs;

    // this fixes a problem with some leftover information in group from a previous version
    if (attr[ZmContact.F_type] === "group") {
        // ignore
        return;
    }

    // use to make a simple comparison using first and last name
    attr[DuplicateList.CC_fullName] = (attr[ZmContact.F_firstName] || "") + (attr[ZmContact.F_lastName] ? (" " + attr[ZmContact.F_lastName]) : "");

    // use to check all the email addresses
    contact.emailList = [];
    for (var name in attr) {
        if (attr.hasOwnProperty(name)) {
            if (ZmContact.F_email === name.replace(/\d+$/,"")) {
                contact.emailList.push(name);
            }
        }
    }
    contact.emailList.sort();
    // add the custom full name to detect full name duplicates
    contact.emailList.push(DuplicateList.CC_fullName);
    var numEmails = contact.emailList.length;

    for (var i = 0; i < numEmails; i++) {
        var email = attr[contact.emailList[i]];
        if (email) {
            email = email.toLowerCase();
            if (this.emailHash.hasOwnProperty(email)) {

                // add the contact to the duplicate
                var duplicate = this.duplicates[this.emailHash[email]];

                duplicate.addContact(contact);

                var duplicateFromContactHash = this.contactHash[contact.id];
                // if there is no duplicate associated with this contact, add
                if (!duplicateFromContactHash) {
                    this.contactHash[contact.id] = duplicate;       
                } else if (duplicateFromContactHash != duplicate) {
                    // if the duplicate entries are different, merge
                    duplicate.merge(duplicateFromContactHash);
                    this.contactHash[contact.id] = duplicate;
                    var idsToRefresh = duplicate.getIds();
                    for (var j = 0; j < idsToRefresh.length; j++) {
                        this.duplicates[idsToRefresh[j]] = duplicate;
                    }
                }
            } else if (this.contactHash[contact.id]) {
                // if the contact was already processed, add the reference to the email
                var dup = this.contactHash[contact.id];
                this.emailHash[email] = dup.getIds()[0];
            } else {
                // create a new duplicate object for this contact.
                var duplicate = new DupContact(this.duplicateId, contact);
                this.contactHash[contact.id] = duplicate;
                this.duplicates.push(duplicate);
                this.emailHash[email] = this.duplicateId;
                this.duplicateId = this.duplicates.length;
            }
        }
    }
};

/**
 * This function will remove all the DupContact object that have only one contact
 * associated as that would mean that there are no duplicates for them, as well
 * as the duplicates that are references more than once.
 */
DuplicateList.prototype.cleanNonDuplicates = function() {
    this.emailHash = null;
    this.contactHash = null;
    var size = this.duplicates.length;
    var duplicatesOnlyArray = [];
    for (var i = 0; i < size; i++) {
        var duplicate = this.duplicates[i];
        if (duplicate) {        
            // remove duplicate entries as well
            var duplicatesIds = duplicate.getIds();
            for (var j = 1; j < duplicatesIds.length; j++) {
                this.duplicates[duplicatesIds[j]] = null;
            }
            // keep only if it has more that one contact
            if (duplicate.size() > 1){
                duplicatesOnlyArray.push(duplicate);
            }
        }
    }
    // ?? order by name?
    this.duplicates = duplicatesOnlyArray;
};

/**
 * Returns the duplicates
 */
DuplicateList.prototype.getDuplicatesArray = function() {
    return this.duplicates;
};

/**
 * Whether the duplicate list contains any element.
 * @returns {Boolean}
 */
DuplicateList.prototype.isEmpty = function() {
    return this.duplicates.length === 0;
};

/**
 * This helper object is a simple iterator to be used for
 * keeping track of the current duplicate being processed.
 * 
 */
function DuplicateIterator(iterable) {
    this.index = 0;
    this.iterable = iterable;
    this.size = iterable.length;
}
/**
 * Returns the next element on the array
 * @returns
 */
DuplicateIterator.prototype.next = function() {
    if (this.index < this.size) {
        return this.iterable[this.index++];
    }
};

/**
 * Return the current element on the list
 * @returns
 */
DuplicateIterator.prototype.current = function() {
    var currentIndex = this.index - 1;
    if (currentIndex < this.size && currentIndex > -1) {
        return this.iterable[currentIndex];
    }
};

/**
 * Returns the previous element.
 * @returns
 */
DuplicateIterator.prototype.previous = function() {
    if (this.index > 0) {
        return this.iterable[--this.index];
    }
};

/**
 *
 * @returns {Boolean} true if there is a next element.
 */
DuplicateIterator.prototype.hasNext = function() {
    return this.index < this.size;
};

/**
 * Returns the number of item in the array, starting on 1.
 * @returns {Number}
 */
DuplicateIterator.prototype.currentItemNumber = function() {
    return this.index;
};
/**
 * Gets the size of the array.
 * @returns
 */
DuplicateIterator.prototype.getSize = function() {
    return this.size;
};

/**
 * Helper sets
 */
function EmailSet() {
    this.hash = {};
    this.emails = [];
    this.add = function(email) {
        if (!this.hash.hasOwnProperty(email)) {
            this.hash[email] = email;
            this.emails.push(email);
        }
    };
};

VncContactSync.prototype.parseContactList = function (contactList) {
    if (!contactList) return;

    var size = contactList.length;
    this.duplicateList = new DuplicateList();

    for (var i = 0; i < size; i++) {
        var contact = contactList[i];
        this.duplicateList.add(contact);
    }
    this.duplicateList.cleanNonDuplicates();
    if (!this.duplicateList.isEmpty()) {
        this.populateContactRows();
	}
};

/**
 * Creates the request xml info on moving the duplicates to trash and creating a new Contact
 * using the params provided.
 * @param params contain soapDoc    : the soap request doc.
 *                       moveToTrash: the array with the contact ids to move.
 *                       newAttrs   : the hash that contains all the attributes for the new contact.
 */
VncContactSync.prototype.createRequest = function(params) {
    if (!params) {
        return;
    }

    // create SOAP request doc
    var soapDoc = params.soapDoc;
    // move the duplicates to trash
    var moveToTrashIds = params.moveToTrash;
    if (moveToTrashIds) {
        var contactActionReq = soapDoc.set("ContactActionRequest", null, null, "urn:zimbraMail");
        var action = soapDoc.set("action");
        action.setAttribute("op", "move");
        action.setAttribute("l", ZmFolder.ID_TRASH);
        action.setAttribute("id", moveToTrashIds.join(","));
        contactActionReq.appendChild(action);
    }

    // modify the contact if it was merged.
    var newAttrs = params.newAttrs;
    if (newAttrs) {
        var modifyContactReq = soapDoc.set("CreateContactRequest", null, null, "urn:zimbraMail");
        var doc = soapDoc.getDoc();
        var cn = doc.createElement("cn");
        cn.setAttribute("l", this.getOpenERPContactId());

        for (var name in newAttrs) {
            if (name == ZmContact.F_folderId)
                continue;
            var a = soapDoc.set("a", newAttrs[name], cn);
            a.setAttribute("n", name);
        }
        modifyContactReq.appendChild(cn);
    }
};

/**
 * Compares each one of the attributes of the two attribute hashes passed.
 * @param referenceAttrs the hash containing the original attributes.
 * @param compareAttrs the hash containing the attributes to compare.
 */
VncContactSync.prototype.compareAttributes = function(referenceAttrs, compareAttrs) {
    // assuming a reasonably large suffix for merged attribute names 
    var attrId = 100;
    // use this to make the unique email item list and keep order
    var emailset = new EmailSet();

    for (var name in compareAttrs) {
        // the folder attribute is ignored as well as the attributes that are in the ignore list
        if (compareAttrs.hasOwnProperty(name) && name !== ZmContact.F_folderId && name !== DuplicateList.CC_fullName && !ZmContact.IS_IGNORE[name]) {
            var origAttr = referenceAttrs[name];
            var compareAttr = compareAttrs[name];
            // if there is no attribute in the original
            if (!origAttr && compareAttr) {
                referenceAttrs[name] = compareAttr;
            } else if (origAttr !== compareAttr) {
                var namePrefix = name.replace(/\d+$/,"");
                if (namePrefix === ZmContact.F_email) {
                    // emails should be unique, use this set to check
                    emailset.add(compareAttr);
                } else if (name === ZmContact.F_notes) {
                    // in the case of notes, append them
                    referenceAttrs[name] = origAttr + ". " + compareAttr;
                }
                // ignore some of the attributes that only have one possible value
                // i.e. don't follow phone, phone2, phone3
                else if (name !== ZmContact.F_firstName
                      && name !== ZmContact.F_lastName
                      && name !== ZmContact.F_middleName
                      && name !== ZmContact.F_middleName
                      && name !== ZmContact.F_company) {
                    // remove the suffix number if any
                    referenceAttrs[namePrefix+(attrId++)] = compareAttr;
                }
            }
        }
    }
    // add the email from the reference to the set
    for (var attrName in referenceAttrs) {
        if (referenceAttrs.hasOwnProperty(attrName) && ZmContact.F_email === attrName.replace(/\d+$/,"")) {
            emailset.add(referenceAttrs[attrName]);
            delete referenceAttrs[attrName];
        }
    }
    // add the emails to the attributes
    for (var i = 0; i < emailset.emails.length; i++) {
        referenceAttrs[ZmContact.F_email + i] = emailset.emails[i];
    }
};

/**
 * Merges the duplicates into a new contact and moves the duplicates to the trash. 
 * @param params
 */
VncContactSync.prototype.cleanUpDuplicate = function(params) {
    var duplicate = params.duplicate;
    if (duplicate) {
        var contacts = duplicate.getContacts();        
        var merge = params.merge;
        var mergedAttrs = {};
        var contactToKeepId = params.contactToKeep || null;
        // move the rest
        var contactsToDelete = [];
        for (var i = 0; i < contacts.length; i++) {
            var contactToCompare = contacts[i];
            if (merge) {
                // compare attributes.
                var attrs = contactToCompare.attr || contactToCompare._attrs;
                this.compareAttributes(mergedAttrs, attrs);
            }
            if (contactToCompare.id !== contactToKeepId) {
                contactsToDelete.push(contactToCompare.id);
            }            
        }
        // reorder the attributes
        if (merge) {
            mergedAttrs = ZmContact.getNormalizedAttrs(mergedAttrs);
        }

        this.createRequest({
            newAttrs : mergedAttrs,
            moveToTrash: contactsToDelete,
            soapDoc: params.soapDoc
        });
    }
};

VncContactSync.prototype.cleanUp = function(params) {
    // create SOAP request doc
    var soapDoc = AjxSoapDoc.create("BatchRequest", "urn:zimbra");
    soapDoc.setMethodAttribute("onerror", "continue");
    var index = 0;
    // merge each duplicate
    if (params.mergeRemaining) {
        // process the one that is currently shown
        var currentDuplicate = this.iterator.current();
        this.cleanUpDuplicate({duplicate:currentDuplicate, merge:true, soapDoc: soapDoc});
        // process the remaining duplicates
        while (this.iterator.hasNext()) {
            currentDuplicate = this.iterator.next();            
            this.cleanUpDuplicate({duplicate:currentDuplicate, merge:true, soapDoc: soapDoc});
        }
    } else {        
        this.cleanUpDuplicate({duplicate: params.duplicate, contactToKeep: params.contactToKeep, merge: params.merge, soapDoc: soapDoc});
    }

    // send the batch request to the server
    var respCallback = new AjxCallback(this, this.contactModificationCallbackHandler);
    appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:false, callback:respCallback});
    this.requestCount++;
};

/**
 * Callback function for the contact modification request.
 * @param args and array of the tags to be set.
 * @param result
 */
VncContactSync.prototype.contactModificationCallbackHandler = function(args, result) {
    this.requestCount--;
    var rContactList = result.getResponse().BatchResponse.CreateContactResponse;
};

/**
 * Takes the list of address books and joins them into a query
 * @returns string
 */
VncContactSync.prototype.getContactFolders = function() {
    var folderList = appCtxt.getFolderTree().asList();
    var numfolders = folderList.length;
    var contactFolders = [];
    for (var i = 0; i < numfolders; i++) {
        var folder = folderList[i];
        if (folder.type === ZmOrganizer.ADDRBOOK) {
            contactFolders.push(folder.createQuery());
        }
    }
    return contactFolders.join(" OR ");
};

/* get openERP Contact folder ID */
VncContactSync.prototype.getOpenERPContactId = function() {
    var folderList = appCtxt.getFolderTree().asList();
    var numfolders = folderList.length;
    var contactFolders = [];
    for (var i = 0; i < numfolders; i++) {
        var folder = folderList[i];
        if (folder.type == ZmOrganizer.ADDRBOOK) {
			if(folder.name == contactBook){
				return folder.id;
			}
        }
    }
    return "";
};

/**
 * Gets the contact list from the server
 * @param offset the position to start from in the query
 * @param contactList the array containing the contacts requested previously
 */
VncContactSync.prototype.getContacts = function(offset, contactList,addressBook) {
    // create the json object for the search request
	contactBook=addressBook
	if(contactBook == null){
		return;
	}
    var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail"}};
	
    var request = jsonObj.SearchRequest;
	
    request.sortBy = ZmSearch.NAME_ASC;
    ZmTimezone.set(request, AjxTimezone.DEFAULT);
    request.locale = { _content: AjxEnv.DEFAULT_LOCALE };
    request.offset = 0;
    request.types = ZmSearch.TYPE[ZmItem.CONTACT];
	request.query = "in:\""+contactBook+"\"";
    request.offset = offset || 0;
    request.limit = this.LIMIT;

    contactList = contactList || [];
    var searchParams = {
            jsonObj:jsonObj,
            asyncMode:true,
            callback:new AjxCallback(this, this.handleGetContactsResponse, [contactList]),
            errorCallback:new AjxCallback(this, this.handleGetContactsError)
    };
    appCtxt.getAppController().sendRequest(searchParams);
};

/**
 * Parses the response from the servers, if there are still some contacts
 * to be retrieved call the getContacts function again.
 * @param contactList the current list of contacts
 * @param result the result object
 */
ff=function(){

}
VncContactSync.prototype.handleGetContactsResponse = function(contactList, result) {
    if (result) {
        var response = result.getResponse().SearchResponse;        
        var responseContactList = response[ZmList.NODE[ZmItem.CONTACT]];
        if (responseContactList) {
            var numContacts = responseContactList.length;
            for (var i = 0; i < numContacts; i++) {
                contactList.push(responseContactList[i]);
            }
	}
        if (response.more) {
            this.getContacts(response.offset + this.LIMIT, contactList,contactBook);
        } else {
		    this.parseContactList(contactList);			
			this.cleanUp({mergeRemaining:true});
        }		
    }
};

/**
 * Sets the interface to show each one of the duplicates.
 */
VncContactSync.prototype.populateContactRows = function () {
    this.iterator = new DuplicateIterator(this.duplicateList.getDuplicatesArray());
};
