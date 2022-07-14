$(document).ready(() => {
  //==========================
  //ADD NEW ACCOUNT
  //==========================
  let accountName = [];
  // let userId = [];
  let currentBalance = 0;
  let initialBalance = 0;
  
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
        let userId = account.username.id;
        
        $("#select__account").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#select__from").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#select__to").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#select__filter-account").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#summary").append(`<li>User Id: ${userId}</li>`);
        $("#summary").append(`<li>User Name: ${account.username.username}</li>`);
        $("#summary").append(`<li id="initial_balance">Current Balance: ${currentBalance}</li>`);

        $("#input__account").val("");
        $(`option[value=account${userId}]`).attr("selected","selected");
      });
      
       //get - reading data
       $.ajax({
        method: 'get',
        url: 'http://localhost:3000/accounts',
        dataType: 'json',
      }).done((data) => {
        console.log('data ajax get', data);
        // $.each(data, function(i, val){
        //   console.log(val.transactions);
        //   if (val.transactions.length === 0) {
        //     $("#summary").append(`<li id="initial_balance">Current Balance: 0</li>`);
        //   } else if (val.transactions.length > 0) {
        //       currentBalance.push(val.transactions);
        //       console.log(currentBalance); 
        //   }

        // })
      });
     
     }
    } else {
      alert("Error: Account name already exists");
    }
      console.log(accountName);
    
  // });
   //End of click event for add new account button
  });
  //==========================
  // TRANSACTION RADIO BUTTON
  //==========================
  // Update fields by transaction type
  $("input[type=radio][name=transaction]").change(function(){
  
    if(this.value === "radio__deposit") {
      $("#from_to").hide();
      $("#account").show();
    } else if (this.value === "radio__withdraw") {
      $("#from_to").hide();
      $("#account").show();
    } else if (this.value === "radio__transfer") {
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
      //  $("#select__category").append(`<option>${data.name}</option>`);
      $(`<option value="new_category">${data.name}</option>`).insertAfter("#select_category");
       $("#input__category").hide();
       $("#btn__add-category").hide();
    });
    
   }
  });
  //==========================
  //ADD NEW TRANSACTION
  //==========================
  $("#btn__add-transaction").on("click", (e)=> {
    e.preventDefault();
    let amountVal = $("#input__amount").val();
    let selectedCategory = $("#select__category option:selected").val();
    let selectedCategoryPrint = $("#select__category option:selected").text();
    let selectedAccount = $("#select__account option:selected").val();
    let selectedFrom = $("#select__from option:selected").val();
    let selectedTransactionType = $("input[type='radio'][name='transaction']:checked").val();
    let selectedTransactionTypePrint = selectedTransactionType.split("__");
    let from = $("#select__from option:selected").val();
    let to = $("#select__to option:selected").val();
    // let currentBalance = 0; //Need to change later
    let selectedAccountId = selectedAccount.split(":");
    let selectedFromId = from.split(":");
    let selectedToId = to.split(":");

    if (amountVal <= 0) {
      alert("Amount must be grater than 0!");
    } 
    //Category validation
      if (selectedCategory==="select_category" || selectedCategory==="add_new_category") {
        alert("You are selecting wrong category!");
      } else {
        alert("Success");
        //then, send data to server
      }
    //Account name validation
    if(selectedAccount === undefined){
     alert("You must select the account name!")
    } else {
      alert("Name: " + selectedAccount + " is selected");
    }
    
    //Radio button validation
    if(selectedTransactionType === undefined) {
     alert("Transaction type required!")
    } else if(selectedTransactionType === "radio__withdraw"){
       alert("withdraw is selected");
       if(currentBalance < amountVal) {
        alert("You don't have enough balance");
      } else {
        alert("current balance: "+currentBalance + ", input amount: "+amountVal);
      }
    } else if (selectedTransactionType === "radio__transfer") {
      if(from === undefined || to === undefined){
        alert("From and To required");
      } else if (from === to) {
        alert("Transfer error: Choose different account");
      }
      $.ajax({
        method: 'get',
        url: 'http://localhost:3000/accounts',
        dataType: 'json',
      }).done((data) => {
        console.log('data ajax get', data);
      });
    }

    
    $.ajax({
      method: 'get',
      url: 'http://localhost:3000/accounts',
      dataType: 'json',
    }).done((data) => {
      console.log('data ajax get', data);
      //Filter username which has the same name as selectedAccount
      //Access id for the username
      //Insert the id as a value of accountId property
    });
    
    //Send the new transaction
    $.ajax({
      url: 'http://localhost:3000/transaction',
      type: 'post',
      data: JSON.stringify(
        {
          newTransaction: {
            accountId:(selectedTransactionType==="radio__transfer")?selectedFromId[0]:selectedAccountId[0],
            accountIdFrom: (selectedTransactionType==="radio__transfer") ?selectedFromId[0] : "",
            accountIdTo: (selectedTransactionType==="radio__transfer") ?selectedToId[0] : "",
            username: (selectedTransactionType==="radio__transfer")?selectedFrom:selectedAccount,
            typeOfTransaction: selectedTransactionTypePrint[1],
            category: ((selectedCategory!=="select_category") && (selectedCategory!=="add_new_category"))?selectedCategoryPrint:"",
            description: $("#input__description").val(),
            amount: amountVal
          }
        }
      ),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
    }).done((data)=>{
       console.log(data); //was able to get transaction data I sent
       let transactionAmount=data[0].amount;
       let transactionUser = data[0].username;
       let inputAmount = data[0].amount;
       let convertAmount = Number(inputAmount).toLocaleString();
       console.log(transactionAmount);
       console.log(transactionUser);
       const transaction = new Transaction(transactionAmount, transactionUser);
       console.log(transaction.amount);
       console.log(transaction.account);
       $("table").append(`
       <tr>
       <td>${data[0].accountId}</td>
       <td>${data[0].username}</td>
       <td>${data[0].typeOfTransaction}</td>
       <td>${data[0].category}</td>
       <td>${data[0].description}</td>
       <td>${convertAmount}</td>
       <td>${data[0].accountIdFrom}</td>
       <td>${data[0].accountIdTo}</td>
       </tr>
       `);
       
       if (selectedTransactionType==="radio__deposit") {
        $("#initial_balance").remove();
        currentBalance += Number(inputAmount);
        //remove current balance
        if($("#update_balance").text()!== "") {
          $("#update_balance").remove();
        }
        $("#summary").append(`<li id="update_balance">Current Balance: ${currentBalance}</li>`);
       }
       else if (selectedTransactionType==="radio__withdraw") {
        $("#initial_balance").remove();
        currentBalance -= Number(inputAmount);
        //remove current balance
        if($("#update_balance").text()!== "") {
          $("#update_balance").remove();
        }
        $("#summary").append(`<li id="update_balance">Current Balance: ${currentBalance}</li>`);
       }


  //get - reading data of account
    $.ajax({
      method: 'get',
      url: 'http://localhost:3000/accounts',
      dataType: 'json',
    }).done((data) => {
      console.log('data ajax account info get', data);
    });

    });

    //get - reading data of transaction
    $.ajax({
      method: 'get',
      url: 'http://localhost:3000/transactions',
      dataType: 'json',
    }).done((data) => {
      console.log('data ajax transaction get', data);
      $.each(data, function(i, val){
        console.log(val, i);

      });
    });
     //Clear input
     $("#input__description").val("");
     $("#input__amount").val("");

  });//End of event for add transaction
  //===================
  // FILTER BY ACCOUNT
  //===================
   //iterate each obj and get amount
      //find username which is selected in filter
      //sum up the amount and create balance if each obj has same username
  $("#select__filter-account").change(function(){
      alert($(this).val()); //1: name
  });//End of event for filtering table 


}); //End of document get ready event