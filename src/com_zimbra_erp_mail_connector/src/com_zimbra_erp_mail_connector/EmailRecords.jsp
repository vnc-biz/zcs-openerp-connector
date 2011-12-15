<%@page import="com.zimbra.cs.account.soap.*,com.zimbra.cs.dav.service.method.Options,com.zimbra.cs.zclient.*,com.zimbra.common.soap.Element,java.util.*" %>


<%

	try{
		SoapProvisioning spAdmin = new SoapProvisioning();
		spAdmin.soapSetURI("https://localhost:7071/service/admin/soap");
		spAdmin.soapAdminAuthenticate("admin", "123456");
		
		Domain domain = spAdmin.getDomainByName("kapil.com");
		List<Account> accounts = domain.getAllAccounts();
		for (Account account : accounts) {
			//Options options = new Options(spAdmin.getAuthToken().getValue(), adminURL);
			Options options2=new Options();
			ZMailbox mailbox=new ZMailbox(options2);
			
		}
	
	}catch(Exception e){

			e.printStackTrace();
	}




%>
