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

define(['jquery', 'NIApp'], function($, App) {

    var window = this,
    NI = window.NI;

    function PushstateHelper(options) {

        var self = this, o, internal, fn, handlers;

        o = $.extend({
            app: null,
            use_hash: false
        }, options);

        internal = {
            name: 'mod.PushstateHelper'
        };

        fn = {
            init: function() {
                $(document).on('click', '.js-use-pushstate', handlers.doc_click);
                $(window).on('popstate', handlers.popstate_or_hashchange).on('pushstate', handlers.pushstate);

                if (o.use_hash) {
                    require(['hashchange'], function(_hashchange) {
                        $(window).on('hashchange', handlers.popstate_or_hashchange);
                    });
                }

                //fn.statechange(window.location);
            },
            statechange: function(href){
                var path_components;

                if (o.use_hash && href.hash) {
                    path_components = href.hash.split('/');
                } else {
                    path_components = href.pathname.split('/');
                }

                // push the state change to Google Analytics
                if (window._gaq) {
                    _gaq.push(['_trackPageview', href]);
                }

                o.app.events.trigger('navigationEvent:Pushstate', {
                    location: href,
                    components: path_components
                });
            }
        };

        handlers = {
            doc_click: function(e, d) {
                e.preventDefault();
                if (o.use_hash) {
                    window.location.hash = $(this).attr('HREF');
                } else {
                    history.pushState(null, null, $(this).attr('HREF'));
                }
                fn.statechange(window.location);
            },
            popstate_or_hashchange: function(e, d) {
                fn.statechange(window.location);
            },
            pushstate: function(e, d) {
                if (o.use_hash) {
                    if (window.location.hash == d.pathname) {
                        return;
                    }
                    window.location.hash = d.pathname;
                } else {
                    if (window.location.pathname == d.pathname) {
                        return;
                    }
                    history.pushState(null, null, d.pathname);
                }
                if (!d.prevent_propagation) {
                    fn.statechange(d);
                }
            }
        };

        fn.init();
        console.log(internal);
    }

    NI.PushstateHelper = PushstateHelper;

    if (!window.app) {
        console.warn('PushstateHelper singleton expects a global app object to be defined');
    }

    var singleton = new PushstateHelper({
        app: window.app,
        use_hash: (window.history && window.history.pushState ? false : true)
    });

    return singleton;

});