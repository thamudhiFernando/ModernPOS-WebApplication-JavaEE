switch (document.readyState) {
    case "loading":
        getAllOrders();
        break;
    default:
        alert("nothing");
}


//--------------------------------------load orders------------------------------------
function getAllOrders() {
    var ajaxGetConfig = {
        method: "GET",
        url: "http://localhost:8080/ajax/order",
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
