<%@ page language="java" import="org.apache.commons.httpclient.*, org.apache.commons.httpclient.methods.*, javax.servlet.*, com.zimbra.common.util.*"%>
<%@ page language="java" import="java.net.*, java.util.*, com.zimbra.common.util.*, com.zimbra.cs.util.NetUtil.*, com.zimbra.cs.servlet.ZimbraServlet.*"%>

<%@ page import="org.apache.commons.fileupload.*,org.apache.commons.fileupload.disk.*, org.apache.commons.io.*, java.util.*,
java.io.File, java.lang.Exception, java.io.FileInputStream, java.io.FileOutputStream, biz.source_code.base64Coder.Base64Coder, java.io.BufferedInputStream, java.io.BufferedWriter,
java.io.FileWriter" %>



<%
response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevent caching at the proxy server
%>

<%

// We're directly putting out the base64, so text/plain is our content-type

response.setContentType("text/plain");

ServletOutputStream os = response.getOutputStream();

try {
	
	// We await a messageUrl-parameter, that contains the URL for the message in Zimbra

	String messageUrl = request.getParameter("messageUrl");

	// Download the file to the local temporary path
	
	String dirPath = System.getProperty("java.io.tmpdir", "/tmp");
	String filePath = dirPath + "/eu_zedach_mail2sapticket_" + System.currentTimeMillis();
	
	File readFile = new File (filePath);
	
	FileOutputStream readFileStream = new FileOutputStream(readFile.getPath());

	// Transport the cookies sent to us back to our Zimbra request
	
	javax.servlet.http.Cookie reqCookie[] = request.getCookies();
	org.apache.commons.httpclient.Cookie[] clientCookie = new org.apache.commons.httpclient.Cookie[reqCookie.length];
	
    String hostName = request.getServerName () + ":" + request.getServerPort();
	
    for (int i=0; i<reqCookie.length; i++) {
        javax.servlet.http.Cookie cookie = reqCookie[i];
        clientCookie[i] = new org.apache.commons.httpclient.Cookie (hostName,cookie.getName(), cookie.getValue(),"/",null,false);
    }
    
	HttpState state = new HttpState();
	state.addCookies (clientCookie);
	
	// Download the file
	
	HttpClient srcClient = new HttpClient();
	srcClient.setState (state);
	
	GetMethod get = new GetMethod (messageUrl);
	
	get.setFollowRedirects (true);
	
	srcClient.getHttpConnectionManager().getParams().setConnectionTimeout (10000);
	srcClient.executeMethod(get);
	
	ByteUtil.copy(get.getResponseBodyAsStream(), false, readFileStream, false);
	
	readFileStream.close();
	
	// Read the temporary file and output its Base64-values
	
	BufferedInputStream base64In = new BufferedInputStream(new FileInputStream(readFile.getPath()));
		
	int lineLength = 72;
	
	byte[] buf = new byte[lineLength/4*3];
	
	while(true) {
		
	      int len = base64In.read(buf);
	      if (len <= 0) break;
	      os.println (new String(Base64Coder.encode(buf, 0, len)));
		
	}
	
	base64In.close();
	
	// Delete the temporary file
	
	readFile.delete();
	
} catch (Exception e) {
	
	// Catch exceptions and print them out

	os.println (e.getMessage());
	
}

%>
