import React from 'react';
import styled from 'styled-components';
import snowyGround from '../../images/Snowy Ground.png';

const GroundContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 30vh;
  overflow: hidden;
  z-index: 0;
  display: flex;
  align-items: flex-start;
`;

const SnowyGround: React.FC = () => {
  return (
    <GroundContainer>
      <img 
        src={snowyGround}
        alt="Snowy Ground"
        style={{
          width: '100%',
          height: '100%',

          objectPosition: 'center bottom',
        }}
      />
    </GroundContainer>
  );
};

export default SnowyGround; 