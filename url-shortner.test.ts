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

  const UUIDController = new UUIDFolder(minLength, maxLength);

  expect(UUIDController.shorten(uuid)).toBe(expected);
});

test("Sanity check, processes minLength correctly", () => {
  //Can't have it dynamic - otherwise what are we testing for xD
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 11;
  const maxLength = 0;
  const expected = "8b4da03b-88b2";

  const UUIDController = new UUIDFolder(minLength, maxLength);

  expect(UUIDController.shorten(uuid)).toBe(expected);
});

test("Throws on minLength x maxLength mismatch", () => {
  const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";
  const minLength = 10;
  const maxLength = 5;

  const UUIDController = new UUIDFolder(minLength, maxLength);

  expect(UUIDController.shorten(uuid)).toBe(typeof Error);
});
