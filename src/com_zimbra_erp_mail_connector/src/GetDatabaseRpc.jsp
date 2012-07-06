<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="com.zimbra.configuration.ErpConfiguration" %>
<%

JSPUtil.nocache(response);

		String url=request.getParameter("urladdress");
		String port=request.getParameter("port");
		ErpConfiguration configuration=new ErpConfiguration();
		out.println(configuration.getDatabase(url,port));

%>
