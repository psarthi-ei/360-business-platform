import React, { useState } from 'react';
import styles from '../styles/ContactPage.module.css';

interface ContactPageProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

function ContactPage({ 
  currentLanguage, 
  onLanguageChange
}: ContactPageProps) {
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    businessType: '',
    message: ''
  });

  const [consultingForm, setConsultingForm] = useState({
    name: '',
    email: '',
    company: '',
    serviceType: '',
    projectDescription: '',
    timeline: '',
    budget: ''
  });

  const contactOptions = [
    {
      icon: "🎬",
      title: "Request Product Demo",
      description: "See ElevateBusiness 360° in action with a personalized demo tailored to textile manufacturing.",
      meta: "30-minute session",
      action: "demo"
    },
    {
      icon: "💼",
      title: "Consulting Services",
      description: "Get expert guidance on technology strategy, system scalability, or project acceleration.",
      meta: "Free initial consultation",
      action: "consulting"
    },
    {
      icon: "🤝",
      title: "Partnership Inquiries",
      description: "Explore collaboration opportunities, integrations, or become a technology partner.",
      meta: "Business development",
      action: "partnership"
    },
    {
      icon: "🎯",
      title: "Investment Opportunities",
      description: "Learn about investment opportunities in India's MSME technology transformation space.",
      meta: "Investor relations",
      action: "investment"
    }
  ];

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request:', demoForm);
    // Handle demo request submission
    alert('Demo request submitted! We\'ll contact you within 24 hours.');
    setDemoForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      businessType: '',
      message: ''
    });
  };

  const handleConsultingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consulting inquiry:', consultingForm);
    // Handle consulting inquiry submission
    alert('Consulting inquiry submitted! We\'ll respond within 48 hours.');
    setConsultingForm({
      name: '',
      email: '',
      company: '',
      serviceType: '',
      projectDescription: '',
      timeline: '',
      budget: ''
    });
  };

  const scrollToForm = (formType: string) => {
    const element = document.getElementById(formType);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Let's Connect
          </h1>
          <p className={styles.heroSubtitle}>
            Whether you're a textile manufacturer ready to transform your business, 
            an enterprise seeking consulting services, or an investor interested in 
            India's MSME technology revolution - we'd love to hear from you.
          </p>
        </section>

        {/* Contact Options */}
        <section className={styles.contactOptions}>
          <h2 className={styles.sectionTitle}>How Can We Help?</h2>
          <p className={styles.sectionSubtitle}>
            Choose the option that best matches your needs, and we'll get you connected with the right person.
          </p>
          
          <div className={styles.optionsGrid}>
            {contactOptions.map((option, index) => (
              <div 
                key={index} 
                className={styles.optionCard}
                onClick={() => scrollToForm(option.action)}
              >
                <span className={styles.optionIcon}>{option.icon}</span>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
                <div className={styles.optionMeta}>{option.meta}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Forms Section */}
        <section className={styles.formsSection}>
          <div className={styles.formsGrid}>
            {/* Demo Request Form */}
            <div id="demo" className={styles.formCard}>
              <h3 className={styles.formTitle}>
                🎬 Request Product Demo
              </h3>
              <p className={styles.formDescription}>
                Get a personalized demonstration of ElevateBusiness 360° tailored to your textile manufacturing needs.
              </p>
              
              <form className={styles.form} onSubmit={handleDemoSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                    required
                    placeholder="Your full name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={demoForm.email}
                    onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                    required
                    placeholder="your.email@company.com"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Company Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={demoForm.company}
                    onChange={(e) => setDemoForm({...demoForm, company: e.target.value})}
                    required
                    placeholder="Your textile company name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Business Type</label>
                  <select
                    className={styles.formSelect}
                    value={demoForm.businessType}
                    onChange={(e) => setDemoForm({...demoForm, businessType: e.target.value})}
                  >
                    <option value="">Select business type</option>
                    <option value="textile-manufacturer">Textile Manufacturer</option>
                    <option value="fabric-trader">Fabric Trader</option>
                    <option value="garment-exporter">Garment Exporter</option>
                    <option value="dyeing-printing">Dyeing & Printing</option>
                    <option value="other">Other MSME</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Specific Requirements</label>
                  <textarea
                    className={styles.formTextarea}
                    value={demoForm.message}
                    onChange={(e) => setDemoForm({...demoForm, message: e.target.value})}
                    placeholder="Tell us about your current challenges and what you'd like to see in the demo..."
                  />
                </div>
                
                <button type="submit" className={styles.formSubmit}>
                  Request Demo
                </button>
              </form>
            </div>

            {/* Consulting Form */}
            <div id="consulting" className={styles.formCard}>
              <h3 className={styles.formTitle}>
                💼 Consulting Services Inquiry
              </h3>
              <p className={styles.formDescription}>
                Get expert guidance on technology strategy, system scalability, or project acceleration.
              </p>
              
              <form className={styles.form} onSubmit={handleConsultingSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={consultingForm.name}
                    onChange={(e) => setConsultingForm({...consultingForm, name: e.target.value})}
                    required
                    placeholder="Your full name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={consultingForm.email}
                    onChange={(e) => setConsultingForm({...consultingForm, email: e.target.value})}
                    required
                    placeholder="your.email@company.com"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Company Name *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={consultingForm.company}
                    onChange={(e) => setConsultingForm({...consultingForm, company: e.target.value})}
                    required
                    placeholder="Your company name"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Service Type</label>
                  <select
                    className={styles.formSelect}
                    value={consultingForm.serviceType}
                    onChange={(e) => setConsultingForm({...consultingForm, serviceType: e.target.value})}
                  >
                    <option value="">Select service type</option>
                    <option value="strategic-project-acceleration">Strategic Project Acceleration</option>
                    <option value="scalability-for-growth">Scalability for Growth</option>
                    <option value="agile-systems-rapid-innovation">Agile Systems for Rapid Innovation</option>
                    <option value="custom-consulting">Custom Consulting</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Description *</label>
                  <textarea
                    className={styles.formTextarea}
                    value={consultingForm.projectDescription}
                    onChange={(e) => setConsultingForm({...consultingForm, projectDescription: e.target.value})}
                    required
                    placeholder="Describe your project, current challenges, and desired outcomes..."
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Timeline</label>
                  <select
                    className={styles.formSelect}
                    value={consultingForm.timeline}
                    onChange={(e) => setConsultingForm({...consultingForm, timeline: e.target.value})}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP (Within 2 weeks)</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="3-months">Within 3 months</option>
                    <option value="6-months">Within 6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Budget Range</label>
                  <select
                    className={styles.formSelect}
                    value={consultingForm.budget}
                    onChange={(e) => setConsultingForm({...consultingForm, budget: e.target.value})}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5L">Under ₹5 Lakhs</option>
                    <option value="5L-10L">₹5-10 Lakhs</option>
                    <option value="10L-25L">₹10-25 Lakhs</option>
                    <option value="25L-50L">₹25-50 Lakhs</option>
                    <option value="50L-plus">₹50 Lakhs+</option>
                  </select>
                </div>
                
                <button type="submit" className={styles.formSubmit}>
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className={styles.contactInfo}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📧</span>
              <h3 className={styles.infoTitle}>Email</h3>
              <div className={styles.infoDetails}>
                <p>General: <a href="mailto:hello@elevateidea.com">hello@elevateidea.com</a></p>
                <p>Support: <a href="mailto:support@elevateidea.com">support@elevateidea.com</a></p>
                <p>Business: <a href="mailto:business@elevateidea.com">business@elevateidea.com</a></p>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📱</span>
              <h3 className={styles.infoTitle}>Phone</h3>
              <div className={styles.infoDetails}>
                <p>Main: <a href="tel:+919876543210">+91 98765 43210</a></p>
                <p>WhatsApp: <a href="https://wa.me/919876543210">+91 98765 43210</a></p>
                <p>Hours: Mon-Fri 9 AM - 7 PM IST</p>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📍</span>
              <h3 className={styles.infoTitle}>Office</h3>
              <div className={styles.infoDetails}>
                <p>ElevateIdea Technologies Pvt Ltd</p>
                <p>Bangalore, Karnataka</p>
                <p>India - 560001</p>
                <p><a href="https://linkedin.com/company/elevateidea">LinkedIn</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* Response Time Expectations */}
        <section className={styles.responseTime}>
          <h2 className={styles.responseTitle}>Response Time Commitment</h2>
          <p className={styles.responseSubtitle}>
            We understand your time is valuable. Here's what you can expect when you reach out to us.
          </p>
          
          <div className={styles.responseItems}>
            <div className={styles.responseItem}>
              <div className={styles.responseTitle}>24 hrs</div>
              <div className={styles.responseLabel}>Demo Requests</div>
            </div>
            <div className={styles.responseItem}>
              <div className={styles.responseTitle}>48 hrs</div>
              <div className={styles.responseLabel}>Consulting Inquiries</div>
            </div>
            <div className={styles.responseItem}>
              <div className={styles.responseTitle}>4 hrs</div>
              <div className={styles.responseLabel}>Support Issues</div>
            </div>
            <div className={styles.responseItem}>
              <div className={styles.responseTitle}>1 week</div>
              <div className={styles.responseLabel}>Partnership Discussions</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;