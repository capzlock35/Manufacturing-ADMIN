// src/components/SliderCaptcha.js
import React, { useState, useRef, useEffect } from 'react';

const SliderCaptcha = ({ onVerified }) => {
    const [sliderValue, setSliderValue] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const sliderTrackRef = useRef(null);
    const sliderThumbRef = useRef(null);

    const targetPosition = 80; // Percentage position to verify

    useEffect(() => {
        if (sliderValue >= targetPosition && !isVerified) {
            setIsVerified(true);
            onVerified(true); // Notify parent component that CAPTCHA is verified
        } else if (sliderValue < targetPosition && isVerified) {
            setIsVerified(false);
            onVerified(false); // Notify parent component that CAPTCHA is no longer verified
        }
    }, [sliderValue, isVerified, onVerified]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (!isVerified) {
            setSliderValue(0); // Reset slider if not verified on mouse up
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        if (!isVerified) {
            setSliderValue(0); // Reset slider if mouse leaves and not verified
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        if (!sliderTrackRef.current || !sliderThumbRef.current) return;

        const trackRect = sliderTrackRef.current.getBoundingClientRect();
        const thumbRect = sliderThumbRef.current.getBoundingClientRect();
        const mouseX = e.clientX;

        let newSliderValue = ((mouseX - trackRect.left) / trackRect.width) * 100;

        // Keep slider within bounds (0-100%)
        newSliderValue = Math.max(0, Math.min(100, newSliderValue));

        setSliderValue(newSliderValue);
    };

    return (
        <div className="slider-captcha-container">
            <div
                className="slider-track"
                ref={sliderTrackRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="slider-thumb"
                    ref={sliderThumbRef}
                    style={{ left: `${sliderValue}%` }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <div className="slider-icon">→</div> {/* Right arrow icon */}
                </div>
                <div
                    className="slider-target"
                    style={{ left: `${targetPosition}%` }}
                >
                    ✓ {/* Checkmark icon */}
                </div>
            </div>
            <p className="slider-text">Slide to Verify</p>
            {isVerified && <p className="slider-verified-text">Verified!</p>}
        </div>
    );
};

export default SliderCaptcha;