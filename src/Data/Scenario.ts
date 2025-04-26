/**
 * Defines the scenario used in data validation.
 */
export const Scenario = Object.freeze({

	/**
	 * A scenario in which the underlying model is created.
	 */
	Creation: "Creation",

	/**
	 * A scenario in which the underlying model is updated.
	 */
	Update: "Update"
});

/**
 * Defines the scenario used in data validation.
 */
export type Scenario = typeof Scenario[keyof typeof Scenario];
