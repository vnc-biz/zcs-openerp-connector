<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.openerp_zimlet.Connector" %>
<%

JSPUtil.nocache(response);

out.print(
	new Connector().sendMail(
		request.getParameter("dbname"),
		request.getParameter("password"),
		request.getParameter("urladdress"),
		request.getParameter("port"),
		request.getParameter("msgid"),
		request.getParameter("downloadlink"),
		request.getParameter("push_id"),
		request.getParameter("sessionid"),
		JSPUtil.getAuthToken(request),
		request.getParameter("openerp_id")
	)
);

%>
