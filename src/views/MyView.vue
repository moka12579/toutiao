<template>
  <div class="view">
    <MyNavBar/>
    <MyBanner/>
    <MyMenu/>
    <MyIdea/>
    <MyMore/>
    <TabBar :active="2"/>
  </div>
</template>

<script>
import TabBar from "@/components/TabBar";
import MyNavBar from "@/components/my/MyNavBar";
import {Icon} from "vant";
import MyBanner from "@/components/my/MyBanner";
import MyMenu from "@/components/my/MyMenu";
import MyIdea from "@/components/my/MyIdea";
import MyMore from "@/components/my/MyMore";

export default {
  name: "MyView",
  components: {
    MyIdea,
    TabBar,
    MyNavBar,
    [Icon.name]:Icon,
    MyBanner,
    MyMenu,
    MyMore
  }

}
</script>

<style lang="scss" scoped>
.view{
  background: #f0f0f0;
  height: 100vh;
}
</style>