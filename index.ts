import UUIDError from "./uuid_error";

/*UUIDBase is the parent:
Let's say we have 50 calls for 1 instance of a UUID, instead
of saving all to memory blindly, we save the parent (3-4 characters of the 
UUID) - and work with it's children (slighlty longer versions (5 chars and 
above)). 

This way, instead of having to look up the entire array length to find if
there is a  conflict in an O(n) fashion, we traverse the bucket-like parent 
list instead O(log n). 

Disclaimer: I know Maps are O(n) look ups, but this is made for fun and the current DS/A would be better than plain look ups had it been done with arrays.
*/

type UUIDBase = {
  children: Set<string>;
};

class UUIDFolder {
  minLength: number;
  maxLength: number;
  memory: Map<string, UUIDBase>; // UUID bucket w/ previous iterations

  constructor() {
    this.minLength = 3;
    this.maxLength = 32; // 0 for no maxLength
    this.memory = new Map(); //To avoid conflict
    /*Future consideration: 
    - Custom UUID base setups
    - Base should NOT be longer than the minLength of the returned short UUID.
    As then there will be high risk of conflicts
    */
  }

  init(min: number, max: number) {
    this.changeMinLength(min);
    this.changeMaxLength(max === 0 ? 36 : max);

    //If minLength is longer than maxLength
    this.mismatchCheck();
  }

  changeMinLength(newMin: number) {
    //Incase of string based numbers. Future consideration are float numbers
    const safeNewMin = Number(newMin);
    if (safeNewMin < 3) {
      throw new UUIDError("Min Length must be atleast 3 chars long.");
    } else {
      this.minLength = safeNewMin;
    }
  }

  changeMaxLength(newMax: number) {
    //Incase of string based numbers. Future consideration are float numbers
    const safeMaxLength = Number(newMax);
    if (newMax >= 32) {
      throw new UUIDError("Are you sure? Might as well just use the full UUID");
    } else {
      this.maxLength = safeMaxLength;
    }
  }

  process(uuid: string | URL) {
    /*Check if URL, if URL - get just the ending part of the path

    i.e: https://example.com/foo/bar/baz/<uuid> turns into just <uuid>
    */
    const safeUUID = this.normalize(uuid);

    //We're getting the bucket value for the UUID
    const uuidBase = this.getUUIDBase(safeUUID);

    //Check if exists, if not, create new
    const uuidInMemory = this.memory.get(uuidBase);

    //never existed in memory, safe to save
    if (!uuidInMemory) {
      this.memory.set(uuidBase, {
        children: new Set(),
      });

      //get the parent we just set
      const parentMap = this.memory.get(uuidBase);

      //It will 100% exist, just TS complaining if we dont add this
      if (!parentMap) return;

      //Add the new child
      const newUUID = this.recursivelyGetShortenedUUID(parentMap, safeUUID, 0);
      parentMap!.children.add(newUUID);

      return newUUID;
      //exists in memory, check if conflicting
    } else {
      //Recursively get the 0-conflict shortned UUID Url
      const newUUID = this.recursivelyGetShortenedUUID(
        uuidInMemory,
        safeUUID,
        0
      );
      //Save the newUUID into memory, so we later can check for conflicts
      uuidInMemory.children.add(newUUID);

      return newUUID;
    }
  }

  //Take a possible URL, convert it into a pure/safe UUID string
  normalize(uuid: string | URL) {
    //If URL form, format as string
    const stringUUID = uuid.toString();

    //Get the index of the last subpath (if applicable)
    const head = stringUUID.lastIndexOf("/");

    //Return full or return sliced
    return head === -1 ? stringUUID : stringUUID.slice(head + 1);
  }

  /* minL must not be higher than maxL, otherwise, no shortned URL can be
  produced */
  private mismatchCheck() {
    return this.minLength >= this.maxLength
      ? new Error("Min Length cannot be longer than Max Length")
      : null;
  }

  /*
   * Extracts the "base"/parent of a UUID for memory bucketing.
   *
   * The first three (or more, depending on future setup) characters of the
   * UUID are used as a key in `this.memory` to group related shortened
   * variants together. This reduces the search space
   * when checking for conflicts among already-generated shortened UUIDs.
   *
   * uuid - The full "normalized" UUID string to get the base from
   * */
  private getUUIDBase(uuid: string) {
    /* Why 3? 3 is the minimum minLength we can set.
     *
     * As long as `minLength` remains greater than `baseLength` (the hardcoded
     * 3), the logic for shortening and conflict resolution remains safe.
     * If you so need to adjust the baseLength to be higher, make sure to
     * raise the minLength accordingly to avoid bugs.
     * */
    return uuid.slice(0, 3);
  }

  /*
   * Made into it's own function for clarity's sake.
   * Checks if the generated value already exists in the children of a common
   * parent base (in other words, is there a conflict?)
   */
  private conflictCheck(map: UUIDBase, uuid: string) {
    return map.children.has(uuid);
  }

  //Recursively gets the shortned URL with the conflictCheck Helper function
  private recursivelyGetShortenedUUID(
    map: UUIDBase,
    uuid: string,
    iterationCount: number
  ): string {
    /* Looks weird at first, but remember, we're in recurssion now.
     * This could be the nth iteration, and charsAllowed makes sure
     * we are going forward (in characters).
     * While isExceeding is making sure we don't stack overflow, sets a limit
     */
    const charsAllowed = iterationCount + this.minLength;
    const isExceeding = charsAllowed > this.maxLength;

    //Throw if we're exceeding allowed characters
    if (isExceeding) {
      throw new UUIDError(
        "URL conflicts cannot be resolved: It's reccomended that you either increase the max length of the UUID or rotate the UUID key for this specific URL - as a limit has been reached on the maxLength, with no suitable safe UUID URL's available."
      );
    }

    /*Unsafe until tested for conflict:
     * This is what "makes" the shortned URL*/
    const unsafeShortnedUUID = uuid.slice(0, charsAllowed);

    const hasConflict = this.conflictCheck(map, unsafeShortnedUUID);

    //If no conflict, the UUID is safe for use
    if (!hasConflict) return unsafeShortnedUUID;

    //If conflict, iterate & increase by 1 character limit
    return this.recursivelyGetShortenedUUID(map, uuid, iterationCount + 1);
  }
}

//To be used as a signleton
export default UUIDFolder;
