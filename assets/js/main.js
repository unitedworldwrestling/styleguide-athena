// opt-in some bootstrap features
$(function () {
    'use strict';
    $('[data-toggle="tooltip"]').tooltip();
});

(function () {
    'use strict';
    $.views.settings.delimiters('<%', '%>');
    
    var chosen = $('[data-type=chosen]');
    chosen.chosen({ allow_single_deselect: true, display_disabled_options: false });
    $('.chosen-results').mouseenter(function () {
      $(this).find('.group-result').click(function () {
        var element = $(this);
        var children = element.nextUntil('.group-result');
        var options = element.closest('.chosen-container-multi').prev().find('optgroup, option');

        children.each(function () {
          var index = this.getAttribute('data-option-array-index');
          options[index].selected = true;
        });

        chosen.trigger('chosen:updated');
      });
    });

    // Hack to add a link in the "no result"
    document.addEventListener('click', function(event){
      if(event.target.matches('.chosen-container .no-results a')){
        event.stopPropagation();
      }
    }, true);

    var searchBox = $('#search_all');
    searchBox.typeahead({
        minLength: 2
      }, {
        displayKey: 'name',
        source: function (query, callback) {
          $.get(Routing.generate('search', { q: query }), function (data) {
            callback(data);
          });
        },
        templates: {
          suggestion: function (suggestion) {
            return '<p><i class="fa ' + suggestion.icon + '"></i> ' + suggestion.name + '</p>';
          },
          empty: function (event) {
            if (event.query === '') {
              return '';
            }
            return '<p class="tt-suggestion">No results found for <strong>' + event.query + '</strong>.</p>';
          }
        }
      }
    );
    searchBox.bind('typeahead:selected', function (event, value/*, dataset*/) {
      location.href = Routing.generate(value.route, { id: value.id });
    });

    var personAutocomplete = $('#personAutocomplete');
    var personInput = $('#person');
    personAutocomplete.typeahead({
        minLength: 3
      }, {
        displayKey: 'name',
        source: function (query, callback) {
          $.get(Routing.generate('search', { q: query, type: 'person' }), function (data) {
            callback(data);
          });
        },
        templates: {
          suggestion: function (suggestion) {
            return '<p><i class="fa ' + suggestion.icon + '"></i> ' + suggestion.name + '</p>';
          },
          empty: function (event) {
            if (event.query === '') {
              return '<p class="tt-suggestion">No results found.</p>';
            }
            return '<p class="tt-suggestion">No results found for <strong>' + event.query + '</strong>.</p>';
          }
        }
      }
    );
    
    personAutocomplete.bind('typeahead:selected', function (event, value/*, dataset*/) {
      personInput.val(value.id);
    });

    var participantsSearch = $('#participants_search');
    var participantsSearchId = $('#participants_search_id');
    if (participantsSearch.length > 0) {
      var competitionId = participantsSearch.closest('form').data('competition');
      participantsSearch.typeahead({
          minLength: 3
        }, {
          displayKey: 'name',
          source: function (query, callback) {
            $.get(Routing.generate('competitions_participants_search', { competition: competitionId, q: query }), function (data) {
              callback(data);
            });
          },
          templates: {
            suggestion: function (suggestion) {
              return '<p>' + suggestion.name + '</p>';
            },
            empty: function (event) {
              if (event.query === '') {
                return '<p class="tt-suggestion">No results found.</p>';
              }
              return '<p class="tt-suggestion">No results found for <strong>' + event.query + '</strong>.</p>';
            }
          }
        }
      );
      participantsSearch.bind('typeahead:selected', function (event, value/*, dataset*/) {
        participantsSearchId.val(value.id);
      });
    }

    // Create a button with data-unselect attribute and value pointing to a select
    var unselectControls = $('[data-unselect]');
    unselectControls.each(function () {
      var control = $(this);
      var target = $('#' + control.data('unselect'));

      control.click(function () {
        target.find('option').attr('selected', false);
        target.trigger('chosen:updated');
      });
    });

    var autosubmitControls = $('[data-submit=auto]');
    autosubmitControls.on('change', function () {
      this.form.submit();
    });

    // $('.order-license-year input[type="radio"]').change(function() {
    $(document).on('change', '.order-license-year input[type="radio"]', function(){
      var $form = $(this).closest('form');
      var data = {};
      var $selectedYearRadio = $('.order-license-year input[type="radio"]:checked');
      var $selectedAgeRadio = $('.order-license-age input[type="radio"]:checked');
      data[$selectedYearRadio.attr('name')] = $selectedYearRadio.val();
      data[$selectedAgeRadio.attr('name')] = $selectedAgeRadio.val();
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: data,
        complete: function(jqXHR) {
          $('.order-license-ajax-target').replaceWith(
            $(jqXHR.responseText).find('.order-license-ajax-target')
          );

          $('.order-free-license-ajax-target').replaceWith(
            $(jqXHR.responseText).find('.order-free-license-ajax-target')
          );
        }
      });
    });


    // $('.order-license-age input[type="radio"]').change(function() {
    $(document).on('change', '.order-license-age input[type="radio"]', function(){
      var $form = $(this).closest('form');
      var data = {};
      var $selectedYearRadio = $('.order-license-year input[type="radio"]:checked');
      var $selectedAgeRadio = $('.order-license-age input[type="radio"]:checked');
      data[$selectedYearRadio.attr('name')] = $selectedYearRadio.val();
      data[$selectedAgeRadio.attr('name')] = $selectedAgeRadio.val();
      $.ajax({
        url: $form.attr('action'),
        type: $form.attr('method'),
        data: data,
        complete: function(jqXHR) {
          $('.order-free-license-ajax-target').replaceWith(
            $(jqXHR.responseText).find('.order-free-license-ajax-target')
          );
        }
      });
    });
}());

// Checkout
(function($){
  'use strict';

  var $bankInfos = $('.js-bank-infos');
  var $paymentOptions = $('.js-payment-form input[type=radio]');

  $paymentOptions.on('change', function() {
    var value = $(this).val();
    // choose bank transfer
    if ('2' === value) {
      $bankInfos.removeClass('hide');
      $('#invoice-price').show();
      $('#credit-card-price').hide();
      $('#credit-card-tax-add').hide();
    } else {
      $bankInfos.addClass('hide');
      $('#invoice-price').hide();
      $('#credit-card-price').show();
      $('#credit-card-tax-add').show();
    }
  });

}(jQuery));

// Preview passport pdf - one modal, one iframe and dynamic content
(function($){
    'use strict';
    $('.js-modal-file-preview').on('show.bs.modal', function (event) {
        var link = $(event.relatedTarget);
        var url = link.data('download');
        var title = link.data('title');
        var modal = $(this);
        modal.find('.js-pdf-preview').attr('src', url);
        modal.find('.js-pdf-download').attr('href', url);
        modal.find('.js-pdf-preview-title').text(title);
    });
}(jQuery));

// Manage pdf preview modal height
(function($){
    'use strict';
  if ($('#js-pdf-preview').length !== 0) {
    $('#js-pdf-preview').height(($(window).height()) - 280);
  }
}(jQuery));

var options = {
  
};
(function($){
  'use strict';
  $('#crop-img').cropper({
    viewMode: 1,
    //preview: '.crop-preview',
    aspectRatio: 5 / 7,
  });

  $('form#crop_image').submit(function(){
    var img = $('#crop-img');
    
    var personId = $(img).data('person');
    var imageId = $(img).data('picture');
//    var type = $(img).data('type');

    img.cropper('getCroppedCanvas', { width: 315, height: 440 }).toBlob(function (blob) {
      var formData = new FormData();
      formData.append('croppedImage', blob);

      $.ajax(Routing.generate('person_images_crop_upload', { person: personId, picture: imageId }), {
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false
      });
    });
  });

  $('#person_deceased').change(function() {
    if($(this).prop('checked')) {
        $('#isDeceased').collapse('show');
    } else {
      $('#isDeceased').collapse('hide');
    }
  });
}(jQuery));
