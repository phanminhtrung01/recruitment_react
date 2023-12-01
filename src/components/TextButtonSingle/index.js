import PropTypes from 'prop-types';
import React, { useState, forwardRef } from 'react';
import './style.scss';

const OneOption = forwardRef(
    ({ property1, text = 'Text', styleText, styleOption }, ref) => {
        const [property, setProperty] = useState('default');
        // const [state, dispatch] = useReducer(reducer, {
        //     property1: property1 || 'default',
        // });

        return (
            <div
                style={styleOption}
                ref={ref}
                className={`one-option ${property}`}
                onMouseEnter={() => {
                    // dispatch('mouse_enter');
                    setProperty(
                        property1?.includes('selected')
                            ? 'hover selected'
                            : 'hover',
                    );
                }}
                onMouseLeave={() => {
                    // dispatch('mouse_leave');
                    setProperty('default');
                }}
                onClick={() => {
                    // dispatch('click');
                    setProperty('selected');
                }}
            >
                <div style={styleText} className="vi-c-l-m">
                    {text}
                </div>
            </div>
        );
    },
);

OneOption.propTypes = {
    property1: PropTypes.string,
    text: PropTypes.string,
    styleText: PropTypes.object,
    styleOption: PropTypes.object,
};

export default OneOption;
