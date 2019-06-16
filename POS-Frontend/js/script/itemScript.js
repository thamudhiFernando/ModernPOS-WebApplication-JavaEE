switch (document.readyState) {
    case "loading":
        clearFields();
        getAllItems();
        generateItemCode();
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
                + "<td>" + item.orderqty + "</td>"
                + "<td>" + item.unitPrice + "</td>"
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
                generateItemCode();
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

    var isEmpty = checkEmpty(description,orderqty,unitprice);
    if (isEmpty) {
        var isValidate = checkValidate(description,orderqty,unitprice);
        if (isValidate) {
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
                    generateItemCode();
                }else {
                    alert("Failed to save Item");
                }
            }).fail(function (jqxhr, textStatus, errorMsg) {
                console.log(errorMsg);
            });
        }
    }
})


//--------------------------------------click clear button-------------------------------------
$("#btn-clear").click(function () {
    clearFields();
})


//--------------------------------------clear Field-------------------------------------
function clearFields() {
    // $("#txtItemCode").val("");
    $("#txtItemDescription").val("");
    $("#txtItemQty").val("");
    $("#txtItemUnitPrice").val("");
}


function generateItemCode() {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/item",
        async: true,
    }

    $.ajax(ajaxGetConfig).done(function (itemList,textStatus,iqxhr) {
        var itemcode;
        itemList.forEach(function (codes) {
            itemcode = codes.code;
        });
        var value = itemcode.substr(1,4);
        console.log("I00"+(parseInt(value)+1))
        $("#txtItemCode").val("I00"+(parseInt(value)+1));
    }).fail(function (jqxhr, textStatus, errorMsg) {
        console.log(errorMsg);
    });
}


function checkEmpty(description,qty,unitprice) {
    if ($.trim(description).length == 0){
        grey();
        $("#txtItemDescription").css("border-color","red");
        alert("Item Description is empty");
        $("#txtItemDescription").focus();
        return false;
    } else if ($.trim(qty).length == 0){
        grey();
        $("#txtItemQty").css("border-color","red");
        alert("Item Qty is empty");
        $("#txtItemQty").focus();
        return false;
    } else if ($.trim(unitprice).length == 0){
        grey();
        $("#txtItemUnitPrice").css("border-color","red");
        alert("Item UnitPrice is empty");
        $("#txtItemUnitPrice").focus();
        return false;
    }else {
        grey();
        return true;
    }
};

function checkValidate(description,qty,unitprice) {
    var validateDesc = /^[A-Za-z0-9]+$/;
    var validateQty = /^[0-9]+$/;
    var validateUnitPrice = /^[0-9]{1,}[.][0-9]{2}$/;

    if (!validateDesc.test(description)){
        grey();
        $("#txtItemDescription").css("border-color","red");
        $("#txtItemDescription").focus();
        alert("incorrect description");
        return false;
    }else if (!validateQty.test(qty)){
        grey();
        $("#txtItemQty").css("border-color","red");
        $("#txtItemQty").focus();
        alert("incorrect qty");
        return false;
    }else if (!validateUnitPrice.test(unitprice)){
        grey();
        $("#txtItemUnitPrice").css("border-color","red");
        $("#txtItemUnitPrice").focus();
        alert("incorrect unitprice - 0.00");
        return false;
    }else {
        console.log("validate Success");
        grey();
        return true;
    }
}

function grey() {
    $("#txtItemDescription").css("border-color","lightgrey");
    $("#txtItemQty").css("border-color","lightgrey");
    $("#txtItemUnitPrice").css("border-color","lightgrey");
}

$("#txtItemDescription").click(function () {
    grey();
});

$("#txtItemQty").click(function () {
    grey();
});

$("#txtItemUnitPrice").click(function () {
    grey();
});
