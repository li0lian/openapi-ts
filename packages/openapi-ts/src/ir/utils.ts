import type { IRSchemaObject } from './ir';

/**
 * Simply adds `items` to the schema. Also handles setting the logical operator
 * and avoids setting it for a single item or tuples.
 */
export const addItemsToSchema = ({
  items,
  logicalOperator = 'or',
  mutateSchemaOneItem = false,
  schema,
}: {
  items: Array<IRSchemaObject>;
  logicalOperator?: IRSchemaObject['logicalOperator'];
  mutateSchemaOneItem?: boolean;
  schema: IRSchemaObject;
}) => {
  if (!items.length) {
    return schema;
  }

  if (schema.type === 'tuple') {
    schema.items = items;
    return schema;
  }

  if (items.length !== 1) {
    schema.items = items;
    schema.logicalOperator = logicalOperator;
    return schema;
  }

  if (mutateSchemaOneItem) {
    // bring composition up to avoid extraneous brackets
    schema = {
      ...schema,
      ...items[0],
    };
    return schema;
  }

  schema.items = items;
  return schema;
};
