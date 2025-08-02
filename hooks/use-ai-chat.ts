import { useState, useCallback } from 'react';

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  description?: string;
  revenue?: string;
  employees?: string;
  founded?: string;
  headquarters?: string;
  website?: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  department?: string;
  linkedin?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  taggedCompanies?: Company[];
  taggedContacts?: Contact[];
  suggestions?: string[];
}

// Enhanced mock data with more realistic information
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Tech Corp',
    industry: 'Technology',
    description: 'Leading software development company specializing in enterprise solutions and cloud infrastructure.',
    revenue: '$2.5B',
    employees: '15,000+',
    founded: '2010',
    headquarters: 'San Francisco, CA',
    website: 'techcorp.com',
  },
  {
    id: '2',
    name: 'Health Plus',
    industry: 'Healthcare',
    description: 'Healthcare provider focused on digital health solutions and telemedicine platforms.',
    revenue: '$890M',
    employees: '5,200',
    founded: '2015',
    headquarters: 'Boston, MA',
    website: 'healthplus.com',
  },
  {
    id: '3',
    name: 'Green Energy Solutions',
    industry: 'Energy',
    description: 'Renewable energy company developing innovative solar and wind power solutions.',
    revenue: '$1.2B',
    employees: '8,500',
    founded: '2012',
    headquarters: 'Austin, TX',
    website: 'greenenergy.com',
  },
  {
    id: '4',
    name: 'FinanceFlow',
    industry: 'Financial Services',
    description: 'Digital banking platform providing fintech solutions for small and medium businesses.',
    revenue: '$650M',
    employees: '3,200',
    founded: '2018',
    headquarters: 'New York, NY',
    website: 'financeflow.com',
  },
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Corp',
    role: 'CEO',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    department: 'Executive',
    linkedin: 'linkedin.com/in/johnsmith',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Health Plus',
    role: 'Chief Technology Officer',
    email: 'sarah.johnson@healthplus.com',
    phone: '+1 (555) 234-5678',
    department: 'Technology',
    linkedin: 'linkedin.com/in/sarahjohnson',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    company: 'Green Energy Solutions',
    role: 'VP of Sales',
    email: 'mike.wilson@greenenergy.com',
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    linkedin: 'linkedin.com/in/mikewilson',
  },
  {
    id: '4',
    name: 'Emily Chen',
    company: 'FinanceFlow',
    role: 'Head of Product',
    email: 'emily.chen@financeflow.com',
    phone: '+1 (555) 456-7890',
    department: 'Product',
    linkedin: 'linkedin.com/in/emilychen',
  },
  {
    id: '5',
    name: 'David Rodriguez',
    company: 'Tech Corp',
    role: 'VP of Engineering',
    email: 'david.rodriguez@techcorp.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    linkedin: 'linkedin.com/in/davidrodriguez',
  },
];

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = useCallback((
    userMessage: string,
    taggedCompanies: Company[],
    taggedContacts: Contact[]
  ): { content: string; suggestions: string[] } => {
    const lowerMessage = userMessage.toLowerCase();
    let content = '';
    const suggestions: string[] = [];

    // Context from tagged entities
    const hasCompanies = taggedCompanies.length > 0;
    const hasContacts = taggedContacts.length > 0;

    if (hasCompanies && hasContacts) {
      const company = taggedCompanies[0];
      const contact = taggedContacts[0];
      
      if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
        content = `For ${company.name}, I recommend reaching out to ${contact.name} (${contact.role}). You can contact them at ${contact.email}`;
        if (contact.phone) content += ` or ${contact.phone}`;
        if (contact.linkedin) content += `. Their LinkedIn profile is ${contact.linkedin}`;
        content += '.';
        
        suggestions.push(
          `What other contacts do you have at ${company.name}?`,
          `Tell me more about ${contact.name}'s role`,
          `What's the best time to contact someone in ${contact.department}?`
        );
      } else {
        content = `Based on your query about ${company.name}, I can tell you that ${contact.name} as ${contact.role} would be a great contact. ${company.description}`;
        suggestions.push(
          `How can I best approach ${contact.name}?`,
          `What are ${company.name}'s main business priorities?`,
          `Show me more contacts at ${company.name}`
        );
      }
    } else if (hasCompanies) {
      const company = taggedCompanies[0];
      
      if (lowerMessage.includes('financial') || lowerMessage.includes('revenue')) {
        content = `${company.name} has a revenue of ${company.revenue} with ${company.employees} employees. Founded in ${company.founded}, they're headquartered in ${company.headquarters}.`;
        suggestions.push(
          `Who are the key decision makers at ${company.name}?`,
          `What's ${company.name}'s growth trajectory?`,
          `Compare ${company.name} with competitors`
        );
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('who')) {
        const companyContacts = mockContacts.filter(c => c.company === company.name);
        if (companyContacts.length > 0) {
          content = `At ${company.name}, you have ${companyContacts.length} contacts: ${companyContacts.map(c => `${c.name} (${c.role})`).join(', ')}.`;
          suggestions.push(
            `Tell me more about ${companyContacts[0].name}`,
            `Who's the best person to discuss partnerships?`,
            `Show me technical contacts at ${company.name}`
          );
        } else {
          content = `I don't have specific contacts for ${company.name} in the system. Would you like me to help you find the right person to reach out to?`;
        }
      } else {
        content = `${company.name} is a ${company.industry} company. ${company.description} They have ${company.employees} employees and generate ${company.revenue} in revenue.`;
        suggestions.push(
          `Who should I contact at ${company.name}?`,
          `What are ${company.name}'s main products?`,
          `How does ${company.name} compare to competitors?`
        );
      }
    } else if (hasContacts) {
      const contact = taggedContacts[0];
      
      content = `${contact.name} is the ${contact.role} at ${contact.company}. You can reach them at ${contact.email}`;
      if (contact.phone) content += ` or ${contact.phone}`;
      content += `.`;
      
      suggestions.push(
        `Tell me more about ${contact.company}`,
        `What's the best way to approach ${contact.name}?`,
        `Show me other contacts at ${contact.company}`
      );
    } else {
      // General responses based on message content
      if (lowerMessage.includes('revenue') || lowerMessage.includes('financial')) {
        content = 'I can help you find financial information about companies. Try tagging a specific company to get their revenue, employee count, and other key metrics.';
        suggestions.push(
          'Tag a company to see financial data',
          'Compare multiple companies',
          'Show me the largest companies by revenue'
        );
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
        content = 'I can help you find the right contacts at any company. Tag a company or contact to get detailed information including email, phone, and LinkedIn profiles.';
        suggestions.push(
          'Tag a company to see all contacts',
          'Find decision makers at a company',
          'Get contact details for a specific role'
        );
      } else if (lowerMessage.includes('analysis') || lowerMessage.includes('insight')) {
        content = 'I can provide insights about companies and help you understand market positioning, competitive landscape, and business relationships. What would you like to analyze?';
        suggestions.push(
          'Compare companies in the same industry',
          'Analyze a company\'s growth potential',
          'Find similar companies to target'
        );
      } else {
        content = 'I\'m your AI assistant for company and contact intelligence. I can help you with:\n\n• Find contact information\n• Get company insights\n• Analyze business relationships\n• Research market opportunities\n\nTry tagging a company or contact to get started!';
        suggestions.push(
          'Show me all companies in technology',
          'Find CEOs and decision makers',
          'Analyze companies by revenue size'
        );
      }
    }

    return { content, suggestions };
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    taggedCompanies: Company[] = [],
    taggedContacts: Contact[] = []
  ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      taggedCompanies,
      taggedContacts,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const { content: aiContent, suggestions } = generateAIResponse(content, taggedCompanies, taggedContacts);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiContent,
        timestamp: new Date(),
        suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, Math.random() * 1000 + 800); // Random delay between 800-1800ms
  }, [generateAIResponse]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};