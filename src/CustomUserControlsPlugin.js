import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin }  from '@twilio/flex-plugin';
import CustomizeFlexComponents from './init/components';

const PLUGIN_NAME = 'CustomUserControlsPlugin';

export default class CustomUserControlsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    CustomizeFlexComponents(flex, manager);
  }


}
