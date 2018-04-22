
$(window).scroll(function(){
  var distanceFromTop = $(document).scrollTop();    
  if(distanceFromTop < 1000 )
  {
      $('.header').css('width', '50' - $(document).scrollTop()/10+ '%');
  }
  else
  {
      $('.header').css('width', '25%');
  }   
});

$( document ).ready(function() {

    $("#about").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scrollAbout').offset().top -284 }, 'slow');
        });
});