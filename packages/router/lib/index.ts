import type { AWS, AwsLambdaEnvironment } from "@serverless/typescript";
import { mapDirectoryToRoutes } from "./utils/filesystem";
import { createFunctions } from "./utils/lambda";
import { createServiceConfiguration } from "./utils/serverless-configuration";

interface CreateServiceOptions {
  basePath: string;
  port?: number;
  environment?: AwsLambdaEnvironment;
}

export const createService = async (
  serviceName: string,
  { basePath, port = 3000, environment }: CreateServiceOptions
): Promise<AWS> => {
  const directories = mapDirectoryToRoutes(basePath).map(
    ({ path, fullPath }) => ({ path, fullPath })
  );

  const functions = createFunctions(basePath, directories, serviceName);
  return createServiceConfiguration(serviceName, functions, port, environment);
};

export * as arktype from "arktype";
export * from "./types/methods";
