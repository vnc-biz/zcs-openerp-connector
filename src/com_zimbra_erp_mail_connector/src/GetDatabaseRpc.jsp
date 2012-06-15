<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="com.zimbra.configuration.ErpConfiguration" %>
<%

JSPUtil.nocache(response);

	try { 
		String url=request.getParameter("urladdress");
		String port=request.getParameter("port");
		ErpConfiguration configuration=new ErpConfiguration();
		out.println(configuration.getDatabase(url,port));
	} catch (Exception e) { 
    	System.out.println("---->>>Some problem found in GetDatabaseRpc.jsp.---->>> ");      		
	} 
%>
