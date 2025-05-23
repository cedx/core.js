import {Task, TaskStatus} from "@cedx/core/Threading/Task.js";
import {assert} from "chai";

/**
 * Tests the features of the {@link Task} class.
 */
describe("Task", () => {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const {equal} = assert;

	describe("error", () => {
		it("should return `null` if the task has completed successfully", async () => {
			const task = new Task(() => Promise.resolve());
			await task.run();
			assert.isNull(task.error);
		});

		it("should return an `Error` if the task has errored", async () => {
			let task = new Task(() => Promise.reject(TypeError("failure")));
			await task.run();
			assert.instanceOf(task.error, TypeError);
			equal(task.error.message, "failure");
			assert.isUndefined(task.error.cause);

			task = new Task(() => Promise.reject(123456)); // eslint-disable-line @typescript-eslint/prefer-promise-reject-errors
			await task.run();
			assert.instanceOf(task.error, Error);
			equal(task.error.message, "The task failed.");
			equal(task.error.cause, 123456);
		});
	});

	describe("status", () => {
		it("should be `TaskStatus.Created` if the task has not been run", () => {
			const task = new Task(() => Promise.resolve());
			equal(task.status, TaskStatus.Created);
		});

		it("should be `TaskStatus.Faulted` if the task has errored", async () => {
			const task = new Task(() => Promise.reject(Error("failure")));
			await task.run();
			equal(task.status, TaskStatus.Faulted);
		});

		it("should be `TaskStatus.RanToCompletion` if the task has completed successfully", async () => {
			const task = new Task(() => Promise.resolve());
			await task.run();
			equal(task.status, TaskStatus.RanToCompletion);
		});
	});

	describe("value", () => {
		it("should return `undefined` if the task has errored", async () => {
			const task = new Task(() => Promise.reject(Error("failure")));
			await task.run();
			assert.isUndefined(task.result);
		});

		it("should return the value if the task has completed successfully", async () => {
			const task = new Task(() => Promise.resolve("success"));
			await task.run();
			equal(task.result, "success");
		});
	});

	describe("run()", () => {
		it("should return `undefined` if the task has errored", async () =>
			assert.isUndefined(await new Task(() => Promise.reject(Error("failure"))).run()));

		it("should return the value if the task has completed successfully", async () =>
			equal(await new Task(() => Promise.resolve("success")).run(), "success"));
	});
});
