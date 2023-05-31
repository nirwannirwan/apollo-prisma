# Chrysaule BE Test Brief

## Instruction

Company ABC would like to build a GraphQL API server to support their internal team to build a simple Store Front Web Application. The API should support the features below:

- Authentication Login / Register
- API for CRUD operator on Category model
- API for CRUD operator on Product model

## Acceptance Criteria

- User should be able to Login to the App using email and password with the possible role of either USER or ADMIN
- Only ADMIN role can create/update/delete both Category and Product model
- Both USER and ADMIN roles can list both Category and Product model
- Each Product should belong to many Category and each Category should has many Product
- Users should be able to fetch a list of Products with their related Categories in a single-round-trip GraphQL query.
- Extra Tip: Create sample on how to resolve n+1 GraphQL problem.

## Tech Stacks

- Apollo Server v4 (\*mandatory)
- Prisma ORM (\*preferable)
- TypeScript (\*preferable)
- Unit Test (\*preferable)
