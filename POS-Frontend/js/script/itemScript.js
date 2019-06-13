
switch (document.readyState) {
    case "loading":
        clearFields();
        getAllItems();
        break;
    default:
        alert("nothing");
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
            console.log(item.unitPrice)
            var html = "<tr>"
                + "<td>" + item.code + "</td>"
                + "<td>" + item.description + "</td>"
                + "<td>" + item.qty + "</td>"
                + "<td>" + item.unitPrice + "</td>"
                + "<td><img src='images/recyclebin.png' width='30px'></td>"
                + "</tr>"
            $("table tbody").append(html);
        });
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}

//--------------------------------------save Item-------------------------------------
//--------------------------------------load Items------------------------------------
$("#btn-save").click(function () {
    var code = $("#txtItemCode").val();
    var description = $("#txtItemDescription").val();
    var qty = $("#txtItemQty").val();
    var unitprice = $("#txtItemUnitPrice").val();

    var  newItem = {code: code, description: description, qty: qty, unitPrice:unitprice};

    var postAjaxConfig = {
        method: "POST",
        url: "http://localhost:8080/ajax/item",
        async: true,
        data: JSON.stringify(newItem),
        contentType: "application/json"
    }

    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/item",
        async: true,
    }

    $.ajax(postAjaxConfig).done(function (response, textStatus, jqxhr) {
        console.log(response)
        if (response) {
            alert("Item has been successfully added");
            clearFields();
            $.ajax(ajaxGetConfig).done(function (itemList,textStatus,iqxhr) {
                $("table tbody tr").remove();
                itemList.forEach(function (item) {
                    console.log(item.unitPrice)
                    var html = "<tr>"
                        + "<td>" + item.code + "</td>"
                        + "<td>" + item.description + "</td>"
                        + "<td>" + item.qty + "</td>"
                        + "<td>" + item.unitPrice + "</td>"
                        + "<td><img src='images/recyclebin.png' width='30px'></td>"
                        + "</tr>"
                    $("table tbody").append(html);
                });
            }).fail(function (jqxhr, textStatus, errorMsg) {
                console.log(errorMsg);
            });
        }else {
            alert("Failed to save Item");
        }
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
})


//--------------------------------------click clear button-------------------------------------
$("#btn-clear").click(function () {
    clearFields();
})


//--------------------------------------clear Field-------------------------------------
function clearFields() {
    $("#txtItemCode").val("");
    $("#txtItemDescription").val("");
    $("#txtItemQty").val("");
    $("#txtItemUnitPrice").val("");
}
