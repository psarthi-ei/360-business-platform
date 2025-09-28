// Phonetic Matcher for Roman Transliterations
// Handles spelling variations in Hindi/Gujarati Roman script
// Designed for voice-first MSME textile business commands

/**
 * Phonetic similarity matcher for Roman transliterations of Hindi/Gujarati words
 * Handles common variations like: dhundo/dhundho, karo/kro, dekho/dekh
 */
export class PhoneticMatcher {
  
  /**
   * Calculate phonetic similarity between two Roman transliterations
   * Returns a score between 0 (no match) and 1 (perfect match)
   */
  static calculateSimilarity(word1: string, word2: string): number {
    if (!word1 || !word2) return 0;
    
    // Exact match gets perfect score
    if (word1.toLowerCase() === word2.toLowerCase()) return 1.0;
    
    // Normalize both words for comparison
    const normalized1 = this.normalizeRomanWord(word1.toLowerCase());
    const normalized2 = this.normalizeRomanWord(word2.toLowerCase());
    
    // Check if normalized forms match
    if (normalized1 === normalized2) return 0.95;
    
    // Calculate phonetic distance
    const phoneticScore = this.calculatePhoneticDistance(normalized1, normalized2);
    
    // Calculate edit distance (Levenshtein) for additional similarity
    const editScore = this.calculateEditDistanceScore(normalized1, normalized2);
    
    // Combine scores with phonetic similarity weighted higher
    const combinedScore = (phoneticScore * 0.7) + (editScore * 0.3);
    
    return Math.min(combinedScore, 1.0);
  }

  /**
   * Normalize Roman transliterations to handle common variations
   * Examples: dhundho → dhundo, kro → karo, dekh → dekho
   */
  private static normalizeRomanWord(word: string): string {
    let normalized = word.toLowerCase().trim();
    
    // Handle vowel endings variations (o/ho/e)
    normalized = normalized.replace(/ho$/, 'o');     // dhundho → dhundo
    normalized = normalized.replace(/he$/, 'o');     // dhundhe → dhundo
    
    // Handle missing vowels in shortened forms
    normalized = normalized.replace(/^kr$/, 'karo');      // kr → karo
    normalized = normalized.replace(/^kro$/, 'karo');     // kro → karo
    normalized = normalized.replace(/^dekh$/, 'dekho');   // dekh → dekho
    normalized = normalized.replace(/^dikh$/, 'dikho');   // dikh → dikho
    normalized = normalized.replace(/^ban$/, 'bano');     // ban → bano
    normalized = normalized.replace(/^bat$/, 'bato');     // bat → bato (for batao)
    
    // Handle double consonants
    normalized = normalized.replace(/([a-z])\1+/g, '$1'); // dhunndo → dhundo
    
    // Handle ph/f variations
    normalized = normalized.replace(/ph/g, 'f');          // phir → fir
    
    // Handle aspirated consonants (common in Roman transliterations)
    normalized = normalized.replace(/bh/g, 'b');          // bhago → bago
    normalized = normalized.replace(/gh/g, 'g');          // gharo → garo
    normalized = normalized.replace(/th/g, 't');          // thik → tik
    normalized = normalized.replace(/dh/g, 'd');          // dhundo → dundo
    normalized = normalized.replace(/kh/g, 'k');          // kholo → kolo
    
    return normalized;
  }

  /**
   * Calculate phonetic distance based on sound similarity
   */
  private static calculatePhoneticDistance(word1: string, word2: string): number {
    if (word1 === word2) return 1.0;
    
    // Convert to phonetic representations
    const phonetic1 = this.toPhoneticPattern(word1);
    const phonetic2 = this.toPhoneticPattern(word2);
    
    if (phonetic1 === phonetic2) return 0.9;
    
    // Calculate similarity based on phonetic patterns
    const commonPatterns = this.getCommonPhoneticPatterns(phonetic1, phonetic2);
    const maxLength = Math.max(phonetic1.length, phonetic2.length);
    
    return maxLength > 0 ? commonPatterns / maxLength : 0;
  }

  /**
   * Convert word to phonetic pattern for better matching
   */
  private static toPhoneticPattern(word: string): string {
    let pattern = word;
    
    // Group similar sounding letters
    pattern = pattern.replace(/[aeiou]/g, 'V');     // All vowels → V
    pattern = pattern.replace(/[bp]/g, 'P');        // b/p sounds
    pattern = pattern.replace(/[dt]/g, 'T');        // d/t sounds  
    pattern = pattern.replace(/[kg]/g, 'K');        // k/g sounds
    pattern = pattern.replace(/[szj]/g, 'S');       // s/z/j sounds
    pattern = pattern.replace(/[lr]/g, 'R');        // l/r sounds (common confusion)
    pattern = pattern.replace(/[mn]/g, 'N');        // m/n sounds
    
    return pattern;
  }

  /**
   * Count common phonetic patterns between two phonetic representations
   */
  private static getCommonPhoneticPatterns(pattern1: string, pattern2: string): number {
    let commonCount = 0;
    const minLength = Math.min(pattern1.length, pattern2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (pattern1[i] === pattern2[i]) {
        commonCount++;
      }
    }
    
    return commonCount;
  }

  /**
   * Calculate edit distance score (1 - normalized Levenshtein distance)
   */
  private static calculateEditDistanceScore(word1: string, word2: string): number {
    const distance = this.levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    
    if (maxLength === 0) return 1;
    
    const normalizedDistance = distance / maxLength;
    return Math.max(0, 1 - normalizedDistance);
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    
    // Create matrix
    const matrix: number[][] = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return matrix[len1][len2];
  }

  /**
   * Find the best matching word from a list of candidates
   * Returns the match with highest similarity score above threshold
   */
  static findBestMatch(input: string, candidates: string[], threshold: number = 0.7): { word: string; score: number } | null {
    let bestMatch: { word: string; score: number } | null = null;
    
    for (const candidate of candidates) {
      const score = this.calculateSimilarity(input, candidate);
      
      if (score >= threshold) {
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { word: candidate, score };
        }
      }
    }
    
    return bestMatch;
  }

  /**
   * Check if input word matches any word in the list using context-aware fuzzy matching
   * Adjusts threshold based on word length and similarity patterns to reduce false positives
   */
  static fuzzyContains(input: string, wordList: string[], threshold: number = 0.7): boolean {
    // eslint-disable-next-line no-console
    console.log(`🔗 [DEBUG] fuzzyContains: input="${input}", wordList=[${wordList.join(', ')}], threshold=${threshold}`);
    
    for (const word of wordList) {
      const similarity = this.calculateSimilarity(input, word);
      
      // Calculate context-aware threshold
      const adjustedThreshold = this.calculateContextAwareThreshold(input, word, threshold);
      
      // eslint-disable-next-line no-console
      console.log(`🔗 [DEBUG] Similarity: "${input}" vs "${word}" = ${similarity.toFixed(3)} (adjusted threshold: ${adjustedThreshold.toFixed(3)})`);
      
      if (similarity >= adjustedThreshold) {
        // eslint-disable-next-line no-console
        console.log(`🔗 [DEBUG] ✅ FUZZY MATCH: "${input}" vs "${word}" (${similarity.toFixed(3)} >= ${adjustedThreshold.toFixed(3)})`);
        return true;
      }
    }
    
    // eslint-disable-next-line no-console
    console.log(`🔗 [DEBUG] ❌ No fuzzy matches for "${input}" above threshold`);
    return false;
  }

  /**
   * Calculate context-aware threshold to prevent false positives
   * Higher threshold for short words, lower for longer Roman transliterations
   */
  private static calculateContextAwareThreshold(input: string, candidate: string, baseThreshold: number): number {
    const inputLength = input.length;
    const candidateLength = candidate.length;
    const avgLength = (inputLength + candidateLength) / 2;
    
    // Higher threshold for very short words to prevent false matches like "surat" vs "sure"
    if (avgLength <= 4) {
      return Math.min(baseThreshold + 0.15, 0.95); // Increase by 0.15 for short words
    }
    
    // Moderate threshold for medium words
    if (avgLength <= 6) {
      return Math.min(baseThreshold + 0.05, 0.9); // Slight increase for medium words  
    }
    
    // Lower threshold for longer words (Roman transliterations often longer)
    return baseThreshold; // Use base threshold for longer words
  }

  /**
   * Get all words from list that match input with similarity above threshold
   */
  static fuzzyFilter(input: string, wordList: string[], threshold: number = 0.7): Array<{ word: string; score: number }> {
    return wordList
      .map(word => ({ word, score: this.calculateSimilarity(input, word) }))
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score); // Sort by score descending
  }
}