# HeySalad AI Dashboard - Feature Overview

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  HeySalad AI | Unified AI API Platform          [User] [Logout] │
├──────────┬──────────────────────────────────────────────────────┤
│          │  AI API Dashboard                                    │
│ SIDEBAR  │  Monitor your API usage and manage providers         │
│          │                                                       │
│ • Dash   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│
│ • Keys   │  │ 24,352   │ │    2     │ │  245ms   │ │ $127.50 ││
│ • Provid │  │ Requests │ │ API Keys │ │ Response │ │  Cost   ││
│ • Analyt │  │  +12.5%  │ │  Active  │ │  -15ms   │ │ +$23.50 ││
│ • Billin │  └──────────┘ └──────────┘ └──────────┘ └─────────┘│
│ • Docs   │                                                       │
│ • Playg  │  ┌─────────────────────┐ ┌────────────────────────┐│
│ • Settin │  │ API Requests        │ │ Usage by Provider      ││
│          │  │ [Line Chart]        │ │ [Pie Chart]            ││
│          │  │                     │ │ • OpenAI 45%           ││
│          │  │                     │ │ • Anthropic 30%        ││
│          │  │                     │ │ • Gemini 20%           ││
│          │  └─────────────────────┘ │ • HuggingFace 5%       ││
│          │                           └────────────────────────┘│
│          │                                                       │
│          │  ┌──────────────────────────────────────────────────┐│
│          │  │ Top Models                                       ││
│          │  │ [Horizontal Bar Chart]                           ││
│          │  │ GPT-4         ████████████████ 8,500            ││
│          │  │ Claude 3 Opus ████████████ 6,200                ││
│          │  │ Gemini Pro    ██████████ 4,800                  ││
│          │  └──────────────────────────────────────────────────┘│
│          │                                                       │
│          │  ┌──────────────────────────────────────────────────┐│
│          │  │ API Keys                          [+ Add New Key]││
│          │  │                                                  ││
│          │  │ Production API                        [Active]  ││
│          │  │ sk_live_abc123...xyz789  [👁] [📋]             ││
│          │  │ Created 2026-02-15 • Last used 2 hours ago      ││
│          │  │ 15,420 requests                          [🗑]   ││
│          │  │                                                  ││
│          │  │ Development API                       [Active]  ││
│          │  │ sk_test_def456...uvw012  [👁] [📋]             ││
│          │  │ Created 2026-02-10 • Last used 5 minutes ago    ││
│          │  │ 8,932 requests                           [🗑]   ││
│          │  └──────────────────────────────────────────────────┘│
│          │                                                       │
│          │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│          │  │ Configure│ │   View   │ │ Billing &│            │
│          │  │ Providers│ │ Analytics│ │  Usage   │            │
│          │  └──────────┘ └──────────┘ └──────────┘            │
└──────────┴──────────────────────────────────────────────────────┘
```

## Key Features

### 1. Real-Time Stats
- **Total Requests**: Track API call volume with trend indicators
- **Active API Keys**: Monitor configured keys
- **Response Time**: Average latency across all providers
- **Monthly Cost**: Current spending with comparison

### 2. Visual Analytics
- **Request Timeline**: Line chart showing daily API usage
- **Provider Distribution**: Pie chart of usage across providers
- **Model Popularity**: Bar chart of most-used AI models

### 3. API Key Management
- Create, view, and delete API keys
- Show/hide sensitive key values
- Copy keys to clipboard
- Track usage per key
- Monitor last used timestamp

### 4. Quick Actions
- Jump to provider configuration
- Access detailed analytics
- Manage billing and subscriptions

## Navigation Structure

```
Dashboard
├── API Keys
│   ├── Create New Key
│   ├── View Keys
│   ├── Rotate Keys
│   └── Delete Keys
├── Providers
│   ├── OpenAI Configuration
│   ├── Anthropic Configuration
│   ├── Gemini Configuration
│   └── HuggingFace Configuration
├── Analytics
│   ├── Usage Reports
│   ├── Cost Analysis
│   ├── Performance Metrics
│   └── Export Data
├── Billing
│   ├── Current Plan
│   ├── Usage Limits
│   ├── Payment Methods
│   └── Invoices
├── Documentation
│   ├── API Reference
│   ├── Quick Start
│   ├── Code Examples
│   └── SDKs
├── Playground
│   ├── Test Requests
│   ├── Model Comparison
│   └── Response Inspector
└── Settings
    ├── Account
    ├── Team
    ├── Security
    └── Preferences
```

## User Flows

### Creating an API Key
1. Click "Create API Key" button
2. Enter key name and description
3. Select permissions/scopes
4. Generate key
5. Copy key (shown once)
6. Key appears in dashboard list

### Monitoring Usage
1. View stats cards for quick overview
2. Check line chart for trends
3. Review provider distribution
4. Analyze model usage
5. Export detailed reports

### Configuring Providers
1. Navigate to Providers page
2. Select provider (OpenAI, Anthropic, etc.)
3. Enter provider API key
4. Test connection
5. Save configuration
6. Provider appears in usage stats

## Color Coding

- **Cherry Red (#E01D1D)**: Primary actions, active states
- **Green**: Positive trends, active status
- **Red**: Negative trends, errors, delete actions
- **Blue**: Information, secondary actions
- **Purple**: Billing, premium features
- **Zinc/Gray**: Neutral elements, borders, backgrounds

## Responsive Design

### Desktop (1024px+)
- Full sidebar visible
- 4-column stat grid
- 2-column chart layout
- Full-width tables

### Tablet (768px - 1023px)
- Collapsible sidebar
- 2-column stat grid
- Stacked charts
- Scrollable tables

### Mobile (< 768px)
- Hidden sidebar (hamburger menu)
- Single column stats
- Stacked charts
- Card-based tables

## Interactive Elements

### Hover States
- Stat cards scale slightly (1.02x)
- Buttons change color
- Chart elements highlight
- Table rows change background

### Click Actions
- Copy API key to clipboard
- Toggle key visibility
- Delete confirmation modal
- Navigate to detail pages

### Loading States
- Skeleton screens for data
- Spinner for actions
- Progress bars for uploads
- Shimmer effects

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators
- Screen reader friendly
- High contrast mode compatible

## Performance

- Lazy load charts
- Virtualized tables for large datasets
- Debounced search inputs
- Cached API responses
- Optimized bundle size

---

**Live Demo:** https://ai.heysalad.app
**Status:** Production Ready
**Last Updated:** February 20, 2026
