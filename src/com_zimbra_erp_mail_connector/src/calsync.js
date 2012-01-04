var zmlt;
calsync=function(zimlet) {

        this.zimlet=zimlet;
        zmlt=this.zimlet;
	var proto="http://";
        var dbname=zmlt.getUserProperty("getdatabase");
    	var password=zmlt.getUserProperty("userpassword");
    	var urladdress=zmlt.getUserProperty("urladdress");
    	var port=zmlt.getUserProperty("port");
	var erp_calurl=zmlt.getUserProperty("cal_url");
        var proto="http://";
        var z_calurl=appCtxt.getFolderTree().getByName("open_ERP").getRestUrl();
	z_calurl=z_calurl+"?fmt=ics"
	
	if(erp_calurl==""){
		var a =  appCtxt.getMsgDialog();
        	a.setMessage(zmlt.getMessage("blank_erpurl"),DwtMessageDialog.CRITICAL_STYLE,"Message");
        	a.popup();
		return;
	}	
	else{


	url="/service/zimlet/com_zimbra_erp_mail_connector/CalAuthntication.jsp?z_calurl="+z_calurl+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&erp_calurl="+erp_calurl;
        
	var callback = new AjxCallback(this,_rpcCallback)
	AjxRpc.invoke(null,url, null, callback, true);
/*...................Waiting..............................*/
	this.pView = new DwtComposite(zmlt.getShell()); 
	this.pView.setSize("50", "50"); 
	this.pView.getHtmlElement().innerHTML = _createDialogView(); 
	
	this.pbDialog = new ZmDialog({view:this.pView, parent:zmlt.getShell(),standardButtons:[DwtDialog.NO_BUTTONS]});
	this.pbDialog.popup(); //show the dialog	

/*................Waiting Ends here............................*/
	}

}



_createDialogView =
	function() {
		var html = new Array();
		var i = 0;
		html[i++]="<div id='wait' align='center'><img src='"+zmlt.getResource("resources/submit_please_wait.gif")+"'/></div>";
		return html.join("");
	};

_rpcCallback =
function(response) {
	this.pbDialog.popdown();
	var a =  appCtxt.getMsgDialog(); 
	a.setMessage(zmlt.getMessage("cal_sync_complete"),DwtMessageDialog.INFO_STYLE,"Message"); 
	a.popup();	
    
}


