/**
 * Unicode Utilities for ElevateBusiness 360° Platform
 * Handles safe JSON serialization with multilingual support (Gujarati, Hindi, English)
 * Prevents Unicode surrogate pair issues in API calls and data storage
 */

// Safe JSON.stringify that handles Unicode surrogate pairs
export function safeJsonStringify(data: unknown): string {
  try {
    // First attempt normal JSON.stringify
    return JSON.stringify(data);
  } catch (error) {
    // If it fails, sanitize the data and try again
    const sanitizedData = sanitizeUnicodeForJson(data);
    return JSON.stringify(sanitizedData);
  }
}

// Safe JSON.parse that handles potential encoding issues
export function safeJsonParse(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // Debug statement removed
    // Return empty object as fallback
    return {};
  }
}

// Recursively sanitize an object for safe JSON serialization
function sanitizeUnicodeForJson(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return sanitizeUnicodeString(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => sanitizeUnicodeForJson(item));
  } else if (obj !== null && typeof obj === 'object') {
    const sanitizedObj: Record<string, unknown> = {};
    const objRecord = obj as Record<string, unknown>;
    for (const key in objRecord) {
      if (objRecord.hasOwnProperty(key)) {
        sanitizedObj[key] = sanitizeUnicodeForJson(objRecord[key]);
      }
    }
    return sanitizedObj;
  }
  return obj;
}

// Sanitize a single string to handle Unicode issues
function sanitizeUnicodeString(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  // Replace problematic Unicode characters that cause JSON issues
  return str
    // Fix high/low surrogate pair issues
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '\uFFFD') // High surrogate without low surrogate
    .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '\uFFFD') // Low surrogate without high surrogate
    // Remove any remaining problematic characters
    .replace(/[\uFFFE\uFFFF]/g, '') // Non-characters
    // Ensure proper encoding for common Gujarati/Hindi characters
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000]/g, ''); // Remove null characters
}

// Safe localStorage operations with Unicode support
export function safeLocalStorageSetItem(key: string, value: unknown): boolean {
  try {
    const jsonString = safeJsonStringify(value);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    // Debug statement removed
    
    // Fallback: try to save a simplified version
    try {
      const simplifiedValue = simplifyObjectForStorage(value);
      const jsonString = safeJsonStringify(simplifiedValue);
      localStorage.setItem(key, jsonString);
      // Debug statement removed
      return true;
    } catch (fallbackError) {
      // Debug statement removed
      return false;
    }
  }
}

export function safeLocalStorageGetItem(key: string, defaultValue: unknown = null): unknown {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return safeJsonParse(item);
  } catch (error) {
    // Debug statement removed
    return defaultValue;
  }
}

// Simplify an object by removing potentially problematic Unicode content
function simplifyObjectForStorage(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Convert complex Unicode to safe ASCII alternatives for storage
    return obj
      .replace(/[^\u0020-\u007F]/g, (match) => {
        // Keep common punctuation and numbers, replace other non-ASCII
        return /[0-9.,()-[\]{}]/.test(match) ? match : '?';
      });
  } else if (Array.isArray(obj)) {
    return obj.map(item => simplifyObjectForStorage(item));
  } else if (obj !== null && typeof obj === 'object') {
    const simplifiedObj: Record<string, unknown> = {};
    const objRecord = obj as Record<string, unknown>;
    for (const key in objRecord) {
      if (objRecord.hasOwnProperty(key)) {
        // Only keep essential fields for simplified storage
        if (['name', 'company', 'email', 'phone', 'businessType', 'location', 'role'].includes(key)) {
          simplifiedObj[key] = simplifyObjectForStorage(objRecord[key]);
        }
      }
    }
    return simplifiedObj;
  }
  return obj;
}

// Validate if a string contains potentially problematic Unicode
export function hasProblematicUnicode(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  // Check for unpaired surrogates
  const highSurrogatePattern = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])/;
  const lowSurrogatePattern = /(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
  
  return highSurrogatePattern.test(str) || lowSurrogatePattern.test(str);
}

// Development helper: log Unicode issues
export function debugUnicodeIssues(obj: unknown, path: string = 'root'): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (typeof obj === 'string') {
    if (hasProblematicUnicode(obj)) {
      // Debug statement removed
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      debugUnicodeIssues(item, `${path}[${index}]`);
    });
  } else if (obj !== null && typeof obj === 'object') {
    const objRecord = obj as Record<string, unknown>;
    for (const key in objRecord) {
      if (objRecord.hasOwnProperty(key)) {
        debugUnicodeIssues(objRecord[key], `${path}.${key}`);
      }
    }
  }
}