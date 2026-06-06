# EtherVault API Documentation

Welcome to the **EtherVault** Developer API reference. This document provides technical specifications for all available endpoints, request/response schemas, security layers, and integration guides.

---

## 1. Global Specifications

### Base URL
- **Development:** `http://localhost:3001`
- **Production (Next.js Proxy):** `/api/...` -> rewritten automatically to backend server.

### Authentication & Sessions
- **Session Cookie:** Admin and user authentication tokens are stored in an `httpOnly`, `secure`, `sameSite: "lax"` cookie named `token`.
- **CORS Requirements:** Requests from client applications require `credentials: true` or `withCredentials: true` to forward session identifiers.

---

## 2. Authentication Endpoints (`/api/auth`)

### Register Recipient (User)
Creates a non-administrative recipient account associated with an existing organisation.

- **Method / Path:** `POST /api/auth/register`
- **Access Control:** Public
- **Request Body (JSON):**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Unique email address. Must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. |
  | `name` | String | Yes | Full display name of the user. |
  | `password` | String | Yes | Password. Minimum length: 8 characters. |
  | `organisationId` | String | Yes | MongoDB ID of the organisation to attach the user to. |
  | `isDemo` | Boolean | No | Flags a sandbox demo account (Default: `false`). |

- **Responses:**
  - **`201 Created`**
    ```json
    {
      "user": { "id": "64fb28a9b36..." },
      "organisation": { "id": "64fb28a9b12...", "name": "Acme Corp" },
      "status": "success"
    }
    ```
  - **`400 Bad Request`** (Missing fields, invalid email format, password too short)
    ```json
    {
      "message": "Missing fields: email",
      "status": "failed"
    }
    ```
  - **`404 Not Found`** (Organisation not found)
    ```json
    {
      "message": "Organisation not found",
      "status": "failed"
    }
    ```
  - **`409 Conflict`** (Email already exists)
    ```json
    {
      "message": "User already exists",
      "status": "failed"
    }
    ```

---

### Register Issuer (Admin)
Creates an administrative issuer account. If the organisation name does not exist, a new organisation will be created.

- **Method / Path:** `POST /api/auth/admin/register`
- **Access Control:** Public
- **Request Body (JSON):**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Unique administrator email address. |
  | `name` | String | Yes | Full display name of the administrator. |
  | `password` | String | Yes | Password. Minimum length: 8 characters. |
  | `organisationName` | String | Yes | Name of the organisation to create/attach to. |
  | `isDemo` | Boolean | No | Flags a sandbox demo account (Default: `false`). |

- **Responses:**
  - **`201 Created`**
    ```json
    {
      "user": { "id": "64fb28a9b36..." },
      "organisation": { "id": "64fb28a9b12...", "name": "Alpha Corp" },
      "status": "success"
    }
    ```
  - **`409 Conflict`** (User already exists)
    ```json
    {
      "message": "User already exists",
      "status": "failed"
    }
    ```

---

### Recipient Login
Authenticates a user account and sets the session cookie directly.

- **Method / Path:** `POST /api/auth/login`
- **Access Control:** Public
- **Request Body (JSON):**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Recipient account email address. |
  | `password` | String | Yes | Account password. |

- **Responses:**
  - **`200 OK`** (Sets HTTP cookie `token`)
    ```json
    {
      "user": { "id": "64fb28a9b36..." },
      "status": "success"
    }
    ```
  - **`403 Forbidden`** (Attempting to log into user dashboard with an admin role)
    ```json
    {
      "message": "Issuer account, please log into issuer page.",
      "status": "failed"
    }
    ```
  - **`401 Unauthorized`** (Invalid password or account details)

---

### Issuer Login (Triggers OTP)
Two-factor credentials challenge for administrative/issuer accounts. If successful, generates an OTP and logs it locally or sends it.

- **Method / Path:** `POST /api/auth/admin/login`
- **Access Control:** Public
- **Request Body (JSON):**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Issuer account email address. |
  | `password` | String | Yes | Account password. |

- **Responses:**
  - **`200 OK`** (Returns user token to verify OTP next)
    ```json
    {
      "message": "Demo account OTP is 123456",
      "token": "64fb28a9b36...",
      "status": "success"
    }
    ```
  - **`403 Forbidden`** (Attempting admin login with a non-admin role)
    ```json
    {
      "message": "Access denied. Not an Issuer.",
      "status": "failed"
    }
    ```
  - **`429 Too Many Requests`** (OTP trigger cooldown in progress)
    ```json
    {
      "message": "OTP already sent. Try again later.",
      "status": "failed"
    }
    ```

---

### Verify Issuer OTP
Verifies the 2FA code and issues the secure session cookie.

- **Method / Path:** `POST /api/auth/admin/verify`
- **Access Control:** Public
- **Request Body (JSON):**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `token` | String | Yes | The user ID token returned from `/api/auth/admin/login`. |
  | `otp` | String / Number | Yes | 6-digit OTP code (Demo: `123456`). |

- **Responses:**
  - **`200 OK`** (Sets HTTP cookie `token`)
    ```json
    {
      "message": "Admin login successful",
      "user": { "id": "64fb28a9b36..." },
      "status": "success"
    }
    ```
  - **`400 Bad Request`** (Missing payload fields or OTP expired)
  - **`401 Unauthorized`** (Invalid OTP)

---

### Session Status check
Returns credentials role information for active sessions.

- **Method / Path:** `GET /api/auth/session`
- **Access Control:** Public (reads Cookie header)
- **Responses:**
  - **`200 OK` (Logged In)**
    ```json
    {
      "auth": true,
      "role": "admin",
      "user": {
        "id": "64fb28d...",
        "name": "Jane Doe",
        "email": "jane@corp.com"
      }
    }
    ```
  - **`200 OK` (Not Logged In)**
    ```json
    {
      "auth": false
    }
    ```

---

### Logout
Clears the session cookie.

- **Method / Path:** `POST /api/auth/logout`
- **Access Control:** Public
- **Responses:**
  - **`200 OK`**
    ```json
    {
      "message": "Logged out successfully",
      "status": "success"
    }
    ```

---

## 3. Document Endpoints (`/api/document`)

### Upload & Anchor Document
Saves a binary file to IPFS, writes the cryptographic SHA-256 hash to the Polygon testnet ledger, and registers the metadata on-chain.

- **Method / Path:** `POST /api/document/upload`
- **Access Control:** Private (Issuer session required)
- **Request Body:** Multi-part Form Data
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `file` | File Binary | Yes | PDF document file. |
  | `receiverEmail` | String | Yes | Recipient user's registered email address. Must share organisation. |
  | `title` | String | No | Custom title of the document. Defaults to original file name. |
  | `metadata` | JSON String | No | Serialized key-value metadata object. |

- **Responses:**
  - **`201 Created`**
    ```json
    {
      "message": "File uploaded successfully",
      "data": {
        "verifyId": "DOC-A1B2-5D12",
        "txHash": "0x39a1c8b3..."
      },
      "status": "success"
    }
    ```
  - **`403 Forbidden`** (Recipient not in same organisation, or receiver is an admin)
  - **`409 Conflict`** (Document hash has already been anchored by this organisation)

---

### Revoke Document
Marks an anchored document as revoked, rendering verification checks failed.

- **Method / Path:** `PATCH /api/document/revoke/:id`
- **Access Control:** Private (Issuer session required; user must be the document's original issuer)
- **Path Parameters:**
  - `id`: MongoDB identifier of the target document.

- **Responses:**
  - **`200 OK`**
    ```json
    {
      "message": "Document revoked successfully",
      "status": "success"
    }
    ```
  - **`403 Forbidden`** (Session holder is not the issuer of this document)
  - **`404 Not Found`** (Document not found)

---

### Verify Document
Public endpoint to check the authenticity of a document using either its transaction hash or verification ID.

- **Method / Path:** `POST /api/document/verify`
- **Access Control:** Public
- **Request Body (JSON):**
  *Note: Provide either `hash` or `verifyId`, not both.*
  | Parameter | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `verifyId` | String | Optional | The unique string code format (e.g. `DOC-A1B2-5D12`). |
  | `hash` | String | Optional | Cryptographic SHA-256 hash of the document. |

- **Responses:**
  - **`200 OK`**
    ```json
    {
      "message": "Document(s) verified successfully",
      "count": 1,
      "results": [
        {
          "verifyId": "DOC-A1B2-5D12",
          "title": "Corporate Credentials.pdf",
          "organisation": "Alpha Corp",
          "issuer": "Jane Doe",
          "receiver": "John Smith",
          "txHash": "0x39a1c8b3...",
          "isRevoked": false,
          "issuedAt": "06 June 2026, 12:00"
        }
      ],
      "status": "success"
    }
    ```
  - **`400 Bad Request`** (Providing both `hash` and `verifyId` simultaneously, or providing neither)
  - **`404 Not Found`** (Document matching search query not found or invalid)

---

## 4. Organisation Endpoints (`/api/organisation`)

### Get All Organisations
Fetches the registry of all active organisations to populate registration forms.

- **Method / Path:** `GET /api/organisation/all`
- **Access Control:** Public
- **Responses:**
  - **`200 OK`**
    ```json
    {
      "status": "success",
      "data": [
        {
          "_id": "64fb28a9b12...",
          "name": "Alpha Corp"
        }
      ]
    }
    ```

---

## 5. Dashboard Endpoints (`/api/dashboard`)

### Get Issuer Dashboard Summary
Returns counts and aggregated stats for the issuer's organisation.

- **Method / Path:** `GET /api/dashboard/issuer`
- **Access Control:** Private (Issuer session required)
- **Responses:**
  - **`200 OK`**
    ```json
    {
      "status": "success",
      "data": {
        "stats": {
          "totalIssued": 124,
          "totalRevoked": 3,
          "activeRecipients": 45
        }
      }
    }
    ```

---

### Get Issuer Documents List
Returns all documents issued by the session holder's organisation, supporting query filters.

- **Method / Path:** `GET /api/dashboard/issuer/documents`
- **Access Control:** Private (Issuer session required)
- **Query Parameters:**
  - `limit` (Number, default: 20)
  - `status` (String: `"active" | "revoked"`)
  - `q` (Search query for titles)

---

### Get Issuer Document Details
Returns metadata details for a specific document.

- **Method / Path:** `GET /api/dashboard/issuer/documents/:id`
- **Access Control:** Private (Issuer session required)

---

### Get Recipient Dashboard Summary
Returns counts and documents corresponding to the logged-in recipient account.

- **Method / Path:** `GET /api/dashboard/recipient`
- **Access Control:** Private (Recipient session required)
