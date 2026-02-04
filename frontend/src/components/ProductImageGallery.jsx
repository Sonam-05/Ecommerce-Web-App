import React, { useState } from 'react';
import './ProductImageGallery.css';

const ProductImageGallery = ({ images = [], productName }) => {
    // Ensure we always have an array, even if empty
    const safeImages = images && images.length > 0 ? images : ['/placeholder.png'];
    const [selectedImage, setSelectedImage] = useState(safeImages[0]);

    // Update selected image if props change (optional, but good for stability when data loads)
    React.useEffect(() => {
        if (images && images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]);

    return (
        <div className="product-gallery">
            <div className="main-image-container">
                <img
                    src={selectedImage}
                    alt={productName}
                    className="main-image"
                />
            </div>

            {safeImages.length > 1 && (
                <div className="thumbnails-container">
                    {safeImages.map((img, index) => (
                        <div
                            key={index}
                            className={`thumbnail-wrapper ${selectedImage === img ? 'active' : ''}`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`${productName} view ${index + 1}`}
                                className="thumbnail-image"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;
