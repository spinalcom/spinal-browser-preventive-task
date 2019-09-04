<template>
  <div class="content">
    <div class="title">
      <div class="icon">
        <v-icon>{{icon}}</v-icon>
      </div>
      <div class="text">{{title}}</div>
    </div>

    <div class="description">
      {{description}}
    </div>

  </div>
</template>

<script>
export default {
  name: "itemComponent",
  props: {
    icon: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    className: {
      type: String
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  margin-bottom: 20px;
}

.content .title {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.icon {
  width: 20px;
  /* height: 20px; */
  margin-right: 10px;
}

.content .text {
  font-size: 0.8em;
}

.description {
  margin-left: 30px;
  font-size: 15px;
  color: gray;
  display: flex;
  align-items: center;
}
</style>