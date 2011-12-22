<%@ page import="com.zimbra.configuration.*" %>


<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
	<%
		
		try { 
			String title=request.getParameter("title");
			String docname=request.getParameter("docname");
			
			ErpConfiguration configuration=new ErpConfiguration();
			out.println(configuration.addDocumentRecord(title,docname));
			
            		
        	} catch (Exception e) { 
   			out.println(e);
        	} 
	%>
