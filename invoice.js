let itemCounter = 0;

function addInvoiceItem() {
    itemCounter++;

    const newItemRow = `
        <tr id="itemRow${itemCounter}">
            <td><input type="text" class="form-control" placeholder="Enter Description" required></td>
            <td><input type="number" class="form-control quantity" placeholder="Enter Quantity" required></td>
            <td>
                <select class="form-control unit">
                    <option value="grams">Grams</option>
                    <option value="kilograms">Kilograms</option>
                    <option value="milliliters">Milliliters</option>
                    <option value="liters">Liters</option>
                    <option value="packs">Packs</option>
                    <option value="pieces">Pieces</option>
                </select>
            </td>
            <td><input type="number" class="form-control unitPrice" placeholder="Enter Unit Price" required></td>
            <td><input type="text" class="form-control totalItemPrice" disabled readonly></td>
            <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remove</button></td>
        </tr>
    `;

    $("#invoiceItems").append(newItemRow);
    updateTotalAmount();
}

function removeInvoiceItem(rowId) {
    $(`#itemRow${rowId}`).remove();
    updateTotalAmount();
}

function updateTotalAmount() {
    let totalAmount = 0;

    $("tr[id^='itemRow']").each(function () {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const unitPrice = parseFloat($(this).find(".unitPrice").val()) || 0;
        const totalItemPrice = quantity * unitPrice;

        $(this).find(".totalItemPrice").val(totalItemPrice.toFixed(2));
        totalAmount += totalItemPrice;
    });

    $("#totalAmount").val(totalAmount.toFixed(2));
}

$(document).ready(function () {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    $("#invoiceDate").val(formattedDate);
});

$("#invoiceForm").submit(function (event) {
    event.preventDefault();
    updateTotalAmount();
});

function printInvoice() {
    const customerName = $("#customerName").val();
    const invoiceDate = $("#invoiceDate").val();

    const items = [];

    $("tr[id^='itemRow']").each(function () {
        const description = $(this).find("td:eq(0) input").val();
        const quantity = $(this).find("td:eq(1) input").val();
        const unit = $(this).find(".unit").val();
        const unitPrice = $(this).find("td:eq(3) input").val();
        const totalItemPrice = $(this).find("td:eq(4) input").val();

        items.push({
            description: description,
            quantity: quantity,
            unit: unit,
            unitPrice: unitPrice,
            totalItemPrice: totalItemPrice,
        });
    });

    const totalAmount = $("#totalAmount").val();
    const invoiceContent = `
        <html>
            <head>
                <title>Invoice Slip</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h2 {
                        color: #007bff;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    .total {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h2>Invoice Slip</h2>
                <p><strong>Customer Name:</strong> ${customerName}</p>
                <p><strong>Date and Time:</strong> ${invoiceDate}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unit}</td>
                                <td>${item.unitPrice}</td>
                                <td>${item.totalItemPrice}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p class="total">Total Amount: ${totalAmount}</p>
            </body>
        </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
}
