# 1️⃣ CREATE – RResource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>S: create Resource(data)
        S->>DB: INSERT INTO resources
        DB-->>S: Result / Duplicate error

        alt Duplicate
            S-->>B: Duplicate detected
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            S-->>B: Created resource
            B-->>F: 201 Created
            F-->>U: Show success message
        end
    end
```

# 2️⃣ READ — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Open resources page
    F->>B: GET /api/resources

    B->>S: getAllResources()
    S->>DB: SELECT * FROM resources
    DB-->>S: Resource list

    alt Resources found
        S-->>B: Resource data
        B-->>F: 200 OK + JSON[]
        F-->>U: Display resources
    else Database error
        S-->>B: DB error
        B-->>F: 500 Internal Server Error
        F-->>U: Show error message
    end
```

# 3️⃣ UPDATE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Edit resource and click Update
    F->>F: Client-side validation
    F->>B: PUT /api/resources/:id (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>S: updateResource(id,data)
        S->>DB: UPDATE resources WHERE id=:id
        DB-->>S: Result

        alt Resource not found
            S-->>B: No rows updated
            B-->>F: 404 Not Found
            F-->>U: Show error message
        else Success
            S-->>B: Updated resource
            B-->>F: 200 OK
            F-->>U: Show success message
        end
    end
```

# 4️⃣ DELETE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Click Delete button
    F->>B: DELETE /api/resources/:id

    B->>S: deleteResource(id)
    S->>DB: DELETE FROM resources WHERE id=:id
    DB-->>S: Result

    alt Resource not found
        S-->>B: No rows deleted
        B-->>F: 404 Not Found
        F-->>U: Show error message
    else Success
        S-->>B: Resource deleted
        B-->>F: 204 No Content
        F-->>U: Remove resource from list
    end
```