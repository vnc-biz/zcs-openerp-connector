<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="com.zimbra.configuration.ErpConfiguration" %>
<%

JSPUtil.nocache(response);

		/*Finally send Email to open ERP*/
	try { 
		String dbname=request.getParameter("dbname");
		String password=request.getParameter("password");
		String urladdress=request.getParameter("urladdress");
		String port=request.getParameter("port");
		String msg_id=request.getParameter("msgid");
		String downloadlink=request.getParameter("downloadlink");
		String push_id=request.getParameter("push_id");
		String sessionid=request.getParameter("sessionid");
		String openerp_id=request.getParameter("openerp_id");	
		ErpConfiguration configuration=new ErpConfiguration();
		out.print(configuration.sendMail(dbname,password,urladdress,port,msg_id,downloadlink,push_id,sessionid,JSPUtil.getAuthToken(request),openerp_id));
            		
	} catch (Exception e) { 
		e.printStackTrace();
	} 
%>
