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

/*************/
/* superfish */
/*************/

/*
 * jQuery Superfish Menu Plugin - v1.7.5
 * Copyright (c) 2014 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */

;(function ($, w) {
	"use strict";

	var methods = (function () {
		// private properties and methods go here
		var c = {
				bcClass: 'sf-breadcrumb',
				menuClass: 'sf-js-enabled',
				anchorClass: 'sf-with-ul',
				menuArrowClass: 'sf-arrows'
			},
			ios = (function () {
				var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
				if (ios) {
					// iOS clicks only bubble as far as body children
					$(w).load(function () {
						$('body').children().on('click', $.noop);
					});
				}
				return ios;
			})(),
			wp7 = (function () {
				var style = document.documentElement.style;
				return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
			})(),
			unprefixedPointerEvents = (function () {
				return (!!w.PointerEvent);
			})(),
			toggleMenuClasses = function ($menu, o) {
				var classes = c.menuClass;
				if (o.cssArrows) {
					classes += ' ' + c.menuArrowClass;
				}
				$menu.toggleClass(classes);
			},
			setPathToCurrent = function ($menu, o) {
				return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels)
					.addClass(o.hoverClass + ' ' + c.bcClass)
						.filter(function () {
							return ($(this).children(o.popUpSelector).hide().show().length);
						}).removeClass(o.pathClass);
			},
			toggleAnchorClass = function ($li) {
				$li.children('a').toggleClass(c.anchorClass);
			},
			toggleTouchAction = function ($menu) {
				var msTouchAction = $menu.css('ms-touch-action');
				var touchAction = $menu.css('touch-action');
				touchAction = touchAction || msTouchAction;
				touchAction = (touchAction === 'pan-y') ? 'auto' : 'pan-y';
				$menu.css({
					'ms-touch-action': touchAction,
					'touch-action': touchAction
				});
			},
			applyHandlers = function ($menu, o) {
				var targets = 'li:has(' + o.popUpSelector + ')';
				if ($.fn.hoverIntent && !o.disableHI) {
					$menu.hoverIntent(over, out, targets);
				}
				else {
					$menu
						.on('mouseenter.superfish', targets, over)
						.on('mouseleave.superfish', targets, out);
				}
				var touchevent = 'MSPointerDown.superfish';
				if (unprefixedPointerEvents) {
					touchevent = 'pointerdown.superfish';
				}
				if (!ios) {
					touchevent += ' touchend.superfish';
				}
				if (wp7) {
					touchevent += ' mousedown.superfish';
				}
				$menu
					.on('focusin.superfish', 'li', over)
					.on('focusout.superfish', 'li', out)
					.on(touchevent, 'a', o, touchHandler);
			},
			touchHandler = function (e) {
				var $this = $(this),
					$ul = $this.siblings(e.data.popUpSelector);

				if ($ul.length > 0 && $ul.is(':hidden')) {
					$this.one('click.superfish', false);
					if (e.type === 'MSPointerDown' || e.type === 'pointerdown') {
						$this.trigger('focus');
					} else {
						$.proxy(over, $this.parent('li'))();
					}
				}
			},
			over = function () {
				var $this = $(this),
					o = getOptions($this);
				clearTimeout(o.sfTimer);
				$this.siblings().superfish('hide').end().superfish('show');
			},
			out = function () {
				var $this = $(this),
					o = getOptions($this);
				if (ios) {
					$.proxy(close, $this, o)();
				}
				else {
					clearTimeout(o.sfTimer);
					o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
				}
			},
			close = function (o) {
				o.retainPath = ($.inArray(this[0], o.$path) > -1);
				this.superfish('hide');

				if (!this.parents('.' + o.hoverClass).length) {
					o.onIdle.call(getMenu(this));
					if (o.$path.length) {
						$.proxy(over, o.$path)();
					}
				}
			},
			getMenu = function ($el) {
				return $el.closest('.' + c.menuClass);
			},
			getOptions = function ($el) {
				return getMenu($el).data('sf-options');
			};

		return {
			// public methods
			hide: function (instant) {
				if (this.length) {
					var $this = this,
						o = getOptions($this);
					if (!o) {
						return this;
					}
					var not = (o.retainPath === true) ? o.$path : '',
						$ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
						speed = o.speedOut;

					if (instant) {
						$ul.show();
						speed = 0;
					}
					o.retainPath = false;
					o.onBeforeHide.call($ul);
					$ul.stop(true, true).animate(o.animationOut, speed, function () {
						var $this = $(this);
						o.onHide.call($this);
					});
				}
				return this;
			},
			show: function () {
				var o = getOptions(this);
				if (!o) {
					return this;
				}
				var $this = this.addClass(o.hoverClass),
					$ul = $this.children(o.popUpSelector);

				o.onBeforeShow.call($ul);
				$ul.stop(true, true).animate(o.animation, o.speed, function () {
					o.onShow.call($ul);
				});
				return this;
			},
			destroy: function () {
				return this.each(function () {
					var $this = $(this),
						o = $this.data('sf-options'),
						$hasPopUp;
					if (!o) {
						return false;
					}
					$hasPopUp = $this.find(o.popUpSelector).parent('li');
					clearTimeout(o.sfTimer);
					toggleMenuClasses($this, o);
					toggleAnchorClass($hasPopUp);
					toggleTouchAction($this);
					// remove event handlers
					$this.off('.superfish').off('.hoverIntent');
					// clear animation's inline display style
					$hasPopUp.children(o.popUpSelector).attr('style', function (i, style) {
						return style.replace(/display[^;]+;?/g, '');
					});
					// reset 'current' path classes
					o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
					$this.find('.' + o.hoverClass).removeClass(o.hoverClass);
					o.onDestroy.call($this);
					$this.removeData('sf-options');
				});
			},
			init: function (op) {
				return this.each(function () {
					var $this = $(this);
					if ($this.data('sf-options')) {
						return false;
					}
					var o = $.extend({}, $.fn.superfish.defaults, op),
						$hasPopUp = $this.find(o.popUpSelector).parent('li');
					o.$path = setPathToCurrent($this, o);

					$this.data('sf-options', o);

					toggleMenuClasses($this, o);
					toggleAnchorClass($hasPopUp);
					toggleTouchAction($this);
					applyHandlers($this, o);

					$hasPopUp.not('.' + c.bcClass).superfish('hide', true);

					o.onInit.call(this);
				});
			}
		};
	})();

	$.fn.superfish = function (method, args) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			return $.error('Method ' +  method + ' does not exist on jQuery.fn.superfish');
		}
	};

	$.fn.superfish.defaults = {
		popUpSelector: 'ul,.sf-mega', // within menu context
		hoverClass: 'sfHover',
		pathClass: 'overrideThisToUse',
		pathLevels: 1,
		delay: 800,
		animation: {opacity: 'show'},
		animationOut: {opacity: 'hide'},
		speed: 'normal',
		speedOut: 'fast',
		cssArrows: true,
		disableHI: false,
		onInit: $.noop,
		onBeforeShow: $.noop,
		onShow: $.noop,
		onBeforeHide: $.noop,
		onHide: $.noop,
		onIdle: $.noop,
		onDestroy: $.noop
	};

})(jQuery, window);

$(document).ready(function(){
	// First get rid of .no-js class
	$("#page-wrap").removeClass("no-js");
	
	// Modifications for journal citation display
	if ($("#CitationResults").length) {
		$("#CitationResults").prepend("<h2>Get the Full Text</h2>");
    // Custom links table
		var lib_search_link = $("span.CustomLinkGroupLabel:contains('UNT Library Catalog Search')").parents("table").eq(0).find("td.CustomLinkGroup a");
		lib_search_link.text("Check the UNT Library Catalog");
		lib_search_link.attr("href", "http://iii.library.unt.edu/screens/openurl.html" + window.location.search);
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
		
	// Superfish on horizontal menu at the top of the page	
	$("ul.sf-menu").superfish({disableHI: true});
	
});