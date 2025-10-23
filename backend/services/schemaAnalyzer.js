const cheerio = require('cheerio');

class SchemaAnalyzer {
  analyzeSchema(html) {
    const $ = cheerio.load(html);
    const schemas = [];

    // Extract JSON-LD
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const jsonContent = $(elem).html();
        if (jsonContent) {
          const parsed = JSON.parse(jsonContent);
          this.extractSchemasFromJSON(parsed, schemas);
        }
      } catch (error) {
        console.warn('Failed to parse JSON-LD:', error.message);
      }
    });

    // Extract Microdata
    this.extractMicrodata($, schemas);

    // Extract RDFa (simplified)
    this.extractRDFa($, schemas);

    return schemas;
  }

  extractSchemasFromJSON(data, schemas, context = '') {
    if (Array.isArray(data)) {
      data.forEach(item => this.extractSchemasFromJSON(item, schemas, context));
      return;
    }

    if (typeof data === 'object' && data !== null) {
      // Check if this is a schema object
      if (data['@type'] || data['@context']) {
        const schemaType = data['@type'] || 'Unknown';
        const schemaContext = data['@context'] || context;

        schemas.push({
          type: schemaType,
          context: schemaContext,
          properties: Object.keys(data).filter(key => !key.startsWith('@')),
          data: data
        });
      }

      // Recursively process nested objects
      Object.values(data).forEach(value => {
        if (typeof value === 'object' && value !== null) {
          this.extractSchemasFromJSON(value, schemas, data['@context'] || context);
        }
      }
    }
  }

  extractMicrodata($, schemas) {
    $('[itemtype]').each((i, elem) => {
      const $item = $(elem);
      const itemType = $item.attr('itemtype');
      const itemProps = {};

      $item.find('[itemprop]').each((j, prop) => {
        const $prop = $(prop);
        const propName = $prop.attr('itemprop');
        const propValue = $prop.attr('content') || $prop.text().trim();

        if (propName && propValue) {
          itemProps[propName] = propValue;
        }
      });

      if (itemType && Object.keys(itemProps).length > 0) {
        schemas.push({
          type: this.extractTypeFromUrl(itemType),
          context: 'Microdata',
          properties: Object.keys(itemProps),
          data: itemProps
        });
      }
    });
  }

  extractRDFa($, schemas) {
    // Simplified RDFa extraction
    // In a production system, you'd want more comprehensive RDFa parsing
    $('[typeof]').each((i, elem) => {
      const $item = $(elem);
      const itemType = $item.attr('typeof');

      if (itemType) {
        schemas.push({
          type: this.extractTypeFromUrl(itemType),
          context: 'RDFa',
          properties: [],
          data: {}
        });
      }
    });
  }

  extractTypeFromUrl(url) {
    // Extract the last part of schema.org URLs or return the full URL
    if (url.includes('schema.org/')) {
      return url.split('schema.org/')[1] || 'Unknown';
    }
    return url.split('/').pop() || 'Unknown';
  }

  getSchemaScore(schemas) {
    let score = 0;

    if (schemas.length === 0) return score;

    // Base score for having schema
    score += 30;

    // Score based on schema types
    const valuableSchemas = ['Article', 'FAQPage', 'HowTo', 'Product', 'Organization', 'LocalBusiness', 'Event', 'Recipe'];
    const hasValuableSchema = schemas.some(schema => valuableSchemas.includes(schema.type));
    if (hasValuableSchema) score += 40;

    // Score based on quantity
    if (schemas.length > 1) score += 20;
    if (schemas.length > 3) score += 10;

    return Math.min(score, 100);
  }
}

module.exports = new SchemaAnalyzer();
