import styled from 'styled-components';

import { $Helpers } from './$Helpers';

import { ArrowLeft, Video, Phone } from 'react-feather';

export const $Icons = styled.div``;

$Icons.Video = styled(Video)`
  ${({ theme, color }) => color && `stroke: ${theme?.[color]}`};
  ${$Helpers}
`;

$Icons.Phone = styled(Phone)`
  ${({ theme, color }) => color && `stroke: ${theme?.[color]}`};
  ${$Helpers}
`;

$Icons.ArrowLeft = styled(ArrowLeft)`
  ${({ theme, color }) => color && `stroke: ${theme?.[color]}`};
  ${$Helpers}
`;
