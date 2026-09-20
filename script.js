/* =========================================
   IT HELPDESK TICKET TRACKER
   ========================================= */


/* =========================================
   DATA
   ========================================= */

let tickets =
    JSON.parse(
        localStorage.getItem("helpdeskTickets")
    ) || [];


/* =========================================
   LOGIN
   ========================================= */

document
    .getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;


        if (
            username === "admin" &&
            password === "admin123"
        ) {

            document
                .getElementById("loginPage")
                .classList.add("d-none");

            document
                .getElementById("appPage")
                .classList.remove("d-none");

            document
                .getElementById("loggedUser")
                .textContent = username;

            updateDashboard();

            displayTickets();

        }

        else {

            document
                .getElementById("loginError")
                .classList.remove("d-none");

        }

    });


/* =========================================
   LOGOUT
   ========================================= */

function logout() {

    document
        .getElementById("appPage")
        .classList.add("d-none");

    document
        .getElementById("loginPage")
        .classList.remove("d-none");

}


/* =========================================
   SECTION NAVIGATION
   ========================================= */

function showSection(section) {

    const sections = [

        "dashboardSection",
        "createTicketSection",
        "ticketsSection",
        "knowledgeSection"

    ];


    sections.forEach(function(id) {

        document
            .getElementById(id)
            .classList.add("d-none");

    });


    document
        .getElementById(section + "Section")
        .classList.remove("d-none");


    /* Remove active buttons */

    document
        .querySelectorAll(".sidebar-btn")
        .forEach(function(button) {

            button.classList.remove("active");

        });


    /* Activate correct button */

    if (section === "dashboard") {

        document
            .getElementById("dashboardBtn")
            .classList.add("active");

        updateDashboard();

    }


    if (section === "createTicket") {

        document
            .getElementById("createBtn")
            .classList.add("active");

    }


    if (section === "tickets") {

        document
            .getElementById("ticketsBtn")
            .classList.add("active");

        displayTickets();

    }


    if (section === "knowledge") {

        document
            .getElementById("knowledgeBtn")
            .classList.add("active");

    }

}


/* =========================================
   CREATE TICKET
   ========================================= */

document
    .getElementById("ticketForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const ticket = {

            id: generateTicketID(),

            title:
                document
                    .getElementById("issueTitle")
                    .value,

            category:
                document
                    .getElementById("category")
                    .value,

            priority:
                document
                    .getElementById("priority")
                    .value,

            date:
                document
                    .getElementById("ticketDate")
                    .value,

            description:
                document
                    .getElementById("description")
                    .value,

            status: "Open"

        };


        tickets.push(ticket);


        localStorage.setItem(
            "helpdeskTickets",
            JSON.stringify(tickets)
        );


        alert(
            "Ticket created successfully!\n\nTicket ID: "
            + ticket.id
        );


        document
            .getElementById("ticketForm")
            .reset();


        updateDashboard();

        displayTickets();

        showSection("tickets");

    });


/* =========================================
   GENERATE TICKET ID
   ========================================= */

function generateTicketID() {

    return "TKT-" +
        String(
            tickets.length + 1001
        );

}


/* =========================================
   DASHBOARD
   ========================================= */

function updateDashboard() {

    const total =
        tickets.length;


    const open =
        tickets.filter(
            ticket =>
                ticket.status === "Open"
        ).length;


    const progress =
        tickets.filter(
            ticket =>
                ticket.status === "In Progress"
        ).length;


    const resolved =
        tickets.filter(
            ticket =>
                ticket.status === "Resolved"
        ).length;


    document
        .getElementById("totalTickets")
        .textContent = total;


    document
        .getElementById("openTickets")
        .textContent = open;


    document
        .getElementById("progressTickets")
        .textContent = progress;


    document
        .getElementById("resolvedTickets")
        .textContent = resolved;


    displayRecentTickets();

}


/* =========================================
   RECENT TICKETS
   ========================================= */

function displayRecentTickets() {

    const table =
        document.getElementById(
            "recentTickets"
        );


    table.innerHTML = "";


    const recentTickets =
        tickets.slice(-5).reverse();


    recentTickets.forEach(function(ticket) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${ticket.id}</strong>
            </td>

            <td>
                ${ticket.title}
            </td>

            <td>
                ${ticket.category}
            </td>

            <td>
                ${ticket.priority}
            </td>

            <td>

                <span
                    class="status-badge
                    ${getStatusClass(ticket.status)}"
                >

                    ${ticket.status}

                </span>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   DISPLAY ALL TICKETS
   ========================================= */

function displayTickets() {

    const table =
        document.getElementById(
            "ticketTable"
        );


    if (!table) return;


    table.innerHTML = "";


    const search =
        document
            .getElementById("searchTicket")
            .value
            .toLowerCase();


    const statusFilter =
        document
            .getElementById("statusFilter")
            .value;


    const priorityFilter =
        document
            .getElementById("priorityFilter")
            .value;


    const filteredTickets =
        tickets.filter(function(ticket) {


            const matchesSearch =

                ticket.id
                    .toLowerCase()
                    .includes(search)

                ||

                ticket.title
                    .toLowerCase()
                    .includes(search)

                ||

                ticket.category
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                statusFilter === ""

                ||

                ticket.status ===
                    statusFilter;


            const matchesPriority =

                priorityFilter === ""

                ||

                ticket.priority ===
                    priorityFilter;


            return (

                matchesSearch &&
                matchesStatus &&
                matchesPriority

            );

        });


    filteredTickets.forEach(function(ticket) {


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${ticket.id}</strong>
            </td>

            <td>
                ${ticket.title}
            </td>

            <td>
                ${ticket.category}
            </td>

            <td>
                ${ticket.priority}
            </td>

            <td>
                ${ticket.date}
            </td>

            <td>

                <select
                    class="form-select form-select-sm"
                    onchange="
                        updateStatus(
                            '${ticket.id}',
                            this.value
                        )
                    "
                >

                    <option
                        ${ticket.status === "Open"
                            ? "selected"
                            : ""}
                    >
                        Open
                    </option>

                    <option
                        ${ticket.status === "In Progress"
                            ? "selected"
                            : ""}
                    >
                        In Progress
                    </option>

                    <option
                        ${ticket.status === "Resolved"
                            ? "selected"
                            : ""}
                    >
                        Resolved
                    </option>

                    <option
                        ${ticket.status === "Closed"
                            ? "selected"
                            : ""}
                    >
                        Closed
                    </option>

                </select>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-outline-primary"
                    onclick="
                        viewTicket('${ticket.id}')
                    "
                >

                    <i class="bi bi-eye"></i>

                </button>


                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="
                        deleteTicket('${ticket.id}')
                    "
                >

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   UPDATE STATUS
   ========================================= */

function updateStatus(id, newStatus) {

    const ticket =
        tickets.find(
            ticket =>
                ticket.id === id
        );


    if (ticket) {

        ticket.status =
            newStatus;


        localStorage.setItem(
            "helpdeskTickets",
            JSON.stringify(tickets)
        );


        updateDashboard();

    }

}


/* =========================================
   DELETE TICKET
   ========================================= */

function deleteTicket(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this ticket?"
        );


    if (!confirmDelete) return;


    tickets =
        tickets.filter(
            ticket =>
                ticket.id !== id
        );


    localStorage.setItem(
        "helpdeskTickets",
        JSON.stringify(tickets)
    );


    displayTickets();

    updateDashboard();

}


/* =========================================
   VIEW TICKET
   ========================================= */

function viewTicket(id) {

    const ticket =
        tickets.find(
            ticket =>
                ticket.id === id
        );


    if (!ticket) return;


    alert(

        "TICKET DETAILS\n\n" +

        "Ticket ID: " +
        ticket.id +

        "\n\nIssue: " +
        ticket.title +

        "\n\nCategory: " +
        ticket.category +

        "\n\nPriority: " +
        ticket.priority +

        "\n\nDate: " +
        ticket.date +

        "\n\nStatus: " +
        ticket.status +

        "\n\nDescription:\n" +
        ticket.description

    );

}


/* =========================================
   STATUS COLOR
   ========================================= */

function getStatusClass(status) {

    if (status === "Open")
        return "status-open";


    if (status === "In Progress")
        return "status-progress";


    if (status === "Resolved")
        return "status-resolved";


    return "status-closed";

}


/* =========================================
   KNOWLEDGE BASE
   ========================================= */

function showGuide(type) {

    let title = "";

    let content = "";


    if (type === "network") {

        title = "Network Troubleshooting";

        content = `

            <ol>

                <li>Check the network cable.</li>

                <li>Check Wi-Fi connection.</li>

                <li>Restart the network adapter.</li>

                <li>Restart the router if required.</li>

                <li>Check IP configuration.</li>

            </ol>

        `;

    }


    if (type === "email") {

        title = "Email Troubleshooting";

        content = `

            <ol>

                <li>Check internet connection.</li>

                <li>Verify username and password.</li>

                <li>Restart Outlook.</li>

                <li>Check mailbox storage.</li>

                <li>Reconfigure the account if required.</li>

            </ol>

        `;

    }


    if (type === "printer") {

        title = "Printer Troubleshooting";

        content = `

            <ol>

                <li>Check printer power.</li>

                <li>Check USB/network connection.</li>

                <li>Check printer queue.</li>

                <li>Remove paper jams.</li>

                <li>Restart printer spooler.</li>

            </ol>

        `;

    }


    if (type === "software") {

        title = "Software Troubleshooting";

        content = `

            <ol>

                <li>Restart the application.</li>

                <li>Restart the computer.</li>

                <li>Check application updates.</li>

                <li>Check system resources.</li>

                <li>Reinstall the application if required.</li>

            </ol>

        `;

    }


    if (type === "account") {

        title = "Account Troubleshooting";

        content = `

            <ol>

                <li>Verify username.</li>

                <li>Check account status.</li>

                <li>Reset password if required.</li>

                <li>Check access permissions.</li>

                <li>Contact the administrator.</li>

            </ol>

        `;

    }


    document
        .getElementById("guideTitle")
        .textContent = title;


    document
        .getElementById("guideContent")
        .innerHTML = content;


    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "guideModal"
            )
        );


    modal.show();

}
