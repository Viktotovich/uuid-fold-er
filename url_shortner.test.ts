//utils
import { randomUUID } from "crypto";

//Class
import UUIDFolder from ".";

test("It works", () => {
  expect(1 + 1).toBe(2);
});

test("Shortens the UUID", () => {
  //Can't have it dynamic - otherwise what are we testing for xD
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 6;
  const maxLength = 0;
  const expected = "8bd4da,";

  const UUIDController = new UUIDFolder();
  UUIDController.init(minLength, maxLength);

  expect(UUIDController.process(uuid)).toBe(expected);
});

test("Sanity check, processes minLength correctly", () => {
  //Can't have it dynamic - otherwise what are we testing for xD
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 11;
  const maxLength = 0;
  const expected = "8b4da03b-88b2";

  const UUIDController = new UUIDFolder();
  UUIDController.init(minLength, maxLength);

  expect(UUIDController.process(uuid)).toBe(expected);
});

test("Throws on minLength x maxLength mismatch", () => {
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 10;
  const maxLength = 5;

  const UUIDController = new UUIDFolder();
  UUIDController.init(minLength, maxLength);

  expect(UUIDController.process(uuid)).toBe(typeof Error);
});

//Methods testing
test("Normalization works", () => {
  const uuid = randomUUID();
  const URLFormat = new URL(`https://example.com/blogs/tests/${uuid}`);

  const UUIDController = new UUIDFolder();
  UUIDController.init(4, 10);

  expect(UUIDController.normalize(URLFormat)).toBe(uuid);
});

test("Normalization Double Check", () => {
  const uuid = randomUUID();
  const URLFormat = `/${uuid}`;

  const UUIDController = new UUIDFolder();
  UUIDController.init(4, 10);

  expect(UUIDController.normalize(URLFormat)).toBe(uuid);
});
