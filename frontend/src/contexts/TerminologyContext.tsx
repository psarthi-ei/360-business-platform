import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  TerminologyConfig, 
  SupportedRegion, 
  getTerminologyByRegion
} from '../types/terminology';

interface TerminologyContextType {
  terminology: TerminologyConfig;
  region: SupportedRegion;
  setRegion: (region: SupportedRegion) => void;
}

const TerminologyContext = createContext<TerminologyContextType | undefined>(undefined);

interface TerminologyProviderProps {
  children: React.ReactNode;
  initialRegion?: SupportedRegion;
}

export const TerminologyProvider: React.FC<TerminologyProviderProps> = ({ 
  children, 
  initialRegion = 'surat-processing' // MVP default to Surat processing terminology
}) => {
  const [region, setRegionState] = useState<SupportedRegion>(initialRegion);
  
  const terminology = getTerminologyByRegion(region);
  
  const setRegion = useCallback((newRegion: SupportedRegion) => {
    setRegionState(newRegion);
  }, []);

  const value: TerminologyContextType = {
    terminology,
    region,
    setRegion
  };

  return (
    <TerminologyContext.Provider value={value}>
      {children}
    </TerminologyContext.Provider>
  );
};

// Custom hook to use terminology
export const useTerminology = (): TerminologyContextType => {
  const context = useContext(TerminologyContext);
  
  if (context === undefined) {
    throw new Error('useTerminology must be used within a TerminologyProvider');
  }
  
  return context;
};

// Helper hook for just getting terminology config (most common usage)
export const useTerminologyConfig = (): TerminologyConfig => {
  const { terminology } = useTerminology();
  return terminology;
};

// Helper hook for specific terminology terms (convenience)
export const useTerminologyTerms = () => {
  const { terminology } = useTerminology();
  
  return {
    // Core entities
    customer: terminology.customer,
    customers: terminology.customers,
    
    // Business module names
    salesModule: terminology.salesModule,
    procurementModule: terminology.procurementModule,
    productionModule: terminology.productionModule,
    
    // Sales process
    lead: terminology.lead,
    leads: terminology.leads,
    quote: terminology.quote,
    quotes: terminology.quotes,
    invoice: terminology.invoice,
    invoices: terminology.invoices,
    order: terminology.order,
    orders: terminology.orders,
    
    // Production process
    workOrder: terminology.workOrder,
    workOrders: terminology.workOrders,
    productionOrder: terminology.productionOrder,
    productionOrders: terminology.productionOrders,
    
    // Procurement process
    goodsReceiptNote: terminology.goodsReceiptNote,
    inventory: terminology.inventory,
    
    // Actions
    generateQuote: terminology.generateQuote,
    generateInvoice: terminology.generateInvoice,
    addCustomer: terminology.addCustomer
  };
};