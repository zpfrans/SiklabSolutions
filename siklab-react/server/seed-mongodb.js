import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const seedData = {
  knowledge_base: [
    {
      question: "What services does Siklab Solutions offer?",
      answer: "Siklab Solutions offers three main services: 1) Enterprise Web Applications - Custom, scalable solutions for complex business needs. 2) Security & Compliance - Protect your systems with enterprise-grade security audits and compliance frameworks. 3) Managed Maintenance - 24/7 system monitoring and proactive support to keep your applications running smoothly.",
      category: "services",
      keywords: ["services", "offering", "what do you do", "solutions"],
      priority: 10,
      active: true
    },
    {
      question: "What are Siklab Solutions' core values?",
      answer: "Our five core values are: 1) Innovation Spark - Cutting-edge solutions that ignite progress. 2) Fearless Security - Uncompromising protection for your digital assets. 3) Catalyst Partnership - We collaborate to accelerate your growth. 4) Scalable Foundations - Build once, scale forever. 5) Transparent Velocity - Clear processes, rapid delivery.",
      category: "company",
      keywords: ["values", "culture", "principles", "philosophy"],
      priority: 8,
      active: true
    },
    {
      question: "How can I contact Siklab Solutions?",
      answer: "You can reach us at support@siklabsolutions.com for general inquiries. For sales and partnerships, please use the contact form on our website or schedule a consultation. We typically respond within 24 hours.",
      category: "contact",
      keywords: ["contact", "email", "reach", "support"],
      priority: 9,
      active: true
    },
    {
      question: "What is Enterprise Web Application development?",
      answer: "Our Enterprise Web Applications service provides custom, scalable solutions designed for complex business needs. We architect high-performance systems that handle heavy workloads, integrate with existing infrastructure, and scale with your business growth. We don't just code—we architect, secure, and sustain enterprise-grade solutions.",
      category: "services",
      keywords: ["enterprise", "web app", "application", "development", "custom"],
      priority: 7,
      active: true
    },
    {
      question: "What security services do you provide?",
      answer: "Our Security & Compliance service includes enterprise-grade security audits, vulnerability assessments, penetration testing, and implementation of compliance frameworks (GDPR, ISO 27001, SOC 2). We provide comprehensive security solutions to protect your digital assets with fearless dedication.",
      category: "services",
      keywords: ["security", "compliance", "audit", "protection", "gdpr"],
      priority: 8,
      active: true
    },
    {
      question: "What is included in Managed Maintenance?",
      answer: "Our Managed Maintenance service includes 24/7 system monitoring, proactive issue detection, regular updates and patches, performance optimization, backup management, and rapid incident response. We ensure your applications run smoothly with transparent velocity and minimal downtime.",
      category: "services",
      keywords: ["maintenance", "support", "monitoring", "24/7", "uptime"],
      priority: 7,
      active: true
    },
    {
      question: "How much do your services cost?",
      answer: "Pricing varies based on project scope, complexity, and specific requirements. We offer customized quotes tailored to your needs. Please contact our sales team at support@siklabsolutions.com or use our contact form to discuss your project and receive a detailed proposal.",
      category: "pricing",
      keywords: ["price", "cost", "pricing", "quote", "budget"],
      priority: 6,
      active: true
    },
    {
      question: "Where is Siklab Solutions located?",
      answer: "Siklab Solutions is a Philippine-based technology company. We serve clients globally while maintaining our roots in the Asia-Pacific region. For specific office locations or meeting arrangements, please contact us at support@siklabsolutions.com.",
      category: "company",
      keywords: ["location", "where", "philippines", "office", "address"],
      priority: 5,
      active: true
    },
    {
      question: "What technologies do you use?",
      answer: "We use modern, industry-standard technologies including React, Node.js, Python, PostgreSQL, MongoDB, AWS, Azure, and more. Our technology stack is chosen based on your specific needs to ensure scalable, secure, and maintainable solutions. We stay current with the latest innovations while prioritizing stability and performance.",
      category: "technical",
      keywords: ["technology", "stack", "tech", "tools", "programming"],
      priority: 6,
      active: true
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on scope and complexity. Small projects may take 4-8 weeks, medium projects 2-4 months, and large enterprise solutions 6-12 months. We follow agile methodologies with transparent velocity, providing regular updates and deliverables throughout the development process.",
      category: "process",
      keywords: ["timeline", "duration", "how long", "time", "deadline"],
      priority: 6,
      active: true
    }
  ],
  
  quick_responses: [
    {
      trigger: "hello|hi|hey|greetings",
      response: "Hello! 👋 Welcome to Siklab Solutions. How can I help you today? I can answer questions about our services, core values, pricing, or anything else you'd like to know!",
      category: "greeting",
      active: true
    },
    {
      trigger: "thank you|thanks|thx",
      response: "You're welcome! If you have any other questions about Siklab Solutions, feel free to ask. We're here to help! 😊",
      category: "gratitude",
      active: true
    },
    {
      trigger: "bye|goodbye|see you",
      response: "Thank you for chatting with us! If you need anything else, don't hesitate to reach out. Have a great day! 👋",
      category: "farewell",
      active: true
    },
    {
      trigger: "help|assist|support",
      response: "I'm here to help! I can provide information about:\n• Our services (Enterprise Web Apps, Security, Maintenance)\n• Company values and philosophy\n• Pricing and project timelines\n• Contact information\n\nWhat would you like to know?",
      category: "help",
      active: true
    }
  ],

  training_data: [
    {
      user_input: "Tell me about your company",
      bot_response: "Siklab Solutions is a technology company specializing in enterprise solutions. We architect, secure, and sustain high-performance systems with our three core services: Enterprise Web Applications, Security & Compliance, and Managed Maintenance.",
      category: "company_info",
      feedback_rating: null,
      created_at: new Date()
    }
  ]
};

async function seedMongoDB() {
  let client;
  
  try {
    console.log('🌱 Starting MongoDB seeding...\n');
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('siklab_chatbot');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await db.collection('knowledge_base').deleteMany({});
    await db.collection('quick_responses').deleteMany({});
    await db.collection('training_data').deleteMany({});
    
    // Insert knowledge base
    console.log('📚 Inserting knowledge base...');
    const kbResult = await db.collection('knowledge_base').insertMany(seedData.knowledge_base);
    console.log(`   ✅ Inserted ${kbResult.insertedCount} knowledge base entries`);
    
    // Insert quick responses
    console.log('⚡ Inserting quick responses...');
    const qrResult = await db.collection('quick_responses').insertMany(seedData.quick_responses);
    console.log(`   ✅ Inserted ${qrResult.insertedCount} quick responses`);
    
    // Insert training data
    console.log('🎓 Inserting training data...');
    const tdResult = await db.collection('training_data').insertMany(seedData.training_data);
    console.log(`   ✅ Inserted ${tdResult.insertedCount} training data entries`);
    
    // Create indexes
    console.log('📇 Creating indexes...');
    await db.collection('knowledge_base').createIndex({ question: 'text', answer: 'text' });
    await db.collection('knowledge_base').createIndex({ category: 1 });
    await db.collection('knowledge_base').createIndex({ keywords: 1 });
    await db.collection('quick_responses').createIndex({ trigger: 1 });
    console.log('   ✅ Indexes created');
    
    console.log('\n✨ MongoDB seeding completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

seedMongoDB();
