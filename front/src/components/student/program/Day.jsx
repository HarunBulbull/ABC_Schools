import './Program.css'
import React from 'react';

function Day({info}) {
    return (
        <div className="programDay">
            <b>{info.day}</b>
            {info.lessons.map((l,k) => (
                <p key={k}>{l}</p>
            ))}
        </div>
    )
}

export default Day
