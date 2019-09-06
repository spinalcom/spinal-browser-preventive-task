<template>
  <div>
    <div class="content">
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
                      @goback="goBack"></task-component>
    </div>

  </div>
</template>

<script>
import calendarComponent from "../calendar/calendarComponent.vue";
import taskComponent from "../tasks/taskComponent.vue";

export default {
  name: "appContainer",
  props: ["allData", "itemSelected"],
  components: {
    "calendar-component": calendarComponent,
    "task-component": taskComponent
  },
  data() {
    return {
      events: [],
      timer: null,
      eventSelected: null
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
    }
  },
  watch: {
    itemSelected(newValue) {
      this.getAllEvents(newValue.visitId, newValue.groupId, newValue.state);
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
}
</style>