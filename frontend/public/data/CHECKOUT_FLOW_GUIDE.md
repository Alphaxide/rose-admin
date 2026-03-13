# BeautyHub Checkout Flow Documentation

## Overview

The checkout flow handles the complete purchase process from cart to order confirmation. It's built with multiple steps, validation, and payment processing.

## Flow Diagram

```
Cart Page
    ↓
Checkout Page (Empty Check)
    ↓
Step 1: Shipping Information
    ├─ Validate form
    └─ Proceed to Step 2
    ↓
Step 2: Payment Selection
    ├─ Select M-Pesa payment
    ├─ Enter phone number
    └─ Initiate payment
    ↓
Step 3: Order Confirmation
    ├─ Display order number
    ├─ Show order details
    └─ Clear cart
```

## Implementation Details

### Step 1: Shipping Information

**File**: `app/checkout/page.tsx`

**Form Fields:**
- Full Name (required)
- Email (required, email validation)
- Phone Number (required, Kenya phone format validation)
- Street Address (required)
- City (required)
- Postal Code (optional)

**Validations:**
```typescript
// Full Name: Non-empty
if (!shippingData.fullName.trim()) newErrors.fullName = 'Full name is required'

// Email: Valid email format
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) 
  newErrors.email = 'Please enter a valid email'

// Phone: Kenya number format (+254 or 0)
if (!/^\+?254[0-9]{9}$|^0[0-9]{9}$/.test(shippingData.phone.replace(/\s/g, ''))) 
  newErrors.phone = 'Please enter a valid Kenyan phone number'

// Address: Non-empty
if (!shippingData.address.trim()) newErrors.address = 'Address is required'

// City: Non-empty
if (!shippingData.city.trim()) newErrors.city = 'City is required'
```

**On Valid Submission:**
- Move to payment step
- Clear any previous errors
- Validate data before proceeding

### Step 2: Payment Selection

**Payment Method**: M-Pesa (primary payment option)

**Form Fields:**
- M-Pesa Phone Number (required, same format validation as shipping)

**Validations:**
```typescript
if (!mpesaData.phoneNumber.trim()) {
  newErrors.phoneNumber = 'M-Pesa phone number is required'
} else if (!/^\+?254[0-9]{9}$|^0[0-9]{9}$/.test(mpesaData.phoneNumber.replace(/\s/g, ''))) {
  newErrors.phoneNumber = 'Please enter a valid phone number'
}
```

**Price Calculation:**
```typescript
const shippingFee = totalPrice > 5000 ? 0 : 300  // Free shipping over 5000 KES
const taxAmount = Math.round(totalPrice * 0.16)  // 16% VAT/Tax
const finalTotal = totalPrice + shippingFee + taxAmount
```

### Step 3: Order Confirmation

**Data Displayed:**
- Order Number (generated from timestamp)
- Customer Name
- Email
- Phone Number
- Total Amount Paid
- Order status badge
- Estimated Delivery Date

**After Confirmation:**
- Cart is cleared
- User can continue shopping or view orders
- Confirmation details shown for reference

## State Management

### Component State

```typescript
const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
const [isLoading, setIsLoading] = useState(false)
const [orderNumber, setOrderNumber] = useState<string | null>(null)

const [shippingData, setShippingData] = useState({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
})

const [mpesaData, setMpesaData] = useState({
  phoneNumber: '',
})

const [errors, setErrors] = useState<Record<string, string>>({})
```

### Cart Context

The checkout page uses the Cart context from `context/CartContext.tsx`:

```typescript
const { items, totalPrice, clearCart } = useCart()
```

**Available Methods:**
- `items` - Array of cart items
- `totalPrice` - Calculated total
- `clearCart()` - Clears all items after successful order

## API Integration

### Order Creation

**Endpoint**: `POST /api/orders` (currently simulated)

**Request Payload:**
```json
{
  "order_number": "ORD-{timestamp}",
  "amount": 5500,
  "currency": "KES",
  "phone_number": "+254712345678",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678"
  },
  "shipping_address": {
    "address": "123 Main St",
    "city": "Nairobi",
    "postal_code": "00100"
  },
  "items": [
    {
      "product_id": "1",
      "name": "Product Name",
      "quantity": 2,
      "price": 2500
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order_number": "ORD-1709009700000",
  "status": "pending",
  "message": "Order created successfully"
}
```

### Payment Initiation

**Endpoint**: `POST /api/payments/initiate` (currently simulated)

**Request:**
```json
{
  "order_number": "ORD-1709009700000",
  "amount": 5500,
  "currency": "KES",
  "phone_number": "+254712345678",
  "payment_method": "mpesa"
}
```

**Response:**
```json
{
  "success": true,
  "transaction_id": "TXN-123456789",
  "status": "initiated",
  "message": "Waiting for M-Pesa confirmation"
}
```

## Form Handling

### Real-time Validation

Fields are validated as the user types:

```typescript
onChange={(e) => {
  setShippingData({ ...shippingData, fieldName: e.target.value })
  setErrors({ ...errors, fieldName: '' })  // Clear error on change
}}
```

### Submit Validation

Full validation runs on submit:

```typescript
const handleShippingSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (validateShippingForm()) {
    setCurrentStep('payment')
  }
}
```

### Error Display

```typescript
{errors.fieldName && (
  <p className="text-xs text-red-500 mt-1">{errors.fieldName}</p>
)}
```

## Loading States

During payment processing:

```typescript
setIsLoading(true)
// Process payment (2 second simulation)
await new Promise(resolve => setTimeout(resolve, 2000))
setIsLoading(false)
setCurrentStep('confirmation')
```

**UI Changes:**
- Submit button shows loading spinner
- Form inputs are disabled
- User can see processing progress

## Error Handling

### Validation Errors

Display per-field error messages above invalid inputs.

### Payment Errors

```typescript
catch (error) {
  console.error('Payment error:', error)
  setErrors({ submit: 'Payment processing failed. Please try again.' })
}
```

Display error banner and allow retry.

### Empty Cart Check

```typescript
if (items.length === 0 && currentStep !== 'confirmation') {
  // Show empty state with link back to shopping
}
```

## User Experience Enhancements

### 1. Step Progress Indicator

Shows current step (1/2) with visual styling:
- Active step: Primary color background
- Completed/Inactive: Muted color

### 2. Clear Form Labels

Each field has descriptive label and placeholder text.

### 3. Phone Number Flexibility

Accepts:
- `+254712345678` (international format)
- `0712345678` (local format)
- Handles spaces in input

### 4. Order Summary

Display summary of:
- Number of items
- Subtotal
- Shipping fee (or "FREE" if applicable)
- Tax/VAT amount
- **Final Total** (highlighted)

### 5. Confirmation Page

After successful order:
- Green success icon
- Order number for reference
- Customer details for verification
- Estimated delivery date
- Next action buttons

## Mobile Responsiveness

- **Responsive Layout**: Grid adjusts for mobile
- **Touch-friendly**: Large input fields and buttons
- **Single Column**: Forms stack on mobile devices
- **Clear CTAs**: Prominent action buttons

## Security Considerations

### Frontend

1. **Input Validation**: All fields validated before submission
2. **Phone Number Format**: Specific format for Kenya numbers
3. **Email Validation**: Basic regex validation
4. **No Payment Data Storage**: Phone number only, not card details

### Backend Requirements

1. **SSL/HTTPS**: Use only for sensitive data
2. **CORS**: Validate origin
3. **Rate Limiting**: Prevent payment spam
4. **Payment Gateway**: Secure M-Pesa integration
5. **Data Encryption**: Encrypt sensitive data in transit and storage
6. **PCI Compliance**: If handling card payments

## Testing Checklist

- [ ] Test with valid Kenyan phone numbers
- [ ] Test with international format (+254)
- [ ] Test with local format (0)
- [ ] Test invalid phone numbers (should error)
- [ ] Test invalid emails
- [ ] Test missing fields
- [ ] Test successful order flow
- [ ] Test payment error handling
- [ ] Test cart clearing after order
- [ ] Test back button behavior
- [ ] Test on mobile devices
- [ ] Test loading states
- [ ] Test order confirmation display

## Future Enhancements

1. **Order Tracking**: Add order status tracking page
2. **Email Confirmation**: Send order confirmation to customer email
3. **SMS Notification**: Send order updates via SMS
4. **Payment Retry**: Allow user to retry failed payments
5. **Guest Checkout**: Allow checkout without account
6. **Address Book**: Save and reuse addresses
7. **Promo Codes**: Apply discount codes
8. **Gift Wrapping**: Add gift wrap option
9. **Order Notes**: Allow customer to add order notes
10. **Payment Options**: Add Stripe, Airtel Money, etc.

## Troubleshooting

### Issue: Form not submitting

**Solution**: Check browser console for validation errors. Ensure all required fields are filled.

### Issue: Phone validation failing

**Solution**: Ensure phone number is in format +254XXXXXXXXX or 0XXXXXXXXX (9 digits after 0/254)

### Issue: Payment not processing

**Solution**: Check that shipping information was saved. Verify M-Pesa phone number.

### Issue: Order not confirming

**Solution**: Check that payment was initiated. Verify network connection.

## Code References

- **Checkout Page**: `app/checkout/page.tsx`
- **Cart Context**: `context/CartContext.tsx`
- **Form Inputs**: `components/ui/input.tsx`
- **Buttons**: `components/ui/button.tsx`
- **Header**: `components/Header.tsx`
- **Footer**: `components/Footer.tsx`
