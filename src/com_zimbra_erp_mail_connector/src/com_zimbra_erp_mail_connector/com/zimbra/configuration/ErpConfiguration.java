package com.zimbra.configuration;
import redstone.xmlrpc.XmlRpcClient;
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
import com.zimbra.common.auth.*;
import com.zimbra.cs.client.soap.*;
import com.zimbra.cs.client.*;
import java.net.URL;
import java.net.URLConnection;
import java.net.*;
import biz.source_code.base64Coder.Base64Coder;
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
			System.out.println("Mysql password: " + MYSQL_PASSWORD);

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
					System.out.print("url"+url);
					String fixurl="/xmlrpc";
					XmlRpcClientConfigImpl config = new XmlRpcClientConfigImpl();
						config.setServerURL(new URL(url+":"+port+fixurl));

					XmlRpcClient client = new XmlRpcClient();
						client.setConfig(config);
					Object[] params = new Object[]{};
						String result = (String) client.execute("list", params);

					System.out.print(result);



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
				return "true";
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
			con =DriverManager.getConnection("jdbc:mysql://localhost:7306/openerp_connector","zimbra",MYSQL_PASSWORD);
			stmt = con.createStatement();
			Statement stmtread;

			String sqlread="select * from document_setting where docname='" + docname +"'";
			stmtread=con.createStatement();
			ResultSet rs=stmtread.executeQuery(sqlread);
			if(rs.next())
			{

				return "duplicate";

			}


			String sql = "insert into document_setting(title,docname) values(?,?)";

			prest = con.prepareStatement(sql);
			prest.setString(1,title);
			prest.setString(2,docname);
			exec=prest.executeUpdate();


		}
		catch(Exception e)
		{
			e.printStackTrace();
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
			con =DriverManager.getConnection("jdbc:mysql://localhost:7306/openerp_connector","zimbra",MYSQL_PASSWORD);
			stmt = con.createStatement();

			String sql = "delete from document_setting where id in ("+record_id+")";
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


	public String getRecord()
	{
		String temp=null;
		list=new ArrayList<Object>();

		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			con =DriverManager.getConnection("jdbc:mysql://localhost:7306/openerp_connector","zimbra",MYSQL_PASSWORD);
			stmt = con.createStatement();

			String sql="select * from document_setting";
			prest = con.prepareStatement(sql);
			ResultSet rs=prest.executeQuery();


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
			System.out.println("Object is nullllllllllllllllllllllllllllll");
		}
		else
		{
			System.out.println("Object is not nulllllllllllllllllllllllll");
		}
		return mainobj.toString();

	}


	public String getDocumentlist(String dbname,String password,String emailsearch,String urladdress,String port,String obj_name)
	{


		try
		{
			String fixurl="/xmlrpc/object";
			Gson gson = new Gson();
			//String [] object_name = obj_name.split(",");
			XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
			Object token = (Object)client.invoke( "execute", new Object[] {dbname,1,password,obj_name,"name_search",new Vector()} );
			if(token.toString().length()!=2)
			{

				return gson.toJson(token);
			}
			else
			{
				return "bl";
			}

		}
		catch(Exception ex)
		{
			System.out.print(ex+"Exception in  getdocumenlist");
			return "Exception";
		}



		/*	Object lis=null;
			Gson gson = new Gson();
			String [] object_name = obj_name.split(",");
			Vector params=null,condition=null,listvector=null;

		int cnt=0;

			try {
				String fixurl="/xmlrpc/object";
				XmlRpcClient lists;
				params=new Vector();
				listvector=new Vector();

				lists=new XmlRpcClient(urladdress+":"+port+fixurl);

					params.addElement(dbname);
		                    	params.addElement(1);
		                    	params.addElement(password);
					params.addElement(obj_name);
					params.addElement("name_search");
					params.addElement(new Vector());

					System.out.print(obj_name);
		                    	lis=(Object)lists.execute("execute",params);
					System.out.print(lis.toString());



			 }
			 catch (Exception e) {

		      		 System.out.println(e.getMessage());
				return("fail");
		    	 }


			return gson.toJson(lis);*/

	}



	/*Gel Email Information from */

	JsonObject objectss;


	public String sendMail(String dbname,String password,String urladdress,String port,String msg_id,String downloadlink,String push_id,String sessionid, String authToken)
	{


		System.out.print("send mail called"+"database:"+dbname+"Password:"+password+"URLaddress:"+urladdress+"port:"+port+"msg_id:"+msg_id+"Link:"+downloadlink+"push_ID:"+push_id+"sessionid:"+sessionid+"AuthToken:"+authToken);
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
		LmcMessage msg=null;
		LmcSession lsession=null;
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
		try
		{
			String msgID = msg_id;


			if(msgID != null)
			{

				/*Row data*/

				System.out.print("Inside msg is not null");

				rowdata_path=downloadlink+"?auth=qp&id="+URLEncoder.encode(msgID,"UTF-8")+"&zauthtoken="+URLEncoder.encode(authToken,"UTF-8");


				URL urlrow=new URL(rowdata_path);

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

				list=(Object)client.invoke("execute",new Object[] {dbname,1,password,"thunderbird.partner","history_message",main_vec});
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
				Email="Damn message is null";
			}
		}
		catch(Exception e)
		{
			System.out.print("inside Exception");
			e.printStackTrace();
		}

		System.out.print("This is list"+list.toString()+"End of list");
		return list.toString();


	}

	public String checkRecords(String dbname,String password,String urladdress,String port,String obj_name)
	{

		Object list=null;
		Object login=null;
		Object lis=null;
		Gson gson = new Gson();
		String m=new String();


		Vector params=null;
		String s=null;

		int cnt=0;

		try
		{
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists;;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);

			s=new String();
			dbname=dbname.trim();


			lis=(Object)lists.invoke("execute",new Object[] {dbname,1,password,obj_name,"name_search",new Vector()});




		}
		catch (Exception e)
		{
			System.out.println("fail"+e.getMessage());
			return("Fail");

		}


		return gson.toJson(lis);

	}

}





