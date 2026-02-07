import Invoice from "../models/invoice.model.js";
import Counter from "../models/counter.model.js";
import Order from "../models/order.model.js";
import Store from "../models/store.model.js";

async function nextInvoiceNumber() {
    const counter = await Counter.findOneAndUpdate(
        { name: "invoice" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
    );
    return `INV-${counter.seq}`;
}

function buildTaxLines(items, isInterstate) {
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;

    const mapped = items.map((item) => {
        const gstRate = Number(item.gstRate || 0);
        const taxableValue = Number(item.totalPrice || 0);
        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        if (gstRate > 0) {
            if (isInterstate) {
                igst = (taxableValue * gstRate) / 100;
            } else {
                cgst = (taxableValue * gstRate) / 200;
                sgst = (taxableValue * gstRate) / 200;
            }
        }

        cgstTotal += cgst;
        sgstTotal += sgst;
        igstTotal += igst;

        return {
            ...item,
            taxableValue,
            cgst,
            sgst,
            igst,
            total: taxableValue + cgst + sgst + igst,
        };
    });

    return { mapped, cgstTotal, sgstTotal, igstTotal };
}

export async function createInvoiceFromOrder(req, res) {
    try {
        const { orderId } = req.body;
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const order = await Order.findOne({ _id: orderId, storeId });
        if (!order) return res.status(404).json({ message: "Order not found" });

        const existing = await Invoice.findOne({ orderId: order._id });
        if (existing) return res.json({ success: true, data: existing });

        const store = await Store.findById(order.storeId);
        const storeState = store?.state || "";
        const customerState = order.customer?.state || "";
        const isInterstate =
            storeState && customerState
                ? storeState.toLowerCase() !== customerState.toLowerCase()
                : false;

        const invoiceNumber = await nextInvoiceNumber();
        const { mapped, cgstTotal, sgstTotal, igstTotal } = buildTaxLines(
            order.items,
            isInterstate,
        );

        const subtotal = order.subtotal;
        const taxableTotal = mapped.reduce(
            (sum, i) => sum + i.taxableValue,
            0,
        );
        const grandTotal =
            taxableTotal + cgstTotal + sgstTotal + igstTotal - order.discount;

        const invoice = await Invoice.create({
            invoiceNumber,
            orderId: order._id,
            storeId: order.storeId,
            customer: order.customer,
            items: mapped,
            subtotal,
            discountTotal: order.discount || 0,
            taxableTotal,
            cgstTotal,
            sgstTotal,
            igstTotal,
            grandTotal,
        });

        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ message: "Failed to create invoice" });
    }
}

export async function getInvoices(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const invoices = await Invoice.find({ storeId }).sort({ createdAt: -1 });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch invoices" });
    }
}

export async function getInvoiceById(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const invoice = await Invoice.findOne({ _id: req.params.id, storeId });
        if (!invoice) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch invoice" });
    }
}
