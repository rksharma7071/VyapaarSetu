import React from 'react'

function Loading() {
    return (
        <div className="loader-overlay">
            <div className="loader"></div>

            <style>{`
                .loader-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                background: rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                }

                .loader {
                width: 50px;
                aspect-ratio: 1;
                border-radius: 50%;
                background:
                    radial-gradient(farthest-side, #ffa516 94%, transparent) top/8px 8px no-repeat,
                    conic-gradient(transparent 30%, #ffa516);
                -webkit-mask: radial-gradient(
                    farthest-side,
                    transparent calc(100% - 8px),
                    #000 0
                );
                animation: spin 1s infinite linear;
                }

                @keyframes spin {
                100% {
                    transform: rotate(1turn);
                }
                }
            `}</style>
        </div>
    )
}

export default Loading;
