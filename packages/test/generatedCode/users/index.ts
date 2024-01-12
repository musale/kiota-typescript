/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
import { type UserItemRequestBuilder, UserItemRequestBuilderNavigationMetadata, UserItemRequestBuilderUriTemplate } from './item/';
import { type BaseRequestBuilder, type KeysToExcludeForNavigationMetadata, type NavigationMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /users
 */
export interface UsersRequestBuilder extends BaseRequestBuilder<UsersRequestBuilder> {
    /**
     * Gets an item from the ApiSdk.users.item collection
     * @param userId The unique identifier of user
     * @returns a UserItemRequestBuilder
     */
     byUserId(userId: string) : UserItemRequestBuilder;
}
/**
 * Metadata for all the navigation properties in the request builder.
 */
export const UsersRequestBuilderNavigationMetadata: Record<Exclude<keyof UsersRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    byUserId: {
        uriTemplate: UserItemRequestBuilderUriTemplate,
        navigationMetadata: UserItemRequestBuilderNavigationMetadata,
        pathParametersMappings: ["user%2Did"],
    },
};
/**
 * Uri template for the request builder.
 */
export const UsersRequestBuilderUriTemplate = "{+baseurl}/users";
/* tslint:enable */
/* eslint-enable */
