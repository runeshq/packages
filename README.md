<img src="./.github/assets/project-banner.png">
<div align="center">Runes is built on top of things, and those things can be found here.</div>
<hr />

## Packages
### @runes/router

The package named [@runes/router]() is a wrapper framework around the existing serverless framework. It provides easy-to-use functionality to quickly and easily build serverless APIs. It uses file-system based routing, exports [arktype]() for built-in validation, and more. It is opinionated, and pushes developers towards best-practice REST API development.

```ts
/* src/routes/information.ts */

import { type Method, arktype } from "@runes/router";
import { writeFile } from "fs/promises";
import { join } from "path";

const TARGET_VERSION_PATH = join(process.cwd(), "version.txt");

export const schema = arktype.type({
  version: "semver";
});

type Response = {
  written: boolean;
};

export const PUT: Method.PUT<Response, typeof schema.infer> = async (event, context) => {
  const { version } = event.parsedBody;

  return writeFile(TARGET_VERSION_PATH, version, "utf-8")
    .then(() => ({ status: 200, body: { written: true } }))
    .catch(() => ({ status: 500, body: { written: false } }));
};
```

### @runes/router-esbuild

An extension to the [@runes/router]() package which serves during the build-step of Serverless with ESBuild, which ensures that the API source files for the router are understood by the serverless framework.
