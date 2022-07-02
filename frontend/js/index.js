$(document).ready(() => {
  let accountName = [];
  
  // $("#btn__add-account").on("click", (e)=> {
  $("form").submit((e)=>{
    e.preventDefault();
    //get - reading data
    $.ajax({
      method: 'get',
      url: 'http://localhost:3000/accounts',
      dataType: 'json',
    }).done((data) => {
      alert("get" + JSON.stringify(data));
      console.log('data ajax get', data);
    });
    //Validation for empty input & existing account
    if ($.inArray($("#input__account").val(), accountName) === -1) {
      if ($("#input__account").val().length === 0 ) {
        alert("You must enter an account name!");
     } else {
       accountName.push($("#input__account").val());
       alert("New account \""+$("#input__account").val() + "\" has been added.");
       //post - sending data
       $.ajax({
        url: 'http://localhost:3000/accounts',
        type: 'post',
        data: JSON.stringify({username: 'name',}),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
      }).done((data) => {
          console.log('data ajax post', data);
          alert(data + "added!");
        });
       //get - reading data
       $.ajax({
        method: 'get',
        url: 'http://localhost:3000/accounts',
        dataType: 'json',
      }).done((data) => {
        console.log('data ajax get', data);
      });
     
     }
    } else {
      alert("Error: Account name already exists");
    }
      console.log(accountName);
    
  // });
   //End of click event for add new account button
  });

  // Transaction Form
  // Update fields by transaction type
  $("input[type=radio][name=transaction]").change(function(){
  
    if(this.value === "radio__deposit") {
      alert("deposit");
      $("#from_to").hide();
      $("#account").show();
    } else if (this.value === "radio__withdraw") {
      alert("withdraw");
      $("#from_to").hide();
      $("#account").show();
    } else if (this.value === "radio__transfer") {
      alert("transfer");
      $("#from_to").show();
      $("#account").hide();
    }
  });

  //Category
  $("#select__category").change(function(){
    if($(this).val() === "add_new_category") {
      alert($(this).val());
      $("#input__category").show();
      $("#btn__add-category").show();
    } else {
      $("#input__category").hide();
      $("#btn__add-category").hide();
    }
  });
  
  



}); //End of document get ready event
