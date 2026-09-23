import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Heart,
  LayoutDashboard,
  MapPin,
  Menu,
  Minus,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
  Utensils,
  X,
  DollarSign,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Category = 'All' | 'Chicken' | 'Pasta' | 'Korean' | 'Burgers' | 'Comfort Food' | 'Desserts';

type Product = {
  id: number;
  restaurant: string;
  name: string;
  description: string;
  price: number;
  categories: Category[];
  image: string;
  alt: string;
  featured?: boolean;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  {
    id: 1,
    restaurant: 'K-BBQ',
    name: 'Soy Garlic Korean Wings',
    price: 13,
    description: '6 crispy Korean wings glazed with a soy-based sauce and topped with minced crispy garlic.',
    categories: ['Korean', 'Chicken'],
    image: 'https://images.pexels.com/photos/30700607/pexels-photo-30700607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Glossy Korean wings with sesame and green onion',
    featured: true,
  },
  {
    id: 2,
    restaurant: 'K-BBQ',
    name: 'Chicken Bulgogi',
    price: 15,
    description: 'Chicken thighs and breasts marinated in a specialty sweet chili-pepper sauce, served with steamed vegetables and white rice.',
    categories: ['Korean', 'Chicken'],
    image: 'https://images.pexels.com/photos/28977930/pexels-photo-28977930.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Korean barbecue with vegetables and rice',
  },
  {
    id: 3,
    restaurant: 'Olive Garden',
    name: 'Chicken Alfredo',
    price: 20.49,
    description: 'Fettuccine with creamy Alfredo sauce topped with your choice of grilled chicken or crispy chicken fritta.',
    categories: ['Pasta', 'Comfort Food'],
    image: 'https://images.pexels.com/photos/37118296/pexels-photo-37118296.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Creamy chicken Alfredo with parmesan',
  },
  {
    id: 4,
    restaurant: 'Houston TX Hot Chicken',
    name: 'Hot Honey OG Sandwich Meal',
    price: 16.25,
    description: 'Hot chicken sandwich on a brioche bun with pickles, slaw and house sauce, finished with Hot Honey.',
    categories: ['Chicken', 'Burgers'],
    image: 'https://images.pexels.com/photos/8130750/pexels-photo-8130750.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Crispy chicken sandwich with slaw and pickles',
  },
  {
    id: 5,
    restaurant: 'Houston TX Hot Chicken',
    name: '2 Tenders Meal',
    price: 13.75,
    description: 'Two hot chicken tenders served with pickles and house sauce.',
    categories: ['Chicken', 'Comfort Food'],
    image: 'https://images.pexels.com/photos/20152618/pexels-photo-20152618.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Crispy fried chicken tenders with sesame',
  },
  {
    id: 6,
    restaurant: 'The Sunday Table',
    name: 'Ember Smashburger',
    price: 14.5,
    description: 'Two crisp-edged patties, aged cheddar, charred onion and a glossy pepper relish.',
    categories: ['Burgers', 'Comfort Food'],
    image: 'https://images.pexels.com/photos/7497212/pexels-photo-7497212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Gourmet burger with creamy slaw',
  },
  {
    id: 7,
    restaurant: 'Nona After Dark',
    name: 'Truffle Cacio e Pepe',
    price: 18,
    description: 'Silky tonnarelli, pecorino romano, cracked pepper and a whisper of black truffle.',
    categories: ['Pasta', 'Comfort Food'],
    image: 'https://images.pexels.com/photos/31269840/pexels-photo-31269840.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Fettuccine pasta twirled on a fork',
  },
  {
    id: 8,
    restaurant: 'Little Seoul',
    name: 'Stone Bowl Bibimbap',
    price: 16.5,
    description: 'Seasoned vegetables, gochujang, short grain rice and a soft egg in a crackling hot bowl.',
    categories: ['Korean', 'Comfort Food'],
    image: 'https://images.pexels.com/photos/7491952/pexels-photo-7491952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Korean bibimbap in a stone bowl',
  },
  {
    id: 9,
    restaurant: 'Demo Kitchen 04',
    name: 'Midnight Chocolate Cake',
    price: 9,
    description: 'Dark chocolate cake, smoked sea salt caramel and a cool scoop of vanilla.',
    categories: ['Desserts'],
    image: 'https://images.pexels.com/photos/36740866/pexels-photo-36740866.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Chocolate dessert with ice cream',
  },
  {
    id: 10,
    restaurant: 'Demo Kitchen 04',
    name: 'Lava Cake à la Mode',
    price: 10.5,
    description: 'Warm chocolate center, cold vanilla bean ice cream and fresh berries.',
    categories: ['Desserts'],
    image: 'https://images.pexels.com/photos/33803906/pexels-photo-33803906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Chocolate lava cake with ice cream and berries',
  },
];

const categories: Category[] = ['All', 'Chicken', 'Pasta', 'Korean', 'Burgers', 'Comfort Food', 'Desserts'];
const locations = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Austin', 'Seattle'];

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function FoodImage({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <div className={`food-image ${className}`}>
      <div className="food-image-glow" />
      <img src={product.image} alt={product.alt} loading="lazy" />
    </div>
  );
}

const adminStats = [
  { label: 'Total Revenue', value: '$48,290', change: '+12.5%', icon: DollarSign, positive: true },
  { label: 'Total Orders', value: '1,847', change: '+8.2%', icon: ShoppingBag, positive: true },
  { label: 'Active Users', value: '3,294', change: '+4.1%', icon: Users, positive: true },
  { label: 'Products', value: '128', change: '+3', icon: Package, positive: true },
];

const adminProducts = [
  { id: 'P001', name: 'Soy Garlic Korean Wings', restaurant: 'K-BBQ', price: '$13.00', category: 'Korean', stock: 142, status: 'Active' },
  { id: 'P002', name: 'Chicken Bulgogi', restaurant: 'K-BBQ', price: '$15.00', category: 'Korean', stock: 98, status: 'Active' },
  { id: 'P003', name: 'Chicken Alfredo', restaurant: 'Olive Garden', price: '$20.49', category: 'Pasta', stock: 76, status: 'Active' },
  { id: 'P004', name: 'Hot Honey OG Sandwich', restaurant: 'Houston TX', price: '$16.25', category: 'Burgers', stock: 54, status: 'Active' },
  { id: 'P005', name: '2 Tenders Meal', restaurant: 'Houston TX', price: '$13.75', category: 'Chicken', stock: 0, status: 'Out of stock' },
  { id: 'P006', name: 'Ember Smashburger', restaurant: 'The Sunday Table', price: '$14.50', category: 'Burgers', stock: 120, status: 'Active' },
  { id: 'P007', name: 'Truffle Cacio e Pepe', restaurant: 'Nona After Dark', price: '$18.00', category: 'Pasta', stock: 43, status: 'Active' },
  { id: 'P008', name: 'Midnight Chocolate Cake', restaurant: 'Demo Kitchen 04', price: '$9.00', category: 'Desserts', stock: 67, status: 'Active' },
];

const adminUsers = [
  { id: 'U001', name: 'Marcus Chen', email: 'm.chen@email.com', orders: 24, spent: '$412.50', joined: 'Jan 2026', status: 'Active' },
  { id: 'U002', name: 'Sofia Rodriguez', email: 's.rod@email.com', orders: 18, spent: '$298.75', joined: 'Feb 2026', status: 'Active' },
  { id: 'U003', name: 'James Park', email: 'j.park@email.com', orders: 31, spent: '$521.00', joined: 'Dec 2025', status: 'Active' },
  { id: 'U004', name: 'Aisha Patel', email: 'a.patel@email.com', orders: 7, spent: '$112.25', joined: 'Mar 2026', status: 'Active' },
  { id: 'U005', name: 'Tyler Brooks', email: 't.brooks@email.com', orders: 0, spent: '$0.00', joined: 'Sep 2026', status: 'Inactive' },
  { id: 'U006', name: 'Nina Kowalski', email: 'n.kow@email.com', orders: 15, spent: '$247.80', joined: 'Jan 2026', status: 'Active' },
];

const adminOrders = [
  { id: '#ORD-7841', customer: 'Marcus Chen', items: 3, total: '$42.74', status: 'Delivered', date: 'Sep 21' },
  { id: '#ORD-7840', customer: 'Sofia Rodriguez', items: 2, total: '$29.25', status: 'Preparing', date: 'Sep 21' },
  { id: '#ORD-7839', customer: 'James Park', items: 5, total: '$78.50', status: 'In transit', date: 'Sep 21' },
  { id: '#ORD-7838', customer: 'Aisha Patel', items: 1, total: '$13.00', status: 'Delivered', date: 'Sep 20' },
  { id: '#ORD-7837', customer: 'Nina Kowalski', items: 4, total: '$56.99', status: 'Pending', date: 'Sep 20' },
  { id: '#ORD-7836', customer: 'Marcus Chen', items: 2, total: '$31.49', status: 'Cancelled', date: 'Sep 20' },
];

const adminRevenue = [
  { month: 'Apr', value: 28400 }, { month: 'May', value: 31200 }, { month: 'Jun', value: 35800 },
  { month: 'Jul', value: 39100 }, { month: 'Aug', value: 42600 }, { month: 'Sep', value: 48290 },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Delivered: { color: '#3a8a4a', icon: CheckCircle2 },
  Preparing: { color: '#ba4f27', icon: Clock },
  'In transit': { color: '#c9962b', icon: Clock },
  Pending: { color: '#6b6b6b', icon: AlertCircle },
  Cancelled: { color: '#a83232', icon: AlertCircle },
  Active: { color: '#3a8a4a', icon: CheckCircle2 },
  Inactive: { color: '#6b6b6b', icon: AlertCircle },
  'Out of stock': { color: '#a83232', icon: AlertCircle },
};

function AdminDashboard({
  activeTab,
  onTabChange,
  onClose,
}: {
  activeTab: 'overview' | 'products' | 'users' | 'orders' | 'revenue';
  onTabChange: (tab: 'overview' | 'products' | 'users' | 'orders' | 'revenue') => void;
  onClose: () => void;
}) {
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingBag },
    { id: 'revenue' as const, label: 'Revenue', icon: TrendingUp },
  ];
  const maxRevenue = Math.max(...adminRevenue.map((r) => r.value));

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <aside className="admin-sidebar">
          <div className="admin-brand"><span>SAVORÉ</span><b>Admin</b></div>
          <nav className="admin-nav">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => onTabChange(id)}>
                <Icon size={17} strokeWidth={1.5} /> {label}
              </button>
            ))}
          </nav>
          <button className="admin-back" onClick={onClose}><ArrowUpRight size={16} /> Back to site</button>
        </aside>
        <div className="admin-main">
          <header className="admin-header">
            <h2>{tabs.find((t) => t.id === activeTab)?.label}</h2>
            <div className="admin-header-actions">
              <div className="admin-search"><Search size={15} strokeWidth={1.5} /><input placeholder="Search..." /></div>
              <button className="admin-close" onClick={onClose} aria-label="Close admin"><X size={20} /></button>
            </div>
          </header>
          <div className="admin-content">
            {activeTab === 'overview' && (<>
              <div className="admin-stats">{adminStats.map(({ label, value, change, icon: Icon, positive }) => (
                <div className="admin-stat-card" key={label}>
                  <div className="admin-stat-top"><Icon size={18} strokeWidth={1.5} /><span className={positive ? 'positive' : ''}>{change}</span></div>
                  <strong>{value}</strong><span className="admin-stat-label">{label}</span>
                </div>
              ))}</div>
              <div className="admin-section">
                <div className="admin-section-head"><h3>Recent Orders</h3><button className="admin-link">View all <ArrowRight size={14} /></button></div>
                <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{adminOrders.slice(0, 5).map((order) => { const cfg = statusConfig[order.status]; return (<tr key={order.id}><td className="mono">{order.id}</td><td>{order.customer}</td><td>{order.items}</td><td className="mono">{order.total}</td><td><span className="admin-status" style={{ color: cfg.color }}><cfg.icon size={13} /> {order.status}</span></td><td className="mono">{order.date}</td></tr>); })}</tbody></table></div>
              </div>
              <div className="admin-section">
                <div className="admin-section-head"><h3>Top Products</h3><button className="admin-link">Manage <ArrowRight size={14} /></button></div>
                <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Product</th><th>Restaurant</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead><tbody>{adminProducts.slice(0, 5).map((p) => { const cfg = statusConfig[p.status]; return (<tr key={p.id}><td className="mono">{p.id}</td><td>{p.name}</td><td>{p.restaurant}</td><td className="mono">{p.price}</td><td>{p.stock}</td><td><span className="admin-status" style={{ color: cfg.color }}><cfg.icon size={13} /> {p.status}</span></td></tr>); })}</tbody></table></div>
              </div>
            </>)}
            {activeTab === 'products' && (<>
              <div className="admin-toolbar"><div className="admin-filters"><button className="active">All</button><button>Active</button><button>Out of stock</button></div><button className="admin-add-btn"><Plus size={16} /> Add Product</button></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Product Name</th><th>Restaurant</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{adminProducts.map((p) => { const cfg = statusConfig[p.status]; return (<tr key={p.id}><td className="mono">{p.id}</td><td>{p.name}</td><td>{p.restaurant}</td><td>{p.category}</td><td className="mono">{p.price}</td><td>{p.stock}</td><td><span className="admin-status" style={{ color: cfg.color }}><cfg.icon size={13} /> {p.status}</span></td><td><div className="admin-row-actions"><button aria-label="Edit"><Pencil size={14} /></button><button aria-label="Delete" className="danger"><Trash2 size={14} /></button></div></td></tr>); })}</tbody></table></div>
            </>)}
            {activeTab === 'users' && (<>
              <div className="admin-toolbar"><div className="admin-filters"><button className="active">All</button><button>Active</button><button>Inactive</button></div></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead><tbody>{adminUsers.map((u) => { const cfg = statusConfig[u.status]; return (<tr key={u.id}><td className="mono">{u.id}</td><td>{u.name}</td><td className="mono">{u.email}</td><td>{u.orders}</td><td className="mono">{u.spent}</td><td className="mono">{u.joined}</td><td><span className="admin-status" style={{ color: cfg.color }}><cfg.icon size={13} /> {u.status}</span></td><td><div className="admin-row-actions"><button aria-label="Edit"><Pencil size={14} /></button><button aria-label="Delete" className="danger"><Trash2 size={14} /></button></div></td></tr>); })}</tbody></table></div>
            </>)}
            {activeTab === 'orders' && (<>
              <div className="admin-toolbar"><div className="admin-filters"><button className="active">All</button><button>Pending</button><button>Preparing</button><button>In transit</button><button>Delivered</button><button>Cancelled</button></div></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>{adminOrders.map((o) => { const cfg = statusConfig[o.status]; return (<tr key={o.id}><td className="mono">{o.id}</td><td>{o.customer}</td><td>{o.items}</td><td className="mono">{o.total}</td><td><span className="admin-status" style={{ color: cfg.color }}><cfg.icon size={13} /> {o.status}</span></td><td className="mono">{o.date}</td><td><div className="admin-row-actions"><button aria-label="Edit"><Pencil size={14} /></button></div></td></tr>); })}</tbody></table></div>
            </>)}
            {activeTab === 'revenue' && (<>
              <div className="admin-stats">{adminStats.slice(0, 2).map(({ label, value, change, icon: Icon, positive }) => (
                <div className="admin-stat-card" key={label}><div className="admin-stat-top"><Icon size={18} strokeWidth={1.5} /><span className={positive ? 'positive' : ''}>{change}</span></div><strong>{value}</strong><span className="admin-stat-label">{label}</span></div>
              ))}</div>
              <div className="admin-section">
                <div className="admin-section-head"><h3>Revenue Trend</h3></div>
                <div className="admin-chart">{adminRevenue.map((r) => (<div className="admin-chart-bar" key={r.month}><div className="admin-chart-fill" style={{ height: `${(r.value / maxRevenue) * 100}%` }} /><span>{r.month}</span><b>${(r.value / 1000).toFixed(1)}k</b></div>))}</div>
              </div>
              <div className="admin-section">
                <div className="admin-section-head"><h3>Revenue by Category</h3></div>
                <div className="admin-revenue-list">
                  {[{ cat: 'Korean', amt: 14200, pct: 29 }, { cat: 'Chicken', amt: 11800, pct: 24 }, { cat: 'Pasta', amt: 9200, pct: 19 }, { cat: 'Burgers', amt: 7600, pct: 16 }, { cat: 'Desserts', amt: 5490, pct: 12 }].map((r) => (<div className="admin-revenue-row" key={r.cat}><span>{r.cat}</span><div className="admin-revenue-bar"><div style={{ width: `${r.pct}%` }} /></div><b>${r.amt.toLocaleString()}</b></div>))}
                </div>
              </div>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('New York');
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'users' | 'orders' | 'revenue'>('overview');
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 36, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.hero-visual', { scale: 1.14, opacity: 0, duration: 1.6, ease: 'power3.out' });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 82%', once: true },
        });
      });
      gsap.to('.hero-noodle-wrap', {
        yPercent: 8,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.story-image', {
        yPercent: -10,
        rotation: -2,
        ease: 'none',
        scrollTrigger: { trigger: '.story-section', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, pageRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const visibleProducts = useMemo(
    () => activeCategory === 'All' ? products : products.filter((product) => product.categories.includes(activeCategory)),
    [activeCategory],
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQuantity(id: number, delta: number) {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  }

  return (
    <div ref={pageRef} className="site-shell">
      <header className="navbar">
        <a className="wordmark" href="#top" aria-label="Savoré home">SAVORÉ<span>.</span></a>
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#locations" onClick={() => setMenuOpen(false)}>Locations</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-button search-button" aria-label="Search"><Search size={18} strokeWidth={1.5} /></button>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${itemCount} items`}>
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span>Cart</span><b>{itemCount}</b>
          </button>
          <button className="icon-button menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" id="discover">
          <div className="hero-noise" />
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Food, found differently</p>
            <h1>Good food<br />deserves a <em>moment.</em></h1>
            <p className="hero-description">Discover bold flavors from restaurants worth ordering from.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#menu">Explore the menu <ArrowRight size={16} /></a>
              <a className="text-link" href="#story">Discover SAVORÉ <ArrowDownRight size={17} /></a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-image-backdrop" />
            <div className="hero-noodle-wrap">
              <img src="https://images.pexels.com/photos/35517020/pexels-photo-35517020.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" />
              <div className="hero-noodle-fade" />
            </div>
            <div className="featured-note"><span>Featured</span><strong>Soy Garlic<br />Korean Wings</strong><small>$13 · 6 pieces</small></div>
          </div>
          <div className="hero-scroll"><span>Scroll to discover</span><ArrowDownRight size={16} /></div>
        </section>

        <section className="marquee" aria-label="Savoré message"><div>Flavor worth slowing down for <span>·</span> Flavor worth slowing down for <span>·</span></div></section>

        <section className="story-section section-light" id="story">
          <div className="story-image-wrap"><div className="story-halo" /><img className="story-image" src="https://images.pexels.com/photos/6368743/pexels-photo-6368743.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Glazed chicken with rice on a dark plate" loading="lazy" /></div>
          <div className="story-copy reveal"><p className="eyebrow"><span className="eyebrow-line" /> The first bite</p><h2>Made to make<br /><i>you hungry.</i></h2><p>Some meals fill a space. The right ones create a memory. We look for the crackle, the gloss, the slow pull of something made with intention.</p><a className="text-link text-link-dark" href="#menu">Meet your next favorite <ArrowUpRight size={17} /></a></div>
          <div className="story-index">01 <span>/</span> 03</div>
        </section>

        <section className="process-section section-dark" id="how-it-works">
          <div className="section-heading reveal"><p className="eyebrow eyebrow-inverse"><span className="eyebrow-line" /> The SAVORÉ way</p><h2>From craving<br />to your <i>door.</i></h2></div>
          <div className="steps">
            {[
              { number: '01', icon: Search, title: 'Discover', copy: 'Find dishes worth trying.' },
              { number: '02', icon: Utensils, title: 'Choose', copy: 'Explore menus and flavors.' },
              { number: '03', icon: ShoppingBag, title: 'Enjoy', copy: 'Order your next favorite meal.' },
            ].map(({ number, icon: Icon, title, copy }) => <div className="step reveal" key={number}><div className="step-top"><span>{number}</span><Icon size={21} strokeWidth={1.25} /></div><h3>{title}</h3><p>{copy}</p><ArrowUpRight className="step-arrow" size={17} /></div>)}
          </div>
        </section>

        <section className="menu-section section-light" id="menu">
          <div className="menu-intro reveal"><div><p className="eyebrow"><span className="eyebrow-line" /> A little something</p><h2>What are you<br /><i>craving?</i></h2></div><p className="menu-note">Menu prices shown are representative U.S. restaurant prices and may vary by location.</p></div>
          <div className="category-bar" role="tablist" aria-label="Menu categories">{categories.map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div>
          <div className="food-grid">{visibleProducts.map((product, index) => <article className={`food-card reveal card-${index % 4}`} key={product.id}><div className="food-card-visual"><FoodImage product={product} /><button className="favorite" aria-label={`Save ${product.name}`}><Heart size={17} strokeWidth={1.35} /></button><button className="add-button" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}><Plus size={19} /></button></div><div className="food-card-info"><div><span className="restaurant">{product.restaurant}</span><h3>{product.name}</h3><p>{product.description}</p></div><strong>{formatPrice(product.price)}</strong></div></article>)}</div>
        </section>

        <section className="location-section" id="locations">
          <div className="location-copy reveal"><p className="eyebrow eyebrow-inverse"><span className="eyebrow-line" /> Find your flavor</p><h2>Good food,<br /><i>close by.</i></h2><p>Explore what’s cooking in neighborhoods that know how to eat. SAVORÉ connects you to the dishes people are talking about.</p><div className="location-select"><MapPin size={17} /><span>{selectedLocation}</span><ChevronDown size={15} /></div><button className="admin-trigger" onClick={() => setAdminOpen(true)}><LayoutDashboard size={15} strokeWidth={1.5} /> Admin Panel</button></div>
          <div className="location-list reveal">{locations.map((location, index) => <button key={location} className={selectedLocation === location ? 'selected' : ''} onClick={() => setSelectedLocation(location)}><span>0{index + 1}</span>{location}<ArrowUpRight size={17} /></button>)}</div>
        </section>

        {adminOpen && <AdminDashboard activeTab={adminTab} onTabChange={setAdminTab} onClose={() => setAdminOpen(false)} />}
      </main>

      <footer className="footer"><div className="footer-top"><div><a className="wordmark wordmark-light" href="#top">SAVORÉ<span>.</span></a><p>Good food deserves<br />a moment.</p></div><div className="footer-links"><div><span>Explore</span><a href="#discover">Discover</a><a href="#menu">Menu</a><a href="#how-it-works">How It Works</a></div><div><span>Company</span><a href="#locations">Locations</a><a href="#story">About</a><a href="#top">Contact</a></div><div><span>Social</span><a href="#top">Instagram</a><a href="#top">TikTok</a><a href="#top">X / Twitter</a></div></div></div><div className="footer-bottom"><span>© 2026 SAVORÉ</span><span>Made for the hungry</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></div></footer>

      <div className={`cart-overlay ${cartOpen ? 'visible' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label="Shopping cart" aria-hidden={!cartOpen}><div className="cart-header"><div><span className="eyebrow">Your order</span><h2>In the bag <small>({itemCount})</small></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={21} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={31} strokeWidth={1} /><p>Your bag is waiting<br />for something good.</p><a href="#menu" onClick={() => setCartOpen(false)} className="button button-dark">Browse the menu</a></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-copy"><span>{item.restaurant}</span><h3>{item.name}</h3><strong>{formatPrice(item.price)}</strong><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Estimated tax</span><b>{formatPrice(tax)}</b></div><div className="cart-total"><span>Total</span><b>{formatPrice(total)}</b></div><button className="button button-dark checkout-button" onClick={() => window.alert('Checkout is coming next.')}>Continue to checkout <ArrowRight size={16} /></button><p className="cart-disclaimer"><Clock3 size={13} /> Estimated delivery times shown at checkout</p></div></>}</aside>
    </div>
  );
}

export default App;
