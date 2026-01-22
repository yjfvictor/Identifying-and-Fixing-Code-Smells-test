/**
 * @file main.js
 * @brief Examples of common code smells to demonstrate anti-patterns
 * @author Learning Exercise
 * @date 2024
 */

/**
 * @class GodObject
 * @brief A class that handles too many responsibilities (God Object code smell)
 */
class GodObject {
    constructor() {
        this.users = [];
        this.orders = [];
        this.products = [];
        this.inventory = {};
        this.sales = [];
        this.reports = [];
        this.notifications = [];
        this.settings = {};
    }

    // User management
    addUser(name, email, age) {
        if (age < 18) {
            return false;
        }
        if (email.indexOf('@') === -1) {
            return false;
        }
        this.users.push({ name: name, email: email, age: age });
        return true;
    }

    // Order processing
    processOrder(userId, productId, quantity) {
        if (quantity > 0 && quantity < 1000) {
            if (this.inventory[productId] !== undefined) {
                if (this.inventory[productId] >= quantity) {
                    if (this.users.find(u => u.id === userId) !== undefined) {
                        const price = this.products.find(p => p.id === productId).price;
                        const total = price * quantity;
                        if (total > 0) {
                            this.orders.push({
                                userId: userId,
                                productId: productId,
                                quantity: quantity,
                                total: total,
                                date: new Date()
                            });
                            this.inventory[productId] -= quantity;
                            this.sales.push({
                                productId: productId,
                                quantity: quantity,
                                revenue: total,
                                timestamp: Date.now()
                            });
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // Product management
    addProduct(name, price, stock) {
        const id = this.products.length + 1;
        this.products.push({ id: id, name: name, price: price });
        this.inventory[id] = stock;
    }

    // Report generation
    generateReport(type) {
        if (type === 'sales') {
            let total = 0;
            for (let i = 0; i < this.sales.length; i++) {
                total += this.sales[i].revenue;
            }
            return { type: 'sales', total: total, count: this.sales.length };
        } else if (type === 'inventory') {
            let lowStock = [];
            for (let id in this.inventory) {
                if (this.inventory[id] < 10) {
                    lowStock.push(id);
                }
            }
            return { type: 'inventory', lowStock: lowStock };
        } else if (type === 'users') {
            return { type: 'users', count: this.users.length };
        }
        return null;
    }

    // Notification sending
    sendNotification(userId, message) {
        // if (this.notifications.length > 100) {
        //     this.notifications = [];
        // }
        this.notifications.push({ userId: userId, message: message, sent: Date.now() });
    }
}

/**
 * @function calculateTotal
 * @brief Long function that does too much (Long Function code smell)
 */
function calculateTotal(items, discount, tax, shipping, currency) {
    let subtotal = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].price !== undefined && items[i].quantity !== undefined) {
            subtotal += items[i].price * items[i].quantity;
        }
    }
    
    let discountAmount = 0;
    if (discount > 0 && discount < 1) {
        discountAmount = subtotal * discount;
    }
    
    let afterDiscount = subtotal - discountAmount;
    
    let taxAmount = 0;
    if (tax > 0 && tax < 1) {
        taxAmount = afterDiscount * tax;
    }
    
    let finalTotal = afterDiscount + taxAmount;
    
    if (shipping > 0) {
        finalTotal += shipping;
    }
    
    if (currency === 'USD') {
        return Math.round(finalTotal * 100) / 100;
    } else if (currency === 'EUR') {
        return Math.round(finalTotal * 0.85 * 100) / 100;
    } else if (currency === 'GBP') {
        return Math.round(finalTotal * 0.75 * 100) / 100;
    }
    
    return finalTotal;
}

/**
 * @function validateUserInput
 * @brief Duplicate code example (Duplicate Code code smell)
 */
function validateUserInput(input) {
    if (input === null || input === undefined) {
        return false;
    }
    if (typeof input !== 'string') {
        return false;
    }
    if (input.length === 0) {
        return false;
    }
    if (input.length > 50) {
        return false;
    }
    return true;
}

/**
 * @function validateProductName
 * @brief Duplicate code example (Duplicate Code code smell)
 */
function validateProductName(name) {
    if (name === null || name === undefined) {
        return false;
    }
    if (typeof name !== 'string') {
        return false;
    }
    if (name.length === 0) {
        return false;
    }
    if (name.length > 50) {
        return false;
    }
    return true;
}

/**
 * @function validateOrderDescription
 * @brief Duplicate code example (Duplicate Code code smell)
 */
function validateOrderDescription(desc) {
    if (desc === null || desc === undefined) {
        return false;
    }
    if (typeof desc !== 'string') {
        return false;
    }
    if (desc.length === 0) {
        return false;
    }
    if (desc.length > 50) {
        return false;
    }
    return true;
}

/**
 * @function processPayment
 * @brief Magic numbers and strings example (Magic Numbers & Strings code smell)
 */
function processPayment(amount, method) {
    if (method === 'credit') {
        const fee = amount * 0.03;
        return amount + fee;
    } else if (method === 'debit') {
        const fee = amount * 0.01;
        return amount + fee;
    } else if (method === 'paypal') {
        const fee = amount * 0.035;
        return amount + fee;
    }
    return amount;
}

/**
 * @function getUserStatus
 * @brief Deeply nested conditionals example (Deeply Nested Conditionals code smell)
 */
function getUserStatus(user) {
    if (user !== null) {
        if (user.active !== undefined) {
            if (user.active === true) {
                if (user.subscription !== undefined) {
                    if (user.subscription.status === 'active') {
                        if (user.subscription.plan !== undefined) {
                            if (user.subscription.plan === 'premium') {
                                return 'premium_active';
                            } else if (user.subscription.plan === 'basic') {
                                return 'basic_active';
                            } else {
                                return 'active_no_plan';
                            }
                        } else {
                            return 'active_no_plan';
                        }
                    } else if (user.subscription.status === 'expired') {
                        return 'expired';
                    } else {
                        return 'inactive_subscription';
                    }
                } else {
                    return 'no_subscription';
                }
            } else {
                return 'inactive';
            }
        } else {
            return 'unknown';
        }
    } else {
        return 'not_found';
    }
}

/**
 * @function formatDate
 * @brief Inconsistent naming example (Inconsistent Naming code smell)
 */
function formatDate(d) {
    const yr = d.getFullYear();
    const mth = d.getMonth() + 1;
    const dy = d.getDate();
    return `${yr}-${mth < 10 ? '0' + mth : mth}-${dy < 10 ? '0' + dy : dy}`;
}

/**
 * @function calculateAge
 * @brief More inconsistent naming
 */
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Example usage demonstrating all code smells
const godObject = new GodObject();
godObject.addUser('John Doe', 'john@example.com', 25);
godObject.addProduct('Widget', 19.99, 100);
godObject.processOrder(1, 1, 5);

const items = [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 }
];
const total = calculateTotal(items, 0.1, 0.08, 5.99, 'USD');

const isValid = validateUserInput('test');
const payment = processPayment(100, 'credit');
const status = getUserStatus({ active: true, subscription: { status: 'active', plan: 'premium' } });
