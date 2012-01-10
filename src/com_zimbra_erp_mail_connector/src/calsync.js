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
	var uname=appCtxt.getUsername();
	var erp_uname=zmlt.getUserProperty("username");
       // var z_calurl=appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName("open_ERP").getRestUrl();
	//z_calurl=z_calurl+"?fmt=ics"
	//alert("complete URL"+z_calurl);

	if(erp_calurl==""){
		var a =  appCtxt.getMsgDialog();
        	a.setMessage(zmlt.getMessage("blank_erpurl"),DwtMessageDialog.CRITICAL_STYLE,"Message");
        	a.popup();
		return;
	}	
	else{





	url="/service/zimlet/com_zimbra_erp_mail_connector/CalAuthntication.jsp?urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&erp_calurl="+erp_calurl+"&uname="+uname+"&erp_uname="+erp_uname+"&erp_passwd="+password;
        
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
		html[i++]="<div id='wait' align='center'><img align='bottom' src='"+zmlt.getResource("resources/submit_please_wait.gif")+"'/></div>";
		return html.join("");
	};

_rpcCallback =
function(response) {
	this.pbDialog.popdown();
	if(response.text=="success"){
	
		var a =  appCtxt.getMsgDialog(); 
		a.setMessage(zmlt.getMessage("cal_sync_complete"),DwtMessageDialog.INFO_STYLE,zmlt.getMessage("msg")); 
		a.popup();	
    	}
	else{
		
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zmlt.getMessage("cal_sync_error"),DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
                a.popup();
	}

                
               


	var folderId=appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName("open_ERP").id;
	var soapDoc = AjxSoapDoc.create("FolderActionRequest", "urn:zimbraMail");
        var actionNode = soapDoc.set("action");
        actionNode.setAttribute("op","check");
        actionNode.setAttribute("id",folderId);
	var callback = new AjxCallback(this,_callback);
        var params = {
                soapDoc: soapDoc,
                asyncMode: true,
                callback: callback
        };
        appCtxt.getAppController().sendRequest(params);
}


_callback=function(response){

		appCtxt.getApp(ZmApp.CALENDAR).refresh();
		
}

/*................*/

/*_handleCreateFolderResponse =function(dataSource, result) {
        var resp = result && result._data && result._data.CreateFolderResponse;
        if (resp) {
                dataSource.folderId = ZmOrganizer.normalizeId(resp.folder[0].id);
                alert("Inside if"+dataSource.folderId);
        }
        else {
                alert("else part");
                // HACK: Don't know a better way to set an error condition
               // this.__hack_preSaveSuccess = false;
        }
};*/
        

