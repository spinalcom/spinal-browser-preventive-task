<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="content">
    <!-- <export-dialog
      :showDialog="showExportDialog"
      :data="allData"
      @close="closeExportDialog"
    ></export-dialog> -->

    <div class="_container"
         :class="{ sidebarHidden: !showSidebar }">
      <div class="header">
        <!-- <v-btn outline
               color="indigo"
               @click="loader = 'loading3'">
          <v-icon left
                  dark>file_download</v-icon>
          Import
        </v-btn> -->

        <v-btn outline
               color="indigo"
               @click="openExportDialog">
          <v-icon left
                  dark>open_in_browser</v-icon>
          Export
        </v-btn>

        <v-btn flat
               icon>
          <v-icon @click="expandOrHideSidebar">list</v-icon>
        </v-btn>
      </div>
      <calendar-component v-if="!eventSelected"
                          class="calendar"
                          :allData="allData"
                          :itemSelected="itemSelected"
                          :events="events"
                          :eventSelected="eventSelected"
                          @selectEvent="onEventSelect"></calendar-component>

      <task-component v-if="eventSelected"
                      :allData="allData"
                      :itemSelectedInSidebar="itemSelected"
                      :eventSelected="eventSelected"
                      @goback="goBack"
                      @reload="reloadAllData"></task-component>
    </div>

    <div class="sidebar"
         v-if="showSidebar">
      <calendar-sidebar :allData="allData"
                        :itemSelected="itemSelected"
                        @selectItem="selectItem"></calendar-sidebar>
    </div>
  </div>
</template>

<script>
import calendarComponent from "../calendar/calendarComponent.vue";
import taskComponent from "../tasks/taskComponent.vue";
import CalendarSidebar from "../calendar/sidebar.vue";
import ExportDialog from "../exports/exportDialog.vue";

export default {
  name: "appContainer",
  props: ["allData", "itemSelected"],
  components: {
    "calendar-component": calendarComponent,
    "task-component": taskComponent,
    "calendar-sidebar": CalendarSidebar,
    "export-dialog": ExportDialog
  },
  data() {
    return {
      events: [],
      timer: null,
      eventSelected: null,
      showSidebar: true,
      showExportDialog: false
    };
  },
  methods: {
    getAllEvents(visitId, groupId, state) {
      let visitContext = this.allData.find(el => el.id === visitId);

      if (typeof visitContext !== "undefined") {
        let groups = this.getGroup(visitContext, groupId);
        let events = groups.map(group => {
          return this.getGroupEvent(group, state);
        });

        this.events = events.flat();
      }
    },

    getGroup(visitContext, groupId) {
      if (typeof groupId === "undefined") return visitContext.groups;

      return visitContext.groups.filter(el => el.id === groupId);
    },

    getGroupEvent(group, state) {
      if (typeof state !== "undefined")
        return this.formatEventForCalendar(group.events[state], group.color);

      let events = [
        ...group.events["declared"],
        ...group.events["processing"],
        ...group.events["done"]
      ];

      return this.formatEventForCalendar(events, group.color);
    },

    formatEventForCalendar(events, color) {
      return events.map(el => {
        return {
          eventId: el.id,
          visitId: el.visitId,
          groupId: el.groupId,
          contextId: this.itemSelected.visitId,
          color: color,
          start: this.formatDate(el.date),
          end: this.formatDate(el.date),
          title: el.name,

          //content: '<i class="v-icon material-icons">calendar_today</i>',
          class: el.state
        };
      });
    },

    formatDate(argDate) {
      let date = new Date(argDate);

      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    onEventSelect(val) {
      this.eventSelected = val;
    },

    goBack() {
      this.eventSelected = null;
    },

    reloadAllData() {
      this.$emit("reload");
    },

    expandOrHideSidebar() {
      this.showSidebar = !this.showSidebar;
    },

    selectItem(res) {
      this.$emit("selectItem", res);
    },

    openExportDialog() {
      this.showExportDialog = true;
    },

    closeExportDialog() {
      this.showExportDialog = false;
    }
  },
  watch: {
    itemSelected(newValue) {
      this.getAllEvents(newValue.visitId, newValue.groupId, newValue.state);
      this.eventSelected = null;
    },
    allData() {
      if (this.itemSelected) {
        this.getAllEvents(
          this.itemSelected.visitId,
          this.itemSelected.groupId,
          this.itemSelected.state
        );
      }
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
}

.content ._container {
  width: 75%;
  height: 100%;
}

.content ._container.sidebarHidden {
  width: 100%;
  height: 100%;
}

.content ._container .header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
}

.content .sidebar {
  width: 25%;
  height: 100%;
}
</style>
