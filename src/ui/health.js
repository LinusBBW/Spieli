// Health system and UI

// Health variables
let playerMaxHealth = 100;
let playerCurrentHealth = 100;
let isInvulnerable = false;
let invulnerabilityTime = 0;
let invulnerabilityDuration = 30; // Frames (0.5 seconds at 60 FPS)
let healthRegenerationRate = 0.05; // HP per frame
let lastDamageTime = 0;

// Create health bar UI
function createHealthBar() {
    // Container for the health bar
    const healthBarContainer = document.createElement('div');
    healthBarContainer.id = 'healthBarContainer';
    healthBarContainer.style.position = 'absolute';
    healthBarContainer.style.top = '20px';
    healthBarContainer.style.left = '20px';
    healthBarContainer.style.width = '200px';
    healthBarContainer.style.height = '20px';
    healthBarContainer.style.backgroundColor = '#333';
    healthBarContainer.style.border = '2px solid #fff';
    healthBarContainer.style.borderRadius = '10px';
    healthBarContainer.style.overflow = 'hidden';
    
    // Inner bar for current health
    const healthFill = document.createElement('div');
    healthFill.id = 'healthFill';
    healthFill.style.width = '100%';
    healthFill.style.height = '100%';
    healthFill.style.backgroundColor = '#2ecc71'; // Green
    healthFill.style.transition = 'width 0.2s, background-color 0.5s';
    
    // Numeric health value
    const healthText = document.createElement('div');
    healthText.id = 'healthText';
    healthText.style.position = 'absolute';
    healthText.style.width = '100%';
    healthText.style.textAlign = 'center';
    healthText.style.lineHeight = '20px';
    healthText.style.color = '#fff';
    healthText.style.fontFamily = 'Arial, sans-serif';
    healthText.style.fontWeight = 'bold';
    healthText.style.textShadow = '1px 1px 2px #000';
    healthText.innerText = `${playerCurrentHealth}/${playerMaxHealth}`;
    
    // Assemble
    healthBarContainer.appendChild(healthFill);
    healthBarContainer.appendChild(healthText);
    document.body.appendChild(healthBarContainer);
}

// Update health bar display
function updateHealthBar() {
    const healthFill = document.getElementById('healthFill');
    const healthText = document.getElementById('healthText');
    
    if (healthFill && healthText) {
        // Calculate health percentage
        const healthPercentage = (playerCurrentHealth / playerMaxHealth) * 100;
        
        // Adjust health bar color based on health
        let healthColor;
        if (healthPercentage > 70) {
            healthColor = '#2ecc71'; // Green
        } else if (healthPercentage > 30) {
            healthColor = '#f39c12'; // Orange
        } else {
            healthColor = '#e74c3c'; // Red
        }
        
        // Blinking effect if invulnerable
        if (isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            healthColor = '#3498db'; // Blue blink for invulnerability
        }
        
        // Update health bar
        healthFill.style.width = `${healthPercentage}%`;
        healthFill.style.backgroundColor = healthColor;
        
        // Update text
        healthText.innerText = `${Math.ceil(playerCurrentHealth)}/${playerMaxHealth}`;
    }
}

// Take damage
function takeDamage(amount) {
    // Don't take damage if invulnerable
    if (isInvulnerable) return;
    
    // Apply damage
    playerCurrentHealth -= amount;
    
    // Limit to 0
    if (playerCurrentHealth < 0) {
        playerCurrentHealth = 0;
    }
    
    // Store time of last damage
    lastDamageTime = Date.now();
    
    // Short invulnerability period
    isInvulnerable = true;
    invulnerabilityTime = invulnerabilityDuration;
    
    // Screen feedback for damage
    createDamageEffect();
    
    // Check if player is dead
    if (playerCurrentHealth <= 0) {
        gameOver();
    }
}

// Heal player
function heal(amount) {
    playerCurrentHealth += amount;
    
    // Limit to max health
    if (playerCurrentHealth > playerMaxHealth) {
        playerCurrentHealth = playerMaxHealth;
    }
}

// Health regeneration
function regenerateHealth() {
    // Only regenerate if player hasn't taken damage in the last 5 seconds
    if (Date.now() - lastDamageTime > 5000 && playerCurrentHealth < playerMaxHealth) {
        playerCurrentHealth += healthRegenerationRate;
        
        // Limit to max health
        if (playerCurrentHealth > playerMaxHealth) {
            playerCurrentHealth = playerMaxHealth;
        }
    }
}

// Visual feedback for damage
function createDamageEffect() {
    // Red overlay effect for damage feedback
    const damageOverlay = document.createElement('div');
    damageOverlay.style.position = 'absolute';
    damageOverlay.style.top = '0';
    damageOverlay.style.left = '0';
    damageOverlay.style.width = '100%';
    damageOverlay.style.height = '100%';
    damageOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    damageOverlay.style.pointerEvents = 'none';
    damageOverlay.style.transition = 'opacity 0.5s';
    damageOverlay.style.zIndex = '1000';
    document.body.appendChild(damageOverlay);
    
    // Remove overlay after a second
    setTimeout(() => {
        damageOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(damageOverlay);
        }, 500);
    }, 1000);
}

// Game over screen
function gameOver() {
    // Create a game over screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '0';
    gameOverScreen.style.left = '0';
    gameOverScreen.style.width = '100%';
    gameOverScreen.style.height = '100%';
    gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.flexDirection = 'column';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.zIndex = '2000';
    
    // Text
    const gameOverText = document.createElement('h1');
    gameOverText.innerText = 'GAME OVER';
    gameOverText.style.color = '#e74c3c';
    gameOverText.style.fontFamily = 'Arial, sans-serif';
    gameOverText.style.fontSize = '50px';
    gameOverText.style.marginBottom = '20px';
    
    // Restart button
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '20px';
    restartButton.style.cursor = 'pointer';
    restartButton.style.backgroundColor = '#3498db';
    restartButton.style.color = '#fff';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    
    // Event listener for restart
    restartButton.addEventListener('click', () => {
        // Revive player
        playerCurrentHealth = playerMaxHealth;
        document.body.removeChild(gameOverScreen);
        
        // Re-enable controls
        controls.enabled = true;
    });
    
    // Add to game over screen
    gameOverScreen.appendChild(gameOverText);
    gameOverScreen.appendChild(restartButton);
    document.body.appendChild(gameOverScreen);
    
    // Disable controls
    controls.enabled = false;
}

// Create test damage button
function createTestDamageButton() {
    const damageButton = document.createElement('button');
    damageButton.innerText = 'Take 10 Damage (Test)';
    damageButton.style.position = 'absolute';
    damageButton.style.bottom = '20px';
    damageButton.style.right = '20px';
    damageButton.style.padding = '10px';
    damageButton.style.cursor = 'pointer';
    
    damageButton.addEventListener('click', () => {
        takeDamage(10);
    });
    
    document.body.appendChild(damageButton);
}

// Update health system
function updateHealthSystem() {
    // Update invulnerability time
    if (isInvulnerable) {
        invulnerabilityTime--;
        if (invulnerabilityTime <= 0) {
            isInvulnerable = false;
        }
    }
    
    // Health regeneration
    regenerateHealth();
    
    // Update health bar
    updateHealthBar();
}

// Initialize health system
function createHealthSystem() {
    createHealthBar();
    createTestDamageButton();
    return {
        takeDamage,
        heal,
        updateHealthSystem
    };
}

// Export health system
export {
    createHealthSystem,
    playerMaxHealth,
    playerCurrentHealth,
    takeDamage,
    heal,
    updateHealthSystem
};