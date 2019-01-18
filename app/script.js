/* first things first--we've got to hide results before the document loads
and them show them again during document ready, so we don't get the weird
"jump" */

if (navigator.userAgent.match(/MSIE/)) {
  document.styleSheets[0].addRule("#content", "display:none");
} else {
	for (var i=0; i<document.styleSheets.length; i++) {
		if (typeof(document.styleSheets[i].href) === "string" && document.styleSheets[i].href.match(/\/ThemeDefault.css/)) {
			document.styleSheets[i].insertRule("#content {display:none;}", 1);
		}
	}
}

$(document).ready(function(){
	// First get rid of .no-js class
	$("#page-wrap").removeClass("no-js");
  
  // ***** BUTTONS
  
  // Define behavior of search spinner for search/submit buttons ...
  var do_spinner = function(el) {
    var spinner = $('<i class="fal fa-sync fa-spin"></i>');
    el.addClass("disabled");
    el.find("i").replaceWith(spinner);
  }
	
	// Define function to add spinner behavior on submission of search forms ...
  var add_submit_behavior = function(form_sel, button_sel) {
    var form_el = $(form_sel);
    var button_el = $(button_sel);
    if (button_el.length && form_el.length) {
      button_el.on('click', function(ev) {
        ev.preventDefault();
        form_el.submit();
      });
      form_el.on('submit', function() {
        do_spinner(button_el);
        return true;
      });
    }
  }
  
  // Find all search buttons on any screen ... 
  var possible_search_btns = ["input:submit[value='Search']"];
  var search_btn;
  possible_search_btns.forEach(function(selector) {
    if (!search_btn && $(selector).length) {
      search_btn = $(selector);
    }
  });
  
  // Set standard HTML and behavior for the search button.
  $(search_btn).each(function() {
    var new_btn = $('<a class="submitLinkButton btn btn-success" href="#"><i class="fa fa-search"></i> Search</a>');
    $(this).replaceWith(new_btn);
    add_submit_behavior(new_btn.parents("form"), new_btn);
  });
	
	// Modifications for journal citation display
	if ($("#CitationResults").length) {
		$("#CitationResults").prepend("<h2>Get the Full Text</h2>");
    $("#CitationResults").prev("p").remove();
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
        var findit_html = "<img src=\"https://gitcdn.link/repo/unt-libraries/assets360/v2.0.2/assets/images/find-it-round.png\" alt=\"FIND IT\" /> Go to Article";
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
        var journal_html = "<img src=\"https://gitcdn.link/repo/unt-libraries/assets360/v2.0.2/assets/images/find-it-round.png\" alt=\"FIND IT\" /> " + journal_html;
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
    
    $("#content").show();		
	}
	
});