<template>
  <div class="messageContainer">
    <div class="header">
      <div class="userName">{{owner}}</div>
      <div class="time"> {{time | dateFilter}}</div>
    </div>
    <div class="content">
      {{content}}
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "messageItem",
  props: ["time", "content", "owner"],
  filters: {
    dateFilter: function(value) {
      if (!value) return "11h30";

      return moment(value).format("MMMM Do YYYY, h:mm:ss a");
    }
  }
};
</script>

<style  scoped>
.messageContainer {
  width: 95%;
  min-height: 50px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  padding: 15px;
  font-size: 1.2em;
  margin-bottom: 20px;
  /* background: #ddd; */
}

.messageContainer .header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.messageContainer .header .userName {
  font-weight: bold;
}

.messageContainer .header .time {
  color: #999;
  font-size: 0.8em;
}

.messageContainer .content {
  text-align: justify;
}
</style>

