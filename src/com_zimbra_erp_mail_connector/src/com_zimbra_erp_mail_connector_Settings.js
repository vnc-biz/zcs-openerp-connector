/*##############################################################################
#    VNC - Virtual Network Consult AG 
#    Copyright (C) 2014-TODAY VNC - Virtual Network Consult AG 
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

function com_zimbra_erp_mail_connector_Settings(parent, zimlet,confi_btn_database,oe_canvas){
	this.flag = 0;
	DwtTabViewPage.call(this,parent);
	this.oe_canvas = oe_canvas;
	this.zimlet = com_zimbra_erp_mail_connector_Settings.zimlet = zimlet;
	config_btn_database=confi_btn_database;
	this._createHTML(oe_canvas);
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

com_zimbra_erp_mail_connector_Settings.prototype._createHTML = function(dlgObj) {
	var get_db = new DwtButton({parent:appCtxt.getShell(),id:"tete"});
	get_db.setText(config_btn_database);
	get_db.setImage("com_zimbra_erp_mail_connector_getDB");
	dlgObj._tabGroup.addMember(get_db,2);
	dlgObj.associateEnterWithButton("tete");
	get_db.addSelectionListener(new AjxListener(this,this._getDatabase));

	var connectBtn = new DwtButton({parent:dlgObj,id:"connectButton"});
	connectBtn.setText(this.zimlet.getMessage("connector_configuration_lbl_connect"));
	connectBtn.setImage("connect");
	connectBtn.addSelectionListener(new AjxListener(this,this.checkConnection));
	dlgObj._tabGroup.addMember(connectBtn,7);
	var i = 0;
	var html = new Array();
	var data={"zimlet":this.zimlet,random:Dwt.getNextId()};
	this.getHtmlElement().innerHTML = AjxTemplate.expand("com_zimbra_erp_mail_connector.templates.config#config_Settings",data);
	document.getElementById("getDatabase").appendChild(get_db.getHtmlElement());
	document.getElementById("connect_database").appendChild(connectBtn.getHtmlElement());
    document.getElementById("com_zimbra_erp_mail_connector_userpassword").onkeyup=function(e){
        if (typeof e == 'undefined' && window.event) { e = window.event; }
        if (e.keyCode == 13){
            document.getElementById("com_zimbra_erp_mail_connector_userpassword").blur();
            erpConnector.zimlet.configuration_setting.checkConnection();
        }
    }
	this.connectBtn = connectBtn;
	this.get_db = get_db;
};

com_zimbra_erp_mail_connector_Settings.showpass = function(){
	if(document.getElementById("passchk").checked){
		document.getElementById("com_zimbra_erp_mail_connector_userpassword").type='text';
	}else{
		document.getElementById("com_zimbra_erp_mail_connector_userpassword").type='password';
	}
}

com_zimbra_erp_mail_connector_Settings.prototype._tempListener = function(dlg){
	dlg.popdown();
	document.getElementById("com_zimbra_erp_mail_connector_urladdress").focus();
}

/*Gives the Database List*/
com_zimbra_erp_mail_connector_Settings.prototype._getDatabase = function(){
	var urladdress=document.getElementById("com_zimbra_erp_mail_connector_urladdress").value;
	var port=document.getElementById("com_zimbra_erp_mail_connector_port").value;
	port=this.zimlet.trim(port);
	urladdress=this.zimlet.trim(urladdress);
	if(this.zimlet.isBlank(urladdress)){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank","com_zimbra_erp_mail_connector_urladdress");
		return;
	}

	if(document.getElementById("com_zimbra_erp_mail_connector_urladdress").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank","com_zimbra_erp_mail_connector_urladdress");
		return;
	}
	if(this.zimlet.isBlank(port)){
		this.zimlet.alert_critical_msg("connector_configuration_port","com_zimbra_erp_mail_connector_port");
		return;
	}
	if(/\D/.test(port)){
		this.zimlet.alert_critical_msg("connector_configuration_port_invalid","com_zimbra_erp_mail_connector_port");
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_port").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_port","com_zimbra_erp_mail_connector_port");
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
		this.zimlet.alert_critical_msg("host_error");
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
	if(this.zimlet.isBlank(url)){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank","com_zimbra_erp_mail_connector_urladdress");
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_urladdress").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_urlblank","com_zimbra_erp_mail_connector_urladdress");
		return;
	}
	if(this.zimlet.isBlank(port)){
		this.zimlet.alert_critical_msg("connector_configuration_port","com_zimbra_erp_mail_connector_port");
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_port").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_port","com_zimbra_erp_mail_connector_port");
		return;
	}
	if(database=="select any database"){
		this.zimlet.alert_critical_msg("connector_configuration_selectdatabase","com_zimbra_erp_mail_connector_getdatabase");
		return;
	}
	if(this.zimlet.isBlank(username)){
		this.zimlet.alert_critical_msg("connector_configuration_username","com_zimbra_erp_mail_connector_username");
		return;
	}
	if(document.getElementById("com_zimbra_erp_mail_connector_username").value.match(/^\s*$/)){
		this.zimlet.alert_critical_msg("connector_configuration_username","com_zimbra_erp_mail_connector_username");
		return;
	}
	if(this.zimlet.isBlank(z_password)){
		this.zimlet.alert_critical_msg("connector_configuration_password","com_zimbra_erp_mail_connector_userpassword");
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
		this.zimlet.alert_critical_msg_focus("connector_configuration_userandpassword",null,"com_zimbra_erp_mail_connector_userpassword");
	}else{
		this.zimlet.alert_info_msg_focus("connector_configuration_lbl_conection_saved",null,"com_zimbra_erp_mail_connector_userpassword");
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
			changeVersion=true;
			docList=this.zimlet.getUserProperty("doc_list");
			if(changeVersion==true){
				var doclist="{\"records\":[{\"id\":\"1\",\"title\":\"Partner\",\"docname\":\"res.partner\"},{\"id\":\"3\",\"title\":\"Lead\",\"docname\":\"crm.lead\"},{\"id\":\"4\",\"title\":\"Project\",\"docname\":\"project.project\"}]}";
				this.zimlet.setUserProperty("doc_list",this.zimlet.trim(doclist));
				this.zimlet.saveUserProperties();
				com_zimbra_erp_mail_connector_DocSettings_this = this;
				com_zimbra_erp_mail_connector_DocSettings.prototype.getTableRecords();
			}
		}
	}
}

com_zimbra_erp_mail_connector_Settings.prototype.showMe = function(){
	DwtTabViewPage.prototype.showMe.call(this);
	this.oe_canvas._tabGroup.removeAllMembers();
	this.oe_canvas._baseTabGroupSize = 10;
	this.oe_canvas._tabGroup.__blockApplicationHandling=false;
	this.oe_canvas._tabGroup.__blockDefaultHandling=false;
	this.oe_canvas._tabGroup.addMember(document.getElementById("com_zimbra_erp_mail_connector_urladdress"),0);
	this.oe_canvas._tabGroup.addMember(document.getElementById("com_zimbra_erp_mail_connector_port"),1);
	this.oe_canvas._tabGroup.addMember(this.get_db,2);
	this.oe_canvas._tabGroup.addMember(document.getElementById("com_zimbra_erp_mail_connector_getdatabase"),3);
	this.oe_canvas._tabGroup.addMember(document.getElementById("com_zimbra_erp_mail_connector_username"),4);
	this.oe_canvas._tabGroup.addMember(document.getElementById("com_zimbra_erp_mail_connector_userpassword"),5);
	this.oe_canvas._tabGroup.addMember(document.getElementById("passchk"),6);
	this.oe_canvas._tabGroup.addMember(this.connectBtn,7);
	this.oe_canvas._tabGroup.addMember(this.oe_canvas.getButton(DwtDialog.OK_BUTTON),8);
	this.oe_canvas._tabGroup.addMember(this.oe_canvas.getButton(DwtDialog.CANCEL_BUTTON),9)
	document.getElementById("com_zimbra_erp_mail_connector_urladdress").focus();
};
