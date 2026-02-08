import { useEffect, useState, useMemo } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { FaLaptop } from "react-icons/fa";
import { TbReload, TbX } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { BsBox } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlinePercentage } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineBrandingWatermark, MdOutlinePointOfSale, MdOutlineAssignmentReturn, MdOutlineInventory2, MdOutlineWarningAmber, MdOutlineEventBusy, MdOutlinePeopleAlt, MdOutlineGroups, MdOutlineAdminPanelSettings, MdOutlineAssessment, MdOutlineHistory } from "react-icons/md";
import { RiTruckLine, RiFileList3Line } from "react-icons/ri";
import { handleRefresh } from "../data/refresh";
import { useDispatch, useSelector } from "react-redux";
import { fetchStores, setSelectedStore } from "../store/storeSlice";
import { clearCart } from "../store/cartSlice";
import { clearPosOrder } from "../store/ordersSlice";
import Input from "./UI/Input";
import axios from "axios";
import { API_URL } from "../utils/api";

function Header() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { items: stores, selectedStoreId } = useSelector(
        (state) => state.stores,
    );
    const user = useMemo(
        () => JSON.parse(localStorage.getItem("user") || "null"),
        [],
    );
    const [permission, setPermission] = useState(null);
    const selectedStore = stores.find((s) => s._id === selectedStoreId);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("pos_store_id");
        localStorage.removeItem("refresh_token");
        if (axios?.defaults?.headers?.common?.Authorization) {
            delete axios.defaults.headers.common.Authorization;
        }
        try {
            await axios.post(`${API_URL}/auth/logout`);
        } catch {
            // ignore logout errors
        }
        window.location.href = "/login";
    };

    useEffect(() => {
        dispatch(fetchStores());
    }, [dispatch]);

    useEffect(() => {
        if (!user?.id) return;
        if (user?.role === "admin") return setPermission({ admin: true });
        let isMounted = true;
        const fetchPermission = () => {
            axios
                .get(`${API_URL}/user/permission/${user.id}`)
                .then((res) => {
                    if (isMounted) setPermission(res.data || {});
                })
                .catch(() => {
                    if (isMounted) setPermission({});
                });
        };
        fetchPermission();
        const interval = setInterval(fetchPermission, 60000);
        const onFocus = () => fetchPermission();
        window.addEventListener("focus", onFocus);
        return () => {
            isMounted = false;
            clearInterval(interval);
            window.removeEventListener("focus", onFocus);
        };
    }, [user]);

    const menuItems = [
        { label: "Dashboard", to: "/", icon: RxDashboard, perm: "readReport" },
        { label: "Products", to: "/products", icon: BsBox, perm: "readProduct" },
        { label: "Categories", to: "/category", icon: BiCategoryAlt, perm: "readProduct" },
        { label: "Brands", to: "/brands", icon: MdOutlineBrandingWatermark, perm: "readProduct" },
        { label: "Orders", to: "/orders", icon: FiShoppingCart, perm: "readOrder" },
        { label: "Sales", to: "/sales", icon: MdOutlinePointOfSale, perm: "readOrder" },
        { label: "Discount", to: "/discount", icon: AiOutlinePercentage, perm: "readDiscount" },
        { label: "Suppliers", to: "/suppliers", icon: RiTruckLine, perm: "readSupplier" },
        { label: "Purchase Orders", to: "/purchase-orders", icon: RiFileList3Line, perm: "readPurchaseOrder" },
        { label: "Manage Stock", to: "/manage-stock", icon: MdOutlineInventory2, perm: "readInventory" },
        { label: "Low Stock", to: "/low-stocks", icon: MdOutlineWarningAmber, perm: "readInventory" },
        { label: "Expired", to: "/expired-products", icon: MdOutlineEventBusy, perm: "readInventory" },
        { label: "Returns", to: "/returns", icon: MdOutlineAssignmentReturn, perm: "readReturn" },
        { label: "Customers", to: "/customers", icon: MdOutlinePeopleAlt, perm: "readCustomer" },
        { label: "Employee", to: "/employee", icon: MdOutlineGroups, perm: "readUser" },
        { label: "Role Permissions", to: "/role-permissions", icon: MdOutlineAdminPanelSettings, perm: "admin" },
        { label: "Reports", to: "/reports", icon: MdOutlineAssessment, perm: "readReport" },
        { label: "Activity Log", to: "/activity-log", icon: MdOutlineHistory, perm: "readReport" },
        { label: "Settings", to: "/settings", icon: IoSettingsOutline, perm: "readUser" },
    ];

    const canSee = (item) => {
        if (!permission) return false;
        if (permission.admin) return true;
        if (item.perm === "admin") return false;
        return permission[item.perm];
    };

    return (
        <>
            {/* HEADER */}
            <header className="relative z-50 flex h-20 items-center justify-between border-b border-gray-300 bg-white p-4">
                <button className="text-2xl md:hidden" onClick={() => setOpen(true)} ><GiHamburgerMenu /></button>

                {/* Desktop Search */}
                <div className="relative ml-4 hidden w-full max-w-sm md:flex">
                    <IoSearch className="absolute left-3 top-3 text-gray-500" />
                    <Input
                        placeholder="Search..."
                        className="pl-10"
                    />
                </div>

                {/* Desktop actions */}
                <div className="ml-auto items-center gap-3 flex">
                    <select
                        value={selectedStoreId}
                        onChange={(e) =>
                            (() => {
                                dispatch(setSelectedStore(e.target.value));
                                dispatch(clearCart());
                                dispatch(clearPosOrder());
                            })()
                        }
                        className="hidden sm:block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                        {stores.map((store) => (
                            <option key={store._id} value={store._id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleRefresh} className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"><TbReload />Refresh</button>
                    <Link to="/pos" className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white"><FaLaptop />POS</Link>
                    <div className="relative hidden sm:flex">
                        <button
                            onClick={() => setUserMenuOpen((v) => !v)}
                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                                {user?.name?.[0] || "U"}
                            </div>
                            <div className="leading-tight text-left">
                                <div className="text-sm font-semibold text-gray-900">
                                    {user?.name || "User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {selectedStore?.name || "No Store"}
                                </div>
                            </div>
                        </button>
                        {userMenuOpen && (
                            <div className="absolute right-0 top-12 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                                {/* <Link
                                    to="/"
                                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Dashboard
                                </Link> */}
                                {/* <Link
                                    to="/pos"
                                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    POS
                                </Link> */}
                                {/* <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Settings
                                </Link> */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            
            </header>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MOBILE DRAWER */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-full bg-white transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-300 p-4">
                    <h3 className="text-lg font-semibold">Menu</h3>
                    <button onClick={() => setOpen(false)}>
                        <TbX className="text-xl" />
                    </button>

                </div>

                {/* CONTENT */}
                <div className="grid h-[calc(100vh-4rem)] grid-cols-1">

                    {/* LEFT: MENU */}
                    <nav className="col-span-2 overflow-y-auto border-r border-gray-300 p-4 space-y-1">
                        {menuItems.filter(canSee).map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
                  ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                <item.icon className="text-lg" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* RIGHT: USER PANEL */}
                    {/* <div className="col-span-1 flex flex-col justify-between p-4">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://img.freepik.com/free-photo/front-view-business-woman-suit_23-2148603018.jpg"
                className="h-16 w-16 rounded-full border object-cover"
              />
              <p className="mt-2 text-sm font-semibold">Admin User</p>
              <p className="text-xs text-gray-500">admin@site.com</p>
            </div>

            <div className="space-y-2">
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="block rounded-lg border px-3 py-2 text-center text-sm"
              >
                Settings
              </Link>

              <button className="w-full rounded-lg bg-red-500 px-3 py-2 text-sm text-white">
                Logout
              </button>
            </div>
          </div> */}
                </div>
            </div>
        </>
    );
}

export default Header;
