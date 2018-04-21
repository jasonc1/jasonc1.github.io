
$(window).scroll(function(){
  var distanceFromTop = $(document).scrollTop();    
  if(distanceFromTop < 1000 )
  {
      $('.header').css('width', '50' - $(document).scrollTop()/50 + '%');
  }
  else
  {
      $('.header').css('width', '25%');
  }   
});