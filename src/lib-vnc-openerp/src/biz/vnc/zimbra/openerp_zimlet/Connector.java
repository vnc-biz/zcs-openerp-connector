package biz.vnc.zimbra.openerp_zimlet;

import biz.vnc.zimbra.util.ZLog;
import com.csvreader.CsvWriter;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Vector;
import org.json.simple.JSONObject;
import redstone.xmlrpc.XmlRpcArray;
import redstone.xmlrpc.XmlRpcClient;
import redstone.xmlrpc.XmlRpcStruct;

public class Connector {
	XmlRpcClient server;
	Connection con;
	Statement stmt;
	PreparedStatement prest;
	JSONObject jsonobj,mainobj,jsonstr;
	ArrayList<Object> list;
	Object idList=null;
	private Pattern pattern;
	private Matcher matcher;
	private static final String EMAIL_PATTERN ="^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

	public static void _err(String s, Exception e) {
		ZLog.err("OpenERPConnector", s, e);
	}

	public static void _err(String s) {
		ZLog.err("OpenERPConnector", s);
	}

	public static void _info(String s) {
		ZLog.info("OpenERPConnector", s);
	}

	public String getDatabase(String url,String port) {
		try {
			String fixurl="/xmlrpc/db";
			_info("getDataBase URL="+url+":"+port+fixurl);
			XmlRpcClient client = new XmlRpcClient(new URL(url+":"+port+fixurl),true);
			Object token = (Object)client.invoke( "list", new Object[] {} );
			return token.toString();
		} catch(Exception ex) {
			_err("getDatabase call failed", ex);
			return "fail";
		}
	}

	public String validUser(String url,String port,String database,String username,String password) {
		try {
			String fixurl="/xmlrpc/common";
			XmlRpcClient client = new XmlRpcClient(new URL(url+":"+port+fixurl),true);
			database=database.trim();
			Object token = (Object)client.invoke( "login", new Object[] {database,username,password} );
			if(token instanceof java.lang.Integer) {
				return token.toString();
			} else {
				return "false";
			}
		} catch(Exception ex) {
			_err("validUser() failed", ex);
			return "false";
		}
	}

	public String getDocumentlist(String dbname,String password,String emailsearch,String urladdress,String port,String obj_name,String openerp_id) {
		try {
			String fixurl="/xmlrpc/object";
			Gson gson = new Gson();
			Vector parent=new Vector();
			Vector domainParent=new Vector();
			Integer op_id=Integer.parseInt(openerp_id);
			boolean valid;
			valid=validate(emailsearch);
			if (emailsearch.equals("")) {
				_info("getDocumentlist(): openerp_id="+openerp_id);
				XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
				Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",""} );
				if (token.toString().length()!=2) {
					return gson.toJson(token);
				} else {
					return "bl";
				}
			} else {
				if (obj_name.equals("res.partner") || obj_name.equals("res.partner.address") || obj_name.equals("crm.lead")) {
					if (valid == true) {
						XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
						{
							Vector<String> child = new Vector<String>();
							child.add("email");
							child.add("ilike");
							child.add(emailsearch);
							parent.add(child);
						}
						Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search","",parent} );
						if(token.toString().length()!=2) {
							return gson.toJson(token);
						} else {
							return "bl";
						}
					} else {
						if(emailsearch.indexOf("@")== 0 && emailsearch.indexOf(".")>0) {
							_info("getDocumentList() got a domainname");
							XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
							{
								Vector<String> domainChild = new Vector<String>();
								domainChild.add("email");
								domainChild.add("ilike");
								domainChild.add(emailsearch);
								domainParent.add(domainChild);
							}
							Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search","",domainParent} );
							_info("getDocumentList() call succeed: "+token.toString());
							if(token.toString().length()!=2) {
								return gson.toJson(token);
							} else {
								return "bl";
							}
						} else {
							XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
							Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",emailsearch} );
							if(token.toString().length()!=2) {
								return gson.toJson(token);
							} else {
								return "bl";
							}
						}
					}
				} else {
					XmlRpcClient client = new XmlRpcClient(new URL(urladdress+":"+port+fixurl),false);
					Object token = (Object)client.invoke( "execute", new Object[] {dbname,op_id,password,obj_name,"name_search",emailsearch} );
					if(token.toString().length()!=2) {
						return gson.toJson(token);
					} else {
						return "bl";
					}
				}
			}
		} catch(Exception ex) {
			_err("getDocumentList() failed", ex);
			return "Exception";
		}
	}

	/*Gel Email Information from */
	public String sendMail(String dbname,String password,String urladdress,String port,String msg_id,String downloadlink,String push_id,String sessionid, String authToken,String openerp_id) {
		String rowdata=null;
		String rowdata_path=null;
		JSONObject jso=null;
		Object list=null;
		String val=null;
		HttpURLConnection row_connection=null;
		Vector main_vec=null;
		Integer op_id=Integer.parseInt(openerp_id);
		try {
			String msgID = msg_id;
			if(msgID != null) {
				/*Row data*/
				_info("sendMail(): Inside msg is not null");
				rowdata_path=downloadlink+"?auth=qp&id="+URLEncoder.encode(msgID,"UTF-8")+"&zauthtoken="+URLEncoder.encode(authToken,"UTF-8");
				URL urlrow=new URL(rowdata_path);
				_info("sendMail(): url: "+urlrow.toString());
				row_connection = (HttpURLConnection)urlrow.openConnection();
				row_connection.connect();
				InputStream rowis =row_connection.getInputStream();
				int rowlineLength = 72;
				StringBuffer rowstrbuffer=new StringBuffer();
				byte[] rowbuf = new byte[rowlineLength/4*3];
				int rowlen = 0;
				while((rowlen = rowis.read(rowbuf)) != -1) {
					rowstrbuffer.append(new String(rowbuf));
					rowbuf = null;
					rowbuf = new byte[rowlineLength/4*3];
				}
				rowdata=new String(rowstrbuffer);
				_info("sendMail(): raw data: "+rowdata);
				/*End roe data*/

				/*row data Hashtable*/
				Vector<String> module_vec=new Vector<String>();
				module_vec.add(new String("ref_ids"));
				module_vec.add(push_id);

				Vector mail_vec=new Vector();
				mail_vec.add("message");
				mail_vec.add(rowdata);

				main_vec=new Vector();
				main_vec.add(module_vec);
				main_vec.add(mail_vec);
				/*End of row data*/

				/*send the mail to open-erp url*/
				String fixurl="/xmlrpc/object";
				XmlRpcClient client;
				client=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
				dbname=dbname.trim();
				_info("Going to call histary_message from sendMail");
				list=(Object)client.invoke("execute",new Object[] {dbname,op_id,password,"zimbra.partner","history_message",main_vec});
				row_connection.disconnect();
				rowstrbuffer.delete(0,rowstrbuffer.length());
				rowis.close();
				try {
					main_vec.clear();
					mail_vec.clear();
					module_vec.clear();
				} catch(Exception ex) {
					_err("Send mail failed ", ex);
				}
			} else {
			}
		} catch(Exception e) {
			_err("Archive email failed", e);
		}
		_info("sendMail(): list: "+list.toString());
		return list.toString();
	}

	public String checkRecords(String dbname,String password,String urladdress,String port,String obj_name,String openerp_id) {
		Object list=null;
		Object login=null;
		Object lis=null;
		Gson gson = new Gson();
		String m=new String();
		Integer op_id=Integer.parseInt(openerp_id);
		Vector parent=new Vector();
		String s=null;
		int cnt=0;
		try {
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists;;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			s=new String();
			dbname=dbname.trim();
			{
				Vector<String> child1 = new Vector<String>();
				child1.add("name");
				child1.add("=");
				child1.add("vnc_zimbra_connector");
				parent.add(child1);
			}
			{
				Vector<String> child2 = new Vector<String>();
				child2.add("state");
				child2.add("=");
				child2.add("installed");
				parent.add(child2);
			}
			lis=(Object)lists.invoke("execute",new Object[] {dbname,op_id,password,"ir.module.module","search",parent});
			_info("checkRecords(): this is Documentvarify-----response su vat che--->>"+lis.toString()+lis.toString().length());
		} catch (Exception e) {
			_err("checkRecords() failed", e);
			return("Fail");
		}
		if ((lis.toString()!="") && (lis.toString().length()>2)) {
			return gson.toJson(lis);
		} else {
			return "Fail";
		}
	}

	public String getContacts(String dbname,String password,String urladdress,String port,String auth_token,String urladd,String openerp_id,String acc_name,String zimbraProtocol,String z_portNumber,String addressBook,String domainName) {
		Gson gson = new Gson();
		Integer op_id=Integer.parseInt(openerp_id);
		Integer zimbraPort=Integer.parseInt(z_portNumber);
		Object contactlist;
		String tmpDir = System.getProperty("java.io.tmpdir");
		String osName= System.getProperty("os.name");
		if (osName.indexOf("W")>-1) {
			tmpDir+="\\myData.csv";
		} else {
			tmpDir+="/myData.csv";
		}
		_info("CSV path: "+tmpDir);
		List<Integer> intList;
		try {
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists,contact;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			dbname=dbname.trim();
			_info("getContacts(): before xmlrpc call: "+dbname+password);
			Object objlist = lists.invoke("execute",new Object[] {dbname,op_id,password,"res.partner.address","search",new Vector()});
			_info("getContacts(): Id list:"+objlist.toString());
			Vector nameList = new Vector();
			InputStream is=getClass().getResourceAsStream("/biz/vnc/zimbra/openerp_zimlet/contactFields.properties");
			BufferedReader br=new BufferedReader(new InputStreamReader(is));
			String[] cField;
			Vector<String> heading = new Vector<String>();
			String str;
			int k=0;
			while((str=br.readLine())!=null) {
				try {
					cField=str.split("=");
					nameList.add(cField[0].trim());
					_info("getContacts(): length of cField--- >key:"+cField[0].trim()+" value:"+cField[1].trim());
					heading.add(cField[1].trim());
				} catch(Exception r) {
					_err("getContacts", r);
				}
			}
			_info("getContacts(): Contacts heading read successfully from file...");
			contact=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			XmlRpcStruct contactList=(XmlRpcStruct)lists.invoke("execute",new Object[] {dbname,op_id,password,"res.partner.address","export_data",objlist,nameList});
			int len1=contactList.getArray("datas").size();/*This is number of Contacts*/
			int len2=nameList.size();/*This is number of fields*/
			String name,email;
			XmlRpcArray arr=contactList.getArray("datas");
			CsvWriter csvFile=new CsvWriter("/tmp/myData.csv",',',Charset.forName("UTF-8"));
			csvFile.setForceQualifier(true);
			for (int t=1; t<heading.size(); t++) {
				csvFile.write(heading.get(t).toString());
			}
			csvFile.endRecord();
			for (int i=0; i<len1; i++) {
				int flag=0;
				for(int j=1; j<len2; j++) {
					name=arr.getArray(i).get(j).toString();
					if(j==1) {
						if(name.equals("false")) {
							flag=1;
						}
					}
					if(name.equals("false"))
						name="";

					csvFile.write(name);
				}
				csvFile.endRecord();
			}
			csvFile.flush();
			csvFile.close();
			Runtime r=Runtime.getRuntime();
			String[] z_Protocol=zimbraProtocol.split(":");
			URI uri = new URI(z_Protocol[0],null,domainName,zimbraPort,"/home/"+acc_name+"/"+addressBook,"fmt=csv&auth=qp&zauthtoken="+auth_token,null);
			String tempurl=urladd+"?fmt=csv&auth=qp&zauthtoken="+auth_token;
			tempurl = URLEncoder.encode(tempurl, "UTF-8");
			tempurl=tempurl.replaceAll(" ","%20");
			URL url = uri.toURL();
			_info("getContacts() upload URL: "+url);
			try {
				Process p=r.exec("curl -k -m 10000 --upload-file /tmp/myData.csv "+url);
				p.waitFor();
				_info("Exit status for export ICS to OpenERP is: " + p.exitValue());
				return "success";
			} catch(IllegalThreadStateException ex) {
				_err("getContacts", ex);
				return "fail";
			}
		} catch (Exception e) {
			_err("getContacts", e);
			return "fail";
		}
	}

	public boolean validate(String hex) {
		pattern = Pattern.compile(EMAIL_PATTERN);
		matcher = pattern.matcher(hex);
		return matcher.matches();
	}

	public String varifyRecord(String dbname,String password,String urladdress,String port,String obj_name,String openerp_id) {
		Object list=null;
		Object login=null;
		Object lis=null;
		Gson gson = new Gson();
		String m=new String();
		Integer op_id=Integer.parseInt(openerp_id);
		Vector params=null;
		String s=null;
		int cnt=0;
		try {
			String fixurl="/xmlrpc/object";
			XmlRpcClient lists;;
			lists=new XmlRpcClient(new URL(urladdress+":"+port+fixurl),true);
			s=new String();
			dbname=dbname.trim();
			lis=(Object)lists.invoke("execute",new Object[] {dbname,op_id,password,obj_name,"name_search",new Vector()});
		} catch (Exception e) {
			_err("verifyRecord failed", e);
			return("Fail");
		}
		if (lis.toString()!="") {
			return gson.toJson(lis);
		} else {
			return "Fail";
		}
	}
}
