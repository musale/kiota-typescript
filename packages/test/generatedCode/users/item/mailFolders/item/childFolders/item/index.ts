/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
import { createMailFolderFromDiscriminatorValue, serializeMailFolder, type MailFolder } from '../../../../../../models/';
import { createODataErrorFromDiscriminatorValue, type ODataError } from '../../../../../../models/oDataErrors/';
import { MessageRulesRequestBuilderNavigationMetadata, MessageRulesRequestBuilderRequestsMetadata, MessageRulesRequestBuilderUriTemplate, type MessageRulesRequestBuilder } from './messageRules/';
import { MessagesRequestBuilderNavigationMetadata, MessagesRequestBuilderRequestsMetadata, MessagesRequestBuilderUriTemplate, type MessagesRequestBuilder } from './messages/';
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /users/{user-id}/mailFolders/{mailFolder-id}/childFolders/{mailFolder-id1}
 */
export interface MailFolderItemRequestBuilder extends BaseRequestBuilder<MailFolderItemRequestBuilder> {
    /**
     * The messageRules property
     */
    get messageRules(): MessageRulesRequestBuilder;
    /**
     * The messages property
     */
    get messages(): MessagesRequestBuilder;
    /**
     * Delete navigation property childFolders for users
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a Promise of ArrayBuffer
     */
     delete(requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<ArrayBuffer | undefined>;
    /**
     * The collection of child folders in the mailFolder.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a Promise of MailFolder
     */
     get(requestConfiguration?: RequestConfiguration<MailFolderItemRequestBuilderGetQueryParameters> | undefined) : Promise<MailFolder | undefined>;
    /**
     * Update the navigation property childFolders in users
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a Promise of MailFolder
     */
     patch(body: MailFolder, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<MailFolder | undefined>;
    /**
     * Delete navigation property childFolders for users
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a RequestInformation
     */
     toDeleteRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
    /**
     * The collection of child folders in the mailFolder.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a RequestInformation
     */
     toGetRequestInformation(requestConfiguration?: RequestConfiguration<MailFolderItemRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
    /**
     * Update the navigation property childFolders in users
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a RequestInformation
     */
     toPatchRequestInformation(body: MailFolder, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * The collection of child folders in the mailFolder.
 */
export interface MailFolderItemRequestBuilderGetQueryParameters {
    /**
     * Expand related entities
     */
    expand?: string[];
    /**
     * Include Hidden Folders
     */
    includeHiddenFolders?: string;
    /**
     * Select properties to be returned
     */
    select?: string[];
}
/**
 * Mapper for query parameters from symbol name to serialization name represented as a constant.
 */
const MailFolderItemRequestBuilderGetQueryParametersMapper: Record<string, string> = {
    "expand": "%24expand",
    "select": "%24select",
};
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const MailFolderItemRequestBuilderNavigationMetadata: Record<Exclude<keyof MailFolderItemRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    messageRules: {
        uriTemplate: MessageRulesRequestBuilderUriTemplate,
        requestsMetadata: MessageRulesRequestBuilderRequestsMetadata,
        navigationMetadata: MessageRulesRequestBuilderNavigationMetadata,
    },
    messages: {
        uriTemplate: MessagesRequestBuilderUriTemplate,
        requestsMetadata: MessagesRequestBuilderRequestsMetadata,
        navigationMetadata: MessagesRequestBuilderNavigationMetadata,
    },
};
/**
 * Metadata for all the requests in the request builder.
 */
export const MailFolderItemRequestBuilderRequestsMetadata: Record<string, RequestMetadata> = {
    "delete": {
        responseBodyContentType: "application/json",
        errorMappings: {
            "4XX": createODataErrorFromDiscriminatorValue,
            "5XX": createODataErrorFromDiscriminatorValue,
        } as Record<string, ParsableFactory<Parsable>>,
        adapterMethodName: "sendPrimitiveAsync",
        responseBodyFactory:  "ArrayBuffer",
    },
    "get": {
        responseBodyContentType: "application/json",
        errorMappings: {
            "4XX": createODataErrorFromDiscriminatorValue,
            "5XX": createODataErrorFromDiscriminatorValue,
        } as Record<string, ParsableFactory<Parsable>>,
        adapterMethodName: "sendAsync",
        responseBodyFactory:  createMailFolderFromDiscriminatorValue,
        queryParametersMapper: MailFolderItemRequestBuilderGetQueryParametersMapper,
    },
    "patch": {
        responseBodyContentType: "application/json",
        errorMappings: {
            "4XX": createODataErrorFromDiscriminatorValue,
            "5XX": createODataErrorFromDiscriminatorValue,
        } as Record<string, ParsableFactory<Parsable>>,
        adapterMethodName: "sendAsync",
        responseBodyFactory:  createMailFolderFromDiscriminatorValue,
        requestBodyContentType: "application/json",
        requestBodySerializer: serializeMailFolder,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/**
 * Uri template for the request builder.
 */
export const MailFolderItemRequestBuilderUriTemplate = "{+baseurl}/users/{user%2Did}/mailFolders/{mailFolder%2Did}/childFolders/{mailFolder%2Did1}{?includeHiddenFolders,%24select,%24expand}";
/* tslint:enable */
/* eslint-enable */
