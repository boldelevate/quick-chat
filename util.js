const showSimpleError = (e) => {
    $('.simple-error').html(e);
    $('.simple-error').css('display', 'block');
}

const loadMenu = (dataSets) => {
    let html = "";
    $(".select-city").html("");
    for (const dataSet in dataSets) {
        const onClick = `loadDataSetInApp(\`${dataSet}\`, dataSets[\`${dataSet}\`])`;
        html += `
             <div class="col-lg-6">
                <div class="card" onclick="${onClick}">
                <!--  <span class="sm"> <i class="bi bi-geo-alt"></i> </span> -->
                <div class="card-body load-city">
                    <h1 class="cn"><i class="bi bi-geo-alt"></i> ${dataSet}</h1>
                    <h1 class="fl"><i class="bi bi-arrow-right"></i></h1>
                </div>
                </div>
            </div>
        `;
    }
    $(".select-city").html(html);
}

const loadNavBar = (dataSets) => {
    let html = "";
    $(".sidebar-nav").html("");
    for (const dataSet in dataSets) {
        const onClick = `loadDataSetInApp(\`${dataSet}\`, dataSets[\`${dataSet}\`])`;
        html += `
            <li class="nav-item" onclick="${onClick}">
                <a class="nav-link collapsed" disabled>
                    <i class="bi bi-geo-alt"></i>
                    <span>${dataSet}</span>
                </a>
            </li>
        `;
    }
    $(".sidebar-nav").html(html);
}

const loadDataSetInApp = (name, dataSet) => {

    current = null;

    $(".pagetitle h1").html(name);

    $(".breadcrumb").html(`
        <li class="breadcrumb-item">QuickChat</li>
        <li class="breadcrumb-item active">City</li>
        <li class="breadcrumb-item active">${name}</li>
    `);

    $("input").val('');
    $(".home").remove();

    /* remove events */
    $("#BID").off('keyup');
    $("#SWC").on('click');

    /* add events */
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
}
