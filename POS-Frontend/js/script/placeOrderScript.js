switch (document.readyState) {
    case "loading":
        // clearFields();
        getAllCustomers("onload");
        getAllItems("onload");
        break;
    default:
        alert("nothing");
}

//--------------------------------------load Customers------------------------------------
function getAllCustomers(value) {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/customer",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (customerList,textStatus,iqxhr) {
        customerList.forEach(function (customer) {
            if (value =="clicked") {
                if (customer.custId == $("#selectCustomerID").val()){
                    $("#customerName").text(customer.custName);
                }
            }else if (value =="onload") {
                $("#selectCustomerID").append("<option>"+customer.custId+"</option>");
            }
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}

//--------------------------------------load Items------------------------------------
function getAllItems(value) {
    $("#orderQtyField").val("");

    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/item",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (itemList,textStatus,iqxhr) {
        itemList.forEach(function (item) {
            if(value == "clicked"){
                if (item.code == $("#selectItemCode").val()){
                    $("#txtitemName").text(item.description);
                    $("#txtitemPrice").text(item.unitPrice);
                    $("#txtitemQty").text(item.orderqty);
                }
            }else if (value == "onload") {
                $("#selectItemCode").append("<option>"+item.code+"</option>");
            }
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}


//--------------------------------------Customer Combo Select------------------------------------
$("#selectCustomerID").click(function () {
    $("#selectCustomerID").css("border-color","lightgrey");
    getAllCustomers("clicked");
})


//----------------------------------------Item Combo Select--------------------------------------
$("#selectItemCode").click(function () {
    getAllItems("clicked");
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
    var isExisting = checkAlreadyInTable();
    if (!isExisting) {
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
    clearFields();

    $('tbody tr td img').click(function () {
        var row =  $(this).parents('tr');
        console.log(row)
        $(row).remove();
    });
}


$("#save-order").click(function () {

    var custName = $("#customerName").text();
    if ($.trim(custName).length == 0){
        alert("Select Customer");
        $("#selectCustomerID").css("border-color","red");
        $("#selectCustomerID").focus();
        $("#orderQtyField").val("");
        $("#txtitemName").text("");
        $("#txtitemQty").text("");
        $("#txtitemPrice").text("");
        return;
    }

    var orderid = $("#orderID").text();
    var orderdate = $("#OrderDate").text();
    var orderamount = $("#total-heading").text();
    var custid = $("#selectCustomerID").val()

    var order = [];
    var orderdetail = [];
    var completeArray = [];
    var i=0;
    order.push(orderid,orderdate,orderamount,custid)

    while($("tbody tr").length > i){
        i++;
        var code = $("tbody tr:nth-child("+i+") td:nth-child(1)").text();
        var orderqty = $("tbody tr:nth-child("+i+") td:nth-child(3)").text();
        var amount = $("tbody tr:nth-child("+i+") td:nth-child(5)").text();

        var obj = {
            code:code,
            orderqty:orderqty,
            amount:amount
        };
        orderdetail.push(obj);
    }

    completeArray.push(order);
    completeArray.push(orderdetail);

    var postAjaxConfig = {
        method: "POST",
        url: "http://localhost:8080/ajax/order",
        async: true,
        data: JSON.stringify(completeArray),
        contentType: "application/json"
    }

    $.ajax(postAjaxConfig).done(function (response, textStatus, jqxhr) {
        console.log(response)
        if (response) {
            alert("Order has been successfully added");
            $("table tbody tr").remove();
            $("#total-heading").text("");
            $("#customerName").text("");
            total = 0;
            clearFields();
        }else {
            alert("Failed to save order");
        }
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
})


function clearFields() {
    $("#orderQtyField").val("");
    $("#txtitemName").text("");
    $("#txtitemQty").text("");
    $("#txtitemPrice").text("");
    $("#selectItemCode").focus();
}

