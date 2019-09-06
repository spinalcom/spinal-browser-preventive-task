<template>
  <div>

    <!-- <event-dialog :showDialog="showEventDialog"
                  :selectedEvent="eventSelected"
                  @close="closeDialog"></event-dialog> -->

    <div class="calendar">
      <vue-cal :time="false"
               :events="events"
               :on-event-click="onEventClick"
               events-on-month-view="short"
               :disable-views="['years', 'year']"></vue-cal>
    </div>

  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
// import eventDialog from "../calendarEventDialog/eventDialog.vue";

export default {
  name: "calendarComponent",
  props: ["allData", "itemSelected", "events", "eventSelected"],
  components: {
    "vue-cal": VueCal
    // "event-dialog": eventDialog
  },
  data() {
    return {
      showEventDialog: false
    };
  },
  methods: {
    onEventClick(event, e) {
      e.stopPropagation();
      this.$emit("selectEvent", event);
      // this.showEventDialog = true;
    }

    // closeDialog() {
    //   this.showEventDialog = false;
    // }
  }
};
</script>

<style scoped>
.calendar {
  width: 100%;
  height: 98%;
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