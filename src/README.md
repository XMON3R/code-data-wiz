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



npm install --save-dev @vitest/ui @vitest/coverage-c8 vitest

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

3.2 Alternativy a zdůvodnění vlastní implementace parseru

Při řešení potřeby analýzy specifického formátu dat v rámci této práce byly zvažovány různé přístupy. Mezi primární alternativy patřilo využití existujících generátorů parserů, jako je ANTLR4, a prozkoumání dostupných parserů v ekosystému npm. Nicméně, zkušenosti s těmito řešeními v kontextu daného problému vedly k rozhodnutí implementovat parser vlastní.

ANTLR4, ač robustní nástroj pro tvorbu lexikálních analyzátorů a parserů, se ukázal jako nepřiměřeně komplexní pro specifické potřeby této práce. Jeho gramatický jazyk vyžaduje značnou počáteční investici do studia a ladění, což by v rámci časových omezení projektu představovalo významnou překážku. Generovaný kód by navíc přinesl do projektu externí závislost a potenciálně složitější integraci s existující kódovou bází. Pro relativně jednoduchý strukturovaný formát dat, s nímž tato práce operuje, se tak využití ANTLR4 jevilo jako zbytečně náročné a s vysokou vstupní bariérou.

Paralelně s tím bylo provedeno prozkoumání existujících parserů v repozitáři npm. Ačkoliv ekosystém nabízí širokou škálu nástrojů pro různé formáty, žádný z nalezených balíčků plně nevyhovoval specifickým požadavkům na validaci a extrakci dat, které jsou pro tuto práci klíčové. Univerzálnost těchto knihoven by vyžadovala následné složité post-processing kroky k dosažení požadovaného výstupu, což by snížilo čitelnost a udržovatelnost kódu. Závislost na externích balíčcích by navíc představovala potenciální riziko z hlediska jejich údržby a kompatibility s ostatními závislostmi projektu.


Při detailnějším zkoumání existujících parserů se ukázalo, že integrace některých populárních řešení do vývojového prostředí Vite přináší specifické výzvy. Nástroje jako ANTLR4, ač mocné, často vyžadují komplikovanější buildovací procesy a generují kód, který nemusí nativně optimálně fungovat v moderním frontendovém prostředí, jakým je Vite.

Babel, primárně transpilátor JavaScriptu, sice disponuje schopnostmi parsování JavaScriptu a jeho rozšíření (JSX, TypeScript), avšak jeho zaměření je odlišné od generického parsování datových formátů, které taky chceme podproovat. Jeho API pro vlastní analýzu může být pro specifické syntaxe méně intuitivní a vyžaduje hlubší znalosti jeho interní AST (Abstract Syntax Tree) struktury. Navíc, jeho primární určení pro transformaci kódu může vést k zbytečné složitosti při pouhém parsování nestandardních formátů.

Tree-sitter představuje další zajímavou alternativu, nabízející inkrementální parsování a generování robustních AST. Nicméně, jeho integrace do JavaScriptového prostředí Vite často vyžaduje kompilaci nativních modulů (typicky v C/C++), což může komplikovat vývoj a nasazení, zejména pokud cílové prostředí nemá snadno dostupné nástroje pro buildování nativních rozšíření. Toto může vést k problémům s přenositelností a závislostmi na specifických buildovacích konfiguracích.

Kromě toho, mnoho existujících parserů v npm ekosystému, zejména těch určených pro složitější formáty, nemusí být optimalizováno pro běh v prohlížeči nebo moderních bundlerech jako Vite. Mohou obsahovat závislosti na Node.js specifických API nebo vyžadovat složité konfigurace pro správné fungování v prostředí Vite, které se zaměřuje na rychlý vývoj s modulemi ES a efektivním bundlingem.

Tyto technické překážky a potenciální komplikace s integrací existujících parserů do specifického vývojového prostředí Vite dále posílily argument pro vlastní implementaci parseru. Cílem bylo vytvořit řešení, které je plně kompatibilní s Vite, nevyžaduje složité buildovací kroky ani externí závislosti, a zároveň poskytuje potřebnou flexibilitu a kontrolu nad procesem parsování pro daný formát dat. Vlastní implementace tak umožňuje optimalizaci pro cílové prostředí a zajišťuje hladký vývojový cyklus v rámci ekosystému Vite.


Vzhledem k výše uvedeným skutečnostem bylo rozhodnuto přistoupit k implementaci vlastního parseru. Tento přístup nabízí několik klíčových výhod:

Absolutní kontrola: Vlastní implementace umožňuje přesně definovat pravidla parsování, způsob zpracování chyb a strukturu extrahovaných dat, plně v souladu s požadavky této práce.
    
Lepší integrace: Parser na míru lze navrhnout tak, aby přímo produkoval datové struktury nativně využívané v aplikaci, čímž se zjednodušuje datový tok a eliminuje potřeba složitých transformací.
    
Minimalizace závislostí: Vlastní implementace eliminuje závislost na externích knihovnách, což zjednodušuje správu projektu a snižuje potenciální rizika spojená s jejich údržbou a kompatibilitou.
  
Potenciál pro optimalizaci: Pro specifický formát dat lze vlastní parser optimalizovat z hlediska výkonu efektivněji než univerzální knihovny.

I přes vědomí časové náročnosti spojené s vývojem vlastního parseru, výše uvedené výhody převážily nad složitostmi a omezeními existujících řešení. Tento přístup zajišťuje maximální flexibilitu a kontrolu nad procesem analýzy dat, což je pro úspěšné dosažení cílů této bakalářské práce klíčové. Následující kapitoly detailně popisují návrh a implementaci tohoto vlastního parseru.

Výhodou tedy je, že pro účely této práce budeme schopni vytvořit svůj parser a určíme tak jasné "pravidla", co lze v naší aplikaci provádět za "překládací" operace.
