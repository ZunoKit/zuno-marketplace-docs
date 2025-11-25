---
title: "ABIs Endpoints"
package: "abis"
lastUpdated: "2025-11-25"
scope: "api-reference"
complexity: "intermediate"
category: "endpoints"
relatedTopics:
  - "authentication"
  - "response-format"
  - "contracts-endpoints"
---

# ABIs Endpoints

Complete API reference for managing smart contract ABIs.

## Overview

The ABIs API provides endpoints for listing, retrieving, and creating contract ABIs across multiple blockchain networks. All ABIs are stored on IPFS via Pinata for immutability and decentralization.

## Base URL

```
https://api.zuno-marketplace.com/api/abis
http://localhost:3000/api/abis (development)
```

## Endpoints

### List ABIs

Get a paginated list of all ABIs with optional filtering.

```http
GET /api/abis
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `network` | string | No | - | Filter by blockchain network (ethereum, polygon, bsc, arbitrum, optimism, base, sepolia) |
| `verified` | boolean | No | - | Filter by verification status (true/false) |
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 20 | Items per page (max: 100) |
| `search` | string | No | - | Search by contract name or address |
| `sortBy` | string | No | createdAt | Sort field (createdAt, name, network) |
| `sortOrder` | string | No | desc | Sort direction (asc, desc) |

#### Example Request

```bash
curl -H "X-API-Key: sk_live_..." \
     "https://api.zuno-marketplace.com/api/abis?network=ethereum&page=1&limit=20&verified=true"
```

#### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "abi_v1_xyz123",
      "contractAddress": "0x1234567890abcdef...",
      "contractName": "USDC",
      "network": "ethereum",
      "abiHash": "QmPK1s3pNYLi9ERiq3BDxKa4XoaTw3g6isQxLV4XDBm34",
      "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmPK1s3pNYLi9ERiq3BDxKa4XoaTw3g6isQxLV4XDBm34",
      "verified": true,
      "createdAt": "2025-01-19T10:00:00Z",
      "updatedAt": "2025-01-20T11:00:00Z"
    },
    {
      "id": "abi_v1_abc456",
      "contractAddress": "0xabcdef1234567890...",
      "contractName": "Uniswap V3 Router",
      "network": "ethereum",
      "abiHash": "QmXyzAbc123def456...",
      "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXyzAbc123def456...",
      "verified": true,
      "createdAt": "2025-01-18T09:00:00Z",
      "updatedAt": "2025-01-18T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Get Single ABI

Retrieve a specific ABI by ID, including the full ABI array and metadata.

```http
GET /api/abis/{id}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | ABI ID (e.g., `abi_v1_xyz123`) |

#### Example Request

```bash
curl -H "X-API-Key: sk_live_..." \
     "https://api.zuno-marketplace.com/api/abis/abi_v1_xyz123"
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "abi_v1_xyz123",
    "contractAddress": "0x1234567890abcdef...",
    "contractName": "USDC",
    "network": "ethereum",
    "abi": [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "abiHash": "QmPK1s3pNYLi9ERiq3BDxKa4XoaTw3g6isQxLV4XDBm34",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmPK1s3pNYLi9ERiq3BDxKa4XoaTw3g6isQxLV4XDBm34",
    "verified": true,
    "metadata": {
      "compiler": "0.8.19",
      "optimization": true,
      "runs": 200,
      "license": "MIT"
    },
    "createdAt": "2025-01-19T10:00:00Z",
    "updatedAt": "2025-01-19T10:00:00Z"
  }
}
```

### Create ABI

Upload a new smart contract ABI. Requires authentication and appropriate permissions.

```http
POST /api/abis
```

**Authentication Required**: Yes (API Key or Session)

#### Request Body

```json
{
  "contractAddress": "0x1234567890abcdef...",
  "contractName": "My Contract",
  "network": "ethereum",
  "abi": [
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{"type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "metadata": {
    "compiler": "0.8.19",
    "optimization": true,
    "runs": 200,
    "license": "MIT"
  }
}
```

#### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `X-API-Key` | Yes (if not using session) | API key for authentication |

#### Validation Rules

- **contractAddress**: Must be valid Ethereum address (0x...)
- **network**: Must be supported network (ethereum, polygon, bsc, etc.)
- **abi**: Must be valid ABI JSON array
- **abi.type**: Must be one of: function, constructor, event, fallback, receive
- **metadata.compiler**: Optional but recommended for verification

#### Example Request

```bash
curl -X POST https://api.zuno-marketplace.com/api/abis \
  -H "X-API-Key: sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "contractName": "My Token",
    "network": "ethereum",
    "abi": [
      {
        "inputs": [
          {"name": "to", "type": "address"},
          {"name": "amount", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"type": "bool"}],
        "type": "function"
      }
    ],
    "metadata": {
      "compiler": "0.8.19",
      "optimization": true
    }
  }'
```

#### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "abi_v1_xyz123",
    "contractAddress": "0x1234...",
    "contractName": "My Token",
    "network": "ethereum",
    "abiHash": "QmPK1s3pNYLi9ERiq3BDxKa4XoaTw3g6isQxLV4XDBm34",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmPK1s3pNYLi9ERiq3BDxKa4XoaTw3g6isQxLV4XDBm34",
    "verified": false,
    "createdAt": "2025-01-19T10:00:00Z"
  }
}
```

### Update ABI

Update an existing ABI record. Typically used for metadata updates or verification status changes.

```http
PATCH /api/abis/{id}
```

**Authentication Required**: Yes

#### Example Request

```bash
curl -X PATCH https://api.zuno-marketplace.com/api/abis/abi_v1_xyz123 \
  -H "X-API-Key: sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "verified": true,
    "metadata": {
      "compiler": "0.8.19",
      "optimization": true
    }
  }'
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "abi_v1_xyz123",
    "verified": true,
    "updatedAt": "2025-01-19T10:30:00Z"
  }
}
```

### Delete ABI

Delete an ABI record. Soft delete is performed (data retained for audit).

```http
DELETE /api/abis/{id}
```

**Authentication Required**: Yes (admin only)

#### Example Request

```bash
curl -X DELETE https://api.zuno-marketplace.com/api/abis/abi_v1_xyz123 \
  -H "X-API-Key: sk_live_..."
```

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "abi_v1_xyz123",
    "deleted": true,
    "deletedAt": "2025-01-19T10:30:00Z"
  }
}
```

## Error Responses

### Bad Request (400)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid ABI format",
    "statusCode": 400,
    "details": {
      "field": "abi",
      "issue": "ABI must be a valid JSON array"
    }
  }
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "ABI not found",
    "statusCode": 404
  }
}
```

### Conflict (409)

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ABI",
    "message": "ABI for this contract already exists",
    "statusCode": 409,
    "details": {
      "existingId": "abi_v1_existing123"
    }
  }
}
```

## Supported Networks

| Network | Chain ID | Symbol |
|---------|----------|--------|
| Ethereum Mainnet | 1 | ETH |
| Polygon | 137 | MATIC |
| Binance Smart Chain | 56 | BNB |
| Arbitrum One | 42161 | ETH |
| Optimism | 10 | ETH |
| Base | 8453 | ETH |
| Sepolia Testnet | 11155111 | ETH |

## Best Practices

1. **Always include network** - Specify the network to improve query performance
2. **Use pagination** - Avoid fetching all records at once
3. **Cache responses** - Store ABIs locally to reduce API calls
4. **Handle IPFS timeouts** - Have fallback for slow IPFS gateways
5. **Validate locally** - Verify ABI validity before uploading
6. **Use verified ABIs** - Prefer verified ABIs for security

## Related Endpoints

- [Contracts Endpoints](/en/abis/api-reference/contracts-endpoints)
- [Networks Endpoints](/en/abis/api-reference/networks-endpoints)
- [Response Format](/en/abis/api-reference/response-format)
