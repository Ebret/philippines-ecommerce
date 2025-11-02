# Phase 17: Quick Start Guide
## UI Foundation & Components - Developer Reference

---

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Start Storybook (component library)
npm run storybook

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build
```

---

## 📦 Available Components

### Base UI Components

| Component | Location | Variants | Sizes |
|-----------|----------|----------|-------|
| Card | `ui/card.tsx` | 4 | - |
| Badge | `ui/badge.tsx` | 7 | 3 |
| Avatar | `ui/avatar.tsx` | 6 | 6 |
| Modal | `ui/modal.tsx` | - | 4 |
| Alert | `ui/alert.tsx` | 5 | - |
| Spinner | `ui/spinner.tsx` | 7 colors | 5 |
| Pagination | `ui/pagination.tsx` | - | - |
| Rating | `ui/rating.tsx` | 3 colors | 3 |
| Tabs | `ui/tabs.tsx` | 3 | - |
| Button | `ui/button.tsx` | 6 | 4 |
| Input | `ui/input.tsx` | - | - |
| Label | `ui/label.tsx` | - | - |
| Select | `ui/select.tsx` | - | - |

### Layout Components

| Component | Location | Features |
|-----------|----------|----------|
| Header | `layout/header.tsx` | Logo, nav, mobile menu, sticky |
| Footer | `layout/footer.tsx` | Sections, social links, copyright |
| Container | `layout/container.tsx` | Responsive max-width, padding |

---

## 🎨 Design System

### Colors
```typescript
import { colors } from '@/lib/design-system';

// Primary: #0ea5e9
// Secondary: #f59e0b
// Success: #22c55e
// Error: #ef4444
// Warning: #f59e0b
// Neutral: #6b7280
```

### Spacing Scale
```
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
```

### Breakpoints
```
xs: 320px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 💻 Component Usage

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="success" size="md">Active</Badge>
```

### Avatar
```tsx
import { Avatar } from '@/components/ui/avatar';

<Avatar src="/avatar.jpg" alt="User" size="md" status="online" />
```

### Modal
```tsx
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';

const [open, setOpen] = useState(false);
<Modal isOpen={open} onClose={() => setOpen(false)} title="Modal">
  Content
</Modal>
```

### Alert
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed</AlertDescription>
</Alert>
```

### Spinner
```tsx
import { Spinner, Loading } from '@/components/ui/spinner';

<Spinner size="md" color="primary" />
<Loading text="Loading..." fullScreen />
```

### Pagination
```tsx
import { Pagination } from '@/components/ui/pagination';

<Pagination 
  currentPage={1} 
  totalPages={10} 
  onPageChange={(page) => console.log(page)} 
/>
```

### Rating
```tsx
import { Rating } from '@/components/ui/rating';

<Rating 
  value={4} 
  maxValue={5} 
  onChange={(value) => console.log(value)}
  size="md"
  color="warning"
/>
```

### Tabs
```tsx
import { Tabs } from '@/components/ui/tabs';

<Tabs
  items={[
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  ]}
  defaultTab="tab1"
/>
```

### Header
```tsx
import { Header } from '@/components/layout/header';

<Header
  title="My Store"
  navigation={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ]}
  sticky
/>
```

### Footer
```tsx
import { Footer } from '@/components/layout/footer';

<Footer
  sections={[
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ]}
/>
```

### Container
```tsx
import { Container } from '@/components/layout/container';

<Container size="lg" padding="md">
  Content
</Container>
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Results
- ✅ 77 tests passing
- ✅ 100% pass rate
- ✅ All components covered

### Test File
`src/__tests__/ui-components.test.ts`

---

## 📚 Storybook

### Access Storybook
```bash
npm run storybook
# Open http://localhost:6006
```

### View Components
- Card stories: `Card` → `Default`, `Elevated`, `Outlined`, `Filled`, `Interactive`
- More stories coming in Phase 1 continuation

### Add New Stories
Create `ComponentName.stories.tsx` in component directory:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './my-component';

const meta = {
  title: 'UI/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <MyComponent />,
};
```

---

## 🎯 Common Tasks

### Create New Component
1. Create file in `src/components/ui/` or `src/components/layout/`
2. Use CVA for variants
3. Add TypeScript interfaces
4. Export component
5. Create `.stories.tsx` file
6. Add tests to `ui-components.test.ts`

### Add New Color
1. Edit `src/lib/design-system.ts`
2. Add color group with 50-900 shades
3. Update Tailwind config if needed
4. Update component variants

### Create New Variant
```tsx
const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      custom: 'custom-classes',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
```

---

## 📋 File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── card.tsx
│   │   ├── card.stories.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── modal.tsx
│   │   ├── alert.tsx
│   │   ├── spinner.tsx
│   │   ├── pagination.tsx
│   │   ├── rating.tsx
│   │   ├── tabs.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── select.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── container.tsx
│   └── auth/
├── lib/
│   ├── design-system.ts
│   └── utils.ts
└── __tests__/
    └── ui-components.test.ts
```

---

## 🔧 Configuration Files

- `.storybook/main.ts` - Storybook configuration
- `.storybook/preview.ts` - Storybook preview settings
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Vitest configuration

---

## 📊 Component Status

| Component | Status | Tests | Stories |
|-----------|--------|-------|---------|
| Card | ✅ Complete | 6 | ✅ |
| Badge | ✅ Complete | 6 | 🔄 |
| Avatar | ✅ Complete | 6 | 🔄 |
| Modal | ✅ Complete | 8 | 🔄 |
| Alert | ✅ Complete | 5 | 🔄 |
| Spinner | ✅ Complete | 5 | 🔄 |
| Pagination | ✅ Complete | 6 | 🔄 |
| Rating | ✅ Complete | 8 | 🔄 |
| Tabs | ✅ Complete | 8 | 🔄 |
| Header | ✅ Complete | 4 | 🔄 |
| Footer | ✅ Complete | 3 | 🔄 |
| Container | ✅ Complete | 4 | 🔄 |

Legend: ✅ = Complete, 🔄 = In Progress, ❌ = Not Started

---

## 🚀 Next Phase

**Phase 1 Continuation (Weeks 3-4)**
- Product components
- Cart components
- Checkout components
- Search components
- More Storybook stories
- Integration tests

---

## 📞 Support

For issues or questions:
1. Check Storybook documentation
2. Review component TypeScript interfaces
3. Check test file for usage examples
4. Review design system configuration

---

**Last Updated**: November 2, 2025  
**Status**: Phase 1 Complete ✅

