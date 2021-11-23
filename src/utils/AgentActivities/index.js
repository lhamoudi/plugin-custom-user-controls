import * as Flex from '@twilio/flex-ui';
import { sortBy } from 'lodash';
import { ActivitySettings } from '../../enums';

class AgentActivities {

  constructor() {
    this.manager = Flex.Manager.getInstance();
    // const { agentActivityRules } = this.manager.serviceConfiguration.ui_attributes;
    // this.config = agentActivityRules;

    // Alternative implementation from using Flex Configuration object - use constants
    this.config = new Map(Object.entries(ActivitySettings));
  }

  // NOTE: This will hide any TR activities that are NOT set in the flex config
  // So make sure the deployed flex config contains all activities you'd like to appear in this menu
  getCSSConfig() {
    const { flex } = this.manager.store.getState();
    const { worker: { attributes }, activities } = flex.worker;
    const { routing = { skills: [], levels: {} } } = attributes;
    const skills = routing.skills || [];

    // NOTE: This will hide any TR activities that are NOT set in the config or for which 
    // the agent is not skilled
    return Array.from(activities.values()).reduce((results, activity, idx) => {
      // default the cssConfig to hide this element
      let cssConfig = { idx, display: 'none', order: idx };
      const activitySetting = this.config.get(activity.name);
      if (activitySetting) {
        const { requiredSkill, sortOrder } = activitySetting;
        if (!requiredSkill || skills.includes(requiredSkill)) {
          // show the activity
          cssConfig.display = 'flex';
        }
        // set the order of the activity
        cssConfig.order = sortOrder;
      }
      // return the element with all previous results into one array
      return [...results, cssConfig];
    }, []);
  }


  // NOTE: This will hide any TR activities that are NOT set in the flex config
  // So make sure the deployed flex config contains all activities you'd like to appear in this menu
  getEligibleActivities(worker) {
    const { flex } = this.manager.store.getState();
    const { worker: { attributes }, activities } = flex.worker;
    const { routing = { skills: [], levels: {} } } = attributes;
    let skills = routing.skills || [];

    if (worker) {
      const { routing: agentRouting = { skills: [], levels: {} } } = worker.attributes;
      skills = agentRouting.skills || [];
    }
    const eligibleSkills = Array.from(activities.values()).reduce((results, activity) => {
      const activitySetting = this.config.get(activity.name);
      if (activitySetting) {
        const { requiredSkill, sortOrder } = activitySetting;
        if (!requiredSkill || skills.includes(requiredSkill)) {
          return [...results, { sortOrder, activity }];
        }
      }
      return results;
    }, []);

    return sortBy(eligibleSkills, 'sortOrder').map(result => result.activity);
  }
}

export default new AgentActivities();
