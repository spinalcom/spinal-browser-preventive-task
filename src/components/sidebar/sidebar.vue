<template>
  <div class="mySidebarx md-scrollbar">
    <div class="HeaderTitle">
      Preventive tasks
    </div>

    <div class="list-visitsContext"
         v-for="(item,index) in data"
         :key="index">

      <div class="name sidebarItem"
           @click="selectItem(item)"
           :class="{'isSelected' : isSelected(item)}">

        <v-icon color="#FFF">arrow_right</v-icon>
        <div class="listName">{{item.name}}</div>

      </div>

      <div class="subItems"
           v-for="group in item.groups"
           :key="group.id">
        <div class="sidebarItem"
             @click="selectItem(item,group)"
             :class="{'isSelected' : isSelected(group)}">

          <v-icon color="#FFF">arrow_right</v-icon>
          <div class="listName">{{group.name}}</div>

        </div>

        <div class="subItems">
          <div class="sidebarItem"
               v-for="(state,index3) in group.states"
               :key="index3"
               @click="selectItem(item,group,state)"
               :class="{'isSelected' : isSelected(state)}">

            <div class="listName">{{state.name}}</div>
          </div>

        </div>
      </div>

    </div>

  </div>

</template>

<script>
export default {
  name: "appSidebar",
  data() {
    return {
      expandSingle: false,
      data: []
    };
  },
  props: ["allData", "itemSelected"],
  mounted() {
    this.data = Object.assign([], this.allData);
  },
  methods: {
    selectItem(item, group, state) {
      let params = {
        visitId: item.id,
        groupId: typeof group !== "undefined" ? group.id : undefined,
        state: typeof state !== "undefined" ? state.state : undefined,
        stateId: typeof state !== "undefined" ? state.id : undefined
      };

      this.$emit("selectItem", params);
    },
    isSelected(item) {
      if (
        this.itemSelected &&
        !this.itemSelected.groupId &&
        !this.itemSelected.state
      ) {
        return item.id === this.itemSelected.visitId;
      } else if (
        this.itemSelected &&
        this.itemSelected.groupId &&
        !this.itemSelected.state
      ) {
        return item.id === this.itemSelected.groupId;
      } else if (this.itemSelected && this.itemSelected.state) {
        return item.id === this.itemSelected.stateId;
      }
    }
  }
};
</script>

<style scoped>
.mySidebarx {
  width: 100%;
  height: 100%;
  background-color: #272727;
  overflow-x: hidden;
  overflow-y: auto;
  color: white;
}

.HeaderTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid white;
  font-size: 16px;
  background-color: gray;
  text-transform: uppercase;
}

.list-visitsContext {
  width: 100%;
  height: calc(100% - 50px);
}

.sidebarItem {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  font-size: 16px;
}

.sidebarItem:hover {
  color: gray;
  cursor: pointer;
}

.subItems {
  padding-left: 25px;
}

.listName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.isSelected {
  background-color: blue;
}
</style>