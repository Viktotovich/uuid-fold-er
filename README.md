# Purpose

There are probably better libraries out there. Use it as you see fit, test it, break it, etc.

This is meant for use for a larger project called Penguino Social, and V
and Bruno's private projects as well. There may or may not be issues, be
advised.

To report an issue, raise an Issue request - preferably with the stack trace
&& a way to replicate the error... or send a PR.

## Installation

```bash
git clone git@github.com:Viktotovich/uuid-fold-er.git
cd uuid-fold-er
```

### USAGE

To use `uuid-fold-er` in a persistent or multi-process environment, you must
provide a custom storage adapter that implements the `UUIDStore` interface.

```ts
// bin/uuid_with_db.ts
import { UUIDStore } from "./<foo_bar_baz>.ts";

export class YourDBStore implements UUIDStore {
  store: any; // Replace with your DB client

  constructor(store: any /*DO NOT KEEP IT ANY!!!!!*/) {
    this.store = store;
  }

  async ensureBase(base: string) {
    /* Example
    const existing = await this.store.findOne({ base });
    if (!existing) {
      await this.store.insertOne({ base, children: [] });
    }
    */
  }

  async addChild(base: string, child: string) {
    // Conflict prevention mechanism + optimization
    // It takes a common base and adds children
    /* 
    i.e: 2 common URLs of 3ba123 3ba421, have a parent of 3ba, and 
    children of 1) /3ba1 and /3ba4
    */
    /* Example
    await this.store.updateOne(
      { base },
      { $addToSet: { children: child } }
    );
    */
  }
  async addChild(base: string, child: string) {
    /* Example
    const record = await this.store.findOne({ base, children: child });
    return !!record; << Forces boolean
    */
  }
}

/*Testing to be handled on your end, as it is currently tested only for
  per-session basis (which doesn't have a layer of persistance to it).*/
```

```ts
import UUIDFolder from ".";
import { YourDBStore } from "./bin/uuid_with_db.ts";
import { yourDbClient } from "./foo/bar/lucid.ts";

const store = new YourDBStore(yourDbClient);

// To provide: minLength of the shortned url, max length, and the store
// Side note: setting 0 for maxLength defaults to the maximum possible value
const uuidFolder = new UUIDFolder(5, 20, store);

const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";

// Generate a safe shortened UUID
const shortUUID = uuidController.process(uuid);

console.log(shortUUID); // e.g. "8bd4d"
```

### See it Live

[The implementation is (going to be) used in Penguino Social. Explore the implementation here:](https://github.com/Viktotovich/penguino/tree/main)
