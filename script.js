/*
  Colorer for Trello
  Extenion for Chrome and Trello
  Author: Eugene Kuzmin
*/
(function($){

  var colorer = function() {

    var labels,
      cssBE = {
        background: 'red'
      },
      cssFE = {
        background: 'yellow'
      },
      taskStates = ['Todo', 'InProgress', 'ReadyFoTest', 'Done'],
      that = this;

    // =
    this.doUI = function() {
      var user    = $('.js-member-name').text(),
        $cards  = $('.list-card');

      $cards.each(updateCard);

      addImgIcon();
    };

    var addImgIcon = function() {
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

        //console.log($cardTitle.attr('class'));
        if(cardId) {
          var $cardIdBox = $('<div />', {class: 'card-label card-id', text: cardId[0] });
          $cardLabels.prepend($cardIdBox);
        }
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

    // =
    this.init = function() {
      var urlPath = window.location.pathname,
        boardId = /^.*\/(.*)\/.*$/.exec(urlPath);

      if(boardId && boardId[1]) {
        $.getJSON('https://trello.com/1/boards/' + boardId[1] + '/labelNames?key=e365f52ed1653300b1940e4fbe73cda5', function(data){
          labels = data;
          that.doUI();
        });
      }
    };
  };


  $(function(){
    var colorerInstance = new colorer(),
      $card2Update;

    colorerInstance.init();

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      labelsChangingObs = new MutationObserver(function(mutations, observer) {
        for(var i = 0; i < mutations.length; ++i) {
          var $self = $(mutations[i].target);
          if(!$self.attr('class') || $self.hasClass('date')) {
            continue;
          }

          if($self.hasClass('js-card-labels')) {
            $card2Update = $self.closest('.list-card');

            $self.removeClass('js-colorer-inited');
            $card2Update.find('.js-card-name').removeClass('js-colorer-inited');
            
            colorerInstance.doUI();
          }
          else if($self.hasClass('board-header-btn')) {
            colorerInstance.init();
          }
          else if($self.hasClass('list-card-details')) {
             colorerInstance.doUI();
          }
        }
      });

      if(labelsChangingObs && labelsChangingObs.observe !== null) {
        labelsChangingObs.observe(document, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }

  });

})(jQuery);