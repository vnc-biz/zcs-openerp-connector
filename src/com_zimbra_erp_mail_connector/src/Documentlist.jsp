<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="com.zimbra.configuration.ErpConfiguration" %>
<%

JSPUtil.nocache(response);

	/*All users list from open ERP*/
	try { 
		String dbname=request.getParameter("dbname");
		String password=request.getParameter("password");
		String emailsearch=request.getParameter("emailsearch");
		String urladdress=request.getParameter("urladdress");
		String port=request.getParameter("port");
		String obj_name=request.getParameter("obj_name");
		String openerp_id=request.getParameter("openerp_id");
		ErpConfiguration configuration=new ErpConfiguration();
		out.println(configuration.getDocumentlist(dbname,password,emailsearch,urladdress,port,obj_name,openerp_id));
   	} catch (Exception e) { 
    	out.println(e.getMessage());
   	} 
%>
