// This file is auto-generated by @hey-api/openapi-ts

export type Foo = {
    foo?: string;
    baz?: string;
};

export type Bar = Foo & {
    bar: number;
    foo: string;
    baz: string;
};

export type ClientOptions = {
    baseUrl: `${string}://${string}` | (string & {});
};