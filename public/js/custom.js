$(document).on('click', '#plus', function(e) {
  e.preventDefault();
  var priceValue = parseFloat($('#priceValue').val());
  var quantity = parseInt($('#quantity').val());

  priceValue += parseFloat($('#priceHidden').val());
  quantity += 1;

  $('#quantity').val(quantity);
  $('#priceValue').val(priceValue.toFixed(2));
  $('#priceHidden').val(priceValue.toFixed(2));
  $('#total').html(quantity);
});

$(document).on('click', '#minus', function(e) {
  e.preventDefault();
  var priceValue = parseFloat($('#priceValue').val());
  var quantity = parseInt($('#quantity').val());

  if (quantity == 1) {
    priceValue = ($('#priceHidden').val());
    quantity = 1;
  } else {
    priceValue -= parseFloat($('#priceHidden').val());
    quantity -= 1;
  }

  $('#quantity').val(quantity);
  $('#priceValue').val(priceValue.toFixed(2));
  $('#priceHidden').val(priceValue.toFixed(2));
  $('#total').html(quantity);

});

$("#apiBtn").click(function() {
  alert('form#example-advanced-form clicked');
  var data = $('form#example-advanced-form').serialize();
  console.log(data);

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/api/verify",
    data: data,
    dataType: "json",
    cache: false,
    processData: false,
    success: function(data) {
      var result = JSON.stringify(data);
      result = jQuery.parseJSON(result);

      console.log(result);

      alert('Entered age verification api');

      if ((result.status == "found") && (result.age == 'under')) {
        alert('Found user but under age');
        // return true;
      } else if ((result.status == "found") && (result.age == 'over')) {
        alert('Found user but over age');
      } else if (result.status == "not_found") {
        alert('User not found');
        // return false;
      }
    },
    error: function(e) {
      $('#errorDiv').html("Error: " + e);
      $('#div-controls').hide();
    },
    complete: function(e) {
      $('#loading').html("");
      $('#div-controls').hide();
    }
  });
});
