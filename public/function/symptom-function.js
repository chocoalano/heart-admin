const pathArray = window.location.pathname.split('/');
const pages = pathArray[1] + '/' + pathArray[2];

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');

// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'symptom/';
var CDN = URL_CDN + 'symptoms/';

$.ajax({
	url: API + 'one', 
    headers: {"apiKey": AUTH_KEY, "token-access": token}, 
	success: function(result){
        if(result.code == '203'){
            window.location.href = "/login";
            return;
        }

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
                        title: "Icon", 
                        data: "icon",
                        render: function (data) {
							if(data == null){
								return "<img src='"+ CDN +"noimage.png' style='width: 50px; height: 50px; border-radius: 50%; background: #DF4F9A; padding: 1px;'/>"
							}else{
								return "<img src='"+ CDN + data +"' style='width: 50px; height: 50px; border-radius: 50%; background: #DF4F9A; padding: 1px;'/>"
							}
                         }
                    },
                    { title: "Title", data: "title"},
                    { title: "Description", data: "desc"},
                    { 
                        title: "Action", 
                        data: "id",
                        render: function(data){
                            return '<i onclick="viewGo('+data+')" class="la la-eye pointer" style="cursor: pointer"></i>&nbsp;<i class="la la-pencil-square" onclick="editGo('+data+')" style="cursor: pointer"></i>'
                        }
                    },
                
                ]
            })        
        }
    }
})

function addGo(){
    window.location.href = "/symptom/add";
}

async function addNewSubmit(){
    $.LoadingOverlay("show");
	const addTxtTitle = $('#addTxtTitle').val();
	const addTxtDesc = $('#addTxtDesc').val();
   	const addPublishedSelect = $('select[name=addPublishedSelect] option').filter(':selected').val();

    if(addTxtTitle.length == 0){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Masukkan Title.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }
    if(addTxtDesc.length == 0){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Masukkan Description.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }     
    if(!image.files[0]){
        $.LoadingOverlay("hide");
        $('#alert-warning').show();
        $('#alert-warning').html('Silahkan Pilih Icon.');
        setTimeout(function(){
            $('#alert-warning').hide();
            $('#alert-warning').html('');
        }, 3000);
        return;
    }

    let formData = new FormData();
    formData.append("icon", image.files[0]);
    formData.append("title", addTxtTitle);
    formData.append("desc", addTxtDesc);
    formData.append("published", addPublishedSelect);
    formData.append("admin_id", uid);

    const response = await fetch(API + 'one', 
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

       $('#addTxtTitle').val('');
       $('#addTxtDesc').val('');
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
	window.location.href = "/symptom/edit/" + id;
}

const detailID = pathArray[3];

if(pages == 'symptom/edit'){
    $.ajax({
		url: API + 'one/detail-edit?id='+detailID, 
        headers: {"apiKey": AUTH_KEY, "token-access": token}, 
        success: function(result){
			let datas = result.data;

            $('#editTxtTitle').val(datas.title);
			$('#editTxtDesc').val(datas.desc);
			$('#imageView').attr("src", CDN + datas.icon);

        }
    })

	$('input[type=file]').change(async function(){ 
		let formData = new FormData();
		 // console.log(CDN + iconchange.files[0].name);
	
	    formData.append("icon", imageEdit.files[0]);
	    formData.append("admin_id", uid);
		 
	    const response = await fetch(URL_API + 'symptom/one/change/image/' + detailID, {
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
    const editTxtTitle = $('#editTxtTitle').val();
    const editTxtDesc = $('#editTxtDesc').val();
	const editPublishedSelect = $('select[name=editPublishedSelect] option').filter(':selected').val();
	
	if(!imageEdit.files[0]){
        let formData = new FormData();
        formData.append("icon", imageEdit.files[0]);
        formData.append("title", editTxtTitle);
        formData.append("desc", editTxtDesc);
        formData.append("published", editPublishedSelect);
        // formData.append("admin_id", uid);
    
        const response = await fetch(API + 'one?id=' + detailID, {
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
    
           $('#addTxtTitle').val('');
           $('#addTxtDesc').val('');
           setTimeout(function(){
               $('#alert-success').hide();
               $('#alert-success').html('');
           }, 3000);
        }
    }else{
        const update = {
            title: editTxtTitle,
            desc: editTxtDesc,
            published: editPublishedSelect,
            admin_id: uid,
         }
         
         $.ajax({
             url: API + 'one?id='+detailID, 
             type: 'PUT',
             headers: {"apiKey": AUTH_KEY, "token-access": token}, 
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

    
}

//=====================
//======Page View======
//=====================

function viewGo(id){
	window.location.href = "/symptom/view/" + id;
}

if(pages == 'symptom/view'){
    $.ajax({
		url: API + 'one/detail?id='+detailID, 
        headers: {"apiKey": AUTH_KEY, "token-access": token}, 
        success: function(result){
			let datas = result.data;
            // console.log(datas);
            // console.log(datas[0].symptom_twos);
            $('#s-title').html(datas[0].title);
			$('#s-desc').html(datas[0].desc);
			$('#imageView').attr("src", CDN + datas[0].icon);

            let dataSymptom2 = datas[0].symptom_twos;
            var div = "<div>";
            for (var i = 0; i < dataSymptom2.length; i++) {
                // console.log(dataSymptom2[i]);
                let dataSymptom3 = dataSymptom2[i].symptom_threes;
                div += "<div class=''><p><i>"+ parseInt(i+1)  +"</i>.&nbsp;&nbsp;" + dataSymptom2[i].title + "&nbsp;&nbsp;<i class='la la-pencil-square' onclick='editSymptom2Go("+dataSymptom2[i].id+")' style='cursor: pointer'></i></p></div>";
                for (var x = 0; x < dataSymptom3.length; x++) {
                    div += "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>"+ parseInt(x+1)  +"</i>.&nbsp;&nbsp;" + dataSymptom3[x].questions + "&nbsp;&nbsp;(Action: "+dataSymptom3[x].actions+")&nbsp;&nbsp;<i class='la la-pencil-square' onclick='editSymptom3Go("+dataSymptom3[x].id+")' style='cursor: pointer'></i></p></div>";
                    div += "<div style='margin-left: 40px;'><p><img src='" + URL_CDN + 'symptom/' + dataSymptom3[x].image + "' style='width: 60px' /></p></div>";
                    div += "<div style='margin-left: 40px;'><p>" + dataSymptom3[x].description + "</p></div>";
                }
            }
            div += "</div>";
            $('#symptom-two').html(div)

        }
    })
    
}

////////////////////
////////////////////

function editSymptom2Go(id){
	window.location.href = "/symptom/edit-symptom2/" + id;
}

if(pages == 'symptom/edit-symptom2'){
    const symptom2ID = pathArray[3];
    const API = URL_API + 'symptom/two/detail-edit?id=' + symptom2ID;
    // console.log(API);
    $.ajax({
        url: API, 
        headers: {"apiKey": AUTH_KEY, "token-access": token}, 
        success: function(result){
			let datas = result.data;
            console.log(datas.fid_symptom_one);
            
            $('#idSymptomOne').val(datas.fid_symptom_one)
            $('#editTxtSymptomType').val(datas.symptom_one.title)
            $('#editTxtSymptomTypeDesc').val(datas.symptom_one.desc)
            $('#editTxtTitle').val(datas.title)
            $('#backPage').html('<a href="/symptom/view/'+ datas.fid_symptom_one +'"><button type="button" class="btn btn-secondary btn-min-width mr-1 mb-1">Back</button></a>')
        }       
    })
    
    function editSubmitSymptom2(){
        const idSymptomOne = $('#idSymptomOne').val();
        const editTxtTitle = $('#editTxtTitle').val();
        const editPublishedSelect = $('select[name=editPublishedSelect] option').filter(':selected').val();
         
        const update = {
            // fid_symptom_one: idSymptomOne,
            // fid_symptom_two: symptom2ID,
            title: editTxtTitle,
            published: editPublishedSelect,
            // admin_id: uid,
         }
         
         $.ajax({
             url: URL_API + 'symptom/two?id=' + symptom2ID,
             type: 'PUT',
             headers: {"apiKey": AUTH_KEY, "token-access": token}, 
             data: update,
             success: function(result) {
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
}

/////////////////////////////
/////////////////////////////

function editSymptom3Go(id){
	window.location.href = "/symptom/edit-symptom3/" + id;
}

if(pages == 'symptom/edit-symptom3'){
    const symptom3ID = pathArray[3];
    const API = URL_API + 'symptom/three/detail-edit?id=' + symptom3ID;
    console.log(API);
    $.ajax({
        url: API, 
        headers: {"apiKey": AUTH_KEY, "token-access": token}, 
        success: function(result){
			let datas = result.data;
            // console.log(datas.symptom_one);
            
            $('#idSymptomOne').val(datas.fid_symptom_one)
            $('#idSymptomTwo').val(datas.fid_symptom_two)
            $('#editTxtSymptomType').val(datas.symptom_one.title)
            $('#editTxtSymptomTypeDesc').val(datas.symptom_one.desc)
            $('#editTxtSymptomTwo').val(datas.symptom_two.title)
            $('#editTxtQuestion').val(datas.questions)
            $('#editTxtAction').val(datas.actions)
            $('#editTxtInstruction').val(datas.description)
            $('#imageView').attr("src", CDN + datas.image);
            $('#backPage').html('<a href="/symptom/view/'+ datas.fid_symptom_one +'"><button type="button" class="btn btn-secondary btn-min-width mr-1 mb-1">Back</button></a>')
			$('select[name=editCallSelect] option[value="'+datas.call_nurse+'"]').attr("selected",true);
        }       
    })
    
    function editSubmitSymptom3(){
        const idSymptomOne = $('#idSymptomOne').val();
        const idSymptomTwo = $('#idSymptomTwo').val();
        const editTxtQuestion = $('#editTxtQuestion').val();
        const editTxtAction = $('#editTxtAction').val();
        const editTxtInstruction = $('#editTxtInstruction').val();
        const editCallSelect = $('select[name=editCallSelect] option').filter(':selected').val();
        const editPublishedSelect = $('select[name=editPublishedSelect] option').filter(':selected').val();
         
        const update = {
            questions: editTxtQuestion,
            actions: editTxtAction,
            description: editTxtInstruction,
            call_nurse: editCallSelect,
            published: editPublishedSelect,
        }
         
        $.ajax({
             url: URL_API + 'symptom/three?id=' + symptom3ID,
             type: 'PUT',
             headers: {"apiKey": AUTH_KEY, "token-access": token}, 
             data: update,
             success: function(result) {
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

	$('input[type=file]').change(async function(){ 
		let formData = new FormData();
		 // console.log(CDN + iconchange.files[0].name);
	
	    formData.append("image", imageEdit.files[0]);
		 
	    const response = await fetch(URL_API + 'symptom/three?id=' + symptom3ID, {
	        method: "PUT",
            headers: {"apiKey": AUTH_KEY, "token-access": token}, 
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

