import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { wrap } from 'popmotion';
import './style.scss';

const Carousel = ({images, isAutoPlay = true, isHoverStop = true }) => {
    

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const swipeConfidenceThreshold = 10000;

    const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

    const [[page, direction], setPage] = useState([0, 0]);
    const [isHover, setIsHover] = useState(isHoverStop);

    const imageIndex = wrap(0, images.length, page);

    useEffect(() => {
        if (isAutoPlay && !isHover) {
            const timer = setInterval(() => {
                paginate(1);
            }, 3000);

            return () => {
                clearInterval(timer);
            };
        }
    });

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    return (
        <div className="carousel">
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    className="image-carousel"
                    key={page}
                    src={images[imageIndex].url}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 100, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onHoverStart={(e, i) => {
                        setIsHover(true);
                        console.log('Hover Start: ' + isHover);
                    }}
                    onHoverEnd={(e, i) => {
                        setIsHover(false);
                        console.log('Hover End: ' + isHover);
                    }}
                    onDragEnd={(e, { offset, velocity }) => {
                        if (!isAutoPlay) {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }
                    }}
                />
            </AnimatePresence>
            <div style={{ display: isAutoPlay ? 'none' : '' }}>
                <div className="next" onClick={() => paginate(1)}>
                    {'‣'}
                </div>
                <div className="prev" onClick={() => paginate(-1)}>
                    {'‣'}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
