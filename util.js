const MAX_CHARS_ADDRESS = 20;
const MAX_CHARS_NAME = 30;

const serverSideUrl = "https://quickchat-backend.vercel.app/";
const requestUrl = serverSideUrl + "request";

const dataSets = {
    A1: DATASET_A1,
    A2: DATASET_A2,
    A3: DATASET_A3,
    A4: DATASET_A4,
}

const dailyTarget = 10;

const getUserDetails = () => {
    return (localStorage.getItem("username") === null) ? null : {
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
    }
}

const setUserDetails = (username, password) => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
}

const postRequestTo = function (url, data, success) {
    var settings = {
        "url": `${requestUrl}/${url}`,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(data),
    };
    $.ajax(settings).done(success);
}

const showLoadingScreen = (msg = "Loading") => {
    Swal.fire({
        title: msg,
        html: `
        <div class="msSpin">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
        `,
        allowEscapeKey: false,
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
    });
}

const showSection = (c) => {
    $("section").css("display", "none");
    $(".breadcrumb").html('');
    $(".pagetitle h1").html('');
    $(`section.${c}`).css("display", "block");
}

const showSimpleError = (e) => {
    $('.simple-error').html(e);
    $('.simple-error').css('display', 'block');
}

const csvJSON = (text, quoteChar = '"', delimiter = ',') => {
    var rows = text.split("\n");
    var headers = rows[0].split(",");

    const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');

    const match = line => [...line.matchAll(regex)]
        .map(m => m[2])
        .slice(0, -1);

    var lines = text.split('\n');
    const heads = headers ?? match(lines.shift());
    lines = lines.slice(1);

    return lines.map(line => {
        return match(line).reduce((acc, cur, i) => {
            // replace blank matches with `null`
            const val = cur.length <= 0 ? null : Number(cur) || cur;
            const key = heads[i] ?? `{i}`;
            return { ...acc, [key]: val };
        }, {});
    });
}

const signIn = () => {
    const username = $("#yourUsername").val().trim();
    const password = $("#yourPassword").val().trim();

    if (username.length === 0 || password.length === 0) return;

    const data = {
        username: username,
        password: password,
    }

    postRequestTo("auth", data, (res) => {
        Swal.close();
        if (res.status === "success") {
            setUserDetails(username, password);
            localStorage.setItem("selectUser", username);
            initApp();
        } else {
            Swal.fire(
                'Wrong Credentials',
                `Wrong username or password, try again!`,
                'warning'
            )
        }
    });
}
const loadMenu = (dataSets) => {
    let html = "";
    $(".select-city").html("");
    for (const dataSet in dataSets) {
        const onClick = `loadDataSetInApp(\`${dataSet}\`, dataSets[\`${dataSet}\`])`;
        html += `
             <div class="col-lg-6">
                <div class="card" onclick="${onClick}">
                <!--  <span class="sm"> <i class="bi bi-globe-americas"></i> </span> -->
                <div class="card-body load-city">
                    <h1 class="cn"><i class="bi bi-globe-americas"></i> ${dataSet}</h1>
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
    html += `
            <li class="nav-item" onclick="window.location.assign(location)">
                <a class="nav-link collapsed" disabled>
                    <i class="bi bi-grid"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            <li class="nav-heading">Lead datasets</li>
            `;
    for (const dataSet in dataSets) {
        const onClick = `loadDataSetInApp(\`${dataSet}\`, dataSets[\`${dataSet}\`])`;
        html += `
            <li class="nav-item" onclick="${onClick}">
                <a class="nav-link collapsed" disabled>
                    <i class="bi bi-globe-americas"></i>
                    <span>Lead-DataSet-${dataSet}</span>
                </a>
            </li>
        `;
    }
    html += `
        <li class="nav-heading">Application</li>
        <li class="nav-item" onclick="localStorage.clear(); window.location.reload();">
            <a class="nav-link collapsed" disabled>
                <i class="bi bi-box-arrow-in-right"></i>
                <span>Sign out</span>
            </a>
        </li>
        `
    $(".sidebar-nav").html(html);
}

const loadDataSetInApp = (name, dataSet) => {
    showSection("dataset");
    window.scrollTo(0, 0);

    $(".pagetitle h1").html(name);

    $(".breadcrumb").html(`
        <li class="breadcrumb-item">QuickChat</li>
        <li class="breadcrumb-item active">Lead Datasets</li>
        <li class="breadcrumb-item active">${`PhoenixAI-Lead-DataSet-${name}`}</li>
    `);

    $("input").val('');
    $("#leads").html('');
    $(".home").remove();

    for (const entry of dataSet) {
        $("#leads").append(`
            <tr>
                <td scope="row">${entry.ID}</td>
                <td>${entry.Name.substring(0, MAX_CHARS_NAME)}</td>
                <td>${entry['Phone-Number']}</td>
                <td>${entry.Address.substring(0, MAX_CHARS_ADDRESS)}...</td>
                <td>${entry.Pincode}</td>
                <td>
                    ${(entry['Phone-Number'].trim() === "-") ?
                `<button type="button" class="btn btn-danger"> <i class="bi bi-whatsapp me-2"></i> Not available </button >` :
                `<button type="button" class="btn btn-success waap" onclick="window.open('https://wa.me/+91${entry['Phone-Number'].replace(/ /g, "").replace("+91", "")}', '_blank').focus(); addChat(\`${name.toLowerCase()}\`, \`${entry.ID}\`, \`${entry.Name.toLowerCase()}\`)"> <i class="bi bi-whatsapp me-2"></i> WhatsApp </button >`
            }
                </td >
                <td>
                    ${(entry['Phone-Number'].trim() === "-") ?
                `<button type="button" class="btn btn-danger"> <i class="bi bi-telephone me-2"></i> Not available </button >` :
                `<button type="button" class="btn btn-success waap" onclick="window.open('tel:+91${entry['Phone-Number'].replace(/ /g, "").replace("+91", "")}', '_blank').focus(); addCall(\`${name.toLowerCase()}\`, \`${entry.ID}\`, \`${entry.Name.toLowerCase()}\`)"> <i class="bi bi-telephone me-2"></i> Call </button >`
            }
                </td >
            </tr>
    `);
    }

    const reachable = dataSet.length - dataSet.filter(e => e['Phone-Number'].trim() === "-").length;

    $("#name").val((`PhoenixAI-Lead-DataSet-${name}`));
    $("#city").val(name);
    // $("#total").val(dataSet.length);
    $("#reachable").val(reachable);
}

const unixTimeStamp = (d) => parseInt((d.getTime() / 1000).toFixed(0))
const loadDashboard = (username = localStorage.getItem("selectUser")) => {

    $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vQzXmUtM791v3cI6qtSD7ZAVFprLEPviwgsUBrJNmgYysMwckx7EdCR-4AbRiaSgXFzG-t0HDJIi4A0/pub?output=csv", {}, function (data, status) {
        const conversions = csvJSON(data);
        const pieChartData = [];
        const peopleAndConversions = {};

        for (const conversion of conversions) {
            const name = conversion["On-Boarded By"];
            if (peopleAndConversions[name] == undefined) {
                peopleAndConversions[name] = 1;
            } else {
                peopleAndConversions[name] = peopleAndConversions[name] + 1;
            }
        }

        let totalCOnversions = 0;
        for (const entry in peopleAndConversions) {
            pieChartData.push({
                value: peopleAndConversions[entry],
                name: entry,
            });
            totalCOnversions += peopleAndConversions[entry];
        }

        const userConversions = conversions.filter(c => c["On-Boarded By"].replace(/ /g, "").toLowerCase() === username.toLowerCase());
        const conversionDates = userConversions.map(c => {
            for (const key in c) {
                if (key.toLowerCase().includes("date")) {
                    const d = moment(c[key], "MM/DD/YYYY").toDate();
                    d.setHours(20);
                    return d;
                }
            }
        })

        // console.log(username)

        postRequestTo("load-dashboard", { ...getUserDetails(), selectUser: username, }, (res) => {
            Swal.close();
            if (res.status === "success") {
                const data = res.data;
                const users = data.users.map(e => e.username);
                console.log(res)
                $("#username").html(username);

                // console.log(data)

                $("#totalConversions").html(totalCOnversions);
                echarts.init(document.querySelector("#trafficChart")).setOption({
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '1%',
                        left: 'center'
                    },
                    series: [{
                        name: 'Executive',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '16',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: pieChartData,
                    }]
                });

                $("#reportsChart").html("");
                if (data.admin) {
                    $("#seeOthers").css("visibility", "visible");
                    $("#seeOthers").click(() => {
                        Swal.fire({
                            title: "Track Performance for Executive",
                            // icon: "info",
                            html: `
                            <p>Select an executive</p>
                              ${users.map(u => {
                                return `
                                    <div class="d-grid gap-2 mt-3" onclick="localStorage.setItem(\`selectUser\`, \`${u}\`); window.location.assign(location)">
                                        <button class="btn btn-outline-primary btn-sm" type="button">${u}</button>
                                    </div> 
                                `
                            }).join(' ')}
                            `,
                            showCancelButton: true,
                            showConfirmButton: false,
                            cancelButtonText: `Cancel`,
                        });
                    });
                } else {
                    $("#seeOthers").remove();
                }

                const chats = [];
                const calls = [];
                const conversions = [];
                const dates = [];

                const startDate = unixTimeStamp(new Date(2025, 0)) + (24 * 60 * 60);
                const endDate = unixTimeStamp(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59)) + (24 * 60 * 60);

                for (let i = startDate; i <= endDate; i += 24 * 60 * 60) {
                    chats.push(data.chatsArray.filter(c => {
                        const ts = unixTimeStamp(new Date(c.timeStamp)) + (24 * 60 * 60);
                        return i <= ts && ts <= i + (24 * 60 * 60);
                    }).length);
                    calls.push(data.callsArray.filter(c => {
                        const ts = unixTimeStamp(new Date(c.timeStamp)) + (24 * 60 * 60);
                        return i <= ts && ts <= i + (24 * 60 * 60);
                    }).length);
                    conversions.push(conversionDates.filter(d => {
                        const ts = unixTimeStamp(d) + (24 * 60 * 60);
                        return i <= ts && ts <= i + (24 * 60 * 60);
                    }).length);
                    dates.push((new Date(i * 1000)).toDateString());
                }

                // console.log(chats, calls, conversions)
                new ApexCharts(document.querySelector("#reportsChart"), {
                    series: [{
                        name: 'Chats',
                        data: chats,
                    }, {
                        name: 'Calls',
                        data: calls,
                    }, {
                        name: 'Conversions',
                        data: conversions,
                    }],
                    chart: {
                        height: 350,
                        type: 'area',
                        toolbar: {
                            show: false
                        },
                    },
                    markers: {
                        size: 4
                    },
                    colors: ['#4154f1', '#ff771d', '#2eca6a'],
                    fill: {
                        type: "gradient",
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.3,
                            opacityTo: 0.4,
                            stops: [0, 90, 100]
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: dates,
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy'
                        },
                    }
                }).render();

                $(".timeFrame").css("visibility", "visible");
                if (data.admin) {
                    $("#chats").html(data.chats);
                    $("#calls").html(data.calls);
                    $("#conversionRate").html((totalCOnversions / data.reachOuts * 100).toFixed(2) + "%");
                } else {
                    const chatsToday = chats[chats.length - 1], callsToday = calls[calls.length - 1];
                    const reached = (chatsToday > callsToday) ? chatsToday : callsToday;
                    $(".timeFrame").html("Today")
                    $("#chats").html(chatsToday);
                    $("#calls").html(callsToday);
                    $(".card-heading-custom").html(`Todays Target Status`);
                    $("#conversionRate").html((reached < dailyTarget) ? `<span class="text-danger">${reached} / ${dailyTarget} (${reached / dailyTarget * 100}%)</span>` : `<span class="text-success">${reached} / ${dailyTarget} (${reached / dailyTarget * 100}%)</span>`);
                    $(".target-indicator").css((reached < dailyTarget) ? {
                        "color": "#dc3545",
                        "background-color": "#ffd7db"
                    } : {
                        "color": "rgb(46 202 106)",
                        "background-color": "rgb(224 248 233)"
                    })
                    if (reached < dailyTarget) $(".target-indicator").html(`<i class="bi bi-exclamation-triangle"></i>`);

                    const contentTargetStatus = $("#contentTargetStatus").html();
                    const contentConversionsStatus = $("#contentConversionsStatus").html();

                    $("#contentTargetStatus").html(contentConversionsStatus);
                    $("#contentConversionsStatus").html(contentTargetStatus);
                }

                $(".hide-icon").removeClass("hide-icon");

                let totalLeads = 0, reachableLeads = 0, approachedLeads = 0, leadsLeftToApproach = 0;
                $("#leadDataSetsOverview").html("");
                for (const [index, [key, value]] of Object.entries(Object.entries(dataSets))) {

                    const chatsCount = data.chatsArray.filter(e => e.city.toLowerCase() === key.toLowerCase()).length,
                        callsCount = data.callsArray.filter(e => e.city.toLowerCase() === key.toLowerCase()).length;
                    const max = ((chatsCount > callsCount) ? chatsCount : callsCount);
                    const approached = (key.toLocaleLowerCase() === 'jaipur') ? max + 290 : max;

                    const reachable = value.length - value.filter(e => e['Phone-Number'].trim() === "-").length;
                    const leftToApproach = reachable - approached;
                    leadsLeftToApproach += leftToApproach;
                    approachedLeads += approached;
                    reachableLeads += reachable;
                    totalLeads += value.length;


                    $("#leadDataSetsOverview").append(`
                        <tr>
                            <td scope="col">${parseInt(index) + 1}</td>
                            <td scope="col">${`PhoenixAI-Lead-DataSet-${key}`}</td>
                            <td scope="col">${key}</td>
                            <td scope="col">${value.length}</td>
                            <td scope="col"><button type="button" class="btn btn-primary"> ${approached} </button></td>
                            <td scope="col"><button type="button" class="btn btn-success"> ${leftToApproach} </button></td>
                        </td >
                    `);
                    console.log()
                }
                $("#leadDataSetsOverview").append(`
                    <tr>
                        <td scope="col">Total</td>
                        <td scope="col"></td>
                        <td scope="col"></td>
                        <td scope="col">${totalLeads}</td>
                        <td scope="col"> <button type="button" class="btn btn-primary"> ${approachedLeads} </button> </td>
                            <td scope="col"><button type="button" class="btn btn-success"> ${leadsLeftToApproach} </button></td>
                    </td >
                `);

            } else {
                Swal.fire(
                    'Something went wrong!',
                    `Trouble loading dashboard`,
                    'warning'
                )
            }
        });

    });

}

const addChat = (city, id, name) => {
    postRequestTo("add-chat", {
        ...getUserDetails(),
        city: city,
        businessID: id,
        businessName: name,
    }, (res) => {
        if (res.status === "success") {
            console.log("Chat record added");
        } else {
            console.log("Could not add chat record");
        }
    });
}

const addCall = (city, id, name) => {
    postRequestTo("add-call", {
        ...getUserDetails(),
        city: city,
        businessID: id,
        businessName: name,
    }, (res) => {
        if (res.status === "success") {
            console.log("Call record added");
        } else {
            console.log("Could not add call record");
        }
    });
}

const showDashboard = () => {
    showSection("dashboard");

    $(".pagetitle h1").html("Dashboard");
    $(".breadcrumb").html(`
        <li class="breadcrumb-item"> QuickChat </li>
        <li class="breadcrumb-item active">Dashboard</li>
    `);
}

const showLogin = () => {
    showSection("login");
}

const initApp = () => {
    $(".username-logged-in").html(getUserDetails().username)
    loadNavBar(dataSets);
    showDashboard();
    loadDashboard();
}