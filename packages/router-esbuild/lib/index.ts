import { readFileSync } from "fs";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";
import type { Plugin, PluginBuild } from "esbuild";
import { mainHandlerCodeblock } from "./codeblocks/handler";

type HandleLoadParameters = Parameters<
  Parameters<PluginBuild["onLoad"]>["1"]
>["0"];

const transpileTypescript = (content: string) => {
  return transpileModule(content, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES5,
    },
  }).outputText;
};

const HANDLER_CODEBLOCK = parse(mainHandlerCodeblock.join("\n"), {
  sourceType: "module",
  plugins: ["typescript"],
});

interface MaxRouterPluginOptions {
  basePath: string;
}

const createRouterLoader = (basePath: string) => {
  const routerPathRegex = new RegExp(`${basePath}\/(?:.*)\.(js|ts)$`);

  return {
    filter: routerPathRegex,
    handleLoad: (parameters: HandleLoadParameters) => {
      const contents = readFileSync(parameters.path, "utf-8");
      const transpiled = transpileTypescript(contents);
      const abstractSyntaxTree = parse(transpiled, {
        sourceType: "module",
        plugins: ["typescript"],
      });

      abstractSyntaxTree.program.body.push(...HANDLER_CODEBLOCK.program.body);

      return {
        contents: transpileTypescript(generate(abstractSyntaxTree, {}).code),
      };
    },
  };
};

export const MaxRouterPlugin = ({
  basePath,
}: MaxRouterPluginOptions): Plugin => {
  return {
    name: "@maxrewards/maxrouter-esbuild",
    setup: ({ onLoad }) => {
      const { filter, handleLoad } = createRouterLoader(basePath);
      onLoad({ filter }, handleLoad);
    },
  };
};
