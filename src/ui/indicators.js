// UI indicators for cooldowns and abilities

import { dashCooldown, dashMaxCooldown } from '../core/controls.js';
import { 
    specialCooldown, 
    specialMaxCooldown,
    swordSpecialCooldown,
    swordSpecialMaxCooldown,
    isWandSpecialActive,
    wandSpecialDuration,
    wandSpecialMaxDuration,
    wandSpecialCooldown,
    wandSpecialMaxCooldown
} from '../weapons/weapon.js';

// UI display for dash cooldown
function createDashIndicator() {
    // Create a div element for the dash indicator
    const dashIndicator = document.createElement('div');
    dashIndicator.id = 'dashIndicator';
    dashIndicator.style.position = 'absolute';
    dashIndicator.style.bottom = '20px';
    dashIndicator.style.left = '20px';
    dashIndicator.style.width = '100px';
    dashIndicator.style.height = '10px';
    dashIndicator.style.backgroundColor = '#333';
    dashIndicator.style.border = '2px solid #fff';
    dashIndicator.style.borderRadius = '5px';
    dashIndicator.style.overflow = 'hidden';
    
    // Inner div for the fill level
    const dashFill = document.createElement('div');
    dashFill.id = 'dashFill';
    dashFill.style.width = '100%';
    dashFill.style.height = '100%';
    dashFill.style.backgroundColor = '#00aaff';
    dashFill.style.transition = 'width 0.1s';
    
    dashIndicator.appendChild(dashFill);
    document.body.appendChild(dashIndicator);
}

// UI display for sword special move cooldown
function createSwordSpecialIndicator() {
    // Create a div element for the sword special indicator
    const swordSpecialIndicator = document.createElement('div');
    swordSpecialIndicator.id = 'swordSpecialIndicator';
    swordSpecialIndicator.style.position = 'absolute';
    swordSpecialIndicator.style.bottom = '80px';
    swordSpecialIndicator.style.left = '20px';
    swordSpecialIndicator.style.width = '100px';
    swordSpecialIndicator.style.height = '10px';
    swordSpecialIndicator.style.backgroundColor = '#333';
    swordSpecialIndicator.style.border = '2px solid #fff';
    swordSpecialIndicator.style.borderRadius = '5px';
    swordSpecialIndicator.style.overflow = 'hidden';
    
    // Inner div for the fill level
    const swordSpecialFill = document.createElement('div');
    swordSpecialFill.id = 'swordSpecialFill';
    swordSpecialFill.style.width = '100%';
    swordSpecialFill.style.height = '100%';
    swordSpecialFill.style.backgroundColor = '#FFA500'; // Orange
    swordSpecialFill.style.transition = 'width 0.1s';
    
    swordSpecialIndicator.appendChild(swordSpecialFill);
    document.body.appendChild(swordSpecialIndicator);
}

// UI display for katana special move cooldown
function createSpecialIndicator() {
    // Create a div element for the special indicator
    const specialIndicator = document.createElement('div');
    specialIndicator.id = 'specialIndicator';
    specialIndicator.style.position = 'absolute';
    specialIndicator.style.bottom = '40px';
    specialIndicator.style.left = '20px';
    specialIndicator.style.width = '100px';
    specialIndicator.style.height = '10px';
    specialIndicator.style.backgroundColor = '#333';
    specialIndicator.style.border = '2px solid #fff';
    specialIndicator.style.borderRadius = '5px';
    specialIndicator.style.overflow = 'hidden';
    
    // Inner div for the fill level
    const specialFill = document.createElement('div');
    specialFill.id = 'specialFill';
    specialFill.style.width = '100%';
    specialFill.style.height = '100%';
    specialFill.style.backgroundColor = '#FF3333';
    specialFill.style.transition = 'width 0.1s';
    
    specialIndicator.appendChild(specialFill);
    document.body.appendChild(specialIndicator);
}

// UI display for wand special move cooldown
function createWandSpecialIndicator() {
    // Create a div element for the wand special indicator
    const wandSpecialIndicator = document.createElement('div');
    wandSpecialIndicator.id = 'wandSpecialIndicator';
    wandSpecialIndicator.style.position = 'absolute';
    wandSpecialIndicator.style.bottom = '60px';
    wandSpecialIndicator.style.left = '20px';
    wandSpecialIndicator.style.width = '100px';
    wandSpecialIndicator.style.height = '10px';
    wandSpecialIndicator.style.backgroundColor = '#333';
    wandSpecialIndicator.style.border = '2px solid #fff';
    wandSpecialIndicator.style.borderRadius = '5px';
    wandSpecialIndicator.style.overflow = 'hidden';
    
    // Inner div for the fill level
    const wandSpecialFill = document.createElement('div');
    wandSpecialFill.id = 'wandSpecialFill';
    wandSpecialFill.style.width = '100%';
    wandSpecialFill.style.height = '100%';
    wandSpecialFill.style.backgroundColor = '#00BFFF';
    wandSpecialFill.style.transition = 'width 0.1s';
    
    wandSpecialIndicator.appendChild(wandSpecialFill);
    document.body.appendChild(wandSpecialIndicator);
}

// Update the dash indicator
function updateDashIndicator() {
    const dashFill = document.getElementById('dashFill');
    if (dashFill) {
        if (dashCooldown > 0) {
            const fillPercentage = 100 - (dashCooldown / dashMaxCooldown) * 100;
            dashFill.style.width = fillPercentage + '%';
        } else {
            dashFill.style.width = '100%';
        }
    }
}

// Update the sword special move indicator
function updateSwordSpecialIndicator() {
    const swordSpecialFill = document.getElementById('swordSpecialFill');
    if (swordSpecialFill) {
        if (swordSpecialCooldown > 0) {
            const fillPercentage = 100 - (swordSpecialCooldown / swordSpecialMaxCooldown) * 100;
            swordSpecialFill.style.width = fillPercentage + '%';
        } else {
            swordSpecialFill.style.width = '100%';
        }
    }
}

// Update the special move indicator
function updateSpecialIndicator() {
    const specialFill = document.getElementById('specialFill');
    if (specialFill) {
        if (specialCooldown > 0) {
            const fillPercentage = 100 - (specialCooldown / specialMaxCooldown) * 100;
            specialFill.style.width = fillPercentage + '%';
        } else {
            specialFill.style.width = '100%';
        }
    }
}

// Update the wand special indicator
function updateWandSpecialIndicator() {
    const wandSpecialFill = document.getElementById('wandSpecialFill');
    if (wandSpecialFill) {
        if (isWandSpecialActive) {
            // Show remaining special move duration
            const fillPercentage = (wandSpecialDuration / wandSpecialMaxDuration) * 100;
            wandSpecialFill.style.width = fillPercentage + '%';
        } else if (wandSpecialCooldown > 0) {
            // Show cooldown
            const fillPercentage = 100 - (wandSpecialCooldown / wandSpecialMaxCooldown) * 100;
            wandSpecialFill.style.width = fillPercentage + '%';
        } else {
            // Full if ready
            wandSpecialFill.style.width = '100%';
        }
    }
}

// Export indicator functions
export {
    createDashIndicator,
    createSwordSpecialIndicator,
    createSpecialIndicator,
    createWandSpecialIndicator,
    updateDashIndicator,
    updateSwordSpecialIndicator,
    updateSpecialIndicator,
    updateWandSpecialIndicator
};