import type { VariableDeclaration, FunctionDeclaration } from "@babel/types";
import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import { readFileSync } from "fs";

export const listFileExports = (path: string) => {
  const contents = readFileSync(path, "utf-8");
  const ast = parse(contents, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const exports: (VariableDeclaration | FunctionDeclaration)[] = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const declaration = path.get("declaration");
      if (
        declaration.isFunctionDeclaration() ||
        declaration.isVariableDeclaration()
      )
        exports.push(declaration.node);
    },
  });

  return exports;
};
