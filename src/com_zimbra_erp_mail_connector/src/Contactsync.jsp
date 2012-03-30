<%@ page import="java.util.*,com.zimbra.configuration.*" %>
<%@ page import="com.zimbra.cs.account.soap.*" %>
<%@ page import="com.zimbra.cs.account.*" %>
<%@ page import="com.zimbra.cs.zclient.*" %>
<%@ page import="com.zimbra.cs.account.soap.SoapProvisioning" %>
<%@ page import="com.zimbra.cs.account.soap.SoapProvisioning.Options" %>
<%@ page import="java.net.*" %>
<%@page pageEncoding="UTF-8"%>

<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
    <%

        try {


         	SoapProvisioning soap=null;
        	Options options=new Options();
        	options.setLocalConfigAuth(true);
        	soap = new SoapProvisioning(options);
		
		String acc_name=request.getParameter("acc_name");
	    	String addressBook=request.getParameter("addressBook");	    	
		System.out.println("THis is addressbook name from jsp--fdsfdfsfdsf------>>>>"+addressBook);
        	//Account acc=soap.get(Provisioning.AccountBy.name,acc_name);
		//System.out.println("Account object has created");
        	//ZimbraAuthToken authToken = new ZimbraAuthToken(acc);
        	//String eAuthToken=null;
		//System.out.println("auth token object created");
         	//eAuthToken = authToken.getEncoded();
        	//System.out.println("eAuthToken------------------->>>>"+eAuthToken);
		//String urladd="hello";

            	String dbname=request.getParameter("dbname");
            	String password=request.getParameter("password");
            	String urladdress=request.getParameter("urladdress");
            	String port=request.getParameter("port");
	    	String openerp_id=request.getParameter("openerp_id");
	    	String restURL=request.getParameter("rest");
	    	String zimbraProtocol=request.getParameter("zimbraProtocol");
	    	String z_portNumber=request.getParameter("z_portNumber");	
	    	String domainName=request.getParameter("domainName");
	     	Cookie cookies [] = request.getCookies();
		restURL = new String(restURL.getBytes(request.getCharacterEncoding() != null?request.getCharacterEncoding():"UTF-8"),"UTF-8");
			
		System.out.println("This is rest--->from JSP>> "+restURL);
            	String auth_token=new String();
                        if (cookies != null)
                        {
                                for (int i = 0; i < cookies.length; i++)
                                {
                                        if(cookies[i].getName().equals("ZM_AUTH_TOKEN")){
                                        auth_token=cookies[i].getValue();
                                        }
                                }
                         }


            	ErpConfiguration configuration=new ErpConfiguration();
		System.out.println("This is urladdddd------------->>>>"+restURL);
            	out.print(configuration.getContacts(dbname,password,urladdress,port,auth_token,restURL,openerp_id,acc_name,zimbraProtocol,z_portNumber,addressBook,domainName));

            } catch (Exception e) {
		System.out.println("Exception---"+e);
                out.println(e.getMessage());
		e.printStackTrace();
            }
    %>
