import { createWorker } from 'tesseract.js';

export const extractTextFromImage = async (imageFile) => {
  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
};

export const extractOdometerReading = (text) => {
  // Match patterns like: 12345 km, 12,345, 12.345, or standalone numbers
  const patterns = [
    /(\d{1,3}[,.]?\d{3}[,.]?\d{3})\s*(?:km|KM|Km)?/,
    /(\d{5,7})\s*(?:km|KM|Km)?/,
    /odometer[:\s]*(\d{1,3}[,.]?\d{3}[,.]?\d{3})/i,
    /odometer[:\s]*(\d{5,7})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const number = match[1].replace(/[,.\s]/g, '');
      const value = parseInt(number, 10);
      if (value > 0 && value < 10000000) {
        return value;
      }
    }
  }
  
  return null;
};

export const extractFuelAmount = (text) => {
  // Match patterns for fuel amount: 45.50 L, 45.5, etc.
  const patterns = [
    /(\d{1,3}\.?\d{0,2})\s*(?:L|l|liters?|litres?)/i,
    /(?:quantity|qty|amount|volume)[:\s]*(\d{1,3}\.?\d{0,2})/i,
    /total\s*(?:liters?|litres?)[:\s]*(\d{1,3}\.?\d{0,2})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 0 && value < 1000) {
        return value;
      }
    }
  }
  
  return null;
};

export const extractPrice = (text) => {
  // Match patterns for price: $45.50, 45.50, Rs. 1234.50, etc.
  const patterns = [
    /(?:total|amount|price|cost)[:\s]*(?:\$|Rs\.?|₹)?\s*(\d{1,6}\.?\d{0,2})/i,
    /(?:\$|Rs\.?|₹)\s*(\d{1,6}\.?\d{0,2})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value > 0) {
        return value;
      }
    }
  }
  
  return null;
};

export const processFuelBillImage = async (imageFile) => {
  const text = await extractTextFromImage(imageFile);
  
  return {
    rawText: text,
    fuelAmount: extractFuelAmount(text),
    price: extractPrice(text),
  };
};

export const processOdometerImage = async (imageFile) => {
  const text = await extractTextFromImage(imageFile);
  
  return {
    rawText: text,
    odometer: extractOdometerReading(text),
  };
};
