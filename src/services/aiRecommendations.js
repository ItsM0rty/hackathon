// AI Recommendations Service - Integrates with DeepSeek and ChatGPT APIs
// Provides intelligent activity suggestions based on user preferences

class AIRecommendationService {
  constructor() {
    this.deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY || '';
    this.deepseekEndpoint = 'https://api.deepseek.com/v1/chat/completions';
    this.openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
    console.log('AI Recommendation Service initialized (DeepSeek primary, ChatGPT fallback)');
    if (this.rapidApiKey) {
      console.log('RapidAPI key detected for price lookups');
    }
  }

  // Generate structured prompt for activity recommendations
  generateActivityPrompt(userPreferences, availableActivities) {
    const activitiesList = availableActivities.map(activity => ({
      name: activity.name,
      description: activity.description,
      location: activity.location || 'Unknown',
      city: activity.city || 'kathmandu',
      price: this.rapidApiKey ? 'Price via RapidAPI' : (activity.price || 'N/A')
    }));
    return {
      system: `You are an expert travel consultant specializing in Nepal tourism. Your task is to analyze user preferences and recommend specific activities from a provided list.
CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON in the exact format specified below
2. Select activities that match the user's preferences
3. Provide detailed reasoning for each recommendation
4. Recommend 3-8 activities total (mix of both cities if applicable)
5. Consider user's personality, interests, and stated preferences
Available activities: ${JSON.stringify(activitiesList, null, 2)}
Return format (MUST be valid JSON):
{
  "recommendations": [
    {
      "activityName": "exact name from available activities",
      "city": "kathmandu or pokhara",
      "matchScore": 95,
      "reasoning": "specific explanation why this matches user preferences"
    }
  ],
  "summary": "brief explanation of overall recommendation strategy"
}`,
      user: `User preferences: "${userPreferences}"
Based on these preferences, recommend activities from the provided list that would best match this user's interests and travel style. Focus on their specific mentions like adventure level, social preferences, cultural interests, relaxation needs, etc.
Remember to return ONLY the JSON response in the specified format.`
    };
  }

  // Call DeepSeek API
  async callDeepSeekAPI(prompt) {
    try {
      console.log('Calling DeepSeek API...');
      const response = await fetch(this.deepseekEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: prompt.system },
            { role: 'user', content: prompt.user }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      });
      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      console.log('DeepSeek response received:', content);
      return this.parseAIResponse(content);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  // Call ChatGPT API
  async callChatGPTAPI(prompt) {
    try {
      console.log('Calling ChatGPT API...');
      const response = await fetch(this.openaiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: prompt.system },
            { role: 'user', content: prompt.user }
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      });
      if (!response.ok) {
        throw new Error(`ChatGPT API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      console.log('ChatGPT response received:', content);
      return this.parseAIResponse(content);
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw error;
    }
  }

  // Parse and validate AI response
  parseAIResponse(content) {
    try {
      const parsed = JSON.parse(content);
      
      // Validate response structure
      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        throw new Error('Invalid response format: missing recommendations array');
      }

      // Validate each recommendation
      const validRecommendations = parsed.recommendations.filter(rec => 
        rec.activityName && 
        rec.city && 
        typeof rec.matchScore === 'number' && 
        rec.reasoning
      );

      return {
        recommendations: validRecommendations,
        summary: parsed.summary || 'AI-generated activity recommendations'
      };
      
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid JSON response from AI service');
    }
  }

  // Main method to get recommendations with fallback
  async getRecommendations(userPreferences, availableActivities, preferredAPI = 'deepseek') {
    if (!userPreferences || !availableActivities || availableActivities.length === 0) {
      throw new Error('Invalid input: preferences and activities are required');
    }
    console.log(`Getting AI recommendations for: "${userPreferences}"`);
    console.log(`Available activities: ${availableActivities.length}`);
    const prompt = this.generateActivityPrompt(userPreferences, availableActivities);
    try {
      if (preferredAPI === 'deepseek' && this.deepseekApiKey) {
        return await this.callDeepSeekAPI(prompt);
      } else if (preferredAPI === 'chatgpt' && this.openaiApiKey) {
        return await this.callChatGPTAPI(prompt);
      }
      if (this.deepseekApiKey) {
        console.log('Falling back to DeepSeek API');
        return await this.callDeepSeekAPI(prompt);
      } else if (this.openaiApiKey) {
        console.log('Falling back to ChatGPT API');
        return await this.callChatGPTAPI(prompt);
      }
      throw new Error('No API keys configured');
    } catch (error) {
      console.error('AI recommendation failed:', error);
      return this.getFallbackRecommendations(userPreferences, availableActivities);
    }
  }

  // Fallback recommendation system (keyword-based)
  getFallbackRecommendations(userPreferences, availableActivities) {
    console.log('Using fallback keyword-based recommendations');
    const preferences = userPreferences.toLowerCase();
    const keywords = {
      adventure: ['adventure', 'exciting', 'thrill', 'extreme', 'adrenaline', 'flying', 'paragliding', 'bungee'],
      relaxing: ['quiet', 'peaceful', 'relax', 'calm', 'tranquil', 'spa', 'massage'],
      cultural: ['culture', 'traditional', 'heritage', 'temple', 'history', 'spiritual', 'meditation'],
      nature: ['nature', 'outdoor', 'hiking', 'trekking', 'lake', 'mountain', 'scenic'],
      social: ['social', 'group', 'people', 'party', 'nightlife', 'shopping', 'market']
    };
    const recommendations = [];
    availableActivities.forEach(activity => {
      let score = 0;
      let matchedCategories = [];
      const activityText = `${activity.name} ${activity.description}`.toLowerCase();
      for (const [category, categoryKeywords] of Object.entries(keywords)) {
        const categoryMatches = categoryKeywords.filter(keyword => 
          preferences.includes(keyword) && activityText.includes(keyword)
        );
        if (categoryMatches.length > 0) {
          score += categoryMatches.length * 20;
          matchedCategories.push(category);
        }
      }
      const generalWords = preferences.split(' ').filter(word => word.length > 3);
      generalWords.forEach(word => {
        if (activityText.includes(word)) {
          score += 10;
        }
      });
      if (score > 0) {
        recommendations.push({
          activityName: activity.name,
          city: activity.city || 'kathmandu',
          matchScore: Math.min(score, 100),
          reasoning: `Matches your preferences for ${matchedCategories.join(', ')} activities`
        });
      }
    });
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    return {
      recommendations: recommendations.slice(0, 6),
      summary: 'Keyword-based recommendations (AI service unavailable)'
    };
  }

  // Test API connectivity
  async testAPIs() {
    const results = {
      deepseek: false,
      chatgpt: false
    };

    if (this.deepseekApiKey) {
      try {
        const testPrompt = {
          system: 'Return only: {"test": "success"}',
          user: 'Test'
        };
        await this.callDeepSeekAPI(testPrompt);
        results.deepseek = true;
        console.log('DeepSeek API connected');
      } catch (error) {
        console.log('DeepSeek API failed:', error.message);
      }
    }

    if (this.openaiApiKey) {
      try {
        const testPrompt = {
          system: 'Return only: {"test": "success"}',
          user: 'Test'
        };
        await this.callChatGPTAPI(testPrompt);
        results.chatgpt = true;
        console.log('ChatGPT API connected');
      } catch (error) {
        console.log('ChatGPT API failed:', error.message);
      }
    }

    return results;
  }
}

// Export singleton instance
const aiRecommendationService = new AIRecommendationService();
export default aiRecommendationService;