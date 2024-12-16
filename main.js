let current = null;

$(function () {
    $("#BID").on('keyup', function () {
        const value = parseInt($(this).val());
        $('.simple-error').css('display', 'none');

        $("#name").val("");
        $("#phoneNumber").val("");
        $("#address").val("");
        $("#pincode").val("");
        $("#district").val("");

        if ($(this).val().length === 0) {
            current = null;
            return;
        };
        if (isNaN(value)) {
            showSimpleError("Enter a valid ID");
            current = null;
        }
        if (value < 1 || value > dataSet.length) {
            showSimpleError(`Enter an ID between 1 and ${dataSet.length}`);
            current = null;
        }

        const index = value - 1;
        $("#name").val(dataSet[index].Name);
        $("#phoneNumber").val(dataSet[index]["Phone-Number"]);
        $("#address").val(dataSet[index].Address);
        $("#pincode").val(dataSet[index].Pincode);
        $("#district").val(dataSet[index].District);
        current = index;
    });

    $("#SWC").on('click', (e) => {
        e.preventDefault();
        if (current == null) {
            Swal.fire({
                title: 'Can not start chat',
                text: 'Enter a valid ID to continue',
                icon: 'error',
            });
            return;
        }

        const phoneNumber = dataSet[current]["Phone-Number"].replace(/ /g, "").replace("+91", "");

        if (phoneNumber === '-') {
            Swal.fire({
                title: 'Can not start chat',
                text: 'Phone number not found, please try the next one',
                icon: 'error',
            });
            return;
        }

        window.open(`https://wa.me/${phoneNumber}`, '_blank').focus();
    });
})

const showSimpleError = (e) => {
    $('.simple-error').html(e);
    $('.simple-error').css('display', 'block');
} 