<template>
  <div class="mySidebarx md-scrollbar">
    <div class="HeaderTitle"
         title="Gamme de maintenance">
      Gamme de maintenance
    </div>

    <div class="sidebarContainer">
      <!-- <div class="list-visitsContext"
           v-for="(item,index) in data"
           :key="index">

        <div class="name sidebarItem"
             @click="selectItem(item)"
             :class="{'isSelected' : isSelected(item)}"
             :title="item.name">

          <v-icon>arrow_right</v-icon>
          <div class="listName">{{item.name}}</div>

        </div>

        <div class="subItems"
             v-for="group in item.groups"
             :key="group.id">
          <div class="sidebarItem"
               @click="selectItem(item,group)"
               :class="{'isSelected' : isSelected(group)}"
               :title="group.name">

            <v-icon>arrow_right</v-icon>
            <div class="listName">{{group.name}}</div>

          </div>

          <div class="subItems">
            <div class="sidebarItem"
                 v-for="(state,index3) in group.states"
                 :key="index3"
                 @click="selectItem(item,group,state)"
                 :class="{'isSelected' : isSelected(state)}"
                 :title="state.name">

              <div class="listName">{{state.name}}</div>
            </div>

          </div>
        </div>

      </div> -->
      <v-list>
        <v-list-group value="true"
                      v-for="(item,index) in data"
                      :key="index">

          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title @click.stop="selectItem(item)"
                                 :class="{'isSelected' : isSelected(item)}"
                                 :title="item.name">{{item.name}}
              </v-list-tile-title>
            </v-list-tile>
          </template>

          <v-list-group no-action
                        sub-group
                        value="true"
                        v-for="group in item.groups"
                        :key="group.id">

            <template v-slot:activator>
              <v-list-tile @click.stop="selectItem(item,group)"
                           :title="group.name"
                           :class="{'isSelected' : isSelected(group)}">
                <v-list-tile-title>{{group.name}}</v-list-tile-title>
              </v-list-tile>
            </template>

            <v-list-tile :class="{'isSelected' : isSelected(state)}"
                         v-for="(state,index3) in group.states"
                         :key="index3"
                         @click="selectItem(item,group,state)"
                         :title="state.name">
              <v-list-tile-title v-text="state.name"></v-list-tile-title>

            </v-list-tile>

          </v-list-group>

        </v-list-group>

      </v-list>
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
  },
  watch: {
    allData() {
      this.data = Object.assign([], this.allData);
    }
  }
};
</script>

<style scoped>
.mySidebarx {
  width: 100%;
  height: 100%;
  padding-top: 0px;
  /* background-color: #272727; */
  overflow-x: hidden;
  overflow-y: auto;
  /* color: white; */
}

.HeaderTitle {
  display: block;
  height: 50px;
  overflow: hidden;
  border-bottom: 1px solid white;
  font-size: 16px;
  background-color: gray;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 15px;
  padding-left: 5px;
}

.sidebarContainer {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
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
  color: rgba(240, 180, 16, 0.973);
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

div.isSelected {
  /* background-color: rgba(81, 97, 247, 0.9); */
  color: rgba(81, 97, 247, 0.9);
  font-weight: bold !important;
}
</style>

<style>
.mySidebarx.md-scrollbar .v-list__group:after,
.mySidebarx.md-scrollbar .v-list__group:before {
  height: 0px;
}
</style>