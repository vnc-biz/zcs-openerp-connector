calsync=function(zimlet) {

        this.zimlet=zimlet;
        var zmlt=this.zimlet;
	var proto="http://";
        var dbname=zmlt.getUserProperty("getdatabase");
    	var password=zmlt.getUserProperty("userpassword");
    	var urladdress=zmlt.getUserProperty("urladdress");
    	var port=zmlt.getUserProperty("port");
	var erp_calurl=zmlt.getUserProperty("cal_url");
        var proto="http://";
        var z_calurl=appCtxt.getFolderTree().getByName("open_ERP").getRestUrl();
	z_calurl=z_calurl+"?fmt=ics"
	alert(z_calurl);
	alert(flag);
	if(erp_calurl==""){
		alert("Please enter proper URL to ERP configuration window by clicking on open ERP connector");
		return;
	}	
	else{


	url="/service/zimlet/com_zimbra_erp_mail_connector/CalAuthntication.jsp?z_calurl="+z_calurl+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&erp_calurl="+erp_calurl;
        var response = AjxRpc.invoke(null,url, null, null, true);
	alert("from calsync.js"+response.text);
	}

}


