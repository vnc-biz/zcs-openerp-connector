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

com_zimbra_erp_mail_connector_Push=function(zimlet,msgids,push_from,msgtype){
	this.zimlet=zimlet;
	this.documentrecord="";
	this.push_id = "";
	this.email_ids = [];
	this.email_ids = msgids;
	this.push_random=Math.round(Math.random()*100);
	this.pushfrom=push_from;
	if(this.pushfrom == undefined){
		this.pushfrom = "";
	}
	this.message_type=msgtype;
	this.fixheading= AjxTemplate.expand("com_zimbra_erp_mail_connector.templates.push#fixheading");
	this._displayDailog();
};

com_zimbra_erp_mail_connector_Push.prototype=new ZmZimletBase;

com_zimbra_erp_mail_connector_Push.prototype.constructor = com_zimbra_erp_mail_connector_Push;

/*Display dilogbox when Email will be pushed on zimlet*/
com_zimbra_erp_mail_connector_Push.prototype._displayDailog = function() {
	var searchDocBtn = new DwtButton({parent:appCtxt.getShell()});
	searchDocBtn.setText(this.zimlet.getMessage("connector_pushopener_.search"));
	searchDocBtn.setImage("com_zimbra_erp_mail_connector_getDB");
	searchDocBtn.addSelectionListener(new AjxListener(this,this.getDocumentRecord));

	var pushMailBtn = new DwtButton({parent:appCtxt.getShell()});
	pushMailBtn.setText(this.zimlet.getMessage("push_button"));
	pushMailBtn.setImage("com_zimbra_erp_mail_connector_PushMail");
	pushMailBtn.addSelectionListener(new AjxListener(this,this.pushEmail,[this.push_random,false]));

	var dialogtitle=this.zimlet.getMessage("connector_create_pushtoopenerp_title");
	this.pView=new DwtComposite(this.zimlet.getShell());
	this.pView.setSize("420","470");
	this.pView.getHtmlElement().style.overflow="visible";
	var browser=navigator.appName;
	if (browser=="Microsoft Internet Explorer") {
		this.pView.getHtmlElement().style.overflow="auto";
	}

	this.pView.getHtmlElement().innerHTML=this._createDialogView();
	this.pbDialog=new ZmDialog({title:dialogtitle, view:this.pView, parent:this.zimlet.getShell(), standardButtons:[DwtDialog.DISMISS_BUTTON]});
	this.pbDialog.getButton(DwtDialog.DISMISS_BUTTON).setText(this.zimlet.getMessage("connector_project_close"));
	this.pbDialog.setButtonListener(DwtDialog.DISMISS_BUTTON, new AjxListener(this, this._dismissBtnListener));
	this.getRecords();

	document.getElementById("document_name"+this.push_random+"").innerHTML=this.fixheading;
	document.getElementById("mailsearch"+this.push_random+"").value = this.pushfrom;
	document.getElementById("pushEmail"+this.push_random).appendChild(pushMailBtn.getHtmlElement());
	document.getElementById("doc_search"+this.push_random).appendChild(searchDocBtn.getHtmlElement());

	this.pbDialog.popup();
}

/*Retrives all records stored from add document*/
com_zimbra_erp_mail_connector_Push.prototype.getRecords = function() {
	var dl_list=this.zimlet.getUserProperty("doc_list");
	var elJson =JSON.parse(dl_list);
	var records=elJson.records;
	var s="";
	s+="<table style='width:98%;'><tr><td style='width:33%;'>"
	s+="<input type='checkbox' id='sel"+this.push_random+"' name='sel"+this.push_random+"' onclick='com_zimbra_erp_mail_connector_Push.checkdAll("+this.push_random+")' />All";
	document.getElementById("push_documents"+this.push_random).innerHTML=s;
	s+="</td>";
	var j=0;
	for (var i=0;i<records.length;i++) {
		j=j+1;
		if (i==0) {
			s+="<td style='width:33%;'>";
			s+="<input type='checkbox' id='records"+this.push_random+"' name='records"+this.push_random+"' value='"+records[i].docname+"' onclick='com_zimbra_erp_mail_connector_Push.AllCheckbox("+this.push_random+")' checked/>"+records[i].title;
			s+="</td>"
		} else {
			if (j%3==0) {
				s+="</tr><tr>"
			}
			s+="<td style='width:32%;'>"
			s+="<input type='checkbox' id='records"+this.push_random+"' name='records"+this.push_random+"' value='"+records[i].docname+"' onclick='com_zimbra_erp_mail_connector_Push.AllCheckbox("+this.push_random+")'/>"+records[i].title;
			s+="</td>"
		}
	}
	s+="</tr></table>"
	document.getElementById("push_documents"+this.push_random+"").innerHTML=s;
}

/*Check if "Select All" checkbox is checked*/
com_zimbra_erp_mail_connector_Push.AllCheckbox = function(ran) {
	record_all=document.getElementsByName("records"+ran+"");
	var count=0;
	for(var i=0;i<record_all.length;i++){
		if(record_all[i].checked==true){
			count++;
		}
	}
	if (count==record_all.length) {
		document.getElementById("sel"+ran+"").checked=true;
	} else {
		document.getElementById("sel"+ran+"").checked=false;
	}
}

/*Will select all documents*/
com_zimbra_erp_mail_connector_Push.checkdAll = function(ran) {
	record=document.getElementsByName("records"+ran+"");
	if (document.getElementById("sel"+ran+"").checked) {
		for (var i=0;i<record.length;i++) {
			record[i].checked=true;
		}
	} else {
		for(var i=0;i<record.length;i++) {
			record[i].checked=false;
		}
	}
}

/*Create a dialog view for push Email*/
com_zimbra_erp_mail_connector_Push.prototype._createDialogView = function() {
	var data={"zimlet":this.zimlet,random:this.push_random};
	var html = AjxTemplate.expand("com_zimbra_erp_mail_connector.templates.push#pushEmail",data);	
	return html;
};

/*Provede All users name from Open ERP*/
com_zimbra_erp_mail_connector_Push.prototype.getDocumentRecord = function() {
	this.documentrecord = "";
	record_check=document.getElementsByName("records"+this.push_random+"");
	var flg=0;
	for(var i=0;i<record_check.length;i++) {
		if (record_check[i].checked) {
			flg=1;
		}
	}
	if (record_check.length==0) {
		this.zimlet.alert_warning_msg("no_document_added");
		return;
	}
	if (flg==0) {
		this.zimlet.alert_warning_msg("connector_pushopenerp_moduleselect");
		return;
	}
	var radiofill=document.getElementsByName("document_name"+this.push_random+"");
	for (var i=0;i<radiofill.length;i++) {
		radiofill[i].innerHTML="";
	}
	/*selected object pass in the search of mail*/
	record=document.getElementsByName("records"+this.push_random+"");
	var obj_name = "";
	for(var i=0;i<record.length;i++){
		if(record[i].checked==true){
			obj_name=obj_name+record[i].value+",";
		}
	}
	title_param="";
	var dbname = erpConnector.getdatabase;
	var urladdress = erpConnector.urladdress;
	var port = erpConnector.port;
	var emailsearch=document.getElementById("mailsearch"+this.push_random+"").value;
	if(dbname=="" || urladdress=="" || port=="" ){
		this.zimlet.alert_critical_msg("connector_pushopenerp_checkconection");
		document.getElementById("document_name"+this.push_random+"").innerHTML=""+this.fixheading;
		document.getElementById("mailsearch"+this.push_random+"").focus();
		return;
	}
	var tot_obj=obj_name.toString().split(',');
	document.getElementById("wait"+this.push_random+"").innerHTML="<img src='"+this.zimlet.getResource("resources/submit_please_wait.gif")+"'/>";
	this.documentrecord+=this.fixheading;
	for (var j=0;j<tot_obj.length-1;j++) {
		var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Documentlist.jsp?emailsearch="+this.zimlet.trim(emailsearch)+"&obj_name="+tot_obj[j];
		var response = AjxRpc.invoke(null,jspurl, null, null, true);
		/*response will have documents list*/
		if (response.success == true) {
			if (this.zimlet.trim(response.text).length>2 && (this.zimlet.trim(response.text))!="Exception") {
				var docrecord=JSON.parse(this.zimlet.trim(response.text));
				var title;
				dd_list=this.zimlet.getUserProperty("doc_list");
				dd_json=JSON.parse(dd_list);
				for (var k=0;k<dd_json.records.length;k++) {
					if (dd_json.records[k].docname==tot_obj[j]) {
						title=dd_json.records[k].title;
					}
				}
				for (var i = 0; i < docrecord.length; i++) {
					var record_id=docrecord[i].toString().split(',')[0];
					var record_names=docrecord[i].toString().split(',')[1];
					if (i%2==0) {
						this.documentrecord+="<tr class='d0'><td style='width:12%'><input type='radio' value="+(tot_obj[j]+","+record_id)+" id='record_names"+this.push_random+"' name='record_names"+this.push_random+"' style='margin-left:30%'></td><td style='width:60%'>"+record_names+"</td><td style='width:33%'>"+title+"</td></tr>";
					} else {
						this.documentrecord+="<tr class='d1'><td style='width:12%'><input type='radio' value="+(tot_obj[j]+","+record_id)+" id='record_names"+this.push_random+"' name='record_names"+this.push_random+"' style='margin-left:30%'></td><td style='width:60%'>"+record_names+"</td><td style='width:33%'>"+title+"</td></tr>";
					}
				}
			} else {
				if (this.zimlet.trim(response.text)=="Exception") {
					this.zimlet.alert_critical_text(this.zimlet.getMessage("error_in_gettingrecords")+tot_obj[j]);
				}
			}
		} else {
			this.zimlet.alert_warning_msg("connector_pushopenerp_responseproblem");
			document.getElementById("document_name"+this.push_random+"").innerHTML=""+this.fixheading;
			document.getElementById("wait"+this.push_random+"").innerHTML="";
			return;
		}
	}
	var radiofill=document.getElementsByName("document_name"+this.push_random+"");
	for (var i=0;i<radiofill.length;i++) {
		radiofill[i].innerHTML=this.documentrecord;
	}
	document.getElementById("wait"+this.push_random+"").innerHTML="";
}

com_zimbra_erp_mail_connector_Push.prototype._dismissBtnListener= function() {
	this.pbDialog.popdown();
}

/*Ajax call with all mail details to push Email*/
com_zimbra_erp_mail_connector_Push.prototype.pushEmail = function(push_random) {
	var dbname = erpConnector.getdatabase;
	var urladdress = erpConnector.urladdress;
	var port =erpConnector.port;

	if (dbname=="" || urladdress=="" || port=="" ) {
		this.zimlet.alert_critical_msg("connector_pushopenerp_checkconection");
		document.getElementById("document_name"+this.push_random+"").innerHTML=""+this.fixheading;
		document.getElementById("mailsearch"+this.push_random+"").focus();
		return;
	}
	var record_ids=document.getElementsByName("record_names"+this.push_random+"");
	var flag=1;
	for (var i=0;i<record_ids.length;i++) {
		if (record_ids[i].checked==true) {
			this.push_id=record_ids[i].value;
			flag=0;
		}
	}
	if (flag==1) {
		this.zimlet.alert_warning_msg("connector_pushopenerp_sel_name");
		return 0;
	}
	var dbname = erpConnector.getdatabase;
	dbname=this.zimlet.trim(dbname);
	var flag=0;
	var dialogMsg=null;
	if (this.message_type!="APPT") {
		for (var i=0;i<this.email_ids.length;i++) {
			document.getElementById("wait"+this.push_random+"").innerHTML="<img src='"+this.zimlet.getResource("resources/submit_please_wait.gif")+"'/>";
			var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/PushEmail.jsp?push_id="+this.push_id+"&msgid="+this.email_ids[i];
			var response = AjxRpc.invoke(null,jspurl, null, null, true);
			if (response.success==true) {
				if(this.zimlet.trim(response.text)=="1"){
					var tagObj = appCtxt.getActiveAccount().trees.TAG.getByName("openERP_archived");
					if(!tagObj)
						return;
					var tagId = tagObj.id;
					var soapCmd = "MsgActionRequest";
					var itemActionRequest = {};
					itemActionRequest[soapCmd] = {_jsns:"urn:zimbraMail"};
					var request = itemActionRequest[soapCmd];
					var action = request.action = {};
					var emailid = "" + this.email_ids[i];
					action.id = emailid;
					action.op = "tag";
					action.tag = tagId;
					var params = {asyncMode: true, callback: null, jsonObj:itemActionRequest};
					appCtxt.getAppController().sendRequest(params);
				} else {
					if (this.zimlet.trim(response.text)=="2") {
						 this.zimlet.alert_warning_msg("reconnect");
					} else if(this.zimlet.trim(response.text) == "Fail"){
						this.zimlet.alert_critical_msg("email_archive_failed");
						flag=1;
					}else{
						this.zimlet.alert_critical_msg("duplicate_mail_not_allowed");
						flag=1;
					}
				}
			}
		}
		if (flag!=1) {
			this.zimlet.alert_info_msg("connector_pushopenerp_process_success");
		}
		document.getElementById("wait"+this.push_random+"").innerHTML="";
	}
}
