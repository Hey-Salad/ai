/**
 * HeySalad Grocery RAG System
 * Retrieval Augmented Generation for grocery price queries
 */

import { HeySaladAI } from '@heysalad/ai';

export interface GroceryItem {
  id: string;
  name: string;
  price: number;
  store: string;
  category: string;
  unit: string;
  brand?: string;
  date: string;
  location?: string;
  metadata?: Record<string, any>;
}

export interface SearchOptions {
  topK?: number;
  category?: string;
  store?: string;
  maxPrice?: number;
  minPrice?: number;
}

export interface RAGResponse {
  answer: string;
  sources: GroceryItem[];
  confidence: number;
}

/**
 * Simple in-memory vector database for grocery items
 * In production, use a real vector DB like Pinecone, Weaviate, or ChromaDB
 */
export class GroceryVectorDB {
  private items: GroceryItem[] = [];
  private embeddings: Map<string, number[]> = new Map();

  /**
   * Add items to the database
   */
  async addItems(items: GroceryItem[]): Promise<void> {
    this.items.push(...items);

    // Generate embeddings for each item
    for (const item of items) {
      const text = this.itemToText(item);
      const embedding = await this.generateEmbedding(text);
      this.embeddings.set(item.id, embedding);
    }
  }

  /**
   * Search for relevant items
   */
  async search(query: string, options: SearchOptions = {}): Promise<GroceryItem[]> {
    const {
      topK = 5,
      category,
      store,
      maxPrice,
      minPrice
    } = options;

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);

    // Calculate similarities
    const scores = this.items.map(item => {
      // Filter by criteria
      if (category && item.category !== category) return { item, score: -1 };
      if (store && item.store !== store) return { item, score: -1 };
      if (maxPrice && item.price > maxPrice) return { item, score: -1 };
      if (minPrice && item.price < minPrice) return { item, score: -1 };

      const itemEmbedding = this.embeddings.get(item.id);
      if (!itemEmbedding) return { item, score: -1 };

      const score = this.cosineSimilarity(queryEmbedding, itemEmbedding);
      return { item, score };
    });

    // Sort by score and return top-k
    return scores
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.item);
  }

  /**
   * Convert item to searchable text
   */
  private itemToText(item: GroceryItem): string {
    return `${item.name} ${item.brand || ''} ${item.category} at ${item.store} for $${item.price} per ${item.unit}`.toLowerCase();
  }

  /**
   * Generate simple embedding (in production, use a real model)
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    // Simple TF-IDF style embedding for demo
    // In production, use @xenova/transformers or OpenAI embeddings
    const words = text.toLowerCase().split(/\s+/);
    const vocab = ['milk', 'bread', 'eggs', 'cheese', 'butter', 'chicken', 'beef', 'rice', 'pasta', 'apple', 'banana', 'orange', 'tomato', 'potato', 'onion', 'walmart', 'kroger', 'target', 'whole foods', 'trader joes', 'price', 'cheap', 'expensive', 'organic', 'fresh'];

    return vocab.map(term => {
      const count = words.filter(w => w.includes(term) || term.includes(w)).length;
      return count > 0 ? 1 : 0;
    });
  }

  /**
   * Calculate cosine similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Get all items
   */
  getAllItems(): GroceryItem[] {
    return this.items;
  }

  /**
   * Clear database
   */
  clear(): void {
    this.items = [];
    this.embeddings.clear();
  }
}

/**
 * HeySalad Grocery RAG System
 */
export class GroceryRAG {
  private db: GroceryVectorDB;
  private ai: HeySaladAI;

  constructor(ai: HeySaladAI) {
    this.db = new GroceryVectorDB();
    this.ai = ai;
  }

  /**
   * Load grocery data
   */
  async loadData(items: GroceryItem[]): Promise<void> {
    await this.db.addItems(items);
  }

  /**
   * Answer a grocery price query
   */
  async query(question: string, options: SearchOptions = {}): Promise<RAGResponse> {
    // Search for relevant items
    const relevantItems = await this.db.search(question, options);

    if (relevantItems.length === 0) {
      return {
        answer: "I couldn't find any grocery items matching your query. Try being more specific or check if the item is in our database.",
        sources: [],
        confidence: 0
      };
    }

    // Build context from relevant items
    const context = this.buildContext(relevantItems);

    // Generate answer using AI
    const answer = await this.generateAnswer(question, context);

    return {
      answer,
      sources: relevantItems,
      confidence: Math.min(relevantItems.length / 5, 1) // Simple confidence based on number of sources
    };
  }

  /**
   * Build context from relevant items
   */
  private buildContext(items: GroceryItem[]): string {
    return items.map(item => {
      const parts = [
        `${item.name}${item.brand ? ` (${item.brand})` : ''}`,
        `$${item.price.toFixed(2)} per ${item.unit}`,
        `at ${item.store}`,
        `(${item.date})`
      ];
      return parts.join(' ');
    }).join('\n');
  }

  /**
   * Generate answer using AI
   */
  private async generateAnswer(question: string, context: string): Promise<string> {
    const systemPrompt = `You are a helpful grocery shopping assistant. Answer questions about grocery prices using the provided context. Be concise and specific. Include store names and prices. If comparing prices, highlight the best deal.`;

    const prompt = `Context (current grocery prices):
${context}

Question: ${question}

Provide a helpful answer based on the context above.`;

    try {
      const response = await this.ai.chat({
        model: 'gpt-3.5-turbo', // Fast and cheap for this use case
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        maxTokens: 200
      });

      return response.content;
    } catch (error) {
      // Fallback to simple answer if AI fails
      return this.simpleAnswer(question, context);
    }
  }

  /**
   * Simple fallback answer without AI
   */
  private simpleAnswer(question: string, context: string): string {
    const lines = context.split('\n');
    if (lines.length === 1) {
      return `Based on current prices: ${lines[0]}`;
    }
    return `I found these options:\n${lines.slice(0, 3).map((l, i) => `${i + 1}. ${l}`).join('\n')}`;
  }

  /**
   * Get price comparison
   */
  async comparePrices(itemName: string): Promise<RAGResponse> {
    return this.query(`Compare prices for ${itemName} across different stores`);
  }

  /**
   * Find cheapest option
   */
  async findCheapest(itemName: string, options?: SearchOptions): Promise<RAGResponse> {
    return this.query(`What's the cheapest ${itemName}?`, options);
  }

  /**
   * Get store-specific prices
   */
  async getPricesAtStore(store: string, category?: string): Promise<RAGResponse> {
    return this.query(
      category
        ? `What ${category} items are available at ${store}?`
        : `What items are available at ${store}?`,
      { store, topK: 10 }
    );
  }
}

/**
 * Create sample grocery dataset
 */
export function createSampleGroceryData(): GroceryItem[] {
  return [
    {
      id: '1',
      name: 'Whole Milk',
      price: 3.49,
      store: 'Walmart',
      category: 'Dairy',
      unit: 'gallon',
      brand: 'Great Value',
      date: '2025-02-19'
    },
    {
      id: '2',
      name: 'Whole Milk',
      price: 3.99,
      store: 'Kroger',
      category: 'Dairy',
      unit: 'gallon',
      brand: 'Kroger',
      date: '2025-02-19'
    },
    {
      id: '3',
      name: 'Whole Milk',
      price: 4.49,
      store: 'Whole Foods',
      category: 'Dairy',
      unit: 'gallon',
      brand: '365 Organic',
      date: '2025-02-19'
    },
    {
      id: '4',
      name: 'White Bread',
      price: 2.99,
      store: 'Walmart',
      category: 'Bakery',
      unit: 'loaf',
      brand: 'Great Value',
      date: '2025-02-19'
    },
    {
      id: '5',
      name: 'White Bread',
      price: 3.49,
      store: 'Kroger',
      category: 'Bakery',
      unit: 'loaf',
      brand: 'Kroger',
      date: '2025-02-19'
    },
    {
      id: '6',
      name: 'Eggs',
      price: 4.99,
      store: 'Walmart',
      category: 'Dairy',
      unit: 'dozen',
      brand: 'Great Value',
      date: '2025-02-19'
    },
    {
      id: '7',
      name: 'Eggs',
      price: 5.49,
      store: 'Kroger',
      category: 'Dairy',
      unit: 'dozen',
      brand: 'Kroger',
      date: '2025-02-19'
    },
    {
      id: '8',
      name: 'Organic Eggs',
      price: 6.99,
      store: 'Whole Foods',
      category: 'Dairy',
      unit: 'dozen',
      brand: '365 Organic',
      date: '2025-02-19'
    },
    {
      id: '9',
      name: 'Ground Beef',
      price: 5.99,
      store: 'Walmart',
      category: 'Meat',
      unit: 'lb',
      brand: 'Great Value',
      date: '2025-02-19'
    },
    {
      id: '10',
      name: 'Ground Beef',
      price: 6.49,
      store: 'Kroger',
      category: 'Meat',
      unit: 'lb',
      brand: 'Kroger',
      date: '2025-02-19'
    },
    {
      id: '11',
      name: 'Bananas',
      price: 0.59,
      store: 'Walmart',
      category: 'Produce',
      unit: 'lb',
      date: '2025-02-19'
    },
    {
      id: '12',
      name: 'Bananas',
      price: 0.69,
      store: 'Kroger',
      category: 'Produce',
      unit: 'lb',
      date: '2025-02-19'
    },
    {
      id: '13',
      name: 'Organic Bananas',
      price: 0.79,
      store: 'Whole Foods',
      category: 'Produce',
      unit: 'lb',
      brand: '365 Organic',
      date: '2025-02-19'
    },
    {
      id: '14',
      name: 'Chicken Breast',
      price: 4.99,
      store: 'Walmart',
      category: 'Meat',
      unit: 'lb',
      brand: 'Great Value',
      date: '2025-02-19'
    },
    {
      id: '15',
      name: 'Chicken Breast',
      price: 5.99,
      store: 'Kroger',
      category: 'Meat',
      unit: 'lb',
      brand: 'Kroger',
      date: '2025-02-19'
    },
  ];
}
