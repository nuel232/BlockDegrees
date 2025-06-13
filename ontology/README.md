# University Ontology

This is a simple university ontology created for the CSC-421 course assignment.

## Overview

This ontology models the basic structure and relationships within a university domain, including:

- **Classes**: Person, Student, Professor, Course, Department, Faculty, etc.
- **Relationships**: teaches, takes, belongsTo, enrolledIn, etc.
- **Properties**: name, id, email, credits, etc.

## Class Hierarchy

- Person
  - Student
    - UndergraduateStudent
    - GraduateStudent
  - Professor
- Course
- Department
- Faculty
- Degree
- Research

## Key Relationships

- Professors teach Courses
- Students take Courses
- Professors belong to Departments
- Students are enrolled in Departments
- Departments offer Courses
- Departments are part of Faculties
- Professors conduct Research
- Students participate in Research
- Students pursue Degrees
- Departments offer Degrees

## Using with Protégé

To open this ontology in Protégé:

1. Download and install Protégé from [https://protege.stanford.edu/](https://protege.stanford.edu/)
2. Launch Protégé
3. Go to File > Open
4. Navigate to and select the `university.owl` file
5. The ontology will be loaded into Protégé, where you can visualize and edit it

## Visualization

In Protégé, you can visualize the ontology in different ways:
- Use the "Classes" tab to see the class hierarchy
- Use the "Object Properties" tab to see the relationships
- Use the "Data Properties" tab to see the properties
- Use the "OntoGraf" plugin (if installed) for a visual graph representation

## Extending the Ontology

This is a basic ontology that can be extended by:
- Adding more specific classes (e.g., different types of professors)
- Adding more properties to classes
- Defining instances/individuals
- Adding more complex relationships and constraints 