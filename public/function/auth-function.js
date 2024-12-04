function submit(){
    $.LoadingOverlay("show");
    const email = $("#email").val();
    const pass = $("#password").val();

    if(email.length == 0){
        $.LoadingOverlay("hide");
        $('#alert').show();
        $('#alert').html('Silahkan masukkan email Anda.');
        setTimeout(function(){
            $('#alert').hide();
            $('#alert').html('');
        }, 3000);
    } else if(pass.length == 0){
        $.LoadingOverlay("hide");
        $('#alert').show();
        $('#alert').html('Silahkan masukkan password Anda.');
        setTimeout(function(){
            $('#alert').hide();
            $('#alert').html('');
        }, 3000);
    } else {
        const input = {
            email: email,
            password: pass,
        }
        var API = URL_API + 'auth/login';
        $.ajaxSetup({
            headers:{
               'apiKey': AUTH_KEY
            }
         });
        $.post(API, input, function(result){
            // console.log(result.success);
            if(!result.success){
                $.LoadingOverlay("hide");
                $('#alert').show();
                $('#alert').html(result.message);
                setTimeout(function(){
                    $('#alert').hide();
                    $('#alert').html('');
                }, 3000);
            } else {
                // console.log(result.token);
                localStorage.setItem("uid", result.data.id);
                localStorage.setItem("name", result.data.name);
                localStorage.setItem("photo", result.data.photo);
                localStorage.setItem("token", result.token);

                setTimeout(function(){
                    $.LoadingOverlay("hide");
                    window.location.href = "/";
                }, 3000);
            }
        });
    }

}

function logout(){
    localStorage.clear();
    setTimeout(function(){
        $.LoadingOverlay("hide");
        window.location.href = "/";
    }, 3000);

}