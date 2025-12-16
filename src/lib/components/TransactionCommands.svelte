<script lang="ts">
    import { bcs, fromB64 } from '@iota/bcs';
    import { IotaGraphQLClient } from '@iota/iota-sdk/graphql';

    import { getSelectedNetworkConfig } from '../lib/client';
    import { getObjectLink } from '../lib/explorer-links';

    let { transactionData } = $props();

    // Helper to safely access nested properties
    function getPTB(data: any) {
        // Node API format: transaction.data.transaction
        if (data?.transaction?.data?.transaction?.kind === 'ProgrammableTransaction') {
            return data.transaction.data.transaction;
        }

        // Decoded BCS format
        if (data?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction) {
            return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction;
        }

        // Direct transaction format
        if (data?.input?.transaction) {
            return data.input.transaction;
        }

        // Direct PTB format
        if (data?.kind === 'ProgrammableTransaction') {
            return data;
        }

        return null;
    }

    // Helper to get inputs from various data formats
    function getInputs(data: any, ptbData: any) {
        // If PTB has inputs directly, use them
        if (ptbData?.inputs) {
            return ptbData.inputs;
        }

        // GraphQL format: inputs might be at transaction.data.transaction.inputs
        if (data?.transaction?.data?.transaction?.inputs) {
            return data.transaction.data.transaction.inputs;
        }

        // Node API format in rawTransaction
        if (data?.rawTransaction) {
            try {
                const raw =
                    typeof data.rawTransaction === 'string'
                        ? JSON.parse(data.rawTransaction)
                        : data.rawTransaction;
                if (raw?.inputs) {
                    return raw.inputs;
                }
            } catch {}
        }

        // Decoded BCS format
        if (data?.decodedBCS?.intentMessage?.value?.V1?.kind?.ProgrammableTransaction?.inputs) {
            return data.decodedBCS.intentMessage.value.V1.kind.ProgrammableTransaction.inputs;
        }

        // Direct transaction format
        if (data?.input?.transaction?.inputs) {
            return data.input.transaction.inputs;
        }

        return [];
    }

    let ptb = $derived(getPTB(transactionData));
    let inputs = $derived(getInputs(transactionData, ptb));
    let commands = $derived(ptb?.commands || ptb?.transactions || []);

    let expandedCommands = $state<Record<number, boolean>>({});
    let hoveredId = $state<string | null>(null);
    let packageCache = $state<Record<string, any>>({});
    let loadingPackages = $state<Record<string, boolean>>({});
    let packageErrors = $state<Record<string, string>>({});
    let shortPackageIds = $state(true);
    let showTypeInfo = $state(true);
    let hasAutoFetched = $state(false);

    type Segment = {
        type:
            | 'text'
            | 'result'
            | 'result-def'
            | 'package'
            | 'module'
            | 'function'
            | 'object-id'
            | 'struct';
        value: string;
        id?: string;
        objectType?: string;
    };

    function toggle(i: number) {
        expandedCommands[i] = !expandedCommands[i];
    }

    function expandAll() {
        commands.forEach((_: any, i: number) => (expandedCommands[i] = true));
    }

    function collapseAll() {
        expandedCommands = {};
    }

    function trimAddress(address: string): string {
        const addr = address.toLowerCase().replace(/^0x/, '');
        const shortened = addr.replace(/^0+/, '') || '0';
        return `0x${shortened}`;
    }

    function decodePureValue(base64Bytes: string, type: string | null): string | null {
        if (!type) return null;

        try {
            const bytes = fromB64(base64Bytes);
            const uint8Array = new Uint8Array(bytes as any);

            // Extract the base type without references
            let baseType = type.replace(/^&(mut )?/, '');

            // Handle simple types
            if (baseType === 'bool') {
                return bcs.bool().parse(uint8Array).toString();
            } else if (baseType === 'u8') {
                return bcs.u8().parse(uint8Array).toString();
            } else if (baseType === 'u16') {
                return bcs.u16().parse(uint8Array).toString();
            } else if (baseType === 'u32') {
                return bcs.u32().parse(uint8Array).toString();
            } else if (baseType === 'u64') {
                return bcs.u64().parse(uint8Array).toString();
            } else if (baseType === 'u128') {
                return bcs.u128().parse(uint8Array).toString();
            } else if (baseType === 'u256') {
                return bcs.u256().parse(uint8Array).toString();
            } else if (baseType === 'address') {
                // Address is 32 bytes, convert to hex
                return `0x${Array.from(uint8Array)
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('')}`;
            } else if (baseType.startsWith('vector<u8>') || baseType === 'string') {
                // Try to decode as UTF-8 string
                try {
                    const str = new TextDecoder().decode(uint8Array);
                    // Check if it's printable
                    if (/^[\x20-\x7E\n\r\t]*$/.test(str)) {
                        return `"${str}"`;
                    }
                } catch {}
            }

            return null;
        } catch (e) {
            console.error('Failed to decode pure value:', e, 'type:', type);
            return null;
        }
    }

    function isHighlighted(segId: string | undefined, hId: string | null): boolean {
        if (!segId || !hId) return false;
        if (segId === hId) return true;

        const parse = (id: string) => {
            const firstColon = id.indexOf(':');
            if (firstColon === -1) return null;
            const type = id.substring(0, firstColon);
            const path = id.substring(firstColon + 1);
            const pathParts = path.split('::');
            if (pathParts.length !== 3) return { type, pkg: path, mod: '', fun: '' };
            return { type, pkg: pathParts[0], mod: pathParts[1], fun: pathParts[2] };
        };

        const h = parse(hId);
        const s = parse(segId);

        if (!h || !s) return false;

        if (h.type === 'obj') {
            return s.type === 'obj' && s.pkg === h.pkg;
        }

        if (h.type === 'pkg') {
            return s.type === 'pkg' && s.pkg === h.pkg;
        }

        if (h.type === 'mod') {
            if (s.pkg !== h.pkg || s.mod !== h.mod) return false;
            return s.type === 'pkg' || s.type === 'mod';
        }

        if (h.type === 'fun') {
            if (s.pkg !== h.pkg || s.mod !== h.mod || s.fun !== h.fun) return false;
            return s.type === 'pkg' || s.type === 'mod' || s.type === 'fun';
        }

        if (h.type === 'struct') {
            if (s.pkg !== h.pkg || s.mod !== h.mod || s.fun !== h.fun) return false;
            return s.type === 'pkg' || s.type === 'mod' || s.type === 'struct';
        }

        return false;
    }

    async function fetchPackageInfo(packageId: string) {
        if (packageCache[packageId] || loadingPackages[packageId]) {
            console.log('Skipping package (cached or loading):', packageId);
            return;
        }

        console.log('Fetching package info for:', packageId);
        loadingPackages[packageId] = true;
        packageErrors[packageId] = '';

        try {
            const gqlClient = new IotaGraphQLClient({
                url: getSelectedNetworkConfig().graphql,
            });

            const query = `
                query PackageQuery($address: IotaAddress!, $functionsCursor: String) {
                    package(address: $address) {
                        address
                        modules {
                            nodes {
                                name
                                functions(first: 20, after: $functionsCursor) {
                                    pageInfo {
                                        hasNextPage
                                        endCursor
                                    }
                                    nodes {
                                        name
                                        visibility
                                        isEntry
                                        typeParameters {
                                            constraints
                                        }
                                        parameters {
                                            repr
                                        }
                                        return {
                                            repr
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            let allModules: any[] = [];
            let hasMorePages = true;
            let cursor: string | null = null;

            // Fetch all pages
            while (hasMorePages) {
                const result: any = await gqlClient.query({
                    query,
                    variables: { address: packageId, functionsCursor: cursor },
                });

                if (!result.data?.package) {
                    packageErrors[packageId] = 'Package not found';
                    console.error('Package not found:', packageId);
                    break;
                }

                const modules: any[] = result.data.package.modules?.nodes || [];

                // Check if any module has more pages
                hasMorePages = false;
                for (const module of modules as any[]) {
                    if (module.functions?.pageInfo?.hasNextPage) {
                        hasMorePages = true;
                        cursor = module.functions.pageInfo.endCursor;
                        break;
                    }
                }

                // Merge functions from this page
                if (allModules.length === 0) {
                    allModules = modules.map((m: any) => ({
                        name: m.name,
                        functions: { nodes: m.functions?.nodes || [] },
                    }));
                } else {
                    modules.forEach((newModule: any, idx: number) => {
                        if (allModules[idx]) {
                            allModules[idx].functions.nodes.push(
                                ...(newModule.functions?.nodes || []),
                            );
                        }
                    });
                }

                if (!hasMorePages) {
                    packageCache[packageId] = {
                        address: result.data.package.address,
                        modules: { nodes: allModules },
                    };
                    console.log('Package data fetched:', packageId, packageCache[packageId]);
                }
            }
        } catch (error: any) {
            console.error('Error fetching package:', packageId, error);
            packageErrors[packageId] = error.message || 'Failed to fetch package info';
        } finally {
            loadingPackages[packageId] = false;
        }
    }

    function getFunctionInfo(packageId: string, moduleName: string, functionName: string) {
        if (!showTypeInfo) return null;

        const pkg = packageCache[packageId];
        if (!pkg) return null;

        const module = pkg.modules?.nodes?.find((m: any) => m.name === moduleName);
        if (!module) return null;

        return module.functions?.nodes?.find((f: any) => f.name === functionName);
    }

    function getUsage(cmdIndex: number, allCommands: any[]): Segment[] {
        let maxNestedIndex = -1;
        let usedAsResult = false;

        const checkArg = (arg: any) => {
            if (!arg) return;
            if (arg.Result === cmdIndex) {
                usedAsResult = true;
            }
            if (arg.NestedResult && arg.NestedResult[0] === cmdIndex) {
                maxNestedIndex = Math.max(maxNestedIndex, arg.NestedResult[1]);
            }
        };

        const traverse = (obj: any) => {
            if (!obj) return;
            if (Array.isArray(obj)) {
                obj.forEach(traverse);
                return;
            }
            if (typeof obj === 'object') {
                if (
                    'Result' in obj ||
                    'NestedResult' in obj ||
                    'Input' in obj ||
                    'GasCoin' in obj
                ) {
                    checkArg(obj);
                }
                if (obj.$kind === 'Result' || obj.$kind === 'NestedResult') {
                    if (obj.Result === cmdIndex) usedAsResult = true;
                    if (obj.NestedResult && obj.NestedResult[0] === cmdIndex) {
                        maxNestedIndex = Math.max(maxNestedIndex, obj.NestedResult[1]);
                    }
                    return;
                }
                Object.values(obj).forEach(traverse);
            }
        };

        for (let i = cmdIndex + 1; i < allCommands.length; i++) {
            traverse(allCommands[i]);
        }

        if (maxNestedIndex !== -1) {
            const segments: Segment[] = [{ type: 'text', value: '-> (' }];
            for (let k = 0; k <= maxNestedIndex; k++) {
                if (k > 0) segments.push({ type: 'text', value: ', ' });
                segments.push({
                    type: 'result-def',
                    value: `Result(${cmdIndex}, ${k})`,
                    id: `result:${cmdIndex}:${k}`,
                });
            }
            segments.push({ type: 'text', value: ')' });
            return segments;
        }

        if (usedAsResult) {
            return [
                { type: 'text', value: '-> ' },
                {
                    type: 'result-def',
                    value: `Result(${cmdIndex})`,
                    id: `result:${cmdIndex}`,
                },
            ];
        }

        return [];
    }

    function resolveArgument(
        arg: any,
        full: boolean = false,
        paramType: string | null = null,
    ): Segment[] {
        if (arg === null || arg === undefined) return [{ type: 'text', value: 'undefined' }];

        // Handle string arguments like "GasCoin"
        if (typeof arg === 'string') {
            if (arg === 'GasCoin') {
                return [{ type: 'text', value: 'GasCoin' }];
            }
            return [{ type: 'text', value: arg }];
        }

        let kind = arg.$kind;
        let value = arg;

        if (!kind) {
            if ('Input' in arg) {
                kind = 'Input';
                value = arg.Input;
            } else if ('Result' in arg) {
                kind = 'Result';
                value = arg.Result;
            } else if ('NestedResult' in arg) {
                kind = 'NestedResult';
                value = arg.NestedResult;
            } else if ('GasCoin' in arg) {
                kind = 'GasCoin';
                value = true;
            }
        } else {
            value = arg[kind];
        }

        const segments: Segment[] = [];

        // Add parameter type if available
        if (paramType) {
            segments.push(...formatType(paramType, full, true));
            segments.push({ type: 'text', value: ': ' });
        }

        if (kind === 'Input') {
            const inputIndex = value;
            const input = inputs[inputIndex];
            if (!input) {
                segments.push({ type: 'text', value: `Input(${inputIndex})` });
                return segments;
            }

            // Handle GraphQL/Node API format: { type: "object", objectType: "immOrOwnedObject", objectId: "0x..." }
            if (input.type === 'object' && input.objectId) {
                const id = input.objectId;
                const trimmedId = trimAddress(id);
                const shortId = full
                    ? trimmedId
                    : shortPackageIds && trimmedId.length > 9
                      ? `${trimmedId.slice(0, 5)}...${trimmedId.slice(-3)}`
                      : `${trimmedId.slice(0, 6)}...${trimmedId.slice(-4)}`;

                let prefix = 'Object';
                let objectType = 'Object';

                if (input.objectType === 'immOrOwnedObject') {
                    prefix = 'ImmOrOwnedObject';
                    objectType = 'ImmOrOwnedObject';
                } else if (input.objectType === 'sharedObject') {
                    prefix = 'SharedObject';
                    objectType = 'SharedObject';
                } else if (input.objectType === 'receiving') {
                    prefix = 'Receiving';
                    objectType = 'Receiving';
                }

                segments.push({ type: 'text', value: `${prefix}(` });
                segments.push({
                    type: 'object-id',
                    value: shortId,
                    id: `obj:${id}`,
                    objectType,
                });
                segments.push({ type: 'text', value: ')' });
                return segments;
            }

            // Handle GraphQL/Node API format: { type: "pure", value: "..." }
            if (input.type === 'pure' && input.value) {
                // If input has valueType, the value is already decoded - just display it
                if (input.valueType) {
                    if (input.valueType === 'vector<u8>') {
                        // Try to decode as ASCII
                        try {
                            const uint8Array = new Uint8Array(input.value);
                            const str = new TextDecoder().decode(uint8Array);
                            // Check if it's printable ASCII (including spaces, newlines, tabs)
                            if (/^[\x20-\x7E\n\r\t]*$/.test(str)) {
                                const displayStr = full
                                    ? `"${str}"`
                                    : `"${str.slice(0, 10)}${str.length > 10 ? '...' : ''}"`;
                                segments.push({ type: 'text', value: `Pure(${displayStr})` });
                            } else {
                                // Display as byte array
                                const byteStr = JSON.stringify(input.value);
                                const val = full
                                    ? byteStr
                                    : `[${input.value.slice(0, 5).join(', ')}${input.value.length > 5 ? ', ...' : ''}]`;
                                segments.push({ type: 'text', value: `Pure(${val})` });
                            }
                        } catch (e) {
                            // Fallback to JSON stringify
                            const valueStr = JSON.stringify(input.value);
                            const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
                            segments.push({ type: 'text', value: `Pure(${val})` });
                        }
                    } else {
                        // For other types, just display as is
                        const valueStr =
                            typeof input.value === 'string'
                                ? input.value
                                : JSON.stringify(input.value);
                        const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
                        segments.push({ type: 'text', value: `Pure(${val})` });
                    }
                } else {
                    // Use paramType for decoding base64 bytes
                    const decodedValue = paramType ? decodePureValue(input.value, paramType) : null;
                    if (decodedValue) {
                        segments.push({ type: 'text', value: `Pure(${decodedValue})` });
                    } else {
                        const valueStr =
                            typeof input.value === 'string'
                                ? input.value
                                : JSON.stringify(input.value);
                        const val = full ? valueStr : `${valueStr.slice(0, 10)}...`;
                        segments.push({ type: 'text', value: `Pure(${val})` });
                    }
                }
                return segments;
            }

            // Handle standard format
            let inputKind = input.$kind;
            let inputValue = input;
            if (!inputKind) {
                if ('Object' in input) {
                    inputKind = 'Object';
                    inputValue = input.Object;
                } else if ('Pure' in input) {
                    inputKind = 'Pure';
                    inputValue = input.Pure;
                }
            } else {
                inputValue = input[inputKind];
            }

            if (inputKind === 'Object') {
                let obj = inputValue;
                if (obj.ImmOrOwnedObject) obj = obj.ImmOrOwnedObject;
                else if (obj.SharedObject) obj = obj.SharedObject;
                else if (obj.Receiving) obj = obj.Receiving;

                if (obj && obj.objectId) {
                    const id = obj.objectId;
                    const trimmedId = trimAddress(id);
                    const shortId = full
                        ? trimmedId
                        : shortPackageIds && trimmedId.length > 9
                          ? `${trimmedId.slice(0, 5)}...${trimmedId.slice(-3)}`
                          : `${trimmedId.slice(0, 6)}...${trimmedId.slice(-4)}`;
                    let prefix = 'Object';
                    let objectType = 'Object';
                    if (
                        inputValue.ImmOrOwnedObject ||
                        (input.Object && input.Object.ImmOrOwnedObject)
                    ) {
                        prefix = 'ImmOrOwnedObject';
                        objectType = 'ImmOrOwnedObject';
                    } else if (
                        inputValue.SharedObject ||
                        (input.Object && input.Object.SharedObject)
                    ) {
                        prefix = 'SharedObject';
                        objectType = 'SharedObject';
                    } else if (inputValue.Receiving || (input.Object && input.Object.Receiving)) {
                        prefix = 'Receiving';
                        objectType = 'Receiving';
                    }

                    segments.push({ type: 'text', value: `${prefix}(` });
                    segments.push({
                        type: 'object-id',
                        value: shortId,
                        id: `obj:${id}`,
                        objectType,
                    });
                    segments.push({ type: 'text', value: ')' });
                    return segments;
                }
                segments.push({ type: 'text', value: `Object(Input ${inputIndex})` });
                return segments;
            }
            if (inputKind === 'Pure') {
                if (inputValue.bytes) {
                    // Try to decode the value based on type information
                    const decodedValue = paramType
                        ? decodePureValue(inputValue.bytes, paramType)
                        : null;

                    if (decodedValue) {
                        segments.push({ type: 'text', value: `Pure(${decodedValue})` });
                    } else {
                        const val = full ? inputValue.bytes : `${inputValue.bytes.slice(0, 10)}...`;
                        segments.push({ type: 'text', value: `Pure(${val})` });
                    }
                    return segments;
                }
                segments.push({ type: 'text', value: `Pure(Input ${inputIndex})` });
                return segments;
            }
            segments.push({ type: 'text', value: `Input(${inputIndex})` });
            return segments;
        }

        if (kind === 'Result') {
            segments.push({ type: 'result', value: `Result(${value})`, id: `result:${value}` });
            return segments;
        }

        if (kind === 'NestedResult') {
            segments.push({
                type: 'result',
                value: `Result(${value[0]}, ${value[1]})`,
                id: `result:${value[0]}:${value[1]}`,
            });
            return segments;
        }

        if (kind === 'GasCoin') {
            segments.push({ type: 'text', value: 'GasCoin' });
            return segments;
        }

        segments.push({ type: 'text', value: JSON.stringify(arg) });
        return segments;
    }

    function formatType(type: string, full: boolean, interactive: boolean = true): Segment[] {
        const segments: Segment[] = [];

        // Handle reference types like &mut or &
        let refPrefix = '';
        let remainingType = type;
        if (type.startsWith('&mut ')) {
            refPrefix = '&mut ';
            remainingType = type.slice(5);
        } else if (type.startsWith('&')) {
            refPrefix = '&';
            remainingType = type.slice(1);
        }

        if (refPrefix) {
            segments.push({ type: 'text', value: refPrefix });
        }

        // Handle generic types like Coin<0x2::iota::IOTA>
        const genericMatch = remainingType.match(/^([^<]+)<(.+)>$/);
        if (genericMatch) {
            const [_, baseType, innerTypes] = genericMatch;
            segments.push(...formatType(baseType, full, interactive));
            segments.push({ type: 'text', value: '<' });

            // Parse inner types (handle nested generics and multiple type parameters)
            let depth = 0;
            let current = '';
            const typeParams: string[] = [];

            for (let i = 0; i < innerTypes.length; i++) {
                const char = innerTypes[i];
                if (char === '<') depth++;
                else if (char === '>') depth--;
                else if (char === ',' && depth === 0) {
                    typeParams.push(current.trim());
                    current = '';
                    continue;
                }
                current += char;
            }
            if (current) typeParams.push(current.trim());

            typeParams.forEach((param, idx) => {
                if (idx > 0) segments.push({ type: 'text', value: ', ' });
                segments.push(...formatType(param, full, interactive));
            });

            segments.push({ type: 'text', value: '>' });
            return segments;
        }

        // Handle regular types like 0x2::coin::Coin
        const parts = remainingType.split('::');
        if (parts.length === 3) {
            const [pkg, mod, struct] = parts;
            let displayPkg = trimAddress(pkg);
            if (shortPackageIds && displayPkg.length > 9) {
                displayPkg = `${displayPkg.slice(0, 5)}...${displayPkg.slice(-3)}`;
            }
            segments.push({
                type: 'package',
                value: displayPkg,
                id: interactive ? `pkg:${pkg}::${mod}::${struct}` : undefined,
            });
            segments.push({ type: 'text', value: '::' });
            segments.push({
                type: 'module',
                value: mod,
                id: interactive ? `mod:${pkg}::${mod}::${struct}` : undefined,
            });
            segments.push({ type: 'text', value: '::' });
            segments.push({
                type: 'struct',
                value: struct,
                id: interactive ? `struct:${pkg}::${mod}::${struct}` : undefined,
            });
        } else {
            segments.push({ type: 'text', value: remainingType });
        }
        return segments;
    }

    function formatCommand(command: any, index: number, full: boolean = false): Segment[] {
        const kind = command.$kind || Object.keys(command)[0];
        const data = command[kind] || command;

        let segments: Segment[] = [];

        if (kind === 'MoveCall') {
            const pkg = data.package;
            const mod = data.module;
            const fun = data.function;
            const typeArgs = data.typeArguments || [];
            const args = data.arguments || [];

            let displayPkg = trimAddress(pkg);
            if (shortPackageIds && displayPkg.length > 9) {
                displayPkg = `${displayPkg.slice(0, 5)}...${displayPkg.slice(-3)}`;
            }

            segments.push({
                type: 'package',
                value: displayPkg,
                id: `pkg:${pkg}::${mod}::${fun}`,
            });
            segments.push({ type: 'text', value: '::' });
            segments.push({
                type: 'module',
                value: mod,
                id: `mod:${pkg}::${mod}::${fun}`,
            });
            segments.push({ type: 'text', value: '::' });
            segments.push({
                type: 'function',
                value: fun,
                id: `fun:${pkg}::${mod}::${fun}`,
            });

            if (typeArgs.length > 0) {
                segments.push({ type: 'text', value: '<' });
                typeArgs.forEach((typeArg: string, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...formatType(typeArg, full));
                });
                segments.push({ type: 'text', value: '>' });
            }

            segments.push({ type: 'text', value: '(' });

            // Get function info for parameter types
            const funcInfo = getFunctionInfo(pkg, mod, fun);
            const paramTypes = funcInfo?.parameters || [];

            if (full && args.length > 0) {
                segments.push({ type: 'text', value: '\n    ' });
                args.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ',\n    ' });
                    const paramType = paramTypes[i]?.repr || null;
                    segments.push(...resolveArgument(arg, full, paramType));
                });
                segments.push({ type: 'text', value: '\n)' });
            } else {
                args.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    const paramType = paramTypes[i]?.repr || null;
                    segments.push(...resolveArgument(arg, full, paramType));
                });
                segments.push({ type: 'text', value: ')' });
            }

            // Add return type information
            if (funcInfo?.return) {
                const returnTypes = funcInfo.return;
                if (Array.isArray(returnTypes) && returnTypes.length > 0) {
                    segments.push({ type: 'text', value: ' -> ' });

                    // Check if this has nested results
                    const usage = getUsage(index, commands);
                    const hasNestedResults =
                        usage.length > 0 && usage.some((s) => s.value.includes('Result('));

                    if (hasNestedResults) {
                        // Show Result definitions with types (skip the arrow from usage)
                        usage.forEach((seg, idx) => {
                            if (seg.type === 'text' && seg.value.includes('->')) {
                                // Skip the arrow that's already in usage
                                return;
                            }
                            if (seg.type === 'result-def') {
                                if (
                                    idx > 0 &&
                                    usage[idx - 1].value !== '(' &&
                                    !usage[idx - 1].value.includes('->')
                                )
                                    segments.push({ type: 'text', value: ' ' });
                                segments.push(seg); // Keep the Result(X) or Result(X, Y)
                                // Add type annotation
                                const resultMatch = seg.value.match(/Result\((\d+)(?:, (\d+))?\)/);
                                if (resultMatch) {
                                    const nestedIdx = resultMatch[2]
                                        ? parseInt(resultMatch[2])
                                        : null;
                                    const typeInfo =
                                        nestedIdx !== null
                                            ? returnTypes[nestedIdx]
                                            : returnTypes[0];
                                    if (typeInfo?.repr) {
                                        segments.push({ type: 'text', value: ': ' });
                                        segments.push(...formatType(typeInfo.repr, full, true));
                                    }
                                }
                            } else {
                                segments.push(seg);
                            }
                        });
                    } else {
                        // Single result
                        segments.push({
                            type: 'result-def',
                            value: `Result(${index})`,
                            id: `result:${index}`,
                        });
                        segments.push({ type: 'text', value: ': ' });
                        if (returnTypes.length === 1) {
                            segments.push(
                                ...formatType(returnTypes[0].repr || 'unknown', full, true),
                            );
                        } else {
                            segments.push({ type: 'text', value: '(' });
                            returnTypes.forEach((ret: any, i: number) => {
                                if (i > 0) segments.push({ type: 'text', value: ', ' });
                                segments.push(...formatType(ret.repr || 'unknown', full, true));
                            });
                            segments.push({ type: 'text', value: ')' });
                        }
                    }
                }
            } else {
                // Fallback to original usage detection
                const usage = getUsage(index, commands);
                if (usage.length > 0) {
                    segments.push({ type: 'text', value: ' ' });
                    segments.push(...usage);
                }
            }
        } else if (kind === 'TransferObjects') {
            // Handle both object format {objects: [...], address: ...} and array format [[...], address]
            const objects = Array.isArray(data) ? data[0] : data.objects || [];
            const addressArg = Array.isArray(data) ? data[1] : data.address;

            segments.push({ type: 'text', value: 'TransferObjects(' });
            if (full) {
                segments.push({ type: 'text', value: '\n    [' });
                objects.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full));
                });
                segments.push({ type: 'text', value: '],\n    ' });
                segments.push(...resolveArgument(addressArg, full, 'address'));
                segments.push({ type: 'text', value: '\n)' });
            } else {
                segments.push({ type: 'text', value: '[' });
                objects.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full));
                });
                segments.push({ type: 'text', value: '], ' });
                segments.push(...resolveArgument(addressArg, full, 'address'));
                segments.push({ type: 'text', value: ')' });
            }
        } else if (kind === 'SplitCoins') {
            // Handle both object format {coin: ..., amounts: [...]} and array format [coin, [...]]
            const coinArg = Array.isArray(data) ? data[0] : data.coin;
            const amounts = Array.isArray(data) ? data[1] : data.amounts || [];

            segments.push({ type: 'text', value: 'SplitCoins(' });
            if (full) {
                segments.push({ type: 'text', value: '\n    ' });
                segments.push(...resolveArgument(coinArg, full));
                segments.push({ type: 'text', value: ',\n    [' });
                amounts.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full, 'u64'));
                });
                segments.push({ type: 'text', value: ']\n)' });
            } else {
                segments.push(...resolveArgument(coinArg, full));
                segments.push({ type: 'text', value: ', [' });
                amounts.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full, 'u64'));
                });
                segments.push({ type: 'text', value: '])' });
            }

            // Add result information for SplitCoins
            const usage = getUsage(index, commands);
            if (usage.length > 0) {
                segments.push({ type: 'text', value: ' ' });
                segments.push(...usage);
            }
        } else if (kind === 'MergeCoins') {
            // Handle both object format {destination: ..., sources: [...]} and array format [destination, [...]]
            const destArg = Array.isArray(data) ? data[0] : data.destination;
            const sources = Array.isArray(data) ? data[1] : data.sources || [];

            segments.push({ type: 'text', value: 'MergeCoins(' });
            if (full) {
                segments.push({ type: 'text', value: '\n    ' });
                segments.push(...resolveArgument(destArg, full));
                segments.push({ type: 'text', value: ',\n    [' });
                sources.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full));
                });
                segments.push({ type: 'text', value: ']\n)' });
            } else {
                segments.push(...resolveArgument(destArg, full));
                segments.push({ type: 'text', value: ', [' });
                sources.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full));
                });
                segments.push({ type: 'text', value: '])' });
            }
        } else if (kind === 'Publish') {
            // Handle both object format {modules: [...], dependencies: [...]} and array format [modules, dependencies]
            const modules = Array.isArray(data) ? data[0] : data.modules || [];
            const dependencies = Array.isArray(data) ? data[1] : data.dependencies || [];

            segments.push({ type: 'text', value: 'Publish(' });
            if (full) {
                segments.push({ type: 'text', value: '\n    [' });
                if (Array.isArray(modules)) {
                    modules.forEach((module: string, i: number) => {
                        if (i > 0) segments.push({ type: 'text', value: ', ' });
                        segments.push({ type: 'text', value: `"${module}"` });
                    });
                } else {
                    segments.push({ type: 'text', value: `"${modules}"` });
                }
                segments.push({ type: 'text', value: '],\n    [' });
                if (Array.isArray(dependencies)) {
                    dependencies.forEach((dep: string, i: number) => {
                        if (i > 0) segments.push({ type: 'text', value: ', ' });
                        segments.push({ type: 'text', value: `"${dep}"` });
                    });
                } else {
                    segments.push({ type: 'text', value: `"${dependencies}"` });
                }
                segments.push({ type: 'text', value: ']\n)' });
            } else {
                segments.push({ type: 'text', value: '[' });
                if (Array.isArray(modules)) {
                    modules.forEach((module: string, i: number) => {
                        if (i > 0) segments.push({ type: 'text', value: ', ' });
                        segments.push({ type: 'text', value: `"${module.slice(0, 10)}..."` });
                    });
                } else {
                    segments.push({ type: 'text', value: `"${modules.slice(0, 10)}..."` });
                }
                segments.push({ type: 'text', value: '], [' });
                if (Array.isArray(dependencies)) {
                    dependencies.forEach((dep: string, i: number) => {
                        if (i > 0) segments.push({ type: 'text', value: ', ' });
                        segments.push({ type: 'text', value: `"${dep.slice(0, 10)}..."` });
                    });
                } else {
                    segments.push({ type: 'text', value: `"${dependencies.slice(0, 10)}..."` });
                }
                segments.push({ type: 'text', value: '])' });
            }
        } else if (kind === 'MakeMoveVec') {
            // Handle both object format {type: ..., elements: [...]} and array format [type, [...]]
            const type = Array.isArray(data) ? data[0] : data.type || 'Unknown';
            const elements = Array.isArray(data) ? data[1] : data.elements || [];

            segments.push({ type: 'text', value: 'MakeMoveVec<' });
            segments.push(...formatType(type, full));
            segments.push({ type: 'text', value: '>(' });

            if (full && elements.length > 0) {
                segments.push({ type: 'text', value: '\n    [' });
                elements.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full));
                });
                segments.push({ type: 'text', value: ']\n)' });
            } else {
                segments.push({ type: 'text', value: '[' });
                elements.forEach((arg: any, i: number) => {
                    if (i > 0) segments.push({ type: 'text', value: ', ' });
                    segments.push(...resolveArgument(arg, full));
                });
                segments.push({ type: 'text', value: '])' });
            }

            // Add result information for MakeMoveVec
            segments.push({ type: 'text', value: ' -> ' });
            segments.push({
                type: 'result-def',
                value: `Result(${index})`,
                id: `result:${index}`,
            });
            segments.push({ type: 'text', value: ': vector<' });
            segments.push(...formatType(type, full, true));
            segments.push({ type: 'text', value: '>' });
        } else if (kind === 'Upgrade') {
            segments.push({ type: 'text', value: 'Upgrade(...)' });
        } else {
            segments.push({ type: 'text', value: `${kind}(...)` });
        }

        return segments;
    }

    // Extract unique package IDs from commands
    function getUniquePackages(): string[] {
        const packages = new Set<string>();
        commands.forEach((cmd: any) => {
            const kind = cmd.$kind || Object.keys(cmd)[0];
            if (kind === 'MoveCall') {
                const data = cmd[kind] || cmd;
                if (data.package) {
                    packages.add(data.package);
                }
            }
        });
        return Array.from(packages);
    }

    function hasPackagesCached(): boolean {
        const packages = getUniquePackages();
        return packages.length > 0 && packages.every((pkg) => packageCache[pkg]);
    }

    async function loadAllPackages() {
        const packages = getUniquePackages();
        console.log('Loading packages:', packages);
        for (const pkg of packages) {
            await fetchPackageInfo(pkg);
        }
    }

    // Reset auto-fetch flag when transaction data changes
    $effect(() => {
        // Track transactionData to reset the flag on change
        transactionData;
        hasAutoFetched = false;
    });

    // Automatically fetch type info when the component loads
    $effect(() => {
        if (commands.length > 0 && !hasAutoFetched && !hasPackagesCached()) {
            hasAutoFetched = true;
            loadAllPackages();
        }
    });
</script>

{#if commands.length > 0}
    <div class="ptb-view">
        <div class="ptb-controls">
            <div class="controls-group">
                <button onclick={expandAll}>Expand All</button>
                <button onclick={collapseAll}>Collapse All</button>
            </div>
            <div class="controls-divider"></div>
            <div class="controls-group">
                <button
                    onclick={loadAllPackages}
                    disabled={Object.keys(loadingPackages).some((k) => loadingPackages[k]) ||
                        hasPackagesCached()}
                >
                    {#if Object.keys(loadingPackages).some((k) => loadingPackages[k])}
                        Loading...
                    {:else if hasPackagesCached()}
                        Type info fetched ✓
                    {:else}
                        Fetch Type Info
                    {/if}
                </button>
                <label class="toggle-row">
                    <span class="toggle-label">Show Types</span>
                    <div class="toggle-switch">
                        <input type="checkbox" bind:checked={showTypeInfo} />
                        <span class="slider"></span>
                    </div>
                </label>
                <label class="toggle-row">
                    <span class="toggle-label">Short IDs</span>
                    <div class="toggle-switch">
                        <input type="checkbox" bind:checked={shortPackageIds} />
                        <span class="slider"></span>
                    </div>
                </label>
            </div>
        </div>

        {#if Object.keys(packageErrors).some((k) => packageErrors[k])}
            <div class="error-banner">
                <strong>Package fetch errors:</strong>
                {#each Object.entries(packageErrors).filter(([_, err]) => err) as [pkg, err]}
                    <div class="error-item">
                        {pkg}: {err}
                    </div>
                {/each}
            </div>
        {/if}

        {#each commands as command, i}
            {@const formattedSegments = formatCommand(command, i, expandedCommands[i])}
            {@const arrowIndex = formattedSegments.findIndex(
                (s) => s.type === 'text' && s.value.includes(' -> '),
            )}
            <div class="command-item">
                <span class="command-index">{i}</span>
                <button class="expand-btn" onclick={() => toggle(i)}>
                    {expandedCommands[i] ? '▼' : '▶'}
                </button>
                <div class="command-content">
                    <span class="command-call">
                        {#each formattedSegments.slice(0, arrowIndex === -1 ? formattedSegments.length : arrowIndex + 1) as segment}
                            {#if segment.type === 'text'}
                                {segment.value}
                            {:else if segment.type === 'package'}
                                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                                {@const packageId =
                                    segment.id?.split('::')[0].replace('pkg:', '') ?? ''}
                                <a
                                    href={getObjectLink(getSelectedNetworkConfig(), packageId)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="interactive-ref {segment.type}-ref link-style"
                                    class:highlighted={isHighlighted(segment.id, hoveredId)}
                                    title={packageId}
                                    onmouseover={() => (hoveredId = segment.id ?? null)}
                                    onmouseout={() => (hoveredId = null)}
                                    onfocus={() => (hoveredId = segment.id ?? null)}
                                    onblur={() => (hoveredId = null)}>{segment.value}</a
                                >
                            {:else if segment.type === 'object-id'}
                                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                                {@const objectId = segment.id?.replace('obj:', '') ?? ''}
                                <a
                                    href={getObjectLink(getSelectedNetworkConfig(), objectId)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="interactive-ref {segment.type}-ref link-style"
                                    class:highlighted={isHighlighted(segment.id, hoveredId)}
                                    title={`${segment.objectType || 'Object'}: ${objectId}`}
                                    onmouseover={() => (hoveredId = segment.id ?? null)}
                                    onmouseout={() => (hoveredId = null)}
                                    onfocus={() => (hoveredId = segment.id ?? null)}
                                    onblur={() => (hoveredId = null)}>{segment.value}</a
                                >
                            {:else}
                                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <span
                                    class="interactive-ref {segment.type}-ref"
                                    class:highlighted={isHighlighted(segment.id, hoveredId)}
                                    onmouseover={() => (hoveredId = segment.id ?? null)}
                                    onmouseout={() => (hoveredId = null)}>{segment.value}</span
                                >
                            {/if}
                        {/each}
                    </span>
                    {#if arrowIndex !== -1}
                        <span
                            class="command-result"
                            class:highlighted-row={hoveredId?.startsWith('result:' + i)}
                        >
                            {#each formattedSegments.slice(arrowIndex + 1) as segment}
                                {#if segment.type === 'text'}
                                    {segment.value}
                                {:else if segment.type === 'package'}
                                    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                                    {@const packageId =
                                        segment.id?.split('::')[0].replace('pkg:', '') ?? ''}
                                    <a
                                        href={getObjectLink(getSelectedNetworkConfig(), packageId)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="interactive-ref {segment.type}-ref link-style"
                                        class:highlighted={isHighlighted(segment.id, hoveredId)}
                                        title={packageId}
                                        onmouseover={() => (hoveredId = segment.id ?? null)}
                                        onmouseout={() => (hoveredId = null)}
                                        onfocus={() => (hoveredId = segment.id ?? null)}
                                        onblur={() => (hoveredId = null)}>{segment.value}</a
                                    >
                                {:else if segment.type === 'object-id'}
                                    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                                    {@const objectId = segment.id?.replace('obj:', '') ?? ''}
                                    <a
                                        href={getObjectLink(getSelectedNetworkConfig(), objectId)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="interactive-ref {segment.type}-ref link-style"
                                        class:highlighted={isHighlighted(segment.id, hoveredId)}
                                        title={`${segment.objectType || 'Object'}: ${objectId}`}
                                        onmouseover={() => (hoveredId = segment.id ?? null)}
                                        onmouseout={() => (hoveredId = null)}
                                        onfocus={() => (hoveredId = segment.id ?? null)}
                                        onblur={() => (hoveredId = null)}>{segment.value}</a
                                    >
                                {:else}
                                    <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                                    <span
                                        class="interactive-ref {segment.type}-ref"
                                        class:highlighted={isHighlighted(segment.id, hoveredId)}
                                        onmouseover={() => (hoveredId = segment.id ?? null)}
                                        onmouseout={() => (hoveredId = null)}>{segment.value}</span
                                    >
                                {/if}
                            {/each}
                        </span>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="no-data">No PTB commands found</div>
{/if}

<style>
    .ptb-view {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
        font-size: 0.85rem;
    }

    .ptb-controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        align-items: center;
    }

    .controls-group {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .controls-divider {
        width: 1px;
        height: 24px;
        background: var(--border-color);
        margin: 0 0.25rem;
    }

    .ptb-controls button {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        border-radius: 4px;
        background: var(--background-light);
        border: 1px solid var(--border-color);
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
    }

    .ptb-controls button:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
    }

    .ptb-controls button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .toggle-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
        font-size: 0.8rem;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
        flex-shrink: 0;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #475569;
        transition: 0.4s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: '';
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #059669;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #059669;
    }

    input:checked + .slider:before {
        transform: translateX(16px);
    }

    .toggle-label {
        color: rgba(255, 255, 255, 0.8);
    }

    .error-banner {
        background: rgba(220, 38, 38, 0.2);
        border: 1px solid rgba(220, 38, 38, 0.4);
        border-radius: 6px;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        color: #fca5a5;
        font-size: 0.8rem;
    }

    .error-item {
        margin-top: 0.3rem;
        padding-left: 1rem;
    }

    .command-item {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem;
        background: var(--background-light);
        border-radius: 6px;
        border: 1px solid var(--border-color);
        align-items: baseline;
        transition: background-color 0.2s;
    }

    .command-result.highlighted-row {
        background: rgba(167, 139, 250, 0.25);
        border-radius: 3px;
        padding: 0 3px;
        margin: 0 -3px;
    }

    .expand-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        padding: 0;
        font-size: 0.7rem;
        width: 1.2rem;
        height: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: flex-start;
        margin-top: 0.1rem;
    }
    .expand-btn:hover {
        color: white;
    }

    .command-index {
        color: #a78bfa;
        font-weight: 600;
        min-width: 2rem;
        text-align: right;
        padding-right: 0.5rem;
        border-right: 1px solid var(--border-color);
        margin-right: 0.5rem;
    }

    .command-content {
        flex: 1;
        word-break: break-all;
        color: rgba(255, 255, 255, 0.85);
        white-space: pre-wrap;
    }

    .no-data {
        padding: 1rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
    }

    .interactive-ref {
        cursor: pointer;
        border-radius: 3px;
        padding: 0 2px;
        transition:
            background-color 0.2s,
            color 0.2s;
    }

    .result-ref:hover,
    .result-def-ref:hover {
        background: rgba(167, 139, 250, 0.3);
        color: #fff;
    }

    .package-ref {
        color: #60a5fa;
    }
    .module-ref {
        color: #fbbf24;
    }
    .function-ref {
        color: #c084fc;
    }
    .struct-ref {
        color: #34d399;
    }
    .object-id-ref {
        color: #f472b6;
    }

    .interactive-ref.highlighted {
        background: rgba(167, 139, 250, 0.4);
        color: #fff;
        font-weight: bold;
        box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.5);
    }

    .link-style {
        text-decoration: none;
    }

    .link-style:hover {
        text-decoration: underline;
    }
</style>
