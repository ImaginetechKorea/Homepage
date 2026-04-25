(function () {
    let state = null;

    function buildOptions(options) {
        const baseOptions = {
            preset: 'main',
            radiusRatio: 0.264,
            xRatio: 0.5,
            yRatio: 0.5,
            rotationSpeed: -0.3,
            starCount: 200,
            starRotationSpeed: -0.00018,
            starPoleXRatio: 0.5,
            starPoleYRatio: 0.12,
            showMoon: true,
            showMoonOrbit: false,
            moonOrbitRadiusRatio: 1.95,
            moonRadiusRatio: 0.06,
            moonOrbitTilt: 0.45,
            moonSpeed: -0.0012
        };

        return {
            ...baseOptions,
            canvasId: 'matrixCanvas',
            texturePath: './image/earth-texture.jpg',
            ...options
        };
    }

    function createStars(count, width, height, options) {
        const poleX = width * options.starPoleXRatio;
        const poleY = height * options.starPoleYRatio;

        return Array.from({ length: count }, () => {
            const x = Math.random() * width;
            const y = Math.random() * height;

            return {
                baseAngle: Math.atan2(y - poleY, x - poleX),
                orbitRadius: Math.hypot(x - poleX, y - poleY),
                driftFactor: 0.7 + Math.random() * 0.6,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.8 + 0.2,
                twinkle: Math.random() * Math.PI * 2
            };
        });
    }

    function ensureCanvas(canvasId) {
        let canvas = document.getElementById(canvasId);
        if (canvas) {
            return canvas;
        }

        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        document.body.appendChild(canvas);
        return canvas;
    }

    function resizeScene() {
        if (!state) {
            return;
        }

        const { canvas, options } = state;
        const cssWidth = window.innerWidth;
        const cssHeight = window.innerHeight;
        const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = Math.round(cssWidth * devicePixelRatio);
        canvas.height = Math.round(cssHeight * devicePixelRatio);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        state.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

        state.earthRadius = Math.min(cssWidth, cssHeight) * options.radiusRatio;
        state.earthX = cssWidth * options.xRatio;
        state.earthY = cssHeight * options.yRatio;
        state.moonOrbitRadius = state.earthRadius * options.moonOrbitRadiusRatio;
        state.moonRadius = state.earthRadius * options.moonRadiusRatio;
        state.stars = createStars(options.starCount, cssWidth, cssHeight, options);
    }

    function drawStars() {
        const poleX = window.innerWidth * state.options.starPoleXRatio;
        const poleY = window.innerHeight * state.options.starPoleYRatio;

        state.stars.forEach((star) => {
            const angle = star.baseAngle + state.starFieldRotation * star.driftFactor;
            const starX = poleX + Math.cos(angle) * star.orbitRadius;
            const starY = poleY + Math.sin(angle) * star.orbitRadius;
            const alpha = star.brightness * (0.5 + 0.5 * Math.sin(star.twinkle));
            state.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            state.ctx.beginPath();
            state.ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
            state.ctx.fill();
            star.twinkle += 0.02;
        });
    }

    function drawMoonOrbit() {
        if (!state.options.showMoon || !state.options.showMoonOrbit) {
            return;
        }

        state.ctx.save();
        state.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        state.ctx.lineWidth = Math.max(1, state.earthRadius * 0.004);
        state.ctx.setLineDash([6, 10]);
        state.ctx.beginPath();
        state.ctx.ellipse(
            state.earthX,
            state.earthY,
            state.moonOrbitRadius,
            state.moonOrbitRadius * state.options.moonOrbitTilt,
            0,
            0,
            Math.PI * 2
        );
        state.ctx.stroke();
        state.ctx.restore();
    }

    function getMoonPosition() {
        return {
            x: state.earthX + Math.cos(state.moonAngle) * state.moonOrbitRadius,
            y: state.earthY + Math.sin(state.moonAngle) * state.moonOrbitRadius * state.options.moonOrbitTilt,
            isBehindEarth: Math.sin(state.moonAngle) < 0
        };
    }

    function drawMoon() {
        if (!state.options.showMoon) {
            return;
        }

        const { x, y } = getMoonPosition();
        const radius = state.moonRadius;
        const ctx = state.ctx;

        ctx.save();

        const moonGlow = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 1.8);
        moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
        moonGlow.addColorStop(0.4, 'rgba(210, 220, 235, 0.08)');
        moonGlow.addColorStop(1, 'rgba(210, 220, 235, 0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        const moonGradient = ctx.createRadialGradient(
            x - radius * 0.35,
            y - radius * 0.4,
            radius * 0.15,
            x,
            y,
            radius
        );
        moonGradient.addColorStop(0, '#f1f3f5');
        moonGradient.addColorStop(0.5, '#c8ced8');
        moonGradient.addColorStop(1, '#717985');
        ctx.fillStyle = moonGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(90, 96, 108, 0.26)';
        [
            { offsetX: -0.28, offsetY: -0.1, radius: 0.16 },
            { offsetX: 0.18, offsetY: 0.22, radius: 0.12 },
            { offsetX: 0.06, offsetY: -0.3, radius: 0.09 }
        ].forEach((crater) => {
            ctx.beginPath();
            ctx.arc(
                x + radius * crater.offsetX,
                y + radius * crater.offsetY,
                radius * crater.radius,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });

        const moonShadow = ctx.createLinearGradient(x - radius, y, x + radius, y);
        moonShadow.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
        moonShadow.addColorStop(0.55, 'rgba(0, 0, 0, 0.05)');
        moonShadow.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
        ctx.fillStyle = moonShadow;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = Math.max(1, radius * 0.08);
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.02, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    function drawEarth() {
        const { ctx, earthX, earthY, earthRadius, earthImg, earthTextureLoaded } = state;

        ctx.save();
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
        ctx.clip();

        if (earthTextureLoaded && earthImg.naturalWidth > 0) {
            const textureHeight = earthRadius * 2;
            const textureWidth = textureHeight * (earthImg.naturalWidth / earthImg.naturalHeight);
            const wrappedOffset = (state.earthRotation % textureWidth + textureWidth) % textureWidth;
            const startX = earthX - textureWidth / 2 - wrappedOffset;
            const drawY = earthY - textureHeight / 2;

            ctx.drawImage(earthImg, startX, drawY, textureWidth, textureHeight);
            ctx.drawImage(earthImg, startX + textureWidth, drawY, textureWidth, textureHeight);
            ctx.drawImage(earthImg, startX - textureWidth, drawY, textureWidth, textureHeight);
        } else {
            const gradient = ctx.createRadialGradient(earthX, earthY, 0, earthX, earthY, earthRadius);
            gradient.addColorStop(0, '#4A90E2');
            gradient.addColorStop(0.7, '#2E5C8A');
            gradient.addColorStop(1, '#1A4B7C');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        const shadowGradient = ctx.createLinearGradient(earthX - earthRadius, earthY, earthX + earthRadius, earthY);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
        shadowGradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.12)');
        shadowGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.38)');
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const atmosphereGradient = ctx.createRadialGradient(
            earthX,
            earthY,
            earthRadius * 0.95,
            earthX,
            earthY,
            earthRadius * 1.1
        );
        atmosphereGradient.addColorStop(0, 'rgba(150, 210, 255, 0)');
        atmosphereGradient.addColorStop(0.42, 'rgba(150, 210, 255, 0.06)');
        atmosphereGradient.addColorStop(0.74, 'rgba(130, 200, 255, 0.16)');
        atmosphereGradient.addColorStop(1, 'rgba(90, 170, 235, 0)');
        ctx.fillStyle = atmosphereGradient;
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRadius * 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(170, 220, 255, 0.22)';
        ctx.lineWidth = Math.max(1.5, earthRadius * 0.012);
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRadius * 1.01, 0, Math.PI * 2);
        ctx.stroke();
    }

    function animate() {
        if (!state) {
            return;
        }

        const { ctx, canvas, options } = state;
        const spaceGradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) / 2
        );
        spaceGradient.addColorStop(0, '#000408');
        spaceGradient.addColorStop(0.5, '#0a0a1e');
        spaceGradient.addColorStop(1, '#000000');
        ctx.fillStyle = spaceGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawStars();
        drawMoonOrbit();

        if (options.showMoon && getMoonPosition().isBehindEarth) {
            drawMoon();
        }

        drawEarth();

        if (options.showMoon && !getMoonPosition().isBehindEarth) {
            drawMoon();
        }

        state.earthRotation += options.rotationSpeed;
        state.starFieldRotation += options.starRotationSpeed;
        if (options.showMoon) {
            state.moonAngle += options.moonSpeed;
        }

        state.animationId = requestAnimationFrame(animate);
    }

    function startScene() {
        if (!state) {
            return;
        }

        if (state.animationId) {
            cancelAnimationFrame(state.animationId);
        }

        if (state.earthImg.complete && state.earthImg.naturalWidth > 0) {
            state.earthTextureLoaded = true;
            animate();
        } else {
            state.earthTextureLoaded = false;
            state.earthImg.onload = () => {
                if (!state) {
                    return;
                }
                state.earthTextureLoaded = true;
                animate();
            };
            state.earthImg.onerror = () => {
                if (!state) {
                    return;
                }
                state.earthTextureLoaded = false;
                animate();
            };
            state.earthImg.src = state.options.texturePath;
        }
    }

    function initEarthScene(options = {}) {
        const mergedOptions = buildOptions(options);

        if (state && state.animationId) {
            cancelAnimationFrame(state.animationId);
        }
        if (state && state.resizeHandler) {
            window.removeEventListener('resize', state.resizeHandler);
        }

        const canvas = ensureCanvas(mergedOptions.canvasId);
        const ctx = canvas.getContext('2d');

        state = {
            options: mergedOptions,
            canvas,
            ctx,
            earthImg: new Image(),
            earthTextureLoaded: false,
            earthRotation: 0,
            starFieldRotation: 0,
            moonAngle: 0,
            animationId: null,
            stars: []
        };

        state.earthImg.crossOrigin = 'anonymous';
        state.resizeHandler = resizeScene;
        window.addEventListener('resize', state.resizeHandler);
        resizeScene();
        startScene();
    }

    window.initEarthScene = initEarthScene;
})();