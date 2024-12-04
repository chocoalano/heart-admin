const pathArray = window.location.pathname.split('/');
const pages = pathArray[1] + '/' + pathArray[2];

const token = localStorage.getItem('token');
const uid = localStorage.getItem('uid');

// console.log(token);
if(token === null){
    window.location.href = "/login";
}

var API = URL_API + 'user/';
var CDN = URL_CDN + 'users/';

$.ajax({
	url: API + 'list', 
	headers: {"token-access": token, "apiKey": AUTH_KEY}, 
	success: function(result){
		// console.log(result);
        if(!result.success){
			if(result.code == '203'){
				window.location.href = "/login";
			}
            $('#card-body').html('<h6>Belum Ada Data</h6>');
            $('table-responsive').hide();
			
        } else {
            let list = result.data;
			// console.log(list);
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
    		   	{ title: "Email", data: "email"},
    		   	{ title: "Gender", data: "gender"},
    		   	{ title: "Dokter", data: "doctor_name"},
    		   	{ title: "RS", data: "hospital_name"},
				//    { 
				// 	title: "Published", 
				// 	data: "published",
				// 	render: function(data){
				// 		if(data){
				// 			return 'Active'
				// 		}else{
				// 			return 'Hold'
				// 		}
	
				// 	}
				// },
					  { 
    					title: "Action", 
    					data: "id",
    					render: function(data){
    						return '<i onclick="viewGo('+data+')" class="la la-eye pointer" style="cursor: pointer"></i>'
    					}
    				},
		      
    		   ],
    		});  
        }
    }
});

//=====================
//======Page View======
//=====================

function viewGo(id){
	window.location.href = "/users/view/" + id;
}

const detailID = pathArray[3];

if(pages == 'users/view'){
    const API = URL_API + 'user/detail?userid=' + detailID;
    console.log(token);

	$.ajax({
		url: API, 
		headers: {"token-access": token, "apiKey": AUTH_KEY}, 
		success: function(result){
			// console.log(result);
			if(result.code == '203'){
				window.location.href = "/login";
				return;
			}
			let datas = result.data;
			// console.log(datas);
			var registrationDate = moment(datas.createdAt).format('DD-MM-YYYY h:mm:ss A');
			var birthday = moment(datas.birthday).format('DD-MM-YYYY');

            $('#user-image').attr('src', CDN + datas.photo);
			$('#user-name').html(datas.name);
			$('#user-email').html(datas.email);
			$('#user-gender').html(datas.gender);
			$('#user-birthday').html(birthday);
			$('#user-reg-date').html(registrationDate);
			$('#user-published').html(datas.published);
			$('#user-religion').html(datas.religion);
			$('#user-first-diagnosa').html(datas.first_diagnosa);
			$('#user-hipertensi').html(datas.hipertensi == true ? 'Iya' : 'Tidak');
			$('#user-diabetes').html(datas.diabetes == true ? 'Iya' : 'Tidak');
			$('#user-hiperkolesterol').html(datas.hiperkolesterol == true ? 'Iya' : 'Tidak');
			$('#user-kelainanjantungbawaan').html(datas.kelainanjantungbawaan == true ? 'Iya' : 'Tidak');
			$('#user-lain').html(datas.lain);
			
			$('#user-address').html(datas.address);
			$('#user-district').html(datas.district);
			$('#user-city').html(datas.city);
			$('#user-province').html(datas.province);
			
			let list = datas.user_drugs;
			// console.log(list);
			var arr = $.map(list, function (el) { return el });
			$('#dataDrug').dataTable({
				columnDefs: [
					{"className": "dt-center", "targets": "_all"}
				],
				destroy: true,
				processing: true,
				// searching: { regex: true },
				pageLength: 20,
				data: arr,
				dom: 'Bfrtip',
				columns: [
				   	{ title: "Waktu/Jam", data: "time"},
				   	{ title: "Nama Obat", data: "title"},
					{ title: "Petunjuk Pemakaian", data: "instruction"},				  
			   ],
			});

			let listHomeCare = datas.histories;
			// console.log(list);
			var arr2 = $.map(listHomeCare, function (el) { return el });
			$('#homeCare').dataTable({
				columnDefs: [
					{"className": "dt-center", "targets": "_all"}
				],
				destroy: true,
				processing: true,
				// searching: { regex: true },
				pageLength: 20,
				data: arr2,
				dom: 'Bfrtip',
				columns: [
					{ 
						title: "Riwayat Perawatan", 
						data: "date_check",
						render: function (data, type, row) {
							var date = new Date(data);
							var month = date.getMonth() + 1;
							return (month.toString().length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
						}
						
					},
				   	{ title: "Takanan Darah", data: "tekanan_darah"},
				   	// { title: "Gula Darah Sewaktu", data: "gula_darah_sewaktu"},
				   	{ title: "Gula Darah Puasa", data: "gula_darah_puasa"},
				   	{ title: "Gula Darah per Dua Jam", data: "gula_darah_dua_jam"},
					{ title: "HBA1C", data: "hba1c"},				  
					{ title: "LDL", data: "ldl"},				  
					{ title: "HDL", data: "hdl"},				  
					{ title: "Kolesterol", data: "kolesterol"},				  
					{ title: "Ureum", data: "ureum"},				  
					{ title: "Kretinin", data: "kretinin"},				  
			   ],
			});

			let listHistoryCare = datas.historycares;
			// console.log(list);
			var arr3 = $.map(listHistoryCare, function (el) { return el });
			$('#homeActivity').dataTable({
				columnDefs: [
					{
						"className": "dt-center", "targets": "_all", 
					}
				],
				destroy: true,
				processing: true,
				// searching: { regex: true },
				pageLength: 20,
				data: arr3,
				dom: 'Bfrtip',
				columns: [
				   	{ 
						title: "Tanggal", 
						data: "createdAt",
						render: function (data, type, row) {
							var date = new Date(data);
							var month = date.getMonth() + 1;
							return (month.toString().length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
						}
						
					},
				   	{ title: "Tekanan Darah", data: "tekanan_darah"},
				   	{ title: "Berat Badan", data: "berat_badan"},
				   	{ title: "Jumlah Cairan Masuk", data: "cairan_masuk"},				  
				   	{ title: "Aktifitas", data: "aktifitas_harian"},				  
				   	{ title: "Makanan", data: "makanan_harian"},				  
			   ],
			});

		}
	})
	// $('#user-image').attr('src', )
}