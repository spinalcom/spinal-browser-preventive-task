import spinalVisitService from "spinal-env-viewer-task-service";

import {
  spinalIO
} from "../spinalIO";

import {
  FileSystem
} from "spinal-core-connectorjs_type";

import {
  SpinalGraphService
} from 'spinal-env-viewer-graph-service';


export default class DataService {

  constructor() {
    this.initPromise = null;
  }

  async init(graph) {
    if (this.initPromise !== null) return this.initPromise;
    const func = async (resolve, reject) => {
      try {
        let graphID = await SpinalGraphService.setGraph(graph);
        resolve(graphID);
      } catch (e) {
        reject(e);
      }
    };
    this.initPromise = new Promise(func);
    return this.initPromis
  }

  getDigiDigitaltwinName() {
    let argPath = spinalIO.getModelPath().split("/");
    return argPath[argPath.length - 1];
  }

  getVisitEventStates() {
    return spinalVisitService.EVENT_STATES;
  }

  getVisitsTypesContext() {
    let visitTypes = spinalVisitService.VISITS;

    return visitTypes
      .map(argVisitType => {
        let context = SpinalGraphService.getContext(argVisitType.name);

        return typeof context !== "undefined" ? context.info.get() :
          undefined;
      })
      .filter(el => typeof el !== "undefined");
  }

  getVisitGroups(visitType) {
    return spinalVisitService.getVisitGroups(visitType);
  }

  getGroupsEvent(groupId, visitTypes) {
    return spinalVisitService.getGroupEvents(groupId, visitTypes);
  }

  getGroupVisits(groupId, visitType) {
    return spinalVisitService
      .getGroupVisits(groupId, visitType)
  }

  async getAllData() {
    // await graph.init();


    let res = this.getVisitsTypesContext().map(async visitContext => {
      let groups = await this.getGroups(visitContext);
      visitContext["groups"] = await Promise.all(groups);

      return visitContext;
    });

    return Promise.all(res);

  }

  getGroups(visitContext) {
    return this.getVisitGroups(visitContext.type).then(groups => {
      return groups.map(async group => {
        let events = await this.getGroupEvents(group.id,
          visitContext.type);
        let states = await this.getGroupEventStates(visitContext.id,
          group.id);

        let visits = await this.getGroupVisits(group.id,
          visitContext.type);

        group["events"] = typeof events !== "undefined" ? events :
        [];

        group["visits"] = typeof visits !== "undefined" ? visits
          .get().map(el => el.info) : [];

        group["states"] = typeof states !== "undefined" ? states :
        [];



        return group;
      });
    });
  }

  getGroupEventStates(contextId, groupId) {
    return spinalVisitService.getGroupEventStates(contextId, groupId).then(
      states => {
        return states.map(el => el.get())
      });
  }


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

  getVisitInfoById(contextId, groupId, visitId) {

    let info = SpinalGraphService.getInfo(visitId);

    if (typeof info !== "undefined") return Promise.resolve(info.get());

    let context = SpinalGraphService.getInfo(contextId);
    let groupInfo = SpinalGraphService.getInfo(groupId);

    if (typeof groupInfo !== "undefined") {
      return spinalVisitService.getGroupVisits(groupId, context.type.get())
        .then(
          res => {

            for (let index = 0; index < res.length; index++) {
              const id = res[index].info.id.get();
              if (id === visitId) {
                return res[index].info.get();
              }

            }
            return undefined;
          })
    }


    // return info ? info.get() : undefined
  }

  getEventTasks(eventId) {
    return spinalVisitService.getEventTasks(eventId).then(tasks => {
      return tasks;
    });
  }

  validateTask(contextId, taskId, groupId, eventId) {
    return spinalVisitService.validateTask(contextId, groupId, eventId,
      taskId);
  }

  getAllUser() {
    return spinalIO.getAlluser();
  }

  sendMessage(taskId, messageContent) {
    let user = FileSystem._userid;

    return spinalVisitService.addComment(taskId, user, messageContent);
  }

  getMessage(taskId) {
    return spinalVisitService.getTasksComments(taskId);
  }

}