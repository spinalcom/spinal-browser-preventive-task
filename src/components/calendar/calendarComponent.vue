<template>
  <div>

    <event-dialog :showDialog="showEventDialog"
                  :selectedEvent="eventSelected"
                  @close="closeDialog"></event-dialog>

    <div class="header">

    </div>

    <div class="calendar">
      <vue-cal :time="false"
               :events="events"
               :on-event-click="onEventClick"
               events-on-month-view="short"></vue-cal>
    </div>

  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import eventDialog from "../calendarEventDialog/eventDialog.vue";
export default {
  name: "calendarComponent",
  props: ["allData", "itemSelected"],
  components: {
    "vue-cal": VueCal,
    "event-dialog": eventDialog
  },
  data() {
    return {
      events: [],
      timer: null,
      showEventDialog: false,
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
      console.log(events);
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

    onEventClick(event, e) {
      console.log(event);
      this.eventSelected = event;
      e.stopPropagation();

      this.showEventDialog = true;
    },

    closeDialog() {
      this.showEventDialog = false;
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
.header {
  width: 100%;
  height: 70px;
  background-color: gray;
  margin-bottom: 10px;
}

.calendar {
  width: 100%;
  height: calc(100% - 90px);
  border: 1px solid gray;
}
</style>

<style>
.vuecal__event {
  width: 90%;
  margin: auto;
  cursor: pointer;
  margin-top: 5px;
  padding: 5px;
}

.vuecal__event-title {
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 5px;
}

.vuecal__event.declared {
  background-color: rgba(81, 97, 247, 0.9);
  color: #fff;
}

.vuecal__event.done {
  background-color: rgba(139, 243, 148, 0.9);
  color: #fff;
}

.vuecal__event.processing {
  background-color: rgba(241, 136, 245, 0.9);
  color: #fff;
}

/* .vuecal__cell-events-count {
  width: 18px;
  height: 2px;
  background: blue;
  color: transparent;
} */
</style>