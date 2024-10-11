// src/components/Carousel/Carousel.jsx
import React, { useState, useEffect } from 'react';
import './Carousel.css'; // Asegúrate de tener este archivo CSS
import royal from '../../assets/Royal.png'
import dabber from '../../assets/Dabber.jpg'
import guastavino from '../../assets/Guastavino.jpeg'
import vasquito from '../../assets/Vasquito.jpg'

const Carousel = ({ isShifted }) => {
    const slides = [
        {
            id: 1,
            title: "Slide 1",
            description: "Descripción del Slide 1",
            image: royal,
        },
        {
            id: 2,
            title: "Slide 2",
            description: "Descripción del Slide 2",
            image: dabber,
        },
        {
            id: 3,
            title: "Slide 3",
            description: "Descripción del Slide 3",
            image: guastavino,
        },
        {
            id: 4,
            title: "Slide 4",
            description: "Descripción del Slide 3",
            image: vasquito,
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Cambiar imagen automáticamente cada 1.5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2500); // 1.5 segundos

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, [currentSlide]);

    return (
        <div 
            className={`carousel ${isShifted ? 'shifted' : ''}`} 
            style={{ backgroundImage: `url(${slides[currentSlide].image})`, 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center' }} 
        >
            {/* <button onClick={prevSlide} className="carousel-button prev">❮</button> */}
            {/* <button onClick={nextSlide} className="carousel-button next">❯</button> */}
        </div>
        
    );
};

export default Carousel;
