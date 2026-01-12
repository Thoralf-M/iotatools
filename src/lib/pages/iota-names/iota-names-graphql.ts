// IOTA Names GraphQL utilities
import {
    IotaGraphQLClient,
    type GraphQLQueryOptions,
    type GraphQLQueryResult,
} from '@iota/iota-sdk/graphql';
import { graphql } from '@iota/iota-sdk/graphql/schemas/2025.2';

import { getSelectedNetworkConfig } from '../../utils/client';

/**
 * Generic GraphQL query function
 */
export async function queryGraphQl(
    gqlClient: IotaGraphQLClient,
    query: string,
    variables: Record<string, any>,
): Promise<GraphQLQueryResult> {
    const options: GraphQLQueryOptions = {
        query: graphql(query),
        variables,
    };
    return gqlClient.query(options);
}

/**
 * Create a new GraphQL client
 */
export function createGraphQLClient(): IotaGraphQLClient {
    return new IotaGraphQLClient({
        url: getSelectedNetworkConfig().graphql,
    });
}
