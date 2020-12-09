import { css } from 'styled-components';
import { rem } from 'polished';

export const $Helpers = css`
  ${({ mright }) => mright && `margin-right: ${rem(`${mright}px`)}`};
  ${({ mleft }) => mleft && `margin-left: ${rem(`${mleft}px`)}`};
`;
