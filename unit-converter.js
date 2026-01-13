/* =============================================
   UNIT CONVERTER APP - JAVASCRIPT
   ============================================= */

// DOM Elements
const categorySelect = document.getElementById('category');
const fromValue = document.getElementById('from-value');
const fromUnit = document.getElementById('from-unit');
const toValue = document.getElementById('to-value');
const toUnit = document.getElementById('to-unit');
const swapBtn = document.getElementById('swap-btn');
const clearBtn = document.getElementById('clear-btn');
const historyList = document.getElementById('history-list');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Unit Converter App loaded successfully');
    setupEventListeners();
});

// =============================================
// EVENT LISTENERS
// =============================================
function setupEventListeners() {
    // Conversion inputs
    fromValue.addEventListener('input', performConversion);
    fromUnit.addEventListener('change', performConversion);
    toUnit.addEventListener('change', performConversion);
    categorySelect.addEventListener('change', onCategoryChange);
    
    // Buttons
    swapBtn.addEventListener('click', swapUnits);
    clearBtn.addEventListener('click', clearAll);
    
    // Mobile hamburger menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// =============================================
// CONVERSION LOGIC
// =============================================
function performConversion() {
    const from = parseFloat(fromValue.value);
    const category = categorySelect.value;
    
    if (isNaN(from) || from === '') {
        toValue.value = '';
        return;
    }
    
    const conversion = convert(from, fromUnit.value, toUnit.value, category);
    toValue.value = conversion.toFixed(6).replace(/\.?0+$/, '');
    
    // Add to history
    addToHistory(from, fromUnit.value, conversion, toUnit.value);
}

function convert(value, fromUnit, toUnit, category) {
    // Convert from unit to base unit first, then to target unit
    const baseValue = toBaseUnit(value, fromUnit, category);
    const result = fromBaseUnit(baseValue, toUnit, category);
    return result;
}

function toBaseUnit(value, unit, category) {
    const conversions = {
        length: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            mile: 1609.34,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        weight: {
            kilogram: 1,
            gram: 0.001,
            milligram: 0.000001,
            pound: 0.453592,
            ounce: 0.0283495,
            ton: 1000
        },
        volume: {
            liter: 1,
            milliliter: 0.001,
            gallon: 3.78541,
            quart: 0.946353,
            pint: 0.473176,
            cup: 0.236588,
            tablespoon: 0.0147868,
            teaspoon: 0.00492892
        },
        temperature: {
            celsius: 0,
            fahrenheit: 0,
            kelvin: 0
        }
    };
    
    if (category === 'temperature') {
        return value; // Handle temperature separately
    }
    
    return value * (conversions[category][unit] || 1);
}

function fromBaseUnit(value, unit, category) {
    const conversions = {
        length: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            mile: 1609.34,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        weight: {
            kilogram: 1,
            gram: 0.001,
            milligram: 0.000001,
            pound: 0.453592,
            ounce: 0.0283495,
            ton: 1000
        },
        volume: {
            liter: 1,
            milliliter: 0.001,
            gallon: 3.78541,
            quart: 0.946353,
            pint: 0.473176,
            cup: 0.236588,
            tablespoon: 0.0147868,
            teaspoon: 0.00492892
        },
        temperature: {
            celsius: 0,
            fahrenheit: 0,
            kelvin: 0
        }
    };
    
    if (category === 'temperature') {
        return value; // Handle temperature separately
    }
    
    return value / (conversions[category][unit] || 1);
}

// =============================================
// SWAP UNITS
// =============================================
function swapUnits() {
    const tempUnit = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = tempUnit;
    
    performConversion();
}

// =============================================
// CLEAR ALL
// =============================================
function clearAll() {
    fromValue.value = '1';
    toValue.value = '';
    fromUnit.value = 'meter';
    toUnit.value = 'meter';
    categorySelect.value = 'length';
}

// =============================================
// CATEGORY CHANGE
// =============================================
function onCategoryChange() {
    const category = categorySelect.value;
    const units = getUnitsForCategory(category);
    
    // Update from unit dropdown
    fromUnit.innerHTML = units.map(u => `<option value="${u.value}">${u.label}</option>`).join('');
    
    // Update to unit dropdown
    toUnit.innerHTML = units.map(u => `<option value="${u.value}">${u.label}</option>`).join('');
    
    clearAll();
    performConversion();
}

function getUnitsForCategory(category) {
    const unitLists = {
        length: [
            { value: 'meter', label: 'Meter (m)' },
            { value: 'kilometer', label: 'Kilometer (km)' },
            { value: 'centimeter', label: 'Centimeter (cm)' },
            { value: 'mile', label: 'Mile (mi)' },
            { value: 'yard', label: 'Yard (yd)' },
            { value: 'foot', label: 'Foot (ft)' },
            { value: 'inch', label: 'Inch (in)' }
        ],
        weight: [
            { value: 'kilogram', label: 'Kilogram (kg)' },
            { value: 'gram', label: 'Gram (g)' },
            { value: 'milligram', label: 'Milligram (mg)' },
            { value: 'pound', label: 'Pound (lb)' },
            { value: 'ounce', label: 'Ounce (oz)' },
            { value: 'ton', label: 'Metric Ton (t)' }
        ],
        temperature: [
            { value: 'celsius', label: 'Celsius (°C)' },
            { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
            { value: 'kelvin', label: 'Kelvin (K)' }
        ],
        volume: [
            { value: 'liter', label: 'Liter (L)' },
            { value: 'milliliter', label: 'Milliliter (ml)' },
            { value: 'gallon', label: 'Gallon (gal)' },
            { value: 'quart', label: 'Quart (qt)' },
            { value: 'pint', label: 'Pint (pt)' },
            { value: 'cup', label: 'Cup' },
            { value: 'tablespoon', label: 'Tablespoon (tbsp)' },
            { value: 'teaspoon', label: 'Teaspoon (tsp)' }
        ]
    };
    
    return unitLists[category] || [];
}

// =============================================
// HISTORY MANAGEMENT
// =============================================
function addToHistory(from, fromUnit, to, toUnit) {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const getUnitLabel = (unit) => {
        const units = getUnitsForCategory(categorySelect.value);
        const found = units.find(u => u.value === unit);
        return found ? found.label.split('(')[0].trim() : unit;
    };
    
    item.textContent = `${from} ${getUnitLabel(fromUnit)} = ${to.toFixed(4)} ${getUnitLabel(toUnit)}`;
    
    // Remove empty message if exists
    const emptyMsg = historyList.querySelector('.empty-message');
    if (emptyMsg) {
        emptyMsg.remove();
    }
    
    // Add new item at the top
    historyList.insertBefore(item, historyList.firstChild);
    
    // Keep only last 10 items
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// =============================================
// MOBILE MENU
// =============================================
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}
