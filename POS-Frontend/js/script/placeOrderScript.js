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
        itemList.forEach(function (item) {
            if (item.code == $("#selectItemCode").val()){
                $("#txtitemName").text(item.description);
                $("#txtitemQty").text(item.qty);
                $("#txtitemPrice").text(item.unitPrice);
            }
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
})

var total = 0.00;
$("#orderQtyField").keydown(function () {
    var orderItemCode = $("#selectItemCode").val();
    var orderItemDescription = $("#txtitemName").text();
    var orderItemUnitPrice = $("#txtitemPrice").text();
    var orderItemQty = $("#orderQtyField").val();
    var amount = orderItemUnitPrice * orderItemQty;
    total = total + amount;
    if (event.which == '13'){
        console.log(orderItemCode,orderItemDescription,orderItemUnitPrice,orderItemQty,amount)
        loadTable(orderItemCode,orderItemDescription,orderItemUnitPrice,orderItemQty,amount);
        $("#total-heading").text(total);
    }
})


function loadTable(orderItemCode,orderItemDescription,orderItemUnitPrice,orderItemQty,amount) {
    var row="<tr>" +
        "<td>"+orderItemCode+"</td>" +
        "<td>"+orderItemDescription+"</td>" +
        "<td>"+orderItemQty+"</td>" +
        "<td>"+orderItemUnitPrice+"</td>" +
        "<td>"+amount+"</td>" +
        "<td><img src='images/recyclebin.png' width='30px'> </td>" +
        "</tr>";
    $('#tbody').append(row);
}


$("#save-order").click(function () {
    var orderid = $("#orderID").text();
    var orderdate = $("#OrderDate").text();
    var orderamount = $("#total-heading").text();

    var  neworder = {orderid: orderid, orderdate: orderdate, orderamount: orderamount};

    var postAjaxConfig = {
        method: "POST",
        url: "http://localhost:8080/ajax/order",
        async: true,
        data: JSON.stringify(neworder),
        contentType: "application/json"
    }

    $.ajax(postAjaxConfig).done(function (response, textStatus, jqxhr) {
        console.log(response)
        if (response) {
            alert("Order has been successfully added");
            clearFields();
        }else {
            alert("Failed to save order");
        }
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
})

function clearFields() {
    $("table tbody tr").remove();
    $("#orderQtyField").val("");
    $("#txtitemName").text("");
    $("#txtitemQty").text("");
    $("#txtitemPrice").text("");
    total = 0;
}
