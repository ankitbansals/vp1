import { Component } from '~/lib/makeswift/component';
import { ReactNode } from 'react';

import { BaseColors } from './base-colors';
import { COMPONENT_TYPE } from './register';

interface Props {
  children?: ReactNode;
  snapshotId?: string;
  label?: string;
}

export const SiteTheme = ({
  snapshotId = 'site-theme',
  label = 'Site Theme',
  children,
}: Props) => (
  <>
    <BaseColors />
    <Component label={label} snapshotId={snapshotId} type={COMPONENT_TYPE} />
    {children}
  </>
);
