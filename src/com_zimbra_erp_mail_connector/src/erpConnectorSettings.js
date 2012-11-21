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

erpConnectorSettings.prototype = new DwtTabViewPage;

erpConnectorSettings.prototype.constructor = erpConnectorSettings;
var zm;
function erpConnectorSettings(parent, zimlet,confi_btn_database){
	this.flag = 0;
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	zm=this.zimlet;
	config_btn_database=confi_btn_database;
	this._createHTML();
	document.getElementById("erpConnector_urladdress").value=erpConnector.urladdress;
	if(erpConnector.getdatabase=="" || erpConnector.getdatabase ==null || erpConnector.getdatabase == undefined){
		document.getElementById("erpConnector_getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	}else{
		document.getElementById("erpConnector_getdatabase").innerHTML="<option value="+erpConnector.getdatabase+">"+erpConnector.getdatabase+"</option>";
	}
	document.getElementById("erpConnector_port").value = erpConnector.port;
	document.getElementById("erpConnector_username").value = "";
	this.setScrollStyle(Dwt.SCROLL);
}

erpConnectorSettings.prototype.clearConfig = function() {
	document.getElementById("erpConnector_getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	document.getElementById("erpConnector_port").value="";
	document.getElementById("erpConnector_username").value="";
	document.getElementById("erpConnector_userpassword").value="";
	document.getElementById("erpConnector_urladdress").value="";
}

erpConnectorSettings.prototype._createHTML = function() {
	var get_db = new DwtButton({parent:appCtxt.getShell()});
	get_db.setText(config_btn_database);
	get_db.setImage("getDB");
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

erpConnectorSettings.showpass = function(){
	if(document.getElementById("passchk").checked){
		document.getElementById("erpConnector_userpassword").type='text';
	}else{
		document.getElementById("erpConnector_userpassword").type='password';
	}
}

/*Gives the Database List*/
erpConnectorSettings.prototype._getDatabase = function(){
	var urladdress=document.getElementById("erpConnector_urladdress").value;
	var port=document.getElementById("erpConnector_port").value;
	port=this.zimlet.trim(port);
	urladdress=this.zimlet.trim(urladdress);
	if(urladdress==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_urladdress").focus();
		return;
	}
	if(urladdress==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_urladdress").focus();
		return;
	}
	if(document.getElementById("erpConnector_urladdress").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_urladdress").focus();
		return;
	}
	if(port==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_port").focus();
		return;
	}
	if(document.getElementById("erpConnector_port").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_port").focus();
		return;
	}
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
		var select= document.getElementById('erpConnector_getdatabase');
		if(res.length<=0){
			var a = appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_lbl_database_notfound"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
			document.getElementById("erpConnector_getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
		}else{
			document.getElementById("erpConnector_getdatabase").innerHTML="";
			var dbname=res.substr(1,res.length-2).split(",");
			for(i=0;i<dbname.length;i++){
				select.options[select.options.length]= new Option(dbname[i], dbname[i]);
			}
		}
	}
	else{
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("time_out"),DwtMessageDialog.WARNING_STYLE,zm.getMessage("warning"));
		a.popup();
		document.getElementById("erpConnector_getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	}
}

erpConnectorSettings.prototype.checkConnection = function(){
	this.flag=0;
	var url=document.getElementById("erpConnector_urladdress").value;
	var database=document.getElementById("erpConnector_getdatabase").value;
	var port=document.getElementById("erpConnector_port").value;
	var username=document.getElementById("erpConnector_username").value;
	var z_password=document.getElementById("erpConnector_userpassword").value;
	port=this.zimlet.trim(port);
	username=this.zimlet.trim(username);
	url=this.zimlet.trim(url);
	if(url==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_urladdress").focus();
		return;
	}
	if(document.getElementById("erpConnector_urladdress").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_urladdress").focus();
		return;
	}
	if(port==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_port").focus();
		return;
	}
	if(document.getElementById("erpConnector_port").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_port").focus();
		return;
	}
	if(database=="select any database"){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_selectdatabase"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("warning"));
		a.popup();
		return;
	}
	if(username==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_username"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_username").focus();
		return;
	}
	if(document.getElementById("erpConnector_username").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_username"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_username").focus();
		return;
	}
	if(z_password==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_password"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("erpConnector_userpassword").focus();
		return;
	}
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
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_userandpassword"),DwtMessageDialog.WARNING_STYLE,zm.getMessage("error"));
		a.popup();
	}else{
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_lbl_conection_saved"),DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
		a.popup();
		var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/readConfig.jsp";
		var response = AjxRpc.invoke(null,jspurl, null, null, true);
		var allConfigurations = JSON.parse(response.text);
		erpConnector.urladdress = allConfigurations.urladdress;
		erpConnector.port = allConfigurations.port;
		erpConnector.getdatabase = allConfigurations.getdatabase;
		this.flag=1;
	}
}
