package biz.vnc.zimbra.openerp_zimlet;

import biz.vnc.zimbra.util.ZLog;
import biz.vnc.zimbra.util.JSPUtil;
import com.csvreader.CsvWriter;
import com.google.gson22.Gson;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Vector;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.codec.binary.Base64;
import org.json.simple.JSONObject;
import redstone.xmlrpc.XmlRpcArray;
import redstone.xmlrpc.XmlRpcClient;
import redstone.xmlrpc.XmlRpcFault;
import redstone.xmlrpc.XmlRpcStruct;

public class Connector {
	UserPrefs prefs;
	static final String EMAIL_PATTERN ="^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	static final Pattern pattern = Pattern.compile(EMAIL_PATTERN);

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

	private Object rpc_call_object_execute(Object... params)
	throws MalformedURLException, XmlRpcFault {
		Object[] parlist = new Object[params.length+3];
		parlist[0] = prefs.database;
		parlist[1] = prefs.idToInteger();
		parlist[2] = prefs.password;
		for (int x=0; x<params.length; x++)
			parlist[x+3] = params[x];
		return rpc_call_object("execute", parlist);
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
					prefs.server_version = getErpVersion();
					prefs.store();
					return prefs.openerp_id;
				}
			}
		} catch(Exception ex) {
			_err("validUser call failed", ex);
		}
		return "false";
	}

	public String getDocumentlist(String emailsearch, String obj_name_array) {
		Gson gson = new Gson();
		JSONObject jobj = new JSONObject();
		Vector vc = new Vector();
		try {
			String obj_name[] = obj_name_array.split(",");
			for(int k=0; k<obj_name.length; k++) {
				if (emailsearch.equals("")) {
					Object token = rpc_call_object_execute(obj_name[k], "name_search", "");
					if (token.toString().length()!=2) {
						jobj.put(obj_name[k],token);
					}
				} else {
					if (obj_name[k].equals("res.partner") || obj_name[k].equals("res.partner.address") || obj_name[k].equals("crm.lead") || obj_name[k].equals("project.project")) {
						if (validate(emailsearch)) {
							Vector parent=new Vector();
							{
								Vector<String> child = new Vector<String>();
								if(obj_name[k].equals("crm.lead")) {
									child.add("email_from");
								} else if(obj_name[k].equals("project.project")) {
									child.add("name");
								} else {
									child.add("email");
								}
								child.add("ilike");
								child.add(emailsearch);
								parent.add(child);
							}
							Object token = rpc_call_object_execute(obj_name[k], "name_search", "", parent);
							if(token.toString().length()!=2) {
								jobj.put(obj_name[k],token);
							}
						} else {
							if(emailsearch.indexOf("@")== 0 && emailsearch.indexOf(".")>0) {
								_info("getDocumentList() got a domainname");
								Vector domainParent=new Vector();
								{
									Vector<String> domainChild = new Vector<String>();
									if(obj_name[k].equals("crm.lead")) {
										domainChild.add("email_from");
									} else if(obj_name[k].equals("project.project")) {
										domainChild.add("name");
									} else {
										domainChild.add("email");
									}
									domainChild.add("ilike");
									domainChild.add(emailsearch);
									domainParent.add(domainChild);
								}
								Object token = rpc_call_object_execute(obj_name[k], "name_search", "", domainParent);
								_info("getDocumentList() call succeed: "+token.toString());
								if(token.toString().length()!=2) {
									jobj.put(obj_name[k],token);
								}
							} else {
								Object token = rpc_call_object_execute(obj_name[k], "name_search", emailsearch);
								if(token.toString().length()!=2) {
									jobj.put(obj_name[k],token);
								}
							}
						}
					} else {
						Object token = rpc_call_object_execute(obj_name[k], "name_search", emailsearch);
						if(token.toString().length()!=2) {
							jobj.put(obj_name[k],token);
						}
					}
				}
			}
		} catch(Exception ex) {
			_err("getDocumentList() failed", ex);
			return "Exception";
		}
		return jobj.toJSONString();
	}

	/*Gel Email Information from */
	public String sendMail(String msg_id, String urlprefix, String push_id, String authToken, HttpServletRequest req) {
		if (msg_id == null)
			return "Fail";
		try {
			String content = new String(
			    Base64.encodeBase64(JSPUtil.getRawMail(req,msg_id))
			);
			_info("sendMail(): base64 encoded mail: "+content);

			/*row data Hashtable*/
			Vector<String> module_vec=new Vector<String>();
			module_vec.add(new String("ref_ids"));
			module_vec.add(push_id);
			Vector mail_vec=new Vector();
			mail_vec.add("message");
			mail_vec.add(content);
			Vector main_vec=new Vector();
			main_vec.add(module_vec);
			main_vec.add(mail_vec);
			/*End of row data*/
			/*send the mail to open-erp url*/
			_info("Going to call histary_message from sendMail");
			Object list = rpc_call_object_execute("zimbra.partner", "history_message", main_vec);
			_info("sendMail(): list: "+list.toString());

			if (list.toString() == null)
				return "Fail";

			return list.toString();
		} catch(Exception e) {
			_err("Archive email failed", e);
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
			Object reply = rpc_call_object_execute("ir.module.module", "search", parent);
			return ((reply.toString()!="") && (reply.toString().length()>2));
		} catch (Exception e) {
			_err("getDocumentlist call failed", e);
			return false;
		}
	}

	public boolean validate(String hex) {
		return pattern.matcher(hex).matches();
	}

	public String readConfig() {
		try {
			JSONObject obj = new JSONObject();
			obj.put("urladdress",prefs.url);
			obj.put("getdatabase",prefs.database);
			obj.put("port",prefs.port);
			obj.put("server_version",prefs.server_version);
			return obj.toString();
		} catch (Exception e) {
			_err("read config failed", e);
			return("Fail");
		}
	}

	public String clearConfig() {
		return (prefs.erase() ? "OK" : "FAILED");
	}

	public String getErpVersion() throws MalformedURLException, XmlRpcFault {
		UserPrefs pr = prefs.clone();
		Object token = rpc_call_common("version", new Object[] {});
		HashMap<String,String> map =(HashMap<String,String>) token;
		return map.get("server_version").substring(0,1);
	}
}
