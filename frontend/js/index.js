$(document).ready(() => {
  let accountName = [];

  
  $("#btn__add-account").on("click", (e)=> {
    e.preventDefault();
    //Validation for empty input & existing account
    if ($.inArray($("#input__account").val(), accountName) === -1) {
      if ($("#input__account").val().length === 0 ) {
        alert("You must enter an account name!");
     } else {
       accountName.push($("#input__account").val());
     }
    } else {
      alert("Account name already exists");
    }
      console.log(accountName);
    
  }); //End of click event for add new account button

  
  
















}); //End of document get ready event
