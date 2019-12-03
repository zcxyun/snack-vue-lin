<template>
  <div>
    <banner-info action="add" @edit-save="onEditSave"></banner-info>
  </div>
</template>

<script>
import BannerInfo from './BannerInfo'

export default {
  components: {
    BannerInfo,
  },
  methods: {
    onEditSave() {
      this.$router.push('/banner/list')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
