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

			
	  var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/GetDocumentRecord.jsp";	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);
	

	  if (response.success == true) {
		
		var elJson =JSON.parse(response.text.trim());
		var records=elJson.records;

		var s="<table class='gridtable' align='right'><tr><td><input type='checkbox' id='selectall' onclick='checkAll()'/><b></b></td><td><b>"+zm.getMessage("connector_document_document_title")+"</b></td><td><b>"+zm.getMessage("connector_document_document_docname")+"</b></td></tr>";
		for(var i=0;i<records.length;i++){
			
			if(i%2==0){
			 s+="<tr class='d0'><td><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
			}else{
			s+="<tr class='d1'><td><input type=checkbox id='record_id' name='record_id' value='"+records[i].id+"'/></td><td>"+records[i].title+"</td><td>"+records[i].docname+"</td></tr>";
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
			html[i++]="<button onclick=addRecord()>"+zm.getMessage("connector_document_btn_add")+"</button>";		
			html[i++]="</td>";

			html[i++]="<td>";
			html[i++]="<button onclick=deleteRecord()>"+zm.getMessage("connector_document_btn_delete")+"</button>";		
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

	
	  
	if(title==""){
	        alert(zm.getMessage("connector_document_title_blank"));
		document.getElementById("document_title").focus();
		return;
		
	}
	if(document.getElementById("document_title").value.match(/^\s*$/)){
		alert(zm.getMessage("connector_document_title_blank"));
		document.getElementById("document_title").focus();
		return;
			
		
	}
	if(docname=="" ){
		alert(zm.getMessage("connector_document_document_blank"));
		document.getElementById("document_docname").focus();
		return;
		
			
	}
	if(document.getElementById("document_docname").value.match(/^\s*$/)){
		alert(zm.getMessage("connector_document_document_blank"));
		document.getElementById("document_docname").focus();
		return;
		
	}	
	 
	try
	{
		var dbname=zm.getUserProperty("getdatabase");
 	       	var password=zm.getUserProperty("userpassword");
		var urladdress=zm.getUserProperty("urladdress");
        	var port=zm.getUserProperty("port");
		
		if(dbname=="" || password=="" || urladdress=="" || port=="" ){
                	alert(zm.getMessage("connector_pushopenerp_checkconection"));
                	/*document.getElementById("document_name"+push_random+"").innerHTML=""+fixheading;
                	document.getElementById("mailsearch"+push_random+"").focus();*/
                	return;
        	}		



		 var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/Documentvarify.jsp?dbname="+dbname.trim()+"&password="+password.trim()+"&obj_name="+docname+"&urladdress="+(proto+urladdress.trim())+"&port="+port.trim();

                var response = AjxRpc.invoke(null,jspurl, null, null, true);
		if(response.text.trim()=="Fail"){
			alert(zm.getMessage("invalid_record_name"));
			return;
		}
		
		
	}
	catch(e){
		alert(zm.getMessage("invalid_doc_or_connection"));
		return;
	
	}


var jspurl="/service/zimlet/com_zimbra_erp_mail_connector/AddDocumentRecord.jsp?title="+title+"&docname="+docname;	
	  var response = AjxRpc.invoke(null,jspurl, null, null, true);
	if (response.success == true) {
	     
		if(response.text.trim()=="true"){
			alert(success_insert);
			getTableRecords();
	
		}else{
			
			if(response.text.trim()=="duplicate"){
				alert(zm.getMessage("duplicate_error"));
				
			}else{

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
		alert(zm.getMessage("connector_document_select_record"));
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
			alert(success_delete);
			
		}
		
	}

}



