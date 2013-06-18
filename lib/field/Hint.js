/* ============================================================================

 >4SESz.,     _,     ,gSEE2zx.,_        .azx                    ,w.
@Sh. "QEE3.  JEE3.  &ss  `*4EEEEE2x.,_  "EEV  ,aS5^;dEEEE2x.,   VEEF  _
\E2`_,gF4EEEx.?jF   EE5L       `*4EEEEE2zpn..ZEEF ;sz.  `*EEESzw.w* '|EE.
  ,dEEF   `"?j]  _,_   ,_  _,     _,.     L.EEEF  !EEF  _,,  `"``    EE7   ,,_
 :EEE7 ,ws,`|EEL`JEEL`JEE)`JEEL zE5` E3. / [EE3  ,w.  zE2` Ek .zE5^JZE3.,6EF [3
 {EEE. VEE7.EE2  AE3. EEV  ZEEL{EEL ws. ;  [EE1  EEEt{E3. JEELEE3. JE5LJEEF ,w,
  \EEk,,>^ JEEL,@EEF ZE5L,ZE5^ "Q3. V2`.    \EEk,,J' "Q[ yE2^ VE[_zEE[,"QEL V5F
          ,ss  :EE7 ;EEF               L,szzw..            ,.,            ``
          \E5.,E5F  EE1.              /; ``*4EEEZhw._      EEEL
            ````     ``              JEEE.     `"45EEEhw.,,,]

From 2010 till ∞
typecode-js v 0.1
*/

// Dependencies:
// NI.field

define(['jquery', 'NIseed', 'NIfield'], function($) {
	
	var window = this,
	NI = window.NI;

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	NI.field.extensions.Hint = function(field, options) {
		var me, o, $e;
		
		me = this;
		o = $.extend({
			content: null,
			html_content: false,
			css: {},
			fx: {
				in_fx: 200,
				out_fx: 200
			},
			watch_events: {
				in_event: ['blur', 'keyup', 'change', NI.field.co.SET_VAL_EVENT, NI.field.co.RESET_EVENT].join(' '),
				out_event: "focus"
			}
		}, options);
		
		function init() {
			$e = $("<div class='"+ NI.field.co.HINT_CLASS +"'></div>");
			$e.css($.extend({
				position: "absolute",
				top: 0,
				left: 0,
				display: "none"
			}, o.css));
			$e.prependTo(field.$e);
			
			$e.click(events.hint_click);
			field.event_receiver.bind(o.watch_events.in_event, events.in_fn);
			field.event_receiver.bind(o.watch_events.out_event, events.out_fn);
			
			me.set(o.content);
			
			if (!field.get_val() || !field.get_val().length) {
				$e.show();
			}
		}
		
		var events = {
			hint_click: function(e, d) {
				field.event_receiver.trigger('focus');
			},
			in_fn: function(e, d) {
				//if (NI.ex.isEmpty(field.get_val())) {
				if (!field.get_val() || !field.get_val().length) {
					if (e.type === "blur" || e.type == NI.field.co.RESET_EVENT) {
						$e.fadeIn(o.fx.in_fx);
					}
				} else {
					$e.fadeOut(o.fx.out_fx);
				}
			},
			out_fn: function(e, d) {
				$e.fadeOut(o.fx.out);
			}
		};
		
		// (chainable)
		this.set = function(content) {
			if (content instanceof $) {
				$e.empty().append(content);
			} else if (typeof content === "string") {
				//if (!NI.ex.isEmpty(content)) {
				if (!field.get_val() || !field.get_val().length) {
					if (o.html_content === true) {
						$e.empty().html(content);
					} else {
						$e.empty().text(content);
					}
				}
			}
			return this;
		};
		
		this.destroy = function() {
			$e.remove();
			field.event_receiver.unbind(o.watch_events.in_event, events.in_fn);
			field.event_receiver.unbind(o.watch_events.out_event, events.out_fn);
		};
		
		init();
	};

	return NI.field.extensions.Hint;

});