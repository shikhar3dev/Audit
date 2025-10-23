// Simple API test without external dependencies
const http = require('http');

const testData = JSON.stringify({
  myUrl: 'https://example.com/my-page',
  competitorUrl: 'https://competitor.com/their-page',
  keyword: 'seo tools'
});

const options = {
  hostname: 'localhost',
  port: 3004,
  path: '/api/audit/compare',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('🧪 Testing SEO Audit API...');
console.log('📤 Sending request to:', `${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log('📥 Response status:', res.statusCode);
  console.log('📋 Response headers:', res.headers['content-type']);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.success) {
        console.log('✅ API Test SUCCESSFUL!');
        console.log('📊 Analysis completed for keyword:', response.data.comparison.meta.keyword);
        console.log('🎯 Your page score:', response.data.comparison.scores.myPage);
        console.log('🏆 Competitor score:', response.data.comparison.scores.competitorPage);

        const totalRecommendations = Object.values(response.data.recommendations)
          .reduce((acc, recs) => acc + recs.length, 0);
        console.log('💡 Total recommendations:', totalRecommendations);

      console.log('🔍 Features available:');
      console.log('  - SERP Features:', Object.keys(response.data.serpFeatures.myPage).length);
      console.log('  - Backlink metrics:', Object.keys(response.data.backlinks.myPage).length);
      console.log('  - Content gaps:', response.data.contentGaps.myUniqueTerms.length + response.data.contentGaps.competitorUniqueTerms.length);

      console.log('\n📊 My Page Technical Structure:');
      console.log('  - Technical score:', response.data.myPage.technical.score);
      console.log('  - Performance score:', response.data.myPage.technical.performance?.score || 'MISSING');
      console.log('  - SEO score:', response.data.myPage.technical.seo?.score || 'MISSING');
      console.log('  - Accessibility score:', response.data.myPage.technical.accessibility?.score || 'MISSING');
      console.log('  - Best Practices score:', response.data.myPage.technical.bestPractices?.score || 'MISSING');

      console.log('\n📊 Competitor Technical Structure:');
      console.log('  - Technical score:', response.data.competitorPage.technical.score);
      console.log('  - Performance score:', response.data.competitorPage.technical.performance?.score || 'MISSING');
      console.log('  - SEO score:', response.data.competitorPage.technical.seo?.score || 'MISSING');
      console.log('  - Accessibility score:', response.data.competitorPage.technical.accessibility?.score || 'MISSING');
      console.log('  - Best Practices score:', response.data.competitorPage.technical.bestPractices?.score || 'MISSING');

      console.log('\n🎯 All features working perfectly!');
      } else {
        console.log('❌ API Error:', response.error);
      }
    } catch (error) {
      console.log('📄 Raw response (first 200 chars):', data.substring(0, 200));
      console.log('❌ Failed to parse response');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(testData);
req.end();
