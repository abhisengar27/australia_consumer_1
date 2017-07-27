   // When the page has loaded
   $(window).on('load', function() {
       $(".loader").fadeOut(1000);
   });
   $(document).ready(function() {

       if ($('.datepicker') && $('.datepicker').length) {
           $('.datepicker').dateDropper({});
       }

       // if ($('#loginForm') && $('#loginForm').length) {
           // $('#loginForm').bootstrapValidator({
               // message: 'This value is not valid',
               // feedbackIcons: {
                   // valid: 'glyphicon glyphicon-ok',
                   // invalid: 'glyphicon glyphicon-remove',
                   // validating: 'glyphicon glyphicon-refresh'
               // },
               // fields: {
                   // lUserName: {
                       // validators: {
                           // notEmpty: {
                               // message: 'This is a required field'
                           // }
                       // }
                   // },
                   // lPassword: {
                       // validators: {
                           // notEmpty: {
                               // message: 'This is a required field'
                           // }
                       // }
                   // }
               // }
           // }).on('success.form.bv', function(e) {
              // window.location.href = "index.html";
               
           // });;
       // }

       // $('#loginSubmit').click(function(e) {
            // e.preventDefault();
           // var l = Ladda.create(this);
            // l.start();
               // setTimeout(function(){
                // l.stop();
                // $('#loginForm').submit();
                 // return false;
              // }, 1000);
       // });


       $('#basicInfoSubmit').click(function(e) {
          e.preventDefault();
           var l = Ladda.create(this);
            l.start();
               setTimeout(function(){
                l.stop();
                $('#basicInfo').submit();
               
                 return false;
              }, 1000);
       });
       if ($('#basicInfo') && $('#basicInfo').length) {
           $('#basicInfo').bootstrapValidator({
               message: 'This value is not valid',
               feedbackIcons: {
                   valid: 'glyphicon glyphicon-ok',
                   invalid: 'glyphicon glyphicon-remove',
                   validating: 'glyphicon glyphicon-refresh'
               },
               fields: {
                   fName: {
                       validators: {
                           notEmpty: {
                               message: 'This is a required field'
                           }
                       }
                   },

                   lName: {
                       validators: {
                           notEmpty: {
                               message: 'This is a required field'
                           }
                       }
                   },
                   dOb: {
                       feedbackIcons: 'false',
                       validators: {
                           notEmpty: {
                               message: 'This is a required field'
                           }

                       }
                   }
               }
           }).on('success.form.bv', function(e) {
          window.location.href = "contact-information.html";
           
               
           });

       }



       $("#postalCheckBtn").click(function() {
           if ($(this).is(":checked")) {
               $("#postal-address-info").hide();
           } else {
               $("#postal-address-info").show();
           }
       });

       if ($('.tags') && $('.tags').length) {
           $(function() {
               var availableTags = [
                   "44 haris street ",
                   "44 Haris St Balmain NSW 2014",
                   "42-44 Haris St Bellbird Park QLD 4300",
                   "42-A Haris St Bicton WA 6157",
                   "44 Haris St Broken Hill NSW 2288"
               ];
               $(".tags").autocomplete({
                   source: availableTags,
                   response: function(event, ui) {
                       // ui.content is the array that's about to be sent to the response callback.
                       if (ui.content.length === 0) {
                           $(this).closest('.row').find('.error-msg').show();
                           $(this).addClass('error-input');
                       } else {
                           $(this).closest('.row').find('.error-msg').hide();
                           $(this).removeClass('error-input');
                       }
                   }
               });
           });

       }
       $("#showHomeManualForm").click(function() {
           $("#homeManualForm").show();
           $("#homeAutomaticAddress").hide();
       });
       $("#backHomeAutoSearch").click(function() {
           $("#homeManualForm").hide();
           $("#homeAutomaticAddress").show();
       });

       $("#showPostalManualForm").click(function() {
           $("#postalManualForm").show();
           $("#postal-address-info,#postalCheck").hide();
       });
       $("#backPostalAutoSearch").click(function() {
           $("#postal-address-info,#postalCheck").show();
           $("#postalManualForm").hide();
       });


       (function($) {

           'use strict';

           $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
               var $target = $(e.target);
               var $tabs = $target.closest('.nav-tabs-responsive');
               var $current = $target.closest('li');
               var $parent = $current.closest('li.dropdown');
               $current = $parent.length > 0 ? $parent : $current;
               var $next = $current.next();
               var $prev = $current.prev();
               var updateDropdownMenu = function($el, position) {
                   $el
                       .find('.dropdown-menu')
                       .removeClass('pull-xs-left pull-xs-center pull-xs-right')
                       .addClass('pull-xs-' + position);
               };

               $tabs.find('>li').removeClass('next prev');
               $prev.addClass('prev');
               $next.addClass('next');

               updateDropdownMenu($prev, 'left');
               updateDropdownMenu($current, 'center');
               updateDropdownMenu($next, 'right');
           });

       })(jQuery);

       var contactStep = 0;
       if ($('#contactForm') && $('#contactForm').length) {
           $('#contactForm').bootstrapValidator({
               message: 'This value is not valid',
               feedbackIcons: {
                   valid: 'glyphicon glyphicon-ok',
                   invalid: 'glyphicon glyphicon-remove',
                   validating: 'glyphicon glyphicon-refresh'
               },
               fields: {
                   cMob: {
                       validators: {
                         notEmpty: {
                               message: 'This is a required field'
                           },
                           regexp: {
                              regexp: /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/,
                              message: 'Invalid phone number'
                          }


                       }
                   },
                   cEmail: {
                       validators: {
                           notEmpty: {
                               message: 'This is a required field'
                           },
                           emailAddress: {
                               message: 'This is not a valid email address'
                           }
                       }
                   }
               }
           }).on('success.form.bv', function(e) {
               contactStep++
                
           });;
       }


       /*Contactinfo click*/
var saveFlag=false;
 $(".saveClose").click(function() {
    saveFlag=true;
   });
       $("#contactInfoSubmit").click(function(e) {
         e.preventDefault();
         var l = Ladda.create(this);
             $('#contactForm').submit();
           if (contactStep == 1) {
                $('#success').modal('show');

           } else if (contactStep > 1) {
            if(saveFlag){
              saveFlag=false;
              $("body").addClass('autosave');
              l.start();
               setTimeout(function(){
                l.stop();
                window.location.href = "tax-information.html";
                 return false;
              }, 1000);
              
            }
           }


       });

       $(".address-info").click(function() {
           $("#address-info").show();
            saveFlag=true;
             $("body").addClass('autosave');
           
       });
        function autoSaveActivate(){
           if ($("body").hasClass("autosave")) {
              randomToast();
               setTimeout(function(){
                stop ();
              }, 3000);
          }
         
        }
        setInterval(function(){
              autoSaveActivate ();
        },15000);

       /*Contactinfo click*/
       $('[data-toggle="tooltip"]').tooltip();
      
       function randomToast () {
          var priority = 'default';
          var title    = '';
          var message  = 'Application succesfully auto saved';
             $.toaster({ priority : priority, title : title, message : message });

        }
      
       function stop (){
          $.toaster.reset();
        }

        if ($('#taxform') && $('#taxform').length) {
           $('#taxform').bootstrapValidator({
               message: 'This value is not valid',
               feedbackIcons: {
                   valid: 'glyphicon glyphicon-ok',
                   invalid: 'glyphicon glyphicon-remove',
                   validating: 'glyphicon glyphicon-refresh'
               },
               fields: {
                   tfn: {
                       validators: {
                           regexp: {
                              regexp: /^\d{0,9}$/,
                              message: 'Invalid TFN'
                          },
                           stringLength: {
                            min: 9,
                            max: 9,
                           message: 'Minimum 9 Digits '
                          }


                       }
                   }
               }
           }).on('success.form.bv', function(e) {
             e.preventDefault();
            var l = Ladda.create(this);
            l.start();
               setTimeout(function(){
                l.stop();
                $('#onlineid-check').modal('show');
                 return false;
              }, 1000);

           });;
       }

       $('#taxformInfoSubmit').click(function(e) {
        
           $('#taxform').submit();
       });

        $('#onlineIdInfoSubmit').click(function(e) {
         e.preventDefault();
            var l = Ladda.create(this);
            l.start();
           setTimeout(function(){
                l.stop();
                $('#error').modal('show');
                 return false;
              }, 1000);
       });
        $('#passwordInfoSubmit').click(function(e) {
         e.preventDefault();
            var l = Ladda.create(this);
            l.start();
           setTimeout(function(){
                l.stop();
                window.location.href = "login.html";
                 return false;
              }, 1000);
       });
     $('#tfn').keyup(function(){
            if($(this).val().length !=0){
              $('#exemption').attr('disabled',true);
            }
            else{
               $('#exemption').attr('disabled', false);   
            }
                
        })

     $('#exemption').change(function () {
        if ($(this).find('option:selected').val() != 'selectExmeption') {
            $('#tfn').prop('disabled', true);
        } else {
            $('#tfn').prop('disabled', false)
        }
    });
     $('#savingsaccount-modal-existing').modal('show');
     if ($('#loginFormExisting') && $('#loginFormExisting').length) {
           $('#loginFormExisting').bootstrapValidator({
               message: 'This value is not valid',
               feedbackIcons: {
                   valid: 'glyphicon glyphicon-ok',
                   invalid: 'glyphicon glyphicon-remove',
                   validating: 'glyphicon glyphicon-refresh'
               },
               fields: {
                   lUserName: {
                       validators: {
                           notEmpty: {
                               message: 'This is a required field'
                           }
                       }
                   },
                   lPassword: {
                       validators: {
                           notEmpty: {
                               message: 'This is a required field'
                           }
                       }
                   }
               }
           }).on('success.form.bv', function(e) {
              window.location.href = "index-existing.html";
               
           });;
       }
       $('#loginSubmitExist').click(function(e) {
            e.preventDefault();
           var l = Ladda.create(this);
            l.start();
               setTimeout(function(){
                l.stop();
                $('#loginFormExisting').submit();
                 return false;
              }, 1000);
       });
       $('.terms').on('click',function(){
        if($('.terms:checked').length == $('.terms').length){
          $('.act-type li a').removeAttr("disabled");
        }else{
            $(".act-type li a").attr("disabled", true);
            
        }
    });


   });