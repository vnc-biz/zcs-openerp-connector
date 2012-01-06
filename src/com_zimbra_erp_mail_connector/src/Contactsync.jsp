<%@ page import="java.util.*,com.zimbra.configuration.*" %>
<%@ page import="com.zimbra.cs.account.soap.*" %>
<%@ page import="com.zimbra.cs.account.*" %>
<%@ page import="com.zimbra.cs.zclient.*" %>
<%@ page import="com.zimbra.cs.account.soap.SoapProvisioning" %>
<%@ page import="com.zimbra.cs.account.soap.SoapProvisioning.Options" %>
<%@ page import="java.net.*" %>
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
		
		String acc_name=request.getParameter("acc_name");
        Account acc=soap.get(Provisioning.AccountBy.name,acc_name);
        ZimbraAuthToken authToken = new ZimbraAuthToken(acc);
        String eAuthToken=null;
         eAuthToken = authToken.getEncoded();
        System.out.println("eAuthToken------------------->>>>"+eAuthToken);
        ZMailbox client = ZMailbox.getByAuthToken(eAuthToken, "https://localhost:7071/service/admin/soap");
        URI rest=client.getRestURI("openERP");
	String urladd=rest.toString();

            String dbname=request.getParameter("dbname");
            String password=request.getParameter("password");
            String urladdress=request.getParameter("urladdress");
            String port=request.getParameter("port");
	    	
	    //String urladd=request.getParameter("urladd");
	     Cookie cookies [] = request.getCookies();
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
		System.out.println("This is urladdddd------------->>>>"+urladd);
            out.print(configuration.getContacts(dbname,password,urladdress,port,auth_token,urladd));
	//out.print("this is response from jsp"+dbname+password+urladdress+port);

            } catch (Exception e) {
                out.println(e.getMessage());
            }
    %>
