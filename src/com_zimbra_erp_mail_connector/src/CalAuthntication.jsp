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
                String z_calurl=request.getParameter("z_calurl");
		String erp_calurl=request.getParameter("erp_calurl");	
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

		z_calurl=z_calurl+"&auth=qp&zauthtoken="+auth_token;
            out.print(configuration.getCal(z_calurl,erp_calurl));	



    

            } catch (Exception e) {
                out.println(e.getMessage());
            }
    %>

