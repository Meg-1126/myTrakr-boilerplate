$(document).ready(() => 
{
  //==========================
  //ADD NEW ACCOUNT
  //==========================
  let accountName = [];
  let currentBalance = 0;
  let initialBalance = 0;
  
  $("form").submit((e) => {
    e.preventDefault();
    //Validation for empty input & existing account
    if ($.inArray($("#input__account").val(), accountName) === -1) 
    {
      if ($("#input__account").val().length === 0 ) 
      {
        alert("You must enter an account name!");
      } 
      else 
      {
       accountName.push($("#input__account").val());
       alert("New account \""+$("#input__account").val() + "\" has been added.");
       //post - sending data
       $.ajax({
        url: 'http://localhost:3000/accounts',
        type: 'post',
        data: JSON.stringify
        (
          {
            newAccount:{
              username: $("#input__account").val(),
              transactions: []
            }
          }
        ),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
       }).done((data) =>
       {
        console.log('data ajax post', data);
        const account = new Account(data);
        let userId = account.username.id;
        console.log(userId);
        console.log(data);
        
        $("#select__account").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#select__from").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#select__to").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#select__filter-account").append(`<option>${userId}: ${account.username.username}</option>`);
        $("#summary").append(`
        <div class="summary_box">
        <li>User Id: ${userId}</li>
        <li>User Name: ${account.username.username}</li>
        <li id="initial_balance">Current Balance: ${initialBalance}</li>
        </div>
        `);
        // $("#summary").append(`<li>User Name: ${account.username.username}</li>`);
        // $("#summary").append(`<li id="initial_balance">Current Balance: ${initialBalance}</li>`);
        // $("#summary").append(`<p>__________________</p>`);

        $("#input__account").val("");
        // $(`option[value=account${userId}]`).attr("selected","selected");
       });
      }
    } 
    else 
    {
      alert("Error: Account name already exists");
    }
    //hide former summary??
    // if ($("#summary").text() !== "") 
    // {
    //   $("#summary li").hide();
    // } 
   //End of click event for add new account button
  });
  //==========================
  // TRANSACTION RADIO BUTTON
  //==========================
  // Update fields by transaction type
  $("input[type=radio][name=transaction]").change(function()
  {
    if(this.value === "radio__deposit") 
    {
      $("#from_to").hide();
      $("#account").show();
    } else if (this.value === "radio__withdraw") 
    {
      $("#from_to").hide();
      $("#account").show();
    } else if (this.value === "radio__transfer") 
    {
      $("#from_to").show();
      $("#account").hide();
    }
  });
  //==========================
  //CATEGORY
  //==========================
  $("#select__category").change(function()
  {
    if($(this).val() === "add_new_category") 
    {
      $("#input__category").show();
      $("#btn__add-category").show();
    } else {
      $("#input__category").hide();
      $("#btn__add-category").hide();
    }
  });

  $("#btn__add-category").on("click", (e)=> 
  {
    e.preventDefault();
    if ($("#input__category").val().length === 0 ) 
    {
      alert("You must enter a category name!");
    } 
    else
    {
     $.ajax({
      url: 'http://localhost:3000/categories',
      type: 'post',
      data: JSON.stringify({ newCategory:$("#input__category").val()}),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
     }).done((data)=> 
     {
       $(`<option value="new_category">${data.name}</option>`).insertAfter("#select_category");
       $("#input__category").hide();
       $("#btn__add-category").hide();
     });
    }
  });
  //==========================
  //ADD NEW TRANSACTION
  //==========================
  $("#btn__add-transaction").on("click", (e)=> 
  {
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
    let selectedAccountId = selectedAccount.split(":");
    let selectedFromId = from.split(":");
    let selectedToId = to.split(":");
    let selectedFromName = selectedFromId[1];
    let selectedToName = selectedToId[1];

        //引き出しか送金取引選択時に
         if (selectedTransactionType!=="radio__deposit") 
         {
          $.ajax({
            method: 'get',
            url: 'http://localhost:3000/accounts',
            dataType: 'json',
           }).done((data) => 
           {
              console.log(data);
             for (let i = 0; i < data.length; i++) 
             {
              if (data[i].id == Number(selectedAccountId[0]))
              {
                let numOfTransactions = data[i].transactions.length;
                let c = 0;
                 //iterate transactions obj for selected account
                 for (let j = 0; j < numOfTransactions; j++) 
                 {
                  if (data[i].transactions[j].typeOfTransaction == "deposit") {
                    c += Number(data[i].transactions[j].amount);
                  }else if (data[i].transactions[j].typeOfTransaction != "deposit") {
                    c -= Number(data[i].transactions[j].amount);
                  }
                 }
                 //残高がマイナスであるなら
                console.log(c);
                if (c < amountVal) 
                 {
                 alert("Not enough balance for transaction");
                 }
              }
             }
           });
         }
         else if (amountVal <= 0) 
         {
           alert("Amount must be grater than 0!");
         } 
         //Category validation
         else if (selectedCategory==="select_category" || selectedCategory==="add_new_category") 
         {
           alert("You must add & select category!");
         } 
         //Radio button validation
         else if (selectedTransactionType === "radio__transfer") 
         {
           if(from === undefined || to === undefined)
           {
             alert("From and To required");
           } else if (from === to) 
           {
             alert("Transfer error: Choose different account");
           } 
           
         } 
         else
         {
           //post data to transaction server
          $.ajax({
          url: 'http://localhost:3000/transaction',
          type: 'post',
          data: JSON.stringify
          (
           {
             newTransaction: {
               accountId:(selectedTransactionType==="radio__transfer")?selectedFromId[0]:selectedAccountId[0],
               accountIdFrom: (selectedTransactionType==="radio__transfer") ?selectedFromId[0] : "",
               accountIdFromName: (selectedTransactionType==="radio__transfer") ?selectedFromId[1] : "",
               accountIdTo: (selectedTransactionType==="radio__transfer") ?selectedToId[0] : "",
               accountIdToName: (selectedTransactionType==="radio__transfer") ?selectedToId[1] : "",
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
          }).done((data)=> 
          {
           console.log(data); //was able to get transaction data I sent
           let transactionAmount=data[0].amount; //currentTransactionAmount
           console.log(transactionAmount);
           // let transactionUser = data[0].username;
           let inputAmount = data[0].amount;
           let convertAmount = Number(inputAmount).toLocaleString();
           
              
               $("table").append(`
               <tr>
               <td>${data[0].accountId}</td>
               <td id="td__username">${data[0].username}</td>
               <td>${data[0].typeOfTransaction}</td>
               <td>${data[0].category}</td>
               <td>${data[0].description}</td>
               <td>${convertAmount}</td>
               <td id="td__userFrom">${data[0].accountIdFromName}</td>
               <td>${data[0].accountIdToName}</td>
               </tr>
               `);
             
           
             //Update account summary
            // if (selectedTransactionType==="radio__deposit") 
            //  {
            //   $("#initial_balance").remove();
            //   currentBalance += Number(inputAmount);
            //   if($("#update_balance").text()!== "") {
            //    $("#update_balance").remove();
            //   }
            //   $("#summary").append(`<li id="update_balance">Current Balance: ${currentBalance}</li>`);
            //  } else  
            //  {
            //    $("#initial_balance").remove();
            //    currentBalance -= Number(inputAmount);
            //    if($("#update_balance").text()!== "") {
            //      $("#update_balance").remove();
            //    }
            //    $("#summary").append(`<li id="update_balance">Current Balance: ${currentBalance}</li>`);
            //  }
           // }
          }); //end of event after posting transaction
     
          //Clear input
          $("#input__description").val("");
          $("#input__amount").val("");
        }   
    
 });//End of event for add transaction
 
  //===================
  //EVENT FOR ACCOUNT SELECTION
  //===================
  // if selectedAccount is changed, hide account summary which is not selected
  $("#select__account").change(function(){
    // $(this).val() = account00
    //get transactions data from server
    $.ajax({
      method: 'get',
      url: 'http://localhost:3000/accounts',
      dataType: 'json',
    }).done((data) => {
      console.log('data ajax transaction get', data);
    });
  });//end event for changing account

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
