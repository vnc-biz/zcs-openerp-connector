document_setting.prototype = new DwtTabViewPage;
document_setting.prototype.constructor = document_setting;

	
	var document_title;
	var document_docname;
	var zm;
	var success_insert;
	var unsuccess_insert;
	var success_delete;
	var unsuccess_delete;
	var unsuccess_blank;

	var proto="http://";	

function document_setting(parent, zimlet,document_lbl_title,document_lbl_docname,document_success_insert,document_unsuccess_insert,document_success_delete,document_unsuccess_delete,document_unsuccess_blank){
	
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	zm=this.zimlet;
	
	document_title=document_lbl_title;
	document_docname=document_lbl_docname;

	 success_insert=document_success_insert;
	 unsuccess_insert=document_unsuccess_insert;
	 success_delete=document_success_delete;
	 unsuccess_delete=document_unsuccess_delete;
	unsuccess_blank=document_unsuccess_blank;
	
	
	this._createHTML();
		getTableRecords();
	
	
	this.setScrollStyle(Dwt.SCROLL);
}


String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}


function getTableRecords(){

			
	  var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/GetDocumentRecord.jsp?obj_name=fack";	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);
	

	  if (response.success == true) {
		
		var elJson =JSON.parse(response.text.trim());
		var records=elJson.records;

		var s="<table class='gridtable' align='right'><tr><td class='doc_setng_chkbx'><input type='checkbox' id='selectall' onclick='checkAll()' class='doc_setng_chkbx2'/><b></b></td><td><b>"+zm.getMessage("connector_document_document_title")+"</b></td><td><b>"+zm.getMessage("connector_document_document_docname")+"</b></td></tr>";
		for(var i=0;i<records.length;i++){
			
			if(i%2==0){
			 s+="<tr class='d0'><td class='doc_setng_chkbx'><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"' class='doc_setng_chkbx2'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
			}else{
			s+="<tr class='d1'><td class='doc_setng_chkbx'><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"' class='doc_setng_chkbx2'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
			}
					
		}
		s+="</table>";
		document.getElementById('doc_record').innerHTML=s;
		
			
	   }

}

function checkAll(){
	var record_id=document.getElementsByName("record_id");
	if(document.getElementById("selectall").checked){
		for(var i=0;i<record_id.length;i++){
			record_id[i].checked=true;
		}
		
	}else{
		for(var i=0;i<record_id.length;i++){
			record_id[i].checked=false;
		}
		
	}
}

document_setting.prototype._createHTML = function() {
	var i = 0;

	var html = new Array();

	//html[i++]="<fieldset>";
	//html[i++]="<legend>";
	html[i++]=zm.getMessage("connector_document_fieldset");
	//html[i++]="<legend>";
	html[i++]="<table>";	
		html[i++]="<tr>";
			html[i++]="<td>";
			html[i++]=document_title+"<input type='text' id='document_title'>";
			html[i++]="</td>";

			html[i++]="<td>";
			html[i++]=document_docname+"<input type='text' id='document_docname'>";
			html[i++]="</td>";

			html[i++]="<td>";
			//html[i++]="<button onclick=addRecord() >"+zm.getMessage("connector_document_btn_add")+"</button>";	
			html[i++]="<button onClick='addRecord()' style='padding-left:0px;'><img src='/service/zimlet/com_zimbra_erp_mail_connector/resources/add.png' align='absmiddle' style='height:14px;'/><font style='margin-left:4px;'>"+zm.getMessage("connector_document_btn_add")+"</font></button>";	
			html[i++]="</td>";

			html[i++]="<td>";
			//html[i++]="<button onclick=deleteRecord()>"+zm.getMessage("connector_document_btn_delete")+"</button>";
			html[i++]="<button onClick='deleteRecord()' style='padding-left:0px;'><img src='/service/zimlet/com_zimbra_erp_mail_connector/resources/delete.gif' align='absmiddle' style='height:14px;'/><font style='margin-left:4px;'>"+zm.getMessage("connector_document_btn_delete")+"</font></button>";
		
			html[i++]="</td>";			
						
			html[i++]="</tr>";
	html[i++]="</table>";

	html[i++]="<br><br>";
	html[i++]="<div id='doc_record'></div>";
	//html[i++]="</fieldset>";
	this.getHtmlElement().innerHTML = html.join("");

};



function addRecord(){
	
	 var title=document.getElementById("document_title").value;
	var docname=document.getElementById("document_docname").value;
	title=title.trim();
	docname=docname.trim();
	

	
	  
	if(title==""){
	       	var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("connector_document_title_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
		document.getElementById("document_title").focus();
		return;
		
	}
	if(document.getElementById("document_title").value.match(/^\s*$/)){
	       	var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("connector_document_title_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
		document.getElementById("document_title").focus();
		return;
			
		
	}
	if(docname=="" ){
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("connector_document_document_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
		document.getElementById("document_docname").focus();
		return;
		
			
	}
	if(document.getElementById("document_docname").value.match(/^\s*$/)){
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("connector_document_document_blank"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                a.popup();
		document.getElementById("document_docname").focus();
		return;
		
	}	
	 
	try
	{
		var dbname=zm.getUserProperty("getdatabase");
 	       	var password=zm.getUserProperty("userpassword");
		var urladdress=zm.getUserProperty("urladdress");
		var openerp_id=zm.getUserProperty("openerp_id");
        	var port=zm.getUserProperty("port");
		
		if(dbname=="" || password=="" || urladdress=="" || port=="" ){
                	var a =  appCtxt.getMsgDialog();
                	a.setMessage(zm.getMessage("connector_pushopenerp_checkconection"),DwtMessageDialog.WARNING_STYLE,zm.getMessage("warning"));
                	a.popup();
                	return;
        	}		



		 var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Documentvarify.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&obj_name="+docname+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim()+"&openerp_id="+openerp_id;

                var response = AjxRpc.invoke(null,jspurl, null, null, true);
		if(response.text.trim()=="Fail"){
			var a =  appCtxt.getMsgDialog();
                	a.setMessage(zm.getMessage("invalid_record_name"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
               		 a.popup();
			return;
		}
		
		
	}
	catch(e){
		var a =  appCtxt.getMsgDialog();
                 a.setMessage(zm.getMessage("invalid_doc_or_connection"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                  a.popup();
		return;
	
	}


var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/AddDocumentRecord.jsp?title="+title+"&docname="+docname;	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);
	if (response.success == true) {
	     
		if(response.text.trim()=="true"){
			 var a =  appCtxt.getMsgDialog();
                        a.setMessage(success_insert,DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
                         a.popup();	
			getTableRecords();
	
		}else{
			
			if(response.text.trim()=="duplicate"){
			
				var a =  appCtxt.getMsgDialog();
                 		a.setMessage(zm.getMessage("duplicate_error"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                  		a.popup();
				
			}else{
				
				var a =  appCtxt.getMsgDialog();
                                a.setMessage(zm.getMessage("duplicate_title_error"),DwtMessageDialog.CRITICAL_STYLE,zm.getMessage("error"));
                                a.popup();
				getTableRecords();
			}
				
		}	
		
	}
	document.getElementById("document_title").value="";
	document.getElementById("document_docname").value="";
	
}

function valid(){
	 var title=document.getElementById("document_title").value;
	var docname=document.getElementById("document_docname").value;

	
}

function deleteRecord(){

	var record_id=document.getElementsByName("record_id");
	var param="";
	var flg=0;
	for(var i=0;i<record_id.length;i++){
		if(record_id[i].checked){
			flg=1;
		}
		
	}
	
	if(flg==0){
		var a =  appCtxt.getMsgDialog();
                a.setMessage(zm.getMessage("connector_document_select_record"),DwtMessageDialog.WARNING_STYLE,zm.getMessage("warning"));
                a.popup();
		return;
	}

	for(var i=0;i<record_id.length;i++){
		if(record_id[i].checked){
			param+=record_id[i].value+",";
		}
	
	}

	var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/DeleteDocumentRecord.jsp?record_id="+param.substr(0,param.length-1);	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);
	  if (response.success == true) {
		if(response.text.trim()=="true"){
			getTableRecords();
			var a =  appCtxt.getMsgDialog();
                        a.setMessage(success_delete,DwtMessageDialog.INFO_STYLE,zm.getMessage("msg"));
                         a.popup();
			
		}
		
	}

}



