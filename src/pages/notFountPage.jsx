import React from 'react';
import '../styles/notFoundPage.css';

export default function NotFoundPage() {
    function random(x, y) {
        return x + Math.random() * (y - x);
    }

    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push(
            <div
                key={i}
                className="star"
                style={{
                    top: `${random(0, 100)}%`,
                    left: `${random(0, 100)}%`,
                }}
            />
        );
    }

    return (
        <div className="not-found-page">
            {stars}
            <h1>Пусто как в космосе</h1>
        </div>
    );
}