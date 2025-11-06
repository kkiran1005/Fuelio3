# Fuelio - Fuel Efficiency Tracker PWA

A Progressive Web App (PWA) built with React for tracking and calculating fuel efficiency of vehicles. Features OCR technology to automatically read fuel bills and odometer readings from images.

## Features

- 📷 **Image Capture & OCR**: Capture fuel bills and odometer readings using your device camera
- 📊 **Automatic Calculations**: Calculate fuel efficiency (km/L) automatically
- 💾 **Offline Storage**: All data stored locally using IndexedDB
- 📱 **PWA**: Install on your device and use offline
- 📈 **Statistics Dashboard**: View average efficiency, total fuel consumption, and more
- 🎨 **Modern UI**: Clean, responsive design with smooth animations

## Technology Stack

- **React** - Frontend framework
- **Tesseract.js** - OCR (Optical Character Recognition) for reading text from images
- **IndexedDB (idb)** - Local database for storing fuel records
- **Service Workers** - PWA functionality and offline support

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

3. Build for production:
```bash
npm run build
```

## Usage

### Adding a Record

1. **Capture Odometer**: Take a photo of your odometer or enter the reading manually
2. **Capture Fuel Bill**: Take a photo of your fuel receipt or enter the details manually
3. **Review & Save**: Verify the extracted data and save the record

### View Statistics

The dashboard shows:
- Total records
- Total fuel consumed
- Total distance traveled
- Average fuel efficiency
- Best and worst efficiency records

### View History

Browse all your fuel records with detailed information including:
- Date and time
- Odometer reading
- Fuel amount
- Price
- Calculated efficiency

## PWA Features

- Install the app on your device (mobile or desktop)
- Works offline
- Fast loading with caching
- Native app-like experience

## OCR Capabilities

The app can extract:
- **From Fuel Bills**: Fuel amount (liters), total price
- **From Odometer**: Kilometer reading

The OCR supports various formats and will attempt to intelligently parse the text.

## Data Storage

All data is stored locally on your device using IndexedDB. No data is sent to any server, ensuring complete privacy.

## Browser Support

Works on all modern browsers that support:
- Service Workers
- IndexedDB
- Camera API
- ES6+

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js    # Main dashboard
│   ├── AddRecord.js    # Add fuel record form
│   ├── RecordsList.js  # List of records
│   └── ImageCapture.js # Camera and OCR component
├── utils/              # Utility functions
│   ├── database.js     # IndexedDB operations
│   └── ocr.js          # OCR processing
├── App.js              # Main app component
└── index.js            # Entry point
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
