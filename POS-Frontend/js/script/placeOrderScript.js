switch (document.readyState) {
    case "loading":
        // clearFields();
        getAllCustomers();
        getAllItems();
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
            $("#selectCustomerID").append("<option>"+customer.id+"</option>");
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}

//--------------------------------------load Items------------------------------------
function getAllItems() {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/item",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (itemList,textStatus,iqxhr) {
        $("table tbody tr").remove();
        itemList.forEach(function (item) {
            $("#selectItemCode").append("<option>"+item.code+"</option>");
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}


//--------------------------------------Customer Combo Select------------------------------------
$("#selectCustomerID").click(function () {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/customer",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (customerList,textStatus,iqxhr) {
        $("table tbody tr").remove();
        customerList.forEach(function (customer) {
            if (customer.id == $("#selectCustomerID").val()){
                $("#customerName").text(customer.name);
            }
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
})


//----------------------------------------Item Combo Select--------------------------------------
$("#selectItemCode").click(function () {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/item",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (itemList,textStatus,iqxhr) {
        $("table tbody tr").remove();
        itemList.forEach(function (item) {
            if (item.code == $("#selectItemCode").val()){
                $("#itemName").text(item.description);
                $("#itemQty").text(item.qty);
                $("#itemPrice").text(item.unitPrice);
            }
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
})
