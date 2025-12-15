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
  async get(base: string) {
    // For getting the base/slug
  }

  async set(base: string, value) {
    // For setting the base/slug
  }

  async addChild(base: string, child: string) {
    // Conflict prevention mechanism + optimization
    // It takes a common base and adds children
    /* 
    i.e: 2 common URLs of 3ba123 3ba421, have a parent of 3ba, and 
    children of 1) /3ba1 and /3ba4
    */
  }
}

/*Testing to be handled on your end, as it is currently tested only for
  per-session basis (which doesn't have a layer of persistance to it).*/
```

```ts
import UUIDFolder from ".";
import { YourDBStore } from "./bin/uuid_with_db.ts";

const store = new YourDBStore();
//session opt is used just for testing, not valid in prod
const uuidController = new UUIDFolder("db");
// Initialize with min and max lengths
uuidController.init(store, 5, 20);

// Setting 0 for maxLength defaults to the maximum possible value

const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";

// Generate a safe shortened UUID
const shortUUID = uuidController.process(uuid);

console.log(shortUUID); // e.g. "8bd4d"
```
