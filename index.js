'use strict';

function showResults () {
  $('form').on('submit', function(event) {
      event.preventDefault();
    $('main').removeClass('hidden');
  });
}


function magic() {
  showResults();
}

$(magic());