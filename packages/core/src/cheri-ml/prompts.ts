/**
 * Code Generation Prompts for CheriML
 * Task-specific system messages and templates
 */

export const codeGenerationPrompts = {
  T1_GENERATE_FUNCTION: {
    system: `You are an expert code generation AI specialized in creating production-ready functions.
Your generated code must:
- Follow the specified language conventions and style guide
- Include comprehensive error handling
- Have clear JSDoc/docstring documentation
- Be type-safe and pass strict type checking
- Include unit test examples
- Be performant and maintainable
- Handle edge cases explicitly

Output ONLY the code in a markdown code block, starting with the function implementation.`,

    template: `Generate a {language} function with the following specifications:

Title: {title}
Description: {description}

Requirements:
- {constraints}

Acceptance Criteria:
- {acceptanceCriteria}

Project Configuration:
{projectConfig}

Language: {language}
Function Name: {functionName}
Return Type: {returnType}

Context:
{code}

Please generate a complete, production-ready function that meets all requirements. Include:
1. Full implementation with error handling
2. JSDoc comments explaining parameters and return value
3. Type annotations (if applicable)
4. Example usage in comments
5. Edge case handling`,
  },

  T2_GENERATE_COMPONENT: {
    system: `You are an expert UI/component generation AI specialized in creating reusable components.
Your generated components must:
- Follow the specified framework conventions ({framework})
- Be fully typed with TypeScript/PropTypes
- Include comprehensive JSDoc documentation
- Handle all edge cases (empty state, loading, error)
- Be accessible (WCAG compliant)
- Include example usage
- Be performant with proper memoization

Output ONLY the component code in a markdown code block.`,

    template: `Generate a {framework} component with the following specifications:

Title: {title}
Description: {description}

Component Name: {componentName}
Framework: {framework}

Requirements:
- {constraints}

Acceptance Criteria:
- {acceptanceCriteria}

Project Configuration:
{projectConfig}

Props/Interface:
{props}

State Management:
{state}

Context:
{code}

Please generate a complete, production-ready component that meets all requirements. Include:
1. Full component implementation
2. PropTypes or TypeScript interface
3. JSDoc comments
4. Example usage
5. Accessibility considerations
6. Performance optimizations`,
  },

  T3_GENERATE_TEST_SUITE: {
    system: `You are an expert test generation AI specialized in creating comprehensive test suites.
Your generated tests must:
- Use the specified test framework and conventions
- Achieve {coverage}% code coverage
- Include unit, integration, and edge case tests
- Have clear, descriptive test names
- Follow the Arrange-Act-Assert pattern
- Include both positive and negative test cases
- Be independent and deterministic
- Run quickly without flakiness

Output ONLY the test code in a markdown code block.`,

    template: `Generate a comprehensive test suite for {language} with the following specifications:

Title: {title}
Description: {description}

Target Function/File: {targetFunction}
File Path: {targetFile}

Test Framework: {testFramework}
Coverage Target: {coverage}%

Requirements:
- {constraints}

Acceptance Criteria:
- {acceptanceCriteria}

Project Configuration:
{projectConfig}

Code to Test:
{code}

Please generate a complete test suite that meets all requirements. Include:
1. Unit tests for all functions
2. Edge case tests
3. Error handling tests
4. Integration tests
5. Mock setup if needed
6. Test utilities and helpers
7. Achieve {coverage}% coverage`,
  },

  T4_GENERATE_API_ENDPOINT: {
    system: `You are an expert API endpoint generation AI specialized in creating RESTful endpoints.
Your generated endpoints must:
- Follow REST conventions
- Be fully typed with request/response schemas
- Include comprehensive error handling
- Have authentication/authorization checks
- Include input validation
- Have detailed JSDoc documentation
- Follow the specified project conventions
- Be production-ready

Output ONLY the endpoint code in a markdown code block.`,

    template: `Generate a {language} API endpoint with the following specifications:

Title: {title}
Description: {description}

HTTP Method: {method}
Path: {path}

Requirements:
- {constraints}

Acceptance Criteria:
- {acceptanceCriteria}

Project Configuration:
{projectConfig}

Request Schema:
{requestSchema}

Response Schema:
{responseSchema}

Authentication: {authentication}

Context:
{code}

Please generate a complete, production-ready API endpoint that meets all requirements. Include:
1. Request validation
2. Error handling with proper status codes
3. Authentication/authorization logic
4. Database operations (if applicable)
5. Response formatting
6. JSDoc documentation
7. Input/output schemas
8. Error response examples`,
  },
};

/**
 * Get system message for a task type
 */
export const getSystemMessage = (taskType: string): string => {
  const prompt = codeGenerationPrompts[taskType as keyof typeof codeGenerationPrompts];
  return prompt?.system || 'You are an expert code generation AI.';
};

/**
 * Get template for a task type
 */
export const getTemplate = (taskType: string): string => {
  const prompt = codeGenerationPrompts[taskType as keyof typeof codeGenerationPrompts];
  return prompt?.template || '';
};
