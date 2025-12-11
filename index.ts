import UUIDError from "./uuid_error";

/*UUIDBase is the parent:
Let's say we have 1k calls for 1 instance of a UUID, instead
of saving all to memory blindly, we save the parent (full uuid) - and work with it's children (shortened versions). 

Instead of having to look up the entire array length to find if there is a 
conflict in an O(n) fashion, we traverse the bucket-like parent list instead   
O(log n)*/
type UUIDBase = {
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

  changeMinLength(newMin: number) {
    const safeNewMin = Number(newMin);
    if (safeNewMin < 3) {
      throw new UUIDError("Min Length must be atleast 3 chars long.");
    } else {
      this.minLength = safeNewMin;
    }
  }

  changeMaxLength(newMax: number) {
    const safeMaxLength = Number(newMax);
    if (newMax >= 32) {
      throw new UUIDError("Are you sure? Might as well just use the full UUID");
    } else {
      this.maxLength = safeMaxLength;
    }
  }

  process(uuid: string | URL) {
    this.mismatchCheck();
    const safeUUID = this.normalize(uuid);
    const uuidBase = this.getUUIDBase(safeUUID);

    //Check if exists, if not, create new
    const uuidInMemory = this.memory.get(uuidBase);

    //never existed in memory, safe to save
    if (typeof uuidInMemory == undefined || !uuidInMemory) {
      this.memory.set(uuidBase, {
        children: new Set(),
      });
      //exists in memory, check if conflicting
    } else {
      //TODO:
    }
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

  private getUUIDBase(uuid: string) {
    const uuidParts = uuid.slice(0, 3);
    return uuidParts[0];
  }

  private conflictCheck(map: UUIDBase, uuid: string) {
    const conflictFreeURL = null; //TODO
  }

  private recursivelyIterateOnOpts(uuid: string) {
    //
  }
}

export default UUIDFolder;
