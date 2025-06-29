import { encode } from 'plantuml-encoder';

export function PlantUmlEditor() {
  const plantUmlCode = `
@startuml
title "Example C# Object Model"
skinparam classAttributeIconSize 0
skinparam style strictuml
skinparam class {
  BackgroundColor #f8fafc
  ArrowColor #64748b
  BorderColor #64748b
}

' Abstract base class
abstract class Person {
  + Name: string
  # BirthDate: DateTime
  + {abstract} GetAge(): int
}

' Derived class showing inheritance
class Employee extends Person {
  - EmployeeId: Guid
  - Salary: decimal
  + Department: Department
  + override GetAge(): int
  + PerformWork()
}

' An enum for a specific property type
enum EmployeeStatus {
  Active
  OnLeave
  Terminated
}

' A class showing an association
class Department {
  + Name: string
  + GetEmployees(): List<Employee>
}

' Relationships between the types
Department "1" o-- "0..*" Employee : "contains"
Employee --> EmployeeStatus

@enduml
`;

  const encodedPlantUml = encode(plantUmlCode);

  const imageUrl = `http://www.plantuml.com/plantuml/svg/${encodedPlantUml}`;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '1rem', boxSizing: 'border-box', backgroundColor: '#f8fafc', overflow: 'auto' }}>
      <img src={imageUrl} alt="C# Object Model Visualization" style={{ maxWidth: '100%', maxHeight: '100%', backgroundColor: 'white' }} />
    </div>
  );
}
