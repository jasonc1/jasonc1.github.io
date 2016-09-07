function validateLogin() {

    if( document.login.username.value == "" || document.login.password.value == "" )
   {
   	 $(".inputError").fadeIn('slow').css("display","inline-block");
     return false;
   }

    return (true);
}


function validateSignUp() {

    if(document.signup.firstname.value == ""){
        $(".BlankEntry#firstnameblank").fadeIn('slow').css("display","inline-block");
        $(".inputError#invalidFirstName").fadeOut('slow').css("display","none");   

    }
    else{
        $(".BlankEntry#firstnameblank").fadeOut('slow').css("display","none");
        if(document.signup.firstname.value.length < 2){
            $(".inputError#invalidFirstName").fadeIn('slow').css("display","inline-block");
        }
        else{
            $(".inputError#invalidFirstName").fadeOut('slow').css("display","none");   
        }

    }


    if(document.signup.lastname.value == ""){
        $(".BlankEntry#lastnameblank").fadeIn('slow').css("display","inline-block");
        $(".inputError#invalidLastName").fadeOut('slow').css("display","none");   

    }
    else{
        $(".BlankEntry#lastnameblank").fadeOut('slow').css("display","none");
        if(document.signup.lastname.value.length < 2){
            $(".inputError#invalidLastName").fadeIn('slow').css("display","inline-block");   
        }
        else{
            $(".inputError#invalidLastName").fadeOut('slow').css("display","none");   

        }
    }

    if(document.signup.email.value == ""){
        $(".BlankEntry#blankEmail").fadeIn('slow').css("display","inline-block");
        $(".inputError#Invalid_Email").fadeOut('slow').css("display","none");   

    }
    else{
        var len = document.signup.email.value.length;
        var comIndex = (document.signup.email.value.lastIndexOf(".")+1);
        var atIndex = (document.signup.email.value.indexOf("@") > 0);
        $(".BlankEntry#blankEmail").fadeOut('slow').css("display","none");

        if((len - comIndex < 3)
            || (atIndex <= 0)
            ){
                $(".inputError#Invalid_Email").fadeIn('slow').css("display","inline-block");   
            }
        else{
            $(".inputError#Invalid_Email").fadeOut('slow').css("display","none");   
        }
    }


    if(document.signup.username.value == ""){
        $(".BlankEntry#blankUser").fadeIn('slow').css("display","inline-block");
        $(".inputError#UserTaken").fadeOut('slow').css("display","none");   
   
    }
    else{
        $(".BlankEntry#blankUser").fadeOut('slow').css("display","none");        
        //insert username checking code
        if(document.signup.username.value.length < 2){
            $(".inputError#UserTaken").fadeIn('slow').css("display","inline-block");   
        }
        else{
            $(".inputError#UserTaken").fadeOut('slow').css("display","none");   

        }
    }


    if(document.signup.password1.value == "" 
        || document.signup.password2.value == ""){
        $(".BlankEntry#blankPassword").fadeIn('slow').css("display","inline-block");
        $(".inputError#PassNotMatch").fadeOut('slow').css("display","none");   

    }
    else{
        $(".BlankEntry#blankPassword").fadeOut('slow').css("display","none");
        if(document.signup.password1.value != document.signup.password2.value){
            $(".inputError#PassNotMatch").fadeIn('slow').css("display","inline-block");   
        }
        else{
        $(".inputError#PassNotMatch").fadeOut('slow').css("display","none");   
        }
    }
    return false;
}


function validateAccountHelp() {

    if(document.accountHelp.firstname.value == ""){
        $(".BlankEntry#firstnameblank").fadeIn('slow').css("display","inline-block");
        $(".inputError#invalidFirstName").fadeOut('slow').css("display","none");   

    }
    else{
        $(".BlankEntry#firstnameblank").fadeOut('slow').css("display","none");
        if(document.accountHelp.firstname.value.length < 2){
            $(".inputError#invalidFirstName").fadeIn('slow').css("display","inline-block");
        }
        else{
            $(".inputError#invalidFirstName").fadeOut('slow').css("display","none");   
        }

    }


    if(document.accountHelp.lastname.value == ""){
        $(".BlankEntry#lastnameblank").fadeIn('slow').css("display","inline-block");
        $(".inputError#invalidLastName").fadeOut('slow').css("display","none");   

    }
    else{
        $(".BlankEntry#lastnameblank").fadeOut('slow').css("display","none");
        if(document.accountHelp.lastname.value.length < 2){
            $(".inputError#invalidLastName").fadeIn('slow').css("display","inline-block");   
        }
        else{
            $(".inputError#invalidLastName").fadeOut('slow').css("display","none");   

        }
    }

    if(document.accountHelp.email.value == ""){
        $(".BlankEntry#blankEmail").fadeIn('slow').css("display","inline-block");
        $(".inputError#Invalid_Email").fadeOut('slow').css("display","none");   

    }
    else{
        var len = document.accountHelp.email.value.length;
        var comIndex = (document.accountHelp.email.value.lastIndexOf(".")+1);
        var atIndex = (document.accountHelp.email.value.indexOf("@") > 0);
        $(".BlankEntry#blankEmail").fadeOut('slow').css("display","none");

        if((len - comIndex < 3)
            || (atIndex <= 0)
            ){
                $(".inputError#Invalid_Email").fadeIn('slow').css("display","inline-block");   
            }
        else{
            $(".inputError#Invalid_Email").fadeOut('slow').css("display","none");   
        }
    }


    if(document.accountHelp.username.value == ""){
        $(".BlankEntry#blankUser").fadeIn('slow').css("display","inline-block");
        $(".inputError#UserTaken").fadeOut('slow').css("display","none");   
   
    }
    else{
        $(".BlankEntry#blankUser").fadeOut('slow').css("display","none");        
        //insert username checking code
        if(document.accountHelp.username.value.length < 2){
            $(".inputError#UserTaken").fadeIn('slow').css("display","inline-block");   
        }
        else{
            $(".inputError#UserTaken").fadeOut('slow').css("display","none");   

        }
    }
    return false;
}




