<%@ page import="java.util.*,com.zimbra.configuration.*" %>
	<%
		
		try { 
			String url=request.getParameter("urladdress");
			String port=request.getParameter("port");
			
				ErpConfiguration configuration=new ErpConfiguration();
				out.println(configuration.getDatabase(url,port));
			
			
			
            		
        	} catch (Exception e) { 
          		
        	} 
	%>
