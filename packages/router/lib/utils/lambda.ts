import { join, relative } from "path";
import { listFileExports } from "./ast";
import type { AWS } from "@serverless/typescript";
import type { mapDirectoryToRoutes } from "./filesystem";

type DirectoryMap = ReturnType<typeof mapDirectoryToRoutes>;

export const createFunctions = (
  basePath: string,
  directories: DirectoryMap,
  serviceName: string
) => {
  return directories.reduce<AWS["functions"]>(
    (accumulator, { path, fullPath }) => {
      const name = path.split("/").pop() ?? "";
      const exportNames = listFileExports(fullPath).flatMap((exp) => {
        if (exp.type === "FunctionDeclaration") return exp.id?.name;
        if (
          exp.type === "VariableDeclaration" &&
          "name" in exp.declarations[0].id
        )
          return exp.declarations[0].id.name;

        return [];
      });

      const methodNames = exportNames.filter(
        (value) => value !== "schema" && value !== "middleware"
      );

      const parsedPath = path
        .replace(/\[([\w-]*)\]/, "{$1}")
        .replace(/\[([\w-]*)\+]/, "{$1+}");

      const events = methodNames.map((methodName) => ({
        http: {
          method: methodName?.toLowerCase() ?? "any",
          path: join(serviceName, parsedPath),
        },
      }));

      const fullHandlerPath = join(
        basePath,
        "../..",
        "src",
        "routes",
        path + ".main"
      ).replace(/\/\.main/g, "/index.main");

      const relativeHandlerPath = relative(process.cwd(), fullHandlerPath);
      const pathName = `${serviceName}_${name.replace(/[\[\]\+]/g, "_")}`;

      return {
        ...accumulator,
        [pathName]: { handler: relativeHandlerPath, memorySize: 256, events },
      };
    },
    {}
  );
};
