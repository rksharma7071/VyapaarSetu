import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Input from "../components/UI/Input";
import { applyTheme, defaultTheme, loadTheme, saveTheme } from "../utils/theme";
import { useDispatch, useSelector } from "react-redux";
import { fetchStores } from "../store/storeSlice";
import { useAlert } from "../components/UI/AlertProvider";

function Settings() {
    const initial = useMemo(() => loadTheme(), []);
    const [mode, setMode] = useState(initial.mode);
    const [primary, setPrimary] = useState(initial.primary);
    const [secondary, setSecondary] = useState(initial.secondary);
    const [darkBg, setDarkBg] = useState(initial.dark.bg);
    const [darkSurface, setDarkSurface] = useState(initial.dark.surface);
    const [darkBorder, setDarkBorder] = useState(initial.dark.border);
    const [darkText, setDarkText] = useState(initial.dark.text);
    const [darkMuted, setDarkMuted] = useState(initial.dark.muted);
    const dispatch = useDispatch();
    const { notify } = useAlert();
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const stores = useSelector((state) => state.stores.items);
    const store = useMemo(
        () => stores.find((s) => s._id === storeId),
        [stores, storeId],
    );
    const [taxRate, setTaxRate] = useState(0);
    const [savingTax, setSavingTax] = useState(false);

    const updateTheme = (next) => {
        const theme = {
            mode: next.mode ?? mode,
            primary: next.primary ?? primary,
            secondary: next.secondary ?? secondary,
            light: defaultTheme.light,
            dark: {
                bg: next.darkBg ?? darkBg,
                surface: next.darkSurface ?? darkSurface,
                border: next.darkBorder ?? darkBorder,
                text: next.darkText ?? darkText,
                muted: next.darkMuted ?? darkMuted,
            },
        };
        setMode(theme.mode);
        setPrimary(theme.primary);
        setSecondary(theme.secondary);
        setDarkBg(theme.dark.bg);
        setDarkSurface(theme.dark.surface);
        setDarkBorder(theme.dark.border);
        setDarkText(theme.dark.text);
        setDarkMuted(theme.dark.muted);
        saveTheme(theme);
        applyTheme(theme);
    };

    useEffect(() => {
        setTaxRate(Number(store?.defaultTaxRate || 0));
    }, [store]);

    const resetTheme = () => {
        updateTheme({
            mode: defaultTheme.mode,
            primary: defaultTheme.primary,
            secondary: defaultTheme.secondary,
            darkBg: defaultTheme.dark.bg,
            darkSurface: defaultTheme.dark.surface,
            darkBorder: defaultTheme.dark.border,
            darkText: defaultTheme.dark.text,
            darkMuted: defaultTheme.dark.muted,
        });
    };

    const handleSaveTax = async () => {
        if (!storeId) {
            notify({
                type: "warning",
                title: "Store required",
                message: "Select a store first.",
            });
            return;
        }
        try {
            setSavingTax(true);
            const parsed = Math.max(0, Number(taxRate || 0));
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/store/${storeId}`,
                { defaultTaxRate: parsed },
            );
            dispatch(fetchStores());
            notify({
                type: "success",
                title: "Tax updated",
                message: "Tax settings updated.",
            });
        } catch (error) {
            notify({
                type: "error",
                title: "Update failed",
                message:
                    error.response?.data?.message || "Failed to update tax.",
            });
        } finally {
            setSavingTax(false);
        }
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Settings</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-gray-900">Appearance</div>
                        <div className="text-sm text-gray-500">
                            Theme mode and brand colors
                        </div>
                    </div>
                    <button
                        onClick={resetTheme}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700"
                    >
                        Reset to Default
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Theme Mode</div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => updateTheme({ mode: "light" })}
                            className={`rounded-lg border px-4 py-2 text-sm ${mode === "light"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-gray-300 text-gray-600"
                                }`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => updateTheme({ mode: "dark" })}
                            className={`rounded-lg border px-4 py-2 text-sm ${mode === "dark"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-gray-300 text-gray-600"
                                }`}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Primary Color</div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={primary}
                                onChange={(e) =>
                                    updateTheme({ primary: e.target.value })
                                }
                                className="h-10 w-14 p-1"
                            />
                            <Input
                                value={primary}
                                onChange={(e) =>
                                    updateTheme({ primary: e.target.value })
                                }
                                placeholder="#FE9F43"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Secondary Color</div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={secondary}
                                onChange={(e) =>
                                    updateTheme({ secondary: e.target.value })
                                }
                                className="h-10 w-14 p-1"
                            />
                            <Input
                                value={secondary}
                                onChange={(e) =>
                                    updateTheme({ secondary: e.target.value })
                                }
                                placeholder="#092C4C"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm font-medium text-gray-700 mb-3">Preview</div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
                            Primary Button
                        </button>
                        <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
                            Secondary Button
                        </button>
                        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
                            Cards and surfaces
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-gray-900">Tax Settings</div>
                        <div className="text-sm text-gray-500">
                            Default tax percentage applied to POS orders
                        </div>
                    </div>
                    <button
                        onClick={handleSaveTax}
                        disabled={savingTax}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                    >
                        {savingTax ? "Saving..." : "Save Tax"}
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                        type="number"
                        step="0.01"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        placeholder="Tax Percentage (e.g., 5)"
                    />
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
                <div className="font-semibold text-gray-900">Dark Mode Colors</div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Background</div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={darkBg}
                                onChange={(e) => updateTheme({ darkBg: e.target.value })}
                                className="h-10 w-14 p-1"
                            />
                            <Input
                                value={darkBg}
                                onChange={(e) => updateTheme({ darkBg: e.target.value })}
                                placeholder="#0B1220"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Surface</div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={darkSurface}
                                onChange={(e) => updateTheme({ darkSurface: e.target.value })}
                                className="h-10 w-14 p-1"
                            />
                            <Input
                                value={darkSurface}
                                onChange={(e) => updateTheme({ darkSurface: e.target.value })}
                                placeholder="#0F172A"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Border</div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={darkBorder}
                                onChange={(e) => updateTheme({ darkBorder: e.target.value })}
                                className="h-10 w-14 p-1"
                            />
                            <Input
                                value={darkBorder}
                                onChange={(e) => updateTheme({ darkBorder: e.target.value })}
                                placeholder="#1F2937"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Text</div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={darkText}
                                onChange={(e) => updateTheme({ darkText: e.target.value })}
                                className="h-10 w-14 p-1"
                            />
                            <Input
                                value={darkText}
                                onChange={(e) => updateTheme({ darkText: e.target.value })}
                                placeholder="#E5E7EB"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Muted Text</div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={darkMuted}
                                onChange={(e) => updateTheme({ darkMuted: e.target.value })}
                                className="h-10 w-14 p-1"
                            />
                            <Input
                                value={darkMuted}
                                onChange={(e) => updateTheme({ darkMuted: e.target.value })}
                                placeholder="#9CA3AF"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
