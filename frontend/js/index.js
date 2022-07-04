$(document).ready(() => {

  //ADD NEW ACCOUNT
  let accountName = [];
  
  // $("#btn__add-account").on("click", (e)=> {
  $("form").submit((e)=>{
    e.preventDefault();
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
        data: JSON.stringify(
          {
            newAccount:{
              username: $("#input__account").val(),
              transactions: []
            }
          }
          ),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
      }).done((data) => {
        console.log('data ajax post', data);
        const account = new Account(data);
        console.log(account.username.username);
        $("#select__account").append(`<option>${account.username.username}</option>`);
        $("#select__from").append(`<option>${account.username.username}</option>`);
        $("#select__to").append(`<option>${account.username.username}</option>`);
        $("#select__filter-account").append(`<option>${account.username.username}</option>`);
        $("#summary").append(`<li>User Name: ${account.username.username}</li>`);
        $("#summary").append(`<li>Current Balance: ${account.username.transactions}</li>`);


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

  // TRANSACTION RADIO BUTTON
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

  //CATEGORY
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

  $("#btn__add-category").on("click", (e)=> {
    e.preventDefault();
    if ($("#input__category").val().length === 0 ) {
      alert("You must enter a category name!");
   } else {
    let categoryVal = $("#input__category").val(); //Get input value for category
    $.ajax({
      url: 'http://localhost:3000/categories',
      type: 'post',
      data: JSON.stringify({ newCategory:$("#input__category").val()}),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
    }).done((data)=>{
       console.log(data);
      //  $("#select__category").append(`<option>${data.name}</option>`);
      $(`<option>${data.name}</option>`).insertAfter("#select_category");
       $("#input__category").hide();
       $("#btn__add-category").hide();
    });
    
   }
  });

  //ADD NEW TRANSACTION
  $("#btn__add-transaction").on("click", (e)=> {
    e.preventDefault();
    let amountVal = $("#input__amount").val();
    if (amountVal <= 0) {
      alert("Amount must be grater than 0!");
    } else if (amountVal === NaN) {
      alert("Enter a number!")
    } 
  });
  
  



}); //End of document get ready event
