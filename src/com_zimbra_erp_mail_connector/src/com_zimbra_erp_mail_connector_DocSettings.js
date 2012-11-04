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

/*...Constructor....*/
function com_zimbra_erp_mail_connector_DocSettings(parent, zimlet){
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	this._createHTML();
	this.getTableRecords();
	this.setScrollStyle(Dwt.SCROLL);
}


/*...........getRecords from zimbra proeprty...*/
com_zimbra_erp_mail_connector_DocSettings.prototype.getTableRecords = function(){
	var data=this.zimlet.getUserProperty("doc_list");
	var elJson =JSON.parse(data);
	var records=elJson.records;
	var s="<table class='com_zimbra_erp_mail_connector_gridtable' align='right'><tr><td class='com_zimbra_erp_mail_connector_doc_setng_chkbx'><input type='checkbox' id='selectall' onclick='com_zimbra_erp_mail_connector_DocSettings.checkAll()' class='com_zimbra_erp_mail_connector_doc_setng_chkbx2'/><b></b></td><td><b>"+this.zimlet.getMessage("connector_document_document_title")+"</b></td><td><b>"+this.zimlet.getMessage("connector_document_document_docname")+"</b></td></tr>";
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

com_zimbra_erp_mail_connector_DocSettings.prototype.addRecord = function() {
	var title=document.getElementById("erpConnector_document_title").value;
	var docname=document.getElementById("erpConnector_document_docname").value;
	title=this.zimlet.trim(title);
	docname=this.zimlet.trim(docname);
	if(title==""){
		this.zimlet.alert_critical_msg("connector_document_title_blank");
		document.getElementById("erpConnector_document_title").focus();
		return;
	}
	if(document.getElementById("erpConnector_document_title").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_document_title_blank");
		document.getElementById("erpConnector_document_title").focus();
		return;
	}
	if(docname==""){
		this.zimlet.alert_critical_msg("connector_document_document_blank");
		document.getElementById("erpConnector_document_docname").focus();
		return;
	}
	if(document.getElementById("erpConnector_document_docname").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_document_document_blank");
		document.getElementById("erpConnector_document_docname").focus();
		return;
	}
	try {
		var dbname = erpConnector.getdatabase;
		var urladdress = erpConnector.urladdress;
		var port = erpConnector.port;
		if (dbname=="" || urladdress=="" || port=="" ) {
			 this.zimlet.alert_warning_msg("connector_pushopenerp_checkconection");
			return;
		}
		var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Recordverify.jsp?obj_name="+docname;
		var response = AjxRpc.invoke(null,jspurl, null, null, true);
		if(response.text.trim()=="Fail"){
			this.zimlet.alert_critical_msg("invalid_record_name");
			return;
		}
	} catch(e) {
		this.zimlet.alert_critical_msg("invalid_doc_or_connection");
		return;
	}
	var oldList=this.zimlet.getUserProperty("doc_list");
	var elJson =JSON.parse(oldList);
	var oldListLength=elJson.records.length;
	var i;
	var duplicateFlag=0;
	for(i=0;i<oldListLength;i++){
		if(docname==elJson.records[i].docname){
			this.zimlet.alert_critical_msg("duplicate_error");
			duplicateFlag=1;
			document.getElementById("erpConnector_document_title").value="";
			document.getElementById("erpConnector_document_docname").value="";
			return;
		}
	}
	if(duplicateFlag==0){
		elJson.records[oldListLength]={"id":oldListLength+1,"title":title,"docname":docname};
		var newRecordString=JSON.stringify(elJson);
		this.zimlet.setUserProperty("doc_list",newRecordString);
		this.zimlet.saveUserProperties();
		this.zimlet.alert_info_msg("success_insert");
		this.getTableRecords();
	}
	document.getElementById("erpConnector_document_title").value="";
	document.getElementById("erpConnector_document_docname").value="";
}

com_zimbra_erp_mail_connector_DocSettings.prototype.deleteRecord = function(){
	var record_id=document.getElementsByName("record_id");
	var param="";
	var flg=0;
	for(var i=0;i<record_id.length;i++){
		if(record_id[i].checked){
			flg=1;
		}
	}
	if(flg==0){
		this.zimlet.alert_warning_msg("connector_document_select_record");
		return;
	}
	var dl_String=this.zimlet.getUserProperty("doc_list");
	var dl_Json=JSON.parse(dl_String);
	var new_String="{\"records\":[]}";
	var new_Json=JSON.parse(new_String);
	var count=0;
	for (var i=0;i<record_id.length;i++) {
		if (record_id[i].checked) {
		}else{
			new_Json.records[count]=dl_Json.records[i];
			count=count+1;
		}
	}
	var new_dl_String=JSON.stringify(new_Json);
	this.zimlet.setUserProperty("doc_list",new_dl_String);
	this.zimlet.saveUserProperties();
	this.zimlet.alert_info_msg("success_delete");
	this.getTableRecords();//Fill records after update.
}
