contactsync=function(zimlet) {

	this.zimlet=zimlet;
	var zmlt=this.zimlet;
	var dbname=zmlt.getUserProperty("getdatabase");
    var password=zmlt.getUserProperty("userpassword");
    var urladdress=zmlt.getUserProperty("urladdress");
    var port=zmlt.getUserProperty("port");
	var proto="http://";
	var urladd=appCtxt.getFolderTree().getByName("openERP").getRestUrl();		
	
	 var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Contactsync.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&urladd="+urladd+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim();
	         var response = AjxRpc.invoke(null,jspurl, null, null, true);
		if(response.text=="success"){
        		var vnc = new VncContactSync();
			var abc=vnc.getContacts(0,[]);
			alert("Contacts are synchronized successfully");
		
		}else{
			alert(zmlt.getMessage("chk_connection"));
		}
		
	
}


