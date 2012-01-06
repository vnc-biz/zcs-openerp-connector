var userdbname;
var zmlt;
var emailrecord =[];
var email_ids=[];
var message_type=[];
var downloadlink;
var pushfrom;
var push_random="";
var fixheading="<table class='gridtable'><tr><td><b>Select</b></td><td><b>Name</b></td></tr>";
var proto="http://";


function encode(str) {
	return encodeURIComponent(str);
}
function decode(str) {
	return decodeURIComponent(str.replace(/\+/g, " "));
} 

push_to_openERP=function(zimlet,jsonArray,msgids,download_link,push_from,msgtype){

	this.zimlet=zimlet;
	zmlt=this.zimlet;
	emailrecord=jsonArray;
	email_ids=msgids;
	downloadlink=download_link;
	push_random=Math.round(Math.random()*100);
	pushfrom=push_from;
	message_type=msgtype;
	this._displayDailog();
	
	
	};

//var fixheading="<table class='gridtable'><tr><td><b>"+zmlt.getMessage("connector_pushopener_select")+"</b></td><td><b>Name</b></td></tr>";
push_to_openERP.prototype=new ZmZimletBase;

push_to_openERP.prototype.constructor = push_to_openERP;

/*Display dilogbox when Email will be pushed on zimlet*/
push_to_openERP.prototype._displayDailog=function(){
	

	var dialogtitle=this.zimlet.getMessage("connector_create_pushtoopenerp_title");
	

	this.pView=new DwtComposite(this.zimlet.getShell());
	this.pView.setSize("380","400");
	this.pView.getHtmlElement().style.overflow="auto";
	
	this.pView.getHtmlElement().innerHTML=this._createDialogView();

	
	this.pbDialog=new ZmDialog({title:dialogtitle, view:this.pView, parent:this.zimlet.getShell(), standardButtons:[DwtDialog.DISMISS_BUTTON]});
	this.pbDialog.getButton(DwtDialog.DISMISS_BUTTON).setText(this.zimlet.getMessage("connector_project_close"));
	this.pbDialog.setButtonListener(DwtDialog.DISMISS_BUTTON, new AjxListener(this, this._dismissBtnListener));
	
	getRecords();
	document.getElementById("document_name"+push_random+"").innerHTML=fixheading;
	
	
		document.getElementById("mailsearch"+push_random+"").value=pushfrom;
	
	this.pbDialog.popup();
	
	

}

/*Retrives all records stored from add document*/
function getRecords(){

	 
	  var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/GetDocumentRecord.jsp";	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);
	
	  if (response.success == true) {
	
		
	        var elJson =JSON.parse(response.text.trim());
		
		var records=elJson.records;
			
		var s="";
		
		for(var i=0;i<records.length;i++){
			
			if(i==0){
			s+="<input type='checkbox' id='records"+push_random+"' name='records"+push_random+"' value='"+records[i].docname+"' onclick='AllCheckbox()' checked/>"+records[i].title;
				}else{
					s+="<input type='checkbox' id='records"+push_random+"' name='records"+push_random+"' value='"+records[i].docname+"' onclick='AllCheckbox()'/>"+records[i].title;
				}
				
			
			
		}
		
		s+="<input type='checkbox' id='sel"+push_random+"' name='sel"+push_random+"' onclick='checkdAll("+push_random+")' />select All";
		document.getElementById("push_documents"+push_random+"").innerHTML=s;
		

			
	   }

}


/*Check if "Select All" checkbox is checked*/
function AllCheckbox(){
	 record_all=document.getElementsByName("records"+push_random+"");
	
	
		var count=0;
		
		for(var i=0;i<record_all.length;i++){
			if(record_all[i].checked==true){
				count++;
				
			}
		}
		
		if(count==record_all.length){
			document.getElementById("sel"+push_random+"").checked=true;
		}else{
			document.getElementById("sel"+push_random+"").checked=false;
		}
		
}






/*Will select all documents*/

function checkdAll(ran){
	
	

	record=document.getElementsByName("records"+ran+"");
	
	if(document.getElementById("sel"+ran+"").checked){

		for(var i=0;i<record.length;i++){
			record[i].checked=true;
		}
	
	}else{
		for(var i=0;i<record.length;i++){
			record[i].checked=false;
		}
	
		
	}

	

}

/*Create a dialog view for push Email*/
push_to_openERP.prototype._createDialogView = function() {

	var i = 0;

	var html = new Array();
	//html[i++]="<fieldset>";
	html[i++]="<div style='float:left;width:100%;'>";
	html[i++]="<table>";
	html[i++]="<tr>";
	html[i++]="<td>";
	html[i++]=this.zimlet.getMessage("connector_pushopenerp.search");
	html[i++]="</td>";
	html[i++]="<td>";
	html[i++]="<input type='text' id='mailsearch"+push_random+"' />";
	html[i++]="</td>";
	html[i++]="<td>";
	html[i++]="<input type=button onclick=getDocumentRecord() value="+this.zimlet.getMessage("connector_pushopenerp.search")+" />"
	html[i++]="</td>";
	html[i++]="</tr>";
	html[i++]="</table>";
	html[i++]="<div id='push_documents"+push_random+"' name='push_documents"+push_random+"' style='width:98%;height:70px;overflow:auto;'></div>";
	html[i++]="Documents";
	html[i++]="<div id='document_name"+push_random+"' name='document_name"+push_random+"' style='width:100%;height:50%;overflow:scroll;'></div>";
	html[i++]="<input type='button' name='push' value='push' onclick='pushEmail("+push_random+")' />"
	html[i++]="<div id='wait"+push_random+"' align='center'></div>";
	html[i++]="</div>";

	//html[i++]="</fieldset>";
//html[i++]="<div style='float:right;width:50%;'>kk</div>";
	return html.join("");
};



var documentrecord;
/*Provede All users name from Open ERP*/
function getDocumentRecord(){

	

	record_check=document.getElementsByName("records"+push_random+"");
        var flg=0;
        for(var i=0;i<record_check.length;i++){

                if(record_check[i].checked){
                        flg=1;
                }

        }

        if(flg==0){
                 var a =  appCtxt.getMsgDialog();
                 a.setMessage(zmlt.getMessage("connector_pushopenerp_moduleselect"),DwtMessageDialog.WARNING_STYLE,zmlt.getMessage("warning"));
                 a.popup();
                return;
        }


	var radiofill=document.getElementsByName("document_name"+push_random+"");       
                            	 
				for(var i=0;i<radiofill.length;i++){
                                	        radiofill[i].innerHTML="";
                               	}

	
	/*selected object pass in the search of mail*/

	record=document.getElementsByName("records"+push_random+"");
	var obj_name = "";
	
	for(var i=0;i<record.length;i++){
                 if(record[i].checked==true){
			obj_name=obj_name+record[i].value+",";
		}
        }


	title_param="";
	var dbname=zmlt.getUserProperty("getdatabase");
	var password=zmlt.getUserProperty("userpassword");
	var urladdress=zmlt.getUserProperty("urladdress");
	var port=zmlt.getUserProperty("port");
	var emailsearch=document.getElementById("mailsearch"+push_random+"").value;


	
	
	if(dbname=="" || password=="" || urladdress=="" || port=="" ){
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zmlt.getMessage("connector_pushopenerp_checkconection"),DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
                a.popup();	
		
		document.getElementById("document_name"+push_random+"").innerHTML=""+fixheading;
		document.getElementById("mailsearch"+push_random+"").focus();
		return;
	}


		var tot_obj=obj_name.toString().split(',');

                
		document.getElementById("wait"+push_random+"").innerHTML="<img src='"+zmlt.getResource("resources/submit_please_wait.gif")+"'/>";
		documentrecord="";
                documentrecord+=fixheading;

	
		for(var j=0;j<tot_obj.length-1;j++){
	
			var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Documentlist.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&emailsearch="+emailsearch.trim()+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&obj_name="+tot_obj[j]; 

   	  	var response = AjxRpc.invoke(null,jspurl, null, null, true);
	
		/*response will have users list*/	
                	if (response.success == true) {

			
				if(response.text.trim().length>2 && response.text.trim()!="Exception"){
				
				var docrecord=JSON.parse(response.text.trim());
				
			        for(var i = 0; i < docrecord.length; i++)
				{
					
					var record_id=docrecord[i].toString().split(',')[0];
					var record_names=docrecord[i].toString().split(',')[1];
					if(i%2==0){             

                  				documentrecord+="<tr class='d0'><td><input type='radio' value="+(tot_obj[j]+","+record_id)+" id='record_names"+push_random+"' name='record_names"+push_random+"'></td><td>"+record_names+"</td></tr>";
                                        
					}else{

                                
						documentrecord+="<tr class='d1'><td><input type='radio' value="+(tot_obj[j]+","+record_id)+" id='record_names"+push_random+"' name='record_names"+push_random+"'></td><td>"+record_names+"</td></tr>";


					}
                                
                	
				}
				//document.getElementById("wait"+push_random+"").innerHTML="";
				}
				else{

					if(response.text.trim()=="Exception"){
					
						var a =  appCtxt.getMsgDialog();
                				a.setMessage(zmlt.getMessage("error_in_gettingrecords")+tot_obj[j],DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
              					  a.popup();	
						
					}
					else{

						var a =  appCtxt.getMsgDialog();    
                                                a.setMessage(zmlt.getMessage("no_records_founds")+tot_obj[j],DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
                                                  a.popup();	
					}
				}
			
				
		 	}else{
				var a =  appCtxt.getMsgDialog();
                        	a.setMessage(zmlt.getMessage("connector_pushopenerp_responseproblem"),DwtMessageDialog.WARNING_STYLE,zmlt.getMessage("warning"));
                        	a.popup();
				document.getElementById("document_name"+push_random+"").innerHTML=""+fixheading;
				document.getElementById("wait"+push_random+"").innerHTML="";
				return;
			
			}
		}

		var radiofill=document.getElementsByName("document_name"+push_random+"");

                                for(var i=0;i<radiofill.length;i++){
                                                radiofill[i].innerHTML=documentrecord;
                                }
		document.getElementById("wait"+push_random+"").innerHTML="";
}

var partnerid="";
push_to_openERP.prototype._okBtnListener = function() {

	

}


push_to_openERP.prototype._dismissBtnListener= function() {
this.pbDialog.popdown();


}


var push_id="";
/*Ajax call with all mail details to push Email*/
function pushEmail(push_random){

	
	if(dbname=="" || password=="" || urladdress=="" || port=="" ){
	
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zmlt.getMessage("connector_pushopenerp_checkconection"),DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
                a.popup();
		document.getElementById("document_name"+push_random+"").innerHTML=""+fixheading;
		document.getElementById("mailsearch"+push_random+"").focus();
		return;
	}


		
		var record_ids=document.getElementsByName("record_names"+push_random+"");
		
		var flag=1;
		
		for(var i=0;i<record_ids.length;i++){
			
			if(record_ids[i].checked==true){
				push_id=record_ids[i].value;

				flag=0;	
					
			}/*else{
				alert(zmlt.getMessage("connector_pushopenerp_sel_name"));
				return 0;
			}*/
			
			
		}

		if(flag==1){

		            	var a =  appCtxt.getMsgDialog();
                                a.setMessage(zmlt.getMessage("connector_pushopenerp_sel_name"),DwtMessageDialog.WARNING_STYLE,zmlt.getMessage("warning"));
                                a.popup();
                             return 0;	
	
		}
		
		
		var dbname=zmlt.getUserProperty("getdatabase");
		
		String.prototype.ltrim=function(){return this.replace(/^\s+/,'');}
		dbname=dbname.ltrim();
	
		var password=zmlt.getUserProperty("userpassword");
		var urladdress=zmlt.getUserProperty("urladdress");
		var port=zmlt.getUserProperty("port");
		var flag=0;		


		for(var i=0;i<email_ids.length;i++){
	
			document.getElementById("wait"+push_random+"").innerHTML="<img src='"+zmlt.getResource("resources/submit_please_wait.gif")+"'/>"; 
   	  	
				var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/PushEmail.jsp?dbname="+dbname+"&password="+password+"&urladdress="+(proto+urladdress)+"&port="+port+"&push_id="+push_id+"&msgid="+email_ids[i]+"&downloadlink="+downloadlink+"&sessionid="+ZmCsfeCommand.getSessionId();
								
				var response = AjxRpc.invoke(null,jspurl, null, null, true);
				
				if(response.success==true){

					if(response.text.trim()=="1"){
						
							var tagObj = appCtxt.getActiveAccount().trees.TAG.getByName("openERP_archived");
							if(!tagObj)
						    		return;
							var tagId = tagObj.id;

							var soapCmd = "MsgActionRequest";
					
					
              						var itemActionRequest = {};
                					itemActionRequest[soapCmd] = {_jsns:"urn:zimbraMail"};
                					var request = itemActionRequest[soapCmd];
                					var action = request.action = {};
							var emailid = "" + email_ids[i];
			
                					action.id = emailid;
                					action.op = "tag";
                					action.tag = tagId;
                					var params = {asyncMode: true, callback: null, jsonObj:itemActionRequest};
                					appCtxt.getAppController().sendRequest(params);	
						
						}
						else{
							if(response.text.trim()=="2"){
							
								var a =  appCtxt.getMsgDialog();
                        					a.setMessage(zmlt.getMessage("reconnect"),DwtMessageDialog.WARNING_STYLE,zmlt.getMessage("warning"));
                        					a.popup();
							}else{
			
								 var a =  appCtxt.getMsgDialog();
                						a.setMessage(zmlt.getMessage("duplicate_mail_not_allowed"),DwtMessageDialog.CRITICAL_STYLE,zmlt.getMessage("error"));
               							 a.popup();
								flag=1;
							}
						}
				}

   	  			
		}


		if(flag==1){
			//alert(zmlt.getMessage("connector_pushopenerp_process_unsuccess"));
		}else{
		
			var a =  appCtxt.getMsgDialog();
                       a.setMessage(zmlt.getMessage("connector_pushopenerp_process_success"),DwtMessageDialog.INFO_STYLE,zmlt.getMessage("msg"));
                       a.popup();

		}

			document.getElementById("wait"+push_random+"").innerHTML="";
	

}

