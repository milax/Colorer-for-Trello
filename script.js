(function($){

    var colorer = function() {

        var labels,
            cssBE = {
                background: 'red'
            },
            cssFE = {
                background: 'yellow'
            },
            taskStates = ['Todo', 'InProgress', 'ReadyFoTest', 'Done'];

        // =
        this.init = function() {
            var urlPath = window.location.pathname,
                boardId = /^.*\/(.*)\/.*$/.exec(urlPath);

            $.getJSON('https://trello.com/1/boards/' + boardId[1] + '/labelNames?key=e365f52ed1653300b1940e4fbe73cda5', function(data){
                labels = data;
                doUI();
                setInterval(doUI, 500);
            });
        };

        var updateCard = function() {
            var $card       = $(this),
                $cardLabels = $card.find('.js-card-labels'),
                $cardTitle  = $card.find('.js-card-name'),
                INITED      = 'js-colorer-inited';
            
            updateTitles();
            updateLabels();

            function updateTitles() {
                if($cardTitle.hasClass(INITED)) {
                    return false;
                }
                $cardTitle.addClass(INITED);

                var cardTitleText = $cardTitle.text(),
                    cardId = cardTitleText.match(/(#\d+)/);
                    cardNewTitleText = cardTitleText.replace(/#\d+/, '');

                if(cardId) {
                    var $cardIdBox = $('<div />', {class: 'card-label card-id', text: cardId[0] });
                    $cardLabels.prepend($cardIdBox);
                }
                $cardTitle.text(cardNewTitleText);
            }

            function updateLabels() {
                if($cardLabels.hasClass(INITED)) {
                    return false;
                }
                $cardLabels.addClass(INITED);

                var $labels = $card.find('.card-label'),
                    isFeBeCard = false;

                repaint();

                function repaint() {
                    if(!$labels.length) {
                        return false;
                    }
                    $labels.each(updateThisLabel);

                    if(!isFeBeCard) {
                        $card.removeAttr('style');
                    }
                }
                function updateThisLabel() {
                    var $label = $(this);
                    for(var color in labels) {
                        if($label.hasClass('card-label-' + color)) {
                            var txt = labels[color];
                            $label.text(txt);
                            colorizeBeFeCards({
                                $label: $label,
                                txt: txt
                            });
                            break;
                        }
                    }
                }
                function colorizeBeFeCards(opts) {
                    if(opts.txt === 'BE' || opts.txt === 'FE') {
                        var bg = rgb2hex(opts.$label.css('background-color'));
                        $card.css('background', 'rgba('+ hex2rgb(bg).r +', '+ hex2rgb(bg).g +', ' + hex2rgb(bg).b + ', 0.2)');
                        isFeBeCard = true;
                    }
                }
            }
        };

        // =
        var doUI = function() {
            var user = $('.js-member-name').text();

            $('.list-card').each(updateCard);
/*
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
*/
        };
        
        // =
        var hex2rgb = function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        // =
        var rgb2hex = function(rgb) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        };

        // =
        var hex = function(x) {
            var hexDigits = new Array ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
            return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
        };
    };


    $(function(){
        var colorerInstance = new colorer();
        colorerInstance.init();
    });

})(jQuery);

