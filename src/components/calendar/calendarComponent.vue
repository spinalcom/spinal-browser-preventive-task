<template>
  <div>

    <!-- <event-dialog :showDialog="showEventDialog"
                  :selectedEvent="eventSelected"
                  @close="closeDialog"></event-dialog> -->

    <!-- events-on-month-view="short" -->

    <div class="calendar">
      <vue-cal :time="false"
               :events="events"
               :on-event-click="onEventClick"
               :disable-views="['years', 'year']"
               events-on-month-view="short"
               default-view="month"></vue-cal>
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
  mounted() {
    console.log("hello", document.getElementsByName("vuecal__event"));
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

/* .vuecal--month-view .vuecal__cell {
  height: 180px;
} */

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
  background-color: rgba(18, 228, 35, 0.9);
  color: #fff;
}

.vuecal__event.processing {
  background-color: rgba(240, 180, 16, 0.973);
  color: #fff;
}

/* .vuecal__cell-events-count {
  width: 18px;
  height: 2px;
  background: blue;
  color: transparent;
} */
</style>