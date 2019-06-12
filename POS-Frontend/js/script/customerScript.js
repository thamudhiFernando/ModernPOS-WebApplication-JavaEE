
switch (document.readyState) {
    case "loading":
        clearFields();
        getAllCustomers();
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
                + "<td>" + customer.id + "</td>"
                + "<td>" + customer.name + "</td>"
                + "<td>" + customer.address + "</td>"
                + "</tr>"
            $("table tbody").append(html);
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}

//--------------------------------------save Customer-------------------------------------
//--------------------------------------load Customers------------------------------------
$("#btn-save").click(function () {
    var id = $("#txtCustomerID").val();
    var name = $("#txtCustomerIName").val();
    var address = $("#txtCustomerAddress").val();

    var  newCustomer = {id: id, name: name, address: address};

    var postAjaxConfig = {
        method: "POST",
        url: "http://localhost:8080/ajax/customer",
        async: true,
        data: JSON.stringify(newCustomer),
        contentType: "application/json"
    }

    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/customer",
        async: true,
    }

    $.ajax(postAjaxConfig).done(function (response, textStatus, jqxhr) {
        console.log(response)
        if (response) {
            alert("Customer has been successfully added");
            clearFields();
            $.ajax(ajaxGetConfig).done(function (customerList,textStatus,iqxhr) {
                $("table tbody tr").remove();
                customerList.forEach(function (customer) {
                    var html = "<tr>"
                        + "<td>" + customer.id + "</td>"
                        + "<td>" + customer.name + "</td>"
                        + "<td>" + customer.address + "</td>"
                        + "</tr>"
                    $("table tbody").append(html);
                });
            }).fail(function (jqxhr, textStatus, errorMsg) {
                console.log(errorMsg);
            });
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
    $("#txtCustomerID").val("");
    $("#txtCustomerIName").val("");
    $("#txtCustomerAddress").val("");
}
