export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  links: string[];
  category: string;
  tags: string[];
  createdAt: string;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  certificateUrl?: string;
}

export interface PersonalInfo {
  name: string;
  tagline: string;
  profileImage: string;
  bio: string;
  story: string;
  hobbies: string[];
}