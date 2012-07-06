<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.openerp_zimlet.Connector" %>
<%

JSPUtil.nocache(response);

out.println(
	new Connector().getDatabase(
		request.getParameter("urladdress"),
		request.getParameter("port")
	)
);

%>
