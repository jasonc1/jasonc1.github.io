function init() {
    
    /* ---- VARIABLES ---- */
    var $nav = $('#topbar1'),
        $body = $('body'),
        $window = $(window),
        $popoverLink = $('[data-popover]'),
        navOffsetTop = $nav.offset().top-65,
        $document = $(document);

    /* ---- HELPER FUNCTIONS ---- */
    function smoothScroll(e) {
        e.preventDefault();
        $(document).off("scroll");
        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top-65
        }, 200, 'swing', function () {
            window.location.hash = target;
        });
    }

    function openPopover(e) {
        e.preventDefault()
        var popover = $($(this).data('popover'));
        if (popover.hasClass('open')) {
            closePopover();
        } else {
            popover.addClass('open');
            $('.mobile-menu').addClass('active');
        }
        e.stopImmediatePropagation();
    }

    function closePopover() {
        if($('.popover.open').length > 0) {
            $('.popover').removeClass('open');
            $('.mobile-menu').removeClass('active');
        }
    }

    /* ---- EVENT LISTENERS ---- */
    $("#button").click(function() {
        $('html, body').animate({
            scrollTop: $("#elementtoScrollToID").offset().top
        }, 2000);
    });

    $("#topSearch").on('focus', function () {
        $(this).parent('label').addClass('active');
    });

    $("#topSearch").on('blur', function () {
        if($(this).val().length == 0)
            $(this).parent('label').removeClass('active');
    });

    $('.clickable-pillar').hover(function () {
        $(this).addClass('animated pulse')
    }, function () {
        $(this).removeClass('animated pulse')
    })


    /* ---- FUNCTIONALITY ---- */
    $popoverLink.on('click', openPopover)
    $window.on('click', closePopover)
    $('a[href^="#"]').on('click', smoothScroll)
}
