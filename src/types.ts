export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  details: string[];
}

export interface TrustPoint {
  id: string;
  stat: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Campaign {
  id: string;
  title: string;
  category: 'KOL' | 'TVC' | 'Lookbook' | 'Seeding' | 'Content';
  image: string;
  client: string;
  reach: string;
  engagement: string;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  brand: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isPopular: boolean;
  features: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
