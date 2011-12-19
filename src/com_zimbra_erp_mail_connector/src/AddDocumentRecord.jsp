<%@ page import="com.zimbra.configuration.*" %>
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
