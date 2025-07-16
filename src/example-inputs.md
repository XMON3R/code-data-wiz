# Example Inputs

## C# Example

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Post
{
    public int PostId { get; set; }
    public string Content { get; set; }
    public int UserId { get; set; }
}
```

## Java Example

```java
package com.example.models;

import java.util.Date;
import java.util.List;

/**
 * Represents a user in the system.
 */
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String username;
    protected String email;
    public final String userType = "standard";
}
```

## JSON Schema Example

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/product.schema.json",
    "title": "Product",
    "description": "A product in the catalog",
    "type": "object",
    "properties": {
        "productId": {
            "type": "string",
            "description": "The unique identifier for a product"
        },
        "productName": {
            "type": "string"
        },
        "price": {
            "type": "number",
            "required": true
        }
    },
    "required": ["productId", "productName", "price"]
}
```

## LinkML Example

```yaml
id: http://example.com/my_schema
name: my_schema
description: A simple LinkML schema
classes:
  Person:
    description: A person in the system
    attributes:
      name:
        range: string
      age:
        range: integer
  Organization:
    description: An organization
    attributes:
      orgId:
        range: string
```

## SQL Connected Example

```sql
CREATE TABLE Users (
    id INT NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NULL,
    manager_id INT,
    CONSTRAINT FK_Manager FOREIGN KEY (manager_id) REFERENCES Users(id)
);

CREATE TABLE Products (
    product_id INT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Orders (
    order_id INT NOT NULL PRIMARY KEY,
    user_id INT,
    order_date DATE,
    CONSTRAINT FK_UserOrder FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Order_Items (
    order_item_id INT NOT NULL PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    CONSTRAINT FK_OrderItem_Order FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    CONSTRAINT FK_OrderItem_Product FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
