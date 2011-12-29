<%@ page import="java.util.*,com.zimbra.configuration.*" %>
	<%
		/*I will not Allowed you if you are invalid user*/	
		try { 
			String url=request.getParameter("urladdress");
			String port=request.getParameter("port");
			String database=request.getParameter("database");
			String username=request.getParameter("username");
			String password=request.getParameter("userpassword");

			ErpConfiguration configuration=new ErpConfiguration();
			String s=configuration.validUser(url,port,database,username,password);

			out.println(s);
			
            		
        	} catch (Exception e) { 
   			out.println(e);
        	} 
	%>
