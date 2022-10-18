<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss">
$fontColor:#e54b43;
/* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: 'iconfont';  /* Project id 3710512 */
  src: url('//at.alicdn.com/t/c/font_3710512_jsmml0nxzpd.woff2?t=1666077665720') format('woff2'),
  url('//at.alicdn.com/t/c/font_3710512_jsmml0nxzpd.woff?t=1666077665720') format('woff'),
  url('//at.alicdn.com/t/c/font_3710512_jsmml0nxzpd.ttf?t=1666077665720') format('truetype');
}
.iconfont{
  font-family:"iconfont" !important;
  font-size:16px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;}
</style>
