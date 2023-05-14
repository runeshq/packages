import type { Type } from "arktype";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

type InferredType = Type["infer"];

type MaybePromise<T> = Promise<T> | T;

type APIGatewayNoBodyContext = Omit<APIGatewayProxyEvent, "body">;

type APIGatewayResult<ResponseSchema> = MaybePromise<
  Omit<APIGatewayProxyResult, "body"> & { body: ResponseSchema }
>;

type APIGatewayEventWithParsedBody<RequestSchema extends InferredType> =
  APIGatewayProxyEvent & { parsedBody: RequestSchema };

type StructuredAPIGatewayMethodHandler<
  ResponseSchema,
  RequestSchema extends InferredType
> = (
  event: APIGatewayEventWithParsedBody<RequestSchema>,
  context: Context
) => APIGatewayResult<ResponseSchema>;

type UnstructuredAPIGatewayMethodHandler<ResponseSchema> = (
  event: APIGatewayNoBodyContext,
  context: Context
) => APIGatewayResult<ResponseSchema>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Method {
  export type GET<ResponseStructure> =
    UnstructuredAPIGatewayMethodHandler<ResponseStructure>;

  export type HEAD<ResponseStructure> =
    UnstructuredAPIGatewayMethodHandler<ResponseStructure>;

  export type OPTIONS<ResponseStructure> =
    UnstructuredAPIGatewayMethodHandler<ResponseStructure>;

  export type POST<
    ResponseStructure,
    RequestStructure extends InferredType
  > = StructuredAPIGatewayMethodHandler<ResponseStructure, RequestStructure>;

  export type PUT<
    ResponseStructure,
    RequestStructure extends InferredType
  > = StructuredAPIGatewayMethodHandler<ResponseStructure, RequestStructure>;

  export type PATCH<
    ResponseStructure,
    RequestStructure extends InferredType
  > = StructuredAPIGatewayMethodHandler<ResponseStructure, RequestStructure>;

  export type DELETE<
    ResponseStructure,
    RequestStructure extends InferredType
  > = StructuredAPIGatewayMethodHandler<ResponseStructure, RequestStructure>;
}

export type Middleware = (
  event: APIGatewayProxyEvent,
  context: Context
) => MaybePromise<APIGatewayProxyResult | null | undefined | void>;

export type Middlewares = Middleware[];
