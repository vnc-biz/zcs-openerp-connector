/*##############################################################################
#    VNC-Virtual Network Consult GmbH.
#    Copyright (C) 2004-TODAY VNC-Virtual Network Consult GmbH
#    (<http://www.vnc.biz>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################*/

/* This file contains about information */

com_zimbra_erp_mail_connector_AboutPage.prototype = new DwtTabViewPage;

com_zimbra_erp_mail_connector_AboutPage.prototype.constructor = com_zimbra_erp_mail_connector_AboutPage;

function com_zimbra_erp_mail_connector_AboutPage(parent, zimlet){
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	this._createHTML();
}

com_zimbra_erp_mail_connector_AboutPage.prototype._createHTML = function() {
	var data = {"zmlt":this.zimlet}
	this.getHtmlElement().innerHTML = AjxTemplate.expand("com_zimbra_erp_mail_connector.templates.about#about",data);
}
