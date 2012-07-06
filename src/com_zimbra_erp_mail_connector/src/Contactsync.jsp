<%@ page pageEncoding="UTF-8" %>
<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.openerp_zimlet.Connector" %>
<%

JSPUtil.nocache(response);

out.print(
	new Connector().getContacts(
		request.getParameter("dbname"),
		request.getParameter("password"),
		request.getParameter("urladdress"),
		request.getParameter("port"),
		JSPUtil.getAuthToken(request),
		new String(request.getParameter("rest").getBytes(request.getCharacterEncoding() != null?request.getCharacterEncoding():"UTF-8"),"UTF-8"),
		request.getParameter("openerp_id"),
		request.getParameter("acc_name"),
		request.getParameter("zimbraProtocol"),
		request.getParameter("z_portNumber"),
		request.getParameter("addressBook"),
		request.getParameter("domainName")
	)
);

%>
