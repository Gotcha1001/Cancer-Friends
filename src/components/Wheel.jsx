import React, { useState, useCallback, useEffect } from 'react';
import './Wheel.css';

const Wheel = ({ items, onSpinComplete }) => {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const handleSpin = useCallback(() => {
        if (spinning) return;

        const numItems = items.length;
        const turns = 5 + Math.floor(Math.random() * numItems);
        const spinAngle = 360 * turns + Math.floor(Math.random() * 360);

        setRotation(spinAngle);
        setSpinning(true);

        const durationInMs = 3000; // 3 seconds for spin duration
        setTimeout(() => {
            const normalizedRotation = spinAngle % 360;
            const itemAngle = 360 / numItems;
            const selectedIndex = Math.floor((normalizedRotation + itemAngle / 2) / itemAngle) % numItems;

            setSpinning(false);

            if (onSpinComplete) {
                onSpinComplete(selectedIndex);
            }
        }, durationInMs);
    }, [spinning, items.length, onSpinComplete]);

    useEffect(() => {
        console.log(`Rotation angle: ${rotation}`);
    }, [rotation]);

    // Define an array of colors for each slice
    const sliceColors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC300',
        '#DAF7A6', '#900C3F', '#581845', '#C70039'
    ];

    return (
        <div className="wheel-container">
            <div className="marker"></div>
            <div
                className={`wheel ${spinning ? 'spinning' : ''}`}
                onClick={handleSpin}
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: '3s',
                }}
            >
                {items.map((item, index) => {
                    const angle = (360 / items.length) * index;
                    const color = sliceColors[index % sliceColors.length];

                    return (
                        <div
                            key={index}
                            className="wheel-item"
                            style={{
                                '--item-nb': index,
                                '--slice-color': color,
                                transform: `rotate(${angle}deg)`,
                            }}
                        >
                            <span>{item}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wheel;
