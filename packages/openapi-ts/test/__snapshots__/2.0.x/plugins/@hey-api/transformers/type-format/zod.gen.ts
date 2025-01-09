// This file is auto-generated by @hey-api/openapi-ts

import { z } from 'zod';

export const zFoo = z.object({
    bar: z.number().int().optional(),
    foo: z.bigint(),
    id: z.string()
});

export const zBar = z.object({
    foo: z.number().int()
});

export const zPostFooResponse = zFoo;