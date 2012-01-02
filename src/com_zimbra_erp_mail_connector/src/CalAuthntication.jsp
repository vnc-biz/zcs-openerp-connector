<%@ page import="java.util.*,com.zimbra.configuration.*" %>
<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
    <%

        try {
		
                String urladdress=request.getParameter("urladdress");
                String port=request.getParameter("port");
                String zcalurl=request.getParameter("zcalurl");	
		System.out.println("this is zcalurl------------------>>>>"+zcalurl);
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

	String url="http://jignesh.com/home/jignesh@jignesh.com/Calendar?fmt=ics&auth=qp&zauthtoken="+auth_token;
		zcalurl=zcalurl+"&auth=qp&zauthtoken="+auth_token;
		System.out.println("this is url of zimbra-------------->>>>>>>"+zcalurl);
            out.print(configuration.getCal(zcalurl));	



    

            } catch (Exception e) {
                out.println(e.getMessage());
            }
    %>

