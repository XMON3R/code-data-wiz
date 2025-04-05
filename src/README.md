návrh struktury projektu:

src/
├── components/
└── features/
    ├── shared/
    ├── sql-processing/
    ├── tests/
    └── translation/
        ├── application/
        │   ├── input-editor/
        │   └── output/
        │       ├── text-based/
        │       └── visual/
        ├── main-model/
        ├── parsers/   <-- Sem plugin parsers
        │   ├── {plugin-name}-model.ts
        │   ├── {plugin-name}-parser.ts
        │   ├── {plugin-name}-parser.spec.ts
        │   ├── {plugin-name}-writer.ts
        │   ├── {plugin-name}-writer.spec.ts
        │   ├── {plugin-name}-adapter.ts
        │   └── {plugin-name}-adapter.spec.ts
        └── plugins/



# Struktura projektu
- application
  - input-editor
  - output
    - text-based
    - visual
- main-model
  Sdílený model - přes tohle tečou data.
- plugins


Extension points / plugins:
- {plugin-directory-name}

  - {plugin-name}-model.ts
    Plugin specific model, like AST, ...

  - {plugin-name}-parser.ts
    Parse it the {plugin-name}-model.ts

  - {plugin-name}-parser.spec.ts

  - {plugin-name}-writer.ts

    Write {plugin-name}-model.ts

  - {plugin-name}-writer.spec.ts
  - {plugin-name}-adapter.ts
    Convert from local model ({plugin-name}-model.ts) from/to main-model.
    
  - {plugin-name}-adapter.spec.ts <-- MISSING



# Parsers to implement

## https://ofn.gov.cz/slovníky/draft/
```ts
interface Pojem {
  iri: string;
  nazev : {cs:string, en:string};
  definice : {cs:string, en:string}
  nadřazenýPojem: string[];
}

interface Vztah {

}
```

## https://www.w3.org/TR/rdf12-schema/
```ts
interface RdfsClass {

}

interface RdfsLiteral {

}

interface RdfsDatatype {

}

interface RdfProperty {
  range: string[];
  domain: string[];
}
```

## Code parser ...
?? Your choice ..

# Next contact
- 30.3
