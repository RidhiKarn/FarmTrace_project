// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmTrace {

    // Role types
    enum UserRole { FARMER, TRANSPORTER, MIDDLEMAN, GOVERNMENT_AGENT, WHOLESALER, CERTIFICATION_BODY, CONSUMER }

    // Produce batch structure
    struct ProduceBatch {
        uint id;
        address farmer;
        string farmerID;
        string produceType;
        uint quantity;
        uint harvestDate;
        string farmLocation;
        uint pricePerKg;

        // Supply chain journey
        string farmingMethod; // "organic" or "conventional"
        string[] pesticidesDeclared;
        bool isNPOPCertified;
        address certificationBody;

        // Handlers
        address transporter;
        uint transporterHandoverTime;

        address middleman;
        uint middlemanHandoverTime;
        bool middlemanFixedPriceOffered;
        uint middlemanFixedPrice;

        address governmentAgent;
        uint auctionPrice;
        uint auctionTime;

        address wholesaler;
        uint wholesalerHandoverTime;

        // Status
        string status; // "created", "in_transit", "at_mandi", "auctioned", "sold"

        // Mandi tax
        uint mandiShulkPercentage;
        bool mandiShulkPaid;
    }

    // User registration
    struct User {
        address walletAddress;
        string userID;
        UserRole role;
        string name;
        string location;
        uint registrationTime;
        bool isKYCVerified;
    }

    // Mappings
    mapping(address => User) public users;
    mapping(uint => ProduceBatch) public batches;
    mapping(string => address) public userIDToAddress;

    uint public batchCounter = 0;

    // Events
    event UserRegistered(address indexed user, string userID, UserRole role);
    event BatchCreated(uint indexed batchID, address indexed farmer, string produceType, uint quantity);
    event BatchHandover(uint indexed batchID, address indexed from, address indexed to, string handler);
    event AuctionRecorded(uint indexed batchID, uint auctionPrice, address indexed governmentAgent);
    event CertificationVerified(uint indexed batchID, bool isOrganic, address indexed certificationBody);

    // Register user
    function registerUser(string memory _userID, UserRole _role, string memory _name, string memory _location) public {
        require(userIDToAddress[_userID] == address(0), "User ID already exists");

        users[msg.sender] = User(msg.sender, _userID, _role, _name, _location, block.timestamp, false);
        userIDToAddress[_userID] = msg.sender;

        emit UserRegistered(msg.sender, _userID, _role);
    }

    // Create produce batch (Farmer)
    function createBatch(
        string memory _produceType,
        uint _quantity,
        string memory _farmLocation,
        uint _pricePerKg,
        string memory _farmingMethod,
        string[] memory _pesticidesDeclared
    ) public returns (uint) {
        require(users[msg.sender].role == UserRole.FARMER, "Only farmers can create batches");

        uint batchID = batchCounter++;

        batches[batchID] = ProduceBatch(
            batchID,
            msg.sender,
            users[msg.sender].userID,
            _produceType,
            _quantity,
            block.timestamp,
            _farmLocation,
            _pricePerKg,
            _farmingMethod,
            _pesticidesDeclared,
            false,
            address(0),
            address(0),
            0,
            address(0),
            0,
            false,
            0,
            address(0),
            0,
            address(0),
            0,
            "created",
            18, // mandi shulk percentage (18%)
            false
        );

        emit BatchCreated(batchID, msg.sender, _produceType, _quantity);
        return batchID;
    }

    // Middleman offers fixed price
    function offerFixedPrice(uint _batchID, uint _fixedPrice) public {
        require(users[msg.sender].role == UserRole.MIDDLEMAN, "Only middlemen can offer prices");
        require(batches[_batchID].middleman == address(0), "Price already offered");

        batches[_batchID].middleman = msg.sender;
        batches[_batchID].middlemanFixedPrice = _fixedPrice;
        batches[_batchID].middlemanFixedPriceOffered = true;
    }

    // Farmer accepts middleman's price
    function acceptMiddlemanPrice(uint _batchID) public {
        require(batches[_batchID].farmer == msg.sender, "Only farmer can accept");
        require(batches[_batchID].middlemanFixedPriceOffered, "No offer exists");

        batches[_batchID].status = "sold";
        batches[_batchID].middlemanHandoverTime = block.timestamp;
        emit BatchHandover(_batchID, msg.sender, batches[_batchID].middleman, "middleman");
    }

    // Government agent records auction
    function recordAuction(uint _batchID, uint _auctionPrice) public {
        require(users[msg.sender].role == UserRole.GOVERNMENT_AGENT, "Only government agent can record auction");

        batches[_batchID].governmentAgent = msg.sender;
        batches[_batchID].auctionPrice = _auctionPrice;
        batches[_batchID].auctionTime = block.timestamp;
        batches[_batchID].status = "auctioned";

        emit AuctionRecorded(_batchID, _auctionPrice, msg.sender);
    }

    // Certification body verifies organic
    function verifyCertification(uint _batchID, bool _isOrganic) public {
        require(users[msg.sender].role == UserRole.CERTIFICATION_BODY, "Only certification bodies can verify");

        batches[_batchID].isNPOPCertified = _isOrganic;
        batches[_batchID].certificationBody = msg.sender;

        emit CertificationVerified(_batchID, _isOrganic, msg.sender);
    }

    // Get batch details
    function getBatch(uint _batchID) public view returns (ProduceBatch memory) {
        return batches[_batchID];
    }

    // Get user details
    function getUser(address _address) public view returns (User memory) {
        return users[_address];
    }
}
