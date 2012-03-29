com_zimbra_erp_mail_connector_HandlerObject.getInstance = function () {
	return com_zimbra_erp_mail_connector_HandlerObject._instance;

}


var mail_from=[];
com_zimbra_erp_mail_connector_HandlerObject.prototype= new ZmZimletBase;

com_zimbra_erp_mail_connector_HandlerObject.BUTTON_ID="Contact Sync.";

com_zimbra_erp_mail_connector_HandlerObject.BUTTON1_ID="cal_sync";
com_zimbra_erp_mail_connector_HandlerObject.BUTTON2_ID="send_and_push";
com_zimbra_erp_mail_connector_HandlerObject.BUTTON3_ID="push_to_erp";

var currentApt;
var attendeesFlag;
var zmlt;
String.prototype.ltrim=function(){return this.replace(/^\s+/,'');}
pushMeeting = function(){

		/*var dbname=zmlt.getUserProperty("getdatabase");
                dbname=dbname.ltrim();
                var password=zmlt.getUserProperty("userpassword");
                var urladdress=zmlt.getUserProperty("urladdress");
                var port=zmlt.getUserProperty("port");
                var openerp_id=zmlt.getUserProperty("openerp_id");
                //appt = appCtxt.getCurrentController().getSelection();
                var aptDataLink=appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName(currentApt.getFolder().getName()).getRestUrl();
                var appt_jspurl="/service/zimlet/com_zimbra_erp_mail_connector/PushAppt.jsp?dbname="+dbname+"&password="+password+"&urladdress="+(proto+urladdress)+"&port="+port+"&msgid="+currentApt.id+"&downloadlink="+aptDataLink+"&push_id=&sessionid="+ZmCsfeCommand.getSessionId()+"&openerp_id="+openerp_id.trim();

                var appt_response = AjxRpc.invoke(null,appt_jspurl, null, null, true);*/

		
}
com_zimbra_erp_mail_connector_HandlerObject.prototype.onApptDrop = function(appt,startDate,endDate){
		
		currentApt=appt;
		if(!appt.hasAttendees()){ 
			pushMeeting();
		}


		
}

com_zimbra_erp_mail_connector_HandlerObject.prototype.onAction = function(type,action,currentView,lastView){
        if(type.match("button") && action.match("No") && currentView.match("CAL")){
		setTimeout("pushMeeting()",6000);

	}

}


com_zimbra_erp_mail_connector_HandlerObject.prototype.initializeToolbar = function(app, toolbar, controller,view) {

	
	var patt="COMPOSE";
	
	// only add this button for the following 3 views
	if (view == "CNS") {
		if (toolbar.getOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON_ID)) {
			return;
		}
		// get the index of View menu so we can display it after that.
		var buttonIndex = -1;
		for ( var i = 0, count = toolbar.opList.length; i < count; i++) {
			if (toolbar.opList[i] == ZmOperation.TAG_MENU) {
				buttonIndex = i + 2;
				break;
			}
		}
		// create params obj with button details
		var contact_sync_btn=this.getMessage("contact_sync_btn");
		var buttonArgs = {
			text :contact_sync_btn,
			tooltip : "Synchronize contacts",
			index : buttonIndex, // position of the button
			image : "refresh" // icon
		};

		// toolbar.createOp api creates the button with some id and params
		// containing button details.
		var button = toolbar.createOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON_ID, buttonArgs);
		button.addSelectionListener(new AjxListener(this,this._handleToolbarBtnClick, controller));

	}
	else if(view == "CLD" || view=="CLWW"){
		
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
                        tooltip : "Reload all remote calendars",
                        index : buttonIndex, // position of the button
                        image : "refresh" // icoN
                };

                // toolbar.createOp api creates the button with some id and params
                // containing button details.
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

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleResponsefromsend = function(result) {
	var resp=result.getResponse();
        var ac = window.parentAppCtxt || window.appCtxt;
	var msgid=resp.m[0].id;
        var list = ac.getApp(ZmApp.MAIL).getMailListController().getList();
	var msg = new ZmMailMsg(resp.m[0].id, list, true); // do not cache this temp msg
    	msg._loadFromDom(resp.m[0]);
    	msg._loaded = true; // bug fix #8868 - force load for rfc822 msgs since they may not return any content
    	msg.readReceiptRequested = false; // bug #36247 - never allow read receipt for rfc/822 message
    	msg._part = resp.m[0].part;
	var from=new AjxEmailAddress(appCtxt.getUsername(),AjxEmailAddress.FROM);
	mail_from=[];
	mail_from.push(appCtxt.getUsername());	
        this.doDrop(msg);

		


}



com_zimbra_erp_mail_connector_HandlerObject.prototype._handleSOAPErrorResponseXML = function(result) {
		
	if (result.isException()) {
        // do something with exception
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

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleToolbarBtnClick = function(controller) {

	addBook=this.getUserProperty("addBook");
	addBookPath=this.getUserProperty("addBookPath");
	var addBook_Contact = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getById(ZmFolder.ID_CONTACTS);
	
	addBook_ContactId=addBook_Contact.id;
	var addBook_Econtact=appCtxt.getFolderTree(appCtxt.getActiveAccount()).getById(ZmFolder.ID_AUTO_ADDED);
	addBook_EcontactId=addBook_Econtact.id;
	if(addBookPath.trim()==""){
			this.getFolderDialog()
	}else{

			var ftree = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByPath(addBookPath);
			if(ftree != null){
        			var trashCheck=ftree.isInTrash();	
			}else{
				this.getFolderDialog()	
			}
			if(trashCheck==false){
				new contactsync(this,addBook,addBookPath); 
			}else{
				this.getFolderDialog()
			}
	}
	



};

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleChooseFolder = function(organizer) {
		
	var addBook=organizer.getName();
	addBook = addBook.replace(/&nbsp;/gi,' ');
	var addBookPath=organizer.getPath();
	addBookPath=addBookPath.replace(/&nbsp;/gi,' ');
	this.setUserProperty("addBook",addBook);
	this.setUserProperty("addBookPath",addBookPath);
	this.saveUserProperties();
	if(addBook !="" || addBook !="Folders"){
		var dialog = appCtxt.getChooseFolderDialog();
    		dialog.popdown();	
		new contactsync(this,addBook,addBookPath);
	}

	


		
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


com_zimbra_erp_mail_connector_HandlerObject.prototype._menuButtonListener = function(controller) {

        var con=appCtxt.getCurrentController();
        var msg=con.getMsg();
        if(msg != null){
                this.doDrop(msg);
        }



}; 
com_zimbra_erp_mail_connector_HandlerObject.prototype.init=function(){

	docList=this.getUserProperty("doc_list");
	//var json=JSON.parse(docList);
	if(docList.length<=0){
		var doclist="{\"records\":[{\"id\":\"1\",\"title\":\"Partner\",\"docname\":\"res.partner\"},{\"id\":\"2\",\"title\":\"Address\",\"docname\":\"res.partner.address\"},{\"id\":\"3\",\"title\":\"Lead\",\"docname\":\"crm.lead\"}]}";
	
	this.setUserProperty("doc_list",doclist.trim());
        this.saveUserProperties();	
	}

zmlt=this;	

}





/*   This is the init method     */

function com_zimbra_erp_mail_connector_HandlerObject() {


	/*var ftree = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName("OpenERP");
        if(ftree == null){
                var oc = appCtxt.getOverviewController();
                oc.getTreeController(ZmOrganizer.ADDRBOOK)._doCreate({"name":"OpenERP"});
        }*/
	

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
	//canvas.getButton(DwtDialog.YES_BUTTON).setVisibility(false) ;
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
var g_aptId;
var dialog=null;
com_zimbra_erp_mail_connector_HandlerObject.prototype.onSaveApptSuccess = function(obj,calItem,result){

		currentApt=calItem;
		pushMeeting();

}




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
	//port = Number(location.port);
	if(droppedItem instanceof Array) {
		
		for(var i =0; i < droppedItem.length; i++) {
		
			var obj = droppedItem[i].srcObj ?  droppedItem[i].srcObj :  droppedItem[i];
			if(obj.type == "CONV" ) {

				this._getMessageFromConv(obj);	
				mail_from[0]="";
						  				
			}  
			else if(obj.type == "MSG") {
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

			
                        var aptId=obj.id;
			if(aptId<0){
				aptId=g_aptId;
				 DBG.println(AjxDebug.DBG3, "Hello----->>>this is globel Id==="+aptId);
				
			}
                        var download_link=appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName(obj.getFolder().getName()).getRestUrl();
                        //new push_to_openERP(this,aptId,download_link,"","APPT");
                        //new push_to_openERP(this,msgids,download_link,mail_from[0],msgtype);
                        return;
                }


 
	}
		
	if(droppedItem[0] != undefined){	
		if(droppedItem[0].srcObj.id.indexOf(':') > 0){
			port = Number(location.port);
		}
        }else{
		if(droppedItem.srcObj.id.indexOf(':') > 0){
			port = Number(location.port);
		}
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


}catch(e){
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("exception"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
                return
	}

if(obj.type != "APPT") {

	new push_to_openERP(this,msgids,download_link,mail_from[0],msgtype);
	
}
		
return;
};

	var mail_subject;
	var mail_contant;
	var mail_cc;
	var mail_bcc ;
	var mail_sender;
	var mail_to;
	var mail_replyto;
	var mail_attachment;
	var sentdate;
	var mail_sentdate;
	var participants;
	var port;	
	var baseURL;
	var jspUrl;
	var response;
	var attachment_binary;
	var ids;

/** Conversation Mails Detail...**/

 


com_zimbra_erp_mail_connector_HandlerObject.prototype._getMessageFromConv=
function(convSrcObj) {
	
   try{	

	msgids.push(convSrcObj.msgIds);
	msgtype.push(convSrcObj.type);
	ids=convSrcObj.msgIds;
	mail_sender=[];
	mail_to = [];

	mail_subject=convSrcObj.getFirstHotMsg().subject;

	 sentdate= new Date(convSrcObj.getFirstHotMsg().sentDate);


	mail_sentdate=(sentdate.getMonth()+1)+"/"+sentdate.getDate()+"/"+(sentdate.getYear()+1900)+" "+sentdate.getHours()+":"+sentdate.getMinutes()+":"+sentdate.getSeconds();
	 
	/* Get hhhh the CC , FROM, TO, BCC, SENDER ,REPLY_TO from Email */

	participants = convSrcObj.getFirstHotMsg().participants.getArray(); 

	for(var i =0; i < participants.length; i++) {
			
		     if(participants[i].type == AjxEmailAddress.FROM) {
			      	mail_from = [];
				mail_from.push(participants[i].address);

			}

	}	
	

	/*port = Number(location.port);
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
	
	download_link=baseURL;*/
	  
    }catch(e){
		
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("exception"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
                return
	}
	 

	
};


/** Mesg Mail Detail...**/


com_zimbra_erp_mail_connector_HandlerObject.prototype._getMessageFromMsg=function(convSrcObj) {
	
		msgids.push(convSrcObj.id);
		msgtype.push(convSrcObj.type);
		ids=convSrcObj.id;
		mail_subject=convSrcObj.subject;
		//mail_contant=convSrcObj.getBodyContent();
	
	mail_cc = [];
	mail_bcc = [];
	mail_to = [];
	mail_replyto = [];
	mail_attachment = [];
	attachment_binary=[];

	 sentdate= new Date(convSrcObj.sentDate);

	mail_sentdate=(sentdate.getMonth()+1)+"/"+sentdate.getDate()+"/"+(sentdate.getYear()+1900)+" "+sentdate.getHours()+":"+sentdate.getMinutes()+":"+sentdate.getSeconds();

	/*  Get the CC , FROM, TO, BCC, SENDER ,REPLY_TO from Email */

	var participants = convSrcObj.participants.getArray(); 

	for(var i =0; i < participants.length; i++) {

		     /*if(participants[i].type == AjxEmailAddress.CC) {
			      mail_cc.push(participants[i].address);
		     }*/
		     if(participants[i].type == AjxEmailAddress.FROM) {
			      	mail_from = [];
				mail_from.push(participants[i].address);
		     }
		     /*if(participants[i].type == AjxEmailAddress.BCC) {
			      mail_bcc.push(participants[i].address);
		     }
		     if(participants[i].type == AjxEmailAddress.SENDER) {
			      mail_sender.push(participants[i].address);
		     }
		     if(participants[i].type == AjxEmailAddress.TO) {
			      mail_to.push(participants[i].address);
		     }
		    if(participants[i].type == AjxEmailAddress.REPLY_TO) {
			      mail_replyto.push(participants[i].address);
		     }*/

	}



	
	/*port = Number(location.port);
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
	
         
download_link=baseURL;*/
	// var jspurl = this.getResource("Getemailrecord.jsp?msgid="+ids+"&sessionid="+ZmCsfeCommand.getSessionId()+"&urldownload="+baseURL);

	
	  //var response = AjxRpc.invoke(null,jspurl, null, null, true);



		
};

/**  Create Json for Emails..  **/



/*function mailRecordJson(mail_subject,mail_contant,mail_sentdate,mail_cc,mail_from,mail_bcc,mail_sender,mail_to,mail_replyto,mail_attachment,attachment_binary,ids){

	var jsonstr='{"Delivered_To":"'+mail_to+'","CC": "'+mail_cc+'","References":"'+mail_bcc+'","From":"'+mail_from+'","In_Reply_To":"'+mail_sender+'", "Subject":"'+mail_subject+'","body":"'+mail_contant+'","attachments":"'+mail_attachment+'","Content_Transfer_Encoding":"'+attachment_binary+'","Date":"'+mail_sentdate+'","Reply_To":"'+mail_replyto+'","message_id":"'+ids+'"}';
	
	arrayJSON.push(jsonstr);
}*/





