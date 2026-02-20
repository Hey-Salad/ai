# CheriML API Endpoints Documentation

Complete API reference for CheriML code generation endpoints.

---

## Base URL

After deployment:
```
https://heysalad-ai.pages.dev
```

Local development:
```
http://localhost:5173
```

---

## Endpoints

### 1. Health Check

Check if CheriML API is running and configured.

**Endpoint**: `GET /api/cheriml/health`

**Response**:
```json
{
  "status": "healthy",
  "service": "CheriML API",
  "version": "0.2.0",
  "timestamp": "2026-02-20T12:00:00.000Z",
  "endpoints": {
    "POST /api/cheriml/generate-function": "Generate functions (T1)",
    "POST /api/cheriml/generate-component": "Generate components (T2)",
    "POST /api/cheriml/generate-test": "Generate tests (T3)",
    "POST /api/cheriml/generate-endpoint": "Generate API endpoints (T4)"
  },
  "configuration": {
    "geminiApiKey": "configured"
  }
}
```

**cURL Example**:
```bash
curl https://heysalad-ai.pages.dev/api/cheriml/health
```

---

### 2. Generate Function (T1)

Generate a production-ready function from specifications.

**Endpoint**: `POST /api/cheriml/generate-function`

**Request Body**:
```json
{
  "title": "Generate Fibonacci function",
  "description": "Create a function that calculates the nth Fibonacci number using memoization",
  "language": "typescript",
  "functionName": "fibonacci",
  "returnType": "number",
  "parameters": [
    { "name": "n", "type": "number" }
  ],
  "constraints": [
    "Use memoization for efficiency",
    "Handle negative numbers",
    "Include JSDoc comments"
  ],
  "acceptanceCriteria": [
    "Returns correct Fibonacci number",
    "Efficient for large numbers",
    "Handles edge cases"
  ]
}
```

**Response**:
```json
{
  "id": "t1-1708435200000",
  "taskType": "T1_GENERATE_FUNCTION",
  "status": "success",
  "output": {
    "code": "/**\n * Calculates the nth Fibonacci number using memoization\n * @param n - The position in the Fibonacci sequence\n * @returns The Fibonacci number at position n\n */\nexport function fibonacci(n: number): number {\n  const memo: Record<number, number> = {};\n  \n  function fib(num: number): number {\n    if (num < 0) return 0;\n    if (num <= 1) return num;\n    if (memo[num]) return memo[num];\n    \n    memo[num] = fib(num - 1) + fib(num - 2);\n    return memo[num];\n  }\n  \n  return fib(n);\n}",
    "summary": "Generated typescript function: fibonacci",
    "details": "..."
  },
  "validation": {
    "passed": true,
    "errors": []
  },
  "metrics": {
    "linesChanged": 18
  },
  "nextSteps": [
    "Review generated code",
    "Run tests to verify functionality",
    "Add to appropriate module",
    "Export from index file"
  ]
}
```

**cURL Example**:
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-function \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Generate add function",
    "description": "Create a function that adds two numbers",
    "language": "typescript",
    "functionName": "add",
    "returnType": "number",
    "parameters": [
      {"name": "a", "type": "number"},
      {"name": "b", "type": "number"}
    ],
    "constraints": ["Must be a pure function"],
    "acceptanceCriteria": ["Returns sum of two numbers"]
  }'
```

---

### 3. Generate Component (T2)

Generate a UI component with proper typing and accessibility.

**Endpoint**: `POST /api/cheriml/generate-component`

**Request Body**:
```json
{
  "title": "Generate Button component",
  "description": "Create a reusable button component with variants and sizes",
  "language": "typescript",
  "componentName": "Button",
  "framework": "react",
  "props": [
    { "name": "children", "type": "React.ReactNode", "required": true },
    { "name": "variant", "type": "'primary' | 'secondary' | 'danger'", "required": false },
    { "name": "size", "type": "'sm' | 'md' | 'lg'", "required": false },
    { "name": "onClick", "type": "() => void", "required": false }
  ],
  "constraints": [
    "Use TypeScript interfaces",
    "Include accessibility attributes",
    "Support different variants and sizes"
  ],
  "acceptanceCriteria": [
    "Renders children content",
    "Supports all variants",
    "Fully typed with TypeScript"
  ]
}
```

**Response**:
```json
{
  "id": "t2-1708435200000",
  "taskType": "T2_GENERATE_COMPONENT",
  "status": "success",
  "output": {
    "code": "interface ButtonProps {\n  children: React.ReactNode;\n  variant?: 'primary' | 'secondary' | 'danger';\n  size?: 'sm' | 'md' | 'lg';\n  onClick?: () => void;\n}\n\nexport const Button: React.FC<ButtonProps> = ({\n  children,\n  variant = 'primary',\n  size = 'md',\n  onClick\n}) => {\n  return (\n    <button\n      className={`btn btn-${variant} btn-${size}`}\n      onClick={onClick}\n      type=\"button\"\n    >\n      {children}\n    </button>\n  );\n};",
    "summary": "Generated react component: Button",
    "details": "..."
  },
  "validation": {
    "passed": true,
    "errors": []
  },
  "metrics": {
    "linesChanged": 22
  },
  "nextSteps": [
    "Review generated component",
    "Add styles/CSS",
    "Test with different props",
    "Add to component library"
  ]
}
```

**cURL Example**:
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-component \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Generate Card component",
    "description": "Create a card component for displaying content",
    "language": "typescript",
    "componentName": "Card",
    "framework": "react",
    "props": [
      {"name": "title", "type": "string", "required": false},
      {"name": "children", "type": "React.ReactNode", "required": true}
    ],
    "constraints": ["Use TypeScript", "Accessible markup"],
    "acceptanceCriteria": ["Renders content", "Fully typed"]
  }'
```

---

### 4. Generate Test Suite (T3)

Generate comprehensive tests with high coverage.

**Endpoint**: `POST /api/cheriml/generate-test`

**Request Body**:
```json
{
  "title": "Generate tests for utility functions",
  "description": "Create comprehensive test suite for array utilities",
  "language": "typescript",
  "code": "export function chunk<T>(array: T[], size: number): T[][] {\n  const chunks: T[][] = [];\n  for (let i = 0; i < array.length; i += size) {\n    chunks.push(array.slice(i, i + size));\n  }\n  return chunks;\n}",
  "targetFunction": "chunk",
  "testFramework": "vitest",
  "coverageTarget": 90,
  "constraints": [
    "Test all edge cases",
    "Use descriptive test names",
    "Test with different data types"
  ],
  "acceptanceCriteria": [
    "90% code coverage",
    "All edge cases covered",
    "Tests are independent"
  ]
}
```

**Response**:
```json
{
  "id": "t3-1708435200000",
  "taskType": "T3_GENERATE_TEST_SUITE",
  "status": "success",
  "output": {
    "code": "import { describe, it, expect } from 'vitest';\nimport { chunk } from './utils';\n\ndescribe('chunk', () => {\n  it('should chunk array into specified size', () => {\n    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);\n  });\n\n  it('should handle empty array', () => {\n    expect(chunk([], 2)).toEqual([]);\n  });\n\n  it('should handle size larger than array', () => {\n    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);\n  });\n});",
    "summary": "Generated vitest test suite for chunk",
    "details": "..."
  },
  "validation": {
    "passed": true,
    "errors": []
  },
  "metrics": {
    "linesChanged": 15,
    "coverage": 90
  },
  "nextSteps": [
    "Review generated tests",
    "Run test suite",
    "Check coverage report",
    "Add additional edge cases if needed"
  ]
}
```

**cURL Example**:
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-test \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Generate tests",
    "description": "Create test suite",
    "language": "typescript",
    "code": "export function add(a: number, b: number) { return a + b; }",
    "targetFunction": "add",
    "testFramework": "vitest",
    "coverageTarget": 80,
    "constraints": ["Test edge cases"],
    "acceptanceCriteria": ["80% coverage"]
  }'
```

---

### 5. Generate API Endpoint (T4)

Generate RESTful API endpoints with validation and error handling.

**Endpoint**: `POST /api/cheriml/generate-endpoint`

**Request Body**:
```json
{
  "title": "Generate user registration endpoint",
  "description": "Create POST endpoint for user registration",
  "language": "typescript",
  "method": "POST",
  "path": "/api/users/register",
  "requestSchema": {
    "email": "string (required, valid email)",
    "password": "string (required, min 8 chars)",
    "name": "string (required)"
  },
  "responseSchema": {
    "success": "boolean",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    },
    "token": "string"
  },
  "authentication": "none",
  "constraints": [
    "Validate email format",
    "Hash password before storing",
    "Check for duplicate emails",
    "Return JWT token"
  ],
  "acceptanceCriteria": [
    "Creates new user",
    "Returns JWT token",
    "Validates input",
    "Handles duplicates"
  ]
}
```

**Response**:
```json
{
  "id": "t4-1708435200000",
  "taskType": "T4_GENERATE_API_ENDPOINT",
  "status": "success",
  "output": {
    "code": "app.post('/api/users/register', async (req, res) => {\n  try {\n    const { email, password, name } = req.body;\n    \n    // Validate input\n    if (!email || !password || !name) {\n      return res.status(400).json({ error: 'Missing required fields' });\n    }\n    \n    // Check for duplicate\n    const existing = await User.findOne({ email });\n    if (existing) {\n      return res.status(409).json({ error: 'Email already exists' });\n    }\n    \n    // Hash password\n    const hashedPassword = await bcrypt.hash(password, 10);\n    \n    // Create user\n    const user = await User.create({ email, password: hashedPassword, name });\n    \n    // Generate token\n    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);\n    \n    res.json({\n      success: true,\n      user: { id: user.id, email: user.email, name: user.name },\n      token\n    });\n  } catch (error) {\n    res.status(500).json({ error: 'Internal server error' });\n  }\n});",
    "summary": "Generated POST endpoint: /api/users/register",
    "details": "..."
  },
  "validation": {
    "passed": true,
    "errors": []
  },
  "metrics": {
    "linesChanged": 30
  },
  "nextSteps": [
    "Review generated endpoint",
    "Register route in app",
    "Add API documentation",
    "Test with different inputs"
  ]
}
```

**cURL Example**:
```bash
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-endpoint \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Generate GET endpoint",
    "description": "Create endpoint to get user by ID",
    "language": "typescript",
    "method": "GET",
    "path": "/api/users/:id",
    "authentication": "jwt",
    "constraints": ["Validate user ID", "Handle not found"],
    "acceptanceCriteria": ["Returns user data", "Proper errors"]
  }'
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

**Status Codes**:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `500` - Internal Server Error

---

## Testing the API

### Using cURL

```bash
# Health check
curl https://heysalad-ai.pages.dev/api/cheriml/health

# Generate function
curl -X POST https://heysalad-ai.pages.dev/api/cheriml/generate-function \
  -H "Content-Type: application/json" \
  -d @request.json
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('https://heysalad-ai.pages.dev/api/cheriml/generate-function', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Generate add function',
    description: 'Create a function that adds two numbers',
    language: 'typescript',
    functionName: 'add',
    returnType: 'number',
    parameters: [
      { name: 'a', type: 'number' },
      { name: 'b', type: 'number' }
    ],
    constraints: ['Must be pure function'],
    acceptanceCriteria: ['Returns sum']
  })
});

const result = await response.json();
console.log(result.output.code);
```

### Using the SDK

```typescript
import { HeySaladAI, createCheriML } from '@heysalad/ai';

const aiClient = new HeySaladAI();
aiClient.configureProvider('gemini', {
  apiKey: process.env.GEMINI_API_KEY,
});

const cheriml = createCheriML(aiClient);

const result = await cheriml.generateFunction({
  id: 'test-1',
  taskType: 'T1_GENERATE_FUNCTION',
  title: 'Generate add function',
  description: 'Create a function that adds two numbers',
  context: { language: 'typescript' },
  requirements: {
    functionName: 'add',
    returnType: 'number',
    constraints: [],
    acceptanceCriteria: [],
  },
  config: {},
});

console.log(result.output.code);
```

---

## Rate Limiting

Currently no rate limiting is enforced, but recommended limits:
- 60 requests per minute per IP
- 1000 requests per day per API key

---

## CORS

All endpoints support CORS with:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

---

## Next Steps

1. Deploy to Cloudflare: `./scripts/deploy-cloudflare.sh`
2. Test health endpoint: `curl https://heysalad-ai.pages.dev/api/cheriml/health`
3. Try generating code with the examples above
4. Integrate into your application

---

**Last Updated**: February 20, 2026  
**API Version**: 0.2.0
