# Purpose

No idea, had some free time to kill - there are probably better libraries out
there. Use it as you see fit, test it, break it, etc.

This is meant for use for a larger project called Penguino Social, and V
and Bruno's private projects as well. There may or may not be issues, be
advised.

To report an issue, raise an Issue request - preferably with the stack trace +
a way to replicate the error... or send a PR.

## Installation

```bash
git clone git@github.com:Viktotovich/uuid-fold-er.git
cd uuid-fold-er
```

### USAGE

```bash
import UUIDFolder from ".";

const uuidController = new UUIDFolder();

// Initialize with min and max lengths
uuidController.init(5, 20);

// Setting 0 for maxLength defaults to the maximum possible value

const uuid = "8b4da03b-88b2-4a63-a55a-940eff4c549a";

// Generate a safe shortened UUID
const shortUUID = uuidController.process(uuid);

console.log(shortUUID); // e.g. "8bd4d"
```
