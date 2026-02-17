import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiDownload, FiPlusCircle } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { GoChevronDown } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
    fetchProducts,
    deleteProduct,
    setCategoryFilter,
    setTypeFilter,
} from "../store/productsSlice";
import Input from "../components/UI/Input";
import { API_URL } from "../utils/api";
import { useAlert } from "../components/UI/AlertProvider";

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        products,
        loading,
        error,
        categoryFilter,
        typeFilter,
    } = useSelector((state) => state.products);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [permission, setPermission] = useState(null);
    const [bulkStatus, setBulkStatus] = useState("");
    const { notify } = useAlert();
    const [bulkEditOpen, setBulkEditOpen] = useState(false);
    const [bulkEditRows, setBulkEditRows] = useState([]);
    const [bulkEditOriginal, setBulkEditOriginal] = useState([]);
    const [importing, setImporting] = useState(false);
    const importFileRef = useRef(null);

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user?.id) return;
        if (user?.role === "admin") return setPermission({ admin: true });
        axios
            .get(`${API_URL}/user/permission/${user.id}`)
            .then((res) => setPermission(res.data || {}))
            .catch(() => setPermission({}));
    }, []);

    /* ---------------- FILTER OPTIONS ---------------- */
    const categories = useMemo(
        () => [...new Set(products.map((p) => p.category))],
        [products]
    );

    const types = useMemo(
        () => [...new Set(products.map((p) => p.type))],
        [products]
    );

    /* ---------------- FILTER + SEARCH ---------------- */
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                !categoryFilter || product.category === categoryFilter;

            const matchesType =
                !typeFilter || product.type === typeFilter;

            return matchesSearch && matchesCategory && matchesType;
        });
    }, [products, searchTerm, categoryFilter, typeFilter]);

    /* ---------------- SORT (NEWEST FIRST) ---------------- */
    const sortedProducts = useMemo(
        () => [...filteredProducts].reverse(),
        [filteredProducts]
    );

    /* ---------------- PAGINATION ---------------- */
    const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    /* ---------------- HANDLERS ---------------- */
    const handleDelete = (slug) => {
        if (window.confirm("Delete this product?")) {
            dispatch(deleteProduct(slug));
        }
    };

    const handleSelectAll = (e) => {
        setSelectedProducts(
            e.target.checked ? currentProducts.map((p) => p._id) : []
        );
    };

    const handleSelectProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleRefresh = () => {
        dispatch(fetchProducts());
    };

    const csvFieldAliases = {
        slug: ["slug", "product slug"],
        name: ["name", "product", "product name", "title"],
        sku: ["sku"],
        description: ["description", "desc"],
        type: ["type"],
        category: ["category"],
        price: ["price", "mrp", "selling price"],
        taxRate: ["taxrate", "tax rate", "tax %"],
        gstRate: ["gstrate", "gst rate", "gst %"],
        hsn: ["hsn", "hsn code"],
        trackStock: ["trackstock", "track stock"],
        stockQty: ["stockqty", "stock qty", "quantity", "qty"],
        unit: ["unit", "uom"],
        isActive: ["isactive", "active", "status"],
    };

    const normalizeHeader = (value) =>
        String(value || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    const parseCsvLine = (line) => {
        const values = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i += 1) {
            const char = line[i];
            if (char === "\"") {
                if (inQuotes && line[i + 1] === "\"") {
                    current += "\"";
                    i += 1;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === "," && !inQuotes) {
                values.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values;
    };

    const toBoolean = (value, fallback = true) => {
        if (value === undefined || value === null || String(value).trim() === "") {
            return fallback;
        }
        const normalized = String(value).trim().toLowerCase();
        if (["true", "1", "yes", "active", "publish"].includes(normalized)) {
            return true;
        }
        if (["false", "0", "no", "inactive", "draft"].includes(normalized)) {
            return false;
        }
        return fallback;
    };

    const slugify = (value) =>
        String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const normalizeType = (value) => {
        const raw = String(value || "").trim().toLowerCase();
        const allowed = ["food", "beverage", "retail", "service", "other"];
        if (!raw) return "retail";
        return allowed.includes(raw) ? raw : "retail";
    };

    const normalizeNumber = (value, fallback = "") => {
        const raw = String(value ?? "").trim();
        if (!raw) return fallback;
        const sanitized = raw.replace(/[^0-9.-]/g, "");
        const numeric = Number(sanitized);
        return Number.isFinite(numeric) ? String(numeric) : fallback;
    };

    const resolveField = (headers, rowValues, fieldName) => {
        const aliases = csvFieldAliases[fieldName] || [fieldName];
        for (const alias of aliases) {
            const index = headers.findIndex((h) => h === alias);
            if (index >= 0) return rowValues[index];
        }
        return "";
    };

    const escapeCsvCell = (value) => {
        const text = String(value ?? "");
        if (/[",\n]/.test(text)) {
            return `"${text.replace(/"/g, "\"\"")}"`;
        }
        return text;
    };

    const handleImportButtonClick = () => {
        if (!canCreate) {
            notify({
                type: "warning",
                title: "Permission denied",
                message: "You don’t have access to import products.",
            });
            return;
        }
        importFileRef.current?.click();
    };

    const handleImportProducts = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setImporting(true);
            const text = await file.text();
            const lines = text
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean);

            if (lines.length < 2) {
                notify({
                    type: "warning",
                    title: "Invalid file",
                    message: "Upload a CSV file with header and at least one row.",
                });
                return;
            }

            const rawHeaders = parseCsvLine(lines[0]).map(normalizeHeader);
            const dataLines = lines.slice(1);

            let createdCount = 0;
            let updatedCount = 0;
            let skippedCount = 0;
            const failedRows = [];

            for (let i = 0; i < dataLines.length; i += 1) {
                const rowNumber = i + 2;
                const rowValues = parseCsvLine(dataLines[i]);

                const name = resolveField(rawHeaders, rowValues, "name");
                const price = normalizeNumber(
                    resolveField(rawHeaders, rowValues, "price"),
                    "",
                );
                const category = String(
                    resolveField(rawHeaders, rowValues, "category"),
                ).trim() || "General";
                const type = normalizeType(
                    resolveField(rawHeaders, rowValues, "type"),
                );

                if (!String(name || "").trim() || !String(price || "").trim()) {
                    skippedCount += 1;
                    continue;
                }

                const rowSlug =
                    resolveField(rawHeaders, rowValues, "slug") || slugify(name);
                if (!rowSlug) {
                    skippedCount += 1;
                    continue;
                }

                const formData = new FormData();
                formData.append("slug", rowSlug);
                formData.append("name", name);
                formData.append("sku", resolveField(rawHeaders, rowValues, "sku"));
                formData.append(
                    "description",
                    resolveField(rawHeaders, rowValues, "description"),
                );
                formData.append("type", type);
                formData.append("category", category);
                formData.append("price", price);
                formData.append(
                    "taxRate",
                    normalizeNumber(
                        resolveField(rawHeaders, rowValues, "taxRate"),
                        "0",
                    ),
                );
                formData.append(
                    "gstRate",
                    normalizeNumber(
                        resolveField(rawHeaders, rowValues, "gstRate"),
                        normalizeNumber(
                            resolveField(rawHeaders, rowValues, "taxRate"),
                            "0",
                        ),
                    ),
                );
                formData.append("hsn", resolveField(rawHeaders, rowValues, "hsn"));
                formData.append(
                    "trackStock",
                    toBoolean(resolveField(rawHeaders, rowValues, "trackStock"), true),
                );
                formData.append(
                    "stockQty",
                    normalizeNumber(
                        resolveField(rawHeaders, rowValues, "stockQty"),
                        "0",
                    ),
                );
                formData.append("unit", resolveField(rawHeaders, rowValues, "unit"));
                formData.append(
                    "isActive",
                    toBoolean(resolveField(rawHeaders, rowValues, "isActive"), true),
                );

                try {
                    let exists = false;
                    try {
                        const checkRes = await axios.get(`${API_URL}/product/${rowSlug}`);
                        exists = Boolean(checkRes?.data?.data?._id || checkRes?.data?.data?.slug);
                    } catch (checkError) {
                        if (checkError?.response?.status !== 404) {
                            throw checkError;
                        }
                    }

                    if (exists) {
                        await axios.patch(`${API_URL}/product/${rowSlug}`, formData);
                        updatedCount += 1;
                    } else {
                        await axios.post(`${API_URL}/product`, formData);
                        createdCount += 1;
                    }
                } catch (rowError) {
                    failedRows.push({
                        rowNumber,
                        message: rowError?.response?.data?.message || "Upsert failed",
                    });
                }
            }

            const summaryBits = [
                `${createdCount} created`,
                `${updatedCount} updated`,
                skippedCount ? `${skippedCount} skipped` : "",
                failedRows.length ? `${failedRows.length} failed` : "",
            ].filter(Boolean);

            notify({
                type: failedRows.length ? "warning" : "success",
                title: "Import completed",
                message: `${summaryBits.join(", ")}${failedRows[0]?.message ? `, first error: ${failedRows[0].message}` : ""}`,
            });

            if (failedRows.length) {
                console.error("Import row failures:", failedRows.slice(0, 10));
            }

            dispatch(fetchProducts());
        } catch {
            notify({
                type: "error",
                title: "Import failed",
                message: "Unable to parse file. Please upload a valid CSV file.",
            });
        } finally {
            setImporting(false);
            if (event.target) event.target.value = "";
        }
    };

    const handleExportProducts = () => {
        const rows = filteredProducts.map((product) => ({
            slug: product.slug || "",
            name: product.name || "",
            sku: product.sku || "",
            description: product.description || "",
            type: product.type || "",
            category: product.category || "",
            price: product.price ?? "",
            taxRate: product.taxRate ?? "",
            gstRate: product.gstRate ?? "",
            hsn: product.hsn || "",
            trackStock: product.trackStock ?? "",
            stockQty: product.stockQty ?? "",
            unit: product.unit || "",
            isActive: product.isActive ?? "",
        }));

        if (!rows.length) {
            notify({
                type: "info",
                title: "No products",
                message: "There are no products to export for current filters.",
            });
            return;
        }

        const headers = Object.keys(rows[0]);
        const csvBody = [
            headers.join(","),
            ...rows.map((row) =>
                headers.map((header) => escapeCsvCell(row[header])).join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvBody], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const date = new Date().toISOString().slice(0, 10);
        link.href = url;
        link.download = `products-export-${date}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const canDelete = permission?.admin || permission?.deleteProduct;
    const canUpdate = permission?.admin || permission?.updateProduct;
    const canCreate = permission?.admin || permission?.createProduct;

    const handleBulkDelete = async () => {
        if (!selectedProducts.length) return;
        if (!canDelete) {
            notify({
                type: "warning",
                title: "Permission denied",
                message: "You don’t have access to delete products.",
            });
            return;
        }
        if (!window.confirm(`Delete ${selectedProducts.length} products?`)) return;
        const toDelete = products.filter((p) => selectedProducts.includes(p._id));
        await Promise.all(toDelete.map((p) => dispatch(deleteProduct(p.slug))));
        setSelectedProducts([]);
    };

    const handleBulkStatus = async () => {
        if (!selectedProducts.length) return;
        if (!canUpdate) {
            notify({
                type: "warning",
                title: "Permission denied",
                message: "You don’t have access to update products.",
            });
            return;
        }
        if (bulkStatus === "") {
            notify({
                type: "warning",
                title: "Select status",
                message: "Choose a status first.",
            });
            return;
        }
        const toUpdate = products.filter((p) => selectedProducts.includes(p._id));
        await Promise.all(
            toUpdate.map((p) => {
                const formData = new FormData();
                formData.append("isActive", bulkStatus);
                return axios.patch(
                    `${API_URL}/product/${p.slug}`,
                    formData,
                );
            }),
        );
        setBulkStatus("");
        setSelectedProducts([]);
        dispatch(fetchProducts());
    };

    const openBulkEdit = () => {
        if (!selectedProducts.length) return;
        const rows = products
            .filter((p) => selectedProducts.includes(p._id))
            .map((p) => ({
                _id: p._id,
                slug: p.slug,
                name: p.name,
                category: p.category,
                price: p.price ?? "",
                taxRate: p.taxRate ?? "",
                gstRate: p.gstRate ?? "",
                stockQty: p.stockQty ?? "",
                unit: p.unit ?? "",
                isActive: p.isActive ?? true,
            }));
        setBulkEditRows(rows);
        setBulkEditOriginal(rows);
        setBulkEditOpen(true);
    };

    const updateBulkRow = (id, key, value) => {
        setBulkEditRows((prev) =>
            prev.map((row) => (row._id === id ? { ...row, [key]: value } : row)),
        );
    };

    const saveBulkEdit = async () => {
        if (!canUpdate) {
            notify({
                type: "warning",
                title: "Permission denied",
                message: "You don’t have access to update products.",
            });
            return;
        }
        if (!bulkEditRows.length) return;
        await Promise.all(
            bulkEditRows.map((row) => {
                const formData = new FormData();
                formData.append("name", row.name);
                formData.append("category", row.category);
                formData.append("price", row.price);
                formData.append("taxRate", row.taxRate);
                formData.append("gstRate", row.gstRate);
                formData.append("stockQty", row.stockQty);
                formData.append("unit", row.unit);
                formData.append("isActive", row.isActive);
                return axios.patch(`${API_URL}/product/${row.slug}`, formData);
            }),
        );
        setBulkEditOpen(false);
        setBulkEditRows([]);
        setSelectedProducts([]);
        dispatch(fetchProducts());
    };

    const bulkEditDirty = useMemo(() => {
        if (!bulkEditRows.length || !bulkEditOriginal.length) return false;
        if (bulkEditRows.length !== bulkEditOriginal.length) return true;
        const byId = new Map(bulkEditOriginal.map((r) => [r._id, r]));
        return bulkEditRows.some((row) => {
            const orig = byId.get(row._id);
            if (!orig) return true;
            return (
                String(row.name) !== String(orig.name) ||
                String(row.category) !== String(orig.category) ||
                String(row.price) !== String(orig.price) ||
                String(row.taxRate) !== String(orig.taxRate) ||
                String(row.gstRate) !== String(orig.gstRate) ||
                String(row.stockQty) !== String(orig.stockQty) ||
                String(row.unit) !== String(orig.unit) ||
                String(row.isActive) !== String(orig.isActive)
            );
        });
    }, [bulkEditRows, bulkEditOriginal]);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );
        } else {
            pages.push(
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages
            );
        }

        return pages;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, typeFilter]);

    const isAllSelected = currentProducts.length > 0 && currentProducts.every((p) => selectedProducts.includes(p._id));

    if (loading) {
        return null;
    }

    if (error) {
        return (
            <div className='bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto'>
                <div className='flex justify-between items-center'>
                    <div className='text-xl font-semibold text-gray-900'>Products</div>
                </div>
                <div className='rounded-lg border border-red-200 bg-red-50 p-12'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <div className='text-red-600 text-lg'>⚠️ {error}</div>
                        <button
                            onClick={handleRefresh}
                            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className='flex flex-col gap-3 md:flex-row md:justify-between md:items-center'>
                <div className='text-xl font-semibold text-gray-900'>Products</div>
                <div className='flex flex-wrap gap-3 items-center font-semibold text-gray-900'>
                    {canCreate && (
                        <button onClick={() => navigate("/create-products")} className="flex justify-between items-center gap-2 w-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <FiPlusCircle className='text-lg' /> Add
                        </button>
                    )}
                    <button
                        onClick={handleImportButtonClick}
                        disabled={importing}
                        className="flex justify-between items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FiDownload className='text-lg' /> {importing ? "Importing..." : "Import CSV"}
                    </button>
                    <button
                        onClick={handleExportProducts}
                        className="flex justify-between items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        <FiDownload className='text-lg' /> Export CSV
                    </button>
                    <input
                        ref={importFileRef}
                        type="file"
                        accept=".csv,text/csv,application/vnd.ms-excel"
                        onChange={handleImportProducts}
                        className="hidden"
                    />
                    {selectedProducts.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                                {selectedProducts.length} selected
                            </span>
                            {canUpdate && (
                                <>
                                    <select
                                        value={bulkStatus}
                                        onChange={(e) => setBulkStatus(e.target.value)}
                                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="">Set status</option>
                                        <option value="true">Publish</option>
                                        <option value="false">Draft</option>
                                    </select>
                                    {bulkStatus !== "" && (
                                        <button
                                            onClick={handleBulkStatus}
                                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                        >
                                            Update Status
                                        </button>
                                    )}
                                    <button
                                        onClick={openBulkEdit}
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                    >
                                        Bulk Edit
                                    </button>
                                </>
                            )}
                            {canDelete && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600"
                                >
                                    Delete Selected
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {bulkEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-6xl rounded-xl bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="text-lg font-semibold text-gray-900">
                                Bulk Edit Products
                            </div>
                            <button
                                onClick={() => setBulkEditOpen(false)}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                            >
                                Close
                            </button>
                        </div>

                        <div className="overflow-auto border border-gray-200 rounded-lg h-180">
                            <table className="min-w-[900px] w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr className="border-b border-gray-200">
                                        <th className="px-3 py-2 text-left">Product</th>
                                        <th className="px-3 py-2 text-left">Category</th>
                                        <th className="px-3 py-2 text-right">Price</th>
                                        <th className="px-3 py-2 text-right">Tax %</th>
                                        <th className="px-3 py-2 text-right">GST %</th>
                                        <th className="px-3 py-2 text-right">Qty</th>
                                        <th className="px-3 py-2 text-left">Unit</th>
                                        <th className="px-3 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bulkEditRows.map((row) => (
                                        <tr key={row._id} className="border-t border-gray-200">
                                            <td className="px-3 py-2">
                                                <Input
                                                    value={row.name}
                                                    onChange={(e) =>
                                                        updateBulkRow(row._id, "name", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <Input
                                                    value={row.category}
                                                    onChange={(e) =>
                                                        updateBulkRow(row._id, "category", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.price}
                                                    onChange={(e) =>
                                                        updateBulkRow(row._id, "price", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.taxRate}
                                                    onChange={(e) =>
                                                        updateBulkRow(row._id, "taxRate", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.gstRate}
                                                    onChange={(e) =>
                                                        updateBulkRow(row._id, "gstRate", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <Input
                                                    type="number"
                                                    value={row.stockQty}
                                                    onChange={(e) =>
                                                        updateBulkRow(row._id, "stockQty", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <Input
                                                    value={row.unit}
                                                    onChange={(e) =>
                                                        updateBulkRow(row._id, "unit", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <select
                                                    value={String(row.isActive)}
                                                    onChange={(e) =>
                                                        updateBulkRow(
                                                            row._id,
                                                            "isActive",
                                                            e.target.value === "true",
                                                        )
                                                    }
                                                    className="w-fit rounded-lg border border-gray-200 px-3 py-2 text-sm"
                                                >
                                                    <option value="true">Publish</option>
                                                    <option value="false">Draft</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {!bulkEditRows.length && (
                                        <tr>
                                            <td className="px-3 py-6 text-center text-gray-500" colSpan={8}>
                                                No products selected
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setBulkEditOpen(false)}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                            >
                                Cancel
                            </button>
                            {bulkEditDirty && (
                                <button
                                    onClick={saveBulkEdit}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                                >
                                    Save All
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH + FILTERS */}

            <div className='rounded-lg border border-gray-200 bg-white text-gray-600'>
                <div className='flex flex-col md:flex-row justify-between gap-4 p-5'>
                    <div className="relative flex items-center w-full max-w-sm">
                        <label htmlFor="search" className="sr-only">Search</label>
                        <span className="absolute left-3 text-gray-500">
                            <IoSearch className="text-lg" />
                        </span>
                        <Input
                            placeholder="Search…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-5"
                        />
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className="relative w-full">
                            <select
                                value={categoryFilter}
                                onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                                className="w-36 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative w-full">
                            <select
                                value={typeFilter}
                                onChange={(e) => dispatch(setTypeFilter(e.target.value))}
                                className="w-36 appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <option value="">All Types</option>
                                {types.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                            <GoChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="overflow-x-auto bg-white max-h-[55vh] custom-scrollbar">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-gray-200 text-gray-900">
                                <tr>
                                    <th className="px-2 py-2 text-center">
                                        <label className="flex items-center gap-2 cursor-pointer select-none justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                                className="peer hidden"
                                            />
                                            <div className="h-4 w-4 rounded border border-gray-200 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
                                                <FaCheck className="h-3 w-3 text-white peer-checked:block" />
                                            </div>
                                        </label>
                                    </th>
                                    {/* <th className="px-2 py-2 text-left font-semibold">SKU</th> */}
                                    <th className="px-2 py-2 text-left font-semibold">Product</th>
                                    <th className="px-2 py-2 text-left font-semibold">Category</th>
                                    <th className="px-2 py-2 text-left font-semibold">Type</th>
                                    <th className="px-2 py-2 text-left font-semibold">Price</th>
                                    <th className="px-2 py-2 text-left font-semibold">Status</th>
                                    <th className="px-2 py-2 text-left font-semibold">Unit</th>
                                    <th className="px-2 py-2 text-left font-semibold">Qty</th>
                                    <th className="px-2 py-2 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentProducts.length > 0 ? (currentProducts.map((product) => (
                                    <tr key={product._id} className="transition hover:bg-gray-50">
                                        <td className="px-4 py-1 text-center">
                                            <label className="flex items-center gap-2 cursor-pointer select-none justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product._id)}
                                                    onChange={() => handleSelectProduct(product._id)}
                                                    className="peer hidden"
                                                />
                                                <div className="h-4 w-4 rounded border border-gray-200 bg-white flex items-center justify-center transition peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20">
                                                    <FaCheck className="h-3 w-3 text-white peer-checked:block" />
                                                </div>
                                            </label>
                                        </td>
                                        {/* <td className="px-2 py-1 text-gray-700">{product.sku}</td> */}
                                        <td className="px-2 py-1">
                                            <div className="flex items-center gap-3 hover:cursor-pointer" onClick={() => navigate(`/products/${product.slug}`)}>
                                                <div className="h-12 w-12 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 ">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="font-medium text-gray-800">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 text-gray-600">{product.category}</td>
                                        <td className="px-2 py-1 text-gray-600">{product.type}</td>
                                        <td className="px-2 py-1 font-medium text-gray-800">₹{product.price}</td>
                                        <td className="px-2 py-1">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    product?.isActive
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}
                                            >
                                                {product?.isActive ? "Active" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-gray-600">{product.unit}</td>
                                        <td className="px-2 py-1">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{product.stockQty}</span>
                                        </td>
                                        <td className="px-2 py-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    title="View"
                                                    onClick={() => navigate(`/products/${product.slug}`)}
                                                    className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <LuEye className="text-lg group-hover:scale-110 transition" />
                                                </button>
                                                <button
                                                    title="Edit"
                                                    onClick={() => navigate(`/products/${product.slug}`)}
                                                    className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                                >
                                                    <CiEdit className="text-lg group-hover:scale-110 transition" />
                                                </button>

                                                {canDelete && (
                                                    <button
                                                    title="Delete"
                                                    onClick={() => handleDelete(product.slug)}
                                                    className="group rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <RiDeleteBin5Line className="text-lg group-hover:scale-110 transition" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-2 py-10 text-center text-gray-500"
                                        >
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 bg-white border-t border-gray-200">
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                            <span className="font-medium">Rows per page:</span>
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors cursor-pointer"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                            <span className="text-gray-500">
                                {filteredProducts.length > 0
                                    ? `${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length}`
                                    : "0 of 0"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {getPageNumbers().map((page, index) =>
                                    page === "..." ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="w-9 h-9 flex items-center justify-center text-gray-500"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`w-9 h-9 rounded-lg font-medium transition-colors ${currentPage === page
                                                ? "bg-primary text-white hover:bg-primary"
                                                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ),
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;
