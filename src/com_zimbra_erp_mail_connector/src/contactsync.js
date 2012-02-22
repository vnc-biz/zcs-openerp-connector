var zmlt;
var addressBook;
contactsync=function(zimlet,addBook) {

	this.zimlet=zimlet;
	zmlt=this.zimlet;
	addressBook=addBook;
	var dbname=zmlt.getUserProperty("getdatabase");
    var password=zmlt.getUserProperty("userpassword");
    var urladdress=zmlt.getUserProperty("urladdress");
    var openerp_id=zmlt.getUserProperty("openerp_id");
    var port=zmlt.getUserProperty("port");
	var proto="http://";
	//var urladd=appCtxt.getFolderTree().getByName("OpenERP").getRestUrl();		
	
	if(dbname=="" || password=="" || urladdress=="" || port=="" ){
                var a =  appCtxt.getMsgDialog();
                a.setMessage(zmlt.getMessage("no_database_configured"),DwtMessageDialog.WARNING_STYLE,zmlt.getMessage("warning"));
                a.popup();

                return;
        }	


	var acc_name=appCtxt.getUsername();	
	 var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Contactsync.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&acc_name="+acc_name+"&openerp_id="+openerp_id+"&addressBook="+addressBook;

		var callback = new AjxCallback(this,_rpcCallback1)
	        AjxRpc.invoke(null,jspurl, null,callback, true);
		this.pView = new DwtComposite(zmlt.getShell());
        	this.pView.setSize("50", "50");
        	this.pView.getHtmlElement().innerHTML = _createDialogView();

        	this.pbDialog = new ZmDialog({view:this.pView, parent:zmlt.getShell(),standardButtons:[DwtDialog.NO_BUTTONS]});
        	this.pbDialog.popup(); //show the dialog
		
	
}

_createDialogView =
        function() {
                var html = new Array();
                var i = 0;
                html[i++]="<div id='wait' align='center'><img align='bottom' src='"+zmlt.getResource("resources/submit_please_wait.gif")+"'/></div>";
                return html.join("");
        };

_rpcCallback1 =
function(response) {
        this.pbDialog.popdown();
        if(response.text=="success"){
			
                var a =  appCtxt.getMsgDialog();
                a.setMessage(zmlt.getMessage("contact_sync_success"),DwtMessageDialog.INFO_STYLE,zmlt.getMessage("msg"));
                a.popup();

		var vnc = new VncContactSync();
		var abc = vnc.getContacts(0,[],addressBook);
		
        }
        else{

                var a =  appCtxt.getMsgDialog();
                a.setMessage(zmlt.getMessage("chk_connection"),DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
                a.popup();
        }
}



