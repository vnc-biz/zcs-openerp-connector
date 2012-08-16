<%
/*##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH 
#    (<http://www.vnc.biz>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################*/
%>
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
