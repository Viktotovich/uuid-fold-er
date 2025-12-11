class UUIDFolder {
  minLength: number;
  maxLength: number;
  memory: string[];

  constructor(minLength: number, maxLength: number) {
    this.minLength = minLength;
    this.maxLength = maxLength; // 0 for no maxLength
    this.memory = []; //To avoid conflict
  }

  shorten(uuid: string | URL) {
    this.mismatchCheck();
  }

  private stripChars(uuid: string | URL) {
    return uuid; //take URL or UUID, strip it
  }

  private mismatchCheck() {
    return this.minLength >= this.maxLength
      ? new Error("Min Length cannot be longer than Max Length")
      : null;
  }
}

export default UUIDFolder;
