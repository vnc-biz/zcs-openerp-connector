<%@ page import="biz.vnc.zimbra.util.JSPUtil" %>
<%@ page import="com.zimbra.configuration.ErpConfiguration" %>
<%@page pageEncoding="UTF-8"%>
<%

JSPUtil.nocache(response);

		String acc_name=request.getParameter("acc_name");
		String addressBook=request.getParameter("addressBook");	    	
		System.out.println("THis is addressbook name from jsp--fdsfdfsfdsf------>>>>"+addressBook);
		String dbname=request.getParameter("dbname");
		String password=request.getParameter("password");
		String urladdress=request.getParameter("urladdress");
		String port=request.getParameter("port");
		String openerp_id=request.getParameter("openerp_id");
		String restURL=request.getParameter("rest");
		String zimbraProtocol=request.getParameter("zimbraProtocol");
		String z_portNumber=request.getParameter("z_portNumber");	
		String domainName=request.getParameter("domainName");
		restURL = new String(restURL.getBytes(request.getCharacterEncoding() != null?request.getCharacterEncoding():"UTF-8"),"UTF-8");
		System.out.println("This is rest--->from JSP>> "+restURL);

		ErpConfiguration configuration=new ErpConfiguration();
		System.out.println("This is urladdddd------------->>>>"+restURL);
		out.print(configuration.getContacts(dbname,password,urladdress,port,JSPUtil.getAuthToken(request),restURL,openerp_id,acc_name,zimbraProtocol,z_portNumber,addressBook,domainName));
%>
