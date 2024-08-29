// components/ButtonComponent.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

const ButtonWrapper = styled.div`
  padding: 0.5rem;
  border: 1px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease-in-out;
  &:hover {
    border: 1px dashed #a0aec0;
  }
`;

const ButtonLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: black;
  text-transform: capitalize;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const ButtonIcon = styled.div`
  border-radius: 0.375rem;
  padding: 0.25rem;
  height: 1.75rem;
  width: 1.75rem;
  color: black;
  border: ${props => props.backgroundColor === '#ffffff' ? 'none' : '0.75px solid #919EAB'};
  background-color: ${props => props.backgroundColor || '#F4F6F8'};
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.span`
  color: #111827;
  font-size: 0.875rem;
  font-weight: normal;
  line-height: 1.25;
`;

const ButtonControls = styled.div`
  display: flex;
`;

const ControlButton = styled.button`
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  width: 3.5rem;
  border: none;
  height: 1.75rem;
  padding: 0.25rem;
  gap: 0.5rem;
  color: black;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ButtonComponent = ({ component, section, index, columnIndex, emailData, handleOpenModal, handleClose }) => {
  const [isHovered, setIsHovered] = useState(false);

  const iconStyle = (hover) => ({
    color: hover ? '#015FFB' : 'black',
  });

  return (
    <ButtonWrapper>
      <ButtonLink
        href={`mailto:${emailData[section]?.[index]?.email || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ButtonIcon backgroundColor={component.backgroundColor || emailData[section]?.[index]?.backgroundColor}>
          <Icon icon="mdi:plus" width="24" height="24" />
        </ButtonIcon>
        <ButtonText>
          {emailData[section]?.[index]?.buttonText || component.text || 'Contact me'}
        </ButtonText>
      </ButtonLink>

      <ButtonControls>
        <ControlButton
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Icon
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(section, index);
            }}
            icon="fluent:edit-32-filled"
            width="18"
            height="18"
            style={iconStyle(isHovered)}
          />
          <Icon onClick={(e) => handleClose(e, section, index, columnIndex)} icon="ic:baseline-close" width="20" height="20" />
        </ControlButton>
      </ButtonControls>
    </ButtonWrapper>
  );
};

export default ButtonComponent;