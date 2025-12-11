class UUIDError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UUID Error";
    Object.setPrototypeOf(this, UUIDError.prototype);
  }
}

export default UUIDError;
