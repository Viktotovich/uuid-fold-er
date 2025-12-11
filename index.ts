/*UUIDBase is the parent:
Let's say we have 1k calls for 1 instance of a UUID, instead
of saving all to memory blindly, we save the parent (full uuid) - and work with it's children (shortened versions). 

Instead of having to look up the entire array length to find if there is a 
conflict in an O(n) fashion, we traverse the bucket-like parent list instead   
O(log n)*/
type UUIDBase = {
  parent: string;
  children: Set<string>;
};

class UUIDFolder {
  minLength: number;
  maxLength: number;
  memory: Map<string, UUIDBase>;

  constructor(minLength: number, maxLength: number) {
    this.minLength = minLength;
    this.maxLength = maxLength; // 0 for no maxLength
    this.memory = new Map(); //To avoid conflict
  }

  shorten(uuid: string | URL) {
    this.mismatchCheck();
    const safeUUID = this.normalize(uuid);
  }

  normalize(uuid: string | URL) {
    //If URL form, format as string
    const stringUUID = uuid.toString();

    //Get the index of the last subpath (if applicable)
    const head = stringUUID.lastIndexOf("/");

    //Return full or return sliced
    return head === -1 ? stringUUID : stringUUID.slice(head + 1);
  }

  private mismatchCheck() {
    return this.minLength >= this.maxLength
      ? new Error("Min Length cannot be longer than Max Length")
      : null;
  }
}

export default UUIDFolder;
