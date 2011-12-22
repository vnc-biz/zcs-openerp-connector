<%@ page import="java.util.*,com.zimbra.configuration.*" %>


<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>


	<%
		
		try { 
			String url=request.getParameter("urladdress");
			String port=request.getParameter("port");
			
				ErpConfiguration configuration=new ErpConfiguration();
				out.println(configuration.getDatabase(url,port));
			
			
			
            		
        	} catch (Exception e) { 
          		
        	} 
	%>
