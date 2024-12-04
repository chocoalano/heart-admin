const pathArray = window.location.pathname.split('/');
const pages = pathArray[1] + '/' + pathArray[2];

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');

// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'banner/';
var CDN = URL_CDN + 'banners/';
$.ajax({
	url: API + 'list', 
	headers: {"apiKey": AUTH_KEY, "token-access": token}, 
	success: function(result){
		// console.log(result)
    if(!result.success){
        $('#card-body').html('<h6>Belum Ada Data</h6>');
        $('table-responsive').hide();
    }else{
        let list = result.data;
		// console.log(result.data)
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
                title: "Image", 
                data: "image",
                render: function (data) {
                    return "<img src='"+ CDN + data +"' style='width: 80px; height: 40px; background: #DF4F9A; padding: 2px;'/>"
                }
			},
		   	{ title: "Title", data: "title"},
		    { title: "Published", data: "published"},
		    { 
                title: "Action", 
                data: "id",
                render: function(data){
                    return '<i class="la la-pencil-square" onclick="editGo('+data+')" style="cursor: pointer"></i>&nbsp;<i class="ft ft-trash-2" onclick="deleteGo('+data+')" style="cursor: pointer"></i>'
                }
			},
		      
		   ],
		});
        
    }
 }
});

//=====================
//===Page Add New======
//=====================

function addGo(){
    window.location.href = "/banners/add";
}

if(pages == 'banners/add'){
	$(function () {
		new nicEditor({maxHeight : 500}).panelInstance('addTxtLongText');
	})
}

async function addNewSubmitBanner(){
	const addTxtTitle = $('#addTxtTitle').val();
	const addTxtLongText = $('#addTxtLongText').html();
   	const addPublishedSelect = $('select[name=addPublishedSelect] option').filter(':selected').val();

    if(addTxtTitle.length == 0){
       $.LoadingOverlay("hide");
       $('#alert-banner').show();
       $('#alert-banner').html('Silahkan Masukkan Title Banner.');
       setTimeout(function(){
           $('#alert-banner').hide();
           $('#alert-banner').html('');
       }, 3000);
		 return;
    }
	
	if(!image.files[0]){
       $.LoadingOverlay("hide");
       $('#alert-banner').show();
       $('#alert-banner').html('Silahkan Pilih Gambar untuk Banner.');
       setTimeout(function(){
           $('#alert-banner').hide();
           $('#alert-banner').html('');
       }, 3000);
		 return;
	}
	
 	let formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("title", addTxtTitle);
    // formData.append("text", addTxtLongText);
    formData.append("published", addPublishedSelect);
    formData.append("admin_id", uid);
	
    const response = await fetch(API + 'save', 
    {
       	method: "POST",
		headers: {"token-access": token, "apiKey": AUTH_KEY}, 
	    body: formData
    });
    const res = await response.json();
	// console.log(res);
	
    if(!res.success){
       $.LoadingOverlay("hide");
       $('#alert-banner').show();
       $('#alert-banner').html(res.message);
       setTimeout(function(){
           $('#alert-banner').hide();
           $('#alert-banner').html('');
       }, 3000);
    } else {
       $.LoadingOverlay("hide");
       $('#txtTitle').val('');
       $('#alert-banner-success').show();
       $('#alert-banner-success').html(res.message);
	 	 $('#addTxtTitle').val('');
	 	 $('#addTxtDesc').val('');
	 	 $('#addTxtUrl').val('');
       setTimeout(function(){
           $('#alert-banner-success').hide();
           $('#alert-banner-success').html('');
       }, 3000);
    }
	
}

//=====================
//======Page Edit======
//=====================

function editGo(id){
	window.location.href = "/banners/edit/" + id;
}

const bannerID = pathArray[3];

if(pages == 'banners/edit'){
	$(function () {
		new nicEditor({maxHeight : 500}).panelInstance('editTxtDescBanner');
	})
	const API = URL_API + 'banner/detail?id=' + bannerID;
	// console.log(API);
	$.ajax({
		url: API, 
		headers: {"token-access": token, "apiKey": AUTH_KEY}, 
		success: function(result){
			let datas = result.data;
			console.log(result);

			$('#editTxtTitleBanner').val(datas.title);
			$('#editTxtDescBanner').html(datas.text);
			$('#imageView').attr("src", CDN + datas.image);
		}
	});
	
	$('input[type=file]').change(async function(){ 
		let formData = new FormData();
		 // console.log(CDN + iconchange.files[0].name);
	
	    formData.append("image", imageEdit.files[0]);
	    formData.append("admin_id", uid);
		 
	    const response = await fetch(API + '/change/image/' + bannerID, {
	        method: "PUT",
			  headers: {"token-access": token},
	        body: formData
	    });
	    const res = await response.json();
		 
	    if(!res.success){
	        $.LoadingOverlay("hide");
			  $('#imageView').attr("src", CDN + imageView.files[0].name);
	        $('#alert-banner-edit').show();
	        $('#alert-banner-edit').html(res.message);
	        setTimeout(function(){
	            $('#alert-banner-edit').hide();
	            $('#alert-banner-edit').html('');
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

async function editSubmitBanner(){
	const editTxtTitleBanner = $('#editTxtTitleBanner').val();
	// const editTxtLongText = $('#editTxtLongText').html();
	const editPublishedSelect = $('select[name=editPublishedSelect] option').filter(':selected').val();
	const APIS = URL_API + 'banner/update?id=' + bannerID;
	
	if(!imageEdit.files[0]){
		let formData = new FormData();
		// formData.append("image", image.files[0]);
		formData.append("title", editTxtTitleBanner);
		formData.append("published", editPublishedSelect);
		// formData.append("admin_id", uid);
		
		const response = await fetch(APIS, {
			method: "PUT",
			headers: {"token-access": token, "apiKey": AUTH_KEY}, 
			body: formData
		});
		const res = await response.json();
		console.log(res);
		
		if(!res.success){
		   $.LoadingOverlay("hide");
		   $('#alert-banner-edit').show();
		   $('#alert-banner-edit').html(res.message);
		   setTimeout(function(){
			   $('#alert-banner-edit').hide();
			   $('#alert-banner-edit').html('');
		   }, 3000);
		} else {
		   $.LoadingOverlay("hide");
		//    $('#txtTitle').val('');
		   $('#alert-banner-success-edit').show();
		   $('#alert-banner-success-edit').html(res.message);
		   setTimeout(function(){
			   $('#alert-banner-success-edit').hide();
			   $('#alert-banner-success-edit').html('');
		   }, 3000);
		}
		
	} else {
		let formData = new FormData();
		formData.append("image", image.files[0]);
		formData.append("title", editTxtTitleBanner);
		formData.append("published", editPublishedSelect);
		formData.append("admin_id", uid);
		
		const response = await fetch(APIS, {
			method: "PUT",
			headers: {"token-access": token, "apiKey": AUTH_KEY}, 
			body: formData
		});
		const res = await response.json();
		// console.log(res);
		
		if(!res.success){
		   $.LoadingOverlay("hide");
		   $('#alert-banner').show();
		   $('#alert-banner').html(res.message);
		   setTimeout(function(){
			   $('#alert-banner').hide();
			   $('#alert-banner').html('');
		   }, 3000);
		} else {
		   $.LoadingOverlay("hide");
		   $('#txtTitle').val('');
		   $('#alert-banner-success').show();
		   $('#alert-banner-success').html(res.message);
		   setTimeout(function(){
			   $('#alert-banner-success').hide();
			   $('#alert-banner-success').html('');
		   }, 3000);
		}
	}
	
}



function deleteGo(id){
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
				success: function(result) {
					 console.log(result);
				   if(!result.success){
					swal("Can't delete, because not found id!");
				   } else {
						swal("Poof! Your imaginary file has been deleted!", {
							icon: "success",
						})
						.then((value) => {
							window.location.href = "/banners";
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
