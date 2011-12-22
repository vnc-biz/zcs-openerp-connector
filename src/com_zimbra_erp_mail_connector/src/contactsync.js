contactsync=function(zimlet) {

	alert("caonact sync called");	
	this.zimlet=zimlet;
	var zmlt=this.zimlet;
	var dbname=zmlt.getUserProperty("getdatabase");
    var password=zmlt.getUserProperty("userpassword");
    var urladdress=zmlt.getUserProperty("urladdress");
    var port=zmlt.getUserProperty("port");
	var proto="http://";
	var uname=appCtxt.getUsername();		
	 var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Contactsync.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&urladdress="+(proto+urladdress.trim())+"&port="+port+"&uname="+uname;
	         var response = AjxRpc.invoke(null,jspurl, null, null, true);
			alert(response.text);

}


