$( document ).ready(function() {






    
    $('#transparency').hover( 
        function(){
            $(this).animate({'backgroundColor': 'rgba(256, 256, 256 , 0)'},250);
            $('#blurb').animate({'color': '#fff'}, 250);
            },

        function(){
            $(this).animate({'backgroundColor': 'rgba(00,00,00,0.3)'},250);
            $('#blurb').animate({'color': '#000'}, 250);
            });


    $('#enterLink').hover(
        function(){
            $(this).animate({'backgroundColor': 'rgba(255,255,256, 1)'},400);
           },

        function(){
            $(this).animate({'backgroundColor': 'rgba(256, 256, 51 , 0.8)'},400);
           
        });




    $("#About").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scrollAbout').offset().top -100 }, 'slow');
        });
   
     $("#Projects").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scrollProjects').offset().top -100 }, 'slow');
        });

     $("#Photography").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scrollPhotography').offset().top -100 }, 'slow');
        });
    $("#Resume").click(
        function(){
            $('html, body').animate({ scrollTop: $('.resume').offset().top -75 }, 'slow');
        });

    $("#buttonHead").click(
        function(){
            $('html, body').animate({ scrollTop: 0}, 'slow');
        });


    

});