package com.zimbra.configuration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import redstone.xmlrpc.*;
import java.lang.reflect.Method;
import java.util.Arrays;
import com.csvreader.*;
import redstone.xmlrpc.XmlRpcClient;
import java.nio.charset.Charset;
import java.util.*;
import java.io.*;
import java.sql.*;
import java.lang.reflect.*;
import com.google.gson.reflect.*;
import java.math.*;
import org.json.JSONObject;
import com.google.gson.*;
import com.google.gson.JsonParser;
import java.net.URL;
//import com.zimbra.common.auth.*;
//import com.zimbra.cs.client.soap.*;
//import com.zimbra.cs.client.*;
import java.net.URL;
import java.net.URLConnection;
import java.net.*;
import org.json.JSONArray;
import java.text.SimpleDateFormat;
import java.net.URLEncoder;
import java.io.*;

import java.lang.Exception;

public class ErpConfiguration
{

	XmlRpcClient server;
	Connection con;
	Statement stmt;
	PreparedStatement prest;
	JSONObject jsonobj,mainobj,jsonstr;
	ArrayList<Object> list;
	private static String MYSQL_PASSWORD = null;
	Object idList=null;

	private Pattern pattern;
	private Matcher matcher;
	private static final String EMAIL_PATTERN ="^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	//private static final String EMAIL_PATTERN ="^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	//private static final String EMAIL_PATTERN ="^[\\w\\-]([\\.\\w])+[\\w]+@([\\w\\-]+\\.)+[A-Za-z0-9]{2,4}$";

	static
	{
		try
		{
			String[] params = {"/opt/zimbra/bin/zmlocalconfig","-s","|","/bin/grep","zimbra_mysql_password","|","/usr/bin/cut","-d","\" \" ","-f","3"};
			String[] cmd = {"/bin/sh","-c","/opt/zimbra/bin/zmlocalconfig -s | /bin/grep zimbra_mysql_password | /usr/bin/cut -d\" \" -f 3"};
			Runtime r = Runtime.getRuntime();
			Process p = r.exec(cmd);
			InputStream stdin = p.getInputStream();
			InputStreamReader isr = new InputStreamReader(stdin);
			BufferedReader br = new BufferedReader(isr);
			MYSQL_PASSWORD = br.readLine();
			//System.out.println("Mysql password: " + MYSQL_PASSWORD);

		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}


	public String getDatabase(String url,String port)
	{

		try
		{
			String fixurl="/xmlrpc/db";

			XmlRpcClient client = new XmlRpcClient(new URL(url+":"+port+fixurl),true);
			Object token = (Object)client.invoke( "list", new Object[] {} );
			return token.toString();


		}
		catch(Exception ex)
		{
			System.out.print(ex+"Exception in  getDatabase");
			return "fail";
		}


		/*	Object list=null;
			try{
					//System.out.print("url"+url);
					String fixurl="/xmlrpc";
					XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
						config.setServerURL(new URL(url+":"+port+fixurl));

					XmlRpcClient client = new XmlRpcClient();
						client.setConfig(config);
					Object[] params = new Object[]{};
						String result = (String) client.execute("list", params);

					//System.out.print(result);



			}
			catch(Exception e){
				System.out.println(e.getMessage());
			}

			return list.toString();	*/

	}

	public String validUser(String url,String port,String database,String username,String password)
	{


		try
		{
			String fixurl="/xmlrpc/common";

			XmlRpcClient client = new XmlRpcClient(new URL(url+":"+port+fixurl),true);
			database=database.trim();
			Object token = (Object)client.invoke( "login", new Object[] {database,username,password} );
			if(token instanceof java.lang.Integer)
			{
				return token.toString();
			}
			else
			{
				return "false";
			}



		}
		catch(Exception ex)
		{
			System.out.print(ex+"Exception in  valid user");
			return "false";
		}



		/*try{





				Object login=null;
				String fixurl="/xmlrpc/common";
		        		//server = new XmlRpcClient(url+":"+port+fixurl);
				server = new XmlRpcClient();

				Vector vect=new Vector();
				vect.add(database.trim());
				vect.add(username);
				vect.add(password);

				login=(Object)server.execute("login",vect);
				if(login instanceof java.lang.Integer){
					return "true";
				}
				else{
					return "false";
				}
			}catch(Exception e){
					return e.toString();
			}*/

	}


	public String addDocumentRecord(String title,String docname)
	{

		int exec=0;
		try
		{
			docname=docname.toLowerCase();
			Class.forName("com.mysql.jdbc.Driver");
			con =DriverManager.getConnection("jdbc:mysql://localhost:7306/zimbra","zimbra",MYSQL_PASSWORD);
			stmt = con.createStatement();
			Statement stmtread;

			String sqlread="select * from tbl_document_setting where docname='" + docname +"'";
			stmtread=con.createStatement();
			ResultSet rs=stmtread.executeQuery(sqlread);
			if(rs.next())
			{

				return "duplicate";

			}


			String sql = "insert into tbl_document_setting(title,docname) values(?,?)";

			prest = con.prepareStatement(sql);
			prest.setString(1,title);
			prest.setString(2,docname);
			exec=prest.executeUpdate();


		}
		catch(Exception e)
		{
			e.printStackTrace();
			return "false";
		}
		if(exec<=0)
		{
			return "false";
		}
		else
		{
			return "true";
		}


	}

	public String deleteDocumentRecord(String record_id)
	{

		int exec=0;
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			con =DriverManager.getConnection("jdbc:mysql://localhost:7306/zimbra","zimbra",MYSQL_PASSWORD);
			stmt = con.createStatement();

			String sql = "delete from tbl_document_setting where id in ("+record_id+")";
			exec=stmt.executeUpdate(sql);


		}
		catch(Exception e)
		{
			System.out.println(e);
		}

		if(exec<=0)
		{
			return "false";
		}
		else
		{
			return "true";
		}


	}


	public String getRecord(String obj_name)
	{
		String temp=null;
		list=new ArrayList<Object>();

		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			con =DriverManager.getConnection("jdbc:mysql://localhost:7306/zimbra","zimbra",MYSQL_PASSWORD);
			stmt = con.createStatement();

			String sql="select * from tbl_document_setting";
			String sql1="select * from tbl_document_setting where docname='"+obj_name+"'";
			//System.out.println("object name is this---------->>>>>>>>>"+obj_name);
			if(obj_name.equals("fack"))
			{
				//System.out.println("fack is present--------------->>>>");
				prest = con.prepareStatement(sql);


			}
			else
			{
				prest = con.prepareStatement(sql1);

			}
			ResultSet rs=prest.executeQuery();


			//System.out.println("result is this---------->>>>>>>>>"+rs.toString());
			mainobj=new JSONObject();

			while(rs.next())
			{
				jsonobj=new JSONObject();
				jsonobj.put("id",Integer.toString(rs.getInt(1)));
				jsonobj.put("title",rs.getString(2));
				jsonobj.put("docname",rs.getString(3));
				list.add(jsonobj);


			}
			mainobj.put("records",list);


		}
		catch(Exception e)
		{
			// e.printStackTrace();
		}
		if(mainobj == null)
		{
			//System.out.println("Object is nullllllllllllllllllllllllllllll");
		}
		else
		{
			//System.out.println("Object is not nulllllllllllllllllllllllll");
		}
		System.out.println("This is record list----->>>>>"+mainobj.toString());
		return mainobj.toString();

	}


	public String getDocumentlist(String dbname,String password,String emailsearch,String urladdress,String port,String obj_name,String openerp_id)
	{


		try
		{
			String fixurl="/xmlrpc/object";
			Gson gson = new Gson();
			Vector child=new Vector();
			Vector parent=new Vector();
			Integer op_id=Integer.parseInt(openerp_id);
			boolean valid;
			valid=validate(emailsearch);
			if(emailsearch.equals(""))
			{

				//System.out.println("This is openerp_id--------->>>>>>"+openerp_id);

				XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
				Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",new Vector()} );
				if(token.toString().length()!=2)
				{

					return gson.toJson(token);
				}
				else
				{
					return "bl";
				}

			}
			else
			{


				if(valid==true)
				{

					if(obj_name.equals("res.partner") || obj_name.equals("res.partner.address") || obj_name.equals("crm.lead"))
					{

						//System.out.println("Inside res.partner or res.partner.address-------------->>>>>>>>>>>>>>>>>");
						XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
						child.add("email");
						child.add("=");
						child.add(emailsearch);
						parent.add(child);
						Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search","",parent} );
						//System.out.println("Call success------------------->>>>>>>>>"+token.toString());
						if(token.toString().length()!=2)
						{

							return gson.toJson(token);

						}
						else
						{
							return "bl";
						}


					}
					else
					{

						XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
						Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",emailsearch,new Vector()} );
						if(token.toString().length()!=2)
						{

							return gson.toJson(token);
						}
						else
						{
							return "bl";
						}

					}
				}
				else
				{

					XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
					Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",emailsearch,new Vector()} );
					if(token.toString().length()!=2)
					{

						return gson.toJson(token);
					}
					else
					{
						return "bl";
					}


				}


			}





		}
		catch(Exception ex)
		{
			System.out.print(ex+"Exception in  getdocumenlist");
			ex.printStackTrace();
			return "Exception";
		}





	}



	/*Gel Email Information from */

	JsonObject objectss;


	public String sendMail(String dbname,String password,String urladdress,String port,String msg_id,String downloadlink,String push_id,String sessionid, String authToken,String openerp_id)
	{


		//System.out.print("send mail called"+"database:"+dbname+"Password:"+password+"URLaddress:"+urladdress+"port:"+port+"msg_id:"+msg_id+"Link:"+downloadlink+"push_ID:"+push_id+"sessionid:"+sessionid+"AuthToken:"+authToken);
		String rowdata=null;
		String rowdata_path=null;
		JSONObject jso=null;
		Object list=null;
		String val=null;
		String body = new String();
		String Email=null;
		String address=new String();
		String subject=new String();
		String from = new String();
		HttpURLConnection connection = null,row_connection=null;
		Vector attach_name=new Vector();
		InputStream inputstream=null;
		Vector mail_to=null;
		Vector attach_encode=null;
		Vector mail_cc=null;
		Vector mail_bcc=null;
		Vector mail_replyto=null;
		Vector mail_inreplyto=null;
		String mail_sentdate=null;
		String ContentType=null;

		Hashtable param=null;
		Vector main_vec=null;
		Integer op_id=Integer.parseInt(openerp_id);
		try
		{
			String msgID = msg_id;


			if(msgID != null)
			{

				/*Row data*/

				//System.out.print("Inside msg is not null");

				rowdata_path=downloadlink+"?auth=qp&id="+URLEncoder.encode(msgID,"UTF-8")+"&zauthtoken="+URLEncoder.encode(authToken,"UTF-8");
				URL urlrow=new URL(rowdata_path);
				//System.out.println("This is url row-------------->>>>>>>>>>>>>>>>>>>"+urlrow.toString());
				row_connection = (HttpURLConnection)urlrow.openConnection();
				row_connection.connect();

				InputStream rowis =row_connection.getInputStream();


				int rowlineLength = 72;
				StringBuffer rowstrbuffer=new StringBuffer();
				byte[] rowbuf = new byte[rowlineLength/4*3];
				int rowlen = 0;
				while((rowlen = rowis.read(rowbuf)) != -1)
				{
					rowstrbuffer.append(new String(rowbuf));
					rowbuf = null;
					rowbuf = new byte[rowlineLength/4*3];
				}

				rowdata=new String(rowstrbuffer);
				//System.out.println("This is rawdate======================="+rowdata);

				/*End roe data*/


				/*row data Hashtable*/

				main_vec=new Vector();
				Vector<String> module_vec=new Vector<String>();
				Vector mail_vec=new Vector();

				module_vec.add(new String("ref_ids"));
				module_vec.add(push_id);

				mail_vec.add("message");
				mail_vec.add(rowdata);



				main_vec.add(module_vec);
				main_vec.add(mail_vec);
				/*End of row data*/

				/*send the mail to open-erp url*/

				String fixurl="/xmlrpc/object";
				XmlRpcClient client;
				client=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
				dbname=dbname.trim();
				//System.out.println("Going to call histary_message from sendMail");
				list=(Object)client.invoke("execute",new Object[] {dbname,op_id,password,"zimbra.partner","history_message",main_vec});
				row_connection.disconnect();
				rowstrbuffer.delete(0,rowstrbuffer.length());

				rowis.close();
				try
				{
					main_vec.clear();
					mail_vec.clear();
					module_vec.clear();
				}
				catch(Exception ex)
				{
					System.out.print(ex+"Exception in clear vector");
				}


			}
			else
			{
				//System.out.print("Else part of msg");
				Email="Damn message is null";
			}
		}
		catch(Exception e)
		{
			//System.out.print("inside Exception");
			e.printStackTrace();
		}

		//System.out.print("This is list"+list.toString()+"End of list");
		return list.toString();


	}

	public String checkRecords(String dbname,String password,String urladdress,String port,String obj_name,String openerp_id)
	{

		Object list=null;
		Object login=null;
		Object lis=null;
		Gson gson = new Gson();
		String m=new String();
		Integer op_id=Integer.parseInt(openerp_id);

		Vector params=null;
		String s=null;

		int cnt=0;

		try
		{
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists;;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			//System.out.println("this is address----------->>>>>"+urladdress+":"+port+fixurl+"End of url<<<<<<<<<<--------");
			s=new String();
			dbname=dbname.trim();


			lis=(Object)lists.invoke("execute",new Object[] {dbname,op_id,password,obj_name,"name_search",new Vector()});
			System.out.println("this is Documentvarify-----response--->>"+lis.toString());




		}
		catch (Exception e)
		{
			System.out.println("fail");
			e.printStackTrace();
			return("Fail");

		}

		if(lis.toString()!="")
		{
			return gson.toJson(lis);

		}
		else
		{

			return "Fail";
		}

	}


	public String getContacts(String dbname,String password,String urladdress,String port,String auth_token,String urladd,String openerp_id)
	{

		Gson gson = new Gson();
		Integer op_id=Integer.parseInt(openerp_id);
		Object contactlist;
		List<Integer> intList;
		try
		{
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists,contact;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);

			dbname=dbname.trim();
			//System.out.println("Before xmlrpc call------------->>>>>>>>>>>>>>>>>>>>");

			//System.out.println("this is integer------>>>>>>"+op_id);
			Object objlist = lists.invoke("execute",new Object[] {dbname,op_id,password,"res.partner.address","search",new Vector()});
			//System.out.println("----------------------------------> Id list:"+objlist.toString());
			Vector nameList = new Vector();
			/*nameList.add("name");
			nameList.add("city");
			nameList.add("street");
			nameList.add("street2");
			nameList.add("zip");
			nameList.add("phone");
			nameList.add("fax");
			nameList.add("email");
			nameList.add("mobile");
			nameList.add("partner_id");*/
			//BufferedReader br=new BufferedReader(new FileReader("/com/zimbra/configuration/contactFields.properties"));
			InputStream is=getClass().getResourceAsStream("/com/zimbra/configuration/contactFields.properties");

			BufferedReader br=new BufferedReader(new InputStreamReader(is));
			String[] cField;
			Vector heading=new Vector();
			String str;
			int k=0;
			while((str=br.readLine())!=null)
			{
				try
				{
					cField=str.split("=");
					nameList.add(cField[0].trim());

					//System.out.println("length of cField:"+cField.length+"   --------------- >key:"+cField[0].trim()+" value:"+cField[1].trim());


					heading.add(cField[1].trim());

				}
				catch(Exception r)
				{
					//System.out.print("--------------------------->>>>>Exception");
					r.printStackTrace();
				}
			}
			//System.out.println("------------------------------------>  End of file... Contacts heading read successfully from file...");
			contact=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);

			XmlRpcStruct contactList=(XmlRpcStruct)lists.invoke("execute",new Object[] {dbname,op_id,password,"res.partner.address","export_data",objlist,nameList});
			//System.out.print("----> excuting  hi this is contact list============"+contactList.getArray("datas") +" ----> end new.");


			int len1=contactList.getArray("datas").size();/*This is number of Contacts*/
			int len2=nameList.size();/*This is number of fields*/
			String name,email;
			XmlRpcArray arr=contactList.getArray("datas");
			CsvWriter csvFile=new CsvWriter("/tmp/myData.csv",',',Charset.forName("UTF-8"));
			csvFile.setForceQualifier(true);
			for(int t=1; t<heading.size(); t++)
			{
				csvFile.write(heading.get(t).toString());
			}
			csvFile.endRecord();

			for(int i=0; i<len1; i++)
			{
				int flag=0;
				for(int j=1; j<len2; j++)
				{

					name=arr.getArray(i).get(j).toString();
					//System.out.println("Name----------->>>>>>>>"+name);

					if(j==1)
					{
						if(name.equals("false"))
						{
							//name=arr.getArray(i).get(0).toString();
							flag=1;
							//System.out.println("----------------- > partner ID:"+name);
						}
						else
						{


						}

					}
					if(name.equals("false"))
						name="";
					//System.out.println("NNNNNNNNNNNNNNNNNNNNName : " + name);
					csvFile.write(name);
				}
				csvFile.endRecord();
			}
			csvFile.flush();
			csvFile.close();

			Runtime r=Runtime.getRuntime();

			//System.out.println("This is curl---------------------->>>>>>>>>>>>"+"curl --upload-file /tmp/myData.csv "+urladd+"?fmt=csv&auth=qp&zauthtoken="+auth_token);
			try
			{

				Process p=r.exec("curl -k -m 10000 --upload-file /tmp/myData.csv "+urladd+"?fmt=csv&auth=qp&zauthtoken="+auth_token);
				p.waitFor();
				//System.out.println("Exit status for export ICS to OpenERP is------------>>>>>>>>>>>>>>>> : " + p.exitValue());

				return "success";

			}
			catch(IllegalThreadStateException ex)
			{
				ex.printStackTrace();
				return "fail";

			}

			/*if(p.exitValue()==0){
						//System.out.println("Inside success----------------------->>>>>>>>>>>>>>>>>>>>>>>");
						return "success";
					}else{

						//System.out.println("Inside fail----------------------->>>>>>>>>>>>>>>>>>>>>>>");
						return "fail";
					}*/

		}
		catch (Exception e)
		{
			System.out.print("Exception in xmlrpc contact");
			e.printStackTrace();
			return "fail";
		}
	}



	/*...............................................*/

	public String getCal(String z_calurl,String erp_calurl,String erp_uname,String erp_passwd)
	{

		/*Export calendar from zimbra.........*/
		try
		{

			//String strurl="http://jignesh.com/home/jignesh@jignesh.com/Calendar?fmt=ics";
			HttpURLConnection connection = null;
			URL url1=new URL(z_calurl);
			connection=(HttpURLConnection)url1.openConnection();
			connection.connect();
			System.out.println("This is message---------------->>>>>"+connection.getResponseMessage()+"End of the message<<<<<<<<<<<<");
			//System.out.println("connection is successfull");
			int calLength=connection.getContentLength();
			Byte[] cal;
			InputStream in=connection.getInputStream();

			FileOutputStream fo=new FileOutputStream("/tmp/cal.ics");
			int rowlineLength = 72;
			while(true)
			{

				int rowlen = in.read();
				if (rowlen <= -1) break;
				fo.write(rowlen);

			}

			/*Import to Calendar to open ERP*/
			Runtime r=Runtime.getRuntime();
			String com="curl -k -u"+" "+erp_uname+":"+erp_passwd+" "+"--upload-file /tmp/cal.ics"+" "+erp_calurl;
			System.out.println("This is open ERP url for curl"+com);
			Process p=r.exec(com);

			p.waitFor();
			System.out.println("Exit status for export ICS to OpenERP is------------>>>>>>>>>>>>>>>> : " + p.exitValue());
			if(p.exitValue() !=0)
			{
				return "fail";
			}

			/*Export calendar from open ERP*/

			HttpURLConnection connection_erp = null;
			//String strurl="http://192.168.1.106:8069/webdav/doc1/calendars/users/admin/c/Meetings.ics";
			URL erpurl=new URL(erp_calurl);
			connection_erp=(HttpURLConnection)erpurl.openConnection();
			//String uname="admin";
			//String passwd="admin";
			String authString =erp_uname+":"+erp_passwd;
			authString = (new sun.misc.BASE64Encoder()).encode(authString.getBytes());
			//System.out.println("this is encoding------->>>>>"+authString);

			connection_erp.setRequestProperty("Authorization","Basic "+authString);


			connection_erp.connect();
			InputStream inerp=connection_erp.getInputStream();
			FileOutputStream fo1=new FileOutputStream("/tmp/calfromerp.ics");
			while(true)
			{

				int rowlen1 = inerp.read();
				if (rowlen1 <= -1) break;
				fo1.write(rowlen1);

			}



			/*Import to Calendar to zimbra*/
			Runtime r1=Runtime.getRuntime();
			String command="curl -k --upload-file /tmp/calfromerp.ics"+" "+z_calurl;
			//System.out.println("z_calurl----------------------->>>>>>>"+command);
			Process p1=r1.exec(command);
			p1.waitFor();
			System.out.println("ICS Import from openERP is : " + p1.exitValue());
			System.out.print("------------>>>>>successs Import");
			if(p1.exitValue()==0)
			{
				return "success";
			}
			else
			{
				return "fail";
			}
		}
		catch(Exception ex)
		{
			System.out.print("Exception ------>>>>");
			ex.printStackTrace();
			return "fail";
		}




	}
	/*...............................*/

	public String checkCalurl(String uname,String passwd,String url)
	{
		String response=null;

		try
		{
			HttpURLConnection connection_url = null;
			//String strurl="http://192.168.1.106:8069/webdav/doc1/calendars/users/admin/c/Meetings.ics";
			URL chkurl=new URL(url);
			//System.out.println("This is url in checkURL----------->>>>>"+url);

			connection_url=(HttpURLConnection)chkurl.openConnection();

			connection_url.setConnectTimeout(200);

			String authString =uname+":"+passwd;
			authString = (new sun.misc.BASE64Encoder()).encode(authString.getBytes());
			//System.out.println("This is encoding in check URL------->>>>>"+authString);

			connection_url.setRequestProperty("Authorization","Basic "+authString);

			connection_url.connect();
			response=connection_url.getResponseMessage();
			//System.out.println("This is response code---------->>>>"+connection_url.getResponseCode());
			//System.out.println("----------->>>>>>Content response"+response);

		}
		catch(Exception ex)
		{
			System.out.print("Exception ------>>>>");
			ex.printStackTrace();

		}

		return response;

	}

	public boolean validate(String hex)
	{

		pattern = Pattern.compile(EMAIL_PATTERN);
		matcher = pattern.matcher(hex);
		return matcher.matches();

	}


	/*...........................*/
	public String sendAppt(String dbname,String password,String urladdress,String port,String msg_id,String downloadlink,String push_id,String sessionid, String authToken,String openerp_id)
	{

		try
		{
			System.out.println("-------------->>>>>>>Data from java"+dbname+password+urladdress+port+msg_id+downloadlink+sessionid);

			String rowdata=null;
			String rowdata_path=null;
			JSONObject jso=null;
			Object list=null;
			HttpURLConnection connection = null,row_connection=null;
			InputStream inputstream=null;
			String ContentType=null;

			Integer op_id=Integer.parseInt(openerp_id);
			Hashtable param=null;
			Vector main_vec=null;
			String msgID = msg_id;
			/*Row data*/

			System.out.print("Inside msg is not null");
			URL downloadlinkURL= new URL(downloadlink);
			rowdata_path=downloadlinkURL+"?auth=qp&id="+msgID+"&mime=text/plain&noAttach=1"+"&zauthtoken="+URLEncoder.encode(authToken,"UTF-8");
			URL urlrow=new URL(rowdata_path);
			System.out.println("This is url row for Appointment-------------->>>>>>>>>>>>>>>>>>>"+urlrow.toString());
			row_connection = (HttpURLConnection)urlrow.openConnection();
			row_connection.connect();

			InputStream rowis =row_connection.getInputStream();

			int rowlineLength = 72;
			StringBuffer rowstrbuffer=new StringBuffer();
			byte[] rowbuf = new byte[rowlineLength/4*3];
			while(true)
			{

				int rowlen = rowis.read(rowbuf);
				if (rowlen <= 0) break;
				rowstrbuffer.append(new String(rowbuf));

			}

			rowdata=new String(rowstrbuffer);
			System.out.println("This is rawdata Appt------------>>>>>"+rowdata);
			/*End roe data*/

			/*row data Hashtable*/

			main_vec=new Vector();
			Vector<String> module_vec=new Vector<String>();
			Vector mail_vec=new Vector();

			module_vec.add(new String("ref_ids"));
			module_vec.add(push_id);

			mail_vec.add("message");
			mail_vec.add(rowdata);



			main_vec.add(module_vec);
			main_vec.add(mail_vec);
			/*End of row data*/

			/*send the mail to open-erp url*/

			String fixurl="/xmlrpc/object";
			XmlRpcClient client;
			client=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			dbname=dbname.trim();
			System.out.println("Going to call meeting_push from sendMail");
			list=(Object)client.invoke("execute",new Object[] {dbname,op_id,password,"zimbra.partner","meeting_push",main_vec});
			row_connection.disconnect();
			rowstrbuffer.delete(0,rowstrbuffer.length());

			rowis.close();
			try
			{
				main_vec.clear();
				mail_vec.clear();
				module_vec.clear();
			}
			catch(Exception ex)
			{
				System.out.print(ex+"Exception in clear vector");
			}
			System.out.println("This is meeting push response-------->>>>>>>>>>"+list.toString());
			return list.toString();


		}
		catch(Exception ex)
		{

			System.out.print("Exception---->>>>"+ex);
			ex.printStackTrace();
			return "fail";
		}

	}

}
