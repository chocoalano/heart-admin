const pathArray = window.location.pathname.split('/');
const pages = pathArray[1] + '/' + pathArray[2];

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');

// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'questioner/';
var CDN = URL_CDN + 'questioner/';
var CDN_USER = URL_CDN + 'avatar/';

$.ajax({
	url: API + 'masterType/list', 
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
                    {"className": "dt-left", "targets": "_all"}
                ],
                destroy: true,
                processing: true,
                searching: { regex: true },
                pageLength: 20,
                data: arr,
                dom: 'Bfrtip',
                columns: [
                    { 
                        title: "No", 
                        data: "id",
                        render: function(data, type, row, meta){
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    { title: "Title", data: "title"},
                    { title: "Publish", data: "published"},
                    { 
                        title: "Action", 
                        data: "id",
                        render: function(data){
                            return '<i onclick="viewGo('+data+')" class="la la-eye pointer" style="cursor: pointer"></i>&nbsp;Detail'
                        }
                    },
                ]            
            })
        }        
    }
})

function viewGo(id){
	window.location.href = "/questioner/view/" + id;
}

const detailID = pathArray[3];

if(pages == 'questioner/view'){
    const API2 = URL_API + 'questioner/masterType/detail/' + detailID;

    $.ajax({
		url: API2, 
		headers: {"token-access": token}, 
        success: function(result){
			let dataHeaders = result.data;
            $('#s-title').html(dataHeaders.title_question_type);
            
            let list = result.data.details;
            var arr = $.map(list, function (el) { return el });
            
            $('#datatables2').dataTable({
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
                        title: "No", 
                        data: "id",
                        render: function(data, type, row, meta){
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    { title: "Name", data: "name"},
                    { title: "Blood Type", data: "blood_type"},
                    { title: "Gender", data: "gender"},
                    { title: "Total Score", data: "total_score"},
                    { 
                        title: "Action", 
                        data: "fid_user",
                        render: function(data){
                            return '<i onclick="viewSubmitedGo('+data+','+dataHeaders.fid_question_type+')" class="la la-eye pointer" style="cursor: pointer"></i>&nbsp;Detail'
                        }
                    },
                ]            
            })
        
        }
    })
}

function viewSubmitedGo(fid_user,fid_question_type){
	window.location.href = "/questioner/submited/" + fid_user + '/' + fid_question_type;
}

const userID = pathArray[3];
const questionTypeID = pathArray[4];

if(pages == 'questioner/submited'){
    const API3 = URL_API + 'questioner/submited/detail/' + userID + '/' + questionTypeID;

    $.ajax({
		url: API3, 
		headers: {"token-access": token}, 
        success: function(result){
            let dataHeaders = result.data[0];
            // console.log(dataHeaders)
            var birthday = moment(dataHeaders.user.birthday).format('DD-MM-YYYY');

            $('#user-image').attr('src', CDN_USER + dataHeaders.user.photo);
            $('#s-name').html(dataHeaders.user.name);
            $('#s-bloodtype').html(dataHeaders.user.blood_type);
            $('#s-gender').html(dataHeaders.user.gender);
            $('#s-birthday').html(birthday);

            let list = result.data;
            var arr = $.map(list, function (el) { return el });
            
            let sum = 0;
            for(i=1; i < list.length; i++){
                sum = sum + list[i].master_answer.score;
            }
            $('#s-title').html(dataHeaders.master_question_type.title);
            $('#s-score').html(sum);

            $('#datatables3').dataTable({
                columnDefs: [
                    {"className": "dt-left", "targets": "_all"}
                ],
                destroy: true,
                processing: true,
                searching: false,
                pageLength: 20,
                data: arr,
                dom: 'Bfrtip',
                columns: [
                    { 
                        title: "No", 
                        data: "id",
                        render: function(data, type, row, meta){
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    { title: "Question", data: "master_question.title"},
                    { title: "Answer", data: "master_answer.answer"},
                    { title: "Score", data: "master_answer.score"},
                    // { 
                    //     title: "Action", 
                    //     data: "fid_user",
                    //     render: function(data){
                    //         return '<i onclick="viewSubmitedGo('+data+','+dataHeaders.fid_question_type+')" class="la la-eye pointer" style="cursor: pointer"></i>&nbsp;Detail'
                    //     }
                    // },
                ]            
            })

            
        }    
    })
}