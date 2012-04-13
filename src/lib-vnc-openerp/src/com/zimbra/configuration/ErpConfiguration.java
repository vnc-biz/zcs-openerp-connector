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
import java.net.URL;
import java.net.URLConnection;
import java.net.*;
import org.json.JSONArray;
import java.text.SimpleDateFormat;
import java.net.URLEncoder;
import java.io.*;
import java.lang.Exception;
import java.net.URI;
import java.net.URLEncoder;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.MultipartPostMethod;

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
			System.out.println("getDataBase---->>>"+url+":"+port+fixurl);
			XmlRpcClient client = new XmlRpcClient(new URL(url+":"+port+fixurl),true);
			Object token = (Object)client.invoke( "list", new Object[] {} );
			return token.toString();
		}
		catch(Exception ex)
		{
			System.out.print(ex.toString()+"Exception in  getDatabase-------->>>>>");
			ex.printStackTrace();
			return "fail";
		}
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
	}

	public String getDocumentlist(String dbname,String password,String emailsearch,String urladdress,String port,String obj_name,String openerp_id)
	{
		try
		{
			String fixurl="/xmlrpc/object";
			Gson gson = new Gson();
			Vector child=new Vector();
			Vector parent=new Vector();
			Vector domainChild=new Vector();
			Vector domainParent=new Vector();
			Integer op_id=Integer.parseInt(openerp_id);
			boolean valid;
			valid=validate(emailsearch);
			if (emailsearch.equals(""))
			{
				System.out.println("getDocumentlist->This is openerp_id--------->>>>>>"+openerp_id);
				XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
				Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",new Vector()} );
				if (token.toString().length()!=2)
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
				if (valid==true)
				{
					if (obj_name.equals("res.partner") || obj_name.equals("res.partner.address") || obj_name.equals("crm.lead"))
					{
						System.out.println("Inside res.partner or res.partner.address-------------->>>>>>>>>>>>>>>>>");
						XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
						child.add("email");
						child.add("ilike");
						child.add(emailsearch);
						parent.add(child);
						Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search","",parent} );
						System.out.println("Call success------------------->>>>>>>>>"+token.toString());
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
					System.out.println("Inside Invalid address but search for domain-------------->>>>>>>>>>>>>>>>>");
					XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
					domainChild.add("email");
					domainChild.add("ilike");
					domainChild.add(emailsearch);
					domainParent.add(domainChild);
					Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search","",domainParent} );
					System.out.println("Call success------------------->>>>>>>>>"+token.toString());
					if(token.toString().length()!=2)
					{
						return gson.toJson(token);
					}
					else
					{
						return "bl";
					}

					/*XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
					Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",emailsearch,new Vector()} );
					if (token.toString().length()!=2) {
						return gson.toJson(token);
					} else {
						return "bl";
					}*/
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
		System.out.print("send mail called"+"database:"+dbname+"Password:"+password+"URLaddress:"+urladdress+"port:"+port+"msg_id:"+msg_id+"Link:"+downloadlink+"push_ID:"+push_id+"sessionid:"+sessionid+"AuthToken:"+authToken);
		String rowdata=null;
		String rowdata_path=null;
		JSONObject jso=null;
		Object list=null;
		String val=null;
		HttpURLConnection row_connection=null;
		Vector main_vec=null;
		Integer op_id=Integer.parseInt(openerp_id);
		try
		{
			String msgID = msg_id;
			if(msgID != null)
			{
				/*Row data*/
				System.out.print("Inside msg is not null");
				rowdata_path=downloadlink+"?auth=qp&id="+URLEncoder.encode(msgID,"UTF-8")+"&zauthtoken="+URLEncoder.encode(authToken,"UTF-8");
				URL urlrow=new URL(rowdata_path);
				System.out.println("This is url row-------------->>>>>>>>>>>>>>>>>>>"+urlrow.toString());
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
				System.out.println("This is rawdata======================="+rowdata);
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
				System.out.println("Going to call histary_message from sendMail");
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
				System.out.print("Else part of msg");
			}
		}
		catch(Exception e)
		{
			System.out.print("inside Exceptionfsbv"+e);
			e.printStackTrace();
		}
		System.out.print("This is list"+list.toString()+"End of list");
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
		Vector parent=new Vector();
		Vector child1=new Vector();
		Vector child2=new Vector();
		String s=null;
		int cnt=0;
		try
		{
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists;;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			System.out.println("this is address----------->>>>>"+urladdress+":"+port+fixurl+"End of url<<<<<<<<<<--------");
			s=new String();
			dbname=dbname.trim();
			child1.add("name");
			child1.add("=");
			child1.add("vnc_zimbra_connector");
			child2.add("state");
			child2.add("=");
			child2.add("installed");
			parent.add(child1);
			parent.add(child2);
			//lis=(Object)lists.invoke("execute",new Object[] {dbname,op_id,password,obj_name,"name_search",new Vector()});
			lis=(Object)lists.invoke("execute",new Object[] {dbname,op_id,password,"ir.module.module","search",parent});
			System.out.println("this is Documentvarify-----response su vat che--->>"+lis.toString()+lis.toString().length());
		}
		catch (Exception e)
		{
			System.out.println("fail");
			e.printStackTrace();
			return("Fail");
		}
		if ((lis.toString()!="") && (lis.toString().length()>2))
		{
			return gson.toJson(lis);
		}
		else
		{
			return "Fail";
		}
	}

	public String getContacts(String dbname,String password,String urladdress,String port,String auth_token,String urladd,String openerp_id,String acc_name,String zimbraProtocol,String z_portNumber,String addressBook,String domainName)
	{

		Gson gson = new Gson();
		Integer op_id=Integer.parseInt(openerp_id);
		System.out.println("This is zimbra port and ---->>>>>"+z_portNumber);
		Integer zimbraPort=Integer.parseInt(z_portNumber);
		Object contactlist;
		String tmpDir = System.getProperty("java.io.tmpdir");
		String osName= System.getProperty("os.name");
		if (osName.indexOf("W")>-1)
		{
			System.out.println("Damn its windows 7 "+"/tmp/myData.csv");
			tmpDir+="\\myData.csv";
		}
		else
		{
			tmpDir+="/myData.csv";
		}
		System.out.println("THis is file path for CSV-->>"+"/tmp/myData.csv");
		List<Integer> intList;
		try
		{
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists,contact;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			dbname=dbname.trim();
			System.out.println("Before xmlrpc call------------->>>>>>>>>>>>>>>>>>>>"+dbname+password);
			Object objlist = lists.invoke("execute",new Object[] {dbname,op_id,password,"res.partner.address","search",new Vector()});
			System.out.println("----------------------------------> Id list:"+objlist.toString());
			Vector nameList = new Vector();
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
					System.out.println("length of cField:"+cField.length+"   --------------- >key:"+cField[0].trim()+" value:"+cField[1].trim());
					heading.add(cField[1].trim());
				}
				catch(Exception r)
				{
					System.out.print("--------------------------->>>>>Exception");
					r.printStackTrace();
				}
			}
			System.out.println("------------------------------------>  End of file... Contacts heading read successfully from file...");
			contact=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			XmlRpcStruct contactList=(XmlRpcStruct)lists.invoke("execute",new Object[] {dbname,op_id,password,"res.partner.address","export_data",objlist,nameList});
			System.out.print("----> excuting  hi this is contact list============"+contactList.getArray("datas") +" ----> end new.");

			int len1=contactList.getArray("datas").size();/*This is number of Contacts*/
			int len2=nameList.size();/*This is number of fields*/
			String name,email;
			XmlRpcArray arr=contactList.getArray("datas");
			CsvWriter csvFile=new CsvWriter("/tmp/myData.csv",',',Charset.forName("UTF-8"));
			csvFile.setForceQualifier(true);
			for (int t=1; t<heading.size(); t++)
			{
				csvFile.write(heading.get(t).toString());
			}
			csvFile.endRecord();
			for (int i=0; i<len1; i++)
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
			String[] z_Protocol=zimbraProtocol.split(":");
			System.out.println("Thi is protocol--->>>"+z_Protocol);
			String tempurl=urladd+"?fmt=csv&auth=qp&zauthtoken="+auth_token;
			//tempurl = URLEncoder.encode(tempurl, "UTF-8");
			tempurl=tempurl.replaceAll(" ","%20");
			System.out.println("This is the temprory string url--->>"+tempurl);
			URI uri = new URI(tempurl);
			System.out.println("URI : " + uri.toURL());
			System.out.println("toAscii : " + uri.toASCIIString());
			uri = new URI(uri.toASCIIString());
			URL url = uri.toURL();
			System.out.println("This is url=====>>>>>>"+url);
			try
			{
				//Process p=r.exec("curl -k -m 10000 --upload-file "+tmpDir+url);
				// p.waitFor();
				//System.out.println("Exit status for export ICS to OpenERP is------------>>>>>>>>>>>>>>>> : " + p.exitValue());
				HttpClient client = new HttpClient();
				MultipartPostMethod mPost = new MultipartPostMethod(url.toString());
				client.setConnectionTimeout(10000);
				// Send any XML file as the body of the POST request
				File f1 = new File("/tmp/myData.csv");
				System.out.println("File1 Length = " + f1.length());
				mPost.addParameter(f1.getName(), f1);
				int statusCode1 = client.executeMethod(mPost);
				System.out.println("statusLine>>>" + mPost.getStatusLine());
				mPost.releaseConnection();
				return "success";
			}
			catch(IllegalThreadStateException ex)
			{
				ex.printStackTrace();
				return "fail";
			}
		}
		catch (Exception e)
		{
			System.out.println("Exception in xmlrpc contact " + e);
			e.printStackTrace();
			return "fail";
		}
	}

	public boolean validate(String hex)
	{

		pattern = Pattern.compile(EMAIL_PATTERN);
		matcher = pattern.matcher(hex);
		return matcher.matches();

	}

	public String varifyRecord(String dbname,String password,String urladdress,String port,String obj_name,String openerp_id)
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
		if (lis.toString()!="")
		{
			return gson.toJson(lis);
		}
		else
		{
			return "Fail";
		}
	}

}
