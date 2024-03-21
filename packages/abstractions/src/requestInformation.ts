/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { trace } from "@opentelemetry/api";
import { StdUriTemplate } from "@std-uritemplate/std-uritemplate";

import { DateOnly } from "./dateOnly";
import { Duration } from "./duration";
import { Headers } from "./headers";
import { type HttpMethod } from "./httpMethod";
import { MultipartBody } from "./multipartBody";
import { createRecordWithCaseInsensitiveKeys } from "./recordWithCaseInsensitiveKeys";
import type {
  PrimitiveTypesForDeserializationType,
  RequestAdapter,
} from "./requestAdapter";
import type { RequestConfiguration } from "./requestConfiguration";
import type { RequestOption } from "./requestOption";
import type {
  ModelSerializerFunction,
  Parsable,
  SerializationWriter,
} from "./serialization";
import { TimeOnly } from "./timeOnly";

/** This class represents an abstract HTTP request. */
export class RequestInformation implements RequestInformationSetContent {
  /**
   * Initializes a request information instance with the provided values.
   * @param httpMethod The HTTP method for the request.
   * @param urlTemplate The URL template for the request.
   * @param pathParameters The path parameters for the request.
   */
  public constructor(
    httpMethod?: HttpMethod,
    urlTemplate?: string,
    pathParameters?: Record<string, unknown>,
  ) {
    if (httpMethod) {
      this.httpMethod = httpMethod;
    }
    if (urlTemplate) {
      this.urlTemplate = urlTemplate;
    }
    if (pathParameters) {
      this.pathParameters = pathParameters;
    }
  }
  /** The URI of the request. */
  private uri?: string;
  /** The path parameters for the request. */
  public pathParameters: Record<string, unknown> =
    createRecordWithCaseInsensitiveKeys<unknown>();
  /** The URL template for the request */
  public urlTemplate?: string;
  /** Gets the URL of the request  */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public get URL(): string {
    const rawUrl = this.pathParameters[
      RequestInformation.raw_url_key
    ] as string;
    if (this.uri) {
      return this.uri;
    } else if (rawUrl) {
      this.URL = rawUrl;
      return rawUrl;
    } else if (!this.queryParameters) {
      throw new Error("queryParameters cannot be undefined");
    } else if (!this.pathParameters) {
      throw new Error("pathParameters cannot be undefined");
    } else if (!this.urlTemplate) {
      throw new Error("urlTemplate cannot be undefined");
    } else {
      const data = {} as { [key: string]: unknown };
      for (const key in this.queryParameters) {
        if (this.queryParameters[key] !== null && this.queryParameters[key] !== undefined) {
          data[key] = this.queryParameters[key];
        }
      }
      for (const key in this.pathParameters) {
        if (this.pathParameters[key]) {
          data[key] = this.pathParameters[key];
        }
      }
      return StdUriTemplate.expand(this.urlTemplate, data);
    }
  }
  /** Sets the URL of the request */
  public set URL(url: string) {
    if (!url) throw new Error("URL cannot be undefined");
    this.uri = url;
    this.queryParameters = {};
    this.pathParameters = {};
  }
  public static raw_url_key = "request-raw-url";
  /** The HTTP method for the request */
  public httpMethod?: HttpMethod;
  /** The Request Body. */
  public content?: ArrayBuffer;
  /** The Query Parameters of the request. */
  public queryParameters: Record<
    string,
    string | number | boolean | undefined
  > = createRecordWithCaseInsensitiveKeys<
    string | number | boolean | undefined
  >();
  /** The Request Headers. */
  public headers: Headers = new Headers();
  private _requestOptions: Record<string, RequestOption> =
    createRecordWithCaseInsensitiveKeys<RequestOption>();
  /** Gets the request options for the request. */
  public getRequestOptions() {
    return this._requestOptions;
  }
  /** Adds the headers for the request. */
  public addRequestHeaders(
    source: Record<string, string | string[]> | undefined,
  ) {
    if (source) {
      this.headers.addAllRaw(source);
    }
  }
  /** Adds the request options for the request. */
  public addRequestOptions(options: RequestOption[] | undefined) {
    if (!options || options.length === 0) return;
    options.forEach((option) => {
      this._requestOptions[option.getKey()] = option;
    });
  }
  /** Removes the request options for the request. */
  public removeRequestOptions(...options: RequestOption[]) {
    if (!options || options.length === 0) return;
    options.forEach((option) => {
      delete this._requestOptions[option.getKey()];
    });
  }
  private static readonly binaryContentType = "application/octet-stream";
  private static readonly contentTypeHeader = "Content-Type";
  private static readonly tracerKey = "@microsoft/kiota-abstractions";
  private static readonly requestTypeKey = "com.microsoft.kiota.request.type";
  /**
   * Sets the request body from a model with the specified content type.
   * @param value the models.
   * @param contentType the content type.
   * @param requestAdapter The adapter service to get the serialization writer from.
   * @typeParam T the model type.
   */
  public setContentFromParsable = <T extends Parsable>(
    requestAdapter?: RequestAdapter | undefined,
    contentType?: string | undefined,
    value?: T[] | T,
    modelSerializerFunction?: ModelSerializerFunction<T>,
  ): void => {
    trace
      .getTracer(RequestInformation.tracerKey)
      .startActiveSpan("setContentFromParsable", (span) => {
        try {
          const writer = this.getSerializationWriter(
            requestAdapter,
            contentType,
            value,
          );
          if (value instanceof MultipartBody) {
            contentType += "; boundary=" + value.getBoundary();
          }
          if (!this.headers) {
            this.headers = new Headers();
          }

          if (Array.isArray(value)) {
            span.setAttribute(RequestInformation.requestTypeKey, "object[]");
            writer.writeCollectionOfObjectValues(
              undefined,
              value,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              modelSerializerFunction,
            );
          } else {
            span.setAttribute(RequestInformation.requestTypeKey, "object");
            writer.writeObjectValue(undefined, value, modelSerializerFunction);
          }
          this.setContentAndContentType(writer, contentType);
        } finally {
          span.end();
        }
      });
  };
  private readonly setContentAndContentType = (
    writer: SerializationWriter,
    contentType?: string | undefined,
  ) => {
    if (contentType) {
      this.headers.tryAdd(RequestInformation.contentTypeHeader, contentType);
    }
    this.content = writer.getSerializedContent();
  };
  private readonly getSerializationWriter = <T>(
    requestAdapter?: RequestAdapter | undefined,
    contentType?: string | undefined,
    ...values: T[]
  ): SerializationWriter => {
    if (!requestAdapter) throw new Error("httpCore cannot be undefined");
    if (!contentType) throw new Error("contentType cannot be undefined");
    if (!values || values.length === 0) {
      throw new Error("values cannot be undefined or empty");
    }
    return requestAdapter
      .getSerializationWriterFactory()
      .getSerializationWriter(contentType);
  };
  /**
   * Sets the request body from a model with the specified content type.
   * @param value the scalar values to serialize.
   * @param contentType the content type.
   * @param requestAdapter The adapter service to get the serialization writer from.
   * @typeParam T the model type.
   */
  public setContentFromScalar = <
    T extends PrimitiveTypesForDeserializationType,
  >(
    requestAdapter: RequestAdapter | undefined,
    contentType: string | undefined,
    value: T[] | T,
  ): void => {
    trace
      .getTracer(RequestInformation.tracerKey)
      .startActiveSpan("setContentFromScalar", (span) => {
        try {
          const writer = this.getSerializationWriter(
            requestAdapter,
            contentType,
            value,
          );
          if (!this.headers) {
            this.headers = new Headers();
          }

          if (Array.isArray(value)) {
            span.setAttribute(RequestInformation.requestTypeKey, "[]");
            writer.writeCollectionOfPrimitiveValues(undefined, value);
          } else {
            const valueType = typeof value;
            span.setAttribute(RequestInformation.requestTypeKey, valueType);
            if (!value) {
              writer.writeNullValue(undefined);
            } else if (valueType === "boolean") {
              writer.writeBooleanValue(undefined, value as any as boolean);
            } else if (valueType === "string") {
              writer.writeStringValue(undefined, value as any as string);
            } else if (value instanceof Date) {
              writer.writeDateValue(undefined, value as any as Date);
            } else if (value instanceof DateOnly) {
              writer.writeDateOnlyValue(undefined, value as any as DateOnly);
            } else if (value instanceof TimeOnly) {
              writer.writeTimeOnlyValue(undefined, value as any as TimeOnly);
            } else if (value instanceof Duration) {
              writer.writeDurationValue(undefined, value as any as Duration);
            } else if (valueType === "number") {
              writer.writeNumberValue(undefined, value as any as number);
            } else if (Array.isArray(value)) {
              writer.writeCollectionOfPrimitiveValues(undefined, value);
            } else {
              throw new Error(
                `encountered unknown value type during serialization ${valueType}`,
              );
            }
          }
          this.setContentAndContentType(writer, contentType);
        } finally {
          span.end();
        }
      });
  };
  /**
   * Sets the request body to be a binary stream.
   * @param value the binary stream
   * @param contentType the content type.
   */
  public setStreamContent = (
    value: ArrayBuffer,
    contentType?: string,
  ): void => {
    if (!contentType) {
      contentType = RequestInformation.binaryContentType;
    }
    this.headers.tryAdd(RequestInformation.contentTypeHeader, contentType);
    this.content = value;
  };
  /**
   * Sets the query string parameters from a raw object.
   * @param parameters the parameters.
   * @param p the mapping from code symbol to URI template parameter name.
   */
  public setQueryStringParametersFromRawObject<T extends object>(
    q?: T,
    p?: Record<string, string>,
  ): void {
    if (q === null || q === undefined) return;
    Object.entries(q).forEach(([k, v]) => {
      let key = k;
      if (p) {
        const keyCandidate = p[key];
        if (keyCandidate) {
          key = keyCandidate;
        }
      }
      this.queryParameters[key] = v;
    });
  }
  /**
   * Configure the current request with headers, query parameters and options.
   * @param config the configuration object to use.
   * @param queryParametersMapper mapping between code symbols and URI template parameter names.
   */
  public configure<T extends object>(
    config?: RequestConfiguration<T>,
    queryParametersMapper?: Record<string, string>,
  ): void {
    if (!config) return;
    this.addRequestHeaders(config.headers);
    this.setQueryStringParametersFromRawObject(
      config.queryParameters,
      queryParametersMapper,
    );
    this.addRequestOptions(config.options);
  }
}
/**
 * Describes the contract of request adapter set content methods so it can be used in request metadata.
 */
export interface RequestInformationSetContent {
  setStreamContent(value: ArrayBuffer, contentType?: string): void;
  setContentFromScalar<T extends PrimitiveTypesForDeserializationType>(
    requestAdapter: RequestAdapter | undefined,
    contentType: string | undefined,
    value: T[] | T,
  ): void;
  setContentFromParsable<T extends Parsable>(
    requestAdapter?: RequestAdapter | undefined,
    contentType?: string | undefined,
    value?: T[] | T,
    modelSerializerFunction?: ModelSerializerFunction<T>,
  ): void;
}
