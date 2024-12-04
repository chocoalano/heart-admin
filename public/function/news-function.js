const pathArray = window.location.pathname.split('/');
const pages = pathArray[1] + '/' + pathArray[2];

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');

// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'articles/';
var CDN = URL_CDN + 'articles/';

$.ajax({
	url: API + 'list', 
	headers: {"apiKey": AUTH_KEY, "token-access": token}, 
	success: function(result){
        if(!result.success){
            $('#card-body').html('<h6>Belum Ada Data</h6>');
            $('table-responsive').hide();
        } else {
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
})

function addGo(){
    window.location.href = "/news/add";
}
if(pages == 'news/add'){
	$(function () {
		new nicEditor({maxHeight : 1000}).panelInstance('addTxtLongText');
	})
}
async function addNewsSubmit(){
	console.log(token);
	const addTxtTitle = $('#addTxtTitle').val();
	// const addTxtLongText = tinymce.get("addTxtLongText").getContent();
	const addTxtLongText = $('#addTxtLongText').html();
   	const addPublishedSelect = $('select[name=addPublishedSelect] option').filter(':selected').val();

	if(addTxtTitle.length == 0){
		$.LoadingOverlay("hide");
		$('#alert-news').show();
		$('#alert-news').html('Silahkan Masukkan Title news.');
		setTimeout(function(){
			$('#alert-news').hide();
			$('#alert-news').html('');
		}, 3000);
			return;
	}
	
	if(!image.files[0]){
       $.LoadingOverlay("hide");
       $('#alert-news').show();
       $('#alert-news').html('Silahkan Pilih Gambar untuk artikel.');
       setTimeout(function(){
           $('#alert-news').hide();
           $('#alert-news').html('');
       }, 3000);
		 return;
	}
	
 	let formData = new FormData();
	formData.append("image", image.files[0]);
	formData.append("title", addTxtTitle);
	formData.append("text", addTxtLongText);
	formData.append("published", addPublishedSelect);
	// formData.append("admin_id", uid);

	// console.log(formData);
	
	const response = await fetch(API + 'save', {
		method: "POST",
		headers: {"apiKey": AUTH_KEY, "token-access": token}, 
		body: formData
	});
   	const res = await response.json();
	//    console.log('---res---');
	//    console.log(res);	
	if(!res.success){
		$.LoadingOverlay("hide");
		$('#alert-news').show();
		$('#alert-news').html(res.message);
		setTimeout(function(){
			$('#alert-news').hide();
			$('#alert-news').html('');
		}, 3000);
	} else {
		$.LoadingOverlay("hide");
		$('#txtTitle').val('');
		$('#alert-news-success').show();
		$('#alert-news-success').html(res.message);
		$('#addTxtTitle').val('');
		$('#addTxtLongText').val('');
		setTimeout(function(){
			$('#alert-news-success').hide();
			$('#alert-news-success').html('');
		}, 3000);
	}
	
}
function editGo(id){
	window.location.href = "/news/edit/" + id;
}

const newsID = pathArray[3];

if(pages == 'news/edit'){
	$(function () {
		new nicEditor({maxHeight : 500}).panelInstance('editTxtLongText');
	})

	const API_NEWS_DETAIL = API + 'detail?id=' + newsID;
	$.ajax({
		url: API_NEWS_DETAIL, 
		headers: {"apiKey": AUTH_KEY, "token-access": token}, 
		success: function(result){
			let datas = result.data;
			
			$('#editTxtTitle').val(datas.title);
			// tinymce.get("editTxtLongText").setContent(datas.longtext);
			$('#editTxtLongText').html(datas.text);
			$('#imageView').attr("src", CDN + datas.image);
			$('select[name=editPublishedSelect] option[value="'+datas.published+'"]').attr("selected",true);
		}
	});

}

async function editSubmitNews(){
	const editTxtTitle = $('#editTxtTitle').val();
	const editTxtLongText = $('#editTxtLongText').html();
	const editPublishedSelect = $('select[name=editPublishedSelect] option').filter(':selected').val();
	
	if(!imageEdit.files[0]){
		const update = {
			title: editTxtTitle,
			text: editTxtLongText,
			published: editPublishedSelect,
			admin_id: uid,
		}
		 
		 $.ajax({
			 url: API + 'update?id=' + newsID,
			 type: 'PUT',
			 headers: {"apiKey": AUTH_KEY, "token-access": token}, 
			  data: update,
			 success: function(result) {
				 //  console.log(result);
				if(!result.success){
					$.LoadingOverlay("hide");
					$('#alert-news-edit').show();
					$('#alert-news-edit').html(result.message);
					setTimeout(function(){
						$('#alert-news-edit').hide();
						$('#alert-news-edit').html('');
					}, 3000);
				} else {
				   $.LoadingOverlay("hide");
				   $('#alert-news-success-edit').show();
				   $('#alert-news-success-edit').html(result.message);
				   setTimeout(function(){
					   $('#alert-news-success-edit').hide();
					   $('#alert-news-success-edit').html('');
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
		formData.append("image", imageEdit.files[0]);
		formData.append("title", editTxtTitle);
		formData.append("text", editTxtLongText);
		formData.append("published", editPublishedSelect);
		// formData.append("admin_id", uid);
	
		// console.log(formData);
		
		const response = await fetch(API + 'update?id=' + newsID, {
			method: "PUT",
			headers: {"apiKey": AUTH_KEY, "token-access": token}, 
			body: formData
		});
		   const res = await response.json();
		//    console.log('---res---');
		//    console.log(res);	
		if(!res.success){
			$.LoadingOverlay("hide");
			$('#alert-news-edit').show();
			$('#alert-news-edit').html(res.message);
			setTimeout(function(){
				$('#alert-news-edit').hide();
				$('#alert-news-edit').html('');
			}, 3000);
		} else {
			$.LoadingOverlay("hide");
			$('#alert-news-success-edit').show();
			$('#alert-news-success-edit').html(res.message);
			setTimeout(function(){
				$('#alert-news-success-edit').hide();
				$('#alert-news-success-edit').html('');
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
				url: API + '/delete?id=' + id,
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
							window.location.href = "/news";
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
