// Multilingual Dashboard Manager with Voice Features
class FarmTraceApp {
  constructor() {
    this.currentUser = null;
    this.batches = [];
    this.blockchainTransactions = []; // Store all blockchain transactions
    this.API_URL = 'http://localhost:5000/api';
    this.currentLang = 'en'; // Default language
    this.recognition = null; // Speech recognition
    this.synthesis = window.speechSynthesis; // Text-to-speech
    this.isListening = false;
    this.qrScanner = null; // QR code scanner instance
    this.init();
  }

  async init() {
    // Initialize Web Speech API
    this.initSpeechRecognition();
    // Load sample data
    this.loadSampleData();
    this.renderDashboard();
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  // Text-to-Speech function
  speak(text, lang = null) {
    const language = lang || this.currentLang;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    this.synthesis.speak(utterance);
  }

  // Speech-to-Text function
  startVoiceInput(inputId, callback) {
    if (!this.recognition) {
      alert(this.t('voice_not_supported'));
      return;
    }

    this.recognition.lang = this.currentLang === 'hi' ? 'hi-IN' : 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      const micBtn = document.getElementById(`mic-${inputId}`);
      if (micBtn) micBtn.style.color = '#e74c3c';
      this.speak(this.t('listening'), this.currentLang);
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById(inputId);
      if (input) {
        input.value = transcript;
        if (callback) callback(transcript);
      }
      this.speak(this.t('voice_received') + ': ' + transcript, this.currentLang);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      const micBtn = document.getElementById(`mic-${inputId}`);
      if (micBtn) micBtn.style.color = '#3498db';
    };

    this.recognition.start();
  }

  // Translation function
  t(key) {
    const translations = {
      en: {
        app_title: '🌾 FarmTrace - Blockchain Supply Chain Transparency',
        select_dashboard: 'Select Dashboard',
        select_language: 'Select Language',
        farmer: '👨‍🌾 Farmer',
        transporter: '🚚 Transporter',
        middleman: '👔 Middleman',
        government: '🏛️ Government Agent',
        wholesaler: '📦 Wholesaler/Retailer',
        certification: '✅ Certification Body',
        consumer: '👤 Consumer',
        welcome: 'Welcome to FarmTrace',
        select_to_begin: 'Select a dashboard from the left to begin.',
        farmer_dashboard: '👨‍🌾 Farmer Dashboard',
        create_batch: 'Create New Produce Batch',
        produce_type: 'Produce Type:',
        quantity: 'Quantity (kg):',
        farming_method: 'Farming Method:',
        organic: 'Organic (NPOP Certified)',
        conventional: 'Conventional',
        pesticides: 'Pesticides Used (comma-separated):',
        create_batch_btn: 'Create Batch & Get QR',
        your_batches: 'Your Batches',
        batch_id: 'Batch ID',
        produce: 'Produce',
        status: 'Status',
        health_score: 'Health Score',
        action: 'Action',
        qr_code: 'QR Code',
        ai_price_suggest: 'AI Mandi Price Suggestions',
        today_rates: '🤖 Today\'s Market Rates:',
        tomato: 'Tomato',
        potato: 'Potato',
        onion: 'Onion',
        carrot: 'Carrot',
        voice_not_supported: 'Voice input not supported in your browser',
        listening: 'Listening...',
        voice_received: 'Voice received',
        transporter_dashboard: '🚚 Transporter Dashboard (Farmer with Vehicle)',
        available_batches: 'Available Batches to Transport',
        from: 'From',
        to: 'To',
        pickup_transport: 'Pickup & Transport',
        active_transports: 'Active Transports',
        middleman_dashboard: '👔 Middleman Dashboard',
        farm_gate_batches: 'Available Batches at Farm Gate',
        farmer_ask_price: 'Farmer Ask Price',
        offer_fixed_price: 'Offer Fixed Price',
        offer: 'Offer',
        decision_helper: '⚠️ Decision Helper',
        auction_risk: 'Auction Risk:',
        government_dashboard: '🏛️ Government Agent (Auction & Tax) Dashboard',
        auction_records: 'Auction Records (Mandi Tax Tracking)',
        base_price: 'Base Price/kg',
        auction_price: 'Auction Price/kg',
        mandi_shulk: 'Mandi Shulk (18%)',
        farmer_receives: 'Farmer Receives',
        record: 'Record ✓',
        tax_revenue: 'Tax Revenue Dashboard',
        wholesaler_dashboard: '📦 Wholesaler/Retailer Dashboard',
        auctioned_available: 'Auctioned Batches Available',
        freshness: 'Freshness',
        buy_now: 'Buy Now',
        inventory_margin: 'Your Inventory & Margin Setting',
        markup_percentage: 'Markup Percentage:',
        certification_dashboard: '✅ Certification Body (NPOP) Dashboard',
        verification_requests: 'Organic Verification Requests',
        farmer_name: 'Farmer',
        cert_status: 'Certification Status',
        verify_organic: 'Verify Organic ✓',
        mark_conventional: 'Mark Conventional',
        certified_farmers: 'Certified Farmers',
        consumer_dashboard: '👤 Consumer Dashboard - Scan QR or Search Batch',
        enter_batch_id: 'Enter Batch ID to Trace:',
        search_trace: 'Search & Trace',
        sample_batch: 'Sample Batch Details',
        health_risk_score: 'HEALTH RISK SCORE:',
        optimal_health: '✅ Optimal Health',
        supply_chain: '📊 Supply Chain Traceability',
        stage: 'Stage',
        actor: 'Actor',
        date: 'Date',
        location: 'Location',
        harvest: '🌱 Harvest',
        transport: '🚚 Transport',
        auction: '🏛️ Auction',
        retail: '📦 Retail',
        health_info: '🏥 Health Information',
        certification_label: 'Certification:',
        pesticides_label: 'Pesticides:',
        freshness_label: 'Freshness:',
        handler_verification: 'Handler Verification:',
        farmer_trust: 'Farmer Trust Score:',
        personalized_rec: '💚 Personalized Recommendation'
      },
      hi: {
        app_title: '🌾 फार्मट्रेस - ब्लॉकचेन आपूर्ति श्रृंखला पारदर्शिता',
        select_dashboard: 'डैशबोर्ड चुनें',
        select_language: 'भाषा चुनें',
        farmer: '👨‍🌾 किसान',
        transporter: '🚚 परिवहनकर्ता',
        middleman: '👔 बिचौलिया',
        government: '🏛️ सरकारी एजेंट',
        wholesaler: '📦 थोक विक्रेता/खुदरा',
        certification: '✅ प्रमाणन निकाय',
        consumer: '👤 उपभोक्ता',
        welcome: 'फार्मट्रेस में आपका स्वागत है',
        select_to_begin: 'शुरू करने के लिए बाईं ओर से डैशबोर्ड चुनें।',
        farmer_dashboard: '👨‍🌾 किसान डैशबोर्ड',
        create_batch: 'नया उपज बैच बनाएं',
        produce_type: 'उपज का प्रकार:',
        quantity: 'मात्रा (किलो):',
        farming_method: 'खेती की विधि:',
        organic: 'जैविक (एनपीओपी प्रमाणित)',
        conventional: 'पारंपरिक',
        pesticides: 'उपयोग किए गए कीटनाशक (अल्पविराम से अलग):',
        create_batch_btn: 'बैच बनाएं और क्यूआर प्राप्त करें',
        your_batches: 'आपके बैच',
        batch_id: 'बैच आईडी',
        produce: 'उपज',
        status: 'स्थिति',
        health_score: 'स्वास्थ्य स्कोर',
        action: 'कार्रवाई',
        qr_code: 'क्यूआर कोड',
        ai_price_suggest: 'एआई मंडी मूल्य सुझाव',
        today_rates: '🤖 आज की बाजार दरें:',
        tomato: 'टमाटर',
        potato: 'आलू',
        onion: 'प्याज',
        carrot: 'गाजर',
        voice_not_supported: 'आपके ब्राउज़र में वॉयस इनपुट समर्थित नहीं है',
        listening: 'सुन रहा हूं...',
        voice_received: 'आवाज प्राप्त हुई',
        transporter_dashboard: '🚚 परिवहनकर्ता डैशबोर्ड (वाहन वाला किसान)',
        available_batches: 'परिवहन के लिए उपलब्ध बैच',
        from: 'से',
        to: 'तक',
        pickup_transport: 'पिकअप और परिवहन',
        active_transports: 'सक्रिय परिवहन',
        middleman_dashboard: '👔 बिचौलिया डैशबोर्ड',
        farm_gate_batches: 'फार्म गेट पर उपलब्ध बैच',
        farmer_ask_price: 'किसान मांग मूल्य',
        offer_fixed_price: 'निश्चित मूल्य की पेशकश',
        offer: 'पेशकश',
        decision_helper: '⚠️ निर्णय सहायक',
        auction_risk: 'नीलामी जोखिम:',
        government_dashboard: '🏛️ सरकारी एजेंट (नीलामी और कर) डैशबोर्ड',
        auction_records: 'नीलामी रिकॉर्ड (मंडी कर ट्रैकिंग)',
        base_price: 'आधार मूल्य/किलो',
        auction_price: 'नीलामी मूल्य/किलो',
        mandi_shulk: 'मंडी शुल्क (18%)',
        farmer_receives: 'किसान को मिलेगा',
        record: 'रिकॉर्ड ✓',
        tax_revenue: 'कर राजस्व डैशबोर्ड',
        wholesaler_dashboard: '📦 थोक विक्रेता/खुदरा डैशबोर्ड',
        auctioned_available: 'नीलामी किए गए बैच उपलब्ध',
        freshness: 'ताजगी',
        buy_now: 'अभी खरीदें',
        inventory_margin: 'आपकी सूची और मार्जिन सेटिंग',
        markup_percentage: 'मार्कअप प्रतिशत:',
        certification_dashboard: '✅ प्रमाणन निकाय (एनपीओपी) डैशबोर्ड',
        verification_requests: 'जैविक सत्यापन अनुरोध',
        farmer_name: 'किसान',
        cert_status: 'प्रमाणन स्थिति',
        verify_organic: 'जैविक सत्यापित करें ✓',
        mark_conventional: 'पारंपरिक चिह्नित करें',
        certified_farmers: 'प्रमाणित किसान',
        consumer_dashboard: '👤 उपभोक्ता डैशबोर्ड - क्यूआर स्कैन करें या बैच खोजें',
        enter_batch_id: 'ट्रेस करने के लिए बैच आईडी दर्ज करें:',
        search_trace: 'खोजें और ट्रेस करें',
        sample_batch: 'नमूना बैच विवरण',
        health_risk_score: 'स्वास्थ्य जोखिम स्कोर:',
        optimal_health: '✅ इष्टतम स्वास्थ्य',
        supply_chain: '📊 आपूर्ति श्रृंखला ट्रेसबिलिटी',
        stage: 'चरण',
        actor: 'अभिनेता',
        date: 'तारीख',
        location: 'स्थान',
        harvest: '🌱 फसल',
        transport: '🚚 परिवहन',
        auction: '🏛️ नीलामी',
        retail: '📦 खुदरा',
        health_info: '🏥 स्वास्थ्य जानकारी',
        certification_label: 'प्रमाणन:',
        pesticides_label: 'कीटनाशक:',
        freshness_label: 'ताजगी:',
        handler_verification: 'हैंडलर सत्यापन:',
        farmer_trust: 'किसान विश्वास स्कोर:',
        personalized_rec: '💚 वैयक्तिकृत सिफारिश'
      }
    };

    return translations[this.currentLang][key] || key;
  }

  toggleLanguage() {
    // Fixed: Toggle logic was correct, but button text was reversed
    this.currentLang = this.currentLang === 'en' ? 'hi' : 'en';
    const langName = this.currentLang === 'hi' ? 'हिंदी' : 'English';
    this.speak(this.t('select_language') + ': ' + langName, this.currentLang);
    // Update body class for font support
    document.body.className = this.currentLang === 'hi' ? 'hindi' : '';
    this.renderDashboard();
  }

  loadSampleData() {
    // Sample farmers
    this.farmers = [
      { id: 'FRM-001', name: 'Ramesh Kumar', location: 'Nashik, MH', crops: ['tomato', 'onion'], phone: '+91-9876543210', needsTransport: true },
      { id: 'FRM-002', name: 'Priya Singh', location: 'Pune, MH', crops: ['potato', 'carrot'], phone: '+91-9876543211', needsTransport: false },
      { id: 'FRM-003', name: 'Suresh Patil', location: 'Nashik, MH', crops: ['tomato', 'cucumber'], phone: '+91-9876543212', needsTransport: true },
      { id: 'FRM-004', name: 'Anjali Deshmukh', location: 'Pune, MH', crops: ['spinach', 'carrot'], phone: '+91-9876543213', needsTransport: true }
    ];

    // Sample transporters
    this.transporters = [
      { id: 'TRP-001', name: 'Ganesh Transport', location: 'Nashik, MH', vehicleType: 'Truck (5 ton)', phone: '+91-9876543300', available: true, rating: 4.5 },
      { id: 'TRP-002', name: 'Mahadev Logistics', location: 'Pune, MH', vehicleType: 'Mini Truck (2 ton)', phone: '+91-9876543301', available: true, rating: 4.8 },
      { id: 'TRP-003', name: 'Vitthal Carriers', location: 'Nashik, MH', vehicleType: 'Truck (10 ton)', phone: '+91-9876543302', available: false, rating: 4.2 },
      { id: 'TRP-004', name: 'Krishna Transport', location: 'Pune, MH', vehicleType: 'Tempo (1 ton)', phone: '+91-9876543303', available: true, rating: 4.7 }
    ];

    // Sample batches
    this.batches = [
      {
        batchID: 5001,
        farmerID: 'FRM-001',
        produceType: 'tomato',
        quantity: 100,
        farmLocation: 'Nashik, MH',
        pricePerKg: 25,
        farmingMethod: 'organic',
        pesticidesDeclared: [],
        isNPOPCertified: true,
        healthRiskScore: 95,
        status: 'created',
        harvestDate: new Date().toISOString()
      },
      {
        batchID: 5002,
        farmerID: 'FRM-002',
        produceType: 'potato',
        quantity: 80,
        farmLocation: 'Pune, MH',
        pricePerKg: 20,
        farmingMethod: 'conventional',
        pesticidesDeclared: ['chlorpyrifos', 'indoxacarb'],
        isNPOPCertified: false,
        healthRiskScore: 45,
        status: 'created',
        harvestDate: new Date().toISOString()
      }
    ];
  }

  renderDashboard() {
    const root = document.getElementById('root');

    root.innerHTML = `
      <div class="container">
        <div class="language-toggle">
          <button onclick="app.toggleLanguage()" class="lang-btn">
            ${this.currentLang === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
          </button>
          <button onclick="app.speak(app.t('welcome'))" class="voice-btn" title="${this.t('listening')}">
            🔊 ${this.currentLang === 'en' ? 'Voice Guide' : 'वॉयस गाइड'}
          </button>
        </div>

        <div class="dashboard">
          <div class="sidebar">
            <h3>${this.t('select_dashboard')}</h3>
            <button onclick="app.showFarmerDashboard(); app.speak('${this.t('farmer_dashboard')}')">${this.t('farmer')}</button>
            <button onclick="app.showTransporterDashboard(); app.speak('${this.t('transporter_dashboard')}')">${this.t('transporter')}</button>
            <button onclick="app.showMiddlemanDashboard(); app.speak('${this.t('middleman_dashboard')}')">${this.t('middleman')}</button>
            <button onclick="app.showGovernmentDashboard(); app.speak('${this.t('government_dashboard')}')">${this.t('government')}</button>
            <button onclick="app.showWholesalerDashboard(); app.speak('${this.t('wholesaler_dashboard')}')">${this.t('wholesaler')}</button>
            <button onclick="app.showCertificationDashboard(); app.speak('${this.t('certification_dashboard')}')">${this.t('certification')}</button>
            <button onclick="app.showConsumerDashboard(); app.speak('${this.t('consumer_dashboard')}')">${this.t('consumer')}</button>
          </div>

          <div class="content" id="dashboard-content">
            <h2>${this.t('welcome')}</h2>
            <p>${this.t('select_to_begin')}</p>
          </div>
        </div>
      </div>
    `;
  }

  showFarmerDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>${this.t('farmer_dashboard')}</h2>

      <div class="form-group">
        <h3>${this.t('create_batch')}</h3>

        <label>📸 ${this.currentLang === 'hi' ? 'उपज की तस्वीर अपलोड करें (AI मूल्य विश्लेषण)' : 'Upload Produce Image (AI Price Analysis)'}</label>
        <div class="image-upload-container">
          <input type="file" id="produceImage" accept="image/*" onchange="app.analyzeProduceImage(this)" style="margin-bottom: 1rem;">
          <div id="imagePreview" style="display:none; margin: 1rem 0;">
            <img id="previewImg" style="max-width: 300px; max-height: 300px; border-radius: 8px; border: 2px solid #667eea;">
          </div>
          <div id="aiAnalysisResult" style="display:none; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
            <h4>🤖 ${this.currentLang === 'hi' ? 'AI विश्लेषण परिणाम' : 'AI Analysis Result'}</h4>
            <div id="aiPriceEstimate"></div>
            <div id="aiQualityScore"></div>
            <div id="aiFreshnessScore"></div>
          </div>
        </div>

        <label>${this.t('produce_type')}</label>
        <div class="input-with-mic">
          <select id="produceType">
            <option value="tomato">${this.t('tomato')}</option>
            <option value="potato">${this.t('potato')}</option>
            <option value="onion">${this.t('onion')}</option>
            <option value="carrot">${this.t('carrot')}</option>
            <option value="cucumber">${this.currentLang === 'hi' ? 'खीरा' : 'Cucumber'}</option>
            <option value="spinach">${this.currentLang === 'hi' ? 'पालक' : 'Spinach'}</option>
          </select>
        </div>

        <label>${this.t('quantity')}</label>
        <div class="input-with-mic">
          <input type="number" id="quantity" value="100">
          <button class="mic-btn" id="mic-quantity" onclick="app.startVoiceInput('quantity')">🎤</button>
        </div>

        <label>${this.t('farming_method')}</label>
        <select id="farmingMethod">
          <option value="organic">${this.t('organic')}</option>
          <option value="conventional">${this.t('conventional')}</option>
        </select>

        <label>${this.t('pesticides')}</label>
        <div class="input-with-mic">
          <input type="text" id="pesticides" placeholder="e.g., chlorpyrifos, indoxacarb">
          <button class="mic-btn" id="mic-pesticides" onclick="app.startVoiceInput('pesticides')">🎤</button>
        </div>

        <button class="btn" onclick="app.createBatch(); app.speak('${this.t('create_batch_btn')}')">${this.t('create_batch_btn')}</button>
      </div>

      <div class="form-group" style="margin-top: 2rem;">
        <h3>🚚 ${this.currentLang === 'hi' ? 'आपके क्षेत्र में उपलब्ध ट्रांसपोर्टर' : 'Available Transporters in Your Area'}</h3>
        <p>${this.currentLang === 'hi' ? 'अपने उपज को मंडी तक पहुंचाने के लिए ट्रांसपोर्टर चुनें' : 'Choose a transporter to deliver your produce to the mandi'}</p>
        <table>
          <tr>
            <th>${this.currentLang === 'hi' ? 'नाम' : 'Name'}</th>
            <th>${this.currentLang === 'hi' ? 'स्थान' : 'Location'}</th>
            <th>${this.currentLang === 'hi' ? 'वाहन' : 'Vehicle'}</th>
            <th>${this.currentLang === 'hi' ? 'रेटिंग' : 'Rating'}</th>
            <th>${this.currentLang === 'hi' ? 'फोन' : 'Phone'}</th>
            <th>${this.currentLang === 'hi' ? 'कार्रवाई' : 'Action'}</th>
          </tr>
          ${this.transporters.filter(t => t.available && t.location.includes('Nashik')).map(t => `
            <tr>
              <td>${t.name}</td>
              <td>${t.location}</td>
              <td>${t.vehicleType}</td>
              <td>⭐ ${t.rating}/5</td>
              <td><a href="tel:${t.phone}">${t.phone}</a></td>
              <td><button class="btn" onclick="app.contactTransporter('${t.id}')">${this.currentLang === 'hi' ? 'संपर्क करें' : 'Contact'}</button></td>
            </tr>
          `).join('')}
        </table>
      </div>

      <h3>${this.t('your_batches')}</h3>
      <table>
        <tr>
          <th>${this.t('batch_id')}</th>
          <th>${this.t('produce')}</th>
          <th>${this.t('quantity')}</th>
          <th>${this.t('status')}</th>
          <th>${this.t('health_score')}</th>
          <th>${this.t('action')}</th>
        </tr>
        ${this.batches.map(b => `
          <tr>
            <td>#${b.batchID}</td>
            <td>${this.currentLang === 'hi' ? this.t(b.produceType) : b.produceType}</td>
            <td>${b.quantity}kg @ ₹${b.pricePerKg}/kg</td>
            <td>${b.status}</td>
            <td><span class="health-score health-${b.healthRiskScore > 80 ? 'excellent' : b.healthRiskScore > 60 ? 'good' : 'fair'}">${b.healthRiskScore}/100</span></td>
            <td><button onclick="app.generateQR(${b.batchID})">${this.t('qr_code')}</button></td>
          </tr>
        `).join('')}
      </table>

      <h3>${this.t('ai_price_suggest')}</h3>
      <p>${this.t('today_rates')}</p>
      <ul>
        <li><strong>${this.t('tomato')}:</strong> ₹25-35/kg (${this.currentLang === 'hi' ? 'सुझाव' : 'Suggested'}: ₹30/kg)</li>
        <li><strong>${this.t('potato')}:</strong> ₹18-28/kg (${this.currentLang === 'hi' ? 'सुझाव' : 'Suggested'}: ₹22/kg)</li>
        <li><strong>${this.t('onion')}:</strong> ₹20-32/kg (${this.currentLang === 'hi' ? 'सुझाव' : 'Suggested'}: ₹26/kg)</li>
      </ul>
    `;
  }

  showTransporterDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>${this.t('transporter_dashboard')}</h2>

      <div class="form-group">
        <h3>👨‍🌾 ${this.currentLang === 'hi' ? 'आपके क्षेत्र में परिवहन की आवश्यकता वाले किसान' : 'Farmers Needing Transport in Your Area'}</h3>
        <p>${this.currentLang === 'hi' ? 'किसानों से संपर्क करें और उनकी उपज मंडी तक पहुंचाने में मदद करें' : 'Contact farmers and help transport their produce to the mandi'}</p>
        <table>
          <tr>
            <th>${this.currentLang === 'hi' ? 'किसान का नाम' : 'Farmer Name'}</th>
            <th>${this.currentLang === 'hi' ? 'स्थान' : 'Location'}</th>
            <th>${this.currentLang === 'hi' ? 'फसलें' : 'Crops'}</th>
            <th>${this.currentLang === 'hi' ? 'फोन' : 'Phone'}</th>
            <th>${this.currentLang === 'hi' ? 'कार्रवाई' : 'Action'}</th>
          </tr>
          ${this.farmers.filter(f => f.needsTransport && f.location.includes('Nashik')).map(f => `
            <tr>
              <td>${f.name} (${f.id})</td>
              <td>${f.location}</td>
              <td>${f.crops.join(', ')}</td>
              <td><a href="tel:${f.phone}">${f.phone}</a></td>
              <td><button class="btn" onclick="app.contactFarmer('${f.id}')">${this.currentLang === 'hi' ? 'संपर्क करें' : 'Contact & Offer Service'}</button></td>
            </tr>
          `).join('')}
        </table>
      </div>

      <div class="form-group">
        <h3>${this.t('available_batches')}</h3>
        <table>
          <tr>
            <th>${this.t('batch_id')}</th>
            <th>${this.t('produce')}</th>
            <th>${this.t('from')}</th>
            <th>${this.t('to')}</th>
            <th>${this.t('quantity')}</th>
            <th>${this.t('action')}</th>
          </tr>
          ${this.batches.filter(b => b.status === 'created').map(b => `
            <tr>
              <td>#${b.batchID}</td>
              <td>${this.currentLang === 'hi' ? this.t(b.produceType) : b.produceType}</td>
              <td>${b.farmLocation}</td>
              <td>${this.currentLang === 'hi' ? 'मंडी (नासिक)' : 'Mandi (Nashik)'}</td>
              <td>${b.quantity}kg</td>
              <td><button class="btn" onclick="app.pickupBatch(${b.batchID})">${this.t('pickup_transport')}</button></td>
            </tr>
          `).join('')}
        </table>
      </div>

      <h3>${this.t('active_transports')}</h3>
      <div class="success">✅ ${this.currentLang === 'hi' ? 'बैच #5001: मंडी के लिए ट्रांजिट में (अनुमानित समय: 2 घंटे)' : 'Batch #5001: In Transit to Mandi (ETA: 2 hours)'}</div>
    `;
  }

  showMiddlemanDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>${this.t('middleman_dashboard')}</h2>

      <h3>${this.t('farm_gate_batches')}</h3>
      <table>
        <tr>
          <th>${this.t('batch_id')}</th>
          <th>${this.t('produce')}</th>
          <th>${this.t('quantity')}</th>
          <th>${this.t('farmer_ask_price')}</th>
          <th>${this.t('offer_fixed_price')}</th>
        </tr>
        ${this.batches.filter(b => b.status === 'created').map(b => `
          <tr>
            <td>#${b.batchID}</td>
            <td>${this.currentLang === 'hi' ? this.t(b.produceType) : b.produceType}</td>
            <td>${b.quantity}kg</td>
            <td>₹${b.pricePerKg}/kg</td>
            <td>
              <div class="input-with-mic">
                <input type="number" id="offer-${b.batchID}" placeholder="${this.currentLang === 'hi' ? 'मूल्य/किलो' : 'Offer price/kg'}" value="${Math.round(b.pricePerKg * 0.9)}">
                <button class="mic-btn" id="mic-offer-${b.batchID}" onclick="app.startVoiceInput('offer-${b.batchID}')">🎤</button>
              </div>
              <button class="btn" onclick="app.offerFixedPrice(${b.batchID})">${this.t('offer')}</button>
            </td>
          </tr>
        `).join('')}
      </table>

      <h3>${this.t('decision_helper')}</h3>
      <div class="warning">
        <strong>${this.t('auction_risk')}</strong> ${this.currentLang === 'hi' ? 'यदि आप आलू के लिए ₹22/किलो की पेशकश करते हैं लेकिन नीलामी ₹25/किलो पर बिकती है, तो किसान ₹3/किलो खो देता है!' : 'If you offer ₹22/kg for potato but auction sells at ₹25/kg, farmer loses ₹3/kg!'}
      </div>
    `;
  }

  showGovernmentDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>${this.t('government_dashboard')}</h2>

      <h3>${this.t('auction_records')}</h3>
      <table>
        <tr>
          <th>${this.t('batch_id')}</th>
          <th>${this.t('produce')}</th>
          <th>${this.t('quantity')}</th>
          <th>${this.t('base_price')}</th>
          <th>${this.t('auction_price')}</th>
          <th>${this.t('mandi_shulk')}</th>
          <th>${this.t('farmer_receives')}</th>
          <th>${this.t('status')}</th>
        </tr>
        <tr>
          <td>#5001</td>
          <td>${this.t('tomato')}</td>
          <td>100kg</td>
          <td>₹25</td>
          <td>
            <div class="input-with-mic">
              <input type="number" id="auction-price" value="30">
              <button class="mic-btn" id="mic-auction" onclick="app.startVoiceInput('auction-price')">🎤</button>
            </div>
            <button class="btn" onclick="app.recordAuction(5001, 30)">${this.t('record')}</button>
          </td>
          <td>₹540 (18% ${this.currentLang === 'hi' ? 'का' : 'of'} ₹3000)</td>
          <td>₹2460</td>
          <td>${this.currentLang === 'hi' ? 'लंबित' : 'Pending'}</td>
        </tr>
      </table>

      <h3>${this.t('tax_revenue')}</h3>
      <div class="success">
        <strong>${this.currentLang === 'hi' ? 'आज एकत्रित कुल शुल्क:' : 'Total Shulk Collected Today:'}</strong> ₹2,150<br>
        <strong>${this.currentLang === 'hi' ? 'नीलामी किए गए बैच:' : 'Batches Auctioned:'}</strong> 5<br>
        <strong>${this.currentLang === 'hi' ? 'सरकारी रिकॉर्ड:' : 'Government Records:'}</strong> ${this.currentLang === 'hi' ? 'ब्लॉकचेन पर अपरिवर्तनीय' : 'All immutable on blockchain'}
      </div>
    `;
  }

  showWholesalerDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>${this.t('wholesaler_dashboard')}</h2>

      <h3>${this.t('auctioned_available')}</h3>
      <table>
        <tr>
          <th>${this.t('batch_id')}</th>
          <th>${this.t('produce')}</th>
          <th>${this.t('quantity')}</th>
          <th>${this.t('auction_price')}</th>
          <th>${this.t('health_score')}</th>
          <th>${this.t('freshness')}</th>
          <th>${this.t('action')}</th>
        </tr>
        <tr>
          <td>#5001</td>
          <td>${this.t('tomato')} (${this.t('organic')})</td>
          <td>100kg</td>
          <td>₹30/kg</td>
          <td><span class="health-score health-excellent">95/100</span></td>
          <td>${this.currentLang === 'hi' ? '2 दिन पुराना' : '2 days old'}</td>
          <td><button class="btn" onclick="app.purchaseBatch(5001)">${this.t('buy_now')}</button></td>
        </tr>
      </table>

      <h3>${this.t('inventory_margin')}</h3>
      <div class="form-group">
        <label>${this.t('markup_percentage')}</label>
        <div class="input-with-mic">
          <input type="number" id="markup" value="25" placeholder="25">
          <button class="mic-btn" id="mic-markup" onclick="app.startVoiceInput('markup')">🎤</button>
        </div>
        <p>${this.currentLang === 'hi' ? '25% मार्कअप पर: ₹30/किलो → खुदरा ₹37.50/किलो' : 'At 25% markup: ₹30/kg → Retail ₹37.50/kg'}</p>
      </div>
    `;
  }

  showCertificationDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>${this.t('certification_dashboard')}</h2>

      <h3>${this.t('verification_requests')}</h3>
      <table>
        <tr>
          <th>${this.t('batch_id')}</th>
          <th>${this.t('farmer_name')}</th>
          <th>${this.t('produce')}</th>
          <th>${this.t('cert_status')}</th>
          <th>${this.t('action')}</th>
        </tr>
        <tr>
          <td>#5001</td>
          <td>Ramesh Kumar (FRM-001)</td>
          <td>${this.t('tomato')}</td>
          <td>✅ ${this.currentLang === 'hi' ? 'किसान एनपीओपी प्रमाणित है' : 'Farmer is NPOP Certified'}</td>
          <td><button class="btn" onclick="app.verifyCertification(5001, true)">${this.t('verify_organic')}</button></td>
        </tr>
        <tr>
          <td>#5002</td>
          <td>Priya Singh (FRM-002)</td>
          <td>${this.t('potato')}</td>
          <td>❌ ${this.currentLang === 'hi' ? 'जैविक नहीं (पारंपरिक)' : 'Not Organic (Conventional)'}</td>
          <td><button class="btn" onclick="app.verifyCertification(5002, false)">${this.t('mark_conventional')}</button></td>
        </tr>
      </table>

      <h3>${this.t('certified_farmers')}</h3>
      <ul>
        <li>✅ Ramesh Kumar (FRM-001) - ${this.currentLang === 'hi' ? '2020 से एनपीओपी प्रमाणित' : 'NPOP Certified since 2020'}</li>
        <li>✅ Priya Singh (FRM-002) - ${this.currentLang === 'hi' ? '2021 से एनपीओपी प्रमाणित' : 'NPOP Certified since 2021'}</li>
      </ul>
    `;
  }

  showConsumerDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>${this.t('consumer_dashboard')}</h2>

      <div class="form-group">
        <label>${this.t('enter_batch_id')}</label>
        <div class="input-with-mic">
          <input type="text" id="batchSearch" placeholder="e.g., 5001">
          <button class="mic-btn" id="mic-batch" onclick="app.startVoiceInput('batchSearch')">🎤</button>
        </div>
        <button class="btn" onclick="app.searchBatch()">${this.t('search_trace')}</button>
      </div>

      <h3>${this.t('sample_batch')} (#5001)</h3>

      <div class="health-score health-excellent">
        <strong>${this.t('health_risk_score')} 95/100</strong><br>
        ${this.t('optimal_health')}
      </div>

      <h3>${this.t('supply_chain')}</h3>
      <table>
        <tr>
          <th>${this.t('stage')}</th>
          <th>${this.t('actor')}</th>
          <th>${this.t('date')}</th>
          <th>${this.t('location')}</th>
        </tr>
        <tr>
          <td>${this.t('harvest')}</td>
          <td>Ramesh Kumar (${this.currentLang === 'hi' ? 'किसान' : 'Farmer'})</td>
          <td>Nov 26, 2024</td>
          <td>Nashik, MH</td>
        </tr>
        <tr>
          <td>${this.t('transport')}</td>
          <td>${this.currentLang === 'hi' ? 'ट्रांजिट में' : 'In Transit'}</td>
          <td>Nov 26, 2024</td>
          <td>→ Nashik Mandi</td>
        </tr>
        <tr>
          <td>${this.t('auction')}</td>
          <td>${this.currentLang === 'hi' ? 'सरकारी एजेंट' : 'Government Agent'}</td>
          <td>Nov 26, 2024</td>
          <td>Nashik APMC Mandi</td>
        </tr>
        <tr>
          <td>${this.t('retail')}</td>
          <td>${this.currentLang === 'hi' ? 'स्थानीय खुदरा विक्रेता' : 'Local Retailer'}</td>
          <td>Nov 26, 2024</td>
          <td>${this.currentLang === 'hi' ? 'आपका स्थानीय स्टोर' : 'Your Local Store'}</td>
        </tr>
      </table>

      <h3>${this.t('health_info')}</h3>
      <div class="success">
        <strong>${this.t('certification_label')}</strong> ✅ ${this.currentLang === 'hi' ? 'एनपीओपी प्रमाणित जैविक' : 'NPOP Certified Organic'}<br>
        <strong>${this.t('pesticides_label')}</strong> ✅ ${this.currentLang === 'hi' ? 'कोई नहीं (जैविक खेती)' : 'None (Organic farming)'}<br>
        <strong>${this.t('freshness_label')}</strong> ${this.currentLang === 'hi' ? '2 दिन पुराना (उच्च विटामिन प्रतिधारण)' : '2 days old (High vitamin retention)'}<br>
        <strong>${this.t('handler_verification')}</strong> ✅ ${this.currentLang === 'hi' ? 'मंडी अधिकारी सत्यापित' : 'Mandi Officer Verified'}<br>
        <strong>${this.t('farmer_trust')}</strong> 92/100
      </div>

      <h3>${this.t('personalized_rec')}</h3>
      <div class="success">
        <strong>${this.currentLang === 'hi' ? 'गर्भवती महिलाओं के लिए:' : 'For Pregnant Women:'}</strong> ✅ ${this.currentLang === 'hi' ? 'उत्कृष्ट विकल्प' : 'EXCELLENT CHOICE'}<br>
        ${this.currentLang === 'hi' ? 'इस जैविक टमाटर में शून्य कीटनाशक जोखिम और उच्च फोलेट सामग्री है। गर्भावस्था के लिए बिल्कुल सही!' : 'This organic tomato has zero pesticide exposure risk and high folate content. Perfect for pregnancy!'}
      </div>
    `;
  }

  createBatch() {
    const type = document.getElementById('produceType').value;
    const qty = document.getElementById('quantity').value;
    const method = document.getElementById('farmingMethod').value;
    const pesticides = document.getElementById('pesticides').value.split(',').filter(p => p.trim());

    const newBatch = {
      batchID: 5000 + Math.floor(Math.random() * 1000),
      farmerID: 'FRM-001',
      produceType: type,
      quantity: qty,
      farmLocation: 'Nashik, MH',
      pricePerKg: 25,
      farmingMethod: method,
      pesticidesDeclared: pesticides,
      isNPOPCertified: method === 'organic',
      healthRiskScore: method === 'organic' ? 95 : pesticides.length === 0 ? 45 : 35,
      status: 'created'
    };

    this.batches.push(newBatch);

    // Record on blockchain
    this.recordBlockchainTransaction('BATCH_CREATED', {
      batchID: newBatch.batchID,
      farmerID: newBatch.farmerID,
      produceType: newBatch.produceType,
      quantity: newBatch.quantity,
      farmingMethod: newBatch.farmingMethod,
      location: newBatch.farmLocation
    });

    const msg = this.currentLang === 'hi'
      ? `✅ बैच बनाया गया! आईडी: #${newBatch.batchID}\n\n📱 क्यूआर कोड उत्पन्न (आपूर्ति श्रृंखला साझा करने के लिए स्कैन करें)\n\n🔐 ब्लॉकचेन पर रिकॉर्ड किया गया`
      : `✅ Batch Created! ID: #${newBatch.batchID}\n\n📱 QR Code Generated (scan to share supply chain)\n\n🔐 Recorded on Blockchain`;

    alert(msg);
    this.speak(msg, this.currentLang);
    this.showFarmerDashboard();
  }

  pickupBatch(batchID) {
    const batch = this.batches.find(b => b.batchID === batchID);
    if (batch) {
      batch.status = 'in_transit';

      // Record on blockchain
      this.recordBlockchainTransaction('BATCH_PICKUP', {
        batchID,
        transporter: 'TRP-001',
        from: batch.farmLocation,
        to: 'Nashik Mandi',
        status: 'in_transit'
      });

      const msg = this.currentLang === 'hi'
        ? `✅ बैच #${batchID} पिकअप की पुष्टि\nमंडी के लिए ट्रांजिट में\nअनुमानित आगमन: 2 घंटे\n\n🔐 ब्लॉकचेन पर रिकॉर्ड किया गया`
        : `✅ Batch #${batchID} Pickup Confirmed\nIn Transit to Mandi\nEstimated Arrival: 2 hours\n\n🔐 Recorded on Blockchain`;

      alert(msg);
      this.speak(msg, this.currentLang);
      this.showTransporterDashboard();
    }
  }

  offerFixedPrice(batchID) {
    const price = document.getElementById(`offer-${batchID}`).value;
    const msg = this.currentLang === 'hi'
      ? `✅ निश्चित मूल्य प्रस्ताव: ₹${price}/किलो\n\nकिसान के निर्णय की प्रतीक्षा:\n- स्वीकार करें: सीधी बिक्री\n- अस्वीकार करें: नीलामी की प्रतीक्षा करें`
      : `✅ Fixed Price Offer: ₹${price}/kg\n\nWaiting for Farmer Decision:\n- Accept: Direct sale\n- Reject: Wait for Auction`;

    alert(msg);
    this.speak(msg, this.currentLang);
  }

  recordAuction(batchID, price) {
    const msg = this.currentLang === 'hi'
      ? `✅ नीलामी रिकॉर्ड की गई\nबैच #${batchID} ₹${price}/किलो पर बिका\n\n💰 मंडी शुल्क की गणना:\n18% = ₹${(price * 100 * 0.18).toFixed(0)}`
      : `✅ Auction Recorded\nBatch #${batchID} sold at ₹${price}/kg\n\n💰 Mandi Shulk Calculated:\n18% = ₹${(price * 100 * 0.18).toFixed(0)}`;

    alert(msg);
    this.speak(msg, this.currentLang);
  }

  verifyCertification(batchID, isOrganic) {
    const msg = this.currentLang === 'hi'
      ? `✅ प्रमाणन ${isOrganic ? 'जैविक के रूप में सत्यापित' : 'पारंपरिक के रूप में चिह्नित'}\n\nब्लॉकचेन पर रिकॉर्ड किया गया`
      : `✅ Certification ${isOrganic ? 'Verified as Organic' : 'Marked as Conventional'}\n\nRecorded on Blockchain`;

    alert(msg);
    this.speak(msg, this.currentLang);
  }

  purchaseBatch(batchID) {
    const msg = this.currentLang === 'hi'
      ? `✅ बैच #${batchID} के लिए खरीद की पुष्टि\n\nअब आप खुदरा मार्कअप सेट कर सकते हैं और उपभोक्ताओं को बेच सकते हैं`
      : `✅ Purchase Confirmed for Batch #${batchID}\n\nYou can now set retail markup and sell to consumers`;

    alert(msg);
    this.speak(msg, this.currentLang);
  }

  generateQR(batchID) {
    const batch = this.batches.find(b => b.batchID === batchID);
    if (!batch) {
      alert('Batch not found!');
      return;
    }

    // Record blockchain transaction
    this.recordBlockchainTransaction('BATCH_QR_GENERATED', {
      batchID,
      timestamp: new Date().toISOString(),
      actor: 'Farmer'
    });

    // Create modal for QR code display
    const modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    const qrData = {
      batchID: batch.batchID,
      produceType: batch.produceType,
      farmLocation: batch.farmLocation,
      farmerID: batch.farmerID,
      timestamp: new Date().toISOString(),
      url: `http://localhost:8000/index_multilingual.html?batch=${batchID}`
    };

    const qrDataString = JSON.stringify(qrData);
    const encodedData = encodeURIComponent(qrDataString);

    modal.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
        <h2 style="margin-bottom: 1rem; color: #2c3e50;">${this.currentLang === 'hi' ? '📱 बैच QR कोड' : '📱 Batch QR Code'}</h2>
        <div id="qrcode-display" style="margin: 2rem auto; padding: 1rem; background: white; display: flex; justify-content: center; align-items: center; min-height: 280px;">
          <div id="qr-loading" style="color: #666;">⏳ Generating QR Code...</div>
        </div>
        <div style="background: #f0f0f0; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
          <strong>${this.currentLang === 'hi' ? 'बैच जानकारी:' : 'Batch Information:'}</strong><br>
          <strong>${this.currentLang === 'hi' ? 'बैच आईडी:' : 'Batch ID:'}</strong> #${batch.batchID}<br>
          <strong>${this.currentLang === 'hi' ? 'उपज:' : 'Produce:'}</strong> ${batch.produceType}<br>
          <strong>${this.currentLang === 'hi' ? 'मात्रा:' : 'Quantity:'}</strong> ${batch.quantity}kg<br>
          <strong>${this.currentLang === 'hi' ? 'स्वास्थ्य स्कोर:' : 'Health Score:'}</strong> ${batch.healthRiskScore}/100
        </div>
        <p style="color: #666; font-size: 0.9rem; margin: 1rem 0;">
          ${this.currentLang === 'hi'
            ? 'उपभोक्ता इस QR कोड को स्कैन करके पूरी आपूर्ति श्रृंखला देख सकते हैं'
            : 'Consumers can scan this QR code to view the complete supply chain'}
        </p>
        <button onclick="app.closeQRModal()" style="padding: 0.75rem 2rem; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 0.5rem; font-weight: bold;">
          ${this.currentLang === 'hi' ? 'बंद करें' : 'Close'}
        </button>
        <button id="download-qr-btn" onclick="app.downloadQR(${batchID})" style="padding: 0.75rem 2rem; background: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 0.5rem; font-weight: bold;">
          ${this.currentLang === 'hi' ? 'डाउनलोड करें' : 'Download'}
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    console.log('🔄 Generating QR code for batch:', batchID);
    console.log('📦 QR Data:', qrData);
    console.log('🔍 Checking QRCode library:', typeof QRCode);

    // Try Method 1: QRCode.js library
    setTimeout(() => {
      const qrContainer = document.getElementById('qrcode-display');
      const loadingDiv = document.getElementById('qr-loading');

      if (!qrContainer) {
        console.error('❌ QR container not found!');
        return;
      }

      // Method 1: Try using QRCode.js library if available
      if (typeof QRCode !== 'undefined') {
        try {
          if (loadingDiv) loadingDiv.remove();
          console.log('✅ Using QRCode.js library');
          console.log('📝 QR Data String:', qrDataString);

          new QRCode(qrContainer, {
            text: qrDataString,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          });

          console.log('✅ QR code generated successfully with QRCode.js!');
        } catch (error) {
          console.error('❌ QRCode.js failed with error:', error);
          console.error('❌ Error stack:', error.stack);
          // Fall back to API method
          this.generateQRwithAPI(qrContainer, qrDataString, loadingDiv);
        }
      } else {
        // Method 2: Use QR Code API as fallback
        console.warn('⚠️ QRCode.js not available, using API fallback');
        console.log('📦 Window.QRCode type:', typeof window.QRCode);
        this.generateQRwithAPI(qrContainer, qrDataString, loadingDiv);
      }
    }, 100);

    const msg = this.currentLang === 'hi'
      ? `बैच ${batchID} के लिए QR कोड उत्पन्न। उपभोक्ता इसे स्कैन कर सकते हैं।`
      : `QR Code generated for batch ${batchID}. Consumers can scan it.`;
    this.speak(msg, this.currentLang);
  }

  // Fallback method using QR Code API
  generateQRwithAPI(container, data, loadingDiv) {
    try {
      console.log('🌐 Generating QR using API method');
      console.log('🔗 API URL will be created for data:', data.substring(0, 100) + '...');

      // Remove loading div safely
      const loading = loadingDiv || document.getElementById('qr-loading');
      if (loading && loading.parentNode) {
        loading.remove();
      }

      // Clear container
      container.innerHTML = '';

      // Use QR Server API for QR code generation
      const qrSize = 256;
      const encodedData = encodeURIComponent(data);
      const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodedData}`;

      console.log('🔗 QR API URL:', qrURL.substring(0, 150) + '...');

      const img = document.createElement('img');
      img.src = qrURL;
      img.alt = 'QR Code';
      img.style.cssText = 'width: 256px; height: 256px; border: 2px solid #ddd; display: block;';
      img.id = 'qr-image';

      img.onload = () => {
        console.log('✅ QR code image loaded successfully with API!');
      };

      img.onerror = (error) => {
        console.error('❌ API QR image failed to load:', error);
        container.innerHTML = '<div style="color: red; padding: 2rem;">❌ Failed to generate QR code.<br>Please check your internet connection.</div>';
      };

      container.appendChild(img);
      console.log('📷 QR image element added to container');
    } catch (error) {
      console.error('❌ Error in API QR generation:', error);
      console.error('❌ Error stack:', error.stack);
      container.innerHTML = '<div style="color: red; padding: 2rem;">❌ Error generating QR code: ' + error.message + '</div>';
    }
  }

  closeQRModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.remove();
  }

  downloadQR(batchID) {
    // Try to download from canvas (QRCode.js method)
    const qrCanvas = document.querySelector('#qrcode-display canvas');
    if (qrCanvas) {
      const link = document.createElement('a');
      link.download = `FarmTrace_Batch_${batchID}_QR.png`;
      link.href = qrCanvas.toDataURL();
      link.click();

      const msg = this.currentLang === 'hi'
        ? 'QR कोड डाउनलोड हो गया'
        : 'QR code downloaded';
      this.speak(msg, this.currentLang);
      return;
    }

    // Try to download from image (API method)
    const qrImage = document.querySelector('#qr-image');
    if (qrImage) {
      // Download image from API
      fetch(qrImage.src)
        .then(res => res.blob())
        .then(blob => {
          const link = document.createElement('a');
          link.download = `FarmTrace_Batch_${batchID}_QR.png`;
          link.href = URL.createObjectURL(blob);
          link.click();

          const msg = this.currentLang === 'hi'
            ? 'QR कोड डाउनलोड हो गया'
            : 'QR code downloaded';
          this.speak(msg, this.currentLang);
        })
        .catch(error => {
          console.error('Download error:', error);
          alert('Could not download QR code');
        });
    }
  }

  // Record Blockchain Transaction
  recordBlockchainTransaction(action, data) {
    const transaction = {
      id: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      data,
      timestamp: new Date().toISOString(),
      blockHash: this.generateBlockHash(action, data)
    };

    this.blockchainTransactions.push(transaction);

    console.log('🔐 Blockchain Transaction Recorded:', transaction);

    // In production, this would call backend API to record on actual blockchain
    // await fetch(`${this.API_URL}/blockchain/record`, { method: 'POST', body: JSON.stringify(transaction) });

    return transaction;
  }

  // Generate Mock Block Hash
  generateBlockHash(action, data) {
    const hashInput = `${action}-${JSON.stringify(data)}-${Date.now()}`;
    // Simple hash simulation (in production, use proper cryptographic hash)
    return `0x${hashInput.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0).toString(16).padStart(64, '0')}`;
  }

  searchBatch() {
    const id = document.getElementById('batchSearch').value;
    const batch = this.batches.find(b => b.batchID === parseInt(id));
    if (batch) {
      const msg = this.currentLang === 'hi'
        ? `✅ बैच मिला: ${this.t(batch.produceType)}\n\nआपूर्ति श्रृंखला:\n${batch.farmLocation} → मंडी → आपका स्टोर\n\nस्वास्थ्य स्कोर: ${batch.healthRiskScore}/100`
        : `✅ Batch Found: ${batch.produceType}\n\nSupply Chain:\n${batch.farmLocation} → Mandi → Your Store\n\nHealth Score: ${batch.healthRiskScore}/100`;

      alert(msg);
      this.speak(msg, this.currentLang);
    }
  }

  // AI Image Analysis for Produce Pricing
  analyzeProduceImage(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        // Show image preview
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        previewImg.src = e.target.result;
        preview.style.display = 'block';

        // Simulate AI analysis (in production, this would call a real AI API)
        setTimeout(() => {
          this.performAIAnalysis(file.name);
        }, 1500);

        const msg = this.currentLang === 'hi'
          ? 'तस्वीर अपलोड हो गई। AI विश्लेषण चल रहा है...'
          : 'Image uploaded. Running AI analysis...';
        this.speak(msg, this.currentLang);
      };

      reader.readAsDataURL(file);
    }
  }

  performAIAnalysis(fileName) {
    // Simulate AI analysis with realistic results
    const produceType = document.getElementById('produceType').value;
    const quantity = document.getElementById('quantity').value || 100;

    // Mock AI analysis based on image
    const qualityScore = Math.floor(Math.random() * 20) + 75; // 75-95
    const freshnessScore = Math.floor(Math.random() * 15) + 80; // 80-95

    // Calculate estimated price based on quality
    const basePrices = {
      'tomato': 28,
      'potato': 22,
      'onion': 26,
      'carrot': 24,
      'cucumber': 32,
      'spinach': 38
    };

    const basePrice = basePrices[produceType] || 25;
    const qualityMultiplier = qualityScore / 85; // Adjust based on quality
    const estimatedPrice = Math.round(basePrice * qualityMultiplier);

    // Display results
    const resultDiv = document.getElementById('aiAnalysisResult');
    const priceDiv = document.getElementById('aiPriceEstimate');
    const qualityDiv = document.getElementById('aiQualityScore');
    const freshnessDiv = document.getElementById('aiFreshnessScore');

    resultDiv.style.display = 'block';

    if (this.currentLang === 'hi') {
      priceDiv.innerHTML = `<strong>💰 अनुमानित मंडी मूल्य:</strong> ₹${estimatedPrice - 2}/kg - ₹${estimatedPrice + 3}/kg<br><strong>सुझाई गई कीमत:</strong> ₹${estimatedPrice}/kg`;
      qualityDiv.innerHTML = `<strong>🎯 गुणवत्ता स्कोर:</strong> ${qualityScore}/100 ${qualityScore > 85 ? '(उत्कृष्ट)' : qualityScore > 75 ? '(अच्छा)' : '(औसत)'}`;
      freshnessDiv.innerHTML = `<strong>🌿 ताजगी स्कोर:</strong> ${freshnessScore}/100 ${freshnessScore > 85 ? '(बहुत ताजा)' : '(ताजा)'}`;
    } else {
      priceDiv.innerHTML = `<strong>💰 Estimated Mandi Price:</strong> ₹${estimatedPrice - 2}/kg - ₹${estimatedPrice + 3}/kg<br><strong>Recommended Price:</strong> ₹${estimatedPrice}/kg`;
      qualityDiv.innerHTML = `<strong>🎯 Quality Score:</strong> ${qualityScore}/100 ${qualityScore > 85 ? '(Excellent)' : qualityScore > 75 ? '(Good)' : '(Average)'}`;
      freshnessDiv.innerHTML = `<strong>🌿 Freshness Score:</strong> ${freshnessScore}/100 ${freshnessScore > 85 ? '(Very Fresh)' : '(Fresh)'}`;
    }

    const msg = this.currentLang === 'hi'
      ? `AI विश्लेषण पूर्ण। अनुमानित मूल्य: ${estimatedPrice} रुपये प्रति किलो। गुणवत्ता स्कोर: ${qualityScore} प्रतिशत।`
      : `AI analysis complete. Estimated price: ${estimatedPrice} rupees per kg. Quality score: ${qualityScore} percent.`;

    this.speak(msg, this.currentLang);
  }

  // Contact Transporter
  contactTransporter(transporterId) {
    const transporter = this.transporters.find(t => t.id === transporterId);
    if (transporter) {
      const msg = this.currentLang === 'hi'
        ? `📞 ${transporter.name} से संपर्क कर रहे हैं\n\nफोन: ${transporter.phone}\nवाहन: ${transporter.vehicleType}\nरेटिंग: ${transporter.rating}/5\n\nउन्हें कॉल करने के लिए फोन नंबर पर क्लिक करें।`
        : `📞 Contacting ${transporter.name}\n\nPhone: ${transporter.phone}\nVehicle: ${transporter.vehicleType}\nRating: ${transporter.rating}/5\n\nClick the phone number to call them.`;

      alert(msg);
      this.speak(this.currentLang === 'hi' ? `${transporter.name} से संपर्क करें` : `Contact ${transporter.name}`, this.currentLang);
    }
  }

  // Contact Farmer
  contactFarmer(farmerId) {
    const farmer = this.farmers.find(f => f.id === farmerId);
    if (farmer) {
      const msg = this.currentLang === 'hi'
        ? `📞 ${farmer.name} से संपर्क कर रहे हैं\n\nफोन: ${farmer.phone}\nस्थान: ${farmer.location}\nफसलें: ${farmer.crops.join(', ')}\n\nपरिवहन सेवा की पेशकश के लिए उन्हें कॉल करें।`
        : `📞 Contacting ${farmer.name}\n\nPhone: ${farmer.phone}\nLocation: ${farmer.location}\nCrops: ${farmer.crops.join(', ')}\n\nCall them to offer transportation service.`;

      alert(msg);
      this.speak(this.currentLang === 'hi' ? `${farmer.name} से संपर्क करें` : `Contact ${farmer.name}`, this.currentLang);
    }
  }
}

// Initialize app
const app = new FarmTraceApp();
