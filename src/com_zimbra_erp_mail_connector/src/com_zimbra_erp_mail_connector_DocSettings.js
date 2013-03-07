/*##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (<http://www.vnc.biz>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################*/

com_zimbra_erp_mail_connector_DocSettings.prototype = new DwtTabViewPage;

com_zimbra_erp_mail_connector_DocSettings.prototype.constructor = com_zimbra_erp_mail_connector_DocSettings;

com_zimbra_erp_mail_connector_DocSettings_this = ""

/*...Constructor....*/
function com_zimbra_erp_mail_connector_DocSettings(parent, zimlet){
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	com_zimbra_erp_mail_connector_DocSettings_this=this;
	this._createHTML();
	this.getTableRecords();
	this.setScrollStyle(Dwt.SCROLL);
}

/*...........getRecords from zimbra proeprty...*/
com_zimbra_erp_mail_connector_DocSettings.prototype.getTableRecords = function(){
	var data=com_zimbra_erp_mail_connector_DocSettings_this.zimlet.getUserProperty("doc_list");
	var elJson =JSON.parse(data);
	var records=elJson.records;
	var s="<table class='com_zimbra_erp_mail_connector_gridtable' align='right'><tr><td class='com_zimbra_erp_mail_connector_doc_setng_chkbx'><input type='checkbox' id='selectall' onclick='com_zimbra_erp_mail_connector_DocSettings.checkAll()' class='com_zimbra_erp_mail_connector_doc_setng_chkbx2'/><b></b></td><td><b>"+com_zimbra_erp_mail_connector_DocSettings_this.zimlet.getMessage("connector_document_document_title")+"</b></td><td><b>"+com_zimbra_erp_mail_connector_DocSettings_this.zimlet.getMessage("connector_document_document_docname")+"</b></td></tr>";
	for(var i=0;i<records.length;i++){
		if(i%2==0){
			s+="<tr class='d0'><td class='com_zimbra_erp_mail_connector_doc_setng_chkbx'><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"' class='com_zimbra_erp_mail_connector_doc_setng_chkbx2'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
		}else{
			s+="<tr class='d1'><td class='com_zimbra_erp_mail_connector_doc_setng_chkbx'><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"' class='com_zimbra_erp_mail_connector_doc_setng_chkbx2'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
		}
	}
	s+="</table>";
	document.getElementById('doc_record').innerHTML=s;
}

/*...........Check whether "ALL" chkbox is selected ...*/
com_zimbra_erp_mail_connector_DocSettings.checkAll = function(){
	var record_id=document.getElementsByName("record_id");
	if (document.getElementById("selectall").checked) {
		for(var i=0;i<record_id.length;i++){
			record_id[i].checked=true;
		}
	} else {
		for (var i=0;i<record_id.length;i++) {
			record_id[i].checked=false;
		}
	}
}

com_zimbra_erp_mail_connector_DocSettings.prototype._createHTML = function() {
	this.getHtmlElement().innerHTML = AjxTemplate.expand("com_zimbra_erp_mail_connector.templates.documentList#docList");
};
