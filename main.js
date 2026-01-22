/**
 * @file main.js
 * @brief Refactored code eliminating code smells
 * @author Learning Exercise
 * @date 2024
 */

// ============================================================================
// Constants (Eliminating Magic Numbers & Strings)
// ============================================================================

const MIN_AGE = 18;
const MAX_STRING_LENGTH = 50;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;
const LOW_STOCK_THRESHOLD = 10;
const MAX_NOTIFICATIONS = 100;

const PAYMENT_FEES = {
    CREDIT: 0.03,
    DEBIT: 0.01,
    PAYPAL: 0.035
};

const CURRENCY_RATES = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.75
};

const SUBSCRIPTION_PLANS = {
    PREMIUM: 'premium',
    BASIC: 'basic'
};

const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    EXPIRED: 'expired'
};

// ============================================================================
// Utility Functions (Eliminating Duplicate Code)
// ============================================================================

/**
 * @function isValidString
 * @brief Validates a string input with consistent rules
 * @param {string|null|undefined} input - The input to validate
 * @param {number} maxLength - Maximum allowed length (default: MAX_STRING_LENGTH)
 * @return {boolean} True if the string is valid, false otherwise
 */
function isValidString(input, maxLength = MAX_STRING_LENGTH) {
    if (input === null || input === undefined) {
        return false;
    }
    if (typeof input !== 'string') {
        return false;
    }
    if (input.length === 0) {
        return false;
    }
    if (input.length > maxLength) {
        return false;
    }
    return true;
}

/**
 * @function isValidEmail
 * @brief Validates an email address format
 * @param {string} email - The email address to validate
 * @return {boolean} True if the email is valid, false otherwise
 */
function isValidEmail(email) {
    if (!isValidString(email)) {
        return false;
    }
    return email.includes('@');
}

/**
 * @function formatDateToString
 * @brief Formats a date object to YYYY-MM-DD string format
 * @param {Date} date - The date object to format
 * @return {string} Formatted date string
 */
function formatDateToString(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const paddedMonth = month < 10 ? `0${month}` : `${month}`;
    const paddedDay = day < 10 ? `0${day}` : `${day}`;
    
    return `${year}-${paddedMonth}-${paddedDay}`;
}

/**
 * @function calculateAgeFromBirthDate
 * @brief Calculates age from a birth date
 * @param {Date|string} birthDate - The birth date
 * @return {number} The calculated age
 */
function calculateAgeFromBirthDate(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// ============================================================================
// Separated Classes (Eliminating God Objects)
// ============================================================================

/**
 * @class UserManager
 * @brief Handles user-related operations
 */
class UserManager {
    constructor() {
        this.users = [];
    }

    /**
     * @function addUser
     * @brief Adds a new user if validation passes
     * @param {string} name - User's name
     * @param {string} email - User's email
     * @param {number} age - User's age
     * @return {boolean} True if user was added successfully, false otherwise
     */
    addUser(name, email, age) {
        if (age < MIN_AGE) {
            return false;
        }
        if (!isValidEmail(email)) {
            return false;
        }
        
        this.users.push({ name, email, age });
        return true;
    }

    /**
     * @function findUserById
     * @brief Finds a user by their ID
     * @param {number} userId - The user ID to search for
     * @return {Object|undefined} The user object if found, undefined otherwise
     */
    findUserById(userId) {
        return this.users.find(user => user.id === userId);
    }

    /**
     * @function getUserCount
     * @brief Returns the total number of users
     * @return {number} The number of users
     */
    getUserCount() {
        return this.users.length;
    }
}

/**
 * @class ProductManager
 * @brief Handles product-related operations
 */
class ProductManager {
    constructor() {
        this.products = [];
        this.inventory = {};
    }

    /**
     * @function addProduct
     * @brief Adds a new product to the inventory
     * @param {string} name - Product name
     * @param {number} price - Product price
     * @param {number} stock - Initial stock quantity
     * @return {number} The ID of the newly added product
     */
    addProduct(name, price, stock) {
        const productId = this.products.length + 1;
        this.products.push({ id: productId, name, price });
        this.inventory[productId] = stock;
        return productId;
    }

    /**
     * @function getProductById
     * @brief Retrieves a product by its ID
     * @param {number} productId - The product ID
     * @return {Object|undefined} The product object if found, undefined otherwise
     */
    getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }

    /**
     * @function hasStock
     * @brief Checks if a product has sufficient stock
     * @param {number} productId - The product ID
     * @param {number} quantity - The required quantity
     * @return {boolean} True if stock is sufficient, false otherwise
     */
    hasStock(productId, quantity) {
        return this.inventory[productId] !== undefined && 
               this.inventory[productId] >= quantity;
    }

    /**
     * @function reduceStock
     * @brief Reduces stock for a product
     * @param {number} productId - The product ID
     * @param {number} quantity - The quantity to reduce
     */
    reduceStock(productId, quantity) {
        if (this.inventory[productId] !== undefined) {
            this.inventory[productId] -= quantity;
        }
    }

    /**
     * @function getLowStockItems
     * @brief Returns a list of product IDs with low stock
     * @return {Array<number>} Array of product IDs with stock below threshold
     */
    getLowStockItems() {
        return Object.keys(this.inventory)
            .filter(productId => this.inventory[productId] < LOW_STOCK_THRESHOLD)
            .map(productId => parseInt(productId));
    }
}

/**
 * @class OrderProcessor
 * @brief Handles order processing operations
 */
class OrderProcessor {
    constructor(userManager, productManager) {
        this.userManager = userManager;
        this.productManager = productManager;
        this.orders = [];
        this.sales = [];
    }

    /**
     * @function processOrder
     * @brief Processes a new order if all validations pass
     * @param {number} userId - The user ID placing the order
     * @param {number} productId - The product ID being ordered
     * @param {number} quantity - The quantity being ordered
     * @return {boolean} True if order was processed successfully, false otherwise
     */
    processOrder(userId, productId, quantity) {
        if (!this.isValidQuantity(quantity)) {
            return false;
        }
        
        if (!this.userManager.findUserById(userId)) {
            return false;
        }
        
        if (!this.productManager.hasStock(productId, quantity)) {
            return false;
        }
        
        const product = this.productManager.getProductById(productId);
        if (!product) {
            return false;
        }
        
        const total = this.calculateOrderTotal(product.price, quantity);
        if (total <= 0) {
            return false;
        }
        
        this.createOrder(userId, productId, quantity, total);
        this.productManager.reduceStock(productId, quantity);
        this.recordSale(productId, quantity, total);
        
        return true;
    }

    /**
     * @function isValidQuantity
     * @brief Validates order quantity
     * @param {number} quantity - The quantity to validate
     * @return {boolean} True if quantity is valid, false otherwise
     */
    isValidQuantity(quantity) {
        return quantity >= MIN_QUANTITY && quantity <= MAX_QUANTITY;
    }

    /**
     * @function calculateOrderTotal
     * @brief Calculates the total price for an order
     * @param {number} price - The unit price
     * @param {number} quantity - The quantity
     * @return {number} The total price
     */
    calculateOrderTotal(price, quantity) {
        return price * quantity;
    }

    /**
     * @function createOrder
     * @brief Creates a new order record
     * @param {number} userId - The user ID
     * @param {number} productId - The product ID
     * @param {number} quantity - The quantity
     * @param {number} total - The total price
     */
    createOrder(userId, productId, quantity, total) {
        this.orders.push({
            userId,
            productId,
            quantity,
            total,
            date: new Date()
        });
    }

    /**
     * @function recordSale
     * @brief Records a sale transaction
     * @param {number} productId - The product ID
     * @param {number} quantity - The quantity sold
     * @param {number} revenue - The revenue generated
     */
    recordSale(productId, quantity, revenue) {
        this.sales.push({
            productId,
            quantity,
            revenue,
            timestamp: Date.now()
        });
    }

    /**
     * @function getSalesTotal
     * @brief Calculates total sales revenue
     * @return {number} The total sales revenue
     */
    getSalesTotal() {
        return this.sales.reduce((total, sale) => total + sale.revenue, 0);
    }
}

/**
 * @class ReportGenerator
 * @brief Handles report generation
 */
class ReportGenerator {
    constructor(userManager, productManager, orderProcessor) {
        this.userManager = userManager;
        this.productManager = productManager;
        this.orderProcessor = orderProcessor;
    }

    /**
     * @function generateReport
     * @brief Generates a report based on the specified type
     * @param {string} reportType - The type of report ('sales', 'inventory', 'users')
     * @return {Object|null} The generated report or null if type is invalid
     */
    generateReport(reportType) {
        switch (reportType) {
            case 'sales':
                return this.generateSalesReport();
            case 'inventory':
                return this.generateInventoryReport();
            case 'users':
                return this.generateUsersReport();
            default:
                return null;
        }
    }

    /**
     * @function generateSalesReport
     * @brief Generates a sales report
     * @return {Object} The sales report
     */
    generateSalesReport() {
        return {
            type: 'sales',
            total: this.orderProcessor.getSalesTotal(),
            count: this.orderProcessor.sales.length
        };
    }

    /**
     * @function generateInventoryReport
     * @brief Generates an inventory report
     * @return {Object} The inventory report
     */
    generateInventoryReport() {
        return {
            type: 'inventory',
            lowStock: this.productManager.getLowStockItems()
        };
    }

    /**
     * @function generateUsersReport
     * @brief Generates a users report
     * @return {Object} The users report
     */
    generateUsersReport() {
        return {
            type: 'users',
            count: this.userManager.getUserCount()
        };
    }
}

/**
 * @class NotificationService
 * @brief Handles notification operations
 */
class NotificationService {
    constructor() {
        this.notifications = [];
    }

    /**
     * @function sendNotification
     * @brief Sends a notification to a user
     * @param {number} userId - The user ID to notify
     * @param {string} message - The notification message
     */
    sendNotification(userId, message) {
        if (this.notifications.length >= MAX_NOTIFICATIONS) {
            this.clearOldNotifications();
        }
        
        this.notifications.push({
            userId,
            message,
            sent: Date.now()
        });
    }

    /**
     * @function clearOldNotifications
     * @brief Clears old notifications to prevent memory issues
     */
    clearOldNotifications() {
        this.notifications = [];
    }
}

// ============================================================================
// Refactored Functions (Eliminating Long Functions)
// ============================================================================

/**
 * @class PriceCalculator
 * @brief Handles price calculations with proper separation of concerns
 */
class PriceCalculator {
    /**
     * @function calculateSubtotal
     * @brief Calculates the subtotal from items
     * @param {Array<Object>} items - Array of items with price and quantity
     * @return {number} The subtotal
     */
    static calculateSubtotal(items) {
        return items.reduce((total, item) => {
            if (item.price !== undefined && item.quantity !== undefined) {
                return total + (item.price * item.quantity);
            }
            return total;
        }, 0);
    }

    /**
     * @function calculateDiscountAmount
     * @brief Calculates the discount amount
     * @param {number} subtotal - The subtotal amount
     * @param {number} discountRate - The discount rate (0-1)
     * @return {number} The discount amount
     */
    static calculateDiscountAmount(subtotal, discountRate) {
        if (discountRate <= 0 || discountRate >= 1) {
            return 0;
        }
        return subtotal * discountRate;
    }

    /**
     * @function calculateTaxAmount
     * @brief Calculates the tax amount
     * @param {number} amount - The amount to tax
     * @param {number} taxRate - The tax rate (0-1)
     * @return {number} The tax amount
     */
    static calculateTaxAmount(amount, taxRate) {
        if (taxRate <= 0 || taxRate >= 1) {
            return 0;
        }
        return amount * taxRate;
    }

    /**
     * @function convertCurrency
     * @brief Converts an amount to a different currency
     * @param {number} amount - The amount to convert
     * @param {string} currency - The target currency code
     * @return {number} The converted amount
     */
    static convertCurrency(amount, currency) {
        const rate = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
        return amount * rate;
    }

    /**
     * @function roundToTwoDecimals
     * @brief Rounds a number to two decimal places
     * @param {number} value - The value to round
     * @return {number} The rounded value
     */
    static roundToTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }

    /**
     * @function calculateTotal
     * @brief Calculates the total price including discounts, tax, shipping, and currency conversion
     * @param {Array<Object>} items - Array of items with price and quantity
     * @param {number} discountRate - The discount rate (0-1)
     * @param {number} taxRate - The tax rate (0-1)
     * @param {number} shippingCost - The shipping cost
     * @param {string} currency - The target currency code
     * @return {number} The final total
     */
    static calculateTotal(items, discountRate, taxRate, shippingCost, currency) {
        const subtotal = this.calculateSubtotal(items);
        const discountAmount = this.calculateDiscountAmount(subtotal, discountRate);
        const afterDiscount = subtotal - discountAmount;
        const taxAmount = this.calculateTaxAmount(afterDiscount, taxRate);
        const beforeShipping = afterDiscount + taxAmount;
        const withShipping = shippingCost > 0 ? beforeShipping + shippingCost : beforeShipping;
        const converted = this.convertCurrency(withShipping, currency);
        
        return this.roundToTwoDecimals(converted);
    }
}

/**
 * @function calculatePaymentWithFee
 * @brief Calculates payment total including processing fee
 * @param {number} amount - The base payment amount
 * @param {string} paymentMethod - The payment method ('credit', 'debit', 'paypal')
 * @return {number} The total amount including fees
 */
function calculatePaymentWithFee(amount, paymentMethod) {
    const feeRate = PAYMENT_FEES[paymentMethod.toUpperCase()];
    if (!feeRate) {
        return amount;
    }
    
    const fee = amount * feeRate;
    return amount + fee;
}

// ============================================================================
// Refactored Conditionals (Eliminating Deeply Nested Conditionals)
// ============================================================================

/**
 * @function getUserStatus
 * @brief Determines user status using early returns (eliminating deep nesting)
 * @param {Object|null} user - The user object
 * @return {string} The user status
 */
function getUserStatus(user) {
    if (!user) {
        return 'not_found';
    }
    
    if (!user.active) {
        return 'inactive';
    }
    
    if (!user.subscription) {
        return 'no_subscription';
    }
    
    if (user.subscription.status !== SUBSCRIPTION_STATUS.ACTIVE) {
        if (user.subscription.status === SUBSCRIPTION_STATUS.EXPIRED) {
            return 'expired';
        }
        return 'inactive_subscription';
    }
    
    if (!user.subscription.plan) {
        return 'active_no_plan';
    }
    
    if (user.subscription.plan === SUBSCRIPTION_PLANS.PREMIUM) {
        return 'premium_active';
    }
    
    if (user.subscription.plan === SUBSCRIPTION_PLANS.BASIC) {
        return 'basic_active';
    }
    
    return 'active_no_plan';
}

// ============================================================================
// Example Usage
// ============================================================================

const userManager = new UserManager();
const productManager = new ProductManager();
const orderProcessor = new OrderProcessor(userManager, productManager);
const reportGenerator = new ReportGenerator(userManager, productManager, orderProcessor);
const notificationService = new NotificationService();

// Example operations
userManager.addUser('John Doe', 'john@example.com', 25);
productManager.addProduct('Widget', 19.99, 100);
orderProcessor.processOrder(1, 1, 5);

const items = [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 }
];
const total = PriceCalculator.calculateTotal(items, 0.1, 0.08, 5.99, 'USD');

const isValid = isValidString('test');
const payment = calculatePaymentWithFee(100, 'credit');
const status = getUserStatus({ 
    active: true, 
    subscription: { 
        status: SUBSCRIPTION_STATUS.ACTIVE, 
        plan: SUBSCRIPTION_PLANS.PREMIUM 
    } 
});
