package biz.vnc.zimbra.openerp_zimlet;

import biz.vnc.zimbra.util.ZimletConfig;
import biz.vnc.zimbra.util.ProtectedZimletConfig;
import com.zimbra.cs.account.Account;
import com.zimbra.cs.zimlet.ZimletUserProperties;
import com.zimbra.soap.account.type.Prop;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;

public class UserPrefs {
	public String url;
	public String port;
	public String username;
	public String password;
	public String openerp_id;
	public String database;
	public String zimbra_account;

	static public final String zimlet_name         = "com_zimbra_erp_mail_connector";
	static public final String property_url        = "urladdress";
	static public final String property_port       = "port";
	static public final String property_username   = "username";
	static public final String property_password   = "userpassword";
	static public final String property_database   = "getdatabase";
	static public final String property_openerp_id = "openerp_id";

	public UserPrefs(Account acct) {
		this.zimbra_account = acct.getName();
		Properties props = ProtectedZimletConfig.getUserProperties(zimlet_name, zimbra_account);
		this.url        = props.getProperty(property_url);
		this.port       = props.getProperty(property_port);
		this.username   = props.getProperty(property_username);
		this.password   = props.getProperty(property_password);
		this.database   = props.getProperty(property_database);
		this.openerp_id = props.getProperty(property_openerp_id);
	}

	private UserPrefs() {
	}

	public UserPrefs clone() {
		UserPrefs pr = new UserPrefs();
		pr.url = this.url;
		pr.port = this.port;
		pr.username = this.username;
		pr.password = this.password;
		pr.database = this.database;
		pr.openerp_id = this.openerp_id;
		return pr;
	}

	public URL getServiceURL(String suffix)
	throws MalformedURLException {
		return new URL(url+":"+port+suffix);
	}

	public Integer idToInteger() {
		return Integer.parseInt(openerp_id);
	}

	public void store() {
		ProtectedZimletConfig.setUserProperty(zimlet_name, zimbra_account, property_url, this.url);
		ProtectedZimletConfig.setUserProperty(zimlet_name, zimbra_account, property_port, this.port);
		ProtectedZimletConfig.setUserProperty(zimlet_name, zimbra_account, property_username, this.username);
		ProtectedZimletConfig.setUserProperty(zimlet_name, zimbra_account, property_password, this.password);
		ProtectedZimletConfig.setUserProperty(zimlet_name, zimbra_account, property_database, this.database);
		ProtectedZimletConfig.setUserProperty(zimlet_name, zimbra_account, property_openerp_id, this.openerp_id);
	}

	public boolean erase() {
		ProtectedZimletConfig.clearUserProperties(zimlet_name, this.zimbra_account);
		return true;
	}
}
