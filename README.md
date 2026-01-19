# FarmTrace - Blockchain Agricultural Supply Chain Platform

## 🌾 Overview
FarmTrace is a comprehensive blockchain-based supply chain transparency platform for agricultural products. It features multilingual support (Hindi/English) and voice-enabled interfaces for illiterate users.

## ✨ Key Features

### 1. **Multilingual Support**
- **English & Hindi** interface
- Automatic font switching for Hindi (Devanagari script)
- Real-time language toggle

### 2. **Voice Features for Illiterate Users**
- **Voice Input (Speech-to-Text)**: Click microphone icons to fill forms by speaking
- **Voice Output (Text-to-Speech)**: Click on dashboards/buttons to hear instructions
- **Voice Guide**: Provides audio guidance in selected language

### 3. **7 Stakeholder Dashboards**
1. **👨‍🌾 Farmer**: Upload produce images for AI pricing, browse transporters, create batches
2. **🚚 Transporter**: Browse farmers needing transport, pickup and deliver produce
3. **👔 Middleman**: Offer fixed prices to farmers with voice input
4. **🏛️ Government Agent**: Record auctions with voice, track mandi shulk (18% tax)
5. **📦 Wholesaler/Retailer**: Buy auctioned batches, set markup margins
6. **✅ Certification Body**: Verify NPOP organic certification
7. **👤 Consumer**: Scan QR codes, trace full supply chain, view health scores

### 4. **Blockchain Integration**
- Smart contracts (Solidity) on Ethereum
- Immutable record-keeping
- Transparent transactions

### 5. **AI Image-Based Price Analysis** 🆕
- **Upload produce images** for instant AI analysis
- **Quality Score**: AI evaluates visual quality (75-95%)
- **Freshness Score**: Determines freshness level (80-95%)
- **Price Estimation**: AI suggests market price based on image analysis
- **Voice Feedback**: Hear price recommendations in Hindi/English

### 6. **Farmer-Transporter Matching** 🆕
- **For Farmers**: Browse available transporters in your area
  - View ratings, vehicle types, and contact information
  - Direct phone call integration
- **For Transporters**: Find farmers needing transport services
  - Reduce unemployment by connecting local transporters with farmers
  - View farmer locations, crops, and contact details

### 7. **Health Risk Scoring**
- 0-100 health score for each batch
- Based on certification, freshness, pesticides

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Python (for serving frontend)

### Step 1: Install Dependencies
```bash
cd "C:\Users\Ridhi\Desktop\FarmTrace Project"
npm install
```

### Step 2: Configure Environment
Edit `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/farmtrace
PORT=5000
```

### Step 3: Start Backend Server
```bash
node server.js
```
Server will run on: `http://localhost:5000`

### Step 4: Start Frontend (Multilingual Version)
Open a new terminal:
```bash
cd frontend/public
python -m http.server 8000
```

### Step 5: Access Application
Open browser and navigate to:
```
http://localhost:8000/index_multilingual.html
```

## 🎤 Using Voice Features

### Voice Input (Speech-to-Text)
1. Click the **🎤 microphone button** next to any input field
2. Grant browser microphone permissions
3. Speak clearly in **Hindi** or **English** (based on selected language)
4. The text will automatically fill in the field

### Voice Output (Text-to-Speech)
1. Click the **🔊 Voice Guide** button at the top
2. Click any dashboard button to hear audio instructions
3. Language automatically matches your selected interface language

## 📱 Supported Browsers
- ✅ Google Chrome (Recommended)
- ✅ Microsoft Edge
- ✅ Firefox (Limited speech support)
- ⚠️ Safari (No speech recognition support)

## 🔧 Project Structure
```
FarmTrace Project/
├── contracts/
│   └── contracts/
│       └── FarmTrace.sol          # Smart contract
├── frontend/
│   └── public/
│       ├── index_multilingual.html # Multilingual UI
│       ├── app_multilingual.js     # Multilingual app logic
│       ├── index.html              # Original UI
│       └── app.js                  # Original app logic
├── server.js                       # Backend API
├── priceAnalysis.js               # AI price module
├── .env                           # Environment config
└── README.md                      # This file
```

## 🌐 API Endpoints

### User Registration
```
POST /api/register
Body: { walletAddress, userID, role, name, location }
```

### Create Batch
```
POST /api/batch/create
Body: { farmerID, produceType, quantity, farmLocation, pricePerKg, farmingMethod, pesticidesDeclared }
```

### Get Batch
```
GET /api/batch/:id
```

### Record Auction
```
POST /api/batch/auction
Body: { batchID, auctionPrice }
```

### Certify Organic
```
POST /api/batch/certify
Body: { batchID, isNPOPCertified }
```

## 📊 Health Risk Score Calculation
- **Organic Certification**: +30 points
- **Freshness**: +25 points
- **Handler Verification**: +15 points
- **Pesticide-Free**: +15 points
- **Full Chain Visibility**: +5 points

## 🎯 Use Cases

### For Farmers
- **Upload produce images** to get instant AI price estimates 🆕
- **Browse transporters** in your area with ratings and contact info 🆕
- Create produce batches with QR codes
- Get AI-powered price suggestions based on image quality
- Choose between middleman fixed price or auction
- Track batch status in real-time
- Use voice input to fill forms (for illiterate farmers)

### For Consumers
- Scan QR code to view full supply chain
- See health risk score (0-100)
- Check organic certification
- View pesticide usage information
- Get personalized health recommendations

### For Transporters 🆕
- **Browse farmers** needing transport services in your area
- View farmer contact details, locations, and crops
- Reduce unemployment by connecting with local farmers
- Build rating and reputation through successful deliveries

### For Government
- Track all auction transactions
- Calculate mandi shulk (18% tax)
- Immutable blockchain records
- Revenue dashboard

## 🔐 Security Features
- Blockchain immutability
- Wallet-based authentication
- Encrypted transactions
- KYC verification support

## 🌍 Language Support Details

### Hindi Translation Coverage
- All UI elements
- All dashboard titles
- All form labels
- All button text
- All alerts and confirmations
- All voice prompts

### Voice Language Detection
- Automatically switches speech recognition to:
  - **Hindi (hi-IN)** when Hindi is selected
  - **English (en-US)** when English is selected

## 🎨 Accessibility Features
- Large, readable fonts
- High contrast colors
- Voice-enabled navigation
- Microphone icons on all input fields
- Audio feedback on actions

## 📝 License
MIT License

## 👥 Contributors
- Built for SIH 2025 Hackathon
- Focused on empowering illiterate farmers

## 🆘 Support
For issues or questions, please refer to the project documentation.

---

**Note**: For production deployment, configure MongoDB Atlas, deploy smart contracts to Ethereum mainnet/testnet, and enable HTTPS.
