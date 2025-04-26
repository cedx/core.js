/**
 * Defines the status of a task.
 */
export const TaskStatus = Object.freeze({

	/**
	 * The task has been initialized but has not yet been scheduled.
	 */
	Created: 0,

	/**
	 * The task is running but has not yet completed.
	 */
	Running: 1,

	/**
	 * The task completed execution successfully.
	 */
	RanToCompletion: 2,

	/**
	 * The task completed due to an unhandled error.
	 */
	Faulted: 3
});

/**
 * Defines the status of a task.
 */
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

/**
 * Represents an asynchronous operation.
 */
export class Task<T> {

	/**
	 * The task status.
	 */
	status: TaskStatus = TaskStatus.Created;

	/**
	 * The task result.
	 */
	#result?: Error|T;

	/**
	 * The code to execute.
	 */
	readonly #task: (...args: any[]) => Promise<T>;

	/**
	 * Creates a new task.
	 * @param task The code to execute in the task.
	 */
	constructor(task: (...args: any[]) => Promise<T>) {
		this.#task = task;
	}

	/**
	 * The error that caused this task to end prematurely, or `null` if the task completed successfully or has not yet thrown any errors.
	 */
	get error(): Error|null {
		return this.#result instanceof Error ? this.#result : null;
	}
	set error(error: unknown) {
		this.status = TaskStatus.Faulted;
		this.#result = error instanceof Error ? error : Error("The task failed.", {cause: error});
	}

	/**
	 * Value indicating whether this task has completed.
	 */
	get isCompleted(): boolean {
		return this.isCompletedSuccessfully || this.isFaulted;
	}

	/**
	 * Value indicating whether this task ran to completion.
	 */
	get isCompletedSuccessfully(): boolean {
		return this.status == TaskStatus.RanToCompletion;
	}

	/**
	 * Value indicating whether this task completed due to an unhandled error.
	 */
	get isFaulted(): boolean {
		return this.status == TaskStatus.Faulted;
	}

	/**
	 * The result value of this task, if it has completed successfully.
	 */
	get result(): T|undefined {
		return this.#result instanceof Error ? undefined : this.#result; // eslint-disable-line no-undefined
	}
	set value(value: T|undefined) {
		this.status = TaskStatus.Complete;
		this.#result = value;
	}

	/**
	 * Runs the task.
	 * @param args The task arguments.
	 * @returns The value of the task, if it has completed.
	 */
	async run(...args: any[]): Promise<T|undefined> {
		this.status = TaskStatus.Pending;
		try { this.value = await this.#task(...args); } // eslint-disable-line @typescript-eslint/no-unsafe-argument
		catch (error) { this.error = error; }
		return this.value;
	}
}
