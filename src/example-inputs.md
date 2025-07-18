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
    "title": "Product",
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
    "required": ["productId", "productName", "price"] }
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

## SQL Connected Example (choose PlantUML for rightside Editor Type)

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
```

## OFN Example
```json

{
    "@context": "https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld",
    "iri": "https://slovník.gov.cz/datový/turistické-cíle",
    "typ": [
        "Slovník",
        "Tezaurus"
    ],
    "název": {
        "cs": "Slovník turistických cílů",
        "en": "Vocabulary of tourist points of interest"
    },
    "popis": {
        "cs": "Slovník turistických cílů slouží v rámci příkladu pro OFN Slovníky",
        "en": "Vocabulary of tourist points of interest serves as an example in the formal open standard for vocabularies"
    },
    "vytvořeno": {
        "typ": "Časový okamžik",
        "datum": "2024-01-01"
    },
    "aktualizováno": {
        "typ": "Časový okamžik",
        "datum_a_čas": "2024-01-15T04:53:21+02:00"
    },
    "pojmy": [
        {
            "iri": "https://slovník.gov.cz/datový/turistické-cíle/pojem/turistický-cíl",
            "typ": [
                "Pojem",
                "Koncept"
            ],
            "název": {
                "cs": "Turistický cíl",
                "en": "Tourist point of interest"
            },
            "definice": {
                "cs": "Samostatný turistický cíl.",
                "en": "Tourist point of interest"
            },
            "související-ustanovení-právního-předpisu": [
                "https://opendata.eselpoint.cz/esel-esb/eli/cz/sb/1992/114/2024-01-01/dokument/norma/cast_1/par_3/odst_1/pism_q"
            ],
            "nadřazený-pojem": [
                "https://slovník.gov.cz/generický/veřejná-místa/pojem/veřejné-místo"
            ],
            "ekvivalentní-pojem": [
                "https://schema.org/TouristAttraction"
            ]
        },
        {
            "iri": "https://slovník.gov.cz/datový/turistické-cíle/pojem/typ-turistického-cíle",
            "typ": [
                "Pojem",
                "Koncept"
            ],
            "název": {
                "cs": "Typ turistického cíle",
                "en": "Type of the tourist point of interest"
            },
            "definice": {
                "cs": "Typ turistického cíle (např. přírodní nebo kulturní) reprezentovaný jako položka číselníku typů turistických cílů."
            }
        },
        {
            "iri": "https://slovník.gov.cz/datový/turistické-cíle/pojem/má-typ-turistického-cíle",
            "typ": [
                "Pojem",
                "Koncept"
            ],
            "název": {
                "cs": "má typ turistického cíle",
                "en": "has type of tourist point of interest"
            },
            "popis": {
                "cs": "vazba propojuje turistický cíl a jeho typ"
            },
            "definice": {
                "cs": "Určuje, zda se jedná o přírodní nebo kulturní turistický cíl."
            }
        },
        {
            "iri": "https://slovník.gov.cz/datový/turistické-cíle/pojem/kouření-povoleno",
            "typ": [
                "Pojem",
                "Koncept"
            ],
            "název": {
                "cs": "kouření povoleno",
                "en": "smoking allowed"
            },
            "definice": {
                "cs": "Určuje, zda je možné v turistickém cíli kouření tabákových výrobků."
            }
        }
    ]
}

```