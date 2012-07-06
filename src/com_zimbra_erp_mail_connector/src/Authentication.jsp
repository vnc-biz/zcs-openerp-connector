<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.openerp_zimlet.Connector" %>
<%

JSPUtil.nocache(response);

out.println(
	new Connector().validUser(
		request.getParameter("urladdress"),
		request.getParameter("port"),
		request.getParameter("database"),
		request.getParameter("username"),
		request.getParameter("userpassword")
	)
);

%>
