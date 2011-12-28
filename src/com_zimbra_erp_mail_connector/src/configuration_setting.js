configuration_setting.prototype = new DwtTabViewPage;
configuration_setting.prototype.constructor = configuration_setting;

	var config_lbl_url;
	var config_btn_database;
	var config_lbl_database;
	var config_lbl_username;
	var config_lbl_password;
	var zm;
	var proto="http://";

	

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
	
	
	this.setScrollStyle(Dwt.SCROLL);
}
configuration_setting.prototype._createHTML = function() {
	var i = 0;

	var html = new Array();

		html[i++]="<fieldset>";
		html[i++]="<legend>";
		html[i++]=this.zimlet.getMessage("connector_configuration_fieldset");
		html[i++]="</legend>";
		html[i++]="<table style='padding-left:76px;'>";
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
		html[i++]="<button onClick='getDatabase()'>"+config_btn_database+"</button>";
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
		html[i++]="<button onClick='checkConnection()' id='connect'>"+this.zimlet.getMessage("connector_configuration_lbl_connect")+"</button>";
		html[i++]="</td></tr></table>";

		html[i++]="</fieldset>";
	

	
	this.getHtmlElement().innerHTML = html.join("");

};


/*Gives the Database List*/

function getDatabase(){

		
	var urladdress=document.getElementById("urladdress").value;
	var port=document.getElementById("port").value;

	if(urladdress==""){
		alert(zm.getMessage("connector_configuration_urlblank"));
		document.getElementById("urladdress").focus();
		return;
			
	  }
	if(urladdress==""){
		alert(zm.getMessage("connector_configuration_urlblank"));
		document.getElementById("urladdress").focus();
		return;
			
	  }
	  if(document.getElementById("urladdress").value.match(/^\s*$/)){
		alert(zm.getMessage("connector_configuration_urlblank"));
		document.getElementById("urladdress").focus();
		return;		
	  }
	   if(port==""){
		alert(zm.getMessage("connector_configuration_port"));
		document.getElementById("port").focus();
		return;
		
	  }	  
	  if(document.getElementById("port").value.match(/^\s*$/)){
		alert(zm.getMessage("connector_configuration_port"));
		document.getElementById("port").focus();
		return;
		
	  }	  
	  
	 var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/GetDatabaseRpc.jsp?urladdress="+(proto+urladdress)+"&port="+port;	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);


	  if (response.success == true && response.text.trim()!="fail") {

			var res=response.text.trim();
			var select= document.getElementById('getdatabase');
						
			if(res.length<=0){

				alert(zm.getMessage("connector_configuration_lbl_database_notfound"));
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
		alert(zm.getMessage("time_out"));
	}	
	


}


function checkConnection(){


	var url=document.getElementById("urladdress").value;
	var database=document.getElementById("getdatabase").value;
	var port=document.getElementById("port").value;
	var username=document.getElementById("username").value;
	var userpassword=document.getElementById("userpassword").value;
	
	
	  if(url==""){
		alert(zm.getMessage("connector_configuration_urlblank"));
		document.getElementById("urladdress").focus();
		return;
			
	  }
	  if(document.getElementById("urladdress").value.match(/^\s*$/)){
		alert(zm.getMessage("connector_configuration_urlblank"));
		document.getElementById("urladdress").focus();
		return;
		
	  }
	  if(port==""){
		alert(zm.getMessage("connector_configuration_port"));
		document.getElementById("port").focus();
		return;
		
	  }	  
	  if(document.getElementById("port").value.match(/^\s*$/)){
		alert(zm.getMessage("connector_configuration_port"));
		document.getElementById("port").focus();
		return;		
	  }
	  if(database=="select any database"){
		alert(zm.getMessage("connector_configuration_selectdatabase"));
		return;
	  }
	  if(username==""){
		alert(zm.getMessage("connector_configuration_username"));
		document.getElementById("username").focus();
		return;
		
	  }
	  if(document.getElementById("username").value.match(/^\s*$/)){
		alert(zm.getMessage("connector_configuration_username"));
		document.getElementById("username").focus();
		return;
		
	  }
	  if(userpassword==""){
		alert(zm.getMessage("connector_configuration_password"));
		document.getElementById("userpassword").focus();
		return;
		
	  }
	  var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Authentication.jsp?urladdress="+(proto+url)+"&port="+port+"&database="+database+"&username="+username+"&userpassword="+userpassword;	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);

	 
	  if (response.success == true) {

			
		if(response.text.trim()=="true"){
			alert(zm.getMessage("connector_configuration_lbl_conection_saved"));
			zm.setUserProperty("urladdress",url);
			zm.setUserProperty("getdatabase",database);
			zm.setUserProperty("port",port);
			zm.setUserProperty("username",username);
			zm.setUserProperty("userpassword",userpassword);
			zm.saveUserProperties();
			

			
			
		}else{
			zm.setUserProperty("urladdress",null);
			zm.setUserProperty("getdatabase",null);
			zm.setUserProperty("port",null);
			zm.setUserProperty("username",null);
			zm.setUserProperty("userpassword",null);
			zm.saveUserProperties();
			alert(zm.getMessage("connector_configuration_userandpassword"));
		}
			

	  }
		



}

