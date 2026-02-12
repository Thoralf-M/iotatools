import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';

type GraphQLObjectNode = {
    address: string;
    owner: any;
    previousTransactionBlock: any;
    asMoveObject: any;
};

type ObjectsResponse = {
    nodes: GraphQLObjectNode[];
    pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
    };
} | null;

export function detectInputType(input: string): 'hex' | 'type' | null {
    const trimmed = input.trim();

    // Check if it's a hex address (0x followed by hex characters)
    if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
        return 'hex';
    }

    // Check if it's a type (contains ::)
    if (trimmed.includes('::')) {
        return 'type';
    }

    return null;
}

export async function fetchSingleObjectData(objectId: string, graphqlUrl: string) {
    const graphqlClient = new IotaGraphQLClient({
        url: graphqlUrl,
    });

    const result = await graphqlClient.query({
        query: `
            query GetObject($id: IotaAddress!) {
                object(address: $id) {
                    address
                    owner {
                        ... on AddressOwner {
                            owner {
                                address
                            }
                        }
                        ... on Shared {
                            initialSharedVersion
                        }
                    }
                    previousTransactionBlock {
                        digest
                    }
                    asMoveObject {
                        contents {
                            type {
                                repr
                            }
                            json
                        }
                    }
                    asMovePackage {
                        modules {
                            nodes {
                                name
                            }
                        }
                    }
                }
            }
        `,
        variables: {
            id: objectId,
        },
    });

    return result.data?.object;
}

export async function fetchObjectsByTypeData(
    type: string,
    graphqlUrl: string,
    cursor: string | null = null,
    first: number = 1,
): Promise<ObjectsResponse> {
    const graphqlClient = new IotaGraphQLClient({
        url: graphqlUrl,
    });

    const result = await graphqlClient.query({
        query: `
            query GetObjects($type: String!, $cursor: String, $first: Int!) {
                objects(filter: { type: $type }, after: $cursor, first: $first) {
                    nodes {
                        address
                        owner {
                            ... on AddressOwner {
                                owner {
                                    address
                                }
                            }
                            ... on Shared {
                                initialSharedVersion
                            }
                        }
                        previousTransactionBlock {
                            digest
                        }
                        asMoveObject {
                            contents {
                                type {
                                    repr
                                }
                                json
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        `,
        variables: {
            type,
            cursor,
            first,
        },
    });

    return (result.data?.objects as ObjectsResponse) || null;
}

type PackageVersionNode = {
    address: string;
    version: number;
};

type PackageVersionsResponse = {
    nodes: PackageVersionNode[];
    pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
    };
} | null;

export async function fetchPackageVersionsData(
    packageAddress: string,
    graphqlUrl: string,
    cursor: string | null = null,
    first: number = 10,
): Promise<PackageVersionsResponse> {
    const graphqlClient = new IotaGraphQLClient({
        url: graphqlUrl,
    });

    const result = await graphqlClient.query({
        query: `
            query GetPackageVersions($address: IotaAddress!, $cursor: String, $first: Int!) {
                packageVersions(address: $address, after: $cursor, first: $first) {
                    nodes {
                        address
                        version
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        `,
        variables: {
            address: packageAddress,
            cursor,
            first,
        },
    });

    return (result.data?.packageVersions as PackageVersionsResponse) || null;
}

export async function fetchPackageTypesData(packageId: string, graphqlUrl: string) {
    const graphqlClient = new IotaGraphQLClient({
        url: graphqlUrl,
    });

    const result = await graphqlClient.query({
        query: `
            query GetPackage($address: IotaAddress!) {
                package(address: $address) {
                    address
                    modules {
                        nodes {
                            name
                            structs {
                                nodes {
                                    name
                                    abilities
                                    typeParameters {
                                        constraints
                                    }
                                    fields {
                                        name
                                        type {
                                            repr
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        variables: {
            address: packageId,
        },
    });

    const pkg = result.data?.package as any;
    if (!pkg) {
        return [];
    }

    // Extract all types from modules
    const types: any[] = [];
    if (pkg.modules && pkg.modules.nodes) {
        pkg.modules.nodes.forEach((module: any) => {
            if (module.structs && module.structs.nodes) {
                module.structs.nodes.forEach((struct: any) => {
                    // Only include structs with KEY ability
                    if (struct.abilities && struct.abilities.includes('KEY')) {
                        types.push({
                            fullType: `${pkg.address}::${module.name}::${struct.name}`,
                            displayType: `${module.name}::${struct.name}`,
                            module: module.name,
                            name: struct.name,
                            abilities: struct.abilities,
                            fields: struct.fields,
                        });
                    }
                });
            }
        });
    }

    return types;
}
