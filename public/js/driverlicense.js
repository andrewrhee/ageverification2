$(document).ready(function () {

    //Convert checkbox to switch type
    $('input[type="checkbox"]').not('#create-switch').bootstrapSwitch();

    //Detect type of device.
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    //These variables are for capturing images using webcam.
    //The images captured should be copied to the canvas to keep their resolutions.
    var video = document.querySelector('#webcam');
    var capturedcanvas = document.querySelector('#captured-canvas');
    var blankCanvas = document.querySelector('#blank-canvas');
    var blankContext = blankCanvas.getContext('2d');
    var selectedCanvas = document.querySelector('#selected-canvas');
    var contextCapturedCanvas = capturedcanvas.getContext('2d');



    if (isMobile.any()) {
        $("#option-source").hide();
        $("#container-camera").show();
        $("#container-webcam").hide();
        $('#chkPreProcessing').bootstrapSwitch('setState', true);
    }
    else {

        //Change to .show() to enable webcam feature.
        $("#option-source").hide();

        //Remove comment to enable webcam feature
        //Prompts the user for permission to use a webcam.
        //        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        //        if (navigator.getUserMedia) {
        //            navigator.getUserMedia
        //                            (
        //                              { video: true },
        //                              function (localMediaStream) {
        //                                  video.src = window.URL.createObjectURL(localMediaStream);
        //                              }, onFailure);
        //        }

        //

        //        $("#help-icon").tooltip({ placement: 'bottom' });
        //        $('#chkPreProcessing').bootstrapSwitch('setState', false);
    }

    //Toggles UI between using fileupload or webcam as image input
    var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
    if (isSourceCameraOrDisk) {
        $("#container-camera").show();
        $("#container-webcam").hide();
    }
    else {
        $("#container-camera").hide();
        $("#container-webcam").show();
    }

    //Toggles UI between using fileupload or webcam when the checkbox has been changed.
    $("#chkImageSource").change(function () {
        if (this.checked) {
            $("#container-camera").show()
            $("#container-webcam").hide()
        }
        else {
            $("#container-camera").hide()
            $("#container-webcam").show()
        }
    });

    function onFailure(err) {
        //The developer can provide any alert messages here once permission is denied to use the webcam.
    }

    function cloneCanvas(oldCanvas) {

        //create a new canvas
        var newCanvas = document.querySelector('#selected-canvas');
        var context = newCanvas.getContext('2d');

        //set dimensions
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;

        //apply the old canvas to the new one
        context.drawImage(oldCanvas, 0, 0);

        //return the new canvas
        return newCanvas;
    }

    //Display the image to the canvas upon capturing image from webcam.
    function snapshot() {
        capturedcanvas.width = video.videoWidth;
        capturedcanvas.height = video.videoHeight;
        contextCapturedCanvas.drawImage(video, 0, 0);
    }

    // Convert dataURL to Blob object
    function dataURLtoBlob(dataURL) {
        // Decode the dataURL
        var binary = atob(dataURL.split(',')[1]);
        // Create 8-bit unsigned array
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        // Return our Blob object
        return new Blob([new Uint8Array(array)], { type: 'image/jpg' });
    }

    //Format data displayed to UI.
    function AddDisplay(fieldName, fieldValue) {

        if (fieldName == "Address Verification") {
            var string = "<div class=\"form-group\">";
            string += "<label class=\"col-md-4 control-label\">";
            string += fieldName;
            string += "</label>";
            string += "<div class=\"col-md-7\">";
            string += "<p class=\"form-control text-center\">";
            string += fieldValue;
            string += "</p>";
            string += "</div>";
            string += "</div>";
            return string;
        }
        else if (fieldValue) {
            var string = "<div class=\"form-group\">";
            string += "<label class=\"col-md-4 control-label\">";
            string += fieldName;
            string += "</label>";
            string += "<div class=\"col-md-7\">";
            string += "<p class=\"form-control text-center\">";
            string += fieldValue;
            string += "</p>";
            string += "</div>";
            string += "</div>";
            return string;
        }
        else
            return "";
    };

    //Clears populated controls. Prepares UI for next processing.
    function ResetControls() {
        $("#face-image").attr("src", "http://www.placehold.it/350x120/EFEFEF/AAAAAA&text=no+image");
        $("#signature-image").attr("src", "http://www.placehold.it/350x120/EFEFEF/AAAAAA&text=no+image");
        $("#reformatted-image").attr("src", "http://www.placehold.it/350x120/EFEFEF/AAAAAA&text=no+image");
        document.getElementById("faceImage").style.display = "none";
        document.getElementById("signImage").style.display = "none";
        document.getElementById("extractedData").style.display = "none";
        $("#main-image").attr("src", "http://www.placehold.it/507x318/EFEFEF/AAAAAA&text=Tap+Here");
        $('#drivers-license-data').empty();
    };

    //Accept captured image from webcam and display on canvas.
    $("#btn-use-image").click(function () {
        cloneCanvas(capturedcanvas);
        $('#myModal').modal("hide");
        $("#div-controls").show();
    });

    //Clicks on webcam area to capture image.
    $("#webcam").click(function () {
        snapshot();
        $('#myModal').modal()
    });

    //Clears controls and opens File Dialog to chose input image
    $("#placehold-image").click(function () {
        $("#input-image").click();
        document.getElementById("faceImage").style.display = "none";
        document.getElementById("signImage").style.display = "none";
        document.getElementById("extractedData").style.display = "none";
        $('#drivers-license-data').empty();
        $('#errorDiv').empty();
        $('#loading').empty();
        $("#div-controls").show();
    });

    //Clears controls and opens File Dialog after choosing an input image
    $("#image-thumbnail").click(function () {
        $("#input-image").click();
        document.getElementById("faceImage").style.display = "none";
        document.getElementById("signImage").style.display = "none";
        document.getElementById("extractedData").style.display = "none";
        $('#drivers-license-data').empty();
        $('#errorDiv').empty();
        $('#loading').empty();
        $("#div-controls").show();
        $("#fileupload-container").fileupload("clear");
    });

    var preprocessedImage;
    var unmodifiedImage;
    //Resize image
    $('#input-image').change(function (e) {

        var file = e.target.files[0];

        canvasResize(file, {
            crop: false,
            quality: 75,
            isiOS: isMobile.iOS(),
            isPreprocessing: true,
            cardType: "DriversLicense",
            callback: function (data, width, height) {
                preprocessedImage = dataURLtoBlob(data);
            }
        });

        canvasResize(file, {
            isPreprocessing: false,
            cardType: "DriversLicense",
            callback: function (data, width, height) {
                unmodifiedImage = dataURLtoBlob(data);
            }
        });
    });

    $("#btn-process-image").click(function () {
        ResetControls();
        var isSourceCameraOrDisk = $('#chkImageSource').is(':checked') ? true : false;
        var usePreprocessing = $('#chkPreProcessing').is(':checked') ? true : false;

        var selectedRegion = $("#region-select").val();
        var imageToProcess;
        var imgVal = $('#input-image').val();

        $('#diplay-div').empty();
        $('#div-img').empty();

        $('#errorDiv').empty();
        $('#loading').empty();

        if (isSourceCameraOrDisk) {
            if (imgVal == '') {
                alert("Empty input file.");
                return;
            }

            if (usePreprocessing)
                imageToProcess = preprocessedImage;
            else
                imageToProcess = unmodifiedImage;
        }
        else {
            var dataUrl = selectedCanvas.toDataURL();
            var image = dataURLtoBlob(dataUrl);
            var blankDataUrl = blankCanvas.toDataURL();

            if (dataUrl == blankDataUrl) {
                alert("Capture image first before processing.");
                return;
            }
            imageToProcess = image;
        }

        //Accesing the web service
        $.ajax({
            type: "POST",
            url: "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessDriversLicense/" + selectedRegion + "/true/-1/true/true/true/0/150/" + usePreprocessing.toString(),
            data: imageToProcess,
            cache: false,
            contentType: 'application/octet-stream; charset=utf-8;',
            dataType: "json",
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "LicenseKey " + authinfo);
                $('#loading').html("<img src='/images/processing.gif'/>");
                $("#div-controls").hide();
            },
            success: function (data) {
                console.log(data, 'done');
                doneVerifying(data, 'done2')
                //Convert data to string before parsing
                var driversLicense = JSON.stringify(data);
                driversLicense = jQuery.parseJSON(driversLicense);

                //Checking if there are errors returned.
                if (driversLicense.ResponseCodeAuthorization < 0) {
                    $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.ResponseMessageAuthorization + "</p>");
                }
                else if (driversLicense.ResponseCodeAutoDetectState < 0) {
                    $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.ResponseCodeAutoDetectStateDesc + "</p>");
                }
                else if (driversLicense.ResponseCodeProcState < 0) {
                    $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.ResponseCodeProcessStateDesc + "</p>");
                }
                else if (driversLicense.WebResponseCode < 1) {
                    $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.WebResponseDescription + "</p>");
                }
                else {

                    //Display data returned by the web service
                    var data = AddDisplay("First Name", driversLicense.NameFirst);
                    data += AddDisplay("Middle Name", driversLicense.NameMiddle);
                    data += AddDisplay("Last Name", driversLicense.NameLast);
                    data += AddDisplay("License Number", driversLicense.license);
                    data += AddDisplay("Address", driversLicense.Address);
                    data += AddDisplay("City", driversLicense.City);
                    data += AddDisplay("State", driversLicense.State);
                    data += AddDisplay("Zip", driversLicense.Zip);
                    data += AddDisplay("Country", driversLicense.IdCountry);
                    data += AddDisplay("Expiration Date", driversLicense.ExpirationDate4);
                    data += AddDisplay("Issue Date", driversLicense.IssueDate4);
                    data += AddDisplay("Date Of Birth", driversLicense.DateOfBirth4);
                    data += AddDisplay("Sex", driversLicense.Sex);
                    data += AddDisplay("Eyes Color", driversLicense.Eyes);
                    data += AddDisplay("Hair Color", driversLicense.Hair);
                    data += AddDisplay("Height", driversLicense.Height);
                    data += AddDisplay("Weight", driversLicense.Weight);
                    data += AddDisplay("Class", driversLicense.Class);
                    data += AddDisplay("Restriction", driversLicense.Restriction);
                    data += AddDisplay("Endorsements", driversLicense.Endorsements);
                    //data += AddDisplay("Address Verification", driversLicense.IsAddressVerified);

                    $(data).appendTo("#drivers-license-data");
                    document.getElementById("extractedData").style.display = "inline";

                    //Display face, sign and reformatted images on UI
                    var faceImage = driversLicense.FaceImage;
                    if (faceImage != null || faceImage != "") {
                        var base64FaceImage = goog.crypt.base64.encodeByteArray(faceImage);
                        document.getElementById("faceImage").style.display = "none";
                        $("#face-image").attr("src", "data:image/jpg;base64," + base64FaceImage);
                    }

                    var signImage = driversLicense.SignImage;
                    if (signImage != null || signImage != "") {
                        var base64SignImage = goog.crypt.base64.encodeByteArray(signImage);
                        document.getElementById("signImage").style.display = "none";
                        $("#signature-image").attr("src", "data:image/jpg;base64," + base64SignImage);
                    }

                    var reformattedImage = driversLicense.ReformattedImage;
                    if (reformattedImage != null || reformattedImage != "") {
                        var base64ReformattedImage = goog.crypt.base64.encodeByteArray(reformattedImage);
                        $("#image-thumbnail img:first-child").attr("src", "data:image/jpg;base64," + base64ReformattedImage);
                    }
                }
            },
            error: function (e) {
                $('#errorDiv').html("Error: " + e);
                $("#div-controls").hide();
            },
            complete: function (e) {
                $('#loading').html("");
                $("#div-controls").hide();
            }
        });
    });
});
