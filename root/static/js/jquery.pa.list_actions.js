$().ready(function() {
    $('input.toggle').each(function() {
        var cb   = $(this);
        var name = cb.attr('id');

        // toggle check-boxes list
        cb.change(function(){
            $('input[name=' + name + ']').attr('checked', cb.attr('checked'));
            $('input[name=' + name + ']:last').trigger('change');
        });

        // trigger list events
        $('input[name=' + name + ']').each(function() {
            var item = $(this);
            item.change(function() {
                var active   = 0;
                var inactive = 0;
                $('input[name=' + name + ']').each(function() {
                    if ( $(this).attr('checked') ) { active++ }
                    else { inactive++ }
                });
                if ( active && !inactive ) { cb.trigger('AllActive') }
                if ( active == 1 )         { cb.trigger('SingleActive') }
                else if ( active > 1  )    { cb.trigger('MultiActive', [ active ]) }
                else if ( !active )        { cb.trigger('NoneActive') }
                if ( inactive )            { cb.trigger('ExistInactive', [ inactive ]) }
            });
        });

        // bind some default list functionality
        cb.bind('AllActive', function(){ cb.attr( 'checked', true ) } );
        cb.bind('ExistInactive', function(){ cb.attr( 'checked', false ) } );

        // setup link actions related to the list
        $('a.' + name + '_action' ).each(function() {
            var action = $(this);
            action.click(function(){ 
                cb.trigger('ExecAction', [ action ]); 
                return false; 
            });

            if ( action.hasClass('single') ) {
                cb.bind('MultiActive',  function() { deactivate( action ) });
                cb.bind('SingleActive', function() { activate( action ) });
            }
            else if (action.hasClass('multi')) {
                cb.bind('MultiActive',  function() { activate( action ) });
                cb.bind('SingleActive', function() { deactivate( action ) });
            }
            else { // act as 'any' by default
                cb.bind('MultiActive',  function() { activate( action ) });
                cb.bind('SingleActive', function() { activate( action ) });
            }

            cb.bind('NoneActive',  function() { deactivate( action ) });
        });

        cb.bind('ExecAction',  function( ev, action ) { 
            var url    = action.attr('href');
            var fields = $('input[name=' + name + ']:checked');
            var value_field = /_value_/;

            if ( value_field.test(url) && fields.length == 1 ) {
                window.location = url.replace( value_field, fields.get(0).value );
            }
            else {
                //fields.wrapAll('<form action="' + url + '" id="' + name +'_form"/>');
                //$('#' + name + '_form').submit();

                window.location = url + '?' + fields.serialize();
            }
        });

        // hack: trigger a change to setup the from the fill in fields
        $('input[name=' + name + ']:last').trigger('change');
    });

    function activate( element ) {
        element.removeClass('inactive');
        element.fadeTo('fast', 1);
    }
    function deactivate( element ) {
        element.addClass('inactive');
        element.fadeTo('fast', 0.33);
    }
});
