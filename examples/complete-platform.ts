/**
 * Complete HeySalad Platform Example
 * Shows all features working together:
 * - Multiple AI providers (OpenAI, Anthropic, Hugging Face)
 * - Self-hosted HeySalad-7B model
 * - RAG for grocery prices
 * - Intelligent routing
 * - Automatic fallbacks
 */

import { HeySaladAI, createRouter } from '@heysalad/ai';
import { GroceryRAG, createSampleGroceryData } from '@heysalad/grocery-rag';

async function setupPlatform() {
  console.log('🥗 Initializing HeySalad AI Platform...\n');

  // 1. Create HeySalad AI client
  const client = new HeySaladAI();

  // 2. Configure all available providers
  console.log('⚙️  Configuring providers...');

  // Option A: Use API providers (immediate, no infrastructure)
  if (process.env.OPENAI_API_KEY) {
    client.configureProvider('openai', {
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('  ✅ OpenAI configured');
  }

  if (process.env.ANTHROPIC_API_KEY) {
    client.configureProvider('anthropic', {
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    console.log('  ✅ Anthropic configured');
  }

  if (process.env.HF_API_KEY) {
    client.configureProvider('huggingface', {
      apiKey: process.env.HF_API_KEY
    });
    console.log('  ✅ Hugging Face API configured');
  }

  // Option B: Self-hosted HeySalad-7B (most cost-effective!)
  if (process.env.HEYSALAD_MODEL_ENDPOINT) {
    client.configureProvider('huggingface', {
      apiKey: 'not-needed',
      baseURL: process.env.HEYSALAD_MODEL_ENDPOINT
    });
    console.log('  ✅ HeySalad-7B (self-hosted) configured');
  }

  // 3. Set up intelligent router
  console.log('\n🎯 Setting up intelligent router...');
  const router = createRouter(client, {
    primaryProviders: ['huggingface', 'openai', 'anthropic'],
    fallbackProviders: ['openai', 'anthropic'],
    costOptimization: true,
    performanceMode: 'balanced',
    enableRAG: true,

    // Custom routing rules
    customRules: [
      {
        name: 'Code generation',
        condition: (req) => {
          const text = req.messages[req.messages.length - 1].content;
          return /code|implement|function|class/.test(text.toLowerCase());
        },
        provider: 'anthropic', // Claude is great for code
        priority: 10
      },
      {
        name: 'Quick questions',
        condition: (req) => {
          const text = req.messages[req.messages.length - 1].content;
          return text.length < 100 && req.messages.length === 1;
        },
        provider: 'huggingface', // Use self-hosted for quick queries
        priority: 5
      }
    ]
  });

  // 4. Set up RAG for grocery prices
  console.log('📦 Loading grocery price database...');
  const groceryRAG = new GroceryRAG(client);
  const groceryData = createSampleGroceryData();
  await groceryRAG.loadData(groceryData);
  console.log(`  ✅ Loaded ${groceryData.length} grocery items\n`);

  return { client, router, groceryRAG };
}

async function demonstratePlatform() {
  const { client, router, groceryRAG } = await setupPlatform();

  console.log('=' .repeat(60));
  console.log('  🚀 HeySalad AI Platform Demo');
  console.log('=' .repeat(60));

  // Demo 1: Grocery prices with RAG
  console.log('\n📊 Demo 1: Grocery Price Query (uses RAG)');
  console.log('-'.repeat(60));
  const groceryResult = await groceryRAG.query('What is the cheapest milk?');
  console.log(`Question: What is the cheapest milk?`);
  console.log(`Answer: ${groceryResult.answer}`);
  console.log(`Sources: ${groceryResult.sources.length} items`);
  console.log(`Confidence: ${(groceryResult.confidence * 100).toFixed(0)}%`);

  // Demo 2: General question routed intelligently
  console.log('\n💬 Demo 2: General Question (intelligent routing)');
  console.log('-'.repeat(60));
  const generalResult = await router.chat({
    model: 'auto', // Router decides
    messages: [
      { role: 'user', content: 'What is HeySalad AI?' }
    ]
  });
  console.log(`Question: What is HeySalad AI?`);
  console.log(`Answer: ${generalResult.content.substring(0, 200)}...`);

  // Demo 3: Code generation (routed to Claude)
  console.log('\n💻 Demo 3: Code Generation (routed to best model)');
  console.log('-'.repeat(60));
  try {
    const codeResult = await router.chat({
      model: 'auto',
      messages: [
        { role: 'user', content: 'Write a function to validate email addresses in TypeScript' }
      ]
    });
    console.log(`Question: Write a function to validate email addresses`);
    console.log(`Answer: ${codeResult.content.substring(0, 300)}...`);
  } catch (error) {
    console.log('⚠️  Code generation requires Anthropic or OpenAI configured');
  }

  // Demo 4: Price comparison
  console.log('\n📈 Demo 4: Price Comparison (RAG)');
  console.log('-'.repeat(60));
  const comparisonResult = await groceryRAG.comparePrices('eggs');
  console.log(`Question: Compare egg prices`);
  console.log(`Answer: ${comparisonResult.answer}`);
  console.log(`Found ${comparisonResult.sources.length} options across stores`);

  // Demo 5: Streaming response
  console.log('\n🌊 Demo 5: Streaming Response');
  console.log('-'.repeat(60));
  console.log(`Question: Tell me about workflow automation`);
  console.log(`Answer: `);

  try {
    const stream = client.stream({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Tell me about workflow automation in one sentence' }
      ]
    }, 'openai');

    for await (const chunk of stream) {
      process.stdout.write(chunk.delta);
    }
    console.log('\n');
  } catch (error) {
    console.log('⚠️  Streaming requires OpenAI configured\n');
  }

  // Demo 6: Multi-provider comparison
  console.log('\n🔄 Demo 6: Same Query, Different Providers');
  console.log('-'.repeat(60));
  const question = 'What are the benefits of AI?';
  console.log(`Question: ${question}\n`);

  for (const provider of client.listProviders()) {
    try {
      console.log(`\n${provider.toUpperCase()}:`);
      const result = await client.chat({
        model: provider === 'openai' ? 'gpt-3.5-turbo' :
               provider === 'anthropic' ? 'claude-3-haiku' :
               'meta-llama/Llama-2-7b-chat-hf',
        messages: [{ role: 'user', content: question }],
        maxTokens: 100
      }, provider);
      console.log(result.content.substring(0, 150) + '...');
    } catch (error) {
      console.log(`  ⚠️  ${provider} not available`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('  ✅ Platform Demo Complete!');
  console.log('='.repeat(60));
  console.log('\n📊 Platform Statistics:');
  console.log(`  Configured providers: ${client.listProviders().join(', ')}`);
  console.log(`  Grocery items in database: ${groceryData.length}`);
  console.log(`  RAG enabled: Yes`);
  console.log(`  Intelligent routing: Yes`);
  console.log(`  Automatic fallbacks: Yes`);

  console.log('\n💰 Cost Optimization:');
  console.log(`  Self-hosted model: ${client.listProviders().includes('huggingface') ? 'Yes ($0.10/1M tokens)' : 'Not configured'}`);
  console.log(`  API providers: ${client.listProviders().filter(p => p !== 'huggingface').length}`);

  console.log('\n🎯 Next Steps:');
  console.log(`  1. Add more grocery items to the database`);
  console.log(`  2. Train HeySalad-7B for even better results`);
  console.log(`  3. Deploy to production with load balancing`);
  console.log(`  4. Monitor costs and optimize routing rules`);
  console.log(`  5. Add more specialized RAG databases`);
}

// Run the demo
demonstratePlatform().catch(console.error);
