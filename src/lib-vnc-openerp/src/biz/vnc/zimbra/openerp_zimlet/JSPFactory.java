package biz.vnc.zimbra.openerp_zimlet;

import biz.vnc.zimbra.util.JSPUtil;
import com.zimbra.cs.account.AuthTokenException;
import com.zimbra.common.service.ServiceException;
import javax.servlet.http.HttpServletRequest;

public class JSPFactory {
	public static UserPrefs getUserPrefs(HttpServletRequest request)
	throws AuthTokenException, ServiceException {
		return new UserPrefs(JSPUtil.getCurrentAccount(request));
	}

	public static Connector getConnector(HttpServletRequest request)
	throws AuthTokenException, ServiceException {
		return new Connector(getUserPrefs(request));
	}
}
