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

        html[i++]="<b>kapil</b>";
	this.getHtmlElement().innerHTML = html.join("");
}
