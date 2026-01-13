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
    
    // Format the output
    if (conversion === null) {
        toValue.value = '';
    } else {
        // Round to appropriate decimal places
        let formatted;
        if (Math.abs(conversion) < 0.0001 || Math.abs(conversion) > 1000000) {
            formatted = conversion.toExponential(6);
        } else {
            formatted = conversion.toFixed(8).replace(/\.?0+$/, '');
        }
        toValue.value = formatted;
    }
    
    // Add to history
    addToHistory(from, fromUnit.value, conversion, toUnit.value);
}

function convert(value, fromUnit, toUnit, category) {
    // Special handling for temperature
    if (category === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }
    
    // For other units: convert to base unit, then to target unit
    const toMeter = getToBaseUnit(value, fromUnit, category);
    const result = getFromBaseUnit(toMeter, toUnit, category);
    return result;
}

function convertTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    
    if (fromUnit === 'celsius') {
        celsius = value;
    } else if (fromUnit === 'fahrenheit') {
        celsius = (value - 32) * 5/9;
    } else if (fromUnit === 'kelvin') {
        celsius = value - 273.15;
    }
    
    // Convert from Celsius to target unit
    if (toUnit === 'celsius') {
        return celsius;
    } else if (toUnit === 'fahrenheit') {
        return celsius * 9/5 + 32;
    } else if (toUnit === 'kelvin') {
        return celsius + 273.15;
    }
    
    return null;
}

function getToBaseUnit(value, unit, category) {
    // Conversion factors to base unit (meter, kilogram, liter)
    const factors = {
        length: {
            meter: 1,
            kilometer: 1000,
            hectometer: 100,
            decameter: 10,
            decimeter: 0.1,
            centimeter: 0.01,
            millimeter: 0.001,
            micrometer: 0.000001,
            nanometer: 0.000000001,
            mile: 1609.344,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        weight: {
            kilogram: 1,
            hectogram: 0.1,
            decagram: 0.01,
            gram: 0.001,
            decigram: 0.0001,
            centigram: 0.00001,
            milligram: 0.000001,
            microgram: 0.000000001,
            ton: 1000,
            pound: 0.453592,
            ounce: 0.0283495,
            stone: 6.35029
        },
        volume: {
            liter: 1,
            deciliter: 0.1,
            centiliter: 0.01,
            milliliter: 0.001,
            microliter: 0.000001,
            kiloliter: 1000,
            hectoliter: 100,
            decaliter: 10,
            gallon: 3.78541,
            quart: 0.946353,
            pint: 0.473176,
            cup: 0.236588,
            fluid_ounce: 0.0295735,
            tablespoon: 0.0147868,
            teaspoon: 0.00492892
        }
    };
    
    return value * (factors[category][unit] || 1);
}

function getFromBaseUnit(value, unit, category) {
    // Conversion factors from base unit (meter, kilogram, liter)
    const factors = {
        length: {
            meter: 1,
            kilometer: 1000,
            hectometer: 100,
            decameter: 10,
            decimeter: 0.1,
            centimeter: 0.01,
            millimeter: 0.001,
            micrometer: 0.000001,
            nanometer: 0.000000001,
            mile: 1609.344,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        weight: {
            kilogram: 1,
            hectogram: 0.1,
            decagram: 0.01,
            gram: 0.001,
            decigram: 0.0001,
            centigram: 0.00001,
            milligram: 0.000001,
            microgram: 0.000000001,
            ton: 1000,
            pound: 0.453592,
            ounce: 0.0283495,
            stone: 6.35029
        },
        volume: {
            liter: 1,
            deciliter: 0.1,
            centiliter: 0.01,
            milliliter: 0.001,
            microliter: 0.000001,
            kiloliter: 1000,
            hectoliter: 100,
            decaliter: 10,
            gallon: 3.78541,
            quart: 0.946353,
            pint: 0.473176,
            cup: 0.236588,
            fluid_ounce: 0.0295735,
            tablespoon: 0.0147868,
            teaspoon: 0.00492892
        }
    };
    
    return value / (factors[category][unit] || 1);
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
            { value: 'nanometer', label: 'Nanometer (nm)' },
            { value: 'micrometer', label: 'Micrometer (μm)' },
            { value: 'millimeter', label: 'Millimeter (mm)' },
            { value: 'centimeter', label: 'Centimeter (cm)' },
            { value: 'decimeter', label: 'Decimeter (dm)' },
            { value: 'meter', label: 'Meter (m)' },
            { value: 'decameter', label: 'Decameter (dam)' },
            { value: 'hectometer', label: 'Hectometer (hm)' },
            { value: 'kilometer', label: 'Kilometer (km)' },
            { value: 'inch', label: 'Inch (in)' },
            { value: 'foot', label: 'Foot (ft)' },
            { value: 'yard', label: 'Yard (yd)' },
            { value: 'mile', label: 'Mile (mi)' }
        ],
        weight: [
            { value: 'microgram', label: 'Microgram (μg)' },
            { value: 'milligram', label: 'Milligram (mg)' },
            { value: 'centigram', label: 'Centigram (cg)' },
            { value: 'decigram', label: 'Decigram (dg)' },
            { value: 'gram', label: 'Gram (g)' },
            { value: 'decagram', label: 'Decagram (dag)' },
            { value: 'hectogram', label: 'Hectogram (hg)' },
            { value: 'kilogram', label: 'Kilogram (kg)' },
            { value: 'ton', label: 'Metric Ton (t)' },
            { value: 'ounce', label: 'Ounce (oz)' },
            { value: 'pound', label: 'Pound (lb)' },
            { value: 'stone', label: 'Stone (st)' }
        ],
        volume: [
            { value: 'microliter', label: 'Microliter (μL)' },
            { value: 'milliliter', label: 'Milliliter (mL)' },
            { value: 'centiliter', label: 'Centiliter (cL)' },
            { value: 'deciliter', label: 'Deciliter (dL)' },
            { value: 'liter', label: 'Liter (L)' },
            { value: 'decaliter', label: 'Decaliter (daL)' },
            { value: 'hectoliter', label: 'Hectoliter (hL)' },
            { value: 'kiloliter', label: 'Kiloliter (kL)' },
            { value: 'teaspoon', label: 'Teaspoon (tsp)' },
            { value: 'tablespoon', label: 'Tablespoon (tbsp)' },
            { value: 'fluid_ounce', label: 'Fluid Ounce (fl oz)' },
            { value: 'cup', label: 'Cup' },
            { value: 'pint', label: 'Pint (pt)' },
            { value: 'quart', label: 'Quart (qt)' },
            { value: 'gallon', label: 'Gallon (gal)' }
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
