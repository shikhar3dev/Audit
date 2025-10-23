const natural = require('natural');

class ContentGapAnalyzer {
  async analyzeContentGaps(myContent, competitorContent, keyword) {
    try {
      console.log(`Analyzing content gaps between pages for keyword "${keyword}"`);

      // Tokenize content
      const tokenizer = new natural.WordTokenizer();
      const myTokens = tokenizer.tokenize(myContent.toLowerCase());
      const competitorTokens = tokenizer.tokenize(competitorContent.toLowerCase());

      // Remove stop words
      const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
      const myFilteredTokens = myTokens.filter(token => !stopWords.has(token) && token.length > 2);
      const competitorFilteredTokens = competitorTokens.filter(token => !stopWords.has(token) && token.length > 2);

      // Find unique terms
      const myUniqueTerms = new Set(myFilteredTokens.filter(token => !competitorFilteredTokens.includes(token)));
      const competitorUniqueTerms = new Set(competitorFilteredTokens.filter(token => !myFilteredTokens.includes(token)));

      // Find common terms
      const commonTerms = new Set(myFilteredTokens.filter(token => competitorFilteredTokens.includes(token)));

      const analysis = {
        myUniqueTerms: Array.from(myUniqueTerms).slice(0, 20), // Top 20 unique terms
        competitorUniqueTerms: Array.from(competitorUniqueTerms).slice(0, 20),
        commonTerms: Array.from(commonTerms).slice(0, 20),
        contentDepth: {
          myPage: {
            wordCount: myTokens.length,
            uniqueTerms: myUniqueTerms.size,
            termDiversity: myUniqueTerms.size / myTokens.length
          },
          competitorPage: {
            wordCount: competitorTokens.length,
            uniqueTerms: competitorUniqueTerms.size,
            termDiversity: competitorUniqueTerms.size / competitorTokens.length
          }
        },
        topicalCoverage: {
          myCoverage: commonTerms.size / (commonTerms.size + competitorUniqueTerms.size),
          competitorCoverage: commonTerms.size / (commonTerms.size + myUniqueTerms.size)
        }
      };

      return analysis;
    } catch (error) {
      console.error('Content gap analysis failed:', error);
      return {
        myUniqueTerms: [],
        competitorUniqueTerms: [],
        commonTerms: [],
        contentDepth: {
          myPage: { wordCount: 0, uniqueTerms: 0, termDiversity: 0 },
          competitorPage: { wordCount: 0, uniqueTerms: 0, termDiversity: 0 }
        },
        topicalCoverage: { myCoverage: 0, competitorCoverage: 0 }
      };
    }
  }

  generateContentRecommendations(contentGaps, keyword) {
    const recommendations = [];

    if (contentGaps.competitorUniqueTerms.length > contentGaps.myUniqueTerms.length) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        title: 'Expand Content Coverage',
        description: `Competitor covers ${contentGaps.competitorUniqueTerms.length} unique topics you don't. Consider adding these topics.`,
        actions: [
          `Add sections about: ${contentGaps.competitorUniqueTerms.slice(0, 5).join(', ')}`,
          'Research related subtopics and questions',
          'Create comprehensive guides instead of overview pages',
          'Add supporting data, statistics, and examples'
        ]
      });
    }

    if (contentGaps.contentDepth.myPage.termDiversity < contentGaps.contentDepth.competitorPage.termDiversity * 0.8) {
      recommendations.push({
        type: 'depth',
        priority: 'medium',
        title: 'Improve Content Depth',
        description: `Your content has lower topical diversity (${(contentGaps.contentDepth.myPage.termDiversity * 100).toFixed(1)}%) vs competitor (${(contentGaps.contentDepth.competitorPage.termDiversity * 100).toFixed(1)}%).`,
        actions: [
          'Add more detailed explanations',
          'Include multiple perspectives on the topic',
          'Add supporting examples and case studies',
          'Cover related concepts and terminology'
        ]
      });
    }

    if (contentGaps.topicalCoverage.myCoverage < 0.7) {
      recommendations.push({
        type: 'coverage',
        priority: 'medium',
        title: 'Increase Topical Coverage',
        description: `You're only covering ${(contentGaps.topicalCoverage.myCoverage * 100).toFixed(1)}% of topics your competitor covers.`,
        actions: [
          'Research what topics competitors are covering',
          'Use tools like AnswerThePublic for related questions',
          'Add sections for related keywords',
          'Create topic clusters around main keywords'
        ]
      });
    }

    return recommendations;
  }
}

module.exports = new ContentGapAnalyzer();
