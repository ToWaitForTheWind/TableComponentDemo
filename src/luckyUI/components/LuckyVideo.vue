<template>
  <div class="lucky-video">
    <div id="dplayer"></div>
  </div>
</template>

<script>
import DPlayer from 'dplayer'
import Dashjs from 'dashjs'
import 'dplayer/dist/DPlayer.min.css'
export default {
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const dp = new DPlayer({
      container: document.getElementById('dplayer'),
      video: {
        url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
        type: 'customDash',
        customType: {
          'customDash': function (video, player) {
              dashjs.MediaPlayer().create().initialize(video, video.src, false);
          }
        }
      }
    })
  },
  methods: {}
}
</script>

<style lang="scss">
</style>
