type Params = Record<string, any> | undefined

export const translations: Record<string, string> = {
  // Navbar
  'navbar.home': 'Home',
  'navbar.shop': 'Shop',
  'navbar.programs': 'Programs',
  'navbar.contact': 'Contact',
  'navbar.searchPlaceholder': 'Search products...',
  'navbar.searchAria': 'Open search',
  'navbar.cartAria': 'View cart',

  // Auth / User
  'auth.login': 'Login',
  'auth.logout': 'Log out',
  'auth.welcome': 'Welcome',
  'user.settings': 'Settings',
  'user.myOrders': 'My Orders',

  // Featured / Home
  'featured.label': 'Featured',
  'featured.headline.line1': 'Explore STEM products & programs',

  // Newsletter
  'newsletter.label': 'Subscribe',
  'newsletter.title.line1': 'Join our Newsletter',
  'newsletter.title.line2': "Get the latest updates",
  'newsletter.description': 'Sign up for updates, offers, and STEM resources.',
  'newsletter.emailPlaceholder': 'Your email',
  'newsletter.subscribe': 'Subscribe',

  // Login / Register
  'login.title': 'Sign in to your account',
  'login.email': 'Email',
  'login.placeholderEmail': 'you@example.com',
  'login.password': 'Password',
  'login.submitting': 'Signing in…',
  'login.submit': 'Sign in',
  'login.noAccount': "Don't have an account?",
  'login.register': 'Create account',

  'register.title': 'Create an account',
  'register.name': 'Full name',
  'register.email': 'Email',
  'register.password': 'Password',
  'register.registering': 'Registering…',
  'register.register': 'Register',
  'register.alreadyHave': 'Already have an account?',
  'register.login': 'Sign in',

  // Products
  'products.not_found': 'Product not found',
  'products.back_to_shop': 'Back to shop',
  'products.in_stock_with_count': '{count} in stock',
  'products.out_of_stock': 'Out of stock',
  'products.add_to_cart': 'Add to cart',

  // Messages / Toasts
  'message.selection_required_title': 'Selection required',
  'message.selection_required_desc': 'Please select a variant before adding to cart.',
  'message.added_to_cart_title': 'Added to cart',
  'message.added_to_cart_desc': '{name} added to cart {attrs}',

  // Trust badges
  'trust.fastDelivery.title': 'Fast delivery',
  'trust.fastDelivery.subtitle': 'Ships within 24 hours',

  // Footer
  'footer.brandDescription': 'STEM PARK — hands-on STEM education and kits for curious minds.',
  'footer.quickLinks': 'Quick Links',
  'footer.shopAll': 'Shop all',
  'footer.stemPrograms': 'Programs',
  'footer.contactUs': 'Contact us',
  'footer.programs': 'Programs',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.terms': 'Terms & Conditions',
  'footer.shipping': 'Shipping & Returns',
  'footer.copyright': '© {year} STEM PARK. All rights reserved.',

  // Chatbot
  'chatbot.welcome': 'Hi there! How can I help you today?',
  'chatbot.quickReplies.browseKits': 'Browse kits',
  'chatbot.quickReplies.printerRental': '3D Printer rental',
  'chatbot.quickReplies.programs': 'Programs',
  'chatbot.quickReplies.trackOrder': 'Track an order',
  'chatbot.responses.browseKits': 'You can browse kits on our Shop page.',
  'chatbot.responses.printerRental': 'Our printer rental plans start at $20/day.',
  'chatbot.responses.programs': 'We offer workshops, summer camps, and teacher training.',
  'chatbot.responses.trackOrder': 'Please provide your order ID and we will check the status.',
  'chatbot.responses.default': "Thanks for your message! We'll get back to you shortly.",
  'chatbot.header': 'Chat with us',
  'chatbot.online': 'Online',
  'chatbot.typeMessage': 'Type a message...',

  // Admin / product builder small keys
  'level_name': 'Level {depth}',
  'level_default': 'Level {depth}',
  'value': 'Value',
  'delete_confirm': 'Are you sure you want to delete "{name}"?',
  'delete': 'Delete',
  'select_currency': 'Select currency',
  'sku_required': 'SKU (required)',
  'barcode': 'Barcode',
  'weight_kg': 'Weight (kg)',
  'market_pricing': 'Marketplace pricing',
  'add_market': 'Add market',
  'admin.field.currency': 'Currency',
  'admin.field.regular_price': 'Regular price',
  'admin.field.sale_price': 'Sale price',

  // Products (missing)
  'product.addedTitle': 'Added to cart',
  'product.addedDesc': '{name} added to cart',
  'product.multiOption': 'Multiple options',
  'product.from': 'From',
  'product.shippingTo': 'Ships to',

  // Programs list
  'programs.list.stemClubs.title': 'STEM Clubs',
  'programs.list.academicSupport.title': 'Academic Support',
  'programs.list.teacherTraining.title': 'Teacher Training',
  'programs.list.summerCamps.title': 'Summer Camps',

  // Admin nav
  'admin.nav.dashboard': 'Dashboard',
  'admin.nav.brands': 'Brands',
  'admin.nav.programs': 'Programs',
  'admin.nav.categories': 'Categories',
  'admin.nav.products': 'Products',
  'admin.nav.orders': 'Orders',
  'admin.nav.customers': 'Customers',
  'admin.nav.contactInfo': 'Contact Info',
  'admin.nav.customization': 'Customization',

  // User
  'user.profile': 'Profile',
};

function humanizeKey(key: string) {
  // Split by dots, dashes, underscores and camelCase boundaries
  const parts = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\.|-|_/)
    .flatMap(p => p.split(/(?=[A-Z])/));
  return parts
    .map(p => p.replace(/\{.*\}/g, '').trim())
    .filter(Boolean)
    .map(p => p.replace(/\b\w/g, c => c.toUpperCase()))
    .join(' ');
}

export function t(key: string, params?: Params): string {
  const template = translations[key];
  if (!template) {
    // Optionally log missing keys in dev for later population
    if (typeof window !== 'undefined' && (window as any).__DEV__) {
      console.warn(`[i18n] Missing translation for key: ${key}`);
    }
    return humanizeKey(key);
  }
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, p) => (params as any)[p] ?? `{${p}}`);
}
