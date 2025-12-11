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

  constructor() {
    this.minLength = 3;
    this.maxLength = 36; // 0 for no maxLength
    this.memory = new Map(); //To avoid conflict
  }

  init(min: number, max: number) {
    this.changeMinLength(min);
    this.changeMaxLength(max === 0 ? 36 : max);
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

      //get the parent we just set
      const parentMap = this.memory.get(uuidBase);

      //It will 100% exists, just TS complaining if we dont add this
      if (!parentMap) return;

      //Add the new child
      const newUUID = this.recursivelyGetShortenedUUID(parentMap, safeUUID, 0);
      parentMap!.children.add(newUUID);

      //exists in memory, check if conflicting
    } else {
      //TODO:
      const newUUID = this.recursivelyGetShortenedUUID(
        uuidInMemory,
        safeUUID,
        0
      );
      uuidInMemory.children.add(newUUID);
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
    return map.children.has(uuid);
  }

  private recursivelyGetShortenedUUID(
    map: UUIDBase,
    uuid: string,
    iterationCount: number
  ): string {
    const charsAllowed = iterationCount + this.minLength;
    const isExceeding = charsAllowed > this.maxLength;

    if (isExceeding) {
      throw new UUIDError(
        "URL conflicts cannot be resolved: It's reccomended that you either increase the max length of the UUID or rotate the UUID key for this specific URL - as a limit has been reached on the maxLength, with no suitable safe UUID URL's available."
      );
    }

    const unsafeShortnedUUID = uuid.slice(0, charsAllowed);

    const hasConflict = this.conflictCheck(map, unsafeShortnedUUID);
    if (!hasConflict) return unsafeShortnedUUID;

    return this.recursivelyGetShortenedUUID(map, uuid, iterationCount + 1);
  }
}

export default UUIDFolder;
