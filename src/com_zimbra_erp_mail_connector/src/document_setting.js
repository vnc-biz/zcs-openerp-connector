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

document_setting.prototype = new DwtTabViewPage;
document_setting.prototype.constructor = document_setting;
	var document_title;
	var document_docname;
	var zm;
	var success_insert;
	var unsuccess_insert;
	var success_delete;
	var unsuccess_delete;
	var unsuccess_blank;
	var proto="http://";	
/*...Constructor....*/
function document_setting(parent, zimlet,document_lbl_title,document_lbl_docname,document_success_insert,document_unsuccess_insert,document_success_delete,document_unsuccess_delete,document_unsuccess_blank){
	
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	zm=this.zimlet;
	proto=zm.getUserProperty("proto");
	document_title=document_lbl_title;
	document_docname=document_lbl_docname;
	success_insert=document_success_insert;
	unsuccess_insert=document_unsuccess_insert;
	success_delete=document_success_delete;
	unsuccess_delete=document_unsuccess_delete;
	unsuccess_blank=document_unsuccess_blank;
	this._createHTML();
	getTableRecords();
	this.setScrollStyle(Dwt.SCROLL);
}

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}
/*...........getRecords from zimbra proeprty...*/
function getTableRecords(){
	var data=zm.getUserProperty("doc_list");
	var elJson =JSON.parse(data);
	var records=elJson.records;
	var s="<table class='gridtable' align='right'><tr><td class='doc_setng_chkbx'><input type='checkbox' id='selectall' onclick='checkAll()' class='doc_setng_chkbx2'/><b></b></td><td><b>"+zm.getMessage("connector_document_document_title")+"</b></td><td><b>"+zm.getMessage("connector_document_document_docname")+"</b></td></tr>";
	for(var i=0;i<records.length;i++){
		if(i%2==0){
			s+="<tr class='d0'><td class='doc_setng_chkbx'><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"' class='doc_setng_chkbx2'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
		}else{
			s+="<tr class='d1'><td class='doc_setng_chkbx'><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"' class='doc_setng_chkbx2'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
		}
					
	}
	s+="</table>";
	document.getElementById('doc_record').innerHTML=s;
}
/*...........Check whether "ALL" chkbox is selected ...*/
function checkAll(){
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

document_setting.prototype._createHTML = function() {
	var i = 0;
	var html = new Array();
	html[i++]="<table>";	
	html[i++]="</table>";
	html[i++]="<br>";
	html[i++]="<div id='doc_record'></div>";
	this.getHtmlElement().innerHTML = html.join("");
};
/*....Record will be varified with OpenERP and add....*/

function addRecord() {
	var title=document.getElementById("document_title").value;
	var docname=document.getElementById("document_docname").value;
	title=title.trim();
	docname=docname.trim();
	if(title==""){
	  	var a =  appCtxt.getMsgDialog();
            a.setMessage(zm.getMessage("connector_document_title_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
            a.popup();
		document.getElementById("document_title").focus();
		return;
		
	}
	if(document.getElementById("document_title").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_document_title_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("document_title").focus();
		return;
	}
	if(docname=="" ){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_document_document_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("document_docname").focus();
		return;
	}
	if(document.getElementById("document_docname").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_document_document_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("document_docname").focus();
		return;
	}	
	try {
		var dbname=zm.getUserProperty("getdatabase");
		var password=zm.getUserProperty("userpassword");
		var urladdress=zm.getUserProperty("urladdress");
		var openerp_id=zm.getUserProperty("openerp_id");
		var port=zm.getUserProperty("port");
		if (dbname=="" || password=="" || urladdress=="" || port=="" ) {
			var a =  appCtxt.getMsgDialog();
				a.setMessage(zm.getMessage("connector_pushopenerp_checkconection"),DwtMessageDialog.WARNING_STYLE,zm.getMessage("warning"));
				a.popup();
			return;
		}		
		var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Recordvarify.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&obj_name="+docname+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&openerp_id="+openerp_id;
		var response = AjxRpc.invoke(null,jspurl, null, null, true);
		if(response.text.trim()=="Fail"){
			var a =  appCtxt.getMsgDialog();
				a.setMessage(zm.getMessage("invalid_record_name"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
				a.popup();
			return;
		}
	} catch(e) {
		var a = appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("invalid_doc_or_connection"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
		return;
	}
	var oldList=zm.getUserProperty("doc_list");
	var elJson =JSON.parse(oldList);
	var oldListLength=elJson.records.length;
	var i;
	var duplicateFlag=0;
	for(i=0;i<oldListLength;i++){
		if(docname==elJson.records[i].docname){
					var a =  appCtxt.getMsgDialog();
						a.setMessage(zm.getMessage("duplicate_error"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
						a.popup();
					duplicateFlag=1;
					document.getElementById("document_title").value="";
					document.getElementById("document_docname").value="";
					return;	
		}
	}
	if(duplicateFlag==0){
		elJson.records[oldListLength]={"id":oldListLength+1,"title":title,"docname":docname};
		var newRecordString=JSON.stringify(elJson);
		zm.setUserProperty("doc_list",newRecordString);
		zm.saveUserProperties();
		var a =  appCtxt.getMsgDialog();
			a.setMessage(success_insert,DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
			a.popup();
		getTableRecords();
	}
	document.getElementById("document_title").value="";
	document.getElementById("document_docname").value="";
}

function valid(){
	var title=document.getElementById("document_title").value;
	var docname=document.getElementById("document_docname").value;
}

function deleteRecord(){
	var record_id=document.getElementsByName("record_id");
	var param="";
	var flg=0;
	for(var i=0;i<record_id.length;i++){
		if(record_id[i].checked){
			flg=1;
		}
	}
	if(flg==0){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_document_select_record"),DwtMessageDialog.WARNING_STYLE,zm.getMessage("warning"));
			a.popup();
		return;
	}
	var dl_String=zm.getUserProperty("doc_list");
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
	zm.setUserProperty("doc_list",new_dl_String);
	zm.saveUserProperties();
	var a =  appCtxt.getMsgDialog();
        a.setMessage(success_delete,DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
        a.popup();
	getTableRecords();//Fill records after update.
}
