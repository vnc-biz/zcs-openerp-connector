<%@ page import="java.utill.*"%>
<%@ page import="com.zimbra.configuration.*" %>
<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
<%


	String auth_token=null;
	String MsgId=request.getParameter("msgid");
	Cookie cookies [] = request.getCookies();
        String sessionID = null;
        

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
        sessionID = request.getParameter("sessionid");
	String urldownload=request.getParameter("urldownload");
	out.println(configuration.getEmailInfo(sessionID,auth_token,MsgId,urldownload));
	
        
%>
