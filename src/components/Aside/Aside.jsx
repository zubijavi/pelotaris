import React from "react";
import './Aside.css';
import royal from '../../assets/Royal.png';
import dabber from '../../assets/Dabber.jpg';
import guastavino from '../../assets/Guastavino.jpeg';
import vasquito from '../../assets/Vasquito.jpg';

const Aside = ({ isShifted }) => { // Acepta la prop isShifted
    return (
        <aside className={`aside ${isShifted ? 'shifted' : ''}`}> {/* Clase condicional */}
            <img src={royal} alt="" />
            <img src={dabber} alt="" />
            <img src={guastavino} alt="" />
            <img src={vasquito} alt="" />
        </aside>
    );
};

export default Aside;
