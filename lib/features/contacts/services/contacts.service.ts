import { Contact, ContactFilters, ContactsResponse, OCRData } from "../types";

class ContactsService {
  private readonly baseUrl = "/api/contacts";

  async getContacts(
    filters?: ContactFilters,
    page = 1,
    pageSize = 10,
  ): Promise<ContactsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.country && { country: filters.country }),
      ...(filters?.source && { source: filters.source }),
    });

    // Mock implementation - replace with actual API call
    const mockContacts = this.getMockContacts();
    const filteredContacts = this.applyFilters(mockContacts, filters);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      contacts: filteredContacts.slice(start, end),
      total: filteredContacts.length,
      page,
      pageSize,
    };
  }

  async getContact(id: string): Promise<Contact | null> {
    // Mock implementation
    const contacts = this.getMockContacts();

    return contacts.find((contact) => contact.id === id) || null;
  }

  async createContact(
    contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">,
  ): Promise<Contact> {
    // Mock implementation
    const newContact: Contact = {
      ...contactData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newContact;
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    // Mock implementation
    const contact = await this.getContact(id);

    if (!contact) {
      throw new Error("Contact not found");
    }

    return {
      ...contact,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  async deleteContact(id: string): Promise<void> {
    // Mock implementation
    console.log(`Deleting contact ${id}`);
  }

  async processOCR(imageFile: File): Promise<OCRData> {
    // Mock OCR processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          originalImage: URL.createObjectURL(imageFile),
          confidence: 0.85,
          extractedFields: {
            name: { value: "John Doe", confidence: 0.9 },
            email: { value: "john.doe@example.com", confidence: 0.8 },
            phone: { value: "+1-555-0123", confidence: 0.7 },
            company: { value: "Acme Corp", confidence: 0.85 },
            jobTitle: { value: "Software Engineer", confidence: 0.75 },
          },
          processedAt: new Date().toISOString(),
        });
      }, 2000);
    });
  }

  private applyFilters(
    contacts: Contact[],
    filters?: ContactFilters,
  ): Contact[] {
    if (!filters) return contacts;

    return contacts.filter((contact) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const fullName =
          `${contact.firstName} ${contact.lastName}`.toLowerCase();

        if (
          !fullName.includes(searchLower) &&
          !contact.email.toLowerCase().includes(searchLower) &&
          !contact.company?.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (filters.country && contact.country !== filters.country) {
        return false;
      }

      if (filters.source && contact.source !== filters.source) {
        return false;
      }

      return true;
    });
  }

  private getMockContacts(): Contact[] {
    return [
      {
        id: "1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "+1-555-0123",
        company: "Tech Corp",
        jobTitle: "Software Engineer",
        country: "United States",
        countryCode: "US",
        tags: ["prospect", "tech"],
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        source: "ocr",
      },
      // Add more mock contacts...
    ];
  }
}

export const contactsService = new ContactsService();
