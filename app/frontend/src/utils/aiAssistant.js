/**
 * AI Assistant utility for processing natural language inputs
 * This simulates NLP processing in the frontend
 */

// Metal types supported by the system
const SUPPORTED_METALS = ['gold', 'silver', 'platinum', 'palladium'];

// Purity options for each metal
const PURITY_OPTIONS = {
  gold: ['999 Fine', '995 Fine', '916 (22K)'],
  silver: ['999 Fine', '925 Sterling'],
  platinum: ['999 Fine'],
  palladium: ['999 Fine']
};

// Units for quantity
const UNITS = ['grams', 'ounces', 'kilos', 'kg', 'g', 'oz'];

// Alert conditions
const ALERT_CONDITIONS = ['above', 'below', 'reaches', 'drops to', 'exceeds'];

/**
 * Process natural language input for booking creation
 * @param {string} input - User's natural language input
 * @returns {Object} Extracted booking data or error
 */
export const processBookingInput = (input) => {
  try {
    const inputLower = input.toLowerCase();
    
    // Extract metal type
    const metal = SUPPORTED_METALS.find(metal => inputLower.includes(metal));
    if (!metal) {
      return {
        success: false,
        error: `Could not identify metal type. Please specify one of: ${SUPPORTED_METALS.join(', ')}`
      };
    }
    
    // Extract quantity
    const quantityMatch = inputLower.match(/(\d+(\.\d+)?)\s*(grams|gram|g|ounces|ounce|oz|kilos|kilo|kg)/);
    if (!quantityMatch) {
      return {
        success: false,
        error: 'Could not identify quantity. Please specify an amount with units (e.g., 100 grams, 10 ounces).'
      };
    }
    
    const quantity = parseFloat(quantityMatch[1]);
    let unit = quantityMatch[3];
    
    // Normalize unit
    if (['gram', 'g'].includes(unit)) unit = 'grams';
    if (['ounce', 'oz'].includes(unit)) unit = 'ounces';
    if (['kilo', 'kg'].includes(unit)) unit = 'kilos';
    
    // Extract purity
    let purity = PURITY_OPTIONS[metal][0]; // Default to first option
    for (const option of PURITY_OPTIONS[metal]) {
      if (inputLower.includes(option.toLowerCase())) {
        purity = option;
        break;
      }
    }
    
    // Extract delivery date
    const dateMatch = inputLower.match(/(today|tomorrow|next week|next month|in \d+ days?|on \d{1,2}\/\d{1,2}\/\d{2,4}|on \d{1,2}-\d{1,2}-\d{2,4})/);
    let deliveryDate = '';
    
    if (dateMatch) {
      const dateText = dateMatch[1];
      const today = new Date();
      
      if (dateText === 'today') {
        deliveryDate = today.toISOString().split('T')[0];
      } else if (dateText === 'tomorrow') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        deliveryDate = tomorrow.toISOString().split('T')[0];
      } else if (dateText === 'next week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        deliveryDate = nextWeek.toISOString().split('T')[0];
      } else if (dateText === 'next month') {
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        deliveryDate = nextMonth.toISOString().split('T')[0];
      } else if (dateText.startsWith('in ')) {
        const daysMatch = dateText.match(/in (\d+) days?/);
        if (daysMatch) {
          const days = parseInt(daysMatch[1]);
          const futureDate = new Date(today);
          futureDate.setDate(futureDate.getDate() + days);
          deliveryDate = futureDate.toISOString().split('T')[0];
        }
      } else if (dateText.startsWith('on ')) {
        const dateStr = dateText.substring(3);
        // Try to parse the date
        const parsedDate = new Date(dateStr.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/, '$3-$1-$2'));
        if (!isNaN(parsedDate.getTime())) {
          deliveryDate = parsedDate.toISOString().split('T')[0];
        }
      }
    }
    
    // Extract notes
    let notes = '';
    if (inputLower.includes('notes:')) {
      notes = input.substring(input.indexOf('notes:') + 6).trim();
    } else if (inputLower.includes('note:')) {
      notes = input.substring(input.indexOf('note:') + 5).trim();
    }
    
    // Return the extracted booking data
    return {
      success: true,
      data: {
        metal,
        purity,
        quantity,
        unit,
        deliveryDate,
        notes
      }
    };
  } catch (error) {
    console.error('Error processing booking input:', error);
    return {
      success: false,
      error: 'Could not process your request. Please try again with more specific details.'
    };
  }
};

/**
 * Process natural language input for alert creation
 * @param {string} input - User's natural language input
 * @returns {Object} Extracted alert data or error
 */
export const processAlertInput = (input) => {
  try {
    const inputLower = input.toLowerCase();
    
    // Extract metal type
    const metal = SUPPORTED_METALS.find(metal => inputLower.includes(metal));
    if (!metal) {
      return {
        success: false,
        error: `Could not identify metal type. Please specify one of: ${SUPPORTED_METALS.join(', ')}`
      };
    }
    
    // Extract condition
    let condition = 'above'; // Default
    for (const cond of ALERT_CONDITIONS) {
      if (inputLower.includes(cond)) {
        // Normalize condition
        if (['reaches', 'exceeds'].includes(cond)) condition = 'above';
        else if (['drops to'].includes(cond)) condition = 'below';
        else condition = cond;
        break;
      }
    }
    
    // Extract value
    const valueMatch = inputLower.match(/(\d+(\.\d+)?)\s*(inr|rupees|rs|usd|dollars|\$|€|eur|euro)/);
    if (!valueMatch) {
      return {
        success: false,
        error: 'Could not identify price value. Please specify an amount with currency (e.g., 2000 INR, $1200).'
      };
    }
    
    const value = parseFloat(valueMatch[1]);
    let currency = valueMatch[3];
    
    // Normalize currency
    if (['rupees', 'rs', 'inr'].includes(currency)) currency = 'INR';
    if (['dollars', '$', 'usd'].includes(currency)) currency = 'USD';
    if (['euro', '€', 'eur'].includes(currency)) currency = 'EUR';
    
    // Extract notification method
    let notificationMethod = 'email'; // Default
    if (inputLower.includes('sms') || inputLower.includes('text') || inputLower.includes('message')) {
      notificationMethod = 'sms';
    } else if (inputLower.includes('push') || inputLower.includes('notification')) {
      notificationMethod = 'push';
    } else if (inputLower.includes('all methods') || inputLower.includes('all notifications')) {
      notificationMethod = 'all';
    }
    
    // Return the extracted alert data
    return {
      success: true,
      data: {
        metal,
        condition,
        value,
        currency,
        notificationMethod
      }
    };
  } catch (error) {
    console.error('Error processing alert input:', error);
    return {
      success: false,
      error: 'Could not process your request. Please try again with more specific details.'
    };
  }
};

/**
 * Generate a response based on the processed data
 * @param {Object} processedData - Data extracted from user input
 * @param {string} type - Type of data (booking or alert)
 * @returns {string} Human-readable response
 */
export const generateResponse = (processedData, type) => {
  if (!processedData.success) {
    return `I couldn't process your request: ${processedData.error}`;
  }
  
  const data = processedData.data;
  
  if (type === 'booking') {
    return `I've created a booking for ${data.quantity} ${data.unit} of ${data.metal} (${data.purity})${data.deliveryDate ? ` with delivery on ${data.deliveryDate}` : ''}${data.notes ? `. Notes: ${data.notes}` : ''}.`;
  } else if (type === 'alert') {
    return `I've set up an alert for when ${data.metal} price goes ${data.condition} ${data.value} ${data.currency}. You'll be notified via ${data.notificationMethod}.`;
  }
  
  return 'Your request has been processed successfully.';
};

/**
 * Generate suggestions for natural language input
 * @param {string} type - Type of suggestion (booking or alert)
 * @returns {Array} List of example phrases
 */
export const getSuggestions = (type) => {
  if (type === 'booking') {
    return [
      "I want to book 100 grams of gold for delivery next week",
      "Book 10 ounces of silver 999 Fine with delivery on 15/12/2023",
      "I need 5 kilos of gold 916 (22K) delivered next month",
      "Book 50 grams of platinum for tomorrow. Notes: Need certificate of authenticity"
    ];
  } else if (type === 'alert') {
    return [
      "Alert me when gold goes above 2000 USD",
      "Notify me when silver drops below 30 USD per ounce",
      "Create an alert for platinum when it reaches 1500 USD via SMS",
      "Alert me when palladium exceeds 2500 USD using all notification methods"
    ];
  }
  
  return [];
};
