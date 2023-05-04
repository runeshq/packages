import type { AWS, AwsLambdaEnvironment } from "@serverless/typescript";

export const createServiceConfiguration = (
  serviceName: string,
  functions: AWS["functions"],
  port: number,
  environment?: AwsLambdaEnvironment
) =>
  ({
    service: serviceName,
    frameworkVersion: "3.28.1",
    plugins: ["serverless-esbuild", "serverless-offline"],
    useDotenv: true,
    provider: {
      name: "aws",
      runtime: "nodejs16.x",
      stage: "dev",
      region: "us-east-1",
      environment,
    },
    functions,
    custom: {
      esbuild: {
        bundle: true,
        minify: false,
        sourcemap: true,
        exclude: ["aws-sdk"],
        target: "node16",
        define: { "require.resolve": undefined },
        platform: "node",
        concurrency: 10,
        plugins: "plugins.config.ts",
      },
      "serverless-offline": {
        httpPort: port,
        lambdaPort: port + 1,
      },
    },
  } satisfies AWS);
