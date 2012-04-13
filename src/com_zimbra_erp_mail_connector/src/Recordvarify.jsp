<%@ page import="java.util.*,com.zimbra.configuration.*" %>
<%
	response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
	response.setHeader("Pragma","no-cache"); //HTTP 1.0
	response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
<%
	try {
		String dbname=request.getParameter("dbname");
		String password=request.getParameter("password");
		String urladdress=request.getParameter("urladdress");
		String port=request.getParameter("port");
		String obj_name=request.getParameter("obj_name");
		String openerp_id=request.getParameter("openerp_id");
		ErpConfiguration configuration=new ErpConfiguration();
		out.println(configuration.varifyRecord(dbname,password,urladdress,port,obj_name,openerp_id));

	} catch (Exception e) {
			out.println(e.getMessage());
	}
%>
