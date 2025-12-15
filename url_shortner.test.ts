//utils
import { randomUUID } from "crypto";
import UUIDError from "./uuid_error";
import { store } from ".";

//Class
import UUIDFolder from ".";
import { UUIDSessionStore } from ".";

test("It works", () => {
  expect(1 + 1).toBe(2);
});

test("Shortens the UUID", async () => {
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 5;
  const maxLength = 20;
  const expected = "8b4da";

  const UUIDController = new UUIDFolder(minLength, maxLength, store);

  expect(await UUIDController.process(uuid)).toBe(expected);
});

test("Sanity check, processes minLength correctly", async () => {
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 11;
  const maxLength = 20;
  const expected = "8b4da03b-88";
  const cleanStore = new UUIDSessionStore();

  const UUIDController = new UUIDFolder(minLength, maxLength, cleanStore);

  expect(await UUIDController.process(uuid)).toBe(expected);
});

test("Handles conflicts gracefully", async () => {
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 11;
  const maxLength = 20;
  const expected = "8b4da03b-88b2";

  const UUIDController = new UUIDFolder(minLength, maxLength, store);

  //We run it twice, should be x2 in memory
  await UUIDController.process(uuid);
  await UUIDController.process(uuid);

  expect(await UUIDController.process(uuid)).toBe(expected);
});

test("Handles super conflicts gracefully", async () => {
  const uuid = crypto.randomUUID();
  const minLength = 11;
  const maxLength = 20;
  const expected = uuid.slice(0, 15);
  const cleanStore = new UUIDSessionStore();

  const UUIDController = new UUIDFolder(minLength, maxLength, cleanStore);

  //We run it x4, should be x4 instances in memory
  await UUIDController.process(uuid);
  await UUIDController.process(uuid);
  await UUIDController.process(uuid);
  await UUIDController.process(uuid);

  expect(await UUIDController.process(uuid)).toBe(expected);
});

test("Throws on minLength x maxLength mismatch", () => {
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 10;
  const maxLength = 5;

  const UUIDController = new UUIDFolder(minLength, maxLength, store);

  expect(() => UUIDController.process(uuid)).toThrow(UUIDError);
});

//Methods testing
test("Normalization works", () => {
  const uuid = randomUUID();
  const URLFormat = new URL(`https://example.com/blogs/tests/${uuid}`);

  const UUIDController = new UUIDFolder(4, 10, store);

  expect(UUIDController.normalize(URLFormat)).toBe(uuid);
});

test("Normalization Double Check", () => {
  const uuid = randomUUID();
  const URLFormat = `/${uuid}`;

  const UUIDController = new UUIDFolder(4, 10, store);

  expect(UUIDController.normalize(URLFormat)).toBe(uuid);
});
