var form = $("#example-advanced-form").show();

form.steps({
    headerTag: "h3",
    bodyTag: "fieldset",
    transitionEffect: "slideLeft",
    onStepChanging: function (event, currentIndex, newIndex)
    {
        // Allways allow previous action even if the current form is not valid!
        if (currentIndex > newIndex)
        {
            return true;
        }
        if(newIndex === 1) {

          // var month = $("#ac-dob-month").val();
          // var day = $('#ac-dob-day').val();
          // var year = $('#ac-dob-year').val();
          //
          // var age = 21;
          // var mydate = new Date();
          // mydate.setFullYear(year, month-1, day);
          //
          // var currdate = new Date();
          // currdate.setFullYear(currdate.getFullYear() - age);
          // if ((currdate - mydate) < 0) {
          //
          //   return false;
          // }
        }
        if(newIndex === 2) {
          var date = ($('#drivers-license-data').children().children().children()[11]);
          var myDate = ($(date).text());

          var numbers = myDate.match(/\d+/g);
          var date2 = new Date(numbers[2], numbers[0]-1, numbers[1]);

          var month1 = (date2.getMonth() + 1);
          var day1 = (date2.getDate());
          var year1 = (date2.getFullYear());

          alert(month1 + "/" + day1 + "/" + year1);

          var age1 = 21;
          var mydate1 = new Date();
          mydate1.setFullYear(year1, month1-1, day1);

          var currdate1 = new Date();
          currdate1.setFullYear(currdate1.getFullYear() - age1);
          if ((currdate1 - mydate1) < 0) {

            return false;
          }


        }

        // Needed in some cases if the user went back (clean up)
        if (currentIndex < newIndex)
        {
            // To remove error styles
            form.find(".body:eq(" + newIndex + ") label.error").remove();
            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
        }
        form.validate().settings.ignore = ":disabled,:hidden";
        return form.valid();
    },
    onStepChanged: function (event, currentIndex, priorIndex)
    {

        // Used to skip the "Warning" step if the user is old enough.
        if (currentIndex === 2 && Number($("#dob_year").val()) <= 1996)
        {
            form.steps("next");
        }
        // Used to skip the "Warning" step if the user is old enough and wants to the previous step.
        if (currentIndex === 2 && priorIndex === 3)
        {
            form.steps("previous");
        }
    },
    onFinishing: function (event, currentIndex)
    {
        form.validate().settings.ignore = ":disabled";
        return form.valid();
    },
    onFinished: function (event, currentIndex)
    {
        alert("Submitted!");
    }
}).validate({
    errorPlacement: function errorPlacement(error, element) { element.before(error); },
    rules: {
        confirm: {
            equalTo: "#password-2"
        }
    }
});
