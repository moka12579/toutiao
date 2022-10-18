<template>
  <div>
    <PublishArticle/>
    <TabBar :active="1"/>
  </div>
</template>

<script>
import TabBar from "@/components/TabBar";
import PublishArticle from "@/components/PublishArticle";
export default {
  name: "PublishArticleView",
  components: {
    TabBar,
    PublishArticle
  }

}
</script>

<style scoped>

</style>