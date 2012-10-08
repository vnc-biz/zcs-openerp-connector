package biz.vnc.zimbra.openerp_zimlet;

import biz.vnc.zimbra.util.ZLog;
import biz.vnc.zimbra.util.JSPUtil;
import com.csvreader.CsvWriter;
import com.google.gson.Gson;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Vector;
import org.json.simple.JSONObject;
import redstone.xmlrpc.XmlRpcArray;
import redstone.xmlrpc.XmlRpcClient;
import redstone.xmlrpc.XmlRpcFault;
import redstone.xmlrpc.XmlRpcStruct;
import org.apache.commons.codec.binary.Base64;

public class Connector {
	ArrayList<Object> list;
	private Pattern pattern;
	private Matcher matcher;
	private static final String EMAIL_PATTERN ="^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	UserPrefs prefs;

	public static void _err(String s, Exception e) {
		ZLog.err("OpenERPConnector", s, e);
	}

	public static void _err(String s) {
		ZLog.err("OpenERPConnector", s);
	}

	public static void _info(String s) {
		ZLog.info("OpenERPConnector", s);
	}

	public Connector(UserPrefs p) {
		prefs = p;
	}

	private XmlRpcClient getRPC(String suffix, UserPrefs pr)
	throws MalformedURLException {
		if (pr == null)
			pr = prefs;

		URL url = pr.getServiceURL(suffix);
		_info("Calling XMLRPC service: "+url);
		return new XmlRpcClient(url,false);	/* streaming currently disabled for safety */
	}

	private XmlRpcClient getRPC(String suffix)
	throws MalformedURLException {
		return getRPC(suffix, null);
	}

	private String objToJSON(Object obj) {
		return new Gson().toJson(obj);
	}

	private Object rpc_call_object(String proc, Object[] params)
	throws MalformedURLException, XmlRpcFault {
		return (Object)(getRPC("/xmlrpc/object").invoke(proc,params));
	}

	private Object rpc_call_common(String proc, Object[] params)
	throws MalformedURLException, XmlRpcFault {
		return (Object)(getRPC("/xmlrpc/common").invoke(proc,params));
	}

	public String getDatabase(String url, String port) {
		try {
			UserPrefs pr = prefs.clone();
			if ((url != null) && (!url.equals("")))
				pr.url = url;
			if ((port != null) && (!port.equals("")))
				pr.port = port;
			XmlRpcClient client = getRPC("/xmlrpc/db", pr);
			Object token = (Object)client.invoke( "list", new Object[] {} );
			return token.toString();
		} catch(Exception ex) {
			_err("getDatabase call failed", ex);
			return "fail";
		}
	}

	public String validUser(String url,String port,String database,String username,String password) {
		try {
			prefs.url      = url;
			prefs.port     = port;
			prefs.database = database.trim();
			prefs.password = password;
			prefs.username = username;

			Object token = rpc_call_common(
			                   "login",
			new Object[] {
				prefs.database,
				prefs.username,
				prefs.password
			}
			               );

			if(token instanceof java.lang.Integer) {
				prefs.openerp_id = token.toString();
				if (checkRecords()) {
					prefs.store();
					return prefs.openerp_id;
				}
			}
		} catch(Exception ex) {
			_err("validUser call failed", ex);
		}
		return "false";
	}

	public String getDocumentlist(String emailsearch, String obj_name) {
		try {
			if (emailsearch.equals("")) {
				Object token = rpc_call_object(
				                   "execute",
				new Object[] {
					prefs.database,
					prefs.idToInteger(),
					prefs.password,
					obj_name,
					"name_search",
					""
				}
				               );
				if (token.toString().length()!=2) {
					return objToJSON(token);
				} else {
					return "bl";
				}
			} else {
				if (obj_name.equals("res.partner") || obj_name.equals("res.partner.address") || obj_name.equals("crm.lead")) {
					if (validate(emailsearch)) {
						Vector parent=new Vector();
						{
							Vector<String> child = new Vector<String>();
							child.add("email");
							child.add("ilike");
							child.add(emailsearch);
							parent.add(child);
						}
						Object token = rpc_call_object(
						                   "execute",
						new Object[] {
							prefs.database,
							prefs.idToInteger(),
							prefs.password,
							obj_name,
							"name_search",
							"",
							parent
						}
						               );
						if(token.toString().length()!=2) {
							return objToJSON(token);
						} else {
							return "bl";
						}
					} else {
						if(emailsearch.indexOf("@")== 0 && emailsearch.indexOf(".")>0) {
							_info("getDocumentList() got a domainname");
							Vector domainParent=new Vector();
							{
								Vector<String> domainChild = new Vector<String>();
								domainChild.add("email");
								domainChild.add("ilike");
								domainChild.add(emailsearch);
								domainParent.add(domainChild);
							}
							Object token = rpc_call_object(
							                   "execute",
							new Object[] {
								prefs.database,
								prefs.idToInteger(),
								prefs.password,
								obj_name,
								"name_search",
								"",
								domainParent
							}
							               );
							_info("getDocumentList() call succeed: "+token.toString());
							if(token.toString().length()!=2) {
								return objToJSON(token);
							} else {
								return "bl";
							}
						} else {
							Object token = rpc_call_object(
							                   "execute",
							new Object[] {
								prefs.database,
								prefs.idToInteger(),
								prefs.password,
								obj_name,
								"name_search",
								emailsearch
							}
							               );
							if(token.toString().length()!=2) {
								return objToJSON(token);
							} else {
								return "bl";
							}
						}
					}
				} else {
					Object token = rpc_call_object(
					                   "execute",
					new Object[] {
						prefs.database,
						prefs.idToInteger(),
						prefs.password,
						obj_name,
						"name_search",
						emailsearch
					}
					               );
					if(token.toString().length()!=2) {
						return objToJSON(token);
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
	public String sendMail(String msg_id,String urlprefix,String push_id,String authToken) {
		Object list = null;
		try {
			String msgID = msg_id;
			if(msgID != null) {
				/*Row data*/
				_info("sendMail(): Inside msg is not null");
				URL urlrow = new URL(urlprefix+"service/home/~/?auth=qp&id="+URLEncoder.encode(msgID,"UTF-8")+"&zauthtoken="+URLEncoder.encode(authToken,"UTF-8"));
				_info("sendMail(): url: "+urlrow.toString());
				HttpURLConnection row_connection = (HttpURLConnection)urlrow.openConnection();
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
				String rowdata=new String(rowstrbuffer);
				_info("sendMail(): raw data: "+rowdata);
				byte[] temp = Base64.encodeBase64(rowdata.getBytes());
				rowdata = new String(temp);
				_info("sendMail(): raw data ------------>>encoded: "+rowdata);

				/*End roe data*/

				/*row data Hashtable*/
				Vector<String> module_vec=new Vector<String>();
				module_vec.add(new String("ref_ids"));
				module_vec.add(push_id);

				Vector mail_vec=new Vector();
				mail_vec.add("message");
				mail_vec.add(rowdata);

				Vector main_vec=new Vector();
				main_vec.add(module_vec);
				main_vec.add(mail_vec);
				/*End of row data*/

				/*send the mail to open-erp url*/
				_info("Going to call histary_message from sendMail");
				list = rpc_call_object(
				           "execute",
				new Object[] {
					prefs.database,
					prefs.idToInteger(),
					prefs.password,
					"zimbra.partner",
					"history_message",
					main_vec
				}
				       );
				row_connection.disconnect();
				rowstrbuffer.delete(0,rowstrbuffer.length());
				rowis.close();
				try {
					main_vec.clear();
					mail_vec.clear();
					module_vec.clear();
				} catch(Exception ex) {
					_err("Send mail failed ", ex);
					return "Fail";
				}
			} else {
				return "Fail";
			}
		} catch(Exception e) {
			_err("Archive email failed", e);
			return "Fail";
		}
		_info("sendMail(): list: "+list.toString());
		if(list.toString() != null) {
			return list.toString();
		} else {
			return "Fail";
		}
	}

	public boolean checkRecords() {
		try {
			Vector parent=new Vector();
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
			Object reply = rpc_call_object(
			                   "execute",
			new Object[] {
				prefs.database,
				prefs.idToInteger(),
				prefs.password,
				"ir.module.module",
				"search",
				parent
			}
			               );
			return ((reply.toString()!="") && (reply.toString().length()>2));
		} catch (Exception e) {
			_err("getDocumentlist call failed", e);
			return false;
		}
	}

	public boolean validate(String hex) {
		pattern = Pattern.compile(EMAIL_PATTERN);
		matcher = pattern.matcher(hex);
		return matcher.matches();
	}

	public String readConfig() {
		try {
			JSONObject obj = new JSONObject();
			obj.put("urladdress",prefs.url);
			obj.put("getdatabase",prefs.database);
			obj.put("port",prefs.port);
			return obj.toString();
		} catch (Exception e) {
			_err("read config failed", e);
			return("Fail");
		}
	}

	public String clearConfig() {
		return (prefs.erase() ? "OK" : "FAILED");
	}
}
