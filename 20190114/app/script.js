/* first things first--we've got to hide results before the document loads
and them show them again during document ready, so we don't get the weird
"jump" */

if (navigator.userAgent.match(/MSIE/)) {
  document.styleSheets[0].addRule("#quick-access-block-wrap", "display:none");
} else {
	for (var i=0; i<document.styleSheets.length; i++) {
		if (typeof(document.styleSheets[i].href) === "string" && document.styleSheets[i].href.match(/\/ThemeDefault.css/)) {
			document.styleSheets[i].insertRule("#quick-access-block-wrap {display:none;}", 1);
		}
	}
}

$(document).ready(function(){
	// First get rid of .no-js class
	$("#page-wrap").removeClass("no-js");
	
	// Modifications for journal citation display
	if ($("#CitationResults").length) {
		$("#CitationResults").prepend("<h2>Get the Full Text</h2>");
    // Custom links table
		var lib_search_link = $("span.CustomLinkGroupLabel:contains('UNT Library Catalog Search')").parents("table").eq(0).find("td.CustomLinkGroup a");
		lib_search_link.text("Check the UNT Library Catalog");
		lib_search_link.attr("href", "https://iii.library.unt.edu/screens/openurl.html" + window.location.search);
		var ILL_link = $("span.CustomLinkGroupLabel:contains('Interlibrary Loan')").parents("table").eq(0).find("td.CustomLinkGroup a");
		ILL_link.text("Request this item through ILLiad");
    var custom_link_ptables = $("td.CustomLinkGroupLabel").parents("table");
    $(custom_link_ptables[custom_link_ptables.length-1]).addClass("CustomLinkTable");
    $($("table.CustomLinkTable br")[0]).remove();
    $("table.CustomLinkTable").before("<h4>Can't Find It? Try:</h4>");
    
    // Coverage table
    $("#JournalLinkTable td.ContentHeading").hide();
    
    if ($("#CitationJournalArticleLabel").length) {
      var journal_name = $.trim($("#CitationJournalTitleValue").text());   
      $("#JournalLinkTable").before("<h3>Access <em>" + journal_name + "</em></h3>");
    }
		
		$("#DateCL").each(function() {
			var date_text = "Full-text available: " + $(this).text();
			$(this).text(date_text);
			$(this).parent().attr("align", "left");
			$(this).parent().attr("width", "25%");
		});
    var article_findit = false;
		$("#ArticleCL").each(function() {
			if ($.trim($(this).text())) {
        article_findit = true;
        var findit_html = "<img src=\"//unt-libraries.github.io/assets360/img/find-it-round.png\" alt=\"FIND IT\" /> Go to Article";
        $(this).find("a").html(findit_html);
        $(this).addClass("find-it");
        $(this).parent().attr("align", "left").attr("width", "25%");
			} else {
				$(this).parent().attr("width", "1%");
			}
		});
		$("#JournalCL").each(function() {
      var journal_html = "Go to Journal";
      if (!article_findit) {
        var journal_html = "<img src=\"//unt-libraries.github.io/assets360/img/find-it-round.png\" alt=\"FIND IT\" /> " + journal_html;
        $(this).addClass("find-it");
        $(this).parent().attr("width", "25%");
      }
      $(this).find("a").html(journal_html);
      $(this).parent().attr("align", "left")
		});
		$("#DatabaseCL").each(function() {
			var db_link_el = $(this).find("a.SS_DatabaseHyperLink");
			if (db_link_el.length) {
				$(this).prepend($("<span>[ In Database: </span>"));
        $(this).append($("<span>]</span>"));
			}
			$(this).parent().attr("align", "left").attr("width", "");
		});
		
	}
	
});