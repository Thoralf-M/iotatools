// IOTA Names GraphQL utilities
import { GraphQlClient } from '../../utils/wasm-sdk';
// [GAP] GraphQLQueryResult type not in WASM SDK - use Value or any
// [GAP] graphql tagged template not in WASM SDK - use GraphQlClient.runQuery() with raw strings

import { getSelectedNetworkConfig } from '../../utils/client';

/**
 * Generic GraphQL query function
 */
export async function queryGraphQl(
    gqlClient: GraphQlClient,
    query: string,
    variables: Record<string, any>,
): Promise<any> {
    const resultStr = await gqlClient.runQuery({
        query,
        variables: JSON.stringify(variables),
    });
    return JSON.parse(resultStr);
}

/**
 * Create a new GraphQL client
 */
export function createGraphQLClient(): GraphQlClient {
    return new GraphQlClient(getSelectedNetworkConfig().graphql);
}
