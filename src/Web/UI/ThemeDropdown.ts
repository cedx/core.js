/* eslint-disable no-underscore-dangle */
import {ThemeMode, themeIcon, themeLabel} from "#Web/Html/ThemeMode.js";
import {html, type TemplateResult} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {classMap} from "lit/directives/class-map.js";
import {when} from "lit/directives/when.js";
import {Component} from "./Component.js";

/**
 * A dropdown menu for switching the color mode.
 */
@customElement("theme-dropdown")
export class ThemeDropdown extends Component {

	/**
	 * The alignement of the dropdown menu.
	 */
	@property() align: "end"|"start" = "end";

	/**
	 * The label of the dropdown menu.
	 */
	@property() label = "";

	/**
	 * The key of the storage entry providing the saved theme.
	 */
	@property() storageKey = "theme";

	/**
	 * The current theme.
	 */
	@state() private _theme: ThemeMode;

	/**
	 * The media query used to check the system theme.
	 */
	readonly #mediaQuery = matchMedia("(prefers-color-scheme: dark)");

	/**
	 * Creates a new theme dropdown.
	 */
	constructor() {
		super();
		const theme = localStorage.getItem(this.storageKey) as ThemeMode;
		this._theme = Object.values(ThemeMode).includes(theme) ? theme : ThemeMode.System;
	}

	/**
	 * The current theme.
	 */
	get theme(): ThemeMode {
		return this._theme;
	}
	set theme(value: ThemeMode) {
		localStorage.setItem(this.storageKey, this._theme = value);
		this.#applyTheme();
	}

	/**
	 * Method invoked when this component is connected.
	 */
	override connectedCallback(): void {
		super.connectedCallback();
		this.#applyTheme();
		this.#mediaQuery.addEventListener("change", this);
	}

	/**
	 * Method invoked when this component is disconnected.
	 */
	override disconnectedCallback(): void {
		this.#mediaQuery.removeEventListener("change", this);
		super.disconnectedCallback();
	}

	/**
	 * Handles the events.
	 */
	handleEvent(): void {
		this.#applyTheme();
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
		return html`
			<li class="nav-item dropdown">
				<a class="dropdown-toggle nav-link" data-bs-toggle="dropdown" href="#">
					<i class="icon icon-fill">${themeIcon(this._theme)}</i>
					${when(this.label, () => html`<span class="ms-1">${this.label}</span>`)}
				</a>
				<ul class="dropdown-menu ${classMap({"dropdown-menu-end": this.align == "end"})}">
					${Object.values(ThemeMode).map(value => html`
						<li>
							<button class="dropdown-item d-flex align-items-center justify-content-between" @click=${() => this.theme = value}>
								<span><i class="icon icon-fill me-1">${themeIcon(value)}</i> ${themeLabel(value)}</span>
								${when(value == this._theme, () => html`<i class="icon ms-2">check</i>`)}
							</button>
						</li>
					`)}
				</ul>
			</li>
		`;
	}

	/**
	 * Applies the theme to the document.
	 */
	#applyTheme(): void {
		const theme = this._theme == ThemeMode.System ? (this.#mediaQuery.matches ? ThemeMode.Dark : ThemeMode.Light) : this._theme;
		document.documentElement.dataset.bsTheme = theme.toLowerCase();
	}
}
