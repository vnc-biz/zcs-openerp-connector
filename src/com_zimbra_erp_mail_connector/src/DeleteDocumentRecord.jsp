<%@ page import="com.zimbra.configuration.*" %>


<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>

	<%
		
		try { 
			String record_id=request.getParameter("record_id");
			
			
			ErpConfiguration configuration=new ErpConfiguration();
			out.println(configuration.deleteDocumentRecord(record_id));
			
            		
        	} catch (Exception e) { 
   			out.println(e);
        	} 
	%>
