/**
 * Find best response from MongoDB knowledge base
 * @param {string} userMessage - User's message
 * @param {Object} mongodb - MongoDB connection
 * @returns {Promise<string|null>} - Best matching response or null
 */
export const findBestResponse = async (userMessage, mongodb) => {
  try {
    const messageLower = userMessage.toLowerCase().trim();

    // 1. Check quick responses (exact triggers)
    const quickResponse = await mongodb
      .collection('quick_responses')
      .findOne({ 
        trigger: { $regex: messageLower, $options: 'i' },
        active: true 
      });

    if (quickResponse) {
      return quickResponse.response;
    }

    // 2. Search knowledge base (text search)
    const knowledgeResults = await mongodb
      .collection('knowledge_base')
      .find(
        { 
          $text: { $search: messageLower },
          active: true 
        },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(1)
      .toArray();

    if (knowledgeResults.length > 0 && knowledgeResults[0].score > 1) {
      return knowledgeResults[0].answer;
    }

    // 3. Check for common keywords
    const keywords = extractKeywords(messageLower);
    if (keywords.length > 0) {
      const keywordResult = await mongodb
        .collection('knowledge_base')
        .findOne({
          keywords: { $in: keywords },
          active: true
        });

      if (keywordResult) {
        return keywordResult.answer;
      }
    }

    // No match found
    return null;

  } catch (error) {
    console.error('Knowledge base search error:', error);
    return null;
  }
};

/**
 * Extract keywords from message
 * @param {string} message - User message
 * @returns {string[]} - Array of keywords
 */
const extractKeywords = (message) => {
  const stopWords = ['what', 'is', 'are', 'the', 'how', 'can', 'do', 'you', 'i', 'we', 'about', 'tell', 'me'];
  const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  return words;
};

/**
 * Get suggestions based on message
 * @param {string} userMessage - User's message
 * @param {Object} mongodb - MongoDB connection
 * @returns {Promise<string[]>} - Array of suggestions
 */
export const getSuggestions = async (userMessage, mongodb) => {
  try {
    const messageLower = userMessage.toLowerCase().trim();
    
    const suggestions = await mongodb
      .collection('knowledge_base')
      .find(
        { 
          $text: { $search: messageLower },
          active: true 
        },
        { projection: { question: 1 } }
      )
      .limit(3)
      .toArray();

    return suggestions.map(s => s.question);
  } catch (error) {
    console.error('Suggestions error:', error);
    return [];
  }
};
