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
		document.getElementById("getdatabase").innerHTML=""+"<option>select any database</option>";
	}else{
	document.getElementById("getdatabase").innerHTML="<option value="+zm.getUserProperty("getdatabase")+">"+zm.getUserProperty("getdatabase")+"</option>";
	}
	document.getElementById("port").value=zm.getUserProperty("port");
	document.getElementById("username").value=zm.getUserProperty("username");
	document.getElementById("userpassword").value=zm.getUserProperty("userpassword");
	
	//zm.setUserProperty("cal_url","");	
	document.getElementById("cal_url").value=zm.getUserProperty("cal_url");	
	
	this.setScrollStyle(Dwt.SCROLL);
}
configuration_setting.prototype._createHTML = function() {
	var i = 0;

	var html = new Array();

		html[i++]="<fieldset>";
		html[i++]="<legend>";
		html[i++]=this.zimlet.getMessage("connector_configuration_fieldset");
		html[i++]="</legend>";
		html[i++]="<table style='padding-left:76px;' class='marginIE'>";
		html[i++]="<tr>";
		html[i++]="<td>";
		html[i++]=config_lbl_url;
		html[i++]="</td>";		
		html[i++]="<td>";
		html[i++]="<input type='text' id='urladdress' value=''/>";
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
			
		html[i++]="<tr>";
		html[i++]="<td>";
		html[i++]=config_lbl_username;
		html[i++]="</td>";
		html[i++]="<td>";
		html[i++]="<input type='text' id='username'/>"
		html[i++]="</td>";
		html[i++]="</tr>";

		html[i++]="<tr>";
		html[i++]="<td>";
		html[i++]=config_lbl_password;
		html[i++]="</td>";
		html[i++]="<td>";
		html[i++]="<input type='password' id='userpassword'/>"
		html[i++]="</td>";
		html[i++]="</tr>";


		html[i++]="</table>";
		html[i++]="<table><tr><td>";
		html[i++]="<button onClick='checkConnection()' id='connect' style='padding-left:0px;'><img src='/service/zimlet/com_zimbra_erp_mail_connector/resources/connect.png' align='absmiddle' style='height:16px;'/><font style='margin-left:4px;'>"+this.zimlet.getMessage("connector_configuration_lbl_connect")+"</font></button>";
		html[i++]="</td></tr></table>";

		html[i++]="</fieldset>";
	
/*----------------------------------------------------------------------*/
		 html[i++]="<fieldset>";
                html[i++]="<legend>";
                html[i++]=this.zimlet.getMessage("cal_sync_url");
                html[i++]="</legend>";
                html[i++]="<table style='padding-left:76px;' class='marginIE'>";
                html[i++]="<tr>";
                html[i++]="<td>";
                html[i++]="URL:";
                html[i++]="</td>";
                html[i++]="<td>";
                html[i++]="<input type='text' style='width:250%;' id='cal_url' value=''/>";
                html[i++]="</td>";
                html[i++]="</tr>";


                html[i++]="</table>";
		html[i++]="<table><tr><td>";
                html[i++]="<button onClick='save_cal_url()' id='connect' style='padding-left:0px;'><img src='/service/zimlet/com_zimbra_erp_mail_connector/resources/save_and_validate.png' align='absmiddle' style='height:16px;'/><font style='margin-left:4px;'>"+this.zimlet.getMessage("connector_configuration_lbl_calurl_save")+"</font></button>";
                html[i++]="</td></tr></table>";

                html[i++]="</fieldset>";

		

	
	this.getHtmlElement().innerHTML = html.join("");

};


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
	  
	 var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/GetDatabaseRpc.jsp?urladdress="+(proto+urladdress)+"&port="+port;	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);


	  if (response.success == true && response.text.trim()!="fail") {

			var res=response.text.trim();
			var select= document.getElementById('getdatabase');
						
			if(res.length<=0){

				var a =  appCtxt.getMsgDialog();
                		a.setMessage(zm.getMessage("connector_configuration_lbl_database_notfound"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                		a.popup();
				document.getElementById("getdatabase").innerHTML=""+"<option>select any database</option>";


			}else{
				document.getElementById("getdatabase").innerHTML=""+"<option>select any database</option>";
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
		document.getElementById("getdatabase").innerHTML=""+"<option>select any database</option>";
	}	
	
}




function checkConnection(){

	flag=0;
	var url=document.getElementById("urladdress").value;
	var database=document.getElementById("getdatabase").value;
	var port=document.getElementById("port").value;
	var username=document.getElementById("username").value;
	var userpassword=document.getElementById("userpassword").value;
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
	  if(userpassword==""){
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("connector_configuration_password"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
		document.getElementById("userpassword").focus();
		return;
		
	  }
	  var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Authentication.jsp?urladdress="+(proto+url)+"&port="+port+"&database="+database+"&username="+username+"&userpassword="+userpassword;	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);

	 
	  if (response.success == true) {

			
		if(response.text.trim()=="true"){
		
			var a =  appCtxt.getMsgDialog();
                	a.setMessage(zm.getMessage("connector_configuration_lbl_conection_saved"),DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
                	a.popup();
			zm.setUserProperty("urladdress",url);
			zm.setUserProperty("getdatabase",database);
			zm.setUserProperty("port",port);
			zm.setUserProperty("username",username);
			zm.setUserProperty("userpassword",userpassword);
			zm.saveUserProperties();
			flag=1;

			
			
		}else{
			zm.setUserProperty("urladdress",null);
			zm.setUserProperty("getdatabase",null);
			zm.setUserProperty("port",null);
			zm.setUserProperty("username",null);
			zm.setUserProperty("userpassword",null);
			zm.saveUserProperties();
			var a =  appCtxt.getMsgDialog();
                        a.setMessage(zm.getMessage("connector_configuration_userandpassword"),DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
                        a.popup();
		}
			

	  }
		



}


function save_cal_url(){

		var cal_url=document.getElementById("cal_url").value;
		if(flag==0){

			var a =  appCtxt.getMsgDialog();
                	a.setMessage(zm.getMessage("chk_connection_first"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                	a.popup();
			return;
		}
		else{
		
			if(cal_url==""){
				zm.setUserProperty("cal_url","");
				return;
			}
			else{
	 
				
				//var urlregex = new RegExp("^(http:\/\/|https:\/\/|ftp:\/\/)+[]");
				var urlregex=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?(\.ics)/		
				var res=urlregex.test(cal_url);
				if(res==true){
					
					var uname=zm.getUserProperty("username");
        				var passwd=zm.getUserProperty("userpassword");
        				url="/service/zimlet/com_zimbra_erp_mail_connector/UrlAuthntication.jsp?urladdress="+cal_url+"&uname="+uname+"&passwd="+passwd;
        				var response = AjxRpc.invoke(null,url, null, null, true);
					
					if(response.text=='OK'){

						zm.setUserProperty("cal_url",cal_url);
						zm.saveUserProperties();
						var temp=zm.getUserProperty("cal_url");
						var a =  appCtxt.getMsgDialog();
                        			a.setMessage(zm.getMessage("url_saved"),DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
                        			a.popup();
							
					}else if(response.text=='null'){
					
						var a =  appCtxt.getMsgDialog();
                                                a.setMessage(zm.getMessage("invalid_url"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                                                a.popup();
					
					}
					else{
						var a =  appCtxt.getMsgDialog();
                                                a.setMessage(response.text,DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
                                                a.popup();

					}	
				
									

				}
				else{
				
					var a =  appCtxt.getMsgDialog();
                                        a.setMessage(zm.getMessage("connector_configuration_invalid"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                                         a.popup();
					return;	
				}	
							
			}
	
		}

}
