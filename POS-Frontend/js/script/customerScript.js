switch (document.readyState) {
    case "loading":
        getAllCustomers();
        generateCustomerID();
        break;
    default:
        alert("nothing");
}

//--------------------------------------load Customers------------------------------------
function getAllCustomers() {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/customer",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (customerList,textStatus,iqxhr) {
        $("table tbody tr").remove();
        customerList.forEach(function (customer) {
            var html = "<tr>"
                + "<td>" + customer.custId + "</td>"
                + "<td>" + customer.custName + "</td>"
                + "<td>" + customer.custAddress + "</td>"
                + "<td><img src='images/recyclebin.png' width='30px'></td>"
                + "</tr>"
            $("table tbody").append(html);
        });


        //--------------------------------------delete Customer-------------------------------------
        $('tbody tr td img').click(function () {
            var custID = $(this).parents('tr').find('td:first-child').html();
            var row =  $(this).parents('tr');
            console.log(custID)
            var deleteAjaxConfig ={
                method:"DELETE",
                url:"http://localhost:8080/ajax/customer",
                async:true,
                dataType: 'json',
                contentType: 'application/json',
                data:JSON.stringify({custID:custID})
            }

            $.ajax(deleteAjaxConfig).done(function (data) {
                alert("Customer has been successfully Deleted");
                $(row).remove();
            }).fail(function (error) {
                console.log(error);
                alert("Failed to delete Customer");
            });
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}

//--------------------------------------save Customer-------------------------------------
//--------------------------------------load Customers------------------------------------
$("#btn-save").click(function () {
    var custId = $("#txtCustomerID").val();
    var custName = $("#txtCustomerIName").val();
    var custAddress = $("#txtCustomerAddress").val();

    var  newCustomer = {custId: custId, custName: custName, custAddress: custAddress};

    var postAjaxConfig = {
        method: "POST",
        url: "http://localhost:8080/ajax/customer",
        async: true,
        data: JSON.stringify(newCustomer),
        contentType: "application/json"
    }

    $.ajax(postAjaxConfig).done(function (response, textStatus, jqxhr) {
        console.log(response)
        if (response) {
            alert("Customer has been successfully added");
            clearFields();
            getAllCustomers();
            generateCustomerID();
        }else {
            alert("Failed to save customer");
        }
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
})

//--------------------------------------click clear button-------------------------------------
$("#btn-clear").click(function () {
    console.log("clear")
    clearFields();
})


//--------------------------------------clear Field-------------------------------------
function clearFields() {
    $("#txtCustomerIName").val("");
    $("#txtCustomerAddress").val("");
}


function generateCustomerID() {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/customer",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (customerLsit,textStatus,iqxhr) {
        var custid;
        customerLsit.forEach(function (custids) {
            custid = custids.custId;
        });
        var value = custid.substr(1,4);
        console.log("C00"+(parseInt(value)+1))
        $("#txtCustomerID").val("C00"+(parseInt(value)+1));
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}
