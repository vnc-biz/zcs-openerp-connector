com_zimbra_erp_mail_connector_HandlerObject.getInstance = function () {
	return com_zimbra_erp_mail_connector_HandlerObject._instance;

}


com_zimbra_erp_mail_connector_HandlerObject.prototype= new ZmZimletBase;

com_zimbra_erp_mail_connector_HandlerObject.BUTTON_ID="Contact Sync.";

com_zimbra_erp_mail_connector_HandlerObject.prototype.initializeToolbar = function(app, toolbar, controller,
		view) {

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
		var buttonArgs = {
			text : "ContactSync.",
			tooltip : "Synchronize contacts",
			index : buttonIndex, // position of the button
			image : "refresh" // icon
		};

		// toolbar.createOp api creates the button with some id and params
		// containing button details.
		var button = toolbar.createOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON_ID, buttonArgs);
		button.addSelectionListener(new AjxListener(this,this._handleToolbarBtnClick, controller));

	}
	else if(view == "CLD" || view == "CLWW"){
		
		var buttonIndex1 = -1;
                for ( var i = 0, count = toolbar.opList.length; i < count; i++) {
                        if (toolbar.opList[i] == ZmOperation.VIEW_MENU) {
                                buttonIndex1 = i + 1;
                                break;
                        }
                }
                // create params obj with button details
                var buttonArgs = {
                        text : "CalendarSync.",
                        tooltip : "Synchronize contacts",
                        index : buttonIndex, // position of the button
                        image : "CalSync" // icon
                };

                // toolbar.createOp api creates the button with some id and params
                // containing button details.
                var button = toolbar.createOp(com_zimbra_erp_mail_connector_HandlerObject.BUTTON_ID, buttonArgs);
                button.addSelectionListener(new AjxListener(this,this._handleCalSyncBtnClick, controller));

	}



};



com_zimbra_erp_mail_connector_HandlerObject.prototype._handleCalSyncBtnClick = function(controller) {

        var ftree = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName("open_ERP");
        alert(ftree);
        if(ftree==null)
        {
                var soapDoc = AjxSoapDoc.create("CreateFolderRequest", "urn:zimbraMail");

                var accountNode = soapDoc.set("folder");
                accountNode.setAttribute("name","open_ERP");
                accountNode.setAttribute("view","appointment");
                /*var content = zimbra_sig_id.signature;

                var subnode=soapDoc.set("content",content,accountNode);
                subnode.setAttribute("type",type);*/

                var params = {
                soapDoc: soapDoc,
                asyncMode: true,
                callback: (new AjxCallback(this, this._handleSOAPResponseXML)),
                errorCallback: (new AjxCallback(this, this._handleSOAPErrorResponseXML))
                };


                appCtxt.getAppController().sendRequest(params);
                alert("Calendar created");

        }
        else{ alert("Calendar already exist")};
	
	new calsync(this);
};

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleSOAPErrorResponseXML = function(result) {
		
	if (result.isException()) {
        // do something with exception
        alert("exception is thrown from _handleSOAPErrorResponseXML");
        var exception = result.getException();
	return;
    }

};

com_zimbra_erp_mail_connector_HandlerObject.prototype._handleToolbarBtnClick = function(controller) {

	new contactsync(this);



};


/*   This is the init method     */

function com_zimbra_erp_mail_connector_HandlerObject() {
	var ftree = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getByName("openERP");
        if(ftree == null){
                var oc = appCtxt.getOverviewController();
                oc.getTreeController(ZmOrganizer.ADDRBOOK)._doCreate({"name":"openERP"});
        }

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

	

	
	view.setSize("550px", "400px");
	this.tabView.setSize("550px", "400px");	
	
	this.tabkeys = [];

	this.tabkeys.push(this.tabView.addTab(this.getMessage("connector_project_tab1"),this.configuration_setting));
	this.tabkeys.push(this.tabView.addTab(this.getMessage("connector_project_tab2"),this.document_setting));	
	this.tabkeys.push(this.tabView.addTab(this.getMessage("connector_project_tab3"),this.about_setting));
		
	 canvas = new TabDialog(appCtxt.getShell(), this.getMessage("connector_project_title"),view);
	
canvas.getButton(DwtDialog.CANCEL_BUTTON).setText(this.getMessage("connector_project_close"));

	canvas.popup();
		
	this.tabView.getTabButton(this.tabkeys[0]).setImage("preferences");//SideStep-configuration
	this.tabView.getTabButton(this.tabkeys[1]).setImage("edit");//SideStep-document	
	this.tabView.getTabButton(this.tabkeys[2]).setImage("social-icon");//SideStep-about	
}

com_zimbra_erp_mail_connector_HandlerObject.prototype._okBtnListener=function(){
canvas.popdown();


}


function TabDialog(parent,title,  view) {
	if (arguments.length == 0) return;

	DwtDialog.call(this, {parent:parent, title:title, standardButtons:[DwtDialog.CANCEL_BUTTON ]});
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
com_zimbra_erp_mail_connector_HandlerObject.prototype.doDrop =
function(droppedItem) {

	arrayJSON= [];
	var ids = [];
	msgids=[];
	msgtype=[];
	
	
	
		
try{


	port = Number(location.port);
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
							
		} 
	}
	



}catch(e){
	alert(e);
	}


new push_to_openERP(this,arrayJSON,msgids,download_link,mail_from[0],msgtype);

};

	var mail_subject;
	var mail_contant;
	var mail_cc;
	var mail_bcc ;
	var mail_sender;
	var mail_from;
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
	
	
	msgids.push(convSrcObj.msgIds);
	
	msgtype.push(convSrcObj.type);
	ids=convSrcObj.msgIds;
	
	mail_cc= [];
	mail_bcc=[];
	mail_sender=[];
	mail_replyto = [];
	mail_from = [];
	mail_to = [];
	mail_attachment = [];
	attachment_binary=[];

	mail_subject=convSrcObj.getFirstHotMsg().subject;
	mail_contant=convSrcObj.getFirstHotMsg().getBodyContent();
	

	 sentdate= new Date(convSrcObj.getFirstHotMsg().sentDate);


	mail_sentdate=(sentdate.getMonth()+1)+"/"+sentdate.getDate()+"/"+(sentdate.getYear()+1900)+" "+sentdate.getHours()+":"+sentdate.getMinutes()+":"+sentdate.getSeconds();
	

	//Get Mail information from soap request...
	
	 
	/* Get hhhh the CC , FROM, TO, BCC, SENDER ,REPLY_TO from Email */

	participants = convSrcObj.getFirstHotMsg().participants.getArray(); 

	for(var i =0; i < participants.length; i++) {
			
		     if(participants[i].type == AjxEmailAddress.FROM) {
			      mail_from.push(participants[i].address);
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
	  
	 // var jspurl = this.getResource("Getemailrecord.jsp?msgid="+ids+"&sessionid="+ZmCsfeCommand.getSessionId()+"&urldownload="+baseURL);

	  //var response = AjxRpc.invoke(null,jspurl, null, null, true);

	 
	  /*if (response.success == true) {


		alert("----->"+response.text);		
	  }*/
/*
	if (convSrcObj.hasAttach) {
		
		var tmpAtt = convSrcObj.getFirstHotMsg().attachments;
		for (var i = 0; i < tmpAtt.length; i++) {
			if (tmpAtt[i].filename != undefined) {
				mail_attachment.push(tmpAtt[i].filename);
				jspUrl=baseURL+tmpAtt[i].filename+"?auth=co&loc=en_US&id="+convSrcObj.msgIds+"&part=2&disp=a";
	`			var jss="/service/zimlet/com_zimbra_erp_mail_connector/attachmentToBase64.jsp?messageUrl="+AjxStringUtil.urlComponentEncode(jspUrl);
							
				response = AjxRpc.invoke(null, jss, null, null, true, null);
				attachment_binary.push(response.text.trim().replace(/(\r\n|[\r\n])/g,"")); 
				
				
			}
		}
		

	} 

	
	mailRecordJson(mail_subject,mail_contant,mail_sentdate,mail_cc,mail_from,mail_bcc,mail_sender,mail_to,mail_replyto,mail_attachment,attachment_binary,ids);

*/	
	
};


/** Mesg Mail Detail...**/


com_zimbra_erp_mail_connector_HandlerObject.prototype._getMessageFromMsg=function(convSrcObj) {


	msgids.push(convSrcObj.id);
	msgtype.push(convSrcObj.type);

	ids=convSrcObj.id;
       
	 mail_subject=convSrcObj.subject;
	 mail_contant=convSrcObj.getBodyContent();
	
	mail_cc = [];
	mail_bcc = [];
	mail_sender = [];
	mail_from = [];
	mail_to = [];
	mail_replyto = [];
	mail_attachment = [];
	attachment_binary=[];

	 sentdate= new Date(convSrcObj.sentDate);

	mail_sentdate=(sentdate.getMonth()+1)+"/"+sentdate.getDate()+"/"+(sentdate.getYear()+1900)+" "+sentdate.getHours()+":"+sentdate.getMinutes()+":"+sentdate.getSeconds();



	 


          //var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Getemailrecord.jsp?msgid="+ids;	
	  //var jspurl="Getemailrecord.jsp?msgid="+ids;	
	

		
	   


	/*  Get the CC , FROM, TO, BCC, SENDER ,REPLY_TO from Email */

	var participants = convSrcObj.participants.getArray(); 

	for(var i =0; i < participants.length; i++) {

		     /*if(participants[i].type == AjxEmailAddress.CC) {
			      mail_cc.push(participants[i].address);
		     }*/
		     if(participants[i].type == AjxEmailAddress.FROM) {
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
	// var jspurl = this.getResource("Getemailrecord.jsp?msgid="+ids+"&sessionid="+ZmCsfeCommand.getSessionId()+"&urldownload="+baseURL);

	
	  //var response = AjxRpc.invoke(null,jspurl, null, null, true);


	 /* if (response.success == true) {
		out.println("---->"+response.text);
	 }*/

	/*if (convSrcObj.hasAttach) {
		
		var tmpAtt = convSrcObj.getFirstHotMsg().attachments;
		for (var i = 0; i < tmpAtt.length; i++) {
			if (tmpAtt[i].filename != undefined) {
				mail_attachment.push(tmpAtt[i].filename);
				jspUrl=baseURL+tmpAtt[i].filename+"?auth=co&loc=en_US&id="+convSrcObj.msgIds+"&part=2&disp=a";
				var jss="/service/zimlet/com_zimbra_erp_mail_connector/attachmentToBase64.jsp?messageUrl="+AjxStringUtil.urlComponentEncode(jspUrl);				
				response = AjxRpc.invoke(null, jss, null, null, true, null);
				attachment_binary.push(response.text.trim().replace(/(\r\n|[\r\n])/g,"")); 
			        alert("aaa" + attachment_binary[0]);	
				
				
			}
		}
		

	} 

	mailRecordJson(mail_subject,mail_contant,mail_sentdate,mail_cc,mail_from,mail_bcc,mail_sender,mail_to,mail_replyto,mail_attachment,attachment_binary);
*/	
		
};

/**  Create Json for Emails..  **/



function mailRecordJson(mail_subject,mail_contant,mail_sentdate,mail_cc,mail_from,mail_bcc,mail_sender,mail_to,mail_replyto,mail_attachment,attachment_binary,ids){

	var jsonstr='{"Delivered_To":"'+mail_to+'","CC": "'+mail_cc+'","References":"'+mail_bcc+'","From":"'+mail_from+'","In_Reply_To":"'+mail_sender+'", "Subject":"'+mail_subject+'","body":"'+mail_contant+'","attachments":"'+mail_attachment+'","Content_Transfer_Encoding":"'+attachment_binary+'","Date":"'+mail_sentdate+'","Reply_To":"'+mail_replyto+'","message_id":"'+ids+'"}';
	
	arrayJSON.push(jsonstr);
}





