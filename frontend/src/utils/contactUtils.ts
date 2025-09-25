/**
 * Centralized contact utilities for consistent user experience across the application
 */

// Central Google Form URL for all consultation requests
const CONSULTATION_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeyiENxr2NrgyYDh6iOQT_BL057RqFje_bXUyePQQtegA_HCA/viewform?usp=header';

/**
 * Opens the consultation/contact form in a new tab
 * Used for: Schedule Consultation, Startup Assessment, Beta Signup, MVP Journey, etc.
 */
export function openConsultationForm(): void {
  try {
    window.open(CONSULTATION_FORM_URL, '_blank');
  } catch (error) {
    // Debug statement removed
    // Fallback: try to navigate in same window
    window.location.href = CONSULTATION_FORM_URL;
  }
}

/**
 * Opens the beta signup form (currently same as consultation form)
 * Separate function for future flexibility if different form needed
 */
export function openBetaSignup(): void {
  openConsultationForm();
}

/**
 * Opens the startup assessment form (currently same as consultation form)
 * Separate function for future flexibility if different form needed
 */
export function openStartupAssessment(): void {
  openConsultationForm();
}

/**
 * Opens the MVP journey consultation form (currently same as consultation form)
 * Separate function for future flexibility if different form needed
 */
export function openMVPJourneyForm(): void {
  openConsultationForm();
}