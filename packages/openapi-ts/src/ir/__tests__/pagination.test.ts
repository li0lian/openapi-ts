import { describe, expect, it, vi } from 'vitest';

import type { Config } from '../../types/config';
import { operationPagination } from '../operation';
import { getPaginationKeywordsRegExp } from '../pagination';
import type { IR } from '../types';

describe('paginationKeywordsRegExp', () => {
  const defaultScenarios: Array<{
    result: boolean;
    value: string;
  }> = [
    {
      result: true,
      value: 'after',
    },
    {
      result: true,
      value: 'before',
    },
    {
      result: true,
      value: 'cursor',
    },
    {
      result: true,
      value: 'offset',
    },
    {
      result: true,
      value: 'page',
    },
    {
      result: true,
      value: 'start',
    },
    {
      result: false,
      value: 'my_start',
    },
    {
      result: false,
      value: 'start_my',
    },
  ];

  it.each(defaultScenarios)(
    'is $value pagination param? $output',
    async ({ result, value }) => {
      const paginationRegExp = getPaginationKeywordsRegExp();
      expect(paginationRegExp.test(value)).toEqual(result);
    },
  );

  const customScenarios: Array<{
    result: boolean;
    value: string;
  }> = [
    { result: true, value: 'customPagination' },
    { result: true, value: 'pageSize' },
    { result: true, value: 'perPage' },
    { result: false, value: 'page' },
  ];

  it.each(customScenarios)(
    'with custom config, $value should match? $result',
    async ({ result, value }) => {
      const pagination: Config['input']['pagination'] = {
        keywords: ['customPagination', 'pageSize', 'perPage'],
      };
      const paginationRegExp = getPaginationKeywordsRegExp(pagination);
      expect(paginationRegExp.test(value)).toEqual(result);
    },
  );
});

describe('operationPagination', () => {
  const queryParam = (
    name: string,
    type: IR.SchemaObject['type'] = 'string',
    pagination = false,
  ): IR.ParameterObject => ({
    name,
    location: 'query',
    schema: { type },
    style: 'form',
    explode: true,
    ...(pagination ? { pagination: true } : {}),
  });

  const emptyContext = {} as IR.Context;

  const baseOperationMeta = {
    method: 'post' as const,
    path: '/test' as const,
  };

  const queryScenarios: Array<{
    hasPagination: boolean;
    operation: IR.OperationObject;
  }> = [
    {
      hasPagination: true,
      operation: {
        ...baseOperationMeta,
        id: 'op1',
        method: 'get',
        parameters: {
          query: {
            page: queryParam('page', 'integer', true),
          },
        },
      },
    },
    {
      hasPagination: false,
      operation: {
        ...baseOperationMeta,
        id: 'op2',
        method: 'get',
        parameters: {
          query: {
            sort: queryParam('sort', 'string'),
          },
        },
      },
    },
  ];

  it.each(queryScenarios)(
    'query params for $operation.id → $hasPagination',
    ({ hasPagination, operation }: { hasPagination: boolean; operation: IR.OperationObject }) => {
      const result = operationPagination({ context: emptyContext, operation });
      expect(Boolean(result)).toEqual(hasPagination);
    },
  );

  it('body.pagination === true returns entire body', () => {
    const operation: IR.OperationObject = {
      ...baseOperationMeta,
      id: 'bodyTrue',
      body: {
        mediaType: 'application/json',
        pagination: true,
        schema: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
          },
        },
      },
    };

    const result = operationPagination({ context: emptyContext, operation });

    expect(result?.in).toEqual('body');
    expect(result?.name).toEqual('body');
    expect(result?.schema?.type).toEqual('object');
  });

  it('body.pagination = "pagination" returns the matching property', () => {
    const operation: IR.OperationObject = {
      ...baseOperationMeta,
      id: 'bodyField',
      body: {
        mediaType: 'application/json',
        pagination: 'pagination',
        schema: {
          type: 'object',
          properties: {
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
              },
            },
          },
        },
      },
    };

    const result = operationPagination({ context: emptyContext, operation });

    expect(result?.in).toEqual('body');
    expect(result?.name).toEqual('pagination');
    expect(result?.schema?.type).toEqual('object');
  });

  it('resolves $ref and uses the resolved pagination property', () => {
    const context: IR.Context = {
      resolveIrRef: vi.fn().mockReturnValue({
        type: 'object',
        properties: {
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
            },
          },
        },
      }),
    } as unknown as IR.Context;

    const operation: IR.OperationObject = {
      ...baseOperationMeta,
      id: 'refPagination',
      body: {
        mediaType: 'application/json',
        pagination: 'pagination',
        schema: { $ref: '#/components/schemas/PaginationBody' },
      },
    };

    const result = operationPagination({ context, operation });

    expect(context.resolveIrRef).toHaveBeenCalledWith(
      '#/components/schemas/PaginationBody',
    );
    expect(result?.in).toEqual('body');
    expect(result?.name).toEqual('pagination');
    expect(result?.schema?.type).toEqual('object');
  });

  it('falls back to query when pagination key not found in body', () => {
    const operation: IR.OperationObject = {
      ...baseOperationMeta,
      id: 'fallback',
      parameters: {
        query: {
          cursor: queryParam('cursor', 'string', true),
        },
      },
      body: {
        mediaType: 'application/json',
        pagination: 'pagination',
        schema: {
          type: 'object',
          properties: {
            notPagination: { type: 'string' },
          },
        },
      },
    };

    const result = operationPagination({ context: emptyContext, operation });

    expect(result?.in).toEqual('query');
    expect(result?.name).toEqual('cursor');
    expect(result?.schema?.type).toEqual('string');
  });
});