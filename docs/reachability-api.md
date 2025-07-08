# Reachability API Integration

This document describes the integration of email and website reachability checking API endpoints into the application.

## API Endpoints

### Email Reachability

- **Endpoint**: `/is-email-alive?email=lokaa@gmail.com`
- **Method**: GET
- **Purpose**: Check if an email address is alive/reachable
- **Response**: `{ isAlive: boolean, message?: string }`

### Website Reachability

- **Endpoint**: `/is-website-reachable?url=https://perla-ssssit.com`
- **Method**: GET
- **Purpose**: Check if a website is running/reachable
- **Response**: `{ isReachable: boolean, statusCode?: number, message?: string }`

## Integration Overview

The API endpoints have been integrated into the existing reachability system with the following features:

1. **API-First Approach**: Primary checking uses the new API endpoints
2. **Graceful Fallback**: Falls back to browser-based checking if API fails
3. **Caching System**: Results are cached for 5 minutes to improve performance
4. **Existing Components**: All existing reachability components automatically use the new API

## Files Modified

### `config/api.ts`

Added two new functions:

- `checkEmailAlive(email: string)` - Calls `/is-email-alive` endpoint
- `checkWebsiteReachable(url: string)` - Calls `/is-website-reachable` endpoint

### `utils/reachability.ts`

Enhanced existing functions:

- `checkEmailReachability()` - Now uses API first, fallback to validation
- `checkWebsiteReachability()` - Now uses API first, fallback to browser checks

### `utils/api-reachability.ts` (New)

Direct utility functions for simple API usage:

- `isEmailAlive(email)` - Simple boolean result
- `isWebsiteReachable(url)` - Simple boolean result
- Batch checking functions for multiple emails/websites

## Usage Examples

### Basic Usage

```typescript
import {
  checkEmailReachability,
  checkWebsiteReachability,
} from "@/utils/reachability";

// Check email (with caching and fallback)
const emailResult = await checkEmailReachability("lokaa@gmail.com");
console.log(emailResult.status); // 'reachable', 'unreachable', 'unknown'

// Check website (with caching and fallback)
const websiteResult = await checkWebsiteReachability(
  "https://perla-ssssit.com",
);
console.log(websiteResult.status); // 'reachable', 'unreachable', 'unknown'
```

### Direct API Usage

```typescript
import { isEmailAlive, isWebsiteReachable } from "@/utils/api-reachability";

// Direct API calls (no caching, will throw on error)
const emailAlive = await isEmailAlive("lokaa@gmail.com");
const siteReachable = await isWebsiteReachable("https://perla-ssssit.com");
```

### Component Usage

The existing `ReachabilityChip` component automatically uses the new API:

```tsx
import { ReachabilityChip } from '@/components/table/reachability-chip';

// Email chip
<ReachabilityChip type="email" value="lokaa@gmail.com" />

// Website chip
<ReachabilityChip type="website" value="https://perla-ssssit.com" />
```

## Testing

A new testing page has been created at `/reachability-test` that allows you to:

- Test email reachability with the `/is-email-alive` endpoint
- Test website reachability with the `/is-website-reachable` endpoint
- See real-time results and status indicators
- View API endpoint information and integration details

## Error Handling

The integration includes robust error handling:

1. **API Failures**: Automatically falls back to browser-based checking
2. **Network Issues**: Cached results are used when available
3. **Invalid Input**: Basic validation before API calls
4. **Timeouts**: Reasonable timeouts prevent hanging requests

## Performance Optimizations

- **Caching**: 5-minute cache prevents duplicate API calls
- **Batch Operations**: Utility functions for checking multiple items
- **Staggered Animations**: Visual feedback with progressive loading
- **Fallback Systems**: Multiple checking methods ensure reliability

## Configuration

The API base URL is configured in `config/api.ts`:

```typescript
baseURL: "https://all-care-demo.perla-it.com/api/v1";
```

All API calls include:

- 5-minute timeout
- Automatic JSON parsing
- Error logging and handling
- Request/response interceptors

## Next Steps

1. **API Testing**: Test the actual API endpoints when available
2. **Error Messages**: Customize error messages based on API responses
3. **Rate Limiting**: Add rate limiting if needed for API protection
4. **Analytics**: Track API usage and performance metrics
