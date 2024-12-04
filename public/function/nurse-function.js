const pathArray = window.location.pathname.split('/');
const pages = pathArray[1] + '/' + pathArray[2];

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');

// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'officer/';
var CDN = URL_CDN + 'officers/';

$.ajax({
	url: API + 'list', 
	headers: {"apiKey": AUTH_KEY, "token-access": token}, 
	success: function(result){
        console.log(result);
        // if(result.code == '203'){
        //     window.location.href = "/login";
        //     return;
        // }

        if(!result.success){
            $('#card-body').html('<h6>Belum Ada Data</h6>');
            $('table-responsive').hide();
        }else{
            let list = result.data;
            var arr = $.map(list, function (el) { return el });
            $('#datatables').dataTable({
                columnDefs: [
                    {"className": "dt-center", "targets": "_all"}
                ],
                destroy: true,
                processing: true,
                searching: { regex: true },
                pageLength: 20,
                data: arr,
                dom: 'Bfrtip',
                columns: [
                    { 
                        title: "Photo", 
                        data: "photo",
                        render: function (data) {
							if(data == null){
								return "<img src='"+ CDN +"avatar.png' style='width: 50px; height: 50px; border-radius: 50%; background: #DF4F9A; padding: 1px;'/>"
							}else{
								return "<img src='"+ CDN + data +"' style='width: 50px; height: 50px; border-radius: 50%; background: #DF4F9A; padding: 1px;'/>"
							}
                         }
                    },
                    { title: "Name", data: "name"},
                    { title: "Phone", data: "phone"},
                    { title: "Work At", data: "workAt"},
                    { 
                        title: "Action", 
                        data: "id",
                        render: function(data){
                            return '<i class="la la-pencil-square" onclick="editGo('+data+')" style="cursor: pointer"></i>&nbsp;<i class="ft ft-trash-2" onclick="deleteGo('+data+')" style="cursor: pointer"></i>'
                        }
                    },
                ]                
            })        
        }
    }
});

function addGo(){
    window.location.href = "/nurse/add";
}

async function addNewSubmit(){
    $.LoadingOverlay("show");
	const addTxtName = $('#addTxtName').val();
	const addTxtPhone = $('#addTxtPhone').val();
	const addTxtWorkAt = $('#addTxtWorkAt').val();
	// const addTxtCity = $('#addTxtCity').val();
   	const addPublishedSelect = $('select[name=addPublishedSelect] option').filter(':selected').val();

    if(addTxtName.length == 0){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Masukkan Nama.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }
    if(addTxtPhone.length == 0){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Masukkan Phone.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }
    if(addTxtWorkAt.length == 0){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Masukkan Work At.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }
    // if(addTxtCity.length == 0){
    //     $.LoadingOverlay("hide");
    //     $('#alert-warning').show();
    //     $('#alert-warning').html('Silahkan Masukkan Kota.');
    //     setTimeout(function(){
    //         $('#alert-warning').hide();
    //         $('#alert-warning').html('');
    //     }, 3000);
    //     return;
    // }
     
    if(!image.files[0]){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Pilih Photo.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }

    let formData = new FormData();
    formData.append("photo", image.files[0]);
    formData.append("name", addTxtName);
    formData.append("phone", addTxtPhone);
    formData.append("workAt", addTxtWorkAt);
    // formData.append("city", addTxtCity);
    formData.append("published", addPublishedSelect);
    formData.append("admin_id", uid);

    const response = await fetch(API + 'save', 
    {
       method: "POST",
       headers: {"apiKey": AUTH_KEY, "token-access": token}, 
       body: formData
    });
    const res = await response.json();
	// console.log(res);
	
    if(!res.success){
       $.LoadingOverlay("hide");
       $('#alert-warning').show();
       $('#alert-warning').html(res.message);
       setTimeout(function(){
           $('#alert-warning').hide();
           $('#alert-warning').html('');
       }, 3000);
    } else {
       $.LoadingOverlay("hide");
       $('#txtTitle').val('');
       $('#alert-success').show();
       $('#alert-success').html(res.message);

       $('#addTxtName').val('');
       $('#addTxtPhone').val('');
       $('#addTxtWorkAt').val('');
    //    $('#addTxtCity').val('');
       setTimeout(function(){
           $('#alert-success').hide();
           $('#alert-success').html('');
       }, 3000);
    }
}

//=====================
//======Page Edit======
//=====================

function editGo(id){
	window.location.href = "/nurse/edit/" + id;
}

const detailID = pathArray[3];

if(pages == 'nurse/edit'){
    const API = URL_API + 'officer/detail?id=' + detailID;
    console.log(API);
	$.ajax({
		url: API, 
        headers: {"apiKey": AUTH_KEY, "token-access": token}, 
		success: function(result){
			let datas = result.data;

			$('#editTxtName').val(datas.name);
			$('#editTxtPhone').val(datas.phone);
			$('#editTxtWorkAt').val(datas.workAt);
			$('#editTxtCity').val(datas.city);
			$('#imageView').attr("src", CDN + datas.photo);
		}
	});

	$('input[type=file]').change(async function(){ 
		let formData = new FormData();
		 // console.log(CDN + iconchange.files[0].name);
	
	    formData.append("photo", imageEdit.files[0]);
	    formData.append("admin_id", uid);
		 
	    const response = await fetch(URL_API + 'nurse/change/image/' + detailID, {
	        method: "PUT",
			  headers: {"token-access": token},
	        body: formData
	    });
	    const res = await response.json();
		 
	    if(!res.success){
	        $.LoadingOverlay("hide");
			$('#imageView').attr("src", CDN + imageView.files[0].name);
	        $('#alert-warning').show();
	        $('#alert-warning').html(res.message);
	        setTimeout(function(){
	            $('#alert-warning').hide();
	            $('#alert-warning').html('');
	        }, 3000);
	    } else {
	        $.LoadingOverlay("hide");
	        $('#txtTitle').val('');
	        $('#alert-success').show();
	        $('#alert-success').html(res.message);
	        setTimeout(function(){
	            $('#alert-success').hide();
	            $('#alert-success').html('');
	        }, 3000);
	    }
	});

}

async function editSubmit(){
    const editTxtxName = $('#editTxtName').val();
    const editTxtxPhone = $('#editTxtPhone').val();
    const editTxtxWorkAt = $('#editTxtWorkAt').val();
    const editTxtxCity = $('#editTxtCity').val();
	const editPublishedSelect = $('select[name=editPublishedSelect] option').filter(':selected').val();

    if(!imageEdit.files[0]){
        const update = {
            name: editTxtxName,
            phone: editTxtxPhone,
            workAt: editTxtxWorkAt,
            //    city: editTxtxCity,
            published: editPublishedSelect,
            admin_id: uid,
        }
            
        $.ajax({
            url: API + 'update?id=' + detailID,
            type: 'PUT',
            headers: {"apiKey": AUTH_KEY, "token-access": token}, 
            data: update,
            success: function(result) {
                // console.log(result);
            if(!result.success){
                $.LoadingOverlay("hide");
                $('#alert-warning').show();
                $('#alert-warning').html(result.message);
                setTimeout(function(){
                    $('#alert-warning').hide();
                    $('#alert-warning').html('');
                }, 3000);
            } else {
                $.LoadingOverlay("hide");
                $('#alert-success').show();
                $('#alert-success').html(result.message);
                setTimeout(function(){
                    $('#alert-success').hide();
                    $('#alert-success').html('');
                }, 3000);
            }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                // alert("some error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
            }
        });        
    } else {
        let formData = new FormData();
        formData.append("photo", image.files[0]);
        formData.append("name", editTxtxName);
        formData.append("phone", editTxtxPhone);
        formData.append("workAt", editTxtxWorkAt);
        // formData.append("city", addTxtCity);
        formData.append("published", editPublishedSelect);
        // formData.append("admin_id", uid);

        const response = await fetch(API + 'update?id=' + detailID, 
        {
        method: "PUT",
        headers: {"apiKey": AUTH_KEY, "token-access": token}, 
        body: formData
        });
        const res = await response.json();
        // console.log(res);
        
        if(!res.success){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html(res.message);
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        } else {
        $.LoadingOverlay("hide");
        $('#txtTitle').val('');
        $('#alert-success').show();
        $('#alert-success').html(res.message);

        $('#addTxtName').val('');
        $('#addTxtPhone').val('');
        $('#addTxtWorkAt').val('');
        $('#addTxtCity').val('');
        setTimeout(function(){
            $('#alert-success').hide();
            $('#alert-success').html('');
        }, 3000);
        }
    }
}

function deleteGo(id){
	// console.log(API);
	swal({
		title: "Are you sure?",
		text: "Once deleted, you will not be able to recover this!",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	  })
	  .then((willDelete) => {
		if (willDelete) {
			$.ajax({
				url: API + 'delete?id=' + id,
				type: 'DELETE',
                headers: {"apiKey": AUTH_KEY, "token-access": token}, 
				//  data: update,
				success: function(result) {
					 console.log(result);
				   if(!result.success){
					swal("Can't delete, because not found id!");
				   } else {
						swal("Poof! Your imaginary file has been deleted!", {
							icon: "success",
						})
						.then((value) => {
							window.location.href = "/nurse";
						});
				   }
				},
				 error: function(XMLHttpRequest, textStatus, errorThrown) {
					  // alert("some error");
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
				 }
				 
			});
		  
		} else {
			swal("Your imaginary file is safe!");
		}
	  });
}
