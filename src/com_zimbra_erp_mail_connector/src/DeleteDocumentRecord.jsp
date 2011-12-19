<%@ page import="com.zimbra.configuration.*" %>
	<%
		
		try { 
			String record_id=request.getParameter("record_id");
			
			
			ErpConfiguration configuration=new ErpConfiguration();
			out.println(configuration.deleteDocumentRecord(record_id));
			
            		
        	} catch (Exception e) { 
   			out.println(e);
        	} 
	%>
