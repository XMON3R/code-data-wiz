import { expect, test } from 'vitest';
import SimpleSQLParser from './sql-parser';
import { SQLDiagram } from './sql-model';

const parser = new SimpleSQLParser();

test('should parse a single class into a SQL table', () => {
  const input = `class User {
  int id
  String name
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: 'User',
        columns: [
          { name: 'id', type: 'INT' },
          { name: 'name', type: 'VARCHAR(255)' },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test('should parse multiple classes into multiple SQL tables', () => {
  const input = `class User {
  int id
  String name
}

class Post {
  int postId
  String content
  int userId
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: 'User',
        columns: [
          { name: 'id', type: 'INT' },
          { name: 'name', type: 'VARCHAR(255)' },
        ],
      },
      {
        name: 'Post',
        columns: [
          { name: 'postId', type: 'INT' },
          { name: 'content', type: 'VARCHAR(255)' },
          { name: 'userId', type: 'INT' },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test('should handle different data types', () => {
  const input = `class Product {
  int productId
  String productName
  double price
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: 'Product',
        columns: [
          { name: 'productId', type: 'INT' },
          { name: 'productName', type: 'VARCHAR(255)' },
          { name: 'price', type: 'DECIMAL(10, 2)' },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test('should handle empty classes', () => {
  const input = `class Empty {}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: 'Empty',
        columns: [],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test('should ignore empty lines and extra whitespace', () => {
  const input = `

class Order {

  int orderId

  String orderDate

}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: 'Order',
        columns: [
          { name: 'orderId', type: 'INT' },
          { name: 'orderDate', type: 'VARCHAR(255)' },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});

test('should default unknown types to TEXT', () => {
  const input = `class Item {
  int itemId
  bool isActive
  Date createdOn
}`;
  const expected: SQLDiagram = {
    tables: [
      {
        name: 'Item',
        columns: [
          { name: 'itemId', type: 'INT' },
          { name: 'isActive', type: 'TEXT' },
          { name: 'createdOn', type: 'TEXT' },
        ],
      },
    ],
  };
  const result = parser.parse(input);
  expect(result).toEqual(expected);
});