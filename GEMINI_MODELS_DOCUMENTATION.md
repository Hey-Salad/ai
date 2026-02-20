# Gemini Models Documentation

**API Key:** `AQ.Ab8RN6KEEs9pIcRoGvul1NVTF8UItwUHo-wqlgtYUDT7uTzJkw`
**Endpoint:** `https://aiplatform.googleapis.com/v1/publishers/google/models/{MODEL}:streamGenerateContent?key={API_KEY}`
**Test Date:** 2026-02-19
**Project ID:** 865990119791
**Region:** europe-west1

---

## ✅ Working Models (7 models)

### Gemini 3 Series (Latest - with Extended Thinking)

#### 1. gemini-3.1-pro-preview
- **Status:** ✅ Working
- **Response:** "Hello! How can I help you today?"
- **Features:** Extended thinking via `thoughtSignature`
- **Token Usage:**
  - Prompt: 2 tokens
  - Response: 9 tokens
  - Total: 106 tokens (95 thought tokens)
- **Use Case:** Latest pro model with advanced reasoning
- **Model Version:** `gemini-3.1-pro-preview`
- **Response Time:** ~5 seconds

```json
{
  "candidates": [{
    "content": {
      "role": "model",
      "parts": [{
        "text": "Hello! How can I help you today?",
        "thoughtSignature": "CmMBjz1rX6gGlecA3TmZ7uPq..."
      }]
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": {
    "promptTokenCount": 2,
    "candidatesTokenCount": 9,
    "totalTokenCount": 106
  }
}
```

#### 2. gemini-3-flash-preview
- **Status:** ✅ Working
- **Response:** "Hello! How can I help you today?"
- **Features:** Extended thinking via `thoughtSignature`, fastest Gemini 3
- **Token Usage:**
  - Prompt: 2 tokens
  - Response: 9 tokens
  - Total: 76 tokens (65 thought tokens)
- **Use Case:** Fast responses with thinking capability
- **Model Version:** `gemini-3-flash-preview`
- **Response Time:** ~3 seconds

```json
{
  "candidates": [{
    "content": {
      "role": "model",
      "parts": [{
        "text": "Hello! How can I help you today?",
        "thoughtSignature": "CiQBjz1rX94p1vOFXtHLlpbU..."
      }]
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": {
    "promptTokenCount": 2,
    "candidatesTokenCount": 9,
    "totalTokenCount": 76
  }
}
```

#### 3. gemini-3-pro-preview
- **Status:** ✅ Working
- **Response:** "Hello! How can I help you today?"
- **Features:** Extended thinking via `thoughtSignature`, MOST thought tokens
- **Token Usage:**
  - Prompt: 2 tokens
  - Response: 9 tokens
  - Total: 274 tokens (263 thought tokens!)
- **Use Case:** Deepest reasoning, most comprehensive thinking
- **Model Version:** `gemini-3-pro-preview`
- **Response Time:** ~6 seconds

```json
{
  "candidates": [{
    "content": {
      "role": "model",
      "parts": [{
        "text": "Hello! How can I help you today?",
        "thoughtSignature": "ClkBjz1rXz/rHvwyXE3lHrgZ..."
      }]
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": {
    "promptTokenCount": 2,
    "candidatesTokenCount": 9,
    "totalTokenCount": 274,
    "thoughtsTokenCount": 263
  }
}
```

---

### Gemini 2.5 Series (Stable Models)

#### 4. gemini-2.5-flash
- **Status:** ✅ Working
- **Response:** "Hello! How can I help you today?"
- **Features:** Fast, efficient, no thinking overhead
- **Token Usage:**
  - Prompt: 2 tokens
  - Response: 9 tokens
  - Total: 27 tokens
- **Use Case:** Production-ready, balanced speed/quality
- **Model Version:** `gemini-2.5-flash`

#### 5. gemini-2.5-flash-lite
- **Status:** ✅ Working
- **Response:** "AI learns from data to make decisions or predictions."
- **Features:** Lightest, fastest, cheapest
- **Token Usage:**
  - Prompt: 8 tokens
  - Response: 10 tokens
  - Total: 18 tokens
- **Use Case:** High-volume, simple tasks
- **Model Version:** `gemini-2.5-flash-lite`

#### 6. gemini-2.5-pro
- **Status:** ✅ Working
- **Response:** "Hello there! How can I help you today?"
- **Features:** Extended thinking (563 thought tokens)
- **Token Usage:**
  - Prompt: 2 tokens
  - Response: 10 tokens
  - Total: 575 tokens (563 thought tokens)
- **Use Case:** High-quality reasoning, production-ready
- **Model Version:** `gemini-2.5-pro`

#### 7. gemini-2.5-flash-image
- **Status:** ✅ Working
- **Response:** "Hello! How can I help you today?"
- **Features:** Vision + text support
- **Token Usage:**
  - Prompt: 2 tokens
  - Response: 9 tokens
  - Total: 11 tokens
- **Use Case:** Image analysis with text generation
- **Model Version:** `gemini-2.5-flash-image`

---

## ⚠️ Rate Limited Models (2 models)

#### 8. gemini-3-pro-image-preview
- **Status:** ⚠️ Rate Limited
- **Error:** 429 Resource exhausted
- **Message:** "Resource exhausted. Please try again later."
- **Note:** Model exists but quota exceeded

#### 9. gemini-embedding-001
- **Status:** ⚠️ Rate Limited
- **Error:** 429 Quota exceeded
- **Message:** "Quota exceeded for generate_content_requests_per_minute_per_project_per_base_model"
- **Note:** Wrong endpoint - embeddings use different API

---

## ❌ Not Available / No Access (9 models)

#### 10. gemini-2.5-flash-native-audio-preview-12-2025
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access

#### 11. gemini-2.5-flash-preview-tts
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access

#### 12. gemini-2.5-pro-preview-tts
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access

#### 13. lyria-realtime-exp
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access
- **Type:** Music generation

#### 14. veo-3.1-generate-preview
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access
- **Type:** Video generation

#### 15. imagen
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access
- **Type:** Text-to-image

#### 16. gemini-2.5-computer-use-preview-10-2025
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access
- **Type:** Computer use/automation

#### 17. deep-research-pro-preview-12-2025
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access
- **Type:** Research agent

#### 18. gemini-robotics-er-1.5-preview
- **Status:** ❌ Not Found
- **Error:** 404 - Model not found or no access
- **Type:** Robotics

---

## 🎯 Focus Models for HeySalad Platform

Based on testing, we'll implement these **3 Gemini 3 models** with extended thinking:

### Primary Implementation Target

| Model | Speed | Quality | Thinking Tokens | Best For |
|-------|-------|---------|-----------------|----------|
| **gemini-3.1-pro-preview** | Medium | Excellent | 95 | Latest features, balanced |
| **gemini-3-flash-preview** | Fast | Very Good | 65 | Speed + thinking |
| **gemini-3-pro-preview** | Slow | Best | 263 | Deep reasoning |

### Key Features to Implement

1. **thoughtSignature Support** - Extract and handle extended thinking
2. **Streaming Support** - Handle chunked responses
3. **Token Counting** - Track prompt, response, and thought tokens
4. **Error Handling** - Handle 404, 429, and other API errors
5. **Model Routing** - Route requests based on use case

### API Request Format

```bash
curl "https://aiplatform.googleapis.com/v1/publishers/google/models/{MODEL}:streamGenerateContent?key=${API_KEY}" \
-X POST \
-H "Content-Type: application/json" \
-d '{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Your prompt here"
        }
      ]
    }
  ]
}'
```

### Response Format

```json
[
  {
    "candidates": [{
      "content": {
        "role": "model",
        "parts": [{
          "text": "Response chunk",
          "thoughtSignature": "base64_encoded_thinking"
        }]
      },
      "finishReason": "STOP"
    }],
    "usageMetadata": {
      "promptTokenCount": 2,
      "candidatesTokenCount": 9,
      "totalTokenCount": 274,
      "thoughtsTokenCount": 263,
      "trafficType": "ON_DEMAND"
    },
    "modelVersion": "gemini-3-pro-preview",
    "createTime": "2026-02-19T22:11:27.800682Z",
    "responseId": "j4qXaarvMKaRkDtZDk..."
  }
]
```

---

## Model Comparison Chart

| Feature | Gemini 3.1 Pro | Gemini 3 Flash | Gemini 3 Pro | Gemini 2.5 Flash |
|---------|----------------|----------------|--------------|------------------|
| Extended Thinking | ✅ Yes (95 tokens) | ✅ Yes (65 tokens) | ✅ Yes (263 tokens) | ❌ No |
| Speed | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Quality | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Cost Efficiency | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Production Ready | ✅ Yes | ✅ Yes | 🔄 Preview | ✅ Yes |

---

## Next Steps

1. **Create Gemini Provider** - Add `packages/core/src/providers/gemini.ts`
2. **Implement Streaming** - Handle chunked responses
3. **Add Thinking Support** - Extract and display thoughtSignature
4. **Update Router** - Add Gemini models to routing logic
5. **Add Tests** - Test all three focus models
6. **Update Documentation** - Add Gemini to main docs

---

## Notes

- All models use streaming by default
- thoughtSignature is base64 encoded thinking process
- Quota limits apply per minute per project
- Some specialized models require separate access/quotas
- Audio/TTS/Video models may need different endpoints
