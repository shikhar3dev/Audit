// Temporarily disabled to test basic functionality
// const { analyzePage } = require('../services/pageAnalyzer');
const serpAnalyzer = require('../services/serpAnalyzer');
const backlinkAnalyzer = require('../services/backlinkAnalyzer');
const contentGapAnalyzer = require('../services/contentGapAnalyzer');

const comparePages = async (req, res) => {
  try {
    const { myUrl, competitorUrl, keyword } = req.body;

    if (!myUrl || !competitorUrl || !keyword) {
      return res.status(400).json({
        error: 'Missing required parameters: myUrl, competitorUrl, and keyword are required'
      });
    }

    // Validate URLs
    try {
      new URL(myUrl);
      new URL(competitorUrl);
    } catch (urlError) {
      return res.status(400).json({
        error: 'Invalid URL format. Please include http:// or https://'
      });
    }

    // Generate comprehensive mock data including new analysis features
    const myPageData = generateComprehensiveMockData(myUrl, keyword, 'myPage');
    const competitorPageData = generateComprehensiveMockData(competitorUrl, keyword, 'competitorPage');

    // Analyze SERP features
    const [mySERP, competitorSERP] = await Promise.all([
      serpAnalyzer.analyzeSERPFeatures(myUrl, keyword),
      serpAnalyzer.analyzeSERPFeatures(competitorUrl, keyword)
    ]);

    // Analyze backlinks
    const [myBacklinks, competitorBacklinks] = await Promise.all([
      backlinkAnalyzer.analyzeBacklinks(myUrl),
      backlinkAnalyzer.analyzeBacklinks(competitorUrl)
    ]);

    // Analyze content gaps
    const contentGaps = await contentGapAnalyzer.analyzeContentGaps(
      myPageData.content.text,
      competitorPageData.content.text,
      keyword
    );

    // Generate enhanced recommendations
    const serpRecommendations = serpAnalyzer.generateSERPrecommendations(mySERP, competitorSERP, keyword);
    const backlinkRecommendations = backlinkAnalyzer.generateBacklinkRecommendations(myBacklinks, competitorBacklinks);
    const contentRecommendations = contentGapAnalyzer.generateContentRecommendations(contentGaps, keyword);

    const allRecommendations = {
      quickWins: myPageData.scores.onPage < competitorPageData.scores.onPage ? [{
        category: 'On-Page SEO',
        priority: 'High',
        impact: 'High',
        title: 'Improve On-Page SEO Score',
        description: `Your on-page score (${myPageData.scores.onPage}) is lower than competitor (${competitorPageData.scores.onPage})`,
        action: 'Optimize meta tags, headings, and content structure'
      }] : [],
      technical: [],
      content: contentRecommendations,
      schema: [],
      backlinks: backlinkRecommendations,
      serp: serpRecommendations
    };

    // Generate comparison and recommendations
    const comparison = generateComparison(myPageData, competitorPageData, keyword);
    const recommendations = generateRecommendations(myPageData, competitorPageData, keyword);

    res.json({
      success: true,
      data: {
        myPage: myPageData,
        competitorPage: competitorPageData,
        serpFeatures: {
          myPage: mySERP,
          competitorPage: competitorSERP
        },
        backlinks: {
          myPage: myBacklinks,
          competitorPage: competitorBacklinks
        },
        contentGaps,
        comparison,
        recommendations: allRecommendations
      }
    });

  } catch (error) {
    console.error('Error in comparePages:', error);
    res.status(500).json({
      error: 'Failed to analyze pages',
      message: error.message
    });
  }
};

const generateComparison = (myPage, competitorPage, keyword) => {
  const comparison = {
    meta: {
      keyword,
      analysisDate: new Date().toISOString()
    },
    scores: {
      myPage: calculateOverallScore(myPage),
      competitorPage: calculateOverallScore(competitorPage)
    },
    categories: {}
  };

  // Compare each category
  const categories = ['onPage', 'content', 'technical', 'schema', 'keywordOptimization'];

  categories.forEach(category => {
    comparison.categories[category] = {
      myScore: myPage.scores[category] || 0,
      competitorScore: competitorPage.scores[category] || 0,
      winner: determineWinner(myPage.scores[category] || 0, competitorPage.scores[category] || 0),
      gap: (competitorPage.scores[category] || 0) - (myPage.scores[category] || 0)
    };
  });

  return comparison;
};

const calculateOverallScore = (pageData) => {
  const weights = {
    onPage: 0.25,
    content: 0.25,
    technical: 0.20,
    schema: 0.15,
    keywordOptimization: 0.15
  };

  let totalScore = 0;
  let totalWeight = 0;

  Object.keys(weights).forEach(category => {
    if (pageData.scores[category] !== undefined) {
      totalScore += pageData.scores[category] * weights[category];
      totalWeight += weights[category];
    }
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
};

const determineWinner = (myScore, competitorScore) => {
  if (myScore > competitorScore) return 'myPage';
  if (competitorScore > myScore) return 'competitorPage';
  return 'tie';
};

const generateRecommendations = (myPage, competitorPage, keyword) => {
  const recommendations = {
    quickWins: [],
    technical: [],
    content: [],
    schema: [],
    backlinks: []
  };

  // Quick wins
  if (!myPage.meta.title.includes(keyword)) {
    recommendations.quickWins.push({
      category: 'On-Page SEO',
      priority: 'High',
      impact: 'High',
      difficulty: 'Low',
      title: 'Add target keyword to meta title',
      description: `Your meta title "${myPage.meta.title}" doesn't contain the keyword "${keyword}". Consider updating to include it naturally.`,
      action: 'Update meta title to include the target keyword'
    });
  }

  if (!myPage.headings.h1.includes(keyword)) {
    recommendations.quickWins.push({
      category: 'On-Page SEO',
      priority: 'High',
      impact: 'High',
      difficulty: 'Low',
      title: 'Add target keyword to H1 tag',
      description: `Your H1 "${myPage.headings.h1}" doesn't contain the keyword "${keyword}".`,
      action: 'Update H1 to include the target keyword'
    });
  }

  // Content recommendations
  if (myPage.content.wordCount < competitorPage.content.wordCount * 0.7) {
    recommendations.content.push({
      category: 'Content',
      priority: 'Medium',
      impact: 'High',
      difficulty: 'Medium',
      title: 'Expand content length',
      description: `Your content is ${myPage.content.wordCount} words vs competitor's ${competitorPage.content.wordCount}. Consider expanding to match or exceed.`,
      action: `Add ${Math.max(0, competitorPage.content.wordCount * 0.8 - myPage.content.wordCount)} more words of relevant content`
    });
  }

  // Schema recommendations
  const mySchemas = new Set(myPage.schema.map(s => s.type));
  const competitorSchemas = new Set(competitorPage.schema.map(s => s.type));

  competitorSchemas.forEach(schemaType => {
    if (!mySchemas.has(schemaType)) {
      recommendations.schema.push({
        category: 'Schema Markup',
        priority: 'Medium',
        impact: 'Medium',
        difficulty: 'Medium',
        title: `Add ${schemaType} schema markup`,
        description: `Competitor has ${schemaType} schema which you don't. This helps search engines understand your content better.`,
        action: `Add ${schemaType} structured data to your page`
      });
    }
  });

  return recommendations;
};

const generateComprehensiveMockData = (url, keyword, type) => {
  const isCompetitor = type === 'competitorPage';
  const scoreMultiplier = isCompetitor ? 1.2 : 0.8;

  return {
    url,
    meta: {
      title: `${isCompetitor ? 'Best' : 'Good'} ${keyword} Solutions | ${isCompetitor ? 'Competitor' : 'My'} Site`,
      description: `${isCompetitor ? 'Leading' : 'Good'} ${keyword} services. ${isCompetitor ? 'Top-rated' : 'Quality'} solutions for your business needs.`,
      canonical: url,
      robots: "index, follow",
      viewport: "width=device-width, initial-scale=1.0"
    },
    headings: {
      h1: `${keyword} - ${isCompetitor ? 'Professional' : 'Basic'} Guide`,
      h2: [`What is ${keyword}`, `Benefits of ${keyword}`, `How to ${keyword}`, "FAQ", "Pricing"]
    },
    content: {
      text: `${keyword} is crucial for modern businesses. ${isCompetitor ? 'Our advanced' : 'Our'} ${keyword} platform provides comprehensive solutions. With years of experience in ${keyword}, we deliver results. Contact us for ${keyword} services today.`,
      wordCount: Math.round(85 * scoreMultiplier),
      images: [
        { src: "/hero-image.jpg", alt: `${keyword} illustration` },
        { src: "/features.png", alt: "Features overview" }
      ]
    },
    links: {
      internal: [url + "/features", url + "/pricing", url + "/about", url + "/contact"],
      external: ["https://google.com", "https://industry-site.com"]
    },
    schema: [
      { type: "Article", context: "JSON-LD", properties: ["headline", "author"], data: {} },
      { type: isCompetitor ? "FAQPage" : "Organization", context: "JSON-LD", properties: ["mainEntity"], data: {} }
    ],
    technical: {
      score: Math.round(85 * scoreMultiplier),
      performance: { score: Math.round(90 * scoreMultiplier) },
      accessibility: { score: 85 },
      bestPractices: { score: 90 },
      seo: { score: Math.round(80 * scoreMultiplier) },
      mobileFriendly: true,
      loadTime: Math.round(1500 / scoreMultiplier)
    },
    keywordAnalysis: {
      keyword,
      density: 2.5 * scoreMultiplier,
      positions: {
        inTitle: true,
        inDescription: true,
        inH1: true,
        inH2: [{ index: 0, text: `What is ${keyword}`, containsKeyword: true }],
        inFirst100Words: true,
        inLast100Words: true
      },
      frequency: Math.round(18 * scoreMultiplier),
      variations: [`${keyword}s`, `${keyword}ing`],
      score: Math.round(80 * scoreMultiplier)
    },
    scores: {
      onPage: Math.round(90 * scoreMultiplier),
      content: Math.round(85 * scoreMultiplier),
      technical: Math.round(85 * scoreMultiplier),
      schema: Math.round(90 * scoreMultiplier),
      keywordOptimization: Math.round(80 * scoreMultiplier)
    }
  };
};

module.exports = {
  comparePages
};
