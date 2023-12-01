import React from 'react';

const ImageGrid = ({ images }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gridAutoRows: '200px',
                gridGap: '10px',
            }}
        >
            {images.map((image, index) => (
                <div
                    key={index}
                    style={{
                        background: index % 2 === 0 ? '#eee' : '#ddd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={image}
                        alt="Logo"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
