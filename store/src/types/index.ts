export type ProductCategory = 
  | 'whatsapp'
  | 'telegram'
  | 'minecraft'
  | 'application'
  | 'siao'
  | 'generic';

export type BillingCycle = 'monthly' | 'quarterly' | 'semi_annually' | 'annually';

export interface ProductPlan {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  category: ProductCategory;
  priceMonthly: number;
  specs: {
    ram: string;
    ramMb: number;
    cpu: string;
    cpuPercentage: number;
    disk: string;
    diskMb: number;
    ports: number;
    backups: number;
    databases: number;
  };
  features: string[];
  nestId: number;
  eggId: number;
  dockerImage: string;
  startup: string;
  envVariables: Record<string, string>;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  discountFixed?: number;
  minSpend?: number;
  validUntil: string;
  usageCount: number;
  maxUsage: number;
}

export interface OrderItem {
  planId: string;
  planName: string;
  category: ProductCategory;
  billingCycle: BillingCycle;
  serverName: string;
  price: number;
  discount: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  username: string;
  pterodactylId?: number;
  createdAt: string;
}

export type PaymentMethod = 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'bni_va' | 'gopay' | 'dana' | 'ovo' | 'shopeepay';

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed' | 'refunded';

export type ServerStatus = 'installing' | 'running' | 'offline' | 'suspended';

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  item: OrderItem;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  qrString?: string;
  qrImage?: string;
  payUrl?: string;
  flowixReffId?: string;
  vaNumber?: string;
  amount: number;
  createdAt: string;
  paidAt?: string;
  serverId?: string;
  serverDetails?: {
    id: number;
    uuid: string;
    identifier: string;
    name: string;
    node: string;
    ipAddress: string;
    port: number;
    panelUrl: string;
    username: string;
  };
}

export interface ProvisionedServer {
  id: string;
  pteroId: number;
  uuid: string;
  identifier: string;
  name: string;
  category: ProductCategory;
  planName: string;
  customerEmail: string;
  customerName: string;
  ipAddress: string;
  port: number;
  ram: string;
  cpu: string;
  disk: string;
  status: ServerStatus;
  createdAt: string;
  expiresAt: string;
  panelUrl: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerName: string;
  subject: string;
  category: 'general' | 'technical' | 'billing' | 'server';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'answered' | 'customer_reply' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'customer' | 'support';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
}
