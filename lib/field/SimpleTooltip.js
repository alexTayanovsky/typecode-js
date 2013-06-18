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
	
	NI.field.co.SIMPLE_TOOLTIP_CLASS = 'tc-field-simple-toolip';

	NI.field.extensions.SimpleTooltip = function(field, options) {
		var me, o, internal, event_handlers;
		
		me = this;
		o = $.extend({
			content: null,
			orientation:'left',//'top'
			css: {},
			fx: {
				in_fx: 200,
				out_fx: 50
			},
			watch_events: {
				in_event: "focus",
				out_event: "blur"
			}
		}, options);

		internal = {
			name:'TC.field Extension.SimpleTooltip',
			$e:$("<div class='"+ NI.field.co.SIMPLE_TOOLTIP_CLASS +"'></div>")
		};
		
		function init() {

			internal.$e.addClass(o.orientation);
			internal.$e.css($.extend({
				
			}, o.css));
			internal.$e.prependTo(field.$e);
			
			internal.$e.html(o.content);

			field.event_receiver.bind(o.watch_events.in_event, event_handlers.in_fn);
			field.event_receiver.bind(o.watch_events.out_event, event_handlers.out_fn);

			field.set_tooltip_content = function(new_content){
				internal.$e.html(new_content);
			};

			field.get_tooltip_content = function(new_content){
				return internal.$e;
			};

		}

		event_handlers = {
			in_fn: function(e,d){
				if (! internal.$e.is(":empty")) {
					internal.$e.fadeIn(o.fx.in_fx);
				}
			},
			out_fn: function(e,d){
				internal.$e.fadeOut(o.fx.out_fx);
			}
		};

		this.show = function(){
			event_handlers.in_fn();
		};

		this.hide = function(){
			event_handlers.out_fn();
		};
		
		init();
	};

	return NI.field.extensions.SimpleTooltip;

});