# Shopping Cart & Checkout System Implementation Guide

## Overview

The Shopping Cart & Checkout System for the Philippines E-Commerce Platform provides comprehensive cart management, multi-vendor order handling, and Philippines-specific checkout flow with barangay-level address system and 12% VAT calculations.

## Architecture

### Core Components

1. **Cart Validation Schemas** (`src/lib/validations/cart.ts`)
   - AddToCartSchema: Validates cart item additions
   - AddressSchema: Validates Philippines addresses with barangay support
   - CheckoutDataSchema: Validates complete checkout information
   - ShippingCalculationSchema: Validates shipping parameters
   - OrderCreationSchema: Validates order creation data

2. **Cart Utility Functions** (`src/lib/cart-utils.ts`)
   - `calculateSubtotal()`: Computes cart subtotal
   - `calculateTax()`: Applies 12% VAT
   - `calculateShippingFee()`: Calculates region-based shipping costs
   - `calculateTotal()`: Computes final total with all fees
   - `groupItemsByVendor()`: Splits cart by vendor for multi-vendor orders
   - `applyDiscount()`: Applies coupon discounts
   - `generateOrderNumber()`: Creates unique order identifiers

3. **API Routes**
   - Cart Management: `/api/cart`, `/api/cart/items`, `/api/cart/items/[id]`
   - Address Management: `/api/addresses`, `/api/addresses/[id]`
   - Checkout: `/api/checkout/validate`, `/api/checkout/calculate-shipping`, `/api/checkout/create-order`, `/api/checkout/summary`

## API Endpoints

### Cart Management

#### GET /api/cart
Retrieves user's shopping cart with summary.

**Response:**
```json
{
  "items": [],
  "summary": {
    "subtotal": 0,
    "taxAmount": 0,
    "shippingFee": 0,
    "discountAmount": 0,
    "totalAmount": 0,
    "itemCount": 0,
    "vendorCount": 0
  },
  "userId": "user@example.com"
}
```

#### POST /api/cart/items
Adds item to cart.

**Request:**
```json
{
  "variantId": "variant-123",
  "quantity": 2
}
```

#### PATCH /api/cart/items/[id]
Updates cart item quantity.

**Request:**
```json
{
  "quantity": 5
}
```

#### DELETE /api/cart/items/[id]
Removes item from cart.

### Address Management

#### GET /api/addresses
Retrieves all saved addresses for user.

#### POST /api/addresses
Creates new address.

**Request:**
```json
{
  "recipientName": "John Doe",
  "phone": "09123456789",
  "region": "NCR",
  "province": "Metro Manila",
  "cityMunicipality": "Manila",
  "barangay": "Barangay 1",
  "streetAddress": "123 Main Street",
  "isDefault": true
}
```

#### PATCH /api/addresses/[id]
Updates address.

#### DELETE /api/addresses/[id]
Deletes address.

### Checkout

#### POST /api/checkout/validate
Validates checkout data before payment.

**Request:**
```json
{
  "items": [...],
  "shippingAddress": {...},
  "shippingProvider": "LBC"
}
```

#### POST /api/checkout/calculate-shipping
Calculates shipping cost and options.

**Request:**
```json
{
  "region": "NCR",
  "province": "Metro Manila",
  "cityMunicipality": "Manila",
  "barangay": "Barangay 1",
  "provider": "LBC",
  "subtotal": 1000
}
```

**Response:**
```json
{
  "shippingOption": {
    "provider": "LBC",
    "providerName": "LBC Express",
    "fee": 50,
    "estimatedDays": 3,
    "estimatedDelivery": "2025-11-04T..."
  }
}
```

#### POST /api/checkout/create-order
Creates order(s) from cart.

**Request:**
```json
{
  "items": [...],
  "shippingAddress": {...},
  "shippingProvider": "LBC",
  "paymentMethod": "GCASH"
}
```

**Response:**
```json
{
  "orders": [...],
  "totalOrders": 1
}
```

#### GET /api/checkout/summary
Retrieves checkout summary.

## Pricing & Tax Calculations

### Tax Calculation
- **VAT Rate**: 12% (Philippines standard)
- **Formula**: `Subtotal × 0.12`
- **Applied to**: All taxable items

### Shipping Rates by Region
- **NCR**: ₱50 base
- **CALABARZON**: ₱75 base
- **MIMAROPA**: ₱100 base
- **BICOL**: ₱100 base
- **WESTERN_VISAYAS**: ₱125 base
- **CENTRAL_VISAYAS**: ₱125 base
- **EASTERN_VISAYAS**: ₱150 base
- **ZAMBOANGA**: ₱150 base
- **NORTHERN_MINDANAO**: ₱150 base
- **DAVAO**: ₱150 base
- **SOCCSKSARGEN**: ₱175 base
- **CARAGA**: ₱175 base
- **ARMM**: ₱200 base
- **CAR**: ₱150 base
- **ILOCOS**: ₱100 base
- **CAGAYAN_VALLEY**: ₱125 base
- **CENTRAL_LUZON**: ₱75 base

### Shipping Provider Multipliers
- **LBC**: 1.0x
- **TWO_GO**: 0.95x
- **JRS**: 0.9x
- **GRAB**: 1.2x
- **LALAMOVE**: 1.3x
- **PICKUP**: Free (₱0)

### Free Shipping
- Orders over ₱1,000 get free shipping (except express services: GRAB, LALAMOVE)

## Multi-Vendor Order Splitting

When a cart contains items from multiple vendors:

1. **Grouping**: Items are grouped by vendor ID
2. **Separate Orders**: Each vendor group creates a separate order
3. **Individual Calculations**: Tax and shipping calculated per vendor order
4. **Commission Deduction**: Vendor commission applied to each order

**Example:**
- Cart: 2 items from Vendor A (₱500), 3 items from Vendor B (₱300)
- Result: 2 orders created
  - Order 1: Vendor A items (₱500 + ₱60 tax + ₱50 shipping)
  - Order 2: Vendor B items (₱300 + ₱36 tax + ₱50 shipping)

## Testing

### Running Tests
```bash
npm test -- src/__tests__/cart.test.ts
```

### Test Coverage
- **35 total tests** (100% pass rate)
- Validation schemas: 11 tests
- Utility functions: 24 tests

### Key Test Areas
- Cart item validation
- Address validation (Philippines-specific)
- Tax calculations (12% VAT)
- Shipping fee calculations
- Multi-vendor grouping
- Discount application
- Order number generation
- Vendor commission calculations

## Integration Points

### Authentication
- Uses NextAuth.js for session management
- Requires authenticated user for cart operations
- Role-based access control (BUYER, SELLER, ADMIN)

### Database
- Prisma ORM for data persistence
- PostgreSQL 15+ backend
- Relationships with User, Vendor, Product, Order models

### Existing Systems
- **Product Catalog**: Fetches product/variant details
- **Vendor System**: Handles multi-vendor order splitting
- **Authentication**: Session-based user identification
- **Inventory**: Stock validation (future integration)

## Philippines-Specific Features

### Address System
- **Barangay-level detail**: Supports all Philippine barangays
- **Phone validation**: Requires 09XXXXXXXXX format
- **Region/Province/City/Barangay hierarchy**: Full geographic support

### Payment Methods
- GCASH
- PAYMAYA
- CREDIT_CARD
- DEBIT_CARD
- BANK_TRANSFER
- COD (Cash on Delivery)

### Shipping Providers
- LBC Express
- 2GO Express
- JRS Express
- Grab
- Lalamove
- Pickup at Store

## Error Handling

### Validation Errors (400)
- Invalid cart item data
- Invalid address information
- Missing required fields

### Authentication Errors (401)
- Missing or invalid session
- Unauthorized access

### Not Found Errors (404)
- Address not found
- User not found

### Server Errors (500)
- Database errors
- Calculation errors
- System failures

## Future Enhancements

1. **Real-time Inventory Integration**: Check stock availability
2. **Coupon/Promo System**: Apply discount codes
3. **Wishlist Integration**: Save items for later
4. **Cart Persistence**: Session-based or database storage
5. **Payment Gateway Integration**: Actual payment processing
6. **Shipping API Integration**: Real-time shipping rates
7. **Order Tracking**: Real-time shipment tracking
8. **Return/Refund System**: Post-purchase management

## Development Server

Start the development server:
```bash
npm run dev
```

Server runs on: `http://localhost:3001`

## Deployment Considerations

1. **Environment Variables**: Set DATABASE_URL and NEXTAUTH_SECRET
2. **Database Migrations**: Run Prisma migrations before deployment
3. **Session Storage**: Configure session storage for production
4. **Payment Gateway**: Integrate actual payment processors
5. **Shipping APIs**: Connect to real shipping provider APIs
6. **Error Monitoring**: Set up error tracking (Sentry, etc.)
7. **Performance**: Implement caching for shipping rates and addresses

## Support & Maintenance

For issues or questions:
1. Check test files for usage examples
2. Review API endpoint implementations
3. Consult validation schemas for data requirements
4. Check utility functions for calculation logic

