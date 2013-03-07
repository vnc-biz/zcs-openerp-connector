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

com_zimbra_erp_mail_connector_Settings.prototype = new DwtTabViewPage;

com_zimbra_erp_mail_connector_Settings.prototype.constructor = com_zimbra_erp_mail_connector_Settings;

function com_zimbra_erp_mail_connector_Settings(parent, zimlet,confi_btn_database){
	this.flag = 0;
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	config_btn_database=confi_btn_database;
	this._createHTML();
	document.getElementById("com_zimbra_erp_mail_connector_urladdress").value=erpConnector.urladdress;
	if(erpConnector.getdatabase=="" || erpConnector.getdatabase ==null || erpConnector.getdatabase == undefined){
		document.getElementById("com_zimbra_erp_mail_connector_getdatabase").innerHTML=""+"<option>"+zimlet.getMessage("select_any_database")+"</option>";
	}else{
		document.getElementById("com_zimbra_erp_mail_connector_getdatabase").innerHTML="<option value="+erpConnector.getdatabase+">"+erpConnector.getdatabase+"</option>";
	}
	document.getElementById("com_zimbra_erp_mail_connector_port").value = erpConnector.port;
	document.getElementById("com_zimbra_erp_mail_connector_username").value = "";
	this.setScrollStyle(Dwt.SCROLL);
}

com_zimbra_erp_mail_connector_Settings.prototype.clearConfig = function() {
	document.getElementById("com_zimbra_erp_mail_connector_getdatabase").innerHTML=""+"<option>"+this.zimlet.getMessage("select_any_database")+"</option>";
	document.getElementById("com_zimbra_erp_mail_connector_port").value="";
	document.getElementById("com_zimbra_erp_mail_connector_username").value="";
	document.getElementById("com_zimbra_erp_mail_connector_userpassword").value="";
	document.getElementById("com_zimbra_erp_mail_connector_urladdress").value="";
}

com_zimbra_erp_mail_connector_Settings.prototype._createHTML = function() {
	var get_db = new DwtButton({parent:appCtxt.getShell()});
	get_db.setText(config_btn_database);
	get_db.setImage("com_zimbra_erp_mail_connector_getDB");
	get_db.addSelectionListener(new AjxListener(this,this._getDatabase));
	var connectBtn = new DwtButton({parent:appCtxt.getShell()});
	connectBtn.setText(this.zimlet.getMessage("connector_configuration_lbl_connect"));
	connectBtn.setImage("connect");
	connectBtn.addSelectionListener(new AjxListener(this,this.checkConnection));
	var i = 0;
	var html = new Array();
	var data={"zimlet":this.zimlet,random:Dwt.getNextId()};
	this.getHtmlElement().innerHTML = AjxTemplate.expand("com_zimbra_erp_mail_connector.templates.config#config_Settings",data);
	document.getElementById("getDatabase").appendChild(get_db.getHtmlElement());
	document.getElementById("connect_database").appendChild(connectBtn.getHtmlElement());
};

com_zimbra_erp_mail_connector_Settings.showpass = function(){
	if(document.getElementById("passchk").checked){
		document.getElementById("com_zimbra_erp_mail_connector_userpassword").type='text';
	}else{
		document.getElementById("com_zimbra_erp_mail_connector_userpassword").type='password';
	}
}

/*Gives the Database List*/
com_zimbra_erp_mail_connector_Settings.prototype._getDatabase = function(){
	var urladdress=document.getElementById("com_zimbra_erp_mail_connector_urladdress").value;
	var port=document.getElementById("com_zimbra_erp_mail_connector_port").value;
	port=this.zimlet.trim(port);
	urladdress=this.zimlet.trim(urladdress);
	if(urladdress==""){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank");
		document.getElementById("com_zimbra_erp_mail_connector_urladdress").focus();
		return;
	}
	if(urladdress==""){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank");
		document.getElementById("com_zimbra_erp_mail_connector_urladdress").focus();
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_urladdress").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank");
		document.getElementById("com_zimbra_erp_mail_connector_urladdress").focus();
		return;
	}
	if(port==""){
		this.zimlet.alert_critical_msg("connector_configuration_port");
		document.getElementById("com_zimbra_erp_mail_connector_port").focus();
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_port").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_port");
		document.getElementById("com_zimbra_erp_mail_connector_port").focus();
		return;
	}
	var proto="http://";
	var pro=urladdress.match("^https");
	if(pro != null && pro == "https"){
		proto="https://"
		urladdress=urladdress.substring(8);
	}else if(urladdress.match("^http") == "http"){
		proto="http://"
		urladdress=urladdress.substring(7);
	}	
	var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/GetDatabaseRpc.jsp?urladdress="+(proto+urladdress)+"&port="+port;
	var response = AjxRpc.invoke(null,jspurl, null, null, true);
	if (response.success == true && (this.zimlet.trim(response.text))!="fail") {
		var res=this.zimlet.trim(response.text);
		var select= document.getElementById('com_zimbra_erp_mail_connector_getdatabase');
		if(res.length<=0){
			this.zimlet.alert_critical_msg("connector_configuration_lbl_database_notfound");
			document.getElementById("com_zimbra_erp_mail_connector_getdatabase").innerHTML=""+"<option>"+this.zimlet.getMessage("select_any_database")+"</option>";
		}else{
			document.getElementById("com_zimbra_erp_mail_connector_getdatabase").innerHTML="";
			var dbname=res.substr(1,res.length-2).split(",");
			for(i=0;i<dbname.length;i++){
				select.options[select.options.length]= new Option(dbname[i], dbname[i]);
			}
		}
	}
	else{
		this.zimlet.alert_warning_msg("time_out");
		document.getElementById("com_zimbra_erp_mail_connector_getdatabase").innerHTML=""+"<option>"+this.zimlet.getMessage("select_any_database")+"</option>";
	}
}

com_zimbra_erp_mail_connector_Settings.prototype.checkConnection = function(){
	this.flag=0;
	var url=document.getElementById("com_zimbra_erp_mail_connector_urladdress").value;
	var database=document.getElementById("com_zimbra_erp_mail_connector_getdatabase").value;
	var port=document.getElementById("com_zimbra_erp_mail_connector_port").value;
	var username=document.getElementById("com_zimbra_erp_mail_connector_username").value;
	var z_password=document.getElementById("com_zimbra_erp_mail_connector_userpassword").value;
	port=this.zimlet.trim(port);
	username=this.zimlet.trim(username);
	url=this.zimlet.trim(url);
	if(url==""){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank");
		document.getElementById("com_zimbra_erp_mail_connector_urladdress").focus();
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_urladdress").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank");
		document.getElementById("com_zimbra_erp_mail_connector_urladdress").focus();
		return;
	}
	if(port==""){
		this.zimlet.alert_critical_msg("connector_configuration_port");
		document.getElementById("com_zimbra_erp_mail_connector_port").focus();
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_port").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_port");
		document.getElementById("com_zimbra_erp_mail_connector_port").focus();
		return;
	}
	if(database=="select any database"){
		this.zimlet.alert_critical_msg("connector_configuration_selectdatabase");
		return;
	}
	if(username==""){
		this.zimlet.alert_critical_msg("connector_configuration_username");
		document.getElementById("com_zimbra_erp_mail_connector_username").focus();
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_username").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_username");
		document.getElementById("com_zimbra_erp_mail_connector_username").focus();
		return;
	}
	if(z_password==""){
		this.zimlet.alert_critical_msg("connector_configuration_password");
		document.getElementById("com_zimbra_erp_mail_connector_userpassword").focus();
		return;
	}
	var proto="http://";
	var pro=url.match("^https");
	if(pro != null && pro == "https"){
		proto="https://"
		url=url.substring(8);
	}else if(url.match("^http") == "http"){
		proto="http://"
		url=url.substring(7);
	}
	var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Authentication.jsp?urladdress="+(proto+url)+"&port="+port+"&database="+this.zimlet.trim(database)+"&username="+this.zimlet.trim(username)+"&userpassword="+z_password+"&temp=tt";
	var response = AjxRpc.invoke(null,jspurl, null, null, true);
	if(this.zimlet.trim(response.text) == 'false'){
		this.zimlet.alert_critical_msg("connector_configuration_userandpassword");
	}else{
		this.zimlet.alert_info_msg("connector_configuration_lbl_conection_saved");
		var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/readConfig.jsp";
		var response = AjxRpc.invoke(null,jspurl, null, null, true);
		var allConfigurations = JSON.parse(response.text);
		erpConnector.urladdress = allConfigurations.urladdress;
		erpConnector.port = allConfigurations.port;
		erpConnector.getdatabase = allConfigurations.getdatabase;
		var changeVersion = false;
		if(erpConnector.server_version!=allConfigurations.server_version) {
			changeVersion = true;
		}
		erpConnector.server_version = allConfigurations.server_version;
		this.flag=1;
		if(allConfigurations.server_version == "6") {
			erpConnector.ERPVersion6 = true;
		} else {
			erpConnector.ERPVersion6 = false;
		}
		if(erpConnector.ERPVersion6) {
			docList=this.zimlet.getUserProperty("doc_list");
			if(docList.length<=0 || changeVersion==true){
				var doclist="{\"records\":[{\"id\":\"1\",\"title\":\"Partner\",\"docname\":\"res.partner\"},{\"id\":\"2\",\"title\":\"Address\",\"docname\":\"res.partner.address\"},{\"id\":\"3\",\"title\":\"Lead\",\"docname\":\"crm.lead\"}]}";
				this.zimlet.setUserProperty("doc_list",this.zimlet.trim(doclist));
				this.zimlet.saveUserProperties();
				com_zimbra_erp_mail_connector_DocSettings_this = this;
				com_zimbra_erp_mail_connector_DocSettings.prototype.getTableRecords();
			}
		} else {
			docList=this.zimlet.getUserProperty("doc_list");
			if(docList.length<=0 || changeVersion==true){
				var doclist="{\"records\":[{\"id\":\"1\",\"title\":\"Partner\",\"docname\":\"res.partner\"},{\"id\":\"3\",\"title\":\"Lead\",\"docname\":\"crm.lead\"}]}";
				this.zimlet.setUserProperty("doc_list",this.zimlet.trim(doclist));
				this.zimlet.saveUserProperties();
				com_zimbra_erp_mail_connector_DocSettings_this = this;
				com_zimbra_erp_mail_connector_DocSettings.prototype.getTableRecords();
			}
		}
	}
}
