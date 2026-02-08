export function buildInvoiceHtml({
    invoice,
    store,
    logoUrl,
    orderNumber,
}) {
    const storeName = store?.name || "Store";
    const storeAddress = [
        store?.addressLine1,
        store?.addressLine2,
        store?.city,
        store?.state,
        store?.pincode,
        store?.country,
    ]
        .filter(Boolean)
        .join(", ");

    const timeZone = store?.timezone || "Asia/Kolkata";
    const dateStr = new Intl.DateTimeFormat("en-IN", {
        timeZone,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(invoice.createdAt));

    return `
        <html>
        <head>
            <title>Invoice ${invoice.invoiceNumber || ""}</title>
            <style>
                * { font-family: Arial, sans-serif; }
                body { padding: 24px; color: #111827; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 16px; }
                .logo { height: 56px; }
                .title { font-size: 20px; font-weight: 700; }
                .meta { font-size: 12px; color: #6b7280; }
                .section { margin-bottom: 16px; }
                .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
                table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 12px; }
                th { background: #f3f4f6; text-align: left; }
                .right { text-align: right; }
                .totals { width: 280px; margin-left: auto; }
                .totals td { border: none; padding: 4px 0; }
                .totals .label { color: #6b7280; }
                .totals .value { text-align: right; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <img src="${logoUrl}" class="logo" />
                </div>
                <div>
                    <div class="title">Invoice ${invoice.invoiceNumber || ""}</div>
                    <div class="meta">Order: ${orderNumber || invoice.orderId || "-"}</div>
                    <div class="meta">Date: ${dateStr}</div>
                </div>
            </div>

            <div class="section grid">
                <div>
                    <div class="meta">Store</div>
                    <div><strong>${storeName}</strong></div>
                    <div class="meta">${storeAddress || "-"}</div>
                    <div class="meta">GSTIN: ${store?.gstin || "-"}</div>
                    <div class="meta">Phone: ${store?.phone || "-"}</div>
                </div>
                <div>
                    <div class="meta">Customer</div>
                    <div><strong>${invoice.customer?.name || "-"}</strong></div>
                    <div class="meta">Phone: ${invoice.customer?.phone || "-"}</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="right">Qty</th>
                        <th class="right">Price</th>
                        <th class="right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${(invoice.items || [])
                        .map(
                            (it) =>
                                `<tr>
                                    <td>${it.name}</td>
                                    <td class="right">${it.qty}</td>
                                    <td class="right">₹${it.unitPrice}</td>
                                    <td class="right">₹${it.total}</td>
                                </tr>`,
                        )
                        .join("")}
                </tbody>
            </table>

            <table class="totals">
                <tr><td class="label">Subtotal</td><td class="value">₹${invoice.subtotal || 0}</td></tr>
                <tr><td class="label">Discount</td><td class="value">₹${invoice.discountTotal || 0}</td></tr>
                <tr><td class="label">CGST</td><td class="value">₹${invoice.cgstTotal || 0}</td></tr>
                <tr><td class="label">SGST</td><td class="value">₹${invoice.sgstTotal || 0}</td></tr>
                <tr><td class="label">IGST</td><td class="value">₹${invoice.igstTotal || 0}</td></tr>
                <tr><td class="label"><strong>Grand Total</strong></td><td class="value"><strong>₹${invoice.grandTotal}</strong></td></tr>
            </table>
        </body>
        </html>
    `;
}

export function openInvoiceWindow({ invoice, store, orderNumber }) {
    const win = window.open("", "_blank");
    if (!win) return;
    const logoUrl = `${window.location.origin}/logo.png`;
    win.document.write(
        buildInvoiceHtml({ invoice, store, logoUrl, orderNumber }),
    );
    win.document.close();
    win.print();
}
