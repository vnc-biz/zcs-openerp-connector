<%@ page import="com.zimbra.configuration.*" %>
<%@ page import="org.json.simple.*" %>

<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>
	<%
		/*I will add your name in database if it will correct*/
		try { 
			String title=request.getParameter("title");
			String docname=request.getParameter("docname");
			
		/*JSONObject mainObj=new JSONObject();
		JSONObject obj=new JSONObject();
		obj.put("title",title);
		obj.put("docname",docname);
		mainObj.put("doc_list",obj);
		System.out.println("This is json from jsp---->>>>"+mainObj.toString());	
		out.println(mainObj.toString());*/
		ErpConfiguration configuration=new ErpConfiguration();
		out.println(configuration.addDocumentRecord(title,docname));
            		
        	} catch (Exception e) { 
   			out.println("This is exception from adddocumentrecords----->>>>>"+e);
        	}
	%>
