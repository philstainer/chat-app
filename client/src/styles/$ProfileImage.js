import styled from 'styled-components';
import { rem } from 'polished';

import { $Helpers } from './$Helpers';

export const $ProfileImage = styled.img`
  height: ${({ size }) => (size ? rem(`${size}px`) : rem('60px'))};

  width: auto;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;

  ${$Helpers}
`;
$ProfileImage.displayName = '$ProfileImage';
