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

var zmlt;
var addressBook;
var addressBookPath;
contactsync=function(zimlet,addBook,addBookPath) {
	this.zimlet=zimlet;
	zmlt=this.zimlet;
	addressBook=addBook;
	addressBookPath=addBookPath;
	var dbname=zmlt.getUserProperty("getdatabase");
    	var password=zmlt.getUserProperty("userpassword");
    	var urladdress=zmlt.getUserProperty("urladdress");
    	var openerp_id=zmlt.getUserProperty("openerp_id");
    	var port=zmlt.getUserProperty("port");
	var proto=zmlt.getUserProperty("proto");
	var acc_name=appCtxt.getUsername();	
	addressBook=AjxStringUtil.urlComponentEncode(addressBook);
	addressBookPath=AjxStringUtil.urlComponentEncode(addressBookPath);
	var zimbraProtocol="http:";
	zimbraProtocol=location.protocol;
	domainName=appCtxt.getUserDomain();
	z_portNumber="80";
	if(zimbraProtocol== "http:"){
		z_portNumber=appCtxt.get(ZmSetting.HTTP_PORT);
	}else if(zimbraProtocol == "https:"){
		z_portNumber=appCtxt.get(ZmSetting.HTTPS_PORT);
	}
	addressBook=AjxStringUtil.urlComponentDecode(addressBook);
	var rest=appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName(addressBook).getRestUrl();
	if(dbname=="" || password=="" || urladdress=="" || port=="" ){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zmlt.getMessage("no_database_configured"),DwtMessageDialog.WARNING_STYLE,zmlt.getMessage("warning"));
			a.popup();
			return;
	}	
	var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Contactsync.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&acc_name="+acc_name+"&openerp_id="+openerp_id+"&addressBook="+addressBookPath+"&rest="+rest+"&zimbraProtocol="+zimbraProtocol+"&z_portNumber="+z_portNumber+"&domainName="+domainName;
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
		addressBookPath=AjxStringUtil.urlComponentDecode(addressBookPath);
		addressBookPath=AjxStringUtil.htmlDecode(addressBookPath,true)
		var abc = vnc.getContacts(0,[],addressBookPath);
	}
	else{
		var a =  appCtxt.getMsgDialog();
			a.setMessage(zmlt.getMessage("chk_connection"),DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
			a.popup();
	}
}
