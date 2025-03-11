function showJuJishoCutScene(callback) {
    // Erstelle ein schwarzes Overlay, das den gesamten Viewport abdeckt
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.zIndex = '2500';
    document.body.appendChild(overlay);

    // Blende das Overlay ein
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);

    // Erstelle einen Container, um den Inhalt zentriert darzustellen
    const sceneContainer = document.createElement('div');
    sceneContainer.style.position = 'absolute';
    sceneContainer.style.top = '0';
    sceneContainer.style.left = '0';
    sceneContainer.style.width = '100%';
    sceneContainer.style.height = '100%';
    sceneContainer.style.display = 'flex';
    sceneContainer.style.flexDirection = 'column';
    sceneContainer.style.justifyContent = 'center';
    sceneContainer.style.alignItems = 'center';
    sceneContainer.style.overflow = 'hidden';
    overlay.appendChild(sceneContainer);

    // Erstelle einen gemeinsamen Container für Haupttext und Untertitel
    const textContainer = document.createElement('div');
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column';
    textContainer.style.alignItems = 'center';
    sceneContainer.appendChild(textContainer);

    // Haupttext
    const mainText = document.createElement('div');
    mainText.innerText = 'GETSUGA JŪJISHŌ';
    mainText.style.color = '#FFD700';
    mainText.style.fontFamily = 'Arial, sans-serif';
    mainText.style.fontSize = '130px';
    mainText.style.fontWeight = 'bold';
    mainText.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
    mainText.style.position = 'relative';
    mainText.style.opacity = '0';
    mainText.style.transition = 'opacity 0.8s';
    mainText.style.letterSpacing = '10px';
    textContainer.appendChild(mainText);

    // Untertitel
    const subText = document.createElement('div');
    subText.innerText = 'Cross-Shaped Moon Fang Piercer';
    subText.style.color = 'white';
    subText.style.fontFamily = 'Arial, sans-serif';
    subText.style.fontSize = '24px';
    subText.style.marginTop = '20px';
    subText.style.opacity = '0';
    subText.style.transition = 'opacity 0.5s';
    textContainer.appendChild(subText);

    // Zeige den Haupttext mit Vibration und Pulse an
    setTimeout(() => {
        mainText.style.opacity = '1';
        // Vibration
        const vibrateText = () => {
            const intensity = 2;
            mainText.style.transform = `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`;
            setTimeout(vibrateText, 50);
        };
        vibrateText();

        // Pulse
        let pulseIntensity = 0;
        let increasing = true;
        const pulseText = () => {
            if (increasing) {
                pulseIntensity += 0.05;
                if (pulseIntensity >= 1) increasing = false;
            } else {
                pulseIntensity -= 0.05;
                if (pulseIntensity <= 0) increasing = true;
            }
            const glowSize = 10 + pulseIntensity * 15;
            mainText.style.textShadow = `0 0 ${glowSize}px rgba(255, 215, 0, ${0.5 + pulseIntensity * 0.5})`;
            setTimeout(pulseText, 30);
        };
        pulseText();
    }, 800);

    // Untertitel später einblenden
    setTimeout(() => {
        subText.style.opacity = '1';
    }, 1500);

    // Container für Slice-Effekte
    const sliceEffectContainer = document.createElement('div');
    sliceEffectContainer.style.position = 'absolute';
    sliceEffectContainer.style.top = '0';
    sliceEffectContainer.style.left = '0';
    sliceEffectContainer.style.width = '100%';
    sliceEffectContainer.style.height = '100%';
    sliceEffectContainer.style.zIndex = '2600';
    sliceEffectContainer.style.pointerEvents = 'none';
    overlay.appendChild(sliceEffectContainer);

    function createSliceAnimation() {
        // Weißer Flash
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = 'white';
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.1s';
        flash.style.zIndex = '2700';
        sliceEffectContainer.appendChild(flash);

        // Horizontale Scheibe
        const horizontalSlice = document.createElement('div');
        horizontalSlice.style.position = 'absolute';
        horizontalSlice.style.top = '50%';
        horizontalSlice.style.left = '0';
        horizontalSlice.style.width = '100%';
        horizontalSlice.style.height = '5px';
        horizontalSlice.style.background = 'linear-gradient(to right, transparent, #FFD700, white, #FFD700, transparent)';
        horizontalSlice.style.boxShadow = '0 0 20px #FFD700, 0 0 40px #FFD700';
        horizontalSlice.style.opacity = '0';
        horizontalSlice.style.transition = 'transform 0.3s linear, opacity 0.1s';
        sliceEffectContainer.appendChild(horizontalSlice);

        // Vertikale Scheibe
        const verticalSlice = document.createElement('div');
        verticalSlice.style.position = 'absolute';
        verticalSlice.style.left = '50%';
        verticalSlice.style.top = '0';
        verticalSlice.style.width = '5px';
        verticalSlice.style.height = '100%';
        verticalSlice.style.background = 'linear-gradient(to bottom, transparent, #FFD700, white, #FFD700, transparent)';
        verticalSlice.style.boxShadow = '0 0 20px #FFD700, 0 0 40px #FFD700';
        verticalSlice.style.opacity = '0';
        verticalSlice.style.transition = 'transform 0.3s linear, opacity 0.1s';
        sliceEffectContainer.appendChild(verticalSlice);

        // Erster Schnitt (horizontal)
        setTimeout(() => {
            horizontalSlice.style.opacity = '1';
            horizontalSlice.style.transform = 'translateX(-100vw)';
            setTimeout(() => {
                horizontalSlice.style.transition = 'transform 0.3s linear';
                horizontalSlice.style.transform = 'translateX(100vw)';
            }, 50);
            setTimeout(() => {
                flash.style.opacity = '0.8';
                // Haupttext zerteilen
                splitTextIntoQuadrants(mainText);

                // ---- Wichtig: Untertitel hier ausblenden oder entfernen ----
                subText.style.transition = 'opacity 0.2s';
                subText.style.opacity = '0';
                // Oder: subText.remove();

                setTimeout(() => {
                    flash.style.opacity = '0';
                }, 100);
            }, 300);
        }, 2500);

        // Zweiter Schnitt (vertikal)
        setTimeout(() => {
            verticalSlice.style.opacity = '1';
            verticalSlice.style.transform = 'translateY(-100vh)';
            setTimeout(() => {
                verticalSlice.style.transition = 'transform 0.3s linear';
                verticalSlice.style.transform = 'translateY(100vh)';
            }, 50);
            setTimeout(() => {
                flash.style.opacity = '0.9';
                setTimeout(() => {
                    flash.style.opacity = '0';
                    // Explosion
                    createExplosionEffect(sliceEffectContainer);
                    setTimeout(() => {
                        sliceEffectContainer.removeChild(horizontalSlice);
                        sliceEffectContainer.removeChild(verticalSlice);
                    }, 300);
                }, 100);
            }, 300);
        }, 2900);
    }

    // Haupttext in Quadranten teilen
    function splitTextIntoQuadrants(textElement) {
        const text = textElement.innerText;
        textElement.innerHTML = '';
        textElement.style.position = 'relative';
        textElement.style.overflow = 'visible';

        const quadrantContainer = document.createElement('div');
        quadrantContainer.style.position = 'relative';
        quadrantContainer.style.width = '100%';
        quadrantContainer.style.height = '100%';
        textElement.appendChild(quadrantContainer);

        function createQuadrant(clipPath) {
            const quad = document.createElement('div');
            quad.innerText = text;
            quad.style.position = 'absolute';
            quad.style.top = '0';
            quad.style.left = '0';
            quad.style.width = '100%';
            quad.style.height = '100%';
            quad.style.color = '#FFD700';
            quad.style.fontFamily = 'Arial, sans-serif';
            quad.style.fontSize = '130px';
            quad.style.fontWeight = 'bold';
            quad.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.7)';
            quad.style.letterSpacing = '10px';
            quad.style.clipPath = clipPath;
            return quad;
        }

        const topLeftClip = 'polygon(0 0, 50% 0, 50% 50%, 0 50%)';
        const topRightClip = 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)';
        const bottomLeftClip = 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)';
        const bottomRightClip = 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)';

        const quadTopLeft = createQuadrant(topLeftClip);
        const quadTopRight = createQuadrant(topRightClip);
        const quadBottomLeft = createQuadrant(bottomLeftClip);
        const quadBottomRight = createQuadrant(bottomRightClip);

        quadrantContainer.appendChild(quadTopLeft);
        quadrantContainer.appendChild(quadTopRight);
        quadrantContainer.appendChild(quadBottomLeft);
        quadrantContainer.appendChild(quadBottomRight);

        setTimeout(() => {
            quadTopLeft.style.transition = 'transform 0.7s ease-out';
            quadTopRight.style.transition = 'transform 0.7s ease-out';
            quadBottomLeft.style.transition = 'transform 0.7s ease-out';
            quadBottomRight.style.transition = 'transform 0.7s ease-out';

            quadTopLeft.style.transform = 'translate(-50px, -50px)';
            quadTopRight.style.transform = 'translate(50px, -50px)';
            quadBottomLeft.style.transform = 'translate(-50px, 50px)';
            quadBottomRight.style.transform = 'translate(50px, 50px)';
        }, 50);
    }

    // Explosionseffekt
    function createExplosionEffect(container) {
        const energyCenter = document.createElement('div');
        energyCenter.style.position = 'absolute';
        energyCenter.style.top = '50%';
        energyCenter.style.left = '50%';
        energyCenter.style.width = '20px';
        energyCenter.style.height = '20px';
        energyCenter.style.borderRadius = '50%';
        energyCenter.style.backgroundColor = 'white';
        energyCenter.style.boxShadow = '0 0 30px white, 0 0 60px #FFD700';
        energyCenter.style.transform = 'translate(-50%, -50%) scale(0)';
        energyCenter.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
        container.appendChild(energyCenter);

        for (let i = 0; i < 2; i++) {
            const beam = document.createElement('div');
            beam.style.position = 'absolute';
            beam.style.top = '50%';
            beam.style.left = '50%';
            beam.style.width = '0';
            beam.style.height = '10px';
            beam.style.backgroundColor = '#FFD700';
            beam.style.boxShadow = '0 0 20px #FFD700, 0 0 40px white';
            beam.style.transform = `translate(-50%, -50%) rotate(${i === 0 ? '0deg' : '90deg'})`;
            beam.style.transformOrigin = 'center';
            beam.style.transition = 'width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2)';
            beam.style.borderRadius = '5px';
            container.appendChild(beam);

            setTimeout(() => {
                beam.style.width = '250%';
            }, 100);
        }

        setTimeout(() => {
            energyCenter.style.transform = 'translate(-50%, -50%) scale(10)';
            energyCenter.style.opacity = '0.8';
            setTimeout(() => {
                energyCenter.style.transition = 'transform 0.5s, opacity 0.5s';
                energyCenter.style.opacity = '0';
                energyCenter.style.transform = 'translate(-50%, -50%) scale(15)';
            }, 600);
        }, 100);

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            const size = 2 + Math.random() * 6;
            particle.style.position = 'absolute';
            particle.style.top = '50%';
            particle.style.left = '50%';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = '#FFD700';
            particle.style.borderRadius = '50%';
            particle.style.transform = 'translate(-50%, -50%)';
            particle.style.boxShadow = '0 0 5px #FFD700';
            particle.style.opacity = '0';
            container.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 450;
            const duration = 0.5 + Math.random() * 1;
            setTimeout(() => {
                particle.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
                particle.style.opacity = '1';
                particle.style.transform = `translate(
                    calc(-50% + ${Math.cos(angle) * distance}px), 
                    calc(-50% + ${Math.sin(angle) * distance}px)
                )`;
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        container.removeChild(particle);
                    }, duration * 1000);
                }, duration * 500);
            }, 100 + Math.random() * 300);
        }
    }

    // Slice-Animation starten
    createSliceAnimation();

    // Am Ende ausblenden
    setTimeout(() => {
        // Hier könntest du textContainer, mainText und subText 
        // zusätzlich noch einmal ausblenden, falls gewünscht
        mainText.style.transition = 'opacity 0.3s';
        subText.style.transition = 'opacity 0.3s';
        textContainer.style.transition = 'opacity 0.3s';
        mainText.style.opacity = '0';
        subText.style.opacity = '0';
        textContainer.style.opacity = '0';

        overlay.style.transition = 'opacity 0.3s';
        overlay.style.opacity = '0';

        if (callback) callback();
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }, 4800);
}

export { showJuJishoCutScene };
