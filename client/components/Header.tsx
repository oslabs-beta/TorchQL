import React from 'react'
import { useSpring, animated } from 'react-spring';

export const Header: React.FC = () => {
  const fade = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <animated.div style={fade} className="header-container">
      <img className="logo" src="https://i.ibb.co/v4vv3SF/torchql-logo.png" alt=""/>
    </animated.div>
  )
}
