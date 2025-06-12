/**
 * Defines the available color modes.
 */
export const ThemeMode = Object.freeze({

	/**
	 * The light predefined theme mode.
	 */
	Light: "Light",

	/**
	 * The dark predefined theme mode.
	 */
	Dark: "Dark",

	/**
	 * The system predefined theme mode.
	 */
	System: "System"
});

/**
 * Defines the available color modes.
 */
export type ThemeMode = typeof ThemeMode[keyof typeof ThemeMode];

/**
 * Gets the icon corresponding to the specified theme.
 * @param theme The theme.
 * @returns The icon corresponding to the specified theme.
 */
export function themeIcon(theme: ThemeMode): string {
	switch (theme) {
		case ThemeMode.Dark: return "dark_mode";
		case ThemeMode.Light: return "light_mode";
		default: return "contrast";
	}
}

/**
 * Gets the label corresponding to the specified theme.
 * @param theme The theme.
 * @returns The label corresponding to the specified theme.
 */
export function themeLabel(theme: ThemeMode): string {
	switch (theme) {
		case ThemeMode.Dark: return "Sombre";
		case ThemeMode.Light: return "Clair";
		default: return "Auto";
	}
}
