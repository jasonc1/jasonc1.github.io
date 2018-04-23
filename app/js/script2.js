
$(window).scroll(function(){
  var distanceFromTop = $(document).scrollTop();
  if(distanceFromTop < 500)
  {
      $('.header').css('width', '50' - $(document).scrollTop()/20+ '%');
  }
  else
  {
      $('.header').css('width', '25%');
  }   
});

$( document ).ready(function() {
    var scrollHere = $(".title").position()
    $("#about").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scroll-about').offset().top - scrollHere.top - 30}, 'slow');
    });
    $("#projects").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scroll-projects').offset().top - scrollHere.top - 30}, 'slow');
    });
    $("#photography").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scroll-photography').offset().top - scrollHere.top - 30}, 'slow');
    });
    $("#resume").click(
        function(){
            $('html, body').animate({ scrollTop: $('#scroll-resume').offset().top - scrollHere.top - 30}, 'slow');
    });
});