<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="com.zimbra.configuration.ErpConfiguration" %>
<%

JSPUtil.nocache(response);

	try {
		String dbname=request.getParameter("dbname");
		String password=request.getParameter("password");
		String urladdress=request.getParameter("urladdress");
		String port=request.getParameter("port");
		String obj_name=request.getParameter("obj_name");
		String openerp_id=request.getParameter("openerp_id");
		ErpConfiguration configuration=new ErpConfiguration();
		out.println(configuration.checkRecords(dbname,password,urladdress,port,obj_name,openerp_id));
	} catch (Exception e) {
		out.println(e.getMessage());
	}
%>
