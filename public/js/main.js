$('document').ready(function () {
  console.log("Loaderd");


  // var service;
  // var content = $('.content');
  // var loadingSpinner = $('#loading');
  // content.css('display', 'block');
  // loadingSpinner.css('display', 'none');;

  // var webAuth = new auth0.WebAuth({
  //   domain: AUTH0_DOMAIN,
  //   clientID: AUTH0_CLIENT_ID,
  //   redirectUri: AUTH0_CALLBACK_URL,
  //   audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
  //   responseType: 'token id_token',
  //   scope: 'openid profile email',
  //   leeway: 60
  // });

  // var loginStatus = $('.container h4');
  // var loginView = $('#login-view');
  // var homeView = $('#home-view');

  // // buttons and event listeners
  // var homeViewBtn = $('#btn-home-view');
  // var loginBtn = $('#qsLoginBtn');
  // var logoutBtn = $('#qsLogoutBtn');

  function clearFields() {
    $(".modal").find("input,textarea,select").val('').end();

  }

  $('#cancelBtn').click(function () {
    clearFields();
    $('#book-service').val(service);


  });

  // homeViewBtn.click(function () {
  //   homeView.css('display', 'inline-block');
  //   loginView.css('display', 'none');
  // });

  // loginBtn.click(function (e) {
  //   e.preventDefault();
  //   webAuth.authorize();
  // });

  // logoutBtn.click(logout);

  $('#bath-btn').click(function () {
    service = 'Fast Bath - 45 Minute Service';
    $('#book-service').val(service);
  });
  $('#groom-btn').click(function () {
    service = 'Superstar Groom - 2 Hour Service';
    $('#book-service').val(service);
  });
  $('#day-btn').click(function () {
    service = 'Stellar Day Spa - All Day Experience';
    $('#book-service').val(service);
  });

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
   if(dd<10){
          dd='0'+dd
      }
      if(mm<10){
          mm='0'+mm
      }

  today = yyyy+'-'+mm+'-'+dd;
  $("#book-date").attr("min", today);

  function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.css('display', 'none');
      logoutBtn.css('display', 'inline-block');
      // loginStatus.text('You are logged in!');
    } else {
      loginBtn.css('display', 'inline-block');
      logoutBtn.css('display', 'none');
      // loginStatus.text('You are not logged in! Please log in to continue.');
    }
  }


  $(function () {
    // IMPORTANT: Fill in your client key
    var clientKey = "js-1opG2LjSPzq8vnZVFToqq6lwvt8u4XdASaRbFtf42iFuLXA4ZtBPyTdbmrRR8AAp";

    var cache = {};
    var container = $("#bookingContainer");
    var errorDiv = container.find("div.text-error");

    /** Handle successful response */
    function handleResp(data) {
      // Check for error
      if (data.error_msg)
        errorDiv.text(data.error_msg);
      else if ("city" in data) {
        // Set city and state
        container.find("input[name='city']").val(data.city);
        container.find("input[name='state']").val(data.state);
      }
    }

    // Set up event handlers
    container.find("input[name='zipcode']").on("keyup change", function () {
      // Get zip code
      var zipcode = $(this).val().substring(0, 5);
      if (zipcode.length == 5 && /^[0-9]+$/.test(zipcode)) {
        // Clear error
        errorDiv.empty();

        // Check cache
        if (zipcode in cache) {
          handleResp(cache[zipcode]);
        } else {
          // Build url
          var url = "https://www.zipcodeapi.com/rest/" + clientKey + "/info.json/" + zipcode + "/radians";

          // Make AJAX request
          $.ajax({
            "url": url,
            "dataType": "json"
          }).done(function (data) {
            handleResp(data);

            // Store in cache
            cache[zipcode] = data;
          }).fail(function (data) {
            if (data.responseText && (json = $.parseJSON(data.responseText))) {
              // Store in cache
              cache[zipcode] = json;

              // Check for error
              if (json.error_msg)
                errorDiv.text(json.error_msg);
            } else
              errorDiv.text('Request failed.');
          });
        }
      }
    }).trigger("change");
  });




  $("#bookingform").submit(function (event) {
    event.preventDefault();
    console.log("hello");

    var newBooking = {
      firstName: $("#book-first").val().trim(),
      lastName: $("#book-last").val().trim(),
      street: $("#book-street").val().trim(),
      city: $("#book-city").val().trim(),
      state: $("#book-state").val().trim(),
      zip: $("#book-zip").val().trim(),
      telephone: $("#book-phone").val().trim(),
      email: $("#book-email").val().trim(),
      petName: $("#book-pet").val().trim(),
      breed: $("#book-breed").val().trim(),
      service: $("#book-service").val().trim(),
      date: $("#book-date").val().trim(),
      time: $("#book-time").val().trim()

    };


    console.log(newBooking);

    $.post("/api/booking", newBooking).then(function(data)
      {

        console.log(data);

      }).catch(handleError);

      clearFields();
      $("#bookingModal").modal('toggle');
      $('#confMessage').html('<p><strong>'+newBooking.service+'</strong> for <strong>'+newBooking.petName+'</strong> on <strong>' + newBooking.date +'</strong>.');
      $('#confirmationModal').modal('show');

      function handleError(err) {
        console.log(err.responseJSON);
      }

      // clearFields();
      //   $("#bookingModal").modal('toggle');
      //   $('#confMessage').append('<p><strong>'+newBooking.service+'</strong> for <strong>'+newBooking.petName+'</strong> on <strong>' + newBooking.date +'</strong>.');
      //   $('#confirmationModal').modal('show');
      // clearFields();
    //=============EMAIL CODE ====================
    // var template_params = {
    //   "book_first": newBooking.firstName,
    //   "book_last": newBooking.lastName,
    //   "book_service": newBooking.servide,
    //   "book_email": newBooking.email,
    //   "book_phone": newBooking.telephone,
    //   "book_pet": newBooking.petName,
    //   "book_breed": newBooking.breed
    // }

    // var service_id = "outlook";
    // var template_id = "appointment_owner";
    // emailjs.send(service_id, template_id, template_params)
    //   .then(function () {
    //     console.log("Sent!");
    //   }, function (err) {
    //     console.log("Send email failed!\r\n Response:\n " + JSON.stringify(err));
    //   });

    // const mailOptions = {
    //   from: 'no-reply@kwpetspa.com', // sender address
    //   to: ['eric.matson@gmail.com', 'matson@live.com'], // list of receivers
    //   subject: 'A new appointment has been made', // Subject line
    //   html: '<p>' + newBooking.firstName + '</p>' // plain text body
    // };


    // $("#bookingModal").modal('toggle');
    // $('#confMessage').append('<p><strong>'+newBooking.service+'</strong> for <strong>'+newBooking.petName+'</strong> on <strong>' + newBooking.date +'</strong>.');
    // $('#confirmationModal').modal('show');

    return false;

  });

  // handleAuthentication();

});

