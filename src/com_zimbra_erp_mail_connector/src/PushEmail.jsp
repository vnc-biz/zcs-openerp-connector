<%
/*##############################################################################
#    VNC - Virtual Network Consult AG 
#    Copyright (C) 2014-TODAY VNC - Virtual Network Consult AG 
#    (<http://www.vnc.biz>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################*/
%>
<%@page pageEncoding="UTF-8"%>
<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="biz.vnc.zimbra.openerp_zimlet.Connector" %>
<%@ page import="biz.vnc.zimbra.openerp_zimlet.JSPFactory" %>
<%

JSPUtil.nocache(response);

out.print(
	JSPFactory.getConnector(request).sendMail(
		request.getParameter("msgid"),
		JSPUtil.getServerURLPrefix(request),
		request.getParameter("push_id"),
		JSPUtil.getAuthToken(request),
		request
	)
);

%>
