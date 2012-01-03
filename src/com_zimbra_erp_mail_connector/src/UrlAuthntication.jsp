<%@ page import="java.util.*,com.zimbra.configuration.*" %>
<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
    <%

        try {

                String urladdress=request.getParameter("urladdress");
                String uname=request.getParameter("uname");
                String passwd=request.getParameter("passwd");
                System.out.println("this is Data------------------>>>>"+uname+urladdress+passwd);
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
            out.print(configuration.checkCalurl(uname,passwd,urladdress));





            } catch (Exception e) {
                out.println(e.getMessage());
            }
    %>

