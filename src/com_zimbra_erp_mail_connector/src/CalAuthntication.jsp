<%@ page import="java.util.*,com.zimbra.configuration.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.net.*" %>
<%@ page import="com.zimbra.cs.account.soap.*" %>
<%@ page import="com.zimbra.cs.account.*" %>
<%@ page import="com.zimbra.cs.zclient.*" %>
<%@ page import="com.zimbra.cs.account.soap.SoapProvisioning" %>
<%@ page import="com.zimbra.cs.account.soap.SoapProvisioning.Options" %>

<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
    <%

        try {
	
	String soapUrl="https://localhost:7071/service/admin/soap";
	 SoapProvisioning soap=null;
        Options options=new Options();
        options.setLocalConfigAuth(true);
        soap = new SoapProvisioning(options);


	String uname=request.getParameter("uname");
	Account acc=soap.get(Provisioning.AccountBy.name,uname);
    	System.out.println("Acccccccc-------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>."+acc);
	ZimbraAuthToken authToken = new ZimbraAuthToken(acc);
	System.out.print("Auth token------>>>"+authToken);
	String eAuthToken=null;
   	 eAuthToken = authToken.getEncoded();
	System.out.println("eAuthToken------------------->>>>"+eAuthToken);    
	ZMailbox client = ZMailbox.getByAuthToken(eAuthToken, "https://localhost:7071/service/admin/soap");
	URI rest=client.getRestURI("open_ERP");
	System.out.println("First line calll jsp----------------->>>>>>>>>>");
		
	
	System.out.println("Before URI calleeeee--------------->>>>>");	
	
		
                String urladdress=request.getParameter("urladdress");
                String port=request.getParameter("port");
                String z_calurl=rest.toString();
		String erp_uname=request.getParameter("erp_uname");
		String erp_passwd=request.getParameter("erp_passwd");
		System.out.println("This is Zcalurl-------------------->>>>>"+z_calurl);
		//String z_calurl="http://jignesh.com:80/home/jignesh@jignesh.com/open_ERP";
		String erp_calurl=request.getParameter("erp_calurl");	
         Cookie cookies [] = request.getCookies();

	/*..............................................*/
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
	/*...................................................*/	
	
		ErpConfiguration configuration=new ErpConfiguration();

		z_calurl=z_calurl+"?fmt=ics&auth=qp&zauthtoken="+auth_token;
		System.out.println("This is final zcal------------>>>>>>>"+z_calurl);
            out.print(configuration.getCal(z_calurl,erp_calurl,erp_uname,erp_passwd));	



    

            } catch (Exception e) {
                
			out.println("Inside Exception--------->>>");	
			out.println(e.getMessage());
            }
    %>

