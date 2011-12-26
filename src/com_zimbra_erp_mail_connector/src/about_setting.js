about_setting.prototype = new DwtTabViewPage;
about_setting.prototype.constructor = about_setting;


var zm;

function about_setting(parent, zimlet){

	DwtTabViewPage.call(this,parent);
	 this.zimlet = zimlet;
        zm=this.zimlet;
	 this._createHTML();
	this.setScrollStyle(Dwt.SCROLL);

	
}




about_setting.prototype._createHTML = function() {
        var i = 0;

        var html = new Array();

        html[i++]="<table align='center' class='about_logo'>";

	html[i++]="<tr>";
	html[i++]="<td><font face='Wide Latin' size='5px'>Developed By</font></td>";
	html[i++]="</tr>";
	html[i++]="<tr>";
	html[i++]="<td>";
	html[i++]="<div id='logo' style='width:100%;height:50%;margin-left:70px;'><img src='"+zm.getResource("resources/VNC-Logo.png")+"'/></div>";
	html[i++]="</td>";
	html[i++]="</tr>";
	html[i++]="</table>";
	this.getHtmlElement().innerHTML = html.join("");
}
