
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
            $('html, body').animate({ scrollTop: $('#scroll-about').offset().top -284 }, 'slow');
    });
    $("#projects").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scroll-projects').offset().top -284 }, 'slow');
    });
    $("#photography").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scroll-photography').offset().top -284 }, 'slow');
    });
    $("#resume").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scroll-resume').offset().top -284 }, 'slow');
    });
});