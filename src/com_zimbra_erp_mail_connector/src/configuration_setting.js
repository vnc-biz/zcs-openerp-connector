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
	document.getElementById("urladdress").value=zm.getUserProperty("urladdress");
	if(zm.getUserProperty("getdatabase")==""){
		document.getElementById("getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	}else{
		document.getElementById("getdatabase").innerHTML="<option value="+zm.getUserProperty("getdatabase")+">"+zm.getUserProperty("getdatabase")+"</option>";
	}
	document.getElementById("port").value=zm.getUserProperty("port");
	document.getElementById("username").value=zm.getUserProperty("username");
	document.getElementById("userpassword").value=zm.getUserProperty("userpassword");
	this.setScrollStyle(Dwt.SCROLL);
}

configuration_setting.prototype.clearConfig = function() {

	document.getElementById("getdatabase").innerHTML=""+"<option>"+zm.getMessage("select_any_database")+"</option>";
	document.getElementById("port").value="";
	document.getElementById("username").value="";
	document.getElementById("userpassword").value="";
	document.getElementById("urladdress").value="";
	var a =  appCtxt.getMsgDialog();
        a.setMessage(zm.getMessage("configuration_cleared"),DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
        a.popup();
}

configuration_setting.prototype._createHTML = function() {
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
		html[i++]="<td>";
		html[i++]="<button onClick='getDatabase()' style='padding-left:0px;'><img src='/service/zimlet/com_zimbra_erp_mail_connector/resources/get_database.png' align='absmiddle' style='height:16px;'/><font style='margin-left:4px;'>"+config_btn_database+"</font></button>";
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
			html[i++]="<button onClick='checkConnection()' id='connect' style='margin-left:210px'><img src='/service/zimlet/com_zimbra_erp_mail_connector/resources/connect.png' align='absmiddle' style='height:16px;'/><font style='margin-left:4px;'>"+this.zimlet.getMessage("connector_configuration_lbl_connect")+"</font></button>";
		}else{
			html[i++]="<button onClick='checkConnection()' id='connect' class='config_btn1'><img src='/service/zimlet/com_zimbra_erp_mail_connector/resources/connect.png' align='absmiddle' style='height:16px;'/><font style='margin-left:4px;'>"+this.zimlet.getMessage("connector_configuration_lbl_connect")+"</font></button>";
		
		}
		html[i++]="</td></tr></table></fieldset>";
		this.getHtmlElement().innerHTML = html.join("");
};

function showpass(){
	if(document.getElementById("passchk").checked){
		document.getElementById("userpassword").type='text'	;
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
		var a =  appCtxt.getMsgDialog();
 		a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
 		a.popup();
		document.getElementById("urladdress").focus();
		return;
	  }
	if(urladdress==""){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(document.getElementById("urladdress").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("urladdress").focus();
		return;		
	  }
	if(port==""){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("port").focus();
		return;
	}	  
	if(document.getElementById("port").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
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
			var a =  appCtxt.getMsgDialog();
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
		var a =  appCtxt.getMsgDialog();
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
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(document.getElementById("urladdress").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_urlblank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("urladdress").focus();
		return;
	}
	if(port==""){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("port").focus();
		return;
	}	  
	if(document.getElementById("port").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_port"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("port").focus();
		return;		
	}
	if(database=="select any database"){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_selectdatabase"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("warning"));
			a.popup();
		return;
	}
	if(username==""){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_username"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("username").focus();
		return;
	}
	if(document.getElementById("username").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_username"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
			a.popup();
		document.getElementById("username").focus();
		return;
	}
	if(z_password==""){
		var a =  appCtxt.getMsgDialog();
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
	var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Authentication.jsp?urladdress="+(proto+url)+"&port="+port+"&database="+database+"&username="+username+"&userpassword="+z_password+"&temp=tt";	
	var response = AjxRpc.invoke(null,jspurl, null, null, true);
	if(response.text.trim() == 'false'){
		zm.setUserProperty("urladdress",null);
		zm.setUserProperty("getdatabase",null);
		zm.setUserProperty("port",null);
		zm.setUserProperty("username",null);
		zm.setUserProperty("userpassword",null);
		zm.saveUserProperties();
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zm.getMessage("connector_configuration_userandpassword"),DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
			a.popup();
	}else{
		zm.setUserProperty("openerp_id",response.text);
		zm.saveUserProperties();
		var openerp_id=zm.getUserProperty("openerp_id");
		var jspurl1="/service/zimlet/com_zimbra_erp_mail_connector/Documentvarify.jsp?dbname="+database.trim()+"&password="+z_password+"&obj_name=zimbra.partner&urladdress="+(proto+url.trim())+"&port="+port.trim()+"&openerp_id="+openerp_id.trim();
		var res = AjxRpc.invoke(null,jspurl1, null, null, true);
		if(res.text.trim()=="Fail"){
			var a =  appCtxt.getMsgDialog();
				a.setMessage(zm.getMessage("module_not_installed"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
				a.popup();
			return;
		}
	zm.setUserProperty("urladdress",url);
	zm.setUserProperty("getdatabase",database);
	zm.setUserProperty("port",port);
	zm.setUserProperty("username",username);
	zm.setUserProperty("userpassword",z_password);
	zm.setUserProperty("proto",proto);
	zm.saveUserProperties();
	var a =  appCtxt.getMsgDialog();
		a.setMessage(zm.getMessage("connector_configuration_lbl_conection_saved"),DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
		a.popup();
		flag=1;
	}
}
