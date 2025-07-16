import React, { useState } from 'react';
import { OfnModel } from './ofn-model';
import { OfnWriter } from './ofn-writer';

// Mapping from English interface keys to Czech JSON keys
const ofnKeyMap: { [key: string]: string } = {
    context: "@context",
    iri: "iri",
    type: "typ",
    name: "název",
    description: "popis",
    createdAt: "vytvořeno",
    updatedAt: "aktualizováno",
    concepts: "pojmy",
    // Nested mappings for createdAt and updatedAt
    "createdAt.type": "vytvořeno.typ",
    "createdAt.date": "vytvořeno.datum",
    "updatedAt.type": "aktualizováno.typ",
    "updatedAt.dateTime": "aktualizováno.datum_a_čas",
    // Mappings for concept properties would be more complex and might require dynamic handling
};

// Initial vocabulary data, converted to use English keys from OfnModel
const initialVocabulary: OfnModel = {
    context: "https://ofn.gov.cz/slovníky/draft/kontexty/slovníky.jsonld",
    iri: "https://slovník.gov.cz/datový/turistické-cíle",
    type: [
        "Slovník",
        "Tezaurus"
    ],
    name: {
        cs: "Slovník turistických cílů",
        en: "Vocabulary of tourist points of interest"
    },
    description: {
        cs: "Slovník turistických cílů slouží v rámci příkladu pro OFN Slovníky",
        en: "Vocabulary of tourist points of interest serves as an example in the formal open standard for vocabularies"
    },
    createdAt: {
        type: "Časový okamžik",
        date: "2024-01-01"
    },
    updatedAt: {
        type: "Časový okamžik",
        dateTime: "2024-01-15T04:53:21+02:00"
    },
    concepts: [
        {
            iri: "https://slovník.gov.cz/datový/turistické-cíle/pojem/turistický-cíl",
            type: [
                "Pojem",
                "Koncept"
            ],
            name: {
                cs: "Turistický cíl",
                en: "Tourist point of interest"
            },
            definition: {
                cs: "Samostatný turistický cíl.",
                en: "Tourist point of interest"
            },
            relatedLegalProvision: [
                "https://opendata.eselpoint.cz/esel-esb/eli/cz/sb/1992/114/2024-01-01/dokument/norma/cast_1/par_3/odst_1/pism_q"
            ],
            superConcept: [
                "https://slovník.gov.cz/generický/veřejná-místa/pojem/veřejné-místo"
            ],
            equivalentConcept: [
                "https://schema.org/TouristAttraction"
            ]
        },
        {
            iri: "https://slovník.gov.cz/datový/turistické-cíle/pojem/typ-turistického-cíle",
            type: [
                "Pojem",
                "Koncept"
            ],
            name: {
                cs: "Typ turistického cíle",
                en: "Type of the tourist point of interest"
            },
            definition: {
                cs: "Typ turistického cíle (např. přírodní nebo kulturní) reprezentovaný jako položka číselníku typů turistických cílů."
            }
        },
        {
            iri: "https://slovník.gov.cz/datový/turistické-cíle/pojem/má-typ-turistického-cíle",
            type: [
                "Pojem",
                "Koncept"
            ],
            name: {
                cs: "má typ turistického cíle",
                en: "has type of tourist point of interest"
            },
            description: {
                cs: "vazba propojuje turistický cíl a jeho typ"
            },
            definition: {
                cs: "Určuje, zda se jedná o přírodní nebo kulturní turistický cíl."
            }
        },
        {
            iri: "https://slovník.gov.cz/datový/turistické-cíle/pojem/kouření-povoleno",
            type: [
                "Pojem",
                "Koncept"
            ],
            name: {
                cs: "kouření povoleno",
                en: "smoking allowed"
            },
            definition: {
                cs: "Určuje, zda je možné v turistickém cíli kouření tabákových výrobků."
            }
        }
    ]
};

const OfnEditor: React.FC = () => {
    const [vocabulary, setVocabulary] = useState<OfnModel>(initialVocabulary);
    const [writer] = useState(new OfnWriter());

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof OfnModel,
        lang?: 'cs' | 'en',
        nestedField?: string // For handling nested properties like 'type' in createdAt/updatedAt
    ) => {
        const { value } = e.target;
        setVocabulary(prev => {
            const updatedVocabulary = { ...prev };

            if (field === 'name' || field === 'description') {
                if (!updatedVocabulary[field]) {
                    updatedVocabulary[field] = {};
                }
                (updatedVocabulary[field] as any)[lang!] = value;
            } else if (field === 'createdAt') {
                // Ensure the object exists and has all required properties
                if (!updatedVocabulary.createdAt) {
                    updatedVocabulary.createdAt = { type: '', date: '' };
                }
                if (nestedField === 'type') {
                    updatedVocabulary.createdAt.type = value;
                } else if (nestedField === 'date') {
                    updatedVocabulary.createdAt.date = value;
                }
            } else if (field === 'updatedAt') {
                // Ensure the object exists and has all required properties
                if (!updatedVocabulary.updatedAt) {
                    updatedVocabulary.updatedAt = { type: '', dateTime: '' };
                }
                if (nestedField === 'type') {
                    updatedVocabulary.updatedAt.type = value;
                } else if (nestedField === 'dateTime') {
                    updatedVocabulary.updatedAt.dateTime = value;
                }
            } else if (field === 'concepts') {
                console.warn("Editing concepts array is not yet fully implemented.");
            } else {
                // Direct assignment for simple fields like iri, context, type
                (updatedVocabulary as any)[field] = value;
            }

            return updatedVocabulary;
        });
    };

    const handleSave = async () => {
        try {
            // Before saving, we need to map the English keys back to Czech keys for the writer
            const dataToSave = JSON.parse(JSON.stringify(vocabulary)); // Deep copy

            // Map English keys back to Czech keys for saving
            const mappedData: any = {};

            // Handle top-level properties
            for (const englishKey in ofnKeyMap) {
                if (englishKey in dataToSave) {
                    const czechKey = ofnKeyMap[englishKey];
                    if (czechKey) {
                        if (englishKey === 'createdAt' || englishKey === 'updatedAt') {
                            // Special handling for nested objects
                            mappedData[czechKey] = {};
                            if (englishKey === 'createdAt') {
                                if (dataToSave.createdAt?.type) mappedData[czechKey].typ = dataToSave.createdAt.type;
                                if (dataToSave.createdAt?.date) mappedData[czechKey].datum = dataToSave.createdAt.date;
                            } else if (englishKey === 'updatedAt') {
                                if (dataToSave.updatedAt?.type) mappedData[czechKey].typ = dataToSave.updatedAt.type;
                                if (dataToSave.updatedAt?.dateTime) mappedData[czechKey].datum_a_čas = dataToSave.updatedAt.dateTime;
                            }
                        } else if (englishKey === 'concepts') {
                            // Map concepts array - this needs to be recursive or handle each concept property
                            mappedData[czechKey] = dataToSave.concepts.map((concept: any) => {
                                const mappedConcept: any = {};
                                for (const conceptEnglishKey in concept) {
                                    // This mapping needs to be more robust for nested concept properties
                                    // For now, let's assume direct mapping for simple concept fields
                                    // and handle specific nested ones like name, definition, description
                                    if (conceptEnglishKey === 'name' || conceptEnglishKey === 'definition' || conceptEnglishKey === 'description') {
                                        mappedConcept[conceptEnglishKey] = concept[conceptEnglishKey]; // Assuming name, definition, description are already mapped in initialVocabulary
                                    } else {
                                        mappedConcept[conceptEnglishKey] = concept[conceptEnglishKey];
                                    }
                                }
                                return mappedConcept;
                            });
                        }
                        else {
                            mappedData[czechKey] = dataToSave[englishKey];
                        }
                    } else {
                        // If no mapping found, use the English key directly (e.g., for iri)
                        mappedData[englishKey] = dataToSave[englishKey];
                    }
                }
            }

            // Ensure "@context" is handled correctly
            if (dataToSave["@context"]) {
                mappedData["@context"] = dataToSave["@context"];
            }

            const text = await writer.writeText(mappedData as any); // Pass the mapped data to the writer
            console.log("Saved Vocabulary:", text);
            alert("Vocabulary saved successfully! Check console for output.");
        } catch (error) {
            console.error("Error saving vocabulary:", error);
            alert("Failed to save vocabulary.");
        }
    };

    return (
        <div>
            <h2>OFN Vocabulary Editor</h2>
            <div>
                <label>Context:</label>
                <input
                    type="text"
                    value={vocabulary.context || ''}
                    onChange={(e) => handleInputChange(e, 'context')}
                />
            </div>
            <div>
                <label>IRI:</label>
                <input
                    type="text"
                    value={vocabulary.iri || ''}
                    onChange={(e) => handleInputChange(e, 'iri')}
                />
            </div>
            <div>
                <label>Type:</label>
                <input
                    type="text"
                    value={vocabulary.type?.join(', ') || ''}
                    onChange={(e) => handleInputChange(e, 'type')}
                />
            </div>
            <div>
                <label>Name (cs):</label>
                <input
                    type="text"
                    value={vocabulary.name?.cs || ''}
                    onChange={(e) => handleInputChange(e, 'name', 'cs')}
                />
            </div>
            <div>
                <label>Name (en):</label>
                <input
                    type="text"
                    value={vocabulary.name?.en || ''}
                    onChange={(e) => handleInputChange(e, 'name', 'en')}
                />
            </div>
            <div>
                <label>Description (cs):</label>
                <textarea
                    value={vocabulary.description?.cs || ''}
                    onChange={(e) => handleInputChange(e, 'description', 'cs')}
                />
            </div>
            <div>
                <label>Description (en):</label>
                <textarea
                    value={vocabulary.description?.en || ''}
                    onChange={(e) => handleInputChange(e, 'description', 'en')}
                />
            </div>
            <div>
                <label>Created At Type:</label>
                <input
                    type="text"
                    value={vocabulary.createdAt?.type || ''}
                    onChange={(e) => handleInputChange(e, 'createdAt', undefined, 'type')}
                />
            </div>
            <div>
                <label>Created At Date:</label>
                <input
                    type="text"
                    value={vocabulary.createdAt?.date || ''}
                    onChange={(e) => handleInputChange(e, 'createdAt', undefined, 'date')}
                />
            </div>
            <div>
                <label>Updated At Type:</label>
                <input
                    type="text"
                    value={vocabulary.updatedAt?.type || ''}
                    onChange={(e) => handleInputChange(e, 'updatedAt', undefined, 'type')}
                />
            </div>
            <div>
                <label>Updated At Date/Time:</label>
                <input
                    type="text"
                    value={vocabulary.updatedAt?.dateTime || ''}
                    onChange={(e) => handleInputChange(e, 'updatedAt', undefined, 'dateTime')}
                />
            </div>
            {/*
                Handling 'concepts' array would require a more complex UI,
                likely involving dynamic lists of inputs for each concept's properties.
                For this initial creation, we'll omit direct editing of 'concepts'.
            */}
            <button onClick={handleSave}>Save Vocabulary</button>
        </div>
    );
};

export default OfnEditor;