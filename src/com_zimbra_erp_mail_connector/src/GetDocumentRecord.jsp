<%@ page import="com.zimbra.configuration.*" %>


<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>


	<%
		
			String obj_name=request.getParameter("obj_name");
			System.out.println("This is from jsp-------->>>>>>>>>"+obj_name);				
	
			ErpConfiguration configuration=new ErpConfiguration();
			
			out.println(configuration.getRecord(obj_name));
			
            	
	%>
