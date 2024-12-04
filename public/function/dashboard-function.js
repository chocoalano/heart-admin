const token = localStorage.getItem('token');
// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'dashboard/';

$.ajax({
	url: API + 'total', 
	headers: {"token-access": token}, 
	success: function(result){
        if(result.success){
            $('#totalUser').html(result.total_user)
            $('#totalDonor').html(result.total_donor)
            $('#totalNurse').html(result.total_nurse)
        }
    }
})
