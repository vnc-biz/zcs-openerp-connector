/*##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (<http://www.vnc.biz>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################*/
com_zimbra_erp_mail_connector_HandlerObject.getInstance = function () {
	return com_zimbra_erp_mail_connector_HandlerObject._instance;
}

var mail_from=[];
var receiver = "";
var msgFlag=0;
com_zimbra_erp_mail_connector_HandlerObject.prototype= new ZmZimletBase;
com_zimbra_erp_mail_connector_HandlerObject.BUTTON1_ID="cal_sync";
com_zimbra_erp_mail_connector_HandlerObject.BUTTON2_ID="send_and_push";
com_zimbra_erp_mail_connector_HandlerObject.BUTTON3_ID="push_to_erp";

var currentApt;
var attendeesFlag;
var zmlt;
String.prototype.ltrim=function(){return this.replace(/^\s+/,'');}

com_zimbra_erp_mail_connector_HandlerObject.prototype.initializeToolbar = function(app, toolbar, controller,view) {
	var patt="COMPOSE";
	// only add this button for the following 3 views
	if(view == "CLD" || view=="CLWW"){
		if (toolbar.getOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON1_ID)) {
			 return;
                }		
		var buttonIndex1 = -1;
        for ( var i = 0, count = toolbar.opList.length; i < count; i++) {
       		if (toolbar.opList[i] == ZmOperation.VIEW_MENU) {
            	buttonIndex1 = i + 1;
               	break;
            }
		}                
		var cal_sync_btn=this.getMessage("btn_cal_sync");
		// create params obj with button details
        var buttonArgs = {
            text :cal_sync_btn,
            tooltip : "Synchronize Calendar",
            index : buttonIndex, // position of the button
            image : "refresh" // icon
        };
		var button = toolbar.createOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON1_ID, buttonArgs);
		button.addSelectionListener(new AjxListener(this,this._handleCalSyncBtnClick, controller));
	}
	else if(view.match(patt)=="COMPOSE"){
		if (toolbar.getOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON2_ID)) {
			return;
		}
		var btnIndex = -1;
		for ( var i = 0, count = toolbar.opList.length; i < count; i++) {
			if (toolbar.opList[i] == ZmOperation.SEND) {
				btnIndex = i + 1;
				break;
			}
		}
		// create params obj with button details
		var send_and_push=this.getMessage("send_and_push");
		var send_and_push_tooltip=this.getMessage("send_and_push_tooltip");
		var buttonArgs = {
			text :send_and_push,
			tooltip :send_and_push_tooltip,
			index : btnIndex, // position of the button
			image : "NewMessage" // icon
		};
		var button = toolbar.createOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON2_ID, buttonArgs);
		button.addSelectionListener(new AjxListener(this,this._handle_push_and_save, controller));	
	}
};

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleCalSyncBtnClick = function(controller) {
	var calendars = appCtxt.getFolderTree().getByType(ZmOrganizer.CALENDAR);
    for(var i in calendars){
        if(calendars[i].url != undefined){
            calendars[i].sync();
        }
    }	
};

com_zimbra_erp_mail_connector_HandlerObject.prototype._handle_push_and_save = function(controller) {
	var currController = appCtxt.getCurrentController();
	var respCallback = new AjxCallback(this, this._handleResponsefromsend);
	currController.sendMsg("","",respCallback);
}

var msg = "";
com_zimbra_erp_mail_connector_HandlerObject.prototype._handleResponsefromsend = function(result) {
	var resp=result.getResponse();
	var ac = window.parentAppCtxt || window.appCtxt;
	var msgid=resp.m[0].id;
	var list = ac.getApp(ZmApp.MAIL).getMailListController().getList();
		msg = new ZmMailMsg(resp.m[0].id, list, true); // do not cache this temp msg
    	msg._loadFromDom(resp.m[0]);
    	msg._loaded = true; // bug fix #8868 - force load for rfc822 msgs since they may not return any content
    	msg.readReceiptRequested = false; // bug #36247 - never allow read receipt for rfc/822 message
    	msg._part = resp.m[0].part;
	var from=new AjxEmailAddress(appCtxt.getUsername(),AjxEmailAddress.FROM);
	var msgLoadCallback = new AjxCallback(this, this._msgLoaded,[result]);
	msg.load({forceLoad:true,callback:msgLoadCallback});
}

com_zimbra_erp_mail_connector_HandlerObject.prototype._msgLoaded = function(result){
	var res=result.getResponse();
		mail_from=[];
	var rec=msg.getAddress(ZmMailMsg.HDR_TO);
		if(rec.toString().indexOf("<") > -1){
			rec=rec.toString().split("<")[1];
			rec=rec.toString().split(">")[0];
		}
	mail_from.push(rec);
	msgFlag=1;
	this.doDrop(msg);
}

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleSOAPErrorResponseXML = function(result) {
	if (result.isException()) {
		var a =  appCtxt.getMsgDialog();
		a.setMessage(this.getMessage("mail_push_exception"),DwtMessageDialog.CRITICAL_STYLE,this.getMessage("error"));
		a.popup();
        var exception = result.getException();
		return;
    }
};

com_zimbra_erp_mail_connector_HandlerObject.prototype.getFolderDialog=function(){
	var title=this.getMessage("title_Contact_Dialog");
	var dialog = appCtxt.getChooseFolderDialog();
		dialog.registerCallback(DwtDialog.OK_BUTTON, new AjxCallback(this, this._handleChooseFolder));
	var params = {
		overviewId:     dialog.getOverviewId(ZmApp.CONTACTS),
		title:          title,
		treeIds:        [ZmOrganizer.ADDRBOOK],
		skipReadOnly:   true,
		skipRemote:     false,
		noRootSelect:   true,
		appName:        ZmApp.CONTACTS
	};
	params.omit = {};
	params.omit[ZmFolder.ID_TRASH] = true;
	params.omit[addBook_ContactId]=true;
	params.omit[addBook_EcontactId]=true;
	dialog.popup(params);
}

com_zimbra_erp_mail_connector_HandlerObject.prototype.onParticipantActionMenuInitialized = function(controller, menu) {
        this.onActionMenuInitialized(controller, menu);
};

com_zimbra_erp_mail_connector_HandlerObject.prototype.onActionMenuInitialized = function(controller, menu) {
        this.addMenuButton(controller, menu);
};

com_zimbra_erp_mail_connector_HandlerObject.prototype.addMenuButton = function(controller, menu) {
	var ID = com_zimbra_erp_mail_connector_HandlerObject.BUTTON3_ID;
	var btnName=this.getMessage("push_to_btn");
	var btnTooltip=this.getMessage("push_to_btn_tooltip");
	if (!menu.getMenuItem(ID)) {
		var op = {
			id : ID,
			text : btnName,
			tooltip: btnTooltip,
			image : "NewMessage"
		};
		var opDesc = ZmOperation.defineOperation(null, op);
		menu.addOp(ID, 1000);// add the button at the bottom
		menu.addSelectionListener(ID, new AjxListener(this,this._menuButtonListener, controller));
	}
};

var mailtopush="";
com_zimbra_erp_mail_connector_HandlerObject.prototype._menuButtonListener = function(controller) {
	var con=appCtxt.getCurrentController();
	mailtopush = controller.getCurrentView().getDnDSelection();
	mailtopush = (mailtopush instanceof Array) ? mailtopush : [mailtopush];
	var eml;
	for ( var i = 0; i < mailtopush.length; i++) {
		if (mailtopush[i].type === ZmId.ITEM_CONV) {
			var arry = mailtopush[i].participants.getArray();
			if(arry.length >0) {
				eml = arry[arry.length - 1].address;
			}
		} else if (mailtopush[i].type === ZmId.ITEM_MSG) {
			var obj = mailtopush[i].getAddress(AjxEmailAddress.FROM);
        	if(obj)
            	eml = obj.address;
		}
	}
	mail_from=[];
	mail_from.push(eml);
	if(mailtopush != null){
		this.doDrop(mailtopush[0]);
	}
}; 

com_zimbra_erp_mail_connector_HandlerObject.prototype.init=function(){
	AjxRpc.__RPC_CACHE_MAX = 200;
	docList=this.getUserProperty("doc_list");
	if(docList.length<=0){
	var doclist="{\"records\":[{\"id\":\"1\",\"title\":\"Partner\",\"docname\":\"res.partner\"},{\"id\":\"2\",\"title\":\"Address\",\"docname\":\"res.partner.address\"},{\"id\":\"3\",\"title\":\"Lead\",\"docname\":\"crm.lead\"}]}";
	this.setUserProperty("doc_list",doclist.trim());
	this.saveUserProperties();	
	}
	zmlt=this;	
}

/*   This is the init method     */
function com_zimbra_erp_mail_connector_HandlerObject() {
	com_zimbra_erp_mail_connector_HandlerObject._instance=this;
	tagcreate();
}

function tagcreate(){
	var tree=appCtxt.getTagTree(appCtxt.getActiveAccount());
	var tag=tree.getByName("openERP_archived");
	if(tag==null){
		var params = {"name":"openERP_archived","color":"1"};
		ZmTag.create(params);
	}
}

com_zimbra_erp_mail_connector_HandlerObject.prototype.constructor = com_zimbra_erp_mail_connector_HandlerObject;
com_zimbra_erp_mail_connector_HandlerObject.prototype.singleClicked =function () {
	this.showSideStepDlg();
	this.tabView.switchToTab(this.tabkeys[0]);
}
com_zimbra_erp_mail_connector_HandlerObject.prototype.doubleClicked =function () {
	this.showSideStepDlg();
	this.tabView.switchToTab(this.tabkeys[0]);
}
var canvas;
com_zimbra_erp_mail_connector_HandlerObject.prototype.showSideStepDlg = function () {
	if(canvas){
		canvas.popup();
		return;
	}
	var confi_lbl_url=this.getMessage("connector_configuration_lbl_urladdress");
	var confi_btn_database=this.getMessage("connector_configuration_btn_database");
	var confi_lbl_database=this.getMessage("connector_configuration_lbl_database");
	var confi_lbl_username=this.getMessage("connector_configuration_lbl_username");
	var confi_lbl_password=this.getMessage("connector_configuration_lbl_password");
	var document_lbl_title=this.getMessage("connector_document_lbl_title");
	var document_lbl_docname=this.getMessage("connector_document_lbl_docname");
	var document_success_insert=this.getMessage("connector_document_success_insert");
	var document_unsuccess_insert=this.getMessage("connector_document_unsuccess_insert");
	var document_success_delete=this.getMessage("connector_document_success_delete");
	var document_unsuccess_delete=this.getMessage("connector_document_unsuccess_delete");
	var document_unsuccess_blank=this.getMessage("connector_document_unsuccess_blank");
	var view = new DwtComposite(appCtxt.getShell());	
	this.tabView = new DwtTabView(view,"SideStepTabView");
	this.about_setting= new about_setting(this.tabView,this);
	this.configuration_setting = new configuration_setting(this.tabView,this,confi_lbl_url,confi_btn_database,confi_lbl_database,confi_lbl_username,confi_lbl_password);
	this.document_setting= new document_setting(this.tabView,this,document_lbl_title,document_lbl_docname,document_success_insert,document_unsuccess_insert,document_success_delete,document_unsuccess_delete,document_unsuccess_blank);
	view.setSize("550px", "335px");
	this.tabView.setSize("550px", "345px");	
	this.tabkeys = [];
	this.tabkeys.push(this.tabView.addTab(this.getMessage("connector_project_tab1"),this.configuration_setting));
	this.tabkeys.push(this.tabView.addTab(this.getMessage("connector_project_tab2"),this.document_setting));	
	this.tabkeys.push(this.tabView.addTab(this.getMessage("connector_project_tab3"),this.about_setting));
	canvas = new TabDialog(appCtxt.getShell(), this.getMessage("connector_project_title"),view);
	canvas.getButton(DwtDialog.CANCEL_BUTTON).setText(this.getMessage("connector_project_close"));
	canvas.getButton(DwtDialog.OK_BUTTON).setText(this.getMessage("reset_configuration"));
	canvas.registerCallback(DwtDialog.OK_BUTTON, new AjxCallback(this, this._handleResetClick));
	canvas.popup();
	this.tabView.getTabButton(this.tabkeys[0]).setImage("preferences");//SideStep-configuration
	this.tabView.getTabButton(this.tabkeys[1]).setImage("edit");//SideStep-document	
	this.tabView.getTabButton(this.tabkeys[2]).setImage("social-icon");//SideStep-about	
}

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleResetClick=function(){
	this._dialog = appCtxt.getYesNoMsgDialog();
	this._dialog.setMessage(this.getMessage("configuration_clear_warning"),DwtMessageDialog.WARNING_STYLE,this.getMessage("warning"));
	this._dialog.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this._yesBtnListener));
	this._dialog.setButtonListener(DwtDialog.NO_BUTTON, new AjxListener(this, this._noBtnListener));
	this._dialog.popup();
}

com_zimbra_erp_mail_connector_HandlerObject.prototype._yesBtnListener=function(){

	this.setUserProperty("urladdress","");
	this.setUserProperty("getdatabase","");
	this.setUserProperty("port","");
	this.setUserProperty("username","");
	this.setUserProperty("userpassword","");
	this.setUserProperty("addBook","");
	this.setUserProperty("addBookPath","");
	this.saveUserProperties();
	document.getElementById("urladdress").innerHTML="";	
	this._dialog.popdown();
	this.configuration_setting.clearConfig();
}

com_zimbra_erp_mail_connector_HandlerObject.prototype._noBtnListener=function(){
	this._dialog.popdown();
}
com_zimbra_erp_mail_connector_HandlerObject.prototype._okBtnListener=function(){
	canvas.popdown();
}

function TabDialog(parent,title,  view) {
	if (arguments.length == 0) return;
	DwtDialog.call(this, {parent:parent, title:title, standardButtons:[DwtDialog.OK_BUTTON,DwtDialog.CANCEL_BUTTON]});
	if (!view) {
		this.setContent(this._contentHtml());
	} else {
		this.setView(view);
	}
	this._treeView = {};
	this._opc = appCtxt.getOverviewController();
};

TabDialog.prototype = new ZmDialog;
TabDialog.prototype.constructor = TabDialog;
var arrayJSON; //create JSON Array...
var msgids;
var download_link;
var msgtype;
var dialog=null;

com_zimbra_erp_mail_connector_HandlerObject.prototype.doDrop =
function(droppedItem) {
	arrayJSON= [];
	var ids = [];
	msgids=[];
	msgtype=[];
	try{
		var dbname=this.getUserProperty("getdatabase");
        var password=this.getUserProperty("userpassword");
        var urladdress=this.getUserProperty("urladdress");
        var port=this.getUserProperty("port");
        if(!(dbname || password || urladdress || port)){
			var a =  appCtxt.getMsgDialog();
                a.setMessage(this.getMessage("no_database_configured"),DwtMessageDialog.WARNING_STYLE,this.getMessage("warning"));
                a.popup();
			return;
		 }	
		proto=location.protocol;
		if(proto == "http:"){
			port=appCtxt.get(ZmSetting.HTTP_PORT);
		
		}else if(proto == "https:"){	
			port=appCtxt.get(ZmSetting.HTTPS_PORT);
		}
        baseURL =
        [       location.protocol,
                '//',
                location.hostname,
                (
                 (port && ((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT)
                || (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT)))?
                        ":"+port:''),
                "/service/home/~/"
        ].join("");
        download_link=baseURL;

		if(droppedItem instanceof Array) {
			for(var i =0; i < droppedItem.length; i++) {
				var obj = droppedItem[i].srcObj ?  droppedItem[i].srcObj :  droppedItem[i];
				if (obj.type == "CONV" ) {
					this._getMessageFromConv(obj);	
					mail_from[0]="";
				} else if (obj.type == "MSG") {
					this._getMessageFromMsg(obj);
				} 
				mail_from[0]="";
			}
		} else {
			var obj = droppedItem.srcObj ? droppedItem.srcObj : droppedItem;
			if (obj.type == "CONV"){
				this._getMessageFromConv(obj);	
			} else if(obj.type == "MSG") {
				this._getMessageFromMsg(obj);
			}else if(obj.type == "APPT") {
			}
		}
	}catch(e){
		var a =  appCtxt.getMsgDialog();
			a.setMessage(this.getMessage("mail_push_exception"),DwtMessageDialog.CRITICAL_STYLE,this.getMessage("error"));
			a.popup();
	}

	if(obj.type != "APPT") {
		new push_to_openERP(this,msgids,download_link,mail_from[0],msgtype);
	}
	return;
};

	var participants;
	var port;	
	var baseURL;
	var jspUrl;
	var response;
	var ids;
	var mail_subject
	/** Conversation Mails Detail...**/

com_zimbra_erp_mail_connector_HandlerObject.prototype._getMessageFromConv=function(convSrcObj) {
   try{	
		msgids.push(convSrcObj.msgIds[0]);
		msgtype.push(convSrcObj.type);
		ids=convSrcObj.msgIds;
		mail_subject=convSrcObj.getFirstHotMsg().subject;
		/* Get hhhh the CC , FROM, TO, BCC, SENDER ,REPLY_TO from Email */
		if(convSrcObj.getFirstHotMsg().participants != null){
			participants = convSrcObj.getFirstHotMsg().participants.getArray(); 
		}
		for(var i =0; i < participants.length; i++) {
			if(participants[i].type == AjxEmailAddress.FROM) {
				if(msgFlag == "0"){
			      	mail_from = [];
					mail_from.push(participants[i].address);
				}else{
					msgFlag=0;
				}
			}
		}	
	port = Number(location.port);
	baseURL = 
	[	location.protocol,
		'//',
		location.hostname,
		(
		 (port && ((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT) 
		|| (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT)))?
			":"+port:''),
		"/service/home/~/"
	].join("");
	download_link=baseURL;
    }catch(e){
			var a =  appCtxt.getMsgDialog();
               	a.setMessage(this.getMessage("mail_push_exception"),DwtMessageDialog.CRITICAL_STYLE,this.getMessage("error"));
                a.popup();	
	}
};

com_zimbra_erp_mail_connector_HandlerObject.prototype._getMessageFromMsg=function(convSrcObj) {
	msgids.push(convSrcObj.id);
	msgtype.push(convSrcObj.type);
	ids=convSrcObj.id;
	mail_subject=convSrcObj.subject;
	if(convSrcObj.participants != null){
		var participants = convSrcObj.participants.getArray(); 
	}
	for(var i =0; i < participants.length; i++) {
		if(participants[i].type == AjxEmailAddress.FROM) {
			if(msgFlag == "0"){
				mail_from = [];
				mail_from.push(participants[i].address);
			}else{
				msgFlag=0;
			}
		}
	}
	port = Number(location.port);
	baseURL = 
	[	location.protocol,
		'//',
		location.hostname,
		(
		 (port && ((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT) 
		|| (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT)))?
			":"+port:''),
		"/service/home/~/"
	].join("");
	download_link=baseURL;
};
