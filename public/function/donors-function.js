const pathArray = window.location.pathname.split('/');
const pages = pathArray[1] + '/' + pathArray[2];

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');

// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'donors/';
var CDN = URL_CDN + 'contact/';

$.ajax({
	url: API + 'list', 
	headers: {"token-access": token}, 
	success: function(result){
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
                    { title: "Phone", data: "phone"},
                    { title: "Name", data: "name"},
                    { title: "Blood Type", data: "blood_type"},
                    { title: "City", data: "city"},
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
    window.location.href = "/donors/add";
}

async function addNewSubmit(){
    $.LoadingOverlay("show");
	const addTxtName = $('#addTxtName').val();
	const addTxtPhone = $('#addTxtPhone').val();
	const addTxtBloodType = $('#addTxtBloodType').val();
	const addTxtCity = $('#addTxtCity').val();
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
    if(addTxtBloodType.length == 0){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Masukkan Golongan Darah.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }
    if(addTxtCity.length == 0){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Masukkan Kota.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }
     
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
    formData.append("blood_type", addTxtBloodType);
    formData.append("city", addTxtCity);
    formData.append("published", addPublishedSelect);
    formData.append("admin_id", uid);

    const response = await fetch(API + 'save', 
    {
       method: "POST",
		 headers: {"token-access": token}, 
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

//=====================
//======Page Edit======
//=====================

function editGo(id){
	window.location.href = "/donors/edit/" + id;
}

const detailID = pathArray[3];

if(pages == 'donors/edit'){
    const API = URL_API + 'donors/detail/' + detailID;
    console.log(API);
	$.ajax({
		url: API, 
		headers: {"token-access": token}, 
		success: function(result){
			let datas = result.data;

			$('#editTxtName').val(datas.name);
			$('#editTxtPhone').val(datas.phone);
			$('#editTxtBloodType').val(datas.blood_type);
			$('#editTxtCity').val(datas.city);
			$('#imageView').attr("src", CDN + datas.photo);
		}
	});

	$('input[type=file]').change(async function(){ 
		let formData = new FormData();
		 // console.log(CDN + iconchange.files[0].name);
	
	    formData.append("photo", imageEdit.files[0]);
	    formData.append("admin_id", uid);
		 
	    const response = await fetch(URL_API + 'donors/change/image/' + detailID, {
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

function editSubmit(){
    const editTxtxName = $('#editTxtName').val();
    const editTxtxPhone = $('#editTxtPhone').val();
    const editTxtBloodType = $('#editTxtBloodType').val();
    const editTxtxCity = $('#editTxtCity').val();
	const editPublishedSelect = $('select[name=editPublishedSelect] option').filter(':selected').val();
	const update = {
       name: editTxtxName,
       phone: editTxtxPhone,
       blood_type: editTxtBloodType,
       city: editTxtxCity,
       published: editPublishedSelect,
       admin_id: uid,
    }
	
	$.ajax({
	    url: API + 'update/' + detailID,
	    type: 'PUT',
		headers: {"token-access": token},
		data: update,
	    success: function(result) {
			 console.log(result);
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
				url: API + 'delete/' + id,
				type: 'DELETE',
				 headers: {"token-access": token},
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
							window.location.href = "/donors";
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
