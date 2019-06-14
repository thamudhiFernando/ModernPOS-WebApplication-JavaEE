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
            var html = "<tr>"
                + "<td>" + item.code + "</td>"
                + "<td>" + item.description + "</td>"
                + "<td>" + item.unitPrice + "</td>"
                + "<td>" + item.orderqty + "</td>"
                + "<td><img src='images/recyclebin.png' width='30px'></td>"
                + "</tr>"
            $("table tbody").append(html);
        });


        //--------------------------------------delete Item-------------------------------------
        $('tbody tr td img').click(function () {
            var code = $(this).parents('tr').find('td:first-child').html();
            var row =  $(this).parents('tr');
            console.log(code)
            var deleteAjaxConfig ={
                method:"DELETE",
                url:"http://localhost:8080/ajax/item",
                async:true,
                dataType: 'json',
                contentType: 'application/json',
                data:JSON.stringify({code:code})
            }

            $.ajax(deleteAjaxConfig).done(function (data) {
                alert("Item has been successfully Deleted");
                $(row).remove();
            }).fail(function (error) {
                console.log(error);
                alert("Failed to delete Item");
            });
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
    var orderqty = $("#txtItemQty").val();
    var unitprice = $("#txtItemUnitPrice").val();

    var  newItem = {code: code, description: description, orderqty: orderqty, unitPrice:unitprice};

    var postAjaxConfig = {
        method: "POST",
        url: "http://localhost:8080/ajax/item",
        async: true,
        data: JSON.stringify(newItem),
        contentType: "application/json"
    }

    $.ajax(postAjaxConfig).done(function (response, textStatus, jqxhr) {
        console.log(response)
        if (response) {
            alert("Item has been successfully added");
            clearFields();
            getAllItems();
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
