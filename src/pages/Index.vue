<template>
  <div class="container">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="index"
        @click.stop="() => _handleClick(item)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "PageIndex",
  mounted() {
    ipcRenderer.on("setLog", this.logFn);
  },
  data() {
    return {
      data: [
        {
          name: "知乎",
          url: "https://www.zhihu.com/",
          username: "18280689542",
        },
      ],
    };
  },
  methods: {
    logFn(e, args) {
      console.info(args);
    },
    _handleClick(item) {
      console.log("_handleClick", item);

      ipcRenderer.invoke("openPmos", item);
    },
  },
};
</script>
<style lang="scss">
.container {
  height: 100%;
  width: 100%;
}
</style>
