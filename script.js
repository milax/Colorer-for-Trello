(function($){
    var labels,
        cssBE = {
            background: 'red'
        },
        cssFE = {
            background: 'yellow'
        };

    $(function(){
        var urlPath = window.location.pathname,
            boardId = /^.*\/(.*)\/.*$/.exec(urlPath);

        $.getJSON('https://trello.com/1/boards/' + boardId[1] + '/labelNames?key=e365f52ed1653300b1940e4fbe73cda5', function(data){
            labels = data;
            doUI();
            setInterval(doUI, 500);
        });
    });

    var taskStates = ['Todo', 'InProgress', 'ReadyFoTest', 'Done'];

    function doUI() {

        var user = $('#header-row li[command=user] .text').text();

        $('.list-card').each(function(){
            var $self = $(this);

            var $cardLabels = $self.find('.card-labels');

            // TITLES
            var $carsTitle = $self.find('.list-card-title');
            if(!$carsTitle.hasClass('creCustom')) {
                $carsTitle.addClass('creCustom');
                var text = $carsTitle.text();
                var cardId = text.match(/(#\d+)/);

                if(cardId) {
                    $cardLabels.prepend($('<div />', {class: 'card-label card-id', text: cardId[0] }));
                }
                var newTitle = text.replace(/#\d+/, '');
                $carsTitle.text(newTitle);
            }

            // CARD LABELS
            if(!$cardLabels.hasClass('creCustom')) {
                $cardLabels.addClass('creCustom');

                var $labels = $self.find('.card-label');
                if($labels.length) {
                    var devBug = false;
                    $labels.each(function(){
                        var $currLabel = $(this);
                        for(var i in labels) {
                            if($currLabel.hasClass(i + '-label')) {
                                var txt = labels[i];
                                $currLabel.text(txt);
                                if(txt === 'BE' || txt === 'FE') {
                                    var bg = rgb2hex($currLabel.css('background-color'));
                                    $self.css('background', 'rgba('+ hexToRgb(bg).r +', '+ hexToRgb(bg).g +', ' + hexToRgb(bg).b + ', 0.2)');
                                    devBug = true;
                                }
                                break;
                            }
                        }
                    });
                    $self.find('.list-card-cover img').css({
                        'margin-top': '-15px',
                        'z-index': 0
                    });
                    if(!devBug) {
                        $self.removeAttr('style');
                    }
                }
            }
        });

        var $popup = $('.window-wrapper .window-main-col');
        if($popup.length) {
            $popup.find('.preview.js-real-link').each(function(){
                var $self = $(this),
                    $fileName = $self.attr('title');
                if($fileName.match(/.*\.(jpg|png|jpeg|gif)$/)) {
                    $self.find('.google-drive-logo').addClass('icn-gd-image');
                }
            });
        }
    }
})(jQuery);


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var hexDigits = new Array ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}