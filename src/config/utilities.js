import spinalVisitService from "spinal-env-viewer-task-service";
import graph from "./GraphService";

let SpinalGraphService = graph.SpinalGraphService;

let utilities = {

  getVisitEventStates() {
    return spinalVisitService.EVENT_STATES;
  },

  getVisitsTypesContext() {
    let visitTypes = spinalVisitService.VISITS;

    return visitTypes
      .map(argVisitType => {
        let context = SpinalGraphService.getContext(argVisitType.name);

        return typeof context !== "undefined" ? context.info.get() :
          undefined;
      })
      .filter(el => typeof el !== "undefined");
  },

  getVisitGroups(visitType) {
    return spinalVisitService.getVisitGroups(visitType);
  },

  getGroupsEvent(groupId, visitTypes) {
    return spinalVisitService.getGroupEvents(groupId, visitTypes);
  },

  async getAllData() {
    await graph.init();
    let res = this.getVisitsTypesContext().map(async visitContext => {
      let groups = await this.getGroups(visitContext.type);
      visitContext["groups"] = await Promise.all(groups);

      return visitContext;
    });

    return Promise.all(res);

  },

  getGroups(visitType) {
    return this.getVisitGroups(visitType).then(groups => {
      return groups.map(async group => {
        let events = await this.getGroupEvents(group.id, visitType);
        group["events"] = typeof events !== "undefined" ? events :
        [];

        return group;
      });
    });
  },

  getGroupEvents(groupId, visitType) {
    return Promise.all(this.getGroupsEvent(groupId, visitType)).then(res => {
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        if (element.hasOwnProperty(visitType)) {
          return element[visitType];
        }
      }
    });
  }
};

export default utilities;