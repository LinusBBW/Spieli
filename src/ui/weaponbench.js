// src/ui/weaponbench.js

import { selectWeapon, getActiveWeapon } from '../weapons/weapon.js';

// Reference to UI elements
let weaponBenchUI = null;
let weaponButtons = [];

// Create weapon bench UI
function createWeaponBenchUI() {
    // Check if UI already exists
    if (weaponBenchUI) {
        weaponBenchUI.style.display = 'flex';
        updateSelectedWeapon();
        return;
    }
    
    // Create container
    weaponBenchUI = document.createElement('div');
    weaponBenchUI.id = 'weaponBenchUI';
    weaponBenchUI.style.position = 'absolute';
    weaponBenchUI.style.bottom = '100px';
    weaponBenchUI.style.left = '50%';
    weaponBenchUI.style.transform = 'translateX(-50%)';
    weaponBenchUI.style.width = '700px';
    weaponBenchUI.style.padding = '20px';
    weaponBenchUI.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    weaponBenchUI.style.border = '2px solid #555';
    weaponBenchUI.style.borderRadius = '10px';
    weaponBenchUI.style.display = 'flex';
    weaponBenchUI.style.flexDirection = 'column';
    weaponBenchUI.style.alignItems = 'center';
    weaponBenchUI.style.zIndex = '1000';
    
    // Title
    const title = document.createElement('h2');
    title.innerText = 'Weapon Forge';
    title.style.color = '#FFF';
    title.style.marginBottom = '15px';
    title.style.fontFamily = 'Arial, sans-serif';
    weaponBenchUI.appendChild(title);
    
    // Instructions
    const instructions = document.createElement('p');
    instructions.innerText = 'Select a weapon to equip:';
    instructions.style.color = '#CCC';
    instructions.style.marginBottom = '10px';
    instructions.style.fontFamily = 'Arial, sans-serif';
    weaponBenchUI.appendChild(instructions);
    
    // Container for weapon buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'center';
    buttonsContainer.style.flexWrap = 'wrap';
    buttonsContainer.style.gap = '10px';
    buttonsContainer.style.width = '100%';
    
    // Define available weapons
    const weapons = [
        { id: 'sword', name: 'Sword', description: 'A balanced weapon with good swing speed.' },
        { id: 'katana', name: 'Katana', description: 'Swift slashes with Bankai special ability.' },
        { id: 'wand', name: 'Magic Wand', description: 'Ranged attacks with arcane energy.' },
        { id: 'zangetsu', name: 'Zangetsu', description: 'Powerful slashes with Getsuga Jūjishō.' },
        { id: 'mugetsu', name: 'Mugetsu', description: 'The Final Getsuga Tenshō form.' }
    ];
    
    // Create button for each weapon
    weapons.forEach(weapon => {
        const button = createWeaponButton(weapon);
        buttonsContainer.appendChild(button);
        weaponButtons.push(button);
    });
    
    weaponBenchUI.appendChild(buttonsContainer);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '8px 16px';
    closeButton.style.backgroundColor = '#555';
    closeButton.style.color = '#FFF';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontFamily = 'Arial, sans-serif';
    
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = '#777';
    });
    
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = '#555';
    });
    
    closeButton.addEventListener('click', hideWeaponBenchUI);
    
    weaponBenchUI.appendChild(closeButton);
    
    // Add to body
    document.body.appendChild(weaponBenchUI);
    
    // Update selected button based on current weapon
    updateSelectedWeapon();
}

// Create a button for a weapon
function createWeaponButton(weapon) {
    const button = document.createElement('div');
    button.className = 'weapon-button';
    button.dataset.weaponId = weapon.id;
    button.style.width = '125px';
    button.style.height = '150px';
    button.style.backgroundColor = '#444';
    button.style.border = '2px solid #666';
    button.style.borderRadius = '8px';
    button.style.display = 'flex';
    button.style.flexDirection = 'column';
    button.style.alignItems = 'center';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.2s ease';
    
    // Weapon icon (simple colored box)
    const icon = document.createElement('div');
    icon.style.width = '60px';
    icon.style.height = '60px';
    icon.style.marginBottom = '10px';
    
    // Different colors for different weapons
    switch(weapon.id) {
        case 'sword':
            icon.style.backgroundColor = '#C0C0C0'; // Silver
            break;
        case 'katana':
            icon.style.backgroundColor = '#F06292'; // Pink (for Senbonzakura)
            break;
        case 'wand':
            icon.style.backgroundColor = '#00BFFF'; // Light blue
            break;
        case 'zangetsu':
            icon.style.backgroundColor = '#FFD700'; // Gold (for Ju Jisho)
            break;
        case 'mugetsu':
            icon.style.backgroundColor = '#000000'; // Black with red border
            icon.style.border = '2px solid #FF0000';
            break;
        default:
            icon.style.backgroundColor = '#FFFFFF';
    }
    
    button.appendChild(icon);
    
    // Weapon name
    const name = document.createElement('div');
    name.innerText = weapon.name;
    name.style.color = '#FFF';
    name.style.fontWeight = 'bold';
    name.style.marginBottom = '5px';
    name.style.fontFamily = 'Arial, sans-serif';
    button.appendChild(name);
    
    // Weapon description
    const description = document.createElement('div');
    description.innerText = weapon.description;
    description.style.color = '#AAA';
    description.style.fontSize = '10px';
    description.style.textAlign = 'center';
    description.style.fontFamily = 'Arial, sans-serif';
    button.appendChild(description);
    
    // Hover effects
    button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('selected')) {
            button.style.backgroundColor = '#555';
            button.style.borderColor = '#888';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('selected')) {
            button.style.backgroundColor = '#444';
            button.style.borderColor = '#666';
        }
    });
    
    // Click handler
    button.addEventListener('click', () => {
        selectWeapon(weapon.id);
        updateSelectedWeapon();
    });
    
    return button;
}

// Update button states based on selected weapon
function updateSelectedWeapon() {
    const activeWeapon = getActiveWeapon();
    
    weaponButtons.forEach(button => {
        if (button.dataset.weaponId === activeWeapon) {
            button.classList.add('selected');
            button.style.backgroundColor = '#226699';
            button.style.borderColor = '#4499DD';
            button.style.transform = 'scale(1.05)';
        } else {
            button.classList.remove('selected');
            button.style.backgroundColor = '#444';
            button.style.borderColor = '#666';
            button.style.transform = 'scale(1)';
        }
    });
}

// Hide weapon bench UI
function hideWeaponBenchUI() {
    if (weaponBenchUI) {
        weaponBenchUI.style.display = 'none';
    }
}

export { createWeaponBenchUI, hideWeaponBenchUI };