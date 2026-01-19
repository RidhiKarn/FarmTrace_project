// Dashboard Manager
class FarmTraceApp {
  constructor() {
    this.currentUser = null;
    this.batches = [];
    this.API_URL = 'http://localhost:5000/api';
    this.init();
  }

  async init() {
    // Load sample data
    this.loadSampleData();
    this.renderDashboard();
  }

  loadSampleData() {
    // Sample farmers
    this.farmers = [
      { id: 'FRM-001', name: 'Ramesh Kumar', location: 'Nashik, MH', crops: ['tomato', 'onion'] },
      { id: 'FRM-002', name: 'Priya Singh', location: 'Pune, MH', crops: ['potato', 'carrot'] }
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
        <div class="dashboard">
          <div class="sidebar">
            <h3>Select Dashboard</h3>
            <button onclick="app.showFarmerDashboard()">👨‍🌾 Farmer</button>
            <button onclick="app.showTransporterDashboard()">🚚 Transporter</button>
            <button onclick="app.showMiddlemanDashboard()">👔 Middleman</button>
            <button onclick="app.showGovernmentDashboard()">🏛️ Government Agent</button>
            <button onclick="app.showWholesalerDashboard()">📦 Wholesaler/Retailer</button>
            <button onclick="app.showCertificationDashboard()">✅ Certification Body</button>
            <button onclick="app.showConsumerDashboard()">👤 Consumer</button>
          </div>

          <div class="content" id="dashboard-content">
            <h2>Welcome to FarmTrace</h2>
            <p>Select a dashboard from the left to begin.</p>
          </div>
        </div>
      </div>
    `;
  }

  showFarmerDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>👨‍🌾 Farmer Dashboard</h2>

      <div class="form-group">
        <h3>Create New Produce Batch</h3>
        <label>Produce Type:</label>
        <select id="produceType">
          <option>tomato</option>
          <option>potato</option>
          <option>onion</option>
          <option>carrot</option>
        </select>

        <label>Quantity (kg):</label>
        <input type="number" id="quantity" value="100">

        <label>Farming Method:</label>
        <select id="farmingMethod">
          <option value="organic">Organic (NPOP Certified)</option>
          <option value="conventional">Conventional</option>
        </select>

        <label>Pesticides Used (comma-separated):</label>
        <input type="text" id="pesticides" placeholder="e.g., chlorpyrifos, indoxacarb">

        <button class="btn" onclick="app.createBatch()">Create Batch & Get QR</button>
      </div>

      <h3>Your Batches</h3>
      <table>
        <tr>
          <th>Batch ID</th>
          <th>Produce</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Health Score</th>
          <th>Action</th>
        </tr>
        ${this.batches.map(b => `
          <tr>
            <td>#${b.batchID}</td>
            <td>${b.produceType}</td>
            <td>${b.quantity}kg @ ₹${b.pricePerKg}/kg</td>
            <td>${b.status}</td>
            <td><span class="health-score health-${b.healthRiskScore > 80 ? 'excellent' : b.healthRiskScore > 60 ? 'good' : 'fair'}">${b.healthRiskScore}/100</span></td>
            <td><button onclick="app.generateQR(${b.batchID})">QR Code</button></td>
          </tr>
        `).join('')}
      </table>

      <h3>AI Mandi Price Suggestions</h3>
      <p>🤖 Today's Market Rates:</p>
      <ul>
        <li><strong>Tomato:</strong> ₹25-35/kg (Suggested: ₹30/kg for fresh organic)</li>
        <li><strong>Potato:</strong> ₹18-28/kg (Suggested: ₹22/kg)</li>
        <li><strong>Onion:</strong> ₹20-32/kg (Suggested: ₹26/kg)</li>
      </ul>
    `;
  }

  showTransporterDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>🚚 Transporter Dashboard (Farmer with Vehicle)</h2>

      <div class="form-group">
        <h3>Available Batches to Transport</h3>
        <table>
          <tr>
            <th>Batch ID</th>
            <th>Produce</th>
            <th>From</th>
            <th>To</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
          ${this.batches.filter(b => b.status === 'created').map(b => `
            <tr>
              <td>#${b.batchID}</td>
              <td>${b.produceType}</td>
              <td>${b.farmLocation}</td>
              <td>Mandi (Nashik)</td>
              <td>${b.quantity}kg</td>
              <td><button class="btn" onclick="app.pickupBatch(${b.batchID})">Pickup & Transport</button></td>
            </tr>
          `).join('')}
        </table>
      </div>

      <h3>Active Transports</h3>
      <div class="success">✅ Batch #5001: In Transit to Mandi (ETA: 2 hours)</div>
    `;
  }

  showMiddlemanDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>👔 Middleman Dashboard</h2>

      <h3>Available Batches at Farm Gate</h3>
      <table>
        <tr>
          <th>Batch ID</th>
          <th>Produce</th>
          <th>Quantity</th>
          <th>Farmer Ask Price</th>
          <th>Offer Fixed Price</th>
        </tr>
        ${this.batches.filter(b => b.status === 'created').map(b => `
          <tr>
            <td>#${b.batchID}</td>
            <td>${b.produceType}</td>
            <td>${b.quantity}kg</td>
            <td>₹${b.pricePerKg}/kg</td>
            <td>
              <input type="number" id="offer-${b.batchID}" placeholder="Offer price/kg" value="${Math.round(b.pricePerKg * 0.9)}">
              <button class="btn" onclick="app.offerFixedPrice(${b.batchID})">Offer</button>
            </td>
          </tr>
        `).join('')}
      </table>

      <h3>⚠️ Decision Helper</h3>
      <div class="warning">
        <strong>Auction Risk:</strong> If you offer ₹22/kg for potato but auction sells at ₹25/kg, farmer loses ₹3/kg!
        <br><strong>Strategy:</strong> Always check recent auction trends before offering fixed price.
      </div>
    `;
  }

  showGovernmentDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>🏛️ Government Agent (Auction & Tax) Dashboard</h2>

      <h3>Auction Records (Mandi Tax Tracking)</h3>
      <table>
        <tr>
          <th>Batch ID</th>
          <th>Produce</th>
          <th>Quantity</th>
          <th>Base Price/kg</th>
          <th>Auction Price/kg</th>
          <th>Mandi Shulk (18%)</th>
          <th>Farmer Receives</th>
          <th>Status</th>
        </tr>
        <tr>
          <td>#5001</td>
          <td>Tomato</td>
          <td>100kg</td>
          <td>₹25</td>
          <td>₹30 <button class="btn" onclick="app.recordAuction(5001, 30)">Record ✓</button></td>
          <td>₹540 (18% of ₹3000)</td>
          <td>₹2460</td>
          <td>Pending</td>
        </tr>
      </table>

      <h3>Tax Revenue Dashboard</h3>
      <div class="success">
        <strong>Total Shulk Collected Today:</strong> ₹2,150<br>
        <strong>Batches Auctioned:</strong> 5<br>
        <strong>Government Records:</strong> All immutable on blockchain
      </div>
    `;
  }

  showWholesalerDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>📦 Wholesaler/Retailer Dashboard</h2>

      <h3>Auctioned Batches Available</h3>
      <table>
        <tr>
          <th>Batch ID</th>
          <th>Produce</th>
          <th>Quantity</th>
          <th>Auction Price</th>
          <th>Health Score</th>
          <th>Freshness</th>
          <th>Action</th>
        </tr>
        <tr>
          <td>#5001</td>
          <td>Tomato (Organic)</td>
          <td>100kg</td>
          <td>₹30/kg</td>
          <td><span class="health-score health-excellent">95/100</span></td>
          <td>2 days old</td>
          <td><button class="btn" onclick="app.purchaseBatch(5001)">Buy Now</button></td>
        </tr>
      </table>

      <h3>Your Inventory & Margin Setting</h3>
      <div class="form-group">
        <label>Markup Percentage:</label>
        <input type="number" id="markup" value="25" placeholder="25">
        <p>At 25% markup: ₹30/kg → Retail ₹37.50/kg</p>
      </div>
    `;
  }

  showCertificationDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>✅ Certification Body (NPOP) Dashboard</h2>

      <h3>Organic Verification Requests</h3>
      <table>
        <tr>
          <th>Batch ID</th>
          <th>Farmer</th>
          <th>Produce</th>
          <th>Certification Status</th>
          <th>Action</th>
        </tr>
        <tr>
          <td>#5001</td>
          <td>Ramesh Kumar (FRM-001)</td>
          <td>Tomato</td>
          <td>✅ Farmer is NPOP Certified</td>
          <td><button class="btn" onclick="app.verifyCertification(5001, true)">Verify Organic ✓</button></td>
        </tr>
        <tr>
          <td>#5002</td>
          <td>Priya Singh (FRM-002)</td>
          <td>Potato</td>
          <td>❌ Not Organic (Conventional)</td>
          <td><button class="btn" onclick="app.verifyCertification(5002, false)">Mark Conventional</button></td>
        </tr>
      </table>

      <h3>Certified Farmers</h3>
      <ul>
        <li>✅ Ramesh Kumar (FRM-001) - NPOP Certified since 2020</li>
        <li>✅ Priya Singh (FRM-002) - NPOP Certified since 2021</li>
      </ul>
    `;
  }

  showConsumerDashboard() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
      <h2>👤 Consumer Dashboard - Scan QR or Search Batch</h2>

      <div class="form-group">
        <label>Enter Batch ID to Trace:</label>
        <input type="text" id="batchSearch" placeholder="e.g., 5001">
        <button class="btn" onclick="app.searchBatch()">Search & Trace</button>
      </div>

      <h3>Sample Batch Details (#5001)</h3>

      <div class="health-score health-excellent">
        <strong>HEALTH RISK SCORE: 95/100</strong><br>
        ✅ Optimal Health
      </div>

      <h3>📊 Supply Chain Traceability</h3>
      <table>
        <tr>
          <th>Stage</th>
          <th>Actor</th>
          <th>Date</th>
          <th>Location</th>
        </tr>
        <tr>
          <td>🌱 Harvest</td>
          <td>Ramesh Kumar (Farmer)</td>
          <td>Nov 26, 2024</td>
          <td>Nashik, MH</td>
        </tr>
        <tr>
          <td>🚚 Transport</td>
          <td>In Transit</td>
          <td>Nov 26, 2024</td>
          <td>→ Nashik Mandi</td>
        </tr>
        <tr>
          <td>🏛️ Auction</td>
          <td>Government Agent</td>
          <td>Nov 26, 2024</td>
          <td>Nashik APMC Mandi</td>
        </tr>
        <tr>
          <td>📦 Retail</td>
          <td>Local Retailer</td>
          <td>Nov 26, 2024</td>
          <td>Your Local Store</td>
        </tr>
      </table>

      <h3>🏥 Health Information</h3>
      <div class="success">
        <strong>Certification:</strong> ✅ NPOP Certified Organic<br>
        <strong>Pesticides:</strong> ✅ None (Organic farming)<br>
        <strong>Freshness:</strong> 2 days old (High vitamin retention)<br>
        <strong>Handler Verification:</strong> ✅ Mandi Officer Verified<br>
        <strong>Farmer Trust Score:</strong> 92/100 (NPOP Certified since 2020)
      </div>

      <h3>💚 Personalized Recommendation</h3>
      <div class="success">
        <strong>For Pregnant Women:</strong> ✅ EXCELLENT CHOICE<br>
        This organic tomato has zero pesticide exposure risk and high folate content. Perfect for pregnancy!
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
    alert(`✅ Batch Created! ID: #${newBatch.batchID}\n\n📱 QR Code Generated (scan to share supply chain)\n\n🔐 Recorded on Blockchain`);
    this.showFarmerDashboard();
  }

  pickupBatch(batchID) {
    const batch = this.batches.find(b => b.batchID === batchID);
    if (batch) {
      batch.status = 'in_transit';
      alert(`✅ Batch #${batchID} Pickup Confirmed\nIn Transit to Mandi\nEstimated Arrival: 2 hours`);
      this.showTransporterDashboard();
    }
  }

  offerFixedPrice(batchID) {
    const price = document.getElementById(`offer-${batchID}`).value;
    alert(`✅ Fixed Price Offer: ₹${price}/kg\n\nWaiting for Farmer Decision:\n- Accept: Direct sale\n- Reject: Wait for Auction`);
  }

  recordAuction(batchID, price) {
    alert(`✅ Auction Recorded\nBatch #${batchID} sold at ₹${price}/kg\n\n💰 Mandi Shulk Calculated:\n18% = ₹${(price * 100 * 0.18).toFixed(0)}`);
  }

  verifyCertification(batchID, isOrganic) {
    alert(`✅ Certification ${isOrganic ? 'Verified as Organic' : 'Marked as Conventional'}\n\nRecorded on Blockchain`);
  }

  purchaseBatch(batchID) {
    alert(`✅ Purchase Confirmed for Batch #${batchID}\n\nYou can now set retail markup and sell to consumers`);
  }

  generateQR(batchID) {
    alert(`📱 QR Code Generated for Batch #${batchID}\n\nConsumers can scan this to view:\n✓ Full supply chain\n✓ Health risk score\n✓ Farmer details\n✓ Pesticide info`);
  }

  searchBatch() {
    const id = document.getElementById('batchSearch').value;
    const batch = this.batches.find(b => b.batchID === parseInt(id));
    if (batch) {
      alert(`✅ Batch Found: ${batch.produceType}\n\nSupply Chain:\n${batch.farmLocation} → Mandi → Your Store\n\nHealth Score: ${batch.healthRiskScore}/100`);
    }
  }
}

// Initialize app
const app = new FarmTraceApp();
