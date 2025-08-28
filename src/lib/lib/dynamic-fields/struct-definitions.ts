export interface StructDefinition {
    name: string;
    fieldType: string;
    layout: any; // JSON representation of the layout
    value: string;
}

export const defaultStructDefinitions: StructDefinition[] = [
    {
        name: 'VectorU8',
        fieldType: 'vector<u8>',
        layout: {
            vector: 'u8',
        },
        value: '[118,101,99,95,117,56,95,107,101,121]',
    },
    {
        name: 'Bool',
        fieldType: 'bool',
        layout: 'bool',
        value: 'true',
    },
    {
        name: 'U8',
        fieldType: 'u8',
        layout: 'u8',
        value: '42',
    },
    {
        name: 'U32',
        fieldType: 'u32',
        layout: 'u32',
        value: '42',
    },
    {
        name: 'StringStruct',
        fieldType: '0x1::string::String',
        layout: {
            struct: {
                type: '0x1::string::String',
                fields: [
                    {
                        name: 'bytes',
                        layout: { vector: 'u8' },
                    },
                ],
            },
        },
        value: '"string_key"',
    },
    {
        name: 'StructWithDummyField',
        fieldType:
            '0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef::dynamic_fields::StructWithoutFieldKey',
        layout: {
            struct: {
                type: '0x25ee69608c70f9d614790e8a46aa32c18798c4fa9cfc20e5dd0ec1f7505bd5ef::dynamic_fields::StructWithoutFieldKey',
                fields: [
                    {
                        name: 'dummy_field',
                        layout: 'bool',
                    },
                ],
            },
        },
        value: '{"dummy_field": false}',
    },
    {
        name: 'Domain',
        fieldType:
            '0x3ec4826f1d6e0d9f00680b2e9a7a41f03788ee610b3d11c24f41ab0ae71da39f::domain::Domain',
        layout: {
            struct: {
                type: '0x3ec4826f1d6e0d9f00680b2e9a7a41f03788ee610b3d11c24f41ab0ae71da39f::domain::Domain',
                fields: [
                    {
                        name: 'labels',
                        layout: {
                            vector: {
                                struct: {
                                    type: '0x1::string::String',
                                    fields: [
                                        {
                                            name: 'bytes',
                                            layout: { vector: 'u8' },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
        },
        value: '{"labels": ["iota", "name"]}',
    },
];
