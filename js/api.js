$(document).ready(function(){
	
var api_url = "http://alorman.cesnuria.com/ProjectPDO/api/users";

/* ---------------------------- FILL TABLE UP ---------------------------- */
function fill_up(){
	$("#content").html("<img src='img/loading.gif' width='200' />");
	$.ajax({
		type: 'GET',
		url: api_url,
		dataType: 'json',
		success: function(resp){
			$("#content").html("<table><tbody></tbody></table>");
			$("tbody").append("<tr><td>EMAIL</td><td>PASSWORD</td><td>NAME</td><td>PHONE</td><td>ROL</td><td colspan='2' id='btn-new-user'>New User</td></tr>");
			for(i=0;i<resp.length;i++){
				$("tbody").append("<tr id='"+resp[i].id_user+"'>");
					$("tr:last").append("<td>"+resp[i].email+"</td>");
					$("tr:last").append("<td>"+resp[i].password+"</td>");
					$("tr:last").append("<td>"+resp[i].name+"</td>");
					$("tr:last").append("<td>"+resp[i].phone+"</td>");
					switch(resp[i].rol){
						case '1': rol="Admin";
								break;
						case '2': rol="User";
								break;
						case '3': rol="Moderator";
								break;
						default:rol="Undefined";
								break;
					}
					$("tr:last").append("<td>"+rol+"</td>");
					$("tr:last").append("<td class='btn-edit'>Edit</td>");
					$("tr:last").append("<td class='btn-delete'>Delete</td>");
				$("tbody").append("</tr>");
			}
		}
	});
}fill_up();



/* ---------------------------- DELETE ---------------------------- */
$("#content").on("click", ".btn-delete", function(){	
	id_user = $(this).closest("tr").attr("id");
	user = $("#"+id_user+" td:first").text();
	if(confirm("Are you sure you want to delete the user '"+user+"'?")){
		$("#edit-form").slideUp(200);
		$("#new-user-form").slideUp(200);
		$("#msg").html("<img src='img/loading.gif' width='100' />");

		$.ajax({
			type: 'DELETE',
			url: api_url,
			dataType: 'json',
			data: {id_user : id_user},
			success: function(resp){
				setTimeout(function(){
					if(resp.response == "deleted"){
						fill_up();
						$("#msg").html("The user has been deleted.");					
					}else if(resp.response == "user_not_exists"){
						$("#msg").html("The user does not exist.");
					}else if(resp.response == "cannot_delete"){
						$("#msg").html("The user can not be deleted.");
					}else if(resp.response == "param_error"){
						$("#msg").html("Parameters error.");
					}
					$("#msg").slideDown(200);
				},500);
				var clear = setInterval(function(){
					$("#msg").slideUp(200);
				}, 5000);
			}
		});
	}	
});



/* ---------------------------- SHOW EDIT FORM ---------------------------- */
$("#content").on("click", ".btn-edit", function(){
	id_user = $(this).closest("tr").attr("id");
	$("btn-action-edit").attr("name",id_user);
	$("#new-user-form").slideUp(200);
	$("#edit-form").slideUp(100);

	$.ajax({ // RELLENA LOS CAMPOS DEL EDIT
		type: 'GET',
		url: api_url,
		dataType: 'json',
		success: function(resp){			
			for(i=0;i<resp.length;i++){
				if(resp[i].id_user == id_user){
					$("#ed-email").val(resp[i].email);
					$("#ed-email").attr("placeholder", resp[i].email);
					$("#ed-password").val(resp[i].password);
					$("#ed-password").attr("placeholder", resp[i].password);
					$("#ed-name").val(resp[i].name);
					$("#ed-name").attr("placeholder", resp[i].name);
					$("#ed-phone").val(resp[i].phone);
					$("#ed-phone").attr("placeholder", resp[i].phone);
				}
			}
		}
	});

	$("#edit-form").slideDown(300);
});	



/* ---------------------------- EDIT ---------------------------- */
$("#btn-action-edit").on("click", function(){
	$("#msg").stop(true, true).slideUp();
	$("#msg").html("<img src='img/loading.gif' width='100' />");
	email = $("#ed-email").val();
	password = $("#ed-password").val();
	name = $("#ed-name").val();
	phone = $("#ed-phone").val();
	rol = $("#ed-rol option:selected").val();

	$.ajax({ // RELLENA LOS CAMPOS DEL EDIT
		type: 'PUT',
		url: api_url,
		dataType: 'json',
		data: {id_user : id_user, email : email, password : password, name : name, phone : phone, rol : rol},
		success: function(resp){	
			setTimeout(function(){
				if(resp.response == "updated"){
					fill_up();					
					$("#msg").html("The user has been updated.");					
				}else if(resp.response == "user_not_exists"){
					$("#msg").html("The user does not exist.");
				}else if(resp.response == "cannot_update"){
					$("#msg").html("No change detected. No change was made.");
				}else if(resp.response == "missing_params"){
					$("#msg").html("Fill all required fields (*)");
				}
				$("#msg").slideDown(200);
			},500);			
			var clearMsg = setInterval(function(){
				$("#msg").slideUp(200);
			}, 5000);
		}
	});
});	



/* ---------------------------- SHOW NEW USER FORM ---------------------------- */
$("#content").on("click", "#btn-new-user", function(){
	$("#new-user-form input:text").val("");
	$("#edit-form").slideUp(200);
	$("#new-user-form").slideUp(100);
	$("#new-user-form").slideDown(300);
});	



/* ---------------------------- NEW USER ---------------------------- */
$("#btn-action-create").on("click", function(){
	$("#msg").stop(true, true).slideUp();
	$("#msg").html("<img src='img/loading.gif' width='100' />");
	email = $("#nu-email").val();
	password = $("#nu-password").val();
	rep_pass = $("#nu-rep-pass").val();
	name = $("#nu-name").val();
	phone = $("#nu-phone").val();
	rol = $("#nu-rol option:selected").val();

	if(password == rep_pass){
		$.ajax({ // RELLENA LOS CAMPOS DEL EDIT
			type: 'POST',
			url: api_url,
			dataType: 'json',
			data: {email : email, password : password, name : name, phone : phone, rol : rol},
			success: function(resp){	
				setTimeout(function(){
					if(resp.response == "created"){
						fill_up();
						$("#msg").html("The user has been created.");						
					}else if(resp.response == "user_exists"){
						$("#msg").html("The user already exists.");
					}else if(resp.response == "cannot_create"){
						$("#msg").html("The user can not be created.");
					}else if(resp.response == "missing_params"){
						$("#msg").html("Fill all required fields. (*)");
					}
					$("#msg").slideDown(200);					
				},500);				
			}
		});
	}else{
		setTimeout(function(){
			$("#msg").html("Passwords do not match.");
			$("#msg").slideDown(200);			
		},500);
	}
	var clear = setInterval(function(){
		$("#msg").slideUp(200);
	}, 5000);	
});	


});	