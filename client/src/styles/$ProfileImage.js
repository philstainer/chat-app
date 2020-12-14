import styled from 'styled-components';
import { rem } from 'polished';

import { $Helpers } from './$Helpers';

export const $ProfileImage = styled.img`
  height: ${({ size }) => (size ? rem(`${size}px`) : rem('62px'))};

  border: 2px solid ${({ theme }) => theme?.background};

  width: auto;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;

  ${({ index }) => index && `z-index: ${index};`};

  ${$Helpers}
`;
$ProfileImage.displayName = '$ProfileImage';
