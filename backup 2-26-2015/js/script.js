$( document ).ready(function() {



    $("body").css("display", "none");
 
    $("body").fadeIn(2000);
 
    $("a.transition").click(function(event){
        event.preventDefault();
        linkLocation = this.href;
        $("body").fadeOut(1000, redirectPage);      
    });
         
    function redirectPage() {
        window.location = linkLocation;
    }




    
    $('#transparency').hover( 
        function(){
            $(this).animate({'backgroundColor': 'rgba(256, 256, 256 , 0)'},250);
            $('#blurb').animate({'color': '#fff'}, 250);
            },

        function(){
            $(this).animate({'backgroundColor': 'rgba(113,165, 207,0.8)'},250);
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

     $("#Designs").click(
        function(){
            $('html, body').animate({ scrollTop: $('.small').offset().top -100 }, 'slow');
        });
    $("#Resume").click(
        function(){
            $('html, body').animate({ scrollTop: $('.resume').offset().top -75 }, 'slow');
        });


    

});