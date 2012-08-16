/* This file contains about information */

about_setting.prototype = new DwtTabViewPage;

about_setting.prototype.constructor = about_setting;

var zm;

function about_setting(parent, zimlet){
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	zm=this.zimlet;
	this._createHTML();
}

about_setting.prototype._createHTML = function() {
	var i = 0;
	var html = new Array();
	html[i++]="<table align='center' class='about_logo'>";
	html[i++]="<tr>";
	html[i++]="</tr>";
	html[i++]="<tr>";
	html[i++]="<td>";
	html[i++]="<div id='logo' style='width:100%;height:50%;margin-left:80px;'><img src='"+zm.getResource("resources/VNC-Logo.png")+"'/></div>";
	html[i++]="</td></tr>";
	html[i++]="<tr><td><font face='Times New Roman' size='5px'>VNC OpenERP Zimlet (VOZ)</font></td></tr>";
	html[i++]="<tr><td><b><center>"+zm.getMessage("ZIMLET_VERSION")+"</center></b></td></tr>";
	html[i++]="<tr><td><div class='voz_lincense'>http://www.vnc.biz </div><div>Copyright 2012, VNC - Virtual Network Consult GmbH </div><div class='voz_lincense2'>Released under GPL Licenses. </div></font></center></td></tr>";
	html[i++]="</table>";
	this.getHtmlElement().innerHTML = html.join("");
}
