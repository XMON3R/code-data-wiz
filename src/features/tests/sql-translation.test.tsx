import { expect, test } from 'vitest';
import SQLParserWriter from '../sql-processing/sql-parser';

// Instance of SQLParserWriter
const parser = new SQLParserWriter();

test('generateCode should convert parsed class diagram to SQL', () => {
  const parsedInput = `class User {
  int id
  String name
}`;
  
  const expectedSQL = `CREATE TABLE User (
  id INT,
  name VARCHAR(255)
);

`;
  
  expect(parser.generateCode(parsedInput)).toBe(expectedSQL);
});

test('generateCode should handle multiple attributes', () => {
  const parsedInput = `class Product {
  int id
  String title
  double price
}`;

  const expectedSQL = `CREATE TABLE Product (
  id INT,
  title VARCHAR(255),
  price DECIMAL(10, 2)
);

`;

  expect(parser.generateCode(parsedInput)).toBe(expectedSQL);
});

test('generateCode should handle unknown types as TEXT', () => {
  const parsedInput = `class Item {
  boolean available
  Date createdAt
}`;

  const expectedSQL = `CREATE TABLE Item (
  available TEXT,
  createdAt TEXT
);

`;
  
  expect(parser.generateCode(parsedInput)).toBe(expectedSQL);
});
