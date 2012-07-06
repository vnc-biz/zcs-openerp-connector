<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.openerp_zimlet.Connector" %>
<%

JSPUtil.nocache(response);

out.println(
	new Connector().getDocumentlist(
		request.getParameter("dbname"),
		request.getParameter("password"),
		request.getParameter("emailsearch"),
		request.getParameter("urladdress"),
		request.getParameter("port"),
		request.getParameter("obj_name"),
		request.getParameter("openerp_id")
	)
);

%>
