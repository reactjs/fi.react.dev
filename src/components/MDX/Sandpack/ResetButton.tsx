/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {IconRestart} from '../../Icon/IconRestart';
export interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({onReset}: ResetButtonProps) {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={onReset}
      title="Palauta hiekkalaatikko"
      type="button">
      <IconRestart className="inline ms-1 me-1 relative" /> Palauta
    </button>
  );
}
