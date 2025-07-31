const { Record } = require('../../models');

class LighthouseRunner {
  async runForDomain(domain) {
    try {
      console.log(`[LighthouseRunner] Starting mock audit for domain: ${domain.url}`);
      
      const websites = await domain.getWebsites({
        where: { status: 'monitoring' }
      });

      console.log(`[LighthouseRunner] Found ${websites.length} monitoring websites for domain ${domain.url}`);

      for (const website of websites) {
        await this.runForWebsite(website);
      }

      console.log(`[LighthouseRunner] Completed mock audit for domain: ${domain.url}`);
    } catch (error) {
      console.error(`[LighthouseRunner] Error running audit for domain ${domain.url}:`, error);
      throw error;
    }
  }

  async runForWebsite(website) {
    try {
      console.log(`[LighthouseRunner] Running mock audit for website: ${website.path}`);
      
      const mockData = this.generateMockLighthouseData();
      
      await Record.create({
        website_id: website.id,
        is_mobile: false,
        ...mockData
      });

      console.log(`[LighthouseRunner] Created mock record for website: ${website.path}`);
    } catch (error) {
      console.error(`[LighthouseRunner] Error running audit for website ${website.path}:`, error);
      throw error;
    }
  }

  generateMockLighthouseData() {
    const baseScores = {
      performance: Math.floor(Math.random() * 40) + 60,
      accessibility: Math.floor(Math.random() * 20) + 80,
      best_practices: Math.floor(Math.random() * 15) + 85,
      seo: Math.floor(Math.random() * 25) + 75,
      pwa: Math.floor(Math.random() * 30) + 70
    };

    return {
      performance_score: baseScores.performance,
      accessibility_score: baseScores.accessibility,
      best_practices_score: baseScores.best_practices,
      seo_score: baseScores.seo,
      pwa_score: baseScores.pwa,
      first_contentful_paint: (Math.random() * 2 + 0.5).toFixed(2),
      largest_contentful_paint: (Math.random() * 3 + 1.5).toFixed(2),
      total_blocking_time: Math.floor(Math.random() * 300) + 50,
      cumulative_layout_shift: (Math.random() * 0.2).toFixed(3),
      speed_index: (Math.random() * 2 + 1.5).toFixed(2)
    };
  }
}

module.exports = LighthouseRunner; 