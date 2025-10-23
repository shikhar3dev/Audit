const natural = require('natural');

class KeywordAnalyzer {
  analyzeKeywords(content, title, description, h1, h2List, targetKeyword) {
    const analysis = {
      keyword: targetKeyword,
      density: 0,
      positions: {
        inTitle: false,
        inDescription: false,
        inH1: false,
        inH2: [],
        inFirst100Words: false,
        inLast100Words: false
      },
      frequency: 0,
      variations: [],
      score: 0
    };

    if (!content || !targetKeyword) {
      return analysis;
    }

    // Tokenize content
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(content.toLowerCase());
    const titleWords = tokenizer.tokenize((title || '').toLowerCase());
    const descWords = tokenizer.tokenize((description || '').toLowerCase());
    const h1Words = tokenizer.tokenize((h1 || '').toLowerCase());

    // Get H2 words
    const h2Words = h2List.map(h2 => tokenizer.tokenize(h2.toLowerCase())).flat();

    // Count keyword occurrences
    const keywordLower = targetKeyword.toLowerCase();
    const keywordTokens = tokenizer.tokenize(keywordLower);

    // Exact match frequency
    let exactMatches = 0;
    for (let i = 0; i <= words.length - keywordTokens.length; i++) {
      let match = true;
      for (let j = 0; j < keywordTokens.length; j++) {
        if (words[i + j] !== keywordTokens[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        exactMatches++;
        i += keywordTokens.length - 1; // Skip ahead
      }
    }

    analysis.frequency = exactMatches;
    analysis.density = (exactMatches / words.length) * 100;

    // Check positions
    analysis.positions.inTitle = this.containsKeyword(titleWords, keywordTokens);
    analysis.positions.inDescription = this.containsKeyword(descWords, keywordTokens);
    analysis.positions.inH1 = this.containsKeyword(h1Words, keywordTokens);

    // Check H2 tags
    analysis.positions.inH2 = h2List.map((h2, index) => ({
      index,
      text: h2,
      containsKeyword: this.containsKeyword(tokenizer.tokenize(h2.toLowerCase()), keywordTokens)
    })).filter(h => h.containsKeyword);

    // Check first and last 100 words
    const first100 = words.slice(0, 100);
    const last100 = words.slice(-100);
    analysis.positions.inFirst100Words = this.containsKeyword(first100, keywordTokens);
    analysis.positions.inLast100Words = this.containsKeyword(last100, keywordTokens);

    // Find variations (singular/plural, stemmed)
    const stemmer = natural.PorterStemmer;
    const keywordStem = stemmer.stem(keywordLower);
    const variations = new Set();

    words.forEach((word, index) => {
      const stemmed = stemmer.stem(word);
      if (stemmed === keywordStem && word !== keywordLower) {
        variations.add(word);
      }

      // Check for partial matches
      if (word.includes(keywordLower) || keywordLower.includes(word)) {
        if (word !== keywordLower && word.length > 3) {
          variations.add(word);
        }
      }
    });

    analysis.variations = Array.from(variations);

    // Calculate score
    analysis.score = this.calculateKeywordScore(analysis);

    return analysis;
  }

  containsKeyword(textWords, keywordTokens) {
    if (!textWords || !keywordTokens) return false;

    for (let i = 0; i <= textWords.length - keywordTokens.length; i++) {
      let match = true;
      for (let j = 0; j < keywordTokens.length; j++) {
        if (textWords[i + j] !== keywordTokens[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    return false;
  }

  calculateKeywordScore(analysis) {
    let score = 0;

    // Position scoring
    if (analysis.positions.inTitle) score += 30;
    if (analysis.positions.inDescription) score += 20;
    if (analysis.positions.inH1) score += 25;
    if (analysis.positions.inFirst100Words) score += 15;
    if (analysis.positions.inLast100Words) score += 10;

    // H2 scoring
    if (analysis.positions.inH2.length > 0) score += 15;

    // Density scoring (ideal range: 0.5% - 2.5%)
    const density = analysis.density;
    if (density >= 0.5 && density <= 2.5) {
      score += 25;
    } else if (density > 0 && density < 0.5) {
      score += 10;
    } else if (density > 2.5 && density < 5) {
      score += 15;
    }

    // Frequency bonus (but not too much)
    const freq = analysis.frequency;
    if (freq > 0) score += Math.min(freq * 5, 20);

    // Variations bonus
    if (analysis.variations.length > 0) score += 10;

    return Math.min(score, 100);
  }

  generateKeywordRecommendations(analysis, competitorAnalysis) {
    const recommendations = [];

    if (!analysis.positions.inTitle) {
      recommendations.push({
        type: 'critical',
        title: 'Add keyword to title',
        description: 'The target keyword should appear in the meta title for better rankings'
      });
    }

    if (!analysis.positions.inH1) {
      recommendations.push({
        type: 'critical',
        title: 'Add keyword to H1',
        description: 'The target keyword should appear in the main heading'
      });
    }

    if (analysis.density < 0.5) {
      recommendations.push({
        type: 'content',
        title: 'Increase keyword density',
        description: `Current density is ${analysis.density.toFixed(2)}%. Consider adding the keyword more naturally.`
      });
    }

    if (analysis.density > 3) {
      recommendations.push({
        type: 'warning',
        title: 'Reduce keyword stuffing',
        description: `Current density is ${analysis.density.toFixed(2)}%. This may be seen as keyword stuffing.`
      });
    }

    return recommendations;
  }
}

module.exports = new KeywordAnalyzer();
