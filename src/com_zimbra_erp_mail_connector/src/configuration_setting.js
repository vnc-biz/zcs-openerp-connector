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

configuration_setting.prototype = new DwtTabViewPage;

configuration_setting.prototype.constructor = configuration_setting;
	var config_lbl_url;
	var config_btn_database;
	var config_lbl_database;
	var config_lbl_username;
	var config_lbl_password;
	var zm;
	var proto="http://";
	var flag=0;
	var pat_https="^https";
	var pat_http="^http";
	String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

function configuration_setting(parent, zimlet,confi_lbl_url,confi_btn_database,confi_lbl_database,confi_lbl_username,confi_lbl_password){
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	zm=this.zimlet;
	config_lbl_url=confi_lbl_url;
	config_btn_database=confi_btn_database;
	config_lbl_database=confi_lbl_database;
	config_lbl_username=confi_lbl_username;
	config_lbl_password=confi_lbl_password;
	this._createHTML();
	document.getElementById("urladdress").value=erpConnector.urladdress;
	if(erpConnector.getdatabase=="" || erpConnector.getdatabase ==null || erpConnector.getdatabase == undefined){
		document.getElementById("getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	}else{
		document.getElementById("getdatabase").innerHTML="<option value="+erpConnector.getdatabase+">"+erpConnector.getdatabase+"</option>";
	}
	document.getElementById("port").value = erpConnector.port;
	document.getElementById("username").value = "";
	this.setScrollStyle(Dwt.SCROLL);
}

configuration_setting.prototype.clearConfig = function() {
	document.getElementById("getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	document.getElementById("port").value="";
	document.getElementById("username").value="";
	document.getElementById("userpassword").value="";
	document.getElementById("urladdress").value="";
}

configuration_setting.prototype._createHTML = function() {
	var get_db = new DwtButton({parent:appCtxt.getShell()});
	get_db.setText(config_btn_database);
	get_db.setImage("getDB");
	get_db.addSelectionListener(new AjxListener(this,getDatabase));
	var connectBtn = new DwtButton({parent:appCtxt.getShell()});
	connectBtn.setText(this.zimlet.getMessage("connector_configuration_lbl_connect"));
	connectBtn.setImage("connect");
	connectBtn.addSelectionListener(new AjxListener(this,checkConnection));
	var i = 0;
	var html = new Array();
	html[i++]="<fieldset class='fieldHeight'>";
	html[i++]="<legend>";
	html[i++]=this.zimlet.getMessage("connector_configuration_fieldset");
	html[i++]="</legend>";
	html[i++]="<table class='marginIE'>";
	html[i++]="<tr>";
	html[i++]="<td>";
	html[i++]=config_lbl_url;
	html[i++]="</td>";
	html[i++]="<td>";
	html[i++]="<input type='text' id='urladdress' value='' class='urlWidth'/>";
	html[i++]="</td>";
	html[i++]="<td>";
	html[i++]=this.zimlet.getMessage("connector_configuration_lbl_port");
	html[i++]="</td>";
	html[i++]="<td>";
	html[i++]="<input type='text' id='port'>";
	html[i++]="</td>";
	html[i++]="<td id='getDatabase'>";
	html[i++]="</td>";
	html[i++]="</tr>";
	html[i++]="<tr>";
	html[i++]="<td>";
	html[i++]=config_lbl_database;
	html[i++]="</td>";
	html[i++]="<td>";
	html[i++]="<select id='getdatabase' style='width:145px;'></select>";
	html[i++]="</td>";
	html[i++]="</tr>";
	html[i++]="</table>";
	html[i++]="</fieldset>";
	html[i++]="<fieldset class='fieldHeight'>";
	html[i++]="<table class='marginLogin'>";
	html[i++]="<tr>";
	html[i++]="<td>";
	html[i++]=config_lbl_username;
	html[i++]="</td>";
	html[i++]="<td class='voz_text_width'>";
	html[i++]="<input type='text' id='username' class='textWidth'/>"
	html[i++]="</td>";
	html[i++]="</tr>";
	html[i++]="<tr>";
	html[i++]="<td>";
	html[i++]=config_lbl_password;
	html[i++]="</td>";
	html[i++]="<td>";
	html[i++]="<input type='password' id='userpassword' class='textWidth'/>"
	html[i++]="</td>";
	html[i++]="<td class='showpass'>";
	html[i++]="<div><div style='float:left'><input type='checkbox' id='passchk' onclick='showpass()'/></div><div class='showpassLabel'>"+this.zimlet.getMessage("show_password")+"</div></div>";
	html[i++]="</td></tr></table>";
	html[i++]="<table><tr><td>";
	if(navigator.userAgent.indexOf('Chrome')>-1){
		html[i++] = "<div id='connect_database' style = 'margin-left:210px;'></div>";
	}else{
		html[i++] = "<div id='connect_database' class = 'config_btn1'></div>";
	}
	html[i++]="</td></tr></table></fieldset>";
	this.getHtmlElement().innerHTML = html.join("");
	document.getElementById("getDatabase").appendChild(get_db.getHtmlElement());
	document.getElementById("connect_database").appendChild(connectBtn.getHtmlElement());
};

function showpass(){
	if(document.getElementById("passchk").checked){
		document.getElementById("userpassword").type='text';
	}else{
		document.getElementById("userpassword").type='password';
	}
}

/*Gives the Database List*/
function getDatabase(){
	var urladdress=document.getElementById("urladdress").value;
	var port=document.getElementById("port").value;
	port=port.trim();
	urladdress=urladdress.trim();
	if(urladdress==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(urladdress==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(document.getElementById("urladdress").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(port==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("port").focus();
		return;
	}
	if(document.getElementById("port").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("port").focus();
		return;
	}
	var pro=urladdress.match(pat_https);
	if(pro != null && pro == "https"){
		proto="https://"
		urladdress=urladdress.substring(8);
	}else if(urladdress.match(pat_http) == "http"){
		proto="http://"
		urladdress=urladdress.substring(7);
	}	
	var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/GetDatabaseRpc.jsp?urladdress="+(proto+urladdress)+"&port="+port;
	var response = AjxRpc.invoke(null,jspurl, null, null, true);
	if (response.success == true && response.text.trim()!="fail") {
		var res=response.text.trim();
		var select= document.getElementById('getdatabase');
		if(res.length<=0){
			var a = appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_lbl_database_notfound"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
			document.getElementById("getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
		}else{
			document.getElementById("getdatabase").innerHTML="";
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
		document.getElementById("getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	}
}

function checkConnection(){
	flag=0;
	var url=document.getElementById("urladdress").value;
	var database=document.getElementById("getdatabase").value;
	var port=document.getElementById("port").value;
	var username=document.getElementById("username").value;
	var z_password=document.getElementById("userpassword").value;
	port=port.trim();
	username=username.trim();
	url=url.trim();
	if(url==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(document.getElementById("urladdress").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(port==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("port").focus();
		return;
	}
	if(document.getElementById("port").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("port").focus();
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
		document.getElementById("username").focus();
		return;
	}
	if(document.getElementById("username").value.match(/^\s*$/)){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_username"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("username").focus();
		return;
	}
	if(z_password==""){
		var a = appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_password"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
		a.popup();
		document.getElementById("userpassword").focus();
		return;
	}
	var pro=url.match(pat_https);
	if(pro != null && pro == "https"){
		proto="https://"
		url=url.substring(8);
	}else if(url.match(pat_http) == "http"){
		proto="http://"
		url=url.substring(7);
	}
	var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Authentication.jsp?urladdress="+(proto+url)+"&port="+port+"&database="+database.trim()+"&username="+username.trim()+"&userpassword="+z_password+"&temp=tt";
	var response = AjxRpc.invoke(null,jspurl, null, null, true);
	if(response.text.trim() == 'false'){
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
		flag=1;
	}
}
