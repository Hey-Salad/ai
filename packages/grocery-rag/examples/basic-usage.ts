/**
 * HeySalad Grocery RAG - Basic Usage Example
 */

import { HeySaladAI } from '@heysalad/ai';
import { GroceryRAG, createSampleGroceryData } from '../src/index';

async function main() {
  // Initialize HeySalad AI
  const ai = new HeySaladAI();

  // Configure provider (OpenAI for fast, cheap responses)
  ai.configureProvider('openai', {
    apiKey: process.env.OPENAI_API_KEY!
  });

  // Or use Anthropic
  // ai.configureProvider('anthropic', {
  //   apiKey: process.env.ANTHROPIC_API_KEY!
  // });

  // Or use your own HeySalad-7B model
  // ai.configureProvider('huggingface', {
  //   baseURL: 'http://your-server:8000/v1/models'
  // });

  // Create RAG system
  const groceryRAG = new GroceryRAG(ai);

  // Load sample data
  console.log('📥 Loading grocery data...');
  const sampleData = createSampleGroceryData();
  await groceryRAG.loadData(sampleData);
  console.log(`✅ Loaded ${sampleData.length} items\n`);

  // Example 1: Simple price query
  console.log('Example 1: Simple price query');
  console.log('Q: How much is milk at Walmart?');
  const result1 = await groceryRAG.query('How much is milk at Walmart?');
  console.log(`A: ${result1.answer}`);
  console.log(`Sources: ${result1.sources.length} items`);
  console.log(`Confidence: ${(result1.confidence * 100).toFixed(0)}%\n`);

  // Example 2: Price comparison
  console.log('Example 2: Price comparison');
  console.log('Q: Compare milk prices');
  const result2 = await groceryRAG.comparePrices('milk');
  console.log(`A: ${result2.answer}`);
  console.log(`Sources: ${result2.sources.length} items\n`);

  // Example 3: Find cheapest
  console.log('Example 3: Find cheapest option');
  console.log('Q: What\'s the cheapest eggs?');
  const result3 = await groceryRAG.findCheapest('eggs');
  console.log(`A: ${result3.answer}`);
  console.log(`Sources: ${result3.sources.length} items\n`);

  // Example 4: Store-specific query
  console.log('Example 4: Store-specific query');
  console.log('Q: What dairy items at Kroger?');
  const result4 = await groceryRAG.getPricesAtStore('Kroger', 'Dairy');
  console.log(`A: ${result4.answer}`);
  console.log(`Sources: ${result4.sources.length} items\n`);

  // Example 5: Custom query with filters
  console.log('Example 5: Custom query with filters');
  console.log('Q: Show me produce under $1 per lb');
  const result5 = await groceryRAG.query('What produce is available?', {
    category: 'Produce',
    maxPrice: 1.00
  });
  console.log(`A: ${result5.answer}`);
  console.log(`Sources: ${result5.sources.length} items\n`);

  console.log('✅ Done!');
}

main().catch(console.error);
