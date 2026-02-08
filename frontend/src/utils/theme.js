export const defaultTheme = {
    mode: "light",
    primary: "#FE9F43",
    secondary: "#092C4C",
    light: {
        bg: "#F9FAFB",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        text: "#111827",
        muted: "#6B7280",
    },
    dark: {
        bg: "#0B1220",
        surface: "#0F172A",
        border: "#1F2937",
        text: "#E5E7EB",
        muted: "#9CA3AF",
    },
};

function clamp(value) {
    return Math.max(0, Math.min(255, value));
}

function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const normalized = clean.length === 3
        ? clean.split("").map((c) => c + c).join("")
        : clean;
    const num = parseInt(normalized, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map((v) => clamp(v).toString(16).padStart(2, "0"))
            .join("")
    );
}

function shade(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent);
    const nr = Math.round((t - r) * p) + r;
    const ng = Math.round((t - g) * p) + g;
    const nb = Math.round((t - b) * p) + b;
    return rgbToHex(nr, ng, nb);
}

export function loadTheme() {
    try {
        const stored = localStorage.getItem("app_theme");
        if (!stored) return { ...defaultTheme };
        const parsed = JSON.parse(stored);
        return {
            mode: parsed.mode || defaultTheme.mode,
            primary: parsed.primary || defaultTheme.primary,
            secondary: parsed.secondary || defaultTheme.secondary,
            light: {
                ...defaultTheme.light,
                ...(parsed.light || {}),
            },
            dark: {
                ...defaultTheme.dark,
                ...(parsed.dark || {}),
            },
        };
    } catch {
        return { ...defaultTheme };
    }
}

export function saveTheme(theme) {
    localStorage.setItem("app_theme", JSON.stringify(theme));
}

export function applyTheme(theme) {
    const root = document.documentElement;
    const mode = theme.mode || defaultTheme.mode;
    root.dataset.theme = mode;

    const primary = theme.primary || defaultTheme.primary;
    const secondary = theme.secondary || defaultTheme.secondary;

    root.style.setProperty("--color-primary", primary);
    root.style.setProperty("--color-primary-hover", shade(primary, -0.12));
    root.style.setProperty("--color-primary-active", shade(primary, -0.2));
    root.style.setProperty("--color-secondary", secondary);

    const palette = mode === "dark" ? theme.dark || defaultTheme.dark : theme.light || defaultTheme.light;
    root.style.setProperty("--app-bg", palette.bg || defaultTheme.light.bg);
    root.style.setProperty("--app-surface", palette.surface || defaultTheme.light.surface);
    root.style.setProperty("--app-border", palette.border || defaultTheme.light.border);
    root.style.setProperty("--app-text", palette.text || defaultTheme.light.text);
    root.style.setProperty("--app-muted", palette.muted || defaultTheme.light.muted);
}
