import type {ViewportScroller} from "#Web/Html/ViewportScroller.js";
import {html, type TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Component} from "./Component.js";

/**
 * Scrolls to the specified element.
 */
@customElement("scroll-to")
export class ScrollTo extends Component {

	/**
	 * Value indicating whether scrolling is instant or animates smoothly.
	 */
	@property() behavior: ScrollBehavior = "auto";

	/**
	 * The scroller service.
	 */
	@property({attribute: false}) scroller: ViewportScroller|null = null;

	/**
	 * The CSS selector used to target the element.
	 */
	@property() target = "body";

	/**
	 * The associated element.
	 */
	#element: Element = document.body;

	/**
	 * Creates a new scrolling component.
	 */
	constructor() {
		super({shadowRoot: true});
	}

	/**
	 * Method invoked when this component is connected.
	 */
	override connectedCallback(): void {
		super.connectedCallback();
		this.#element = document.querySelector(this.target) ?? document.body;
	}

	/**
	 * Renders this component.
	 * @returns The view template.
	 */
	protected override render(): TemplateResult {
		return html`
			<slot @click=${this.#scrollToTarget}>
				<button class="btn btn-primary">
					<i class="icon transform-scale-120">vertical_align_top</i>
				</button>
			</slot>
		`;
	}

	/**
	 * Scrolls to the target element.
	 * @param event The dispatched event.
	 */
	#scrollToTarget(event: Event): void {
		event.preventDefault();
		if (this.scroller) this.scroller.scrollToElement(this.#element);
		else {
			const {left, top} = this.#element.getBoundingClientRect();
			const viewport = document.scrollingElement ?? document.documentElement;
			viewport.scrollTo({left: left + viewport.scrollLeft, top: top + viewport.scrollTop, behavior: this.behavior});
		}
	}
}
