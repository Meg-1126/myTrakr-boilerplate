$(document).ready(() => 
{
  let accountName = [];
  let currentBalance = 0;
  let initialBalance = 0;
  //==========================
  //ADD NEW ACCOUNT
  //==========================
  
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
        <div class="summary_${account.username.username}">
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
      alert(`New category "${data.name}" has been added.`);
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
    let amountVal = $("#input__amount").val(); //string
    let inputVal = Number(amountVal);
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
    

        //Validation before posting new transaction
          // $.ajax({
          //   method: 'get',
          //   url: 'http://localhost:3000/accounts',
          //   dataType: 'json',
          //  }).done((data) => 
          //  {
          //   alert("ajax account data pulled");
          //     console.log(data);
          //    for (let i = 0; i < data.length; i++) 
          //    {
          //     if (data[i].id == Number(selectedAccountId[0]))
          //     {
          //       let numOfTransactions = data[i].transactions.length;
          //       let c = 0;
          //        //iterate transactions obj for selected account
          //        for (let j = 0; j < numOfTransactions; j++) 
          //        {
          //         if (data[i].transactions[j].typeOfTransaction == "deposit") {
          //           c += Number(data[i].transactions[j].amount);
          //         }else if (data[i].transactions[j].typeOfTransaction != "deposit") {
          //           c -= Number(data[i].transactions[j].amount);
          //         }
          //        }
          //        //残高がマイナスであるなら
          //       console.log(c);
          //       if ((selectedTransactionType!=="radio__deposit")&&(c < inputVal)) 
          //        {
          //        alert("Not enough balance for transaction");
          //        }
          //     }
          //    }
          //  });
         
         if (inputVal <= 0) 
         {
           alert("Amount must be grater than 0!");
         } 
         //Category validation
         else if (selectedCategory==="select_category" || selectedCategory==="add_new_category") 
         {
           alert("You must add & select category!");
         } 
         //Radio transfer validation
         else if ((selectedTransactionType === "radio__transfer")&&(from === undefined || to === undefined)) 
         {
            alert("From and To required");
         } else if ((selectedTransactionType === "radio__transfer")&&(from === to)) 
         {
             alert("Transfer error: Choose different account"); 
         } 
         else
         {
          let isEnoughBalance = false; 
          $.ajax({
            method: 'get',
            url: 'http://localhost:3000/accounts',
            dataType: 'json',
           }).done((data) => 
           {
            //  alert("ajax account data pulled");
              console.log(data);
              let c = 0;
             
             for (let i = 0; i < data.length; i++) 
             {
              if (data[i].id == Number(selectedAccountId[0]))
              {
                let numOfTransactions = data[i].transactions.length;
                 //iterate transactions obj for selected account
                 for (let j = 0; j < numOfTransactions; j++) 
                 {
                  if (data[i].transactions[j].typeOfTransaction == "deposit")
                  {
                    c += Number(data[i].transactions[j].amount);
                  } else if (data[i].transactions[j].typeOfTransaction != "deposit") 
                  {
                    c -= Number(data[i].transactions[j].amount);
                  }
                 }
                }
              } //end of for loop for accounts object
              //残高がマイナスであるなら
             console.log(c);
             if ((selectedTransactionType!=="radio__deposit")&&(c < inputVal)) 
              {
              alert("Not enough balance for transaction");
              isEnoughBalance = false;
              } else {
              isEnoughBalance = true;
              }
           console.log(isEnoughBalance);
          if ((isEnoughBalance === true)||(selectedTransactionType==="radio__deposit")) //post new transaction
          {
            alert(`Add new transaction (${selectedTransactionTypePrint[1]})`);
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
                 amount: inputVal
               }
             }
            ),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            }).done((data)=> 
            {
             let inputAmount = data[0].amount;
             let convertAmount = Number(inputAmount).toLocaleString();

             if (selectedTransactionType!=="radio__transfer") {
              $("table").append(`
              <tr>
              <td>${data[0].accountId}</td>
              <td id="td__username">${data[0].username}</td>
              <td>${data[0].typeOfTransaction}</td>
              <td>${data[0].category}</td>
              <td>${data[0].description}</td>
              <td>${convertAmount}</td>
              <td id="td__userFrom">---</td>
              <td>---</td>
              </tr>
              `);
             } else 
             {
              $("table").append(`
              <tr>
              <td>---</td>
              <td id="td__username">---</td>
              <td>${data[0].typeOfTransaction}</td>
              <td>${data[0].category}</td>
              <td>${data[0].description}</td>
              <td>${convertAmount}</td>
              <td id="td__userFrom">${data[0].accountIdFromName}</td>
              <td>${data[0].accountIdToName}</td>
              </tr>
              `);
             }
                 
               //Update account summary with new transaction 
               $.ajax({
                method: 'get',
                url: 'http://localhost:3000/accounts',
                dataType: 'json',
               }).done((data) => 
               {
                  console.log(data);
                  let selectingId = Number(selectedAccountId[0]);
                  console.log(selectingId);
                  // find username or id
                  let obj = data.find(elem => elem.id === selectingId);
                  console.log(obj);
                  //********rewrite below using obj
                //  for (let i = 0; i < data.length; i++) 
                //  {
                  // if (data[i].id == selectingId)
                  // { 
                    // let numOfTransactions = data[i].transactions.length;
                    let numOfTransactions = obj.transactions.length;
                    let updateBalance = 0;
                    let b = 0;
                    //iterate transactions obj for selected account
                    for (let j = 0; j < numOfTransactions; j++) 
                    {
                        if (obj.transactions[j].typeOfTransaction === "deposit") 
                        {
                          updateBalance += Number(obj.transactions[j].amount);
                        } else if (obj.transactions[j].typeOfTransaction !== "deposit")
                        {
                          updateBalance -= Number(obj.transactions[j].amount);
                        }
                      
                      console.log(updateBalance);
                    }
                    //Update current balance
                    if($(`.summary_${obj.username} #update_balance`)!=="") {
                      $(`.summary_${obj.username} #initial_balance`).remove();
                      $(`.summary_${obj.username} #update_balance`).remove();
                      $(`.summary_${obj.username}`).append(`<li id="update_balance">Update Balance: ${updateBalance}</li>`);
                    } else {
                      $(`.summary_${obj.username} #initial_balance`).remove();
                      $(`.summary_${obj.username}`).append(`<li id="update_balance">Update Balance: ${updateBalance}</li>`);
                    }
                  // }
                //  }
               });
             
            }); //end of posting transaction
          }
          
        });//end of get method for accounts server data
       }  //end of else 
        
        //Clear input
        $("#input__description").val("");
        $("#input__amount").val("");
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
