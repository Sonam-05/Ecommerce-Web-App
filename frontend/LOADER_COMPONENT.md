# 🎨 Premium Loader Component

A beautiful, modern loading component with multiple animation variants for your e-commerce application.

## ✨ Features

- **6 Stunning Variants**: Choose from 6 different animation styles
- **Smooth Animations**: Buttery-smooth 60fps animations
- **Gradient Effects**: Modern gradient colors matching your brand
- **Full Screen Support**: Optional full-screen overlay mode
- **Responsive Design**: Works perfectly on all screen sizes
- **Dark Mode Ready**: Automatic dark mode support
- **Lightweight**: Pure CSS animations, no heavy dependencies
- **Customizable**: Easy to customize colors and messages

---

## 🎭 Available Variants

### 1. Default (8-Blade Spinner) ⭐ Recommended
```jsx
<Loader variant="default" />
```
A sleek 8-blade spinner with gradient colors and smooth rotation.

### 2. Dots
```jsx
<Loader variant="dots" />
```
Three bouncing dots with staggered animation.

### 3. Spinner (Triple Ring)
```jsx
<Loader variant="spinner" />
```
Three concentric rings spinning at different speeds.

### 4. Pulse
```jsx
<Loader variant="pulse" />
```
Pulsing circles with expanding animation.

### 5. Bars
```jsx
<Loader variant="bars" />
```
Five animated bars stretching vertically.

### 6. Gradient
```jsx
<Loader variant="gradient" />
```
Rotating gradient spinner with vibrant colors.

---

## 📖 Usage

### Basic Usage

```jsx
import Loader from './components/Loader';

function MyComponent() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <Loader />;
    }

    return <div>Your content</div>;
}
```

### With Custom Message

```jsx
<Loader message="Fetching products..." />
```

### Different Variants

```jsx
<Loader variant="dots" message="Please wait..." />
<Loader variant="gradient" message="Loading your cart..." />
<Loader variant="pulse" message="Processing order..." />
```

### Full Screen Loader

```jsx
{loading && (
    <Loader 
        variant="gradient" 
        message="Loading your content..." 
        fullScreen={true}
    />
)}
```

---

## 🎨 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'default'` | Animation style: `'default'`, `'dots'`, `'spinner'`, `'pulse'`, `'bars'`, `'gradient'` |
| `message` | string | `'Loading...'` | Text to display below the loader |
| `fullScreen` | boolean | `false` | Show as full-screen overlay with backdrop blur |

---

## 🎯 Use Cases

### Page Loading
```jsx
function ProductsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts().finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Loader variant="gradient" message="Loading products..." />;
    }

    return <ProductList />;
}
```

### Component Loading
```jsx
function ProductCard({ productId }) {
    const [product, setProduct] = useState(null);

    if (!product) {
        return <Loader variant="dots" message="Loading product..." />;
    }

    return <div>{product.name}</div>;
}
```

### Form Submission
```jsx
function CheckoutForm() {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        await processOrder();
        setSubmitting(false);
    };

    return (
        <>
            {submitting && (
                <Loader 
                    variant="pulse" 
                    message="Processing your order..." 
                    fullScreen={true}
                />
            )}
            <form onSubmit={handleSubmit}>...</form>
        </>
    );
}
```

### Data Fetching
```jsx
function OrderHistory() {
    const { orders, loading } = useOrders();

    return (
        <div>
            {loading ? (
                <Loader variant="bars" message="Fetching your orders..." />
            ) : (
                <OrderList orders={orders} />
            )}
        </div>
    );
}
```

---

## 🎨 Customization

### Changing Colors

Edit `Loader.css` to customize the gradient colors:

```css
/* Change gradient colors */
background: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);

/* Example: Blue to Purple */
background: linear-gradient(135deg, #3b82f6, #8b5cf6);

/* Example: Green to Teal */
background: linear-gradient(135deg, #10b981, #14b8a6);
```

### Changing Animation Speed

```css
/* Slower animation */
animation: rotate 2s linear infinite;

/* Faster animation */
animation: rotate 0.8s linear infinite;
```

### Changing Size

```css
.loader-default {
    width: 80px;  /* Increase from 60px */
    height: 80px;
}
```

---

## 🚀 Performance

- **Pure CSS**: No JavaScript animations, uses GPU acceleration
- **60 FPS**: Smooth animations on all devices
- **Lightweight**: < 5KB total (CSS + JS)
- **No Dependencies**: Works with just React

---

## 🌙 Dark Mode

The loader automatically adapts to dark mode:

```css
@media (prefers-color-scheme: dark) {
    .loader-fullscreen {
        background: rgba(17, 24, 39, 0.95);
    }
}
```

---

## 📱 Responsive

The loader scales beautifully on all screen sizes:

- Desktop: Full size (60px)
- Mobile: Scaled down (50px)
- Tablet: Adaptive sizing

---

## 🎬 Demo

To see all loader variants in action, import the demo component:

```jsx
import LoaderDemo from './components/LoaderDemo';

function App() {
    return <LoaderDemo />;
}
```

---

## 💡 Tips

1. **Use `fullScreen` for page transitions** - Provides better UX during navigation
2. **Match variant to context** - Use `pulse` for quick actions, `gradient` for longer waits
3. **Keep messages concise** - Short, clear messages work best
4. **Consider accessibility** - The loader includes proper ARIA labels

---

## 🔧 Troubleshooting

### Loader not showing?
- Ensure you've imported the CSS file
- Check that the parent container has proper height
- Verify the loading state is true

### Animations not smooth?
- Check browser hardware acceleration is enabled
- Ensure no CSS conflicts with animation properties
- Try a different variant

### Colors not matching brand?
- Customize the gradient colors in `Loader.css`
- Update CSS variables if using a design system

---

## 📦 Files

- `Loader.jsx` - Main component
- `Loader.css` - Styles and animations
- `LoaderDemo.jsx` - Demo showcase (optional)
- `LoaderDemo.css` - Demo styles (optional)

---

## 🎉 Examples in Your App

The loader is already integrated in:
- `HomePage.jsx` - Product loading
- `ProductsPage.jsx` - Products list loading
- `OrdersPage.jsx` - Orders loading
- And more!

---

**Created with ❤️ for an amazing user experience**

Last Updated: 2026-01-30
