# BlockDegrees - Blockchain-Based Degree Verification System

This repository contains the implementation and knowledge graph model for BlockDegrees, a blockchain-based system for verifying academic degrees.

## Repository Structure

The repository is organized as follows:

### Neo4j Knowledge Graph
- `neo4j/blockdegrees_import.cypher` - Cypher queries for creating the knowledge graph
- `neo4j/blockdegrees_queries.cypher` - Sample queries to explore the knowledge graph
- `neo4j/simple_queries.cypher` - Simplified queries for basic analysis
- `neo4j/neo4j_queries.cypher` - Additional queries for the knowledge graph

### Scripts
- `scripts/generate_data.py` - Python script for generating sample data
- `scripts/import_to_neo4j.py` - Python script for importing data to Neo4j
- `scripts/visualize_graph.py` - Python script for visualizing the knowledge graph

### Data
- `data/research_data.json` - Sample research data in JSON format
- `data/eric.csv` - CSV data for educational records
- `data/certificates.csv` - CSV data for degree certificates

### Documentation
- `docs/README.md` - Original project documentation
- `docs/project_context_for_documentation.md` - Context for project documentation
- `docs/Project.docx` - Project document
- `docs/project proposal.docx` - Project proposal
- `docs/Algorithm.txt` - Algorithms used in the project
- `docs/note.txt` - Project notes

### Diagrams
- `diagrams/class_diagram.svg` - Class diagram for the system
- `diagrams/flowchart.svg` - Flowchart of the system
- `diagrams/usecase.svg` - Use case diagram
- `diagrams/dataflow.svg` - Data flow diagram
- `diagrams/sequence_issuance.svg` - Sequence diagram for certificate issuance
- `diagrams/activity diagram.svg` - Activity diagram for the system

### Web Application
- `src/` - Source code for the web application
- `public/` - Public assets for the web application
- `NFT-Certificate/` - NFT certificate implementation
- `package.json` - Node.js package configuration

## Knowledge Graph Structure

The BlockDegrees knowledge graph models the following entities:

1. **Students** - Individuals who own degree certificates
2. **Institutions** - Educational institutions that issue degrees
3. **DegreeNFTs** - NFT-based degree certificates
4. **DegreeTypes** - Types of academic degrees (e.g., Bachelor's, Master's, PhD)
5. **Fields** - Academic fields/disciplines
6. **Employers** - Organizations that verify degree certificates

These entities are connected through various relationships:
- **OWNS** - Students own DegreeNFTs
- **ISSUED** - Institutions issue DegreeNFTs
- **CERTIFIES** - DegreeNFTs certify specific DegreeTypes
- **IN_FIELD** - DegreeNFTs are in specific academic Fields
- **VERIFIED** - Employers verify DegreeNFTs

## Getting Started

To work with the knowledge graph:

1. Install Neo4j Desktop or use Neo4j Aura
2. Create a new database
3. Run the import script from `neo4j/blockdegrees_import.cypher`
4. Explore the data using queries from `neo4j/blockdegrees_queries.cypher`

To work with the web application:

1. Install Node.js
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
